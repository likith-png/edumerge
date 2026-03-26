import React, { useState, useCallback } from 'react';
import {
  Users, UserCheck, UserX, Calendar, DollarSign, Clock, TrendingUp, TrendingDown,
  Activity, AlertTriangle, CheckCircle2, XCircle,
  Plus, X, GripVertical, RefreshCw,
  Building2, BookOpen, Target, Briefcase, LogOut, Bell, Search,
  Circle, Zap, Shield, FileCheck, Users2,
  LayoutGrid, Table2, Layers, MapPin,
  AlertCircle, ArrowRight, Award, Flag, UserMinus, CalendarDays, BarChart3
} from 'lucide-react';
import {
  LineChart as ReLineChart, Line,
  BarChart as ReBarChart, Bar,
  PieChart as RePieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  rectSortingStrategy, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../contexts/PersonaContext';

// ─── Design System: "The Digital Registrar" ─────────────────────────────────
const DS = {
  bg: '#f8f9ff',
  bgLow: '#eff4ff',
  bgCard: '#ffffff',
  bgDim: '#e4ebfa',
  bgHigh: '#dce6f7',
  primary: '#003f98',
  primaryAlt: '#1a56be',
  primaryGrad: 'linear-gradient(135deg, #003f98 0%, #1a56be 100%)',
  onPrimary: '#ffffff',
  amber: '#fe9b01',
  amberBg: '#fff8ec',
  text: '#0b1c30',
  text2: '#445579',
  text3: '#7c8fac',
  border: 'rgba(194,208,232,0.40)',
  shadow: '0 8px 24px rgba(11,28,48,0.06)',
  shadowSm: '0 2px 8px rgba(11,28,48,0.04)',
  success: '#1a7f4b', successBg: '#e8f8f0',
  error: '#c62828', errorBg: '#fde8e8',
  warning: '#b45309', warningBg: '#fef3e2',
  zone1: '#b45309', zone1Bg: '#fffaf0',
  zone2: '#003f98', zone2Bg: '#f0f4ff',
  zone3: '#5b21b6', zone3Bg: '#f5f0ff',
  blue: '#3b82f6', blueBg: '#eff6ff',
  teal: '#0d9488', tealBg: '#f0fdfa',
  pink: '#db2777', pinkBg: '#fdf2f8',
  purple: '#7c3aed', purpleBg: '#f5f3ff',
};

// ─── Types ───────────────────────────────────────────────────────────────────
type DashboardRole = 'HR_MANAGER' | 'PRINCIPAL' | 'CHAIRMAN' | 'FINANCE';
type ViewMode = 'zone' | 'grid';
type Period = 'today' | 'mtd' | 'ytd';
type WidgetCategory = 'workforce' | 'hr_ops' | 'talent' | 'goi' | 'utility';
type ChartTypeOption = 'kpi_card' | 'horizontal_bar' | 'donut' | 'line' | 'area' | 'bar' | 'table' | 'step_tracker' | 'action_list' | 'heatmap' | 'funnel' | 'feed' | 'alert_banner' | 'status_matrix' | 'campus_table' | 'grouped_bar' | 'stacked_bar' | 'calendar';

interface WidgetMeta {
  id: string; name: string; category: WidgetCategory; description: string;
  defaultChartType: ChartTypeOption; availableChartTypes: ChartTypeOption[];
  sourceModule: string; roles: DashboardRole[]; context: 'both' | 'goi';
  icon: React.ElementType; colSpan?: number;
}
interface LayoutItem { widgetId: string; position: number; chartType: ChartTypeOption; colSpan: number; }

// ─── Mock Data ───────────────────────────────────────────────────────────────
const ATTENDANCE_TREND = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  present: 1050 + Math.floor(Math.sin(i / 3) * 80 + (i % 7) * 5),
  absent: 180 + Math.floor(Math.cos(i / 3) * 30 + (i % 5) * 3),
}));

const LEAVE_BREAKDOWN = [
  { type: 'Casual', count: 34, color: DS.primary },
  { type: 'Sick', count: 28, color: DS.success },
  { type: 'Earned', count: 19, color: DS.purple },
  { type: 'LOP', count: 12, color: DS.error },
  { type: 'Maternity', count: 4, color: DS.pink },
  { type: 'Paternity', count: 2, color: DS.teal },
];

const LD_COMPLETION = [
  { dept: 'Science', completed: 78 }, { dept: 'Maths', completed: 65 },
  { dept: 'English', completed: 90 }, { dept: 'Commerce', completed: 55 }, { dept: 'Admin', completed: 82 },
];

const APPRAISAL_DONUT = [
  { name: 'Completed', value: 68, color: DS.success },
  { name: 'In Progress', value: 22, color: DS.amber },
  { name: 'Not Started', value: 10, color: DS.text3 },
];

const PENDING_APPROVALS_DATA = [
  { id: 1, name: 'Priya Sharma', type: 'Casual Leave', days: 2, ago: '1d ago', stale: false },
  { id: 2, name: 'Ravi Kumar', type: 'Sick Leave', days: 3, ago: '4d ago', stale: true },
  { id: 3, name: 'Anita Singh', type: 'Earned Leave', days: 5, ago: '2d ago', stale: false },
  { id: 4, name: 'Mohan Das', type: 'LOP', days: 1, ago: '5d ago', stale: true },
  { id: 5, name: 'Sunita Rao', type: 'Casual Leave', days: 1, ago: '1d ago', stale: false },
];

const PROBATION_EXPIRY_DATA = [
  { id: 1, name: 'Kavita Nair', dept: 'Science', daysLeft: 5, band: 'critical' },
  { id: 2, name: 'Arjun Mehta', dept: 'Maths', daysLeft: 12, band: 'warning' },
  { id: 3, name: 'Sneha Patel', dept: 'Commerce', daysLeft: 18, band: 'warning' },
  { id: 4, name: 'Rahul Joshi', dept: 'English', daysLeft: 25, band: 'extended' },
];

const PAYROLL_STEPS = [
  { label: 'Attendance locked', status: 'done' as const },
  { label: 'Leave data synced', status: 'done' as const },
  { label: 'LOP validated (47 days)', status: 'done' as const },
  { label: 'Statutory computation', status: 'in_progress' as const },
  { label: 'Finance approval', status: 'blocked' as const },
  { label: 'Bank disbursement', status: 'waiting' as const },
];

const ONBOARDING_STAGES = [
  { stage: 'Offer Accepted', count: 8 }, { stage: 'Docs Submitted', count: 6 },
  { stage: 'BGV In Progress', count: 4 }, { stage: 'Induction Done', count: 3 }, { stage: 'System Access', count: 2 },
];

const EXIT_FUNNEL = [
  { stage: 'Notice Period', count: 12 }, { stage: 'NOC Pending', count: 8 },
  { stage: 'Clearance', count: 6 }, { stage: 'Settlement', count: 3 },
];

const DEPT_HEATMAP_DATA = [
  { dept: 'Science', CL: 3, SL: 1, EL: 5, LOP: 2, UAL: 1 },
  { dept: 'Maths', CL: 1, SL: 3, EL: 2, LOP: 4, UAL: 0 },
  { dept: 'English', CL: 5, SL: 2, EL: 1, LOP: 3, UAL: 2 },
  { dept: 'Commerce', CL: 2, SL: 4, EL: 3, LOP: 1, UAL: 0 },
  { dept: 'Admin', CL: 1, SL: 1, EL: 2, LOP: 2, UAL: 3 },
  { dept: 'PE', CL: 0, SL: 2, EL: 1, LOP: 0, UAL: 1 },
  { dept: 'Arts', CL: 3, SL: 0, EL: 2, LOP: 1, UAL: 0 },
];

const GOI_CAMPUS_DATA = [
  { name: "St. Xavier's", type: 'K-12', staff: 187, present: 160, onLeave: 22, lop: 8, payroll: 'Ready', health: 92 },
  { name: 'Holy Cross', type: 'Higher', staff: 234, present: 196, onLeave: 31, lop: 12, payroll: 'Blocked', health: 58 },
  { name: 'Delhi Public', type: 'K-12', staff: 156, present: 140, onLeave: 14, lop: 4, payroll: 'Ready', health: 88 },
  { name: 'Presidency', type: 'Higher', staff: 298, present: 244, onLeave: 42, lop: 14, payroll: 'In Progress', health: 74 },
  { name: 'Bishop Cotton', type: 'K-12', staff: 142, present: 118, onLeave: 19, lop: 7, payroll: 'Ready', health: 81 },
];

const ACTIVITY_FEED_DATA = [
  { id: 1, text: "Ravi Naik's leave approved by HOD", time: '2m ago', type: 'success' as const },
  { id: 2, text: 'Holy Cross payroll blocked — finance pending', time: '18m ago', type: 'error' as const },
  { id: 3, text: 'Kavya Rao onboarding complete', time: '1h ago', type: 'teal' as const },
  { id: 4, text: '9 approvals auto-escalated to HR Admin', time: '2h ago', type: 'warning' as const },
  { id: 5, text: 'Sunita More LOP rejected by manager', time: '3h ago', type: 'error' as const },
  { id: 6, text: 'Appraisal cycle Q1 2026 launched', time: '5h ago', type: 'purple' as const },
];

const STATUTORY_STATUS = [
  { name: 'PF', status: 'filed', label: 'Filed' }, { name: 'ESI', status: 'filed', label: 'Filed' },
  { name: 'TDS', status: 'pending', label: 'Due 31 Mar' }, { name: 'PT', status: 'filed', label: 'Filed' },
  { name: 'Gratuity', status: 'warning', label: 'Review' }, { name: 'Bonus', status: 'pending', label: 'Pending' },
];

const KPI_WIDGETS_DATA: Record<string, { value: string; delta: string; deltaType: 'up' | 'down' | 'warn'; icon: React.ElementType }> = {
  WGT_HEADCOUNT: { value: '1,284', delta: '↑ 12 this month', deltaType: 'up', icon: Users },
  WGT_PRESENT_TODAY: { value: '1,087', delta: '84.7% attendance', deltaType: 'up', icon: UserCheck },
  WGT_ABSENT_TODAY: { value: '197', delta: '↑ 23 vs yesterday', deltaType: 'down', icon: UserX },
  WGT_LOP_MTD: { value: '47 days', delta: '↑ 8 vs last month', deltaType: 'warn', icon: DollarSign },
  WGT_PAYROLL_SUMMARY: { value: '₹ 2.4 Cr', delta: '↓ 1.2% vs last month', deltaType: 'up', icon: DollarSign },
  WGT_OPEN_POSITIONS: { value: '18', delta: '5 urgent', deltaType: 'warn', icon: Users2 },
  WGT_ATTRITION_RATE: { value: '6.2%', delta: '↑ 0.8% YTD', deltaType: 'down', icon: TrendingDown },
};

// ─── New spec data ─────────────────────────────────────────────────────────
const WORKFORCE_BY_STAFF_TYPE = [
  { type: 'Teaching (PRT/TGT/PGT)', count: 782, active: 748, onLeave: 34, color: DS.primary },
  { type: 'Non-Teaching', count: 312, active: 298, onLeave: 14, color: DS.teal },
  { type: 'Visiting / Adjunct', count: 124, active: 101, onLeave: 23, color: DS.purple },
  { type: 'Contract / Outsourced', count: 66, active: 60, onLeave: 6, color: DS.amber },
];

const DEADLINE_CHECKLIST = [
  { id: 1, label: 'Lock March attendance by EOD', urgency: 'critical', due: 'Today', done: false },
  { id: 2, label: 'Submit PF remittance — ₹12.4L', urgency: 'critical', due: 'Tomorrow', done: false },
  { id: 3, label: 'TDS Q4 provisional filing', urgency: 'high', due: '28 Mar', done: false },
  { id: 4, label: 'Confirm Q4 appraisal ratings (68/124 pending)', urgency: 'high', due: '31 Mar', done: false },
  { id: 5, label: 'Issue 14 probation confirmation letters', urgency: 'medium', due: '2 Apr', done: true },
  { id: 6, label: 'Upload ESI challan for March', urgency: 'medium', due: '15 Apr', done: false },
];

const ON_LEAVE_BY_DEPT = [
  { dept: 'Science', count: 8, type: 'CL+SL' },
  { dept: 'Maths', count: 5, type: 'EL' },
  { dept: 'English', count: 7, type: 'CL' },
  { dept: 'Commerce', count: 4, type: 'SL' },
  { dept: 'Admin', count: 6, type: 'CL+LOP' },
  { dept: 'PE', count: 3, type: 'EL' },
];

const LEAVE_CONSUMPTION_MTD = [
  { type: 'Casual Leave', teaching: 34, nonTeaching: 12, contract: 4 },
  { type: 'Sick Leave', teaching: 28, nonTeaching: 8, contract: 3 },
  { type: 'Earned Leave', teaching: 19, nonTeaching: 6, contract: 1 },
  { type: 'LOP', teaching: 12, nonTeaching: 5, contract: 2 },
  { type: 'Maternity', teaching: 4, nonTeaching: 1, contract: 0 },
  { type: 'UAL', teaching: 3, nonTeaching: 2, contract: 1 },
];

const GROUP_KPI_DATA = [
  { label: 'Total Headcount', value: '1,284', delta: '+12', dir: 'up', icon: Users },
  { label: 'Group Attendance', value: '84.7%', delta: '+1.2%', dir: 'up', icon: UserCheck },
  { label: 'Attrition Rate YTD', value: '6.2%', delta: '+0.8%', dir: 'down', icon: TrendingDown },
  { label: 'Payroll Cost MTD', value: '₹2.4 Cr', delta: '-1.2%', dir: 'up', icon: DollarSign },
  { label: 'Open Positions', value: '18', delta: '5 urgent', dir: 'warn', icon: Briefcase },
];

