import { UserContext, UserRole, MembershipProgram } from '../types';

// Mock users for all 8 roles
export const MOCK_USERS: Record<UserRole, UserContext> = {
    EC: {
        id: 1,
        name: 'James Mitchell',
        email: 'james.mitchell@company.com',
        role: 'EC',
        membershipProgram: 'Elevate',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=JM&backgroundColor=0C2340&textColor=ffffff'
    },
    SC: {
        id: 2,
        name: 'Sarah Pearson',
        email: 'sarah.pearson@company.com',
        role: 'SC',
        membershipProgram: 'Scale',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SP&backgroundColor=0C2340&textColor=ffffff',
        teamId: 1
    },
    STM: {
        id: 3,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        role: 'STM',
        membershipProgram: 'Scale',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=MC&backgroundColor=0C2340&textColor=ffffff',
        teamId: 1
    },
    M: {
        id: 4,
        name: 'Lisa Hartwell',
        email: 'lisa.hartwell@pgn.com',
        role: 'M',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=LH&backgroundColor=C89720&textColor=ffffff'
    },
    MM: {
        id: 5,
        name: 'David Ramirez',
        email: 'david.ramirez@pgn.com',
        role: 'MM',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DR&backgroundColor=C89720&textColor=ffffff',
        podId: 1
    },
    ST: {
        id: 6,
        name: 'Emma Whitfield',
        email: 'emma.whitfield@pgn.com',
        role: 'ST',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=EW&backgroundColor=1a3a5c&textColor=ffffff'
    },
    AM: {
        id: 7,
        name: 'Robert Kingsley',
        email: 'robert.kingsley@pgn.com',
        role: 'AM',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=RK&backgroundColor=1a3a5c&textColor=ffffff',
        contentStudioAccess: true // This AM user has Content Studio access (CSA "hat")
    },
    SA: {
        id: 8,
        name: 'Jennifer Blackwood',
        email: 'jennifer.blackwood@pgn.com',
        role: 'SA',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=JB&backgroundColor=1a3a5c&textColor=ffffff'
    }
};

// Mock authentication
let currentUser: UserContext | null = null;

export function login(role: UserRole): UserContext {
    currentUser = MOCK_USERS[role];
    return currentUser;
}

export function logout(): void {
    currentUser = null;
}

export function getCurrentUser(): UserContext | null {
    return currentUser;
}

export function updateUserProgram(program: MembershipProgram): void {
    if (currentUser && ['EC', 'SC', 'STM'].includes(currentUser.role)) {
        currentUser = { ...currentUser, membershipProgram: program };
    }
}
