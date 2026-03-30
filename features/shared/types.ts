
/**
 * Defines all available user roles in the platform.
 * - EC: Elevate Client (Member)
 * - SC: Scale Client (CEO)
 * - STM: Scale Team Member
 * - M: Mentor
 * - MM: Mentor Manager
 * - ST: Staff
 * - AM: Admin Manager
 * - SA: Super Admin
 */
export const ALL_ROLES = [
    'EC',  // Elevate Member (CEO)
    'SC',  // Scale Member / Scale Team CEO
    'STM', // Scale Team Member
    'M',   // Mentor
    'MM',  // Mentor Manager
    'ST',  // PGN Staff (Mentor Dept)
    'AM',  // PGN Admin / Manager
    'SA'   // PGN Super Admin
] as const;

export type UserRole = typeof ALL_ROLES[number];

// Membership program types
export type MembershipProgram = 'Elevate' | 'Scale';

// Permission types
export type Permission = 'V' | 'E' | 'A' | 'V/E' | 'E/A' | 'V/E/A';

/**
 * Context object for the currently logged-in user.
 * Contains core identity and permission flags.
 */
export interface UserContext {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    /** Unique identifier for the tenant (organization) the user belongs to. */
    tenantId: string;
    /** Specific membership execution program (EC, SC, STM only). */
    membershipProgram?: MembershipProgram;
    avatarUrl: string;
    /** ID of the team this user belongs to (SC and STM). */
    teamId?: number;
    /** ID of the mentor pod this user manages (MM). */
    podId?: number;
    /** Grant access to the content studio (AM). */
    contentStudioAccess?: boolean;
}
export type ScaleITCategory = 'S' | 'C' | 'A' | 'L' | 'E' | 'I' | 'T';
export interface ScaleITTool {
    name: string;
    path: string;
}

export interface ScaleITSection {
    id: ScaleITCategory;
    name: string;
    tools: ScaleITTool[];
}

// PGN 2.0 Types
export * from './pgnTypes';
