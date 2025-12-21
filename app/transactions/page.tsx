"use client";

import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../lib/formatters";
import TransactionList from "../components/TransactionList";

export default function ExpensesPage() {
    const {
    setTransactions,
    sortedTransactions,
    selectedMonth,
    categories,
    addCategory,
    setSelectedMonth,
    categoryTotals,
    monthlyTotal,
    handleDelete, 
    editTransaction,
    setSortBy, 
    showSortMenu, 
    setShowSortMenu 
  } = useTransactions();

  const today = new Date().toISOString().split('T')[0];

  // State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [type, setType] = useState<"income" | "expense">("expense");


  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;

    const parsedAmount = parseFloat(amount)
    if ( isNaN(parsedAmount) || parsedAmount <= 0 ) {
      alert("Please enter a valid number")
      return
    }

    setTransactions((prev) => [
      {
        id: Date.now(),
        title,
        amount: parsedAmount,
        category,
        date,
        type,
      },
      ...prev,
    ]);

    setTitle("");
    setAmount("");
    setCategory("");
    setDate(today);
  };

  // Reusable UI classes
  const inputClass =
    "w-full p-2 rounded-md border border-gray-700 bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500";

  const cardClass = "bg-neutral-900 border border-neutral-700 p-4 rounded-md";

  return (
    <main className="p-8 max-w-xl mx-auto font-sans text-white">

      <div className="flex justify-end mb-4">
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-neutral-900 text-white border border-gray-700 rounded p-2 text-sm"
        />
      </div>

      <h1 className="text-4xl text-amber-500 font-bold mb-8">Expenses</h1>

      {/* Type Toggles */}
  <div className="gap-4 mb-6 bg-neutral-900 p-1 rounded-lg border border-neutral-800 inline-flex">
    <button
      onClick={() => setType("expense")}
      className={`px-6 py-2 rounded-md font-medium transition ${
        type === "expense"
          ? "bg-red-600 text-white shadow-lg"
          : "text-gray-400 hover:text-white"
      }`}
    >
      Expense
    </button>
    <button
      onClick={() => setType("income")}
      className={`px-6 py-2 rounded-md font-medium transition ${
        type === "income"
          ? "bg-green-600 text-white shadow-lg"
          : "text-gray-400 hover:text-white"
      }`}
    >
      Income
    </button>
  </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-10">
        <div>
          <label className="block mb-1 text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            placeholder="Enter expense name"
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Amount (zł)</label>
          <input
            type="text"
            value={amount}
            placeholder="0 zł"
            onChange={(e) => setAmount(e.target.value.replace(",", "."))}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Category</label>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-neutral-900 text-white border border-gray-600 rounded-md appearance-none"
            >
            <option value="">Select a category</option>
            {categories.map((cat) => (
            <option key={cat} value={cat}>
            {cat}
            </option>
            ))}
            </select>
            <button
            onClick={(e) => {
              e.preventDefault();
              const name = prompt("Enter new category name:");
  
              if (name && name.trim().length > 0) {
              addCategory(name);
              setCategory(name);
              }
            }} 
            className="bg-gray-700 px-3 rounded"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-black font-semibold rounded-md hover:bg-amber-500 transition"
        >
          Add Expense
        </button>
      </form>

      {/* Total */}
      <section className={`${cardClass} mb-8`}>
        <h2 className="text-lg font-semibold mb-1">Total Expenses</h2>
        <p className="text-3xl font-bold">{formatCurrency(monthlyTotal)}</p>
      </section>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.entries(categoryTotals)
    .sort() 
    .map(([cat, amount]) => (
          <div key={cat} className={`${cardClass} flex justify-between`}>
            <span className="text-gray-400">{cat}</span>
            <span className="font-bold">{formatCurrency(amount)}</span>
          </div>
        ))}
      </div>

      {/* Header + Sort */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Expense List</h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSortMenu((prev) => !prev)}
            className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-500 transition"
          >
            Sort ⇅
          </button>

          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-black border rounded-md shadow-lg text-sm">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-neutral-800"
                onClick={() => {
                  setSortBy("amount-asc");
                  setShowSortMenu(false);
                }}
              >
                Amount: Low → High
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-neutral-800"
                onClick={() => {
                  setSortBy("amount-desc");
                  setShowSortMenu(false);
                }}
              >
                Amount: High → Low
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-neutral-800"
                onClick={() => {
                  setSortBy("title-asc");
                  setShowSortMenu(false);
                }}
              >
                Title: A → Z
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-neutral-800"
                onClick={() => {
                  setSortBy("title-desc");
                  setShowSortMenu(false);
                }}
              >
                Title: Z → A
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction List */}
  {sortedTransactions.length === 0 ? (
    <p className="text-gray-400">No transactions yet.</p>
  ) : (
    <TransactionList 
      transactions={sortedTransactions}
      onDelete={handleDelete}
      onEdit={editTransaction}
    />
  )}
    </main>
  );
}