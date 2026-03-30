import React from "react";
import { Card } from "../../../components/ui/Card";
import { WrenchIcon } from "../../../components/icons";

const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">System Settings</h1>
        <p className="text-on-surface-variant mt-2">
          Configure platform-wide settings (Admin/SA only)
        </p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-primary mb-4">
          General Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Platform Name
            </label>
            <input
              type="text"
              defaultValue="Pinnacle Global Network"
              className="w-full px-4 py-2 border border-outline rounded-lg bg-background text-on-surface"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Time Zone
            </label>
            <select className="w-full px-4 py-2 border border-outline rounded-lg bg-background text-on-surface">
              <option>America/New_York (EST)</option>
              <option>America/Chicago (CST)</option>
              <option>America/Denver (MST)</option>
              <option>America/Los_Angeles (PST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Default Language
            </label>
            <select className="w-full px-4 py-2 border border-outline rounded-lg bg-background text-on-surface">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-primary mb-4">
          Feature Flags
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-on-surface">
              Enable AI Tools for all tiers
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-on-surface">
              Enable Team Management (Scale only)
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-on-surface">
              Beta: New Dashboard Layout
            </span>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default SystemSettings;
