import React, { useState } from "react";
import { PageHeader } from "../../../components/PageHeader.tsx";
import { MOCK_POSTS } from "../../../data/mockMessages.ts";
import { SearchIcon, CalendarIcon, UsersIcon, HashIcon, ClockIcon } from "../../../components/icons.tsx";

const AnnouncementsFeed: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "New Feature", "Events", "Update", "Spotlight"];

    const filteredPosts = MOCK_POSTS.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || post.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col h-full bg-surface-variant/5">
            <div className="p-6 pb-0">
                <PageHeader
                    title="Announcements & Updates"
                    description="Stay informed with the latest from the Pinnacle community and mentor team."
                />
            </div>

            <div className="p-6 pt-2 space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-surface p-4 rounded-xl shadow-sm border border-outline/10">
                    <div className="relative flex-1 w-full">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-surface-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                    ? "bg-primary text-on-primary shadow-md"
                                    : "bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <article
                                key={post.id}
                                className="flex flex-col bg-white dark:bg-surface rounded-2xl overflow-hidden shadow-sm border border-outline/10 hover:shadow-md transition-shadow group"
                            >
                                {post.imageUrl && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                                            <CalendarIcon className="w-3 h-3" />
                                            {post.timestamp}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-1 line-clamp-4 whitespace-pre-line">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-outline/10 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <UsersIcon className="w-8 h-8 rounded-full shadow-sm" />
                                            <span className="text-sm font-medium text-on-surface">{post.author}</span>
                                        </div>
                                        <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                            Read More
                                            <span className="text-lg">→</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-16 h-16 bg-surface-variant/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SearchIcon className="w-8 h-8 opacity-20" />
                            </div>
                            <h3 className="text-lg font-bold text-on-surface mb-1">No posts found</h3>
                            <p className="text-on-surface-variant">Try adjusting your search or category filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsFeed;
