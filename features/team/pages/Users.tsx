
import React from "react";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { Card } from "../../../components/ui/Card";

import DataTable from "../../../components/ui/DataTable";
import { PlusIcon } from '../../../components/icons.tsx';
import { AdminUser, UserRole } from '../../../types.ts';

// --- Constants ---

const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "EC",
    program: "Elevate",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "SC",
    program: "Scale",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "M",
    program: "-",
    status: "Active",
  },
];

const USER_COLUMNS = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "program", label: "Program" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
        {item.status}
      </span>
    ),
  },
];

// --- Components ---

/**
 * Users Page
 * Displays a list of all users on the platform.
 * Primarily for admins to view user status and programs.
 */
const Users: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage platform users and access."
        actions={
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            aria-label="Add User"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add User
          </button>
        }
      />

      <Card>
        <div role="region" aria-label="User List">
          <DataTable data={MOCK_USERS} columns={USER_COLUMNS} />
        </div>
      </Card>
    </div>
  );
};

export default Users;
