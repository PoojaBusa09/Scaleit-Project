import React, { useState } from "react";
import { UsersIcon, GitBranchIcon } from "../../../components/icons";
import { PageHeader } from "../../../components/PageHeader";
import TeamMembers from "./TeamMembersPage";
import TeamOrgChart from "./TeamOrgChartPage";

const TeamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"members" | "org">("members");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="Manage your team structure and members."
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("members")}
            className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                            ${activeTab === "members"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
                        `}
          >
            <UsersIcon className="mr-2 h-5 w-5" />
            Team Members
          </button>
          <button
            onClick={() => setActiveTab("org")}
            className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                            ${activeTab === "org"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
                        `}
          >
            <GitBranchIcon className="mr-2 h-5 w-5" />
            Org Chart
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "members" ? <TeamMembers /> : <TeamOrgChart />}
      </div>
    </div>
  );
};

export default TeamManagement;
