import { User } from '../../../core/user';
import { API_URL } from '../../core/api';
import { httpClient } from '../../core/http';

export async function postUserLogin(user: User) {
  const { data } = await httpClient.post<{ response: { userSeq: number } }>(`${API_URL}/user/login`, user);
  return data.response.userSeq;
}
