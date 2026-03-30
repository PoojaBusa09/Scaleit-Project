
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_MENTOR_CLIENTS, MOCK_MENTOR_USER } from '../../../data/mockMentors.ts';
import { MOCK_TASKS } from '../../../data/mockTasks.ts';
import { MOCK_SESSIONS } from '../../../data/mockSessions.ts';
import { mockDataService } from "../../../services/mockDataService";
import { MentorClient, Session, ClientStatus } from '../../../types.ts';
import { SearchIcon, CalendarIcon, CheckCircleIcon, ClockIcon, LayoutGridIcon, ListIcon, MoreVerticalIcon, UserIcon, BellIcon, FilterIcon, UsersIcon, AlertTriangleIcon, TrendingUpIcon, ChevronRightIcon, MessageSquareIcon, FileTextIcon, VideoIcon } from '../../../components/icons.tsx';
import { Modal } from "../../../components/ui/Modal";
import { VideoCommandCenter } from "../../dashboard/components/VideoCommandCenter.tsx";
import { LiveWeeklySchedule } from "../../dashboard/components/LiveWeeklySchedule.tsx";

// --- Helpers ---

const getStatusInfo = (
  status: ClientStatus
): { color: string; bg: string; Icon: React.ElementType; text: string } => {
  switch (status) {
    case "atRisk":
      return {
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
        Icon: AlertTriangleIcon,
        text: "Needs Attention",
      };
    case "excelling":
      return {
        color: "text-green-700",
        bg: "bg-green-50 border-green-200",
        Icon: TrendingUpIcon,
        text: "Excelling",
      };
    case "onTrack":
    default:
      return {
        color: "text-blue-700",
        bg: "bg-blue-50 border-blue-200",
        Icon: CheckCircleIcon,
        text: "On Track",
      };
  }
};

/**
 * Animated entry container
 */
const AnimatedContainer: React.FC<{ children: React.ReactNode, delay: number }> = ({ children, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  );
};

// --- Subcomponents ---

const ActionItem: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  priority?: 'high' | 'normal' | 'low';
  onClick: () => void;
}> = ({ icon: Icon, title, description, actionLabel, priority = 'normal', onClick }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer" onClick={onClick}>
    <div className={`p-3 rounded-lg flex-shrink-0 ${priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-primary/5 text-primary'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
      <p className="text-sm text-gray-500 truncate">{description}</p>
    </div>
    <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
      {actionLabel}
    </button>
  </div>
);

const SessionListItem: React.FC<{ session: Session }> = ({ session }) => {
  const date = new Date(session.scheduledAt);
  return (
    <Link to={`/sessions/${session.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0 block w-full text-left">
      <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/5 rounded-lg text-primary font-bold leading-tight">
        <span className="text-sm">{date.getDate()}</span>
        <span className="text-[10px] uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{session.title}</h4>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <ClockIcon className="w-3 h-3" />
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration} min
        </p>
      </div>
      <div className="p-2 text-gray-400 hover:text-primary transition-colors">
        <ChevronRightIcon className="w-5 h-5" />
      </div>
    </Link>
  );
};

/**
 * ClientCard Component
 * Refreshed with Glassmorphism and Pinnacle branding
 */
