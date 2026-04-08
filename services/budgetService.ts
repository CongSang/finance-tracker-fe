import { axiosClient } from "@/lib/index";
import { BudgetCopyRequest, BudgetFilter, BudgetRequest } from "@/types/index";

export const getBudgetProgressApi = async (request: BudgetFilter) => {
  const response = await axiosClient.post('/budgets/progress', request);
  return response.data;
};

export const upsertBudgetApi = async (request: BudgetRequest) => {
  const response = await axiosClient.post('/budgets', request);
  return response.data;
};

export const copyBudgetApi = async (request: BudgetCopyRequest) => {
  const response = await axiosClient.post(`/budgets/copy`, request);
  return response.data;
};

export const deleteBudgetApi = async (id: number) => {
  const response = await axiosClient.delete(`/budgets/${id}`);
  return response.data;
};

export const getBudgetHistoryApi = async () => {
  const response = await axiosClient.get('/budgets/history');
  return response.data;
};