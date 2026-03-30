import React, { useState } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

interface MemberFile {
    id: number;
    name: string;
    type: 'pdf' | 'doc' | 'xls' | 'ppt';
    size: string;
    uploadedAt: string;
    memberName: string;
    memberCompany: string;
}

const FILE_TYPE_CONFIG = {
    pdf: { label: 'PDF', bg: 'bg-red-100 text-red-600', icon: '📄' },
    doc: { label: 'DOC', bg: 'bg-blue-100 text-blue-600', icon: '📝' },
    xls: { label: 'XLS', bg: 'bg-green-100 text-green-600', icon: '📊' },
    ppt: { label: 'PPT', bg: 'bg-orange-100 text-orange-600', icon: '📎' },
};

const MOCK_FILES: MemberFile[] = [
    { id: 1, name: 'Q2 Strategic Plan.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: '2026-03-15T10:00:00Z', memberName: 'Alexandre Dubois', memberCompany: 'Innovate Inc.' },
    { id: 2, name: 'Cash Flow Projections.xlsx', type: 'xls', size: '1.1 MB', uploadedAt: '2026-03-12T14:30:00Z', memberName: 'Alexandre Dubois', memberCompany: 'Innovate Inc.' },
    { id: 3, name: 'Marketing Blueprint.pdf', type: 'pdf', size: '3.7 MB', uploadedAt: '2026-03-08T09:15:00Z', memberName: 'Isabella Rossi', memberCompany: 'Cucina Bella' },
    { id: 4, name: 'Team Org Chart.pptx', type: 'ppt', size: '890 KB', uploadedAt: '2026-02-28T11:00:00Z', memberName: 'Isabella Rossi', memberCompany: 'Cucina Bella' },
    { id: 5, name: 'Business Assessment.pdf', type: 'pdf', size: '1.5 MB', uploadedAt: '2026-02-20T16:00:00Z', memberName: 'Liam Chen', memberCompany: 'Construct Co.' },
    { id: 6, name: 'Hiring Plan.docx', type: 'doc', size: '420 KB', uploadedAt: '2026-02-15T08:45:00Z', memberName: 'Sarah Jenkins', memberCompany: 'BrightFuture Ed' },
    { id: 7, name: 'Revenue Forecast.xlsx', type: 'xls', size: '780 KB', uploadedAt: '2026-02-10T13:00:00Z', memberName: 'Marcus Johnson', memberCompany: 'Urban Logistics' },
    { id: 8, name: 'Partnership Proposal.pdf', type: 'pdf', size: '2.1 MB', uploadedAt: '2026-01-25T10:30:00Z', memberName: 'Thomas Wright', memberCompany: 'Wright Design' },
];

const MemberFileRepository: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const members = Array.from(new Set(MOCK_FILES.map(f => f.memberName)));

    const filtered = MOCK_FILES
        .filter(f => selectedMember === 'all' || f.memberName === selectedMember)
        .filter(f => typeFilter === 'all' || f.type === typeFilter)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
            <PageHeader
                heading="Member Files"
                subheading="Per-member file repository — documents are visible to the member and their assigned mentor."
                onOpenInstructions={() => setShowInstructions(true)}
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <select
                    value={selectedMember}
                    onChange={e => setSelectedMember(e.target.value)}
                    className="text-xs font-bold bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface"
                >
                    <option value="all">All Members</option>
                    {members.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="flex bg-surface-container rounded-lg p-1 gap-1">
                    {['all', 'pdf', 'doc', 'xls', 'ppt'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all uppercase ${typeFilter === t ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            {t === 'all' ? 'All' : t}
                        </button>
                    ))}
                </div>

                <button className="ml-auto px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                    + Upload File
                </button>
            </div>

            {/* File List */}
            <div className="space-y-2">
                {filtered.map(file => {
                    const cfg = FILE_TYPE_CONFIG[file.type];
                    const date = new Date(file.uploadedAt);
                    return (
                        <div key={file.id} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                            <div className={`w-11 h-11 rounded-lg ${cfg.bg} flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                                {cfg.label}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{file.name}</p>
                                <p className="text-xs text-on-surface-variant mt-0.5">
                                    {file.memberName} · {file.memberCompany} · {file.size}
                                </p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Uploaded</p>
                                <p className="text-xs font-bold text-on-surface">
                                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className="text-[10px] text-on-surface-variant">
                                    {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors flex-shrink-0">
                                Open
                            </button>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-on-surface-variant">
                    <span className="text-4xl mb-4 block">📂</span>
                    <p className="font-bold mb-1">No files found</p>
                    <p className="text-sm">Try adjusting your filters or upload a new file.</p>
                </div>
            )}

            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Member Files"
                content={`A per-member document repository for sharing files between members and their mentors.\n\n• Files support Word, Excel, PDF, and PowerPoint formats\n• Each file is automatically timestamped on upload\n• Files are sorted newest-first\n• Only the member and their assigned mentor can see these files`}
            />
        </div>
    );
};

export default MemberFileRepository;
