import React, { useState } from "react";
import { Card } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import { PlusIcon } from "../../../components/icons";
import { mockDataService } from "../../../services/mockDataService";
import { Form } from "../types.ts";

const Forms: React.FC = () => {
  const [forms] = useState<Form[]>(mockDataService.getForms());

  const columns = [
    { key: "name", label: "Form Name", sortable: true },
    { key: "fields", label: "Fields", sortable: true },
    { key: "responses", label: "Responses", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (item: Form) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Published"
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
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-500 mt-2">
            Build and manage forms and assessments
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          New Form
        </button>
      </div>

      <Card>
        <DataTable data={forms} columns={columns} />
      </Card>
    </div>
  );
};

export default Forms;
