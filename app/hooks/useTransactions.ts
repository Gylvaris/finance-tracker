import { useState, useEffect, useMemo, useCallback } from "react";
import { Transaction } from "../types";
import { STORAGE_KEYS, TRANSACTION_TYPES } from "../lib/constants";
import { Tables } from "../types/supabase";
import { TransactionInsert } from "../types";

type TransactionWithCategory = Tables<'transactions'> & {
    categories: { name: string } | null;
};

export function useTransactions() {
    // State
    const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
    const [sortBy, setSortBy] = useState("");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);

    const fetchTransactions = useCallback(async () => {
        setIsLoaded(false);

        try {
            const response = await fetch('/api/transactions');

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch');
            }

            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            if (!response.ok) return;

            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);


    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, [fetchTransactions, fetchCategories]);

    // Save Categories
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
        }
    }, [categories, isLoaded]);


    // --- ACTIONS ---

    const addCategory = async (categoryName: string) => {
        if (categories.some(c => c.name === categoryName)) {
            alert("Don't add duplicates");
            return;
        }

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert("Failed to save category!");
            fetchCategories();
        }
    };

    const addTransaction = async (newTransaction: TransactionInsert) => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransaction),
            });;

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add transaction');
            }

            const savedTransaction = data[0] as Transaction;
            setTransactions((prev) => [savedTransaction, ...prev]);

        } catch (error) {
            console.error('Error adding transaction:', error);
            alert("Failed to save!");
        }
    };

    const handleDelete = async (id: number) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));

        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert("Failed to delete!");
            fetchTransactions();
        }
    };

    const editTransaction = async (id: number, updatedFields: Partial<Transaction>) => {
        setTransactions((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, ...updatedFields } : t
            )
        );

        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update');
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert("Failed to update!");
            fetchTransactions();
        }
    };

    // --- CALCULATIONS ---

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => t.date && t.date.startsWith(selectedMonth));
    }, [transactions, selectedMonth]);

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            switch (sortBy) {
                case "amount-asc": return a.amount - b.amount;
                case "amount-desc": return b.amount - a.amount;
                case "title-asc": return a.title.localeCompare(b.title);
                case "title-desc": return b.title.localeCompare(a.title);
                default: return 0;
            }
        });
    }, [filteredTransactions, sortBy]);

    // Stats Logic
    const stats = useMemo(() => {
        return transactions.reduce(
            (acc, t) => {
                if (t.type === TRANSACTION_TYPES.INCOME) {
                    acc.income += t.amount;
                } else {
                    acc.expense += t.amount;
                }
                return acc;
            },
            { income: 0, expense: 0 }
        );
    }, [transactions]);

    const balance = stats.income - stats.expense;

    const categoryTotals = filteredTransactions
        .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
        .reduce((acc: Record<string, number>, t: Transaction) => {
            const categoryName = t.categories?.name || "Uncategorized";

            if (!acc[categoryName]) acc[categoryName] = 0;
            acc[categoryName] += t.amount;
            return acc;
        }, {});

    const monthlyTotal = filteredTransactions.reduce((sum, t) => {
        if (t.type === TRANSACTION_TYPES.INCOME) {
            return sum + t.amount;
        } else {
            return sum - t.amount;
        }
    }, 0);

    return {
        addTransaction,
        transactions,
        setTransactions,
        sortedTransactions,
        categoryTotals,
        monthlyTotal,
        selectedMonth,
        setSelectedMonth,
        categories,
        addCategory,
        handleDelete,
        editTransaction,
        sortBy,
        setSortBy,
        showSortMenu,
        setShowSortMenu,
        stats,
        balance,
        refreshData: fetchTransactions,
        isLoading: !isLoaded,
    };
}