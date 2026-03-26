# edumerge HRMS Control Tower — Antigravity Build Prompt
**Version:** 1.0 | **Author:** Product — Likith V | **Date:** Mar 2026  
**Platform:** Antigravity | **Module:** HRMS — Management Dashboard  

---

## 1. PRODUCT CONTEXT (Read before building)

This is the **edumerge HRMS Control Tower** — a plug-and-play management dashboard for HR Managers, Principals/HODs, and Group Chairmen/Trustees across standalone educational institutions and Groups of Institutions (GOI) spanning K-12 schools and higher education colleges.

**Core behaviour:**
- The dashboard is **not a reports screen.** It is a real-time command centre.
- Every widget on the dashboard is **independently selectable** — the user (admin) picks which widgets to show. The system renders them dynamically.
- Data flows in from all HRMS modules: Leave, Attendance, Payroll, Onboarding, Probation, Exit, Appraisal, L&D, Talent Acquisition.
- The dashboard must support **two contexts** — `Standalone Institution` and `Group of Institutions (GOI)` — controlled by a top-level toggle.
- Every metric must be **actionable** — approve, escalate, drill down, or export from within the widget.

---

## 2. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DASHBOARD SHELL                                 │
│  ┌──────────────┐  ┌────────────────────────────────────────────┐  │
│  │   SIDEBAR    │  │              CONTENT CANVAS                │  │
│  │              │  │  ┌────────────────────────────────────┐   │  │
│  │  Navigation  │  │  │        TOPBAR (Role + Toggle)      │   │  │
│  │  Module      │  │  └────────────────────────────────────┘   │  │
│  │  Links       │  │                                            │  │
│  │              │  │  ┌────────────────────────────────────┐   │  │
│  │  User Role   │  │  │    WIDGET CANVAS (Plug & Play)     │   │  │
│  │  Context     │  │  │                                    │   │  │
│  │              │  │  │  [Widget 1]  [Widget 2]  [Widget 3]│   │  │
│  │              │  │  │  [Widget 4]  [Widget 5]  [Widget 6]│   │  │
│  └──────────────┘  │  └────────────────────────────────────┘   │  │
│                    └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. PLUG-AND-PLAY WIDGET SYSTEM — CORE REQUIREMENT

### 3A. Widget Catalogue (Complete List)

Each widget has a unique `widget_id`, a category, a default chart type, the data source module it reads from, which roles can see it, and which context it belongs to.

