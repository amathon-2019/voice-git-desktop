import { User } from '../../../core/user';
import { API_URL } from '../../core/api';
import { httpClient } from '../../core/http';

export async function postUserLogin(user: User) {
  await httpClient.post(`${API_URL}/user/login`, user);
}
