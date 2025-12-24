"use client";

import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../lib/formatters";
import ExpenseChart from "../components/ExpenseChart";
import Skeleton from "../components/Skeleton";

export default function Dashboard() {
  const { stats, balance, isLoading, categoryTotals } = useTransactions();

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
          <div className="text-3xl font-bold text-green-500">
            {isLoading ? <Skeleton className="h-9 w-32" /> : formatCurrency(stats.income)}
          </div>
        </div>

        {/* Expense Card */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
          <h2 className="text-sm text-gray-400 font-medium mb-2">Total Expenses</h2>
          <div className="text-3xl font-bold text-red-500">
            {isLoading ? <Skeleton className="h-9 w-32" /> : formatCurrency(stats.expense)}
          </div>
        </div>

        {/* Balance Card */}
        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
          <h2 className="text-sm text-gray-400 font-medium mb-2">Current Balance</h2>
          <div className={`text-3xl font-bold ${balance >= 0 ? "text-white" : "text-red-500"}`}>
            {isLoading ? <Skeleton className="h-9 w-32" /> : formatCurrency(balance)}
          </div>
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
