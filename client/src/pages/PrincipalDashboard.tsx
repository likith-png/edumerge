import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import {
  LayoutDashboard, Users, GraduationCap, DollarSign, Bell, AlertTriangle,
  TrendingUp, TrendingDown, ChevronRight, Home, ArrowLeft, Eye,
  CheckCircle2, XCircle, Clock, Star, Zap, Search, Filter, Download,
  BookOpen, UserCheck, BarChart2, MessageSquare, Shield, Award,
  Building2, Target, Activity, PieChart as PieIcon, ArrowRight,
  Briefcase, Heart, Phone, Mail, Calendar, MapPin, Info, AlertCircle,
  RefreshCw, ChevronDown, FileText, ThumbsUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

// ─── SEED DATA ─────────────────────────────────────────────────────────────────

const INSTITUTION = { name: 'National Hill College', code: 'NHC', year: '2026-27', principal: 'Dr. Anand Krishnamurthy', vp: 'Prof. Meera Shenoy' };

// Overview KPIs
const OVERVIEW_KPIS = {
  admissionConversion: { value: 79.2, target: 80, prev: 74.6, label: 'Admission Conversion Rate', unit: '%' },
  attendanceStability: { value: 87.3, target: 90, prev: 89.1, label: 'Attendance Stability Index', unit: '%' },
  academicPerformance: { value: 72.4, target: 75, prev: 70.2, label: 'Academic Performance Index', unit: '%' },
  feeRecovery: { value: 76.1, target: 85, prev: 78.3, label: 'Fee Recovery Efficiency', unit: '%' },
  teacherEffectiveness: { value: 8.2, target: 8.5, prev: 8.0, label: 'Teacher Effectiveness Score', unit: '/10' },
};

// Student Data
const STUDENT_HEADCOUNT = {
  total: 1247, boys: 623, girls: 624,
  byGrade: [
    { grade: 'Grade 1', count: 89, boys: 44, girls: 45 }, { grade: 'Grade 2', count: 94, boys: 47, girls: 47 },
    { grade: 'Grade 3', count: 102, boys: 52, girls: 50 }, { grade: 'Grade 4', count: 97, boys: 49, girls: 48 },
    { grade: 'Grade 5', count: 108, boys: 55, girls: 53 }, { grade: 'Grade 6', count: 112, boys: 56, girls: 56 },
    { grade: 'Grade 7', count: 118, boys: 59, girls: 59 }, { grade: 'Grade 8', count: 105, boys: 53, girls: 52 },
    { grade: 'Grade 9', count: 111, boys: 55, girls: 56 }, { grade: 'Grade 10', count: 98, boys: 49, girls: 49 },
    { grade: 'Grade 11', count: 108, boys: 52, girls: 56 }, { grade: 'Grade 12', count: 105, boys: 52, girls: 53 },
  ],
};

const ATTENDANCE_BY_GRADE = [
  { grade: 'Gr.1', pct: 91.2 }, { grade: 'Gr.2', pct: 89.4 }, { grade: 'Gr.3', pct: 88.7 },
  { grade: 'Gr.4', pct: 87.3 }, { grade: 'Gr.5', pct: 85.9 }, { grade: 'Gr.6', pct: 86.1 },
  { grade: 'Gr.7', pct: 84.2 }, { grade: 'Gr.8', pct: 85.8 }, { grade: 'Gr.9', pct: 88.1 },
  { grade: 'Gr.10', pct: 90.3 }, { grade: 'Gr.11', pct: 87.6 }, { grade: 'Gr.12', pct: 89.2 },
];

const ACADEMIC_PERFORMANCE = [
  { subject: 'Mathematics', avg: 68.4, pass: 84.2 }, { subject: 'Science', avg: 72.1, pass: 89.3 },
  { subject: 'English', avg: 74.8, pass: 91.5 }, { subject: 'Social Studies', avg: 76.2, pass: 93.1 },
  { subject: 'Computer Sci.', avg: 81.3, pass: 95.2 }, { subject: 'Hindi', avg: 70.5, pass: 87.4 },
  { subject: 'Physical Ed.', avg: 88.7, pass: 98.6 },
];

const ADMISSIONS_DATA = {
  enquiries: 312, converted: 247, pending: 28, dropped: 37,
  conversionRate: 79.2,
  bySource: [
    { source: 'Online Portal', enquiries: 140, converted: 118 },
    { source: 'Walk-in', enquiries: 94, converted: 72 },
    { source: 'Referral', enquiries: 62, converted: 48 },
    { source: 'Events/Fair', enquiries: 16, converted: 9 },
  ],
  funnel: [
    { stage: 'Enquiry', count: 312, fill: '#3b82f6' },
    { stage: 'Application', count: 275, fill: '#6366f1' },
    { stage: 'Interview', count: 258, fill: '#8b5cf6' },
    { stage: 'Admitted', count: 247, fill: '#10b981' },
  ],
};

const ADMISSION_MONTHLY = [
  { month: 'Jan', enquiries: 22, admissions: 14 }, { month: 'Feb', enquiries: 38, admissions: 28 },
  { month: 'Mar', enquiries: 72, admissions: 58 }, { month: 'Apr', enquiries: 104, admissions: 89 },
  { month: 'May', enquiries: 76, admissions: 58 },
];

const AT_RISK_STUDENTS = [
  { id: 'S101', name: 'Arjun Mehta', grade: 'Grade 7A', attendance: 61.2, issue: 'Low attendance (<65%)', severity: 'high' },
  { id: 'S102', name: 'Priya Nair', grade: 'Grade 9B', attendance: 68.4, issue: 'Attendance + declining Math', severity: 'high' },
  { id: 'S103', name: 'Rohit Kumar', grade: 'Grade 5C', attendance: 72.1, issue: 'Below pass threshold Math', severity: 'medium' },
  { id: 'S104', name: 'Anjali Sharma', grade: 'Grade 10A', attendance: 74.3, issue: '3 missed exams', severity: 'medium' },
  { id: 'S105', name: 'Dev Patel', grade: 'Grade 6B', attendance: 69.8, issue: 'Behavioural concerns', severity: 'medium' },
];

const STUDENT_360 = {
  id: 'S201', name: 'Kavya Reddy', grade: 'Grade 9A', rollNo: 'NHC-2026-9A-14',
  dob: '2011-08-15', gender: 'Female', caste: 'OBC',
  parent: 'Mr. & Mrs. Suresh Reddy', phone: '+91-98765-43210',
  attendance: 91.4, feesPaid: 45000, feesDue: 5000, totalFees: 50000,
  academicAvg: 82.3,
  subjects: [{ name: 'Math', score: 88 }, { name: 'Science', score: 84 }, { name: 'English', score: 79 }, { name: 'Social', score: 85 }, { name: 'CS', score: 92 }],
  achievements: ['District Science Olympiad – Bronze', 'School Cultural Fest – Best Performer'],
  lastCommunications: [
    { date: '2026-04-28', type: 'SMS', note: 'Parent notified about Unit Test schedule' },
    { date: '2026-04-10', type: 'Email', note: 'Fee reminder sent' },
    { date: '2026-03-22', type: 'Call', note: 'PTM attendance reminder' },
  ],
};

// Staff Data
const STAFF_DATA = {
  total: 86, teaching: 58, nonTeaching: 28, male: 38, female: 48,
  byDept: [
    { dept: 'Computer Science', count: 12 }, { dept: 'Mathematics', count: 8 },
    { dept: 'Science', count: 11 }, { dept: 'English', count: 7 },
    { dept: 'Commerce', count: 6 }, { dept: 'Admin & HR', count: 9 },
    { dept: 'Library & Lab', count: 7 }, { dept: 'Support', count: 11 },
    { dept: 'Sports', count: 4 }, { dept: 'Arts & Music', count: 11 },
  ],
  punctualityTrend: [
    { month: 'Jan', onTime: 94.2, late: 5.8 }, { month: 'Feb', onTime: 93.8, late: 6.2 },
    { month: 'Mar', onTime: 95.1, late: 4.9 }, { month: 'Apr', onTime: 94.4, late: 5.6 },
    { month: 'May', onTime: 96.2, late: 3.8 },
  ],
  lateComers: [
    { name: 'Mr. K. Rajan', dept: 'Science', lateCount: 8, avg: '9:28 AM' },
    { name: 'Ms. P. Kaur', dept: 'Admin', lateCount: 6, avg: '9:22 AM' },
    { name: 'Mr. S. Pillai', dept: 'Support', lateCount: 5, avg: '9:31 AM' },
    { name: 'Ms. D. Verma', dept: 'Math', lateCount: 4, avg: '9:19 AM' },
  ],
  awards: [
    { name: 'Ms. Reshma Binu Prasad', dept: 'CS', award: 'Best Teacher Award – April 2026' },
    { name: 'Dr. Ranjita Saikia', dept: 'Physics', award: 'Research Excellence – FY 2025-26' },
    { name: 'Mr. Edwin Vimal A', dept: 'Electronics', award: 'Student Choice Award – Semester 1' },
  ],
};

const STAFF_INDIVIDUAL = {
  id: 'EMP003', name: 'Dr. R Sedhunivas', role: 'HOD', dept: 'Computer Science',
  doj: '2018-07-01', experience: '8 years', gender: 'Male', phone: '+91-99887-65432',
  salary: '₹84,500/month',
  attendance: 96.2, lateCount: 2,
  leaves: { CL: 7, SL: 8, EL: 21, LOP: 1 },
  appraisal: [{ year: '2023-24', score: 82 }, { year: '2024-25', score: 86 }, { year: '2025-26', score: 89 }],
  teachingOutcomes: [{ subject: 'DBMS', avgScore: 74.2 }, { subject: 'OS', avgScore: 71.8 }, { subject: 'Data Structures', avgScore: 68.5 }],
  lessonPlanCompletion: 94,
};

// Finance Data
const FINANCE = {
  annualDemand: 24200000, totalCollected: 18420000, outstanding: 5780000,
  concessions: 840000, cancellations: 210000, refunds: 125000,
  collectionRate: 76.1,
  monthlyCollection: [
    { month: 'Jan', demand: 3200000, collected: 2640000 },
    { month: 'Feb', demand: 2800000, collected: 2190000 },
    { month: 'Mar', demand: 4100000, collected: 3280000 },
    { month: 'Apr', demand: 5200000, collected: 4320000 },
    { month: 'May', demand: 2900000, collected: 1680000 },
  ],
  todayCollection: { total: 124800, cash: 38400, online: 72600, cheque: 13800 },
  outstandingByGrade: [
    { grade: 'Grade 10', amount: 1240000, students: 18 },
    { grade: 'Grade 12', amount: 980000, students: 14 },
    { grade: 'Grade 9', amount: 870000, students: 13 },
    { grade: 'Grade 11', amount: 760000, students: 11 },
    { grade: 'Grade 8', amount: 640000, students: 9 },
  ],
};

// Communications & Approvals
const PENDING_APPROVALS = [
  { id: 'PA1', type: 'Leave', requestor: 'Ms. Reshma Binu Prasad', detail: 'CL – 2 days (May 12–13)', urgency: 'normal' },
  { id: 'PA2', type: 'Leave', requestor: 'Dr. R Sedhunivas', detail: 'EL – 6 days (May 20–25)', urgency: 'high' },
  { id: 'PA3', type: 'Admission', requestor: 'Priya Sharma (Grade 8)', detail: 'Late admission request', urgency: 'normal' },
  { id: 'PA4', type: 'Finance', requestor: 'Accounts Dept', detail: 'Lab equipment purchase – ₹1.2L', urgency: 'high' },
  { id: 'PA5', type: 'Leave', requestor: 'Mr. Manjit Singh', detail: 'LOP – 1 day (May 9)', urgency: 'low' },
];

const COMMUNICATIONS = [
  { id: 'C1', date: '2026-05-07', type: 'SMS', to: 'All Parents', subject: 'Unit Test 2 schedule – May 15-20', sent: 1247 },
  { id: 'C2', date: '2026-05-05', type: 'Email', to: 'All Staff', subject: 'Staff meeting – May 10, 10 AM', sent: 86 },
  { id: 'C3', date: '2026-05-03', type: 'Notice', to: 'Grade 10 & 12', subject: 'Board exam prep sessions', sent: 203 },
  { id: 'C4', date: '2026-04-30', type: 'App', to: 'All', subject: 'Holiday: Labour Day – May 1', sent: 1333 },
  { id: 'C5', date: '2026-04-28', type: 'Email', to: 'Parents (Dues)', subject: 'Fee reminder – Q1 outstanding', sent: 312 },
];

// Alerts
const ALERTS = [
  { id: 'AL1', priority: 'critical', category: 'Attendance', icon: '📉', title: 'Grade 7 attendance below threshold', detail: 'Grade 7 section average attendance is 82.4% — below the 85% minimum threshold for 3 consecutive weeks.', action: 'Notify class teacher & counsellor', rootCause: 'High absence cluster: Mon/Fri pattern — likely weekend extension.' },
  { id: 'AL2', priority: 'high', category: 'Finance', icon: '💰', title: 'Fee dues exceeding ₹12L — Grade 10 & 12', detail: '32 students across Grade 10 and Grade 12 have outstanding dues exceeding ₹1,000 each. Total: ₹12.2L.', action: 'Send escalation notice to parents', rootCause: 'Academic-sensitive grades — parents may be deferring to post-exam payment.' },
  { id: 'AL3', priority: 'high', category: 'Academics', icon: '📚', title: '18 students below pass threshold in Math', detail: 'Unit Test 1 results: 18 students across Grade 7-9 scored below 35% in Mathematics.', action: 'Schedule remedial class & notify HOD Math', rootCause: 'Chapter: Algebra & Equations — high failure cluster. Possible teaching gap.' },
  { id: 'AL4', priority: 'medium', category: 'Staff', icon: '🕐', title: '4 staff members with >5 late marks this month', detail: 'K. Rajan (8 lates), P. Kaur (6), S. Pillai (5), D. Verma (4). Biometric data shows 09:18–09:31 AM range.', action: 'HOD counselling + formal notice', rootCause: 'Carpooling group affected by construction near campus gate.' },
  { id: 'AL5', priority: 'medium', category: 'Leave', icon: '📅', title: '2 leave SLA overdue — awaiting Principal approval', detail: 'LR-1047 (Dr. Sedhunivas – EL) and LR-1048 (Dr. Saikia – OED) are overdue by 12h and 6h respectively.', action: 'Review and action pending approvals', rootCause: 'SLA breach — typically 72hr window for Level 2 approvals.' },
  { id: 'AL6', priority: 'low', category: 'Admissions', icon: '🎓', title: 'Admission conversion rate 0.8% below target', detail: 'Current conversion: 79.2% vs target 80%. 28 applications still pending final decision.', action: 'Follow up with pending applicants', rootCause: 'Delay in processing walk-in applications — backlog of 2 days.' },
];

// Additional chart data
const ATTENDANCE_TREND = [
  { month: 'Jan', attendance: 89.2, target: 90 }, { month: 'Feb', attendance: 87.8, target: 90 },
  { month: 'Mar', attendance: 88.4, target: 90 }, { month: 'Apr', attendance: 86.3, target: 90 },
  { month: 'May', attendance: 87.3, target: 90 },
];
const STUDENT_GENDER_PIE = [{ name: 'Boys', value: 623 }, { name: 'Girls', value: 624 }];
const STAFF_TYPE_PIE = [{ name: 'Teaching', value: 58 }, { name: 'Non-Teaching', value: 28 }];
const STAFF_GENDER_PIE = [{ name: 'Male', value: 38 }, { name: 'Female', value: 48 }];
const COLLECTION_MODE_PIE = [
  { name: 'Online/UPI', value: 72600 }, { name: 'Cash', value: 38400 }, { name: 'Cheque/DD', value: 13800 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n >= 1000000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`;

const KPICard = ({ kpi }: { kpi: { value: number; target: number; prev: number; label: string; unit: string } }) => {
  const trend = kpi.value >= kpi.prev;
  const atTarget = kpi.value >= kpi.target;
  const pct = Math.min((kpi.value / kpi.target) * 100, 100);
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <p className="text-xs font-semibold text-slate-500 mb-2 leading-tight">{kpi.label}</p>
        <div className="flex items-end justify-between mb-2">
          <p className={`text-2xl font-black leading-none ${atTarget ? 'text-emerald-600' : 'text-amber-600'}`}>{kpi.value}{kpi.unit}</p>
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(kpi.value - kpi.prev).toFixed(1)}{kpi.unit}
          </span>
        </div>
        <Progress value={pct} className="h-1.5 mb-1" />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Target: {kpi.target}{kpi.unit}</span>
          <span>Prev: {kpi.prev}{kpi.unit}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle, color = 'from-blue-500 to-blue-600', actions }: { icon: any; title: string; subtitle?: string; color?: string; actions?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className={`p-2 bg-gradient-to-br ${color} rounded-lg shadow-md`}><Icon className="h-4 w-4 text-white" /></div>
      <div><h2 className="text-base font-bold text-slate-900">{title}</h2>{subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}</div>
    </div>
    {actions}
  </div>
);

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#f97316'];

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

const OverviewSection = () => (
  <div className="space-y-5">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">{INSTITUTION.code} · FY {INSTITUTION.year}</p>
          <h2 className="text-xl font-black mt-1">{INSTITUTION.name}</h2>
          <p className="text-blue-200 text-sm mt-1">Principal: {INSTITUTION.principal}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black">{STUDENT_HEADCOUNT.total.toLocaleString()}</p>
          <p className="text-blue-200 text-xs">Total Students</p>
          <p className="text-xl font-black mt-2">{STAFF_DATA.total}</p>
          <p className="text-blue-200 text-xs">Total Staff</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {Object.values(OVERVIEW_KPIS).map((kpi, i) => <KPICard key={i} kpi={kpi} />)}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Quick Snapshot */}
      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Today's Snapshot</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Students Present', value: `${Math.round(STUDENT_HEADCOUNT.total * 0.873)}`, total: STUDENT_HEADCOUNT.total, color: 'bg-blue-400' },
              { label: 'Staff Present', value: '82', total: STAFF_DATA.total, color: 'bg-emerald-400' },
              { label: 'Classes Conducted', value: '28/34', total: null, color: 'bg-indigo-400' },
              { label: 'Fee Collected Today', value: fmt(FINANCE.todayCollection.total), total: null, color: 'bg-amber-400' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-xs text-slate-500 flex-1">{s.label}</span>
                <span className="text-xs font-bold text-slate-800">{s.value}{s.total ? `/${s.total}` : ''}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts Preview */}
      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Active Alerts</h3>
          <div className="space-y-2">
            {ALERTS.filter(a => a.priority === 'critical' || a.priority === 'high').slice(0, 3).map(a => (
              <div key={a.id} className={`flex items-start gap-2 p-2 rounded-lg ${a.priority === 'critical' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}>
                <span className="text-base flex-shrink-0">{a.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-700 leading-tight">{a.title}</p>
                  <span className={`text-[10px] font-bold ${a.priority === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>{a.priority.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Pending Approvals ({PENDING_APPROVALS.length})</h3>
          <div className="space-y-2">
            {PENDING_APPROVALS.slice(0, 4).map(pa => (
              <div key={pa.id} className="flex items-center gap-2">
                <Badge className={`text-[10px] border-none flex-shrink-0 ${pa.type === 'Leave' ? 'bg-blue-100 text-blue-700' : pa.type === 'Finance' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{pa.type}</Badge>
                <p className="text-xs text-slate-600 truncate">{pa.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Distribution charts */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-none shadow-sm ring-1 ring-slate-100 col-span-1 md:col-span-1">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Student Gender</h3>
          <p className="text-xs text-slate-400 mb-2">Total: {STUDENT_HEADCOUNT.total.toLocaleString()}</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={STUDENT_GENDER_PIE} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                {STUDENT_GENDER_PIE.map((_, idx) => <Cell key={idx} fill={['#6366f1', '#ec4899'][idx]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Staff Type</h3>
          <p className="text-xs text-slate-400 mb-2">Total: {STAFF_DATA.total}</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={STAFF_TYPE_PIE} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                {STAFF_TYPE_PIE.map((_, idx) => <Cell key={idx} fill={['#3b82f6', '#8b5cf6'][idx]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Staff Gender</h3>
          <p className="text-xs text-slate-400 mb-2">M: {STAFF_DATA.male} · F: {STAFF_DATA.female}</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={STAFF_GENDER_PIE} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                {STAFF_GENDER_PIE.map((_, idx) => <Cell key={idx} fill={['#0ea5e9', '#f472b6'][idx]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Today's Collection</h3>
          <p className="text-xs text-slate-400 mb-2">{fmt(FINANCE.todayCollection.total)} total</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={COLLECTION_MODE_PIE} cx="50%" cy="50%" outerRadius={58} paddingAngle={2} dataKey="value" label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                {COLLECTION_MODE_PIE.map((_, idx) => <Cell key={idx} fill={['#3b82f6', '#10b981', '#f59e0b'][idx]} />)}
              </Pie>
              <Tooltip formatter={(v) => [fmt(Number(v))]} contentStyle={{ fontSize: 11 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

const StudentAnalyticsSection = () => {
  const [subTab, setSubTab] = useState<'admissions' | 'monitoring' | 'drilldown'>('admissions');
  const [selectedStudent, setSelectedStudent] = useState<typeof AT_RISK_STUDENTS[0] | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['admissions', 'monitoring', 'drilldown'] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${subTab === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {t === 'drilldown' ? '360° Profile' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {subTab === 'admissions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Enquiries', value: ADMISSIONS_DATA.enquiries, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Admitted', value: ADMISSIONS_DATA.converted, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Pending', value: ADMISSIONS_DATA.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Conversion Rate', value: `${ADMISSIONS_DATA.conversionRate}%`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map(s => (
              <Card key={s.label} className="border-none shadow-sm ring-1 ring-slate-100">
                <CardContent className={`p-4 ${s.bg} rounded-xl`}>
                  <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Admissions Funnel</h3>
                <div className="space-y-2">
                  {ADMISSIONS_DATA.funnel.map((stage, idx) => {
                    const pct = (stage.count / ADMISSIONS_DATA.funnel[0].count) * 100;
                    return (
                      <div key={stage.stage} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-600">{stage.stage}</span>
                          <span className="font-bold text-slate-800">{stage.count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-6 bg-slate-100 rounded overflow-hidden">
                          <div className="h-full rounded flex items-center justify-end pr-2 transition-all" style={{ width: `${pct}%`, backgroundColor: stage.fill }}>
                            {idx < 3 && <span className="text-white text-[10px] font-bold">{Math.round(pct)}%</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Monthly Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={ADMISSION_MONTHLY} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="enquiries" fill="#93c5fd" name="Enquiries" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="admissions" fill="#3b82f6" name="Admitted" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Source-wise Enquiries vs Admissions</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={ADMISSIONS_DATA.bySource} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="source" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="enquiries" fill="#a5b4fc" name="Enquiries" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="converted" fill="#6366f1" name="Admitted" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Admission Source Mix</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={ADMISSIONS_DATA.bySource.map(s => ({ name: s.source, value: s.converted }))}
                      cx="50%" cy="50%" outerRadius={65} paddingAngle={3} dataKey="value"
                      label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}
                    >
                      {ADMISSIONS_DATA.bySource.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {subTab === 'monitoring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Headcount', value: STUDENT_HEADCOUNT.total.toLocaleString(), color: 'text-blue-600' },
              { label: 'Boys', value: STUDENT_HEADCOUNT.boys, color: 'text-indigo-600' },
              { label: 'Girls', value: STUDENT_HEADCOUNT.girls, color: 'text-pink-600' },
              { label: 'Avg Attendance', value: `${OVERVIEW_KPIS.attendanceStability.value}%`, color: 'text-emerald-600' },
            ].map(s => (
              <Card key={s.label} className="border-none shadow-sm ring-1 ring-slate-100"><CardContent className="p-4"><p className="text-xs text-slate-500 mb-1">{s.label}</p><p className={`text-2xl font-black ${s.color}`}>{s.value}</p></CardContent></Card>
            ))}
          </div>

          <Card className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Attendance by Grade</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ATTENDANCE_BY_GRADE} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="grade" tick={{ fontSize: 9 }} />
                  <YAxis domain={[75, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Attendance']} contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="pct" fill="#6366f1" radius={[3, 3, 0, 0]} name="Attendance">
                    {ATTENDANCE_BY_GRADE.map((entry, idx) => (
                      <Cell key={idx} fill={entry.pct < 85 ? '#ef4444' : entry.pct < 88 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Academic Performance by Subject</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ACADEMIC_PERFORMANCE} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subject" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="avg" fill="#6366f1" name="Class Avg %" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pass" fill="#10b981" name="Pass Rate %" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Grade-wise Student Headcount</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={STUDENT_HEADCOUNT.byGrade} barSize={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="grade" tick={{ fontSize: 8 }} tickFormatter={v => v.replace('Grade ', 'G')} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="boys" stackId="a" fill="#6366f1" name="Boys" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="girls" stackId="a" fill="#ec4899" name="Girls" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Monthly Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ATTENDANCE_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis domain={[80, 95]} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ fontSize: 11 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Avg Attendance %" />
                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target 90%" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">At-Risk Students</h3>
                <Badge className="bg-red-100 text-red-700 border-none">{AT_RISK_STUDENTS.length} flagged</Badge>
              </div>
              <div className="space-y-2">
                {AT_RISK_STUDENTS.map(s => (
                  <div key={s.id} onClick={() => setSelectedStudent(s)} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${s.severity === 'high' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.severity === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">{s.name} <span className="text-slate-400 font-normal">· {s.grade}</span></p>
                      <p className="text-xs text-slate-500">{s.issue}</p>
                    </div>
                    <div className="text-right"><p className={`text-xs font-bold ${s.attendance < 70 ? 'text-red-600' : 'text-amber-600'}`}>{s.attendance}%</p><p className="text-[10px] text-slate-400">Attendance</p></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {subTab === 'drilldown' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg">
                  {STUDENT_360.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{STUDENT_360.name}</h3>
                  <p className="text-xs text-slate-500">{STUDENT_360.grade} · Roll: {STUDENT_360.rollNo}</p>
                  <p className="text-xs text-slate-400">{STUDENT_360.dob} · {STUDENT_360.gender} · {STUDENT_360.caste}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500">Parent: {STUDENT_360.parent}</p>
                <p className="text-xs text-blue-600">{STUDENT_360.phone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Attendance', value: `${STUDENT_360.attendance}%`, color: 'text-emerald-600', good: true },
              { label: 'Academic Avg', value: `${STUDENT_360.academicAvg}%`, color: 'text-indigo-600', good: true },
              { label: 'Fees Paid', value: fmt(STUDENT_360.feesPaid), color: 'text-blue-600', good: true },
              { label: 'Fees Due', value: fmt(STUDENT_360.feesDue), color: 'text-orange-600', good: false },
            ].map(s => (
              <Card key={s.label} className="border-none shadow-sm ring-1 ring-slate-100"><CardContent className="p-3"><p className="text-xs text-slate-500">{s.label}</p><p className={`text-xl font-black ${s.color}`}>{s.value}</p></CardContent></Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Subject Performance</h3>
                <div className="space-y-2">
                  {STUDENT_360.subjects.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 w-20">{s.name}</span>
                      <Progress value={s.score} className="flex-1 h-2" />
                      <span className={`text-xs font-bold w-8 text-right ${s.score < 50 ? 'text-red-600' : s.score < 70 ? 'text-amber-600' : 'text-emerald-600'}`}>{s.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Last 5 Communications</h3>
                <div className="space-y-2">
                  {STUDENT_360.lastCommunications.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Badge className="bg-blue-50 text-blue-700 border-none text-[10px] flex-shrink-0">{c.type}</Badge>
                      <div><p className="text-xs text-slate-700">{c.note}</p><p className="text-[10px] text-slate-400">{c.date}</p></div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Achievements</h3>
                  {STUDENT_360.achievements.map((a, i) => <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600"><Star className="h-3 w-3 text-amber-400" />{a}</div>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Student Risk — {selectedStudent?.name}</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-3 py-2">
              <div className={`p-3 rounded-lg ${selectedStudent.severity === 'high' ? 'bg-red-50' : 'bg-amber-50'}`}>
                <p className="text-xs font-bold text-slate-700">{selectedStudent.grade}</p>
                <p className="text-xs text-slate-600 mt-1">{selectedStudent.issue}</p>
                <p className="text-xs font-bold mt-1">Attendance: {selectedStudent.attendance}%</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"><Phone className="h-3 w-3 mr-1" />Contact Parent</Button>
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs"><Mail className="h-3 w-3 mr-1" />Send Notice</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StaffAnalyticsSection = () => {
  const [subTab, setSubTab] = useState<'overview' | 'drilldown'>('overview');

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['overview', 'drilldown'] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${subTab === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {t === 'drilldown' ? 'Individual Profile' : 'Institutional Overview'}
          </button>
        ))}
      </div>

      {subTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Staff', value: STAFF_DATA.total, color: 'text-blue-600' },
              { label: 'Teaching', value: STAFF_DATA.teaching, color: 'text-indigo-600' },
              { label: 'Non-Teaching', value: STAFF_DATA.nonTeaching, color: 'text-purple-600' },
              { label: 'Staff Attendance', value: '94.2%', color: 'text-emerald-600' },
            ].map(s => (
              <Card key={s.label} className="border-none shadow-sm ring-1 ring-slate-100"><CardContent className="p-4"><p className="text-xs text-slate-500 mb-1">{s.label}</p><p className={`text-2xl font-black ${s.color}`}>{s.value}</p></CardContent></Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Department-wise Headcount</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={STAFF_DATA.byDept} layout="vertical" barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="dept" type="category" width={100} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 3, 3, 0]} name="Staff Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Punctuality Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={STAFF_DATA.punctualityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis domain={[85, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="onTime" stroke="#10b981" fill="#d1fae5" name="On Time %" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Late-comer Frequency (May 2026)</h3>
                <div className="space-y-2.5">
                  {STAFF_DATA.lateComers.map(l => (
                    <div key={l.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">{l.lateCount}</div>
                      <div className="flex-1"><p className="text-xs font-semibold text-slate-700">{l.name}</p><p className="text-xs text-slate-400">{l.dept} · Avg arrival: {l.avg}</p></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Awards & Achievements</h3>
                <div className="space-y-2.5">
                  {STAFF_DATA.awards.map(a => (
                    <div key={a.name} className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div><p className="text-xs font-semibold text-slate-700">{a.name}</p><p className="text-xs text-slate-500">{a.dept} · {a.award}</p></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Staff Type Distribution</h3>
                <p className="text-xs text-slate-400 mb-2">Teaching: {STAFF_DATA.teaching} · Non-Teaching: {STAFF_DATA.nonTeaching}</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={STAFF_TYPE_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={4} dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`} labelLine={true}>
                      {STAFF_TYPE_PIE.map((_, idx) => <Cell key={idx} fill={['#3b82f6', '#8b5cf6'][idx]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Staff Gender Distribution</h3>
                <p className="text-xs text-slate-400 mb-2">Male: {STAFF_DATA.male} · Female: {STAFF_DATA.female}</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={STAFF_GENDER_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={4} dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`} labelLine={true}>
                      {STAFF_GENDER_PIE.map((_, idx) => <Cell key={idx} fill={['#0ea5e9', '#f472b6'][idx]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {subTab === 'drilldown' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg">RS</div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{STAFF_INDIVIDUAL.name}</h3>
                  <p className="text-xs text-slate-500">{STAFF_INDIVIDUAL.role} · {STAFF_INDIVIDUAL.dept}</p>
                  <p className="text-xs text-slate-400">DOJ: {STAFF_INDIVIDUAL.doj} · {STAFF_INDIVIDUAL.experience}</p>
                </div>
              </div>
              <div className="text-right"><p className="text-sm font-bold text-slate-700">{STAFF_INDIVIDUAL.salary}</p><p className="text-xs text-slate-400">{STAFF_INDIVIDUAL.phone}</p></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Attendance', value: `${STAFF_INDIVIDUAL.attendance}%`, color: 'text-emerald-600' },
              { label: 'Late Count', value: STAFF_INDIVIDUAL.lateCount, color: 'text-amber-600' },
              { label: 'Lesson Plan', value: `${STAFF_INDIVIDUAL.lessonPlanCompletion}%`, color: 'text-blue-600' },
              { label: 'LOP Days', value: STAFF_INDIVIDUAL.leaves.LOP, color: 'text-orange-600' },
            ].map(s => (
              <Card key={s.label} className="border-none shadow-sm ring-1 ring-slate-100"><CardContent className="p-3"><p className="text-xs text-slate-500">{s.label}</p><p className={`text-xl font-black ${s.color}`}>{s.value}</p></CardContent></Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Appraisal — Year on Year</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={STAFF_INDIVIDUAL.appraisal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Teaching Effectiveness</h3>
                <div className="space-y-2.5">
                  {STAFF_INDIVIDUAL.teachingOutcomes.map(t => (
                    <div key={t.subject}>
                      <div className="flex justify-between text-xs mb-1"><span className="text-slate-600">{t.subject}</span><span className="font-bold text-slate-700">{t.avgScore}%</span></div>
                      <Progress value={t.avgScore} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const FinanceSection = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: 'Annual Demand', value: fmt(FINANCE.annualDemand), color: 'text-slate-700' },
        { label: 'Total Collected', value: fmt(FINANCE.totalCollected), color: 'text-emerald-600' },
        { label: 'Outstanding', value: fmt(FINANCE.outstanding), color: 'text-red-600' },
        { label: 'Recovery Rate', value: `${FINANCE.collectionRate}%`, color: 'text-blue-600' },
      ].map(s => (
        <Card key={s.label} className="border-none shadow-sm ring-1 ring-slate-100"><CardContent className="p-4"><p className="text-xs text-slate-500 mb-1">{s.label}</p><p className={`text-xl font-black ${s.color}`}>{s.value}</p></CardContent></Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Monthly Demand vs Collection</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FINANCE.monthlyCollection} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => [fmt(Number(v))]} contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="demand" fill="#bfdbfe" name="Demand" radius={[3, 3, 0, 0]} />
              <Bar dataKey="collected" fill="#3b82f6" name="Collected" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Today's Collection by Mode</h3>
          <p className="text-xs text-slate-400 mb-2">May 7, 2026 · Total: {fmt(FINANCE.todayCollection.total)}</p>
          <ResponsiveContainer width="100%" height={185}>
            <PieChart>
              <Pie data={COLLECTION_MODE_PIE} cx="50%" cy="50%" outerRadius={68} paddingAngle={3} dataKey="value"
                label={({ name, percent }) => `${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                {COLLECTION_MODE_PIE.map((_, idx) => <Cell key={idx} fill={['#3b82f6', '#10b981', '#f59e0b'][idx]} />)}
              </Pie>
              <Tooltip formatter={(v) => [fmt(Number(v))]} contentStyle={{ fontSize: 11 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Outstanding Dues by Grade</h3>
            <Button variant="outline" size="sm" className="h-7 text-xs"><Download className="h-3 w-3 mr-1" />Export</Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FINANCE.outstandingByGrade} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 9 }} />
              <YAxis dataKey="grade" type="category" width={64} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => [fmt(Number(v)), 'Outstanding']} contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="amount" fill="#ef4444" radius={[0, 3, 3, 0]} name="Outstanding">
                {FINANCE.outstandingByGrade.map((_, idx) => (
                  <Cell key={idx} fill={['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'][idx]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Fee Adjustments Summary</h3>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={[
              { name: 'Concessions', amount: FINANCE.concessions },
              { name: 'Cancellations', amount: FINANCE.cancellations },
              { name: 'Refunds', amount: FINANCE.refunds },
            ]} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => [fmt(Number(v))]} contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {[0, 1, 2].map(idx => <Cell key={idx} fill={['#3b82f6', '#f59e0b', '#8b5cf6'][idx]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            {[['Concessions', fmt(FINANCE.concessions), 'text-blue-600'], ['Cancellations', fmt(FINANCE.cancellations), 'text-amber-600'], ['Refunds', fmt(FINANCE.refunds), 'text-purple-600']].map(([l, v, c]) => (
              <div key={l as string}><p className={`text-sm font-black ${c}`}>{v}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const CommunicationsSection = () => {
  const [actions, setActions] = useState<Record<string, 'approved' | 'rejected'>>({});

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">Pending Approvals ({PENDING_APPROVALS.length})</h3>
          <div className="space-y-2">
            {PENDING_APPROVALS.map(pa => (
              <Card key={pa.id} className={`border-none shadow-sm ring-1 ${pa.urgency === 'high' ? 'ring-amber-200 bg-amber-50/30' : 'ring-slate-100'}`}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] border-none ${pa.type === 'Leave' ? 'bg-blue-100 text-blue-700' : pa.type === 'Finance' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{pa.type}</Badge>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{pa.requestor}</p>
                        <p className="text-xs text-slate-500">{pa.detail}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {actions[pa.id] ? (
                        <Badge className={`text-[10px] border-none ${actions[pa.id] === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{actions[pa.id] === 'approved' ? '✓ Done' : '✗ Declined'}</Badge>
                      ) : (
                        <>
                          <button onClick={() => setActions(a => ({ ...a, [pa.id]: 'approved' }))} className="w-6 h-6 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center"><CheckCircle2 className="h-3 w-3" /></button>
                          <button onClick={() => setActions(a => ({ ...a, [pa.id]: 'rejected' }))} className="w-6 h-6 rounded bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center"><XCircle className="h-3 w-3" /></button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">Last 5 Communications</h3>
          <div className="space-y-2">
            {COMMUNICATIONS.map(c => (
              <Card key={c.id} className="border-none shadow-sm ring-1 ring-slate-100">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Badge className={`text-[10px] border-none flex-shrink-0 ${c.type === 'SMS' ? 'bg-green-100 text-green-700' : c.type === 'Email' ? 'bg-blue-100 text-blue-700' : c.type === 'App' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{c.type}</Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{c.subject}</p>
                      <p className="text-xs text-slate-400">To: {c.to} · {c.sent} recipients · {c.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertsSection = () => {
  const [actions, setActions] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const priorityStyle = { critical: 'border-red-200 bg-red-50/50', high: 'border-amber-200 bg-amber-50/50', medium: 'border-blue-200 bg-blue-50/30', low: 'border-slate-200 bg-slate-50/50' };
  const priorityBadge = { critical: 'bg-red-100 text-red-700', high: 'bg-amber-100 text-amber-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-slate-100 text-slate-600' };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {[{ label: 'Critical', count: ALERTS.filter(a => a.priority === 'critical').length, color: 'bg-red-100 text-red-700' }, { label: 'High', count: ALERTS.filter(a => a.priority === 'high').length, color: 'bg-amber-100 text-amber-700' }, { label: 'Medium', count: ALERTS.filter(a => a.priority === 'medium').length, color: 'bg-blue-100 text-blue-700' }, { label: 'Low', count: ALERTS.filter(a => a.priority === 'low').length, color: 'bg-slate-100 text-slate-600' }].map(p => (
          <span key={p.label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${p.color}`}>{p.label} <span className="font-black">{p.count}</span></span>
        ))}
      </div>

      {ALERTS.map(alert => (
        <Card key={alert.id} className={`border shadow-sm ${(priorityStyle as any)[alert.priority]}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl flex-shrink-0">{alert.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[10px] border-none ${(priorityBadge as any)[alert.priority]}`}>{alert.priority.toUpperCase()}</Badge>
                    <Badge className="bg-slate-100 text-slate-600 border-none text-[10px]">{alert.category}</Badge>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{alert.detail}</p>
                  {expanded === alert.id && (
                    <div className="mt-2 p-2 bg-white rounded border border-slate-200">
                      <p className="text-xs font-semibold text-slate-600">Root Cause:</p>
                      <p className="text-xs text-slate-500">{alert.rootCause}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {actions[alert.id] ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-none text-xs">Action taken</Badge>
                ) : (
                  <>
                    <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActions(a => ({ ...a, [alert.id]: 'done' }))}><Zap className="h-3 w-3 mr-1" />Take Action</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setExpanded(e => e === alert.id ? null : alert.id)}>
                      <Eye className="h-3 w-3 mr-1" />{expanded === alert.id ? 'Hide' : 'Root Cause'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

type Tab = 'overview' | 'students' | 'staff' | 'finance' | 'communications' | 'alerts';

const TABS: { id: Tab; label: string; icon: any; badge?: number; color: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
  { id: 'students', label: 'Student Analytics', icon: GraduationCap, color: 'from-indigo-500 to-indigo-600' },
  { id: 'staff', label: 'Staff Analytics', icon: Users, color: 'from-purple-500 to-purple-600' },
  { id: 'finance', label: 'Finance', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
  { id: 'communications', label: 'Approvals & Comm.', icon: MessageSquare, badge: 5, color: 'from-amber-500 to-amber-600' },
  { id: 'alerts', label: 'Alerts & Actions', icon: Bell, badge: ALERTS.filter(a => a.priority === 'critical' || a.priority === 'high').length, color: 'from-red-500 to-red-600' },
];

export default function PrincipalDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const current = TABS.find(t => t.id === activeTab)!;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection />;
      case 'students': return <StudentAnalyticsSection />;
      case 'staff': return <StaffAnalyticsSection />;
      case 'finance': return <FinanceSection />;
      case 'communications': return <CommunicationsSection />;
      case 'alerts': return <AlertsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-slate-50/50" />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => navigate('/')}>
                <Home className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-md shadow-indigo-500/20">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Principal Console</h1>
                <p className="text-slate-500 text-xs">{INSTITUTION.name} · {INSTITUTION.code} · FY {INSTITUTION.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
                <Activity className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-semibold">Live Data</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs"><Download className="h-3 w-3 mr-1" />Export</Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative">
                <Bell className="h-4 w-4 text-slate-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'}`}>
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'}`}>{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5">
        <div className="mb-4">
          <SectionHeader icon={current.icon} title={current.label} subtitle={`${INSTITUTION.name} · Real-time institutional intelligence`} color={current.color} />
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