const PAYROLL_STATUS_MATRIX = [
  { campus: "St. Xavier's", attendance: 'done', leave: 'done', lop: 'done', statutory: 'done', finance: 'ready' },
  { campus: 'Holy Cross', attendance: 'done', leave: 'done', lop: 'pending', statutory: 'in_progress', finance: 'blocked' },
  { campus: 'Delhi Public', attendance: 'done', leave: 'done', lop: 'done', statutory: 'done', finance: 'ready' },
  { campus: 'Presidency', attendance: 'done', leave: 'pending', lop: 'pending', statutory: 'pending', finance: 'pending' },
  { campus: 'Bishop Cotton', attendance: 'done', leave: 'done', lop: 'done', statutory: 'in_progress', finance: 'ready' },
];

const DEPT_COVERAGE_DATA = [
  { dept: 'Science', classes: 12, substituted: 10, pending: 2, coverage: 83 },
  { dept: 'Maths', classes: 10, substituted: 10, pending: 0, coverage: 100 },
  { dept: 'English', classes: 8, substituted: 6, pending: 2, coverage: 75 },
  { dept: 'Commerce', classes: 6, substituted: 5, pending: 1, coverage: 83 },
  { dept: 'Admin', classes: 4, substituted: 4, pending: 0, coverage: 100 },
  { dept: 'PE', classes: 4, substituted: 3, pending: 1, coverage: 75 },
  { dept: 'Arts', classes: 3, substituted: 3, pending: 0, coverage: 100 },
];

const UNSUBSTITUTED_CLASSES = [
  { period: '2nd Period 09:45', subject: 'Physics — Grade 11A', teacher: 'Mr. Rao (on leave)', room: 'Lab 3' },
  { period: '4th Period 11:30', subject: 'English Lit — Grade 10B', teacher: 'Ms. Priya (absent)', room: 'Room 14' },
];

// ─── Extended Mock Data ────────────────────────────────────────────────────────
const UAL_TRACKER_DATA = [
  { name: 'Suresh Menon', dept: 'Science', grade: 'TGT', since: '2d', escalated: false },
  { name: 'Deepa Pillai', dept: 'Commerce', grade: 'PRT', since: '1d', escalated: false },
  { name: 'Rajesh Varma', dept: 'Admin', grade: 'NT', since: '3d', escalated: true },
  { name: 'Meena Nair', dept: 'English', grade: 'PGT', since: '1d', escalated: false },
];

const HEADCOUNT_SUMMARY_DATA = [
  { type: 'Teaching PRT', sanctioned: 180, actual: 164, gap: 16 },
  { type: 'Teaching TGT', sanctioned: 220, actual: 208, gap: 12 },
  { type: 'Teaching PGT', sanctioned: 160, actual: 155, gap: 5 },
  { type: 'Non-Teaching', sanctioned: 320, actual: 312, gap: 8 },
  { type: 'Visiting', sanctioned: 140, actual: 124, gap: 16 },
  { type: 'Contract', sanctioned: 80, actual: 66, gap: 14 },
];

const TA_FUNNEL_DATA = [
  { stage: 'Open Positions', count: 47, color: DS.primary },
  { stage: 'Applications', count: 312, color: DS.primaryAlt },
  { stage: 'Screening', count: 84, color: DS.teal },
  { stage: 'Interviews', count: 38, color: DS.amber },
  { stage: 'Offers Made', count: 14, color: DS.warning },
  { stage: 'Joined', count: 9, color: DS.success },
];

const VISITING_194J_DATA = [
  { name: 'Dr. Krishnan R', subject: 'Physics', sessions: 18, tdsDeducted: true, form26Q: true, compliance: 'ok' },
  { name: 'Prof. Sheela M', subject: 'Chemistry', sessions: 14, tdsDeducted: true, form26Q: false, compliance: 'warn' },
  { name: 'Mr. Arun T', subject: 'Maths', sessions: 22, tdsDeducted: false, form26Q: false, compliance: 'error' },
  { name: 'Dr. Lakshmi V', subject: 'English', sessions: 10, tdsDeducted: true, form26Q: true, compliance: 'ok' },
  { name: 'Prof. Balu S', subject: 'Commerce', sessions: 8, tdsDeducted: false, form26Q: false, compliance: 'error' },
];

const FF_STATUS_DATA = [
  { name: 'Anand Kumar', dept: 'Science', lwd: '10 Mar', fnfStatus: 'Settled', days: 5 },
  { name: 'Preethi Nair', dept: 'Admin', lwd: '15 Mar', fnfStatus: 'Pending', days: 15 },
  { name: 'Sunil Varma', dept: 'Commerce', lwd: '20 Mar', fnfStatus: 'Pending', days: 6 },
  { name: 'Kavitha Rao', dept: 'English', lwd: '01 Mar', fnfStatus: 'Overdue', days: 31 },
];

const ONBOARDING_SLA_DATA = [
  { name: 'Rohan Shah', item: 'IT Setup', daysOverdue: 5, type: 'Teaching' },
  { name: 'Nisha Patel', item: 'BGV Initiation', daysOverdue: 3, type: 'Non-Teaching' },
  { name: 'Arjun S', item: 'HOD Induction', daysOverdue: 7, type: 'Teaching' },
  { name: 'Sunita K', item: 'PF Nomination', daysOverdue: 2, type: 'Contract' },
];

const ATTRITION_TREND_12M = [
  { month: 'Apr', rate: 4.8, voluntary: 3.2, involuntary: 1.6 },
  { month: 'May', rate: 5.1, voluntary: 3.8, involuntary: 1.3 },
  { month: 'Jun', rate: 5.4, voluntary: 4.0, involuntary: 1.4 },
  { month: 'Jul', rate: 4.9, voluntary: 3.5, involuntary: 1.4 },
  { month: 'Aug', rate: 5.6, voluntary: 4.2, involuntary: 1.4 },
  { month: 'Sep', rate: 6.0, voluntary: 4.5, involuntary: 1.5 },
  { month: 'Oct', rate: 5.8, voluntary: 4.3, involuntary: 1.5 },
  { month: 'Nov', rate: 6.3, voluntary: 4.8, involuntary: 1.5 },
  { month: 'Dec', rate: 5.9, voluntary: 4.4, involuntary: 1.5 },
  { month: 'Jan', rate: 6.1, voluntary: 4.7, involuntary: 1.4 },
  { month: 'Feb', rate: 5.7, voluntary: 4.3, involuntary: 1.4 },
  { month: 'Mar', rate: 6.2, voluntary: 4.8, involuntary: 1.4 },
];

const APPRAISAL_PROGRESS_DATA = {
  submitted: 74, inProgress: 18, notStarted: 8, overdueDepts: [
    { hod: 'Mr. Shankar (Science)', days: 18 },
    { hod: 'Ms. Leela (Commerce)', days: 12 },
    { hod: 'Mr. Das (Admin)', days: 9 },
  ]
};

const PERFORMANCE_DIST_DATA = [
  { campus: "St. Xavier's", outstanding: 18, good: 42, average: 30, belowAvg: 8, poor: 2 },
  { campus: 'Holy Cross', outstanding: 12, good: 38, average: 35, belowAvg: 12, poor: 3 },
  { campus: 'Delhi Public', outstanding: 22, good: 45, average: 25, belowAvg: 6, poor: 2 },
  { campus: 'Presidency', outstanding: 15, good: 40, average: 33, belowAvg: 9, poor: 3 },
  { campus: 'Bishop Cotton', outstanding: 20, good: 43, average: 28, belowAvg: 7, poor: 2 },
];

const PAYROLL_COST_SUMMARY_DATA = [
  { campus: "St. Xavier's", gross: 58.4, net: 51.2, lop: 1.8, budget: 60, costPerEmp: 31200 },
  { campus: 'Holy Cross', gross: 74.6, net: 65.8, lop: 3.2, budget: 70, costPerEmp: 31880 },
  { campus: 'Delhi Public', gross: 48.2, net: 42.4, lop: 1.2, budget: 50, costPerEmp: 30900 },
  { campus: 'Presidency', gross: 92.1, net: 81.4, lop: 4.1, budget: 88, costPerEmp: 30900 },
  { campus: 'Bishop Cotton', gross: 44.8, net: 39.6, lop: 1.6, budget: 46, costPerEmp: 31500 },
];

const STAFF_MOVEMENT_DATA = [
  { campus: "St. Xavier's", joiners: 3, exits: 1, net: 2 },
  { campus: 'Holy Cross', joiners: 2, exits: 4, net: -2 },
  { campus: 'Delhi Public', joiners: 4, exits: 1, net: 3 },
  { campus: 'Presidency', joiners: 1, exits: 3, net: -2 },
  { campus: 'Bishop Cotton', joiners: 2, exits: 2, net: 0 },
];

const ATTRITION_LEAGUE_DATA = [
  { campus: 'Holy Cross', rate: 8.4, voluntary: 6.2, involuntary: 2.2, rank: 1 },
  { campus: 'Presidency', rate: 7.1, voluntary: 5.4, involuntary: 1.7, rank: 2 },
  { campus: 'Bishop Cotton', rate: 6.8, voluntary: 5.0, involuntary: 1.8, rank: 3 },
  { campus: "St. Xavier's", rate: 5.2, voluntary: 3.8, involuntary: 1.4, rank: 4 },
  { campus: 'Delhi Public', rate: 4.6, voluntary: 3.4, involuntary: 1.2, rank: 5 },
];

const HEADCOUNT_BUDGET_DATA = [
  { campus: "St. Xavier's", sanctioned: 200, actual: 187, gap: 13 },
  { campus: 'Holy Cross', sanctioned: 250, actual: 234, gap: 16 },
  { campus: 'Delhi Public', sanctioned: 165, actual: 156, gap: 9 },
  { campus: 'Presidency', sanctioned: 310, actual: 298, gap: 12 },
  { campus: 'Bishop Cotton', sanctioned: 155, actual: 142, gap: 13 },
];

const PAYROLL_TREND_12M_DATA = [
  { month: 'Apr', xavier: 56, holyCross: 71, delhi: 46, presidency: 88, bishop: 43 },
  { month: 'May', xavier: 57, holyCross: 72, delhi: 46, presidency: 89, bishop: 43 },
  { month: 'Jun', xavier: 57, holyCross: 72, delhi: 47, presidency: 89, bishop: 44 },
  { month: 'Jul', xavier: 58, holyCross: 73, delhi: 47, presidency: 90, bishop: 44 },
  { month: 'Aug', xavier: 58, holyCross: 73, delhi: 47, presidency: 91, bishop: 44 },
  { month: 'Sep', xavier: 58, holyCross: 74, delhi: 48, presidency: 91, bishop: 44 },
  { month: 'Oct', xavier: 59, holyCross: 74, delhi: 48, presidency: 91, bishop: 45 },
  { month: 'Nov', xavier: 59, holyCross: 74, delhi: 48, presidency: 92, bishop: 45 },
  { month: 'Dec', xavier: 60, holyCross: 75, delhi: 48, presidency: 92, bishop: 45 },
  { month: 'Jan', xavier: 58, holyCross: 74, delhi: 47, presidency: 91, bishop: 44 },
  { month: 'Feb', xavier: 58, holyCross: 73, delhi: 47, presidency: 91, bishop: 44 },
  { month: 'Mar', xavier: 58, holyCross: 75, delhi: 48, presidency: 92, bishop: 45 },
];

const HIGH_PERFORMER_RISK_DATA = [
  { name: 'Ms. Revathi S', dept: 'Science', rating: 'Outstanding', tenure: '6 yrs', risk: 'high', inExitPipeline: true },
  { name: 'Dr. Pradeep K', dept: 'Maths', rating: 'Outstanding', tenure: '4 yrs', risk: 'medium', inExitPipeline: false },
  { name: 'Mr. Suresh A', dept: 'Commerce', rating: 'Outstanding', tenure: '8 yrs', risk: 'high', inExitPipeline: false },
  { name: 'Ms. Lakshmi P', dept: 'English', rating: 'Outstanding', tenure: '3 yrs', risk: 'low', inExitPipeline: false },
];

const TODAY_ABSENCES_CLASS_DATA = [
  { teacher: 'Mr. Rao', dept: 'Science', leaveType: 'SL', class: 'Grade 11A', period: '2nd (09:45)', substituted: false, subName: '' },
  { teacher: 'Ms. Priya', dept: 'English', leaveType: 'CL', class: 'Grade 10B', period: '4th (11:30)', substituted: false, subName: '' },
  { teacher: 'Mr. Mohan', dept: 'Maths', leaveType: 'EL', class: 'Grade 9C', period: '1st (09:00)', substituted: true, subName: 'Mr. Venu' },
  { teacher: 'Ms. Deepa', dept: 'Commerce', leaveType: 'UAL', class: 'Grade 12A', period: '3rd (10:45)', substituted: false, subName: '' },
];

const UPCOMING_LEAVE_7D_DATA = [
  { date: 'Mon 24', dept: 'Science', count: 2, names: ['Mr. Rao', 'Ms. Sneha'] },
  { date: 'Tue 25', dept: 'English', count: 1, names: ['Ms. Priya'] },
  { date: 'Wed 26', dept: 'Maths', count: 3, names: ['Mr. Arjun', 'Ms. Kavya', 'Mr. Das'] },
  { date: 'Thu 27', dept: 'Commerce', count: 1, names: ['Ms. Leela'] },
  { date: 'Fri 28', dept: 'Admin', count: 2, names: ['Mr. Sriram', 'Ms. Usha'] },
  { date: 'Sat 29', dept: 'PE', count: 1, names: ['Mr. Raju'] },
  { date: 'Sun 30', dept: '-', count: 0, names: [] },
];