| # | Widget ID | Widget Name | Category | Default Chart | Source Module | Roles | Context |
|---|---|---|---|---|---|---|---|
| 1 | `WGT_HEADCOUNT` | Total Headcount | Workforce Pulse | KPI Number + sparkline | Staff Master | All | Both |
| 2 | `WGT_PRESENT_TODAY` | Present Today | Workforce Pulse | KPI Number + donut | Attendance | All | Both |
| 3 | `WGT_ABSENT_TODAY` | Absent / On Leave Today | Workforce Pulse | KPI Number + list | Attendance + Leave | All | Both |
| 4 | `WGT_LEAVE_BREAKDOWN` | Leave Type Breakdown | Workforce Pulse | Horizontal bar | Leave | HR, Admin | Both |
| 5 | `WGT_LOP_MTD` | Loss of Pay (MTD) | Workforce Pulse | KPI + trend line | Leave + Payroll | HR, Finance | Both |
| 6 | `WGT_PENDING_APPROVALS` | Pending Leave Approvals | Workforce Pulse | Action list | Leave | HR, HOD, Principal | Both |
| 7 | `WGT_ATT_TREND` | Attendance Trend (30d) | Workforce Pulse | Line chart | Attendance | HR | Both |
| 8 | `WGT_DEPT_HEATMAP` | Department Leave Heatmap | Workforce Pulse | Heatmap grid | Leave + Attendance | HR, Principal | Both |
| 9 | `WGT_PAYROLL_READINESS` | Payroll Readiness Checklist | HR Operations | Step tracker | Payroll | HR, Finance | Both |
| 10 | `WGT_PAYROLL_SUMMARY` | Payroll Summary | HR Operations | KPI cards | Payroll | Finance | Both |
| 11 | `WGT_STATUTORY_STATUS` | Statutory Compliance Status | HR Operations | Status tiles | Payroll | HR, Finance | Both |
| 12 | `WGT_ONBOARDING_PIPELINE` | Onboarding Pipeline | HR Operations | Progress bars | Onboarding | HR | Both |
| 13 | `WGT_PROBATION_EXPIRY` | Probation Expiring Soon | HR Operations | Alert list | Probation | HR | Both |
| 14 | `WGT_EXIT_PIPELINE` | Exit Pipeline | HR Operations | Funnel | Exit | HR | Both |
| 15 | `WGT_APPRAISAL_CYCLE` | Appraisal Cycle Status | Talent Intelligence | Donut + %  | Appraisal | HR, Management | Both |
| 16 | `WGT_LD_COMPLETION` | L&D Course Completion | Talent Intelligence | Stacked bar | L&D | HR | Both |
| 17 | `WGT_OPEN_POSITIONS` | Open Positions | Talent Intelligence | KPI + list | Talent Acquisition | HR | Both |
| 18 | `WGT_ATTRITION_RATE` | Attrition Rate (YTD) | Talent Intelligence | KPI + trend | Exit + Staff Master | HR, Management | Both |
| 19 | `WGT_GOI_CAMPUS_TABLE` | GOI Campus Overview Table | GOI Only | Data table | All modules | Chairman, Group HR | GOI only |
| 20 | `WGT_GOI_PAYROLL_STATUS` | GOI Payroll Status per Campus | GOI Only | Status matrix | Payroll | Chairman, Finance | GOI only |
| 21 | `WGT_ACTIVITY_FEED` | System Activity Feed | Utility | Feed list | All modules | All | Both |
| 22 | `WGT_ALERTS` | Smart Alerts & Nudges | Utility | Alert banner | All modules | All | Both |

---

### 3B. Widget Selection UI — "Add Widget" Panel

**This is the core plug-and-play mechanism.**

Build an `Add Widget` panel that opens as a right-side drawer when the user clicks `+ Add Widget` button on the dashboard toolbar.

**Panel behaviour:**

```
┌─────────────────────────────────────────────┐
│  Add Widget to Dashboard                 ✕  │
│─────────────────────────────────────────────│
│  Search widgets...    [🔍]                  │
│─────────────────────────────────────────────│
│  Filter by:                                 │
│  [All] [Workforce] [HR Ops] [Talent] [GOI]  │
│─────────────────────────────────────────────│
│  WORKFORCE PULSE                            │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ 📊 Leave         │ │ 👥 Attendance    │  │
│  │ Breakdown        │ │ Trend            │  │
│  │ Horizontal bar   │ │ Line chart       │  │
│  │ ✓ Already added  │ │ [+ Add]          │  │
│  └──────────────────┘ └──────────────────┘  │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ 🔥 Dept Heatmap  │ │ ⏳ Pending       │  │
│  │ Grid view        │ │ Approvals        │  │
│  │ [+ Add]          │ │ ✓ Already added  │  │
│  └──────────────────┘ └──────────────────┘  │
│                                             │
│  HR OPERATIONS                              │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ ✅ Payroll       │ │ 🧭 Onboarding   │  │
│  │ Readiness        │ │ Pipeline         │  │
│  │ [+ Add]          │ │ ✓ Already added  │  │
│  └──────────────────┘ └──────────────────┘  │
│─────────────────────────────────────────────│
│  [Reset to default layout]  [Done]          │
└─────────────────────────────────────────────┘
```

**Add Widget panel rules:**
- Each widget card shows: name, description (1 line), chart type icon, source module badge
- Widgets already on dashboard show `✓ Already added` state (greyed out, not re-addable)
- GOI-only widgets are hidden when user is in Standalone context
- Role-restricted widgets are hidden based on logged-in user's role
- Click `+ Add` → widget is instantly appended to the dashboard canvas in the next available grid slot
- Removed widgets return to `+ Add` state in the panel

---

### 3C. Widget Removal & Reorder

