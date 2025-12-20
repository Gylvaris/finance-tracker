"use client";

import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";

export default function ExpensesPage() {
    const {
    transactions, 
    setTransactions,
    sortedTransactions, // Renamed
    selectedMonth,
    categories,
    addCategory,
    setSelectedMonth,
    categoryTotals,
    monthlyTotal,
    handleDelete, 
    editTransaction, // Renamed
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
        type, // <--- THE FIX: We hardcode this for now!
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
  <div className="flex gap-4 mb-6 bg-neutral-900 p-1 rounded-lg border border-neutral-800 inline-flex">
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
        <p className="text-3xl font-bold">{monthlyTotal.toLocaleString("pl-PL")} zł</p>
      </section>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.entries(categoryTotals)
    .sort() 
    .map(([cat, amount]) => (
          <div key={cat} className={`${cardClass} flex justify-between`}>
            <span className="text-gray-400">{cat}</span>
            <span className="font-bold">{amount.toLocaleString("pl-PL")} zł</span>
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
      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet.</p>
      ) : (
        <ul className="space-y-3">
          {sortedTransactions.map((exp) => (
            <li key={exp.id} className={`${cardClass} flex justify-between items-center`}>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-lg">{exp.title}</span>
                
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{new Date(exp.date).toLocaleDateString('pl-PL')}</span>
                  <span>•</span> {/* A little visual separator */}
                  <span>{exp.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <strong className={`text-lg ${exp.type === "income" ? "text-green-500" : "text-white"}`}>
  {exp.type === "income" ? "+" : "-"}{exp.amount} zł
</strong>
                <button
                  onClick={() => {
                    const newTitle = prompt("Enter new title", exp.title);
                    const newAmount = prompt("Enter new amount", exp.amount.toString());
                    const newCategory = prompt("Enter new category", exp.category);
                    const newDate = prompt("Enter new date", exp.date);

                    if (newTitle && newAmount && newCategory && newDate) {

                      const parsedNewAmount = parseFloat(newAmount);

                      if (isNaN(parsedNewAmount) || parsedNewAmount <= 0 ) {
                        alert("Please enter a valid number")
                        return;
                      }

                      editTransaction(exp.id, {
                        title: newTitle,
                        amount: parsedNewAmount,
                        category: newCategory,
                        date: newDate,
                      });
                    }
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}