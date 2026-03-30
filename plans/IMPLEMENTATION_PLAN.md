# Phased Implementation Plan — March 10 & March 17 Minutes

## Master Audit

### March 10 Items

| # | Item | Status |
|---|------|--------|
| 1 | Zoom Active Speaker API | ⏸️ Backend |
| 2 | S3 Integration | ⏸️ Future |
| 3 | Full-screen video prompt overlay | 🔧 Not done |
| 4 | Nav tabs redesign (Navy blue) | ✅ |
| 5 | Mobile tab design | ✅ |
| 6 | Login "CEO" → "CEO Member" | ✅ |
| 7 | Calendar smaller, Community Impact moved | ✅ |
| 8 | AI panel (Ideas default, positive, tone) | ✅ |
| 9 | Mentor View screens | ✅ |
| 10 | Shared member access | ✅ |
| 11 | Session note duplication to both mentors | 🔧 Not done |
| 12 | Onboarding checklist | ✅ |
| 13 | Community tab in CEO nav | ✅ |
| 14 | Connect Module (Circles) | ⏸️ Deferred (Mar 17) |
| 15 | Remove WhatsApp page | 🔧 Still exists |
| 16 | Remove Masterminds standalone nav | 🔧 Still exists |
| 17 | Member-specific file repository | 🔧 Not built |
| 18 | Score Tracker history | ✅ |
| 19 | In-session doc nav (PIP) | ✅ |
| 22 | AI doc ingestion | ✅ Closed |

### March 17 Items

| # | Item | Status |
|---|------|--------|
| 1 | Changelog document | 🔧 Being created now |
| 2 | Zoom overlay test | 🔧 Not done |
| 3 | Chat-style prompt fallback | 🔧 Not done |
| 4 | Score Tracker full history | ✅ |
| 5 | PDF download for all tools | 🔧 Not verified |
| 6 | Mentor dashboard & roster | ✅ |
| 7 | Simplified member assignment (no drag-drop) | 🔧 Not done |
| 8 | Member status fields (active/inactive, renewal, wins) | 🔧 Partial |

---

## Phase 1: Cleanup & Quick Wins ⚡ (~1 day)

#### [DELETE] `WhatsAppPage.tsx`
- Remove `features/mentor/pages/WhatsAppPage.tsx` and its route in `App.tsx`
- **Decision**: Mar 10 #4 — WhatsApp removed from scope

#### [DELETE] `MastermindsPage.tsx`
- Remove standalone Masterminds page and its route
- **Decision**: Mar 10 #5 — handled by Connect module (deferred)

#### [MODIFY] `App.tsx`
- Remove routes for deleted pages

#### [VERIFY] PDF Download
- Audit SCALEit tools for working PDF download buttons
- Mar 17: only Score Tracker needs in-app history; all others rely on PDF

---

## Phase 2: Mentor View Enhancements 👥 (~2–3 days)

#### [MODIFY] `MemberStatusPage.tsx`
- Add **active/inactive** status indicator
- Add **continuation/renewal date** field
- Add **wins** section
- Remove drag-and-drop → simple "Admin assigns → member appears"
- Add **mastermind group tagging** from roster

#### [NEW] `MemberFileRepository.tsx`
- Under Resource Library, per-member file section
- Only visible to member + assigned mentor
- System-tagged date/time, sorted newest first
- Supported: Word, Excel, PDF, PowerPoint
- No session-linking (deprioritized)

#### [MODIFY] `MentorDashboard.tsx`
- Session note duplication placeholder for shared sessions

---

## Phase 3: Session & Video 🎥 (~2 days)

#### [MODIFY] `VideoCommandCenter.tsx`
- Add **prompt overlay / chat panel** alongside full-screen video
- AI nudges, objectives, info displayed in chat-style panel
- Confirmed acceptable fallback (Mar 17)

#### [MODIFY] Session Workspace
- Placeholder for talk-time metric per session
- Reference Jamie's actual onboarding scripts when provided

#### [VERIFY] Role-Gating
- Members cannot see each other's longevity/join dates/renewal
- Mentor-view only data

---

## Phase 4: Deferred ⏸️ (No work now)

| Item | Blocker |
|------|---------|
| Connect Module (Circles) | Tim: deferred to post-prototype |
| Zoom Active Speaker API | Backend |
| S3 recording pipeline | Backend |
| Engagement tracking metric | Awaiting Pinnacle definition |
| Virtual Alison / native assessment | Awaiting roadmap |
| Mentor matching (AI) | Awaiting Jamie's requirements |
| Pulse Point / Sentiment | Blocked on funding |
| Sales demo accounts | Joon to provide scenarios |
| Scale It Live AI assessment | Separate deliverable |

---

## Verification Plan

**Phase 1**: `tsc --noEmit` passes, deleted pages return 404, PDF download works on 2–3 tools.
**Phase 2**: Mentor view shows active/inactive, renewal, wins. File repo appears with mock data.
**Phase 3**: Prompt panel appears alongside video. Role-gating confirmed for member data.
