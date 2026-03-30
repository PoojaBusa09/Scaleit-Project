
import { Session, SuggestedPrompt, SessionWin } from '../types.ts';

// Helper to create dates relative to today
const getDate = (daysOffset: number, hours: number = 10, minutes: number = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
};

// Helper for expiry dates (6 months from session)
const getExpiryDate = (sessionDate: string) => {
    const d = new Date(sessionDate);
    d.setMonth(d.getMonth() + 6);
    return d.toISOString();
};

export const MOCK_SESSIONS: Session[] = [
    // =========================================================================
    // UPCOMING SESSIONS
    // =========================================================================
    {
        id: 'new_1',
        type: 'mentor',
        status: 'scheduled',
        memberId: 'm1',
        memberName: 'Alexandre Dubois',
        mentorId: 'jordan_lee',
        title: 'Strategy Session',
        scheduledAt: getDate(0, 14, 0), // Today 2pm
        duration: 60,
        timeZone: 'America/New_York',
        category: 'strategy',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        attendance: null,
        notificationsEnabled: true,
        aiProcessed: false,
        scaleItPillars: ['Strategic', 'Execution'],
        tags: ['Product', 'Strategy'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },
    {
        id: 'new_2',
        type: 'mentor',
        status: 'scheduled',
        memberId: 'm2',
        memberName: 'Sarah Chen',
        mentorId: 'jordan_lee',
        title: 'Strategy Session',
        scheduledAt: getDate(2, 11, 0), // Wednesday 11am
        duration: 45,
        timeZone: 'America/New_York',
        category: 'strategy',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        attendance: null,
        notificationsEnabled: true,
        aiProcessed: false,
        scaleItPillars: ['Execution'],
        tags: ['Prep'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },
    {
        id: 'new_3',
        type: 'group',
        status: 'scheduled',
        memberId: 'group_a',
        memberName: 'Growth Cohort A',
        title: 'Mastermind',
        scheduledAt: getDate(3, 16, 0), // Thursday 4pm
        duration: 90,
        timeZone: 'America/New_York',
        category: 'mastermind',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        rsvpCount: 8,
        attendance: null,
        notificationsEnabled: true,
        aiProcessed: false,
        scaleItPillars: ['Leadership', 'Strategic'],
        tags: ['Mastermind'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },
    {
        id: 'cal_1',
        type: 'mentor',
        status: 'scheduled',
        memberId: 'm3',
        memberName: 'Jessica Wong',
        mentorId: 'jordan_lee',
        title: 'Strategy Session',
        scheduledAt: getDate(1, 9, 0), // Tomorrow 9am
        duration: 60,
        timeZone: 'America/New_York',
        category: 'strategy',
        isGlobalEvent: false,
        rsvpStatus: 'maybe',
        attendance: null,
        notificationsEnabled: false,
        aiProcessed: false,
        scaleItPillars: ['Leadership'],
        tags: ['Coaching'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },
    {
        id: 'cal_2',
        type: 'mentor',
        status: 'scheduled',
        memberId: 'm1',
        memberName: 'Alexandre Dubois',
        mentorId: 'jordan_lee',
        title: 'Huddle',
        scheduledAt: getDate(4, 13, 0), // Day+4 1pm
        duration: 30,
        timeZone: 'America/New_York',
        category: 'huddle',
        isGlobalEvent: false,
        rsvpStatus: null,
        attendance: null,
        notificationsEnabled: true,
        aiProcessed: false,
        scaleItPillars: ['Leadership'],
        tags: ['Hiring'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },
    {
        id: 'cal_3',
        type: 'workshop',
        status: 'scheduled',
        memberId: 'm4',
        memberName: 'David Miller',
        title: 'Marketing Automation Workshop',
        scheduledAt: getDate(5, 10, 30), // Day+5 10:30am
        duration: 120,
        timeZone: 'America/New_York',
        category: 'lab_workshop',
        isGlobalEvent: true,
        rsvpStatus: 'confirmed',
        rsvpCount: 42,
        attendance: null,
        notificationsEnabled: true,
        aiProcessed: false,
        scaleItPillars: ['Execution', 'Strategic'],
        tags: ['Marketing', 'Tech'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },
    {
        id: 'cal_5',
        type: 'group',
        status: 'scheduled',
        memberId: 'group_b',
        memberName: 'Sales Team',
        title: 'Sales Pipeline Workshop',
        scheduledAt: getDate(8, 15, 0), // Day+8 3pm
        duration: 120,
        timeZone: 'America/New_York',
        category: 'lab_workshop',
        isGlobalEvent: true,
        rsvpStatus: null,
        attendance: null,
        notificationsEnabled: false,
        aiProcessed: false,
        scaleItPillars: ['CashFlow'],
        tags: ['Sales', 'Workshop'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },
    // PGN Global Event — Guest Speaker
    {
        id: 'pgn_1',
        type: 'workshop',
        status: 'scheduled',
        memberId: 'global',
        memberName: 'All Members',
        title: 'Guest Speaker: Growth Mindset',
        scheduledAt: getDate(6, 12, 0),
        duration: 90,
        timeZone: 'America/New_York',
        category: 'lab_workshop',
        isGlobalEvent: true,
        rsvpStatus: 'confirmed',
        rsvpCount: 156,
        attendance: null,
        notificationsEnabled: true,
        aiProcessed: false,
        scaleItPillars: ['Leadership'],
        tags: ['Guest Speaker', 'PGN Event'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'not_recorded'
    },

    // =========================================================================
    // COMPLETED SESSIONS
    // =========================================================================
    {
        id: '1',
        type: 'mentor',
        status: 'completed',
        memberId: 'm1',
        memberName: 'Alexandre Dubois',
        mentorId: 'jordan_lee',
        title: 'Strategy Session',
        scheduledAt: '2026-02-10T14:00:00Z',
        duration: 60,
        timeZone: 'America/New_York',
        category: 'strategy',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        attendance: 'attended',
        notificationsEnabled: true,
        endedAt: '2026-02-10T15:12:00Z',
        actualDuration: 72,
        recordingExpiresAt: '2026-08-10T15:12:00Z',
        isBookmarked: true,
        aiProcessed: true,
        scaleItPillars: ['Strategic'],
        tags: ['Quarterly Review'],
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-02-10T15:12:00Z',
        recordingStatus: 'ready',
        transcript: {
            id: 't1',
            sessionId: '1',
            content: `Jordan Lee: Welcome back, Alexandre. Good to see you again. How have things been since our last session?

Alexandre Dubois: Hi Jordan. Things are moving fast. We actually hit that 15% lead increase we talked about, which is great, but now we're feeling the operational strain.

Jordan Lee: That's a fantastic problem to have! Hitting the target is a huge win. Let's dig into that "strain". Is it a process bottleneck or a people bottleneck?

Alexandre Dubois: A bit of both. Our current CRM is just too manual. My sales team is spending 2 hours a day just entering data instead of selling.

Jordan Lee: Right. We flagged CRM selection as a priority last quarter. Have you looked at the options we discussed?

Alexandre Dubois: Yes, we demoed Salesforce and HubSpot. HubSpot seems more aligned with our current size, but I'm worried about the migration timeline.

Jordan Lee: Valid concern. But look at the cost of inaction. If your team is losing 10 hours a week per person on data entry, that's expensive. I'd recommend we commit to a decision by Friday.

Alexandre Dubois: You're right. We need to rip the band-aid off.

Jordan Lee: Okay, let's make that a key decision for today. Select CRM by Friday. Who owns that?

Alexandre Dubois: I do. I'll schedule the final review with the team tomorrow.

Jordan Lee: Perfect. Now, regarding the sales capacity... if we fix the CRM issue, do you still need that additional hire immediately?

Alexandre Dubois: I think so. Even with better efficiency, the volume is just too high for 2 people.

Jordan Lee: Okay, let's look at the numbers...`,
            wordCount: 500,
            speakerLabels: [],
            createdAt: '2026-02-10T15:00:00Z'
        }
    },
    {
        id: '2',
        type: 'mentor',
        status: 'completed',
        memberId: 'm1',
        memberName: 'Alexandre Dubois',
        mentorId: 'jordan_lee',
        title: 'Strategy Session',
        scheduledAt: '2026-02-03T18:00:00Z',
        duration: 45,
        timeZone: 'America/New_York',
        category: 'strategy',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        attendance: 'attended',
        notificationsEnabled: true,
        endedAt: '2026-02-03T18:48:00Z',
        actualDuration: 48,
        recordingExpiresAt: '2026-08-03T18:48:00Z',
        isBookmarked: false,
        aiProcessed: true,
        scaleItPillars: ['CashFlow'],
        tags: ['Finance'],
        createdAt: '2026-01-28T10:00:00Z',
        updatedAt: '2026-02-03T19:00:00Z',
        recordingStatus: 'ready',
        transcript: {
            id: 't2',
            sessionId: '2',
            content: `Alexandre: So the cash flow is looking good for Q1, but Q2 has some large recurring expenses hitting at once.

Jordan: Let's break that down. Are these annual renewals?

Alexandre: Yes, software licenses and the annual insurance premium. It's about $45k hitting in April.

Jordan: Okay. Do we have the reserves to cover that comfortably, or do we need to look at financing options or delaying other spend?

Alexandre: We have the cash, but it will dip us below our 2-month operating runway, which makes me nervous.

Jordan: That's a healthy nervousness. Rule #1 is never run out of cash. What if we moved the hiring of the new dev to June instead of May?

Alexandre: That would save us about $15k in cash outflow for that period.

Jordan: Exactly. Let's model that scenario. If you delay the hire, does it impact deliverable dates for the new feature?

Alexandre: Ideally no, if the current team stays productive.

Jordan: Okay. Let's put a pin in that as "Plan B". For "Plan A", let's see if we can get those software vendors to switch to quarterly billing instead of annual. Even with a 5% markup, it preserves your cash flow.

Alexandre: That's a great idea. I haven't asked them yet.

Jordan: Action item: Reach out to vendors X, Y, and Z to ask for payment terms.`,
            wordCount: 800,
            speakerLabels: [],
            createdAt: '2026-02-03T19:00:00Z'
        }
    },
    {
        id: 'cal_4',
        type: 'mentor',
        status: 'completed',
        memberId: 'm2',
        memberName: 'Sarah Chen',
        mentorId: 'jordan_lee',
        title: 'Strategy Session',
        scheduledAt: getDate(-2, 11, 0), // 2 days ago
        duration: 60,
        timeZone: 'America/New_York',
        category: 'strategy',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        attendance: 'attended',
        notificationsEnabled: true,
        endedAt: getDate(-2, 12, 5),
        actualDuration: 65,
        recordingExpiresAt: getDate(180, 12, 5),
        isBookmarked: false,
        aiProcessed: true,
        scaleItPillars: ['Strategic'],
        tags: ['Review'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordingStatus: 'ready',
        transcript: {
            id: 't_cal_4',
            sessionId: 'cal_4',
            content: `Sarah: The strategy worked well! We closed the TechFlow deal ahead of schedule.

Jordan: That is huge! Congratulations, Sarah. Walk me through what tipped the scales.

Sarah: Honestly, it was the "Champion Customer" framework. We stopped pitching features and started talking about their internal hero's journey.

Jordan: Music to my ears. Who was the champion?

Sarah: The CTO. We helped him build a business case to present to his CFO. We basically did his homework for him.

Jordan: That is the power of enabling your buyer. Now, the trick is implementation. A fast close is great, but a slow onboarding can kill momentum.

Sarah: Agreed. I'm worried our ops team is already stretched.

Jordan: Let's look at the onboarding capacity. Do we need to bring in a contractor to help with the migration?

Sarah: I have a few contacts.

Jordan: Let's make that an action item. Reach out to them this week. We don't want TechFlow to go cold after signing.`,
            wordCount: 600,
            speakerLabels: [],
            createdAt: new Date().toISOString()
        }
    },
    // Completed — NOT ATTENDED (private mentor session: grayed out, no View)
    {
        id: 'missed_1',
        type: 'mentor',
        status: 'completed',
        memberId: 'm1',
        memberName: 'Alexandre Dubois',
        mentorId: 'jordan_lee',
        title: 'Strategy Session',
        scheduledAt: '2026-01-27T14:00:00Z',
        duration: 60,
        timeZone: 'America/New_York',
        category: 'strategy',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        attendance: 'not_attended',
        notificationsEnabled: true,
        aiProcessed: false,
        scaleItPillars: ['Strategic'],
        tags: ['Missed'],
        createdAt: '2026-01-20T10:00:00Z',
        updatedAt: '2026-01-27T15:00:00Z',
        recordingStatus: 'not_recorded'
    },
    // Completed — NOT ATTENDED (PGN global event: still has recording)
    {
        id: 'missed_2',
        type: 'workshop',
        status: 'completed',
        memberId: 'global',
        memberName: 'All Members',
        title: 'PGN Leadership Lab',
        scheduledAt: '2026-01-20T16:00:00Z',
        duration: 90,
        timeZone: 'America/New_York',
        category: 'lab_workshop',
        isGlobalEvent: true,
        rsvpStatus: null,
        attendance: 'not_attended',
        attendeeCount: 156,
        notificationsEnabled: false,
        endedAt: '2026-01-20T17:35:00Z',
        actualDuration: 95,
        recordingExpiresAt: '2026-07-20T17:35:00Z',
        isBookmarked: false,
        aiProcessed: true,
        scaleItPillars: ['Leadership'],
        tags: ['PGN Event', 'Lab'],
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-20T17:35:00Z',
        recordingStatus: 'ready',
        transcript: {
            id: 't_missed_2',
            sessionId: 'missed_2',
            content: "Speaker: Welcome everyone to our leadership lab...",
            wordCount: 1200,
            speakerLabels: [],
            createdAt: '2026-01-20T17:35:00Z'
        }
    },
    // Completed — Mastermind (attended)
    {
        id: 'comp_mm_1',
        type: 'group',
        status: 'completed',
        memberId: 'group_a',
        memberName: 'Growth Cohort A',
        title: 'Mastermind',
        scheduledAt: '2026-02-06T16:00:00Z',
        duration: 90,
        timeZone: 'America/New_York',
        category: 'mastermind',
        isGlobalEvent: false,
        rsvpStatus: 'confirmed',
        attendance: 'attended',
        notificationsEnabled: true,
        endedAt: '2026-02-06T17:32:00Z',
        actualDuration: 92,
        recordingExpiresAt: '2026-08-06T17:32:00Z',
        isBookmarked: true,
        aiProcessed: true,
        scaleItPillars: ['Leadership', 'Strategic'],
        tags: ['Mastermind'],
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-02-06T17:32:00Z',
        recordingStatus: 'ready',
        transcript: {
            id: 't_comp_mm_1',
            sessionId: 'comp_mm_1',
            content: `Moderator: Great discussion so far. Let's pivot to "Team Alignment". Who here feels their leadership team is fully aligned on the 2026 vision?

Member A: I think we're 80% there. The sales leader is still pushing for volume while product is pushing for enterprise features.

Member B: We had that same issue. We solved it by creating a shared "North Star" metric that required both teams to collaborate.

Moderator: That's a classic friction point. Member B, what was the metric?

Member B: "Net Revenue Retention". Sales can't just sign anyone (churn hurts NRR), and Product has to build what keeps them.

Member A: I like that. Right now we just look at "New ARR", which encourages bad behavior.

Moderator: Exactly. "New ARR" is a vanity metric if it leaks out the bottom of the bucket.

Member C: We struggle with alignment on *culture* more than metrics. Remote work has made it hard to keep the energy up.

Moderator: Let's go around the room. One tactic you've used to boost remote culture?

Member A: Virtual coffee roulette.

Member B: Quarterly offsites. Expensive but worth it.`,
            wordCount: 900,
            speakerLabels: [],
            createdAt: '2026-02-06T17:32:00Z'
        }
    }
];

// =============================================================================
// MOCK SUGGESTED PROMPTS
// =============================================================================

export const MOCK_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
    // Prompts for completed session '1'
    {
        id: 'sp_1',
        sessionId: '1',
        text: 'What CRM tool did we decide on and what are the next steps?',
        originSessionId: '1',
        originDate: '2026-02-10',
        isResolved: true,
        isDismissed: false,
        addedBy: 'ai'
    },
    {
        id: 'sp_2',
        sessionId: '1',
        text: 'Review the 15% lead increase strategy and validate metrics',
        originSessionId: '1',
        originDate: '2026-02-10',
        isResolved: false,
        isDismissed: false,
        addedBy: 'ai'
    },
    // Open prompts (unresolved from past sessions)
    {
        id: 'sp_3',
        text: 'Follow up on hiring timeline for the additional salesperson',
        originSessionId: '2',
        originDate: '2026-02-03',
        isResolved: false,
        isDismissed: false,
        addedBy: 'ai'
    },
    {
        id: 'sp_4',
        text: 'Revisit cash flow projections for Q2',
        originSessionId: '2',
        originDate: '2026-02-03',
        isResolved: false,
        isDismissed: false,
        addedBy: 'mentor'
    },
    {
        id: 'sp_5',
        text: 'Discuss product launch readiness checklist',
        originSessionId: '1',
        originDate: '2026-02-10',
        isResolved: false,
        isDismissed: false,
        addedBy: 'ai'
    },
    // Admin-added prompt
    {
        id: 'sp_admin_1',
        sessionId: '1',
        text: 'Ensure quarterly OKR alignment is reviewed before next board update',
        originSessionId: undefined,
        originDate: undefined,
        isResolved: false,
        isDismissed: false,
        addedBy: 'admin' as const
    },
    // PIN-sourced prompt (from program curriculum)
    {
        id: 'sp_pin_1',
        text: 'Complete the SCALE-IT self-assessment before next coaching cycle',
        originSessionId: undefined,
        originDate: undefined,
        isResolved: false,
        isDismissed: false,
        addedBy: 'pin' as const
    },
    // Prompt for upcoming session
    {
        id: 'sp_6',
        sessionId: 'new_1',
        text: 'Review action items from last strategy session',
        originSessionId: '1',
        originDate: '2026-02-10',
        isResolved: false,
        isDismissed: false,
        addedBy: 'ai'
    },
    {
        id: 'sp_7',
        sessionId: 'new_1',
        text: 'Discuss updated financial projections',
        originSessionId: undefined,
        originDate: undefined,
        isResolved: false,
        isDismissed: false,
        addedBy: 'mentor'
    }
];

// =============================================================================
// MOCK SESSION WINS
// =============================================================================

export const MOCK_SESSION_WINS: SessionWin[] = [
    {
        id: 'win_1',
        sessionId: '1',
        description: 'Achieved 15% lead increase — exceeding Q3 target by 5%',
        detectedAt: '2026-02-10T14:25:00Z',
        source: 'mentor_callout'
    },
    {
        id: 'win_2',
        sessionId: '1',
        description: 'Successfully onboarded 3 enterprise clients this month',
        detectedAt: '2026-02-10T14:40:00Z',
        source: 'ai_detected'
    },
    {
        id: 'win_3',
        sessionId: 'cal_4',
        description: 'Closed the TechFlow deal ahead of schedule',
        detectedAt: getDate(-2, 11, 45),
        source: 'mentor_callout'
    },
    {
        id: 'win_4',
        sessionId: 'comp_mm_1',
        description: 'Team alignment score improved from 6.2 to 8.1',
        detectedAt: '2026-02-06T16:50:00Z',
        source: 'ai_detected'
    }
];
