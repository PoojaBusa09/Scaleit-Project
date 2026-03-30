
export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'tool';
    thumbnailUrl: string;
    isShared?: boolean; // New field for user uploaded files
    author?: string;
    dateAdded?: string;
    tags?: string[];
}