const ClientCard: React.FC<{ client: MentorClient }> = ({ client }) => {
  const statusInfo = getStatusInfo(client.status);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      {/* Decorative status indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${client.status === 'atRisk' ? 'bg-red-500' : 'bg-primary'}`} />

      <div className="p-5 pl-7">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={client.avatarUrl}
              alt={client.name}
              className="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{client.name}</h3>
              <p className="text-xs text-gray-500">{client.company}</p>
            </div>
          </div>
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.text}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">Program Progress</span>
              <span className="font-bold text-primary">{client.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${client.status === 'atRisk' ? 'bg-red-500' : 'bg-primary'}`}
                style={{ width: `${client.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/mentor/client/${client.id}`}
              className="flex-1 text-center py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              Profile
            </Link>
            <Link
              to={`/mentor/session-workspace/${client.id}`}
              className="flex-1 text-center py-2 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/10"
            >
              Workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const clients = mockDataService.getClients();
  // Mock split for demonstration
  const primaryClients = clients.slice(0, 4);
  const sharedClients = clients.slice(4);

  // Sort sessions by date
  const upcomingSessions = [...MOCK_SESSIONS]
    .filter(s => new Date(s.scheduledAt) >= new Date()) // Future sessions
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5); // Next 5

  // Identify at-risk clients
  const atRiskClients = clients.filter(c => c.status === 'atRisk');

  // Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    clientId: "",
    date: "",
    time: "",
  });

  const handleReviewNotes = () => {
    if (clients.length > 0) navigate(`/mentor/session-workspace/${clients[0].id}`);
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Session scheduled for ${scheduleData.date} at ${scheduleData.time}!`);
    setIsScheduleModalOpen(false);
    setScheduleData({ clientId: "", date: "", time: "" });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <AnimatedContainer delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-primary">
              Welcome back, {MOCK_MENTOR_USER.name.split(' ')[0]}.
            </h1>
            <p className="text-gray-500 text-base mt-1">
              You have <span className="font-semibold text-primary">{upcomingSessions.length} sessions</span> coming up and <span className="font-semibold text-red-600">{atRiskClients.length} items</span> needing attention.
            </p>
          </div>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary-dark transition-all transform hover:-translate-y-0.5"
          >
            <CalendarIcon className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">Schedule Session</span>
          </button>
        </div>
      </AnimatedContainer>

      {/* Top Section: Today's Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Action Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Action Center */}
          <AnimatedContainer delay={100}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-primary font-bold flex items-center gap-2">
                  <AlertTriangleIcon className="w-5 h-5 text-secondary" />
                  Action Center
                </h2>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">3 Pending Items</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {atRiskClients.length > 0 && (
                  <ActionItem
                    icon={AlertTriangleIcon}
                    title={`Client Alert: ${atRiskClients[0].name}`}
                    description="Engagement dropped below threshold. Schedule check-in."
                    actionLabel="Reach Out"
                    priority="high"
                    onClick={() => navigate(`/mentor/client/${atRiskClients[0].id}`)}
                  />
                )}

                <ActionItem
                  icon={FileTextIcon}
                  title="Review Session Notes: TechFlow Inc."
                  description="AI summary ready for approval from yesterday's call."
                  actionLabel="Review"
                  onClick={handleReviewNotes}
                />

                <ActionItem
                  icon={CalendarIcon}
                  title="Reschedule Request: GreenEarth Co."
                  description="Proposed new time: Tomorrow, 2:00 PM."
                  actionLabel="Manage"
                  onClick={() => setIsScheduleModalOpen(true)}
                />
              </div>
            </div>
          </AnimatedContainer>

          {/* Upcoming Week */}
          <AnimatedContainer delay={200}>
            <LiveWeeklySchedule sessions={MOCK_SESSIONS} />
          </AnimatedContainer>

        </div>

        {/* Right Column: Next Up & Portfolio */}
        <div className="lg:col-span-4 space-y-8">

          {/* Next Session Card */}
          <AnimatedContainer delay={150}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl blur-lg opacity-70"></div>
              <div className="relative bg-white rounded-xl border border-primary/10 shadow-xl overflow-hidden">
                <div className="bg-primary/5 p-3 border-b border-primary/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Next Session</span>
                </div>
                <VideoCommandCenter
                  userRole="mentor"
                  nextSession={upcomingSessions[0] ? {
                    id: upcomingSessions[0].id,
                    title: upcomingSessions[0].title,
                    time: new Date(upcomingSessions[0].scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: new Date(upcomingSessions[0].scheduledAt),
                    attendees: (upcomingSessions[0] as any).attendees || [(upcomingSessions[0] as any).memberName] // fallback to memberName if attendees missing
                  } : undefined}
                />
              </div>
            </div>
          </AnimatedContainer>

          {/* Quick Portfolio */}
          <AnimatedContainer delay={250}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-base text-primary font-bold uppercase tracking-wider">Primary Roster</h2>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">{primaryClients.length}</span>
                </div>
                <div className="space-y-3">
                  {primaryClients.map(client => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3 border-t pt-4 border-gray-100">
                  <h2 className="font-serif text-base text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" /> Shared Access
                  </h2>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{sharedClients.length}</span>
                </div>
                <div className="space-y-3 opacity-90">
                  {sharedClients.map(client => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              </div>
            </div>
          </AnimatedContainer>

        </div>

      </div>

      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule a Session"
      >
        <form onSubmit={handleScheduleSession} className="space-y-4">
          <div>
            <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Client
            </label>
            <select
              id="client-select"
              required
              value={scheduleData.clientId}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, clientId: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">-- Select Client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="session-date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                id="session-date"
                type="date"
                required
                value={scheduleData.date}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, date: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="session-time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                id="session-time"
                type="time"
                required
                value={scheduleData.time}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, time: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MentorDashboard;
