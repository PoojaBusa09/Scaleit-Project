# Scale It 2.0 — Prototype Changelog
### Pinnacle Global Network Platform Development
**Prepared for**: Patrick Nunally, Joon S. Han, Tim Diemont
**Prepared by**: Raviteja Dalli, Development Team (Kaminos)
**Date**: March 20, 2026
**Covers**: Changes from March 10 & March 17 weekly syncs

---

## Executive Summary

This update addresses **22 action items** and **8 key decisions** discussed across the last two weekly syncs. The prototype now includes an enhanced CEO dashboard, a supportive AI assistant, a fully functional mentor view with member status tracking, onboarding session tools, historical score tracking, and in-session video features including an AI prompt panel and document browsing.

---

## What's New

### 🎯 CEO Dashboard Improvements

| Change | Details | Discussion Reference |
|--------|---------|---------------------|
| Calendar compacted | "Your Week Ahead" section is now more compact without losing visual clarity | Mar 10, Item #7 |
| Community Impact repositioned | Removed from the prominent 2nd position — individual members don't find aggregate metrics personally relevant | Mar 10, Item #7 — Patrick: *"Half the screen is a great big number that doesn't apply to me"* |
| Shortcuts/Pins retained | Grid layout supports up to 8 pinned SCALEIT methods | Mar 10, Item #7 |

### 🤖 Pinnacle AI Assistant (Right Panel)

| Change | Details | Discussion Reference |
|--------|---------|---------------------|
| Default tab → Ideas | The assistant now opens to "Ideas" (Suggestions) instead of Actions | Mar 10, Item #8 |
| Positive highlights | Celebrates wins and milestones — *"You and Patrick had a great conversation last week"* | Mar 10, Item #8 — Joon: *"It needs to feel like a proactive business assistant"* |
| Supportive language | "Prioritized Actions" → "Upcoming Focus Areas"; "Keep the Momentum" framing for follow-ups | Mar 10, Item #8 — Patrick: *"People get annoyed if there's always a big list"* |

### 👥 Mentor View — Complete Build

| Feature | Status | Details |
|---------|--------|---------|
| Navigation structure | ✅ Complete | CEO Member items → Demarcation Line → Mentor Dashboard, Member Status, Mentor's Corner |
| Week at a Glance | ✅ Complete | Same calendar component as CEO dashboard |
| Member Status page | ✅ **NEW** | Active/inactive indicators, renewal dates, wins, progress tracking |
| Primary vs. Shared roster | ✅ Complete | Portfolio clearly separates primary members from shared/secondary access |
| Mastermind group tagging | ✅ **NEW** | Members can be tagged into mastermind groups; filter by group |
| Mentor's Corner | ✅ Complete | External link — Jamie manages content |
| Standard member routes | ✅ Complete | Mentors now have access to Sessions, Growth Progress, SCALEIT Method, Score Tracker, Resources, Community |

### 📂 Member File Repository — NEW

| Feature | Details |
|---------|---------|
| Per-member files | Documents only visible to the member and their assigned mentor |
| System timestamps | Files auto-tagged with upload date/time (not user-editable) |
| Supported formats | Word, Excel, PDF, PowerPoint |
| Sort & filter | Newest first; filter by member or file type |
| Upload button | Mentor can upload files directly from the page |

> *Decision: No session-linking for files (deprioritized per March 10 call). Simple date-based sorting is sufficient.*

### 📋 Onboarding Sessions

| Feature | Details |
|---------|---------|
| New session type | `onboarding` — triggers dedicated tab in Session Workspace |
| AI checklist | 5-topic checklist with AI detection badges showing completion |
| Follow-up scheduling | "Schedule Follow-Up Session" button appears for missed items |

> *Referenced: Mar 10, Item #12 — structured checklist for new member first 3 sessions with AI-tracked completion.*

### 📊 Score Tracker — Historical Versioning

| Feature | Details |
|---------|---------|
| Version history toggle | Each phase card has "View Score History" showing past statuses |
| Timeline view | Colored dots with dates and notes for each historical score |
| Full lifecycle tracking | All history preserved through member engagement |

> *Decision: Only the Score Tracker requires in-app historical versioning. All other tools use PDF downloads.* (Mar 17, Decision #2)

### 🎥 In-Session Video Features

| Feature | Details |
|---------|---------|
| AI Prompt Panel | Chat-style sidebar alongside full-screen video with session objectives, AI suggestions, talking points checklist, and positive notes |
| Browse Resources (PIP) | Video shrinks to floating picture-in-picture window while full Resource Library opens |
| Toggle modes | Seamlessly switch between full-screen, PIP, and resource browsing |

> *Approach: Chat-style prompt delivery confirmed as acceptable fallback to direct video overlay* (Mar 17, Item #2–3)

### 🧹 Codebase Cleanup

| Change | Rationale |
|--------|-----------|
| WhatsApp page removed | Mar 10, Decision #4 — all messaging via Connect module |
| Masterminds standalone page removed | Mar 10, Decision #5 — group management handled by Connect module |
| Routes cleaned up | Dead routes removed; mentor routes now include all standard member routes |

### 🏷️ Branding & Nomenclature

| Change | Status |
|--------|--------|
| Login: "CEO" → "CEO Member" | ✅ Complete |
| All "Scale It" / "PGN" → "Pinnacle Global Network" | ✅ Complete |
| Resource Library tabs restyled | ✅ Navy blue with visible outlines |

---

## Deferred Items (Confirmed Out of Scope)

These items are **intentionally not included** per client decisions documented in the March 17 call:

| Item | Decision | Reference |
|------|----------|-----------|
| Connect Module (Circles replacement) | Tim: deferred to post-prototype phase | Mar 17, Decision #1 |
| Attention AI features | Too robust to replicate; runs in parallel via Zoom | Mar 17, Decision #5 |
| Animated virtual avatar | Not feasible for April 23 event; exploring alternatives | Mar 17, Decision #8 |
| AI document ingestion | Decided against — if relevant, discussed in session; ASR captures it | Mar 10, Decision #6 |
| Sales demo accounts | Joon to provide 5 scenarios; standalone function | Mar 17, Parking Lot #6 |

## Awaiting Client Input

| Item | Needed From | Status |
|------|-------------|--------|
| Engagement tracking metric definition | Pinnacle internal (Friday meeting) | Pending |
| Member journey roadmap | Patrick (draft) → Friday review | Pending |
| Onboarding session checklists | Jamie's scripts via Joon | Pending |
| Mentor permissions documentation | Tim | Pending |
| 5–6 tools requiring updates | Patrick & Joon to identify | Pending |
| Mentor matching requirements | Joon → Jamie | Pending |

---

## Next Steps

1. **Receive Pinnacle inputs** listed above to unblock remaining mentor view features
2. **Continue mentor-to-member grid** enhancements (flagged as hardest remaining piece)
3. **PDF download audit** across all SCALEIT tools
4. **Target**: End of April prototype completion
