import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    SearchIcon,
    CheckCircleIcon,
    PlusIcon,
    XIcon,
    InfoIcon,
    FilterIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MessageSquareIcon,
    ZapIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types & Constants
// =============================================================================

interface MarketingMethod {
    id: string;
    name: string;
    category: 'Digital' | 'Traditional' | 'Relationship' | 'Event' | 'Content';
    description?: string;
}

interface UserSelection {
    methodId: string;
    strategy: string;
    status: 'Planned' | 'Active' | 'On Hold';
}

const MARKETING_METHODS: MarketingMethod[] = [
    // Digital & Paid
    { id: 'webinars', name: 'Webinars', category: 'Digital' },
    { id: 'digital-funnels', name: 'Digital Funnels', category: 'Digital', description: 'Low price to Higher Price Offers, or Free Content to Phone Call' },
    { id: 'paid-ads', name: 'Paid Ads', category: 'Digital', description: 'Facebook, Google, TikTok, LinkedIn, YouTube, Twitter - With Re-Targeting' },
    { id: 'seo-blog', name: 'SEO Optimized Blog', category: 'Digital' },
    { id: 'social-media', name: 'Social Media', category: 'Digital', description: 'Facebook, Twitter, LinkedIn, Instagram, Pinterest, YouTube, TikTok, Clubhouse' },
    { id: 'marketplace', name: 'Sell on Big Search Engines', category: 'Digital', description: 'Amazon, Ebay, Etsy' },

    // Content & Media
    { id: 'podcasting', name: 'Podcasting & Live-Streaming', category: 'Content' },
    { id: 'guest-blogs', name: 'Guest-Post Blogs', category: 'Content', description: 'In Your Industry' },
    { id: 'video-promos', name: 'Video Promotions', category: 'Content' },
    { id: 'quizzes', name: 'Quizzes or Tests', category: 'Content' },
    { id: 'free-gifts', name: 'Free Gifts', category: 'Content', description: 'How To\'s, Templates, Products, Discounts' },
    { id: 'traditional-media', name: 'Traditional Media', category: 'Traditional', description: 'Radio, Television, Direct Mail, Print Ads, Billboards' },
    { id: 'pr', name: 'Public Relations', category: 'Traditional', description: 'TV, Magazine, Radio, Articles, Podcast Interviews' },

    // Relationship & Direct
    { id: 'nurture', name: 'Nurture (Email)', category: 'Relationship', description: 'Email Leads with Newsletters, Good content, and Offers' },
    { id: 'referral-programs', name: 'Referral Programs', category: 'Relationship' },
    { id: 'networking', name: 'Networking', category: 'Relationship' },
    { id: 'phone-calls', name: 'Phone Calls', category: 'Relationship' },
    { id: 'texting', name: 'Texting & Video Texting', category: 'Relationship' },
    { id: 'community', name: 'Community Building', category: 'Relationship', description: 'Build Forums, Online and Offline Groups' },
    { id: 'follow-up', name: 'Follow Up!', category: 'Relationship', description: 'Crucial: Follow up, Follow Up, FOLLOW UP!' },
    { id: 'database', name: 'Build Database with Opt-in', category: 'Relationship', description: '(Crucial)' },

    // Events & In-Person
    { id: 'speaking', name: 'Speaking Engagements', category: 'Event', description: 'As a Guest or Host' },
    { id: 'lead-events', name: 'Lead Events', category: 'Event', description: 'Workshops, Mixers' },
    { id: 'tradeshows', name: 'Attend / Speak at Tradeshows', category: 'Event' },
    { id: 'wine-dine', name: 'Wine and Dine', category: 'Event' },
    { id: 'guerrilla', name: 'Creative Guerrilla Marketing', category: 'Event' },

    // Partnerships & Other
    { id: 'joint-ventures', name: 'Joint Ventures', category: 'Relationship' },
    { id: 'sponsorships', name: 'Sponsorships', category: 'Traditional' },
    { id: 'contests', name: 'Contests', category: 'Content' },
    { id: 'promo-products', name: 'Promotional Products', category: 'Traditional', description: 'Personalized Gifts' },
];

const CATEGORIES = ['All', 'Digital', 'Content', 'Relationship', 'Event', 'Traditional'];

// =============================================================================
// Components
// =============================================================================

const MethodCard: React.FC<{
    method: MarketingMethod;
    isSelected: boolean;
    onToggle: () => void;
}> = ({ method, isSelected, onToggle }) => (
    <div
        onClick={onToggle}
        className={`
            cursor-pointer rounded-xl border p-4 transition-all duration-200 relative group
            ${isSelected
                ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
            }
        `}
    >
        <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${method.category === 'Digital' ? 'bg-indigo-100 text-indigo-700' :
                method.category === 'Content' ? 'bg-pink-100 text-pink-700' :
                    method.category === 'Relationship' ? 'bg-emerald-100 text-emerald-700' :
                        method.category === 'Event' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-700'
                }`}>
                {method.category}
            </span>
            {isSelected && <CheckCircleIcon className="w-5 h-5 text-blue-600 animate-in zoom-in duration-200" />}
        </div>

        <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
            {method.name}
        </h3>

        {method.description && (
            <p className="text-sm text-slate-500 leading-snug">
                {method.description}
            </p>
        )}
    </div>
);

const StrategyEditor: React.FC<{
    selection: UserSelection;
    methodName: string;
    onUpdate: (updates: Partial<UserSelection>) => void;
    onRemove: () => void;
}> = ({ selection, methodName, onUpdate, onRemove }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm animate-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-slate-800 flex items-center">
                <ZapIcon className="w-4 h-4 text-amber-500 mr-2" />
                {methodName}
            </h4>
            <div className="flex items-center gap-2">
                <select
                    value={selection.status}
                    onChange={(e) => onUpdate({ status: e.target.value as any })}
                    className="text-xs font-medium border-none bg-slate-100 rounded-md py-1 pl-2 pr-6 focus:ring-0 cursor-pointer"
                >
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                </select>
                <button
                    onClick={onRemove}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
        <textarea
            value={selection.strategy}
            onChange={(e) => onUpdate({ strategy: e.target.value })}
            placeholder={`How will you execute ${methodName}?`}
            className="w-full text-sm border-slate-200 rounded-md focus:border-blue-500 focus:ring-blue-500 min-h-[80px] text-slate-600 bg-slate-50"
        />
    </div>
);

export const MarketingMethodsPage: React.FC = () => {
    const [selections, setSelections] = useState<Record<string, UserSelection>>({});
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSelectionDrawer, setShowSelectionDrawer] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_marketing_methods');
        if (saved) {
            try {
                setSelections(JSON.parse(saved));
            } catch (e) { console.error(e); }
        }
    }, []);

    // Persistence
    useEffect(() => {
        localStorage.setItem('scaleit_marketing_methods', JSON.stringify(selections));
    }, [selections]);

    const toggleMethod = (methodId: string) => {
        setSelections(prev => {
            if (prev[methodId]) {
                const copy = { ...prev };
                delete copy[methodId];
                return copy;
            } else {
                return {
                    ...prev,
                    [methodId]: { methodId, strategy: '', status: 'Planned' }
                };
            }
        });
    };

    const updateSelection = (methodId: string, updates: Partial<UserSelection>) => {
        setSelections(prev => ({
            ...prev,
            [methodId]: { ...prev[methodId], ...updates }
        }));
    };

    const filteredMethods = MARKETING_METHODS.filter(m => {
        const matchesCategory = filterCategory === 'All' || m.category === filterCategory;
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        return matchesCategory && matchesSearch;
    });

    const activeSelectionCount = Object.keys(selections).length;

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 flex flex-col">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Marketing Methods Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        ScaleIt categorizes marketing into five core disciplines. Select the methods that best fit your business model and resources:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Digital:</strong> SEO, Paid Ads, Social Media, and Funnels.</li>
                        <li><strong>Content:</strong> Podcasting, Blogging, Video, and Quizzes.</li>
                        <li><strong>Relationship:</strong> Networking, Referrals, and Community.</li>
                        <li><strong>Event:</strong> Speaking, Workshops, and Tradeshows.</li>
                        <li><strong>Traditional:</strong> TV, Radio, Print, and Direct Mail.</li>
                    </ul>
                    <p>
                        Once selected, use the <strong>"My Strategy"</strong> panel to define specifically how you will implement each method.
                    </p>
                </div>
            </InstructionsModal>
            {/* Header */}
            <div className="sticky top-0 z-20 bg-slate-50">
                <PageHeader
                    title="Marketing Methods"
                    description=""
                    className="mb-0 shadow-none border-b-0"
                    onBack={() => navigate('/scaleit-method')}
                    backLabel="Back to SCALEit Method"
                >
                    <div className="flex items-center gap-2 mr-4">
                        <button
                            onClick={() => setShowInstructions(true)}
                            className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                        >
                            <InfoIcon className="w-4 h-4 text-blue-600" />
                            Instructions
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {activeSelectionCount} Selected
                        </span>
                        <div className="relative">
                            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tools..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
                            />
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <button
                            onClick={() => setShowSelectionDrawer(!showSelectionDrawer)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showSelectionDrawer ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <MessageSquareIcon className="w-4 h-4" />
                            My Strategy
                            {showSelectionDrawer ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                        </button>
                    </div>
                </PageHeader>

                {/* Category Filters */}
                <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth bg-white border-b border-slate-200 shadow-sm -mt-2 mb-4">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`
                                px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap
                                ${filterCategory === cat
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Grid */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                        {filteredMethods.map(method => (
                            <MethodCard
                                key={method.id}
                                method={method}
                                isSelected={!!selections[method.id]}
                                onToggle={() => toggleMethod(method.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Drawer - Strategy Editor */}
                {showSelectionDrawer && activeSelectionCount > 0 && (
                    <div className="w-96 bg-slate-50 border-l border-slate-200 overflow-y-auto p-6 shadow-xl z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-lg text-slate-800">Your Strategic Mix</h3>
                            <button onClick={() => setShowSelectionDrawer(false)} className="md:hidden">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-500 mb-4">
                            Define how you will execute each of your selected marketing methods.
                        </p>

                        {/* List selected items to edit */}
                        {Object.values(selections).map((sel: UserSelection) => {
                            const method = MARKETING_METHODS.find(m => m.id === sel.methodId);
                            if (!method) return null;
                            return (
                                <StrategyEditor
                                    key={sel.methodId}
                                    selection={sel}
                                    methodName={method.name}
                                    onUpdate={(updates) => updateSelection(sel.methodId, updates)}
                                    onRemove={() => toggleMethod(sel.methodId)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketingMethodsPage;
