import { useState, useEffect, useMemo, useCallback } from "react";
import { Transaction } from "../types";
import { STORAGE_KEYS, DEFAULT_CATEGORIES, TRANSACTION_TYPES } from "../lib/constants";
import { supabase } from "../lib/supabase";

export function useTransactions() {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [sortBy, setSortBy] = useState("");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    const fetchTransactions = useCallback(async () => {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
        } else {
            setTransactions(data as Transaction[]);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTransactions();
    }, [fetchTransactions]);

    // Load Categories
    useEffect(() => {
        const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (savedCategories) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCategories(JSON.parse(savedCategories));
        }
        setIsLoaded(true);
    }, []);

    // Save Categories
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
        }
    }, [categories, isLoaded]);


    // --- ACTIONS ---

    const addCategory = (categoryName: string) => {
        if (categories.includes(categoryName)) {
            alert("Don't add duplicates")
            return
        }
        setCategories(prev => [...prev, categoryName])
    };

    // CREATE
    const addTransaction = async (newTransaction: Omit<Transaction, "id">) => {

        const { data, error } = await supabase
            .from('transactions')
            .insert([newTransaction])
            .select();

        if (error) {
            console.error('Error adding transaction:', error);
            alert("Failed to save!");
        } else {
            const savedTransaction = data[0] as Transaction;
            setTransactions((prev) => [savedTransaction, ...prev]);
        }
    };

    // DELETE
    const handleDelete = async (id: number) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting transaction:', error);
            alert("Failed to delete!");
            fetchTransactions();
        }
    };

    // UPDATE
    const editTransaction = async (id: number, updatedFields: Partial<Transaction>) => {
        setTransactions((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, ...updatedFields } : t
            )
        );

        const { error } = await supabase
            .from('transactions')
            .update(updatedFields)
            .eq('id', id);

        if (error) {
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
        .reduce((acc: Record<string, number>, t) => {
            const category = t.category;
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += t.amount;
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
        refreshData: fetchTransactions
    };
}