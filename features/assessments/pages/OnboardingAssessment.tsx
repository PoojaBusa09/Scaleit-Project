
import React, { useState } from 'react';
import { MOCK_ASSESSMENT_HISTORY } from '../../../constants.ts';
import { AssessmentAttempt } from '../../../types.ts';
import {
    AwardIcon, HistoryIcon, ChevronRightIcon, UserIcon, BriefcaseIcon,
    ZapIcon, TargetIcon, SitemapIcon, UsersIcon, ArrowLeftIcon, CheckCircleIcon
} from '../../../components/icons.tsx';


// Define the shape of the form data to ensure type safety
interface FormData {
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    bio: string;
    quote: string;
    strengths: string;
    companyName: string;
    website: string;
    yearsInBusiness: string;
    employees: string;
    revenueLastYear: string;
    netProfitLastYear: string;
    revenueGoal: string;
    bookkeeper: string;
    businessTypeProductService: string[];
    businessDescription: string;
    challenge1: string;
    challenge2: string;
    workLifeBalance: string;
    worryVsPresent: string;
    accomplishment: string;
    leadershipTeamSize: string;
    leadershipPositions: string;
    goal1: string;
    goal2: string;
    measureSuccess: string;
    differentiation: string;
    customerFinding: string;
    financialConcerns: string;
    budget: string;
    decisionMaking: string;
    industryType: string;
    businessTypes: string[];
    businessModels: string[];
    accountabilityLevel: string;
    referralSource: string;
    decidingFactor: string;
}


