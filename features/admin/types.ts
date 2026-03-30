
import { UserRole } from '../shared/types';

export interface AdminUser {
    id: number;
    name: string;
    avatarUrl: string;
    email: string;
    role: UserRole;
    tenantId: string;
    lastLogin: string;
    status: 'Active' | 'Inactive';
}

export interface ImpersonatedUser {
    name: string;
    role: UserRole;
}
