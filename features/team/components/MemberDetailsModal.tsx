
import React, { useEffect, useState } from 'react';
import { Member } from '../../../types';
import { XIcon, MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, AwardIcon, ClockIcon, TrendingUpIcon, UsersIcon, MessageSquareIcon, FileTextIcon } from '../../../components/icons';

interface MemberDetailsModalProps {
    member: Member | null;
    onClose: () => void;
}

const DetailItem: React.FC<{ icon: React.ElementType, label: string, value: string | number }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start">
        <Icon className="h-5 w-5 text-on-surface-variant mt-1 flex-shrink-0" />
        <div className="ml-3">
            <p className="text-body-sm text-on-surface-variant">{label}</p>
            <p className="text-body-lg font-medium text-on-surface">{value}</p>
        </div>
    </div>
);

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({ member, onClose }) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (member) {
            setIsShowing(true);
        } else {
            setIsShowing(false);
        }
    }, [member]);

    const handleClose = () => {
        setIsShowing(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const handleRequestQuote = () => {
        alert(`Quote request initiated for ${member?.company}. You will be able to fill out details in the next step.`);
    };

    if (!member && !isShowing) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isShowing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            onClick={handleClose}
        >
            <div
                className={`bg-surface rounded-xl shadow-xl w-full max-w-2xl flex flex-col transition-all duration-300 ${isShowing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b border-outline/20">
                    <h2 className="text-headline-sm text-on-surface">Member Details</h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                        <XIcon className="h-6 w-6 text-on-surface-variant" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {member && (
                        <>
                            <div className="flex flex-col md:flex-row items-center pb-6 border-b border-outline/20">
                                <img src={member.avatarUrl} alt={`${member.firstName} ${member.lastName}`} className="h-24 w-24 rounded-full" />
                                <div className="ml-6 mt-4 md:mt-0 text-center md:text-left">
                                    <h3 className="text-display-sm text-on-surface">{member.firstName} {member.lastName}</h3>
                                    <p className="text-title-lg text-on-surface-variant">{member.company}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                                        <button className="flex items-center bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                                            <MessageSquareIcon className="h-4 w-4 mr-2" />
                                            Message
                                        </button>
                                        <button onClick={handleRequestQuote} className="flex items-center bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary-container/80 transition-colors">
                                            <FileTextIcon className="h-4 w-4 mr-2" />
                                            Request Quote
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                                <DetailItem icon={MailIcon} label="Email" value={member.email} />
                                <DetailItem icon={PhoneIcon} label="Phone" value={member.phone} />
                                <DetailItem icon={MapPinIcon} label="Location" value={`${member.city}, ${member.state}`} />
                                <DetailItem icon={BriefcaseIcon} label="Industry" value={member.industry} />
                                <DetailItem icon={AwardIcon} label="Plan" value={member.plan} />
                                <DetailItem icon={UsersIcon} label="MasterMind Group" value={member.masterMindGroup} />
                                <DetailItem icon={ClockIcon} label="Years in Business" value={member.years.toFixed(1)} />
                                <div>
                                    <div className="flex items-start">
                                        <TrendingUpIcon className="h-5 w-5 text-on-surface-variant mt-1 flex-shrink-0" />
                                        <div className="ml-3 w-full">
                                            <p className="text-body-sm text-on-surface-variant">Engagement</p>
                                            <div className="flex items-center mt-1">
                                                <div className="w-full bg-surface-variant rounded-full h-2.5 mr-2">
                                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${member.engagement}%` }}></div>
                                                </div>
                                                <span className="text-body-lg font-medium text-on-surface">{member.engagement}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <footer className="p-4 flex justify-end">
                    <button onClick={handleClose} className="px-6 py-2.5 text-label-lg font-medium text-primary rounded-full hover:bg-primary/10 transition-colors">
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MemberDetailsModal;
