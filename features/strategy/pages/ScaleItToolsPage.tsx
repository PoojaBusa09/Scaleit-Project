
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { SCALEIT_METHOD_STRUCTURE } from '../../../data/mockMentors.ts';
import { ScaleITCategory } from '../../../types.ts';
import {
    TargetIcon,
    TrendingUpIcon,
    UsersIcon,
    HeartHandshakeIcon,
    ClipboardCheckIcon,
    ChevronRightIcon,
    FileTextIcon,
    BarChartIcon,
    AwardIcon,
    LayoutGridIcon,
    MapPinIcon,
    CommunityIcon,
    DollarSignIcon,
    Activity,
    BriefcaseIcon,
    GitBranchIcon,
    BookOpenIcon,
    AlertTriangleIcon,
    HistoryIcon,
    CalendarIcon,
    LightbulbIcon
} from '../../../components/icons.tsx';

// Simple search icon component
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
)

// --- Constants ---

const TOOL_DESCRIPTIONS: { [key: string]: string } = {
    // Strategic Vision (S)
    'My Strategic Plan': 'Your roadmap for growth, outlining your vision, mission, and key objectives for the future.',
    '15 Scalable Models': 'Model your business after proven scalable structures to accelerate growth and increase overall profitability.',
    'Gap Analysis': 'Bring awareness to your business\'s superpowers, opportunities, and trends to identify critical areas for growth.',
    'North Star Metrics': 'Track the primary performance indicators that define success across every department in your organization.',

    // Cash Flow (C)
    'Sales & Marketing Blueprint': 'Map out high-impact sales and marketing strategies to drive consistent and scalable cash flow.',
    'Perfect Client Decoder': 'Define your ideal customer profile by identifying their demographics, psychographics, and core pain points.',
    'Champion Customer Journey': 'Map every touchpoint of your customer\'s experience, from initial awareness to becoming a loyal brand champion.',
    'Marketing Methods': 'Strategize and select the most effective marketing channels and tactics for your specific business goals.',

    // Alliance (A)
    'Perfect Employee Decoder': 'Define the ideal profile for your next hire to ensure cultural alignment and peak performance.',
    '4 Superpowers': 'Identify your core business superpower and align your team\'s responsibilities with their unique strengths.',
    'My Success Team': 'Visualize and manage your organizational structure with a dynamic and intuitive org chart builder.',
    'Hire for Growth': 'Set success benchmarks and track the financial return on investment for every new team member you hire.',
    'Hero Team Journey': 'Standardize and optimize the onboarding and growth phases of every new team member\'s journey.',
    'Org Chart Builder': 'Create a visual representation of your company\'s roles, responsibilities, and reporting lines.',

    // Leadership (L)
    'Leadership Assessment': 'Evaluate how you show up as a leader to identify personal growth areas and improve team motivation.',
    'Old Story / New Story': 'Transform limiting beliefs into empowering narratives that drive confidence and opportunity.',
    'Money Mindset Equation': 'Map the thoughts and feelings that create your financial results to break through your belief ceilings.',
    'Fear Leaping': 'Identify critical actions you\'ve been avoiding and calculate the real financial cost of inaction.',

    // Execution (E)
    'Quarterly Action Plan': 'Focus your team on the \'Big Rocks\' and key milestones required to achieve your quarterly objectives.',
    'The Systemizer': 'Streamline and document your business processes to ensure consistent excellence and operational efficiency.',
    'RoadMap': 'Visualize your long-term growth trajectory and celebrate the milestones on your path to success.',
    'Team Retreat Builder': 'Plan and facilitate high-impact retreats that align your team and accelerate your strategic goals.',
    'Brainstorm Builder': 'Lead productive and creative sessions to solve complex problems and drive innovation.',
    'Recurring Meeting Flow': 'Optimize internal communication with structured meeting cadences that keep everyone aligned.',
    'Quarterly Reflections': 'Review your progress, celebrate wins, and learn from challenges to improve future performance.',
};

