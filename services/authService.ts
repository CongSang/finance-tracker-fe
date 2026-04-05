import { authClient, axiosClient } from '@/lib/axios';
import { UserRequest } from '../types';
import { AuthRequest } from '@/types/auth';
import axios from 'axios';

export const loginApi = async (request: AuthRequest) => {
  const response = await axiosClient.post('/auth/login', request);
  return response.data;
};

export const registerApi = async (request: UserRequest) => {
  const response = await axiosClient.post('auth/register', request);
  return response.data;
};

export const accountInfoApi = async () => {
  const response = await axiosClient.get('/auth/account-info');
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string | undefined) => {
  const response = await authClient.post(`/auth/refresh?refreshToken=${refreshToken}`);
  return response.data;
};

export const logoutApi = async () => {
  const response = await axiosClient.post(`/auth/logout`);
  return response.data;
};

export const uploadImageApi = async (formData: FormData) => {
  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/dkzk9w83t/image/upload`, formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  return response.data;
}
