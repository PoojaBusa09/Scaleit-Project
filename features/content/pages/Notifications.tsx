import React, { useState } from "react";
import { Card } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import { PlusIcon } from "../../../components/icons";
import { mockDataService } from "../../../services/mockDataService";
import { Notification } from "../types.ts";

const Notifications: React.FC = () => {
  const [notifications] = useState<Notification[]>(
    mockDataService.getNotifications()
  );

  const columns = [
    { key: "name", label: "Notification Name", sortable: true },
    { key: "trigger", label: "Trigger Type" },
    { key: "audience", label: "Audience" },
    {
      key: "status",
      label: "Status",
      render: (item: Notification) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
            }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-2">
            Manage in-app notifications and triggers
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          New Notification
        </button>
      </div>

      <Card>
        <DataTable data={notifications} columns={columns} />
      </Card>
    </div>
  );
};

export default Notifications;
