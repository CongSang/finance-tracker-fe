import { axiosClient } from "@/lib/index";
import { PageRequest, Wallet } from "@/types/index";

export const getWalletsApi = async (request: PageRequest) => {
  const response = await axiosClient.post('/wallets', request);
  return response.data;
};

export const getWalletDetailsApi = async (id: number) => {
  const response = await axiosClient.get(`/wallets/${id}`);
  return response.data;
};

export const createWalletApi = async (request: Wallet) => {
  const response = await axiosClient.post('/wallets/create', request);
  return response.data;
};

export const updateWalletApi = async (id: number, request: Wallet) => {
  const response = await axiosClient.put(`/wallets/${id}`, request);
  return response.data;
};

export const deleteWalletApi = async (id: number) => {
  const response = await axiosClient.delete(`/wallets/${id}`);
  return response.data;
};