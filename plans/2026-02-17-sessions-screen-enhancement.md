# Sessions Screen Enhancement — Implementation Plan

This plan covers the comprehensive redesign of the Sessions screen based on the team discussion summary. The current screens (`SessionLog.tsx` and `SessionDetails.tsx`) will be significantly reworked, with new mock data types and richer interactions.

## User Review Required

> [!IMPORTANT]
> **Scoping Decision**: The following items are included as **mocked/simulated** features since they'll need real backend/API integration in production:
> - **Zoom integration details** (waiting room, API credentials, no-password join) — mocked UI
> - **Video retention & bookmark/favorites** — mocked UI with retention countdown + bookmark toggle
> - **5-minute session warning prompts** — mocked as a static banner component
> - **Completed action items → wins conversion** — flagged as TBD in discussion, deferred
> - **Mobile-optimized video viewing** — separate responsive pass after core screen is done

> [!WARNING]
> **Column Removal**: Removing Participants, Duration, and Status columns from the session list will change the table layout significantly. Status is repurposed on the Completed tab to show "Attended" / "Not Attended".

---

## Proposed Changes

### Data Layer — Types & Mock Data

Summary: Extend the `Session` interface with new fields for session categories, RSVP, attendance, wins, and suggested prompts. Enrich mock data accordingly.

#### [MODIFY] [pgnTypes.ts](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/features/shared/pgnTypes.ts)

Add new types and extend the `Session` interface:

```diff
+export type SessionCategory = 'strategy' | 'mastermind' | 'lab_workshop' | 'huddle' | 'custom';
+export type RSVPStatus = 'confirmed' | 'maybe' | 'declined' | null;
+export type AttendanceStatus = 'attended' | 'not_attended' | null;

 export interface Session {
   // ... existing fields ...
+  category: SessionCategory;
+  categoryLabel?: string;         // Custom label when category is 'custom'
+  rsvpStatus: RSVPStatus;
+  attendance: AttendanceStatus;
+  endedAt?: string;               // Actual end time (first login to last logout)
+  actualDuration?: number;        // Actual minutes (may differ from scheduled)
+  isGlobalEvent: boolean;         // PGN org-wide event vs mentor-specific
+  notificationsEnabled: boolean;
 }
```

Add new interfaces for enhanced prompts and wins:

```typescript
export interface SuggestedPrompt {
  id: string;
  text: string;
  originSessionId?: string;
  originDate?: string;
  isResolved: boolean;
  isDismissed: boolean;
  addedBy: 'ai' | 'mentor';
}

export interface SessionWin {
  id: string;
  sessionId: string;
  description: string;
  detectedAt: string;
  source: 'mentor_callout' | 'ai_detected';
}
```

#### [MODIFY] [mockSessions.ts](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/data/mockSessions.ts)

- Add new fields to all existing sessions (`category`, `rsvpStatus`, `attendance`, `isGlobalEvent`, `notificationsEnabled`)
- Add additional mock sessions to demonstrate:
  - PGN global events (workshops, guest speakers) with `isGlobalEvent: true`
  - Sessions with `attendance: 'not_attended'` for the Completed tab
  - Sessions with `rsvpStatus: 'confirmed'` for the My RSVPs tab
- Add mock suggested prompts and wins data (exported as separate arrays)

---

### Session List Page

Summary: Major redesign of [SessionLog.tsx](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/features/mentor/pages/SessionLog.tsx) — add "My RSVPs" tab, remove 3 columns, update actions, add filters and color coding.

#### [MODIFY] [SessionLog.tsx](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/features/mentor/pages/SessionLog.tsx)

**Tab Changes:**
- Add `activeTab` state to support 3 tabs: `'upcoming' | 'rsvps' | 'completed'`
- **Upcoming tab**: Shows future sessions (scheduled + historical upcoming); lands here by default
- **My RSVPs tab** (new): Filters to sessions where `rsvpStatus !== null`; shows notification preferences toggle and reschedule option per session
- **Completed tab**: Shows past sessions with `attendance` status badge instead of generic "Completed"

**Column Changes (table header + `SessionRow` component):**
- **Remove** `Participants` column (th + td) entirely
- **Remove** `Duration` column — merge into `Date & Time` column as range: `"Feb 18, 2026, 3:00 PM – 5:00 PM"`
- **Remove** `Status` column on Upcoming tab
- **Repurpose** Status column on Completed tab → show `Attended` (green badge) or `Not Attended` (gray badge); make filterable

**Action Button Changes:**
- Upcoming: Change main button from `"View"` → `"Join"` with blue/green styling
- Completed: Keep `"View"` button; **hide** View for unattended private/mentor sessions (gray out row)
- Expand three-dot menu to include:
  - **Session Details** — navigates to `/sessions/:id`
  - **Reschedule** — opens a simple reschedule dialog (mock)
  - **RSVP** — shows ✓ / ? / ✗ options (Outlook-style)
  - **Notification Preferences** — toggle on/off for this session
  - Existing: Zoom Details, Watch Recording, View Transcript

