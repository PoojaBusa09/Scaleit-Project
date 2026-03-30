
import React from 'react';
import { FileTextIcon, PlusIcon, DownloadIcon } from '../../../components/icons.tsx';
import { Card, CardHeader } from './Card.tsx';

export const ProgressReportsWidget: React.FC<{ inEditMode?: boolean }> = ({ inEditMode }) => {
    const handleGenerateReport = () => {
        alert("Generating consolidated PDF report based on current goals, tasks, and session notes...");
    }

    return (
        <Card isDraggable={inEditMode}>
            <CardHeader icon={FileTextIcon} title="Progress Reports" inEditMode={inEditMode}>
                <button onClick={handleGenerateReport} className="text-xs font-medium text-primary hover:underline flex items-center">
                    <PlusIcon className="h-3 w-3 mr-1" /> Generate New
                </button>
            </CardHeader>
            <div className="space-y-2">
                <a href="#" className="flex justify-between items-center p-2 rounded-md hover:bg-surface-variant">
                    <span className="text-body-md font-medium text-on-surface-variant">Q3 2025 Progress Report</span>
                    <DownloadIcon className="h-5 w-5 text-on-surface-variant" />
                </a>
                <a href="#" className="flex justify-between items-center p-2 rounded-md hover:bg-surface-variant">
                    <span className="text-body-md font-medium text-on-surface-variant">Q2 2025 Progress Report</span>
                    <DownloadIcon className="h-5 w-5 text-on-surface-variant" />
                </a>
            </div>
        </Card>
    );
};
