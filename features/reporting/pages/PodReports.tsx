import React, { useMemo } from "react";
import { Card, StatCard } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import {
  UsersIcon,
  TrendingUpIcon,
  CheckSquareIcon,
  AwardIcon,
} from "../../../components/icons";
import { mockDataService } from "../../../services/mockDataService";
import { AdminUser } from "../../../types";

const PodReports: React.FC = () => {
  const stats = useMemo(() => {
    const users = mockDataService.getUsers();
    const mentors = users.filter((u) => u.role === "M");
    const clients = mockDataService.getClients();

    // Mock calculations for pod stats
    const totalClients = clients.length;
    const activeMentors = mentors.length;
    const avgProgress = Math.round(
      clients.reduce((acc, c) => acc + c.progress, 0) / (totalClients || 1)
    );
    const atRiskClients = clients.filter((c) => c.status === "atRisk").length;

    // Generate mentor performance data
    const mentorPerformance = mentors.map((m) => ({
      id: m.id,
      name: m.name,
      clientCount: Math.floor(Math.random() * 10) + 5, // Mock
      avgClientProgress: Math.floor(Math.random() * 30) + 70, // Mock
      sessionsCompleted: Math.floor(Math.random() * 50) + 20, // Mock
      satisfaction: (4 + Math.random()).toFixed(1), // Mock
    }));

    return {
      activeMentors,
      totalClients,
      avgProgress,
      atRiskClients,
      mentorPerformance,
    };
  }, []);

  const columns = [
    { key: "name", label: "Mentor Name", sortable: true },
    { key: "clientCount", label: "Clients", sortable: true },
    {
      key: "avgClientProgress",
      label: "Avg Client Progress",
      sortable: true,
      render: (item: any) => `${item.avgClientProgress}%`,
    },
    { key: "sessionsCompleted", label: "Sessions", sortable: true },
    {
      key: "satisfaction",
      label: "Satisfaction",
      sortable: true,
      render: (item: any) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-900 mr-1">
            {item.satisfaction}
          </span>
          <span className="text-yellow-400">★</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pod Reports</h1>
        <p className="text-gray-500 mt-2">
          Monitor mentor performance and client outcomes in your pod
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Mentors"
          value={stats.activeMentors.toString()}
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients.toString()}
          change={12}
          trend="up"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Avg Client Progress"
          value={`${stats.avgProgress}%`}
          change={5}
          trend="up"
          icon={<TrendingUpIcon className="h-6 w-6" />}
        />
        <StatCard
          title="At Risk Clients"
          value={stats.atRiskClients.toString()}
          change={-2}
          trend="down" // Down is good for risk
          icon={<AwardIcon className="h-6 w-6" />} // Using Award as placeholder, maybe Alert would be better if available
        />
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mentor Performance
        </h3>
        <DataTable data={stats.mentorPerformance} columns={columns} />
      </Card>
    </div>
  );
};

export default PodReports;
