import React, { useState } from "react";
import { MOCK_MENTOR_CLIENTS } from "../../../data/mockMentors.ts";
import { MentorClient } from "../types.ts";
import { PageHeader } from "../../../components/PageHeader.tsx";
import { InstructionsModal } from "../../../components/InstructionsModal.tsx";

const STATUS_MAP = {
    excelling: { label: "Excelling", color: "bg-green-100 text-green-700 border-green-200" },
    onTrack: { label: "On Track", color: "bg-blue-100 text-blue-700 border-blue-200" },
    atRisk: { label: "At Risk", color: "bg-red-100 text-red-700 border-red-200" },
};

const MemberStatusPage: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [groupFilter, setGroupFilter] = useState<string>('all');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const primaryClients = MOCK_MENTOR_CLIENTS.filter(c => !c.isShared);
    const sharedClients = MOCK_MENTOR_CLIENTS.filter(c => c.isShared);

    const allGroups = Array.from(new Set(MOCK_MENTOR_CLIENTS.map(c => c.mastermindGroup).filter(Boolean))) as string[];

    const applyFilters = (clients: MentorClient[]) => {
        let filtered = clients;
        if (filter === 'active') filtered = filtered.filter(c => c.isActive !== false);
        if (filter === 'inactive') filtered = filtered.filter(c => c.isActive === false);
        if (groupFilter !== 'all') filtered = filtered.filter(c => c.mastermindGroup === groupFilter);
        return filtered;
    };

    const renderMemberRow = (client: MentorClient) => {
        const statusCfg = STATUS_MAP[client.status];
        const isExpanded = expandedId === client.id;
        const renewalDate = client.renewalDate ? new Date(client.renewalDate) : null;
        const isRenewalSoon = renewalDate && (renewalDate.getTime() - Date.now()) < 90 * 24 * 60 * 60 * 1000;

        return (
            <div key={client.id} className="border border-outline-variant rounded-xl overflow-hidden transition-all">
                <button
                    onClick={() => setExpandedId(isExpanded ? null : client.id)}
                    className="w-full text-left p-4 flex items-center gap-4 hover:bg-surface-container-high/50 transition-colors"
                >
                    <img src={client.avatarUrl} alt={client.name} className="w-11 h-11 rounded-full object-cover border-2 border-outline-variant flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-on-surface">{client.name}</span>
                            {client.isActive === false && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 uppercase">Inactive</span>
                            )}
                            {client.isShared && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase">Shared</span>
                            )}
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">{client.company} · {client.industry}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusCfg.color}`}>{statusCfg.label}</span>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-on-surface-variant">Renewal</p>
                        <p className={`text-sm font-bold ${isRenewalSoon ? 'text-orange-600' : 'text-on-surface'}`}>
                            {renewalDate ? renewalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </p>
                    </div>
                    <svg className={`w-4 h-4 text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isExpanded && (
                    <div className="px-4 pb-4 border-t border-outline-variant/50 bg-surface-container/30">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Progress</p>
                                <div className="w-full bg-surface-container-high rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${client.progress}%` }} />
                                </div>
                                <p className="text-xs text-on-surface-variant mt-1">{client.progress}% complete</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Last Session</p>
                                <p className="text-sm font-bold text-on-surface">
                                    {client.lastSessionDate ? new Date(client.lastSessionDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'No sessions'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Mastermind Group</p>
                                <p className="text-sm font-bold text-on-surface">{client.mastermindGroup || 'Unassigned'}</p>
                            </div>
                        </div>

                        {client.wins && client.wins.length > 0 && (
                            <div className="mt-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">🏆 Wins</p>
                                <div className="flex flex-wrap gap-2">
                                    {client.wins.map((win, i) => (
                                        <span key={i} className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 font-medium">{win}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isRenewalSoon && (
                            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-700 flex items-center gap-2">
                                ⚠️ Renewal coming up — {renewalDate!.toLocaleDateString()}. Follow up on continuation.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderSection = (title: string, clients: MentorClient[], icon: string) => {
        const filtered = applyFilters(clients);
        if (filtered.length === 0 && clients.length === 0) return null;
        return (
            <div className="mb-8">
                <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                    <span>{icon}</span> {title}
                    <span className="text-xs font-normal text-on-surface-variant ml-1">({filtered.length})</span>
                </h2>
                {filtered.length > 0 ? (
                    <div className="space-y-2">
                        {filtered.map(renderMemberRow)}
                    </div>
                ) : (
                    <p className="text-sm text-on-surface-variant italic px-4 py-6 text-center bg-surface-container rounded-xl border border-outline-variant">No members match the current filters.</p>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
            <PageHeader
                heading="Member Status"
                subheading="Track member continuations, engagement, and growth milestones."
                onOpenInstructions={() => setShowInstructions(true)}
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex bg-surface-container rounded-lg p-1 gap-1">
                    {(['all', 'active', 'inactive'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all capitalize ${filter === f ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                {allGroups.length > 0 && (
                    <select
                        value={groupFilter}
                        onChange={e => setGroupFilter(e.target.value)}
                        className="text-xs font-bold bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface"
                    >
                        <option value="all">All Groups</option>
                        {allGroups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                )}
            </div>

            {renderSection("Primary Roster", primaryClients, "👤")}
            {renderSection("Shared Access", sharedClients, "🤝")}

            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Member Status"
                content={`Use this page to monitor the health and continuation status of your assigned members.\n\n• **Active/Inactive** — quickly see who is currently engaged\n• **Renewal Date** — upcoming renewals are highlighted in orange\n• **Wins** — track and celebrate key milestones\n• **Mastermind Groups** — filter by group assignment\n• **Shared Access** — members shared with other mentors appear separately`}
            />
        </div>
    );
};

export default MemberStatusPage;
