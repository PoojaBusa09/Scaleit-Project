import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  hover = false,
}) => {
  return (
    <div
      className={`bg-surface border border-outline rounded-lg p-6 ${
        hover
          ? "hover:shadow-lg hover:border-secondary transition-all cursor-pointer"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  trend = "neutral",
}) => {
  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-on-surface-variant",
  };

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-on-surface-variant mb-1">{title}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${trendColors[trend]}`}>
              {change > 0 ? "+" : ""}
              {change}%
            </p>
          )}
        </div>
        {icon && <div className="text-secondary">{icon}</div>}
      </div>
    </Card>
  );
};

export default Card;
