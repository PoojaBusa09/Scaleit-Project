
export interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    type: 'session' | 'task' | 'reminder';
    isZoom?: boolean;
}

export interface PlatformEvent {
    id: string;
    title: string;
    month: string;
    day: string;
    time: string;
    timeZone: string;
    locationType: 'Zoom' | 'Link' | 'RSVP';
    locationUrl: string;
    description?: string;
    isPast?: boolean;
}
