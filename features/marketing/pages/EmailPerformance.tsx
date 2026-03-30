import React, { useMemo } from "react";
import { Card, StatCard } from "../../../components/ui/Card.tsx";
import DataTable from "../../../components/ui/DataTable.tsx";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { BarChartIcon, TrendingUpIcon, UsersIcon, MousePointerIcon, EyeIcon, MailIcon } from '../../../components/icons.tsx';
import { mockDataService } from '../../../services/mockDataService.ts';
import { Campaign } from '../../../types.ts';

const EmailPerformance: React.FC = () => {
  const stats = useMemo(() => {
    const campaigns = mockDataService.getCampaigns();
    const sentCampaigns = campaigns.filter(
      (c) => c.status === "Sent" || c.status === "Active"
    );

    const totalSent = sentCampaigns.reduce((acc, c) => acc + c.sentCount, 0);
    const avgOpenRate =
      sentCampaigns.length > 0
        ? Math.round(
          sentCampaigns.reduce((acc, c) => acc + (c.openRate || 0), 0) /
          sentCampaigns.length
        )
        : 0;
    const avgClickRate =
      sentCampaigns.length > 0
        ? Math.round(
          sentCampaigns.reduce((acc, c) => acc + (c.clickRate || 0), 0) /
          sentCampaigns.length
        )
        : 0;

    return {
      totalSent,
      avgOpenRate,
      avgClickRate,
      sentCampaigns,
    };
  }, []);

  const columns = [
    { key: "name", label: "Campaign", sortable: true },
    { key: "sentCount", label: "Sent" },
    {
      key: "openRate",
      label: "Open Rate",
      render: (item: Campaign) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full"
              style={{ width: `${item.openRate || 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{item.openRate || 0}%</span>
        </div>
      ),
    },
    {
      key: "clickRate",
      label: "Click Rate",
      render: (item: Campaign) => (item.clickRate || 0) + "%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Performance</h1>
        <p className="text-gray-500 mt-2">
          Analyze the effectiveness of your email campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Emails Sent"
          value={stats.totalSent.toLocaleString()}
          change={12}
          trend="up"
          icon={<MailIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Open Rate"
          value={`${stats.avgOpenRate}%`}
          change={2}
          trend="up"
          icon={<BarChartIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Click Rate"
          value={`${stats.avgClickRate}%`}
          change={-1}
          trend="down"
          icon={<MousePointerIcon className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Engagement Over Time
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[45, 52, 48, 60, 55, 65].map((h, i) => (
              <div
                key={i}
                className="w-full flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-full bg-indigo-100 rounded-t-sm group-hover:bg-indigo-200 transition-colors relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}% Open Rate
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Campaigns
          </h3>
          <DataTable
            data={stats.sentCampaigns
              .sort((a, b) => (b.openRate || 0) - (a.openRate || 0))
              .slice(0, 5)}
            columns={columns}
          />
        </Card>
      </div>
    </div>
  );
};

export default EmailPerformance;
