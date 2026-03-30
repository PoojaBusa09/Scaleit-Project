
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SCALEIT_METHOD_STRUCTURE } from '../../../data/mockMentors.ts';
import { ScaleITCategory } from '../../../types.ts';
import { ChevronLeftIcon, TargetIcon, TrendingUpIcon, UsersIcon, HeartHandshakeIcon, ClipboardCheckIcon } from '../../../components/icons.tsx';

const categoryDetails: { [key in ScaleITCategory]: { icon: React.ElementType, color: string } } = {
    S: { icon: TargetIcon, color: 'text-error' },
    C: { icon: TrendingUpIcon, color: 'text-green-600' },
    A: { icon: UsersIcon, color: 'text-blue-600' },
    L: { icon: HeartHandshakeIcon, color: 'text-purple-600' },
    E: { icon: ClipboardCheckIcon, color: 'text-yellow-600' },
};

const AssessmentQuestion: React.FC<{ question: string }> = ({ question }) => (
    <div className="bg-surface-variant/50 p-6 rounded-lg mb-6 border border-outline">
        <p className="text-xl font-bold text-on-surface leading-snug">{question}</p>
        <div className="flex space-x-6 mt-6">
            {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer p-2 rounded hover:bg-surface-variant/50 transition-colors">
                    <input type="radio" name={question} value={value} className="h-6 w-6 text-primary border-outline focus:ring-primary mb-2" />
                    <span className="text-base font-bold text-on-surface">{value}</span>
                </label>
            ))}
        </div>
        <div className="flex justify-between mt-1 text-xs font-bold text-on-surface-variant px-1">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
        </div>
    </div>
);

const BusinessAssessment: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ScaleITCategory>('S');

    return (
        <div>
            <Link to="/scaleit-method" className="inline-flex items-center text-body-md font-bold text-on-surface hover:text-primary mb-4 group">
                <ChevronLeftIcon className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to SCALEit Method
            </Link>

            <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
                <h2 className="text-headline-sm text-on-surface font-bold">SCALEit Business Assessment</h2>
                <p className="text-body-lg text-on-surface font-medium mt-1 mb-8">Rate your business on a scale of 1-5 across the core pillars of the SCALEit Method to identify strengths and opportunities.</p>

                <div className="border-b border-outline mb-8">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
                        {SCALEIT_METHOD_STRUCTURE.map(section => {
                            const IconComponent = categoryDetails[section.id].icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveTab(section.id)}
                                    className={`flex items-center whitespace-nowrap py-4 px-6 border-b-4 font-bold text-base transition-all ${activeTab === section.id
                                        ? `border-primary text-primary bg-primary/5 ${categoryDetails[section.id].color}`
                                        : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'
                                        }`}
                                >
                                    <IconComponent className="h-5 w-5 mr-2" />
                                    {section.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div key={activeTab} className="animate-fade-in-up-fast max-w-4xl mx-auto">
                    {activeTab === 'S' && (
                        <div className="space-y-2">
                            <AssessmentQuestion question="Our company has a clearly defined and documented vision statement that guides our decisions." />
                            <AssessmentQuestion question="We have a clear 3-year strategic plan with measurable goals." />
                        </div>
                    )}
                    {activeTab === 'C' && (
                        <div className="space-y-2">
                            <AssessmentQuestion question="We have a predictable and scalable lead generation system." />
                            <AssessmentQuestion question="Our cash flow is consistently positive and predictable." />
                        </div>
                    )}
                    {activeTab === 'A' && (
                        <div className="space-y-2">
                            <AssessmentQuestion question="We have the right people in the right seats on our team." />
                            <AssessmentQuestion question="Our team is highly aligned and accountable to their roles." />
                        </div>
                    )}
                    {activeTab === 'L' && (
                        <div className="space-y-2">
                            <AssessmentQuestion question="Leadership effectively communicates the company vision and strategy to the entire team." />
                            <AssessmentQuestion question="Leadership empowers team members and avoids micromanagement." />
                        </div>
                    )}
                    {activeTab === 'E' && (
                        <div className="space-y-2">
                            <AssessmentQuestion question="Our core business processes are documented and followed consistently." />
                            <AssessmentQuestion question="We have a clear system for setting and tracking quarterly priorities (Rocks)." />
                        </div>
                    )}
                </div>
                <div className="mt-8 text-center border-t border-outline/20 pt-6">
                    <button className="bg-primary text-on-primary px-10 py-3.5 rounded-full hover:shadow-lg text-lg font-bold transition-all transform hover:scale-105">
                        Submit & View Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessAssessment;