const CATEGORY_DETAILS: { [key in ScaleITCategory]: { icon: React.ElementType, color: string, description: string } } = {
    S: { icon: TargetIcon, color: 'text-error', description: 'Define your long-term vision and create a clear roadmap for success.' },
    C: { icon: TrendingUpIcon, color: 'text-green-600', description: 'Master your revenue streams and optimize financial performance.' },
    A: { icon: UsersIcon, color: 'text-blue-600', description: 'Build and align a high-performing team to drive your vision forward.' },
    L: { icon: HeartHandshakeIcon, color: 'text-purple-600', description: 'Develop your leadership skills to inspire and empower your team.' },
    E: { icon: ClipboardCheckIcon, color: 'text-yellow-600', description: 'Implement systems and processes to ensure consistent, scalable results.' },
    I: { icon: LightbulbIcon, color: 'text-indigo-600', description: 'Foster innovation and discover new frameworks for growth.' },
    T: { icon: Activity, color: 'text-teal-600', description: 'Leverage technology and insightful assessments to drive decisions.' },
};

const TOOL_ICONS: { [key: string]: React.ElementType } = {
    // S - Strategy
    'My Strategic Plan': FileTextIcon,
    '15 Scalable Models': LayoutGridIcon,
    'Gap Analysis': TrendingUpIcon,
    'North Star Metrics': TargetIcon,

    // C - Cash
    'Sales & Marketing Blueprint': MapPinIcon,
    'Perfect Client Decoder': UsersIcon,
    'Champion Customer Journey': MapPinIcon,
    'Marketing Methods': CommunityIcon,
    'Financial Forecasting': DollarSignIcon,

    // A - Alliance
    'Perfect Employee Decoder': UsersIcon,
    '4 Superpowers': Activity,
    'My Success Team': UsersIcon,
    'Hire for Growth': BriefcaseIcon,
    'Hero Team Journey': MapPinIcon,
    'Org Chart Builder': GitBranchIcon,

    // L - Leadership
    'Leadership Assessment': BarChartIcon,
    'Old Story / New Story': BookOpenIcon,
    'Money Mindset Equation': DollarSignIcon,
    'Fear Leaping': AlertTriangleIcon,

    // E - Execution
    'Quarterly Reflections': HistoryIcon,
    'The Systemizer': LayoutGridIcon,
    'RoadMap': MapPinIcon,
    'Team Retreat Builder': CalendarIcon,
    'Brainstorm Builder': LightbulbIcon,
    'Recurring Meeting Flow': CalendarIcon,
    'Action Plan': ClipboardCheckIcon,
    'Quarterly Action Plan': ClipboardCheckIcon
};

// --- Components ---

interface ScaleItToolsPageProps {
    activeTab?: ScaleITCategory;
}

/**
 * ScaleIt Tools Page
 * Central hub for accessing all SCALEit method tools, organized by category (S-C-A-L-E).
 */
