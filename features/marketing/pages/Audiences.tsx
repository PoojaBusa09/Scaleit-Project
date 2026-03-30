import React, { useState } from "react";
import { Card } from "../../../components/ui/Card.tsx";
import DataTable from "../../../components/ui/DataTable.tsx";
import { UsersIcon, PlusIcon, Trash2Icon } from "../../../components/icons.tsx";
import { Modal } from "../../../components/ui/Modal.tsx";
import { mockDataService } from "../../../services/mockDataService.ts";
import { Audience, UserRole } from "../../../types.ts";

const Audiences: React.FC = () => {
  const [audiences, setAudiences] = useState<Audience[]>(
    mockDataService.getAudiences()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAudience, setNewAudience] = useState({
    name: "",
    roleFilter: "",
  });

  const handleCreateAudience = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock count calculation based on role filter
    const users = mockDataService.getUsers();
    let count = 0;
    if (newAudience.roleFilter) {
      count = users.filter((u) => u.role === newAudience.roleFilter).length;
    } else {
      count = Math.floor(Math.random() * 50) + 10; // Random if no specific filter for demo
    }

    const audience: Audience = {
      id: Date.now().toString(),
      name: newAudience.name,
      count: count,
      lastUsed: new Date().toISOString().split("T")[0],
      filters: newAudience.roleFilter
        ? { role: [newAudience.roleFilter as UserRole] }
        : undefined,
    };

    mockDataService.addAudience(audience);
    setAudiences(mockDataService.getAudiences());
    setIsModalOpen(false);
    setNewAudience({ name: "", roleFilter: "" });
  };

  const handleDeleteAudience = (id: string) => {
    if (confirm("Are you sure you want to delete this audience?")) {
      mockDataService.deleteAudience(id);
      setAudiences(mockDataService.getAudiences());
    }
  };

  const columns = [
    { key: "name", label: "Audience Name", sortable: true },
    { key: "count", label: "Members", sortable: true },
    { key: "lastUsed", label: "Last Used", sortable: true },
    {
      key: "actions",
      label: "",
      render: (item: Audience) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAudience(item.id);
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
          <h1 className="text-3xl font-bold text-gray-900">Audiences</h1>
          <p className="text-gray-500 mt-2">
            Manage audience segments for campaigns
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Audience
        </button>
      </div>

      <Card>
        <DataTable data={audiences} columns={columns} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Audience"
      >
        <form onSubmit={handleCreateAudience} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audience Name
            </label>
            <input
              type="text"
              required
              value={newAudience.name}
              onChange={(e) =>
                setNewAudience({ ...newAudience, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. VIP Members"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Role (Optional)
            </label>
            <select
              value={newAudience.roleFilter}
              onChange={(e) =>
                setNewAudience({ ...newAudience, roleFilter: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">No Filter (Random Mock Count)</option>
              <option value="EC">Elevate (EC)</option>
              <option value="SC">Scale (SC)</option>
              <option value="STM">Scale Team (STM)</option>
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
              Create Audience
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Audiences;