**Session Type & Color Coding:**
- Add a small colored dot/badge next to session title:
  - **Blue accent** for mentor-specific sessions (`isGlobalEvent: false`)
  - **Purple accent** for PGN global events (`isGlobalEvent: true`)
- Session type shown as a subtle chip next to title (e.g., "Strategy Session", "Mastermind")

**Filter Bar Updates:**
- Replace `Status: All / Scheduled / Completed` dropdown with:
  - `Type: All / My Mentor Sessions / PGN Events` (filters on `isGlobalEvent`)
  - `Attendance: All / Attended / Not Attended` (only shown on Completed tab)
- Keep existing date filter and search

---

### Session Details Page

Summary: Enhance [SessionDetails.tsx](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/features/mentor/pages/SessionDetails.tsx) with Wins section, enhanced prompts, and overview behind menu.

#### [MODIFY] [SessionDetails.tsx](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/features/mentor/pages/SessionDetails.tsx)

**Session Overview → Behind Menu:**
- Move the "Session Overview" card to be collapsed/hidden by default
- Add a three-dot menu in the header area with "Show Session Overview" option
- When clicked, the overview section slides in or expands

**Wins Section (top of AI Summary):**
- Add a `🏆 Wins` section at the very top of the AI Summary sidebar card
- If wins exist for this session, display each win with a gold/yellow accent
- If no wins detected → **hide the entire Wins section** (don't show an empty state)

**Suggested Prompts Overhaul:**
- Split into two groups:
  1. **"Suggested Prompts for This Session"** — prompts used or relevant to the current session
  2. **"Open Prompts"** — backlog of unresolved prompts from past sessions; initially collapsed with a "View All Open Prompts" button
- Add **age/origin indicators** on each prompt (e.g., "From Jan 28 session", "Open for 3 weeks")
- Add **"Add Prompt"** button for mentors to manually type a prompt
- Add **dismiss (×)** button on each prompt to remove irrelevant ones
- **Conditional display**: Only show prompts for `category === 'strategy'` sessions; hide for `lab_workshop`

**Actual vs Scheduled Time:**
- In the overview section, show both "Scheduled: 3:00 PM – 5:00 PM" and "Actual: 2:58 PM – 5:12 PM" if `endedAt` exists

---

### Video, Recording & Zoom

#### [MODIFY] [SessionDetails.tsx](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/features/mentor/pages/SessionDetails.tsx)

- Add a mock video control bar (play/pause, forward/back, progress slider, fullscreen toggle) at the bottom of the video player area, styled to sit **within** the video frame
- Display actual session duration in the video player area (not just scheduled)
- **Video retention indicator**: Show "Recording available for X more days" countdown badge
- **Bookmark/Favorite toggle**: Star icon to mark sessions for preservation
- **Zoom details panel** (in three-dot menu or expandable section):
  - Mock waiting room status indicator
  - Meeting ID, Join URL (no password needed — streamlined access)
  - API credential reference (shown as redacted mock)

#### [NEW] [SessionWarningBanner.tsx](file:///d:/MAIN%20FOLDER/Projects/ScaleIt%202.0/prototype%20code/scaleit-260126%200601/features/mentor/components/SessionWarningBanner.tsx)

- A static mock banner component that simulates the 5-minute warning prompt
- Shows: "⏰ Session ending soon — Did we capture wins? Action items for next time?"
- Displayed inside SessionDetails for demo purposes with a dismiss button
- In production, this would be triggered by real session timer state

---

## Verification Plan

### Browser Testing

Since this is a UI prototype without automated tests, verification will be done visually using the browser tool:

1. **Navigate to `/sessions`** — Verify:
   - Three tabs visible: Upcoming, My RSVPs, Completed
   - Default landing on Upcoming tab
   - Table shows only Title, Date & Time (with range), and Actions columns
   - Date column shows format like "Feb 18, 2026, 3:00 PM – 5:00 PM"
   - No Participants, Duration, or Status columns on Upcoming
   - "Join" button (not "View") for upcoming sessions
   - Color dots differentiating mentor vs PGN events

2. **Click "My RSVPs" tab** — Verify:
   - Only RSVP'd sessions appear
   - RSVP status visible (confirmed/maybe)

3. **Click "Completed" tab** — Verify:
   - "Attended" / "Not Attended" badges shown instead of "Completed"
   - Unattended private sessions appear grayed out with no View button
   - Filters for Attended/Not Attended and Mentor/PGN events work

4. **Click three-dot menu on an upcoming session** — Verify:
   - Menu shows: Session Details, Reschedule, RSVP, Notification Preferences, Zoom Details

5. **Click into a completed session detail** — Verify:
   - Wins section appears at top of AI Summary (if wins exist)
   - Suggested Prompts split into "For This Session" and "Open Prompts"
   - Session Overview hidden behind menu
   - Video player has embedded control bar

### Manual Verification (by user)
- After implementation, the user should:
  1. Run `npm run dev` and navigate to the Sessions page
  2. Visually inspect each tab and confirm layout matches the discussion
  3. Test three-dot menu items on different session types
  4. Open a completed session detail and verify Wins + Prompts sections
