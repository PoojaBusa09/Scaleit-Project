import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_MEMBERS } from '../../../constants.ts';
import { Member } from '../../../types.ts';
import { ArrowUpDownIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, SettingsIcon, DownloadIcon, UsersIcon, EyeIcon } from '../../../components/icons.tsx';
import MemberDetailsModal from '../components/MemberDetailsModal';
import { PageHeader } from '../../../components/PageHeader.tsx';

type SortKey = keyof Omit<Member, 'id' | 'avatarUrl' | 'email' | 'phone' | 'plan' | 'city' | 'state'>;

const ALL_COLUMNS: { key: SortKey, label: string }[] = [
    { key: 'firstName', label: 'Member' },
    { key: 'company', label: 'Company' },
    { key: 'industry', label: 'Industry' },
    { key: 'masterMindGroup', label: 'MM Group' },
    { key: 'mentors', label: 'Mentors' },
    { key: 'years', label: 'Years' },
    { key: 'engagement', label: 'Engagement' },
];

const MemberDirectory: React.FC = () => {
    const [members] = useState<Member[]>(MOCK_MEMBERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('All');
    const [groupFilter, setGroupFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({ key: 'lastName', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<SortKey[]>(['firstName', 'company', 'industry', 'masterMindGroup', 'years', 'engagement']);
    const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

    const itemsPerPage = 10;
    const columnSelectorRef = useRef<HTMLDivElement>(null);

    const industries = useMemo(() => ['All', ...Array.from(new Set(members.map(m => m.industry)))], [members]);
    const masterMindGroups = useMemo(() => ['All', ...Array.from(new Set(members.map(m => m.masterMindGroup)))], [members]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
                setIsColumnSelectorOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const searchMatch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.industry.toLowerCase().includes(searchTerm.toLowerCase());

            const industryMatch = industryFilter === 'All' || member.industry === industryFilter;
            const groupMatch = groupFilter === 'All' || member.masterMindGroup === groupFilter;

            return searchMatch && industryMatch && groupMatch;
        });
    }, [members, searchTerm, industryFilter, groupFilter]);

    const sortedMembers = useMemo(() => {
        let sortableItems = [...filteredMembers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (Array.isArray(aValue) || Array.isArray(bValue)) return 0;

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredMembers, sortConfig]);

    const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
    const paginatedMembers = sortedMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleColumnVisibilityChange = (key: SortKey) => {
        setVisibleColumns(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const renderCell = (member: Member, columnKey: SortKey) => {
        switch (columnKey) {
            case 'firstName':
                return (
                    <div className="flex items-center">
                        <div className="relative">
                            <img className="h-10 w-10 rounded-full object-cover border border-outline shadow-sm" src={member.avatarUrl} alt="" />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-bold text-on-surface">{member.firstName} {member.lastName}</div>
                            <div className="text-xs text-on-surface-variant/70 font-medium">{member.email}</div>
                        </div>
                    </div>
                );
            case 'engagement':
                return (
                    <div className="flex items-center w-32">
                        <div className="flex-1 bg-surface-variant rounded-full h-2 mr-3 overflow-hidden">
                            <div
                                className={`h-full rounded-full ${member.engagement > 75 ? 'bg-green-500' : member.engagement > 40 ? 'bg-secondary' : 'bg-error'}`}
                                style={{ width: `${member.engagement}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant w-8 text-right">{member.engagement}%</span>
                    </div>
                );
            case 'years':
                return <span className="text-sm text-on-surface-variant font-medium">{member.years.toFixed(1)}</span>;
            case 'mentors':
                return (
                    <div className="flex -space-x-2 overflow-hidden">
                        {member.mentors.map((m, i) => (
                            <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-surface bg-primary text-on-primary flex items-center justify-center text-[8px] font-bold" title={m}>
                                {m.charAt(0)}
                            </div>
                        ))}
                    </div>
                );
            case 'company':
                return <span className="text-sm font-semibold text-on-surface">{member.company}</span>;
            default:
                const value = member[columnKey as keyof Member];
                return <span className="text-sm text-on-surface-variant">{String(value ?? '')}</span>;
        }
    };

    return (
        <div>
            <PageHeader
                title="Member Directory"
                description={`Connect with ${members.length} other business leaders in the ScaleIt community.`}
            />
            <div className="space-y-6">

                {/* Filters & Controls Card */}
                <div className="bg-surface p-4 rounded-xl shadow-sm border border-outline/20 flex flex-col md:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-grow w-full md:w-auto group">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, company, or industry..."
                            className="w-full pl-10 pr-4 py-3 bg-surface-variant/30 border border-outline/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Filters Group */}
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        <select
                            value={industryFilter}
                            onChange={e => setIndustryFilter(e.target.value)}
                            className="px-4 py-3 bg-surface-variant/30 border border-outline/20 rounded-lg text-sm text-on-surface-variant font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer min-w-[160px] hover:bg-surface-variant/50 transition-colors"
                        >
                            {industries.map(i => <option key={i} value={i}>{i === 'All' ? 'All Industries' : i}</option>)}
                        </select>

                        <select
                            value={groupFilter}
                            onChange={e => setGroupFilter(e.target.value)}
                            className="px-4 py-3 bg-surface-variant/30 border border-outline/20 rounded-lg text-sm text-on-surface-variant font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer min-w-[160px] hover:bg-surface-variant/50 transition-colors"
                        >
                            {masterMindGroups.map(g => <option key={g} value={g}>{g === 'All' ? 'All Groups' : g}</option>)}
                        </select>

                        <div className="w-px h-8 bg-outline/20 mx-1 hidden md:block"></div>

                        {/* Column Visibility */}
                        <div className="relative" ref={columnSelectorRef}>
                            <button
                                onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
                                className={`p-3 rounded-lg border transition-all duration-200 ${isColumnSelectorOpen ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface hover:bg-surface-variant/50 border-outline/20 text-on-surface-variant'}`}
                                title="Customize Columns"
                            >
                                <SettingsIcon className="h-5 w-5" />
                            </button>
                            {isColumnSelectorOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-surface rounded-xl shadow-xl py-2 z-20 border border-outline/10 animate-fade-in-up-fast">
                                    <div className="px-4 py-2 border-b border-outline/10">
                                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Visible Columns</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        {ALL_COLUMNS.map(col => (
                                            <label key={col.key} className="flex items-center w-full px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-variant/50 rounded-lg cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded text-primary focus:ring-primary border-outline"
                                                    checked={visibleColumns.includes(col.key)}
                                                    onChange={() => handleColumnVisibilityChange(col.key)}
                                                />
                                                <span className="ml-3">{col.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-surface rounded-xl shadow-sm border border-outline/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-outline/10">
                            <thead className="bg-surface-variant/30">
                                <tr>
                                    {ALL_COLUMNS.filter(c => visibleColumns.includes(c.key)).map(col => {
                                        const isSortable = !['firstName', 'mentors', 'engagement'].includes(col.key);
                                        return (
                                            <th
                                                key={col.key}
                                                className={`px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider ${isSortable ? 'cursor-pointer hover:bg-surface-variant/50 hover:text-primary transition-colors' : ''}`}
                                                onClick={() => isSortable && requestSort(col.key)}
                                            >
                                                <div className="flex items-center">
                                                    {col.label}
                                                    {isSortable && (
                                                        <ArrowUpDownIcon className={`ml-2 h-3.5 w-3.5 ${sortConfig?.key === col.key ? 'text-primary' : 'text-on-surface-variant/30'}`} />
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                    <th className="px-6 py-4 text-right text-xs font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline/10 bg-surface">
                                {paginatedMembers.map(member => (
                                    <tr
                                        key={member.id}
                                        className="group hover:bg-surface-variant/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedMember(member)}
                                    >
                                        {ALL_COLUMNS.filter(c => visibleColumns.includes(c.key)).map(col => (
                                            <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                                                {renderCell(member, col.key)}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end ml-auto hover:underline">
                                                <EyeIcon className="h-4 w-4 mr-1.5" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedMembers.length === 0 && (
                                    <tr>
                                        <td colSpan={visibleColumns.length + 1} className="px-6 py-16 text-center text-on-surface-variant">
                                            <div className="flex flex-col items-center justify-center">
                                                <UsersIcon className="h-12 w-12 text-outline mb-4" />
                                                <p className="text-lg font-bold">No members found</p>
                                                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                                                <button
                                                    onClick={() => { setSearchTerm(''); setIndustryFilter('All'); setGroupFilter('All'); }}
                                                    className="mt-4 text-sm font-bold text-primary hover:underline"
                                                >
                                                    Clear all filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {paginatedMembers.length > 0 && (
                        <div className="px-6 py-4 border-t border-outline/10 bg-surface-variant/5 flex items-center justify-between">
                            <span className="text-sm font-medium text-on-surface-variant">
                                Showing <span className="font-bold text-on-surface">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-on-surface">{Math.min(currentPage * itemsPerPage, sortedMembers.length)}</span> of <span className="font-bold text-on-surface">{sortedMembers.length}</span> results
                            </span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-outline/20 disabled:opacity-30 hover:bg-surface-variant transition-colors text-on-surface-variant"><ChevronsLeftIcon className="h-4 w-4" /></button>
                                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-outline/20 disabled:opacity-30 hover:bg-surface-variant transition-colors text-on-surface-variant"><ChevronLeftIcon className="h-4 w-4" /></button>
                                <span className="text-sm font-bold text-on-surface px-4">Page {currentPage} of {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-outline/20 disabled:opacity-30 hover:bg-surface-variant transition-colors text-on-surface-variant"><ChevronRightIcon className="h-4 w-4" /></button>
                                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-outline/20 disabled:opacity-30 hover:bg-surface-variant transition-colors text-on-surface-variant"><ChevronsRightIcon className="h-4 w-4" /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />
        </div>
    );
};

export default MemberDirectory;
