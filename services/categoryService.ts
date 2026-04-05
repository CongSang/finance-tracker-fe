import { axiosClient } from "@/lib/index";
import { Category } from "@/types/index";

export const getCategoriesApi = async () => {
  const response = await axiosClient.get('/categories');
  return response.data;
};

export const createCategoryApi = async (request: Category) => {
  const response = await axiosClient.post('/categories/create', request);
  return response.data;
};

export const updateCategoryApi = async (id: number, request: Category) => {
  const response = await axiosClient.put(`/categories/${id}`, request);
  return response.data;
};

export const deleteCategoryApi = async (id: number) => {
  const response = await axiosClient.delete(`/categories/${id}`);
  return response.data;
};