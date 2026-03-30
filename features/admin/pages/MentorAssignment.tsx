import React, { useState, useEffect } from 'react';
import { MOCK_MENTORS, MOCK_UNASSIGNED_CLIENTS } from '../../../data/mockMentors.ts';
import { getMentorSuggestions } from '../../../services/geminiService';
import { Mentor, MentorClient, MentorMatch } from '../../../types';
import { SparklesIcon, UsersIcon, StarIcon } from '../../../components/icons';

const MentorCard: React.FC<{ mentor: Mentor }> = ({ mentor }) => (
    <div className="bg-surface p-4 rounded-lg shadow-sm border border-outline/20">
        <div className="flex items-center mb-3">
            <img src={mentor.avatarUrl} alt={mentor.name} className="h-12 w-12 rounded-full" />
            <div className="ml-3">
                <h4 className="font-medium text-title-md text-on-surface">{mentor.name}</h4>
                <p className="text-body-sm text-on-surface-variant">{mentor.specialties.join(', ')}</p>
            </div>
        </div>
        <div className="text-sm space-y-2">
            <p className="font-medium text-body-md text-on-surface-variant">Clients ({mentor.clientCount}/{mentor.clientCount + 2})</p>
            <div className="space-y-1">
                {mentor.assignedClients.slice(0, 3).map(client => (
                    <div key={client.id} className="flex items-center text-body-sm p-1 bg-surface-variant rounded">
                        <img src={client.avatarUrl} alt={client.name} className="h-5 w-5 rounded-full mr-2" />
                        <span>{client.name}</span>
                    </div>
                ))}
                {mentor.assignedClients.length > 3 && <p className="text-label-sm text-on-surface-variant">...and {mentor.assignedClients.length - 3} more</p>}
            </div>
        </div>
    </div>
);

const AnimatedListItem: React.FC<{ children: React.ReactNode, index: number }> = ({ children, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {children}
        </div>
    );
}

const MentorAssignment: React.FC = () => {
    const [mentors] = useState<Mentor[]>(MOCK_MENTORS);
    const [unassignedClients] = useState<MentorClient[]>(MOCK_UNASSIGNED_CLIENTS);
    const [selectedClient, setSelectedClient] = useState<MentorClient | null>(unassignedClients[0] || null);
    const [suggestedMatches, setSuggestedMatches] = useState<MentorMatch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFindMatches = async () => {
        if (!selectedClient) return;
        setIsLoading(true);
        setSuggestedMatches([]);
        const matches = await getMentorSuggestions(selectedClient, mentors);
        setSuggestedMatches(matches);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-headline-lg text-on-surface">Client-Mentor Assignment</h1>
                <p className="text-body-lg text-on-surface-variant mt-1">Visually manage mentor-client pairings and use AI to find the perfect match.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assignment Board */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
                    <h3 className="text-title-lg font-medium text-on-surface mb-4">Mentor Roster</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {mentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)}
                    </div>
                </div>

                {/* AI Matching Panel */}
                <div className="space-y-6">
                    <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
                        <h3 className="text-title-lg font-medium text-on-surface mb-4 flex items-center">
                            <UsersIcon className="h-5 w-5 mr-3 text-secondary" />
                            Unassigned Clients
                        </h3>
                        <select
                            onChange={(e) => setSelectedClient(unassignedClients.find(c => c.id === parseInt(e.target.value)) || null)}
                            className="w-full p-2.5 bg-surface border border-outline rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary mb-4"
                            value={selectedClient?.id || ''}
                        >
                            {unassignedClients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.company}</option>)}
                        </select>
                        <button
                            onClick={handleFindMatches}
                            disabled={!selectedClient || isLoading}
                            className="w-full flex items-center justify-center bg-primary text-on-primary px-4 py-2.5 rounded-full hover:shadow-lg disabled:bg-on-surface/20 text-label-lg font-medium"
                        >
                            <SparklesIcon className="h-5 w-5 mr-2" />
                            {isLoading ? 'Finding Best Matches...' : 'Find Best Matches'}
                        </button>
                    </div>

                    <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
                        <h3 className="text-title-lg font-medium text-on-surface mb-4">AI-Suggested Matches</h3>
                        <div className="space-y-3">
                            {isLoading && <p className="text-body-md text-on-surface-variant animate-pulse">AI is analyzing profiles...</p>}
                            {!isLoading && suggestedMatches.length === 0 && <p className="text-body-md text-on-surface-variant">Select a client and find matches.</p>}
                            {suggestedMatches.map((match, index) => (
                                <AnimatedListItem key={match.id} index={index}>
                                    <div className="p-3 border rounded-md bg-primary-container/40 border-primary/30">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <img src={match.avatarUrl} alt={match.name} className="h-10 w-10 rounded-full" />
                                                <div className="ml-3">
                                                    <p className="font-medium text-body-lg text-on-primary-container">{match.name}</p>
                                                    <div className="flex items-center text-label-md text-yellow-600 font-bold">
                                                        <StarIcon className="h-3 w-3 mr-1" /> {match.matchScore}% Match
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="text-label-lg font-medium bg-primary text-on-primary px-3 py-1 rounded-full hover:bg-primary/90">Assign</button>
                                        </div>
                                        <p className="text-body-sm text-on-primary-container/80 mt-2 pl-12">{match.reason}</p>
                                    </div>
                                </AnimatedListItem>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorAssignment;