import { Transaction } from "../types";
import { formatCurrency, formatDate } from "../lib/formatters";

type TransactionListProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (id: number, updates: Partial<Transaction>) => void;
};

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const cardClass = "bg-neutral-900 border border-neutral-700 p-4 rounded-md";

  return (
    <ul className="space-y-3">
      {transactions.map((exp) => (
        <li key={exp.id} className={`${cardClass} flex justify-between items-center`}>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-lg">{exp.title}</span>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{formatDate(exp.date)}</span>
              <span>•</span>
              <span>{exp.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <strong
              className={`text-lg ${exp.type === "income" ? "text-green-500" : "text-red-500"}`}
            >
              {exp.type === "income" ? "+" : "-"}
              {formatCurrency(exp.amount)}
            </strong>

            <button
              onClick={() => {
                const newTitle = prompt("Enter new title", exp.title);
                const newAmount = prompt("Enter new amount", exp.amount.toString());
                const newCategory = prompt("Enter new category", exp.category);
                const newDate = prompt("Enter new date", exp.date);

                if (newTitle && newAmount && newCategory && newDate) {
                  const parsedNewAmount = parseFloat(newAmount);

                  if (isNaN(parsedNewAmount) || parsedNewAmount <= 0) {
                    alert("Please enter a valid number");
                    return;
                  }

                  onEdit(exp.id, {
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
              onClick={() => onDelete(exp.id)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-500 transition"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
