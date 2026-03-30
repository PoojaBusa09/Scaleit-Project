import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { TeamMember } from '../../../types';
import { TrendingUpIcon, AlertTriangleIcon, SearchIcon, ShieldIcon, CheckCircleIcon } from '../../../components/icons';

interface MemberProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: TeamMember | null;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ isOpen, onClose, member }) => {
    if (!member) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Team Member Profile" maxWidth="max-w-4xl">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Basic Info */}
                <div className="w-full md:w-1/3 flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-white shadow-md"
                    />
                    <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-gray-500 mb-6">{member.email}</p>

                    <div className="w-full text-left">
                        <h4 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider">Bio</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {member.bio || "No bio available."}
                        </p>

                        <h4 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {member.skills?.map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: SWOT Analysis */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingUpIcon className="h-6 w-6 mr-2 text-primary" />
                        Performance Analysis (SWOT)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Strengths */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2 mb-3 text-green-700">
                                <CheckCircleIcon className="h-5 w-5" />
                                <h4 className="font-bold">Strengths</h4>
                            </div>
                            <ul className="space-y-2">
                                {member.strengths?.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start">
                                        <span className="mr-2 text-green-500">•</span>
                                        {item}
                                    </li>
                                )) || <p className="text-sm text-gray-500 italic">No data added.</p>}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <div className="flex items-center gap-2 mb-3 text-red-700">
                                <AlertTriangleIcon className="h-5 w-5" />
                                <h4 className="font-bold">Weaknesses</h4>
                            </div>
                            <ul className="space-y-2">
                                {member.weaknesses?.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start">
                                        <span className="mr-2 text-red-500">•</span>
                                        {item}
                                    </li>
                                )) || <p className="text-sm text-gray-500 italic">No data added.</p>}
                            </ul>
                        </div>

                        {/* Opportunities */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-3 text-blue-700">
                                <SearchIcon className="h-5 w-5" />
                                <h4 className="font-bold">Opportunities</h4>
                            </div>
                            <ul className="space-y-2">
                                {member.opportunities?.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start">
                                        <span className="mr-2 text-blue-500">•</span>
                                        {item}
                                    </li>
                                )) || <p className="text-sm text-gray-500 italic">No data added.</p>}
                            </ul>
                        </div>

                        {/* Threats */}
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-2 mb-3 text-amber-700">
                                <ShieldIcon className="h-5 w-5" />
                                <h4 className="font-bold">Threats</h4>
                            </div>
                            <ul className="space-y-2">
                                {member.threats?.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-start">
                                        <span className="mr-2 text-amber-500">•</span>
                                        {item}
                                    </li>
                                )) || <p className="text-sm text-gray-500 italic">No data added.</p>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
