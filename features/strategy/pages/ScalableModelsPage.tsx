import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    PlusIcon,
    ChevronRightIcon,
    CheckCircleIcon,
    UsersIcon,
    GlobeIcon,
    ZapIcon,
    AwardIcon,
    TrendingUpIcon,
    DollarSignIcon,
    LayoutGridIcon,
    BriefcaseIcon,
    CalendarIcon,
    ShieldIcon,
    CopyIcon,
    HomeIcon,
    ChevronLeftIcon,
    PrinterIcon,
    InfoIcon
} from '../../../components/icons.tsx';
import { PageHeader } from '../../../components/PageHeader.tsx';

import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

import { mockDataService } from '../../../services/mockDataService.ts';
import { ModelHistory } from '../types.ts';

// Remove local MOCK_HISTORY and ModelHistory interface

/**
 * Definition of a scalable model option.
 */
interface ModelDefinition {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
}

const MODEL_DEFINITIONS: ModelDefinition[] = [
    { id: 'team', title: 'Replicate Your Talent With A TEAM', description: 'Hire and train people to do what you do.', icon: UsersIcon },
    { id: 'community', title: 'Build A Community That Builds Your Community', description: 'Leverage network effects and user-generated growth.', icon: UsersIcon },
    { id: 'service-product', title: 'Add A Service To Your Product Or Vice Versa', description: 'Bundle offerings to increase value and retention.', icon: HomeIcon },
    { id: 'licensing', title: 'Licensing Your Signature Products, Programs Or Services', description: 'Let others sell your IP for a fee.', icon: ShieldIcon },
    { id: 'technology', title: 'Your Own Technology', description: 'Build software or tools to automate or scale value.', icon: ZapIcon },
    { id: 'locations', title: 'Same Model, Expand Locations Nationally / Globally', description: 'Geographic expansion of a working model.', icon: GlobeIcon },
    { id: 'competitors', title: 'Buy Your Competitors', description: 'Acquire market share and reduce competition.', icon: BriefcaseIcon },
    { id: 'pop-up', title: 'Create Multiple Pop-Up Shops', description: 'Temporary retail locations to test markets.', icon: HomeIcon },
    { id: 'upsells', title: 'Add Up-Sells And Cross-Sells', description: 'Increase customer lifetime value.', icon: TrendingUpIcon },
    { id: 'certification', title: 'Certification Programs', description: 'Train others to use your methodology.', icon: AwardIcon },
    { id: 'subscription', title: 'Monthly Subscription Service Or Service Plans', description: 'Recurring revenue models.', icon: CalendarIcon },
    { id: 'monetize-license', title: 'Buy Licenses To Monetize', description: 'License other products to sell to your audience.', icon: DollarSignIcon },
    { id: 'distribution', title: 'National Distribution Team', description: 'Build a sales force to cover more ground.', icon: GlobeIcon },
    { id: 'workshops', title: 'Replicate Intro Workshops Nationally / Globally', description: 'Standardized events to acquire customers.', icon: LayoutGridIcon },
    { id: 'franchise', title: 'Build A Franchise Model', description: 'Package your business for others to own and operate.', icon: CopyIcon },
];

/**
 * ScalableModels Page Component.
 * Allows users to evaluate different scalable business models and save their choices.
 */
