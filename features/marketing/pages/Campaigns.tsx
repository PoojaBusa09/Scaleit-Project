import React, { useState, useMemo } from "react";
import { Card } from "../../../components/ui/Card.tsx";
import DataTable from "../../../components/ui/DataTable.tsx";
import { FileTextIcon, PlusIcon, Trash2Icon } from "../../../components/icons.tsx";
import { Modal } from "../../../components/ui/Modal.tsx";
import { mockDataService } from "../../../services/mockDataService.ts";
import { Campaign, Audience } from "../../../types.ts";

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    mockDataService.getCampaigns()
  );
  const [audiences] = useState<Audience[]>(mockDataService.getAudiences());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    audienceId: "",
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAudience = audiences.find(
      (a) => a.id === newCampaign.audienceId
    );

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      audienceId: newCampaign.audienceId,
      audienceName: selectedAudience?.name || "Unknown Audience",
      status: "Draft",
      sentCount: 0,
    };

    mockDataService.addCampaign(campaign);
    setCampaigns(mockDataService.getCampaigns());
    setIsModalOpen(false);
    setNewCampaign({ name: "", subject: "", audienceId: "" });
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      mockDataService.deleteCampaign(id);
      setCampaigns(mockDataService.getCampaigns());
    }
  };

  const columns = [
    { key: "name", label: "Campaign Name", sortable: true },
    { key: "subject", label: "Subject Line" },
    { key: "audienceName", label: "Audience" },
    {
      key: "status",
      label: "Status",
      render: (item: Campaign) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Active" || item.status === "Sent"
            ? "bg-green-100 text-green-800"
            : item.status === "Scheduled"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          {item.status}
        </span>
      ),
    },
    { key: "sentCount", label: "Sent" },
    {
      key: "openRate",
      label: "Open Rate",
      render: (item: Campaign) => (item.openRate ? `${item.openRate}%` : "-"),
    },
    {
      key: "actions",
      label: "",
      render: (item: Campaign) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCampaign(item.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2Icon className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-2">
            Create and manage email campaigns
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Campaign
        </button>
      </div>

      <Card>
        <DataTable data={campaigns} columns={columns} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Campaign"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              required
              value={newCampaign.name}
              onChange={(e) =>
                setNewCampaign({ ...newCampaign, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Monthly Newsletter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              required
              value={newCampaign.subject}
              onChange={(e) =>
                setNewCampaign({ ...newCampaign, subject: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. This Month's Highlights"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audience
            </label>
            <select
              required
              value={newCampaign.audienceId}
              onChange={(e) =>
                setNewCampaign({ ...newCampaign, audienceId: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select Audience...</option>
              {audiences.map((audience) => (
                <option key={audience.id} value={audience.id}>
                  {audience.name} ({audience.count} members)
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Draft
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Campaigns;
