import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge"
import { uploadImageApi } from "@/services/index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toastSuccess = (message: string) => {
  toast.success(message);
}

export const toastError = (error: unknown, errorMsg: string) => {
  let errorMessage = errorMsg;
  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || errorMsg;
  }
  toast.error(errorMessage);
}

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'FinanceTracker');

  try {
    const response = await uploadImageApi(formData);
    return response.secure_url;
  } catch (error) {
    console.error("Upload failed", error);
  }
};

// Xóa tất cả ký tự không phải số (ví dụ: "1,200.50" -> "1200.50")
export const cleanAmount = (val: string) => val.replace(/,/g, "");

// Thêm dấu phẩy ngăn cách hàng nghìn
export const formatDisplay = (val: string) => {
  if (!val) return "";
  const parts = val.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};