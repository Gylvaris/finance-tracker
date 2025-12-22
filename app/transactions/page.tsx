"use client";

import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../lib/formatters";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { Transaction } from "../types";

export default function ExpensesPage() {
  const {
    addTransaction,
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
    setShowSortMenu,
  } = useTransactions();

  // We accept everything EXCEPT the ID (Omit<Transaction, "id">)
  const handleAddTransaction = async (newTransaction: Omit<Transaction, "id">) => {
    await addTransaction(newTransaction);
  };

  // Reusable UI classes
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

      {/* Form Section */}
      <TransactionForm
        categories={categories}
        onAddCategory={addCategory}
        onAddTransaction={handleAddTransaction}
      />

      <h1 className="text-4xl text-amber-500 font-bold mb-8">Expenses</h1>

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