- Each widget card on the dashboard has a `⋯` (more options) menu in its top-right corner
- Menu options: `Remove widget`, `Change chart type`, `Set date range`, `Export data`
- **Change chart type** — opens a mini picker showing available chart types for that widget:
  - e.g., Leave Breakdown can switch between `Horizontal bar` / `Donut` / `Table`
  - e.g., Attendance Trend can switch between `Line chart` / `Area chart` / `Bar chart`
- **Drag to reorder** — widgets are draggable within the grid (use drag handle icon on top-left of each card)
- Dashboard layout is **persisted per user per role** in local state / API

---

## 4. ROLE-BASED VIEW SYSTEM

### Roles and their default widget sets:

**HR Manager (default layout):**
```
Row 1 KPIs:  WGT_HEADCOUNT, WGT_PRESENT_TODAY, WGT_ABSENT_TODAY, WGT_LOP_MTD, WGT_PENDING_APPROVALS
Row 2:       WGT_LEAVE_BREAKDOWN, WGT_PRESENT_TODAY (donut), WGT_PENDING_APPROVALS (list)
Row 3:       WGT_PAYROLL_READINESS, WGT_ONBOARDING_PIPELINE + WGT_PROBATION_EXPIRY
Row 4:       WGT_ATT_TREND, WGT_ACTIVITY_FEED
```

**Principal / HOD (default layout):**
```
Row 1 KPIs:  WGT_PRESENT_TODAY, WGT_ABSENT_TODAY, WGT_PENDING_APPROVALS
Row 2:       WGT_DEPT_HEATMAP, WGT_PENDING_APPROVALS (list)
Row 3:       WGT_PROBATION_EXPIRY, WGT_ACTIVITY_FEED
```

**Group Chairman / Trustee (default layout):**
```
Row 1 KPIs:  WGT_HEADCOUNT, WGT_PRESENT_TODAY, WGT_LOP_MTD, WGT_PAYROLL_SUMMARY, WGT_ATTRITION_RATE
Row 2:       WGT_GOI_CAMPUS_TABLE (full width)
Row 3:       WGT_GOI_PAYROLL_STATUS, WGT_APPRAISAL_CYCLE
Row 4:       WGT_OPEN_POSITIONS, WGT_ACTIVITY_FEED
```

**Finance Head (default layout):**
```
Row 1 KPIs:  WGT_LOP_MTD, WGT_PAYROLL_SUMMARY, WGT_STATUTORY_STATUS
Row 2:       WGT_PAYROLL_READINESS (full width)
Row 3:       WGT_GOI_PAYROLL_STATUS, WGT_ATTRITION_RATE
```

---

## 5. CONTEXT TOGGLE — STANDALONE vs GOI

**Top-level toggle in the topbar:**
```
[ Standalone ]  [ Group of Institutions ]
```

**Standalone behaviour:**
- All data is scoped to single institution
- GOI-tagged widgets (`WGT_GOI_CAMPUS_TABLE`, `WGT_GOI_PAYROLL_STATUS`) are hidden from the Add Widget panel
- Department-level drill-down available

**GOI behaviour:**
- All KPI numbers are aggregated across all institutions in the group
- Every KPI card is **clickable** → opens a breakdown by institution
- `WGT_GOI_CAMPUS_TABLE` is available and recommended as the primary cross-campus widget
- Drill-down path: Group total → Institution → Department → Individual staff

---

## 6. DETAILED WIDGET SPECIFICATIONS

### Widget Type A — KPI Card
**Used by:** WGT_HEADCOUNT, WGT_PRESENT_TODAY, WGT_LOP_MTD, etc.

```
┌────────────────────────────┐
│ ● Total Headcount          │  ← label (11px, muted, dot = accent color)
│                            │
│ 1,284                      │  ← big number (28-32px, bold, accent colored)
│                            │
│ ↑ 12 this month            │  ← delta badge + context label (11px)
│                        ⊞   │  ← bg icon (5% opacity, decorative)
│ [top accent bar: 2px]      │  ← color coded top border
└────────────────────────────┘
```

**KPI Card rules:**
- Top border accent: 2px, color-coded per category (blue=workforce, teal=payroll, amber=ops, purple=talent, red=risk)
- Delta badge: green background for positive, red for negative, amber for warning
- Background icon: module-relevant symbol at 5-6% opacity, bottom-right
- On hover: slight lift (`transform: translateY(-1px)`)
- On click: expands into full widget or navigates to module detail

