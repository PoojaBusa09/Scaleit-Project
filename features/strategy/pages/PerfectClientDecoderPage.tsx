import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
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
    Trash2Icon,
    LockIcon,
    FileTextIcon,
    SaveIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types & Constants
// =============================================================================

interface Demographics {
    gender: string;
    maritalStatus: string;
    ageRange: string;
    incomeLevel: string;
    educationLevel: string;
    location: string;
    healthStatus: string;
    lifePhase: string;
}

interface Psychographics {
    personality: string;
    fun: string;
    organizations: string;
    causes: string;
    socialPlatforms: string;
    publications: string;
    purchases: string;
    nightWorry: string;
    secretDesire: string;
    feelAboutIndustry: string;
    solveProblems: string;
}

interface ClientProfile {
    demographics: Demographics;
    psychographics: Psychographics;
}

const INITIAL_PROFILE: ClientProfile = {
    demographics: {
        gender: '', maritalStatus: '', ageRange: '', incomeLevel: '',
        educationLevel: '', location: '', healthStatus: '', lifePhase: ''
    },
    psychographics: {
        personality: '', fun: '', organizations: '', causes: '',
        socialPlatforms: '', publications: '', purchases: '', nightWorry: '',
        secretDesire: '', feelAboutIndustry: '', solveProblems: ''
    }
};

const STEPS = [
    { title: 'The Basics', description: 'Define the core demographics of your avatar.', icon: UserIcon },
    { title: 'Inner World', description: 'Understand their personality, values, and fears.', icon: HeartIcon },
    { title: 'Lifestyle & Behavior', description: 'Where do they hang out and what do they consume?', icon: MapPinIcon },
    { title: 'Pain & Gain', description: 'Identify their deepest problems and desires.', icon: BriefcaseIcon }
];

// Dropdown Options
const GENDER_OPTIONS = ['Male', 'Female', 'Non-Binary', 'Any'];
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed', 'Any'];
const AGE_RANGE_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const INCOME_LEVEL_OPTIONS = ['Under $50k', '$50k-$100k', '$100k-$250k', '$250k+'];
const EDUCATION_LEVEL_OPTIONS = ['High School', 'College', 'Graduate', 'PhD'];

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

