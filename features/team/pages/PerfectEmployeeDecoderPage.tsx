import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import {
    ChevronRightIcon,
    ChevronLeftIcon,
    PrinterIcon,
    CheckCircleIcon,
    CopyIcon,
    InfoIcon,
    XIcon,
    UserIcon,
    HeartIcon,
    MapPinIcon,
    BriefcaseIcon,
    FileTextIcon,
    SearchIcon,
    StarIcon,
    TargetIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// Types & Constants
// =============================================================================

interface EmployeeDemographics {
    positionRole: string;
    gender: string;
    maritalStatus: string; // "Marital / Single"
    ageRange: string;
    householdIncome: string; // "Household / Lifestyle Income Level?"
    educationLevel: string;
    location: string; // "Where do they live?"
    vacation: string; // "Where do they vacation?"
    healthHobbies: string; // "What are their health habits?"
    lifePhase: string; // "What phase of life are they in?"
    device: string; // "Does Not Work / iPhone?" (Maybe Device preference?) -> Let's interpret as "Tech Usage / Phone"
    outOfRole: string; // "What do they want out of this role?"
}

interface EmployeePsychographics {
    fun: string; // "What do they do for fun?"
    organizations: string; // "What associations or organizations do they support?"
    skills: string; // "What skills do they possess?"
    socialMedia: string; // "Which social media platforms do they use?"
    mediaConsumption: string; // "What publications/blogs/podcasts do they like?"
    personality: string; // "Describe their personality."
    passions: string; // "What passions keep them up at night?"
    desires: string; // "What do they want the most?"
    feelingsAboutBusiness: string; // "How do they feel about your business, industry, product or service?"
    jobSearch: string; // "Where would this Job Seeker look for a job?"
}

interface EmployeeProfile {
    demographics: EmployeeDemographics;
    psychographics: EmployeePsychographics;
}

const INITIAL_PROFILE: EmployeeProfile = {
    demographics: {
        positionRole: '',
        gender: '',
        maritalStatus: '',
        ageRange: '',
        householdIncome: '',
        educationLevel: '',
        location: '',
        vacation: '',
        healthHobbies: '',
        lifePhase: '',
        device: '',
        outOfRole: ''
    },
    psychographics: {
        fun: '',
        organizations: '',
        skills: '',
        socialMedia: '',
        mediaConsumption: '',
        personality: '',
        passions: '',
        desires: '',
        feelingsAboutBusiness: '',
        jobSearch: ''
    }
};

const STEPS = [
    { title: 'The Basics & Skills', description: 'Define the core traits and capabilities.', icon: UserIcon },
    { title: 'Interests & Habits', description: 'Understand their lifestyle and media consumption.', icon: HeartIcon },
    { title: 'Motivations & Drivers', description: 'What drives them and what do they truly want?', icon: TargetIcon }, // "What do they want the most?"
    { title: 'Professional Alignment', description: 'How they view your business and where to find them.', icon: BriefcaseIcon }
];

// Dropdown Options
const GENDER_OPTIONS = ['Male', 'Female', 'Non-Binary', 'Any'];
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed', 'Any'];
const AGE_RANGE_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const EDUCATION_LEVEL_OPTIONS = ['High School', 'College', 'Graduate', 'PhD', 'Self-Taught / Certifications'];

// =============================================================================
// Components
// =============================================================================



const SelectField: React.FC<{
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
            <option value="">Select an option</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder={placeholder}
        />
    </div>
);

const TextAreaField: React.FC<{
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
            placeholder={placeholder}
            rows={rows}
        />
    </div>
);

export const PerfectEmployeeDecoderPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showInstructions, setShowInstructions] = useState(false);
    const [profile, setProfile] = useState<EmployeeProfile>(INITIAL_PROFILE);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_perfect_employee');
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
            } catch (e) {
                console.error(e);
                setShowInstructions(true);
            }
        } else {
            setShowInstructions(true);
        }
    }, []);

    // Save on Change
    useEffect(() => {
        localStorage.setItem('scaleit_perfect_employee', JSON.stringify(profile));
    }, [profile]);

    const updateDemo = (field: keyof EmployeeDemographics, value: string) => {
        setProfile(prev => ({ ...prev, demographics: { ...prev.demographics, [field]: value } }));
    };

    const updatePsycho = (field: keyof EmployeePsychographics, value: string) => {
        setProfile(prev => ({ ...prev, psychographics: { ...prev.psychographics, [field]: value } }));
    };

    const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Perfect Employee Decoder"
                subtitle="Identify the traits and characteristics of your ideal team members."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Purpose</h3>
                        <p className="text-slate-600">The ideal team members are those who:</p>
                        <ol className="list-decimal pl-5 mt-2 space-y-1 text-slate-600">
                            <li>Have the skills and experience relevant to your business needs.</li>
                            <li>Embody your company values and culture.</li>
                            <li>Are motivated and demonstrate a strong work ethic.</li>
                            <li>Communicate effectively and contribute positively to the team.</li>
                            <li>Show reliability and consistently perform well.</li>
                        </ol>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Directions</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Reflect on your highest-performing team members that embody the values and culture of your organization.
                            Consult with your leadership team and gather feedback. Use these insights to guide your recruitment strategies.
                        </p>
                    </div>
                </div>
            </InstructionsModal>

            {/* Top Bar */}
            <PageHeader
                title="Perfect Employee Decoder"
                description=""
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
                className="shrink-0"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to start over? This will clear current data.")) {
                                setProfile(INITIAL_PROFILE);
                                setCurrentStep(0);
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        <FileTextIcon className="w-4 h-4" />
                        New Version
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <CopyIcon className="w-4 h-4" />
                        Copy
                    </button>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4" />
                        Instructions
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors bg-white border border-slate-200">
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                </div>
            </PageHeader>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden p-6 flex flex-col">
                <div className="max-w-7xl mx-auto w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Progress Bar */}
                    <div className="mb-6 shrink-0">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-700">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</span>
                            <span className="text-sm text-slate-500">{Math.round(progressPercentage)}% Complete</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Split View Container */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col lg:flex-row flex-1 min-h-0">

                        {/* Left Column: Demographics Profile Card - Scrollable */}
                        <div className="w-full lg:w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col h-full min-h-0">
                            <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0 sticky top-0 z-10 flex items-center gap-2 text-slate-800">
                                <UserIcon className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Employee Profile</h3>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 space-y-2">
                                <InputField label="Position / Role" value={profile.demographics.positionRole} onChange={(v) => updateDemo('positionRole', v)} placeholder="e.g. Sales Manager" />
                                <SelectField label="Gender" value={profile.demographics.gender} options={GENDER_OPTIONS} onChange={(v) => updateDemo('gender', v)} />
                                <SelectField label="Marital / Single" value={profile.demographics.maritalStatus} options={MARITAL_STATUS_OPTIONS} onChange={(v) => updateDemo('maritalStatus', v)} />
                                <SelectField label="Age Range" value={profile.demographics.ageRange} options={AGE_RANGE_OPTIONS} onChange={(v) => updateDemo('ageRange', v)} />
                                <SelectField label="Income Level" value={profile.demographics.householdIncome} options={['Entry Level', 'Mid-Level', 'Senior Level', 'Executive']} onChange={(v) => updateDemo('householdIncome', v)} />
                                <SelectField label="Education Level" value={profile.demographics.educationLevel} options={EDUCATION_LEVEL_OPTIONS} onChange={(v) => updateDemo('educationLevel', v)} />

                                <div className="my-4 border-t border-slate-200 pt-4 space-y-2">
                                    <InputField label="Where do they live?" value={profile.demographics.location} onChange={(v) => updateDemo('location', v)} placeholder="City, Commute time..." />
                                    <InputField label="Where do they vacation?" value={profile.demographics.vacation} onChange={(v) => updateDemo('vacation', v)} placeholder="" />
                                    <InputField label="What are their health habits?" value={profile.demographics.healthHobbies} onChange={(v) => updateDemo('healthHobbies', v)} placeholder="Gym, Sports, Meditation..." />
                                    <InputField label="What phase of life are they in?" value={profile.demographics.lifePhase} onChange={(v) => updateDemo('lifePhase', v)} placeholder="Building career, Raising family..." />
                                    <InputField label="Device Preference (Work/Life)" value={profile.demographics.device} onChange={(v) => updateDemo('device', v)} placeholder="iPhone, Android, Mac, PC..." />
                                    <TextAreaField label="What do they want out of this role?" value={profile.demographics.outOfRole} onChange={(v) => updateDemo('outOfRole', v)} rows={2} placeholder="Growth, Stability, Money..." />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Psychographics Wizard - Scrollable */}
                        <div className="w-full lg:w-2/3 flex flex-col h-full min-h-0">

                            {/* Wizard Header */}
                            <div className="p-8 pb-0 shrink-0">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                        {React.createElement(STEPS[currentStep].icon, { className: "w-6 h-6" })}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">{STEPS[currentStep].title}</h2>
                                        <p className="text-slate-500">{STEPS[currentStep].description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Wizard Content */}
                            <div className="p-8 pt-0 overflow-y-auto flex-1">
                                <div className="space-y-6" key={currentStep}>
                                    {currentStep === 0 && (
                                        <>
                                            <TextAreaField
                                                label="Describe their personality characteristics"
                                                value={profile.psychographics.personality}
                                                onChange={(v) => updatePsycho('personality', v)}
                                                placeholder="e.g. Ambitious, Detail-oriented, Team player, Introverted/Extroverted..."
                                                rows={4}
                                            />
                                            <TextAreaField
                                                label="What skills do they possess?"
                                                value={profile.psychographics.skills}
                                                onChange={(v) => updatePsycho('skills', v)}
                                                placeholder="e.g. Project Management, Python, Public Speaking, Negotiation..."
                                                rows={4}
                                            />
                                        </>
                                    )}
                                    {currentStep === 1 && (
                                        <>
                                            <TextAreaField
                                                label="What do they do for fun?"
                                                value={profile.psychographics.fun}
                                                onChange={(v) => updatePsycho('fun', v)}
                                                placeholder="Hobbies, Interests outside work..."
                                            />
                                            <TextAreaField
                                                label="What associations or organizations do they support?"
                                                value={profile.psychographics.organizations}
                                                onChange={(v) => updatePsycho('organizations', v)}
                                                placeholder="Professional bodies, Charities, Clubs..."
                                            />
                                            <TextAreaField
                                                label="Which social media platforms do they use?"
                                                value={profile.psychographics.socialMedia}
                                                onChange={(v) => updatePsycho('socialMedia', v)}
                                                placeholder="LinkedIn, Twitter, Instagram..."
                                            />
                                            <TextAreaField
                                                label="What publications, blogs, or podcasts do they like?"
                                                value={profile.psychographics.mediaConsumption}
                                                onChange={(v) => updatePsycho('mediaConsumption', v)}
                                                placeholder="Industry news, specific authors..."
                                            />
                                        </>
                                    )}
                                    {currentStep === 2 && (
                                        <>
                                            <TextAreaField
                                                label="What passions keep them up at night?"
                                                value={profile.psychographics.passions}
                                                onChange={(v) => updatePsycho('passions', v)}
                                                placeholder="What are they really passionate about solving or achieving?"
                                            />
                                            <TextAreaField
                                                label="What do they want the most?"
                                                value={profile.psychographics.desires}
                                                onChange={(v) => updatePsycho('desires', v)}
                                                placeholder="Career advancement, Work-life balance, Impact..."
                                            />
                                        </>
                                    )}
                                    {currentStep === 3 && (
                                        <>
                                            <TextAreaField
                                                label="How do they feel about your business, industry, product or service?"
                                                value={profile.psychographics.feelingsAboutBusiness}
                                                onChange={(v) => updatePsycho('feelingsAboutBusiness', v)}
                                                placeholder="Are they excited? Skeptical? passionate?"
                                                rows={4}
                                            />
                                            <TextAreaField
                                                label="Where would this Job Seeker look for a job?"
                                                value={profile.psychographics.jobSearch}
                                                onChange={(v) => updatePsycho('jobSearch', v)}
                                                placeholder="LinkedIn, Indeed, Referrals, Industry events..."
                                                rows={4}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Wizard Footer - Buttons */}
                            <div className="p-8 pt-6 border-t border-slate-100 bg-white shrink-0 mt-auto">
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                        disabled={currentStep === 0}
                                        className={`flex items-center px-4 py-2 rounded-lg font-bold transition-colors ${currentStep === 0
                                            ? 'text-slate-300 cursor-not-allowed'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                                        Back
                                    </button>

                                    <div className="flex gap-2">
                                        {currentStep < STEPS.length - 1 ? (
                                            <button
                                                onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                                                className="flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg transition-all transform hover:scale-105 shadow-md"
                                            >
                                                Next Step
                                                <ChevronRightIcon className="h-5 w-5 ml-2" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/scaleit-method')}
                                                className="flex items-center px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:shadow-lg transition-all transform hover:scale-105 shadow-md"
                                            >
                                                Finish & Save
                                                <CheckCircleIcon className="h-5 w-5 ml-2" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfectEmployeeDecoderPage;
