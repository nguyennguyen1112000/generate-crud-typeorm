export interface AuthBaseService<T> {
  login(inputDto: any): Promise<{ access_token: string }>;
  profile(user: any): Promise<any>;
  createUser(createAuthDto: any): Promise<T>;
}