export const PerfectClientDecoderPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showInstructions, setShowInstructions] = useState(false);
    const [profile, setProfile] = useState<ClientProfile>(INITIAL_PROFILE);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_perfect_client');
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
            } catch (e) { console.error(e); }
        }
    }, []);

    // Save on Change
    useEffect(() => {
        localStorage.setItem('scaleit_perfect_client', JSON.stringify(profile));
    }, [profile]);

    const updateDemo = (field: keyof Demographics, value: string) => {
        setProfile(prev => ({ ...prev, demographics: { ...prev.demographics, [field]: value } }));
    };

    const updatePsycho = (field: keyof Psychographics, value: string) => {
        setProfile(prev => ({ ...prev, psychographics: { ...prev.psychographics, [field]: value } }));
    };

    const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Perfect Client Decoder Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        The Perfect Client Decoder helps you build a detailed profile of your ideal customer, moving beyond basic demographics into deep psychographic insights.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 italic text-sm">
                        "If you speak to everyone, you speak to no one."
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Demographics:</strong> The 'Who' - gender, age, location, and status.</li>
                        <li><strong>Psychographics:</strong> The 'Why' - fears, desires, habits, and motivations.</li>
                    </ul>
                    <p>
                        Complete all steps to generate a clear picture of who your marketing should target and what messaging will resonate most powerfully with them.
                    </p>
                </div>
            </InstructionsModal>

            {/* Top Bar */}
            <PageHeader
                title="Perfect Client Decoder"
                description=""
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
            >
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <FileTextIcon className="w-4 h-4" />
                        New Version
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <CopyIcon className="w-4 h-4" />
                        Copy
                    </button>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors bg-white border border-slate-200">
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                </div>
            </PageHeader>

            {/* Wizard Container */}
            <div className="max-w-5xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Progress Bar */}
                <div className="mb-8">
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

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                    {/* Left Panel: Demographics (Always Visible but Highlighted based on Step?) 
                        Actually, let's follow the user's "Split Layout" request but inside the wizard context.
                        Or maybe wizard splits the questions? 
                        The screenshot showed Demographics on Left, Questions on Right.
                        Let's keep that static structure but use the wizard to guide through the RIGHT side questions 
                        while the LEFT side remains editable throughout as a reference "Profile Card".
                    */}

                    {/* Left Column: Demographics Profile Card */}
                    <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <UserIcon className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Demographics</h3>
                        </div>

                        <div className="space-y-1">
                            <SelectField label="Gender" value={profile.demographics.gender} options={GENDER_OPTIONS} onChange={(v) => updateDemo('gender', v)} />
                            <SelectField label="Marital Status" value={profile.demographics.maritalStatus} options={MARITAL_STATUS_OPTIONS} onChange={(v) => updateDemo('maritalStatus', v)} />
                            <SelectField label="Age Range" value={profile.demographics.ageRange} options={AGE_RANGE_OPTIONS} onChange={(v) => updateDemo('ageRange', v)} />
                            <SelectField label="Income Level" value={profile.demographics.incomeLevel} options={INCOME_LEVEL_OPTIONS} onChange={(v) => updateDemo('incomeLevel', v)} />
                            <SelectField label="Education Level" value={profile.demographics.educationLevel} options={EDUCATION_LEVEL_OPTIONS} onChange={(v) => updateDemo('educationLevel', v)} />

                            <InputField label="Where Do They Live?" value={profile.demographics.location} onChange={(v) => updateDemo('location', v)} placeholder="City, Suburbs, Rural..." />
                            <InputField label="What Is Their Health Status?" value={profile.demographics.healthStatus} onChange={(v) => updateDemo('healthStatus', v)} placeholder="Active, Sedentary..." />
                            <InputField label="What Phase Of Life Are They In?" value={profile.demographics.lifePhase} onChange={(v) => updateDemo('lifePhase', v)} placeholder="Student, Parent, Retired..." />
                        </div>
                    </div>

                    {/* Right Column: Psychographics Wizard */}
                    <div className="w-full md:w-2/3 p-8 flex flex-col">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    {React.createElement(STEPS[currentStep].icon, { className: "w-6 h-6" })}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{STEPS[currentStep].title}</h2>
                                    <p className="text-slate-500">{STEPS[currentStep].description}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {currentStep === 0 && (
                                    <>
                                        <TextAreaField
                                            label="Describe Their Personality"
                                            value={profile.psychographics.personality}
                                            onChange={(v) => updatePsycho('personality', v)}
                                            placeholder="e.g. Outgoing, analytical, creative, risk-taker..."
                                        />
                                        <TextAreaField
                                            label="What Do They Do For Fun?"
                                            value={profile.psychographics.fun}
                                            onChange={(v) => updatePsycho('fun', v)}
                                            placeholder="e.g. Hiking, reading, gaming, travel..."
                                        />
                                    </>
                                )}
                                {currentStep === 1 && (
                                    <>
                                        <TextAreaField
                                            label="What Associations Or Organizations Do They Belong To?"
                                            value={profile.psychographics.organizations}
                                            onChange={(v) => updatePsycho('organizations', v)}
                                        />
                                        <TextAreaField
                                            label="What Causes Do They Support?"
                                            value={profile.psychographics.causes}
                                            onChange={(v) => updatePsycho('causes', v)}
                                        />
                                    </>
                                )}
                                {currentStep === 2 && (
                                    <>
                                        <TextAreaField
                                            label="What Social Platforms Do They Use Most?"
                                            value={profile.psychographics.socialPlatforms}
                                            onChange={(v) => updatePsycho('socialPlatforms', v)}
                                        />
                                        <TextAreaField
                                            label="What Publications Or Blogs Do They Read?"
                                            value={profile.psychographics.publications}
                                            onChange={(v) => updatePsycho('publications', v)}
                                        />
                                        <TextAreaField
                                            label="What Are Their Favorite Purchases?"
                                            value={profile.psychographics.purchases}
                                            onChange={(v) => updatePsycho('purchases', v)}
                                        />
                                    </>
                                )}
                                {currentStep === 3 && (
                                    <>
                                        <TextAreaField
                                            label="What Problems Keep Them Up At Night?"
                                            value={profile.psychographics.nightWorry}
                                            onChange={(v) => updatePsycho('nightWorry', v)}
                                        />
                                        <TextAreaField
                                            label="What Do They Secretly Desire Most?"
                                            value={profile.psychographics.secretDesire}
                                            onChange={(v) => updatePsycho('secretDesire', v)}
                                        />
                                        <TextAreaField
                                            label="How Do They Feel About Your Business/Industry/Product/Service?"
                                            value={profile.psychographics.feelAboutIndustry}
                                            onChange={(v) => updatePsycho('feelAboutIndustry', v)}
                                        />
                                        <TextAreaField
                                            label="How Can You Solve Their Problems?"
                                            value={profile.psychographics.solveProblems}
                                            onChange={(v) => updatePsycho('solveProblems', v)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Wizard Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
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

                            {currentStep < STEPS.length - 1 ? (
                                <button
                                    onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                                    className="flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    Next Step
                                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/scaleit-method')}
                                    className="flex items-center px-6 py-3 rounded-full bg-green-600 text-white font-bold hover:bg-green-700 hover:shadow-lg transition-all transform hover:scale-105"
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
    );
};

export default PerfectClientDecoderPage;
