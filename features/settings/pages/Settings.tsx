
import React, { useState } from 'react';
import { MOCK_USER } from '../../../data/mockUsers.ts';
import { MOCK_TEAM_MEMBERS } from '../../../data/mockCommunication.ts';
import { TeamMember } from '../../../features/team/types.ts';
import {
    UserIcon, UsersIcon, BellIcon, LinkIcon, UserPlusIcon, Trash2Icon,
    ZoomIcon, CalendarIcon, DollarSignIcon, ShieldIcon, MapPinIcon,
    MailIcon, PhoneIcon, ChevronRightIcon, CheckCircleIcon, SaveIcon
} from '../../../components/icons.tsx';

type Tab = 'profile' | 'team' | 'security' | 'notifications' | 'integrations';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
    const [integrations, setIntegrations] = useState({
        googleCalendar: false,
        outlookCalendar: false,
        quickbooks: false,
        zoom: true,
    });
    const [inviteEmail, setInviteEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const removeMember = (id: number) => {
        if (window.confirm('Are you sure you want to remove this team member? They will lose access to the platform.')) {
            setTeamMembers(teamMembers.filter(member => member.id !== id));
        }
    };

    const toggleIntegration = (name: 'googleCalendar' | 'outlookCalendar' | 'quickbooks' | 'zoom') => {
        setIntegrations(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;
        alert(`Invite sent to ${inviteEmail}. They will have access to the Resource Library and assigned tools.`);
        setInviteEmail('');
    }

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const TabButton: React.FC<{ tabName: Tab, icon: React.ElementType, label: string, description: string }> = ({ tabName, icon: Icon, label, description }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center group mb-2 border ${activeTab === tabName
                ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
                : 'bg-surface text-on-surface-variant border-transparent hover:bg-surface-variant/50 hover:border-outline/10'
                }`}
        >
            <div className={`p-3 rounded-lg mr-4 transition-colors ${activeTab === tabName ? 'bg-white/20' : 'bg-surface-variant group-hover:bg-white'}`}>
                <Icon className={`h-6 w-6 ${activeTab === tabName ? 'text-white' : 'text-on-surface-variant'}`} />
            </div>
            <div>
                <span className={`block font-bold text-sm ${activeTab === tabName ? 'text-white' : 'text-on-surface'}`}>{label}</span>
                <span className={`block text-xs mt-0.5 ${activeTab === tabName ? 'text-white/80' : 'text-on-surface-variant/70'}`}>{description}</span>
            </div>
            {activeTab === tabName && <ChevronRightIcon className="ml-auto h-5 w-5 text-white/80" />}
        </button>
    );

    const SectionHeader: React.FC<{ title: string, description: string }> = ({ title, description }) => (
        <div className="mb-8 pb-4 border-b border-outline/10">
            <h3 className="text-2xl font-bold text-on-surface tracking-tight">{title}</h3>
            <p className="text-body-md text-on-surface-variant mt-1">{description}</p>
        </div>
    );

    const InputField: React.FC<{ label: string, defaultValue?: string, disabled?: boolean, icon?: React.ElementType, type?: string, placeholder?: string }> = ({ label, defaultValue, disabled, icon: Icon, type = "text", placeholder }) => (
        <div className="group">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">{label}</label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                    </div>
                )}
                <input
                    type={type}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`block w-full ${Icon ? 'pl-11' : 'px-4'} py-3.5 bg-surface-variant/20 border border-outline/20 rounded-xl focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40 disabled:opacity-60 disabled:cursor-not-allowed font-medium`}
                />
            </div>
        </div>
    );

    const ToggleSwitch: React.FC<{ label: string, description: string, checked?: boolean }> = ({ label, description, checked }) => (
        <label className="flex items-center justify-between p-4 rounded-xl border border-outline/10 hover:border-primary/20 hover:bg-surface-variant/10 transition-all cursor-pointer group">
            <div>
                <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{label}</p>
                <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
                <div className="w-12 h-7 bg-surface-variant rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-primary transition-colors"></div>
            </div>
        </label>
    );

    const ProfileTab = () => (
        <div className="animate-fade-in-up">
            <SectionHeader title="My Profile" description="Manage your personal information and account presence." />

            {/* Header Banner */}
            <div className="relative mb-10 group">
                <div className="h-32 w-full bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-t-2xl border-x border-t border-outline/10"></div>
                <div className="absolute -bottom-10 left-8 flex items-end">
                    <div className="relative">
                        <img src={MOCK_USER.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-2xl border-4 border-surface shadow-lg object-cover" />
                        <button className="absolute -bottom-2 -right-2 p-2 bg-surface border border-outline/10 rounded-full shadow-md text-on-surface-variant hover:text-primary transition-colors">
                            <UserIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="ml-4 mb-2">
                        <h3 className="text-xl font-bold text-on-surface">{MOCK_USER.name}</h3>
                        <p className="text-sm text-on-surface-variant">CEO • {MOCK_USER.address.city}, {MOCK_USER.address.country}</p>
                    </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-surface/80 backdrop-blur-md text-on-surface px-4 py-2 rounded-lg text-xs font-bold border border-outline/10 hover:bg-surface shadow-sm">
                        Change Cover
                    </button>
                </div>
            </div>

            <div className="mt-14 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" defaultValue={MOCK_USER.name} icon={UserIcon} />
                    <InputField label="Job Title" defaultValue="CEO" icon={CheckCircleIcon} />
                    <InputField label="Email Address" defaultValue="alex.d@example.com" disabled icon={MailIcon} />
                    <InputField label="Phone Number" defaultValue="(555) 123-4567" icon={PhoneIcon} />
                </div>

                <div className="border-t border-outline/10 pt-8">
                    <h4 className="text-lg font-bold text-on-surface mb-6 flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-primary" /> Location Details
                    </h4>
                    <div className="space-y-6">
                        <InputField label="Street Address" defaultValue={MOCK_USER.address.street} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="City" defaultValue={MOCK_USER.address.city} />
                            <InputField label="State / Province" defaultValue={MOCK_USER.address.state} />
                            <InputField label="Zip Code" defaultValue={MOCK_USER.address.zip} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex items-center justify-end border-t border-outline/10 pt-6">
                <button
                    onClick={handleSave}
                    className="flex items-center bg-primary text-on-primary px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/30 text-sm font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {isSaving ? (
                        <>Saving Changes...</>
                    ) : (
                        <>
                            <SaveIcon className="h-5 w-5 mr-2" /> Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const TeamMembersTab = () => (
        <div className="animate-fade-in-up">
            <SectionHeader title="Team Management" description="Invite colleagues and manage access permissions." />

            <div className="bg-surface-variant/20 p-6 rounded-2xl border border-outline/10 mb-8">
                <h4 className="text-base font-bold text-on-surface mb-4 flex items-center">
                    <UserPlusIcon className="h-5 w-5 mr-2 text-primary" /> Invite New Member
                </h4>
                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-grow relative">
                        <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/50" />
                        <input
                            type="email"
                            placeholder="colleague@company.com"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-surface border border-outline/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-on-surface text-surface px-6 py-3 rounded-xl font-bold hover:bg-on-surface/90 shadow-lg transition-all">
                        Send Invite
                    </button>
                </form>
            </div>

            <div className="space-y-3">
                {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline/10 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center">
                            <div className="relative">
                                <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-surface" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-surface"></div>
                            </div>
                            <div className="ml-4">
                                <p className="font-bold text-on-surface">{member.name}</p>
                                <p className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full inline-block mt-1">{member.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeMember(member.id)}
                            className="p-2 rounded-lg text-on-surface-variant/60 hover:text-error hover:bg-error/5 opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove Member"
                        >
                            <Trash2Icon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
                {teamMembers.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-outline/20 rounded-2xl">
                        <UsersIcon className="h-12 w-12 mx-auto text-on-surface-variant/30 mb-3" />
                        <p className="text-on-surface-variant font-medium">No team members yet.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const SecurityTab = () => (
        <div className="animate-fade-in-up">
            <SectionHeader title="Login & Security" description="Protect your account and manage credentials." />

            <div className="space-y-8">
                <div className="p-6 rounded-2xl border border-outline/10 bg-surface shadow-sm">
                    <h4 className="text-lg font-bold text-on-surface mb-6 flex items-center">
                        <ShieldIcon className="h-5 w-5 mr-2 text-primary" /> Password
                    </h4>
                    <div className="grid grid-cols-1 gap-5 max-w-lg">
                        <InputField label="Current Password" type="password" placeholder="••••••••" />
                        <InputField label="New Password" type="password" placeholder="••••••••" />
                        <InputField label="Confirm New Password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="mt-6">
                        <button className="text-sm font-bold text-primary hover:underline">Update Password</button>
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-outline/10 bg-surface shadow-sm">
                    <h4 className="text-lg font-bold text-on-surface mb-4">Authentication Methods</h4>
                    <ToggleSwitch label="Two-Factor Authentication (2FA)" description="Add an extra layer of security to your account using an authenticator app." checked={false} />
                </div>
            </div>
        </div>
    );

    const NotificationsTab = () => (
        <div className="animate-fade-in-up">
            <SectionHeader title="Notifications" description="Control when and how we contact you." />

            <div className="space-y-4">
                <ToggleSwitch label="Email Summaries" description="Receive a weekly digest of your progress and upcoming tasks." checked={true} />
                <ToggleSwitch label="Session Reminders" description="Get notified 1 hour before your coaching sessions start." checked={true} />
                <ToggleSwitch label="Task Alerts" description="Notify me when a task deadline is approaching." checked={true} />
                <ToggleSwitch label="Product Updates" description="Be the first to know about new features and improvements." checked={false} />
                <ToggleSwitch label="Community Mentions" description="Notify me when someone replies to my post in the forum." checked={true} />
            </div>
        </div>
    );

    const IntegrationsTab = () => (
        <div className="animate-fade-in-up">
            <SectionHeader title="Connected Apps" description="Supercharge your workflow by connecting your favorite tools." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <IntegrationCard
                    name="Google Calendar"
                    description="Sync sessions and deadlines."
                    connected={integrations.googleCalendar}
                    onToggle={() => toggleIntegration('googleCalendar')}
                    icon={CalendarIcon}
                    color="text-red-500 bg-red-50"
                />
                <IntegrationCard
                    name="Outlook Calendar"
                    description="Keep your schedule in sync."
                    connected={integrations.outlookCalendar}
                    onToggle={() => toggleIntegration('outlookCalendar')}
                    icon={CalendarIcon}
                    color="text-blue-500 bg-blue-50"
                />
                <IntegrationCard
                    name="QuickBooks"
                    description="Automate financial reporting."
                    connected={integrations.quickbooks}
                    onToggle={() => toggleIntegration('quickbooks')}
                    icon={DollarSignIcon}
                    color="text-green-600 bg-green-50"
                />
                <IntegrationCard
                    name="Zoom"
                    description="Auto-generate meeting links."
                    connected={integrations.zoom}
                    onToggle={() => toggleIntegration('zoom')}
                    icon={ZoomIcon}
                    color="text-blue-600 bg-blue-50"
                />
            </div>
        </div>
    );

    const IntegrationCard: React.FC<{ name: string, description: string, connected: boolean, onToggle: () => void, icon: React.ElementType, color: string }> = ({ name, description, connected, onToggle, icon: Icon, color }) => (
        <div className={`flex flex-col justify-between p-6 border rounded-2xl transition-all duration-300 ${connected ? 'bg-surface border-primary/30 shadow-sm' : 'bg-surface-variant/10 border-outline/10 hover:bg-surface hover:border-outline/30 hover:shadow-sm'}`}>
            <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${connected ? 'bg-green-100 text-green-700' : 'bg-surface-variant text-on-surface-variant'}`}>
                    {connected ? 'Connected' : 'Disconnected'}
                </div>
            </div>
            <div>
                <h4 className="font-bold text-lg text-on-surface">{name}</h4>
                <p className="text-sm text-on-surface-variant mt-1 mb-4">{description}</p>
                <button
                    onClick={onToggle}
                    className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${connected
                        ? 'border border-outline/20 text-on-surface hover:bg-error-container hover:text-on-error-container hover:border-transparent'
                        : 'bg-on-surface text-surface hover:bg-on-surface/90 shadow-md'
                        }`}
                >
                    {connected ? 'Disconnect' : 'Connect App'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="sticky top-8">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 px-4">Account Settings</h2>
                        <nav className="space-y-1">
                            <TabButton tabName="profile" icon={UserIcon} label="Profile" description="Personal details" />
                            <TabButton tabName="team" icon={UsersIcon} label="Team" description="Manage access" />
                            <TabButton tabName="security" icon={ShieldIcon} label="Security" description="Password & 2FA" />
                            <TabButton tabName="notifications" icon={BellIcon} label="Notifications" description="Email preferences" />
                            <TabButton tabName="integrations" icon={LinkIcon} label="Integrations" description="Connected apps" />
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="bg-surface rounded-3xl shadow-sm border border-outline/10 p-8 min-h-[600px] relative overflow-hidden">
                        {/* Content Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-surface-variant/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                        <div className="relative z-10">
                            {activeTab === 'profile' && <ProfileTab />}
                            {activeTab === 'team' && <TeamMembersTab />}
                            {activeTab === 'security' && <SecurityTab />}
                            {activeTab === 'notifications' && <NotificationsTab />}
                            {activeTab === 'integrations' && <IntegrationsTab />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
