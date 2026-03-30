
import React from 'react';
import { Link } from 'react-router-dom';
import { AwardIcon } from '../../../components/icons.tsx';
import { Card, CardHeader } from './Card.tsx';

export const OnboardingWidget: React.FC<{ inEditMode?: boolean }> = ({ inEditMode }) => (
    <Card isDraggable={inEditMode}>
        <CardHeader icon={AwardIcon} title="Onboarding Assessment" inEditMode={inEditMode} />
        <p className="text-body-md text-on-surface-variant mb-4">Re-evaluate your baseline and track your growth by retaking the initial assessment.</p>
        <Link to="/onboarding-assessment" className="w-full block text-center text-label-lg font-medium bg-secondary-container text-on-secondary-container py-2.5 rounded-full hover:shadow-md transition-all active:scale-95 transform hover:scale-[1.02]">
            View Assessment History
        </Link>
    </Card>
);
