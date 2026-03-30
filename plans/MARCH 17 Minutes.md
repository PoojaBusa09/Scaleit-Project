Meeting Minutes
Pinnacle Global Network – Scale It 2.0 Weekly Sync
Date: March 17, 2026, 2:06 PM
Transcription Started by: Praneeth Bolla
Transcription Stopped by: Praneeth Bolla
________________________________________
Attendees
Name	Role/Affiliation
Patrick Nunally	Pinnacle Global Network (Client/Stakeholder)
Joon S. Han	Pinnacle Global Network (Client/Stakeholder)
Tim (Diemont)	Pinnacle Global Network (Client/Stakeholder)
Raviteja Dalli	Development Team (Kaminos/Pigeon)
Sreenadh Kondru	Development Team (Kaminos/Pigeon)
Vijay Sabbineni	Development Team (Kaminos/Pigeon)
Praneeth Bolla	Development Team (Kaminos/Pigeon)
________________________________________
PART 1: JOINT SESSION (All Attendees)
________________________________________
1. ZOOM SESSION CONTROLS & VIDEO OVERLAY
Discussion:
•	Patrick confirmed that the session controls don't need to be fancy — basic functional controls are sufficient.
•	Sreenadh agreed that controls can keep evolving based on feedback; the key is proving the capability exists.
Full-Screen Video Overlay Question:
•	Patrick asked whether a pop-up overlay (e.g., AI-triggered message in the lower-right corner) can appear on top of a full-screen video to prompt the mentor during a session.
•	Sreenadh was unsure — flagged it as something that needs testing. Noted that YouTube historically blocked overlays to protect ad revenue, but Zoom should be different.
•	Patrick recalled there may have been a historical problem with overlays on Zoom but couldn't confirm.
Raviteja's Solution Proposal:
•	Ravi pointed to YouTube Live's chat overlay model — during a live portrait-format stream, the chat window overlays directly on the video. A similar approach could work for session prompts and static data.
•	Currently the prototype supports picture-in-picture (video overlay on content). Patrick's request is the inverse — text/prompts overlaid on a full-screen video.
•	Patrick agreed that even routing the AI prompt messages into a chat-style window alongside the video would achieve the goal without disrupting the video feed.
Decision: Team will test overlay feasibility on Zoom's embedded video. Chat-style prompt delivery is an acceptable fallback.
________________________________________
2. PROTOTYPE PROGRESS & LAST WEEK'S ACTION ITEMS
Discussion:
•	Raviteja confirmed all changes discussed in the previous meeting have been applied to the prototype.
•	Changes will be pushed to the shared URL by tomorrow (March 18) along with a change log document detailing updates per screen.
Pinnacle team acknowledged.
________________________________________
3. PROJECT TIMELINE & STATUS
Discussion:
•	Raviteja presented the timeline: SOW defines an 18-week prototype phase. Originally assumed to start December 1, but formal weekly kickoff was January 20, 2026, extending the runway through May 2026.
•	Current structural completion estimated at ~75% of complex items.
Vijay's Correction:
•	Vijay pointed out that the team actually worked 2–3 weeks in December before the formal kickoff — they built initial pages and the first version during that period. The January kickoff was when requirements refinement began.
•	Vijay recommended targeting end of April completion rather than May, accounting for the December work period.
Sreenadh reframed the discussion: regardless of when the start date was, the important question is — based on current progress, what should the team's target completion date be?
Tim's Assessment:
•	Agreed the project is roughly ~70% complete, possibly slightly more.
•	The heavy lifting (initial UI build) was done in December/January.
•	The most difficult remaining items are:
•	Mentor-to-member grid (assignment, status, onboarding, tracking) — flagged as the hardest remaining piece
•	In-session document navigation — potentially difficult
•	Everything else is manageable and not overly time-consuming.
Sreenadh raised the "last 10% takes 90% of the time" concern and asked if there are any red flags or missed items.
Patrick and Tim: No missed items identified.
Joon: Confirmed heavy lifting is done. Remaining mentor view work is largely about providing access to already-built components and defining role-based logic.
Decision: Target end of April for prototype completion. No red flags identified.
________________________________________
4. WHAT'S AHEAD — REMAINING SCOPE ITEMS
Discussion:
Patrick reviewed the "What's Ahead" list:
Item	Status/Decision
Connect Module build	Blocked / Deferred — Tim confirmed this is pushed to the next phase. Team wants to do it but not in this prototype build.
Super Admin view	After Mentor view is locked.
Score Tracker history	Blocked on Pinnacle design direction.
Mentor dashboard & roster views	In progress — described as "pretty simplistic."
Mentor-to-member grid (assignment, status, onboarding, tracking)	In progress — flagged as the most difficult remaining work.
In-session document navigation	In progress — may be less complex than feared (see below).
In-Session Document Navigation — Simplified:
•	Raviteja demonstrated that the existing resizable/draggable video window already supports this use case: minimize the video, navigate to the resource/document, and view both simultaneously.
•	The video window stays persistently on top when minimized.
•	Patrick: "Maybe that's not a big deal then." — Concern largely resolved.
________________________________________
5. SCALE IT TOOLS — VERSION HISTORY & MIGRATION
Discussion:
•	Sreenadh noted the team hasn't reviewed all Scale It tools yet and asked about the migration approach.
•	Patrick confirmed the default is to replicate existing tools as-is, with 5–6 identified for updates (including Score Tracker, quarterly reporting). He could not recall the full list.
•	Joon clarified: even updated tools should use the old version as placeholder — don't stop progress to wait for redesigns. "99.9% of it, we're just transferring them over as is."
Raviteja showed that the methodology has been transferred with UI enhancements: card-style layouts, swipable interactions, progress tracking via form filling (replacing static text blocks).
Version History Discussion:
•	Vijay raised the question: how many historical versions of tool entries should be preserved?
Tool Type	Decision
Score Tracker	Keep all history through the life of engagement — needed for growth tracking. Back-end data must be preserved even if front-end display is limited. (Tim, Patrick agreed)
Strategic Plan / Action Items	Keep only last 2–3 versions — once tasks are completed, historical versions aren't useful past a couple quarters. (Tim)
Gap Analysis	Probably year-to-year retention — keep 2–3 versions. (Tim)
15 Scalable Models	Not a real tool — just a PDF reference. No versioning needed. (Tim)
All other tools	Since they can be downloaded as PDFs by the user, only the Score Tracker needs scrollable in-app history. (Joon's conclusion)
Decision: Only the Score Tracker requires full in-app historical versioning. All other tools: users can download PDFs for their records.
________________________________________
6. ZOOM RECORDING STORAGE & DELETION
Discussion:
•	Joon raised a concern from Jamie Oyaro: when they used Update AI, it would auto-delete the Zoom recording immediately after transcription.
•	Tim clarified how Zoom storage works:
•	Zoom has a finite storage limit per account (even at enterprise level).
•	When the limit is hit, Zoom stops storing new recordings (doesn't auto-delete old ones) and sends repeated warnings.
•	The Pinnacle team manually deletes unneeded videos roughly once per quarter when they hit the limit.
•	Sreenadh confirmed via Update AI documentation that the auto-delete is a configurable setting — it was simply turned on in their configuration.
•	Since Pinnacle is no longer using Update AI, this is informational only.
•	Sreenadh: Zoom provides API flexibility up to its storage limit. The team controls whether recordings are deleted or preserved.
Decision: No action needed — the new platform will manage recording retention via Zoom APIs within the account's storage limits.
________________________________________
7. ATTENTION AI DISCUSSION
Discussion:
•	Joon mentioned that Jamie likes features in Attention AI (a separate AI meeting tool) and wants to show Joon what he likes about it.
•	Tim cautioned that Attention AI is a very robust, complex platform (health support cards, conversation-based insights, etc.) — replicating its functionality would be a massive build and is out of scope.
•	Tim clarified: Attention AI likely just uses its bot/agent to join Zoom meetings via the master Zoom account. If the Scale It platform also uses the same master Zoom account, Attention AI should continue working independently.
•	Tim's position: There will be some feature crossover between Scale It and Attention AI, which is expected. No additional builds for Attention AI features in this phase. Eventually they'd want to move away from it, but not now.
Patrick noted that Attention AI has a well-developed API — if any must-have features are identified, integration via API is an option rather than rebuilding.
Decision:
•	No Attention AI features will be built into Scale It in this phase.
•	Attention AI will continue to run in parallel via the master Zoom account.
•	Joon will meet with Jamie to identify what specific features he values; only need-to-have items (not nice-to-have) would be considered for future API integration.
________________________________________
8. MENTOR DASHBOARD & PERMISSIONS
Discussion:
•	Tim offered to send the team mentor permissions documentation (what mentors can and can't do/see).
•	Sreenadh and Raviteja confirmed this would be very helpful.
•	Vijay offered to spend additional time with Ravi on the mentor functionality, as they had done an initial walkthrough previously (admin backend, member-to-mentor assignment, etc.).
Member Assignment — Simplified:
•	Patrick asked about the current assignment workflow where members land in a repository and mentors drag them into their roster.
•	Tim confirmed this is an overbuild that nobody uses and should be simplified: Admin assigns → member appears directly on mentor's roster. No drag-and-drop step needed.
•	The only remaining need for grouping is mastermind assignment — mentors should be able to tag members into mastermind groups from their roster.
•	Joon confirmed this drag-and-drop functionality currently exists in Circles and is "so dumb."
Member Status — What Mentors See:
•	Patrick asked what status information mentors need to see about their assigned members.
•	Tim: Members should NOT see each other's longevity, join dates, or similar data. That's tracked in CRMs, not needed in the app.
•	For mentor view only, the essential status fields are:
•	Active/inactive status
•	Continuation/renewal date
•	Wins (but these may already exist elsewhere)
Engagement Tracking Discussion:
•	Tim suggested using talk time / active speech time from transcription data as a per-session or aggregate metric — helps mentors know if they're talking too much or not enough.
•	Joon raised a broader concern: the current engagement percentage only tracks individual session attendance, which doesn't reflect true engagement. Real engagement should factor in retreats, workshops, labs, think tanks, and other touchpoints.
•	Example: "Patrick attended every one-on-one but has only taken advantage of 12% of what his engagement could have been."
•	Pinnacle markets four legs of the experience, but currently only tracks one.
•	Tim agreed in principle but cautioned: "If we can't track it well, there's no sense in tracking it."
•	Tim asked Joon to put this on their Friday internal agenda so they can define the engagement metric and provide clear requirements to the dev team.
Decision: Engagement tracking definition is a Pinnacle internal discussion item for Friday. Dev team should not build anything until requirements are provided.
________________________________________
9. ONBOARDING — CLARIFICATION OF TERMS
Discussion:
A significant clarification emerged around the term "onboarding" — the team had been using it to mean two different things:
Term	Meaning	Owner
Member Onboarding (Platform)	New member enters the system — assessment, account setup, virtual Alison, data gathering, assignment to mentor	Super Admin / System
Mentor Onboarding (Relational)	Mentor's first 3 structured sessions with a new member — specific checklists, AI-tracked completion	Mentor
•	Patrick was referring to the full member onboarding pipeline (virtual Alison, assessment data collection, account provisioning).
•	Tim initially interpreted "onboarding" in the tracker as the same thing and flagged it as the hardest remaining piece.
•	Once clarified, the mentor-to-member onboarding (3 structured sessions with checklists) was confirmed as the item in the tracker, which is a narrower scope.
•	Joon confirmed the onboarding session scripts/checklists already exist — Jamie has them. The team just needs to be pointed to the documentation.
Tim's Request — Member Journey Roadmap:
•	Tim asked Patrick to create a roadmap of the full member journey from signing through the mentor onboarding process, so the dev team has a clear reference.
•	Patrick committed to drafting a version and reviewing it internally on Friday, with the goal of delivering it to the dev team by next week's call.
________________________________________
10. DEMO PLANNING — PINNACLE STAKEHOLDER REVIEW
Discussion:
•	Sreenadh asked about plans for demoing the prototype to the broader Pinnacle team — who, when, and how much iteration time to factor in.
•	Tim identified two groups that need to see the demo:
1.	Internal operations/mentor department
2.	Alison (founder/CEO)
•	Tim's assessment of Alison's likely reaction:
•	She's a visual person — if it looks right and works, she's happy.
•	She's already signed off on all branding.
•	Tim can pre-empt most visual change requests by explaining design rationale.
•	He does not anticipate significant changes from the demo.
Decision: Demo timing not yet set. Sreenadh flagged the need to schedule it and account for potential feedback iterations in the timeline.
________________________________________
11. SCHEDULING — VIJAY'S ABSENCE
•	Vijay's son's wedding is May 8th.
•	No meeting on May 5th (confirmed by all).
•	Vijay unavailable for 4 weeks: April 21, April 28, May 5, and May 12.
•	Team acknowledged and will plan accordingly.
________________________________________
PART 2: INTERNAL DISCUSSION (Patrick & Joon Only — After Dev Team Left)
Note: The following discussion occurred after the Kaminos/Pigeon team departed the call. Captured for completeness and internal action tracking.
________________________________________
12. SALES DEMO ACCOUNTS
Discussion:
•	Pinnacle sales team needs access to demo the platform to prospects.
•	Joon: Sales will provide 5 scenarios. The dev team will set up 5 dummy accounts that:
•	Are fully functional for demo purposes
•	Don't affect real data anywhere
•	Auto-reset after use
•	Sales personnel will have a mini-admin view — they can only access these 5 dummy accounts, not any real member data.
•	This is a standalone function, separate from the onboarding flow.
________________________________________
13. VIRTUAL ALISON / ASSESSMENT ONBOARDING
Discussion:
•	Joon flagged this as a critical Friday discussion item.
•	Patrick's assessment of the current virtual Alison (built on Delphi.ai):
•	It is mistrained and will hallucinate until the training approach is corrected.
•	Patrick believes the team could fix it by advising on training mechanics (without directly accessing Delphi).
•	However, he strongly prefers not using Delphi at all.
•	Joon confirmed: Alison is not attached to the Delphi software — she doesn't care what platform powers it. During the investor call, there was no indication of loyalty to Delphi.
•	Both agreed the Scale It platform should have its own native onboarding assessment rather than depending on Delphi.
Assessment Flow:
•	Series of questions asked to the new member.
•	Responses populate the member's profile/page.
•	Account setup: password, profile picture, basic info.
•	Dynamic/configurable fields — Super Admin should be able to add additional data fields to the onboarding form (e.g., for future integrations like QuickBooks, Zoho links). This must be designed upfront to avoid reopening the architecture later.
•	QuickBooks/Zoho integrations themselves are handled by Morale & Crowd (separate team), not the Kaminos team.
Post-Assessment Flow:
•	Super Admin assigns member to a mentor.
•	Member appears on mentor's roster (no drag-and-drop).
•	Mentor receives a notification about the new member.
•	Mentor sees 3 required onboarding sessions (not the standard one-on-one strategy sessions) with specific checklists.
•	AI tracks checklist completion during these sessions.
________________________________________
14. MENTOR MATCHING (AI-ASSISTED)
Discussion:
•	Alison has repeatedly expressed interest in AI-powered mentor matching. Both Joon and Patrick have heard this from her multiple times.
•	Tim doesn't consider it a priority, but Alison does — Joon emphasized this needs to be treated as a win point for her.
•	Alison appears to conflate two types of matching:
1.	Pin-to-Mentor matching (new member → assigned mentor)
2.	Pin-to-Pin matching (member → member networking/pairing)
•	She may believe the same system handles both.
Patrick's Proposed Approach:
•	New member's assessment data is ingested by the AI.
•	Mentors provide narrative bios, expertise, and specializations during their own onboarding.
•	AI probabilistically indexes the new member against available mentors and generates an explainable recommendation (why this mentor is the best fit).
•	Critical constraint: The system must support business-rule biasing:
•	Some mentors have too many members; others have too few — distribution must be balanced.
•	The mentor department (Jamie) needs the ability to throttle specific mentors up or down (for reasons that may not be public — e.g., performance issues, personal dynamics).
•	Proposed workflow: Super Admin provides 2–3 preferred mentor options → AI selects the best fit among them and articulates the rationale.
•	This prevents the AI from assigning everyone to the most popular mentor.
Decision: Joon will get specific requirements from Jamie on how matching should work. Patrick will draft the sequence logic. Both items feed into the Friday internal discussion.
________________________________________
15. PULSE POINT / SENTIMENT ANALYSIS
Discussion:
•	Patrick wants to integrate Pulse Point's sentiment analysis to assess whether a member is having a positive or negative experience, based on conversation analysis.
•	This would feed session transcripts into Pulse Point and return sentiment indicators (e.g., happy about X, frustrated about Y, disengaged from events).
•	Use case for Super Admin/Jamie: Flip through members and identify the 15 who are having a rough time — proactive intervention before a mentor flags it or the member churns.
•	Concern: Alison may become reactive to negative sentiment data (e.g., members saying events feel like "Amway"). Patrick noted this can be filtered/managed.
Dependency: Pulse Point kickoff requires funding.
•	Joon received a text from Tim during the meeting:
•	Pinnacle is experiencing cash flow issues due to a dip caused by an "Alison mishap" and marketing rework for Scale It Live.
•	Pinnacle payment expected to hit Friday morning.
•	Mark's payment was supposed to execute March 16 (yesterday) — typically takes 2 days to clear.
•	Joon: "None of this means anything until I see it."
Patrick's Position:
•	If Mark's money arrives and they can kick off Amber Flux on Pulse Point — great.
•	If funding is delayed another 1–2 months, Patrick wants to discuss having Vijay's team build a version (heavier lift but avoids waiting).
•	Patrick specifically wants sentiment analysis as a "wow factor" differentiator — he wants to "spike the ball" after the virtual Alison misstep and Pinpoint's lack of distribution.
________________________________________
16. SCALE IT LIVE EVENT — AI ASSESSMENT TOOL
Discussion:
•	Joon is scheduled to present the AI section at Scale It Live (last week of April, ~April 23).
•	He wants an AI Readiness Assessment tool available via QR code at the event — attendees scan, interact with an AI, and get assessed.
•	This is also planned for the Intellisys website long-term.
Feasibility Discussion:
Option	Feasibility	Timeline
Animated virtual avatar (video)	Not feasible in 5 weeks — requires animation rendering, server-side video processing, bandwidth management, contrast/background challenges. ~30 days minimum + testing time.	Too tight
Audio-only AI conversation	Feasible — no animation needed, devices just need audio capability	Possible
Interactive responsive form (not a basic Google Form)	Most feasible — lively, engaging UI with AI-driven question flow	Recommended
Patrick's Concerns:
•	The animated avatar approach has known issues (e.g., low contrast with plain backgrounds, bandwidth for real-time video rendering in browser without a local client).
•	Virtual Alison via Delphi already stumbled — they can't afford another public AI failure.
•	He needs to see it working weeks in advance, not the night before.
•	He's too old for all-nighters: "That's going to make my heart give out."
Decision:
•	Not pursuing animated avatar for Scale It Live (timeline too tight).
•	Will explore an elevated interactive form or audio-based AI assessment as the deliverable.
•	Patrick will think through options and share ideas.
•	The full animated version remains a goal for the Intellisys website (longer timeline).
________________________________________
17. MENTOR'S CORNER
•	Patrick asked if Mentor's Corner will be replicated in the new platform.
•	Joon: Just have a link in the mentor view index. Jamie can update the content himself. No need to rebuild it — it just lives as a navigation item.
________________________________________
ACTION ITEMS
Development Team (Kaminos/Pigeon)
#	Action Item	Owner	Due
1	Push all prototype changes to shared URL and provide change log document per screen	Ravi	March 18
2	Test Zoom video overlay feasibility — can text/prompt overlays appear on full-screen embedded Zoom video? Document findings.	Ravi / Dev Team	Next call
3	Implement chat-style prompt delivery as fallback if direct video overlay isn't feasible	Dev Team	TBD
4	Score Tracker historical versioning — build scrollable version history (all versions preserved through member engagement lifecycle)	Dev Team	Pending design specs
5	All other tools — no in-app version history needed; ensure PDF download works for all tool outputs	Dev Team	Ongoing
6	Mentor dashboard & roster build — continue current sprint; incorporate permissions doc once received from Pinnacle	Ravi	Ongoing
7	Simplify member assignment — Admin assigns → member appears directly on mentor roster (no drag-and-drop). Add mastermind group tagging ability.	Dev Team	Mentor view sprint
8	Member status fields for mentor view — active/inactive, renewal date, wins	Dev Team	Mentor view sprint
Pinnacle Team
#	Action Item	Owner	Due
9	Send mentor permissions documentation (what mentors can/can't do and see) to dev team	Tim	This week
10	Draft full member journey roadmap — from signing through platform onboarding through mentor onboarding; share with dev team	Patrick (draft) → Tim & Joon (review Friday)	Next week's call
11	Define engagement tracking metric — what constitutes true engagement beyond session attendance; provide requirements to dev team	Joon & Tim	Friday internal meeting, then deliver to dev team
12	Provide onboarding session checklists — Jamie's scripts for intro call (5 points) and first 3 structured sessions	Joon → Jamie	TBD
13	Identify Scale It tools requiring updates — compile the list of 5–6 tools that need changes (Score Tracker, quarterly reporting, others)	Patrick & Joon	TBD
14	Meet with Jamie re: Attention AI — identify specific must-have features; determine if any require API integration	Joon	This week / next week
15	Clarify mentor matching requirements with Jamie — how should AI matching work, what biasing/throttling controls are needed	Joon	Before Friday
16	Draft onboarding sequence logic — member journey from assessment through mentor assignment	Patrick	Today (rough draft) → Friday refinement
17	Friday internal meeting agenda — engagement metric, onboarding roadmap, virtual Alison decision, mentor matching, Scale It Live assessment tool	Tim, Patrick, Joon	Friday
18	Scale It Live AI assessment — determine feasible format (interactive form vs. audio AI); begin development if timeline permits	Patrick (options)	This week
19	Vijay walkthrough with Ravi — spend time reviewing mentor functionality in existing system backend	Vijay & Ravi	This week
Scheduling
#	Item	Detail
20	No meeting May 5	Vijay's son's wedding May 8
21	Vijay unavailable 4 weeks	April 21, April 28, May 5, May 12
22	Target prototype completion	End of April 2026
________________________________________
DECISIONS MADE
#	Decision	Rationale
1	Connect Module deferred to next phase	Tim confirmed — not in prototype scope. Will be built post-launch.
2	Only Score Tracker needs in-app version history	All other tools can be downloaded as PDFs; historical data isn't needed in-app for them.
3	Member assignment simplified — no drag-and-drop	Nobody uses the current workflow. Admin assigns → member appears on roster directly.
4	Members should NOT see each other's longevity/join dates	Tracked in CRM, not needed in the platform. Mentor view only.
5	Attention AI — no features replicated in this build	Too robust to replicate. Will run in parallel via master Zoom account. API integration considered only for must-haves in future.
6	Update AI auto-delete was a configuration setting — informational only	New platform will manage recording retention via Zoom APIs independently.
7	Target end of April for prototype completion	Accounts for December pre-work not originally factored into timeline.
8	Animated avatar NOT feasible for Scale It Live (April 23)	Timeline too tight (~5 weeks); will explore interactive form or audio-based alternative.
9	Virtual Alison (Delphi.ai) — strong preference to replace with native assessment	Delphi is mistrained, hallucinating; Alison not attached to the platform.
10	Onboarding form fields must be dynamic/configurable from Super Admin	Avoids reopening architecture later when adding integrations (QuickBooks, Zoho, etc.).
________________________________________
PARKING LOT / OPEN ITEMS
#	Item	Owner	Notes
1	Engagement tracking metric definition	Pinnacle (Friday)	Must go beyond session attendance; factor in retreats, labs, workshops, think tanks
2	Talk time / active speech time per session	Pinnacle (Friday)	Tim's suggestion for mentor self-awareness metric
3	Mentor matching — AI logic, biasing rules, Jamie's input	Joon → Jamie	Alison considers this a key win; Tim doesn't prioritize it — needs alignment
4	Virtual Alison / onboarding assessment — build vs. Delphi	Patrick & Joon (Friday)	Strong lean toward native build; need Tim's final sign-off
5	Pulse Point funding status	Joon	Dependent on Pinnacle and Mark payments clearing; determines whether Amber Flux or Vijay's team handles sentiment analysis
6	Sales demo — 5 dummy accounts with auto-reset	Joon to provide scenarios	Standalone function, not part of onboarding flow
7	Scale It Live AI assessment format	Patrick	Exploring interactive form or audio-based AI; needs decision this week
8	Alison's two demo priorities	Joon / Tim to manage	Virtual Alison quality + mentor matching are her key interests
9	Mentor's Corner — link only in mentor nav	Dev Team	Simple implementation; Jamie manages content
10	Pin-to-Pin matching (member networking)	TBD	Alison may believe same system as mentor matching; needs clarification
________________________________________
FRIDAY INTERNAL MEETING AGENDA (Patrick, Tim, Joon)
1.	Review Patrick's draft member journey roadmap / onboarding sequence
2.	Define engagement tracking metric (beyond session attendance)
3.	Virtual Alison — confirm decision to build native vs. Delphi
4.	Mentor matching — requirements, biasing rules, Jamie's input
5.	Scale It Live AI assessment — feasible format and timeline
6.	Attention AI — Jamie's specific must-have features (if any)
7.	Pulse Point / funding status and next steps
________________________________________
NEXT WEEK'S CALL AGENDA (Proposed)
1.	Review prototype updates via shared URL + change log
2.	Zoom overlay test results
3.	Receive member journey roadmap and mentor permissions from Pinnacle
4.	Mentor view sprint progress review
5.	Engagement metric requirements (from Friday discussion)
6.	Confirm end-of-April completion plan and remaining sprint allocation
________________________________________
Meeting adjourned. Next call scheduled for the following week.
Vijay unavailable starting April 21 through May 12.

