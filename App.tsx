import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import Dashboard from "./features/dashboard/pages/DashboardPage.tsx";
import MemberDirectory from "./features/team/pages/MemberDirectoryPage.tsx";
import ActionPlan from "./features/action-plan/pages/ActionPlanPage.tsx";
import ActionItemsCenter from "./features/action-plan/pages/ActionItemsCenterPage.tsx";
import { StrategicVision } from "./features/strategy/pages/StrategicVisionPage.tsx";
// Strategy Tools
import { ScaleItToolsPage } from "./features/strategy/pages/ScaleItToolsPage.tsx";
import { CashFlowTools } from "./features/strategy/pages/CashFlowTools.tsx";
import { AllianceTools } from "./features/strategy/pages/AllianceTools.tsx";
import { LeadershipTools } from "./features/strategy/pages/LeadershipTools.tsx";
import { ExecutionTools } from "./features/strategy/pages/ExecutionTools.tsx";
import AIBusinessTools from "./features/strategy/pages/AIBusinessTools.tsx";
import OrgChartBuilder from "./features/team/pages/OrgChartBuilderPage.tsx";
import FinancialForecasting from "./features/strategy/pages/FinancialForecastingPage.tsx";
import HiringAssistant from "./features/team/pages/HiringAssistantPage.tsx";
import PerfectEmployeeDecoderPage from "./features/team/pages/PerfectEmployeeDecoderPage.tsx";
import FourSuperpowersPage from "./features/team/pages/FourSuperpowersPage.tsx";
import MySuccessTeamPage from "./features/team/pages/MySuccessTeamPage.tsx";
import HeroTeamJourneyPage from "./features/team/pages/HeroTeamJourneyPage.tsx";
import OldStoryNewStoryPage from "./features/team/pages/OldStoryNewStoryPage.tsx";
import MoneyMindsetEquationPage from "./features/team/pages/MoneyMindsetEquationPage.tsx";
import FearLeapingPage from "./features/team/pages/FearLeapingPage.tsx";
import TargetAudienceAnalyzer from "./features/strategy/pages/TargetAudienceAnalyzerPage.tsx";
import LeadershipAssessment from "./features/assessments/pages/LeadershipAssessment.tsx";
import BusinessAssessment from "./features/assessments/pages/BusinessAssessment.tsx";
import OnboardingAssessment from "./features/assessments/pages/OnboardingAssessment.tsx";
import CommunityForum from "./features/communication/pages/CommunityForum.tsx";
import ResourceLibrary from "./features/resources/pages/ResourceLibrary.tsx";
import MemberFileRepository from "./features/resources/pages/MemberFileRepository.tsx";
import Scheduler from "./features/calendar/pages/Scheduler.tsx";
import CommunicationHub from './features/communication/pages/CommunicationHub.tsx';
import AnnouncementsFeed from './features/communication/pages/AnnouncementsFeed.tsx';
import EventsCalendar from "./features/calendar/pages/EventsCalendar.tsx";

import SupportTickets from "./features/support/pages/SupportTickets.tsx";
import Login from "./features/auth/pages/LoginPage.tsx";

// New Pages
import WinsTimeline from "./features/growth/pages/WinsTimeline.tsx";
import MyJourney from "./features/growth/pages/MyJourney.tsx";
import GrowthProgressHub from "./features/growth/pages/GrowthProgressHub.tsx";

// Mentor Placeholder Pages
import MemberStatusPage from "./features/mentor/pages/MemberStatusPage.tsx";
import MentorsCornerPage from "./features/mentor/pages/MentorsCornerPage.tsx";
import { ScalableModels } from "./features/strategy/pages/ScalableModelsPage.tsx";

import GrowthTracking from "./features/strategy/pages/GrowthTrackingPage.tsx";
import BigPictureVision from "./features/strategy/pages/BigPictureVisionPage.tsx";
import ScoreTracker from "./features/strategy/pages/ScoreTrackerPage.tsx";
import NorthStarMetrics from "./features/strategy/pages/NorthStarMetricsPage.tsx";
import SalesMarketingBlueprintPage from "./features/strategy/pages/SalesMarketingBlueprintPage.tsx";
import GapAnalysisPage from "./features/strategy/pages/GapAnalysisPage.tsx";
import PerfectClientDecoderPage from "./features/strategy/pages/PerfectClientDecoderPage.tsx";
import ChampionCustomerJourneyPage from "./features/strategy/pages/ChampionCustomerJourneyPage.tsx";
import MarketingMethodsPage from "./features/strategy/pages/MarketingMethodsPage.tsx";
import ExecutiveBriefingsPage from "./features/dashboard/pages/ExecutiveBriefingsPage.tsx";
import DecisionMatrix from "./features/strategy/pages/DecisionMatrixPage.tsx";
import ComingSoon from "./features/shared/pages/ComingSoon.tsx";


