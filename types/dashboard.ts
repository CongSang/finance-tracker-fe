export interface DashboardSummary {
  totalBalance: number
  totalIncome: number
  totalExpense: number
  balanceChangePercent: number
  healthStatus: string
}

export interface SpendingCategory {
  categoryName: string
  categoryIcon: string
  amount: number
  percentage: number
}

export interface CashFlowTrend {
  date: string
  income: number
  expense: number
}