import React, { useMemo } from "react";
import { Card, StatCard } from "../../../components/ui/Card.tsx";
import DataTable from "../../../components/ui/DataTable.tsx";
import {
  DollarSignIcon,
  UsersIcon,
  AlertTriangleIcon,
} from "../../../components/icons.tsx";
import { mockDataService } from "../../../services/mockDataService.ts";
import { Subscription } from "../../../types.ts";

const Subscriptions: React.FC = () => {
  const stats = useMemo(() => {
    const subscriptions = mockDataService.getSubscriptions();
    const activeSubs = subscriptions.filter((s) => s.status === "Active");
    const pastDueSubs = subscriptions.filter((s) => s.status === "Past Due");

    const totalMRR = activeSubs.reduce((acc, s) => acc + s.mrr, 0);
    const activeCount = activeSubs.length;
    const pastDueCount = pastDueSubs.length;

    return {
      subscriptions,
      totalMRR,
      activeCount,
      pastDueCount,
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    { key: "user", label: "Client", sortable: true },
    { key: "plan", label: "Plan", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (item: Subscription) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Active"
            ? "bg-green-100 text-green-800"
            : item.status === "Past Due"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "mrr",
      label: "MRR",
      sortable: true,
      render: (item: Subscription) => formatCurrency(item.mrr),
    },
    { key: "nextBillingDate", label: "Next Billing" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-500 mt-2">
          Manage member subscriptions and billing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total MRR"
          value={formatCurrency(stats.totalMRR)}
          change={8}
          trend="up"
          icon={<DollarSignIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeCount.toString()}
          change={12}
          trend="up"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Past Due"
          value={stats.pastDueCount.toString()}
          change={-1}
          trend="down"
          icon={<AlertTriangleIcon className="h-6 w-6" />}
        />
      </div>

      <Card>
        <DataTable data={stats.subscriptions} columns={columns} />
      </Card>
    </div>
  );
};

export default Subscriptions;