---

### Widget Type B — Chart Card

**Used by:** Leave Breakdown, Attendance Trend, L&D Completion, etc.

```
┌─────────────────────────────────────────────┐
│ [icon] Widget Title              [Action ›] │  ← header: 13px, action link
│─────────────────────────────────────────────│
│                                             │
│  [CHART AREA — 160-200px height]            │
│                                             │
│─────────────────────────────────────────────│
│  Footer metadata / summary line             │  ← 11px muted text
└─────────────────────────────────────────────┘
```

**Chart card rules:**
- Header icon: 22x22px rounded square, bg = 15% opacity of category color
- Action link: right-aligned, accent colored, opens module detail
- Chart area: dynamic height based on content, never fixed
- Footer: 1-2 key takeaways from the data (e.g., "LOP up 8 days vs last month")
- `⋯` menu: top-right corner on hover
- Chart type switcher: accessible via `⋯` → `Change chart type`

---

### Widget Type C — Action List

**Used by:** WGT_PENDING_APPROVALS, WGT_PROBATION_EXPIRY, WGT_EXIT_PIPELINE

```
┌─────────────────────────────────────────────┐
│ [icon] Pending Approvals  [28]  [View all›] │
│─────────────────────────────────────────────│
│ [Avatar] Name          [Tag]  [Xd ago] [Btn]│
│ [Avatar] Name          [Tag]  [Xd ago] [Btn]│
│ [Avatar] Name          [Tag]  [Xd ago] [Btn]│
│ [Avatar] Name          [Tag]  [Xd ago] [Btn]│
│ [Avatar] Name          [Tag]  [Xd ago] [Btn]│
│─────────────────────────────────────────────│
│ 6 more pending approvals...    [View all ›] │
└─────────────────────────────────────────────┘
```

**Action list rules:**
- Show max 5 items, paginate or link to full list
- Badge count on header: red pill for urgent (>5 pending), amber for moderate
- Action buttons: `Approve` (green tint) / `Review` (neutral) / `Escalate` (amber)
- On approve: row animates out (fade + slide), count decrements
- Stale items (pending >3 days): highlighted with amber left border
- Age column: `Xd ago` format, turns red if >3 days

---

### Widget Type D — Step Tracker

**Used by:** WGT_PAYROLL_READINESS

```
┌─────────────────────────────────────────────┐
│ [icon] Payroll Readiness — Mar 2026 [Run›]  │
│─────────────────────────────────────────────│
│ ✓  Attendance locked          [Done]        │
│ ✓  Leave data synced          [Done]        │
│ ✓  LOP validated (47 days)    [Done]        │
│ ◔  Statutory computation      [In Progress] │
│ ✗  Finance approval           [Blocked]     │
│ ○  Bank disbursement          [Waiting]     │
│─────────────────────────────────────────────│
│ ⚠ Deadline: 31 Mar · 2 institutions blocked │
└─────────────────────────────────────────────┘
```

**Step tracker rules:**
- Each step has: icon state (done/in-progress/blocked/waiting), name, status pill
- Status pills: Done=green, In Progress=amber, Blocked=red, Waiting=muted
- Footer warning bar: amber background when deadline <5 days away, red when <2 days
- `Run payroll` CTA in header activates when all steps are Done

---

### Widget Type E — GOI Campus Table

