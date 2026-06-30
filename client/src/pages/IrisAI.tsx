// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

/* ==========================================================================
   STYLE TOKENS & SCALAR VALUES (Scoped to .iris-container)
   ========================================================================== */

/* ==========================================================================
   INTERACTIVE DATA & CONVERSATION MATRIX
   ========================================================================== */
/* ============================================================
   edumerge · Iris — Phase-1 Q&A
   Landing: six categories — Fee collection, Admissions,
   Student strength, Staff strength, Student attendance,
   Staff attendance. Fees & Admissions drill into the CFO
   multi-branch finance answers. Figures are illustrative
   (January 2025). Six branches.
   ============================================================ */

  // Branches (user-supplied names)
  // HSR · Banashankari · Arkavathi · Hennur · Nagarbavi · Hyderabad

  // Landing categories — "Ask me about"
  const CAPABILITIES = [
    { intent: "feeStatus",  icon: "wallet",    color: "green", project: "fees",
      title: "Fee collection",     desc: "Collected, pending & overdue across branches" },
    { intent: "admissions", icon: "grad",      color: "purple", project: "adm",
      title: "Admissions",         desc: "New admissions, applications & seats" },
    { intent: "students",   icon: "users",     color: "blue",
      title: "Student strength",   desc: "Total students by class & gender" },
    { intent: "staff",      icon: "briefcase", color: "teal",
      title: "Staff strength",     desc: "Teaching & non-teaching headcount" },
    { intent: "studentAtt", icon: "calendar",  color: "orange", project: "att",
      title: "Student attendance", desc: "Today's present, absent & on leave" },
    { intent: "staffAtt",   icon: "clock",     color: "amber", project: "att",
      title: "Staff attendance",   desc: "Today's staff present & on leave" },
  ];

  const WELCOME_SUGGEST = [
    { label: "Fee collection", intent: "feeStatus" },
    { label: "Admissions", intent: "admissions" },
    { label: "Move a candidate's stage", intent: "admMoveStage" },
    { label: "Send a broadcast + reminder", intent: "commBroadcast" },
    { label: "Approve a leave request", intent: "leaveApprove" },
  ];

  const RESPONSES = {
    /* ═══ FEE COLLECTION — multi-branch ═══ */
    feeStatus: {
      messages: [
        { role: "bot", kind: "text", text: "<strong>Fee collection — January 2025 · all 6 branches</strong>" },
        { role: "bot", kind: "cards", cards: [
          { c: "stat", color: "green", icon: "wallet", kicker: "Total collected · Jan 2025",
            num: "₹45.67L", delta: { text: "83.6% rate · +2.3% vs Dec", dir: "up" },
            metrics: [
              { k: "Collected", v: "₹45.67L" },
              { k: "Pending", v: "₹8.92L" },
              { k: "Overdue", v: "₹2.34L" },
              { k: "Collection rate", v: "83.6%" },
            ] },
          { c: "list", color: "blue", icon: "layers", kicker: "Branch breakdown", title: "Collected by branch",
            rows: [
              { ava: "H", avaColor: "blue", name: "HSR", sub: "86.2% collection", val: "₹18.50L", valColor: "ink" },
              { ava: "B", avaColor: "teal", name: "Banashankari", sub: "85.5% collection", val: "₹14.77L", valColor: "ink" },
              { ava: "A", avaColor: "purple", name: "Arkavathi", sub: "80.1% collection", val: "₹12.40L", valColor: "ink" },
              { ava: "He", avaColor: "amber", name: "Hennur", sub: "81.4% collection", val: "₹9.10L", valColor: "ink" },
              { ava: "Hy", avaColor: "green", name: "Hyderabad", sub: "79.8% collection", val: "₹8.95L", valColor: "ink" },
              { ava: "N", avaColor: "orange", name: "Nagarbavi", sub: "78.2% collection", val: "₹8.90L", valColor: "amber" },
            ] },
          { c: "kv", color: "green", icon: "doc", kicker: "Status summary", title: "Where the money sits",
            rows: [
              { k: "Collected", v: "₹45.67L", dot: "green" },
              { k: "Pending (not due)", v: "₹5.10L", dot: "blue" },
              { k: "Due (1–30 days)", v: "₹2.58L", dot: "amber" },
              { k: "Overdue (30+ days)", v: "₹2.34L", dot: "red" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Branch performance", intent: "branchRank" },
        { label: "Apply a sibling discount", intent: "feeDiscount" },
        { label: "Admissions", intent: "admissions" },
      ],
    },

    branchRank: {
      messages: [
        { role: "bot", kind: "text", text: "<strong>Branch performance — fee collection, January 2025</strong>" },
        { role: "bot", kind: "cards", cards: [
          { c: "list", color: "blue", icon: "layers", kicker: "Ranking · collection rate", title: "All 6 branches",
            rows: [
              { ava: "1", avaColor: "green", name: "HSR", sub: "Top performer", val: "86.2%", valColor: "green" },
              { ava: "2", avaColor: "green", name: "Banashankari", sub: "Top performer", val: "85.5%", valColor: "green" },
              { ava: "3", avaColor: "blue", name: "Hennur", sub: "On track", val: "81.4%", valColor: "ink" },
              { ava: "4", avaColor: "blue", name: "Arkavathi", sub: "On track", val: "80.1%", valColor: "ink" },
              { ava: "5", avaColor: "blue", name: "Hyderabad", sub: "On track", val: "79.8%", valColor: "ink" },
              { ava: "6", avaColor: "orange", name: "Nagarbavi", sub: "Red zone · needs attention", val: "78.2%", valColor: "amber" },
            ] },
          { c: "kv", color: "orange", icon: "alert", kicker: "Nagarbavi · quick facts", title: "Why it's lagging",
            rows: [
              { k: "Overdue (30+ days)", v: "₹65,000", dot: "red" },
              { k: "Collections team", v: "2 members" },
              { k: "Jan 2024 rate", v: "82.0%" },
              { k: "Main reason", v: "Holiday delays + new admits" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Collection summary", intent: "feeStatus" },
        { label: "Year-over-year", intent: "feeYoY" },
      ],
    },

    feeYoY: {
      messages: [
        { role: "bot", kind: "text", text: "<strong>Year-over-year — January 2024 vs January 2025</strong>" },
        { role: "bot", kind: "cards", cards: [
          { c: "compare", color: "teal", icon: "trendUp", kicker: "Collection performance",
            left: { label: "Jan 2024", value: "₹42.10L", sub: "81.3% rate" },
            right: { label: "Jan 2025", value: "₹45.67L", sub: "83.6% rate" },
            growth: { text: "+₹3.57L  ·  +8.5%", dir: "up" } },
          { c: "kv", color: "green", icon: "layers", kicker: "Growth by category", title: "Where it came from",
            rows: [
              { k: "New admissions revenue", v: "+₹1.85L  (+25.2%)", dot: "green" },
              { k: "Continuing students", v: "+₹1.72L  (+5.1%)", dot: "green" },
            ] },
          { c: "compare", color: "blue", icon: "wallet", kicker: "Pending comparison",
            left: { label: "Jan 2024", value: "₹10.15L", sub: "pending" },
            right: { label: "Jan 2025", value: "₹8.92L", sub: "pending" },
            growth: { text: "Better by ₹1.23L", dir: "up" } },
        ]},
      ],
      suggestions: [
        { label: "Collection summary", intent: "feeStatus" },
        { label: "Branch performance", intent: "branchRank" },
        { label: "Admission revenue YoY", intent: "admRevYoY" },
      ],
    },

    /* ═══ ADMISSIONS — overview ═══ */
    admissions: {
      messages: [
        { role: "bot", kind: "cards", cards: [
          { c: "stat", color: "purple", icon: "grad", kicker: "Admissions · 2025–26",
            num: "284", delta: { text: "+12% vs last year", dir: "up" },
            metrics: [
              { k: "Applications", v: "412" },
              { k: "Confirmed", v: "284" },
              { k: "Seats left", v: "66" },
              { k: "Conversion", v: "69%" },
            ] },
          { c: "list", color: "purple", icon: "grad", kicker: "New admissions", title: "By class",
            rows: [
              { ava: "11", avaColor: "teal", name: "Class 11", sub: "Science · Commerce · Arts", val: "78", valColor: "ink" },
              { ava: "1", avaColor: "orange", name: "Class 1", sub: "Primary intake", val: "64", valColor: "ink" },
              { ava: "9", avaColor: "purple", name: "Class 9", sub: "Secondary", val: "41", valColor: "ink" },
              { ava: "6", avaColor: "blue", name: "Class 6", sub: "Middle", val: "33", valColor: "ink" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Move a candidate's stage", intent: "admMoveStage" },
        { label: "Revenue from new admissions", intent: "admRevShare" },
        { label: "Student strength", intent: "students" },
      ],
    },

    admRevShare: {
      messages: [
        { role: "bot", kind: "text", text: "<strong>Admission revenue analysis — January 2025</strong>" },
        { role: "bot", kind: "cards", cards: [
          { c: "split", color: "purple", icon: "grad", kicker: "Revenue breakdown · total ₹45.45L",
            parts: [
              { label: "New admissions", value: "₹18.50L", pct: 38, color: "purple" },
              { label: "Continuing students", value: "₹26.95L", pct: 62, color: "blue" },
            ] },
          { c: "kv", color: "teal", icon: "trendUp", kicker: "New-admission share · last 3 months", title: "Rising trend",
            rows: [
              { k: "November 2024", v: "32%" },
              { k: "December 2024", v: "35%" },
              { k: "January 2025", v: "38%", dot: "green" },
            ] },
          { c: "kv", color: "blue", icon: "users", kicker: "Average fee per student", title: "New vs continuing",
            rows: [
              { k: "New admission avg", v: "₹41,111" },
              { k: "Continuing avg", v: "₹45,892" },
              { k: "Difference", v: "−₹4,781  (10.4%)", dot: "amber" },
            ] },
          { c: "kv", color: "green", icon: "wallet", kicker: "Full-year projection · 2025", title: "Expected revenue",
            rows: [
              { k: "Total expected", v: "₹1.87 Cr", dot: "green" },
              { k: "Growth vs 2024", v: "+₹22L  (+13.3%)", dot: "green" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Admission revenue YoY", intent: "admRevYoY" },
        { label: "New vs continuing", intent: "newVsCont" },
        { label: "Fee collection", intent: "feeStatus" },
      ],
    },

    admRevYoY: {
      messages: [
        { role: "bot", kind: "text", text: "<strong>Admission revenue — Jan 2024 vs Jan 2025 (new students)</strong>" },
        { role: "bot", kind: "cards", cards: [
          { c: "compare", color: "amber", icon: "wallet", kicker: "Admission revenue · new students",
            left: { label: "Jan 2024", value: "₹15.20L", sub: "38 students" },
            right: { label: "Jan 2025", value: "₹18.50L", sub: "45 students" },
            growth: { text: "+₹3.30L  ·  +21.7%", dir: "up" } },
          { c: "table", color: "purple", icon: "grad", kicker: "Class-wise admission revenue", title: "2024 → 2025",
            cols: ["Class", "2024", "2025", "Growth"],
            align: ["left", "right", "right", "right"],
            rows: [
              ["LKG", "₹6.00L", "₹7.20L", "+20.0%"],
              ["Class 1", "₹5.60L", "₹6.40L", "+14.3%"],
              ["Class 2", "₹2.40L", "₹2.80L", "+16.7%"],
              ["Class 3", "₹1.20L", "₹1.60L", "+33.3%"],
            ],
            foot: ["Total", "₹15.20L", "₹18.50L", "+21.7%"] },
          { c: "kv", color: "teal", icon: "trendUp", kicker: "Full-year projection", title: "Admission revenue",
            rows: [
              { k: "2024 (full year)", v: "₹1.82 Cr" },
              { k: "2025 (projected)", v: "₹2.15 Cr", dot: "green" },
              { k: "Expected growth", v: "+₹33L  (+18.1%)", dot: "green" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Revenue from new admissions", intent: "admRevShare" },
        { label: "New vs continuing", intent: "newVsCont" },
        { label: "Year-over-year collection", intent: "feeYoY" },
      ],
    },

    newVsCont: {
      messages: [
        { role: "bot", kind: "text", text: "<strong>Payment behaviour — new vs continuing students, Jan 2025</strong>" },
        { role: "bot", kind: "cards", cards: [
          { c: "split", color: "orange", icon: "users", kicker: "Revenue · total ₹45.45L",
            parts: [
              { label: "New admissions", value: "₹18.50L", pct: 38, color: "orange" },
              { label: "Continuing students", value: "₹26.95L", pct: 62, color: "blue" },
            ] },
          { c: "kv", color: "green", icon: "doc", kicker: "Collection rate", title: "How well each pays",
            rows: [
              { k: "New admissions", v: "84.4%  (45 / 52)", dot: "green" },
              { k: "Continuing", v: "83.8%  (1,500 / 1,790)", dot: "green" },
            ] },
          { c: "kv", color: "blue", icon: "wallet", kicker: "Overdue & average fee", title: "30+ days and per-student",
            rows: [
              { k: "New admissions overdue", v: "0 students  (0%)", dot: "green" },
              { k: "Continuing overdue", v: "42 students  ·  ₹1.58L", dot: "red" },
              { k: "New admission avg fee", v: "₹41,111" },
              { k: "Continuing avg fee", v: "₹45,892" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Revenue from new admissions", intent: "admRevShare" },
        { label: "Admission revenue YoY", intent: "admRevYoY" },
        { label: "Fee collection", intent: "feeStatus" },
      ],
    },

    /* ═══ STUDENT STRENGTH ═══ */
    students: {
      messages: [
        { role: "bot", kind: "cards", cards: [
          { c: "stat", color: "blue", icon: "users", kicker: "Student strength · all branches",
            num: "1,278", delta: { text: "+5.6% YoY", dir: "up" },
            metrics: [
              { k: "Boys", v: "668" },
              { k: "Girls", v: "610" },
              { k: "Classes", v: "12" },
              { k: "Sections", v: "34" },
            ] },
          { c: "list", color: "blue", icon: "users", kicker: "Strength", title: "By class",
            rows: [
              { ava: "9", avaColor: "blue", name: "Class 9", sub: "4 sections", val: "148", valColor: "ink" },
              { ava: "10", avaColor: "orange", name: "Class 10", sub: "4 sections", val: "142", valColor: "ink" },
              { ava: "8", avaColor: "teal", name: "Class 8", sub: "3 sections", val: "131", valColor: "ink" },
              { ava: "11", avaColor: "purple", name: "Class 11", sub: "3 streams", val: "124", valColor: "ink" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Student information & seats", intent: "studentInfo" },
        { label: "Student attendance", intent: "studentAtt" },
        { label: "Staff strength", intent: "staff" },
      ],
    },

    /* ═══ STAFF STRENGTH ═══ */
    staff: {
      messages: [
        { role: "bot", kind: "cards", cards: [
          { c: "stat", color: "teal", icon: "briefcase", kicker: "Staff strength · all branches",
            num: "96", delta: { text: "+7 this year", dir: "up" },
            metrics: [
              { k: "Teaching", v: "72" },
              { k: "Non-teaching", v: "24" },
              { k: "Student : teacher", v: "18 : 1" },
              { k: "Departments", v: "9" },
            ] },
        ]},
        { role: "bot", kind: "text", text: "Student–teacher ratio is <strong>18:1</strong>, within the recommended range. Want today's staff attendance?" },
      ],
      suggestions: [
        { label: "Staff information & joiners", intent: "staffInfo" },
        { label: "Staff attendance", intent: "staffAtt" },
        { label: "Student strength", intent: "students" },
      ],
    },

    /* ═══ STUDENT ATTENDANCE ═══ */
    studentAtt: {
      messages: [
        { role: "bot", kind: "cards", cards: [
          { c: "stat", color: "orange", icon: "calendar", kicker: "Student attendance · Today",
            num: "94.2%", delta: { text: "−1.1% vs avg", dir: "down" },
            metrics: [
              { k: "Present", v: "1,184" },
              { k: "Absent", v: "73" },
              { k: "On leave", v: "21" },
              { k: "Late", v: "14" },
            ] },
          { c: "list", color: "orange", icon: "calendar", kicker: "Attendance today", title: "By class",
            rows: [
              { ava: "12", avaColor: "green", name: "Class 12", sub: "118 / 120 present", val: "98%", valColor: "green" },
              { ava: "8", avaColor: "blue", name: "Class 8", sub: "125 / 131 present", val: "95%", valColor: "ink" },
              { ava: "10", avaColor: "orange", name: "Class 10", sub: "133 / 142 present", val: "94%", valColor: "ink" },
              { ava: "9", avaColor: "amber", name: "Class 9", sub: "134 / 148 present", val: "91%", valColor: "amber" },
            ] },
        ]},
      ],
      suggestions: [
        { label: "Leave: pending & on leave", intent: "leaveReport" },
        { label: "Student strength", intent: "students" },
        { label: "Fee collection", intent: "feeStatus" },
      ],
    },

    /* ═══ STAFF ATTENDANCE ═══ */
    staffAtt: {
      messages: [
        { role: "bot", kind: "cards", cards: [
          { c: "stat", color: "amber", icon: "clock", kicker: "Staff attendance · Today",
            num: "97.9%", delta: { text: "+0.4% vs avg", dir: "up" },
            metrics: [
              { k: "Present", v: "94" },
              { k: "On leave", v: "2" },
              { k: "Late", v: "1" },
              { k: "Subs arranged", v: "2" },
            ] },
        ]},
        { role: "bot", kind: "text", text: "All classes are covered — <strong>2 substitutions</strong> arranged for staff on leave. Want staff strength figures?" },
      ],
      suggestions: [
        { label: "Staff strength", intent: "staff" },
        { label: "Student attendance", intent: "studentAtt" },
        { label: "Fee collection", intent: "feeStatus" },
      ],
    },
  };

  /* ════════════════════════════════════════════════════════
     AGENTIC UPDATES (write actions) — the "agentic patch".
     Guardrail pattern: show the record → confirm → act + notify.
     Data exposure: counts & IDs reach the AI; raw PII stays hidden.
     ════════════════════════════════════════════════════════ */

  /* 1 · Admission — move a candidate across stages + email parent */
  RESPONSES.admMoveStage = {
    messages: [
      { role: "bot", kind: "text", text: "Here's the candidate. Review, then confirm and I'll update the stage and email the parent." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "purple", icon: "grad", kicker: "Admission · AD-2026-0341", title: "Likith Kumar",
          rows: [
            { k: "Current stage", v: "Registration", dot: "amber" },
            { k: "New stage", v: "Shortlisted", dot: "green" },
            { k: "Class applied", v: "Class 6 · HSR" },
            { k: "Parent contact", v: "On file · hidden" },
          ] },
        { c: "action", color: "blue", icon: "shield", kicker: "Confirm write · 2 tasks",
          title: "Update stage + notify parent",
          lines: [
            "Move <strong>Likith Kumar</strong> from <strong>Registration → Shortlisted</strong>.",
            "Email the parent the shortlist confirmation.",
          ],
          acts: [
            { label: "Confirm & update", icon: "check", primary: true, intent: "admMoveStageDone" },
            { label: "Cancel", icon: "x", intent: "admissions" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Show admissions overview", intent: "admissions" } ],
  };
  RESPONSES.admMoveStageDone = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Done. <strong>Likith Kumar</strong> is now <strong>Shortlisted</strong> and the parent has been emailed." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "green", icon: "check", kicker: "Completed · just now", title: "What changed",
          rows: [
            { k: "Stage", v: "Registration → Shortlisted", dot: "green" },
            { k: "Parent email", v: "Sent ✓", dot: "green" },
            { k: "Audit log", v: "#AL-77421 · admin" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Admissions overview", intent: "admissions" }, { label: "Today's admission update", intent: "admissions" } ],
  };

  /* 2 · Fee — apply approved discount + send revised receipt */
  RESPONSES.feeDiscount = {
    messages: [
      { role: "bot", kind: "text", text: "Found the fee record. Confirm to apply the sibling discount and send the revised receipt." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "green", icon: "wallet", kicker: "Student · ST-2026-0112", title: "Fee record · Term 1",
          rows: [
            { k: "Current demand", v: "₹48,000" },
            { k: "Sibling discount", v: "−₹6,000 (12.5%)", dot: "amber" },
            { k: "Revised demand", v: "₹42,000", dot: "green" },
            { k: "Approval", v: "Sanctioned · #DS-118" },
          ] },
        { c: "action", color: "blue", icon: "shield", kicker: "Confirm write · 2 tasks",
          title: "Adjust fee + send receipt",
          lines: [
            "Apply <strong>sibling discount −₹6,000</strong> to ST-2026-0112.",
            "Email the <strong>revised receipt</strong> to the parent.",
          ],
          acts: [
            { label: "Confirm & apply", icon: "check", primary: true, intent: "feeDiscountDone" },
            { label: "Cancel", icon: "x", intent: "feeStatus" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Fee collection", intent: "feeStatus" } ],
  };
  RESPONSES.feeDiscountDone = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Done. Discount applied and the revised receipt has been emailed." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "green", icon: "check", kicker: "Completed · just now", title: "What changed",
          rows: [
            { k: "Demand", v: "₹48,000 → ₹42,000", dot: "green" },
            { k: "Revised receipt", v: "Sent ✓", dot: "green" },
            { k: "Audit log", v: "#AL-77422 · admin" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Fee collection", intent: "feeStatus" }, { label: "Branch performance", intent: "branchRank" } ],
  };

  /* 3 · Communication — send broadcast now + schedule a reminder */
  RESPONSES.commBroadcast = {
    messages: [
      { role: "bot", kind: "text", text: "Here's the audience and both drafts. Confirm to send now and schedule Friday's reminder." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "blue", icon: "send", kicker: "Audience · Grade 10 parents", title: "PTM broadcast",
          rows: [
            { k: "Recipients", v: "142 parents" },
            { k: "Send now", v: "PTM · Sat 10:00 AM", dot: "blue" },
            { k: "Scheduled", v: "Reminder · Fri 8:00 AM", dot: "amber" },
            { k: "Channels", v: "App + SMS" },
          ] },
        { c: "action", color: "blue", icon: "shield", kicker: "Confirm write · 2 tasks",
          title: "Send now + schedule reminder",
          lines: [
            "Broadcast the <strong>PTM notice</strong> to 142 Grade 10 parents now.",
            "Schedule a <strong>reminder</strong> for Friday 8:00 AM.",
          ],
          acts: [
            { label: "Confirm & send", icon: "check", primary: true, intent: "commBroadcastDone" },
            { label: "Cancel", icon: "x", intent: "commReport" },
          ] },
      ]},
    ],
    suggestions: [ { label: "This week's broadcasts", intent: "commReport" } ],
  };
  RESPONSES.commBroadcastDone = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Sent to 142 parents. The Friday reminder is scheduled." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "green", icon: "check", kicker: "Completed · just now", title: "What happened",
          rows: [
            { k: "Sent now", v: "142 / 142 delivered", dot: "green" },
            { k: "Reminder", v: "Scheduled · Fri 8:00 AM", dot: "blue" },
            { k: "Audit log", v: "#AL-77423 · admin" },
          ] },
      ]},
    ],
    suggestions: [ { label: "This week's broadcasts", intent: "commReport" } ],
  };

  /* 4 · Leave — approve a request + notify */
  RESPONSES.leaveApprove = {
    messages: [
      { role: "bot", kind: "text", text: "Here's Anitha's request and balance. Confirm to approve and notify her." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "teal", icon: "calendar", kicker: "Leave request · LR-2026-0207", title: "Anitha R · Maths",
          rows: [
            { k: "Dates", v: "26–27 June (2 days)", dot: "blue" },
            { k: "Type", v: "Casual leave" },
            { k: "Balance after", v: "6 of 12 left", dot: "green" },
            { k: "Cover", v: "Substitute available" },
          ] },
        { c: "action", color: "blue", icon: "shield", kicker: "Confirm write · 2 tasks",
          title: "Approve + notify",
          lines: [
            "Approve <strong>Anitha's leave</strong> for 26–27 June.",
            "Notify her of the approval.",
          ],
          acts: [
            { label: "Approve", icon: "check", primary: true, intent: "leaveApproveDone" },
            { label: "Cancel", icon: "x", intent: "leaveReport" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Pending approvals", intent: "leaveReport" } ],
  };
  RESPONSES.leaveApproveDone = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Approved. Anitha has been notified and a substitute is arranged." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "green", icon: "check", kicker: "Completed · just now", title: "What changed",
          rows: [
            { k: "Status", v: "Pending → Approved", dot: "green" },
            { k: "Notification", v: "Sent ✓", dot: "green" },
            { k: "Audit log", v: "#AL-77424 · admin" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Pending approvals", intent: "leaveReport" }, { label: "Who's on leave today", intent: "leaveReport" } ],
  };

  /* 5 · Staff Information — update a staff record + audit log */
  RESPONSES.staffUpdate = {
    messages: [
      { role: "bot", kind: "text", text: "Here's Nikhil's current record. Confirm to apply the two field changes." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "teal", icon: "briefcase", kicker: "Staff · EMP-2024-0061", title: "Nikhil S · Science",
          rows: [
            { k: "Date of birth", v: "— → 21 Feb 1999", dot: "amber" },
            { k: "Gender", v: "— → Male", dot: "amber" },
            { k: "Department", v: "Science (unchanged)" },
          ] },
        { c: "action", color: "blue", icon: "shield", kicker: "Confirm write · profile fields",
          title: "Update record",
          lines: [
            "Set <strong>date of birth</strong> to 21 Feb 1999.",
            "Set <strong>gender</strong> to Male.",
          ],
          acts: [
            { label: "Confirm & update", icon: "check", primary: true, intent: "staffUpdateDone" },
            { label: "Cancel", icon: "x", intent: "staffInfo" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Staff information", intent: "staffInfo" } ],
  };
  RESPONSES.staffUpdateDone = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Updated Nikhil's record. Both fields are saved and logged." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "green", icon: "check", kicker: "Completed · just now", title: "What changed",
          rows: [
            { k: "Date of birth", v: "21 Feb 1999", dot: "green" },
            { k: "Gender", v: "Male", dot: "green" },
            { k: "Audit log", v: "#AL-77425 · admin" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Staff information", intent: "staffInfo" }, { label: "Staff strength", intent: "staff" } ],
  };

  /* 6 · Student Information — section change + inform parent */
  RESPONSES.studentUpdate = {
    messages: [
      { role: "bot", kind: "text", text: "Here's the student record. Confirm to move the section and inform the parent." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "blue", icon: "users", kicker: "Student · ST-2026-0098", title: "Section change",
          rows: [
            { k: "Current section", v: "6A", dot: "amber" },
            { k: "New section", v: "6B", dot: "green" },
            { k: "Seats in 6B", v: "3 open" },
            { k: "Parent contact", v: "On file · hidden" },
          ] },
        { c: "action", color: "blue", icon: "shield", kicker: "Confirm write · 2 tasks",
          title: "Update section + notify",
          lines: [
            "Move <strong>ST-2026-0098</strong> from <strong>6A → 6B</strong>.",
            "Inform the parent of the section change.",
          ],
          acts: [
            { label: "Confirm & move", icon: "check", primary: true, intent: "studentUpdateDone" },
            { label: "Cancel", icon: "x", intent: "studentInfo" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Student information", intent: "studentInfo" } ],
  };
  RESPONSES.studentUpdateDone = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Done. Student moved to 6B and the parent has been informed." },
      { role: "bot", kind: "cards", cards: [
        { c: "kv", color: "green", icon: "check", kicker: "Completed · just now", title: "What changed",
          rows: [
            { k: "Section", v: "6A → 6B", dot: "green" },
            { k: "Parent notice", v: "Sent ✓", dot: "green" },
            { k: "Audit log", v: "#AL-77426 · admin" },
          ] },
      ]},
    ],
    suggestions: [ { label: "Student information", intent: "studentInfo" }, { label: "Student strength", intent: "students" } ],
  };

  /* ════════════════════════════════════════════════════════
     MODULE REPORTS (read) — catalog modules not yet covered.
     ════════════════════════════════════════════════════════ */

  /* Communication broadcast — this week */
  RESPONSES.commReport = {
    messages: [
      { role: "bot", kind: "text", text: "<strong>Broadcasts sent this week · all branches</strong>" },
      { role: "bot", kind: "cards", cards: [
        { c: "stat", color: "blue", icon: "send", kicker: "Broadcasts · this week",
          num: "7", delta: { text: "78% avg open rate", dir: "up" },
          metrics: [
            { k: "Sent", v: "7" },
            { k: "Recipients", v: "4,120" },
            { k: "Opened", v: "3,214" },
            { k: "Scheduled", v: "2" },
          ] },
        { c: "list", color: "blue", icon: "send", kicker: "Sent this week", title: "Opens by broadcast",
          rows: [
            { ava: "P", avaColor: "blue", name: "PTM — Grade 10", sub: "142 sent", val: "88%", valColor: "green" },
            { ava: "F", avaColor: "green", name: "Fee due reminder", sub: "1,180 sent", val: "81%", valColor: "ink" },
            { ava: "H", avaColor: "amber", name: "Holiday notice", sub: "2,140 sent", val: "74%", valColor: "ink" },
            { ava: "E", avaColor: "purple", name: "Exam timetable", sub: "658 sent", val: "69%", valColor: "amber" },
          ] },
      ]},
    ],
    suggestions: [
      { label: "Send a broadcast + reminder", intent: "commBroadcast" },
      { label: "Student attendance", intent: "studentAtt" },
    ],
  };

  /* Leave management — pending + on leave today */
  RESPONSES.leaveReport = {
    messages: [
      { role: "bot", kind: "text", text: "<strong>Leave · today and pending your approval</strong>" },
      { role: "bot", kind: "cards", cards: [
        { c: "stat", color: "teal", icon: "calendar", kicker: "Leave · today",
          num: "5", delta: { text: "3 pending approval", dir: "down" },
          metrics: [
            { k: "On leave today", v: "5" },
            { k: "Pending", v: "3" },
            { k: "Approved", v: "11" },
            { k: "Subs arranged", v: "5" },
          ] },
        { c: "list", color: "amber", icon: "userAlert", kicker: "Pending your approval", title: "Awaiting action",
          rows: [
            { ava: "A", avaColor: "teal", name: "Anitha R · Maths", sub: "26–27 Jun · casual", val: "2d", valColor: "ink" },
            { ava: "S", avaColor: "blue", name: "Suresh K · Admin", sub: "28 Jun · casual", val: "1d", valColor: "ink" },
            { ava: "M", avaColor: "purple", name: "Meera J · Science", sub: "30 Jun–1 Jul · sick", val: "2d", valColor: "ink" },
          ] },
      ]},
    ],
    suggestions: [
      { label: "Approve Anitha's leave", intent: "leaveApprove" },
      { label: "Staff attendance", intent: "staffAtt" },
    ],
  };

  /* Staff information — headcount & joiners */
  RESPONSES.staffInfo = {
    messages: [
      { role: "bot", kind: "text", text: "<strong>Staff information · headcount and joiners this month</strong>" },
      { role: "bot", kind: "cards", cards: [
        { c: "stat", color: "teal", icon: "briefcase", kicker: "Teaching staff · by department",
          num: "72", delta: { text: "+3 joiners this month", dir: "up" },
          metrics: [
            { k: "Joined this month", v: "3" },
            { k: "Exits", v: "1" },
            { k: "Docs pending", v: "4" },
            { k: "Departments", v: "9" },
          ] },
        { c: "list", color: "teal", icon: "users", kicker: "Headcount", title: "By department",
          rows: [
            { ava: "Sc", avaColor: "teal", name: "Science", sub: "incl. 1 joiner", val: "16", valColor: "ink" },
            { ava: "Ma", avaColor: "blue", name: "Mathematics", sub: "stable", val: "12", valColor: "ink" },
            { ava: "En", avaColor: "purple", name: "English", sub: "incl. 1 joiner", val: "11", valColor: "ink" },
            { ava: "So", avaColor: "orange", name: "Social Studies", sub: "stable", val: "9", valColor: "ink" },
          ] },
      ]},
    ],
    suggestions: [
      { label: "Update a staff record", intent: "staffUpdate" },
      { label: "Staff strength", intent: "staff" },
    ],
  };

  /* Student information — new vs regular + capacity */
  RESPONSES.studentInfo = {
    messages: [
      { role: "bot", kind: "text", text: "<strong>Student information · new vs regular and seat capacity</strong>" },
      { role: "bot", kind: "cards", cards: [
        { c: "stat", color: "blue", icon: "users", kicker: "Students · capacity",
          num: "1,278", delta: { text: "182 open seats", dir: "up" },
          metrics: [
            { k: "New", v: "284" },
            { k: "Regular", v: "994" },
            { k: "Capacity", v: "1,460" },
            { k: "Occupied", v: "1,278" },
          ] },
        { c: "table", color: "blue", icon: "list", kicker: "Class-wise · new vs regular", title: "Seats by class",
          cols: ["Class", "New", "Regular", "Open"],
          align: ["left", "right", "right", "right"],
          rows: [
            ["Class 6", "33", "98", "9"],
            ["Class 9", "41", "107", "12"],
            ["Class 10", "22", "120", "18"],
            ["Class 11", "78", "46", "16"],
          ],
          foot: ["Total", "284", "994", "182"] },
      ]},
    ],
    suggestions: [
      { label: "Move a student's section", intent: "studentUpdate" },
      { label: "Student strength", intent: "students" },
    ],
  };

  /* ═══ Artifacts → New dashboard: ideate-and-build flow ═══ */
  RESPONSES.newDashboard = {
    messages: [
      { role: "bot", kind: "text", text: "Let's build a dashboard together. Tell me what you'd like to track — a module, a metric, a branch — or start from one of these:" },
    ],
    suggestions: [
      { label: "Fee collection dashboard", intent: "buildFeeDash" },
      { label: "Admissions funnel", intent: "buildAdmDash" },
      { label: "Attendance pulse", intent: "buildAttDash" },
    ],
  };
  RESPONSES.buildFeeDash = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Built the <strong>Fee Collection Dashboard</strong> from your live data — total collected, branch split and a 12-day trend. It's open on the side; hit <strong>Refresh data</strong> any time to pull the latest." },
    ],
    suggestions: [ { label: "Add an admissions funnel", intent: "buildAdmDash" }, { label: "Add attendance pulse", intent: "buildAttDash" } ],
  };
  RESPONSES.buildAdmDash = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Built the <strong>Admissions Funnel</strong> dashboard — applications, confirmations, seats left and admission revenue, with a 12-week trend. Opening it now." },
    ],
    suggestions: [ { label: "Add a fee dashboard", intent: "buildFeeDash" }, { label: "Add attendance pulse", intent: "buildAttDash" } ],
  };
  RESPONSES.buildAttDash = {
    messages: [
      { role: "bot", kind: "text", text: "✓ Built the <strong>Attendance Pulse</strong> dashboard — today's student & staff attendance with a 12-day trend. Opening it now." },
    ],
    suggestions: [ { label: "Add a fee dashboard", intent: "buildFeeDash" }, { label: "Add admissions funnel", intent: "buildAdmDash" } ],
  };

  const FALLBACK = {
    messages: [
      { role: "bot", kind: "text", text: "I answer six things for now — <strong>fee collection, admissions, student strength, staff strength, student attendance and staff attendance.</strong> Pick one:" },
    ],
    suggestions: [
      { label: "Fee collection", intent: "feeStatus" },
      { label: "Admissions", intent: "admissions" },
      { label: "Student strength", intent: "students" },
      { label: "Staff strength", intent: "staff" },
      { label: "Student attendance", intent: "studentAtt" },
      { label: "Staff attendance", intent: "staffAtt" },
    ],
  };

  function routeText(raw) {
    const t = (raw || "").toLowerCase();
    /* ── agentic writes (verbs first) ── */
    if (/(move|change|shift|shortlist).*(stage|registration|candidate|likith)|(stage|candidate).*(move|change)/.test(t)) return "admMoveStage";
    if (/(apply|give).*(discount|sibling|concession)|discount.*(apply|sibling)/.test(t)) return "feeDiscount";
    if (/(draft|send|broadcast|message|notify).*(parent|grade|ptm)|broadcast.*(send|schedule)/.test(t)) return "commBroadcast";
    if (/(approve|reject|sanction).*(leave|anitha)|leave.*(approve|reject)/.test(t)) return "leaveApprove";
    if (/(update|change|correct|set).*(staff|nikhil|date of birth|dob|gender|designation)/.test(t)) return "staffUpdate";
    if (/(move|change|update).*(section|6a|6b)|(section).*(change|move)/.test(t)) return "studentUpdate";
    /* ── module reports ── */
    if (/(broadcast|communicat|message sent|open rate|notice)/.test(t)) return "commReport";
    if (/(leave).*(pending|today|approv|who)|who is on leave|pending.*approv/.test(t)) return "leaveReport";
    if (/(headcount|joiner|department|designation).*(staff)|staff.*(headcount|joiner|department|record|info)/.test(t)) return "staffInfo";
    if (/(new and regular|new vs regular|capacity|occupied|open seat|seats)/.test(t)) return "studentInfo";
    if (/(dashboard|widget|chart|track|monitor|visuali|build me|create)/.test(t)) {
      if (/(admission|enrol|applic|seat|intake)/.test(t)) return "buildAdmDash";
      if (/(attend|present|leave|absent)/.test(t)) return "buildAttDash";
      if (/(fee|collect|payment|revenue|due)/.test(t)) return "buildFeeDash";
      return "newDashboard";
    }
    if (/(staff|teacher|employee|faculty).*(attend|present|leave)|(attend|present|leave).*(staff|teacher)/.test(t)) return "staffAtt";
    if (/(student|pupil|kid).*(attend|present|absent)|attend|present|absent/.test(t)) return "studentAtt";
    if (/(staff|teacher|employee|faculty)/.test(t)) return "staff";
    if (/(branch|school).*(perform|struggl|best|worst|rank|well)/.test(t)) return "branchRank";
    if (/(last year|year.over|yoy|same month|more or less)/.test(t)) return "feeYoY";
    if (/(new.*(vs|versus|compared).*continu|old.*(vs|new)|which group|pays better)/.test(t)) return "newVsCont";
    if (/(percent|%|share).*(admission|new)|admission.*(percent|%|share|revenue)/.test(t)) return "admRevShare";
    if (/(student|pupil|enrol|strength|headcount)/.test(t)) return "students";
    if (/(admission|applicant|application|seat|intake|enquir)/.test(t)) return "admissions";
    if (/(total|collect|pending|overdue|status|how much)/.test(t)) return "feeStatus";
    if (/(fee|payment|revenue|money)/.test(t)) return "feeStatus";
    return null;
  }

  function resolve(arg) {
    if (arg.intent) return RESPONSES[arg.intent] || FALLBACK;
    const intent = routeText(arg.text);
    return intent ? RESPONSES[intent] : FALLBACK;
  }

  const INTENT_LABEL = {
    feeStatus: "Total fees collected this month across all branches? How much is pending?",
    branchRank: "Which branch is performing well and which is struggling?",
    feeYoY: "Last year same month vs this month — are we collecting more or less?",
    admissions: "How many admissions this year? Applications and seats left?",
    admRevShare: "What % of total fee revenue came from new admission students?",
    admRevYoY: "How much did we earn from admissions last year vs this year?",
    newVsCont: "New vs continuing students — which group pays better?",
    students: "What is our total student strength?",
    staff: "What is our staff strength?",
    studentAtt: "What's today's student attendance?",
    staffAtt: "What's today's staff attendance?",
    admMoveStage: "Change Likith from Registration to Shortlisted and inform the parent.",
    admMoveStageDone: "Confirm — update the stage and email the parent.",
    feeDiscount: "Apply the sibling discount to student ST-2026-0112 and send the revised receipt.",
    feeDiscountDone: "Confirm — apply the discount and send the receipt.",
    commBroadcast: "Send a message to all Grade 10 parents about Saturday's PTM, and schedule a Friday reminder.",
    commBroadcastDone: "Confirm — send now and schedule the reminder.",
    leaveApprove: "Approve Anitha's leave for 26 and 27 June.",
    leaveApproveDone: "Confirm — approve and notify.",
    staffUpdate: "Update Nikhil's date of birth to 21 February 1999 and gender to Male.",
    staffUpdateDone: "Confirm — update the record.",
    studentUpdate: "Move student ST-2026-0098 from 6A to 6B and inform the parent.",
    studentUpdateDone: "Confirm — move the section and notify the parent.",
    commReport: "List the broadcasts we sent this week and how many parents opened each.",
    leaveReport: "Who is on leave today and what is pending my approval?",
    staffInfo: "How many teaching staff per department and who joined this month?",
    studentInfo: "Class-wise new and regular students, with capacity, occupied and open seats.",
    newDashboard: "Create a dashboard",
    buildFeeDash: "Build a fee collection dashboard",
    buildAdmDash: "Build an admissions funnel",
    buildAttDash: "Build an attendance pulse dashboard",
  };

  const COPILOT = { WELCOME_SUGGEST, CAPABILITIES, RESPONSES, resolve, INTENT_LABEL };

/* ==========================================================================
   TWEAKS PANEL COMPONENT
   ========================================================================== */
/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

/* ==========================================================================
   SHARED UI & ICON UTILITIES
   ========================================================================== */
/* ============================================================
   edumerge Copilot — shared UI components
   ============================================================ */


/* ---------- Icons (Lucide-style, currentColor stroke) ---------- */
const ICON_PATHS = {
  alert: '<path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.7 3h16.96a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  trendDown: '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
  trendUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  userAlert: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="12"/><line x1="19" y1="16" x2="19.01" y2="16"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
  arrowUp: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
  signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>',
  wifi: '<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  battery: '<rect x="2" y="7" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  grad: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"/>',
  pin: '<path d="M12 22s8-4.5 8-11a8 8 0 1 0-16 0c0 6.5 8 11 8 11z"/><circle cx="12" cy="11" r="3"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  pencil: '<path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  pin2: '<line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  message: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
};

function Icon({ name, size = 20, stroke = 2, fill = "none", style }) {
  const inner = ICON_PATHS[name] || "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}
      dangerouslySetInnerHTML={{ __html: inner }} />
  );
}

/* ---------- Iris brand mark: edumerge open-book + gears, with AI spark ---------- */
const IRIS_NAVY = "#1E0C8F";
const IRIS_ORANGE = "#F7941D";
function IrisMark({ size = 24, spark = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: "block" }}>
      {/* left page — navy, gear-toothed outer edge */}
      <path fill={IRIS_NAVY} d="M22.6 13 L7 8.8 L7 13.2 A2.7 2.7 0 0 0 7 18.6 L7 20.8 A2.7 2.7 0 0 0 7 26.2 L7 28.4 A2.7 2.7 0 0 0 7 33.8 L7 39 L22.6 35.4 Z" />
      {/* right page — orange, gear-toothed outer edge */}
      <path fill={IRIS_ORANGE} d="M25.4 13 L41 8.8 L41 13.2 A2.7 2.7 0 0 1 41 18.6 L41 20.8 A2.7 2.7 0 0 1 41 26.2 L41 28.4 A2.7 2.7 0 0 1 41 33.8 L41 39 L25.4 35.4 Z" />
      {/* AI spark rising from the open book */}
      {spark && <path fill={IRIS_ORANGE} d="M24 2.2 L25.25 5.6 L28.7 6.9 L25.25 8.2 L24 11.6 L22.75 8.2 L19.3 6.9 L22.75 5.6 Z" />}
    </svg>
  );
}

/* color name -> tile/tint css vars */
function tile(color) { return { background: `var(--tile-${color})`, color: "#fff" }; }
function tint(color) { return { background: `var(--tint-${color})`, color: `var(--tile-${color})` }; }

/* ---------- Typing indicator ---------- */
function Typing() {
  return (
    <div className="row bot">
      <div className="row-avatar"><Icon name="sparkle" size={16} fill="#fff" stroke={0} /></div>
      <div className="bubble bot typing"><i></i><i></i><i></i></div>
    </div>
  );
}

/* ---------- Suggestion chips ---------- */
function Chips({ items, onPick, scroller }) {
  if (!items || !items.length) return null;
  return (
    <div className={"chips" + (scroller ? " scroller" : "")}>
      {items.map((s, i) => (
        <button key={i} className="chip" onClick={() => onPick(s)}>{s.label}</button>
      ))}
    </div>
  );
}

/* ============================================================
   RICH CARDS
   ============================================================ */
function CardActs({ acts, onAct }) {
  if (!acts || !acts.length) return null;
  return (
    <div className="rcard-acts">
      {acts.map((a, i) => (
        <button key={i} className={"act" + (a.primary ? " primary" : "")} onClick={() => onAct(a)}>
          {a.icon && <Icon name={a.icon} size={15} />}{a.label}
        </button>
      ))}
    </div>
  );
}

function CardHead({ icon, color, kicker, title, pill }) {
  return (
    <div className="rcard-head">
      <div className="rcard-ico" style={tint(color)}><Icon name={icon} size={19} /></div>
      <div className="rcard-h">
        <div className="rcard-kicker">{kicker}</div>
        <div className="rcard-title">{title}</div>
      </div>
      {pill && <span className={"rcard-pill pill-" + pill.type}>{pill.text}</span>}
    </div>
  );
}

function html(s) { return { dangerouslySetInnerHTML: { __html: s } }; }

function AnomalyCard({ d }) {
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} pill={d.pill} />
      <div className="rcard-body"><div className="rcard-line" {...html(d.line)} /></div>
    </div>
  );
}

function ActionCard({ d, onAct }) {
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} />
      <div className="rcard-body">
        {d.lines.map((l, i) => <div key={i} className="rcard-line" {...html(l)} />)}
      </div>
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

function StatCard({ d }) {
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title="" />
      <div className="stat-big">
        <span className="stat-num">{d.num}</span>
        <span className={"stat-delta " + d.delta.dir}>{d.delta.text}</span>
      </div>
      {d.metrics && (
        <div className="metrics">
          {d.metrics.map((m, i) => (
            <div className="metric" key={i}>
              <div className="metric-k">{m.k}</div>
              <div className="metric-v">{m.v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListCard({ d, onAct }) {
  const valColor = (c) => c === "ink" ? "var(--ink)" : `var(--tile-${c})`;
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} />
      <div>
        {d.rows.map((r, i) => (
          <div className="lrow" key={i}>
            <div className="lrow-ava" style={tile(r.avaColor)}>{r.ava}</div>
            <div className="lrow-tx">
              <div className="lrow-name">{r.name}</div>
              <div className="lrow-sub">{r.sub}</div>
            </div>
            <div className="lrow-val" style={{ color: valColor(r.valColor) }}>{r.val}</div>
          </div>
        ))}
      </div>
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

function FeeCard({ d, onAct }) {
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} pill={d.pill} />
      <div className="metrics">
        {d.metrics.map((m, i) => (
          <div className="metric" key={i}>
            <div className="metric-k">{m.k}</div>
            <div className="metric-v">{m.v} <small>{m.sub}</small></div>
          </div>
        ))}
      </div>
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

function SynthCard({ d }) {
  return (
    <div className="rcard">
      <CardHead icon="layers" color="purple" kicker={d.kicker} title={d.title} />
      <div className="synth">
        {d.nodes.map((n, i) => (
          <div className="synth-node" key={i}>
            <div className="synth-rail">
              <div className="synth-bead" style={tint(n.color)}><Icon name={n.icon} size={15} /></div>
              {i < d.nodes.length - 1 && <div className="synth-line" />}
            </div>
            <div className="synth-tx">
              <div className="synth-k">{n.k}</div>
              <div className="synth-v" {...html(n.v)} />
            </div>
          </div>
        ))}
      </div>
      <div className="synth-concl" {...html(d.conclusion)} />
    </div>
  );
}

function ProfileCard({ d, onAct }) {
  const toneColor = (t) => t === "down" ? "var(--tile-red)" : t === "warn" ? "var(--amber)" : t === "muted" ? "var(--ink-2)" : "var(--ink)";
  return (
    <div className="rcard">
      <div className="rcard-head">
        <div className="lrow-ava" style={{ ...tile(d.color), width: 44, height: 44, borderRadius: 13, fontSize: 17 }}>{d.avatar}</div>
        <div className="rcard-h">
          <div className="rcard-kicker">{d.kicker}</div>
          <div className="rcard-title">{d.name}</div>
        </div>
        <span className="rcard-pill pill-down">{d.risk}</span>
      </div>
      <div className="metrics">
        {d.metrics.map((m, i) => (
          <div className="metric" key={i}>
            <div className="metric-k">{m.k}</div>
            <div className="metric-v" style={{ color: toneColor(m.tone) }}>{m.v}</div>
          </div>
        ))}
      </div>
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

const DOT_COLOR = { green: "var(--green)", red: "var(--tile-red)", amber: "var(--amber)", blue: "var(--blue)", purple: "var(--purple)", teal: "var(--teal)", orange: "var(--orange)" };

/* key / value rows */
function KvCard({ d, onAct }) {
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} />
      <div className="kv">
        {d.rows.map((r, i) => (
          <div className="kv-row" key={i}>
            <span className="kv-k">
              {r.dot && <span className="kv-dot" style={{ background: DOT_COLOR[r.dot] }}></span>}
              {r.k}
            </span>
            <span className="kv-v">{r.v}</span>
          </div>
        ))}
      </div>
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

/* two-period comparison */
function CompareCard({ d, onAct }) {
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} />
      <div className="cmp">
        <div className="cmp-side">
          <div className="cmp-label">{d.left.label}</div>
          <div className="cmp-val">{d.left.value}</div>
          <div className="cmp-sub">{d.left.sub}</div>
        </div>
        <div className="cmp-arrow"><Icon name="chevronRight" size={18} /></div>
        <div className="cmp-side">
          <div className="cmp-label">{d.right.label}</div>
          <div className="cmp-val accent">{d.right.value}</div>
          <div className="cmp-sub">{d.right.sub}</div>
        </div>
      </div>
      {d.growth && (
        <div className={"cmp-growth " + (d.growth.dir === "down" ? "down" : "up")}>
          <Icon name={d.growth.dir === "down" ? "trendDown" : "trendUp"} size={15} />{d.growth.text}
        </div>
      )}
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

/* multi-column table */
function TableCard({ d, onAct }) {
  const al = (i) => (d.align && d.align[i] === "right") ? "right" : "left";
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} />
      <div className="tbl">
        <div className="tbl-row tbl-head">
          {d.cols.map((c, i) => <span key={i} style={{ textAlign: al(i) }}>{c}</span>)}
        </div>
        {d.rows.map((row, ri) => (
          <div className="tbl-row" key={ri}>
            {row.map((cell, ci) => <span key={ci} style={{ textAlign: al(ci), fontWeight: ci === 0 ? 700 : 600, color: ci === 0 ? "var(--ink)" : "var(--ink-2)" }}>{cell}</span>)}
          </div>
        ))}
        {d.foot && (
          <div className="tbl-row tbl-foot">
            {d.foot.map((cell, ci) => <span key={ci} style={{ textAlign: al(ci) }}>{cell}</span>)}
          </div>
        )}
      </div>
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

/* proportional split (stacked bar + legend) */
function SplitCard({ d, onAct }) {
  return (
    <div className="rcard">
      <CardHead icon={d.icon} color={d.color} kicker={d.kicker} title={d.title} />
      <div className="split-body">
        <div className="split-bar">
          {d.parts.map((p, i) => (
            <span key={i} style={{ width: p.pct + "%", background: DOT_COLOR[p.color] }}></span>
          ))}
        </div>
        <div className="split-legend">
          {d.parts.map((p, i) => (
            <div className="split-item" key={i}>
              <span className="split-key"><span className="kv-dot" style={{ background: DOT_COLOR[p.color] }}></span>{p.label}</span>
              <span className="split-val">{p.value} <small>· {p.pct}%</small></span>
            </div>
          ))}
        </div>
      </div>
      <CardActs acts={d.acts} onAct={onAct} />
    </div>
  );
}

function RichCards({ cards, onAct }) {
  return (
    <div className="rcards">
      {cards.map((d, i) => {
        switch (d.c) {
          case "anomaly": return <AnomalyCard key={i} d={d} />;
          case "action": return <ActionCard key={i} d={d} onAct={onAct} />;
          case "stat": return <StatCard key={i} d={d} />;
          case "list": return <ListCard key={i} d={d} onAct={onAct} />;
          case "fee": return <FeeCard key={i} d={d} onAct={onAct} />;
          case "synth": return <SynthCard key={i} d={d} />;
          case "profile": return <ProfileCard key={i} d={d} onAct={onAct} />;
          case "kv": return <KvCard key={i} d={d} onAct={onAct} />;
          case "compare": return <CompareCard key={i} d={d} onAct={onAct} />;
          case "table": return <TableCard key={i} d={d} onAct={onAct} />;
          case "split": return <SplitCard key={i} d={d} onAct={onAct} />;
          default: return null;
        }
      })}
    </div>
  );
}

/* ---------- Message row ---------- */
function MessageRow({ msg, onAct }) {
  if (msg.kind === "cards") {
    return (
      <div className="row bot">
        <div className="row-avatar"><Icon name="sparkle" size={16} fill="#fff" stroke={0} /></div>
        <div className="bubble-wrap" style={{ maxWidth: "92%" }}>
          <RichCards cards={msg.cards} onAct={onAct} />
          {msg.time && <span className="bubble-time">{msg.time}</span>}
        </div>
      </div>
    );
  }
  const isUser = msg.role === "user";
  return (
    <div className={"row " + (isUser ? "user" : "bot")}>
      {!isUser && <div className="row-avatar"><Icon name="sparkle" size={16} fill="#fff" stroke={0} /></div>}
      <div className="bubble-wrap">
        <div className={"bubble " + (isUser ? "user" : "bot")} {...html(msg.text)} />
        {msg.time && <span className="bubble-time">{msg.time}</span>}
      </div>
    </div>
  );
}

/* ---------- Welcome / empty state ---------- */
function Welcome({ onPick, name, onOpenProject, recents, onOpenRecent }) {
  const caps = COPILOT.CAPABILITIES;
  const pick = (c) => {
    if (c.project && onOpenProject) onOpenProject(c.project);
    else onPick({ intent: c.intent });
  };
  return (
    <div className="welcome">
      <div className="welcome-mark"><Icon name="sparkle" size={28} fill="#fff" stroke={0} /></div>
      <div className="welcome-h">Hi, I'm {name}.<br/>What would you like to <em>know</em>?</div>
      <div className="welcome-p">Straight, real-time numbers across all your branches — accurate every time.</div>
      <div className="cap-label">Ask me about</div>
      <div className="tile-grid">
        {caps.map((c, i) => (
          <button key={i} className="tile" onClick={() => pick(c)}>
            <div className="tile-ico" style={tint(c.color)}><Icon name={c.icon} size={19} /></div>
            <div className="tile-t">{c.title}</div>
            <div className="tile-d">{c.desc}</div>
          </button>
        ))}
      </div>
      {recents && recents.length > 0 && (
        <>
          <div className="cap-label">Recent chats</div>
          <div className="recent-mini">
            {recents.slice(0, 4).map((c, i) => (
              <button key={i} className="recent-row" onClick={() => onOpenRecent && onOpenRecent(c)}>
                <span className="rr-ic"><Icon name={c.icon} size={15} /></span>
                <span className="rr-t">{c.title}</span>
                <Icon name="chevronRight" size={15} style={{ color: "var(--ink-3)", flex: "none" }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Composer ---------- */
function Composer({ onSend, hint, disabled }) {
  const [val, setVal] = useState("");
  const [mic, setMic] = useState(false);
  const ref = useRef(null);
  const micTimer = useRef(null);

  const grow = (el) => { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 96) + "px"; };

  const submit = () => {
    const t = val.trim();
    if (!t || disabled) return;
    onSend({ text: t });
    setVal("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  const toggleMic = () => {
    if (mic) { clearTimeout(micTimer.current); setMic(false); return; }
    setMic(true);
    micTimer.current = setTimeout(() => {
      setMic(false);
      setVal("What changed today?");
      if (ref.current) { grow(ref.current); ref.current.focus(); }
    }, 1800);
  };

  useEffect(() => () => clearTimeout(micTimer.current), []);

  return (
    <div className="composer">
      <div className="composer-inner">
        <button className={"mic-btn" + (mic ? " live" : "")} onClick={toggleMic} title="Voice input">
          <Icon name="mic" size={19} />
        </button>
        <textarea ref={ref} rows={1} value={mic ? "Listening…" : val} disabled={mic}
          placeholder="Ask about anything…"
          onChange={(e) => { setVal(e.target.value); grow(e.target); }}
          onKeyDown={onKey} />
        <button className="send-btn" onClick={submit} disabled={!val.trim() || disabled} title="Send">
          <Icon name="arrowUp" size={19} stroke={2.4} />
        </button>
      </div>
      {hint && <div className="composer-hint">{hint}</div>}
    </div>
  );
}

/* export to window for other babel scripts */

/* ==========================================================================
   PROJECTS & REFRESHABLE DASHBOARD VIEWS
   ========================================================================== */
/* ============================================================
   edumerge · Iris — Projects + Artifacts (Claude-app concept)
   Adds: project workspaces (module-based or custom) and
   refreshable dashboard artifacts.
   ============================================================ */

/* ---------- number formatters (for refreshable dashboards) ---------- */
const fmtINRL = (n) => "₹" + (n / 100000).toFixed(2) + "L";
const fmtINR  = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtPct  = (n) => n.toFixed(1) + "%";
const fmtInt  = (n) => Math.round(n).toLocaleString("en-IN");
const FMT = { inrL: fmtINRL, inr: fmtINR, pct: fmtPct, int: fmtInt };
const jitter = (n, amt = 0.02) => n * (1 + (Math.random() * 2 - 1) * amt);

/* ============================================================
   PROJECTS  (module-based come pre-wired with that domain)
   ============================================================ */
const PROJECTS = [
  { id: "fees", type: "module", name: "Fee Management", icon: "wallet", color: "orange",
    desc: "Collections, dues, refunds and reconciliation across all 6 branches.",
    chats: [
      { id: "f1", title: "January collection vs target", when: "2h ago", intent: "feeStatus" },
      { id: "f2", title: "Which branch is lagging?", when: "Yesterday", intent: "branchRank" },
      { id: "f3", title: "Overdue follow-up list", when: "2 days ago", intent: "feeStatus" },
      { id: "f4", title: "Year-over-year collection", when: "Apr 12", intent: "feeYoY" },
    ] },
  { id: "adm", type: "module", name: "Admissions", icon: "grad", color: "blue",
    desc: "Enquiries, applications, seat allotment and admission revenue.",
    chats: [
      { id: "a1", title: "New admissions this year", when: "5h ago", intent: "admissions" },
      { id: "a2", title: "Revenue from new admits", when: "Yesterday", intent: "admRevShare" },
      { id: "a3", title: "New vs continuing students", when: "Apr 28", intent: "newVsCont" },
    ] },
  { id: "att", type: "module", name: "Attendance", icon: "calendar", color: "blue",
    desc: "Daily student and staff attendance, leaves and substitutions.",
    chats: [
      { id: "t1", title: "Today's student attendance", when: "1h ago", intent: "studentAtt" },
      { id: "t2", title: "Staff attendance today", when: "3h ago", intent: "staffAtt" },
    ] },
  { id: " q3", type: "custom", name: "Q3 Board Review", icon: "folder", color: "orange",
    desc: "Custom workspace — pulling numbers for the quarterly board meeting.",
    chats: [
      { id: "q1", title: "Fee + admission revenue mix", when: "Yesterday", intent: "admRevShare" },
      { id: "q2", title: "Branch performance ranking", when: "2 days ago", intent: "branchRank" },
    ] },
];

/* templates offered in the "New project" sheet */
const PROJECT_TEMPLATES = [
  { id: "fees", name: "Fee Management", icon: "wallet", color: "orange", desc: "Collections, dues & refunds" },
  { id: "adm", name: "Admissions", icon: "grad", color: "blue", desc: "Enquiries to enrolment" },
  { id: "att", name: "Attendance", icon: "calendar", color: "blue", desc: "Students & staff, daily" },
  { id: "exam", name: "Examinations", icon: "doc", color: "orange", desc: "Marks, results & analysis" },
  { id: "staff", name: "Staff & HR", icon: "briefcase", color: "blue", desc: "Headcount, payroll & leave" },
  { id: "custom", name: "Custom project", icon: "plus", color: "orange", desc: "Start from a blank workspace" },
];

/* ============================================================
   ARTIFACTS  (dashboards — refreshable)
   ============================================================ */
const ARTIFACTS = [
  { id: "feeDash", title: "Fee Collection Dashboard", icon: "grid", color: "orange",
    desc: "Live collection, branch split and 12-day trend.",
    project: "Fee Management",
    widgets: [
      { type: "kpi", k: "Collected (MTD)", base: 4567000, fmt: "inrL", delta: "+8.5% YoY", dir: "up" },
      { type: "kpi", k: "Pending", base: 892000, fmt: "inrL", delta: "−12% MoM", dir: "up" },
      { type: "kpi", k: "Overdue (30+d)", base: 234000, fmt: "inrL", delta: "+5 accts", dir: "down" },
      { type: "kpi", k: "Collection rate", base: 83.6, fmt: "pct", delta: "+2.3 pts", dir: "up" },
      { type: "bars", label: "Daily collection · last 12 days",
        bars: [62, 78, 54, 88, 70, 95, 48, 82, 66, 90, 58, 74] },
      { type: "split", label: "Revenue mix",
        parts: [ { label: "New admissions", base: 1850000, fmt: "inrL", color: "orange", pct: 38 },
                 { label: "Continuing", base: 2695000, fmt: "inrL", color: "blue", pct: 62 } ] },
      { type: "rows", label: "Top branches",
        rows: [ { name: "HSR", base: 1850000, fmt: "inrL" },
                { name: "Banashankari", base: 1477000, fmt: "inrL" },
                { name: "Arkavathi", base: 1240000, fmt: "inrL" } ] },
    ] },
  { id: "admDash", title: "Admissions Funnel", icon: "grid", color: "blue",
    desc: "Enquiries → applications → confirmed, with seats left.",
    project: "Admissions",
    widgets: [
      { type: "kpi", k: "Applications", base: 412, fmt: "int", delta: "+12% YoY", dir: "up" },
      { type: "kpi", k: "Confirmed", base: 284, fmt: "int", delta: "69% conv.", dir: "up" },
      { type: "kpi", k: "Seats left", base: 66, fmt: "int", delta: "across grades", dir: "down" },
      { type: "kpi", k: "Adm. revenue", base: 1850000, fmt: "inrL", delta: "+21.7%", dir: "up" },
      { type: "bars", label: "Applications · last 12 weeks",
        bars: [40, 52, 48, 63, 58, 71, 66, 80, 74, 88, 82, 95] },
      { type: "rows", label: "Admissions by class",
        rows: [ { name: "Class 11", base: 78, fmt: "int" },
                { name: "Class 1", base: 64, fmt: "int" },
                { name: "Class 9", base: 41, fmt: "int" } ] },
    ] },
  { id: "attDash", title: "Attendance Pulse", icon: "grid", color: "blue",
    desc: "Today's student & staff attendance at a glance.",
    project: "Attendance",
    widgets: [
      { type: "kpi", k: "Student present", base: 94.2, fmt: "pct", delta: "−1.1% vs avg", dir: "down" },
      { type: "kpi", k: "Staff present", base: 97.9, fmt: "pct", delta: "+0.4% vs avg", dir: "up" },
      { type: "kpi", k: "Absent", base: 73, fmt: "int", delta: "students", dir: "down" },
      { type: "kpi", k: "On leave", base: 21, fmt: "int", delta: "students", dir: "up" },
      { type: "bars", label: "Attendance % · last 12 days",
        bars: [92, 94, 91, 95, 93, 96, 90, 94, 92, 95, 93, 94] },
    ] },
];

/* ---------- one refreshable dashboard ---------- */
function Dashboard({ artifact, compact }) {
  const seed = React.useRef(0);
  const [tick, setTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => { seed.current += 1; setTick((t) => t + 1); setSecs(0); setRefreshing(false); }, 850);
  };

  const rel = secs < 3 ? "just now" : secs < 60 ? secs + "s ago" : Math.floor(secs / 60) + "m ago";
  // recompute jittered values whenever tick changes
  const val = (base, fmt) => FMT[fmt](seed.current === 0 ? base : jitter(base));

  return (
    <div className="dash">
      <div className="dash-bar">
        <div className="dash-bar-tx">
          <span className="dash-live"><span className="conn-dot on"></span>Live data</span>
          <span className="dash-upd">Updated {rel}</span>
        </div>
        <button className={"dash-refresh" + (refreshing ? " busy" : "")} onClick={refresh}>
          <Icon name="refresh" size={15} stroke={2.2} />{refreshing ? "Refreshing…" : "Refresh data"}
        </button>
      </div>
      <div className={"dash-grid" + (compact ? " compact" : "")} key={tick}>
        {artifact.widgets.map((w, i) => {
          if (w.type === "kpi") return (
            <div className="dash-kpi" key={i}>
              <div className="dk-k">{w.k}</div>
              <div className="dk-v">{val(w.base, w.fmt)}</div>
              <div className={"dk-d " + (w.dir === "down" ? "down" : "up")}>
                <Icon name={w.dir === "down" ? "trendDown" : "trendUp"} size={13} />{w.delta}
              </div>
            </div>
          );
          if (w.type === "bars") return (
            <div className="dash-wide" key={i}>
              <div className="dw-label">{w.label}</div>
              <div className="dw-bars">
                {w.bars.map((b, j) => {
                  const h = seed.current === 0 ? b : Math.max(12, Math.min(100, jitter(b, 0.12)));
                  return <span key={j} style={{ height: h + "%" }}></span>;
                })}
              </div>
            </div>
          );
          if (w.type === "split") return (
            <div className="dash-wide" key={i}>
              <div className="dw-label">{w.label}</div>
              <div className="split-bar" style={{ marginTop: 10 }}>
                {w.parts.map((p, j) => <span key={j} style={{ width: p.pct + "%", background: `var(--tile-${p.color})` }}></span>)}
              </div>
              <div className="split-legend" style={{ marginTop: 10 }}>
                {w.parts.map((p, j) => (
                  <div className="split-item" key={j}>
                    <span className="split-key"><span className="kv-dot" style={{ background: `var(--tile-${p.color})` }}></span>{p.label}</span>
                    <span className="split-val">{val(p.base, p.fmt)} <small>· {p.pct}%</small></span>
                  </div>
                ))}
              </div>
            </div>
          );
          if (w.type === "rows") return (
            <div className="dash-wide" key={i}>
              <div className="dw-label">{w.label}</div>
              <div className="dw-rows">
                {w.rows.map((r, j) => (
                  <div className="dw-row" key={j}><span>{r.name}</span><b>{val(r.base, r.fmt)}</b></div>
                ))}
              </div>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
}

/* ---------- empty-state / list helpers ---------- */
function SectionHead({ title, sub, action, onAction }) {
  return (
    <div className="sec-head">
      <div>
        <div className="sec-title">{title}</div>
        {sub && <div className="sec-sub">{sub}</div>}
      </div>
      {action && <button className="sec-action" onClick={onAction}><Icon name="plus" size={15} stroke={2.4} />{action}</button>}
    </div>
  );
}

/* ---------- Projects: library grid ---------- */
function ProjectsView({ onOpen, onNew }) {
  return (
    <div className="lib">
      <SectionHead title="Projects" sub="Organise chats by module or your own workspace" action="New project" onAction={onNew} />
      <div className="proj-grid">
        {PROJECTS.map((p) => (
          <button className="proj-card" key={p.id} onClick={() => onOpen(p.id)}>
            <div className="proj-top">
              <div className="proj-ic" style={tint(p.color)}><Icon name={p.icon} size={20} /></div>
              <span className={"proj-tag " + p.type}>{p.type === "module" ? "Module" : "Custom"}</span>
            </div>
            <div className="proj-name">{p.name}</div>
            <div className="proj-desc">{p.desc}</div>
            <div className="proj-foot"><Icon name="message" size={13} />{p.chats.length} chats</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Project home: its chats + new chat ---------- */
function ProjectHome({ project, onOpenChat, onNewChat, onBack }) {
  return (
    <div className="lib">
      <button className="back-link" onClick={onBack}><Icon name="arrowLeft" size={16} />All projects</button>
      <div className="proj-hero">
        <div className="proj-hero-ic" style={tint(project.color)}><Icon name={project.icon} size={26} /></div>
        <div className="proj-hero-tx">
          <div className="proj-hero-name">{project.name} <span className={"proj-tag " + project.type}>{project.type === "module" ? "Module" : "Custom"}</span></div>
          <div className="proj-hero-desc">{project.desc}</div>
        </div>
      </div>
      <button className="proj-newchat" onClick={() => onNewChat(project)}>
        <Icon name="plus" size={17} stroke={2.4} /> New chat in {project.name}
      </button>
      <div className="sec-title sm">Chats in this project</div>
      <div className="chat-list">
        {project.chats.map((c) => (
          <button className="chat-item" key={c.id} onClick={() => onOpenChat(project, c)}>
            <div className="ci-ic"><Icon name="message" size={16} /></div>
            <div className="ci-tx"><div className="ci-t">{c.title}</div><div className="ci-w">Last message {c.when}</div></div>
            <Icon name="chevronRight" size={16} style={{ color: "var(--ink-3)", flex: "none" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Artifacts: library grid ---------- */
function ArtifactsView({ onOpen, onCreate }) {
  return (
    <div className="lib">
      <SectionHead title="Artifacts" sub="Dashboards you've created — refreshable any time" action="New dashboard" onAction={onCreate} />
      <div className="art-grid">
        {ARTIFACTS.map((a) => (
          <button className="art-card" key={a.id} onClick={() => onOpen(a.id)}>
            <div className="art-ic" style={tint(a.color)}><Icon name={a.icon} size={20} /></div>
            <div className="art-name">{a.title}</div>
            <div className="art-desc">{a.desc}</div>
            <div className="art-foot"><span className="conn-dot on"></span>Live · {a.project}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- New-project picker sheet ---------- */
function NewProjectSheet({ onClose, onPick }) {
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">New project</div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={20} /></button>
        </div>
        <div className="modal-sub">Start from a module — pre-wired with its live data — or a blank custom workspace.</div>
        <div className="tpl-grid">
          {PROJECT_TEMPLATES.map((t) => (
            <button className="tpl-card" key={t.id} onClick={() => onPick(t)}>
              <div className="tpl-ic" style={tint(t.color)}><Icon name={t.icon} size={19} /></div>
              <div className="tpl-tx"><div className="tpl-name">{t.name}</div><div className="tpl-desc">{t.desc}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CHAT ENGINE & variant SCENE WRAPPERS
   ========================================================================== */
/* ============================================================
   edumerge Copilot — chat engine + frames + page
   ============================================================ */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- shared nav state (Claude-app model) ---------- */
function useNav() {
  const [view, setView] = useState("chat");   // chat | projects | project | artifacts
  const [projectId, setProjectId] = useState(null);
  const [artifactId, setArtifactId] = useState(null);
  const project = projectId ? PROJECTS.find((p) => p.id === projectId) : null;
  const artifact = artifactId ? ARTIFACTS.find((a) => a.id === artifactId) : null;
  const go = (v) => { setView(v); };
  const openProject = (id) => { setProjectId(id); setView("project"); };
  const openArtifact = (id) => { setArtifactId(id); };
  const closeArtifact = () => setArtifactId(null);
  return { view, setView: go, projectId, project, openProject,
           artifactId, artifact, openArtifact, closeArtifact, setProjectId };
}

/* ---------- shared chat state hook ---------- */
function useChat() {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [typing, setTyping] = useState(false);
  const [activeTitle, setActiveTitle] = useState(null);
  const busy = useRef(false);
  const clock = useRef({ h: 9, m: 41 });

  const nextTime = () => {
    const c = clock.current;
    const hh = c.h % 12 === 0 ? 12 : c.h % 12;
    const ap = c.h < 12 ? "AM" : "PM";
    const t = `${hh}:${String(c.m).padStart(2, "0")} ${ap}`;
    c.m += 1; if (c.m >= 60) { c.m = 0; c.h += 1; }
    return t;
  };

  const send = useCallback(async (arg) => {
    if (busy.current) return;
    busy.current = true;
    const label = arg.intent ? (COPILOT.INTENT_LABEL[arg.intent] || arg.text || "…") : arg.text;
    setSuggestions([]);
    setMessages((m) => [...m, { role: "user", kind: "text", text: label, time: nextTime(), id: Math.random() }]);

    const res = COPILOT.resolve(arg);
    await wait(120);
    for (let i = 0; i < res.messages.length; i++) {
      setTyping(true);
      await wait(i === 0 ? 760 : 620);
      setTyping(false);
      setMessages((m) => [...m, { ...res.messages[i], time: nextTime(), id: Math.random() }]);
      await wait(140);
    }
    setSuggestions(res.suggestions || []);
    busy.current = false;
  }, []);

  const reset = useCallback(() => {
    setMessages([]); setSuggestions([]); setTyping(false); setActiveTitle(null);
    busy.current = false; clock.current = { h: 9, m: 41 };
  }, []);

  // load a chat instantly (no typing) — for existing chats (dummy history)
  // or a new blank chat (omit opts), or a seeded intro (opts.history)
  const loadChat = useCallback((title, opts = {}) => {
    setTyping(false); busy.current = false; clock.current = { h: 9, m: 41 };
    setActiveTitle(title || null);
    setMessages(opts.history || []);
    setSuggestions(opts.suggestions || []);
  }, []);

  return { messages, suggestions, typing, send, reset, loadChat, activeTitle,
           setActiveTitle, started: messages.length > 0 };
}

/* build preloaded messages from a scripted intent (no animation) */
function intentMsgs(intent) {
  const r = COPILOT.RESPONSES[intent];
  if (!r) return { msgs: [], sg: [] };
  return { msgs: r.messages.map((m) => ({ ...m, id: Math.random(), time: "9:41 AM" })), sg: r.suggestions || [] };
}
/* a dummy past conversation: the question + Iris's answer */
function dummyHistory(title, intent) {
  const { msgs, sg } = intentMsgs(intent);
  const q = (COPILOT.INTENT_LABEL[intent]) || title;
  return { history: [{ role: "user", kind: "text", text: q, id: Math.random(), time: "9:40 AM" }, ...msgs], suggestions: sg };
}
/* the "create a dashboard" intro (bot prompt only, blank-ish) */
function dashboardIntro() {
  const { msgs, sg } = intentMsgs("newDashboard");
  return { history: msgs, suggestions: sg };
}
/* which artifact a build-intent produces */
const DASH_BUILD = { buildFeeDash: "feeDash", buildAdmDash: "admDash", buildAttDash: "attDash" };

/* ---------- scrollable conversation + composer ---------- */
function ChatPanel({ chat, name, variant, onArtifact, onOpenProject, onOpenRecent }) {
  const { messages, suggestions, typing, send, started } = chat;
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, suggestions]);

  // send wrapper: if a build-intent, auto-open its dashboard after the reply
  const handleSend = (arg) => {
    send(arg);
    const dash = arg.intent && DASH_BUILD[arg.intent];
    if (dash && onArtifact) setTimeout(() => onArtifact(dash), 1500);
  };

  const hasData = messages.some((m) => m.kind === "cards");

  // pick a relevant dashboard from the conversation context
  const artifactFor = () => {
    const t = (chat.activeTitle || "") + " " + messages.map((m) => m.text || "").join(" ");
    if (/admiss|enrol|applic/i.test(t)) return "admDash";
    if (/attend|present|leave/i.test(t)) return "attDash";
    return "feeDash";
  };

  return (
    <>
      <div className="asst-scroll" ref={scrollRef}>
        <div className="conv-col">
          {!started && <Welcome name={name} onPick={handleSend} onOpenProject={onOpenProject}
            recents={RECENT_CHATS} onOpenRecent={onOpenRecent} />}
          {started && <div className="day-sep"><span>Live · all branches</span></div>}
          {messages.map((m) => <MessageRow key={m.id} msg={m} onAct={(a) => handleSend({ intent: a.intent })} />)}
          {typing && <Typing />}
          {started && !typing && hasData && onArtifact && (
            <button className="art-cta" onClick={() => onArtifact(artifactFor())}>
              <span className="art-cta-ic"><Icon name="grid" size={17} /></span>
              <span className="art-cta-tx"><b>Open as live dashboard</b><small>Turn this answer into a refreshable artifact</small></span>
              <Icon name="external" size={15} style={{ color: "var(--ink-3)", flex: "none" }} />
            </button>
          )}
          {started && !typing && suggestions.length > 0 && (
            <Chips items={suggestions} onPick={handleSend} scroller={variant === "mobile"} />
          )}
          <div style={{ height: 4 }} />
        </div>
      </div>
      <Composer onSend={handleSend}
        hint={<span className="byline">by <b><span className="b-edu">edu</span><span className="b-merge">merge</span></b></span>} />
    </>
  );
}

/* ---------- assistant header (shared markup, two skins) ---------- */
function AsstHeader({ name, variant, onReset, onSettings, onMenu, online = true, title, onBack }) {
  return (
    <div className={"asst-head" + (variant === "web" ? " web" : "")}>
      {variant === "mobile" && (
        <div className="statusbar">
          <span>9:41</span>
          <span className="sb-right">
            <Icon name="signal" size={17} stroke={2.2} />
            <Icon name="wifi" size={17} stroke={2.2} />
            <Icon name="battery" size={22} stroke={2} />
          </span>
        </div>
      )}
      <div className="asst-bar">
        {variant === "mobile"
          ? (onBack
              ? <button className="icon-btn" onClick={onBack}><Icon name="arrowLeft" size={21} /></button>
              : <button className="icon-btn" title="Menu" onClick={onMenu}><Icon name="menu" size={22} /></button>)
          : null}
        <div className="asst-id">
          {title ? (
            <div className="asst-meta"><div className="asst-name">{title}</div></div>
          ) : (
            <>
              <div className="asst-avatar"><Icon name="sparkle" size={22} fill="#fff" stroke={0} /></div>
              <div className="asst-meta">
                <div className="asst-name">{name} <span className="badge-ai">AI</span></div>
                <div className="asst-status">
                  <span className={"conn-dot " + (online ? "on" : "off")}></span>
                  {online ? "Online · sees your live data" : "Offline · reconnecting…"}
                </div>
              </div>
            </>
          )}
        </div>
        {variant === "mobile" ? (
          <button className="icon-btn" title="Settings" onClick={onSettings}><Icon name="settings" size={21} /></button>
        ) : (
          <>
            <button className="icon-btn" title="New chat" onClick={onReset}><Icon name="refresh" size={19} /></button>
            <button className="icon-btn"><Icon name="more" size={20} /></button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SHARED FEATURE COMPONENTS
   ============================================================ */
function Toggle({ on, onToggle }) {
  return (
    <button className="tog" data-on={on ? "1" : "0"} onClick={(e) => { e.stopPropagation(); onToggle(!on); }}>
      <i></i>
    </button>
  );
}

const USAGE = { used: 18420, total: 50000, queries: 312, month: "June" };
function UsageMeter({ card }) {
  const pct = Math.round((USAGE.used / USAGE.total) * 100);
  return (
    <div className={card ? "usage-card" : "ws-usage"}>
      <div className="ws-usage-top">
        <Icon name="bolt" size={15} style={{ color: "var(--accent-deep)" }} />
        AI usage <span className="u-month">{USAGE.month}</span>
      </div>
      <div className="prog"><span style={{ width: pct + "%" }}></span></div>
      <div className="ws-usage-meta"><b>{USAGE.used.toLocaleString()}</b> / {USAGE.total.toLocaleString()} credits · {USAGE.queries} queries</div>
    </div>
  );
}

function SheetRow({ icon, color, title, desc, value, toggle, on, onToggle, onClick }) {
  return (
    <div className="srow" onClick={onClick}>
      <div className="srow-ic" style={tint(color || "orange")}><Icon name={icon} size={18} /></div>
      <div className="srow-tx">
        <div className="srow-t">{title}</div>
        {desc && <div className="srow-d">{desc}</div>}
      </div>
      {toggle ? <Toggle on={on} onToggle={onToggle} />
        : value ? <div className="srow-val">{value}<Icon name="chevronRight" size={16} /></div>
        : <Icon name="chevronRight" size={17} style={{ color: "var(--ink-3)" }} />}
    </div>
  );
}

function SettingsSheet({ onClose, onNewChat }) {
  const [voice, setVoice] = useState(true);
  const [notif, setNotif] = useState(true);
  const [proactive, setProactive] = useState(true);
  return (
    <>
      <div className="sheet-scrim" onClick={onClose}></div>
      <div className="sheet">
        <div className="sheet-grab"></div>
        <div className="sheet-head">
          <div className="sheet-title">Iris</div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={20} /></button>
        </div>
        <div className="sheet-body">
          <UsageMeter card />
          <div className="sheet-label">Assistant</div>
          <div className="sheet-group">
            <SheetRow icon="plus" color="orange" title="New chat" desc="Start a fresh conversation" onClick={() => { onNewChat(); onClose(); }} />
            <SheetRow icon="clock" color="blue" title="Chat history" value="14" />
            <SheetRow icon="bookmark" color="purple" title="Saved insights" value="6" />
          </div>
          <div className="sheet-label">Preferences</div>
          <div className="sheet-group">
            <SheetRow icon="bolt" color="amber" title="Proactive alerts" desc="Notify me when something needs attention" toggle on={proactive} onToggle={setProactive} />
            <SheetRow icon="mic" color="teal" title="Voice replies" toggle on={voice} onToggle={setVoice} />
            <SheetRow icon="bell" color="red" title="Push notifications" toggle on={notif} onToggle={setNotif} />
          </div>
          <div className="sheet-label">Connected data</div>
          <div className="sheet-group">
            <SheetRow icon="calendar" color="green" title="Attendance" value={<span className="srow-on"><span className="dot-live"></span>Live</span>} />
            <SheetRow icon="wallet" color="blue" title="Fees & payments" value={<span className="srow-on"><span className="dot-live"></span>Live</span>} />
            <SheetRow icon="doc" color="amber" title="Examinations" value={<span className="srow-on"><span className="dot-live"></span>Live</span>} />
            <SheetRow icon="database" color="purple" title="Manage sources" desc="3 more available" />
          </div>
          <div className="sheet-label">About</div>
          <div className="sheet-group">
            <SheetRow icon="shield" color="teal" title="Privacy & data" />
            <SheetRow icon="chat" color="blue" title="Help & feedback" />
            <SheetRow icon="settings" color="orange" title="All settings" />
          </div>
          <div className="sheet-foot"><span className="byline">by <b><span className="b-edu">edu</span><span className="b-merge">merge</span></b></span><span>Iris AI · v1.0</span></div>
        </div>
      </div>
    </>
  );
}

/* ---------- mobile slide-in drawer ---------- */
function MobileDrawer({ nav, chat, onClose, onNewChat, onSettings }) {
  const goto = (v) => { nav.setView(v); onClose(); };
  return (
    <>
      <div className="drawer-scrim" onClick={onClose}></div>
      <div className="drawer">
        <div className="drawer-brand">
          <div className="asst-avatar sm"><Icon name="sparkle" size={18} fill="#fff" stroke={0} /></div>
          <div><div className="asst-name">Iris <span className="badge-ai">AI</span></div>
            <div className="ws-brand-sub">School assistant</div></div>
        </div>
        <button className="ws-newchat" onClick={() => { onNewChat(); onClose(); }}><Icon name="plus" size={17} stroke={2.4} /> New chat</button>
        <div className="ws-nav top">
          <button className={"ws-item" + (nav.view === "projects" || nav.view === "project" ? " active" : "")} onClick={() => goto("projects")}>
            <span className="it-ic"><Icon name="folder" size={17} /></span><span className="it-t">Projects</span><span className="ws-badge">{PROJECTS.length}</span>
          </button>
          <button className={"ws-item" + (nav.view === "artifacts" ? " active" : "")} onClick={() => goto("artifacts")}>
            <span className="it-ic"><Icon name="grid" size={17} /></span><span className="it-t">Artifacts</span><span className="ws-badge">{ARTIFACTS.length}</span>
          </button>
        </div>
        <div className="ws-sec">Recent</div>
        <div className="ws-list">
          {RECENT_CHATS.map((c, i) => (
            <button key={i} className="ws-item" onClick={() => { chat.loadChat(c.title, dummyHistory(c.title, c.intent)); goto("chat"); }}>
              <span className="it-ic"><Icon name={c.icon} size={16} /></span><span className="it-t">{c.title}</span>
            </button>
          ))}
        </div>
        <div className="ws-spacer"></div>
        <UsageMeter />
        <div className="ws-nav">
          <button className="ws-item" onClick={() => { onSettings(); onClose(); }}><span className="it-ic"><Icon name="settings" size={16} /></span><span className="it-t">Settings</span></button>
        </div>
        <div className="ws-account">
          <div className="lrow-ava" style={tile("blue")}>R</div>
          <div className="ws-account-tx"><div className="ws-account-name">Rao Vidya Niketan</div><div className="ws-account-role">Administrator</div></div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   VARIANT 1 — Mobile in-app assistant
   ============================================================ */
function MobileVariant({ name }) {
  const chat = useChat();
  const nav = useNav();
  const [settings, setSettings] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [newProj, setNewProj] = useState(false);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  const startNew = () => { chat.reset(); nav.setView("chat"); };

  // header config per view
  let header;
  if (nav.view === "chat") header = <AsstHeader name={name} variant="mobile" online={online} onMenu={() => setDrawer(true)} onSettings={() => setSettings(true)} />;
  else if (nav.view === "projects") header = <AsstHeader variant="mobile" title="Projects" onMenu={() => setDrawer(true)} onSettings={() => setSettings(true)} />;
  else if (nav.view === "artifacts") header = <AsstHeader variant="mobile" title="Artifacts" onMenu={() => setDrawer(true)} onSettings={() => setSettings(true)} />;
  else if (nav.view === "project") header = <AsstHeader variant="mobile" title={nav.project?.name} onBack={() => nav.setView("projects")} onSettings={() => setSettings(true)} />;

  return (
    <div className="phone">
      <div className="dynamic-island"></div>
      <div className="phone-screen">
        <div className="asst">
          {header}
          {nav.view === "chat" && <ChatPanel chat={chat} name={name} variant="mobile" onArtifact={nav.openArtifact} onOpenProject={nav.openProject} onOpenRecent={(c) => chat.loadChat(c.title, dummyHistory(c.title, c.intent))} />}
          {nav.view === "projects" && <div className="m-scroll"><ProjectsView onOpen={nav.openProject} onNew={() => setNewProj(true)} /></div>}
          {nav.view === "project" && nav.project && <div className="m-scroll"><ProjectHome project={nav.project}
            onBack={() => nav.setView("projects")}
            onNewChat={() => { chat.loadChat("New chat · " + nav.project.name); nav.setView("chat"); }}
            onOpenChat={(p, c) => { chat.loadChat(c.title, dummyHistory(c.title, c.intent)); nav.setView("chat"); }} /></div>}
          {nav.view === "artifacts" && <div className="m-scroll"><ArtifactsView onOpen={nav.openArtifact} onCreate={() => { chat.loadChat("New dashboard", dashboardIntro()); nav.setView("chat"); }} /></div>}
          <div className="home-ind"></div>

          {nav.artifact && (
            <div className="m-artifact">
              <div className="asst-head"><div className="asst-bar">
                <button className="icon-btn" onClick={nav.closeArtifact}><Icon name="arrowLeft" size={21} /></button>
                <div className="asst-id"><div className="art-panel-ic" style={tint(nav.artifact.color)}><Icon name={nav.artifact.icon} size={17} /></div>
                  <div className="asst-meta"><div className="asst-name" style={{ fontSize: 16 }}>{nav.artifact.title}</div>
                  <div className="asst-status" style={{ fontSize: 11 }}>{nav.artifact.project} · dashboard</div></div></div>
              </div></div>
              <div className="m-artifact-body"><Dashboard artifact={nav.artifact} compact /></div>
            </div>
          )}

          {drawer && <MobileDrawer nav={nav} chat={chat} onClose={() => setDrawer(false)} onNewChat={startNew} onSettings={() => setSettings(true)} />}
          {settings && <SettingsSheet onClose={() => setSettings(false)} onNewChat={startNew} />}
      {newProj && <NewProjectSheet onClose={() => setNewProj(false)} onPick={(tpl) => { setNewProj(false); const ex = PROJECTS.find((p) => p.id === tpl.id); if (ex) nav.openProject(ex.id); }} />}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VARIANT 2 — Web ERP with docked copilot
   ============================================================ */
function ErpBackdrop() {
  const nav = [
    { ic: "grad", t: "Dashboard", active: true },
    { ic: "users", t: "Students" },
    { ic: "calendar", t: "Attendance" },
    { ic: "doc", t: "Examinations" },
    { ic: "wallet", t: "Fees" },
    { ic: "layers", t: "Admissions" },
  ];
  const bars = [62, 78, 54, 88, 70, 95, 48, 82, 66, 90, 58, 74];
  return (
    <>
      <div className="erp-side">
        <div className="erp-brand">
          <div className="erp-brand-mark">e</div>
          <div className="erp-brand-tx">edumerge</div>
        </div>
        <div className="erp-nav-label">School</div>
        {nav.map((n, i) => (
          <div key={i} className={"erp-nav" + (n.active ? " active" : "")}>
            <span className="ni"><Icon name={n.ic} size={18} /></span>{n.t}
          </div>
        ))}
      </div>
      <div className="erp-main">
        <div className="erp-top">
          <h2>Dashboard</h2>
          <div className="spacer"></div>
          <div className="erp-search"><Icon name="search" size={15} />Search students, fees…</div>
        </div>
        <div className="erp-content">
          <div className="erp-kpis">
            <div className="kpi"><div className="kpi-k">Attendance today</div><div className="kpi-v">94.2%</div><div className="kpi-d down">−1.1% vs avg</div></div>
            <div className="kpi"><div className="kpi-k">Fees collected</div><div className="kpi-v">₹3.82L</div><div className="kpi-d up">+18% today</div></div>
            <div className="kpi"><div className="kpi-k">Overdue</div><div className="kpi-v">₹2.4L</div><div className="kpi-d down">+5 accounts</div></div>
            <div className="kpi"><div className="kpi-k">Students flagged</div><div className="kpi-v">9</div><div className="kpi-d down">+3 this week</div></div>
          </div>
          <div className="erp-panel-block">
            <h3>Fee collection · last 12 days</h3>
            <div className="erp-bars">
              {bars.map((b, i) => <div key={i} className="b" style={{ height: b + "%" }} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function WebVariant({ name }) {
  const chat = useChat();
  const nav = useNav();
  const [folded, setFolded] = useState(false);
  const [newProj, setNewProj] = useState(false);
  const [settings, setSettings] = useState(false);
  const startNewChat = () => { chat.reset(); nav.setView("chat"); };
  const topTitle = nav.view === "projects" ? "Projects" : nav.view === "artifacts" ? "Artifacts"
    : nav.view === "project" ? nav.project?.name : (chat.activeTitle || "New chat");
  return (
    <div className="erp">
      <div className="browserbar">
        <div className="lights"><i></i><i></i><i></i></div>
        <div className="urlbar"><Icon name="shield" size={13} />app.edumerge.com/iris</div>
      </div>
      <div className="ws-embed">
        <WebSidebar folded={folded} onToggle={() => setFolded((f) => !f)} nav={nav} chat={chat} onNewChat={startNewChat} onSettings={() => setSettings(true)} />
        <div className="ws-main">
          <div className="ws-top">
            <button className="icon-btn" title="Toggle sidebar" onClick={() => setFolded((f) => !f)}><Icon name="menu" size={20} /></button>
            <div className="ws-top-title">{topTitle}</div>
            <div className="spacer"></div>
            {nav.view === "chat" && <div className="ws-chip"><span className="conn-dot on"></span>Connected to live data</div>}
            <button className="icon-btn bordered" title="Refresh" onClick={() => window.location.reload()}><Icon name="refresh" size={18} /></button>
          </div>
          <div className="ws-body">
            <div className="ws-canvas">
              {nav.view === "chat" && <div className="asst ws-asst"><ChatPanel chat={chat} name={name} variant="web" onArtifact={nav.openArtifact} onOpenProject={nav.openProject} onOpenRecent={(c) => chat.loadChat(c.title, dummyHistory(c.title, c.intent))} /></div>}
              {nav.view === "projects" && <div className="ws-scrollview"><ProjectsView onOpen={nav.openProject} onNew={() => setNewProj(true)} /></div>}
              {nav.view === "project" && nav.project && <div className="ws-scrollview"><ProjectHome project={nav.project}
                onBack={() => nav.setView("projects")}
                onNewChat={() => { chat.loadChat("New chat · " + nav.project.name); nav.setView("chat"); }}
                onOpenChat={(p, c) => { chat.loadChat(c.title, dummyHistory(c.title, c.intent)); nav.setView("chat"); }} /></div>}
              {nav.view === "artifacts" && <div className="ws-scrollview"><ArtifactsView onOpen={nav.openArtifact} onCreate={() => { chat.loadChat("New dashboard", dashboardIntro()); nav.setView("chat"); }} /></div>}
            </div>
            {nav.artifact && (
              <div className="art-panel">
                <div className="art-panel-head">
                  <div className="art-panel-id">
                    <div className="art-panel-ic" style={tint(nav.artifact.color)}><Icon name={nav.artifact.icon} size={17} /></div>
                    <div><div className="art-panel-title">{nav.artifact.title}</div><div className="art-panel-sub">{nav.artifact.project} · dashboard</div></div>
                  </div>
                  <button className="icon-btn" onClick={nav.closeArtifact}><Icon name="x" size={19} /></button>
                </div>
                <div className="art-panel-body"><Dashboard artifact={nav.artifact} /></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {settings && <SettingsSheet onClose={() => setSettings(false)} onNewChat={startNewChat} />}
      {newProj && <NewProjectSheet onClose={() => setNewProj(false)} onPick={(tpl) => { setNewProj(false); const ex = PROJECTS.find((p) => p.id === tpl.id); if (ex) nav.openProject(ex.id); }} />}
    </div>
  );
}

/* ============================================================
   TWEAKS
   ============================================================ */
const ASSISTANT_NAME = "Iris";

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#000098",
  "corners": 20,
  "font": "jakarta",
  "dark": false
}/*EDITMODE-END*/;

const ACCENTS = {
  "#000098": { deep: "#00007A", soft: "#E4E4F7", softDark: "#1C1C50" },
  "#FC9C00": { deep: "#E08300", soft: "#FFF0D6", softDark: "#3A2A0C" },
};
const FONTS = {
  jakarta: '"Plus Jakarta Sans", system-ui, sans-serif',
  manrope: '"Manrope", system-ui, sans-serif',
  system:  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
};

function useApplyTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => {
    const root = document.documentElement;
    const acc = ACCENTS[t.accent] || ACCENTS["#000098"];
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-deep", acc.deep);
    root.style.setProperty("--accent-soft", t.dark ? acc.softDark : acc.soft);
    root.style.setProperty("--bubble-radius", t.corners + "px");
    root.style.setProperty("--card-radius", Math.max(8, t.corners - 2) + "px");
    root.style.setProperty("--font", FONTS[t.font] || FONTS.jakarta);
    root.setAttribute("data-theme", t.dark ? "dark" : "light");
  }, [t]);
  return [t, setTweak];
}

function TweakControls({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Brand" />
      <TweakColor label="Accent" value={t.accent}
        options={["#000098", "#FC9C00"]}
        onChange={(v) => setTweak("accent", v)} />
      <TweakSection label="Style" />
      <TweakSlider label="Corner radius" value={t.corners} min={6} max={26} step={1} unit="px"
        onChange={(v) => setTweak("corners", v)} />
      <TweakSelect label="Typeface" value={t.font}
        options={[{ value: "jakarta", label: "Plus Jakarta" }, { value: "manrope", label: "Manrope" }, { value: "system", label: "System" }]}
        onChange={(v) => setTweak("font", v)} />
      <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
    </TweaksPanel>
  );
}

/* ============================================================
   STANDALONE EXPERIENCE — Mobile only (auto-scaled phone)
   ============================================================ */
function MobileStage() {
  const [t, setTweak] = useApplyTweaks();
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 40) / 818, (window.innerWidth - 24) / 412);
      setScale(s > 0.3 ? s : 0.3);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div className="stage-mobile">
      <div style={{ width: 390 * scale, height: 818 * scale, flex: "none" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <MobileVariant name={ASSISTANT_NAME} />
        </div>
      </div>
      <TweakControls t={t} setTweak={setTweak} />
    </div>
  );
}

/* ============================================================
   STANDALONE EXPERIENCE — Web only (full-screen Iris workspace)
   ============================================================ */
const RECENT_CHATS = [
  { icon: "wallet", title: "Fee collection across branches", intent: "feeStatus", active: true },
  { icon: "grad", title: "Admissions this year", intent: "admissions" },
  { icon: "users", title: "Student strength", intent: "students" },
  { icon: "calendar", title: "Student attendance today", intent: "studentAtt" },
  { icon: "layers", title: "Branch performance", intent: "branchRank" },
];

function WebSidebar({ folded, onToggle, nav, chat, onNewChat, onSettings }) {
  const navigate = useNavigate();
  const navItem = (v, icon, label, badge) => (
    <button className={"ws-item" + (nav.view === v ? " active" : "")} title={label} onClick={() => { nav.setView(v); }}>
      <span className="it-ic"><Icon name={icon} size={16} /></span>
      <span className="it-t">{label}</span>
      {badge != null && <span className="ws-badge">{badge}</span>}
    </button>
  );
  return (
    <div className={"ws-side" + (folded ? " folded" : "")} style={{ flex: folded ? "0 0 76px" : "0 0 290px" }}>
      <div className="ws-brand">
        <div className="asst-avatar"><Icon name="sparkle" size={20} fill="#fff" stroke={0} /></div>
        <div className="ws-brand-tx">
          <div className="ws-brand-name">Iris <span className="badge-ai">AI</span></div>
          <div className="ws-brand-sub">School assistant</div>
        </div>
        <button className="ws-fold" onClick={onToggle} title={folded ? "Expand" : "Collapse"}>
          <Icon name={folded ? "chevronRight" : "chevronLeft"} size={17} />
        </button>
      </div>
      <button className="ws-newchat" onClick={onNewChat} title="New chat"><Icon name="plus" size={17} stroke={2.4} /> <span className="nc-t">New chat</span></button>

      <div className="ws-nav top">
        {navItem("projects", "folder", "Projects", PROJECTS.length)}
        {navItem("artifacts", "grid", "Artifacts", ARTIFACTS.length)}
      </div>

      <div className="ws-sec">Recent</div>
      <div className="ws-list">
        {RECENT_CHATS.map((c, i) => (
          <button key={i} className={"ws-item" + (nav.view === "chat" && chat.activeTitle === c.title ? " active" : "")} title={c.title}
            onClick={() => chat.loadChat(c.title, dummyHistory(c.title, c.intent))}>
            <span className="it-ic"><Icon name={c.icon} size={16} /></span>
            <span className="it-t">{c.title}</span>
          </button>
        ))}
      </div>

      <div className="ws-spacer"></div>

      <UsageMeter />
      <div className="ws-usage-mini" title="AI usage · 18,420 / 50,000 credits"><Icon name="bolt" size={17} style={{ color: "var(--accent-deep)" }} /></div>
      <div className="ws-nav">
        <div className="ws-item" title="Saved insights"><span className="it-ic"><Icon name="bookmark" size={16} /></span><span className="it-t">Saved insights</span></div>
        <div className="ws-item" onClick={onSettings} title="Settings"><span className="it-ic"><Icon name="settings" size={16} /></span><span className="it-t">Settings</span></div>
      </div>
      <div className="ws-account">
        <div className="lrow-ava" style={tile("blue")}>R</div>
        <div className="ws-account-tx">
          <div className="ws-account-name">Rao Vidya Niketan</div>
          <div className="ws-account-role">Administrator</div>
        </div>
        <button onClick={() => navigate("/")} className="icon-btn" title="Exit to HRMS Dashboard" style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer" }}><Icon name="logout" size={17} style={{ color: "var(--ink-3)" }} /></button>
      </div>
    </div>
  );
}

function WebStage() {
  const [t, setTweak] = useApplyTweaks();
  const chat = useChat();
  const nav = useNav();
  const [folded, setFolded] = useState(false);
  const [newProj, setNewProj] = useState(false);
  const [settings, setSettings] = useState(false);

  const startNewChat = () => { chat.reset(); nav.setView("chat"); };

  const topTitle = nav.view === "projects" ? "Projects"
    : nav.view === "artifacts" ? "Artifacts"
    : nav.view === "project" ? nav.project?.name
    : (chat.activeTitle || "New chat");

  return (
    <div className="ws">
      <WebSidebar folded={folded} onToggle={() => setFolded((f) => !f)} nav={nav} chat={chat}
        onNewChat={startNewChat} onSettings={() => setSettings(true)} />
      <div className="ws-main">
        <div className="ws-top">
          <button className="icon-btn" title="Toggle sidebar" onClick={() => setFolded((f) => !f)}><Icon name="menu" size={20} /></button>
          <div className="ws-top-title">{topTitle}</div>
          <div className="spacer"></div>
          {nav.view === "chat" && <div className="ws-chip"><span className="conn-dot on"></span>Connected to live data</div>}
          <button className="icon-btn bordered" title="Refresh" onClick={() => window.location.reload()}><Icon name="refresh" size={18} /></button>
        </div>

        <div className="ws-body">
          <div className="ws-canvas">
            {nav.view === "chat" && (
              <div className="asst ws-asst"><ChatPanel chat={chat} name={ASSISTANT_NAME} variant="web" onArtifact={nav.openArtifact} onOpenProject={nav.openProject} onOpenRecent={(c) => chat.loadChat(c.title, dummyHistory(c.title, c.intent))} /></div>
            )}
            {nav.view === "projects" && (
              <div className="ws-scrollview"><ProjectsView onOpen={nav.openProject} onNew={() => setNewProj(true)} /></div>
            )}
            {nav.view === "project" && nav.project && (
              <div className="ws-scrollview"><ProjectHome project={nav.project}
                onBack={() => nav.setView("projects")}
                onNewChat={() => { chat.loadChat("New chat · " + nav.project.name); nav.setView("chat"); }}
                onOpenChat={(p, c) => { chat.loadChat(c.title, dummyHistory(c.title, c.intent)); nav.setView("chat"); }} /></div>
            )}
            {nav.view === "artifacts" && (
              <div className="ws-scrollview"><ArtifactsView onOpen={nav.openArtifact} onCreate={() => { chat.loadChat("New dashboard", dashboardIntro()); nav.setView("chat"); }} /></div>
            )}
          </div>

          {nav.artifact && (
            <div className="art-panel">
              <div className="art-panel-head">
                <div className="art-panel-id">
                  <div className="art-panel-ic" style={tint(nav.artifact.color)}><Icon name={nav.artifact.icon} size={17} /></div>
                  <div>
                    <div className="art-panel-title">{nav.artifact.title}</div>
                    <div className="art-panel-sub">{nav.artifact.project} · dashboard</div>
                  </div>
                </div>
                <button className="icon-btn" onClick={nav.closeArtifact}><Icon name="x" size={19} /></button>
              </div>
              <div className="art-panel-body"><Dashboard artifact={nav.artifact} /></div>
            </div>
          )}
        </div>
      </div>
      {settings && <SettingsSheet onClose={() => setSettings(false)} onNewChat={startNewChat} />}
      {newProj && <NewProjectSheet onClose={() => setNewProj(false)} onPick={(tpl) => {
        setNewProj(false);
        const existing = PROJECTS.find((p) => p.id === tpl.id);
        if (existing) nav.openProject(existing.id);
        else nav.setView("projects");
      }} />}
      <TweakControls t={t} setTweak={setTweak} />
    </div>
  );
}

/* ============================================================
   SHOWROOM — both surfaces side by side
   ============================================================ */
function App() {
  const [t, setTweak] = useApplyTweaks();
  return (
    <div className="page">
      <div className="page-head">
        <span className="page-eyebrow"><Icon name="sparkle" size={13} fill="currentColor" stroke={0} /> edumerge · AI Copilot</span>
        <h1 className="page-title">Meet Iris — the edumerge copilot</h1>
        <p className="page-sub">Iris is the in-app assistant for edumerge. Ask her about the six numbers that run your institution — fee collection, admissions, student & staff strength, and student & staff attendance — and get straight, real-time facts every time. Two surfaces, one assistant. Tap a card or type a question to try it.</p>
      </div>
      <div className="variants">
        <div className="variant">
          <div className="variant-label">
            <div className="variant-num">1</div>
            <div className="variant-name">In-app assistant · Mobile</div>
            <div className="variant-desc">Full-screen conversational surface inside the edumerge mobile app, with rich cards, voice input and quick suggestions.</div>
          </div>
          <MobileVariant name={ASSISTANT_NAME} />
        </div>
        <div className="variant">
          <div className="variant-label">
            <div className="variant-num">2</div>
            <div className="variant-name">Full-screen workspace · Web</div>
            <div className="variant-desc">Iris as a dedicated web app — foldable sidebar with recent chats, AI-usage meter and connected data sources, plus a focused conversation canvas.</div>
          </div>
          <WebVariant name={ASSISTANT_NAME} />
        </div>
      </div>
      <TweakControls t={t} setTweak={setTweak} />
    </div>
  );
}



// Stripped offline React DOM mount

export default function IrisAI() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom theme variables reactive to tweaks panel state
  const [t, setTweak] = useApplyTweaks();
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const acc = ACCENTS[t.accent] || ACCENTS["#000098"];
    el.style.setProperty("--accent", t.accent);
    el.style.setProperty("--accent-deep", acc.deep);
    el.style.setProperty("--accent-soft", t.dark ? acc.softDark : acc.soft);
    el.style.setProperty("--bubble-radius", t.corners + "px");
    el.style.setProperty("--card-radius", Math.max(8, t.corners - 2) + "px");
    el.style.setProperty("--font", FONTS[t.font] || FONTS.jakarta);
    el.setAttribute("data-theme", t.dark ? "dark" : "light");
  }, [t]);

  return (
    <div ref={containerRef} className="iris-container w-full h-full relative">
      <style dangerouslySetInnerHTML={{ __html: "\n  .iris-container {\n    /* Scoped styles wrapper */\n  }\n  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');\n\n/* ============================================================\n   edumerge Copilot — design tokens & styles\n   Color reference: edumerge parent app\n   ============================================================ */\n:root {\n  /* Brand palette — edumerge logo (ONLY these two hues) */\n  --navy: #000098;\n  --navy-deep: #00007A;\n  --orange: #FC9C00;\n  --orange-deep: #E08300;\n  --blue: #000098;\n  --blue-deep: #00007A;\n  /* legacy semantic names mapped onto the two brand hues */\n  --green: #000098;\n  --purple: #000098;\n  --amber: #E08300;\n  --teal: #000098;\n\n  /* Tweakable accent — defaults to edumerge NAVY (logo primary) */\n  --accent: #000098;\n  --accent-deep: #00007A;\n  --accent-soft: #E4E4F7;\n\n  /* Surfaces (light theme) — clean neutrals with a faint navy cast */\n  --peach: #E8E8F6;\n  --peach-lift: #F2F2FB;\n  --canvas: #F7F7FC;\n  --surface: #FFFFFF;\n  --surface-2: #EFEFF7;\n  --line: #E5E5F0;\n  --line-strong: #D4D4E6;\n\n  /* Text */\n  --ink: #16162E;\n  --ink-2: #565676;\n  --ink-3: #8A8AA6;\n\n  /* Tile fills (soft) — navy family or orange family only */\n  --tint-orange: #FFF0D6;\n  --tint-blue: #E1E1F6;\n  --tint-green: #E1E1F6;\n  --tint-purple: #E1E1F6;\n  --tint-amber: #FFF0D6;\n  --tint-teal: #E1E1F6;\n  --tint-red: #FFE3CC;\n\n  --tile-orange: #FC9C00;\n  --tile-blue: #000098;\n  --tile-green: #000098;\n  --tile-purple: #000098;\n  --tile-amber: #E08300;\n  --tile-teal: #000098;\n  --tile-red: #E08300;\n\n  /* Geometry (tweakable) */\n  --bubble-radius: 20px;\n  --card-radius: 18px;\n\n  --font: \"Plus Jakarta Sans\", -apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, sans-serif;\n\n  --shadow-sm: 0 1px 2px rgba(27,27,31,0.05), 0 1px 3px rgba(27,27,31,0.04);\n  --shadow-md: 0 4px 14px rgba(27,27,31,0.07), 0 1px 3px rgba(27,27,31,0.05);\n  --shadow-lg: 0 18px 50px rgba(27,27,31,0.16), 0 4px 12px rgba(27,27,31,0.08);\n}\n\n[data-theme=\"dark\"] {\n  --peach: #12123A;\n  --peach-lift: #16164A;\n  --canvas: #0B0B1A;\n  --surface: #15152C;\n  --surface-2: #1C1C3A;\n  --line: #26264A;\n  --line-strong: #303056;\n  --ink: #ECECF8;\n  --ink-2: #AEAECB;\n  --ink-3: #7E7EA0;\n  --accent: #6E6EE8;\n  --accent-deep: #5252D8;\n  --accent-soft: #1C1C50;\n\n  --tile-blue: #6E6EE8; --tile-green: #6E6EE8; --tile-purple: #6E6EE8; --tile-teal: #6E6EE8;\n  --tint-orange: #3A2A0C;\n  --tint-blue: #1C1C50;\n  --tint-green: #1C1C50;\n  --tint-purple: #1C1C50;\n  --tint-amber: #3A2A0C;\n  --tint-teal: #1C1C50;\n  --tint-red: #3A2208;\n  --shadow-lg: 0 18px 50px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4);\n  --shadow-md: 0 4px 14px rgba(0,0,0,0.35);\n  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);\n}\n\n* { margin: 0; padding: 0; box-sizing: border-box; }\n\nhtml, body {\n  height: 100%;\n  font-family: var(--font);\n  -webkit-font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n}\n\nbody {\n  background:\n    radial-gradient(120% 80% at 0% 0%, #ebebf8 0%, transparent 50%),\n    radial-gradient(120% 90% at 100% 0%, #fdf1d9 0%, transparent 55%),\n    linear-gradient(180deg, #ececf4 0%, #e4e4ee 100%);\n  min-height: 100vh;\n  color: var(--ink);\n}\n\n/* ---------- Page scaffold ---------- */\n.page {\n  max-width: 1500px;\n  margin: 0 auto;\n  padding: 56px 40px 96px;\n}\n.page-head { margin-bottom: 8px; }\n.page-eyebrow {\n  display: inline-flex; align-items: center; gap: 8px;\n  font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n  color: var(--accent-deep);\n  background: #fff; border: 1px solid var(--line-strong);\n  padding: 7px 13px; border-radius: 999px; box-shadow: var(--shadow-sm);\n}\n.page-title {\n  font-size: 34px; font-weight: 800; letter-spacing: -0.02em; color: #20262f;\n  margin: 18px 0 8px;\n}\n.page-sub { font-size: 16px; color: #56606e; max-width: 760px; line-height: 1.5; }\n\n.variants {\n  display: flex; flex-wrap: wrap; gap: 64px 56px;\n  margin-top: 52px; align-items: flex-start; justify-content: center;\n}\n.variant { display: flex; flex-direction: column; align-items: center; gap: 20px; }\n.variant-label {\n  display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center;\n}\n.variant-num {\n  width: 30px; height: 30px; border-radius: 999px; background: #20262f; color: #fff;\n  display: grid; place-items: center; font-weight: 800; font-size: 14px;\n}\n.variant-name { font-size: 19px; font-weight: 800; letter-spacing: -0.01em; color: #20262f; }\n.variant-desc { font-size: 13.5px; color: #687283; max-width: 420px; line-height: 1.45; }\n\n/* ============================================================\n   PHONE FRAME\n   ============================================================ */\n.phone {\n  width: 390px; height: 818px;\n  background: #0c0d10; border-radius: 54px; padding: 11px;\n  box-shadow: var(--shadow-lg), inset 0 0 0 2px #2a2c31;\n  position: relative; flex: none;\n}\n.phone-screen {\n  width: 100%; height: 100%; border-radius: 44px; overflow: hidden;\n  background: var(--canvas); position: relative; display: flex; flex-direction: column;\n}\n.dynamic-island {\n  position: absolute; top: 12px; left: 50%; transform: translateX(-50%);\n  width: 120px; height: 34px; background: #000; border-radius: 20px; z-index: 50;\n}\n\n/* ============================================================\n   ASSISTANT — shared chat shell\n   ============================================================ */\n.asst {\n  display: flex; flex-direction: column; height: 100%;\n  background: var(--canvas); position: relative; min-height: 0;\n}\n\n/* Header */\n.asst-head {\n  flex: none; padding: 0 16px;\n  background: linear-gradient(180deg, var(--peach) 0%, var(--peach-lift) 100%);\n  border-bottom: 1px solid var(--line);\n  position: relative; z-index: 20;\n}\n.asst-head.web { background: var(--surface); }\n.statusbar {\n  height: 54px; display: flex; align-items: flex-end; justify-content: space-between;\n  padding: 0 6px 4px; font-weight: 700; font-size: 15px; color: var(--ink);\n}\n.statusbar .sb-right { display: flex; align-items: center; gap: 7px; }\n.asst-bar {\n  display: flex; align-items: center; gap: 12px; padding: 10px 4px 16px;\n}\n.asst-bar .icon-btn { color: var(--ink); }\n.asst-id { display: flex; align-items: center; gap: 11px; flex: 1; min-width: 0; }\n.asst-avatar {\n  width: 42px; height: 42px; border-radius: 13px; flex: none;\n  background: linear-gradient(150deg, var(--accent), var(--accent-deep));\n  display: grid; place-items: center; color: #fff;\n  box-shadow: 0 6px 16px -4px var(--accent);\n}\n.asst-avatar.sm { width: 34px; height: 34px; border-radius: 11px; }\n.asst-meta { min-width: 0; }\n.asst-name {\n  font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: var(--ink);\n  display: flex; align-items: center; gap: 6px;\n}\n.asst-name .badge-ai {\n  font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;\n  color: var(--accent-deep); background: var(--accent-soft);\n  padding: 2px 6px; border-radius: 5px;\n}\n.asst-status {\n  font-size: 12px; color: var(--ink-2); display: flex; align-items: center; gap: 6px; margin-top: 1px;\n}\n.dot-live { width: 7px; height: 7px; border-radius: 999px; background: var(--green); box-shadow: 0 0 0 3px color-mix(in srgb, var(--green) 22%, transparent); }\n/* connectivity status — real green / red signal */\n.conn-dot { width: 8px; height: 8px; border-radius: 999px; flex: none; }\n.conn-dot.on { background: #1FAD55; box-shadow: 0 0 0 3px rgba(31,173,85,0.20); }\n.conn-dot.off { background: #E23B3B; box-shadow: 0 0 0 3px rgba(226,59,59,0.20); animation: connblink 1.1s infinite; }\n@keyframes connblink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }\n.icon-btn {\n  width: 38px; height: 38px; border-radius: 11px; flex: none;\n  display: grid; place-items: center; color: var(--ink-2);\n  background: transparent; border: none; cursor: pointer; transition: background .15s, transform .1s;\n}\n.icon-btn:hover { background: color-mix(in srgb, var(--ink) 7%, transparent); }\n.icon-btn:active { transform: scale(0.92); }\n.icon-btn.bordered { background: var(--surface); border: 1px solid var(--line-strong); box-shadow: var(--shadow-sm); }\n\n/* Scroll area */\n.asst-scroll {\n  flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden;\n  padding: 18px 16px 8px; scroll-behavior: smooth;\n}\n.asst-scroll::-webkit-scrollbar { width: 0; }\n\n/* ---------- Welcome / empty state ---------- */\n.welcome { padding: 14px 2px 6px; }\n.welcome-mark {\n  width: 58px; height: 58px; border-radius: 18px;\n  background: linear-gradient(150deg, var(--accent), var(--accent-deep));\n  display: grid; place-items: center; color: #fff; margin-bottom: 18px;\n  box-shadow: 0 10px 24px -8px var(--accent);\n}\n.welcome-h {\n  font-size: 25px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.18; color: var(--ink);\n}\n.welcome-h em { font-style: normal; color: var(--accent-deep); }\n.welcome-p { font-size: 14.5px; line-height: 1.5; color: var(--ink-2); margin-top: 10px; max-width: 40ch; }\n\n.cap-label {\n  font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;\n  color: var(--ink-3); margin: 26px 2px 12px;\n}\n.role-chip {\n  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;\n  font-size: 12px; font-weight: 700; color: var(--accent-deep);\n  background: var(--accent-soft); border: 1px solid color-mix(in srgb, var(--accent) 24%, transparent);\n  padding: 7px 13px; border-radius: 999px;\n}\n.caps { display: grid; gap: 10px; }\n\n/* compact tile grid (new-chat welcome) */\n.tile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n.tile { text-align: left; background: var(--surface); border: 1px solid var(--line); border-radius: 15px; padding: 14px; cursor: pointer; transition: transform .12s, box-shadow .15s, border-color .15s; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 4px; }\n.tile:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }\n.tile:active { transform: translateY(0) scale(0.99); }\n.tile-ico { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; margin-bottom: 6px; }\n.tile-t { font-size: 14px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }\n.tile-d { font-size: 11.5px; color: var(--ink-2); line-height: 1.4; }\n\n/* recent mini-list on welcome */\n.recent-mini { display: flex; flex-direction: column; gap: 6px; }\n.recent-row { display: flex; align-items: center; gap: 11px; text-align: left; width: 100%; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 11px 13px; cursor: pointer; transition: background .15s, border-color .15s; box-shadow: var(--shadow-sm); }\n.recent-row:hover { border-color: var(--line-strong); background: var(--surface-2); }\n.rr-ic { width: 30px; height: 30px; border-radius: 9px; flex: none; display: grid; place-items: center; background: var(--surface-2); color: var(--ink-2); }\n.recent-row:hover .rr-ic { background: var(--accent-soft); color: var(--accent-deep); }\n.rr-t { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.cap {\n  display: flex; align-items: center; gap: 13px; width: 100%; text-align: left;\n  background: var(--surface); border: 1px solid var(--line); border-radius: 15px;\n  padding: 13px 14px; cursor: pointer; transition: transform .12s, box-shadow .15s, border-color .15s;\n  box-shadow: var(--shadow-sm);\n}\n.cap:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }\n.cap:active { transform: translateY(0) scale(0.99); }\n.cap-ico { width: 40px; height: 40px; border-radius: 12px; flex: none; display: grid; place-items: center; }\n.cap-tx { min-width: 0; flex: 1; }\n.cap-t { font-size: 14.5px; font-weight: 700; color: var(--ink); }\n.cap-d { font-size: 12.5px; color: var(--ink-2); margin-top: 2px; line-height: 1.35; }\n.cap-arrow { color: var(--ink-3); flex: none; }\n\n/* ---------- Messages ---------- */\n.day-sep { display: flex; align-items: center; justify-content: center; margin: 6px 0 16px; }\n.day-sep span {\n  font-size: 11px; font-weight: 700; color: var(--ink-3);\n  background: var(--surface-2); padding: 4px 12px; border-radius: 999px;\n}\n.row { display: flex; margin-bottom: 14px; gap: 9px; }\n@media (prefers-reduced-motion: no-preference) {\n  .row { animation: rise .32s cubic-bezier(.2,.7,.3,1) both; }\n}\n.row.user { justify-content: flex-end; }\n.row.bot { justify-content: flex-start; }\n.row-avatar {\n  width: 30px; height: 30px; border-radius: 9px; flex: none; align-self: flex-end;\n  background: linear-gradient(150deg, var(--accent), var(--accent-deep));\n  display: grid; place-items: center; color: #fff;\n}\n.bubble-wrap { max-width: 80%; display: flex; flex-direction: column; gap: 7px; min-width: 0; }\n.row.user .bubble-wrap { align-items: flex-end; }\n.bubble {\n  font-size: 14.5px; line-height: 1.5; padding: 11px 14px;\n  border-radius: var(--bubble-radius); position: relative; word-wrap: break-word;\n}\n.bubble.bot {\n  background: var(--surface); color: var(--ink); border: 1px solid var(--line);\n  border-bottom-left-radius: 7px; box-shadow: var(--shadow-sm);\n}\n.bubble.user {\n  background: linear-gradient(160deg, var(--accent), var(--accent-deep)); color: #fff;\n  border-bottom-right-radius: 7px;\n}\n.bubble strong { font-weight: 700; }\n.bubble.bot strong { color: var(--ink); }\n.bubble-time { font-size: 10.5px; color: var(--ink-3); padding: 0 4px; }\n.row.user .bubble-time { color: var(--ink-3); }\n\n/* Typing */\n.typing { display: inline-flex; align-items: center; gap: 5px; padding: 14px 16px; }\n.typing i {\n  width: 7px; height: 7px; border-radius: 999px; background: var(--ink-3);\n  animation: blink 1.2s infinite both;\n}\n.typing i:nth-child(2) { animation-delay: .2s; }\n.typing i:nth-child(3) { animation-delay: .4s; }\n\n/* ============================================================\n   RICH CARDS\n   ============================================================ */\n.rcards { display: flex; flex-direction: column; gap: 10px; width: 100%; }\n.rcard {\n  background: var(--surface); border: 1px solid var(--line); border-radius: var(--card-radius);\n  overflow: hidden; box-shadow: var(--shadow-sm);\n}\n.rcard-head {\n  display: flex; align-items: center; gap: 11px; padding: 13px 14px;\n}\n.rcard-ico { width: 38px; height: 38px; border-radius: 11px; flex: none; display: grid; place-items: center; }\n.rcard-h { flex: 1; min-width: 0; }\n.rcard-kicker {\n  font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3);\n}\n.rcard-title { font-size: 15px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin-top: 1px; }\n.rcard-pill {\n  font-size: 11px; font-weight: 800; padding: 4px 9px; border-radius: 999px; flex: none;\n}\n.pill-up { color: var(--green); background: var(--tint-green); }\n.pill-down { color: var(--tile-red); background: var(--tint-red); }\n.pill-warn { color: var(--amber); background: var(--tint-amber); }\n\n.rcard-body { padding: 0 14px 14px; }\n.rcard-line { font-size: 13.5px; color: var(--ink-2); line-height: 1.5; }\n.rcard-line strong { color: var(--ink); font-weight: 700; }\n\n/* Stat */\n.stat-big { display: flex; align-items: baseline; gap: 10px; padding: 4px 14px 6px; }\n.stat-num { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; color: var(--ink); }\n.stat-delta { font-size: 13px; font-weight: 800; }\n.stat-delta.up { color: var(--green); }\n.stat-delta.down { color: var(--tile-red); }\n.stat-sub { font-size: 12.5px; color: var(--ink-2); padding: 0 14px 14px; }\n\n/* metric grid */\n.metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border-top: 1px solid var(--line); }\n.metric { background: var(--surface); padding: 12px 14px; }\n.metric-k { font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em; }\n.metric-v { font-size: 19px; font-weight: 800; color: var(--ink); margin-top: 3px; }\n.metric-v small { font-size: 12px; font-weight: 700; color: var(--ink-2); }\n\n/* progress / attendance bar */\n.prog { height: 9px; border-radius: 999px; background: var(--surface-2); overflow: hidden; margin: 8px 0 4px; }\n.prog > span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--accent), var(--accent-deep)); }\n.prog.green > span { background: linear-gradient(90deg, #3a3ad0, var(--navy)); }\n.prog.red > span { background: linear-gradient(90deg, #ffb733, var(--orange-deep)); }\n\n/* list rows (e.g. flagged students) */\n.lrow { display: flex; align-items: center; gap: 11px; padding: 11px 14px; border-top: 1px solid var(--line); }\n.lrow:first-child { border-top: none; }\n.lrow-ava { width: 32px; height: 32px; border-radius: 9px; flex: none; display: grid; place-items: center; font-weight: 800; font-size: 13px; color: #fff; }\n.lrow-tx { flex: 1; min-width: 0; }\n.lrow-name { font-size: 13.5px; font-weight: 700; color: var(--ink); }\n.lrow-sub { font-size: 11.5px; color: var(--ink-2); margin-top: 1px; }\n.lrow-val { font-size: 13.5px; font-weight: 800; flex: none; }\n\n/* card actions */\n.rcard-acts { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--line); background: var(--surface-2); }\n.act {\n  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 7px;\n  font-size: 13px; font-weight: 700; padding: 10px 12px; border-radius: 11px; cursor: pointer;\n  border: 1px solid var(--line-strong); background: var(--surface); color: var(--ink);\n  transition: transform .1s, box-shadow .15s, background .15s;\n}\n.act:hover { box-shadow: var(--shadow-sm); }\n.act:active { transform: scale(0.97); }\n.act.primary { background: linear-gradient(160deg, var(--accent), var(--accent-deep)); color: #fff; border-color: transparent; box-shadow: 0 6px 14px -6px var(--accent); }\n.act.primary:hover { filter: brightness(1.04); }\n\n/* ── kv (key / value) ── */\n.kv { padding: 4px 14px 12px; }\n.kv-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 9px 0; border-top: 1px solid var(--line); }\n.kv-row:first-child { border-top: none; }\n.kv-k { font-size: 13px; color: var(--ink-2); display: flex; align-items: center; gap: 9px; min-width: 0; }\n.kv-dot { width: 9px; height: 9px; border-radius: 3px; flex: none; }\n.kv-v { font-size: 13.5px; font-weight: 800; color: var(--ink); text-align: right; white-space: nowrap; flex: none; }\n\n/* ── compare (two periods) ── */\n.cmp { display: flex; align-items: center; gap: 8px; padding: 6px 14px 12px; }\n.cmp-side { flex: 1; text-align: center; }\n.cmp-label { font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em; }\n.cmp-val { font-size: 23px; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; margin-top: 4px; }\n.cmp-val.accent { color: var(--accent-deep); }\n.cmp-sub { font-size: 11.5px; color: var(--ink-2); margin-top: 2px; }\n.cmp-arrow { flex: none; color: var(--ink-3); }\n.cmp-growth { display: flex; align-items: center; justify-content: center; gap: 7px; margin: 0 14px 12px; padding: 9px; border-radius: 10px; font-size: 13.5px; font-weight: 800; }\n.cmp-growth.up { color: var(--green); background: var(--tint-green); }\n.cmp-growth.down { color: var(--tile-red); background: var(--tint-red); }\n\n/* ── table ── */\n.tbl { padding: 4px 14px 12px; }\n.tbl-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--line); font-size: 12.5px; }\n.tbl-row > span { flex: 1; min-width: 0; }\n.tbl-row > span:first-child { flex: 1.3; }\n.tbl-head { border-top: none; }\n.tbl-head > span { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-3); }\n.tbl-foot { border-top: 2px solid var(--line-strong); }\n.tbl-foot > span { font-weight: 800 !important; color: var(--ink) !important; }\n\n/* ── split (stacked proportion) ── */\n.split-body { padding: 8px 14px 12px; }\n.split-bar { display: flex; height: 13px; border-radius: 999px; overflow: hidden; background: var(--surface-2); gap: 2px; }\n.split-bar > span { display: block; height: 100%; }\n.split-legend { display: flex; flex-direction: column; gap: 0; margin-top: 10px; }\n.split-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 7px 0; border-top: 1px solid var(--line); }\n.split-item:first-child { border-top: none; }\n.split-key { font-size: 13px; color: var(--ink-2); display: flex; align-items: center; gap: 9px; }\n.split-val { font-size: 13.5px; font-weight: 800; color: var(--ink); white-space: nowrap; }\n.split-val small { font-weight: 700; color: var(--ink-2); }\n\n/* synthesis connectors */\n.synth { padding: 4px 14px 14px; display: flex; flex-direction: column; gap: 0; }\n.synth-node { display: flex; gap: 11px; position: relative; padding-bottom: 14px; }\n.synth-node:last-child { padding-bottom: 0; }\n.synth-rail { display: flex; flex-direction: column; align-items: center; flex: none; }\n.synth-bead { width: 26px; height: 26px; border-radius: 8px; display: grid; place-items: center; flex: none; }\n.synth-line { width: 2px; flex: 1; background: var(--line-strong); margin: 3px 0; min-height: 14px; }\n.synth-tx { padding-top: 2px; }\n.synth-k { font-size: 11px; font-weight: 800; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em; }\n.synth-v { font-size: 13.5px; color: var(--ink); line-height: 1.45; margin-top: 2px; }\n.synth-v b { font-weight: 800; }\n.synth-concl {\n  margin: 4px 14px 14px; padding: 12px 13px; border-radius: 12px;\n  background: var(--accent-soft); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);\n  font-size: 13px; line-height: 1.5; color: var(--ink);\n}\n.synth-concl b { color: var(--accent-deep); }\n\n/* ---------- Suggestion chips ---------- */\n.chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 2px 4px; }\n.chips.scroller { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; }\n.chips.scroller::-webkit-scrollbar { height: 0; }\n.chip {\n  font-size: 13px; font-weight: 700; color: var(--accent-deep);\n  background: var(--surface); border: 1px solid color-mix(in srgb, var(--accent) 32%, var(--line-strong));\n  padding: 9px 14px; border-radius: 999px; cursor: pointer; white-space: nowrap;\n  transition: transform .1s, background .15s, box-shadow .15s; box-shadow: var(--shadow-sm); flex: none;\n}\n.chip:hover { background: var(--accent-soft); }\n.chip:active { transform: scale(0.96); }\n.chip.ghost { color: var(--ink-2); border-color: var(--line-strong); }\n\n/* ---------- Composer ---------- */\n.composer {\n  flex: none; padding: 10px 14px 14px; background: linear-gradient(180deg, transparent, var(--canvas) 22%);\n  position: relative; z-index: 20;\n}\n.composer-inner {\n  display: flex; align-items: flex-end; gap: 8px;\n  background: var(--surface); border: 1px solid var(--line-strong); border-radius: 22px;\n  padding: 6px 6px 6px 8px; box-shadow: var(--shadow-md);\n}\n.composer-inner:focus-within { border-color: color-mix(in srgb, var(--accent) 55%, var(--line-strong)); }\n.composer textarea {\n  flex: 1; border: none; outline: none; resize: none; background: transparent;\n  font-family: var(--font); font-size: 14.5px; line-height: 1.4; color: var(--ink);\n  padding: 9px 4px; max-height: 96px; min-height: 20px;\n}\n.composer textarea::placeholder { color: var(--ink-3); }\n.send-btn {\n  width: 40px; height: 40px; border-radius: 50%; flex: none; border: none; cursor: pointer;\n  background: linear-gradient(160deg, var(--accent), var(--accent-deep)); color: #fff;\n  display: grid; place-items: center; transition: transform .12s, filter .15s, opacity .15s;\n  box-shadow: 0 6px 14px -5px var(--accent);\n}\n.send-btn:hover { filter: brightness(1.05); }\n.send-btn:active { transform: scale(0.9); }\n.send-btn:disabled { opacity: .4; cursor: default; box-shadow: none; }\n.mic-btn { width: 40px; height: 40px; border-radius: 50%; flex: none; border: none; cursor: pointer; background: transparent; color: var(--ink-2); display: grid; place-items: center; transition: background .15s, color .15s, transform .12s; }\n.mic-btn:hover { background: var(--accent-soft); color: var(--accent-deep); }\n.mic-btn.live { background: var(--tile-red); color: #fff; animation: pulse 1.2s infinite; }\n.composer-hint { text-align: center; font-size: 10.5px; color: var(--ink-3); margin-top: 7px; }\n.byline { font-size: 11px; color: var(--ink-3); letter-spacing: 0.01em; }\n.byline b { font-weight: 800; letter-spacing: -0.01em; }\n.byline .b-edu { color: #000098; }\n.byline .b-merge { color: #FC9C00; }\n[data-theme=\"dark\"] .byline .b-edu { color: #8A8AF0; }\n.home-ind { width: 134px; height: 5px; border-radius: 999px; background: var(--ink); opacity: .25; margin: 0 auto 6px; }\n\n/* ============================================================\n   WEB VARIANT — ERP backdrop + docked panel\n   ============================================================ */\n.erp {\n  width: 1080px; height: 760px; border-radius: 16px; overflow: hidden; flex: none;\n  background: #eef1f6; box-shadow: var(--shadow-lg); display: flex; flex-direction: column;\n  border: 1px solid #dfe3ea;\n}\n.browserbar {\n  height: 44px; flex: none; background: #e7e9ee; border-bottom: 1px solid #d8dce3;\n  display: flex; align-items: center; gap: 14px; padding: 0 16px;\n}\n.lights { display: flex; gap: 7px; }\n.lights i { width: 12px; height: 12px; border-radius: 999px; }\n.lights i:nth-child(1) { background: #ff5f57; }\n.lights i:nth-child(2) { background: #febc2e; }\n.lights i:nth-child(3) { background: #28c840; }\n.urlbar {\n  flex: 1; max-width: 460px; height: 28px; background: #fff; border-radius: 8px;\n  display: flex; align-items: center; gap: 8px; padding: 0 12px; font-size: 12.5px; color: #6b7280;\n  border: 1px solid #dde1e8;\n}\n.erp-body { flex: 1; display: flex; min-height: 0; }\n\n/* ERP sidebar (backdrop) */\n.erp-side {\n  width: 220px; flex: none; background: #20262f; color: #cdd3dc; padding: 18px 14px;\n  display: flex; flex-direction: column; gap: 4px;\n}\n.erp-brand { display: flex; align-items: center; gap: 10px; padding: 4px 8px 18px; }\n.erp-brand-mark { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(150deg, var(--orange), var(--orange-deep)); display: grid; place-items: center; color: #fff; font-weight: 800; }\n.erp-brand-tx { font-weight: 800; font-size: 15.5px; color: #fff; letter-spacing: -0.01em; }\n.erp-nav-label { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #6c7686; padding: 12px 8px 6px; }\n.erp-nav { display: flex; align-items: center; gap: 11px; padding: 9px 10px; border-radius: 9px; font-size: 13.5px; font-weight: 600; color: #aeb6c2; }\n.erp-nav.active { background: rgba(242,101,34,0.16); color: #fff; }\n.erp-nav .ni { opacity: .85; }\n\n/* ERP main */\n.erp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; background: #f4f6fa; }\n.erp-top { height: 60px; flex: none; background: #fff; border-bottom: 1px solid #e4e8ee; display: flex; align-items: center; gap: 16px; padding: 0 24px; }\n.erp-top h2 { font-size: 17px; font-weight: 800; color: #20262f; letter-spacing: -0.01em; }\n.erp-top .spacer { flex: 1; }\n.erp-search { width: 240px; height: 36px; background: #f1f3f7; border-radius: 9px; display: flex; align-items: center; gap: 9px; padding: 0 12px; font-size: 13px; color: #9aa2af; }\n.erp-content { flex: 1; padding: 22px 24px; overflow: hidden; }\n.erp-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }\n.kpi { background: #fff; border: 1px solid #e7eaf0; border-radius: 13px; padding: 15px 16px; }\n.kpi-k { font-size: 12px; font-weight: 700; color: #8a93a1; }\n.kpi-v { font-size: 24px; font-weight: 800; color: #20262f; margin-top: 6px; letter-spacing: -0.01em; }\n.kpi-d { font-size: 12px; font-weight: 700; margin-top: 4px; }\n.kpi-d.up { color: var(--green); }\n.kpi-d.down { color: var(--tile-red); }\n.erp-panel-block { background: #fff; border: 1px solid #e7eaf0; border-radius: 13px; margin-top: 16px; height: 250px; padding: 16px 18px; }\n.erp-panel-block h3 { font-size: 14px; font-weight: 800; color: #20262f; }\n.erp-bars { display: flex; align-items: flex-end; gap: 14px; height: 170px; margin-top: 18px; padding: 0 6px; }\n.erp-bars .b { flex: 1; border-radius: 8px 8px 0 0; background: linear-gradient(180deg, #cdd6e6, #aab6cd); }\n\n/* Docked copilot panel */\n.copilot-dock {\n  width: 396px; flex: none; background: var(--canvas); border-left: 1px solid var(--line-strong);\n  display: flex; flex-direction: column; min-height: 0; box-shadow: -12px 0 30px -18px rgba(20,30,50,0.25);\n}\n\n/* FAB (web, decorative) */\n.web-fab {\n  position: absolute; bottom: 20px; right: 20px; width: 56px; height: 56px; border-radius: 18px;\n  background: linear-gradient(150deg, var(--accent), var(--accent-deep)); display: grid; place-items: center;\n  color: #fff; box-shadow: 0 12px 28px -8px var(--accent);\n}\n\n/* ---------- Standalone mobile experience ---------- */\n.stage-mobile {\n  min-height: 100vh; width: 100%;\n  display: flex; align-items: center; justify-content: center; padding: 16px;\n}\n\n/* ---------- Standalone web experience (full-screen app) ---------- */\n.erp-full {\n  position: fixed; inset: 0; display: flex; overflow: hidden;\n  background: #eef1f6;\n}\n.erp-full .erp-side { width: 240px; }\n.erp-full .erp-main { flex: 1; min-width: 0; }\n.erp-full .copilot-dock { width: 408px; }\n.erp-full .erp-content { overflow-y: auto; }\n.erp-full .erp-content::-webkit-scrollbar { width: 0; }\n\n@media (max-width: 940px) {\n  .erp-full .erp-side { display: none; }\n  .erp-full .copilot-dock { width: 360px; }\n}\n@media (max-width: 720px) {\n  .erp-full .erp-main { display: none; }\n  .erp-full .copilot-dock { width: 100%; border-left: none; }\n}\n\n/* ============================================================\n   WEB WORKSPACE (full-screen Iris)\n   ============================================================ */\n.ws { position: fixed; inset: 0; display: flex; background: var(--canvas); }\n/* Embedded workspace (showroom browser card) */\n.ws-embed { flex: 1; min-height: 0; display: flex; background: var(--canvas); }\n.ws-embed .ws-side { padding-bottom: 12px; }\n.ws-embed .ws-asst .asst-scroll { padding: 22px 24px 8px; }\n.ws-embed .ws-asst .composer { padding: 12px 24px 20px; }\n.ws-side {\n  width: 290px; flex: 0 0 290px; background: var(--surface-2); border-right: 1px solid var(--line);\n  display: flex; flex-direction: column; padding: 16px 12px 12px;\n}\n.ws-brand { display: flex; align-items: center; gap: 11px; padding: 4px 8px 16px; }\n.ws-brand .asst-avatar { width: 40px; height: 40px; border-radius: 12px; }\n.ws-brand-name { font-weight: 800; font-size: 16.5px; color: var(--ink); display: flex; align-items: center; gap: 7px; letter-spacing: -0.01em; }\n.brand-logo { display: block; height: 15px; width: auto; margin-top: 5px; }\n.brand-logo.foot { height: 20px; margin: 0; }\n[data-theme=\"dark\"] .brand-logo { filter: brightness(1.7) saturate(1.1); }\n.ws-brand-sub { font-size: 11.5px; color: var(--ink-2); margin-top: 1px; }\n.ws-newchat {\n  display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; white-space: nowrap;\n  padding: 11px; border-radius: 12px; font-family: var(--font); font-size: 14px; font-weight: 700; cursor: pointer;\n  border: 1px solid color-mix(in srgb, var(--accent) 38%, var(--line-strong));\n  background: var(--surface); color: var(--accent-deep); box-shadow: var(--shadow-sm);\n  transition: transform .1s, background .15s;\n}\n.ws-newchat:hover { background: var(--accent-soft); }\n.ws-newchat:active { transform: scale(0.98); }\n.ws-sec { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); padding: 18px 8px 8px; }\n.ws-list { display: flex; flex-direction: column; gap: 2px; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; }\n.ws-list::-webkit-scrollbar { width: 0; height: 0; }\n.ws-item {\n  display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; cursor: pointer;\n  color: var(--ink-2); font-size: 13.5px; font-weight: 600; transition: background .15s; border: none; background: transparent; text-align: left;\n}\n.ws-item:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }\n.ws-item.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-sm); }\n.ws-item .it-ic { flex: none; color: var(--ink-3); display: grid; place-items: center; }\n.ws-item.active .it-ic { color: var(--accent-deep); }\n.ws-item .it-t { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.ws-badge { font-size: 10.5px; font-weight: 800; color: var(--ink-2); background: var(--surface); border: 1px solid var(--line-strong); padding: 1px 7px; border-radius: 999px; }\n.ws-spacer { flex: 1; min-height: 12px; }\n.ws-nav { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }\n.ws-usage { background: var(--surface); border: 1px solid var(--line); border-radius: 13px; padding: 12px 13px; margin: 6px 4px 8px; }\n.ws-usage-top { display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: var(--ink); white-space: nowrap; }\n.ws-usage-top .u-month { margin-left: auto; font-size: 11px; font-weight: 700; color: var(--ink-3); }\n.ws-usage .prog { margin: 10px 0 7px; }\n.ws-usage-meta { font-size: 11.5px; color: var(--ink-2); }\n.ws-usage-meta b { color: var(--ink); }\n.ws-account { display: flex; align-items: center; gap: 10px; padding: 11px 8px 4px; border-top: 1px solid var(--line); margin-top: 8px; }\n.ws-account .lrow-ava { width: 34px; height: 34px; border-radius: 10px; }\n.ws-account-tx { flex: 1; min-width: 0; }\n.ws-account-name { font-size: 13.5px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.ws-account-role { font-size: 11.5px; color: var(--ink-2); }\n\n/* fold toggle + collapsed rail */\n.ws-side { overflow: hidden; }\n.ws-fold { margin-left: auto; flex: none; width: 30px; height: 30px; border-radius: 9px; border: none; background: transparent; color: var(--ink-3); display: grid; place-items: center; cursor: pointer; transition: background .15s; }\n.ws-fold:hover { background: color-mix(in srgb, var(--ink) 8%, transparent); }\n.ws-usage-mini { display: none; }\n.nc-t { white-space: nowrap; }\n\n.ws-side.folded { width: 76px; flex-basis: 76px; padding: 16px 12px 12px; }\n.ws-side.folded .ws-brand-tx,\n.ws-side.folded .ws-fold,\n.ws-side.folded .nc-t,\n.ws-side.folded .ws-sec,\n.ws-side.folded .it-t,\n.ws-side.folded .ws-badge,\n.ws-side.folded .ws-usage,\n.ws-side.folded .ws-account-tx,\n.ws-side.folded .ws-account > svg { display: none; }\n.ws-side.folded .ws-brand { justify-content: center; padding: 4px 0 16px; }\n.ws-side.folded .ws-newchat { padding: 11px 0; }\n.ws-side.folded .ws-item { justify-content: center; padding: 10px 0; }\n.ws-side.folded .ws-usage-mini { display: grid; place-items: center; height: 42px; margin: 4px 0 8px; border-radius: 11px; background: var(--surface); border: 1px solid var(--line); }\n.ws-side.folded .ws-account { justify-content: center; padding: 11px 0 4px; }\n\n.ws-main { flex: 1; min-width: 0; display: flex; flex-direction: column; background: var(--canvas); }\n.ws-top { height: 62px; flex: none; display: flex; align-items: center; gap: 12px; padding: 0 22px; border-bottom: 1px solid var(--line); background: var(--surface); }\n.ws-top-title { font-size: 15.5px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }\n.ws-top .spacer { flex: 1; }\n.ws-chip { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: var(--green); background: var(--tint-green); padding: 6px 12px; border-radius: 999px; }\n.ws-asst { flex: 1; min-height: 0; }\n.ws-asst .asst-scroll { padding: 26px 26px 8px; }\n.conv-col { width: 100%; }\n.ws-asst .conv-col { max-width: 770px; margin: 0 auto; }\n.ws-asst .composer { padding: 12px 26px 22px; background: linear-gradient(180deg, transparent, var(--canvas) 26%); }\n.ws-asst .composer-inner { max-width: 770px; margin: 0 auto; }\n.ws-asst .caps { grid-template-columns: 1fr 1fr; }\n.ws-asst .tile-grid { grid-template-columns: repeat(3, 1fr); }\n.ws-asst .welcome { padding-top: 22px; }\n.ws-asst .welcome-h, .ws-asst .welcome-p { max-width: none; }\n\n@media (max-width: 860px) {\n  .ws-side { display: none; }\n  .ws-asst .caps { grid-template-columns: 1fr; }\n  .ws-asst .tile-grid { grid-template-columns: 1fr 1fr; }\n}\n\n/* ============================================================\n   MOBILE SETTINGS SHEET\n   ============================================================ */\n.sheet-scrim { position: absolute; inset: 0; background: rgba(18,18,22,0.4); z-index: 60; }\n.sheet {\n  position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 90%;\n  background: var(--surface-2); border-radius: 26px 26px 0 0; display: flex; flex-direction: column;\n  box-shadow: 0 -12px 44px rgba(0,0,0,0.22);\n}\n.sheet-grab { width: 40px; height: 5px; border-radius: 999px; background: var(--line-strong); margin: 10px auto 2px; }\n.sheet-head { display: flex; align-items: center; justify-content: space-between; padding: 4px 14px 10px 20px; }\n.sheet-title { font-size: 20px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }\n.sheet-body { overflow-y: auto; padding: 4px 16px 22px; }\n.sheet-body::-webkit-scrollbar { width: 0; }\n.sheet-label { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); padding: 18px 6px 8px; }\n.sheet-group { background: var(--surface); border: 1px solid var(--line); border-radius: 15px; overflow: hidden; box-shadow: var(--shadow-sm); }\n.sheet-foot { display: flex; flex-direction: column; align-items: center; gap: 7px; font-size: 11.5px; color: var(--ink-3); padding: 22px 0 6px; }\n.srow { display: flex; align-items: center; gap: 13px; padding: 13px 14px; border-top: 1px solid var(--line); cursor: pointer; background: var(--surface); transition: background .15s; }\n.srow:first-child { border-top: none; }\n.srow:hover { background: var(--surface-2); }\n.srow-ic { width: 34px; height: 34px; border-radius: 10px; flex: none; display: grid; place-items: center; }\n.srow-tx { flex: 1; min-width: 0; }\n.srow-t { font-size: 14.5px; font-weight: 700; color: var(--ink); }\n.srow-d { font-size: 12px; color: var(--ink-2); margin-top: 2px; line-height: 1.35; }\n.srow-val { font-size: 12.5px; font-weight: 700; color: var(--ink-3); display: flex; align-items: center; gap: 5px; flex: none; }\n.srow-on { display: inline-flex; align-items: center; gap: 6px; color: var(--green); font-weight: 700; }\n\n/* Usage card (sheet) */\n.usage-card { background: linear-gradient(150deg, var(--accent-soft), var(--surface)); border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--line)); border-radius: 16px; padding: 15px 16px; margin: 6px 2px 4px; }\n.usage-card .ws-usage-top { font-size: 13.5px; }\n.usage-card .prog { margin: 12px 0 8px; height: 10px; }\n.usage-card .ws-usage-meta { font-size: 12.5px; }\n\n/* Toggle */\n.tog { width: 46px; height: 27px; border-radius: 999px; background: var(--line-strong); position: relative; cursor: pointer; transition: background .2s; flex: none; border: none; padding: 0; }\n.tog[data-on=\"1\"] { background: var(--accent); }\n.tog i { position: absolute; top: 3px; left: 3px; width: 21px; height: 21px; border-radius: 999px; background: #fff; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,0.28); }\n.tog[data-on=\"1\"] i { transform: translateX(19px); }\n\n@keyframes fade { from { opacity: 0; } to { opacity: 1; } }\n@keyframes sheetUp { from { transform: translateY(34px); } to { transform: translateY(0); } }\n\n/* web: render the settings sheet as a right-side drawer, not a bottom sheet */\n.ws .sheet, .erp .sheet { left: auto; right: 0; top: 0; bottom: 0; width: 400px; max-width: 92%; max-height: 100%; border-radius: 0; box-shadow: -16px 0 44px rgba(0,0,0,0.18); }\n.ws .sheet-grab, .erp .sheet-grab { display: none; }\n.ws .sheet-head, .erp .sheet-head { padding-top: 16px; }\n\n/* ============================================================\n   Animations\n   ============================================================ */\n@keyframes rise { from { transform: translateY(9px); } to { transform: translateY(0); } }\n@keyframes blink { 0%, 60%, 100% { opacity: .25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }\n@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(224,67,58,0.5); } 50% { box-shadow: 0 0 0 8px rgba(224,67,58,0); } }\n\n@media (max-width: 1180px) {\n  .erp { width: 100%; max-width: 820px; height: 720px; }\n}\n\n/* ============================================================\n   NAV VIEWS — Projects, Artifacts, Dashboards (Claude-app)\n   ============================================================ */\n.ws-nav.top { margin: 10px 0 2px; }\n.ws-body { flex: 1; display: flex; min-height: 0; }\n.ws-canvas { flex: 1; min-width: 0; display: flex; flex-direction: column; min-height: 0; }\n.ws-scrollview { flex: 1; min-height: 0; overflow-y: auto; }\n.ws-scrollview::-webkit-scrollbar { width: 0; }\n.m-scroll { flex: 1; min-height: 0; overflow-y: auto; }\n.m-scroll::-webkit-scrollbar { width: 0; }\n\n/* library views */\n.lib { max-width: 880px; margin: 0 auto; padding: 26px 26px 40px; }\n.sec-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 20px; }\n.sec-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--ink); }\n.sec-title.sm { font-size: 14px; font-weight: 800; margin: 22px 2px 12px; }\n.sec-sub { font-size: 13.5px; color: var(--ink-2); margin-top: 4px; }\n.sec-action { display: inline-flex; align-items: center; gap: 7px; flex: none; font-family: var(--font); font-size: 13.5px; font-weight: 700; cursor: pointer; padding: 9px 14px; border-radius: 11px; border: none; background: var(--accent); color: #fff; box-shadow: 0 6px 14px -6px var(--accent); transition: transform .1s, filter .15s; }\n.sec-action:hover { filter: brightness(1.06); }\n.sec-action:active { transform: scale(0.97); }\n.back-link { display: inline-flex; align-items: center; gap: 7px; background: none; border: none; cursor: pointer; font-family: var(--font); font-size: 13px; font-weight: 700; color: var(--ink-2); padding: 0; margin-bottom: 16px; }\n.back-link:hover { color: var(--accent-deep); }\n\n/* projects grid */\n.proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }\n.proj-card { text-align: left; background: var(--surface); border: 1px solid var(--line); border-radius: var(--card-radius); padding: 16px; cursor: pointer; transition: transform .12s, box-shadow .15s, border-color .15s; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 8px; }\n.proj-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }\n.proj-top { display: flex; align-items: center; justify-content: space-between; }\n.proj-ic { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; }\n.proj-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 8px; border-radius: 999px; }\n.proj-tag.module { color: var(--accent-deep); background: var(--accent-soft); }\n.proj-tag.custom { color: var(--orange-deep); background: var(--tint-orange); }\n.proj-name { font-size: 16px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }\n.proj-desc { font-size: 12.5px; color: var(--ink-2); line-height: 1.45; flex: 1; }\n.proj-foot { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: var(--ink-3); margin-top: 2px; }\n\n/* project hero */\n.proj-hero { display: flex; align-items: center; gap: 15px; padding: 4px 0 18px; }\n.proj-hero-ic { width: 58px; height: 58px; border-radius: 17px; display: grid; place-items: center; flex: none; }\n.proj-hero-name { font-size: 21px; font-weight: 800; letter-spacing: -0.02em; color: var(--ink); display: flex; align-items: center; gap: 10px; }\n.proj-hero-desc { font-size: 13.5px; color: var(--ink-2); margin-top: 4px; max-width: 56ch; line-height: 1.45; }\n.proj-newchat { display: flex; align-items: center; gap: 9px; width: 100%; justify-content: center; padding: 13px; border-radius: 13px; font-family: var(--font); font-size: 14.5px; font-weight: 700; cursor: pointer; border: 1px dashed color-mix(in srgb, var(--accent) 45%, var(--line-strong)); background: var(--accent-soft); color: var(--accent-deep); transition: transform .1s, filter .15s; }\n.proj-newchat:hover { filter: brightness(0.99); }\n.proj-newchat:active { transform: scale(0.99); }\n\n/* chat list (in project / recents) */\n.chat-list { display: flex; flex-direction: column; gap: 8px; }\n.chat-item { display: flex; align-items: center; gap: 12px; text-align: left; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 13px 14px; cursor: pointer; transition: transform .1s, box-shadow .15s, border-color .15s; box-shadow: var(--shadow-sm); }\n.chat-item:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }\n.ci-ic { width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center; flex: none; background: var(--surface-2); color: var(--ink-2); }\n.ci-tx { flex: 1; min-width: 0; }\n.ci-t { font-size: 14px; font-weight: 700; color: var(--ink); }\n.ci-w { font-size: 12px; color: var(--ink-3); margin-top: 2px; }\n\n/* artifacts grid */\n.art-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }\n.art-card { text-align: left; background: var(--surface); border: 1px solid var(--line); border-radius: var(--card-radius); padding: 16px; cursor: pointer; transition: transform .12s, box-shadow .15s, border-color .15s; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 8px; }\n.art-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }\n.art-ic { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; }\n.art-name { font-size: 15.5px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }\n.art-desc { font-size: 12.5px; color: var(--ink-2); line-height: 1.45; flex: 1; }\n.art-foot { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 700; color: var(--ink-2); margin-top: 2px; }\n\n/* artifact CTA inside chat */\n.art-cta { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; margin: 4px 0 12px; padding: 12px 14px; border-radius: 14px; cursor: pointer; background: var(--surface); border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--line-strong)); box-shadow: var(--shadow-sm); transition: transform .1s, box-shadow .15s; }\n.art-cta:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }\n.art-cta-ic { width: 38px; height: 38px; border-radius: 11px; flex: none; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-deep); }\n.art-cta-tx { flex: 1; min-width: 0; display: flex; flex-direction: column; }\n.art-cta-tx b { font-size: 13.5px; font-weight: 700; color: var(--ink); }\n.art-cta-tx small { font-size: 12px; color: var(--ink-2); margin-top: 1px; }\n\n/* artifact side panel (web) */\n.art-panel { width: 460px; flex: none; border-left: 1px solid var(--line-strong); background: var(--surface-2); display: flex; flex-direction: column; min-height: 0; box-shadow: -12px 0 30px -22px rgba(20,30,50,0.3); }\n.art-panel-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--line); background: var(--surface); }\n.art-panel-id { display: flex; align-items: center; gap: 11px; min-width: 0; }\n.art-panel-ic { width: 36px; height: 36px; border-radius: 11px; flex: none; display: grid; place-items: center; }\n.art-panel-title { font-size: 14.5px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.art-panel-id > div { min-width: 0; }\n.art-panel-sub { font-size: 11.5px; color: var(--ink-2); margin-top: 1px; }\n.art-panel-body { flex: 1; min-height: 0; overflow-y: auto; }\n.art-panel-body::-webkit-scrollbar { width: 0; }\n\n@media (max-width: 1080px) {\n  .art-panel { width: 380px; }\n}\n\n/* ── dashboard (refreshable) ── */\n.dash { padding: 14px; }\n.dash-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }\n.dash-bar-tx { display: flex; flex-direction: column; gap: 3px; }\n.dash-live { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: var(--ink); white-space: nowrap; }\n.dash-upd { font-size: 11.5px; color: var(--ink-3); white-space: nowrap; }\n.dash-refresh { display: inline-flex; align-items: center; gap: 7px; flex: none; font-family: var(--font); font-size: 12.5px; font-weight: 700; cursor: pointer; padding: 8px 13px; border-radius: 10px; border: 1px solid var(--line-strong); background: var(--surface); color: var(--accent-deep); transition: background .15s, transform .1s; }\n.dash-refresh:hover { background: var(--accent-soft); }\n.dash-refresh:active { transform: scale(0.96); }\n.dash-refresh.busy { opacity: 0.7; pointer-events: none; }\n.dash-refresh.busy svg { animation: spin 0.85s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }\n\n.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n.dash-grid.compact { grid-template-columns: 1fr 1fr; }\n.dash-kpi { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 13px 14px; box-shadow: var(--shadow-sm); }\n.dk-k { font-size: 11.5px; font-weight: 700; color: var(--ink-3); }\n.dk-v { font-size: 22px; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; margin-top: 5px; }\n.dk-d { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 800; margin-top: 5px; }\n.dk-d.up { color: var(--navy); }\n.dk-d.down { color: var(--orange-deep); }\n.dash-wide { grid-column: 1 / -1; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 13px 14px; box-shadow: var(--shadow-sm); }\n.dw-label { font-size: 12.5px; font-weight: 700; color: var(--ink-2); margin-bottom: 12px; }\n.dw-bars { display: flex; align-items: flex-end; gap: 6px; height: 110px; }\n.dw-bars > span { flex: 1; border-radius: 5px 5px 0 0; background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 55%, #fff), var(--accent)); transition: height .5s cubic-bezier(.3,.7,.3,1); min-height: 4px; }\n.dw-rows { display: flex; flex-direction: column; }\n.dw-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-top: 1px solid var(--line); font-size: 13px; color: var(--ink-2); }\n.dw-row:first-child { border-top: none; }\n.dw-row b { color: var(--ink); font-weight: 800; }\n\n/* ── new-project modal ── */\n.modal-scrim { position: absolute; inset: 0; background: rgba(18,18,30,0.45); z-index: 80; display: grid; place-items: center; padding: 24px; }\n.modal { width: 100%; max-width: 560px; background: var(--surface); border-radius: 20px; box-shadow: var(--shadow-lg); overflow: hidden; }\n.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 18px 4px; }\n.modal-title { font-size: 19px; font-weight: 800; letter-spacing: -0.01em; color: var(--ink); }\n.modal-sub { font-size: 13px; color: var(--ink-2); padding: 0 18px 16px; line-height: 1.45; }\n.tpl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 18px 20px; }\n.tpl-card { display: flex; align-items: center; gap: 12px; text-align: left; background: var(--surface); border: 1px solid var(--line); border-radius: 13px; padding: 13px; cursor: pointer; transition: transform .1s, box-shadow .15s, border-color .15s; }\n.tpl-card:hover { box-shadow: var(--shadow-md); border-color: var(--line-strong); transform: translateY(-1px); }\n.tpl-ic { width: 40px; height: 40px; border-radius: 11px; flex: none; display: grid; place-items: center; }\n.tpl-name { font-size: 13.5px; font-weight: 800; color: var(--ink); }\n.tpl-desc { font-size: 11.5px; color: var(--ink-2); margin-top: 1px; }\n\n/* ── mobile drawer ── */\n.drawer-scrim { position: absolute; inset: 0; background: rgba(18,18,30,0.42); z-index: 70; animation: fade .18s both; }\n.drawer { position: absolute; top: 0; bottom: 0; left: 0; width: 86%; max-width: 320px; z-index: 71; background: var(--surface-2); display: flex; flex-direction: column; padding: 16px 12px 14px; box-shadow: 12px 0 40px rgba(0,0,0,0.2); }\n@media (prefers-reduced-motion: no-preference) { .drawer { animation: drawerIn .26s cubic-bezier(.2,.8,.2,1) both; } }\n@keyframes drawerIn { from { transform: translateX(-18px); opacity: 0.4; } to { transform: translateX(0); opacity: 1; } }\n.drawer-brand { display: flex; align-items: center; gap: 11px; padding: 8px 8px 16px; }\n.drawer .ws-newchat { margin-bottom: 4px; }\n.drawer .ws-list { max-height: 200px; }\n\n/* ── mobile artifact full view ── */\n.m-artifact { position: absolute; inset: 0; z-index: 65; background: var(--canvas); display: flex; flex-direction: column; }\n.m-artifact-body { flex: 1; min-height: 0; overflow-y: auto; }\n.m-artifact-body::-webkit-scrollbar { width: 0; }\n.m-artifact .dash-grid { grid-template-columns: 1fr 1fr; }\n\n.asst-avatar.sm { width: 34px; height: 34px; border-radius: 11px; }\n" }} />
      <WebStage />
    </div>
  );
}
