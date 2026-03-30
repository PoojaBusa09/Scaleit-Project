import React, { useMemo } from "react";
import { Card, StatCard } from "../../../components/ui/Card";
import {
  TrendingUpIcon,
  UsersIcon,
  DollarSignIcon,
  BarChartIcon,
} from "../../../components/icons";
import { mockDataService } from "../../../services/mockDataService";

const ProgramAnalytics: React.FC = () => {
  const stats = useMemo(() => {
    const users = mockDataService.getUsers();
    const totalMembers = users.filter((u) =>
      ["EC", "SC", "STM"].includes(u.role)
    ).length;
    const activeMentors = users.filter((u) => u.role === "M").length;

    // Mock calculations
    const monthlyRevenue = totalMembers * 299; // Mock $299/member
    const engagementRate = 87; // Mock fixed value

    return {
      totalMembers,
      activeMentors,
      monthlyRevenue,
      engagementRate,
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Program Analytics</h1>
        <p className="text-gray-500 mt-2">Platform-wide metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers.toString()}
          change={8}
          trend="up"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Active Mentors"
          value={stats.activeMentors.toString()}
          change={3}
          trend="up"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          change={12}
          trend="up"
          icon={<DollarSignIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Engagement Rate"
          value={`${stats.engagementRate}%`}
          change={5}
          trend="up"
          icon={<TrendingUpIcon className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Growth Trends
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[30, 45, 60, 55, 70, 85, 90, 100].map((h, i) => (
              <div
                key={i}
                className="w-full bg-blue-100 hover:bg-blue-200 transition-colors rounded-t-sm relative group"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h} Members
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 px-4">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Retention Analysis
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative h-48 w-48 rounded-full border-[16px] border-indigo-100 flex items-center justify-center">
              <div className="absolute top-0 left-0 h-full w-full rounded-full border-[16px] border-indigo-600 border-r-transparent border-b-transparent -rotate-45"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">92%</div>
                <div className="text-sm text-gray-500">Retention</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgramAnalytics;
