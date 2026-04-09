import { axiosClient } from "@/lib/index";
import { PageRequest, TransactionFilter, TransactionRequest } from "@/types/index";

export const getTransactionsApi = async (request: PageRequest, params: TransactionFilter) => {
  const response = await axiosClient.post('/transactions', request, { params });
  return response.data;
};

export const getTransactionDetailsApi = async (id: number) => {
  const response = await axiosClient.get(`/transactions/${id}`);
  return response.data;
};

export const createTransactionApi = async (request: TransactionRequest) => {
  const response = await axiosClient.post('/transactions/create', request);
  return response.data;
};

export const updateTransactionApi = async (id: number, request: TransactionRequest) => {
  const response = await axiosClient.put(`/transactions/${id}`, request);
  return response.data;
};

export const deleteTransactionApi = async (id: number) => {
  const response = await axiosClient.delete(`/transactions/${id}`);
  return response.data;
};

export const scanInvoiceApi = async (file: FormData) => {
  const response = await axiosClient.post(`/transactions/scan`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  return response.data;
};