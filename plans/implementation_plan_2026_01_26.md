# Enhancement Plan: Pinnacle Platform V2 Upgrade
Date: 2026-01-26

This plan outlines the safe, step-by-step enhancements to upgrade the current V1 parity codebase to V2 capabilities. The approach focuses on adding additive features without breaking existing V1 workflows.

## Goal Description
To safe-upgrade the platform to support **Session Intelligence** (simulated Zoom integration) and **Automated Action Planning** (AI-driven insights).

## User Review Required
> [!IMPORTANT]
> **Simulation Mode**: We will build "Simulation Mode" features. No actual external APIs (Zoom/OpenAI) will be called. All data will be mocked locally to ensure safety and stability.

## Detailed Steps

### Phase 1: Data Architecture (Additive Changes)
**Goal**: Extend the data model to support rich session data. These are pure additive changes to types and services.

#### 1.1 Define V2 Interfaces
- **File**: `types.ts`
- **Task**: Add interfaces for `SessionTranscript`, `AISummary`, `ExtractedActionItem`.
- **Safety**: No changes to existing types yet, just new interfaces.

#### 1.2 Extend Session Model
- **File**: `types.ts`
- **Task**: Update the `Session` interface to optionally include `transcriptId` and `summaryId`.
- **Safety**: Optional fields ensure backward compatibility with existing data.

#### 1.3 Update Mock Service
- **File**: `mockDataService.ts`
- **Task**: Add mock data stores (arrays) for transcripts and summaries.
- **Task**: Add `getTranscript(id)`, `getSummary(id)`, and `saveSummary(summary)` methods.
- **Safety**: New methods only. Existing methods remain untouched.

### Phase 2: Session Workspace Enhancements
**Goal**: Make the session workspace interactive without breaking the current view.

#### 2.1 Add Session State Management
- **File**: `SessionWorkspace.tsx`
- **Task**: Introduce local state for `sessionStatus` ('scheduled', 'live', 'processing', 'completed').
- **Safety**: Local state only.

#### 2.2 Implement "Start Session" Workflow
- **File**: `SessionWorkspace.tsx`
- **Task**: Replace the "Start Video Call" button with a state toggle that switches the view to "Live Mode" (showing active note-taking and timer).

#### 2.3 Create Auto-Debrief Component
- **File**: `features/mentor/components/AutoDebrief.tsx`
- **Task**: Create a new component that displays a "Processing..." animation followed by mock AI results (Summary, Risks, Actions).
- **Safety**: New isolated component.

#### 2.4 Integrate Debrief Flow
- **File**: `SessionWorkspace.tsx`
- **Task**: On "End Session", render the `AutoDebrief` component in a modal or overlay.

### Phase 3: Automation & Integration
**Goal**: Connect session outputs to the Action Plan.

#### 3.1 Create "Action Inbox" Component
- **File**: `features/action-plan/components/ActionInbox.tsx`
- **Task**: Create a component to list "Suggested Actions" derived from AI summaries.

#### 3.2 Integrate Inbox into Action Plan
- **File**: `features/action-plan/pages/ActionPlanPage.tsx`
- **Task**: Add the `ActionInbox` component to the top of the Action Plan page.
- **Task**: Implement "Accept" (add to main list) and "Dismiss" logic.

### Phase 4: Executive Dashboard Integration
**Goal**: Surface high-level insights.

#### 4.1 Create Executive Briefing Widget
- **File**: `features/dashboard/components/ExecutiveBriefing.tsx`
- **Task**: Create a widget that shows the latest "AI Summary" and "Top Risks".

#### 4.2 Add to Dashboard
- **File**: `features/dashboard/pages/DashboardPage.tsx`
- **Task**: Insert the `ExecutiveBriefing` widget into the main dashboard layout.

## Phase 5: Verification & Safety Checks
- [ ] 5.1 Verify compilation and no regressions in V1 views <!-- id: 50 -->
- [ ] 5.2 Verify complete Session->Insight->Action workflow <!-- id: 51 -->
