import React, { useState } from "react";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_TASKS, MOCK_SESSIONS } from "../../../constants.ts";
import {
  TrophyIcon,
  CalendarIcon,
  SparklesIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  TargetIcon,
  ZapIcon,
  AwardIcon,
} from "../../../components/icons.tsx";
import { Card } from "../../../components/ui/Card.tsx";

const MyJourney: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "wins" | "sessions"
  >("all");

  // Create events
  const joinEvent = {
    type: "join",
    date: new Date("2024-01-15"),
    title: "Joined Pinnacle Global Network",
    description:
      "Welcome to your transformation journey! This is where everything begins.",
    category: "milestone",
  };

  const winEvents = MOCK_TASKS.filter((task) => task.isWin && task.winDate).map(
    (task) => ({
      type: "win",
      date: new Date(task.winDate!),
      title: task.text,
      description: `Achieved a major milestone in ${task.category}`,
      category: task.category,
    })
  );

  const sessionEvents = MOCK_SESSIONS.filter((session) => session.attended).map(
    (session) => ({
      type: "session",
      date: new Date(session.date),
      title: session.title,
      description: session.transcript
        ? "Coaching session with mentor notes"
        : "Coaching session completed",
      category: "coaching",
    })
  );

  // Milestone events
  const milestones = [
    {
      type: "milestone",
      date: new Date("2024-03-01"),
      title: "First Quarter Complete",
      description: "90 days of consistent growth and progress",
      category: "milestone",
    },
    {
      type: "milestone",
      date: new Date("2024-06-01"),
      title: "Mid-Year Milestone",
      description: "Halfway through your transformation journey",
      category: "milestone",
    },
  ];

  let allEvents = [joinEvent, ...winEvents, ...sessionEvents, ...milestones];

  // Filter events
  if (selectedFilter !== "all") {
    allEvents = allEvents.filter((e) => e.type === selectedFilter);
  }

  allEvents = allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate stats
  const stats = {
    wins: winEvents.length,
    sessions: sessionEvents.length,
    daysActive: Math.floor(
      (new Date().getTime() - new Date("2024-01-15").getTime()) /
      (1000 * 3600 * 24)
    ),
    milestones: milestones.length + 1,
  };

  const progressPercentage = Math.min(100, (stats.daysActive / 365) * 100);

  const getIcon = (type: string) => {
    switch (type) {
      case "join":
        return <SparklesIcon className="h-5 w-5" />;
      case "win":
        return <TrophyIcon className="h-5 w-5" />;
      case "session":
        return <CalendarIcon className="h-5 w-5" />;
      case "milestone":
        return <AwardIcon className="h-5 w-5" />;
      default:
        return <CheckCircleIcon className="h-5 w-5" />;
    }
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case "join":
        return {
          bg: "bg-gradient-to-br from-purple-500 to-purple-600",
          border: "border-purple-500",
          text: "text-purple-600",
          lightBg: "bg-purple-50",
          ring: "ring-purple-500/20",
        };
      case "win":
        return {
          bg: "bg-gradient-to-br from-yellow-500 to-orange-500",
          border: "border-yellow-500",
          text: "text-yellow-600",
          lightBg: "bg-yellow-50",
          ring: "ring-yellow-500/20",
        };
      case "session":
        return {
          bg: "bg-gradient-to-br from-blue-500 to-blue-600",
          border: "border-blue-500",
          text: "text-blue-600",
          lightBg: "bg-blue-50",
          ring: "ring-blue-500/20",
        };
      case "milestone":
        return {
          bg: "bg-gradient-to-br from-green-500 to-emerald-600",
          border: "border-green-500",
          text: "text-green-600",
          lightBg: "bg-green-50",
          ring: "ring-green-500/20",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-500 to-gray-600",
          border: "border-gray-500",
          text: "text-gray-600",
          lightBg: "bg-gray-50",
          ring: "ring-gray-500/20",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Journey"
        description="Track your transformation timeline and milestones"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.wins}</p>
              <p className="text-sm text-on-surface-variant">Big Wins</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {stats.sessions}
              </p>
              <p className="text-sm text-on-surface-variant">Sessions</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <AwardIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {stats.milestones}
              </p>
              <p className="text-sm text-on-surface-variant">Milestones</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <TrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {stats.daysActive}
              </p>
              <p className="text-sm text-on-surface-variant">Days Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-primary">
            Annual Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">Filter:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedFilter === "all"
                ? "bg-primary text-white"
                : "bg-surface-variant text-on-surface hover:bg-outline"
                }`}
            >
              All Events
            </button>
            <button
              onClick={() => setSelectedFilter("wins")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedFilter === "wins"
                ? "bg-yellow-500 text-white"
                : "bg-surface-variant text-on-surface hover:bg-outline"
                }`}
            >
              Wins Only
            </button>
            <button
              onClick={() => setSelectedFilter("sessions")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedFilter === "sessions"
                ? "bg-blue-500 text-white"
                : "bg-surface-variant text-on-surface hover:bg-outline"
                }`}
            >
              Sessions Only
            </button>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-outline md:-ml-px"></div>

        <div className="space-y-6">
          {allEvents.map((event, index) => {
            const isLeft = index % 2 === 0;
            const style = getEventStyle(event.type);

            return (
              <div
                key={index}
                className={`relative flex items-center ${isLeft ? "md:flex-row-reverse" : ""
                  }`}
              >
                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2"></div>

                {/* Icon Circle */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                  <div
                    className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center text-white shadow-lg ring-4 ring-white`}
                  >
                    {getIcon(event.type)}
                  </div>
                </div>

                {/* Content Card */}
                <div className="ml-16 md:ml-0 md:w-1/2 w-full">
                  <div className={`${isLeft ? "md:pr-10" : "md:pl-10"}`}>
                    <Card>
                      <div className={`border-l-4 ${style.border} pl-4`}>
                        {/* Date and Type Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase ${style.lightBg} ${style.text}`}
                          >
                            {event.type}
                          </span>
                          <span className="text-xs font-medium text-on-surface-variant">
                            {event.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-primary mb-1">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-on-surface-variant">
                          {event.description}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Current Position Marker */}
          <div className="relative flex items-center md:flex-row-reverse">
            <div className="hidden md:block md:w-1/2"></div>

            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg ring-4 ring-white animate-pulse">
                <ZapIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="ml-16 md:ml-0 md:w-1/2 w-full">
              <div className="md:pr-10">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-500">
                  <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    You Are Here
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    Ready for your next breakthrough!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJourney;