export const ScalableModels: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    // Wizard State
    const [currentStep, setCurrentStep] = useState(0);
    const [inputs, setInputs] = useState<Record<string, string>>({});

    // Fetch data from service
    // In a real app, use useEffect. For mock, calling directly is fine but re-renders might duplicate without care.
    // Better to state it.
    const [history, setHistory] = useState<ModelHistory[]>(mockDataService.getScalableModelHistory());

    React.useEffect(() => {
        setHistory(mockDataService.getScalableModelHistory());
    }, [isEditing]); // Refresh when toggling view

    /**
     * Updates the input for the current model step.
     */
    const handleInputChange = (value: string) => {
        const modelId = MODEL_DEFINITIONS[currentStep].id;
        setInputs(prev => ({ ...prev, [modelId]: value }));
    };

    /**
     * Advances to the next step in the wizard.
     */
    const handleNext = () => {
        if (currentStep < MODEL_DEFINITIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    /**
     * Goes back to the previous step in the wizard.
     */
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    /**
     * Saves the completed plan.
     */
    const handleSave = () => {
        const newEntry: ModelHistory = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            version: `v${(history.length + 1).toFixed(1)} - Draft`,
            topChoice: 'Pending Review', // Logic to determine top choice?
            status: 'Active',
            answers: inputs
        };

        mockDataService.addScalableModel(newEntry);
        console.log('Scalable Models Plan Saved!', inputs);

        setIsEditing(false);
        setCurrentStep(0); // Reset wizard
        setInputs({});
    };

    /**
     * Generates a printable view of the model plan.
     * Note: Uses document.write in a new window for print preview.
     */
    const handlePrint = (plan: ModelHistory) => {
        const printContent = `
            <html>
            <head>
                <title>15 Scalable Models - ${plan.version}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
                    h1 { color: #0c2340; border-bottom: 2px solid #0c2340; padding-bottom: 10px; margin-bottom: 30px; }
                    .meta { margin-bottom: 40px; background: #f5f7fa; padding: 20px; border-radius: 8px; }
                    .meta-item { margin-bottom: 10px; font-size: 14px; }
                    .meta-label { font-weight: bold; color: #666; margin-right: 10px; }
                    .model-section { margin-bottom: 30px; page-break-inside: avoid; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; }
                    .model-title { font-size: 18px; font-weight: bold; color: #0c2340; margin-bottom: 10px; }
                    .model-desc { font-style: italic; color: #666; margin-bottom: 15px; font-size: 14px; }
                    .response { background: #fff; padding: 0; line-height: 1.6; }
                    .empty-response { color: #999; font-style: italic; }
                    @media print {
                        body { padding: 0; }
                        .model-section { border: none; border-bottom: 1px solid #eee; padding: 20px 0; }
                    }
                </style>
            </head>
            <body>
                <h1>15 Scalable Models Evaluation</h1>
                <div class="meta">
                    <div class="meta-item"><span class="meta-label">Version:</span> ${plan.version}</div>
                    <div class="meta-item"><span class="meta-label">Date:</span> ${plan.date}</div>
                    <div class="meta-item"><span class="meta-label">Top Choice:</span> ${plan.topChoice}</div>
                    <div class="meta-item"><span class="meta-label">Status:</span> ${plan.status}</div>
                </div>

                ${MODEL_DEFINITIONS.map(model => `
                    <div class="model-section">
                        <div class="model-title">${model.title}</div>
                        <div class="model-desc">${model.description}</div>
                        <div class="response">
                            ${/* In a real app we'd pull the actual saved data here */ ''}
                            ${model.id === 'licensing' ? 'We can license our core curriculum to other coaching organizations. This requires finalizing the IP ownership structure.' : '<span class="empty-response">No notes added.</span>'}
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    };

    // HISTORY VIEW
    if (!isEditing) {
        return (
            <div className="pb-10 animate-fade-in">
                <InstructionsModal
                    isOpen={showInstructions}
                    onClose={() => setShowInstructions(false)}
                    title="15 Scalable Models Instructions"
                >
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Purpose</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Brainstorm on the best Scalable Model or Models to multiply the growth and valuation of your company.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Directions</h3>
                            <ul className="list-disc pl-5 space-y-3 text-slate-600">
                                <li>
                                    Discuss with your Mentor and Mastermind which model would be best for your business.
                                </li>
                                <li>
                                    Focus on what would be the <strong>easiest</strong>, create the <strong>greatest wealth</strong>, help the <strong>most people</strong>, and be <strong>fun</strong>.
                                </li>
                            </ul>
                        </section>
                    </div>
                </InstructionsModal>

                <PageHeader
                    title="15 Scalable Models"
                    description="Brainstorm on the best Scalable Model or Models to multiply the growth and valuation of your company."
                    onBack={() => navigate(-1)}
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
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-primary text-on-primary px-4 py-2 rounded-lg hover:shadow-md text-sm font-bold flex items-center transition-all"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                            Start New Brainstorm
                        </button>
                    </div>
                </PageHeader>

                <div className="bg-surface p-8 rounded-lg shadow-sm border border-outline/20">

                    <div className="overflow-x-auto">
                        <table className="min-w-full" aria-label="Scalable Models History">
                            <thead>
                                <tr className="border-b border-outline">
                                    <th scope="col" className="px-6 py-4 text-left text-label-lg font-bold text-on-surface uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-4 text-left text-label-lg font-bold text-on-surface uppercase tracking-wider">Version</th>
                                    <th scope="col" className="px-6 py-4 text-left text-label-lg font-bold text-on-surface uppercase tracking-wider">Selected Model</th>
                                    <th scope="col" className="px-6 py-4 text-left text-label-lg font-bold text-on-surface uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right text-label-lg font-bold text-on-surface uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((plan) => (
                                    <tr key={plan.id} className="border-b border-surface-variant hover:bg-surface-variant/30 transition-colors">
                                        <td className="px-6 py-4 text-body-md font-medium text-on-surface">{plan.date}</td>
                                        <td className="px-6 py-4 text-body-md font-medium text-on-surface">{plan.version}</td>
                                        <td className="px-6 py-4 text-body-md font-bold text-primary">{plan.topChoice}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {plan.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handlePrint(plan)}
                                                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
                                                    title="Print Report"
                                                    aria-label={`Print report for ${plan.version}`}
                                                >
                                                    <PrinterIcon className="h-4 w-4" aria-hidden="true" />
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="text-primary hover:text-primary-dark hover:underline text-sm font-bold flex items-center"
                                                    aria-label={`View details for ${plan.version}`}
                                                >
                                                    View Details <ChevronRightIcon className="h-4 w-4 ml-1" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    const currentModel = MODEL_DEFINITIONS[currentStep];
    const progressPercentage = ((currentStep + 1) / MODEL_DEFINITIONS.length) * 100;
    const Icon = currentModel.icon;

    // EDITOR VIEW (WIZARD)
    return (
        <div className="pb-10 max-w-4xl mx-auto animate-fade-in">
            <PageHeader
                title="Evaluate Scalable Models"
                description={`Step ${currentStep + 1} of ${MODEL_DEFINITIONS.length}`}
                onBack={() => { setIsEditing(false); setCurrentStep(0); }}
                backLabel="Back to History"
            />

            {/* Progress Bar */}
            <div
                className="w-full bg-outline/20 rounded-full h-2.5 mb-8"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress"
            >
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            {/* Main Input Card */}
            <div className="bg-surface rounded-xl shadow-md border border-outline/20 overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-8 border-b border-outline/10 bg-surface-variant/5">
                    <div className="flex items-start gap-5">
                        <div className="p-4 bg-primary/10 rounded-xl shrink-0" aria-hidden="true">
                            <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-headline-md font-bold text-on-surface mb-2">{currentModel.title}</h2>
                            <p className="text-title-md text-on-surface-variant">{currentModel.description}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                    <label htmlFor={`model-input-${currentModel.id}`} className="block text-label-lg font-bold text-on-surface mb-3">How could this apply to your business?</label>
                    <textarea
                        id={`model-input-${currentModel.id}`}
                        autoFocus
                        className="w-full flex-1 p-4 text-body-lg bg-background border border-outline/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none placeholder:text-on-surface-variant/40"
                        placeholder="Brainstorm your ideas here..."
                        value={inputs[currentModel.id] || ''}
                        onChange={(e) => handleInputChange(e.target.value)}
                    ></textarea>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`flex items-center px-6 py-3 rounded-full font-bold transition-colors ${currentStep === 0
                        ? 'text-on-surface-variant/40 cursor-not-allowed'
                        : 'bg-surface border border-outline hover:bg-surface-variant text-on-surface'
                        }`}
                >
                    <ChevronLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Previous
                </button>

                {currentStep < MODEL_DEFINITIONS.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="flex items-center px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                        Next Model
                        <ChevronRightIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        className="flex items-center px-8 py-3 rounded-full bg-green-600 text-white font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                        Complete & Save
                        <CheckCircleIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                    </button>
                )}
            </div>
        </div>
    );
};
