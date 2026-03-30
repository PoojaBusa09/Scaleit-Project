import { CalendarEvent, PlatformEvent } from '../features/calendar/types.ts';

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [{ id: 'e1', date: new Date('2025-07-15'), title: 'Q3 Strategy Review', type: 'session', isZoom: true }, { id: 'e2', date: new Date('2025-07-20'), title: 'Finalize Budget', type: 'task' }];

export const MOCK_PLATFORM_EVENTS: PlatformEvent[] = [
    // Upcoming Events
    { id: '1', title: 'PGN SALES LAB', month: 'Dec', day: '5', time: '01:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Deep dive into advanced sales techniques.', isPast: false },
    { id: '2', title: 'Big Picture Vision Workshop', month: 'Dec', day: '5', time: '23:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Link', locationUrl: '#', description: 'Align your 3-year vision with current market trends.', isPast: false },
    { id: '3', title: 'PGN AI Lab for All Members', month: 'Dec', day: '9', time: '01:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Practical applications of AI in your workflow.', isPast: false },
    { id: '4', title: 'Pinn Presentation: Private Equity Masterclass', month: 'Dec', day: '9', time: '23:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'RSVP', locationUrl: '#', description: 'Guest speaker Nick Bradley on exit strategies.', isPast: false },
    { id: '5', title: 'ELEVATE Member Think-Tank', month: 'Dec', day: '11', time: '02:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Peer-to-peer problem solving for Elevate members.', isPast: false },
    { id: '6', title: 'SCALE Member Think-Tank', month: 'Dec', day: '11', time: '04:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Strategy session for Scale members.', isPast: false },
    { id: '7', title: 'ALL MEMBERS Marketing Lab', month: 'Dec', day: '19', time: '00:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Reviewing Q4 marketing performance.', isPast: false },
    { id: '8', title: 'Pinnacle Global Network 2025 YEAR IN REVIEW', month: 'Dec', day: '24', time: '02:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Link', locationUrl: '#', description: 'Keep an eye out for your RSVP Link - Details will follow once you RSVP!', isPast: false },
    { id: '9', title: 'PGN SALES LAB', month: 'Jan', day: '9', time: '00:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Sales objection handling workshop.', isPast: false },
    { id: '10', title: 'ELEVATE Member Think-Tank', month: 'Jan', day: '13', time: '23:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', isPast: false },
    { id: '11', title: 'SCALE Member Think-Tank', month: 'Jan', day: '14', time: '01:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', isPast: false },
    { id: '12', title: 'Pinn Presentation: Cybersecurity', month: 'Jan', day: '27', time: '22:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'RSVP', locationUrl: '#', description: 'With Sejal Lakhani-Bhatt. Protecting your digital assets.', isPast: false },
    { id: '13', title: 'Quarterly Planning Workshop', month: 'Feb', day: '2', time: '10:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Set your Rocks for Q1.', isPast: false },
    { id: '14', title: 'New Member Orientation', month: 'Feb', day: '5', time: '14:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Welcome to the network! Guide to getting started.', isPast: false },

    // Past Events
    { id: '15', title: 'Q3 2024 Financial Review', month: 'Oct', day: '15', time: '10:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Link', locationUrl: '#', description: 'Reviewing key financial metrics from last quarter.', isPast: true },
    { id: '16', title: 'Leadership Retreat Recap', month: 'Oct', day: '20', time: '14:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Highlights from the annual retreat.', isPast: true },
    { id: '17', title: 'October Sales Lab', month: 'Oct', day: '25', time: '01:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Closing deals before year-end.', isPast: true },
    { id: '18', title: 'Guest Speaker: Marketing Trends', month: 'Nov', day: '5', time: '23:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'RSVP', locationUrl: '#', description: 'What to expect in 2025.', isPast: true },
    { id: '19', title: 'November Think-Tank', month: 'Nov', day: '10', time: '02:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', isPast: true },
    { id: '20', title: 'Tech Stack Audit Workshop', month: 'Nov', day: '15', time: '04:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Optimizing your software subscriptions.', isPast: true },
    { id: '21', title: 'Hiring for Growth', month: 'Nov', day: '22', time: '01:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Finding the right talent in a competitive market.', isPast: true },
    { id: '22', title: 'Customer Retention Strategies', month: 'Nov', day: '28', time: '00:30 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Reducing churn and increasing LTV.', isPast: true },
    { id: '23', title: 'End of Year Tax Planning', month: 'Dec', day: '1', time: '10:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Link', locationUrl: '#', description: 'Preparing for tax season.', isPast: true },
    { id: '24', title: 'Holiday Networking Mixer', month: 'Dec', day: '3', time: '18:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'RSVP', locationUrl: '#', description: 'Virtual holiday party.', isPast: true },
    { id: '25', title: 'Goal Setting for 2025', month: 'Dec', day: '4', time: '14:00 (Asia/Calcutta)', timeZone: 'Asia/Calcutta', locationType: 'Zoom', locationUrl: '#', description: 'Pre-planning session.', isPast: true },
];
