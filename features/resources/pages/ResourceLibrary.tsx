import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_RESOURCES } from '../../../constants.ts';
import { Resource } from '../types.ts';
import { SearchIcon, VideoIcon, PaperclipIcon, UserIcon } from '../../../components/icons.tsx';
import { HeartIcon } from 'lucide-react';
import { getCurrentUser } from '../../../services/mockAuth.ts';

type ResourceFilter = 'all' | Resource['type'] | 'favorites';

const ResourceCard: React.FC<{ resource: Resource, isFavorited: boolean, onFavorite: (id: string) => void }> = ({ resource, isFavorited, onFavorite }) => {
    const typeIcons = {
        video: <VideoIcon className="h-5 w-5 text-tertiary" />,
        tool: <PaperclipIcon className="h-5 w-5 text-secondary" />,
    };

    return (
        <>
            {/* Desktop Card (Grid) */}
            <div className="hidden md:flex bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex-col h-full group overflow-hidden">
                <div className="relative overflow-hidden">
                    {resource.thumbnailUrl ? (
                        <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-40 bg-gray-50 flex items-center justify-center">
                            <div className="p-4 bg-white rounded-2xl shadow-sm transform group-hover:scale-110 transition-transform">
                                {typeIcons[resource.type]}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                        {resource.type}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-black mb-2 line-clamp-1">{resource.title}</h3>
                    <p className="text-sm text-gray-800 mb-4 flex-grow line-clamp-2 leading-relaxed font-medium">{resource.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {resource.tags?.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-50 text-black rounded-lg text-[10px] font-bold uppercase border border-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={() => onFavorite(resource.id)}
                        className={`w-full flex items-center justify-center font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 ${isFavorited ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200' : 'bg-black hover:bg-gray-900 text-white'}`}
                    >
                        <HeartIcon className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                        {isFavorited ? 'Favorited' : 'Favorite Resource'}
                    </button>
                </div>
            </div>

            {/* Mobile List Item (High Density) */}
            <div className="md:hidden flex bg-white border-b border-gray-100 p-4 gap-4 active:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {resource.thumbnailUrl ? (
                        <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            {typeIcons[resource.type]}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{resource.type}</span>
                            <div className="flex gap-1">
                                {resource.tags?.slice(0, 1).map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-primary uppercase">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <h3 className="font-serif text-base font-bold text-black leading-tight line-clamp-2">{resource.title}</h3>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-black font-bold">
                            <UserIcon className="w-3 h-3 text-gray-500" />
                            {resource.author || 'Pinnacle Global Network'}
                        </div>
                        <button
                            onClick={() => onFavorite(resource.id)}
                            className={`p-1.5 rounded-lg transition-colors ${isFavorited ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-black bg-gray-50 active:bg-gray-100'}`}
                        >
                            <HeartIcon className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const ResourceLibrary: React.FC = () => {
    const user = getCurrentUser();
    const isCEO = user?.role === 'EC' || user?.role === 'SC';
    const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
    const [filter, setFilter] = useState<ResourceFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScaleItTag, setSelectedScaleItTag] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filteredResources = resources.filter(r => {
        if (filter === 'favorites' && !favorites.has(r.id)) return false;
        const matchesFilter = filter === 'all' || filter === 'favorites' || r.type === filter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            r.title.toLowerCase().includes(searchLower) ||
            r.description.toLowerCase().includes(searchLower) ||
            (r.author && r.author.toLowerCase().includes(searchLower));
        const matchesScaleIt = !selectedScaleItTag || (r.tags && r.tags.includes(selectedScaleItTag));
        return matchesFilter && matchesSearch && matchesScaleIt;
    }).sort((a, b) => {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return dateB - dateA;
    });

    const filters: { label: string, value: ResourceFilter }[] = [
        { label: 'All', value: 'all' },
        { label: 'Videos', value: 'video' },
        { label: 'Tools', value: 'tool' },
        { label: 'Favorites', value: 'favorites' },
    ];

    const handleUpload = () => {
        alert("Upload feature coming soon!");
    };

    return (
        <div className="h-full bg-gray-50/30 flex flex-col">
            {/* Header Area */}
            <div className="bg-white border-b border-gray-100 pt-4 pb-1 px-4 md:px-6 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-serif text-2xl md:text-3xl font-bold text-black">Resource Library</h1>
                        {!isCEO && (
                            <button
                                onClick={handleUpload}
                                className="p-2 md:px-4 md:py-2 md:bg-black md:text-white rounded-xl md:rounded-full border border-gray-100 md:border-transparent text-black transition-all active:scale-95"
                            >
                                <PaperclipIcon className="h-5 w-5 md:mr-2 md:inline" />
                                <span className="hidden md:inline font-bold text-xs uppercase tracking-wider">Upload</span>
                            </button>
                        )}
                    </div>

                    {/* Segmented Filter Control */}
                    <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-fit mb-4 overflow-x-auto no-scrollbar">
                        {filters.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                className={`flex-1 md:flex-initial px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${filter === f.value ? 'bg-white shadow-sm text-black' : 'text-gray-600 hover:text-black font-bold'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile: Search & SCALEIT Filter Layout - Clean & Focused */}
                    <div className="space-y-3.5 pb-3">
                        <div className="relative w-full">
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all shadow-sm"
                            />
                        </div>

                        {/* SCALEIT Filter - Centered Letters */}
                        <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-2">
                            {['S', 'C', 'A', 'L', 'E', 'I', 'T'].map((letter, idx) => {
                                const tags = ['Strategy', 'Cash Flow', 'Alliance', 'Leadership', 'Execution', 'Innovation', 'Technology'];
                                const tag = tags[idx];
                                const isActive = selectedScaleItTag === tag;
                                return (
                                    <button
                                        key={letter}
                                        onClick={() => setSelectedScaleItTag(isActive ? null : tag)}
                                        className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-black transition-all border ${isActive
                                            ? 'bg-primary text-white border-primary shadow-[0_-4px_10px_rgba(0,0,0,0.1)] scale-110 z-10'
                                            : 'bg-white text-gray-700 border-gray-200 active:bg-gray-50 hover:bg-gray-50'
                                            }`}
                                        title={tag}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedScaleItTag && (
                            <div className="flex items-center justify-between bg-primary/5 px-3 py-2 rounded-xl border border-primary/10 animate-in fade-in zoom-in-95 duration-200">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    Filtering: {selectedScaleItTag}
                                </span>
                                <button onClick={() => setSelectedScaleItTag(null)} className="text-[10px] font-black text-primary uppercase hover:underline">Clear</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white md:bg-gray-50/30">
                <div className="max-w-7xl mx-auto p-0 md:p-6 pb-24 md:pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6 animate-in fade-in slide-in-from-bottom duration-500">
                        {filteredResources.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} isFavorited={favorites.has(resource.id)} onFavorite={toggleFavorite} />
                        ))}
                        {filteredResources.length === 0 && (
                            <div className="col-span-full text-center py-20 px-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <SearchIcon className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-black mb-2">No results found</h3>
                                <p className="text-sm text-gray-700 max-w-xs mx-auto font-medium">We couldn't find any resources matching your current filters or search terms.</p>
                                <button
                                    onClick={() => {
                                        setFilter('all');
                                        setSearchTerm('');
                                        setSelectedScaleItTag(null);
                                    }}
                                    className="mt-6 text-xs font-black text-black uppercase tracking-widest hover:underline"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceLibrary;
