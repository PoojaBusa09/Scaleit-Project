
import {
    AwardIcon,
    BarChartIcon,
    BookOpenIcon,
    CalendarIcon,
    CheckSquareIcon,
    HomeIcon,
    MessageSquareIcon,
    SettingsIcon,
    UsersIcon,
    ZapIcon,
    GitBranchIcon,
    ShieldIcon,
    SlidersIcon,
    PieChartIcon,
    WrenchIcon,
    Activity,
    TicketIcon,
    InboxIcon,
    GlobeIcon,
    LayoutGridIcon,
    EyeIcon,
    TrendingUpIcon,
    DollarSignIcon,
    FileTextIcon,
    BriefcaseIcon,
    BellIcon,
} from "../components/icons.tsx";
import { UserRole } from "../types.ts";

export interface NavigationItem {
    to: string;
    icon?: any;
    label?: string;
    roles?: UserRole[]; // If undefined, visible to all
    badge?: number;
    permissions?: string[]; // Optional additional permission checks
    external?: boolean; // If true, opens in new tab
    type?: 'link' | 'divider'; // To support demarcation lines
}

export interface NavigationSection {
    label: string;
    items: NavigationItem[];
    roles?: UserRole[]; // If undefined, visible to all
    checkAccess?: (user: any) => boolean; // Custom access check function name
}

// Helper to determine role groups
const MEMBERS: UserRole[] = ["EC", "SC", "STM"];
const MENTORS: UserRole[] = ["M", "MM"];
const ADMINS: UserRole[] = ["SA", "AM", "ST"];
const TEAM_ACCESS: UserRole[] = ["SC", "STM"]; // EC doesn't see team

// ========================================================
// MEMBER SIDEBAR — Flat list, no section headings
// ========================================================
export const MEMBER_NAV_CONFIG: NavigationItem[] = [
    { to: "/", icon: HomeIcon, label: "Dashboard" },
    { to: "/sessions", icon: CalendarIcon, label: "Sessions" },
    { to: "/growth-progress", icon: TrendingUpIcon, label: "Growth Progress" },
    { to: "/scaleit-method", icon: LayoutGridIcon, label: "SCALEIT Method®" },
    { to: "/resources", icon: BookOpenIcon, label: "Resource Library" },
    { to: "/community", icon: UsersIcon, label: "Community" },
    { to: "/messages", icon: InboxIcon, label: "Messages", badge: 3 },
    { to: "/support", icon: TicketIcon, label: "Member Support" },
    { to: "/settings", icon: SettingsIcon, label: "Settings" },
];

// ========================================================
// MENTOR SIDEBAR — Flat list, no section headings
// ========================================================
export const MENTOR_NAV_CONFIG: NavigationItem[] = [
    ...MEMBER_NAV_CONFIG,
    { to: "", type: "divider" },
    { to: "/mentor/dashboard", icon: HomeIcon, label: "Mentor Dashboard" },
    { to: "/mentor/member-status", icon: Activity, label: "Member Status" },
    { to: "/mentor/corner", icon: BookOpenIcon, label: "Mentor's Corner", external: true },
];

// ========================================================
// ADMIN / STAFF SIDEBAR — Kept as sectioned config (unchanged)
// ========================================================
export const NAVIGATION_CONFIG: NavigationSection[] = [
    {
        label: "Dashboard",
        items: [
            { to: "/", icon: HomeIcon, label: "Dashboard" }
        ]
    },
    {
        label: "Mentoring",
        roles: MEMBERS,
        items: [
            { to: "/sessions", icon: CalendarIcon, label: "Sessions" },
            { to: "/growth-tracking", icon: BarChartIcon, label: "Growth Tracking" },
            { to: "/big-picture-vision", icon: EyeIcon, label: "Big Picture Vision" },
        ],
    },
    {
        label: "Business Tools",
        roles: MEMBERS,
        items: [
            { to: "/scaleit-method", icon: LayoutGridIcon, label: "SCALEIT Method®" },
            { to: "/tools", icon: ZapIcon, label: "Business Tools" },
            { to: "/score-tracker", icon: Activity, label: "Score Tracker" },
            { to: "/decision-matrix", icon: PieChartIcon, label: "Decision Matrix" },
        ],
    },
    {
        label: "Team",
        checkAccess: (user) => (user.role === 'SC' || user.role === 'STM'),
        items: [
            { to: "/team", icon: UsersIcon, label: "Team Management" },
            { to: "/tools/org-chart", icon: GitBranchIcon, label: "Org Chart" },
        ]
    },
    {
        label: "Communication",
        items: [
            { to: "/messages", icon: InboxIcon, label: "Messages", badge: 3 },
            { to: "/events", icon: CalendarIcon, label: "Events Calendar", roles: MEMBERS },
        ],
    },
    {
        label: "Resources",
        items: [
            { to: "/resources", icon: BookOpenIcon, label: "Resource Library" },
        ],
    },
    {
        label: "Reports",
        items: [
            { to: "/reports/my-progress", icon: TrendingUpIcon, label: "My Progress", permissions: ['my_progress'] },
            { to: "/reports/my-clients", icon: UsersIcon, label: "My Clients", permissions: ['my_clients'] },
            { to: "/reports/pod-reports", icon: BarChartIcon, label: "Pod Reports", permissions: ['pod_reports'] },
            { to: "/reports/program-analytics", icon: PieChartIcon, label: "Program Analytics", permissions: ['program_analytics'] },
        ]
    },
    {
        label: "Marketing",
        roles: ["ST", "AM", "SA"],
        items: [
            { to: "/marketing/campaigns", icon: BriefcaseIcon, label: "Campaigns" },
            { to: "/marketing/audiences", icon: UsersIcon, label: "Audiences" },
        ]
    },
    {
        label: "Billing",
        roles: ["EC", "SC", "AM", "SA"],
        items: [
            { to: "/billing/subscriptions", icon: DollarSignIcon, label: "Subscriptions" },
            { to: "/billing/invoices", icon: FileTextIcon, label: "Invoices" },
        ]
    },
    {
        label: "Content Studio",
        checkAccess: (user) => user.contentStudioAccess || false,
        items: [
            { to: "/content/templates", icon: FileTextIcon, label: "Email Templates" },
            { to: "/content/notifications", icon: BellIcon, label: "Notifications" },
            { to: "/content/forms", icon: CheckSquareIcon, label: "Forms" },
            { to: "/content/web", icon: GlobeIcon, label: "Web Content" },
        ]
    },
    {
        label: "People & Access",
        roles: ["MM", "ST", "AM", "SA"],
        items: [
            { to: "/people/users", icon: UsersIcon, label: "Users" },
            { to: "/people/roles", icon: ShieldIcon, label: "Roles & Permissions" },
        ]
    },
    {
        label: "Admin Tools",
        roles: ADMINS,
        items: [
            { to: "/admin/dashboard", icon: BarChartIcon, label: "Admin Dashboard" },
            { to: "/admin/users", icon: UsersIcon, label: "User Management" },
            { to: "/admin/config", icon: SlidersIcon, label: "System Config", roles: ["AM", "SA"] },
        ]
    },

    {
        label: "Support",
        items: [
            { to: "/support", icon: TicketIcon, label: "Support Tickets" },
        ]
    },
    {
        label: "Settings",
        items: [
            { to: "/settings", icon: SettingsIcon, label: "Account Settings" },
            { to: "/settings/integrations", icon: WrenchIcon, label: "Integrations" },
            { to: "/settings/system", icon: SlidersIcon, label: "System Settings", roles: ["AM", "SA"] },
        ]
    }
];
