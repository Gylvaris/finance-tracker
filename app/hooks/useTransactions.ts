import { useState, useEffect, useMemo } from "react";
import { Transaction } from "../types";
import { STORAGE_KEYS, DEFAULT_CATEGORIES, TRANSACTION_TYPES } from "../lib/constants";

export function useTransactions() {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [sortBy, setSortBy] = useState("");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Date Logic
    const currentMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    // Category Logic
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    // Load Data
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

        if (savedData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTransactions(JSON.parse(savedData));
        }

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }

        setIsLoaded(true);
    }, [])

    // Save Transactions
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        }
    }, [transactions, isLoaded])

    // Save Categories
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
        }
    }, [categories, isLoaded])

    const addCategory = (categoryName: string) => {
        if (categories.includes(categoryName)) {
            alert("Don't add duplicates")
            return
        }
        setCategories(prev => [...prev, categoryName])
    };

    const handleDelete = (id: number) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const editTransaction = (id: number, updatedTransaction: Partial<Transaction>) => {
        setTransactions((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, ...updatedTransaction } : t
            )
        );
    }

    const filteredTransactions = transactions.filter(t => {
        return t.date && t.date.startsWith(selectedMonth);
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        switch (sortBy) {
            case "amount-asc": return a.amount - b.amount;
            case "amount-desc": return b.amount - a.amount;
            case "title-asc": return a.title.localeCompare(b.title);
            case "title-desc": return b.title.localeCompare(a.title);
            default: return 0;
        }
    });

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

    // Calculate All-Time Stats
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

    return {
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
    };
}