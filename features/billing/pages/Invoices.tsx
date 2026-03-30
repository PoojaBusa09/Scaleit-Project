import React, { useState } from "react";
import { Card } from "../../../components/ui/Card.tsx";
import DataTable from "../../../components/ui/DataTable.tsx";
import { FileTextIcon, DownloadIcon } from "../../../components/icons.tsx";
import { mockDataService } from "../../../services/mockDataService.ts";
import { Transaction } from "../../../types.ts";

const Invoices: React.FC = () => {
  const [invoices] = useState<Transaction[]>(mockDataService.getTransactions());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const columns = [
    {
      key: "id",
      label: "Invoice #",
      render: (item: Transaction) => `INV-${item.id.padStart(3, "0")}`,
    },
    { key: "user", label: "Client", sortable: true },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (item: Transaction) => formatCurrency(item.amount),
    },
    { key: "date", label: "Date", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (item: Transaction) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Completed"
            ? "bg-green-100 text-green-800"
            : item.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <DownloadIcon className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-2">View and manage invoices</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <DownloadIcon className="h-5 w-5" />
          Export All
        </button>
      </div>

      <Card>
        <DataTable data={invoices} columns={columns} />
      </Card>
    </div>
  );
};

export default Invoices;
