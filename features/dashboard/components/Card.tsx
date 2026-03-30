
import React from 'react';
import { GripVerticalIcon } from '../../../components/icons.tsx';

export const Card: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties, isDraggable?: boolean, onDragStart?: (e: React.DragEvent) => void, onDragOver?: (e: React.DragEvent) => void, onDrop?: (e: React.DragEvent) => void, onDragEnd?: (e: React.DragEvent) => void }> =
    ({ children, className, style, isDraggable, onDragStart, onDragOver, onDrop, onDragEnd }) => (
        <div
            className={`bg-surface p-6 rounded-lg shadow-sm border border-outline/20 transition-all duration-300 hover:shadow-md ${isDraggable ? 'hover:-translate-y-0 cursor-grab' : 'hover:-translate-y-1'} ${className}`}
            style={style}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
        >
            {children}
        </div>
    );

export const CardHeader: React.FC<{ icon: React.ElementType, title: string, children?: React.ReactNode, inEditMode?: boolean }> = ({ icon: Icon, title, children, inEditMode }) => (
    <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
            {inEditMode && <GripVerticalIcon className="h-5 w-5 text-outline mr-2" />}
            <Icon className="h-6 w-6 text-on-surface-variant" />
            <h3 className="text-title-md font-bold text-on-surface ml-3">{title}</h3>
        </div>
        {children}
    </div>
);