const STAFF_STRENGTH_DATA = [
  { dept: 'Science', sanctioned: 28, actual: 24, vacancies: 4 },
  { dept: 'Maths', sanctioned: 22, actual: 20, vacancies: 2 },
  { dept: 'English', sanctioned: 18, actual: 17, vacancies: 1 },
  { dept: 'Commerce', sanctioned: 14, actual: 12, vacancies: 2 },
  { dept: 'Admin', sanctioned: 20, actual: 19, vacancies: 1 },
  { dept: 'PE', sanctioned: 8, actual: 7, vacancies: 1 },
  { dept: 'Arts', sanctioned: 6, actual: 6, vacancies: 0 },
];

const PROBATION_EXIT_PIPELINE_DATA = {
  probation: [
    { name: 'Kavita Nair', dept: 'Science', daysLeft: 5, flag: 'critical', type: 'Confirmation' },
    { name: 'Arjun Mehta', dept: 'Maths', daysLeft: 12, flag: 'warning', type: 'Confirmation' },
    { name: 'Rahul Joshi', dept: 'English', daysLeft: 25, flag: 'extended', type: 'Extension' },
  ],
  exits: [
    { name: 'Anand Kumar', dept: 'Science', lwd: '31 Mar', replacement: false },
    { name: 'Kavitha Rao', dept: 'English', lwd: '15 Apr', replacement: true },
  ]
};

const LEAVE_BALANCE_LEADERBOARD = [
  { name: 'Ravi Kumar', dept: 'Maths', lopDays: 8, type: 'Teaching' },
  { name: 'Sunita More', dept: 'Admin', lopDays: 6, type: 'Non-Teaching' },
  { name: 'Mohan Das', dept: 'Commerce', lopDays: 5, type: 'Teaching' },
  { name: 'Priya Sharma', dept: 'English', lopDays: 4, type: 'Teaching' },
  { name: 'Anita Singh', dept: 'Science', lopDays: 3, type: 'Teaching' },
];

const LEAVE_POLICY_VIOLATIONS = [
  { name: 'Suresh P', dept: 'Science', violation: 'Consecutive Mon-Fri leave', count: 4, month: 'Mar' },
  { name: 'Deepa K', dept: 'Maths', violation: 'SL post-holiday (5 times)', count: 5, month: 'Feb-Mar' },
  { name: 'Raj V', dept: 'PE', violation: 'No advance notice CL', count: 3, month: 'Mar' },
];


