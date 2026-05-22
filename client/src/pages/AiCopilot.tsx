import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Sparkles, BookOpen, Brain, Users, MessageSquare,
  ShieldCheck, TrendingUp, GraduationCap, Search, ChevronRight,
  Plus, Clock, X, RotateCcw, Zap, Bot, User as UserIcon
} from 'lucide-react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface QA {
  id: string;
  module: string;
  question: string;
  answer: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  time: string;
}

// ─────────────────────────────────────────────
// MODULE DEFINITIONS
// ─────────────────────────────────────────────
const MODULES = [
  { id: 'all', label: 'All Modules', icon: Sparkles, color: '#000099' },
  { id: 'academic', label: 'Academic co-pilot', icon: BookOpen, color: '#6366F1' },
  { id: 'paper', label: 'Paper Evaluation', icon: Brain, color: '#7C3AED' },
  { id: 'workforce', label: 'Workforce Intelligence', icon: Users, color: '#0891B2' },
  { id: 'grievance', label: 'Grievance Intelligence', icon: MessageSquare, color: '#DC2626' },
  { id: 'compliance', label: 'Compliance & NAAC', icon: ShieldCheck, color: '#059669' },
  { id: 'finance', label: 'Finance Intelligence', icon: TrendingUp, color: '#D97706' },
  { id: 'mentor', label: 'Mentor Management', icon: GraduationCap, color: '#7C3AED' },
];