**Used by:** WGT_GOI_CAMPUS_TABLE

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Institution     Type      Staff  Present  On Leave  LOP  Payroll  Health │
│──────────────────────────────────────────────────────────────────────────│
│ St. Xavier's    K-12      187    160      22        8    ✓ Ready   ████▒ │
│ Holy Cross      Higher    234    196      31        12   ✗ Blocked ████░ │
│ Delhi Public    K-12      156    140      14        4    ✓ Ready   █████ │
│ Presidency      Higher    298    244      42        14   ◔ In Prog ███░░ │
└──────────────────────────────────────────────────────────────────────────┘
```

**GOI table rules:**
- Each row = one institution
- `Type` column: K-12 / Higher Ed / Polytechnic badge
- `Payroll` column: status pill — Ready (green), Blocked (red), In Progress (amber)
- `Health` column: mini progress bar (0-100% composite score from attendance + payroll + compliance)
- Row click → expands into institution-level detail view
- Sortable by any column
- Sticky header on scroll
- Color-code rows: red-tinted bg for Blocked payroll rows as visual alert

---

### Widget Type F — Activity Feed

**Used by:** WGT_ACTIVITY_FEED

```
┌─────────────────────────────────────────────┐
│ [icon] Activity Feed               [All ›]  │
│─────────────────────────────────────────────│
│ ● Ravi Naik's leave approved by HOD   2m   │
│ ● Holy Cross payroll blocked          18m  │
│ ● Kavya Rao onboarding complete       1h   │
│ ● 9 approvals auto-escalated          2h   │
│ ● Sunita More LOP rejected            3h   │
└─────────────────────────────────────────────┘
```

**Feed rules:**
- Dot color: green=approved/success, amber=warning/pending, red=blocked/rejected, teal=completed, purple=escalation
- Relative timestamps: live-updating
- Bold name of person/institution in each entry
- Auto-refreshes every 60 seconds
- Click any item → opens relevant module screen

---

## 7. TOPBAR SPECIFICATION

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Control Tower         [Standalone | GOI]   [Period ▾]  ● Live  [+ Widget]│
│ Thu 26 Mar 2026                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Topbar elements (left to right):**
1. **Page title** — "Control Tower" (16px, 600 weight)
2. **Subtitle** — current date + fiscal year (12px, muted)
3. **Context toggle** — `[Standalone] [Group of Institutions]` segmented control
4. **Period selector** — dropdown: `Today / Month to Date / Year to Date / Custom`
5. **Live indicator** — pulsing green dot + "Live" label
6. **+ Add Widget** — primary action button, opens the Add Widget drawer

---

## 8. SIDEBAR SPECIFICATION

```
┌─────────────────────────┐
│  edumerge HRMS          │  ← wordmark
│  HRMS Control Tower     │  ← product name (10px, uppercase, muted)
│─────────────────────────│
│  [Avatar] Name          │  ← user role card
│  HR Manager · GOI View  │
│─────────────────────────│
│  OVERVIEW               │
│  ⊞ Control Tower ◄      │  ← active
│  ◈ Analytics            │
│─────────────────────────│
│  MODULES                │
│  ◷ Leave Management [14]│  ← badge = pending count
│  ☑ Attendance           │
│  ₹ Payroll          [2] │
│  ⊕ Onboarding       [7] │
│  ◎ Probation            │
│  ↗ Appraisal            │
│  ⊙ L&D                  │
│  ⊘ Exit Management      │
│  ✦ Talent Acquisition   │
│─────────────────────────│
│  SETTINGS               │
│  ◧ Configuration        │
│  ◻ Reports              │
└─────────────────────────┘
```

---

## 9. ALERT BANNER SPECIFICATION

Displayed at the top of the content area when urgent actions exist.

```
┌──────────────────────────────────────────────────────────────────────┐
│ ⚠  3 institutions have payroll deadline in 2 days —              │
│    47 staff on LOP this month not yet reconciled         [Review] [Run]│
└──────────────────────────────────────────────────────────────────────┘
```

**Alert rules:**
- Amber border + background for warnings
- Red for critical (deadline passed, data mismatch)
- Dismissable per session
- Max 2 CTAs in the banner
- Multiple alerts: show topmost priority only, `+2 more alerts` link

---

## 10. DATA LAYER CONTRACTS

### API endpoint pattern per widget:
```
GET /api/v1/dashboard/widget/{widget_id}
  ?context=goi|standalone
  &institution_id=all|{id}
  &period=today|mtd|ytd
  &role={role_slug}

