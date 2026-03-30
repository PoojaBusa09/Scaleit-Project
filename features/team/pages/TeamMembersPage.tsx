import React, { useState } from "react";
import { mockDataService } from "../../../services/mockDataService";
import { TeamMember } from "../../../types";
import { PlusIcon, Trash2Icon, SearchIcon, EyeIcon } from "../../../components/icons";
import { Modal } from "../../../components/ui/Modal";
import { MemberProfileModal } from "../components/MemberProfileModal";

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(
    mockDataService.getTeamMembers()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({ name: "", role: "", email: "" });

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    const member: TeamMember = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      avatarUrl: `https://i.pravatar.cc/150?u=${newMember.email}`,
      email: newMember.email,
      bio: "New team member ready to onboard.",
      strengths: ["Fresh Perspective"],
      weaknesses: ["Onboarding Needed"],
      opportunities: ["Role Growth"],
      threats: [],
      skills: []
    };
    mockDataService.addTeamMember(member);
    setMembers(mockDataService.getTeamMembers());
    setNewMember({ name: "", role: "", email: "" });
    setIsInviteModalOpen(false);
  };

  const handleRemoveMember = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the team?`)) {
      mockDataService.deleteTeamMember(id);
      setMembers(mockDataService.getTeamMembers());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <PlusIcon className="h-5 w-5" />
          Invite Member
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group flex flex-col items-center text-center relative"
          >
            <button
              onClick={() => handleRemoveMember(member.id, member.name)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Remove from team"
            >
              <Trash2Icon className="h-4 w-4" />
            </button>

            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-50 mb-4"
            />
            <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
            <p className="text-sm text-indigo-600 font-medium mb-4">{member.role}</p>

            <div className="flex flex-wrap justify-center gap-1 mb-6">
              {member.strengths?.slice(0, 3).map((s, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelectedMember(member)}
              className="w-full py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <EyeIcon className="h-4 w-4" /> View Profile & Analysis
            </button>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No team members found.</p>
        </div>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              required
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Marketing Manager"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>

      {/* Profile Detail Modal */}
      <MemberProfileModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
};

export default TeamMembers;
