import React, { useState } from "react";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { Card } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import { Modal } from "../../../components/ui/Modal";

import { UsersIcon, PlusIcon, UserPlusIcon, ShieldIcon } from '../../../components/icons.tsx';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { mockDataService } from '../../../services/mockDataService.ts';
import { TeamMember, OrgNode } from '../../../types.ts';
import { useNavigate } from "react-router-dom";
import { MOCK_ORG_CHART } from '../../../data/mockMentors.ts';

// --- Constants ---

const MOCK_TEAM_MEMBERS = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "VP of Sales",
    email: "alice@company.com",
    status: "Active",
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "Marketing Director",
    email: "bob@company.com",
    status: "Active",
  },
  {
    id: "3",
    name: "Carol White",
    role: "Operations Manager",
    email: "carol@company.com",
    status: "Active",
  },
];

const TEAM_COLUMNS = [
  { key: "name", label: "Name", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "email", label: "Email" },
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
 * Team Management Page
 * Allows Scale CEOs/admins to manage their team members and invites.
 */
const TeamManagement: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="Manage your Scale team members and org structure."
        actions={
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            aria-label="Invite Team Member"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Invite Team Member
          </button>
        }
      />

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Team Statistics">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant">Total Members</p>
              <p className="text-3xl font-bold text-primary mt-1">3</p>
            </div>
            <UsersIcon className="h-8 w-8 text-secondary" aria-hidden="true" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant">Active</p>
              <p className="text-3xl font-bold text-success mt-1">3</p>
            </div>
            <UsersIcon className="h-8 w-8 text-success" aria-hidden="true" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant">Pending Invites</p>
              <p className="text-3xl font-bold text-warning mt-1">0</p>
            </div>
            <UsersIcon className="h-8 w-8 text-warning" aria-hidden="true" />
          </div>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <h3 className="text-lg font-semibold text-primary mb-4" id="team-members-title">
          Team Members
        </h3>
        <div role="region" aria-labelledby="team-members-title">
          <DataTable
            data={MOCK_TEAM_MEMBERS}
            columns={TEAM_COLUMNS}
            onRowClick={(member) => console.log("View member:", member)}
          />
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        footer={
          <>
            <button
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 border border-outline rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Invite sent!"); // TODO: Implement toast notification
                setShowInviteModal(false);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Send Invite
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="invite-name" className="block text-sm font-medium text-primary mb-2">
              Name
            </label>
            <input
              id="invite-name"
              type="text"
              className="w-full px-4 py-2 border border-outline rounded-lg bg-background text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label htmlFor="invite-email" className="block text-sm font-medium text-primary mb-2">
              Email
            </label>
            <input
              id="invite-email"
              type="email"
              className="w-full px-4 py-2 border border-outline rounded-lg bg-background text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label htmlFor="invite-role" className="block text-sm font-medium text-primary mb-2">
              Role
            </label>
            <input
              id="invite-role"
              type="text"
              className="w-full px-4 py-2 border border-outline rounded-lg bg-background text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter role"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamManagement;

