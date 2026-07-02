export interface TransactionType {
  id: number;
  account_id: number;
  account: string;
  amount: number;
  budget_category_id: number;
  budget_category: string;
  date: string;
  notes: string;
}