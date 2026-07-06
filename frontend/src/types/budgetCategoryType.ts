export interface BudgetCategoryType {
  id: number;
  budget_id: number;
  budget_name: number;
  category_name: string;
  amount: number;
  type: "income" | "expense";
  sort_order: number;
}