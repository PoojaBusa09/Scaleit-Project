import { mockDataService } from '../../../services/mockDataService.ts';

/**
 * Hook to access the current authenticated user.
 * Currently returns a mock user.
 */
export const useAuth = () => {
    const users = mockDataService.getUsers();
    // Default to the first user (usually SC/CEO) or a specific one for testing
    const user = users.find(u => u.role === 'SC') || users[0];

    return {
        user,
        isAuthenticated: !!user,
        tenantId: user?.tenantId,
        logout: () => console.log('Mock logout')
    };
};
