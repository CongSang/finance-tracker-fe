import { TransactionType } from "@/lib/index";

export interface Category {
  id?: number;
  name: string;
  type: TransactionType;
  iconUrl: string;
}