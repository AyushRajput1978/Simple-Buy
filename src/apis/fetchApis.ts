import type { DetailedProduct, QueryKey, User } from 'type';

import axios from '../axios';

interface UserResponse {
  data: { data: User };
  status: string;
}
interface ProductResponse {
  data: { data: DetailedProduct; status: string };
  status: number;
}

export const fetchUserDetails = async (authToken: string): Promise<User> => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const res = await axios.get<UserResponse>(`/user/me`, config);
  return res.data.data;
};

export const fetchProduct = async ({ queryKey }: QueryKey): Promise<DetailedProduct> => {
  const [_, id] = queryKey;
  const res = await axios.get<ProductResponse>(`/products/${id}`);
  return res.data.data;
};
