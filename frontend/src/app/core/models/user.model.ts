export type Role = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  role: Role;
  isActive?: boolean;
  createdAt?: string;
}
