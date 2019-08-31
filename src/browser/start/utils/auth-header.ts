export function makeBasicAuthHeader(username: string, password: string): string {
  let auth: any = Buffer.from(`${username}:${password}`);

  auth = (<Buffer>auth).toString('base64');

  return `Basic ${auth}`;
}


export function makeOauth2TokenAuthHeader(token: string): string {
  return `token ${token}`;
}
