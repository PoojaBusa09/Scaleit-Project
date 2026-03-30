# Product Requirements & Business Analyst (BA) Specification

## 1. Executive Summary & Vision
**ScaleIt 2.0** is an enterprise-grade Business Operating System (BOS) designed to be the "Central Nervous System" for Small-to-Mid-sized Enterprise (SME) leadership teams. It replaces disjointed spreadsheets and isolated tools with a unified platform for **Strategic Planning**, **Execution Management**, **Mentorship**, and **Data-Driven Decision Making**.

**Mission**: To democratize elite business coaching tools, making them accessible, actionable, and scalable via AI.

## 2. User Personas & Stakeholders

| Persona Code | Role Name | Description | Key Motivations |
| :--- | :--- | :--- | :--- |
| **EC** | **Elevate Client (CEO)** | Founder/CEO of the SME. | Clarity, speed of execution, peer networking, simplified reporting. |
| **SC** | **Scale Client (Team)** | Leadership team member (COO, CFO). | alignment execution, accountability, ease of reporting. |
| **M** | **Mentor** | Professional Business Coach. | Efficiently managing multiple clients, tracking progress, automating session notes. |
| **MM** | **Mentor Manager** | Senior Coach overseeing Mentors. | Quality assurance, mentor performance metrics, standardization. |
| **SA** | **Super Admin** | Platform Owner (PGN Staff). | System health, billing, user management, content distribution. |

## 3. Detailed Functional Requirements

### 3.1. Strategic Planning Module (The Strategy)
*   **Vision Builder**: Interactive multi-step wizard to define Core Values, Purpose, and BHAG (Big Hairy Audacious Goal).
*   **SWOT Analysis Tool**: Drag-and-drop matrix for Strengths, Weaknesses, Opportunities, Threats.
*   **3-Year Roadmap**: Visual timeline builder for long-term targets.

### 3.2. Execution Engine (The Operations)
*   **Quarterly Rocks (OKRs)**:
    *   *Feature*: Users can define 3-7 "Rocks" per quarter.
    *   *BA Spec*: Rocks must have "SMART" fields (Specific, Measurable, Achievable, Relevant, Time-bound).
    *   *Validation*: Due date must be within current quarter boundaries.
*   **Level 10 Meeting Dashboard**:
    *   *Feature*: Real-time meeting runner with timer, agenda, and issue solving track.
    *   *BA Spec*: Auto-generate specific agenda segments: "Good News" (5m), "Scorecard" (5m), "Rock Review" (5m), "IDS - Identify, Discuss, Solve" (60m).

### 3.3. Mentorship & Coaching (The Support)
*   **Smart Matching**:
    *   *Logic*: Match Score = (Industry Weight * 0.4) + (Growth Stage Weight * 0.3) + (Personality Fit * 0.3).
*   **Session Workspace**:
    *   *Feature*: Shared note-taking area for Mentor and Client.
    *   *AI Feature*: Real-time transcription and "Magic Summary" button.

### 3.4. Organization Management (The People)
*   **Org Chart Builder**:
    *   *UI*: Node-based interactive diagram (React Flow).
    *   *BA Spec*: Each node represents a "Seat" (Role), not just a person. One person can hold multiple seats.
    *   *Fields*: Role Title, 5 Major Roles/Responsibilities (GWC - Get it, Want it, Capacity).

## 4. Non-Functional Requirements (NFR)
*   **Performance**: Dashboard load < 1.0s. Search results < 200ms.
*   **Scalability**: Architecture must support multi-tenancy (Data Isolation) for 10,000+ companies.
*   **Availability**: 99.9% Uptime SLA.
*   **Accessibility**: WCAG 2.1 AA Compliance (High contrast modes for Mentors 60+).

## 5. Domain Model & Glossary
*   **Rock**: A 90-day priority.
*   **Scorecard**: A weekly metric (KPI).
*   **IDS**: The issue-solving methodology (Identify, Discuss, Solve).
*   **Seat**: An operational role in the company, distinct from the employee.
