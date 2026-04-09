import { axiosClient } from "@/lib/index";
import { BudgetFilter } from "@/types/index";

export const getSummaryApi = async () => {
  const response = await axiosClient.get('/dashboard/summary');
  return response.data;
};

export const getSpendingStructureApi = async (filter: BudgetFilter) => {
  const response = await axiosClient.post('/dashboard/spending-structure', filter);
  return response.data;
};

export const getCashFlowTrendApi = async (filter: BudgetFilter) => {
  const response = await axiosClient.post(`/dashboard/cash-flow-trend`, filter);
  return response.data;
};

export const getWalletsMiniApi = async () => {
  const response = await axiosClient.get(`/dashboard/wallets-mini`);
  return response.data;
};