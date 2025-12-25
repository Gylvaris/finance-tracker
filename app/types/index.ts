import { Tables } from "./supabase";

export type Transaction = Tables<'transactions'> & {
    categories: { name: string } | null;
};

export type TransactionInsert = {
    title: string;
    amount: number;
    category_id: number;
    date: string;
    type: "income" | "expense";
    user_id?: string;
};