// ─────────────────────────────────────────────
// 100+ QUESTION-ANSWER DATABASE
// ─────────────────────────────────────────────
const QA_DATABASE: QA[] = [
  // ── ACADEMIC CO-PILOT (18 Qs) ───────────────────────────────────────
  { id: 'ac1', module: 'academic', question: 'How does Academic co-pilot detect timetable conflicts?', answer: 'Academic co-pilot runs a constraint-satisfaction engine over each faculty\'s assigned periods. It flags conflicts when: (1) a faculty member is scheduled in two rooms simultaneously, (2) a classroom is double-booked, or (3) a course violates AICTE-mandated minimum contact hours. All conflicts are surfaced on the Conflict Alerts panel with one-click resolution suggestions.' },
  { id: 'ac2', module: 'academic', question: 'What is the AICTE compliance scorecard?', answer: 'The AICTE compliance scorecard auto-evaluates your institution against 12 regulatory parameters — faculty-student ratio, lab hours per credit, theory-to-practical split, guest lecture requirements, and more. It produces a weighted score from 0–100 with colour-coded indicators (Green ≥85, Amber 70–84, Red <70) and generates a downloadable evidence bundle for inspections.' },
  { id: 'ac3', module: 'academic', question: 'Can the system auto-generate timetables?', answer: 'Yes. The AI timetable generator uses a backtracking algorithm that respects faculty preferences, room capacities, and regulatory ratios. It produces conflict-free draft schedules in under 60 seconds for a 500-student cohort. Coordinators can then drag-and-drop to fine-tune, and the system validates each change in real-time.' },
  { id: 'ac4', module: 'academic', question: 'How does workload distribution work?', answer: 'Workload is calculated per faculty based on teaching hours (theory + lab), exam invigilation slots, and administrative duties. The system enforces the AICTE cap of 18 contact hours per week for Assistant Professors and flags any faculty exceeding or falling below the threshold. An animated histogram shows the distribution across the department.' },
  { id: 'ac5', module: 'academic', question: 'What reports can I generate from Academic co-pilot?', answer: 'You can generate: (1) Department Timetable PDF, (2) Faculty Load Report, (3) Room Utilisation Heatmap, (4) AICTE Compliance Scorecard, (5) Substitution Logs, (6) Period Coverage Report. All reports are exportable in PDF and Excel formats.' },
  { id: 'ac6', module: 'academic', question: 'How does the system handle substitution management?', answer: 'When a faculty marks leave, the co-pilot automatically identifies eligible substitute faculty (same subject expertise, no clash in that period) and dispatches an SMS/email notification to the HOD and the substitute. The substitution is auto-logged for audit purposes.' },
  { id: 'ac7', module: 'academic', question: 'Can I import existing timetables into the system?', answer: 'Yes. Timetables can be imported via Excel template (downloadable from the system). The importer validates all entries against the constraint engine and flags any violations before accepting the file. You can also use the AI-assisted migration wizard which maps column headers automatically.' },
  { id: 'ac8', module: 'academic', question: 'How are exam schedules managed?', answer: 'The Exam Scheduler module (part of Academic co-pilot) creates conflict-free exam timetables ensuring no student sits two exams simultaneously. It respects back-to-back exam limits, assigns invigilation based on faculty availability, and produces hall-ticket–ready seating arrangements.' },
  { id: 'ac9', module: 'academic', question: 'What is the curriculum mapping feature?', answer: 'Curriculum mapping links each lesson plan topic to the corresponding Course Outcome (CO), Program Outcome (PO), and Bloom\'s Taxonomy level. The system generates CO-PO attainment matrices automatically from your lesson plans and assessment data, ready for NBA accreditation submissions.' },
  { id: 'ac10', module: 'academic', question: 'How does the system track syllabus completion?', answer: 'Faculty log completed units through the Lesson Plan module. Academic co-pilot aggregates this data into a department-wide syllabus coverage dashboard, showing % completion per subject with predicted end-of-semester shortfall alerts if the pace is below target.' },
  { id: 'ac11', module: 'academic', question: 'How does the Academic co-pilot handle elective management?', answer: 'Elective allocation is handled through a preference-matching engine. Students rank their top three elective choices; the system assigns electives based on preference rank, seat capacity, and eligibility (CGPA thresholds). Conflict resolution is automated using a lottery tie-breaker with full audit trail.' },
  { id: 'ac12', module: 'academic', question: 'Can the co-pilot predict subject-wise pass rates?', answer: 'Yes. Using historical marks data (last 3 batches), the AI predicts end-semester pass rates per subject. Subjects with predicted pass rate below 60% trigger an early-warning alert, prompting the HOD to schedule remedial sessions. Predictions update weekly as internal assessment data flows in.' },
  { id: 'ac13', module: 'academic', question: 'What is the guest lecture management workflow?', answer: 'Guest lecture requirements mandated by AICTE (minimum 4 per semester per department) are tracked automatically. Faculty submit proposals through the portal; HOD approves. After the lecture, a feedback form is auto-distributed to students. Attendance and feedback data contribute to the AICTE compliance score.' },
  { id: 'ac14', module: 'academic', question: 'How are faculty preferences incorporated into scheduling?', answer: 'Faculty can submit preferred time slots, off-days, and subject preferences at the start of each semester via a self-service form. The timetable engine uses these as soft constraints — it tries to honour preferences while maintaining regulatory compliance. Unmet preferences are flagged for HOD review.' },
  { id: 'ac15', module: 'academic', question: 'Does the system support multiple academic calendars?', answer: 'Yes. The system supports separate calendars for UG, PG, and PhD programmes, each with their own working days, holidays, exam windows, and semester boundaries. Cross-programme scheduling conflicts (shared faculty/rooms) are detected automatically.' },
  { id: 'ac16', module: 'academic', question: 'How does AI detect batch-wise learning gaps?', answer: 'By analysing internal assessment scores across batches for the same subject, the AI identifies whether a specific batch is underperforming relative to historical norms. It isolates confounders (different faculty, fewer lab sessions) and recommends targeted interventions such as additional revision hours or peer mentoring.' },
  { id: 'ac17', module: 'academic', question: 'Can I view room utilisation analytics?', answer: 'Yes. The Room Utilisation Heatmap shows hour-by-hour room occupancy across the week. It highlights underutilised rooms (below 40% occupancy) and over-booked rooms. You can filter by room type (lecture hall, seminar room, lab) and get optimisation recommendations to reduce idle space.' },
  { id: 'ac18', module: 'academic', question: 'How does the system manage interdisciplinary courses?', answer: 'Interdisciplinary courses that span multiple departments are handled through a shared timetable pool. The AI ensures that students registered from different departments have no clashes with their primary course timetables. Faculty load is split proportionally between departments.' },

  // ── ONLINE PAPER EVALUATION (16 Qs) ─────────────────────────────────
  { id: 'pe1', module: 'paper', question: 'How does the AI evaluate handwritten answer scripts?', answer: 'The system uses a multi-stage pipeline: (1) OCR engine (fine-tuned on Indian handwriting) converts scanned scripts to text, (2) a semantic similarity model compares student answers to the model answer key using cosine similarity on sentence embeddings, (3) a marks recommendation is generated with confidence score. Evaluators review and confirm each mark — the AI never overrides the examiner.' },
  { id: 'pe2', module: 'paper', question: 'What is the OCR accuracy rate?', answer: 'The OCR engine achieves approximately 92% accuracy on standard handwritten scripts in English. Accuracy varies with handwriting legibility. For low-confidence extractions (below 75% confidence), the system flags the page for manual re-evaluation, ensuring no student is incorrectly assessed due to OCR errors.' },
  { id: 'pe3', module: 'paper', question: 'How are custom grading rubrics created?', answer: 'Evaluators create rubrics by defining: (1) expected answer components (keywords, formulae, diagrams), (2) weightage per component, and (3) partial marking rules. The AI then checks each student answer against these rubric dimensions and assigns partial marks accordingly. Rubrics are reusable across question papers of the same type.' },
  { id: 'pe4', module: 'paper', question: 'Can the system detect plagiarism between student scripts?', answer: 'Yes. The plagiarism detection engine cross-compares all scripts for the same question using Jaccard similarity and semantic clustering. Suspiciously similar answers (above 85% similarity) are flagged for examiner review with a side-by-side comparison view. Results feed into the academic integrity report.' },
  { id: 'pe5', module: 'paper', question: 'How is marks moderation handled?', answer: 'After initial AI-assisted evaluation, a moderation workflow is triggered: (1) a second evaluator reviews flagged scripts, (2) statistical outlier detection identifies scripts where marks deviate significantly from the mean, (3) the chief examiner approves the final moderated marks. All moderation actions are logged with timestamps for auditability.' },
  { id: 'pe6', module: 'paper', question: 'What file formats are supported for script upload?', answer: 'The system supports PDF, JPG, and PNG uploads. For multi-page scripts, PDF is recommended. The maximum file size is 50MB per script. Bulk upload via ZIP files (up to 200 scripts per batch) is supported, with a progress tracker and error report for failed uploads.' },
  { id: 'pe7', module: 'paper', question: 'How does the system handle diagram-based questions?', answer: 'Diagram recognition is handled by a computer vision model trained on engineering and science diagrams. It detects key structural elements (labelled components, arrows, graphs) and checks them against the model answer. For complex diagrams, the system highlights the correct elements the student has drawn and flags missing ones.' },
  { id: 'pe8', module: 'paper', question: 'Can multiple evaluators work on the same paper simultaneously?', answer: 'Yes. The system supports concurrent evaluation through a question-wise locking mechanism — each evaluator is assigned specific questions (e.g., Evaluator A does Q1 and Q2 for all students; Evaluator B does Q3 and Q4). This prevents double-evaluation and ensures consistent marking.' },
  { id: 'pe9', module: 'paper', question: 'How are result compilations generated?', answer: 'Once all scripts are evaluated and moderated, the system auto-compiles subject-wise results: (1) marks tabulation per student, (2) grade calculation using the university\'s grading scheme, (3) pass/fail determination, (4) result sheets exportable in Excel and PDF for university submission.' },
  { id: 'pe10', module: 'paper', question: 'What is the average time saved by using AI evaluation?', answer: 'Based on pilot data, AI-assisted evaluation reduces per-script evaluation time by 45–60%. For a batch of 200 students (10 questions each), evaluators report reducing time from ~40 hours to ~18 hours. The largest savings come from automatic OCR, pre-filled mark suggestions, and digital annotation tools.' },
  { id: 'pe11', module: 'paper', question: 'Does the system support regional language scripts?', answer: 'Currently, the OCR engine supports English and Kannada scripts (with Hindi support in beta). Regional language rubrics can be configured in Unicode. The AI semantic model for non-English answers uses multilingual embeddings. Full coverage for Tamil, Telugu, and Marathi is on the product roadmap for Q3 2026.' },
  { id: 'pe12', module: 'paper', question: 'How are evaluator performance metrics tracked?', answer: 'The system tracks per-evaluator metrics: average time per script, marks deviation from mean, number of scripts reviewed vs. assigned, and moderation override rate. This data is visible to the Chief Examiner and helps identify evaluators who may need calibration training.' },
  { id: 'pe13', module: 'paper', question: 'Can students view their evaluated scripts?', answer: 'Yes (if enabled by the institution). Students can log into the student portal to view their evaluated scripts with AI annotations and marks. Revaluation requests can be submitted through the portal, triggering a workflow to the chief examiner. This eliminates physical script distribution entirely.' },
  { id: 'pe14', module: 'paper', question: 'How is data security handled for evaluated scripts?', answer: 'All scripts are stored in encrypted object storage (AES-256). Access is role-based: evaluators see only their assigned scripts, HODs see department-level results, and students see only their own scripts after release. All access events are logged in an immutable audit trail compliant with UGC data protection guidelines.' },
  { id: 'pe15', module: 'paper', question: 'What analytics are available post-evaluation?', answer: 'The post-evaluation analytics dashboard shows: (1) question-wise difficulty analysis (average marks per question), (2) bloom\'s taxonomy level attainment rates, (3) CO-wise student performance, (4) batch comparison charts, and (5) subject-wise pass/fail breakdown. These feed directly into the CO-PO attainment system.' },
  { id: 'pe16', module: 'paper', question: 'How does the AI handle MCQ sheets?', answer: 'MCQ OMR sheets are processed with a dedicated OMR scanner algorithm that detects filled bubbles with 99.8% accuracy. Negative marking, partial marking, and bonus questions are configured in the rubric setup. Results are processed in seconds for a full batch, eliminating manual tabulation errors.' },

  // ── WORKFORCE INTELLIGENCE (14 Qs) ──────────────────────────────────
  { id: 'wi1', module: 'workforce', question: 'What is the Faculty Retention Index?', answer: 'The Faculty Retention Index (FRI) is a composite score (0–100) calculated from: attrition rate (last 12 months), tenure distribution, exit interview sentiment, counter-offer acceptance rate, and engagement survey scores. An FRI below 55 triggers an executive alert recommending compensation benchmarking or workload review.' },
  { id: 'wi2', module: 'workforce', question: 'How does the AI predict flight risk for faculty?', answer: 'The flight risk model analyses: salary vs. market benchmark, stagnation in grade (>3 years without promotion), declining appraisal scores, leave pattern anomalies, and reduced participation in institutional activities. Faculty scoring above the 75th percentile on flight risk receive an alert visible to the Principal and HR head.' },
  { id: 'wi3', module: 'workforce', question: 'What workforce stability metrics are tracked?', answer: 'Key stability metrics include: (1) Continuity Index (same-subject faculty year-over-year), (2) Bench Strength (% of roles with an internal successor ready), (3) Critical Role Coverage Rate, (4) Department Headcount Stability, and (5) Contractual-to-Permanent Ratio. All metrics are trended over 24 months.' },
  { id: 'wi4', module: 'workforce', question: 'Can the system model future hiring needs?', answer: 'Yes. The Workforce Planning module uses enrolment projections, regulatory ratios (AICTE faculty:student), and historical attrition data to forecast hiring needs 12–24 months ahead. It outputs a department-wise headcount plan with a timeline and estimated budget impact.' },
  { id: 'wi5', module: 'workforce', question: 'What is the Engagement Health Score?', answer: 'The Engagement Health Score aggregates data from pulse surveys, leave patterns, training participation, and appraisal feedback. It identifies pockets of disengagement at team/department level with 73% predictive accuracy on voluntary attrition within the next 6 months.' },
  { id: 'wi6', module: 'workforce', question: 'How are department-wise workforce analytics presented?', answer: 'Each department has a dedicated analytics card showing: headcount, open vacancies, tenure mix (junior/mid/senior), attrition rate, average experience, and FRI score. A drill-down view allows HR to see individual faculty profiles grouped by risk category.' },
  { id: 'wi7', module: 'workforce', question: 'Does the system track qualification upgrade pathways?', answer: 'Yes. The system tracks faculty pursuing PhD, FDP completion, and certification upgrades. It sends automated reminders for renewal deadlines and flags positions where qualification requirements are at risk of lapsing (relevant for NAAC and AICTE compliance).' },
  { id: 'wi8', module: 'workforce', question: 'How does workforce intelligence integrate with payroll?', answer: 'Workforce Intelligence pulls anonymised compensation banding data from the payroll module to run market benchmarking analyses. It does not display individual salary figures in standard views. HR Heads with elevated permissions can view individual data in the Compensation Benchmarking sub-module.' },
  { id: 'wi9', module: 'workforce', question: 'What is the Bench Strength metric?', answer: 'Bench Strength measures the percentage of critical roles (HOD, Lab In-charge, Exam Controller) that have at least one identified internal successor who is trained and ready within 6 months. Institutions with bench strength below 40% are flagged as vulnerable to knowledge loss.' },
  { id: 'wi10', module: 'workforce', question: 'Can I run what-if scenarios for workforce planning?', answer: 'Yes. The Workforce Simulator allows you to model scenarios such as "What if 3 senior faculty in ECE retire?" or "What if we add a new MBA batch of 120 students?". The simulator recalculates faculty requirements, cost impact, and AICTE ratio compliance dynamically.' },
  { id: 'wi11', module: 'workforce', question: 'How is part-time and adjunct faculty tracked?', answer: 'Part-time and adjunct faculty have their own workforce profile with contract end dates, hourly commitment tracking, subject coverage contribution, and performance ratings. The system alerts HR 60 days before contract expiry and models the coverage gap if the contract is not renewed.' },
  { id: 'wi12', module: 'workforce', question: 'What is the Gender Diversity Index in workforce analytics?', answer: 'The Gender Diversity Index tracks male-to-female faculty ratio overall and by department/grade. It benchmarks against sector averages and surfaces departments with significant imbalances. Trend charts show whether diversity is improving or declining over the past 4 years.' },
  { id: 'wi13', module: 'workforce', question: 'How does the system handle inter-department transfers?', answer: 'Transfer requests are raised by faculty or HOD, routed through an approval workflow (HOD → Principal → HR), and once approved, automatically update the faculty\'s department assignment, timetable, reporting line, and payroll cost centre — with no manual re-entry required.' },
  { id: 'wi14', module: 'workforce', question: 'What anomalies does the AI detect in workforce data?', answer: 'The anomaly detection engine flags: unusual leave spike in a department, sudden resignation cluster (3+ in 30 days), declining appraisal scores across a team, below-average training hours, and payroll discrepancies (e.g., grade mismatches). Each anomaly has a severity rating and recommended escalation path.' },

  // ── GRIEVANCE INTELLIGENCE (14 Qs) ──────────────────────────────────
  { id: 'gi1', module: 'grievance', question: 'How does the AI analyse grievance sentiment?', answer: 'Grievance text is processed through a fine-tuned sentiment analysis model trained on HR and institutional complaint datasets. The model classifies sentiment as Positive, Neutral, Negative, or Distressed and extracts key themes (harassment, workload, infrastructure). Distressed cases auto-escalate to the POSH committee within 4 hours.' },
  { id: 'gi2', module: 'grievance', question: 'What is the POSH case management workflow?', answer: 'POSH complaints follow a 4-stage workflow: (1) Complaint lodged (anonymous option available), (2) Internal Committee (IC) auto-notified and case file created, (3) Inquiry process tracked with deadline alerts, (4) Resolution logged with action taken. All stages comply with the POSH Act 2013 timelines. Automated reminders are sent at D+7, D+30, and D+60.' },
  { id: 'gi3', module: 'grievance', question: 'How does the predictive escalation model work?', answer: 'The escalation model scores each open grievance based on: days open, nature of complaint, prior complaint history of the respondent, and expressed severity. Cases above the escalation threshold (score >70) are flagged in red on the executive dashboard with a recommended escalation action.' },
  { id: 'gi4', module: 'grievance', question: 'Can grievances be submitted anonymously?', answer: 'Yes. The system supports fully anonymous submissions. The identity of the complainant is encrypted and accessible only to the Chief Grievance Officer. Even the IC sees only a case ID during the initial review phase. This design meets PoSH Act confidentiality requirements.' },
  { id: 'gi5', module: 'grievance', question: 'What resolution time benchmarks does the system enforce?', answer: 'The system enforces: (1) 24-hour acknowledgement SLA for all complaints, (2) 7-day first inquiry meeting for POSH cases, (3) 60-day final resolution for POSH under the Act, (4) 15-day resolution for general grievances. SLA breaches trigger escalation alerts to the Registrar.' },
  { id: 'gi6', module: 'grievance', question: 'How are grievance trends analysed?', answer: 'The Grievance Trend Dashboard shows: monthly complaint volumes, top complaint categories, average resolution time, repeat complainants, and department-wise grievance density. A spike detection algorithm flags months where complaint volume exceeds 2 standard deviations from the 12-month baseline.' },
  { id: 'gi7', module: 'grievance', question: 'Can the system identify grievance hotspots?', answer: 'Yes. By mapping grievances to department, floor, and shift, the system generates a Grievance Heat Map. Departments with high grievance density and low resolution rates are flagged as "high-risk zones" for HR intervention — typically indicating leadership or workload issues.' },
  { id: 'gi8', module: 'grievance', question: 'How does repeat complaint tracking work?', answer: 'Each complainant and respondent is tracked across cases. If the same respondent appears in 3 or more grievances within 12 months, the system flags a "Pattern Alert" to the Principal. Separately, if the same complainant files more than 5 cases, a review flag is raised to check for process misuse.' },
  { id: 'gi9', module: 'grievance', question: 'Is the grievance data used for institutional risk scoring?', answer: 'Yes. Grievance data contributes to the overall Institutional Governance Risk Score — one of the four pillars alongside Financial Health, Compliance Grade, and Faculty Stability. A spike in unresolved grievances can lower the governance score and trigger a board-level risk review.' },
  { id: 'gi10', module: 'grievance', question: 'Can the IC access evidence documents through the system?', answer: 'Yes. The case file section allows the IC to upload and access all evidence documents (emails, CCTV logs, witness statements) with role-based access control. Documents are timestamped and access-logged. Once a case is closed, documents are archived in encrypted storage for 7 years per PoSH Act requirements.' },
  { id: 'gi11', module: 'grievance', question: 'How does the system handle infrastructure-related grievances?', answer: 'Infrastructure grievances (broken equipment, cleanliness, safety) are categorised separately and routed to the Facilities Management team rather than HR. The system tracks these with a separate SLA (48-hour resolution target) and escalates to the Registrar if unresolved. Repeat infrastructure complaints trigger a maintenance audit flag.' },
  { id: 'gi12', module: 'grievance', question: 'Does the system generate POSH compliance reports?', answer: 'Yes. The POSH Annual Report generator compiles: total cases filed, cases resolved vs. pending, demographic breakdown, resolution actions taken, and training hours delivered. This report meets the mandatory annual POSH compliance reporting format required by the Ministry of Women & Child Development.' },
  { id: 'gi13', module: 'grievance', question: 'How is grievance data protected from the respondent?', answer: 'Grievance data is access-controlled at every stage. The respondent can view only their formal charge sheet after the IC decides to proceed with inquiry — not the initial complaint text. All system access to grievance records is logged in an immutable audit trail. Administrators cannot modify closed case records.' },
  { id: 'gi14', module: 'grievance', question: 'What AI-generated insights does the Grievance Intelligence provide?', answer: 'The AI generates: (1) monthly sentiment trend analysis (is the institutional climate improving?), (2) top-3 recurring grievance themes, (3) predicted case resolution time based on category and complexity, (4) recommended IC member assignment based on availability and expertise, and (5) peer institution benchmarking (anonymised).' },

  // ── COMPLIANCE & NAAC (14 Qs) ────────────────────────────────────────
  { id: 'cn1', module: 'compliance', question: 'How does the AI predict NAAC compliance risks?', answer: 'The compliance risk engine monitors 130+ data points mapped to NAAC\'s 7 criteria. It calculates a risk probability for each criterion based on current metric values vs. target benchmarks, trend trajectory (improving/declining), and days remaining to the next assessment cycle. High-risk criteria are flagged with specific remediation actions.' },
  { id: 'cn2', module: 'compliance', question: 'Which NAAC criteria does the system cover?', answer: 'The system covers all 7 NAAC criteria: C1 Curricular Aspects, C2 Teaching-Learning & Evaluation, C3 Research & Innovation, C4 Infrastructure & Learning Resources, C5 Student Support & Progression, C6 Governance & Leadership, and C7 Institutional Values & Best Practices. Each criterion has sub-indicators tracked with live data.' },
  { id: 'cn3', module: 'compliance', question: 'How does the document gap detection work?', answer: 'The Document Gap Detector maintains a checklist of all mandatory evidence documents for each NAAC indicator. It continuously scans the document repository and flags: (1) missing documents, (2) documents expiring within 90 days, (3) documents with missing signatures or dates. The current gap count is visible on the compliance dashboard in real-time.' },
  { id: 'cn4', module: 'compliance', question: 'Can I simulate my NAAC score before the assessment?', answer: 'Yes. The NAAC Score Simulator inputs your current metric values into the official NAAC weighting framework and generates an estimated overall grade (A++, A+, A, B++, etc.) with a breakdown by criterion. The simulator shows which criteria have the highest score improvement potential.' },
  { id: 'cn5', module: 'compliance', question: 'How is NIRF data tracked?', answer: 'NIRF (National Institutional Ranking Framework) data — faculty publications, research funding, placement rates, financial resources, and diversity metrics — is pulled from connected modules and compiled into the NIRF submission format. The system tracks year-over-year ranking movement and benchmarks against peer institutions.' },
  { id: 'cn6', module: 'compliance', question: 'What is the Compliance Audit Readiness Score?', answer: 'The Audit Readiness Score (0–100) is a composite metric reflecting: document completeness, metric accuracy, policy update status, faculty qualification compliance, and infrastructure certificate validity. An institution with a score above 85 is considered "audit-ready". The score updates daily as data flows in from all modules.' },
  { id: 'cn7', module: 'compliance', question: 'How does the system track UGC regulations?', answer: 'UGC regulation tracking covers: recognition status, affiliation validity, programme approval letters, accreditation status, and adherence to UGC (Online Courses) Regulations. The system flags upcoming renewal deadlines 90 and 30 days in advance and provides a guided submission checklist for each renewal type.' },
  { id: 'cn8', module: 'compliance', question: 'Can the system generate NAAC Self Study Reports (SSR)?', answer: 'Yes. The SSR auto-generator pulls data from all connected modules and populates the NAAC SSR template. Coordinators review and add qualitative narratives for each indicator. The system tracks narrative completion progress and ensures all quantitative tables are accurately pre-filled, reducing SSR preparation time by approximately 60%.' },
  { id: 'cn9', module: 'compliance', question: 'How does criterion 5 (Student Support) track mentoring data?', answer: 'Criterion 5 data is directly fed by the Mentor Management module. Interaction logs, parent communication records, at-risk student interventions, and scholarship disbursements are all compiled automatically. The system generates the Criterion 5 evidence bundle — including a CSV of all mentoring interactions — at the click of a button.' },
  { id: 'cn10', module: 'compliance', question: 'What alerts does the compliance module send?', answer: 'Automated alerts include: document expiry warnings (T-90, T-30, T-7 days), metric threshold breaches, faculty qualification lapse risks, missing data for NAAC indicators, IQAC meeting reminders, and assessment cycle milestones. Alerts are sent via dashboard notifications, email, and SMS to designated IQAC coordinators.' },
  { id: 'cn11', module: 'compliance', question: 'How does the IQAC meeting management feature work?', answer: 'IQAC Meeting Management allows scheduling of quarterly meetings, distributes agenda documents to all members, records minutes digitally, tracks action items with owner and deadline, and sends automated follow-up reminders. Meeting records are auto-compiled into the NAAC Annual Quality Assurance Report (AQAR).' },
  { id: 'cn12', module: 'compliance', question: 'How are faculty qualification compliance checks done?', answer: 'The system checks each faculty\'s qualification against UGC/AICTE norms (Ph.D. requirement for Professors, NET/SET for Assistant Professors). Faculties whose qualifications will lapse or who are approaching retirement age are flagged. The system also tracks API score accumulation for CAS (Career Advancement Scheme) eligibility.' },
  { id: 'cn13', module: 'compliance', question: 'What is the accreditation timeline planner?', answer: 'The Accreditation Timeline Planner creates a 24-month roadmap to NAAC re-accreditation. It milestones key tasks: IQAC formation, data compilation phases, mock assessment, SSR submission, and peer team visit preparation. Each milestone has an assigned owner and progress indicator visible to the Principal.' },
  { id: 'cn14', module: 'compliance', question: 'How is research compliance tracked?', answer: 'Research compliance tracks: minimum publications per faculty as per NAAC norms, funded projects, patent filings, industry consultancy revenues, and MoU status. The Research & Publication module feeds this data automatically. The system flags departments with publication density below the NAAC benchmark for corrective action.' },

  // ── FINANCE INTELLIGENCE (12 Qs) ────────────────────────────────────
  { id: 'fi1', module: 'finance', question: 'How does AI predict fee collection shortfalls?', answer: 'The collections model analyses per-student fee payment history, demographic risk factors (distance from college, scholarship dependency), semester-specific patterns, and economic indicators. It predicts the probability of default for each student 45 days before the due date with 82% accuracy, allowing the finance team to proactively reach out.' },
  { id: 'fi2', module: 'finance', question: 'What is the Fee Aging Analysis?', answer: 'Fee Aging Analysis classifies outstanding fees into buckets: 0–30 days (current), 31–60 days, 61–90 days, and 90+ days (high-risk). For each bucket, the system shows student count, total amount, and recommended recovery action (SMS reminder → parent call → finance hold → academic hold). The aging matrix updates daily.' },
  { id: 'fi3', module: 'finance', question: 'How does the Cash Flow Anomaly Detector work?', answer: 'The anomaly detector establishes a 90-day rolling baseline for daily/weekly cash inflows. Any week where actual collections deviate more than 20% below baseline triggers an anomaly alert. The system identifies the root cause (specific departments, scholarship delays, seasonal patterns) and recommends short-term liquidity actions.' },
  { id: 'fi4', module: 'finance', question: 'Can I model different fee revision scenarios?', answer: 'Yes. The Fee Structure Simulator allows modelling 3 alternative fee revision scenarios simultaneously. For each scenario, the system projects: total revenue impact, estimated student dropout risk (based on price sensitivity model), scholarship fund requirement, and competitive positioning vs. peer institutions.' },
  { id: 'fi5', module: 'finance', question: 'How does the system track scholarship disbursements?', answer: 'Scholarship management tracks: government scholarship applications and disbursements (central and state), institutional scholarships, and corporate-sponsored awards. It reconciles approved amounts vs. actual disbursements, flags delay in government releases, and auto-adjusts student fee ledgers upon scholarship credit.' },
  { id: 'fi6', module: 'finance', question: 'What financial KPIs are on the executive dashboard?', answer: 'Executive KPIs include: Collection Efficiency Ratio (actual vs. billed), Days Sales Outstanding (DSO), Bad Debt Ratio, Operating Cost Per Student, Revenue per Faculty FTE, Scholarship Dependency Ratio, and Reserve Fund Adequacy (months of operating expenses covered). All KPIs are trended over 3 years.' },
  { id: 'fi7', module: 'finance', question: 'How does the proactive recovery model work?', answer: 'The recovery model segments defaulting students into 3 cohorts: (1) Likely-to-pay (just need a reminder), (2) Financially distressed (need an installment plan), (3) High-default risk (need scholarship intervention). For each cohort, the system auto-generates the appropriate communication and routes it to the relevant team (finance desk, counsellor, or financial aid office).' },
  { id: 'fi8', module: 'finance', question: 'Can the system generate P&L statements?', answer: 'Yes. The Finance Intelligence module can generate monthly P&L statements by pulling income (fees, grants, consultancy) and expense data (faculty payroll, infrastructure, academic expenses) from integrated modules. It produces reports in both management accounting format and the standard Education Trust/Society financial reporting format.' },
  { id: 'fi9', module: 'finance', question: 'How are government grants tracked?', answer: 'Government grant tracking covers: Research funding (DST, CSIR, AICTE-MODROBS), infrastructure grants (RUSA, HEFA), and development grants. Each grant has a utilisation tracker showing claimed vs. unclaimed amounts, deadlines, and pending documentation requirements. UC (Utilisation Certificate) generation is automated.' },
  { id: 'fi10', module: 'finance', question: 'What is the Budget vs. Actuals module?', answer: 'The Budget vs. Actuals module displays the annual budget allocation per department alongside actual spending month-by-month. Departments overspending by more than 15% vs. budget trigger an alert. Under-spending departments near year-end get a "use-it-or-lose-it" alert to plan for fund utilisation before the financial year closes.' },
  { id: 'fi11', module: 'finance', question: 'How does the system handle tution fee regulatory compliance?', answer: 'The system tracks fee structures against the regulatory fee fixation orders for autonomous institutions (state fee regulatory committee orders). Any fee component not aligned with the approved structure is automatically flagged. Audit reports are generated for the regulatory body inspection format.' },
  { id: 'fi12', module: 'finance', question: 'Can I track vendor payments and procurement through Finance Intelligence?', answer: 'Yes. The procurement module tracks purchase orders, invoice matching (3-way: PO, GRN, Invoice), approval workflows, and payment status. The AI flags invoices with pricing anomalies (above market rate), duplicate submissions, and vendors with poor delivery track records. All procurement data feeds into the department-wise spend dashboard.' },

  // ── MENTOR MANAGEMENT (14 Qs) ────────────────────────────────────────
  { id: 'mm1', module: 'mentor', question: 'How does the early warning system identify at-risk students?', answer: 'The early warning engine runs weekly on the student data feed. It flags students as RED risk if ANY of these thresholds are breached: attendance below 65%, internal marks below 40%, fee overdue by >15 days, or no mentor meeting in the last 45 days. AMBER flags apply when metrics are in the warning zone (65–74% attendance, 40–50% marks). GREEN indicates all clear.' },
  { id: 'mm2', module: 'mentor', question: 'What is the NAAC Criterion 5 evidence bundle?', answer: 'The NAAC Criterion 5 evidence bundle (auto-generated) contains: (1) a CSV of all mentor-student interactions for the academic year, (2) at-risk student intervention reports, (3) parent communication logs, (4) mentee roster with risk classification, and (5) faculty mentor attendance in mentoring activities. This bundle is accepted directly by NAAC peer teams as audit evidence.' },
  { id: 'mm3', module: 'mentor', question: 'How does the automated parent communication work?', answer: 'When a student is flagged RED risk, the system auto-drafts an SMS and email to the parent using a pre-approved template. The message includes the student\'s name, the specific concern (attendance/marks/fees), and a request to contact the mentor. Responses are tracked. If no response within 72 hours, an escalation to the HOD is triggered.' },
  { id: 'mm4', module: 'mentor', question: 'Can mentors log interactions from their mobile?', answer: 'Yes. The Mentor Mobile App (iOS and Android) allows faculty to log interactions on-the-go. The interaction form auto-fills the student details, date, and faculty name. Voice-to-text is available for notes. All logs sync to the central NAAC evidence database within 30 seconds.' },
  { id: 'mm5', module: 'mentor', question: 'How is the mentor-mentee assignment done?', answer: 'Mentor-mentee assignment can be done in three modes: (1) Manual — HOD assigns students to faculty, (2) Automatic (balanced) — the system distributes students evenly by count, (3) Automatic (preference-based) — faculty set preferences for subjects/years and the AI matches accordingly. Assignments are tracked from Year 1 to Year 4 for continuity.' },
  { id: 'mm6', module: 'mentor', question: 'What is the Student 360 Profile?', answer: 'The Student 360 Profile aggregates everything a mentor needs: current attendance, internal marks, CGPA, active backlogs, fee status, disciplinary record, hostel/day-scholar details, contact numbers (student and parent), the Year 1 to Year 4 academic progression roadmap, and the complete interaction history — all on a single screen.' },
  { id: 'mm7', module: 'mentor', question: 'How many students can one mentor handle?', answer: 'AICTE and UGC recommend a maximum of 20 mentees per faculty mentor for undergraduate programmes. The system enforces this limit during assignment and alerts the HOD when any mentor\'s roster exceeds the guideline. It also tracks the actual meeting frequency per mentor to identify overloaded mentors who may be at risk of inadequate support.' },
  { id: 'mm8', module: 'mentor', question: 'How does the AI generate semester outcome predictions for students?', answer: 'The prediction model uses: current attendance trajectory (4-week trend), internal assessment scores relative to minimum thresholds, historical data for similar students in prior batches, and financial stress signals. It predicts semester failure probability with a 87% accuracy rate, allowing mentor intervention 6–8 weeks before finals.' },
  { id: 'mm9', module: 'mentor', question: 'How does the mentor chat portal work?', answer: 'The Chat Portal is a group messaging channel for each mentor-mentee batch. The mentor (admin) can broadcast announcements to all 20+ mentees simultaneously. Students can message the mentor directly. All messages are logged (not private) and can be referenced in interaction records. This replaces informal WhatsApp group usage.' },
  { id: 'mm10', module: 'mentor', question: 'Can the system generate a mentee progress report for parents?', answer: 'Yes. The Parent Progress Report (auto-generated) provides a 1-page summary of the mentee\'s academic progress: attendance, marks, fee status, upcoming exams, and mentor comments. Reports can be shared digitally (email/SMS link) or printed for parent-teacher meetings. They are updated monthly by default.' },
  { id: 'mm11', module: 'mentor', question: 'How are disciplinary cases managed in Mentor Management?', answer: 'Disciplinary cases (lab misconduct, exam fraud, ragging) are logged by the relevant authority and linked to the student\'s profile. The mentor is notified immediately and required to log a counselling session within 72 hours. Escalation thresholds (e.g., 3rd offence in a semester) trigger automatic routing to the Discipline Committee.' },
  { id: 'mm12', module: 'mentor', question: 'What happens when a student switches year (Year 1 to Year 2)?', answer: 'At the end of each academic year, the system runs an automatic year-end migration: student records are updated to the next year, historical data is archived under the appropriate year label, mentor assignments are reviewed (mentors continue with the same batch by default), and academic history records (SGPA, attendance) are permanently saved for the completed year.' },
  { id: 'mm13', module: 'mentor', question: 'How does the Principal view mentoring compliance?', answer: 'The Principal has access to the NAAC Report tab, which shows: (1) institution-wide interaction log counts, (2) department-wise mentor activity compliance rates, (3) inactive mentor alerts (0 logs in current month), (4) at-risk student contact rates, and (5) the AI audit readiness score for Criterion 5. This replaces manual monthly reports.' },
  { id: 'mm14', module: 'mentor', question: 'How does the system ensure data privacy for student records?', answer: 'Student records in Mentor Management are access-controlled: Faculty mentors see only their assigned mentees, HODs see all mentees in their department, and Principals have institution-wide read access. Students can view their own profiles. All access is logged. Data is encrypted at rest and in transit. Parent data follows the institution\'s data retention policy.' },
];

