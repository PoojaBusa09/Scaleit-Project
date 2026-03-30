import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    InfoIcon,
    CopyIcon,
    FileTextIcon,
    ChevronLeftIcon,
    LockIcon,
    Trash2Icon,
    PrinterIcon,
    XIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types & Constants
// =============================================================================

interface BlueprintData {
    revenueStreams: string;
    scalableModel: string;
    targetMarket: string;
    whereToFindThem: string;
    howToReachThem: string;
    messaging: string;
    nurtureProspects: string;
    closeSale: string;
    longTermRelationships: string;
    upsellsCrossSells: string;
    referralCommunity: string;
}

const INITIAL_DATA: BlueprintData = {
    revenueStreams: '',
    scalableModel: '',
    targetMarket: '',
    whereToFindThem: '',
    howToReachThem: '',
    messaging: '',
    nurtureProspects: '',
    closeSale: '',
    longTermRelationships: '',
    upsellsCrossSells: '',
    referralCommunity: ''
};

const STEPS = [
    { key: 'revenueStreams', number: 1, title: 'My Revenue Streams', hint: 'List your Products and/or Services' },
    { key: 'scalableModel', number: 2, title: 'My Scale Strategy', hint: 'What is your Scalable Model? (If you don\'t have one leave blank for now.)' },
    { key: 'targetMarket', number: 3, title: 'My Target Market', hint: 'Write your Target Market by describing your Perfect Fit Customer.' },
    { key: 'whereToFindThem', number: 4, title: 'Where to Find Them', hint: 'List places your Perfect Fit Clients can be reached (physical or digital).' },
    { key: 'howToReachThem', number: 5, title: 'How to Reach Them', hint: 'Determine the easiest and most effective way to attract your clients.' },
    { key: 'messaging', number: 6, title: 'My Messaging', hint: 'List your Main Messaging Points. Speak to their pain and desires.' },
    { key: 'nurtureProspects', number: 7, title: 'Nurture Prospects into Leads', hint: 'How will you build credibility and trust? (Emails, texts, gifts...)' },
    { key: 'closeSale', number: 8, title: 'Close the Sale', hint: 'Decide the best action to take based on your product/business model.' },
    { key: 'longTermRelationships', number: 9, title: 'Build Long-Term Relationships', hint: 'How will you surprise and delight your customer?' },
    { key: 'upsellsCrossSells', number: 10, title: 'Up-Sells / Cross-Sells', hint: 'What else can you sell to them to add value?' },
    { key: 'referralCommunity', number: 11, title: 'Build a Referral Community', hint: 'Structured systems: Referral Program, Affiliates, etc.' },
];

// =============================================================================
// Components
// =============================================================================

const BlueprintCard: React.FC<{
    step: typeof STEPS[0];
    value: string;
    onChange: (val: string) => void;
}> = ({ step, value, onChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {step.number}
                </div>
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{step.title}</h3>
            </div>
            <div className="flex-1 p-3">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={step.hint}
                    className="w-full h-full min-h-[120px] resize-none border-none focus:ring-0 text-slate-600 placeholder:text-slate-400 text-sm bg-transparent"
                />
            </div>
        </div>
    );
};

export const SalesMarketingBlueprintPage: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [data, setData] = useState<BlueprintData>(INITIAL_DATA);

    // Load data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_sales_blueprint');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load blueprint data', e);
            }
        }
    }, []);

    // Save data to localStorage on change
    useEffect(() => {
        if (data !== INITIAL_DATA) {
            localStorage.setItem('scaleit_sales_blueprint', JSON.stringify(data));
        }
    }, [data]);

    const handleUpdate = (key: keyof BlueprintData, value: string) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Sales & Marketing Blueprint Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        The Sales & Marketing Blueprint is an 11-step framework designed to help you map out the entire customer journey from discovery to referral.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">Marketing Steps</h4>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Ideal Client</li>
                                <li>The Hook</li>
                                <li>Lead Magnet</li>
                                <li>Marketing Channels</li>
                                <li>The Filter</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">Sales & Service</h4>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Sales Conversation</li>
                                <li>The Product</li>
                                <li>WOW Delivery</li>
                                <li>Referral Loop</li>
                            </ul>
                        </div>
                    </div>
                    <p>
                        Filling out each section ensures consistency in your messaging and helps you identify bottlenecks in your conversion process.
                    </p>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Sales & Marketing Blueprint"
                description="Your complete 11-Step Sales and Marketing Journey."
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
                        <PrinterIcon className="w-4 h-4" />
                    </button>
                </div>
            </PageHeader>

            {/* Main Content Grid */}
            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STEPS.map((step) => (
                        <BlueprintCard
                            key={step.key}
                            step={step}
                            value={data[step.key as keyof BlueprintData]}
                            onChange={(val) => handleUpdate(step.key as keyof BlueprintData, val)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesMarketingBlueprintPage;
