import React, { useMemo } from "react";
import { Card, StatCard } from "../../../components/ui/Card";
import {
  TrendingUpIcon,
  CheckSquareIcon,
  CalendarIcon,
  AwardIcon,
  UsersIcon,
  Activity,
  HeartHandshakeIcon
} from "../../../components/icons";
import { mockDataService } from "../../../services/mockDataService";
import { getCurrentUser } from "../../../services/mockAuth.ts";

// --- Components ---

const ClientProgressView: React.FC = () => {
  const stats = useMemo(() => {
    const tasks = mockDataService.getTasks();
    const sessions = mockDataService.getSessions();

    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const wins = tasks.filter((t) => t.isWin).length;
    const attendedSessions = sessions.filter((s) => s.status === 'completed').length;

    const progressScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { completedTasks, attendedSessions, wins, progressScore };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tasks Completed" value={stats.completedTasks.toString()} change={12} trend="up" icon={<CheckSquareIcon className="h-6 w-6" />} />
        <StatCard title="Sessions Attended" value={stats.attendedSessions.toString()} change={2} trend="up" icon={<CalendarIcon className="h-6 w-6" />} />
        <StatCard title="Wins Achieved" value={stats.wins.toString()} change={5} trend="up" icon={<AwardIcon className="h-6 w-6" />} />
        <StatCard title="Progress Score" value={`${stats.progressScore}%`} change={3} trend="up" icon={<TrendingUpIcon className="h-6 w-6" />} />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Completion by Category</h3>
          <div className="space-y-4">
            {["Strategy", "Cash", "Alliance", "Leadership", "Execution"].map((cat, i) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <span className="text-gray-500">{70 + i * 5}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${70 + i * 5}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Activity</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 90].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-indigo-100 rounded-t-sm group-hover:bg-indigo-200 transition-colors relative" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}%
                  </div>
                </div>
                <span className="text-xs text-gray-500">{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const MentorProgressView: React.FC = () => {
  // Mock Mentor Stats
  const stats = {
    totalClients: 7,
    activeClients: 7,
    sessionsDelivered: 24,
    avgClientProgress: 68,
    retentionRate: 100,
    clientWins: 15
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Clients"
          value={stats.activeClients.toString()}
          subValue="100% Capacity"
          change={0}
          trend="neutral"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Sessions Delivered"
          value={stats.sessionsDelivered.toString()}
          subValue="This Month"
          change={4}
          trend="up"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Client Progress"
          value={`${stats.avgClientProgress}%`}
          subValue="+5% vs Last Month"
          change={5}
          trend="up"
          icon={<TrendingUpIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Client Wins Logged"
          value={stats.clientWins.toString()}
          subValue="Total Impact"
          change={3}
          trend="up"
          icon={<AwardIcon className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Health */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Portfolio Health
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm animate-pulse" />
                <span className="font-medium text-green-900">On Track / Excelling</span>
              </div>
              <span className="font-bold text-green-700 text-lg">5 Clients</span>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                <span className="font-medium text-red-900">Needs Attention</span>
              </div>
              <span className="font-bold text-red-700 text-lg">2 Clients</span>
            </div>
            <p className="text-sm text-gray-500 italic mt-2">
              * Based on recent session feedback and progress scores.
            </p>
          </div>
        </Card>

        {/* Impact Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <HeartHandshakeIcon className="w-5 h-5 text-red-500" />
            Mentorship Impact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <h4 className="text-2xl font-bold text-gray-900">4.9/5</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Avg Rating</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <h4 className="text-2xl font-bold text-gray-900">100%</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Retention</p>
            </div>
            <div className="col-span-2 p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
              <p className="text-blue-900 font-medium text-sm">
                "Jordan has been instrumental in our Q1 growth. Highly recommended!"
              </p>
              <p className="text-blue-700 text-xs mt-2 font-bold">- TechFlow Inc.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Main Page ---

const MyProgress: React.FC = () => {
  // Determine view based on logged-in user role
  const user = getCurrentUser();
  const isMentorView = user?.role === 'M' || user?.role === 'MM';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isMentorView ? 'Mentor Performance' : 'My Progress'}
        </h1>
        <p className="text-gray-500 mt-2">
          {isMentorView
            ? 'Track your portfolio health and impact metrics'
            : 'Track your personal growth and achievements'
          }
        </p>
      </div>

      {isMentorView ? <MentorProgressView /> : <ClientProgressView />}
    </div>
  );
};

export default MyProgress;