// ─────────────────────────────────────────────
// HELPER: find best matching Q&A
// ─────────────────────────────────────────────
function findBestMatch(query: string, moduleFilter: string): QA | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const pool = moduleFilter === 'all'
    ? QA_DATABASE
    : QA_DATABASE.filter(qa => qa.module === moduleFilter);

  // Exact question match
  const exact = pool.find(qa => qa.question.toLowerCase() === q);
  if (exact) return exact;

  // Score by keyword overlap
  const words = q.split(/\s+/).filter(w => w.length > 3);
  let best: QA | null = null;
  let bestScore = 0;

  for (const qa of pool) {
    const combined = (qa.question + ' ' + qa.answer).toLowerCase();
    const score = words.reduce((acc, w) => acc + (combined.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = qa;
    }
  }

  return bestScore >= 1 ? best : null;
}

const FALLBACK_ANSWER = `I'm the edumerge co-pilot — I can answer questions across all 7 AI modules: Academic co-pilot, Online Paper Evaluation, Workforce Intelligence, Grievance Intelligence, Compliance & NAAC, Finance Intelligence, and Mentor Management.\n\nTry browsing the suggested prompts on the left, or ask something like:\n• "How does AI predict student failure risk?"\n• "What is the NAAC Criterion 5 evidence bundle?"\n• "How does fee aging analysis work?"`;

