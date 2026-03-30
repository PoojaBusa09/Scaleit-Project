import {
    MOCK_ADMIN_USERS,
    MOCK_TASKS,
    MOCK_SESSIONS,
    MOCK_MESSAGES,
    MOCK_CONVERSATIONS,
    MOCK_TEAM_MEMBERS
} from '../constants';
import { MOCK_MENTOR_CLIENTS, MOCK_ORG_CHART } from '../data/mockMentors.ts';
import { MOCK_MEMBER_GOALS, MOCK_FINANCIAL_DATA } from '../data/mockFinancials.ts';
import {
    AdminUser,
    Task,
    MentorClient,
    Session,
    ChatMessage,
    Conversation,
    TeamMember,
    OrgNode,
    Campaign,
    Audience,
    Subscription,
    Transaction,
    ModelHistory,
    MemberGoal,
    FinancialData,
    SessionSummary,
    Transcript
} from '../types';
import { Milestone } from '../features/strategy/types';
import { EmailTemplate, Notification, Form, WebContent } from '../features/content/types';

/**
 * Service to manage mock data for the application.
 * Acts as an in-memory database, initialized with constant data but allowing runtime mutations (add, update, delete).
 * This ensures the UI can demonstrate interactivity without a real backend.
 */
class MockDataService {
    private users: AdminUser[];
    private tasks: Task[];
    private clients: MentorClient[];
    private sessions: Session[];
    private messages: Record<string, ChatMessage[]>;
    private conversations: Conversation[];
    private teamMembers: TeamMember[];
    private orgChart: OrgNode;
    private campaigns: Campaign[];
    private audiences: Audience[];
    private subscriptions: Subscription[];
    private transactions: Transaction[];
    private emailTemplates: EmailTemplate[];
    private notifications: Notification[];
    private forms: Form[] = [];
    private webContent: WebContent[] = [];
    private scalableModelHistory: ModelHistory[] = [];
    private goals: MemberGoal[] = [];
    private financialData: FinancialData;
    private milestones: Milestone[] = [];

    private sessionSummaries: SessionSummary[] = [];

