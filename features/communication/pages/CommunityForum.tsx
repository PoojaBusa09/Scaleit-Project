import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_FORUM_CHANNELS, MOCK_FORUM_POSTS } from '../../../constants.ts';
import { ForumChannel, ForumPost } from '../../../types.ts';
import { HashIcon, ArrowUpIcon, MessageSquareIcon, CommunityIcon } from '../../../components/icons.tsx';

const PostCard: React.FC<{ post: ForumPost }> = ({ post }) => {
    return (
        <div className="bg-surface p-4 rounded-lg shadow-sm border border-outline/20 flex gap-4 transition-all duration-300 hover:border-primary hover:shadow-md">
            <div className="flex flex-col items-center pt-2">
                <button className="p-1.5 rounded-full hover:bg-surface-variant">
                    <ArrowUpIcon className="h-5 w-5 text-on-surface-variant" />
                </button>
                <span className="font-bold text-title-sm text-on-surface">{post.upvotes}</span>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-5 h-5 rounded-full" />
                    <span>Posted by {post.author.name}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                </div>
                <h3 className="text-title-lg font-medium text-on-surface mt-1">{post.title}</h3>
                <p className="text-body-md text-on-surface-variant mt-2">{post.contentSnippet}</p>
                <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1.5 text-body-md font-medium text-on-surface-variant hover:text-primary transition-colors">
                        <MessageSquareIcon className="h-5 w-5" />
                        <span>{post.commentsCount} Comments</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const CommunityForum: React.FC = () => {
    const [channels] = useState<ForumChannel[]>(MOCK_FORUM_CHANNELS);
    const [posts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
    const [activeChannelId, setActiveChannelId] = useState<string>(channels[1].id); // Default to 'Marketing'
    const [sortBy, setSortBy] = useState<'latest' | 'trending'>('trending');

    const activeChannel = channels.find(c => c.id === activeChannelId);

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = posts.filter(p => p.channelId === activeChannelId);
        if (sortBy === 'trending') {
            return filtered.sort((a, b) => b.upvotes - a.upvotes);
        }
        // Assuming timestamp can be parsed for latest sorting, for now it's mock
        return filtered;
    }, [posts, activeChannelId, sortBy]);

    return (
        <div className="h-full flex flex-col">
            <PageHeader
                title="Community Forum"
                description="Connect, share, and grow with fellow business leaders."
            />
            <div className="flex gap-6 flex-1 min-h-0">
                {/* Left Panel: Channels */}
                <div className="w-72 flex-shrink-0 bg-surface p-4 rounded-lg shadow-sm border border-outline/20">
                    <h2 className="text-title-lg font-medium text-on-surface px-2 mb-2">Channels</h2>
                    <nav className="space-y-1">
                        {channels.map(channel => (
                            <button
                                key={channel.id}
                                onClick={() => setActiveChannelId(channel.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-body-lg font-medium transition-colors ${activeChannelId === channel.id
                                    ? 'bg-secondary-container text-on-secondary-container'
                                    : 'text-on-surface-variant hover:bg-surface-variant'
                                    }`}
                            >
                                <HashIcon className="h-5 w-5" />
                                {channel.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right Panel: Main Feed */}
                <div className="flex-1 bg-surface p-6 rounded-lg shadow-sm border border-outline/20 overflow-y-auto">
                    {activeChannel && (
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <CommunityIcon className="h-8 w-8 text-primary" />
                                <div>
                                    <h1 className="text-headline-sm text-on-surface">#{activeChannel.name}</h1>
                                    <p className="text-body-md text-on-surface-variant">{activeChannel.description}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-1 bg-surface-variant p-1 rounded-full">
                            <button
                                onClick={() => setSortBy('trending')}
                                className={`px-4 py-1.5 rounded-full text-label-lg font-medium transition-all ${sortBy === 'trending' ? 'bg-surface shadow' : ''}`}
                            >
                                🔥 Trending
                            </button>
                            <button
                                onClick={() => setSortBy('latest')}
                                className={`px-4 py-1.5 rounded-full text-label-lg font-medium transition-all ${sortBy === 'latest' ? 'bg-surface shadow' : ''}`}
                            >
                                ✨ Latest
                            </button>
                        </div>
                        <button className="bg-primary text-on-primary px-5 py-2 rounded-full text-label-lg font-medium hover:shadow-md transition-shadow">
                            Create Post
                        </button>
                    </div>

                    <div className="space-y-4">
                        {filteredAndSortedPosts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityForum;
