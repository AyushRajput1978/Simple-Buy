import type { User } from 'type';

import axios from '../axios';

interface UserResponse {
  data: { data: User };
  status: string;
}

export const fetchUserDetails = async (authToken: string): Promise<User> => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const res = await axios.get<UserResponse>(`/user/me`, config);
  return res.data.data;
};
