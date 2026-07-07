export interface CreateTransactionRequest {
    account_id: number;
    amount: number;
    budget_category_id: number;
    date: string;
    notes: string;
}