// ─── Widget Catalogue ─────────────────────────────────────────────────────────
const WIDGET_CATALOGUE: WidgetMeta[] = [
  { id: 'WGT_HEADCOUNT', name: 'Total Headcount', category: 'workforce', description: 'Live staff count across all departments', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card'], sourceModule: 'Staff Master', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN', 'FINANCE'], context: 'both', icon: Users },
  { id: 'WGT_PRESENT_TODAY', name: 'Present Today', category: 'workforce', description: 'Staff present on campus today', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'donut'], sourceModule: 'Attendance', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN', 'FINANCE'], context: 'both', icon: UserCheck },
  { id: 'WGT_ABSENT_TODAY', name: 'Absent / On Leave', category: 'workforce', description: 'Absent and on-leave staff today', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'action_list'], sourceModule: 'Attendance + Leave', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN', 'FINANCE'], context: 'both', icon: UserX },
  { id: 'WGT_LEAVE_BREAKDOWN', name: 'Leave Type Breakdown', category: 'workforce', description: 'Distribution by leave category', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'donut', 'table'], sourceModule: 'Leave', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Calendar },
  { id: 'WGT_LOP_MTD', name: 'Loss of Pay (MTD)', category: 'workforce', description: 'Unpaid leave days this month', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'line'], sourceModule: 'Leave + Payroll', roles: ['HR_MANAGER', 'CHAIRMAN', 'FINANCE'], context: 'both', icon: DollarSign },
  { id: 'WGT_PENDING_APPROVALS', name: 'Pending Leave Approvals', category: 'workforce', description: 'Leaves awaiting manager approval', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Leave', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: Clock },
  { id: 'WGT_ATT_TREND', name: 'Attendance Trend (30d)', category: 'workforce', description: 'Daily attendance over last 30 days', defaultChartType: 'line', availableChartTypes: ['line', 'area', 'bar'], sourceModule: 'Attendance', roles: ['HR_MANAGER'], context: 'both', icon: TrendingUp },
  { id: 'WGT_DEPT_HEATMAP', name: 'Department Leave Heatmap', category: 'workforce', description: 'Leave density by department', defaultChartType: 'heatmap', availableChartTypes: ['heatmap', 'bar'], sourceModule: 'Leave + Attendance', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: LayoutGrid },
  { id: 'WGT_PAYROLL_READINESS', name: 'Payroll Readiness Checklist', category: 'hr_ops', description: 'Step-by-step payroll checklist', defaultChartType: 'step_tracker', availableChartTypes: ['step_tracker'], sourceModule: 'Payroll', roles: ['HR_MANAGER', 'FINANCE'], context: 'both', icon: FileCheck },
  { id: 'WGT_PAYROLL_SUMMARY', name: 'Payroll Summary', category: 'hr_ops', description: 'Gross, net, deductions overview', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card'], sourceModule: 'Payroll', roles: ['FINANCE', 'CHAIRMAN'], context: 'both', icon: DollarSign },
  { id: 'WGT_STATUTORY_STATUS', name: 'Statutory Compliance Status', category: 'hr_ops', description: 'PF, ESI, TDS status tiles', defaultChartType: 'status_matrix', availableChartTypes: ['status_matrix'], sourceModule: 'Payroll', roles: ['HR_MANAGER', 'FINANCE'], context: 'both', icon: Shield },
  { id: 'WGT_ONBOARDING_PIPELINE', name: 'Onboarding Pipeline', category: 'hr_ops', description: 'Joiners by onboarding stage', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'bar'], sourceModule: 'Onboarding', roles: ['HR_MANAGER'], context: 'both', icon: Briefcase },
  { id: 'WGT_PROBATION_EXPIRY', name: 'Probation Expiring Soon', category: 'hr_ops', description: 'Staff with probation ending in 30d', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Probation', roles: ['HR_MANAGER'], context: 'both', icon: AlertTriangle },
  { id: 'WGT_EXIT_PIPELINE', name: 'Exit Pipeline', category: 'hr_ops', description: 'Resignations by exit stage', defaultChartType: 'funnel', availableChartTypes: ['funnel', 'bar'], sourceModule: 'Exit', roles: ['HR_MANAGER'], context: 'both', icon: LogOut },
  { id: 'WGT_APPRAISAL_CYCLE', name: 'Appraisal Cycle Status', category: 'talent', description: 'Current cycle completion %', defaultChartType: 'donut', availableChartTypes: ['donut', 'bar'], sourceModule: 'Appraisal', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Target },
  { id: 'WGT_LD_COMPLETION', name: 'L&D Course Completion', category: 'talent', description: 'Training completion by dept', defaultChartType: 'bar', availableChartTypes: ['bar', 'horizontal_bar'], sourceModule: 'L&D', roles: ['HR_MANAGER'], context: 'both', icon: BookOpen },
  { id: 'WGT_OPEN_POSITIONS', name: 'Open Positions', category: 'talent', description: 'Active requisitions by department', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'action_list'], sourceModule: 'Talent Acquisition', roles: ['HR_MANAGER'], context: 'both', icon: Users2 },
  { id: 'WGT_ATTRITION_RATE', name: 'Attrition Rate (YTD)', category: 'talent', description: 'Year-to-date staff attrition %', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'line'], sourceModule: 'Exit + Staff Master', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: TrendingDown },
  { id: 'WGT_GOI_CAMPUS_TABLE', name: 'GOI Campus Overview Table', category: 'goi', description: 'All institutions at a glance', defaultChartType: 'campus_table', availableChartTypes: ['campus_table'], sourceModule: 'All Modules', roles: ['CHAIRMAN'], context: 'goi', icon: Building2 },
  { id: 'WGT_GOI_PAYROLL_STATUS', name: 'GOI Payroll Status per Campus', category: 'goi', description: 'Payroll readiness per campus', defaultChartType: 'status_matrix', availableChartTypes: ['status_matrix'], sourceModule: 'Payroll', roles: ['CHAIRMAN', 'FINANCE'], context: 'goi', icon: DollarSign },
  { id: 'WGT_ACTIVITY_FEED', name: 'System Activity Feed', category: 'utility', description: 'Real-time HRMS event stream', defaultChartType: 'feed', availableChartTypes: ['feed'], sourceModule: 'All Modules', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN', 'FINANCE'], context: 'both', icon: Activity },
  { id: 'WGT_ALERTS', name: 'Smart Alerts & Nudges', category: 'utility', description: 'Urgent action items & warnings', defaultChartType: 'alert_banner', availableChartTypes: ['alert_banner'], sourceModule: 'All Modules', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN', 'FINANCE'], context: 'both', icon: Bell },
  // New spec widgets
  { id: 'WGT_WORKFORCE_SNAPSHOT', name: 'Workforce Snapshot', category: 'workforce', description: 'Staff by type: Teaching / NT / Visiting / Contract', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'table'], sourceModule: 'Staff Master', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Users, colSpan: 3 },
  { id: 'WGT_DEADLINE_CHECKLIST', name: 'Month-End Deadline Checklist', category: 'hr_ops', description: 'Critical HR actions due this month', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'All Modules', roles: ['HR_MANAGER'], context: 'both', icon: CheckCircle2 },
  { id: 'WGT_ON_LEAVE_DEPT', name: 'On Leave by Department', category: 'workforce', description: 'Staff on leave today by department', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'donut'], sourceModule: 'Leave + Attendance', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: MapPin },
  { id: 'WGT_LEAVE_MTD_BYTYPE', name: 'Leave Consumption MTD (by Type)', category: 'workforce', description: 'Leave taken this month by type × staff category', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Leave', roles: ['HR_MANAGER'], context: 'both', icon: Calendar, colSpan: 3 },
  { id: 'WGT_GROUP_KPI', name: 'Group KPI Bar', category: 'goi', description: 'Chairman-level: headcount, attendance, attrition, payroll, positions', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card'], sourceModule: 'All Modules', roles: ['CHAIRMAN'], context: 'goi', icon: Zap, colSpan: 3 },
  { id: 'WGT_PAYROLL_MATRIX', name: 'Payroll Status Matrix', category: 'goi', description: 'Per-campus payroll step status', defaultChartType: 'status_matrix', availableChartTypes: ['status_matrix'], sourceModule: 'Payroll', roles: ['CHAIRMAN', 'FINANCE'], context: 'goi', icon: Table2, colSpan: 3 },
  { id: 'WGT_DEPT_COVERAGE', name: 'Department Coverage Map', category: 'hr_ops', description: 'Class substitution status by department', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'table'], sourceModule: 'Attendance + Timetable', roles: ['PRINCIPAL'], context: 'both', icon: Layers, colSpan: 3 },
  { id: 'WGT_UNSUBSTITUTED', name: 'Unsubstituted Classes', category: 'hr_ops', description: 'Classes with no substitute assigned', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Timetable', roles: ['PRINCIPAL'], context: 'both', icon: AlertCircle },
  // ── HR Dashboard extended widgets ──────────────────────────────────────────
  { id: 'WGT_UAL_TRACKER', name: 'UAL Tracker', category: 'workforce', description: 'Staff absent with no leave applied — RED alert with names & escalation status', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Attendance', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN'], context: 'both', icon: Flag },
  { id: 'WGT_HEADCOUNT_SUMMARY', name: 'Headcount vs Sanctioned Strength', category: 'workforce', description: 'Actual vs sanctioned headcount bar chart by staff type with vacancy gaps', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Staff Master', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: BarChart3, colSpan: 2 },
  { id: 'WGT_TA_FUNNEL', name: 'Talent Acquisition Funnel', category: 'talent', description: 'Open → Screening → Interview → Offer → Joined conversion rates', defaultChartType: 'funnel', availableChartTypes: ['funnel', 'bar'], sourceModule: 'Talent Acquisition', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Users2 },
  { id: 'WGT_194J_TRACKER', name: 'Visiting Faculty 194J Compliance', category: 'hr_ops', description: 'TDS Sec 194J deduction, deposit and Form 26Q filing status per visiting faculty', defaultChartType: 'table', availableChartTypes: ['table', 'status_matrix'], sourceModule: 'Payroll', roles: ['HR_MANAGER', 'FINANCE'], context: 'both', icon: Shield, colSpan: 2 },
  { id: 'WGT_FF_STATUS', name: 'Full & Final Settlement Tracker', category: 'hr_ops', description: 'F&F status for exited staff — settled, pending, overdue (>30d flagged)', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Exit', roles: ['HR_MANAGER'], context: 'both', icon: CheckCircle2 },
  { id: 'WGT_ONBOARDING_SLA', name: 'Onboarding SLA Breach Tracker', category: 'hr_ops', description: 'Joiners with any checklist item past configured SLA — name, item, days overdue', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Onboarding', roles: ['HR_MANAGER'], context: 'both', icon: AlertTriangle },
  { id: 'WGT_ATTRITION_TREND_12M', name: 'Attrition Trend (12 Months)', category: 'talent', description: 'Monthly attrition rate line chart — voluntary vs involuntary split', defaultChartType: 'line', availableChartTypes: ['line', 'bar'], sourceModule: 'Exit', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: TrendingDown, colSpan: 2 },
  { id: 'WGT_TOP_LOP_STAFF', name: 'Top LOP Staff MTD', category: 'workforce', description: 'Staff with most Loss-of-Pay days this month — sorted by LOP days', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Leave + Payroll', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: DollarSign },
  { id: 'WGT_LEAVE_VIOLATIONS', name: 'Leave Policy Violations', category: 'workforce', description: 'Mon/Fri pattern abuse, sandwich rule violations, post-holiday SL spikes', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Leave', roles: ['HR_MANAGER'], context: 'both', icon: AlertCircle },
  // ── Management / Chairman extended widgets ──────────────────────────────────
  { id: 'WGT_PAYROLL_COST_SUMMARY', name: 'Payroll Cost Summary', category: 'goi', description: 'Gross payroll, LOP deductions, net pay and cost-per-employee per campus vs budget', defaultChartType: 'table', availableChartTypes: ['table', 'bar'], sourceModule: 'Payroll', roles: ['CHAIRMAN', 'FINANCE'], context: 'goi', icon: DollarSign, colSpan: 3 },
  { id: 'WGT_STAFF_MOVEMENT', name: 'Staff Movement MTD', category: 'goi', description: 'Joiners, exits and net headcount change per campus this month', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Staff Master', roles: ['CHAIRMAN', 'HR_MANAGER'], context: 'both', icon: UserMinus },
  { id: 'WGT_ATTRITION_LEAGUE', name: 'Attrition League Table', category: 'goi', description: 'Campuses ranked by YTD attrition rate — voluntary vs involuntary breakdown', defaultChartType: 'table', availableChartTypes: ['table', 'bar'], sourceModule: 'Exit', roles: ['CHAIRMAN'], context: 'goi', icon: TrendingDown },
  { id: 'WGT_HEADCOUNT_BUDGET', name: 'Headcount vs Budget', category: 'goi', description: 'Sanctioned vs actual headcount per campus — vacancy gap highlighted', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Staff Master', roles: ['CHAIRMAN', 'FINANCE'], context: 'goi', icon: Users, colSpan: 2 },
  { id: 'WGT_PAYROLL_TREND_12M', name: '12-Month Payroll Cost Trend', category: 'goi', description: 'Monthly gross payroll per campus over last 12 months — seasonal spikes & YoY', defaultChartType: 'line', availableChartTypes: ['line', 'bar'], sourceModule: 'Payroll', roles: ['CHAIRMAN', 'FINANCE'], context: 'goi', icon: TrendingUp, colSpan: 3 },
  { id: 'WGT_PERFORMANCE_DIST', name: 'Performance Distribution', category: 'talent', description: 'Rating bell curve stacked bar per campus — Outstanding / Good / Average / Below Avg / Poor', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Appraisal', roles: ['CHAIRMAN', 'HR_MANAGER'], context: 'both', icon: BarChart3, colSpan: 3 },
  { id: 'WGT_HIGH_PERFORMER_RISK', name: 'High Performer Retention Risk', category: 'talent', description: 'Outstanding-rated staff with high attrition risk — tenure, dept, exit pipeline flag', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Appraisal + Exit', roles: ['CHAIRMAN', 'HR_MANAGER'], context: 'both', icon: Award },
  // ── Principal / HOD extended widgets ───────────────────────────────────────
  { id: 'WGT_TODAY_ABSENCES_CLASS', name: "Today's Absences by Class", category: 'workforce', description: 'Absent teachers with class, period and substitution status — real-time', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Attendance + Timetable', roles: ['PRINCIPAL'], context: 'both', icon: CalendarDays, colSpan: 2 },
  { id: 'WGT_UPCOMING_LEAVE_7D', name: 'Upcoming Leave Calendar (7 Days)', category: 'workforce', description: '7-day forward view per department — helps plan substitutions in advance', defaultChartType: 'table', availableChartTypes: ['table'], sourceModule: 'Leave', roles: ['PRINCIPAL', 'HR_MANAGER'], context: 'both', icon: Calendar },
  { id: 'WGT_APPRAISAL_PROGRESS', name: 'Appraisal Progress (My Institution)', category: 'talent', description: '% staff submitted self-appraisal + manager review. Overdue HOD list.', defaultChartType: 'donut', availableChartTypes: ['donut', 'table'], sourceModule: 'Appraisal', roles: ['PRINCIPAL', 'HR_MANAGER'], context: 'both', icon: Target },
  { id: 'WGT_STAFF_STRENGTH', name: 'Staff Strength vs Sanctioned', category: 'workforce', description: 'Dept-wise sanctioned vs actual posts — vacancy count and critical gaps', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Staff Master', roles: ['PRINCIPAL', 'HR_MANAGER'], context: 'both', icon: Users, colSpan: 2 },
  { id: 'WGT_PROBATION_EXIT', name: 'Probation & Exit Pipeline', category: 'hr_ops', description: 'Combined view: probation expiry bands + active exits with replacement status', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Probation + Exit', roles: ['PRINCIPAL', 'HR_MANAGER'], context: 'both', icon: LogOut },
];

const CAT_COLORS: Record<WidgetCategory, string> = {
  workforce: DS.primary, hr_ops: DS.teal, talent: DS.purple, goi: DS.amber, utility: DS.text3,
};

const DEFAULT_LAYOUTS: Record<string, string[]> = {
  HR_MANAGER: [
    'WGT_WORKFORCE_SNAPSHOT', 'WGT_HEADCOUNT', 'WGT_PRESENT_TODAY', 'WGT_ABSENT_TODAY', 'WGT_LOP_MTD',
    'WGT_DEADLINE_CHECKLIST', 'WGT_ON_LEAVE_DEPT', 'WGT_LEAVE_MTD_BYTYPE',
    'WGT_LEAVE_BREAKDOWN', 'WGT_ATT_TREND', 'WGT_PAYROLL_READINESS',
    'WGT_ONBOARDING_PIPELINE', 'WGT_PROBATION_EXPIRY', 'WGT_ACTIVITY_FEED',
  ],
  PRINCIPAL: [
    'WGT_PRESENT_TODAY', 'WGT_ABSENT_TODAY', 'WGT_PENDING_APPROVALS',
    'WGT_DEPT_COVERAGE', 'WGT_UNSUBSTITUTED', 'WGT_DEPT_HEATMAP', 'WGT_PROBATION_EXPIRY', 'WGT_ACTIVITY_FEED',
  ],
  CHAIRMAN: [
    'WGT_GROUP_KPI', 'WGT_HEADCOUNT', 'WGT_PRESENT_TODAY', 'WGT_LOP_MTD',
    'WGT_PAYROLL_SUMMARY', 'WGT_ATTRITION_RATE', 'WGT_GOI_CAMPUS_TABLE',
    'WGT_PAYROLL_MATRIX', 'WGT_APPRAISAL_CYCLE', 'WGT_ACTIVITY_FEED',
  ],
  FINANCE: [
    'WGT_LOP_MTD', 'WGT_PAYROLL_SUMMARY', 'WGT_STATUTORY_STATUS',
    'WGT_PAYROLL_READINESS', 'WGT_GOI_PAYROLL_STATUS', 'WGT_ATTRITION_RATE',
  ],
};

// ─── Utility ─────────────────────────────────────────────────────────────────
function cs(...args: (string | boolean | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}

// ─── Widget Shell ─────────────────────────────────────────────────────────────
function WidgetShell({ title, icon: Icon, meta, children, colSpan = 1, onRemove }: {
  title: string; icon: React.ElementType; meta?: string; children: React.ReactNode;
  colSpan?: number; onRemove?: () => void;
}) {
  return (
    <div
      className={cs('rounded-2xl flex flex-col overflow-hidden', colSpan === 3 ? 'col-span-3' : colSpan === 2 ? 'col-span-2' : 'col-span-1')}
      style={{ background: DS.bgCard, boxShadow: DS.shadow, border: `1px solid ${DS.border}` }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${DS.border}` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: DS.bgLow }}>
          <Icon className="w-3.5 h-3.5" style={{ color: DS.primary }} />
        </div>
        <span className="text-sm font-semibold flex-1 truncate" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{title}</span>
        {meta && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: DS.bgLow, color: DS.text3 }}>{meta}</span>}
        {onRemove && (
          <button onClick={onRemove} className="ml-1 w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 transition-colors">
            <X className="w-3 h-3" style={{ color: DS.text3 }} />
          </button>
        )}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ label, value, delta, deltaType = 'up', icon: Icon }: {
  label: string; value: string; delta: string; deltaType?: 'up' | 'down' | 'warn'; icon: React.ElementType;
}) {
  const dColor = deltaType === 'up' ? DS.success : deltaType === 'down' ? DS.error : DS.warning;
  const dBg = deltaType === 'up' ? DS.successBg : deltaType === 'down' ? DS.errorBg : DS.warningBg;
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: DS.text3 }}>{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: DS.bgLow }}>
          <Icon className="w-4 h-4" style={{ color: DS.primary }} />
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight mb-2" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{value}</div>
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit" style={{ background: dBg, color: dColor }}>{delta}</span>
    </div>
  );
}

// ─── Widget Renderers ─────────────────────────────────────────────────────────
function renderWidget(id: string, chartType: ChartTypeOption) {
  const kpi = KPI_WIDGETS_DATA[id];

  if (id === 'WGT_WORKFORCE_SNAPSHOT') {
    return (
      <div className="space-y-3">
        {WORKFORCE_BY_STAFF_TYPE.map((row) => (
          <div key={row.type} className="flex items-center gap-3">
            <span className="text-xs font-medium w-44 flex-shrink-0 truncate" style={{ color: DS.text2 }}>{row.type}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(row.active / row.count) * 100}%`, background: row.color }} />
            </div>
            <span className="text-xs font-bold w-10 text-right" style={{ color: DS.text }}>{row.count}</span>
            {row.onLeave > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: DS.warningBg, color: DS.warning }}>{row.onLeave} on leave</span>}
          </div>
        ))}
        <div className="pt-2 flex gap-4 text-xs font-semibold" style={{ borderTop: `1px solid ${DS.border}` }}>
          <span style={{ color: DS.text }}>Total: <b>1,284</b></span>
          <span style={{ color: DS.success }}>Active: <b>1,207</b></span>
          <span style={{ color: DS.warning }}>On Leave: <b>77</b></span>
        </div>
      </div>
    );
  }

  if (id === 'WGT_DEADLINE_CHECKLIST') {
    return (
      <div className="space-y-2">
        {DEADLINE_CHECKLIST.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: item.done ? DS.successBg : item.urgency === 'critical' ? DS.errorBg : item.urgency === 'high' ? DS.warningBg : DS.bgLow }}>
            {item.done
              ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: DS.success }} />
              : item.urgency === 'critical'
              ? <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: DS.error }} />
              : <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: DS.warning }} />
            }
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-snug" style={{ color: DS.text, textDecoration: item.done ? 'line-through' : 'none' }}>{item.label}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: DS.text3 }}>Due: {item.due}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_ON_LEAVE_DEPT') {
    const max = Math.max(...ON_LEAVE_BY_DEPT.map(d => d.count));
    return (
      <div className="space-y-2.5">
        {ON_LEAVE_BY_DEPT.map((row) => (
          <div key={row.dept} className="flex items-center gap-3">
            <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: DS.text2 }}>{row.dept}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(row.count / max) * 100}%`, background: DS.primary }} />
            </div>
            <span className="text-xs font-bold w-4" style={{ color: DS.text }}>{row.count}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: DS.bgLow, color: DS.text3 }}>{row.type}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_LEAVE_MTD_BYTYPE') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <ReBarChart data={LEAVE_CONSUMPTION_MTD} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="type" tick={{ fontSize: 10, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 10, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="teaching" name="Teaching" fill={DS.primary} radius={[4, 4, 0, 0]} />
          <Bar dataKey="nonTeaching" name="Non-Teaching" fill={DS.teal} radius={[4, 4, 0, 0]} />
          <Bar dataKey="contract" name="Contract" fill={DS.amber} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_GROUP_KPI') {
    return (
      <div className="grid grid-cols-5 gap-3">
        {GROUP_KPI_DATA.map((kpi) => {
          const dColor = kpi.dir === 'up' ? DS.success : kpi.dir === 'down' ? DS.error : DS.warning;
          const dBg = kpi.dir === 'up' ? DS.successBg : kpi.dir === 'down' ? DS.errorBg : DS.warningBg;
          return (
            <div key={kpi.label} className="rounded-2xl p-3 text-center" style={{ background: DS.bgLow }}>
              <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: DS.bgCard }}>
                <kpi.icon className="w-4 h-4" style={{ color: DS.primary }} />
              </div>
              <div className="text-xl font-black" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{kpi.value}</div>
              <div className="text-[10px] font-medium mb-1 leading-tight" style={{ color: DS.text3 }}>{kpi.label}</div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: dBg, color: dColor }}>{kpi.delta}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === 'WGT_PAYROLL_MATRIX') {
    const stepLabels = { attendance: 'Att.', leave: 'Leave', lop: 'LOP', statutory: 'Stat.', finance: 'Finance' };
    const stepKeys = Object.keys(stepLabels) as Array<keyof typeof stepLabels>;
    const statusStyle = (s: string) => {
      if (s === 'done') return { bg: DS.successBg, color: DS.success, label: '✓' };
      if (s === 'ready') return { bg: DS.blueBg, color: DS.blue, label: '→' };
      if (s === 'blocked') return { bg: DS.errorBg, color: DS.error, label: '✗' };
      if (s === 'in_progress') return { bg: DS.warningBg, color: DS.warning, label: '…' };
      return { bg: DS.bgLow, color: DS.text3, label: '–' };
    };
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left pb-2 font-semibold" style={{ color: DS.text3 }}>Campus</th>
              {stepKeys.map(k => <th key={k} className="text-center pb-2 font-semibold" style={{ color: DS.text3 }}>{stepLabels[k]}</th>)}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {PAYROLL_STATUS_MATRIX.map((row) => (
              <tr key={row.campus}>
                <td className="py-1.5 pr-2 font-medium" style={{ color: DS.text }}>{row.campus}</td>
                {stepKeys.map(k => {
                  const s = statusStyle((row as any)[k]);
                  return (
                    <td key={k} className="py-1.5 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (id === 'WGT_DEPT_COVERAGE') {
    return (
      <div className="space-y-2">
        {DEPT_COVERAGE_DATA.map((row) => (
          <div key={row.dept} className="flex items-center gap-3">
            <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: DS.text2 }}>{row.dept}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${row.coverage}%`, background: row.coverage === 100 ? DS.success : row.coverage >= 80 ? DS.amber : DS.error }} />
            </div>
            <span className="text-xs font-bold w-10 text-right" style={{ color: DS.text }}>{row.coverage}%</span>
            {row.pending > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: DS.errorBg, color: DS.error }}>{row.pending} pending</span>}
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_UNSUBSTITUTED') {
    return (
      <div className="space-y-2">
        {UNSUBSTITUTED_CLASSES.map((cls, i) => (
          <div key={i} className="p-3 rounded-xl" style={{ background: DS.errorBg, border: `1px solid ${DS.error}20` }}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: DS.error }} />
              <div>
                <p className="text-xs font-bold" style={{ color: DS.error }}>{cls.period}</p>
                <p className="text-xs font-medium" style={{ color: DS.text }}>{cls.subject}</p>
                <p className="text-[10px]" style={{ color: DS.text3 }}>{cls.teacher} · {cls.room}</p>
              </div>
            </div>
          </div>
        ))}
        {UNSUBSTITUTED_CLASSES.length === 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: DS.successBg }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: DS.success }} />
            <span className="text-xs font-semibold" style={{ color: DS.success }}>All classes covered</span>
          </div>
        )}
      </div>
    );
  }

  // KPI widget
  if (kpi) {
    return <KPICard label={WIDGET_CATALOGUE.find(w => w.id === id)?.name || id} value={kpi.value} delta={kpi.delta} deltaType={kpi.deltaType} icon={kpi.icon} />;
  }

  if (id === 'WGT_LEAVE_BREAKDOWN') {
    const max = Math.max(...LEAVE_BREAKDOWN.map(l => l.count));
    return (
      <div className="space-y-2">
        {LEAVE_BREAKDOWN.map((l) => (
          <div key={l.type} className="flex items-center gap-2">
            <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: DS.text2 }}>{l.type}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(l.count / max) * 100}%`, background: l.color }} />
            </div>
            <span className="text-xs font-bold w-6 text-right" style={{ color: DS.text }}>{l.count}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_ATT_TREND') {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={ATTENDANCE_TREND.slice(-14)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="day" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Area type="monotone" dataKey="present" stroke={DS.primary} fill={`${DS.primary}15`} strokeWidth={2} name="Present" />
          <Area type="monotone" dataKey="absent" stroke={DS.error} fill={`${DS.error}10`} strokeWidth={1.5} name="Absent" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_DEPT_HEATMAP') {
    const cols = ['CL', 'SL', 'EL', 'LOP', 'UAL'];
    const maxVal = 5;
    const heatColor = (v: number) => {
      const pct = v / maxVal;
      if (pct < 0.2) return DS.successBg;
      if (pct < 0.5) return DS.warningBg;
      if (pct < 0.8) return '#fde8e8';
      return DS.errorBg;
    };
    const textColor = (v: number) => {
      const pct = v / maxVal;
      if (pct < 0.2) return DS.success;
      if (pct < 0.5) return DS.warning;
      return DS.error;
    };
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr><th className="text-left pb-2" style={{ color: DS.text3 }}>Dept</th>{cols.map(c => <th key={c} className="text-center pb-2 font-semibold" style={{ color: DS.text3 }}>{c}</th>)}</tr></thead>
          <tbody>
            {DEPT_HEATMAP_DATA.map((row) => (
              <tr key={row.dept}>
                <td className="py-1 pr-3 font-medium" style={{ color: DS.text }}>{row.dept}</td>
                {cols.map(c => { const v = (row as any)[c]; return <td key={c} className="py-1 text-center"><span className="inline-flex items-center justify-center w-7 h-6 rounded text-xs font-bold" style={{ background: heatColor(v), color: textColor(v) }}>{v}</span></td>; })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (id === 'WGT_PAYROLL_READINESS') {
    const statusIcon = (s: string) => {
      if (s === 'done') return <CheckCircle2 className="w-4 h-4" style={{ color: DS.success }} />;
      if (s === 'in_progress') return <RefreshCw className="w-4 h-4" style={{ color: DS.warning }} />;
      if (s === 'blocked') return <XCircle className="w-4 h-4" style={{ color: DS.error }} />;
      return <Circle className="w-4 h-4" style={{ color: DS.text3 }} />;
    };
    return (
      <div className="space-y-2">
        {PAYROLL_STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: step.status === 'blocked' ? DS.errorBg : step.status === 'in_progress' ? DS.warningBg : step.status === 'done' ? DS.successBg : DS.bgLow }}>
            {statusIcon(step.status)}
            <span className="text-xs font-semibold" style={{ color: DS.text }}>{step.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_STATUTORY_STATUS') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {STATUTORY_STATUS.map((s) => {
          const bg = s.status === 'filed' ? DS.successBg : s.status === 'pending' ? DS.errorBg : DS.warningBg;
          const color = s.status === 'filed' ? DS.success : s.status === 'pending' ? DS.error : DS.warning;
          return (
            <div key={s.name} className="rounded-xl p-3 text-center" style={{ background: bg }}>
              <p className="text-sm font-black" style={{ color }}>{s.name}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color }}>{s.label}</p>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === 'WGT_ONBOARDING_PIPELINE') {
    const max = Math.max(...ONBOARDING_STAGES.map(o => o.count));
    return (
      <div className="space-y-2">
        {ONBOARDING_STAGES.map((stage) => (
          <div key={stage.stage} className="flex items-center gap-2">
            <span className="text-xs font-medium w-28 flex-shrink-0 truncate" style={{ color: DS.text2 }}>{stage.stage}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(stage.count / max) * 100}%`, background: DS.teal }} />
            </div>
            <span className="text-xs font-bold" style={{ color: DS.text }}>{stage.count}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_PROBATION_EXPIRY') {
    return (
      <div className="space-y-2">
        {PROBATION_EXPIRY_DATA.map((p) => {
          const bg = p.band === 'critical' ? DS.errorBg : p.band === 'warning' ? DS.warningBg : DS.bgLow;
          const color = p.band === 'critical' ? DS.error : p.band === 'warning' ? DS.warning : DS.text3;
          return (
            <div key={p.id} className="flex items-center justify-between p-2 rounded-xl" style={{ background: bg }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: DS.text }}>{p.name}</p>
                <p className="text-[10px]" style={{ color: DS.text3 }}>{p.dept}</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'white', color }}>{p.daysLeft}d left</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === 'WGT_EXIT_PIPELINE') {
    const max = Math.max(...EXIT_FUNNEL.map(e => e.count));
    return (
      <div className="space-y-2">
        {EXIT_FUNNEL.map((e) => (
          <div key={e.stage} className="flex items-center gap-2">
            <span className="text-xs font-medium w-28 flex-shrink-0" style={{ color: DS.text2 }}>{e.stage}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(e.count / max) * 100}%`, background: DS.pink }} />
            </div>
            <span className="text-xs font-bold" style={{ color: DS.text }}>{e.count}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_APPRAISAL_CYCLE') {
    return (
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={100} height={100}>
          <RePieChart>
            <Pie data={APPRAISAL_DONUT} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" strokeWidth={0}>
              {APPRAISAL_DONUT.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 flex-1">
          {APPRAISAL_DONUT.map((e) => (
            <div key={e.name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-xs flex-1" style={{ color: DS.text2 }}>{e.name}</span>
              <span className="text-xs font-bold" style={{ color: DS.text }}>{e.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'WGT_LD_COMPLETION') {
    return (
      <ResponsiveContainer width="100%" height={150}>
        <ReBarChart data={LD_COMPLETION} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis dataKey="dept" type="category" tick={{ fontSize: 10, fill: DS.text3 }} width={55} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="completed" fill={DS.primary} radius={[0, 4, 4, 0]} name="Completion %" />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_PENDING_APPROVALS') {
    return (
      <div className="space-y-1.5">
        {PENDING_APPROVALS_DATA.map((a) => (
          <div key={a.id} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: a.stale ? DS.warningBg : DS.bgLow }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: DS.primary, color: 'white' }}>
              {a.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: DS.text }}>{a.name}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>{a.type} · {a.days}d · {a.ago}</p>
            </div>
            {a.stale && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: DS.warning }} />}
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_GOI_CAMPUS_TABLE') {
    const payrollStyle = (p: string) => {
      if (p === 'Ready') return { bg: DS.successBg, color: DS.success };
      if (p === 'Blocked') return { bg: DS.errorBg, color: DS.error };
      return { bg: DS.warningBg, color: DS.warning };
    };
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr>{['Campus', 'Type', 'Staff', 'Present', 'On Leave', 'LOP', 'Payroll', 'Health'].map(h => (
            <th key={h} className="text-left pb-2 pr-3 font-semibold" style={{ color: DS.text3 }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {GOI_CAMPUS_DATA.map((row) => {
              const p = payrollStyle(row.payroll);
              return (
                <tr key={row.name} style={{ borderTop: `1px solid ${DS.border}` }}>
                  <td className="py-2 pr-3 font-semibold" style={{ color: DS.text }}>{row.name}</td>
                  <td className="py-2 pr-3" style={{ color: DS.text3 }}>{row.type}</td>
                  <td className="py-2 pr-3 font-bold" style={{ color: DS.text }}>{row.staff}</td>
                  <td className="py-2 pr-3" style={{ color: DS.success }}>{row.present}</td>
                  <td className="py-2 pr-3" style={{ color: DS.warning }}>{row.onLeave}</td>
                  <td className="py-2 pr-3" style={{ color: DS.error }}>{row.lop}</td>
                  <td className="py-2 pr-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: p.bg, color: p.color }}>{row.payroll}</span></td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
                        <div className="h-full rounded-full" style={{ width: `${row.health}%`, background: row.health >= 80 ? DS.success : row.health >= 60 ? DS.amber : DS.error }} />
                      </div>
                      <span className="font-bold" style={{ color: DS.text }}>{row.health}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (id === 'WGT_GOI_PAYROLL_STATUS') {
    return renderWidget('WGT_PAYROLL_MATRIX', chartType);
  }

  if (id === 'WGT_ACTIVITY_FEED') {
    const typeColor = (t: string) => {
      if (t === 'success') return { dot: DS.success, bg: DS.successBg };
      if (t === 'error') return { dot: DS.error, bg: DS.errorBg };
      if (t === 'warning') return { dot: DS.warning, bg: DS.warningBg };
      if (t === 'teal') return { dot: DS.teal, bg: DS.tealBg };
      return { dot: DS.purple, bg: DS.purpleBg };
    };
    return (
      <div className="space-y-2">
        {ACTIVITY_FEED_DATA.map((item) => {
          const c = typeColor(item.type);
          return (
            <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: c.bg }}>
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: c.dot }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-snug" style={{ color: DS.text }}>{item.text}</p>
                <p className="text-[10px] mt-0.5" style={{ color: DS.text3 }}>{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === 'WGT_ALERTS') {
    const alerts = [
      { msg: '14 staff on UAL — awaiting HR review', type: 'error' },
      { msg: 'Holy Cross payroll blocked since 22 Mar', type: 'error' },
      { msg: 'TDS filing due in 5 days', type: 'warning' },
      { msg: '9 leave approvals pending >3 days', type: 'warning' },
      { msg: 'Kavita Nair probation expires in 5 days', type: 'warning' },
    ];
    return (
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-xl" style={{ background: a.type === 'error' ? DS.errorBg : DS.warningBg }}>
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: a.type === 'error' ? DS.error : DS.warning }} />
            <span className="text-xs font-medium" style={{ color: DS.text }}>{a.msg}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Extended widget renderers ─────────────────────────────────────────────

  if (id === 'WGT_UAL_TRACKER') {
    if (UAL_TRACKER_DATA.length === 0) return (
      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: DS.successBg }}>
        <CheckCircle2 className="w-4 h-4" style={{ color: DS.success }} /><span className="text-xs font-semibold" style={{ color: DS.success }}>No UAL today</span>
      </div>
    );
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2 p-2 rounded-xl" style={{ background: DS.errorBg }}>
          <Flag className="w-4 h-4" style={{ color: DS.error }} />
          <span className="text-xs font-bold" style={{ color: DS.error }}>{UAL_TRACKER_DATA.length} staff with UAL — immediate action required</span>
        </div>
        {UAL_TRACKER_DATA.map((u, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: u.escalated ? DS.warningBg : DS.errorBg }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: DS.error, color: 'white' }}>{u.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: DS.text }}>{u.name}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>{u.dept} · {u.grade} · Since {u.since}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: u.escalated ? DS.warning : DS.error, color: 'white' }}>{u.escalated ? 'Escalated' : 'Pending'}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_HEADCOUNT_SUMMARY') {
    return (
      <div>
        <ResponsiveContainer width="100%" height={160}>
          <ReBarChart data={HEADCOUNT_SUMMARY_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="type" tick={{ fontSize: 9, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="sanctioned" name="Sanctioned" fill={DS.bgDim} radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill={DS.primary} radius={[4, 4, 0, 0]} />
          </ReBarChart>
        </ResponsiveContainer>
        <div className="flex gap-3 mt-2 text-xs">
          <span style={{ color: DS.text2 }}>Total vacancies: <b style={{ color: DS.error }}>{HEADCOUNT_SUMMARY_DATA.reduce((s, r) => s + r.gap, 0)}</b></span>
        </div>
      </div>
    );
  }

  if (id === 'WGT_TA_FUNNEL') {
    const max = TA_FUNNEL_DATA[0].count;
    return (
      <div className="space-y-2">
        {TA_FUNNEL_DATA.map((stage, i) => (
          <div key={stage.stage} className="flex items-center gap-2">
            <span className="text-[10px] font-semibold w-24 flex-shrink-0" style={{ color: DS.text2 }}>{stage.stage}</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(stage.count / max) * 100}%`, background: stage.color }} />
            </div>
            <span className="text-xs font-bold w-8 text-right" style={{ color: DS.text }}>{stage.count}</span>
            {i > 0 && <span className="text-[10px] font-medium w-10 text-right" style={{ color: DS.text3 }}>{Math.round((stage.count / TA_FUNNEL_DATA[i - 1].count) * 100)}%</span>}
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_194J_TRACKER') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${DS.border}` }}>
              {['Faculty', 'Subject', 'Sessions', 'TDS Deducted', 'Form 26Q', 'Status'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 font-semibold" style={{ color: DS.text3 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VISITING_194J_DATA.map((row, i) => {
              const s = row.compliance === 'ok' ? { color: DS.success, bg: DS.successBg, label: 'Compliant' } : row.compliance === 'warn' ? { color: DS.warning, bg: DS.warningBg, label: 'Partial' } : { color: DS.error, bg: DS.errorBg, label: 'Non-Compliant' };
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${DS.border}` }}>
                  <td className="py-1.5 pr-3 font-semibold" style={{ color: DS.text }}>{row.name}</td>
                  <td className="py-1.5 pr-3" style={{ color: DS.text3 }}>{row.subject}</td>
                  <td className="py-1.5 pr-3 font-bold" style={{ color: DS.text }}>{row.sessions}</td>
                  <td className="py-1.5 pr-3">{row.tdsDeducted ? <span style={{ color: DS.success }}>✓ Yes</span> : <span style={{ color: DS.error }}>✗ No</span>}</td>
                  <td className="py-1.5 pr-3">{row.form26Q ? <span style={{ color: DS.success }}>✓ Filed</span> : <span style={{ color: DS.error }}>✗ Pending</span>}</td>
                  <td className="py-1.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (id === 'WGT_FF_STATUS') {
    return (
      <div className="space-y-2">
        {FF_STATUS_DATA.map((r, i) => {
          const s = r.fnfStatus === 'Settled' ? { color: DS.success, bg: DS.successBg } : r.fnfStatus === 'Overdue' ? { color: DS.error, bg: DS.errorBg } : { color: DS.warning, bg: DS.warningBg };
          return (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: s.bg }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: DS.text }}>{r.name} · <span style={{ color: DS.text3 }}>{r.dept}</span></p>
                <p className="text-[10px]" style={{ color: DS.text3 }}>LWD: {r.lwd} · {r.days}d since exit</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'white', color: s.color }}>{r.fnfStatus}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === 'WGT_ONBOARDING_SLA') {
    return (
      <div className="space-y-2">
        {ONBOARDING_SLA_DATA.map((r, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: r.daysOverdue > 5 ? DS.errorBg : DS.warningBg }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: r.daysOverdue > 5 ? DS.error : DS.warning }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{r.name} <span className="text-[10px] font-normal" style={{ color: DS.text3 }}>({r.type})</span></p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>SLA breach: {r.item} — {r.daysOverdue}d overdue</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_ATTRITION_TREND_12M') {
    return (
      <ResponsiveContainer width="100%" height={170}>
        <ReLineChart data={ATTRITION_TREND_12M} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 10, fill: DS.text3 }} domain={[0, 10]} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line type="monotone" dataKey="rate" stroke={DS.error} strokeWidth={2.5} dot={false} name="Total %" />
          <Line type="monotone" dataKey="voluntary" stroke={DS.amber} strokeWidth={1.5} dot={false} name="Voluntary %" strokeDasharray="4 2" />
          <Line type="monotone" dataKey="involuntary" stroke={DS.teal} strokeWidth={1.5} dot={false} name="Involuntary %" strokeDasharray="4 2" />
        </ReLineChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_TOP_LOP_STAFF') {
    return (
      <div className="space-y-2">
        {LEAVE_BALANCE_LEADERBOARD.map((r, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: r.lopDays > 6 ? DS.errorBg : r.lopDays > 4 ? DS.warningBg : DS.bgLow }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: DS.primary, color: 'white' }}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: DS.text }}>{r.name}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>{r.dept} · {r.type}</p>
            </div>
            <span className="text-sm font-black" style={{ color: r.lopDays > 6 ? DS.error : DS.warning }}>{r.lopDays}d</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_LEAVE_VIOLATIONS') {
    return (
      <div className="space-y-2">
        {LEAVE_POLICY_VIOLATIONS.map((r, i) => (
          <div key={i} className="p-2.5 rounded-xl" style={{ background: DS.warningBg }}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: DS.warning }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: DS.text }}>{r.name} · <span style={{ color: DS.text3 }}>{r.dept}</span></p>
                <p className="text-[10px]" style={{ color: DS.warning }}>{r.violation}</p>
                <p className="text-[10px]" style={{ color: DS.text3 }}>Count: {r.count} · {r.month}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_PAYROLL_COST_SUMMARY') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${DS.border}` }}>
              {['Campus', 'Gross (₹L)', 'Net (₹L)', 'LOP Deduction', 'Budget (₹L)', 'vs Budget', 'Cost/Emp'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 font-semibold" style={{ color: DS.text3 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYROLL_COST_SUMMARY_DATA.map((row) => {
              const over = row.gross > row.budget;
              return (
                <tr key={row.campus} style={{ borderBottom: `1px solid ${DS.border}` }}>
                  <td className="py-2 pr-3 font-semibold" style={{ color: DS.text }}>{row.campus}</td>
                  <td className="py-2 pr-3 font-bold" style={{ color: DS.text }}>₹{row.gross}L</td>
                  <td className="py-2 pr-3" style={{ color: DS.success }}>₹{row.net}L</td>
                  <td className="py-2 pr-3" style={{ color: DS.error }}>₹{row.lop}L</td>
                  <td className="py-2 pr-3" style={{ color: DS.text3 }}>₹{row.budget}L</td>
                  <td className="py-2 pr-3">
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: over ? DS.errorBg : DS.successBg, color: over ? DS.error : DS.success }}>{over ? `+${(row.gross - row.budget).toFixed(1)}L` : `−${(row.budget - row.gross).toFixed(1)}L`}</span>
                  </td>
                  <td className="py-2" style={{ color: DS.text }}>₹{row.costPerEmp.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (id === 'WGT_STAFF_MOVEMENT') {
    return (
      <div>
        <ResponsiveContainer width="100%" height={150}>
          <ReBarChart data={STAFF_MOVEMENT_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="campus" tick={{ fontSize: 9, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="joiners" name="Joiners" fill={DS.success} radius={[4, 4, 0, 0]} />
            <Bar dataKey="exits" name="Exits" fill={DS.error} radius={[4, 4, 0, 0]} />
          </ReBarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 pt-2 text-xs" style={{ borderTop: `1px solid ${DS.border}` }}>
          {STAFF_MOVEMENT_DATA.map(r => (
            <span key={r.campus} style={{ color: r.net >= 0 ? DS.success : DS.error }}>
              {r.campus.split(' ')[0]}: <b>{r.net >= 0 ? '+' : ''}{r.net}</b>
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'WGT_ATTRITION_LEAGUE') {
    return (
      <div className="space-y-2">
        {ATTRITION_LEAGUE_DATA.map((row) => (
          <div key={row.campus} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: row.rate > 7 ? DS.errorBg : row.rate > 5.5 ? DS.warningBg : DS.successBg }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background: row.rate > 7 ? DS.error : row.rate > 5.5 ? DS.warning : DS.success, color: 'white' }}>#{row.rank}</span>
            <span className="flex-1 text-xs font-semibold" style={{ color: DS.text }}>{row.campus}</span>
            <span className="text-xs font-black" style={{ color: row.rate > 7 ? DS.error : row.rate > 5.5 ? DS.warning : DS.success }}>{row.rate}%</span>
            <span className="text-[10px]" style={{ color: DS.text3 }}>Vol:{row.voluntary}% / Invol:{row.involuntary}%</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_HEADCOUNT_BUDGET') {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={HEADCOUNT_BUDGET_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="campus" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="sanctioned" name="Sanctioned" fill={DS.bgHigh} radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" name="Actual" fill={DS.primary} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_PAYROLL_TREND_12M') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <ReLineChart data={PAYROLL_TREND_12M_DATA} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 10, fill: DS.text3 }} unit="L" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line type="monotone" dataKey="xavier" stroke={DS.primary} strokeWidth={2} dot={false} name="St. Xavier's" />
          <Line type="monotone" dataKey="holyCross" stroke={DS.error} strokeWidth={2} dot={false} name="Holy Cross" />
          <Line type="monotone" dataKey="delhi" stroke={DS.teal} strokeWidth={2} dot={false} name="Delhi Public" />
          <Line type="monotone" dataKey="presidency" stroke={DS.amber} strokeWidth={2} dot={false} name="Presidency" />
          <Line type="monotone" dataKey="bishop" stroke={DS.purple} strokeWidth={2} dot={false} name="Bishop Cotton" />
        </ReLineChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_PERFORMANCE_DIST') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <ReBarChart data={PERFORMANCE_DIST_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="campus" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="%" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="outstanding" name="Outstanding" stackId="a" fill={DS.success} />
          <Bar dataKey="good" name="Good" stackId="a" fill={DS.teal} />
          <Bar dataKey="average" name="Average" stackId="a" fill={DS.primary} />
          <Bar dataKey="belowAvg" name="Below Avg" stackId="a" fill={DS.amber} />
          <Bar dataKey="poor" name="Poor" stackId="a" fill={DS.error} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_HIGH_PERFORMER_RISK') {
    return (
      <div className="space-y-2">
        {HIGH_PERFORMER_RISK_DATA.map((r, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: r.inExitPipeline ? DS.errorBg : r.risk === 'high' ? DS.warningBg : DS.successBg }}>
            <Award className="w-4 h-4 flex-shrink-0" style={{ color: DS.amber }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{r.name}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>{r.dept} · {r.tenure} service</p>
            </div>
            {r.inExitPipeline && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: DS.error, color: 'white' }}>In Exit Pipeline!</span>}
            {!r.inExitPipeline && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: r.risk === 'high' ? DS.warningBg : DS.successBg, color: r.risk === 'high' ? DS.warning : DS.success }}>{r.risk} risk</span>}
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_TODAY_ABSENCES_CLASS') {
    return (
      <div className="space-y-2">
        {TODAY_ABSENCES_CLASS_DATA.map((r, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: !r.substituted ? (r.leaveType === 'UAL' ? DS.errorBg : DS.warningBg) : DS.successBg }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: DS.text }}>{r.teacher}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: r.leaveType === 'UAL' ? DS.errorBg : DS.bgLow, color: r.leaveType === 'UAL' ? DS.error : DS.text3 }}>{r.leaveType}</span>
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: DS.text3 }}>{r.class} · {r.period} · {r.dept}</p>
              {r.substituted ? <p className="text-[10px] font-semibold mt-0.5" style={{ color: DS.success }}>Substituted by: {r.subName}</p>
                : <p className="text-[10px] font-semibold mt-0.5" style={{ color: DS.error }}>No substitute assigned</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'WGT_UPCOMING_LEAVE_7D') {
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1">
          {UPCOMING_LEAVE_7D_DATA.map((day) => (
            <div key={day.date} className="rounded-xl p-2 text-center" style={{ background: day.count > 2 ? DS.errorBg : day.count > 0 ? DS.warningBg : DS.bgLow }}>
              <p className="text-[9px] font-bold" style={{ color: DS.text3 }}>{day.date.split(' ')[0]}</p>
              <p className="text-[9px]" style={{ color: DS.text3 }}>{day.date.split(' ')[1]}</p>
              <p className="text-lg font-black mt-1" style={{ color: day.count > 2 ? DS.error : day.count > 0 ? DS.warning : DS.text3 }}>{day.count}</p>
              {day.count > 0 && <p className="text-[9px] leading-tight" style={{ color: DS.text3 }}>{day.dept}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'WGT_APPRAISAL_PROGRESS') {
    const total = APPRAISAL_PROGRESS_DATA.submitted + APPRAISAL_PROGRESS_DATA.inProgress + APPRAISAL_PROGRESS_DATA.notStarted;
    const donutData = [
      { name: 'Submitted', value: APPRAISAL_PROGRESS_DATA.submitted, color: DS.success },
      { name: 'In Progress', value: APPRAISAL_PROGRESS_DATA.inProgress, color: DS.amber },
      { name: 'Not Started', value: APPRAISAL_PROGRESS_DATA.notStarted, color: DS.text3 },
    ];
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={90} height={90}>
            <RePieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={25} outerRadius={42} dataKey="value" strokeWidth={0}>
                {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 flex-1">
            {donutData.map(e => (
              <div key={e.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                <span className="text-[10px] flex-1" style={{ color: DS.text2 }}>{e.name}</span>
                <span className="text-xs font-bold" style={{ color: DS.text }}>{Math.round((e.value / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
        {APPRAISAL_PROGRESS_DATA.overdueDepts.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: DS.error }}>Overdue HODs</p>
            {APPRAISAL_PROGRESS_DATA.overdueDepts.map((hod, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1 rounded-lg mb-1" style={{ background: DS.errorBg }}>
                <span className="text-[10px] font-medium" style={{ color: DS.text }}>{hod.hod}</span>
                <span className="text-[10px] font-bold" style={{ color: DS.error }}>{hod.days}d late</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (id === 'WGT_STAFF_STRENGTH') {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={STAFF_STRENGTH_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="sanctioned" name="Sanctioned" fill={DS.bgHigh} radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" name="Actual" fill={DS.primary} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  if (id === 'WGT_PROBATION_EXIT') {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: DS.warning }}>Probation Pipeline</p>
          {PROBATION_EXIT_PIPELINE_DATA.probation.map((p, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl mb-1.5" style={{ background: p.flag === 'critical' ? DS.errorBg : p.flag === 'warning' ? DS.warningBg : DS.bgLow }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: DS.text }}>{p.name} · <span style={{ color: DS.text3 }}>{p.dept}</span></p>
                <p className="text-[10px]" style={{ color: DS.text3 }}>{p.type}</p>
              </div>
              <span className="text-xs font-bold" style={{ color: p.flag === 'critical' ? DS.error : DS.warning }}>{p.daysLeft}d left</span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: DS.error }}>Active Exits</p>
          {PROBATION_EXIT_PIPELINE_DATA.exits.map((e, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl mb-1.5" style={{ background: !e.replacement ? DS.errorBg : DS.successBg }}>
              <LogOut className="w-3.5 h-3.5 flex-shrink-0" style={{ color: !e.replacement ? DS.error : DS.success }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: DS.text }}>{e.name} · <span style={{ color: DS.text3 }}>{e.dept}</span></p>
                <p className="text-[10px]" style={{ color: DS.text3 }}>LWD: {e.lwd}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: !e.replacement ? DS.error : DS.success, color: 'white' }}>{e.replacement ? 'Replaced' : 'No Cover'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center h-16 text-xs" style={{ color: DS.text3 }}>Widget data loading…</div>;
}

// ─── Zone Header ──────────────────────────────────────────────────────────────
function ZoneHeader({ zone, title, subtitle, color, bg, refresh }: {
  zone: number; title: string; subtitle: string; color: string; bg: string; refresh: string;
}) {
  return (
    <div className="rounded-2xl px-5 py-4 mb-4 flex items-center justify-between" style={{ background: bg, borderLeft: `4px solid ${color}` }}>
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black" style={{ background: color, color: 'white' }}>Z{zone}</span>
        <div>
          <h3 className="text-sm font-black" style={{ color, fontFamily: 'Manrope, sans-serif' }}>{title}</h3>
          <p className="text-xs font-medium" style={{ color: DS.text3 }}>{subtitle}</p>
        </div>
      </div>
      <span className="text-[10px] font-semibold px-2 py-1 rounded-lg" style={{ background: 'white', color: DS.text3 }}>↻ {refresh}</span>
    </div>
  );
}

// ─── HR Zone View ─────────────────────────────────────────────────────────────
function HRDashboardZoneView({ period }: { period: Period }) {
  return (
    <div className="space-y-8">
      {period === 'today' && (
        <section>
          <ZoneHeader zone={1} title="Right Now" subtitle="Live attendance, UAL alerts & today's critical flags" color={DS.zone1} bg={DS.zone1Bg} refresh="5 min" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Workforce Snapshot" icon={Users} colSpan={3}>
              {renderWidget('WGT_WORKFORCE_SNAPSHOT', 'horizontal_bar')}
            </WidgetShell>
            <WidgetShell title="Total Headcount" icon={Users}>{renderWidget('WGT_HEADCOUNT', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Present Today" icon={UserCheck}>{renderWidget('WGT_PRESENT_TODAY', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Absent / On Leave" icon={UserX}>{renderWidget('WGT_ABSENT_TODAY', 'kpi_card')}</WidgetShell>
            <WidgetShell title="UAL / Habitual Absentee Tracker" icon={AlertTriangle} colSpan={2}>
              {renderWidget('WGT_UAL_TRACKER', 'action_list')}
            </WidgetShell>
            <WidgetShell title="Smart Alerts" icon={Bell}>{renderWidget('WGT_ALERTS', 'alert_banner')}</WidgetShell>
            <WidgetShell title="On Leave by Department" icon={MapPin}>{renderWidget('WGT_ON_LEAVE_DEPT', 'horizontal_bar')}</WidgetShell>
            <WidgetShell title="Pending Approvals" icon={Clock}>{renderWidget('WGT_PENDING_APPROVALS', 'action_list')}</WidgetShell>
            <WidgetShell title="Leave Violations" icon={Flag}>{renderWidget('WGT_LEAVE_VIOLATIONS', 'action_list')}</WidgetShell>
          </div>
        </section>
      )}
      {period === 'mtd' && (
        <section>
          <ZoneHeader zone={2} title="This Month — MTD" subtitle="Close the month: payroll readiness, 194J, onboarding SLA, F&F" color={DS.zone2} bg={DS.zone2Bg} refresh="15 min" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Leave Consumption MTD by Type" icon={Calendar} colSpan={3}>
              {renderWidget('WGT_LEAVE_MTD_BYTYPE', 'bar')}
            </WidgetShell>
            <WidgetShell title="Loss of Pay MTD" icon={DollarSign}>{renderWidget('WGT_LOP_MTD', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Top LOP Staff" icon={UserMinus}>{renderWidget('WGT_TOP_LOP_STAFF', 'action_list')}</WidgetShell>
            <WidgetShell title="Payroll Readiness" icon={FileCheck}>{renderWidget('WGT_PAYROLL_READINESS', 'step_tracker')}</WidgetShell>
            <WidgetShell title="Month-End Checklist" icon={CheckCircle2}>{renderWidget('WGT_DEADLINE_CHECKLIST', 'action_list')}</WidgetShell>
            <WidgetShell title="Onboarding SLA Breaches" icon={Briefcase}>{renderWidget('WGT_ONBOARDING_SLA', 'action_list')}</WidgetShell>
            <WidgetShell title="F&F Settlement Status" icon={LogOut}>{renderWidget('WGT_FF_STATUS', 'action_list')}</WidgetShell>
            <WidgetShell title="194J Visiting Faculty TDS" icon={Shield} colSpan={2}>
              {renderWidget('WGT_194J_TRACKER', 'status_matrix')}
            </WidgetShell>
            <WidgetShell title="Leave Type Breakdown" icon={Calendar}>{renderWidget('WGT_LEAVE_BREAKDOWN', 'horizontal_bar')}</WidgetShell>
            <WidgetShell title="Statutory Compliance" icon={Shield}>{renderWidget('WGT_STATUTORY_STATUS', 'status_matrix')}</WidgetShell>
            <WidgetShell title="Onboarding Pipeline" icon={Briefcase}>{renderWidget('WGT_ONBOARDING_PIPELINE', 'horizontal_bar')}</WidgetShell>
          </div>
        </section>
      )}
      {period === 'ytd' && (
        <section>
          <ZoneHeader zone={3} title="This Year — YTD" subtitle="Strategic: attrition trends, TA funnel, headcount budget, appraisal health" color={DS.zone3} bg={DS.zone3Bg} refresh="1 hr" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Attrition Trend 12M" icon={TrendingDown} colSpan={2}>
              {renderWidget('WGT_ATTRITION_TREND_12M', 'line')}
            </WidgetShell>
            <WidgetShell title="Attrition Rate YTD" icon={TrendingDown}>{renderWidget('WGT_ATTRITION_RATE', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Headcount vs Budget" icon={BarChart3} colSpan={2}>
              {renderWidget('WGT_HEADCOUNT_SUMMARY', 'grouped_bar')}
            </WidgetShell>
            <WidgetShell title="Open Positions" icon={Users2}>{renderWidget('WGT_OPEN_POSITIONS', 'kpi_card')}</WidgetShell>
            <WidgetShell title="TA Funnel" icon={Target} colSpan={2}>
              {renderWidget('WGT_TA_FUNNEL', 'funnel')}
            </WidgetShell>
            <WidgetShell title="Appraisal Progress" icon={Target}>{renderWidget('WGT_APPRAISAL_PROGRESS', 'donut')}</WidgetShell>
            <WidgetShell title="Probation & Exit Pipeline" icon={LogOut} colSpan={2}>
              {renderWidget('WGT_PROBATION_EXIT', 'action_list')}
            </WidgetShell>
            <WidgetShell title="Attendance Trend 30d" icon={TrendingUp}>
              {renderWidget('WGT_ATT_TREND', 'area')}
            </WidgetShell>
            <WidgetShell title="Appraisal Cycle" icon={Target}>{renderWidget('WGT_APPRAISAL_CYCLE', 'donut')}</WidgetShell>
            <WidgetShell title="L&D Completion" icon={BookOpen}>{renderWidget('WGT_LD_COMPLETION', 'bar')}</WidgetShell>
            <WidgetShell title="Exit Pipeline" icon={LogOut}>{renderWidget('WGT_EXIT_PIPELINE', 'funnel')}</WidgetShell>
            <WidgetShell title="Activity Feed" icon={Activity}>{renderWidget('WGT_ACTIVITY_FEED', 'feed')}</WidgetShell>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Chairman Zone View ───────────────────────────────────────────────────────
function ManagementDashboardZoneView({ period }: { period: Period }) {
  return (
    <div className="space-y-8">
      {period === 'today' && (
        <section>
          <ZoneHeader zone={1} title="Group Pulse — Now" subtitle="Live headcount, staff movement & campus-level flags" color={DS.zone1} bg={DS.zone1Bg} refresh="5 min" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Group KPI Bar" icon={Zap} colSpan={3}>
              {renderWidget('WGT_GROUP_KPI', 'kpi_card')}
            </WidgetShell>
            <WidgetShell title="Total Headcount" icon={Users}>{renderWidget('WGT_HEADCOUNT', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Present Today" icon={UserCheck}>{renderWidget('WGT_PRESENT_TODAY', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Smart Alerts" icon={Bell}>{renderWidget('WGT_ALERTS', 'alert_banner')}</WidgetShell>
            <WidgetShell title="Staff Movement (Joiners vs Exits)" icon={Users2} colSpan={2}>
              {renderWidget('WGT_STAFF_MOVEMENT', 'grouped_bar')}
            </WidgetShell>
            <WidgetShell title="Headcount vs Budget" icon={BarChart3}>
              {renderWidget('WGT_HEADCOUNT_BUDGET', 'grouped_bar')}
            </WidgetShell>
          </div>
        </section>
      )}
      {period === 'mtd' && (
        <section>
          <ZoneHeader zone={2} title="This Month — MTD" subtitle="Payroll cost, LOP, campus-level readiness & compliance" color={DS.zone2} bg={DS.zone2Bg} refresh="15 min" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Campus Overview" icon={Building2} colSpan={3}>
              {renderWidget('WGT_GOI_CAMPUS_TABLE', 'campus_table')}
            </WidgetShell>
            <WidgetShell title="Payroll Status Matrix" icon={Table2} colSpan={3}>
              {renderWidget('WGT_PAYROLL_MATRIX', 'status_matrix')}
            </WidgetShell>
            <WidgetShell title="Payroll Cost by Campus" icon={DollarSign} colSpan={3}>
              {renderWidget('WGT_PAYROLL_COST_SUMMARY', 'campus_table')}
            </WidgetShell>
            <WidgetShell title="Loss of Pay MTD" icon={DollarSign}>{renderWidget('WGT_LOP_MTD', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Payroll Summary" icon={DollarSign}>{renderWidget('WGT_PAYROLL_SUMMARY', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Activity Feed" icon={Activity}>{renderWidget('WGT_ACTIVITY_FEED', 'feed')}</WidgetShell>
          </div>
        </section>
      )}
      {period === 'ytd' && (
        <section>
          <ZoneHeader zone={3} title="This Year — Strategy" subtitle="Attrition league, payroll trends, performance distribution, high-performer risk" color={DS.zone3} bg={DS.zone3Bg} refresh="1 hr" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Attrition Trend 12M" icon={TrendingDown} colSpan={2}>
              {renderWidget('WGT_ATTRITION_TREND_12M', 'line')}
            </WidgetShell>
            <WidgetShell title="Attrition Rate YTD" icon={TrendingDown}>{renderWidget('WGT_ATTRITION_RATE', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Attrition League by Campus" icon={Award}>
              {renderWidget('WGT_ATTRITION_LEAGUE', 'action_list')}
            </WidgetShell>
            <WidgetShell title="Payroll Trend 12M" icon={DollarSign} colSpan={2}>
              {renderWidget('WGT_PAYROLL_TREND_12M', 'line')}
            </WidgetShell>
            <WidgetShell title="Performance Distribution" icon={BarChart3} colSpan={2}>
              {renderWidget('WGT_PERFORMANCE_DIST', 'stacked_bar')}
            </WidgetShell>
            <WidgetShell title="High Performer Risk" icon={AlertTriangle}>
              {renderWidget('WGT_HIGH_PERFORMER_RISK', 'action_list')}
            </WidgetShell>
            <WidgetShell title="Appraisal Progress" icon={Target}>{renderWidget('WGT_APPRAISAL_PROGRESS', 'donut')}</WidgetShell>
            <WidgetShell title="Appraisal Cycle" icon={Target} colSpan={2}>{renderWidget('WGT_APPRAISAL_CYCLE', 'donut')}</WidgetShell>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Principal Zone View ──────────────────────────────────────────────────────
function PrincipalDashboardZoneView({ period }: { period: Period }) {
  return (
    <div className="space-y-8">
      {period === 'today' && (
        <section>
          <ZoneHeader zone={1} title="Campus Right Now" subtitle="Attendance, absent staff, class coverage & substitute status" color={DS.zone1} bg={DS.zone1Bg} refresh="5 min" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Present Today" icon={UserCheck}>{renderWidget('WGT_PRESENT_TODAY', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Absent / On Leave" icon={UserX}>{renderWidget('WGT_ABSENT_TODAY', 'kpi_card')}</WidgetShell>
            <WidgetShell title="Unsubstituted Classes" icon={AlertCircle}>{renderWidget('WGT_UNSUBSTITUTED', 'action_list')}</WidgetShell>
            <WidgetShell title="Today's Absences by Class" icon={CalendarDays} colSpan={2}>
              {renderWidget('WGT_TODAY_ABSENCES_CLASS', 'action_list')}
            </WidgetShell>
            <WidgetShell title="Smart Alerts" icon={Bell}>{renderWidget('WGT_ALERTS', 'alert_banner')}</WidgetShell>
            <WidgetShell title="Department Coverage Map" icon={Layers} colSpan={3}>
              {renderWidget('WGT_DEPT_COVERAGE', 'horizontal_bar')}
            </WidgetShell>
          </div>
        </section>
      )}
      {period === 'mtd' && (
        <section>
          <ZoneHeader zone={2} title="This Month — Operations" subtitle="Leave approvals, upcoming leave, staff strength & heatmap" color={DS.zone2} bg={DS.zone2Bg} refresh="15 min" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Upcoming Leave (7 Days)" icon={CalendarDays} colSpan={2}>
              {renderWidget('WGT_UPCOMING_LEAVE_7D', 'calendar')}
            </WidgetShell>
            <WidgetShell title="Pending Leave Approvals" icon={Clock}>{renderWidget('WGT_PENDING_APPROVALS', 'action_list')}</WidgetShell>
            <WidgetShell title="Department Leave Heatmap" icon={LayoutGrid} colSpan={2}>{renderWidget('WGT_DEPT_HEATMAP', 'heatmap')}</WidgetShell>
            <WidgetShell title="On Leave by Dept" icon={MapPin}>{renderWidget('WGT_ON_LEAVE_DEPT', 'horizontal_bar')}</WidgetShell>
            <WidgetShell title="Staff Strength by Dept" icon={Users} colSpan={2}>
              {renderWidget('WGT_STAFF_STRENGTH', 'grouped_bar')}
            </WidgetShell>
            <WidgetShell title="Activity Feed" icon={Activity}>{renderWidget('WGT_ACTIVITY_FEED', 'feed')}</WidgetShell>
          </div>
        </section>
      )}
      {period === 'ytd' && (
        <section>
          <ZoneHeader zone={3} title="This Year — Academic Health" subtitle="Appraisal progress, probation & exit pipeline, L&D, staff development" color={DS.zone3} bg={DS.zone3Bg} refresh="1 hr" />
          <div className="grid grid-cols-3 gap-4">
            <WidgetShell title="Appraisal Progress" icon={Target} colSpan={2}>
              {renderWidget('WGT_APPRAISAL_PROGRESS', 'donut')}
            </WidgetShell>
            <WidgetShell title="Appraisal Cycle" icon={Target}>{renderWidget('WGT_APPRAISAL_CYCLE', 'donut')}</WidgetShell>
            <WidgetShell title="Probation & Exit Pipeline" icon={LogOut} colSpan={2}>
              {renderWidget('WGT_PROBATION_EXIT', 'action_list')}
            </WidgetShell>
            <WidgetShell title="Probation Expiring" icon={AlertTriangle}>{renderWidget('WGT_PROBATION_EXPIRY', 'action_list')}</WidgetShell>
            <WidgetShell title="L&D Completion" icon={BookOpen}>{renderWidget('WGT_LD_COMPLETION', 'bar')}</WidgetShell>
            <WidgetShell title="Leave Type Breakdown" icon={Calendar}>{renderWidget('WGT_LEAVE_BREAKDOWN', 'horizontal_bar')}</WidgetShell>
            <WidgetShell title="UAL / Habitual Absentee Tracker" icon={AlertTriangle}>{renderWidget('WGT_UAL_TRACKER', 'action_list')}</WidgetShell>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Sortable Widget (Grid mode) ──────────────────────────────────────────────
function SortableWidget({ item, onRemove }: {
  item: LayoutItem; onRemove: (id: string) => void; onChartTypeChange?: (id: string, ct: ChartTypeOption) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.widgetId });
  const meta = WIDGET_CATALOGUE.find(w => w.id === item.widgetId);
  if (!meta) return null;
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        gridColumn: `span ${item.colSpan}`,
      }}
    >
      <div className="rounded-2xl flex flex-col h-full" style={{ background: DS.bgCard, boxShadow: DS.shadow, border: `1px solid ${DS.border}` }}>
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: `1px solid ${DS.border}` }}>
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded">
            <GripVertical className="w-3.5 h-3.5" style={{ color: DS.text3 }} />
          </button>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: DS.bgLow }}>
            <Icon className="w-3 h-3" style={{ color: CAT_COLORS[meta.category] }} />
          </div>
          <span className="text-xs font-semibold flex-1 truncate" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{meta.name}</span>
          <button onClick={() => onRemove(item.widgetId)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 transition-colors ml-1">
            <X className="w-3 h-3" style={{ color: DS.text3 }} />
          </button>
        </div>
        <div className="flex-1 p-3 min-h-[120px]">{renderWidget(item.widgetId, item.chartType)}</div>
      </div>
    </div>
  );
}

// ─── Add Widget Drawer ────────────────────────────────────────────────────────
function AddWidgetDrawer({ open, onClose, role, activeIds, onAdd }: {
  open: boolean; onClose: () => void; role: DashboardRole; activeIds: string[];
  onAdd: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const available = WIDGET_CATALOGUE.filter(w =>
    (w.roles.includes(role)) &&
    !activeIds.includes(w.id) &&
    (w.name.toLowerCase().includes(search.toLowerCase()) || w.description.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = available.reduce<Record<WidgetCategory, WidgetMeta[]>>((acc, w) => {
    if (!acc[w.category]) acc[w.category] = [];
    acc[w.category].push(w);
    return acc;
  }, {} as any);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-96 flex flex-col overflow-hidden" style={{ background: DS.bgCard, boxShadow: '-20px 0 60px rgba(11,28,48,0.12)' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${DS.border}` }}>
          <div>
            <h3 className="font-black text-base" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>Add Widget</h3>
            <p className="text-xs" style={{ color: DS.text3 }}>{available.length} available</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: DS.bgLow }}>
            <X className="w-4 h-4" style={{ color: DS.text }} />
          </button>
        </div>
        <div className="px-5 py-3" style={{ borderBottom: `1px solid ${DS.border}` }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: DS.bgLow }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: DS.text3 }} />
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Search widgets…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ color: DS.text, fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {(Object.keys(grouped) as WidgetCategory[]).map(cat => (
            <div key={cat}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: CAT_COLORS[cat] }}>{cat.replace('_', ' ')}</p>
              <div className="space-y-2">
                {grouped[cat].map(w => (
                  <button key={w.id} onClick={() => { onAdd(w.id); onClose(); }}
                    className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:-translate-y-0.5"
                    style={{ background: DS.bgLow, border: `1px solid transparent` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = DS.primary)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${CAT_COLORS[cat]}15` }}>
                      <w.icon className="w-4 h-4" style={{ color: CAT_COLORS[cat] }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: DS.text }}>{w.name}</p>
                      <p className="text-[10px] leading-snug mt-0.5" style={{ color: DS.text3 }}>{w.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {available.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm font-semibold" style={{ color: DS.text3 }}>No widgets found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  usePersona();
  const [dashRole, setDashRole] = useState<DashboardRole>('HR_MANAGER');
  const [viewMode, setViewMode] = useState<ViewMode>('zone');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [period, setPeriod] = useState<Period>('today');

  const defaultWidgets = DEFAULT_LAYOUTS[dashRole] || DEFAULT_LAYOUTS.HR_MANAGER;
  const [layout, setLayout] = useState<LayoutItem[]>(() =>
    defaultWidgets.map((id, i) => {
      const meta = WIDGET_CATALOGUE.find(w => w.id === id);
      return { widgetId: id, position: i, chartType: meta?.defaultChartType || 'kpi_card', colSpan: meta?.colSpan || 1 };
    })
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLayout(prev => {
        const oldIndex = prev.findIndex(i => i.widgetId === active.id);
        const newIndex = prev.findIndex(i => i.widgetId === over.id);
        return arrayMove(prev, oldIndex, newIndex).map((item, pos) => ({ ...item, position: pos }));
      });
    }
  }, []);

  const addWidget = (id: string) => {
    const meta = WIDGET_CATALOGUE.find(w => w.id === id);
    setLayout(prev => [...prev, { widgetId: id, position: prev.length, chartType: meta?.defaultChartType || 'kpi_card', colSpan: meta?.colSpan || 1 }]);
  };

  const removeWidget = (id: string) => setLayout(prev => prev.filter(i => i.widgetId !== id));

  const handleRoleChange = (r: DashboardRole) => {
    setDashRole(r);
    const defaults = DEFAULT_LAYOUTS[r] || [];
    setLayout(defaults.map((id, i) => {
      const meta = WIDGET_CATALOGUE.find(w => w.id === id);
      return { widgetId: id, position: i, chartType: meta?.defaultChartType || 'kpi_card', colSpan: meta?.colSpan || 1 };
    }));
  };

  const roleLabels: Record<DashboardRole, string> = {
    HR_MANAGER: 'HR Manager', PRINCIPAL: 'Principal / HOD', CHAIRMAN: 'Group Chairman', FINANCE: 'Finance Head',
  };

  const zoneComponent = dashRole === 'HR_MANAGER' ? <HRDashboardZoneView period={period} /> : dashRole === 'CHAIRMAN' ? <ManagementDashboardZoneView period={period} /> : dashRole === 'PRINCIPAL' ? <PrincipalDashboardZoneView period={period} /> : <HRDashboardZoneView period={period} />;

  return (
    <div className="min-h-screen" style={{ background: DS.bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="sticky top-0 z-40" style={{ background: DS.bgCard, borderBottom: `1px solid ${DS.border}`, boxShadow: DS.shadowSm }}>
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-4">
          {/* Back */}
          <button onClick={() => navigate('/')} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-slate-100" style={{ background: DS.bgLow }}>
            <ArrowRight className="w-4 h-4 rotate-180" style={{ color: DS.text }} />
          </button>

          {/* Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: DS.primaryGrad }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black leading-tight" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>Control Tower</h1>
              <p className="text-[10px] font-medium leading-tight" style={{ color: DS.text3 }}>HRMS Command Centre</p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Role Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: DS.bgLow }}>
            {(['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN', 'FINANCE'] as DashboardRole[]).map(r => (
              <button key={r} onClick={() => handleRoleChange(r)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: dashRole === r ? DS.primary : 'transparent',
                  color: dashRole === r ? DS.onPrimary : DS.text2,
                  fontFamily: 'Manrope, sans-serif',
                }}
              >{roleLabels[r]}</button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: DS.bgLow }}>
            <button onClick={() => setViewMode('zone')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: viewMode === 'zone' ? DS.primary : 'transparent', color: viewMode === 'zone' ? 'white' : DS.text2 }}
            >
              <Layers className="w-3.5 h-3.5" /> Zone View
            </button>
            <button onClick={() => setViewMode('grid')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: viewMode === 'grid' ? DS.primary : 'transparent', color: viewMode === 'grid' ? 'white' : DS.text2 }}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Builder
            </button>
          </div>

          {/* Period */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: DS.bgLow }}>
            {(['today', 'mtd', 'ytd'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all"
                style={{ background: period === p ? DS.amber : 'transparent', color: period === p ? 'white' : DS.text2 }}
              >{p}</button>
            ))}
          </div>

          {/* Actions */}
          {viewMode === 'grid' && (
            <button onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: DS.primaryGrad, color: 'white', boxShadow: '0 4px 12px rgba(0,63,152,0.3)' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Widget
            </button>
          )}
          <button className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: DS.bgLow }}>
            <RefreshCw className="w-4 h-4" style={{ color: DS.text3 }} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {/* Role Banner */}
        <div className="mb-6 rounded-2xl px-5 py-4 flex items-center justify-between" style={{ background: DS.primaryGrad, boxShadow: '0 8px 32px rgba(0,63,152,0.18)' }}>
          <div>
            <h2 className="text-lg font-black text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {roleLabels[dashRole]} Dashboard
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {viewMode === 'zone'
                ? period === 'today' ? 'Zone 1 — Right Now · Live attendance & alerts'
                  : period === 'mtd' ? 'Zone 2 — This Month (MTD) · Payroll, leave & compliance'
                  : 'Zone 3 — This Year (YTD) · Attrition, appraisals & talent'
                : 'Drag-and-drop builder — customise your workspace'}
              {' · '}{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-black text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>1,284</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Headcount</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="text-right">
              <p className="text-2xl font-black text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>84.7%</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Today's Attendance</p>
            </div>
          </div>
        </div>

        {/* Zone View */}
        {viewMode === 'zone' && zoneComponent}

        {/* Grid Builder View */}
        {viewMode === 'grid' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layout.map(i => i.widgetId)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-4 auto-rows-min">
                {layout.map(item => (
                  <SortableWidget key={item.widgetId} item={item} onRemove={removeWidget} onChartTypeChange={(id, ct) => setLayout(prev => prev.map(i => i.widgetId === id ? { ...i, chartType: ct } : i))} />
                ))}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="col-span-1 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ border: `2px dashed ${DS.border}`, background: DS.bgLow, color: DS.text3 }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-xs font-semibold">Add Widget</span>
                </button>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <AddWidgetDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        role={dashRole}
        activeIds={layout.map(i => i.widgetId)}
        onAdd={addWidget}
      />
    </div>
  );
};

export default ManagementDashboard;