    constructor() {
        // Initialize with deep copies to avoid reference issues
        this.users = JSON.parse(JSON.stringify(MOCK_ADMIN_USERS));
        this.tasks = JSON.parse(JSON.stringify(MOCK_TASKS));
        this.clients = JSON.parse(JSON.stringify(MOCK_MENTOR_CLIENTS));
        this.sessions = JSON.parse(JSON.stringify(MOCK_SESSIONS));
        this.messages = JSON.parse(JSON.stringify(MOCK_MESSAGES));
        this.conversations = JSON.parse(JSON.stringify(MOCK_CONVERSATIONS));
        this.teamMembers = JSON.parse(JSON.stringify(MOCK_TEAM_MEMBERS)).map((m: TeamMember) => ({
            ...m,
            email: m.name.toLowerCase().replace(' ', '.') + '@company.com',
            bio: "Experienced professional with a track record of driving results and fostering team collaboration. Passionate about continuous improvement and innovation.",
            strengths: ["Strategic Planning", "Team Leadership", "Problem Solving", "Communication"],
            weaknesses: ["Public Speaking", "Delegation", "Time Management"],
            opportunities: ["Cross-functional leadership", "Mentorship programs"],
            threats: ["Rapid market changes", "Resource constraints"],
            skills: ["Project Management", "Agile", "Data Analysis", "React", "TypeScript"],
            tenantId: "tenant-default"
        }));

        this.orgChart = JSON.parse(JSON.stringify(MOCK_ORG_CHART));

        this.goals = JSON.parse(JSON.stringify(MOCK_MEMBER_GOALS));
        this.financialData = { ...MOCK_FINANCIAL_DATA };

        // Initialize milestones
        this.milestones = [
            {
                title: "First $100K Revenue Month",
                date: "October 2025",
                completed: true,
                description: "Achieved first six-figure monthly revenue through improved sales process."
            },
            {
                title: "Team Expansion - 10 Employees",
                date: "September 2025",
                completed: true,
                description: "Successfully hired and onboarded key team members."
            },
            {
                title: "Launch New Product Line",
                date: "December 2025",
                completed: false,
                description: "Introduce complementary service offering to existing customer base."
            },
            {
                title: "Achieve 95% Customer Retention",
                date: "Q1 2026",
                completed: false,
                description: "Implement customer success program to reduce churn and increase loyalty."
            }
        ];

        this.campaigns = [];
        this.audiences = [];
        this.subscriptions = [];
        this.transactions = [];
        this.emailTemplates = [];
        this.notifications = [];
        this.forms = [];
        this.webContent = [
            {
                id: "1",
                title: "Getting Started Guide",
                type: "Page",
                author: "Admin",
                status: "Published",
                publishDate: "2024-01-01",
                views: 1250
            },
            {
                id: "2",
                title: "Q1 Trends Report",
                type: "Blog",
                author: "Sarah Smith",
                status: "Draft",
                publishDate: "-",
                views: 0
            }
        ];

        this.scalableModelHistory = [
            { id: 1, date: 'Nov 10, 2024', version: 'v1.0 - Brainstorming', topChoice: 'Licensing', status: 'Archived', tenantId: 'pgn-HQ' },
            { id: 2, date: 'Dec 05, 2024', version: 'v2.0 - Refinement', topChoice: 'Franchise', status: 'Active', tenantId: 'tenant-demo' }
        ];

        // --- Multi-Tenancy Initialization ---
        // Tag all initial data with a default tenant if not present
        const tag = <T extends object>(items: T[]): (T & { tenantId: string })[] =>
            items.map(i => ({ ...i, tenantId: (i as any).tenantId || 'tenant-demo' }));

        this.tasks = tag(this.tasks) as Task[];
        this.clients = tag(this.clients) as MentorClient[];
        this.sessions = tag(this.sessions) as Session[];
        // Messages are a record, handled differently or assumed global/user-specific for now
        this.conversations = tag(this.conversations) as Conversation[];
        // Team Members already tagged above
        this.campaigns = tag(this.campaigns) as Campaign[];
        this.audiences = tag(this.audiences) as Audience[];
        this.subscriptions = tag(this.subscriptions) as Subscription[];
        this.transactions = tag(this.transactions) as Transaction[];
        this.emailTemplates = tag(this.emailTemplates) as EmailTemplate[];
        this.notifications = tag(this.notifications) as Notification[];
        this.forms = tag(this.forms) as Form[];
        this.webContent = tag(this.webContent) as WebContent[];
        // History specific
        // this.scalableModelHistory = tag(this.scalableModelHistory); // Already manually tagged above for demo

        this.sessionSummaries = [
            {
                id: 'summary_001',
                sessionId: '1',
                executiveSummary: "Strategic alignment session focusing on Q3 growth targets and cash flow stability.",
                keyPoints: ["Growth Targets (+15%)", "Cash Flow Mitigation", "Critical Task Completion"],
                duration: "60m",
                aiMetadata: {
                    status: 'approved',
                    confidence: 0.98,
                    generatedAt: new Date().toISOString()
                },
                strategy: {
                    items: ["Growth Goals Updated"],
                    impact: "+15% TARGET"
                },
                execution: {
                    items: ["3 Critical Tasks Closed"],
                    impact: "ON TRACK"
                },
                risks: {
                    items: ["Cash Flow Risk Identified"],
                    impact: "MITIGATION PLAN CREATED"
                }
            }
        ];
    }

    // --- Multi-Tenancy Context ---
    private currentTenantId: string = 'tenant-demo'; // Default for dev

    setTenantContext(tenantId: string): void {
        console.log(`[MockDB] Switching Context to Tenant: ${tenantId}`);
        this.currentTenantId = tenantId;
    }

    private getTenantId(): string {
        return this.currentTenantId;
    }

    private filter<T extends { tenantId?: string }>(items: T[]): T[] {
        return items.filter(i => i.tenantId === this.currentTenantId);
    }

    // --- User Management ---
    getUsers(): AdminUser[] {
        // Users can belong to a tenant, or be global admins (SA) viewing a tenant?
        // For simplicity, we strictly filter by tenant for now, unless role is SA
        return this.users.filter(u => u.tenantId === this.currentTenantId || u.role === 'SA');
    }

    addUser(user: AdminUser): void {
        this.users.push(user);
    }

