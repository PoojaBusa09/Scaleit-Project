
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_MENTOR_CLIENTS } from '../../../data/mockMentors.ts';
import { MOCK_TASKS } from '../../../data/mockTasks.ts';
import { MentorClient, Task } from '../../../types.ts';
import {
  ChevronLeftIcon,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
  CheckSquareIcon,
  ClockIcon
} from '../../../components/icons.tsx';

// --- Subcomponents ---

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconColor: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, children, iconColor }) => (
  <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20 h-full">
    <h3 className="font-medium text-title-md text-on-surface flex items-center mb-4">
      <Icon className={`h-5 w-5 mr-3 ${iconColor}`} aria-hidden="true" />
      {title}
    </h3>
    {children}
  </div>
);

// --- Main Component ---

/**
 * Client Details Page
 * Shows detailed profile, goals, wins, and pending tasks for a specific client.
 */
const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const client = MOCK_MENTOR_CLIENTS.find((c) => c.id.toString() === clientId);

  // Using shared mock data for demonstration
  // In a real app, this would be filtered by client ID
  const clientTasks = MOCK_TASKS;
  const pendingTasks = clientTasks.filter((t) => !t.completed);
  const recentWins = clientTasks.filter((t) => t.isWin).slice(0, 3);
  const mainGoals = [
    "Increase quarterly revenue by 15%",
    "Hire a Senior Developer",
    "Improve customer retention by 10%",
  ];

  if (!client) {
    return (
      <div className="text-center text-error p-8">
        <h2 className="text-2xl font-bold">Client not found</h2>
        <Link to="/mentor/dashboard" className="text-primary hover:underline mt-4 block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleSendMessage = () => {
    navigate("/communication", {
      state: {
        selectedUserId: client.id,
        selectedUserName: client.name,
      },
    });
  };

  return (
    <div>
      {/* Custom Header with Back Navigation */}
      <div className="mb-6">
        <Link
          to="/mentor/dashboard"
          className="inline-flex items-center text-body-md font-medium text-on-surface-variant hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Mentor Dashboard
        </Link>

        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img
              src={client.avatarUrl}
              alt={`${client.name}'s avatar`}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/10"
            />
            <div className="flex-1">
              <h2 className="text-headline-sm text-on-surface font-serif font-bold">{client.name}</h2>
              <p className="text-body-lg text-on-surface-variant">
                {client.company}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Link
                to={`/mentor/session-workspace/${client.id}`}
                className="flex items-center justify-center bg-primary text-on-primary px-5 py-2.5 rounded-full hover:shadow-lg text-label-lg font-medium transition-all transform hover:-translate-y-0.5"
              >
                <SparklesIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Session Workspace
              </Link>
              <button
                onClick={handleSendMessage}
                className="bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-full hover:bg-secondary-container/80 hover:shadow-md text-label-lg font-medium transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InfoCard icon={TargetIcon} title="Main Goals" iconColor="text-primary">
          <ul className="space-y-2 text-body-md text-on-surface-variant list-disc list-inside">
            {mainGoals.map((goal, i) => (
              <li key={i}>{goal}</li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard
          icon={TrophyIcon}
          title="Recent Wins"
          iconColor="text-tertiary"
        >
          <ul className="space-y-2 text-body-md text-on-surface-variant">
            {recentWins.map((win) => (
              <li key={win.id} className="flex items-center gap-2">
                <CheckSquareIcon className="h-4 w-4 text-tertiary flex-shrink-0" aria-hidden="true" />
                <span>{win.text}</span>
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard
          icon={CheckSquareIcon}
          title="Pending Tasks"
          iconColor="text-error"
        >
          <ul className="space-y-2 text-body-md text-on-surface-variant">
            {pendingTasks.slice(0, 4).map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-outline rounded-sm flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="truncate block">{task.text}</span>
                  {task.dueDate && (
                    <span className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <ClockIcon className="h-3 w-3" />
                      Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </li>
            ))}
            {pendingTasks.length > 4 && (
              <li className="text-label-md text-on-surface-variant mt-2 italic">
                ...and {pendingTasks.length - 4} more.
              </li>
            )}
          </ul>
        </InfoCard>
      </div>
    </div>
  );
};

export default ClientDetails;