Response:
{
  "widget_id": "WGT_LEAVE_BREAKDOWN",
  "title": "Leave Breakdown",
  "last_updated": "2026-03-26T10:45:00Z",
  "chart_type": "horizontal_bar",
  "data": { ... },
  "footer_meta": "Sandwich deductions today: +12 days",
  "alert": null
}
```

### Widget state model:
```
{
  "user_id": "...",
  "role": "hr_manager",
  "context": "goi",
  "dashboard_layout": [
    { "widget_id": "WGT_HEADCOUNT", "position": 0, "chart_type": "kpi_card", "col_span": 1 },
    { "widget_id": "WGT_PRESENT_TODAY", "position": 1, "chart_type": "donut", "col_span": 1 },
    { "widget_id": "WGT_LEAVE_BREAKDOWN", "position": 5, "chart_type": "horizontal_bar", "col_span": 2 }
  ],
  "period": "mtd"
}
```

---

## 11. VISUAL DESIGN SYSTEM

### Color scheme: Dark enterprise theme
```css
--bg:        #0D0F14   /* Page background */
--bg2:       #13161E   /* Card / sidebar background */
--bg3:       #1A1E2A   /* Inner surfaces */
--bg4:       #1F2433   /* Active/hover surfaces */
--border:    rgba(255,255,255,0.07)
--text:      #E8EAF0   /* Primary text */
--text2:     #8B8FA8   /* Secondary text */
--text3:     #555970   /* Muted / labels */

/* Semantic colors */
--accent:    #4F8EF7   /* Blue — workforce */
--green:     #2EC47B   /* Success / present */
--amber:     #F0A03A   /* Warning / pending */
--red:       #E85555   /* Error / LOP / blocked */
--teal:      #26C6C6   /* Payroll / ops */
--purple:    #9B6FE8   /* Talent / appraisal */
--pink:      #E86FA8   /* Exit / attrition */
```

### Typography:
- Font family: `DM Sans` (primary) + `DM Mono` (numbers/metrics)
- KPI numbers: 28-32px, weight 600, DM Mono, letter-spacing: -1px
- Card titles: 13px, weight 500
- Labels: 11px, weight 400, letter-spacing: 0.5px
- Section headers: 10px, weight 500, uppercase, letter-spacing: 0.8px

### Grid layout:
- Default grid: `repeat(auto-fill, minmax(300px, 1fr))`
- KPI row: `repeat(5, 1fr)` with 12px gap
- Full-width widgets (GOI table, trend charts): `col-span: full`
- Gap: 12-14px between widgets
- Content padding: 24px 28px

### Card anatomy:
- Background: `var(--bg2)`
- Border: `1px solid var(--border)`
- Border radius: 14px
- Top accent bar: 2px, category color
- Padding: 18px
- Header height: ~40px with consistent icon + title + action layout

---

## 12. INTERACTION PATTERNS

### Add Widget flow:
```
User clicks "+ Add Widget"
  → Drawer slides in from right (300ms ease)
  → Shows widget catalogue by category
  → User filters / searches
  → Clicks "+ Add" on a widget card
  → Drawer stays open (user may add multiple)
  → Widget appears in next available grid slot with a subtle pop-in animation
  → "Already added" state on that card in drawer
  → User clicks "Done" → drawer closes
```

### Remove Widget flow:
```
User hovers widget card
  → "⋯" icon appears top-right
  → Clicks ⋯ → context menu appears
  → Clicks "Remove widget"
  → Widget fades out + collapses (200ms)
  → Grid reflows
  → That widget returns to "+ Add" state in drawer
```

### Change Chart Type flow:
```
User clicks ⋯ on widget → "Change chart type"
  → Mini horizontal picker appears below menu:
    [Bar ●] [Donut] [Table] [Line]
  → User selects type
  → Chart morphs with 300ms transition
  → New type saved to user's layout state
```

### GOI Drill-down flow:
```
User clicks a KPI number (GOI context)
  → Drawer or modal opens
  → Shows institution-by-institution breakdown
  → Click institution row → department breakdown
  → Click department → staff list
```

### Period change flow:
```
User changes period (Today / MTD / YTD)
  → All widgets re-fetch with new period param
  → Loading shimmer appears on each card (300ms)
  → New data populates with a fade-in
