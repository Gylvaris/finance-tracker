"use client";

import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../lib/formatters";
import ExpenseChart from "../components/ExpenseChart";

export default function Dashboard() {
  const { transactions, categoryTotals } = useTransactions();
  const totalIncome = transactions.reduce((sum, t) => {
    if (t.type === "income") {
      return sum + t.amount;
    }
    return sum;
  }, 0);

  const totalExpenses = transactions.reduce((sum, t) => {
    if (t.type === "expense") {
      return sum + t.amount;
    }
    return sum;
  }, 0);

  const balance = totalIncome - totalExpenses;

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  return (
    <main className="p-8 max-w-4xl mx-auto font-sans text-white">
      <h1 className="text-4xl text-amber-500 font-bold mb-8">Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
          <h2 className="text-sm text-gray-400 font-medium mb-2">Total Income</h2>
          <p className="text-3xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
        </div>

        {/* Expense Card */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
          <h2 className="text-sm text-gray-400 font-medium mb-2">Total Expenses</h2>
          <p className="text-3xl font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
        </div>

        {/* Balance Card */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
          <h2 className="text-sm text-gray-400 font-medium mb-2">Current Balance</h2>
          <p className={`text-3xl font-bold ${balance >= 0 ? "text-white" : "text-red-500"}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <section className="mt-8 p-8 rounded-xl bg-neutral-900 border border-neutral-800">
        <h2 className="text-xl font-bold mb-6">Expense Breakdown</h2>
        <ExpenseChart data={chartData} />
      </section>
    </main>
  );
}
