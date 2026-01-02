"use client";

import { useTransactions } from "../hooks/useTransactions";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { TransactionInsert } from "../types";

export default function ExpensesPage() {
  const {
    addTransaction,
    sortedTransactions,
    selectedMonth,
    categories,
    addCategory,
    setSelectedMonth,
    handleDelete,
    editTransaction,
    setSortBy,
    showSortMenu,
    setShowSortMenu,
  } = useTransactions();

  const handleAddTransaction = async (newTransaction: TransactionInsert) => {
    await addTransaction(newTransaction);
  };

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
