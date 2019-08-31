import { httpClient } from '../../core/http';
import { User } from '../../core/models';
import { makeBasicAuthHeader, makeOauth2TokenAuthHeader } from '../utils/auth-header';

interface GithubUserResponse {
  avatar_url?: string;
  html_url: string;
  login: string;
  name: string;
  email: string | null;
}

const API_URL = 'https://api.github.com';
const AUTH_API_URL = `${API_URL}/user`;

export async function authorizeByBasic(username: string, password: string, otp?: string) {
  const headers = {
    Authorization: makeBasicAuthHeader(username, password),
    Accept: 'application/vnd.github.v3+json',
  };

  if (otp) {
    headers['X-GitHub-OTP'] = otp;
  }

  const { data } = await httpClient.get<GithubUserResponse>(AUTH_API_URL, { headers });
  const user: User = {
    email: data.email,
    username: data.login,
    displayName: data.name,
    avatarImageUrl: data.avatar_url,
    profileUrl: data.html_url,
  };

  return user;
}

export async function authorizeByOAuth2Token(token: string) {
  const { data } = await httpClient.get<GithubUserResponse>(AUTH_API_URL, {
    headers: {
      Authorization: makeOauth2TokenAuthHeader(token),
      Accept: 'application/vnd.github.v3+json',
    },
  });

  const user: User = {
    email: data.email,
    username: data.login,
    displayName: data.name,
    avatarImageUrl: data.avatar_url,
    profileUrl: data.html_url,
  };

  return user;
}
