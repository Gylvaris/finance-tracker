// hooks/useExpenses.ts
import { useState, useEffect } from "react";
import { Expense } from "../types";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Entertainment", "Bills"];

export function useExpenses() {
    // State
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [sortBy, setSortBy] = useState("");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    useEffect(() => {
        const savedData = localStorage.getItem("my-expenses");
        const savedCategories = localStorage.getItem("my-categories");

        if (savedData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setExpenses(JSON.parse(savedData));
        }

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }

        setIsLoaded(true);
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("my-expenses", JSON.stringify(expenses));
        }
    }, [expenses, isLoaded])

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
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    };

    const editExpense = (id: number, updatedExpense: Partial<Expense>) => {
        setExpenses((prev) =>
            prev.map((exp) =>
                exp.id === id ? { ...exp, ...updatedExpense } : exp
            )
        );
    }

    const filteredExpenses = expenses.filter(exp => {
        // Safety check: Does date exist? AND Does it match?
        return exp.date && exp.date.startsWith(selectedMonth);
    });

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        switch (sortBy) {
            case "amount-asc": return a.amount - b.amount;
            case "amount-desc": return b.amount - a.amount;
            case "title-asc": return a.title.localeCompare(b.title);
            case "title-desc": return b.title.localeCompare(a.title);
            default: return 0;
        }
    });

    const categoryTotals = filteredExpenses.reduce((acc: Record<string, number>, expense) => {
        const category = expense.category;

        // If we haven't seen this category before, start it at 0
        if (!acc[category]) {
            acc[category] = 0;
        }

        // Add the current expense amount to the total
        acc[category] += expense.amount;

        return acc;
    }, {});

    const monthlyTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 4. Return the things the UI needs
    return {
        expenses,
        addCategory,
        sortedExpenses,
        categoryTotals,
        monthlyTotal,
        selectedMonth,
        categories,
        setSelectedMonth,
        setExpenses,
        handleDelete,
        editExpense,

        sortBy,
        setSortBy,
        showSortMenu,
        setShowSortMenu
    };
}