    updateUser(updatedUser: AdminUser): void {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            this.users[index] = updatedUser;
        }
    }

    deleteUser(userId: number): void {
        this.users = this.users.filter(u => u.id !== userId);
    }

    // --- Task Management ---
    /**
     * Retrieves all tasks for current tenant.
     * @returns A copy of the tasks array.
     */
    getTasks(): Task[] {
        return this.filter(this.tasks);
    }

    /**
     * Adds a new task to the top of the list, tagged with current tenant.
     * @param task The task to add.
     */
    addTask(task: Task): void {
        this.tasks.unshift({ ...task, tenantId: this.currentTenantId }); // Add to top
    }

    updateTask(updatedTask: Task): void {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id && t.tenantId === this.currentTenantId);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
        }
    }

    deleteTask(taskId: number): void {
        // Only allow deleting if it belongs to tenant
        this.tasks = this.tasks.filter(t => t.id !== taskId || t.tenantId !== this.currentTenantId);
    }

    // --- Client Management ---
    getClients(): MentorClient[] {
        return this.filter(this.clients);
    }

    getClientById(id: number): MentorClient | undefined {
        // Ensure client belongs to tenant
        return this.clients.find(c => c.id === id && c.tenantId === this.currentTenantId);
    }

    updateClient(updatedClient: MentorClient): void {
        const index = this.clients.findIndex(c => c.id === updatedClient.id && c.tenantId === this.currentTenantId);
        if (index !== -1) {
            this.clients[index] = updatedClient;
        }
    }

    // --- Session Management ---
    getSessions(): Session[] {
        return this.filter(this.sessions);
    }

    addSession(session: Session): void {
        this.sessions.push({ ...session, tenantId: this.currentTenantId });
    }

    // --- Messaging ---
    getConversations(): Conversation[] {
        return this.filter(this.conversations);
    }

    addConversation(conversation: Conversation): void {
        this.conversations.unshift({ ...conversation, tenantId: this.currentTenantId });
    }

    getMessages(conversationId: string): ChatMessage[] {
        // Ensure conversation belongs to tenant
        const convo = this.conversations.find(c => c.id === conversationId && c.tenantId === this.currentTenantId);
        if (!convo) return [];
        return this.messages[conversationId] || [];
    }

    addMessage(conversationId: string, message: ChatMessage): void {
        // Ensure owner
        const convo = this.conversations.find(c => c.id === conversationId && c.tenantId === this.currentTenantId);
        if (!convo) {
            console.warn("Attempted to add message to unauthorized conversation");
            return;
        }

        if (!this.messages[conversationId]) {
            this.messages[conversationId] = [];
        }
        this.messages[conversationId].push(message);

        // Update conversation preview
        const convIndex = this.conversations.findIndex(c => c.id === conversationId);
        if (convIndex !== -1) {
            this.conversations[convIndex].lastMessage = message.text;
            this.conversations[convIndex].timestamp = message.timestamp;
        }
    }

    // --- Team Management ---
    getTeamMembers(): TeamMember[] {
        return this.filter(this.teamMembers);
    }

    addTeamMember(member: TeamMember): void {
        this.teamMembers.push({ ...member, tenantId: this.currentTenantId });
    }

    deleteTeamMember(id: number): void {
        this.teamMembers = this.teamMembers.filter(m => m.id !== id);
    }

    /**
     * Retrieves the current Organization Chart tree.
     */
    getOrgChart(): OrgNode {
        return JSON.parse(JSON.stringify(this.orgChart));
    }

    /**
     * Updates the entire Organization Chart.
     * @param root The new root node of the chart.
     */
    updateOrgChart(root: OrgNode): void {
        this.orgChart = root;
    }

    // --- Marketing Management ---
    getCampaigns(): Campaign[] {
        return this.filter(this.campaigns);
    }

    addCampaign(campaign: Campaign): void {
        this.campaigns.unshift({ ...campaign, tenantId: this.currentTenantId });
    }

    deleteCampaign(id: string): void {
        this.campaigns = this.campaigns.filter(c => c.id !== id || c.tenantId !== this.currentTenantId);
    }

    getAudiences(): Audience[] {
        return this.filter(this.audiences);
    }

    addAudience(audience: Audience): void {
        this.audiences.unshift({ ...audience, tenantId: this.currentTenantId });
    }

    deleteAudience(id: string): void {
        this.audiences = this.audiences.filter(a => a.id !== id || a.tenantId !== this.currentTenantId);
    }

    // --- Billing Management ---
    getSubscriptions(): Subscription[] {
        return this.filter(this.subscriptions);
    }

    getTransactions(): Transaction[] {
        return this.filter(this.transactions);
    }

    // --- Content Studio Management ---
    getEmailTemplates(): EmailTemplate[] {
        return this.filter(this.emailTemplates);
    }

    addEmailTemplate(template: EmailTemplate): void {
        this.emailTemplates.unshift({ ...template, tenantId: this.currentTenantId });
    }

    getNotifications(): Notification[] {
        return this.filter(this.notifications);
    }

    addNotification(notification: Notification): void {
        this.notifications.unshift({ ...notification, tenantId: this.currentTenantId });
    }

    getForms(): Form[] {
        return this.filter(this.forms);
    }

    addForm(form: Form): void {
        this.forms.unshift({ ...form, tenantId: this.currentTenantId });
    }

    getWebContent(): WebContent[] {
        return this.filter(this.webContent);
    }

    addWebContent(content: WebContent): void {
        this.webContent.unshift({ ...content, tenantId: this.currentTenantId });
    }

    // --- Strategy Management ---
    getScalableModelHistory(): ModelHistory[] {
        return this.filter(this.scalableModelHistory);
    }

    addScalableModel(model: ModelHistory): void {
        this.scalableModelHistory.unshift({ ...model, tenantId: this.currentTenantId });
    }

    getGoals(): MemberGoal[] {
        return this.goals;
    }

    getFinancialMetrics(): FinancialData {
        return this.financialData;
    }

    getMilestones(): Milestone[] {
        return this.milestones;
    }

    /**
     * Process AI Insights and update the "Database"
     */
    processSessionInsights(sessionId: string, result: any): void {
        console.log(`[MockDB] Processing insights for session ${sessionId}`, result);

        // 1. Mark session as processed
        const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex !== -1) {
            this.sessions[sessionIndex].aiProcessed = true;
            this.sessions[sessionIndex].aiProcessedAt = new Date().toISOString();
        }

        // 2. Create Tasks from Action Items
        const strategies: string[] = [];
        const executions: string[] = [];
        const risks: string[] = [];

        if (result.insights) {
            result.insights.forEach((insight: any) => {
                if (insight.type === 'action_item') {
                    this.addTask({
                        id: Math.floor(Math.random() * 10000), // Random ID
                        text: insight.content, // Changed from title to text
                        completed: false,
                        isWin: false,
                        quarter: 'this', // Default to current quarter
                        dueDate: insight.dueDate || 'Next Week',
                        owner: insight.assignee || 'Me',
                        tenantId: this.currentTenantId,
                        sourceSessionId: sessionId,
                        status: 'suggested'
                    });
                    executions.push(insight.content);
                    console.log(`[MockDB] Auto-created task: ${insight.content}`);
                } else if (insight.type === 'decision') {
                    strategies.push(insight.content);
                } else if (insight.type === 'risk') {
                    risks.push(insight.content);
                }
            });
        }

        // 3. Save Session Summary for Dashboard Widget
        const summary: SessionSummary = {
            id: `summary_${Date.now()}`,
            sessionId,
            executiveSummary: result.summary,
            keyPoints: result.insights.map((i: any) => i.content),
            duration: "45m", // Mock duration
            aiMetadata: {
                status: 'approved',
                confidence: 0.95,
                generatedAt: new Date().toISOString()
            },
            strategy: {
                items: strategies.length > 0 ? strategies : ["Strategic alignment confirmed"],
                impact: "STRATEGY ALIGNED"
            },
            execution: {
                items: executions.slice(0, 3), // Top 3 actions
                impact: `${executions.length} NEW ACTIONS`
            },
            risks: {
                items: risks.length > 0 ? risks : ["No immediate risks detected"],
                impact: risks.length > 0 ? "RISK FLAGGED" : "LOW RISK"
            }
        };

        this.saveSessionSummary(summary);
    }

    // --- AI & Session Intelligence ---

    getTranscript(sessionId: string): Transcript | undefined {
        const session = this.sessions.find(s => s.id === sessionId);
        return session?.transcript;
    }

    getSessionSummary(sessionId: string): SessionSummary | undefined {
        return this.sessionSummaries.find(s => s.sessionId === sessionId);
    }

    saveSessionSummary(summary: SessionSummary): void {
        const index = this.sessionSummaries.findIndex(s => s.sessionId === summary.sessionId);
        if (index !== -1) {
            this.sessionSummaries[index] = summary;
        } else {
            this.sessionSummaries.push(summary);
        }

        // Mark session as processed
        const session = this.sessions.find(s => s.id === summary.sessionId);
        if (session) {
            session.aiProcessed = true;
            session.aiProcessedAt = new Date().toISOString();
        }
    }

    getLatestSessionSummary(): SessionSummary | undefined {
        // Return the last one added, or sort by date if available
        return this.sessionSummaries[this.sessionSummaries.length - 1];
    }
}

// Export a singleton instance
export const mockDataService = new MockDataService();
