import { useState } from "react";
import { Tables } from "../types/supabase";
import { TransactionInsert } from "../types";
import { TRANSACTION_TYPES } from "../lib/constants";

type TransactionFormProps = {
  categories: Tables<"categories">[];
  onAddTransaction: (transaction: TransactionInsert) => void;
  onAddCategory: (name: string) => void;
};

export default function TransactionForm({
  categories,
  onAddCategory,
  onAddTransaction,
}: TransactionFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const inputClass =
    "w-full p-2 rounded-md border border-gray-700 bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500";

  // State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [date, setDate] = useState(today);
  const [type, setType] = useState<"income" | "expense">(TRANSACTION_TYPES.EXPENSE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !categoryId || !date) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid number");
      return;
    }

    const newTransaction: TransactionInsert = {
      title,
      amount: parsedAmount,
      category_id: Number(categoryId),
      date,
      type,
    };

    onAddTransaction(newTransaction);

    // Reset
    setTitle("");
    setAmount("");
    setCategoryId("");
    setDate(today);
  };

  return (
    <div className="mb-10">
      {/* Type Toggles */}
      <div className="gap-4 mb-6 bg-neutral-900 p-1 rounded-lg border border-neutral-800 inline-flex">
        <button
          type="button"
          onClick={() => setType(TRANSACTION_TYPES.EXPENSE)}
          className={`px-6 py-2 rounded-md font-medium transition ${
            type === TRANSACTION_TYPES.EXPENSE
              ? "bg-red-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType(TRANSACTION_TYPES.INCOME)}
          className={`px-6 py-2 rounded-md font-medium transition ${
            type === TRANSACTION_TYPES.INCOME
              ? "bg-green-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Income
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            placeholder="Enter title"
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full p-2 bg-neutral-900 text-white border border-gray-600 rounded-md appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const name = prompt("Enter new category name:");
                if (name && name.trim().length > 0) {
                  onAddCategory(name);
                }
              }}
              className="bg-gray-700 px-3 rounded text-white"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-black font-semibold rounded-md hover:bg-amber-500 transition"
        >
          Add {type === TRANSACTION_TYPES.INCOME ? "Income" : "Expense"}
        </button>
      </form>
    </div>
  );
}
