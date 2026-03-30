import React from "react";
import { Card } from "../../../components/ui/Card";
import { SlidersIcon } from "../../../components/icons";

const Integrations: React.FC = () => {
  const integrations = [
    {
      name: "Google SSO",
      description: "Single sign-on with Google",
      status: "Connected",
      icon: "🔐",
    },
    {
      name: "Calendar Sync",
      description: "Sync with Google Calendar",
      status: "Connected",
      icon: "📅",
    },
    {
      name: "Zoom",
      description: "Video conferencing integration",
      status: "Connected",
      icon: "🎥",
    },
    {
      name: "HubSpot",
      description: "CRM integration",
      status: "Not Connected",
      icon: "📊",
    },
    {
      name: "QuickBooks Online",
      description: "Accounting integration",
      status: "Connected",
      icon: "💰",
    },
    {
      name: "PinnPoint",
      description: "Custom integration",
      status: "Connected",
      icon: "📍",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Integrations</h1>
        <p className="text-on-surface-variant mt-2">
          Manage platform integrations and connections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} hover>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{integration.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary">
                  {integration.name}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1 mb-3">
                  {integration.description}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${integration.status === "Connected"
                      ? "bg-success/20 text-success"
                      : "bg-outline/20 text-on-surface-variant"
                    }`}
                >
                  {integration.status}
                </span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-outline rounded-lg hover:bg-background transition-colors text-sm font-medium">
              Configure
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
