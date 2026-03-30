import React, { useState, useMemo } from "react";
import { Card } from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import {
  AwardIcon,
  CheckCircleIcon,
  CalendarIcon,
  TargetIcon,
} from "../../../components/icons";
import { mockDataService } from "../../../services/mockDataService";
import { Task, ScaleITCategory } from "../../../types";

const WinsTimeline: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch wins from mock service
  const wins = useMemo(() => {
    return mockDataService
      .getTasks()
      .filter((t) => t.isWin)
      .sort((a, b) => {
        // Sort by winDate descending, fallback to id
        const dateA = a.winDate ? new Date(a.winDate).getTime() : 0;
        const dateB = b.winDate ? new Date(b.winDate).getTime() : 0;
        return dateB - dateA;
      });
  }, []);

  // Filter logic
  const filteredWins = wins.filter((win) => {
    if (selectedCategory !== "all" && win.category !== selectedCategory)
      return false;
    // Simple quarter filtering (mock logic for now as dates might be strings)
    if (selectedQuarter !== "all") {
      // In a real app, parse dates and check quarters.
      // For mock, we'll just check if the quarter field matches if present, or ignore
      if (
        win.quarter !== selectedQuarter &&
        selectedQuarter !== "this" &&
        selectedQuarter !== "next"
      )
        return true; // Allow loose matching for demo
    }
    return true;
  });

  const getCategoryColor = (category?: ScaleITCategory) => {
    switch (category) {
      case "S":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "C":
        return "bg-green-100 text-green-800 border-green-200";
      case "A":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "L":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "E":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryLabel = (category?: ScaleITCategory) => {
    switch (category) {
      case "S":
        return "Strategy";
      case "C":
        return "Cash";
      case "A":
        return "Alliance";
      case "L":
        return "Leadership";
      case "E":
        return "Execution";
      default:
        return "General";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wins Timeline</h1>
          <p className="text-gray-500 mt-1">
            Celebrate your achievements and track your progress over time.
          </p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center">
          <AwardIcon className="h-5 w-5 mr-2" />
          {wins.length} Total Wins
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <select
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="all">All Time</option>
          <option value="this">This Quarter</option>
          <option value="last">Last Quarter</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="S">Strategy</option>
          <option value="C">Cash</option>
          <option value="A">Alliance</option>
          <option value="L">Leadership</option>
          <option value="E">Execution</option>
        </select>
      </div>

      {/* Timeline */}
      {filteredWins.length > 0 ? (
        <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {filteredWins.map((win, index) => (
            <div
              key={win.id}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[2.15rem] top-1.5 h-7 w-7 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
              </div>

              <Card className="hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getCategoryColor(
                          win.category
                        )}`}
                      >
                        {getCategoryLabel(win.category)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {win.winDate || "No date"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {win.text}
                    </h3>
                    {win.notes && (
                      <p className="text-gray-600 mt-2 text-sm bg-gray-50 p-3 rounded-md">
                        "{win.notes}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                    Achieved
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<AwardIcon className="h-16 w-16 text-gray-300" />}
            title="No Wins Found"
            description="Try adjusting your filters or go to your Action Plan to mark tasks as wins."
            action={{
              label: "Go to Action Plan",
              onClick: () => (window.location.href = "/plan"),
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default WinsTimeline;
