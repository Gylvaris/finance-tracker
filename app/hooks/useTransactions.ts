// hooks/useTransactions.ts
import { useState, useEffect } from "react";
import { Transaction } from "../types";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Entertainment", "Bills"];

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

    // 1. Load Data
    useEffect(() => {
        const savedData = localStorage.getItem("my-transactions");
        const savedCategories = localStorage.getItem("my-categories");

        if (savedData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTransactions(JSON.parse(savedData));
        }

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }

        setIsLoaded(true);
    }, [])

    // 2. Save Transactions
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("my-transactions", JSON.stringify(transactions));
        }
    }, [transactions, isLoaded])

    // 3. Save Categories
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("my-categories", JSON.stringify(categories))
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
        .filter(t => t.type === "expense")
        .reduce((acc: Record<string, number>, t) => {
            const category = t.category;
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += t.amount;
            return acc;
        }, {});

    const monthlyTotal = filteredTransactions.reduce((sum, t) => {
        if (t.type === "income") {
            return sum + t.amount;
        } else {
            return sum - t.amount;
        }
    }, 0);

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
        setShowSortMenu
    };
}