export const ScaleItToolsPage: React.FC<ScaleItToolsPageProps> = ({ activeTab: initialTab }) => {
    const [activeTab, setActiveTab] = useState<ScaleITCategory>(initialTab || 'S');
    const [searchTerm, setSearchTerm] = useState('');
    const [pinnedTools, setPinnedTools] = useState<string[]>(() => {
        try { return JSON.parse(localStorage.getItem('pinnedScaleItTools') || '[]'); } catch { return []; }
    });

    const togglePin = (name: string) => {
        setPinnedTools(prev => {
            const next = prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name].slice(-8);
            localStorage.setItem('pinnedScaleItTools', JSON.stringify(next));
            return next;
        });
    };

    const activeSection = SCALEIT_METHOD_STRUCTURE.find(section => section.id === activeTab);
    const filteredTools = activeSection?.tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="relative p-1 md:p-4 min-h-full transition-all duration-700">
            {/* Background Decorative Blobs */}
            <div className="fixed top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-soft" />
            <div className="fixed bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <PageHeader
                    title="SCALEIT Method®"
                    description="Your comprehensive toolkit for business growth, from vision to execution."
                />
                <div className="relative mt-4 md:mt-0 md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Tools"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3 border border-white/40 rounded-2xl leading-5 bg-white/20 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="backdrop-blur-2xl bg-white/40 p-6 md:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60">

                {/* SCALEIT Filter - Compact Centered Letters */}
                <div className="w-full overflow-x-auto no-scrollbar py-4 mb-6 md:mb-8 border-b border-white/20 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center sm:justify-center gap-2 sm:gap-3 w-max min-w-full pb-2 px-2 sm:px-0">
                        {SCALEIT_METHOD_STRUCTURE.map((section) => {
                            const isActive = activeTab === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveTab(section.id)}
                                    className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-base md:text-lg font-black transition-all border ${isActive
                                        ? 'bg-primary text-white border-primary shadow-xl scale-110 z-10'
                                        : 'bg-white/30 backdrop-blur-md text-primary/80 border-white/40 hover:border-primary/20 hover:bg-white/50 active:scale-95'
                                        }`}
                                    title={`${section.id} - ${section.name}`}
                                >
                                    {section.id}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {activeSection && (
                    <div
                        key={activeSection.id}
                        className="animate-fade-in-up"
                        role="tabpanel"
                        id={`panel-${activeSection.id}`}
                        aria-labelledby={`tab-${activeSection.id}`}
                    >
                        <h3 className="text-2xl font-black text-on-surface tracking-tight">{activeSection.name}</h3>
                        <p className="text-body-lg text-on-surface-variant mt-1 mb-6">{CATEGORY_DETAILS[activeSection.id].description}</p>

                        {(activeSection.id === 'I' || activeSection.id === 'T') ? (
                            <div className="bg-surface-variant/20 rounded-2xl border-2 border-dashed border-outline/30 p-12 text-center animate-pulse-soft">
                                <div className="flex flex-col items-center max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-inner mb-4">
                                        <LightbulbIcon className="h-8 w-8 text-primary opacity-50" />
                                    </div>
                                    <h4 className="text-title-lg font-bold text-on-surface mb-2">Coming Soon</h4>
                                    <p className="text-body-md text-on-surface-variant">
                                        We are currently developing the tools and assessments for the <span className="font-bold text-on-surface">{activeSection.name}</span> pillar.
                                        This section will soon be populated with strategic resources to help you scale.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('S')}
                                        className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-full hover:shadow-lg transition-all text-label-lg font-medium"
                                    >
                                        Explore Strategy Tools
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredTools.length > 0 ? filteredTools.map(tool => {
                                    const ToolIcon = TOOL_ICONS[tool.name] || ChevronRightIcon;
                                    return (
                                        <div key={tool.name} className="relative group block p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 hover:border-white hover:bg-white/40 hover:shadow-2xl transition-all transform hover:-translate-y-2 active:scale-95">
                                            <Link
                                                to={tool.path}
                                                className="absolute inset-0 z-0 rounded-2xl"
                                                aria-label={`Go to ${tool.name}`}
                                            />
                                            <div className="relative z-10 flex justify-between items-start pointer-events-none">
                                                <div className="flex-1 pr-4">
                                                    <h4 className="font-bold text-lg text-on-surface mb-2 group-hover:text-black transition-colors">{tool.name}</h4>
                                                    <p className="text-sm text-on-surface-variant/80 mt-1 leading-relaxed">
                                                        {TOOL_DESCRIPTIONS[tool.name] || `Access the ${tool.name} tool.`}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-3 pointer-events-auto">
                                                    <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm pointer-events-none">
                                                        <ToolIcon className="h-5 w-5 transition-colors" aria-hidden="true" />
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePin(tool.name); }}
                                                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-colors shadow-sm active:scale-95 ${pinnedTools.includes(tool.name) ? 'bg-primary text-white border-primary' : 'bg-white/50 text-gray-700 border-white hover:bg-primary hover:text-white'}`}
                                                    >
                                                        {pinnedTools.includes(tool.name) ? "Pinned" : "Pin"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-8 text-center text-on-surface-variant">
                                        No tools found matching your search.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};