import type { CreateTransactionRequest } from "../types/CreateTransactionRequest";

const BASE_URL = import.meta.env.VITE_API_URL;

async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });
    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const error = await res.json();
            if (error.detail) {
                message = error.detail;
            }
        } catch {}
        throw new Error(message);
    }
    return res;
}

export async function getAccounts() {
    const res = await apiFetch("/api/accounts");
    return res.json();
}

export async function getTransactions() {
    const res = await apiFetch("/api/transactions");
    return res.json();
}

export async function getBudgets() {
    const res = await apiFetch("/api/budgets");
    return res.json();
}

export async function getBudgetCategories() {
    const res = await apiFetch("/api/budgetCategories");
    return res.json();
}

export async function getCurrentUser() {
    const res = await apiFetch("/api/me");
    return res.json();
}

export async function logout() {
    await apiFetch("/api/logout", {method: "POST"});
}

export async function createTransaction(transaction: CreateTransactionRequest) {
    const res = await apiFetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
    });
    return res.json();
}