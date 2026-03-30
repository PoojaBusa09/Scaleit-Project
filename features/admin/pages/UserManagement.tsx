import React, { useState, useMemo, useEffect } from "react";
import { mockDataService } from "../../../services/mockDataService";
import { AdminUser, UserRole, ALL_ROLES } from "../../../types";
import {
  SearchIcon,
  UserCheckIcon,
  FileOutputIcon,
  PlusIcon,
  EditIcon,
  Trash2Icon,
} from "../../../components/icons";
import { Modal } from "../../../components/ui/Modal";

interface UserManagementProps {
  onImpersonate: (user: AdminUser) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onImpersonate }) => {
  const [users, setUsers] = useState<AdminUser[]>(mockDataService.getUsers());
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentUser, setCurrentUser] = useState<Partial<AdminUser>>({});

  // Refresh users from service
  const refreshUsers = () => {
    setUsers(mockDataService.getUsers());
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = roleFilter === "All" || user.role === roleFilter;
      return searchMatch && roleMatch;
    });
  }, [users, searchTerm, roleFilter]);

  const handleExport = (format: "csv" | "json" | "xlsx") => {
    alert(`Exporting ${filteredUsers.length} users as ${format}...`);
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentUser({
      name: "",
      email: "",
      role: "EC",
      status: "Active",
      avatarUrl:
        "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setModalMode("edit");
    setCurrentUser({ ...user });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      mockDataService.deleteUser(userId);
      refreshUsers();
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.name || !currentUser.email) return;

    if (modalMode === "add") {
      const newUser: AdminUser = {
        id: Date.now(),
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role as UserRole,
        status: currentUser.status as "Active" | "Inactive",
        avatarUrl: currentUser.avatarUrl || "",
        lastLogin: "Never",
      };
      mockDataService.addUser(newUser);
    } else {
      mockDataService.updateUser(currentUser as AdminUser);
    }

    setIsModalOpen(false);
    refreshUsers();
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-headline-sm text-on-surface">User Management</h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Manage users, roles, and permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center bg-primary text-on-primary px-4 py-2 rounded-full text-label-lg font-medium hover:shadow-md transition-all"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
          <div className="relative group">
            <button className="flex items-center bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-label-lg font-medium">
              <FileOutputIcon className="h-5 w-5 mr-2" /> Export
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-surface rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-outline/10">
              <a
                onClick={() => handleExport("csv")}
                className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant cursor-pointer"
              >
                CSV
              </a>
              <a
                onClick={() => handleExport("json")}
                className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant cursor-pointer"
              >
                JSON
              </a>
              <a
                onClick={() => handleExport("xlsx")}
                className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant cursor-pointer"
              >
                Excel
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-surface-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}
          className="py-2 px-3 bg-surface-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
        >
          <option value="All">All Roles</option>
          {ALL_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-outline">
              <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">
                User
              </th>
              <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">
                Role
              </th>
              <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">
                Status
              </th>
              <th className="px-6 py-3 text-right text-label-lg text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-surface-variant hover:bg-surface-variant/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-on-surface">{user.name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-on-surface-variant">
                  <span className="bg-surface-variant px-2 py-1 rounded text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant text-sm">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onImpersonate(user)}
                    className="p-2 rounded-full hover:bg-yellow-100 text-yellow-700 transition-colors"
                    title="Impersonate User"
                  >
                    <UserCheckIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                    title="Edit User"
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 rounded-full hover:bg-error/10 text-error transition-colors"
                    title="Delete User"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "add" ? "Add New User" : "Edit User"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={currentUser.name || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, name: e.target.value })
              }
              className="w-full p-2 bg-surface border border-outline rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={currentUser.email || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
              className="w-full p-2 bg-surface border border-outline rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Role
              </label>
              <select
                value={currentUser.role || "EC"}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    role: e.target.value as UserRole,
                  })
                }
                className="w-full p-2 bg-surface border border-outline rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {ALL_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Status
              </label>
              <select
                value={currentUser.status || "Active"}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full p-2 bg-surface border border-outline rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              {modalMode === "add" ? "Create User" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
