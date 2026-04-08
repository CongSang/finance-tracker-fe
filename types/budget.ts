import { Category } from "@/types/index"

export interface Budget {
  id: number 
  amountLimit: number 
  month: number 
  year: number
  category: Category 
}

export interface BudgetAnalysis {
  budgetId: number
  budget: Budget
  limitAmount: number
  actualSpent: number
  remainingAmount: number
  percentUsed: number
  status: "GOOD" | "WARNING" | "DANGER"
  isFastSpending: boolean
  projectedExceedDay: number
  suggestedDailyLimit: number
  adviceMessage: string
}

export interface BudgetFilter {
  month: number
  year: number
}

export interface BudgetRequest {
  id: number | null
  categoryId: number | null
  amountLimit: number | null
  month: number | null
  year: number | null
}

export interface BudgetCopyRequest {
  fromMonth: number
  fromYear: number
  toMonth: number
  toYear: number
}