// Reports
import MyProgress from "./features/reporting/pages/MyProgress.tsx";
import MyClients from "./features/reporting/pages/MyClients.tsx";
import PodReports from "./features/reporting/pages/PodReports.tsx";
import ProgramAnalytics from "./features/reporting/pages/ProgramAnalytics.tsx";

import { EcosystemReportPage } from "./features/reporting/pages/EcosystemReportPage.tsx";

// Marketing
import Campaigns from "./features/marketing/pages/Campaigns.tsx";
import Audiences from "./features/marketing/pages/Audiences.tsx";

// Billing
import Subscriptions from "./features/billing/pages/Subscriptions.tsx";
import Invoices from "./features/billing/pages/Invoices.tsx";
import QBOIntegration from "./features/billing/pages/QBOIntegration.tsx";

// Content Studio
import EmailTemplates from "./features/content/pages/EmailTemplates.tsx";
import Notifications from "./features/content/pages/Notifications.tsx";
import Forms from "./features/content/pages/Forms.tsx";
import WebContent from "./features/content/pages/WebContent.tsx";

// Team
import TeamManagement from "./features/team/pages/TeamManagement.tsx";
import Users from "./features/team/pages/Users.tsx";
import RolesPermissions from "./features/team/pages/RolesPermissions.tsx";

// Settings
import Integrations from "./features/settings/pages/Integrations.tsx";
import SystemSettings from "./features/settings/pages/SystemSettings.tsx";
import Settings from "./features/settings/pages/Settings.tsx";

// Mentor Pages
import MentorDashboard from "./features/mentor/pages/MentorDashboard.tsx";
import ClientDetails from "./features/mentor/pages/ClientDetails.tsx";
import SessionWorkspace from "./features/mentor/pages/SessionWorkspace.tsx";
import SessionLog from "./features/mentor/pages/SessionLog.tsx";
import SessionDetails from "./features/mentor/pages/SessionDetails.tsx";
import SessionWorkspacePage from "./features/sessions/pages/SessionWorkspacePage.tsx";
import { TranscriptSimulationPage } from "./features/sessions/pages/TranscriptSimulationPage.tsx";

// Admin Pages
import AdminDashboard from "./features/admin/pages/AdminDashboard.tsx";
import UserManagement from "./features/admin/pages/UserManagement.tsx";
import MentorAssignment from "./features/admin/pages/MentorAssignment.tsx";
import SystemConfiguration from "./features/admin/pages/SystemConfiguration.tsx";
import PerformanceMonitoring from "./features/admin/pages/PerformanceMonitoring.tsx";
import ReportingAnalytics from "./features/admin/pages/ReportingAnalytics.tsx";
import FinancialTracking from "./features/admin/pages/FinancialTracking.tsx";
import TroubleshootingTools from "./features/admin/pages/TroubleshootingTools.tsx";

import { UserRole, ImpersonatedUser, AdminUser, UserContext } from "./types.ts";
import { UserCheckIcon } from "./components/icons.tsx";
import { login, getCurrentUser } from "./services/mockAuth.ts";
import { mockDataService } from "./services/mockDataService.ts";

