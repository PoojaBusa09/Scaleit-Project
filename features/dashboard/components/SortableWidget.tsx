import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableWidgetProps {
    id: string;
    children: React.ReactNode;
}

export const SortableWidget: React.FC<SortableWidgetProps> = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group touch-none">
            {/* Drag Handle - Visible on hover/group-hover */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-grab active:cursor-grabbing z-20 opacity-50 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-4 h-4" />
            </div>
            {children}
        </div>
    );
};
