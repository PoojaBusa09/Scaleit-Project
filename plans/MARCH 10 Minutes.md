**Meeting Minutes**

**Pinnacle Global Network - Scale It Platform Development**

**Date:** March 10, 2026, 2:11 PM  
**Transcription Started by:** Raviteja Dalli  
**Transcription Stopped by:** Praneeth Bolla

**Attendees**

| **Name**        | **Role/Affiliation**                         |
| --------------- | -------------------------------------------- |
| Patrick Nunally | Pinnacle Global Network (Client/Stakeholder) |
| Joon S. Han     | Pinnacle Global Network (Client/Stakeholder) |
| Raviteja Dalli  | Development Team (Kaminos)                   |
| Sreenadh Kondru | Development Team (Kaminos)                   |
| Vijay Sabbineni | Development Team (Kaminos)                   |
| Praneeth Bolla  | Development Team (Kaminos)                   |

**1\. ZOOM INTEGRATION & PLATFORM CONTROLS**

**Discussion**

- **Sreenadh** clarified that while the Zoom meeting controls don't necessarily need to be replicated on the Scale It platform, the platform must have the ability to **disable certain features** such as:
  - AI Companion (remove/disable)
  - "Open in Zoom" button (remove/disable)
  - Zoom workplace branding (replace with Pinnacle branding)
- **Patrick** raised the issue of **full-screen video expansion**. When the video feed is expanded to full screen, the platform must still preserve space for prompt overlays (objectives, information, commanding elements). Two approaches were suggested:
  - Preserve a dedicated space alongside the expanded video
  - Use an overlay mechanism on top of the full-screen video
  - Whichever approach is technically easier is acceptable.
- **Raviteja** provided a status update on the Zoom API work based on code shared (Pinpoint code):
  - The **"Create Meeting"** function was not provided in the shared code; only **"List All Recordings"** and **"Trigger Zoom"** APIs were available.
  - The team has only completed work on **Zoom authentication**; they have **not yet touched the S3 integration** (which transfers recordings from Zoom to the Pinnacle S3 bucket).
  - **Zoom API for Active Speaker** tracking is the first priority action item.
  - S3 axis/integration is a future priority.

**2\. UI/UX UPDATES - COMPLETED CHANGES**

**Discussion**

Raviteja demonstrated several UI changes implemented since the last call:

**a) Resource Library - Share Button Removed**

- The **Share button** has been removed from the Resource Library.
- Replaced with a **"Favorite Resource"** function.
- Navigation tab design has been updated.

**b) Navigation Tab Visibility Issue (Scale It Filter Tabs)**

- **Patrick** noted that the filter/navigation tabs at the top of the Resource Library looked like **labels rather than interactive navigation elements**. He initially confused "Scale It" as a label rather than a clickable filter.
- **Joon** agreed the tabs need to be **more visually obvious** as navigation elements:
  - Should use the **Navy blue** from the Pinnacle branding guide (not black).
  - Should have visible **outlines, shadows, or button-like styling**.
  - Should visually **match the tab styling** already used at the top of the Resource Library section.
  - Consider a **file folder index** visual metaphor - the selected tab shares the same background as the content panel below it.
- **Raviteja** noted a concern about **mobile responsiveness** - repeating the same tab design on mobile could look repetitive. The team should be mindful of this.

**c) Branding Updates**

- All references to **"Scale It"** or **"PGN"** have been replaced with **"Pinnacle Global Network"** throughout the platform.
- Joon: _"That'll keep us from getting fired."_

**d) Pin to Dashboard**

- The **"Pin to Dashboard"** feature has been implemented for the CEO view.
- CEOs can pin multiple Scale It methods to the dashboard; shortcuts appear on the main dashboard.
- Dashboard supports a **grid layout of 4 items per row**, allowing for 2 rows (8 shortcuts).

**e) Login Screen Nomenclature**

- **Joon** requested that the login screen label be changed from **"CEO"** to **"CEO Member"** for proper nomenclature.

**3\. DASHBOARD LAYOUT - COMMUNITY IMPACT SECTION**