import GlobalChatWidget from "./components/GlobalChatWidget.tsx";
import MobileHeader from "./components/MobileHeader.tsx";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [impersonatedUser, setImpersonatedUser] =
    useState<ImpersonatedUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    const user = login(role);
    setUserRole(role);
    setUserContext(user);
    if (user && user.tenantId) {
      mockDataService.setTenantContext(user.tenantId);
    }
    navigate('/');
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserContext(null);
    setImpersonatedUser(null);
  };

  const handleImpersonate = (user: AdminUser) => {
    setImpersonatedUser({ name: user.name, role: user.role });
  };

  const handleExitImpersonation = () => {
    setImpersonatedUser(null);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const activeRole = impersonatedUser ? impersonatedUser.role : userRole;

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  const user = userContext || {
    name: "User",
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=User`,
  };

  const MainLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <div className="flex h-screen flex-col lg:flex-row bg-background text-on-background overflow-hidden relative">
      {/* Mobile Top Bar */}
      <MobileHeader
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        user={user}
      />

      {/* Sidebar - Desktop: fixed/collapsible, Mobile: Overlay Drawer */}
      <Sidebar
        userRole={activeRole!}
        userContext={userContext!}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={closeMobileMenu}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {impersonatedUser && (
          <div className="bg-warning/20 text-warning px-6 py-2 flex items-center justify-between text-sm shadow-sm z-10 border-b border-warning/30">
            <div className="flex items-center font-medium">
              <UserCheckIcon className="h-4 w-4 mr-2" />
              <span>
                Viewing platform as <strong>{impersonatedUser.name}</strong> (
                {impersonatedUser.role})
              </span>
            </div>
            <button
              onClick={handleExitImpersonation}
              className="font-bold hover:underline bg-warning/20 px-3 py-1 rounded"
            >
              Exit View
            </button>
          </div>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-0 md:p-1 lg:p-0">
          {children}
        </main>
        <GlobalChatWidget />
      </div>
    </div>
  );

  const getRoutesForRole = (role: UserRole) => {
    // Common routes for members (EC, SC, STM)
    const memberRoutes = (
      <>
        <Route path="/" element={<Dashboard />} />
        <Route path="/directory" element={<MemberDirectory />} />
        <Route path="/sessions" element={<SessionLog />} />
        <Route path="/sessions/:id" element={<SessionDetails />} />
        <Route path="/sessions/:id/workspace" element={<SessionWorkspacePage />} />
        <Route path="/sessions/simulation" element={<TranscriptSimulationPage />} />
        <Route path="/plan" element={<ActionPlan />} />
        <Route path="/action-plan" element={<ActionItemsCenter />} />
        <Route path="/wins" element={<WinsTimeline />} />
        <Route path="/journey" element={<MyJourney />} />
        <Route path="/growth-tracking" element={<GrowthTracking />} />
        <Route path="/big-picture-vision" element={<BigPictureVision />} />
        <Route path="/score-tracker" element={<ScoreTracker />} />
        <Route path="/north-star-metrics" element={<NorthStarMetrics />} />
        <Route path="/gap-analysis" element={<GapAnalysisPage />} />
        <Route path="/sales-marketing-blueprint" element={<SalesMarketingBlueprintPage />} />
        <Route path="/perfect-client-decoder" element={<PerfectClientDecoderPage />} />
        <Route path="/champion-customer-journey" element={<ChampionCustomerJourneyPage />} />
        <Route path="/marketing-methods" element={<MarketingMethodsPage />} />
        <Route path="/marketing-methods" element={<MarketingMethodsPage />} />
        <Route path="/executive-briefings" element={<ExecutiveBriefingsPage />} />
        <Route path="/ecosystem-report" element={<EcosystemReportPage />} />
        <Route path="/decision-matrix" element={<DecisionMatrix />} />
        <Route path="/strategic-vision" element={<StrategicVision />} />

        <Route path="/scaleit-method" element={<ScaleItToolsPage />} />
        <Route
          path="/scaleit/strategy"
          element={<ScaleItToolsPage activeTab="S" />}
        />
        <Route path="/scaleit/cash" element={<CashFlowTools />} />
        <Route path="/scaleit/alliance" element={<AllianceTools />} />



        <Route path="/scaleit/leadership" element={<LeadershipTools />} />
        <Route path="/scaleit/execution" element={<ExecutionTools />} />

        {/* Specific Tool Routes */}
        <Route path="/tools/scalable-models" element={<ScalableModels />} />
        <Route path="/tools/org-chart" element={<OrgChartBuilder />} />
        <Route
          path="/tools/financial-forecasting"
          element={<FinancialForecasting />}
        />
        <Route path="/tools/hiring-assistant" element={<HiringAssistant />} />
        <Route
          path="/tools/target-audience-analyzer"
          element={<TargetAudienceAnalyzer />}
        />

        {/* Catch-all for new tools */}
        <Route path="/tools/perfect-employee-decoder" element={<PerfectEmployeeDecoderPage />} />
        <Route path="/tools/4-superpowers" element={<FourSuperpowersPage />} />
        <Route path="/tools/my-success-team" element={<MySuccessTeamPage />} />
        <Route path="/tools/hero-team-journey" element={<HeroTeamJourneyPage />} />
        <Route path="/tools/*" element={<ComingSoon />} />
        <Route path="/tools" element={<AIBusinessTools />} />
        <Route
          path="/tools/financial-forecasting"
          element={<FinancialForecasting />}
        />
        <Route path="/tools/hiring-assistant" element={<HiringAssistant />} />
        <Route
          path="/tools/target-audience-analyzer"
          element={<TargetAudienceAnalyzer />}
        />
        <Route
          path="/leadership-assessment"
          element={<LeadershipAssessment />}
        />
        <Route path="/tools/old-story-new-story" element={<OldStoryNewStoryPage />} />
        <Route path="/tools/money-mindset-equation" element={<MoneyMindsetEquationPage />} />
        <Route path="/tools/fear-leaping" element={<FearLeapingPage />} />
        <Route path="/business-assessment" element={<BusinessAssessment />} />
        <Route
          path="/onboarding-assessment"
          element={<OnboardingAssessment />}
        />
        <Route path="/community" element={<CommunityForum />} />
        <Route path="/resources" element={<ResourceLibrary />} />
        <Route path="/resources/files" element={<MemberFileRepository />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/messages" element={<AnnouncementsFeed />} />
        <Route path="/events" element={<EventsCalendar />} />
        <Route path="/growth-progress" element={<GrowthProgressHub />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<SupportTickets />} />
        <Route path="/reports/my-progress" element={<MyProgress />} />
      </>
    );

    switch (role) {
      case "EC": // Elevate Member - No team routes
        return (
          <>
            {memberRoutes}
            <Route path="/billing/subscriptions" element={<Subscriptions />} />
            <Route path="/billing/invoices" element={<Invoices />} />
            <Route path="/settings/integrations" element={<Integrations />} />
          </>
        );

      case "SC": // Scale CEO - Has team routes
        return (
          <>
            {memberRoutes}
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/billing/subscriptions" element={<Subscriptions />} />
            <Route path="/billing/invoices" element={<Invoices />} />
            <Route path="/settings/integrations" element={<Integrations />} />
          </>
        );

      case "STM": // Scale Team Member
        return (
          <>
            {memberRoutes}
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/settings/integrations" element={<Integrations />} />
          </>
        );

      case "M": // Mentor
        return (
          <>
            <Route
              path="/"
              element={<Navigate to="/mentor/dashboard" replace />}
            />
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route
              path="/mentor/client/:clientId"
              element={<ClientDetails />}
            />
            <Route
              path="/mentor/session-workspace/:clientId"
              element={<SessionWorkspace />}
            />
            {/* Standard member routes — mentors see same items as CEO members */}
            <Route path="/sessions" element={<SessionLog />} />
            <Route path="/sessions/:id" element={<SessionDetails />} />
            <Route path="/sessions/:id/workspace" element={<SessionWorkspacePage />} />
            <Route path="/growth-progress" element={<GrowthProgressHub />} />
            <Route path="/scaleit-method" element={<ScaleItToolsPage />} />
            <Route path="/score-tracker" element={<ScoreTracker />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/resources/files" element={<MemberFileRepository />} />
            <Route path="/community" element={<CommunityForum />} />
            <Route path="/messages" element={<AnnouncementsFeed />} />
            <Route path="/reports/my-progress" element={<MyProgress />} />
            <Route path="/reports/my-clients" element={<MyClients />} />
            {/* Mentor-specific routes */}
            <Route path="/mentor/member-status" element={<MemberStatusPage />} />
            <Route path="/mentor/corner" element={<MentorsCornerPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integrations" element={<Integrations />} />
            <Route path="/support" element={<SupportTickets />} />
          </>
        );

      case "MM": // Mentor Manager
        return (
          <>
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/messages" element={<AnnouncementsFeed />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/reports/my-progress" element={<MyProgress />} />
            <Route path="/reports/my-clients" element={<MyClients />} />
            <Route path="/reports/pod-reports" element={<PodReports />} />
            <Route path="/people/users" element={<Users />} />
            <Route path="/people/roles" element={<RolesPermissions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integrations" element={<Integrations />} />
            <Route path="/support" element={<SupportTickets />} />
          </>
        );

      case "ST": // PGN Staff
        return (
          <>
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/users"
              element={<UserManagement onImpersonate={handleImpersonate} />}
            />
            <Route path="/messages" element={<AnnouncementsFeed />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/reports/my-progress" element={<MyProgress />} />
            <Route path="/reports/my-clients" element={<MyClients />} />
            <Route path="/reports/pod-reports" element={<PodReports />} />
            <Route path="/marketing/campaigns" element={<Campaigns />} />
            <Route path="/marketing/audiences" element={<Audiences />} />
            <Route path="/people/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integrations" element={<Integrations />} />
            <Route path="/support" element={<SupportTickets />} />
          </>
        );

      case "AM": // Admin Manager
        return (
          <>
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/users"
              element={<UserManagement onImpersonate={handleImpersonate} />}
            />
            <Route path="/admin/assignments" element={<MentorAssignment />} />
            <Route path="/admin/config" element={<SystemConfiguration />} />
            <Route
              path="/admin/monitoring"
              element={<PerformanceMonitoring />}
            />
            <Route path="/admin/reports" element={<ReportingAnalytics />} />
            <Route path="/admin/financials" element={<FinancialTracking />} />
            <Route
              path="/admin/troubleshooting"
              element={<TroubleshootingTools />}
            />
            <Route path="/messages" element={<AnnouncementsFeed />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/reports/my-progress" element={<MyProgress />} />
            <Route path="/reports/my-clients" element={<MyClients />} />
            <Route path="/reports/pod-reports" element={<PodReports />} />
            <Route
              path="/reports/program-analytics"
              element={<ProgramAnalytics />}
            />
            <Route path="/marketing/campaigns" element={<Campaigns />} />
            <Route path="/marketing/audiences" element={<Audiences />} />
            <Route path="/people/users" element={<Users />} />
            <Route path="/people/roles" element={<RolesPermissions />} />
            <Route path="/billing/subscriptions" element={<Subscriptions />} />
            <Route path="/billing/invoices" element={<Invoices />} />
            <Route path="/content/templates" element={<EmailTemplates />} />
            <Route path="/content/notifications" element={<Notifications />} />
            <Route path="/content/forms" element={<Forms />} />
            <Route path="/content/web" element={<WebContent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integrations" element={<Integrations />} />
            <Route path="/settings/system" element={<SystemSettings />} />
            <Route path="/support" element={<SupportTickets />} />
          </>
        );

      case "SA": // Super Admin
        return (
          <>
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/users"
              element={<UserManagement onImpersonate={handleImpersonate} />}
            />
            <Route path="/admin/assignments" element={<MentorAssignment />} />
            <Route path="/admin/config" element={<SystemConfiguration />} />
            <Route
              path="/admin/monitoring"
              element={<PerformanceMonitoring />}
            />
            <Route path="/admin/reports" element={<ReportingAnalytics />} />
            <Route path="/admin/financials" element={<FinancialTracking />} />
            <Route
              path="/admin/troubleshooting"
              element={<TroubleshootingTools />}
            />
            <Route path="/messages" element={<AnnouncementsFeed />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/reports/my-progress" element={<MyProgress />} />
            <Route path="/reports/my-clients" element={<MyClients />} />
            <Route path="/reports/pod-reports" element={<PodReports />} />
            <Route
              path="/reports/program-analytics"
              element={<ProgramAnalytics />}
            />
            <Route path="/marketing/campaigns" element={<Campaigns />} />
            <Route path="/marketing/audiences" element={<Audiences />} />
            <Route path="/people/users" element={<Users />} />
            <Route path="/people/roles" element={<RolesPermissions />} />
            <Route path="/billing/subscriptions" element={<Subscriptions />} />
            <Route path="/billing/invoices" element={<Invoices />} />
            <Route path="/content/templates" element={<EmailTemplates />} />
            <Route path="/content/notifications" element={<Notifications />} />
            <Route path="/content/forms" element={<Forms />} />
            <Route path="/content/web" element={<WebContent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/integrations" element={<Integrations />} />
            <Route path="/settings/system" element={<SystemSettings />} />
            <Route path="/support" element={<SupportTickets />} />
          </>
        );

      default:
        return <Route path="*" element={<Navigate to="/" />} />;
    }
  };

  return (
    <MainLayout>
      <Routes>
        {getRoutesForRole(activeRole!)}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
