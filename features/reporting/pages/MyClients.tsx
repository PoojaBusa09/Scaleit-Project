import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import { UsersIcon } from "../../../components/icons";
import { mockDataService } from "../../../services/mockDataService";
import { MentorClient } from "../../../types";

const MyClients: React.FC = () => {
  const navigate = useNavigate();

  const clients = useMemo(() => {
    return mockDataService.getClients();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Client Name",
      sortable: true,
      render: (client: MentorClient) => (
        <div className="flex items-center gap-3">
          <img
            src={client.avatarUrl}
            alt={client.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-gray-900">{client.name}</span>
        </div>
      ),
    },
    { key: "company", label: "Company", sortable: true },
    {
      key: "progress",
      label: "Progress",
      sortable: true,
      render: (item: MentorClient) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${item.progress >= 80
                  ? "bg-green-500"
                  : item.progress >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{item.progress}%</span>
        </div>
      ),
    },
    { key: "lastSessionDate", label: "Last Session", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (item: MentorClient) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "onTrack"
              ? "bg-green-100 text-green-800"
              : item.status === "atRisk"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
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
          <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
          <p className="text-gray-500 mt-2">
            Monitor and support your client portfolio
          </p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center">
          <UsersIcon className="h-5 w-5 mr-2" />
          {clients.length} Active Clients
        </div>
      </div>

      <Card>
        <DataTable
          data={clients}
          columns={columns}
          onRowClick={(client) => navigate(`/mentor/client/${client.id}`)}
        />
      </Card>
    </div>
  );
};

export default MyClients;