**Discussion**

- **Joon** reported that there is an ongoing **internal debate** at Pinnacle about what should occupy the second position on the CEO dashboard (currently showing "Community Impact").
- **Jamie Oyaro** (Head of Mentor Department) provided feedback that the **typical Pinnacle member doesn't care about the Community Impact metrics** - it's useful for the company but not for individual members.
- **Patrick** reinforced this: _"Every time I come in there, half the screen is a great big number that doesn't apply to me... \$850 million - I didn't get it."_

**Decisions:**

- **Community Impact** should be **moved down** - possibly underneath the AI section (where it originally was), or made more compact.
- The **second position** on the dashboard should likely be a **Growth Progress Report** or the **Shortcuts/Pins** section - but this is still under internal discussion.
- The **calendar/week-at-a-glance** section remains the **top position** but should be made **slightly smaller** without losing visual clarity.
- The left and right sections of the dashboard are **frozen/fixed**; only the **middle section scrolls dynamically**.

**4\. PINNACLE AI ASSISTANT (RIGHT-HAND PANEL)**

**Discussion**

- **Patrick** confirmed the right-hand AI panel is for **reporting, suggestions, summaries, and extracted action items** - functioning as a personal assistant.
- **Raviteja** explained it **collates action items from all sessions and calls** into one centralized view, solving the problem of fragmented/decentralized task tracking.

**Concerns Raised:**

- **Joon** expressed concern that if the AI panel is just a **nagging to-do list**, users will find it annoying and try to turn it off.
- The panel needs to feel like a **proactive business assistant**, not just a task tracker.
- **Patrick** noted: _"People get annoyed if there's always a big list of things to do and you can't get them done. After a while, you stop looking at it."_

**Suggestions for Improvement:**

- **"Ideas"** tab should potentially be the **default view** (instead of "Actions").
- Include **positive highlights**: e.g., _"You and Patrick had a great conversation last week - here's a highlight..."_
- Take a more **holistic assistant approach** - massaging the ego of the CEO, celebrating wins, not just reminding of tasks.
- The **phrasing of follow-ups** needs to be carefully crafted (e.g., instead of "Stay on track," use more supportive/encouraging language).
- **Pinnacle team** (Patrick, Joon, Tim) will workshop the right-hand panel content/tone - this is **not a development team responsibility**.

**5\. MENTOR VIEW - NEXT DEVELOPMENT PHASE**

**Discussion**

- The team agreed that the **Mentor view** should be the **next role to build out**, followed by Super Admin.
- **Patrick's reasoning**: The mentor view builds on the CEO view, and the Super Admin builds on top of the mentor view. So the logical progression is CEO → Mentor → Super Admin.

**Mentor Dashboard Design:**

