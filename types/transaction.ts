import { Category, Wallet } from "@/types/index"

export interface Transaction {
  id: number
  amount: number
  note: string
  transactionDate: Date
  transferId: number
  wallet: Wallet
  category: Category
  warning: string
}

export interface TransactionRequest {
  id: number | null
  amount: number | null
  note: string
  transactionDate: Date | string | null
  walletId: number | null
  categoryId: number | null
}

export interface TransactionFilter {
  fromDate: Date | null
  toDate: Date | null
  note: string
  walletId: number | null
  categoryId: number | null
}

