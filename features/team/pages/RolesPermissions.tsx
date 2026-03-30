import React from "react";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { Card } from "../../../components/ui/Card";

import { ShieldIcon } from '../../../components/icons.tsx';

// --- Constants ---

const ROLES_DATA = [
  {
    code: "EC",
    name: "Elevate Member",
    description: "Individual membership program",
  },
  {
    code: "SC",
    name: "Scale Member / Team CEO",
    description: "Team-based membership program",
  },
  {
    code: "STM",
    name: "Scale Team Member",
    description: "Member of a Scale team",
  },
  {
    code: "M",
    name: "Mentor",
    description: "Individual mentor providing guidance",
  },
  { code: "MM", name: "Mentor Manager", description: "Manages mentor pod" },
  {
    code: "ST",
    name: "PGN Staff",
    description: "Support staff in Mentor Department",
  },
  {
    code: "AM",
    name: "Admin Manager",
    description: "Platform administrator/manager",
  },
  {
    code: "SA",
    name: "Super Admin",
    description: "Highest level administrator",
  },
  {
    code: "CSA",
    name: "Content Admin",
    description: "Content management specialist",
  },
];

// --- Components ---

/**
 * Roles & Permissions Page
 * Displays the various user roles available in the system and their descriptions.
 * Currently read-only, but could be expanded to manage permissions.
 */
const RolesPermissions: React.FC = () => {

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage role definitions and permissions."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Roles List">
        {ROLES_DATA.map((role) => (
          <div role="listitem" key={role.code}>
            <Card hover className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg" aria-hidden="true">
                  <ShieldIcon className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{role.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 mb-2 font-mono bg-surface-variant/30 inline-block px-1 rounded">
                    {role.code}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {role.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesPermissions;
