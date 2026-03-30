# ScaleIt 2.0 Functional Overview & Requirement Mapping
**Date:** 260126
**Version:** 2.0 (Exhaustive Edition)

This document provides a complete, screen-by-screen inventory of all implemented functionalities for both Mentee (CEO) and Mentor roles. It explicitly maps every widget, card, and metric found in the codebase to specific Client Requirements.

---

## 🏗 Core Client Requirements
1.  **Fresh & Premium Aesthetic**: "Pinnacle" branding (Navy/Gold), Glassmorphism, and high contrast for accessibility (40+ Focus).
2.  **Video Integration**: Seamless, one-click video calls (Zoom style) integrated directly into the workspace.
3.  **AI Automation ("Zero-Click")**: Reducing "administrative drudgery" by automating documentation via transcript analysis.
4.  **Value Demonstration**: Explicitly showing the Mentee what values/wins have been delivered (ROI).
5.  **Context Awareness**: Giving Mentors immediate stats/history before they hop on a call.

---

## 👤 Role: Mentee (CEO)
**Goal:** Executive clarity, immediate access to strategy, and friction-less communication.

### 1. Screen: CEO Dashboard (`DashboardPage.tsx`)
The central command center for the CEO.

| Component / Section | Sub-Component | Functionality | Mapped Client Requirement |
| :--- | :--- | :--- | :--- |
| **Header** | **Greeting & Date** | Personalized "Good morning" with high-contrast, fully spelled-out date. | **(Req 1) Aesthetic/Accessibility**. Prevents the "stale app" feel. |
| | **Pending Items Badge** | Shows count of open tasks (e.g., "3 pending items"). | **(Req 5) Context**. Quick status check. |
| | **Session Planned Badge** | Shows count of upcoming calls. | **(Req 2) Video Integration**. Reinforces coaching rhythm. |
| **Main Content Area** | **Executive Briefing** | Top-level widget showing "Value Delivered" (Strategy, Execution, Risks). | **(Req 4) Value Demonstration**. The "First thing they see" is the ROI. |
| | **Action Plan Card** | List of top 4 pending tasks. High-contrast text. "View All" link. | **(Req 1) Accessibility**. Clear, legible to-do list for older eyes. |
| | **Next Session Card** | Next meeting details with "Start Video" button and date. | **(Req 2) Video Integration**. One-click access to coaching. |
| | **Strategic Goals Card** | "Strategic Goals" section showing progress bars for KPIs (e.g., Revenue). | **(Req 4) Value Demonstration**. Visualizes "Scale Velocity" and progress. |
| | **Quick Actions Grid** | 4 Buttons: Schedule, New Task, Message, My Mentor. | **(Req 1) Aesthetic**. Easy navigation for common tasks. |
| **Sidebar (Right)** | **Video Command Center** | "Next Call" Countdown tile with "Join Meeting" button. Red/Green status. | **(Req 2) Video Integration**. The primary "Hot Line" to the mentor. |
| | **CEO Agent Widget** | Chat interface for AI assistance. | **(Legacy)** Enhanced with new styling. |
| | **Performance Context Card** | **"Scale Velocity"** Card. Shows "Top 5%" metric and momentum. | **(Req 4) Value Demonstration**. Gamification/Metric to show high performance. |

---

## 🎓 Role: Mentor
**Goal:** Efficient session management, automated paperwork, and deep client insight.

### 1. Screen: Mentor Dashboard (`MentorDashboard.tsx`)
Portfolio view to manage multiple clients.

| Component / Section | Sub-Component | Functionality | Mapped Client Requirement |
| :--- | :--- | :--- | :--- |
| **Header** | **Welcome Area** | "Welcome, [Name]" + "Managing X Active Clients". | **(Req 5) Context**. Immediate portfolio scope. |
| | **Schedule Session Btn** | Opens a modal to book a new meeting. | **(Req 5) Context**. Administrative ease. |
| **Main Content** | **Client Card Grid** | Cards for each client showing Name, Company, and Status (At Risk/On Track). | **(Req 5) Context**. High-level health check. |
| | **Progess Bar** | Visual "Program Progress" % on each client card. | **(Req 4) Value Demonstration**. Tracks journey completion. |
| | **Last Session Badge** | Shows date of last interaction on the card. | **(Req 5) Context**. Recency check. |
| **Sidebar (Right)** | **Video Command Center** | "Start Meeting" (Host View) with countdown. | **(Req 2) Video Integration**. Unified entry point. |
| | **Mentor Actions** | "Review Actions" and "Broadcast Message" buttons. | **(Req 3) Automation**. Quick links to administrative tasks. |
| | **Alerts Widget** | "Alerts" card (Currently showing "No urgent alerts"). | **(Req 5) Context**. Exception-based management. |

### 2. Screen: Session Workspace (`SessionWorkspace.tsx`)
The "Cockpit" for running a live session.

| Component / Section | Sub-Component | Functionality | Mapped Client Requirement |
| :--- | :--- | :--- | :--- |
| **Header** | **Client Profile** | Large Avatar, Name, and Company. "Start Video Call" button. | **(Req 2) Video Integration**. Personal connection + one-click video. |
| **Sidebar (Left)** | **Context Card** | "Recent Wins" list and "Pending Tasks" list. | **(Req 5) Context**. "What did we discuss last time?" answered instantly. |
| | **Live Notes** | Large text area for private note-taking during call. | **(Req 1) Accessibility**. Optimized for typing while talking. |
| **Main Area (Right)** | **AI Session Simulation** | **The "Magic" Widget**: <br> 1. Input Transcript. <br> 2. Process. <br> 3. View Extracted Insights (Decisions, Risks, Goals). | **(Req 3) AI Automation**. Removes "drudgery". Turns talk into data. |

---

## 🎨 Design System & Accessibility Standards
*   **Typography**: All body text shifted to **Slate-700** or darker. Headers are **Slate-900**.
*   **Contrast**: Font weights increased (Light -> Normal, Normal -> Medium).
*   **Theme**: "Pinnacle" Navy (#0C2340) and Gold (#C89720) used consistently for "Premium" feel.
*   **Glassmorphism**: Used on cards to prevent "flat" look while maintaining readability via high-opacity backgrounds (80%+).

---
*File generated for Client Review - 260126*
