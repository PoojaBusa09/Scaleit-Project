// Fix: Reconstructed the file content which was corrupted and added the missing default export.
import React from "react";
import { Link } from "react-router-dom";
// Fix: Corrected import path for icons
import {
  DollarSignIcon,
  ChevronRightIcon,
  UserPlusIcon,
  UsersIcon,
} from "../../../components/icons.tsx";

// --- Constants ---

const BUSINESS_TOOLS = [
  {
    icon: DollarSignIcon,
    title: "Financial Forecasting",
    description: "Model your financial future and test different growth scenarios.",
    path: "/tools/financial-forecasting",
    iconBgColor: "bg-tertiary-container",
    iconTextColor: "text-on-tertiary-container",
  },
  {
    icon: UserPlusIcon,
    title: "Hiring Assistant",
    description: "Generate job descriptions and interview kits for new roles.",
    path: "/tools/hiring-assistant",
    iconBgColor: "bg-secondary-container",
    iconTextColor: "text-on-secondary-container",
  },
  {
    icon: UsersIcon,
    title: "Target Audience Analyzer",
    description: "Define your ideal customer personas and marketing channels.",
    path: "/tools/target-audience-analyzer",
    iconBgColor: "bg-error-container",
    iconTextColor: "text-on-error-container",
  }
];

// --- Components ---

interface ToolCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  iconBgColor: string;
  iconTextColor: string;
}

/**
 * Card component for a business tool.
 */
const ToolCard: React.FC<ToolCardProps> = ({
  icon: Icon,
  title,
  description,
  path,
  iconBgColor,
  iconTextColor,
}) => (
  <Link
    to={path}
    className="group flex flex-col justify-between bg-surface p-6 rounded-lg shadow-sm border border-outline/20 hover:shadow-lg hover:-translate-y-1 transition-all"
    aria-label={`Open ${title}`}
  >
    <div>
      <div
        className={`flex items-center justify-center h-12 w-12 rounded-xl ${iconBgColor} mb-4`}
        aria-hidden="true"
      >
        <Icon className={`h-6 w-6 ${iconTextColor}`} />
      </div>
      <h3 className="text-title-lg font-semibold text-on-surface">{title}</h3>
      <p className="text-body-md text-on-surface-variant mt-2">{description}</p>
    </div>
    <div className="flex items-center justify-end text-sm font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
      Open Tool <ChevronRightIcon className="h-4 w-4 ml-1" />
    </div>
  </Link>
);

/**
 * AI Business Tools Page
 * Lists available AI-powered business tools.
 */
const AIBusinessTools: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-headline-md text-on-surface">Business Tools</h1>
        <p className="text-body-lg text-on-surface-variant mt-1">
          Leverage Pinnacle AI to accelerate your business growth.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUSINESS_TOOLS.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default AIBusinessTools;

