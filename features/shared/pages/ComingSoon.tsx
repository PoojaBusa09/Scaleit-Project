import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { ArrowLeftIcon, ConstructionIcon } from '../../../components/icons.tsx';

const ComingSoon: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract tool name from path if possible, e.g. /tools/my-tool -> My Tool
    const getToolName = () => {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (!lastPart) return 'New Tool';

        return lastPart
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const toolName = getToolName();

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-body-md font-bold text-on-surface hover:text-primary mb-6 group transition-colors"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Go Back
            </button>

            <PageHeader
                title={toolName}
                description="This feature is currently under development."
            >
            </PageHeader>

            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface rounded-lg shadow-sm border border-outline/20 p-12 text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                    <ConstructionIcon className="h-12 w-12 text-primary/60" />
                </div>

                <h2 className="text-display-sm font-bold text-on-surface mb-4">Coming Eventually</h2>
                <p className="text-body-lg text-on-surface-variant max-w-lg mb-8">
                    We're working hard to bring you the <strong>{toolName}</strong>.
                    Stay tuned for updates as we continue to expand the SCALEit platform.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/scaleit-method')}
                        className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Explore Other Tools
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