```

---

## 13. SECTION LABELS (Visual separators between widget groups)

Each widget group is introduced by a section header row:

```
─── Workforce Pulse ─────────────────────────── Real-time ───
─── HR Operations ───────────────────────────── MTD ─────────
─── Talent Intelligence ─────────────────────── YTD ─────────
─── Group Campus View ───────────────────────── All Campuses ─
```

Format: 10px, uppercase, letter-spacing 0.8px, muted color — with full-width horizontal rule on both sides

---

## 14. EMPTY STATES

Each widget must handle an empty state gracefully:

```
┌─────────────────────────────────┐
│   [icon]                        │
│   No data available             │
│   Configure Leave module first  │
│   [Go to Configuration →]       │
└─────────────────────────────────┘
```

Rules:
- Show module-relevant icon
- 1-line reason why data is empty
- CTA to configure or seed data
- Never show broken charts or zero-filled axes

---

## 15. RESPONSIVE BEHAVIOUR

| Breakpoint | Behaviour |
|---|---|
| > 1280px | Full sidebar + 5-col KPI row + 3-col layout |
| 1024–1280px | Sidebar collapsed to icons + 4-col KPI row |
| 768–1024px | Sidebar hidden (hamburger) + 2-col layout |
| < 768px | Mobile: single column, KPI cards stack, charts simplify to numbers |

Mobile-specific rules:
- GOI campus table converts to accordion cards per institution
- Action lists show max 3 items with "See all" link
- Donut charts replace detailed bar charts on small screens

---

## 16. PERFORMANCE REQUIREMENTS

- **Dashboard load time:** < 2 seconds for first meaningful paint
- **Widget data refresh:** Every 5 minutes (attendance/leave), Every 15 min (payroll), Every 60 min (YTD metrics)
- **Widget independence:** Each widget loads independently — slow widgets must not block fast ones
- **Loading state:** Skeleton shimmer (not spinner) per widget while data fetches
- **Error state:** Each widget handles its own error — shows error icon + retry button, does not cascade failure to other widgets

---

## 17. ANTIGRAVITY-SPECIFIC NOTES

1. **Component:** Build as a single `ManagementDashboard` page component in Antigravity
2. **Widget registry:** Create a `WIDGET_CATALOGUE` constant/config file listing all 22 widgets with their metadata — this is the source of truth for the Add Widget panel
3. **Layout state:** Store `dashboard_layout` in Antigravity's user preferences / local state per user session
4. **Chart library:** Use Chart.js (UMD) loaded via CDN. Each widget manages its own chart instance and destroys it on removal to prevent memory leaks
5. **Drag-and-drop:** Use Antigravity's built-in drag primitives or `@dnd-kit/core` for widget reordering
6. **Role context:** Read `current_user.role` and `current_user.institution_context` from Antigravity's auth session — use these to filter the widget catalogue and enforce data scoping
7. **API calls:** Each widget calls its own `/api/v1/dashboard/widget/{widget_id}` endpoint independently. Use Antigravity's data-fetching primitives with the period and context params
8. **Theme tokens:** Use the CSS variables defined in Section 11 — register them as Antigravity theme tokens so they can be overridden per client
9. **Module navigation:** Sidebar module links should use Antigravity's router to navigate to the respective module pages
10. **Permissions:** The Add Widget panel must check `current_user.permissions` before showing role-restricted widgets

---

## 18. ACCEPTANCE CRITERIA (Definition of Done)

- [ ] Dashboard renders correctly for all 4 roles (HR Manager, Principal, Group Chairman, Finance)
- [ ] Context toggle switches between Standalone and GOI views correctly
- [ ] Add Widget drawer opens, shows correct filtered catalogue, and adds widget to canvas
- [ ] Removed widget disappears from canvas and returns to catalogue
- [ ] Chart type switcher changes chart type within the same widget card
- [ ] All 22 widgets render with mock/seed data
- [ ] GOI Campus Table shows per-institution rows with health bars and payroll status
- [ ] Pending approvals list — approve action decrements count and removes row
- [ ] Payroll Readiness shows step-by-step status with deadline warning
- [ ] Period selector (Today/MTD/YTD) updates all widget KPIs
- [ ] Alert banner appears when urgent conditions exist, dismissable per session
- [ ] Dashboard is responsive at 1280px, 1024px, 768px, and 375px
- [ ] Empty states render correctly when no data available
- [ ] Activity feed auto-refreshes every 60 seconds
- [ ] User's layout (which widgets, which chart types, widget order) is persisted across sessions

---

*End of Antigravity Build Prompt — edumerge HRMS Control Tower v1.0*
*Any scope changes require written approval from Likith V (Product)*
