export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(amount);
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("pl-PL").format(date);
}