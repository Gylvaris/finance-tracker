export type Transaction = {
    id: number;
    title: string;
    amount: number;
    category: string;
    date: string;
    type: "income" | "expense";
};