const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAccounts() {
    const res = await fetch(`${BASE_URL}/api/accounts`);
    if (!res.ok) throw new Error("Failed to fetch accounts");
    return res.json();
}

export async function getTransactions() {
    const res = await fetch(`${BASE_URL}/api/transactions`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
}

export async function getBudgets() {
    const res = await fetch(`${BASE_URL}/api/budgets`);
    if (!res.ok) throw new Error("Failed to fetch budgets");
    return res.json();
}