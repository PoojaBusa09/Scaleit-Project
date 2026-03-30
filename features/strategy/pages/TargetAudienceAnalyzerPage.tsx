import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, SparklesIcon, UsersIcon, ZapIcon, InfoIcon } from '../../../components/icons.tsx';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// --- Constants ---

const BUSINESS_INPUTS = [
    { id: 'desc', label: 'Business Description', placeholder: 'What does your company do? What is your mission?', rows: 4 },
    { id: 'products', label: 'Products or Services', placeholder: 'List your main offerings.', rows: 4 },
    { id: 'usp', label: 'Unique Selling Proposition', placeholder: 'What makes you different from competitors?', rows: 2 },
];

const RECOMMENDED_PERSONAS = [
    {
        title: '"Startup Sarah"',
        description: 'Early-stage tech founder, 28-35 years old. Needs scalable marketing tools. Values efficiency and data-driven results. Active on LinkedIn and tech forums.'
    },
    {
        title: '"Growth-Minded Gary"',
        description: 'Owner of a 5-year-old service business, 40-55. Looking to expand to a new market. Seeks strategic advice and financial planning tools. Responds to email marketing and webinars.'
    }
];

const SUGGESTED_CHANNELS = [
    { title: 'Content Marketing:', detail: 'Focus on blog posts about scaling challenges for "Startup Sarah".' },
    { title: 'LinkedIn Ads:', detail: 'Target users with job titles like "Founder" or "CEO" in the tech industry.' },
    { title: 'Email Nurture Sequence:', detail: 'Create a campaign for "Growth-Minded Gary" focused on financial ROI.' },
    { title: 'Webinars:', detail: 'Host sessions on "Scaling Your Service Business" to attract qualified leads.' },
];

// --- Components ---

interface TextAreaWithLabelProps {
    label: string;
    placeholder: string;
    rows?: number;
    id?: string;
}

/**
 * Reusable Text Area component with label.
 */
const TextAreaWithLabel: React.FC<TextAreaWithLabelProps> = ({ label, placeholder, rows = 3, id }) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-base font-bold text-on-surface mb-2 tracking-wide">{label}</label>
        <textarea
            id={id}
            rows={rows}
            className="w-full p-4 bg-surface border border-outline rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-medium placeholder:text-on-surface-variant/70 text-base"
            placeholder={placeholder}
            aria-label={label}
        ></textarea>
    </div>
);


/**
 * Target Audience Analyzer Page.
 * Uses AI (simulated) to generate customer personas and marketing channels.
 */
const TargetAudienceAnalyzer: React.FC = () => {
    const navigate = useNavigate();
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <div className="animate-fade-in text-slate-900">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Target Audience Analyzer Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        This AI-powered tool helps you identify your ideal customer segments and the best channels to reach them.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Input:</strong> Provide a clear description of your business, what you sell, and what makes you unique.</li>
                        <li><strong>Analyze:</strong> Click "Generate Analysis" to let Pinnacle AI process your inputs.</li>
                        <li><strong>Refine:</strong> Use the generated personas to focus your marketing messaging and channel selection.</li>
                    </ul>
                    <p>
                        The more specific you are in your business description, the more accurate the AI suggestions will be.
                    </p>
                </div>
            </InstructionsModal>
            <PageHeader
                title="AI Target Audience Analyzer"
                description="Provide details about your business, and Pinnacle AI will generate ideal customer personas and suggest marketing channels."
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                </div>
            </PageHeader>
            <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-extrabold text-on-surface border-b border-outline/20 pb-3">1. Tell us about your business</h3>
                        {BUSINESS_INPUTS.map((input, index) => (
                            <TextAreaWithLabel
                                key={index}
                                label={input.label}
                                placeholder={input.placeholder}
                                rows={input.rows}
                                id={`input-${input.id}`}
                            />
                        ))}
                        <button
                            className="w-full flex items-center justify-center bg-primary text-on-primary px-4 py-3.5 rounded-full hover:shadow-lg text-lg font-bold transition-all transform hover:scale-[1.02]"
                            aria-label="Generate AI Analysis of Target Audience"
                        >
                            <SparklesIcon className="h-6 w-6 mr-2" />
                            Generate Analysis
                        </button>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-6" role="region" aria-label="Analysis Results">
                        <div className="p-6 bg-primary-container/30 rounded-xl border border-primary/20">
                            <h3 className="font-bold text-xl text-on-primary-container flex items-center mb-4">
                                <UsersIcon className="h-7 w-7 mr-3 text-primary" />
                                Recommended Customer Personas
                            </h3>
                            <div className="space-y-4">
                                {RECOMMENDED_PERSONAS.map((persona, index) => (
                                    <div key={index} className="bg-surface p-5 rounded-lg shadow-sm border border-outline/10">
                                        <h4 className="font-bold text-on-surface text-xl">{persona.title}</h4>
                                        <p className="text-base text-on-surface font-medium mt-2 leading-relaxed">{persona.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-secondary-container/30 rounded-xl border border-secondary/20">
                            <h3 className="font-bold text-xl text-on-secondary-container flex items-center mb-4">
                                <ZapIcon className="h-7 w-7 mr-3 text-secondary" />
                                Suggested Marketing Channels
                            </h3>
                            <ul className="list-disc list-inside space-y-3 text-base font-bold text-on-secondary-container">
                                {SUGGESTED_CHANNELS.map((channel, index) => (
                                    <li key={index}>
                                        {channel.title} <span className="font-medium">{channel.detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TargetAudienceAnalyzer;