const formatTime = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const makeId = () => Math.random().toString(36).slice(2, 10);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AiCopilot() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'bot',
      text: `Hello! I'm your **edumerge co-pilot** 👋\n\nI can answer 100+ questions across all institutional AI modules — from timetable scheduling and paper evaluation to NAAC compliance, finance predictions, and student mentoring.\n\nClick any suggested prompt on the left, or type your question below to get started.`,
      timestamp: formatTime(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistories] = useState<ChatHistory[]>([
    { id: 'h1', title: 'NAAC Criterion 5 Evidence', preview: 'How does Criterion 5 mentoring data get compiled?', time: '2h ago' },
    { id: 'h2', title: 'Fee Collection Predictions', preview: 'How does AI predict fee shortfalls?', time: 'Yesterday' },
    { id: 'h3', title: 'Timetable Conflict Detection', preview: 'How does Academic co-pilot detect conflicts?', time: '2 days ago' },
    { id: 'h4', title: 'POSH Compliance Workflow', preview: 'What is the POSH case management workflow?', time: '3 days ago' },
    { id: 'h5', title: 'OCR Evaluation Accuracy', preview: 'What is the OCR accuracy rate?', time: '4 days ago' },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const filteredPrompts = useMemo(() => {
    const pool = activeModule === 'all' ? QA_DATABASE : QA_DATABASE.filter(qa => qa.module === activeModule);
    if (!searchQuery.trim()) return pool.slice(0, 20);
    const q = searchQuery.toLowerCase();
    return pool.filter(qa => qa.question.toLowerCase().includes(q)).slice(0, 20);
  }, [activeModule, searchQuery]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: makeId(), role: 'user', text: text.trim(), timestamp: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const match = findBestMatch(text, activeModule);
      const answer = match ? match.answer : FALLBACK_ANSWER;
      const moduleLabel = match ? MODULES.find(m => m.id === match.module)?.label || '' : '';
      const prefix = match && moduleLabel ? `**[${moduleLabel}]**\n\n` : '';
      const botMsg: ChatMessage = {
        id: makeId(),
        role: 'bot',
        text: prefix + answer,
        timestamp: formatTime(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const resetChat = () => {
    setMessages([{
      id: 'intro',
      role: 'bot',
      text: `Hello! I'm your **edumerge co-pilot** 👋\n\nI can answer 100+ questions across all institutional AI modules. Click any prompt or ask your question below.`,
      timestamp: formatTime(),
    }]);
  };

  const renderText = (text: string) => {
    // Simple markdown: bold, bullet points, newlines
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const boldReplaced = line.replace(/\*\*(.+?)\*\*/g, (_match, content) =>
        `<strong>${content}</strong>`
      );
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: boldReplaced }} />;
      }
      return (
        <p key={i} className={`text-sm leading-relaxed ${line === '' ? 'mt-2' : ''}`}
          dangerouslySetInnerHTML={{ __html: boldReplaced }} />
      );
    });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#F8F8F6] flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ─── TOP NAVBAR ─────────────────────────────────── */}
      <header className="bg-white border-b border-[#E2E0D8] px-5 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E0D8] hover:bg-slate-50 transition text-xs font-semibold text-slate-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#000099] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-[#000099] text-base tracking-tight">edumerge</span>
            <span className="text-slate-300 text-lg font-light">|</span>
            <span className="text-sm font-bold text-slate-600">co-pilot</span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF9A01]/15 text-[#FF9A01] px-2 py-0.5 rounded-full border border-[#FF9A01]/30 animate-pulse">AI</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E0D8] hover:bg-slate-50 transition text-xs font-semibold text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E0D8] hover:bg-slate-50 transition text-xs font-semibold text-slate-600"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prompts</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN LAYOUT ────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── LEFT SIDEBAR ─────────────────────────────── */}
        {sidebarOpen && (
          <aside className="w-80 flex-shrink-0 bg-white border-r border-[#E2E0D8] flex flex-col overflow-hidden">

            {/* Module Filter */}
            <div className="p-4 border-b border-[#E2E0D8] space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Filter by Module</p>
              <div className="flex flex-wrap gap-1.5">
                {MODULES.map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(mod.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide transition border ${
                      activeModule === mod.id
                        ? 'text-white border-transparent shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-[#E2E0D8] hover:bg-slate-100'
                    }`}
                    style={activeModule === mod.id ? { backgroundColor: mod.color, borderColor: mod.color } : {}}
                  >
                    <mod.icon className="w-2.5 h-2.5" />
                    {mod.id === 'all' ? 'All' : mod.label.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Search prompts */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  placeholder="Search 100+ prompts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-[#E2E0D8] rounded-lg bg-[#F8F8F6] focus:outline-none focus:border-[#000099] transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Prompt List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 mb-2">
                {filteredPrompts.length} Suggested Prompts
              </p>
              {filteredPrompts.map(qa => {
                const mod = MODULES.find(m => m.id === qa.module);
                return (
                  <button
                    key={qa.id}
                    onClick={() => sendMessage(qa.question)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#000099]/5 border border-transparent hover:border-[#000099]/15 transition group flex items-start gap-2"
                  >
                    {mod && (
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: mod.color + '20' }}>
                        <mod.icon className="w-3 h-3" style={{ color: mod.color }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 group-hover:text-[#000099] leading-snug line-clamp-2">
                        {qa.question}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">{mod?.label}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#000099] flex-shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>

            {/* Chat History */}
            <div className="border-t border-[#E2E0D8] p-3 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent Sessions
              </p>
              {chatHistories.map(h => (
                <button
                  key={h.id}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <p className="text-[11px] font-bold text-slate-700 truncate">{h.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{h.time}</p>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* ─── CHAT AREA ────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} max-w-3xl ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                  msg.role === 'bot'
                    ? 'bg-[#000099]'
                    : 'bg-[#FF9A01]'
                }`}>
                  {msg.role === 'bot'
                    ? <Sparkles className="w-4 h-4 text-white" />
                    : <UserIcon className="w-4 h-4 text-white" />
                  }
                </div>

                {/* Bubble */}
                <div className={`group flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm max-w-xl ${
                    msg.role === 'user'
                      ? 'bg-[#000099] text-white rounded-tr-none'
                      : 'bg-white border border-[#E2E0D8] text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="text-sm font-semibold">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderText(msg.text)}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="w-8 h-8 rounded-full bg-[#000099] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-[#E2E0D8] rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#000099]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#000099]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#000099]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Category Pills */}
          <div className="bg-white border-t border-[#E2E0D8] px-4 pt-3 pb-0 flex gap-2 overflow-x-auto no-scrollbar">
            {MODULES.slice(1).map(mod => (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  setSidebarOpen(true);
                }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border transition hover:shadow-sm"
                style={{
                  borderColor: mod.color + '40',
                  color: mod.color,
                  backgroundColor: mod.color + '10',
                }}
              >
                <mod.icon className="w-3 h-3" />
                {mod.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="bg-white border-t border-[#E2E0D8] p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Ask me anything about edumerge's AI modules..."
                  className="w-full pl-9 pr-4 py-3 text-sm border border-[#E2E0D8] rounded-xl bg-[#F8F8F6] focus:outline-none focus:border-[#000099] focus:bg-white transition shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#000099] text-white hover:bg-[#000099]/90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
              edumerge co-pilot · {QA_DATABASE.length} questions across {MODULES.length - 1} AI modules
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
