import { UserRole, Permission, UserContext } from '../types';

// Permission matrix based on PRD Page 1
type FeatureName = 
    | 'account_profile'
    | 'onboarding_assessments'
    | 'coaching_sessions'
    | 'action_plan_tasks'
    | 'wins_timeline'
    | 'ai_tools'
    | 'messaging_community'
    | 'resource_library'
    | 'support_tickets'
    | 'team_management'
    | 'activity_crm'
    | 'reports_member'
    | 'reports_program'
    | 'marketing_campaigns'
    | 'people_access'
    | 'billing_finance'
    | 'content_studio'
    | 'integrations_settings';

const PERMISSION_MATRIX: Record<FeatureName, Record<UserRole, Permission | '-'>> = {
    account_profile: { EC: 'E', SC: 'E', STM: 'E', M: 'E', MM: 'E', ST: 'E', AM: 'E/A', SA: 'E/A' },
    onboarding_assessments: { EC: 'E', SC: 'E', STM: 'E', M: 'V', MM: 'V', ST: 'V', AM: 'V/E', SA: 'V/E' },
    coaching_sessions: { EC: 'V/E', SC: 'V/E', STM: 'V/E', M: 'V/E', MM: 'V', ST: 'V/E', AM: 'V/E', SA: 'V/E/A' },
    action_plan_tasks: { EC: 'V/E', SC: 'V/E', STM: 'V/E', M: 'V/E', MM: 'V', ST: 'V', AM: 'V/E', SA: 'V/E' },
    wins_timeline: { EC: 'V/E', SC: 'V/E', STM: 'V/E', M: 'V', MM: 'V', ST: 'V', AM: 'V/E', SA: 'V/E' },
    ai_tools: { EC: 'V/E', SC: 'V/E', STM: 'V/E', M: 'V/E', MM: 'V', ST: 'V', AM: 'V/E', SA: 'V/E/A' },
    messaging_community: { EC: 'V/E', SC: 'V/E', STM: 'V/E', M: 'V/E', MM: 'V/E', ST: 'V/E', AM: 'V/E', SA: 'V/E/A' },
    resource_library: { EC: 'V', SC: 'V', STM: 'V', M: 'V/E', MM: 'V/E', ST: 'V/E', AM: 'V/E/A', SA: 'V/E/A' },
    support_tickets: { EC: 'V/E', SC: 'V/E', STM: 'V/E', M: 'V/E', MM: 'V/E', ST: 'V/E', AM: 'V/E/A', SA: 'V/E/A' },
    team_management: { EC: '-', SC: 'E/A', STM: 'V', M: 'V', MM: 'V', ST: 'V/E', AM: 'V/E', SA: 'V/E/A' },
    activity_crm: { EC: 'V', SC: 'V', STM: 'V', M: 'V/E', MM: 'V', ST: 'V/E', AM: 'V/E', SA: 'V/E/A' },
    reports_member: { EC: 'V', SC: 'V', STM: 'V', M: 'V', MM: 'V/E', ST: 'V', AM: 'V/E', SA: 'V/E/A' },
    reports_program: { EC: '-', SC: '-', STM: '-', M: '-', MM: 'V', ST: 'V', AM: 'V/E', SA: 'V/E/A' },
    marketing_campaigns: { EC: '-', SC: '-', STM: '-', M: '-', MM: '-', ST: 'V/E', AM: 'V/E', SA: 'V/E/A' },
    people_access: { EC: '-', SC: '-', STM: '-', M: '-', MM: 'E', ST: 'V', AM: 'E/A', SA: 'E/A' },
    billing_finance: { EC: 'V', SC: 'V', STM: '-', M: '-', MM: '-', ST: '-', AM: 'V', SA: 'E/A' },
    content_studio: { EC: '-', SC: '-', STM: '-', M: '-', MM: '-', ST: '-', AM: 'V/E', SA: 'V/E/A' },
    integrations_settings: { EC: '-', SC: '-', STM: '-', M: '-', MM: '-', ST: '-', AM: 'V/E', SA: 'E/A' }
};

// Navigation visibility based on PRD Page 2
export const NAV_VISIBILITY: Record<string, UserRole[]> = {
    home: ['EC', 'SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA'],
    coaching: ['EC', 'SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA'],
    ai_tools: ['EC', 'SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA'],
    team: ['SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA'], // EC excluded
    community: ['EC', 'SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA'],
    resources: ['EC', 'SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA'],
    reports: ['EC', 'SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA'],
    marketing: ['ST', 'AM', 'SA'],
    people_access: ['MM', 'ST', 'AM', 'SA'],
    billing: ['EC', 'SC', 'AM', 'SA'],
    content_studio: ['AM', 'SA'], // AM needs contentStudioAccess flag
    settings: ['EC', 'SC', 'STM', 'M', 'MM', 'ST', 'AM', 'SA']
};

/**
 * Check if user has permission for a feature
 */
export function hasPermission(
    user: UserContext,
    feature: FeatureName,
    requiredLevel: Permission
): boolean {
    const userPermission = PERMISSION_MATRIX[feature][user.role];
    
    if (userPermission === '-') return false;
    
    const levels: Record<Permission | '-', number> = {
        '-': 0,
        'V': 1,
        'E': 2,
        'V/E': 2,
        'A': 3,
        'E/A': 3,
        'V/E/A': 3
    };
    
    return levels[userPermission] >= levels[requiredLevel];
}

/**
 * Check if navigation item should be visible for user
 */
export function isNavVisible(navItem: string, userRole: UserRole): boolean {
    return NAV_VISIBILITY[navItem]?.includes(userRole) ?? false;
}

/**
 * Get visible navigation items for user
 */
export function getVisibleNavItems(userRole: UserRole): string[] {
    return Object.keys(NAV_VISIBILITY).filter(navItem => 
        NAV_VISIBILITY[navItem].includes(userRole)
    );
}

/**
 * Check if user can access team features
 */
export function canAccessTeam(user: UserContext): boolean {
    // Only Scale members and admins can access team features
    return user.membershipProgram === 'Scale' || 
           ['M', 'MM', 'ST', 'AM', 'SA'].includes(user.role);
}

/**
 * Check if user can create/manage team (Scale CEO only)
 */
export function canManageTeam(user: UserContext): boolean {
    return user.role === 'SC' || ['AM', 'SA'].includes(user.role);
}

/**
 * Get report types visible to user
 */
export function getVisibleReports(userRole: UserRole): string[] {
    const reports = ['my_progress'];
    
    if (['M', 'MM', 'ST', 'AM', 'SA'].includes(userRole)) {
        reports.push('my_clients');
    }
    
    if (['MM', 'ST', 'AM', 'SA'].includes(userRole)) {
        reports.push('pod_reports');
    }
    
    if (['AM', 'SA'].includes(userRole)) {
        reports.push('program_analytics');
    }
    
    return reports;
}

/**
 * Check if user can access Content Studio
 * SA always has access, AM needs contentStudioAccess flag
 */
export function canAccessContentStudio(user: UserContext): boolean {
    if (user.role === 'SA') return true;
    if (user.role === 'AM' && user.contentStudioAccess) return true;
    return false;
}

/**
 * Check if user has scoped access (pod, team, etc.)
 */
export function isScopedAccess(user: UserContext, feature: FeatureName): boolean {
    // MM has pod-scoped access to people_access
    if (user.role === 'MM' && feature === 'people_access') {
        return true;
    }
    
    // EC/SC have own-only access to billing
    if (['EC', 'SC'].includes(user.role) && feature === 'billing_finance') {
        return true;
    }
    
    return false;
}