- The **same "Week at a Glance" calendar** from the CEO dashboard should be replicated for mentors.
- The **same left-hand navigation** structure applies, but with **additional mentor-specific items** added below a **visual demarcation line**:
  - **Dashboard** (same as CEO)
  - **Sessions** (same label, but displays mentor-relevant content - one-on-ones, masterminds, huddles, onboarding sessions)
  - _(Standard CEO navigation items)_
  - **\--- Demarcation Line ---**
  - **Member Status** (mentor's assigned roster with continuation status)
  - **Mentor's Corner** (mentor-specific resources/tools)

**Session Types Under Mentor View:**

- **One-on-ones**
- **Masterminds** (group sessions - may be managed via Connect module groups)
- **Huddles**
- **Events** (e.g., Alison's large-format sessions)
- **Onboarding Sessions** (special session type with 5 specific AI-tracked checkpoints)

**Member Assignment & Shared Access:**

- Members are **assigned to a primary mentor** (by Super Admin).
- **Problem identified**: Currently, a member can only be assigned to **one mentor**, which is problematic when multiple mentors collaborate (e.g., Patrick and Joon working with the same member's partners).
- **Solution**: Member Status should show:
  - **Primary roster** (members officially assigned)
  - **Shared/secondary access** (members accessible for collaboration, with visual demarcation)
- When two mentors share a session with a member, the **AI summaries and notes must be duplicated to both mentor accounts**.

**Onboarding Session Requirements:**

- New member onboarding has a **structured checklist**:
  - **First intro call**: 5 specific topics to cover
  - **First 3 sessions**: Structured checklist of required discussion items
- The AI should **detect completion** of these checklist items during sessions.
- If items are missed, mentors should be able to **open a secondary/follow-up session** to complete them, with the date updated accordingly.
- This helps ensure **mentors are doing their job properly** with new members.

**6\. CONNECT MODULE (Circles App Replacement)**

**Discussion**

- The development team's internal name for their community/messaging module is the **"Connect Module"** (no client-specific deployment yet).

**Key Decision: Replace Circles App**

- **Jamie Oyaro's position**: By the time the platform launches (end of 2026/early 2027), membership will have grown ~20-30%, creating appetite to **consolidate into one mobile app** (Scale It) and **retire the Circles app**.
- **Joon**: _"We made such a hullabaloo to get people to download the Circle app... but a year from now, it'd be OK to say 'thanks for doing that, we're not going to have you download 2 apps.'"_
- **Critical requirement**: The Connect module must **look and function exactly like Circles** to avoid retraining users.
- **Tim Diemont** needs to make the final call on this decision (his pay grade).

**Connect Module Functionality Requirements:**

| **Feature**                    | **Status/Notes**                                        |
| ------------------------------ | ------------------------------------------------------- |
| Group creation (mentors only)  | Needed - CEO members cannot create groups               |
| Private channels               | Available in Connect module                             |
| Event-based auto-groups        | Exists - group auto-created when event is created       |
| Role-based permissions         | Supported - different views for CEO members vs. mentors |
| Direct messaging               | Needed                                                  |
| File attachments in messages   | Currently supported                                     |
| Add/remove members from groups | Needed (without restarting the group)                   |

**WhatsApp Replacement:**

- **Current usage**: WhatsApp is used solely because the original group text couldn't handle 10+ people. Two threads exist:
  - **Event coordination thread** (Alison → all mentors)
  - **Mentor-only private thread** (excludes Alison for sensitive operational discussions)
- **Decision**: Remove the WhatsApp integration placeholder. All messaging will happen through the **Connect module**.
- **Joon**: _"If mentors are using the app and it's got communication built in, I think we're fine."_

**Navigation Update:**

- **"Masterminds"** will be **removed from the left-hand index** - group creation for masterminds will be handled within the Connect module.
- **"Community"** tab will be added to the left-hand navigation for CEO members, linking to the Connect module.
- Connect module sub-sections: **Messages, Groups, \[other services\]**

**7\. FILE SHARING & DOCUMENT MANAGEMENT**

**Discussion**

- **Question raised**: Should file sharing happen within the app or via email?
- **Patrick's position**: Files must be stored **in the app/server**, not on individual computers. Files need to be preservable and accessible.

**Agreed Approach:**

- Create a **member-specific file repository** under the **Resource Library**.
- Files are **per-member** (only visible to the member and their assigned mentor).
- Files should be **system-tagged with date/time** (not user-editable) for sorting purposes.
- Supported file types: **Word, Excel, PDF, PowerPoint** (and Google equivalents) - nothing exotic.
- **Session attachment** was initially proposed but then **retracted** by Patrick - files rarely arrive during sessions; they're usually follow-ups. Simple date-based sorting is sufficient.

**AI Ingestion of Documents - DECIDED AGAINST:**

- **Patrick initially proposed** having the AI ingest uploaded documents (text only) for reference.
- **After discussion, decided against it**:
  - If a document is relevant, it will be discussed in session and captured by ASR.
  - If it's not discussed, it's not relevant.
  - Risk of AI being overwhelmed by irrelevant bulk uploads (e.g., _"Stephanie likes to send me 14,000 pages of fluff"_).

**8\. HISTORICAL DATA / VERSION TRACKING**

**Discussion**

- **Joon** identified a gap: In the current software's **Score Tracker**, when data is updated, there is **no way to view historical values**.
- **Requirement**: Some mechanism to track changes over time:
  - A **redline/version comparison** view
  - Ability to **scroll back** and see what a score was in a prior session
  - Essential for **growth tracking** purposes
- No specific UI solution was determined - this needs further design exploration.

**9\. IN-SESSION DOCUMENT NAVIGATION**

**Discussion**

- **Patrick** raised a critical UX need: During a live video session, a mentor must be able to **navigate to a member's uploaded document** without leaving the session entirely.
- Requirements:
  - Ability to **exit full-screen video** (reduce to smaller frame)
  - Navigate to the **Resource Library/file repository**
  - **Open a PDF or document** alongside the video
  - Alternatively: **share screen** of the document within the video session
- **Sreenadh** requested **mock screens** to visualize this workflow.

**10\. PROJECT TIMELINE & RE-BASELINING**

**Discussion**

- **Sreenadh** proposed that in the **next meeting**, the team should **re-baseline the project plan** against the Statement of Work:
  - **Original timeline**: Prototyping started December 1st week, targeted completion by end of March.
  - Need to assess: progress made, scope changes, realistic remaining timelines.
- **Patrick** expressed optimism: Once the mentor view and Super Admin are complete, the team will be _"coasting home."_ The hardest part was getting started.
- **Sreenadh** agreed: _"We attacked the important ones. It'll be a good point in time to introspect and see where we are."_

**ACTION ITEMS**

| **#** | **Action Item**                                                                                                                                                                    | **Owner**                | **Priority**    | **Due Date**                 |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------------- | ---------------------------- |
| 1     | **Zoom API - Active Speaker tracking**: Complete implementation of active speaker detection via Zoom API                                                                           | Ravi / Dev Team          | High            | Next sprint                  |
| 2     | **S3 Integration**: Build the recording transfer pipeline from Zoom to Pinnacle S3 bucket                                                                                          | Dev Team                 | Future Priority | TBD                          |
| 3     | **Full-screen video overlay**: Design and implement prompt overlay mechanism for expanded/full-screen video sessions                                                               | Dev Team                 | High            | Next review                  |
| 4     | **Navigation tabs redesign**: Make Scale It filter tabs visually obvious as navigation (Navy blue, shadows/outlines, match Resource Library tab styling)                           | Ravi / UI Team           | Medium          | Next week                    |
| 5     | **Mobile tab design**: Address potential repetitive tab design on mobile view                                                                                                      | Ravi / UI Team           | Medium          | Next week                    |
| 6     | **Login label change**: Update "CEO" to "CEO Member" on login screen                                                                                                               | Ravi                     | Low             | Next week                    |
| 7     | **Dashboard restructure**: Reduce calendar section size; relocate Community Impact to lower/compact position; determine proper 2nd-position content (Growth Progress or Shortcuts) | Pinnacle Team + Dev Team | High            | Ongoing                      |
| 8     | **AI Assistant panel**: Workshop the right-hand AI panel content/tone to be more holistic and less nagging; consider "Ideas" as default view; add positive highlights              | Patrick, Joon, Tim       | Medium          | Internal discussion          |
| 9     | **Build Mentor View screens**: Create all mentor-specific screens including dashboard, sessions (mentor context), member status, and Mentor's Corner with demarcation              | Ravi                     | High            | Next week's call             |
| 10    | **Member assignment - shared access**: Implement ability for members to have a primary mentor AND secondary/shared mentor access with visual demarcation                           | Dev Team                 | High            | Mentor view build            |
| 11    | **Session note duplication**: When two mentors share a session, AI summaries/notes must be copied to both mentor accounts                                                          | Dev Team                 | High            | Mentor view build            |
| 12    | **Onboarding session type**: Create special session type with 5-point AI-tracked checklist for new member onboarding; include ability to open follow-up sessions for missed items  | Dev Team                 | Medium          | TBD                          |
| 13    | **Connect Module placeholder**: Add "Community" tab to CEO left-hand navigation; build placeholder screens for Connect module (Messages, Groups)                                   | Ravi                     | Medium          | Next week                    |
| 14    | **Connect Module - match Circles UI**: When building Connect module, replicate the Circles app interface exactly                                                                   | Dev Team                 | Future          | TBD (pending Tim's decision) |
| 15    | **Remove WhatsApp placeholder**: Remove WhatsApp integration from plans; all messaging via Connect module                                                                          | Ravi                     | Low             | Next week                    |
| 16    | **Remove Masterminds from index**: Remove standalone Masterminds nav item; group management moves to Connect module                                                                | Ravi                     | Low             | Next week                    |
| 17    | **File repository**: Design and mock up a member-specific file repository under Resource Library (per-member, date-sorted, system-timestamped, mentor + member visible)            | Ravi / Dev Team          | Medium          | Next week (mockup)           |
| 18    | **Score Tracker history**: Design mechanism for historical version tracking in Score Tracker (redline/scroll-back functionality)                                                   | Dev Team                 | Medium          | TBD                          |
| 19    | **In-session document navigation**: Create mock screens for navigating to documents during a live video session (reduced video + document viewer)                                  | Ravi / Dev Team          | Medium          | Next week (mockup)           |
| 20    | **Re-baseline project plan**: Ravi and Sreenadh to prepare progress assessment vs. SOW timeline; identify scope changes and realistic remaining timeline                           | Ravi, Sreenadh           | High            | Next week's call             |
| 21    | **Tim decision - Connect Module**: Escalate to Tim Diemont: final decision on replacing Circles app with Connect module at launch                                                  | Joon, Patrick            | High            | Before next call             |
| 22    | **Tim decision - AI document ingestion**: Deprioritized/closed - decided documents don't need AI ingestion; session ASR captures relevant content                                  | N/A                      | Closed          | N/A                          |

**DECISIONS MADE**

| **#** | **Decision**                                                          | **Rationale**                                                                                              |
| ----- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1     | **Remove Share button** from Resource Library; replace with Favorites | Per previous call agreement                                                                                |
| 2     | **Community Impact** should not occupy 2nd position on dashboard      | Members don't find aggregate metrics personally relevant                                                   |
| 3     | **Mentor view** is the next development priority (before Super Admin) | Mentor builds on CEO; Super Admin builds on Mentor                                                         |
| 4     | **WhatsApp integration removed** from scope                           | Connect module will handle all messaging needs                                                             |
| 5     | **Masterminds removed** as standalone nav item                        | Group management handled through Connect module                                                            |
| 6     | **AI should NOT ingest uploaded documents**                           | If docs are relevant, they'll be discussed in session and captured by ASR; bulk uploads would overwhelm AI |
| 7     | **File session-linking deprioritized**                                | Files rarely arrive during sessions; date-based sorting is sufficient                                      |
| 8     | **Connect module** to be built to look like Circles app               | Avoid retraining users; pending Tim's final approval                                                       |

**PARKING LOT (Items Requiring Further Discussion)**

| **#** | **Item**                                                                                        | **Owner**                                |
| ----- | ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 1     | What should occupy the 2nd dashboard position (Growth Progress Report vs. Shortcuts vs. other)? | Pinnacle internal (Joon, Patrick, Jamie) |
| 2     | Right-hand AI panel - detailed content strategy and tone of voice                               | Patrick, Joon, Tim                       |
| 3     | Tim's approval on Connect module replacing Circles app                                          | Joon → Tim                               |
| 4     | Score Tracker historical view - specific UI/UX approach                                         | Design team                              |
| 5     | Circle app data migration strategy (import basic data, not all historical)                      | TBD after Tim's decision                 |

**NEXT MEETING AGENDA (Proposed)**

- Review Mentor View screen mockups (Ravi)
- Review file repository mockup under Resource Library (Ravi)
- Review in-session document navigation mockup (Ravi)
- Project re-baselining presentation (Ravi & Sreenadh)
- Update on Tim's decision re: Connect module / Circles replacement
- Dashboard 2nd position content decision update

_Meeting adjourned. Next call scheduled for the following week._