// Helper Components defined outside to prevent re-mounting and focus loss
const FormInput = ({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    type = 'text',
    required = false
}: {
    label: string,
    name: string,
    value: string | number | string[],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder?: string,
    type?: string,
    required?: boolean
}) => {
    // Safely handle value type
    const displayValue = (typeof value === 'string' || typeof value === 'number') ? value : '';

    return (
        <div className="mb-6">
            <label className="block text-base font-bold text-on-surface mb-2 tracking-wide">
                {label} {required && <span className="text-error">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={displayValue}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-4 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface placeholder:text-on-surface-variant/70 text-base font-medium shadow-sm transition-all"
            />
        </div>
    );
};


const FormTextArea = ({
    label,
    name,
    value,
    onChange,
    rows = 3,
    required = false,
    maxLength
}: {
    label: string,
    name: string,
    value: string | number | string[],
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    rows?: number,
    required?: boolean,
    maxLength?: number
}) => {
    // Safely handle value type
    const displayValue = typeof value === 'string' ? value : '';


    return (
        <div className="mb-6">
            <label className="block text-base font-bold text-on-surface mb-2 tracking-wide">
                {label} {required && <span className="text-error">*</span>}
            </label>
            <textarea
                name={name}
                rows={rows}
                value={displayValue}
                onChange={onChange}
                className="w-full p-4 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface placeholder:text-on-surface-variant/70 text-base font-medium shadow-sm transition-all resize-none"
            />
            {maxLength && (
                <div className="text-right text-xs font-bold text-on-surface-variant mt-1">
                    {displayValue.length}/{maxLength} characters
                </div>
            )}
        </div>
    );
};


const OnboardingAssessment: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        // Personal
        facebook: '', twitter: '', linkedin: '', youtube: '', bio: '', quote: '', strengths: '',
        // Company
        companyName: '', website: '', yearsInBusiness: '', employees: '', revenueLastYear: '', netProfitLastYear: '', revenueGoal: '', bookkeeper: 'No',
        businessTypeProductService: [],
        businessDescription: '',
        // Challenges
        challenge1: '', challenge2: '', workLifeBalance: '', worryVsPresent: '', accomplishment: '', leadershipTeamSize: '', leadershipPositions: '',
        // Goals
        goal1: '', goal2: '', measureSuccess: '', differentiation: '', customerFinding: '', financialConcerns: '', budget: '', decisionMaking: '',
        // Model
        industryType: 'AV & Production Services', businessTypes: [], businessModels: [],
        // Mentor
        accountabilityLevel: 'High', referralSource: '', decidingFactor: ''
    });


    const tabs = [
        { id: 'personal', label: 'Personal', icon: UserIcon },
        { id: 'company', label: 'Company', icon: BriefcaseIcon },
        { id: 'challenges', label: 'Challenges', icon: ZapIcon },
        { id: 'goals', label: 'Goals', icon: TargetIcon },
        { id: 'model', label: 'Model', icon: SitemapIcon },
        { id: 'mentor', label: 'Mentor', icon: UsersIcon },
    ];


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleCheckboxChange = (name: keyof FormData, value: string) => {
        setFormData(prev => {
            const list = prev[name];
            if (Array.isArray(list)) {
                if (list.includes(value)) {
                    // @ts-ignore
                    return { ...prev, [name]: list.filter(item => item !== value) };
                } else {
                    // @ts-ignore
                    return { ...prev, [name]: [...list, value] };
                }
            }
            return prev;
        });
    };

    const handleRadioChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const renderTabContent = () => {
        switch (activeTab) {
            case 0: // Personal Details
                return (
                    <div className="animate-fade-in-up-fast space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Facebook Link" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="facebook.com/user" />
                            <FormInput label="Twitter Link" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="twitter.com/user" />
                            <FormInput label="Linkedin Link" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/user" />
                            <FormInput label="Youtube Link" name="youtube" value={formData.youtube} onChange={handleInputChange} placeholder="youtube.com/user" />
                        </div>
                        <FormTextArea label="My Bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} maxLength={5000} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormTextArea label="Your Favorite Quote" name="quote" value={formData.quote} onChange={handleInputChange} rows={3} maxLength={400} />
                            <FormTextArea label="Strengths I contribute" name="strengths" value={formData.strengths} onChange={handleInputChange} rows={3} maxLength={400} />
                        </div>
                    </div>
                );
            case 1: // Company Details
                return (
                    <div className="animate-fade-in-up-fast space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} />
                            <FormInput label="Company Website" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-6">
                                <label className="block text-base font-bold text-on-surface mb-2 tracking-wide">Years in business <span className="text-error">*</span></label>
                                <select name="yearsInBusiness" onChange={handleInputChange} value={formData.yearsInBusiness} className="w-full p-4 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-medium shadow-sm">
                                    <option value="">Select...</option>
                                    <option value="<1">Less than 1 year</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="5-10">5-10 years</option>
                                    <option value="10-20">10-20 years</option>
                                    <option value="20+">20+ years</option>
                                </select>
                            </div>
                            <FormInput label="Number of employees" name="employees" value={formData.employees} onChange={handleInputChange} type="number" required />
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Revenue Last Year" name="revenueLastYear" value={formData.revenueLastYear} onChange={handleInputChange} placeholder="$" required />
                            <FormInput label="Net Profit Last Year" name="netProfitLastYear" value={formData.netProfitLastYear} onChange={handleInputChange} placeholder="$" required />
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Revenue Goal (Current Year)" name="revenueGoal" value={formData.revenueGoal} onChange={handleInputChange} placeholder="$" required />
                            <div className="hidden md:block"></div> {/* Spacer */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="mb-6">
                                <label className="block text-base font-bold text-on-surface mb-2 tracking-wide">Monthly bookkeeper? <span className="text-error">*</span></label>
                                <div className="flex space-x-6">
                                    <label className="flex items-center space-x-3 cursor-pointer p-3 bg-surface-variant/20 rounded-lg hover:bg-surface-variant/40 border border-outline/20">
                                        <input type="radio" name="bookkeeper" value="Yes" checked={formData.bookkeeper === 'Yes'} onChange={() => handleRadioChange('bookkeeper', 'Yes')} className="text-primary focus:ring-primary h-5 w-5" />
                                        <span className="text-base font-bold text-on-surface">Yes</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer p-3 bg-surface-variant/20 rounded-lg hover:bg-surface-variant/40 border border-outline/20">
                                        <input type="radio" name="bookkeeper" value="No" checked={formData.bookkeeper === 'No'} onChange={() => handleRadioChange('bookkeeper', 'No')} className="text-primary focus:ring-primary h-5 w-5" />
                                        <span className="text-base font-bold text-on-surface">No</span>
                                    </label>
                                </div>
                            </div>


                            <div className="mb-6">
                                <label className="block text-base font-bold text-on-surface mb-2 tracking-wide">Product or Service? <span className="text-error">*</span></label>
                                <div className="space-y-2">
                                    {['Product', 'Service'].map(type => (
                                        <label key={type} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-surface-variant/20 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={formData.businessTypeProductService.includes(type)}
                                                onChange={() => handleCheckboxChange('businessTypeProductService', type)}
                                                className="rounded text-primary focus:ring-primary h-5 w-5"
                                            />
                                            <span className="text-base font-medium text-on-surface">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>


                        <FormTextArea label="Describe Your Business" name="businessDescription" value={formData.businessDescription} onChange={handleInputChange} rows={3} required maxLength={5000} />
                    </div>
                );
            case 2: // Challenges
                return (
                    <div className="animate-fade-in-up-fast space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormTextArea label="Top Challenge 1" name="challenge1" value={formData.challenge1} onChange={handleInputChange} rows={2} required maxLength={5000} />
                            <FormTextArea label="Top Challenge 2" name="challenge2" value={formData.challenge2} onChange={handleInputChange} rows={2} required maxLength={5000} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormTextArea label="How do you manage work-life balance?" name="workLifeBalance" value={formData.workLifeBalance} onChange={handleInputChange} rows={2} required maxLength={5000} />
                            <FormTextArea label="Do you worry or stay in the present?" name="worryVsPresent" value={formData.worryVsPresent} onChange={handleInputChange} rows={2} required maxLength={5000} />
                        </div>
                        <FormTextArea label="Biggest business accomplishment last year?" name="accomplishment" value={formData.accomplishment} onChange={handleInputChange} rows={2} required maxLength={5000} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Employees in leadership team?" name="leadershipTeamSize" value={formData.leadershipTeamSize} onChange={handleInputChange} type="number" required />
                            <FormTextArea label="What positions do they hold?" name="leadershipPositions" value={formData.leadershipPositions} onChange={handleInputChange} required maxLength={5000} rows={2} />
                        </div>
                    </div>
                );
            case 3: // Goals
                return (
                    <div className="animate-fade-in-up-fast space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormTextArea label="1st Goal for current year" name="goal1" value={formData.goal1} onChange={handleInputChange} rows={2} required maxLength={5000} />
                            <FormTextArea label="2nd Goal for current year" name="goal2" value={formData.goal2} onChange={handleInputChange} rows={2} required maxLength={5000} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormTextArea label="How do you measure success?" name="measureSuccess" value={formData.measureSuccess} onChange={handleInputChange} rows={2} required maxLength={5000} />
                            <FormTextArea label="How do you differentiate yourself?" name="differentiation" value={formData.differentiation} onChange={handleInputChange} rows={2} required maxLength={5000} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormTextArea label="How do customers find you?" name="customerFinding" value={formData.customerFinding} onChange={handleInputChange} rows={2} required maxLength={5000} />
                            <FormTextArea label="Any financial concerns?" name="financialConcerns" value={formData.financialConcerns} onChange={handleInputChange} rows={2} required maxLength={5000} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormTextArea label="Budget for business development?" name="budget" value={formData.budget} onChange={handleInputChange} rows={2} required maxLength={5000} />
                            <FormTextArea label="How do you approach decision-making?" name="decisionMaking" value={formData.decisionMaking} onChange={handleInputChange} rows={2} required maxLength={5000} />
                        </div>
                    </div>
                );
            case 4: // Business Model
                return (
                    <div className="animate-fade-in-up-fast space-y-6">
                        <div className="mb-6">
                            <label className="block text-base font-bold text-on-surface mb-2 tracking-wide">Industry Type <span className="text-error">*</span></label>
                            <select name="industryType" value={formData.industryType} onChange={handleInputChange} className="w-full p-4 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-medium shadow-sm">
                                <option value="AV & Production Services">AV & Production Services</option>
                                <option value="Accounting Services / CFO">Accounting Services / CFO</option>
                                <option value="Advertising">Advertising</option>
                                {/* ... truncated other options for brevity, usually handled by component ... */}
                                <option value="IT / Tech">IT / Tech</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Retail">Retail</option>
                                <option value="OTHER">OTHER</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-bold text-on-surface mb-3 tracking-wide">Your Business Type <span className="text-error">*</span></label>
                                <div className="space-y-2">
                                    {['Brick & Mortar', 'Consumer Goods Product', 'Digital Product', 'Consulting or Coaching', 'Professional Services', 'Manufacturer'].map(type => (
                                        <label key={type} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-surface-variant/20 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={formData.businessTypes.includes(type)}
                                                onChange={() => handleCheckboxChange('businessTypes', type)}
                                                className="rounded text-primary focus:ring-primary h-5 w-5"
                                            />
                                            <span className="text-base font-medium text-on-surface">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-base font-bold text-on-surface mb-3 tracking-wide">Your Business Model <span className="text-error">*</span></label>
                                <div className="space-y-2">
                                    {['B2B', 'B2C', 'B2G'].map(model => (
                                        <label key={model} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-surface-variant/20 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={formData.businessModels.includes(model)}
                                                onChange={() => handleCheckboxChange('businessModels', model)}
                                                className="rounded text-primary focus:ring-primary h-5 w-5"
                                            />
                                            <span className="text-base font-medium text-on-surface">{model}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5: // Mentor
                return (
                    <div className="animate-fade-in-up-fast space-y-6">
                        <div className="mb-6">
                            <label className="block text-base font-bold text-on-surface mb-2 tracking-wide">Accountability preference?</label>
                            <select name="accountabilityLevel" value={formData.accountabilityLevel} onChange={handleInputChange} className="w-full p-4 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-medium shadow-sm">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <FormTextArea label="How did you hear about us?" name="referralSource" value={formData.referralSource} onChange={handleInputChange} rows={3} required maxLength={5000} />
                        <FormTextArea label="What was the deciding factor to join?" name="decidingFactor" value={formData.decidingFactor} onChange={handleInputChange} rows={3} required maxLength={5000} />
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };


    if (isCreating) {
        return (
            <div className="bg-surface rounded-lg shadow-sm border border-outline/20">
                <div className="p-4 border-b border-outline/20 flex flex-col sm:flex-row justify-between items-center bg-surface z-10 gap-3 sm:gap-0 sticky top-0">
                    <button onClick={() => setIsCreating(false)} className="flex items-center justify-center sm:justify-start w-full sm:w-auto text-on-surface-variant hover:text-primary transition-colors text-sm font-bold p-2 rounded hover:bg-surface-variant/30">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to History
                    </button>
                    <div className="flex space-x-3 w-full sm:w-auto justify-center sm:justify-end">
                        <button
                            onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                            disabled={activeTab === 0}
                            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-on-surface-variant bg-surface-variant rounded-full disabled:opacity-50 hover:bg-surface-variant/80 transition-colors"
                        >
                            Previous
                        </button>
                        {activeTab < tabs.length - 1 ? (
                            <button
                                onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
                                className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-bold text-on-primary bg-primary rounded-full hover:shadow-md transition-all"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={() => { alert('Assessment Saved!'); setIsCreating(false); }}
                                className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-bold text-on-primary bg-tertiary rounded-full hover:shadow-md transition-all flex items-center justify-center"
                            >
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Submit
                            </button>
                        )}
                    </div>
                </div>


                <div className="flex flex-col min-h-[400px]">
                    {/* Top Horizontal Tabs */}
                    <div className="border-b border-outline/20 bg-surface w-full overflow-x-auto no-scrollbar">
                        <div className="flex px-4 min-w-max">
                            {tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === index;
                                const isCompleted = index < activeTab;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(index)}
                                        className={`flex items-center justify-center py-4 px-6 text-sm font-bold border-b-4 transition-all whitespace-nowrap ${isActive
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'
                                            }`}
                                    >
                                        <Icon className={`h-5 w-5 mr-2 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                                        {tab.label}
                                        {isCompleted && !isActive && <CheckCircleIcon className="h-4 w-4 ml-2 text-primary" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col bg-surface">
                        <div className="p-4 sm:p-8 flex-1 max-w-4xl mx-auto w-full">
                            <h2 className="text-2xl font-extrabold text-on-surface mb-8 flex items-center">
                                {React.createElement(tabs[activeTab].icon, { className: "h-7 w-7 mr-3 text-primary" })}
                                {tabs[activeTab].label}
                            </h2>
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-surface p-4 sm:p-6 rounded-lg shadow-sm border border-outline/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-headline-sm text-on-surface">Onboarding Assessment</h2>
                    <p className="text-body-md text-on-surface-variant mt-1">Track your initial business baseline.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="w-full sm:w-auto bg-primary text-on-primary px-6 py-2.5 rounded-full hover:shadow-lg text-sm font-bold flex items-center justify-center whitespace-nowrap"
                >
                    <AwardIcon className="h-5 w-5 mr-2" />
                    Start New Assessment
                </button>
            </div>


            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-outline">
                            <th className="px-6 py-3 text-left text-label-lg font-bold text-on-surface">Date</th>
                            <th className="px-6 py-3 text-left text-label-lg font-bold text-on-surface">Version</th>
                            <th className="px-6 py-3 text-left text-label-lg font-bold text-on-surface">Score</th>
                            <th className="px-6 py-3 text-right text-label-lg font-bold text-on-surface">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ASSESSMENT_HISTORY.map((assessment: AssessmentAttempt) => (
                            <tr key={assessment.id} className="border-b border-surface-variant hover:bg-surface-variant/50 transition-colors">
                                <td className="px-6 py-4 text-body-md font-medium text-on-surface">{assessment.date}</td>
                                <td className="px-6 py-4 text-body-md font-medium text-on-surface">{assessment.version}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
                                        {assessment.score}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:underline text-sm font-bold flex items-center justify-end w-full">
                                        View Details <ChevronRightIcon className="h-4 w-4 ml-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default OnboardingAssessment;
