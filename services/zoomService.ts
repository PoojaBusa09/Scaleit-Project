/**
 * Mock Zoom Service
 * Simulates Zoom integration for creating and managing video meetings.
 */

export interface ZoomMeeting {
    id: string;
    topic: string;
    joinUrl: string;
    startUrl: string;
    startTime: string;
    duration: number;
    status: 'scheduled' | 'started' | 'ended';
}

class MockZoomService {
    private meetings: ZoomMeeting[] = [];

    constructor() {
        // Seed with a sample meeting if needed
    }

    /**
     * Create a new meeting link
     */
    async createMeeting(topic: string, startTime: string, duration: number = 60): Promise<ZoomMeeting> {
        const meeting: ZoomMeeting = {
            id: `zoom_${Date.now()}`,
            topic,
            startTime,
            duration,
            joinUrl: `https://zoom.us/j/mock_${Date.now()}?pwd=scaleit`,
            startUrl: `https://zoom.us/s/mock_${Date.now()}?pwd=scaleit`,
            status: 'scheduled'
        };

        this.meetings.push(meeting);
        console.log('[ZoomService] Created meeting:', meeting);
        return meeting;
    }

    /**
     * Get meeting details
     */
    async getMeeting(id: string): Promise<ZoomMeeting | undefined> {
        return this.meetings.find(m => m.id === id);
    }

    /**
     * Simulate starting a meeting
     */
    async startMeeting(id: string): Promise<boolean> {
        const meeting = this.meetings.find(m => m.id === id);
        if (meeting) {
            meeting.status = 'started';
            console.log('[ZoomService] Started meeting:', meeting.topic);
            return true;
        }
        return false;
    }

    /**
     * Simulate ending a meeting (triggers AI processing downstream)
     */
    async endMeeting(id: string): Promise<boolean> {
        const meeting = this.meetings.find(m => m.id === id);
        if (meeting) {
            meeting.status = 'ended';
            console.log('[ZoomService] Ended meeting:', meeting.topic);
            return true;
        }
        return false;
    }
}

export const zoomService = new MockZoomService();
