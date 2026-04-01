import React, { useState, useCallback } from 'react';
import {
  Users, UserCheck, UserX, Calendar, DollarSign, Clock, TrendingUp, TrendingDown,
  Activity, AlertTriangle, CheckCircle2, XCircle,
  Plus, X, GripVertical, RefreshCw,
  Building2, BookOpen, Target, Briefcase, LogOut, Bell, Search,
  Circle, Zap, Shield, FileCheck, Users2,
  LayoutGrid, Table2, Layers, MapPin,
  AlertCircle, ArrowRight, Award, Flag, UserMinus, CalendarDays, BarChart3, Lock, Unlock,
  Heart, MessageSquare, Sliders, GraduationCap, Microscope, BookMarked, GitBranch,
  ClipboardList, Network, RotateCcw, FileText, FolderOpen, Medal, Crosshair,
  CheckSquare, Star, ThumbsUp, Lightbulb, Database
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

const CAMPUS_DRILL_DATA: Record<string, {
  attendance: { present: number; onLeave: number; ual: number; lop: number };
  leaveBreakdown: { type: string; count: number; color: string }[];
  payrollSteps: { label: string; status: 'done' | 'in_progress' | 'blocked' | 'waiting' }[];
  topAbsentees: { name: string; dept: string; days: number }[];
  staffByDept: { dept: string; count: number; present: number }[];
  alerts: { msg: string; type: 'error' | 'warning' | 'info' }[];
  salary: { gross: number; net: number; lopDeduction: number; costPerEmp: number; budgetVariance: number };
  statutory: { pf: 'filed' | 'pending' | 'overdue'; esi: 'filed' | 'pending' | 'overdue'; tds: 'filed' | 'pending' | 'overdue'; pt: 'filed' | 'pending' | 'overdue' };
  appraisal: { total: number; submitted: number; completed: number; cycle: string };
  talentAcq: { openPositions: number; offersOut: number; joinedMTD: number; timeToHire: number };
  onboarding: { active: number; slaBreached: number; completed: number };
  exitData: { active: number; ffSettled: number; ffPending: number; attritionYTD: number };
  lnd: { enrolled: number; completed: number; completionPct: number; certIssued: number };
  lessonPlans: { submitted: number; total: number };
  research: { papers: number; conferences: number; patents: number };
  engagement: { score: number; trend: 'up' | 'down' | 'flat'; surveyResponse: number };
  goals: { set: number; onTrack: number; atRisk: number; completed: number };
}> = {
  "St. Xavier's": {
    attendance: { present: 160, onLeave: 22, ual: 3, lop: 8 },
    leaveBreakdown: [
      { type: 'Casual', count: 8, color: '#003f98' }, { type: 'Sick', count: 6, color: '#1a7f4b' },
      { type: 'Earned', count: 5, color: '#7c3aed' }, { type: 'LOP', count: 3, color: '#c62828' },
    ],
    payrollSteps: [
      { label: 'Attendance locked', status: 'done' }, { label: 'Leave data synced', status: 'done' },
      { label: 'LOP validated', status: 'done' }, { label: 'Statutory computation', status: 'done' },
      { label: 'Finance approval', status: 'done' },
    ],
    topAbsentees: [{ name: 'Ravi Kumar', dept: 'Science', days: 4 }, { name: 'Priya Singh', dept: 'Admin', days: 3 }],
    staffByDept: [
      { dept: 'Science', count: 38, present: 34 }, { dept: 'Maths', count: 32, present: 29 },
      { dept: 'English', count: 28, present: 26 }, { dept: 'Admin', count: 22, present: 21 }, { dept: 'PE', count: 12, present: 11 },
    ],
    alerts: [{ msg: '3 UAL staff — escalated to HR', type: 'error' }, { msg: 'Payroll ready for disbursement', type: 'info' }],
    salary: { gross: 5240000, net: 4620000, lopDeduction: 86000, costPerEmp: 28000, budgetVariance: 2 },
    statutory: { pf: 'filed', esi: 'filed', tds: 'filed', pt: 'filed' },
    appraisal: { total: 187, submitted: 172, completed: 165, cycle: 'Q1 2026' },
    talentAcq: { openPositions: 4, offersOut: 2, joinedMTD: 3, timeToHire: 18 },
    onboarding: { active: 3, slaBreached: 0, completed: 12 },
    exitData: { active: 1, ffSettled: 2, ffPending: 0, attritionYTD: 3.2 },
    lnd: { enrolled: 142, completed: 128, completionPct: 90, certIssued: 24 },
    lessonPlans: { submitted: 178, total: 187 },
    research: { papers: 12, conferences: 8, patents: 1 },
    engagement: { score: 82, trend: 'up', surveyResponse: 88 },
    goals: { set: 310, onTrack: 278, atRisk: 22, completed: 10 },
  },
  'Holy Cross': {
    attendance: { present: 196, onLeave: 31, ual: 7, lop: 12 },
    leaveBreakdown: [
      { type: 'Casual', count: 12, color: '#003f98' }, { type: 'Sick', count: 9, color: '#1a7f4b' },
      { type: 'LOP', count: 6, color: '#c62828' }, { type: 'UAL', count: 4, color: '#b45309' },
    ],
    payrollSteps: [
      { label: 'Attendance locked', status: 'done' }, { label: 'Leave data synced', status: 'done' },
      { label: 'LOP validated', status: 'in_progress' }, { label: 'Statutory computation', status: 'waiting' },
      { label: 'Finance approval', status: 'blocked' },
    ],
    topAbsentees: [{ name: 'Suresh M', dept: 'Commerce', days: 7 }, { name: 'Deepa P', dept: 'Science', days: 5 }, { name: 'Anand R', dept: 'Admin', days: 4 }],
    staffByDept: [
      { dept: 'Science', count: 48, present: 41 }, { dept: 'Commerce', count: 42, present: 35 },
      { dept: 'Maths', count: 36, present: 32 }, { dept: 'Admin', count: 28, present: 24 }, { dept: 'PE', count: 15, present: 14 },
    ],
    alerts: [{ msg: 'Payroll BLOCKED — finance approval pending', type: 'error' }, { msg: '7 UAL staff flagged this week', type: 'error' }, { msg: 'LOP validation incomplete — 12 cases', type: 'warning' }],
    salary: { gross: 7180000, net: 6120000, lopDeduction: 194000, costPerEmp: 30667, budgetVariance: -4 },
    statutory: { pf: 'filed', esi: 'filed', tds: 'pending', pt: 'filed' },
    appraisal: { total: 234, submitted: 188, completed: 142, cycle: 'Q1 2026' },
    talentAcq: { openPositions: 11, offersOut: 4, joinedMTD: 1, timeToHire: 34 },
    onboarding: { active: 1, slaBreached: 1, completed: 6 },
    exitData: { active: 5, ffSettled: 1, ffPending: 4, attritionYTD: 8.7 },
    lnd: { enrolled: 180, completed: 112, completionPct: 62, certIssued: 18 },
    lessonPlans: { submitted: 196, total: 234 },
    research: { papers: 6, conferences: 4, patents: 0 },
    engagement: { score: 54, trend: 'down', surveyResponse: 62 },
    goals: { set: 390, onTrack: 240, atRisk: 98, completed: 52 },
  },
  'Delhi Public': {
    attendance: { present: 140, onLeave: 14, ual: 2, lop: 4 },
    leaveBreakdown: [
      { type: 'Casual', count: 5, color: '#003f98' }, { type: 'Sick', count: 4, color: '#1a7f4b' },
      { type: 'Earned', count: 3, color: '#7c3aed' }, { type: 'LOP', count: 2, color: '#c62828' },
    ],
    payrollSteps: [
      { label: 'Attendance locked', status: 'done' }, { label: 'Leave data synced', status: 'done' },
      { label: 'LOP validated', status: 'done' }, { label: 'Statutory computation', status: 'done' },
      { label: 'Finance approval', status: 'done' },
    ],
    topAbsentees: [{ name: 'Kavita N', dept: 'English', days: 3 }],
    staffByDept: [
      { dept: 'Science', count: 32, present: 30 }, { dept: 'Maths', count: 28, present: 26 },
      { dept: 'English', count: 24, present: 22 }, { dept: 'Admin', count: 18, present: 17 },
    ],
    alerts: [{ msg: '2 UAL cases — warning issued', type: 'warning' }, { msg: 'Payroll ready', type: 'info' }],
    salary: { gross: 4380000, net: 3960000, lopDeduction: 52000, costPerEmp: 28077, budgetVariance: 1 },
    statutory: { pf: 'filed', esi: 'filed', tds: 'filed', pt: 'filed' },
    appraisal: { total: 156, submitted: 148, completed: 144, cycle: 'Q1 2026' },
    talentAcq: { openPositions: 3, offersOut: 1, joinedMTD: 2, timeToHire: 16 },
    onboarding: { active: 2, slaBreached: 0, completed: 8 },
    exitData: { active: 1, ffSettled: 3, ffPending: 0, attritionYTD: 2.8 },
    lnd: { enrolled: 130, completed: 122, completionPct: 94, certIssued: 28 },
    lessonPlans: { submitted: 152, total: 156 },
    research: { papers: 8, conferences: 6, patents: 2 },
    engagement: { score: 79, trend: 'flat', surveyResponse: 84 },
    goals: { set: 260, onTrack: 238, atRisk: 14, completed: 8 },
  },
  'Presidency': {
    attendance: { present: 244, onLeave: 42, ual: 8, lop: 14 },
    leaveBreakdown: [
      { type: 'Casual', count: 16, color: '#003f98' }, { type: 'Sick', count: 12, color: '#1a7f4b' },
      { type: 'LOP', count: 8, color: '#c62828' }, { type: 'Earned', count: 6, color: '#7c3aed' },
    ],
    payrollSteps: [
      { label: 'Attendance locked', status: 'done' }, { label: 'Leave data synced', status: 'in_progress' },
      { label: 'LOP validated', status: 'waiting' }, { label: 'Statutory computation', status: 'waiting' },
      { label: 'Finance approval', status: 'waiting' },
    ],
    topAbsentees: [{ name: 'Mohan D', dept: 'Admin', days: 8 }, { name: 'Sunita R', dept: 'Science', days: 6 }, { name: 'Anil K', dept: 'Commerce', days: 5 }],
    staffByDept: [
      { dept: 'Science', count: 62, present: 54 }, { dept: 'Commerce', count: 55, present: 46 },
      { dept: 'Maths', count: 48, present: 42 }, { dept: 'Admin', count: 38, present: 32 }, { dept: 'PE', count: 20, present: 18 },
    ],
    alerts: [{ msg: '8 UAL staff — 3 escalated', type: 'error' }, { msg: 'Leave data sync in progress', type: 'warning' }, { msg: 'Payroll blocked till sync completes', type: 'warning' }],
    salary: { gross: 9420000, net: 8140000, lopDeduction: 248000, costPerEmp: 31611, budgetVariance: -6 },
    statutory: { pf: 'filed', esi: 'pending', tds: 'pending', pt: 'filed' },
    appraisal: { total: 298, submitted: 234, completed: 188, cycle: 'Q1 2026' },
    talentAcq: { openPositions: 14, offersOut: 6, joinedMTD: 2, timeToHire: 38 },
    onboarding: { active: 2, slaBreached: 2, completed: 10 },
    exitData: { active: 7, ffSettled: 2, ffPending: 5, attritionYTD: 9.4 },
    lnd: { enrolled: 220, completed: 148, completionPct: 67, certIssued: 22 },
    lessonPlans: { submitted: 241, total: 298 },
    research: { papers: 22, conferences: 14, patents: 3 },
    engagement: { score: 62, trend: 'down', surveyResponse: 71 },
    goals: { set: 490, onTrack: 320, atRisk: 124, completed: 46 },
  },
  'Bishop Cotton': {
    attendance: { present: 118, onLeave: 19, ual: 4, lop: 7 },
    leaveBreakdown: [
      { type: 'Casual', count: 7, color: '#003f98' }, { type: 'Sick', count: 5, color: '#1a7f4b' },
      { type: 'LOP', count: 4, color: '#c62828' }, { type: 'Earned', count: 3, color: '#7c3aed' },
    ],
    payrollSteps: [
      { label: 'Attendance locked', status: 'done' }, { label: 'Leave data synced', status: 'done' },
      { label: 'LOP validated', status: 'done' }, { label: 'Statutory computation', status: 'in_progress' },
      { label: 'Finance approval', status: 'waiting' },
    ],
    topAbsentees: [{ name: 'Rajesh V', dept: 'Admin', days: 5 }, { name: 'Meena N', dept: 'Science', days: 3 }],
    staffByDept: [
      { dept: 'Science', count: 30, present: 26 }, { dept: 'Maths', count: 26, present: 23 },
      { dept: 'English', count: 20, present: 18 }, { dept: 'Admin', count: 16, present: 14 },
    ],
    alerts: [{ msg: '4 UAL cases pending review', type: 'warning' }, { msg: 'Statutory computation in progress', type: 'info' }],
    salary: { gross: 3920000, net: 3440000, lopDeduction: 72000, costPerEmp: 27606, budgetVariance: 0 },
    statutory: { pf: 'filed', esi: 'filed', tds: 'filed', pt: 'pending' },
    appraisal: { total: 142, submitted: 126, completed: 114, cycle: 'Q1 2026' },
    talentAcq: { openPositions: 6, offersOut: 2, joinedMTD: 1, timeToHire: 24 },
    onboarding: { active: 1, slaBreached: 1, completed: 7 },
    exitData: { active: 3, ffSettled: 1, ffPending: 2, attritionYTD: 5.1 },
    lnd: { enrolled: 110, completed: 86, completionPct: 78, certIssued: 16 },
    lessonPlans: { submitted: 128, total: 142 },
    research: { papers: 5, conferences: 3, patents: 0 },
    engagement: { score: 71, trend: 'flat', surveyResponse: 76 },
    goals: { set: 240, onTrack: 192, atRisk: 36, completed: 12 },
  },
};

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

const ROLE_KPI_OVERRIDES: Partial<Record<DashboardRole, Partial<typeof KPI_WIDGETS_DATA>>> = {
  PRINCIPAL: {
    WGT_HEADCOUNT:      { value: '187', delta: '↑ 2 this month', deltaType: 'up', icon: Users },
    WGT_PRESENT_TODAY:  { value: '160', delta: '85.6% attendance', deltaType: 'up', icon: UserCheck },
    WGT_ABSENT_TODAY:   { value: '27', delta: '↑ 3 vs yesterday', deltaType: 'down', icon: UserX },
    WGT_LOP_MTD:        { value: '8 days', delta: '↑ 2 vs last month', deltaType: 'warn', icon: DollarSign },
    WGT_PAYROLL_SUMMARY:{ value: '₹ 58.4 L', delta: '↓ 0.4% vs last month', deltaType: 'up', icon: DollarSign },
    WGT_OPEN_POSITIONS: { value: '4', delta: '1 urgent', deltaType: 'warn', icon: Users2 },
    WGT_ATTRITION_RATE: { value: '5.2%', delta: '↑ 0.3% YTD', deltaType: 'down', icon: TrendingDown },
  },
  CHAIRMAN: {
    WGT_HEADCOUNT:      { value: '1,284', delta: '↑ 12 across all campuses', deltaType: 'up', icon: Users },
    WGT_PRESENT_TODAY:  { value: '1,087', delta: '84.7% group attendance', deltaType: 'up', icon: UserCheck },
    WGT_ABSENT_TODAY:   { value: '197', delta: '↑ 23 vs yesterday', deltaType: 'down', icon: UserX },
    WGT_LOP_MTD:        { value: '47 days', delta: 'Across 5 campuses', deltaType: 'warn', icon: DollarSign },
    WGT_PAYROLL_SUMMARY:{ value: '₹ 2.4 Cr', delta: 'Group total MTD', deltaType: 'up', icon: DollarSign },
    WGT_OPEN_POSITIONS: { value: '18', delta: '5 urgent across campuses', deltaType: 'warn', icon: Users2 },
    WGT_ATTRITION_RATE: { value: '6.2%', delta: 'Group avg YTD', deltaType: 'down', icon: TrendingDown },
  },
  FINANCE: {
    WGT_HEADCOUNT:      { value: '1,284', delta: 'Active on payroll', deltaType: 'up', icon: Users },
    WGT_PRESENT_TODAY:  { value: '1,087', delta: '84.7% billable today', deltaType: 'up', icon: UserCheck },
    WGT_ABSENT_TODAY:   { value: '197', delta: 'Non-billable days', deltaType: 'down', icon: UserX },
    WGT_LOP_MTD:        { value: '47 days', delta: '↑ ₹ 1.2L deduction', deltaType: 'warn', icon: DollarSign },
    WGT_PAYROLL_SUMMARY:{ value: '₹ 2.4 Cr', delta: '↓ 1.2% vs last month', deltaType: 'up', icon: DollarSign },
    WGT_OPEN_POSITIONS: { value: '18', delta: 'Open FTEs budgeted', deltaType: 'warn', icon: Users2 },
    WGT_ATTRITION_RATE: { value: '6.2%', delta: 'Cost impact ₹ 18.4L', deltaType: 'down', icon: TrendingDown },
  },
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
  // ── Engagement & Culture ────────────────────────────────────────────────────
  { id: 'WGT_ENGAGEMENT_SCORE', name: 'Engagement Score', category: 'talent', description: 'Overall employee engagement index with trend vs last quarter', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'line'], sourceModule: 'Engagement & Culture', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Heart },
  { id: 'WGT_SENTIMENT_HEATMAP', name: 'Sentiment by Department', category: 'talent', description: 'Pulse survey sentiment heat map across departments', defaultChartType: 'heatmap', availableChartTypes: ['heatmap', 'bar'], sourceModule: 'Engagement & Culture', roles: ['HR_MANAGER'], context: 'both', icon: ThumbsUp, colSpan: 2 },
  // ── Goals ───────────────────────────────────────────────────────────────────
  { id: 'WGT_GOALS_COMPLETION', name: 'Goal Completion Rate', category: 'talent', description: 'OKR / goal completion % by department and individual', defaultChartType: 'donut', availableChartTypes: ['donut', 'bar', 'table'], sourceModule: 'Goal Setting', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN'], context: 'both', icon: Crosshair },
  { id: 'WGT_GOALS_PENDING', name: 'Pending Goal Approvals', category: 'talent', description: 'Goals awaiting manager / HOD approval with submitter and deadline', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Goal Setting', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: ClipboardList },
  // ── 360 Feedback ────────────────────────────────────────────────────────────
  { id: 'WGT_FEEDBACK360_STATUS', name: '360 Feedback Status', category: 'talent', description: 'Cycle completion: % invited, responded, and pending by dept', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'donut'], sourceModule: 'Feedback 360', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN'], context: 'both', icon: MessageSquare, colSpan: 2 },
  { id: 'WGT_FEEDBACK360_SCORES', name: 'Top 360 Competency Scores', category: 'talent', description: 'Average 360 rating per competency — strengths & development areas', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Feedback 360', roles: ['HR_MANAGER'], context: 'both', icon: Star, colSpan: 2 },
  // ── Calibration ─────────────────────────────────────────────────────────────
  { id: 'WGT_CALIBRATION_STATUS', name: 'Calibration Session Status', category: 'talent', description: 'Open / completed calibration sessions with bell-curve distribution', defaultChartType: 'status_matrix', availableChartTypes: ['status_matrix', 'bar'], sourceModule: 'Calibration', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Sliders, colSpan: 2 },
  // ── Capacity Intelligence ────────────────────────────────────────────────────
  { id: 'WGT_CAPACITY_UTILISATION', name: 'Workforce Capacity Utilisation', category: 'workforce', description: 'Teaching load vs sanctioned capacity — under/over-utilised staff flags', defaultChartType: 'bar', availableChartTypes: ['bar', 'horizontal_bar', 'table'], sourceModule: 'Capacity Intelligence', roles: ['PRINCIPAL', 'HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Database, colSpan: 2 },
  // ── Alumni ───────────────────────────────────────────────────────────────────
  { id: 'WGT_ALUMNI_STATS', name: 'Alumni Network Summary', category: 'hr_ops', description: 'Total alumni, active portal users, placement rate, re-hire requests', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'table'], sourceModule: 'Alumni Portal', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: GraduationCap },
  // ── Research & Publications ──────────────────────────────────────────────────
  { id: 'WGT_RESEARCH_SUMMARY', name: 'Research & Publications', category: 'talent', description: 'Papers published, patents filed, conferences attended YTD by dept', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Research', roles: ['PRINCIPAL', 'HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Microscope, colSpan: 2 },
  // ── Lesson Plans ─────────────────────────────────────────────────────────────
  { id: 'WGT_LESSON_PLAN_STATUS', name: 'Lesson Plan Submission Status', category: 'hr_ops', description: 'Submitted vs pending lesson plans by dept for current month', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'donut'], sourceModule: 'Lesson Plans', roles: ['PRINCIPAL'], context: 'both', icon: BookMarked },
  // ── LMS & Learning ──────────────────────────────────────────────────────────
  { id: 'WGT_LMS_ENROLMENT', name: 'LMS Enrolment Overview', category: 'talent', description: 'Active enrolments, completions, avg score and certification issued', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'bar'], sourceModule: 'LMS', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: BookOpen },
  { id: 'WGT_COURSE_COMPLETION', name: 'Course Completion by Category', category: 'talent', description: 'Completion rate grouped by course category (Mandatory / Elective / Leadership)', defaultChartType: 'bar', availableChartTypes: ['bar', 'donut', 'table'], sourceModule: 'LMS', roles: ['HR_MANAGER'], context: 'both', icon: Award, colSpan: 2 },
  // ── Skill Pathways ────────────────────────────────────────────────────────────
  { id: 'WGT_SKILL_GAP', name: 'Skill Gap Analysis', category: 'talent', description: 'Required vs assessed skill coverage — critical gaps highlighted by dept', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Skill Pathways', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: GitBranch, colSpan: 2 },
  // ── Surveys ───────────────────────────────────────────────────────────────────
  { id: 'WGT_SURVEY_RESPONSE', name: 'Survey Response Rate', category: 'talent', description: 'Active surveys with response rate and pending nudges', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'action_list'], sourceModule: 'Surveys', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: ClipboardList },
  // ── Task Management ───────────────────────────────────────────────────────────
  { id: 'WGT_TASKS_SUMMARY', name: 'HR Tasks Summary', category: 'hr_ops', description: 'Open, in-progress and overdue HR tasks with assignee and priority', defaultChartType: 'action_list', availableChartTypes: ['action_list', 'donut'], sourceModule: 'Task Management', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: CheckSquare },
  // ── Organisation Structure ────────────────────────────────────────────────────
  { id: 'WGT_ORG_HEADCOUNT_TREE', name: 'Org Headcount Breakdown', category: 'workforce', description: 'Headcount by division → department → team hierarchy', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Organisation Structure', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Network, colSpan: 2 },
  // ── Performance Tracking ─────────────────────────────────────────────────────
  { id: 'WGT_PERF_TRACKING', name: 'Performance Tracking Status', category: 'talent', description: 'Live KPI vs KRA achievement % by staff category and dept', defaultChartType: 'bar', availableChartTypes: ['bar', 'horizontal_bar', 'table'], sourceModule: 'Performance Tracking', roles: ['HR_MANAGER', 'PRINCIPAL', 'CHAIRMAN'], context: 'both', icon: BarChart3, colSpan: 2 },
  // ── Mid-Year Review ──────────────────────────────────────────────────────────
  { id: 'WGT_MID_YEAR_REVIEW', name: 'Mid-Year Review Progress', category: 'talent', description: '% of mid-year reviews completed vs pending — overdue list by HOD', defaultChartType: 'donut', availableChartTypes: ['donut', 'action_list'], sourceModule: 'Mid-Year Review', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: RotateCcw },
  // ── Policy ───────────────────────────────────────────────────────────────────
  { id: 'WGT_POLICY_ACK', name: 'Policy Acknowledgement Tracker', category: 'hr_ops', description: 'Active policy acknowledgement campaigns with % staff accepted', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'action_list'], sourceModule: 'Policy', roles: ['HR_MANAGER'], context: 'both', icon: FileText },
  // ── Staff Portfolio ──────────────────────────────────────────────────────────
  { id: 'WGT_PORTFOLIO_UPDATES', name: 'Staff Portfolio Updates', category: 'hr_ops', description: 'Profiles updated / incomplete this month — nudge list for stale profiles', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'action_list'], sourceModule: 'Staff Portfolio', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: FolderOpen },
  // ── Certificates ─────────────────────────────────────────────────────────────
  { id: 'WGT_CERTIFICATES', name: 'Certificates Issued', category: 'hr_ops', description: 'Experience letters, relieving letters and other certificates issued MTD', defaultChartType: 'kpi_card', availableChartTypes: ['kpi_card', 'bar'], sourceModule: 'Certificates', roles: ['HR_MANAGER'], context: 'both', icon: Medal },
  // ── KRA/KPI ──────────────────────────────────────────────────────────────────
  { id: 'WGT_KRA_APPROVAL', name: 'KRA/KPI Approval Pipeline', category: 'talent', description: 'KRA submissions awaiting approval — by HOD, status, and deadline', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'KRA/KPI', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: Sliders },
  // ── Exit Reasons ─────────────────────────────────────────────────────────────
  { id: 'WGT_EXIT_REASONS', name: 'Exit Reasons Analysis', category: 'talent', description: 'Top exit reasons from exit interviews — voluntary vs involuntary split', defaultChartType: 'donut', availableChartTypes: ['donut', 'bar', 'table'], sourceModule: 'Exit', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Lightbulb, colSpan: 2 },
  // ── Additional GOI Widgets ──────────────────────────────────────────────────
  { id: 'WGT_GOI_ATTRITION_CAMPUS', name: 'Attrition per Campus (YTD)', category: 'goi', description: 'YTD attrition % ranked per campus', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Exit + Staff Master', roles: ['CHAIRMAN'], context: 'goi', icon: TrendingDown, colSpan: 2 },
  { id: 'WGT_GOI_ENGAGEMENT', name: 'Engagement Scores per Campus', category: 'goi', description: 'Pulse survey engagement index by campus', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'bar'], sourceModule: 'Engagement & Culture', roles: ['CHAIRMAN'], context: 'goi', icon: Heart },
  { id: 'WGT_GOI_TA_PIPELINE', name: 'GOI Talent Acquisition Summary', category: 'goi', description: 'Open positions, offers out and joiners per campus', defaultChartType: 'table', availableChartTypes: ['table', 'bar'], sourceModule: 'Talent Acquisition', roles: ['CHAIRMAN', 'HR_MANAGER'], context: 'goi', icon: Users2, colSpan: 2 },
  { id: 'WGT_GOI_TRAINING_COMPLETION', name: 'L&D Completion per Campus', category: 'goi', description: 'Training completion % per campus — enrolled vs completed', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'bar'], sourceModule: 'L&D', roles: ['CHAIRMAN'], context: 'goi', icon: BookOpen, colSpan: 2 },
  { id: 'WGT_GOI_STATUTORY_MATRIX', name: 'GOI Statutory Compliance Matrix', category: 'goi', description: 'PF, ESI, TDS, PT filing status per campus', defaultChartType: 'status_matrix', availableChartTypes: ['status_matrix'], sourceModule: 'Payroll', roles: ['CHAIRMAN', 'FINANCE'], context: 'goi', icon: Shield, colSpan: 3 },
  { id: 'WGT_GOI_APPRAISAL_STATUS', name: 'Appraisal Cycle Status per Campus', category: 'goi', description: 'Submitted and completed appraisal counts per campus', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Appraisal', roles: ['CHAIRMAN'], context: 'goi', icon: Target, colSpan: 2 },
  { id: 'WGT_GOI_RESEARCH_OUTPUT', name: 'Research Output per Campus', category: 'goi', description: 'Papers, conferences and patents by campus YTD', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Research', roles: ['CHAIRMAN'], context: 'goi', icon: Microscope, colSpan: 2 },
  { id: 'WGT_GOI_HEADCOUNT_TREND', name: 'GOI Headcount Trend (12M)', category: 'goi', description: 'Monthly net headcount change across all campuses', defaultChartType: 'line', availableChartTypes: ['line', 'area'], sourceModule: 'Staff Master', roles: ['CHAIRMAN', 'HR_MANAGER'], context: 'goi', icon: TrendingUp, colSpan: 3 },
  { id: 'WGT_GOI_LESSON_PLANS', name: 'Lesson Plan Submission per Campus', category: 'goi', description: 'Lesson plan submitted vs total required per campus', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'table'], sourceModule: 'Lesson Plans', roles: ['CHAIRMAN', 'PRINCIPAL'], context: 'goi', icon: BookMarked, colSpan: 2 },
  // ── Attendance extras ───────────────────────────────────────────────────────
  { id: 'WGT_LATE_ARRIVALS', name: 'Late Arrivals Today', category: 'workforce', description: 'Staff who punched in after shift start time today', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Attendance', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: Clock },
  { id: 'WGT_EARLY_DEPARTURES', name: 'Early Departures Today', category: 'workforce', description: 'Staff who left before shift end time today', defaultChartType: 'action_list', availableChartTypes: ['action_list'], sourceModule: 'Attendance', roles: ['HR_MANAGER', 'PRINCIPAL'], context: 'both', icon: LogOut },
  // ── Leave extras ─────────────────────────────────────────────────────────────
  { id: 'WGT_LEAVE_BALANCE', name: 'Leave Balance Summary', category: 'workforce', description: 'Average leave balance by type (EL/CL/SL) across all staff', defaultChartType: 'horizontal_bar', availableChartTypes: ['horizontal_bar', 'table'], sourceModule: 'Leave', roles: ['HR_MANAGER'], context: 'both', icon: Calendar, colSpan: 2 },
  // ── Payroll extras ───────────────────────────────────────────────────────────
  { id: 'WGT_PAYROLL_COMPONENTS', name: 'Payroll Component Breakdown', category: 'hr_ops', description: 'Basic, HRA, DA, Allowances vs Deductions stacked bar', defaultChartType: 'bar', availableChartTypes: ['bar', 'table'], sourceModule: 'Payroll', roles: ['HR_MANAGER', 'FINANCE'], context: 'both', icon: DollarSign, colSpan: 2 },
  // ── Appraisal extras ─────────────────────────────────────────────────────────
  { id: 'WGT_PROMOTION_PIPELINE', name: 'Promotion Pipeline', category: 'talent', description: 'Staff recommended for promotion by dept and current stage', defaultChartType: 'funnel', availableChartTypes: ['funnel', 'table'], sourceModule: 'Appraisal', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: TrendingUp },
  // ── TA extras ────────────────────────────────────────────────────────────────
  { id: 'WGT_TIME_TO_HIRE', name: 'Time-to-Hire Trend (6M)', category: 'talent', description: 'Average days to fill a position per month for last 6 months', defaultChartType: 'line', availableChartTypes: ['line', 'bar'], sourceModule: 'Talent Acquisition', roles: ['HR_MANAGER', 'CHAIRMAN'], context: 'both', icon: Clock },
  { id: 'WGT_OFFER_ACCEPTANCE', name: 'Offer Acceptance Rate', category: 'talent', description: 'Offers made vs accepted per month — decline reasons', defaultChartType: 'bar', availableChartTypes: ['bar', 'donut'], sourceModule: 'Talent Acquisition', roles: ['HR_MANAGER'], context: 'both', icon: CheckCircle2 },
];

const CAT_COLORS: Record<WidgetCategory, string> = {
  workforce: DS.primary, hr_ops: DS.teal, talent: DS.purple, goi: DS.amber, utility: DS.text3,
};

const DEFAULT_LAYOUTS: Record<DashboardRole, Record<Period, string[]>> = {
  HR_MANAGER: {
    today: ['WGT_WORKFORCE_SNAPSHOT', 'WGT_HEADCOUNT', 'WGT_PRESENT_TODAY', 'WGT_ABSENT_TODAY', 'WGT_UAL_TRACKER', 'WGT_ALERTS', 'WGT_ON_LEAVE_DEPT', 'WGT_PENDING_APPROVALS', 'WGT_LEAVE_VIOLATIONS'],
    mtd: ['WGT_LEAVE_MTD_BYTYPE', 'WGT_LOP_MTD', 'WGT_TOP_LOP_STAFF', 'WGT_PAYROLL_READINESS', 'WGT_DEADLINE_CHECKLIST', 'WGT_ONBOARDING_SLA', 'WGT_FF_STATUS', 'WGT_194J_TRACKER', 'WGT_LEAVE_BREAKDOWN', 'WGT_STATUTORY_STATUS', 'WGT_ONBOARDING_PIPELINE'],
    ytd: ['WGT_ATTRITION_TREND_12M', 'WGT_ATTRITION_RATE', 'WGT_HEADCOUNT_SUMMARY', 'WGT_OPEN_POSITIONS', 'WGT_TA_FUNNEL', 'WGT_APPRAISAL_PROGRESS', 'WGT_PROBATION_EXIT', 'WGT_ATT_TREND', 'WGT_APPRAISAL_CYCLE', 'WGT_LD_COMPLETION', 'WGT_EXIT_PIPELINE', 'WGT_ACTIVITY_FEED']
  },
  CHAIRMAN: {
    today: ['WGT_GROUP_KPI', 'WGT_HEADCOUNT', 'WGT_PRESENT_TODAY', 'WGT_ALERTS', 'WGT_STAFF_MOVEMENT', 'WGT_HEADCOUNT_BUDGET'],
    mtd: ['WGT_GOI_CAMPUS_TABLE', 'WGT_PAYROLL_MATRIX', 'WGT_PAYROLL_COST_SUMMARY', 'WGT_LOP_MTD', 'WGT_PAYROLL_SUMMARY', 'WGT_ACTIVITY_FEED'],
    ytd: ['WGT_ATTRITION_TREND_12M', 'WGT_ATTRITION_RATE', 'WGT_ATTRITION_LEAGUE', 'WGT_PAYROLL_TREND_12M', 'WGT_PERFORMANCE_DIST', 'WGT_HIGH_PERFORMER_RISK', 'WGT_APPRAISAL_PROGRESS', 'WGT_APPRAISAL_CYCLE', 'WGT_GOI_ATTRITION_CAMPUS', 'WGT_GOI_ENGAGEMENT', 'WGT_GOI_APPRAISAL_STATUS', 'WGT_GOI_RESEARCH_OUTPUT', 'WGT_GOI_HEADCOUNT_TREND']
  },
  PRINCIPAL: {
    today: ['WGT_PRESENT_TODAY', 'WGT_ABSENT_TODAY', 'WGT_UNSUBSTITUTED', 'WGT_TODAY_ABSENCES_CLASS', 'WGT_ALERTS', 'WGT_DEPT_COVERAGE'],
    mtd: ['WGT_UPCOMING_LEAVE_7D', 'WGT_PENDING_APPROVALS', 'WGT_DEPT_HEATMAP', 'WGT_ON_LEAVE_DEPT', 'WGT_STAFF_STRENGTH', 'WGT_ACTIVITY_FEED'],
    ytd: ['WGT_APPRAISAL_PROGRESS', 'WGT_APPRAISAL_CYCLE', 'WGT_PROBATION_EXIT', 'WGT_PROBATION_EXPIRY', 'WGT_LD_COMPLETION', 'WGT_LEAVE_BREAKDOWN', 'WGT_UAL_TRACKER']
  },
  FINANCE: {
    today: ['WGT_HEADCOUNT', 'WGT_PRESENT_TODAY', 'WGT_ALERTS'],
    mtd: ['WGT_PAYROLL_MATRIX', 'WGT_PAYROLL_COST_SUMMARY', 'WGT_LOP_MTD', 'WGT_PAYROLL_SUMMARY', 'WGT_ACTIVITY_FEED'],
    ytd: ['WGT_PAYROLL_TREND_12M']
  }
};





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
function renderWidget(id: string, chartType: ChartTypeOption, role?: DashboardRole, callbacks?: { onCampusSelect?: (campus: string) => void }) {
  const roleOverrides = role ? ROLE_KPI_OVERRIDES[role] : undefined;
  const kpi = (roleOverrides && roleOverrides[id]) ? roleOverrides[id]! : KPI_WIDGETS_DATA[id];

  if (id === 'WGT_WORKFORCE_SNAPSHOT') {
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs mt-2">
          <table className="w-full text-left">
            <thead>
              <tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold text-right">Count</th>
                <th className="pb-2 font-semibold text-right">Active</th>
                <th className="pb-2 font-semibold text-right">On Leave</th>
              </tr>
            </thead>
            <tbody>
              {WORKFORCE_BY_STAFF_TYPE.map((row) => (
                <tr key={row.type} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-2" style={{ color: DS.text }}>{row.type}</td>
                  <td className="py-2 text-right font-bold">{row.count}</td>
                  <td className="py-2 text-right font-medium" style={{ color: DS.success }}>{row.active}</td>
                  <td className="py-2 text-right font-medium" style={{ color: DS.warning }}>{row.onLeave}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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
    if (chartType === 'donut') {
      const DONUT_COLORS = [DS.primary, DS.teal, DS.purple, DS.amber, DS.pink, DS.error];
      const donutData = ON_LEAVE_BY_DEPT.map((d, i) => ({ name: d.dept, value: d.count, color: DONUT_COLORS[i % DONUT_COLORS.length] }));
      return (
        <div className="flex items-center gap-4 h-full pt-2">
          <ResponsiveContainer width={100} height={100}>
            <RePieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={24} outerRadius={44} dataKey="value" strokeWidth={0}>
                {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 10, fontSize: 11 }} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-1 flex-1">
            {donutData.map(e => (
              <div key={e.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                <span className="text-xs flex-1" style={{ color: DS.text2 }}>{e.name}</span>
                <span className="text-xs font-bold" style={{ color: DS.text }}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
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
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs mt-2">
          <table className="w-full text-left">
            <thead>
              <tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
                <th className="pb-2 font-semibold">Leave Type</th>
                <th className="pb-2 font-semibold text-right" style={{ color: DS.primary }}>Teaching</th>
                <th className="pb-2 font-semibold text-right" style={{ color: DS.teal }}>Non-Teaching</th>
                <th className="pb-2 font-semibold text-right" style={{ color: DS.amber }}>Contract</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_CONSUMPTION_MTD.map((row) => (
                <tr key={row.type} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-2 font-medium" style={{ color: DS.text }}>{row.type}</td>
                  <td className="py-2 text-right font-bold">{row.teaching}</td>
                  <td className="py-2 text-right font-bold">{row.nonTeaching}</td>
                  <td className="py-2 text-right font-bold">{row.contract}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead><tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
              <th className="pb-2 font-semibold">Dept</th>
              <th className="pb-2 text-right font-semibold">Classes</th>
              <th className="pb-2 text-right font-semibold">Subst.</th>
              <th className="pb-2 text-right font-semibold" style={{ color: DS.error }}>Pending</th>
              <th className="pb-2 text-right font-semibold">Coverage</th>
            </tr></thead>
            <tbody>
              {DEPT_COVERAGE_DATA.map(row => (
                <tr key={row.dept} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-1.5" style={{ color: DS.text }}>{row.dept}</td>
                  <td className="py-1.5 text-right">{row.classes}</td>
                  <td className="py-1.5 text-right" style={{ color: DS.success }}>{row.substituted}</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: row.pending > 0 ? DS.error : DS.text3 }}>{row.pending}</td>
                  <td className="py-1.5 text-right font-black" style={{ color: row.coverage === 100 ? DS.success : row.coverage >= 80 ? DS.amber : DS.error }}>{row.coverage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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

  // KPI widget generic fallback
  if (kpi) {
    if (chartType === 'donut' && id === 'WGT_PRESENT_TODAY') {
      const d = [{name: 'Present', value: 1087, color: DS.success}, {name: 'Absent', value: 197, color: DS.error}];
      return (
        <div className="flex items-center gap-4 h-full pt-2">
          <ResponsiveContainer width={80} height={80}>
            <RePieChart>
              <Pie data={d} cx="50%" cy="50%" innerRadius={20} outerRadius={36} dataKey="value" strokeWidth={0}>
                {d.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {d.map(e => (
               <div key={e.name} className="flex justify-between items-center text-xs">
                 <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: e.color }}/> <span style={{ color: DS.text3 }}>{e.name}</span></div>
                 <span className="font-bold" style={{ color: DS.text }}>{e.value}</span>
               </div>
            ))}
          </div>
        </div>
      );
    }
    if (chartType === 'action_list' && id === 'WGT_ABSENT_TODAY') {
       return (
         <div className="space-y-2 mt-2">
           {[{n: 'Ravi Naik', r: 'Sick'}, {n: 'Priya Raj', r: 'Casual'}, {n: 'Anil Kumar', r: 'LOP'}].map((p, i) => (
             <div key={i} className="flex justify-between items-center p-2 rounded-lg" style={{ background: DS.bgLow }}>
               <span className="text-xs font-semibold" style={{ color: DS.text }}>{p.n}</span>
               <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: DS.errorBg, color: DS.error }}>{p.r}</span>
             </div>
           ))}
         </div>
       );
    }
    if (chartType === 'line') {
      const d = id === 'WGT_LOP_MTD' ? [{v: 10}, {v: 25}, {v: 15}, {v: 47}] : [{v: 4}, {v: 5}, {v: 5.8}, {v: 6.2}];
      return (
        <div className="h-full flex flex-col justify-end pt-3">
          <div className="flex items-start justify-between mb-4">
            <span className="text-2xl font-black" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{kpi.value}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: kpi.deltaType === 'down' ? DS.errorBg : DS.successBg, color: kpi.deltaType === 'down' ? DS.error : kpi.deltaType === 'up' ? DS.success : DS.warning }}>{kpi.delta}</span>
          </div>
          <ResponsiveContainer width="100%" height={45}>
            <ReLineChart data={d}>
               <Line type="monotone" dataKey="v" stroke={DS.primary} strokeWidth={2.5} dot={false} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      );
    }
    if (chartType === 'action_list' && id === 'WGT_OPEN_POSITIONS') {
      const positions = [
        { title: 'Maths Teacher', dept: 'Secondary', open: 2, priority: 'High' },
        { title: 'Librarian', dept: 'Admin', open: 1, priority: 'Medium' },
        { title: 'Science HOD', dept: 'Secondary', open: 1, priority: 'High' },
      ];
      return (
        <div className="space-y-2 mt-2">
          {positions.map((p, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-lg" style={{ background: DS.bgLow }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: DS.text }}>{p.title}</p>
                <p className="text-[10px]" style={{ color: DS.text3 }}>{p.dept} · {p.open} open</p>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: p.priority === 'High' ? DS.errorBg : DS.warningBg, color: p.priority === 'High' ? DS.error : DS.warning }}>{p.priority}</span>
            </div>
          ))}
        </div>
      );
    }
    return <KPICard label={WIDGET_CATALOGUE.find(w => w.id === id)?.name || id} value={kpi.value} delta={kpi.delta} deltaType={kpi.deltaType} icon={kpi.icon} />;
  }

  if (id === 'WGT_LEAVE_BREAKDOWN') {
    const max = Math.max(...LEAVE_BREAKDOWN.map(l => l.count));
    if (chartType === 'donut') {
      return (
        <div className="flex items-center gap-4 h-full pt-2">
          <ResponsiveContainer width={100} height={100}>
            <RePieChart>
              <Pie data={LEAVE_BREAKDOWN} cx="50%" cy="50%" innerRadius={24} outerRadius={44} dataKey="count" strokeWidth={0}>
                {LEAVE_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 10, fontSize: 11 }} formatter={(v: any) => [v, 'Days']} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 flex-1">
            {LEAVE_BREAKDOWN.map(e => (
              <div key={e.type} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                <span className="text-xs flex-1" style={{ color: DS.text2 }}>{e.type}</span>
                <span className="text-xs font-bold" style={{ color: DS.text }}>{e.count}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs mt-1">
          <table className="w-full text-left">
            <thead>
              <tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
                <th className="pb-2 font-semibold">Leave Type</th>
                <th className="pb-2 font-semibold text-right">Count</th>
                <th className="pb-2 font-semibold text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_BREAKDOWN.map(l => (
                <tr key={l.type} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-1.5 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: l.color }} />
                    <span style={{ color: DS.text }}>{l.type}</span>
                  </td>
                  <td className="py-1.5 text-right font-bold" style={{ color: DS.text }}>{l.count}</td>
                  <td className="py-1.5 text-right" style={{ color: DS.text3 }}>{Math.round(l.count / LEAVE_BREAKDOWN.reduce((s, x) => s + x.count, 0) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    // default: horizontal_bar
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={160}>
          <ReBarChart data={ATTENDANCE_TREND.slice(-14)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Bar dataKey="present" fill={DS.primary} name="Present" radius={[2, 2, 0, 0]} />
            <Bar dataKey="absent" fill={DS.error} name="Absent" radius={[2, 2, 0, 0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={160}>
          <ReLineChart data={ATTENDANCE_TREND.slice(-14)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Line type="monotone" dataKey="present" stroke={DS.primary} strokeWidth={2} name="Present" dot={false} />
            <Line type="monotone" dataKey="absent" stroke={DS.error} strokeWidth={2} name="Absent" dot={false} />
          </ReLineChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'bar') {
      // Flatten heatmap into bar chart data: total leave per dept
      const barData = DEPT_HEATMAP_DATA.map(row => ({
        dept: row.dept,
        CL: row.CL, SL: row.SL, EL: row.EL, LOP: row.LOP, UAL: row.UAL,
      }));
      return (
        <ResponsiveContainer width="100%" height={160}>
          <ReBarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="dept" tick={{ fontSize: 9, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 9 }} />
            <Bar dataKey="CL" name="CL" fill={DS.primary} stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="SL" name="SL" fill={DS.success} stackId="a" />
            <Bar dataKey="EL" name="EL" fill={DS.purple} stackId="a" />
            <Bar dataKey="LOP" name="LOP" fill={DS.error} stackId="a" />
            <Bar dataKey="UAL" name="UAL" fill={DS.amber} stackId="a" radius={[3,3,0,0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={150}>
          <ReBarChart data={ONBOARDING_STAGES} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="stage" tick={{ fontSize: 8, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Bar dataKey="count" name="Joiners" fill={DS.teal} radius={[4, 4, 0, 0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={150}>
          <ReBarChart data={EXIT_FUNNEL} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="stage" tick={{ fontSize: 9, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Bar dataKey="count" name="Staff" radius={[4, 4, 0, 0]}>
              {EXIT_FUNNEL.map((_e, i) => <Cell key={i} fill={[DS.pink, DS.error, DS.warning, DS.amber][i % 4]} />)}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={130}>
          <ReBarChart data={APPRAISAL_DONUT} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} formatter={(v: any) => [`${v}%`]} />
            <Bar dataKey="value" name="%" radius={[4, 4, 0, 0]}>
              {APPRAISAL_DONUT.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'horizontal_bar') {
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
    // default bar (vertical)
    return (
      <ResponsiveContainer width="100%" height={150}>
        <ReBarChart data={LD_COMPLETION} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="completed" name="Completion %" radius={[4, 4, 0, 0]}>
            {LD_COMPLETION.map((e, i) => (
              <Cell key={i} fill={e.completed >= 80 ? DS.success : e.completed >= 60 ? DS.amber : DS.error} />
            ))}
          </Bar>
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
        {callbacks?.onCampusSelect && (
          <p className="text-[10px] font-semibold mb-2" style={{ color: DS.text3 }}>
            Click any campus row to drill down into individual campus metrics
          </p>
        )}
        <table className="w-full text-xs">
          <thead><tr>{['Campus', 'Type', 'Staff', 'Present', 'On Leave', 'LOP', 'Payroll', 'Health', ...(callbacks?.onCampusSelect ? [''] : [])].map(h => (
            <th key={h} className="text-left pb-2 pr-3 font-semibold" style={{ color: DS.text3 }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {GOI_CAMPUS_DATA.map((row) => {
              const p = payrollStyle(row.payroll);
              const canDrill = !!callbacks?.onCampusSelect;
              return (
                <tr
                  key={row.name}
                  style={{ borderTop: `1px solid ${DS.border}`, cursor: canDrill ? 'pointer' : 'default', transition: 'background 0.15s' }}
                  className={canDrill ? 'hover:bg-blue-50/50' : ''}
                  onClick={canDrill ? () => callbacks?.onCampusSelect?.(row.name) : undefined}
                >
                  <td className="py-2 pr-3 font-semibold" style={{ color: DS.primary }}>{row.name}</td>
                  <td className="py-2 pr-3" style={{ color: DS.text3 }}>{row.type}</td>
                  <td className="py-2 pr-3 font-bold" style={{ color: DS.text }}>{row.staff}</td>
                  <td className="py-2 pr-3" style={{ color: DS.success }}>{row.present}</td>
                  <td className="py-2 pr-3" style={{ color: DS.warning }}>{row.onLeave}</td>
                  <td className="py-2 pr-3" style={{ color: DS.error }}>{row.lop}</td>
                  <td className="py-2 pr-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: p.bg, color: p.color }}>{row.payroll}</span></td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
                        <div className="h-full rounded-full" style={{ width: `${row.health}%`, background: row.health >= 80 ? DS.success : row.health >= 60 ? DS.amber : DS.error }} />
                      </div>
                      <span className="font-bold" style={{ color: DS.text }}>{row.health}%</span>
                    </div>
                  </td>
                  {canDrill && (
                    <td className="py-2 pl-2">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap" style={{ background: DS.primaryGrad, color: 'white' }}>
                        Drill Down →
                      </span>
                    </td>
                  )}
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
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead><tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
              <th className="pb-2 font-semibold">Staff Type</th>
              <th className="pb-2 font-semibold text-right">Sanctioned</th>
              <th className="pb-2 font-semibold text-right">Actual</th>
              <th className="pb-2 font-semibold text-right" style={{ color: DS.error }}>Gap</th>
            </tr></thead>
            <tbody>
              {HEADCOUNT_SUMMARY_DATA.map(r => (
                <tr key={r.type} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-1.5" style={{ color: DS.text }}>{r.type}</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: DS.text }}>{r.sanctioned}</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: DS.success }}>{r.actual}</td>
                  <td className="py-1.5 text-right font-black" style={{ color: DS.error }}>{r.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={150}>
          <ReBarChart data={TA_FUNNEL_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="stage" tick={{ fontSize: 8, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
              {TA_FUNNEL_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'status_matrix') {
      return (
        <div className="space-y-2">
          {VISITING_194J_DATA.map((row, i) => {
            const s = row.compliance === 'ok' ? { color: DS.success, bg: DS.successBg, label: 'Compliant' } : row.compliance === 'warn' ? { color: DS.warning, bg: DS.warningBg, label: 'Partial' } : { color: DS.error, bg: DS.errorBg, label: 'Non-Compliant' };
            return (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: s.bg }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: DS.text }}>{row.name} <span style={{ color: DS.text3 }}>· {row.subject}</span></p>
                  <p className="text-[10px]" style={{ color: DS.text3 }}>{row.sessions} sessions</p>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: row.tdsDeducted ? DS.successBg : DS.errorBg, color: row.tdsDeducted ? DS.success : DS.error }}>TDS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: row.form26Q ? DS.successBg : DS.errorBg, color: row.form26Q ? DS.success : DS.error }}>26Q</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'white', color: s.color }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${DS.border}` }}>
              {['Faculty', 'Subject', 'Sessions', 'TDS', 'Form 26Q', 'Status'].map(h => (
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
                  <td className="py-1.5 pr-3">{row.tdsDeducted ? <span style={{ color: DS.success }}>✓</span> : <span style={{ color: DS.error }}>✗</span>}</td>
                  <td className="py-1.5 pr-3">{row.form26Q ? <span style={{ color: DS.success }}>✓</span> : <span style={{ color: DS.error }}>✗</span>}</td>
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={170}>
          <ReBarChart data={ATTRITION_TREND_12M} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 10, fill: DS.text3 }} domain={[0, 10]} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="voluntary" name="Voluntary %" fill={DS.amber} stackId="a" />
            <Bar dataKey="involuntary" name="Involuntary %" fill={DS.error} stackId="a" radius={[3,3,0,0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={180}>
          <ReBarChart data={PAYROLL_COST_SUMMARY_DATA} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="campus" tick={{ fontSize: 8, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="L" />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 9 }} />
            <Bar dataKey="gross" name="Gross" fill={DS.primary} radius={[4,4,0,0]} />
            <Bar dataKey="net" name="Net" fill={DS.success} radius={[4,4,0,0]} />
            <Bar dataKey="lop" name="LOP Ded." fill={DS.error} radius={[4,4,0,0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${DS.border}` }}>
              {['Campus', 'Gross (₹L)', 'Net (₹L)', 'LOP Ded.', 'Budget (₹L)', 'vs Budget', 'Cost/Emp'].map(h => (
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
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead><tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
              <th className="pb-2 font-semibold">Campus</th>
              <th className="pb-2 text-right font-semibold" style={{ color: DS.success }}>Joiners</th>
              <th className="pb-2 text-right font-semibold" style={{ color: DS.error }}>Exits</th>
              <th className="pb-2 text-right font-semibold">Net</th>
            </tr></thead>
            <tbody>
              {STAFF_MOVEMENT_DATA.map(r => (
                <tr key={r.campus} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-1.5" style={{ color: DS.text }}>{r.campus}</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: DS.success }}>+{r.joiners}</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: DS.error }}>-{r.exits}</td>
                  <td className="py-1.5 text-right font-black" style={{ color: r.net >= 0 ? DS.success : DS.error }}>{r.net >= 0 ? '+' : ''}{r.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={150}>
          <ReBarChart data={ATTRITION_LEAGUE_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="campus" tick={{ fontSize: 8, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 9 }} />
            <Bar dataKey="voluntary" name="Voluntary %" fill={DS.amber} stackId="a" />
            <Bar dataKey="involuntary" name="Involuntary %" fill={DS.error} stackId="a" radius={[3,3,0,0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead><tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
              <th className="pb-2 font-semibold">Campus</th>
              <th className="pb-2 text-right font-semibold">Sanctioned</th>
              <th className="pb-2 text-right font-semibold">Actual</th>
              <th className="pb-2 text-right font-semibold" style={{ color: DS.error }}>Gap</th>
            </tr></thead>
            <tbody>
              {HEADCOUNT_BUDGET_DATA.map(r => (
                <tr key={r.campus} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-1.5" style={{ color: DS.text }}>{r.campus}</td>
                  <td className="py-1.5 text-right font-bold">{r.sanctioned}</td>
                  <td className="py-1.5 text-right font-bold" style={{ color: DS.primary }}>{r.actual}</td>
                  <td className="py-1.5 text-right font-black" style={{ color: DS.error }}>{r.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={180}>
          <ReBarChart data={PAYROLL_TREND_12M_DATA} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 10, fill: DS.text3 }} unit="L" />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="xavier" name="St. Xavier's" fill={DS.primary} stackId="a" />
            <Bar dataKey="holyCross" name="Holy Cross" fill={DS.error} stackId="a" />
            <Bar dataKey="delhi" name="Delhi Public" fill={DS.teal} stackId="a" />
            <Bar dataKey="presidency" name="Presidency" fill={DS.amber} stackId="a" />
            <Bar dataKey="bishop" name="Bishop Cotton" fill={DS.purple} stackId="a" radius={[3,3,0,0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
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
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead><tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
              {['Campus','Outstanding','Good','Average','Below Avg','Poor'].map(h => <th key={h} className="pb-2 pr-2 font-semibold">{h}</th>)}
            </tr></thead>
            <tbody>
              {PERFORMANCE_DIST_DATA.map(r => (
                <tr key={r.campus} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                  <td className="py-1.5 pr-2 font-semibold" style={{ color: DS.text }}>{r.campus}</td>
                  <td className="py-1.5 pr-2 font-bold" style={{ color: DS.success }}>{r.outstanding}%</td>
                  <td className="py-1.5 pr-2" style={{ color: DS.teal }}>{r.good}%</td>
                  <td className="py-1.5 pr-2" style={{ color: DS.primary }}>{r.average}%</td>
                  <td className="py-1.5 pr-2" style={{ color: DS.amber }}>{r.belowAvg}%</td>
                  <td className="py-1.5" style={{ color: DS.error }}>{r.poor}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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

  // ── GOI Attrition per Campus ─────────────────────────────────────────────────
  if (id === 'WGT_GOI_ATTRITION_CAMPUS') {
    const attrData = [
      { name: "St. Xavier's", rate: 3.2 }, { name: 'Holy Cross', rate: 8.7 },
      { name: 'Delhi Public', rate: 2.8 }, { name: 'Presidency', rate: 9.4 }, { name: 'Bishop Cotton', rate: 5.1 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={attrData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="%" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} formatter={(v: any) => [`${v}%`, 'Attrition']} />
          <Bar dataKey="rate" name="Attrition %" fill={DS.error} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── GOI Engagement Scores per Campus ─────────────────────────────────────────
  if (id === 'WGT_GOI_ENGAGEMENT') {
    const engData = [
      { name: "St. Xavier's", score: 82 }, { name: 'Holy Cross', score: 54 },
      { name: 'Delhi Public', score: 79 }, { name: 'Presidency', score: 62 }, { name: 'Bishop Cotton', score: 71 },
    ];
    const max = 100;
    return (
      <div className="space-y-2">
        {engData.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="text-[10px] font-medium w-24 flex-shrink-0 truncate" style={{ color: DS.text2 }}>{d.name}</span>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(d.score / max) * 100}%`, background: d.score >= 75 ? DS.success : d.score >= 60 ? DS.amber : DS.error }} />
            </div>
            <span className="text-xs font-bold w-8 text-right" style={{ color: DS.text }}>{d.score}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── GOI Talent Acquisition Summary ───────────────────────────────────────────
  if (id === 'WGT_GOI_TA_PIPELINE') {
    const taData = [
      { campus: "St. Xavier's", open: 4, offers: 2, joined: 3, days: 18 },
      { campus: 'Holy Cross', open: 11, offers: 4, joined: 1, days: 34 },
      { campus: 'Delhi Public', open: 3, offers: 1, joined: 2, days: 16 },
      { campus: 'Presidency', open: 14, offers: 6, joined: 2, days: 38 },
      { campus: 'Bishop Cotton', open: 6, offers: 2, joined: 1, days: 24 },
    ];
    return (
      <div className="overflow-x-auto text-xs mt-1">
        <table className="w-full text-left">
          <thead>
            <tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
              <th className="pb-2 font-semibold">Campus</th>
              <th className="pb-2 font-semibold text-right">Open</th>
              <th className="pb-2 font-semibold text-right">Offers Out</th>
              <th className="pb-2 font-semibold text-right">Joined MTD</th>
              <th className="pb-2 font-semibold text-right">Avg Days-to-Hire</th>
            </tr>
          </thead>
          <tbody>
            {taData.map(r => (
              <tr key={r.campus} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                <td className="py-1.5" style={{ color: DS.text }}>{r.campus}</td>
                <td className="py-1.5 text-right font-bold" style={{ color: r.open > 8 ? DS.error : DS.text }}>{r.open}</td>
                <td className="py-1.5 text-right font-medium" style={{ color: DS.text2 }}>{r.offers}</td>
                <td className="py-1.5 text-right font-medium" style={{ color: DS.success }}>{r.joined}</td>
                <td className="py-1.5 text-right font-medium" style={{ color: r.days > 30 ? DS.error : DS.text2 }}>{r.days}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── GOI L&D Completion per Campus ────────────────────────────────────────────
  if (id === 'WGT_GOI_TRAINING_COMPLETION') {
    const ldData = [
      { name: "St. Xavier's", enrolled: 142, completed: 128 },
      { name: 'Holy Cross', enrolled: 180, completed: 112 },
      { name: 'Delhi Public', enrolled: 130, completed: 122 },
      { name: 'Presidency', enrolled: 220, completed: 148 },
      { name: 'Bishop Cotton', enrolled: 110, completed: 86 },
    ];
    return (
      <div className="space-y-2">
        {ldData.map(d => (
          <div key={d.name}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-medium" style={{ color: DS.text2 }}>{d.name}</span>
              <span className="text-[10px] font-bold" style={{ color: DS.text }}>{d.completed}/{d.enrolled} ({Math.round((d.completed / d.enrolled) * 100)}%)</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(d.completed / d.enrolled) * 100}%`, background: DS.teal }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── GOI Statutory Compliance Matrix ──────────────────────────────────────────
  if (id === 'WGT_GOI_STATUTORY_MATRIX') {
    const statData = [
      { campus: "St. Xavier's", pf: 'filed', esi: 'filed', tds: 'filed', pt: 'filed' },
      { campus: 'Holy Cross', pf: 'filed', esi: 'filed', tds: 'pending', pt: 'filed' },
      { campus: 'Delhi Public', pf: 'filed', esi: 'filed', tds: 'filed', pt: 'filed' },
      { campus: 'Presidency', pf: 'filed', esi: 'pending', tds: 'pending', pt: 'filed' },
      { campus: 'Bishop Cotton', pf: 'filed', esi: 'filed', tds: 'filed', pt: 'pending' },
    ] as const;
    const statColor = (s: string) => s === 'filed' ? { bg: DS.successBg, color: DS.success } : s === 'pending' ? { bg: DS.warningBg, color: DS.warning } : { bg: DS.errorBg, color: DS.error };
    return (
      <div className="overflow-x-auto text-xs mt-1">
        <table className="w-full text-left">
          <thead>
            <tr style={{ color: DS.text3, borderBottom: `1px solid ${DS.border}` }}>
              <th className="pb-2 font-semibold">Campus</th>
              {(['PF', 'ESI', 'TDS', 'PT'] as const).map(h => <th key={h} className="pb-2 font-semibold text-center">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {statData.map(r => (
              <tr key={r.campus} style={{ borderBottom: `1px dotted ${DS.border}` }}>
                <td className="py-1.5" style={{ color: DS.text }}>{r.campus}</td>
                {([r.pf, r.esi, r.tds, r.pt] as string[]).map((s, i) => {
                  const sc = statColor(s);
                  return <td key={i} className="py-1.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: sc.bg, color: sc.color }}>{s}</span></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── GOI Appraisal Status per Campus ──────────────────────────────────────────
  if (id === 'WGT_GOI_APPRAISAL_STATUS') {
    const apData = [
      { name: "St. Xavier's", submitted: 172, completed: 165 },
      { name: 'Holy Cross', submitted: 188, completed: 142 },
      { name: 'Delhi Public', submitted: 148, completed: 144 },
      { name: 'Presidency', submitted: 234, completed: 188 },
      { name: 'Bishop Cotton', submitted: 126, completed: 114 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={apData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="submitted" name="Submitted" fill={DS.primary} radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" name="Completed" fill={DS.success} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── GOI Research Output per Campus ───────────────────────────────────────────
  if (id === 'WGT_GOI_RESEARCH_OUTPUT') {
    const resData = [
      { name: "St. Xavier's", papers: 12, conferences: 8, patents: 1 },
      { name: 'Holy Cross', papers: 6, conferences: 4, patents: 0 },
      { name: 'Delhi Public', papers: 8, conferences: 6, patents: 2 },
      { name: 'Presidency', papers: 22, conferences: 14, patents: 3 },
      { name: 'Bishop Cotton', papers: 5, conferences: 3, patents: 0 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={resData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="papers" name="Papers" stackId="a" fill={DS.primary} />
          <Bar dataKey="conferences" name="Conferences" stackId="a" fill={DS.teal} />
          <Bar dataKey="patents" name="Patents" stackId="a" fill={DS.purple} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── GOI Headcount Trend 12M ───────────────────────────────────────────────────
  if (id === 'WGT_GOI_HEADCOUNT_TREND') {
    const hcTrend = [
      { month: 'Jan', total: 992 }, { month: 'Feb', total: 1008 }, { month: 'Mar', total: 1024 },
      { month: 'Apr', total: 1018 }, { month: 'May', total: 1031 }, { month: 'Jun', total: 1044 },
      { month: 'Jul', total: 1039 }, { month: 'Aug', total: 1052 }, { month: 'Sep', total: 1068 },
      { month: 'Oct', total: 1076 }, { month: 'Nov', total: 1082 }, { month: 'Dec', total: 1095 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReLineChart data={hcTrend} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="month" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Line type="monotone" dataKey="total" name="Total Headcount" stroke={DS.primary} strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    );
  }

  // ── GOI Lesson Plans per Campus ───────────────────────────────────────────────
  if (id === 'WGT_GOI_LESSON_PLANS') {
    const lpData = [
      { name: "St. Xavier's", submitted: 178, total: 187 },
      { name: 'Holy Cross', submitted: 196, total: 234 },
      { name: 'Delhi Public', submitted: 152, total: 156 },
      { name: 'Presidency', submitted: 241, total: 298 },
      { name: 'Bishop Cotton', submitted: 128, total: 142 },
    ];
    return (
      <div className="space-y-2">
        {lpData.map(d => (
          <div key={d.name}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-medium" style={{ color: DS.text2 }}>{d.name}</span>
              <span className="text-[10px] font-bold" style={{ color: DS.text }}>{d.submitted}/{d.total}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(d.submitted / d.total) * 100}%`, background: (d.submitted / d.total) >= 0.9 ? DS.success : (d.submitted / d.total) >= 0.75 ? DS.amber : DS.error }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Late Arrivals Today ───────────────────────────────────────────────────────
  if (id === 'WGT_LATE_ARRIVALS') {
    const lateData = [
      { name: 'Arjun Mehta', dept: 'Science', punchIn: '09:18', minsLate: 18 },
      { name: 'Priya Nair', dept: 'Admin', punchIn: '09:32', minsLate: 32 },
      { name: 'Sunil Rao', dept: 'Maths', punchIn: '09:12', minsLate: 12 },
      { name: 'Kavitha S', dept: 'English', punchIn: '09:45', minsLate: 45 },
      { name: 'Dinesh T', dept: 'PE', punchIn: '09:22', minsLate: 22 },
    ];
    return (
      <div className="space-y-2">
        {lateData.map((e, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: DS.warningBg }}>
            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: DS.warning }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{e.name} · <span style={{ color: DS.text3 }}>{e.dept}</span></p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>Punched in at {e.punchIn}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: DS.warning, color: 'white' }}>+{e.minsLate}m</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Early Departures Today ────────────────────────────────────────────────────
  if (id === 'WGT_EARLY_DEPARTURES') {
    const earlyData = [
      { name: 'Meena Rao', dept: 'Commerce', punchOut: '16:14', minsEarly: 46 },
      { name: 'Rahul Jain', dept: 'Admin', punchOut: '16:38', minsEarly: 22 },
      { name: 'Anitha K', dept: 'Science', punchOut: '16:05', minsEarly: 55 },
    ];
    return (
      <div className="space-y-2">
        {earlyData.map((e, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: DS.blueBg }}>
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" style={{ color: DS.blue }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{e.name} · <span style={{ color: DS.text3 }}>{e.dept}</span></p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>Punched out at {e.punchOut}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: DS.blue, color: 'white' }}>-{e.minsEarly}m</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Leave Balance Summary ────────────────────────────────────────────────────
  if (id === 'WGT_LEAVE_BALANCE') {
    const balData = [
      { type: 'Earned Leave (EL)', avg: 8.4, max: 30 },
      { type: 'Casual Leave (CL)', avg: 4.2, max: 12 },
      { type: 'Sick Leave (SL)', avg: 6.1, max: 15 },
    ];
    return (
      <div className="space-y-3">
        {balData.map(d => (
          <div key={d.type} className="flex items-center gap-3">
            <span className="text-xs font-medium w-36 flex-shrink-0" style={{ color: DS.text2 }}>{d.type}</span>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(d.avg / d.max) * 100}%`, background: DS.primary }} />
            </div>
            <span className="text-xs font-bold w-16 text-right" style={{ color: DS.text }}>avg {d.avg}d</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Payroll Component Breakdown ───────────────────────────────────────────────
  if (id === 'WGT_PAYROLL_COMPONENTS') {
    const compData = [
      { dept: 'Teaching', basic: 480000, hra: 192000, da: 96000, allowances: 72000, deductions: 84000 },
      { dept: 'Non-Teaching', basic: 260000, hra: 104000, da: 52000, allowances: 38000, deductions: 42000 },
      { dept: 'Admin', basic: 180000, hra: 72000, da: 36000, allowances: 28000, deductions: 32000 },
      { dept: 'Visiting', basic: 120000, hra: 0, da: 0, allowances: 12000, deductions: 14400 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={compData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="basic" name="Basic" stackId="a" fill={DS.primary} />
          <Bar dataKey="hra" name="HRA" stackId="a" fill={DS.teal} />
          <Bar dataKey="da" name="DA" stackId="a" fill={DS.purple} />
          <Bar dataKey="allowances" name="Allowances" stackId="a" fill={DS.amber} />
          <Bar dataKey="deductions" name="Deductions" stackId="b" fill={DS.error} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Promotion Pipeline ────────────────────────────────────────────────────────
  if (id === 'WGT_PROMOTION_PIPELINE') {
    const promStages = [
      { stage: 'Recommended', count: 42 },
      { stage: 'HOD Approved', count: 34 },
      { stage: 'HR Review', count: 24 },
      { stage: 'Management', count: 16 },
      { stage: 'Promoted', count: 11 },
    ];
    return (
      <div className="space-y-2">
        {promStages.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-medium w-28 flex-shrink-0" style={{ color: DS.text2 }}>{s.stage}</span>
            <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-lg flex items-center px-2" style={{ width: `${(s.count / 42) * 100}%`, background: DS.primary, minWidth: '2rem' }}>
                <span className="text-[10px] font-bold text-white">{s.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Time-to-Hire Trend 6M ────────────────────────────────────────────────────
  if (id === 'WGT_TIME_TO_HIRE') {
    const tthData = [
      { month: 'Jan', days: 28 }, { month: 'Feb', days: 32 }, { month: 'Mar', days: 24 },
      { month: 'Apr', days: 36 }, { month: 'May', days: 29 }, { month: 'Jun', days: 22 },
    ];
    return (
      <ResponsiveContainer width="100%" height={140}>
        <ReLineChart data={tthData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="month" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="d" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} formatter={(v: any) => [`${v} days`, 'Avg Days-to-Hire']} />
          <Line type="monotone" dataKey="days" name="Avg Days" stroke={DS.primary} strokeWidth={2} dot={{ fill: DS.primary, r: 3 }} />
        </ReLineChart>
      </ResponsiveContainer>
    );
  }

  // ── Offer Acceptance Rate ────────────────────────────────────────────────────
  if (id === 'WGT_OFFER_ACCEPTANCE') {
    const oaData = [
      { month: 'Jan', made: 8, accepted: 6 }, { month: 'Feb', made: 12, accepted: 9 },
      { month: 'Mar', made: 10, accepted: 8 }, { month: 'Apr', made: 14, accepted: 11 },
      { month: 'May', made: 9, accepted: 7 }, { month: 'Jun', made: 11, accepted: 9 },
    ];
    return (
      <ResponsiveContainer width="100%" height={140}>
        <ReBarChart data={oaData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="month" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="made" name="Offers Made" fill={DS.bgHigh} radius={[4, 4, 0, 0]} />
          <Bar dataKey="accepted" name="Accepted" fill={DS.success} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }



  // ── Engagement Score ─────────────────────────────────────────────────────────
  if (id === 'WGT_ENGAGEMENT_SCORE') {
    const trendData = [
      { month: 'Jan', score: 72 }, { month: 'Feb', score: 75 }, { month: 'Mar', score: 74 },
      { month: 'Apr', score: 78 }, { month: 'May', score: 81 }, { month: 'Jun', score: 79 },
    ];
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={140}>
          <ReLineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 10, fill: DS.text3 }} domain={[60, 100]} />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Line type="monotone" dataKey="score" stroke={DS.success} strokeWidth={3} dot={{ fill: DS.success, r: 4 }} />
          </ReLineChart>
        </ResponsiveContainer>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <div className="text-4xl font-black" style={{ color: DS.success, fontFamily: 'Manrope, sans-serif' }}>79.2</div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: DS.successBg, color: DS.success }}>
          <TrendingUp className="w-3 h-3" />
          <span className="text-[10px] font-bold">+2.4% vs prev qtr</span>
        </div>
        <p className="text-[10px] text-center" style={{ color: DS.text3 }}>Overall employee engagement index based on pulse surveys</p>
      </div>
    );
  }

  // ── Sentiment by Department ──────────────────────────────────────────────────
  if (id === 'WGT_SENTIMENT_HEATMAP') {
    const sentData = [
      { dept: 'Science', positive: 82, neutral: 12, negative: 6 },
      { dept: 'Maths', positive: 65, neutral: 25, negative: 10 },
      { dept: 'Admin', positive: 45, neutral: 35, negative: 20 },
      { dept: 'Primary', positive: 78, neutral: 15, negative: 7 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={sentData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="dept" tick={{ fontSize: 10, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="positive" name="Positive %" fill={DS.success} stackId="a" />
          <Bar dataKey="neutral" name="Neutral %" fill={DS.amber} stackId="a" />
          <Bar dataKey="negative" name="Negative %" fill={DS.error} stackId="a" radius={[3, 3, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Goal Completion Rate ────────────────────────────────────────────────────
  if (id === 'WGT_GOALS_COMPLETION') {
    const goalData = [
      { name: 'Completed', value: 64, color: DS.purple },
      { name: 'On Track', value: 24, color: DS.success },
      { name: 'Behind', value: 12, color: DS.error },
    ];
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={150}>
          <ReBarChart data={goalData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: DS.text3 }} />
            <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="%" />
            <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
            <Bar dataKey="value" name="Goals %" radius={[4, 4, 0, 0]}>
              {goalData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      );
    }
    return (
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={100} height={100}>
          <RePieChart>
            <Pie data={goalData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" strokeWidth={0}>
              {goalData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 flex-1">
          {goalData.map(e => (
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

  // ── Pending Goal Approvals ──────────────────────────────────────────────────
  if (id === 'WGT_GOALS_PENDING') {
    const pendingGoals = [
      { name: 'Dr. Sameer K', dept: 'Research', type: 'Annual OKR', days: 4 },
      { name: 'Anita Desai', dept: 'English', type: 'KPI Setting', days: 2 },
      { name: 'Robert Fox', dept: 'Admin', type: 'Mid-Year Goal', days: 7 },
    ];
    return (
      <div className="space-y-2">
        {pendingGoals.map((g, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: g.days > 5 ? DS.errorBg : DS.bgLow }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{g.name} · <span style={{ color: DS.text3 }}>{g.dept}</span></p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>{g.type}</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'white', color: g.days > 5 ? DS.error : DS.text3 }}>{g.days}d ago</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Performance Tracking Status ──────────────────────────────────────────────
  if (id === 'WGT_PERF_TRACKING') {
    const perfData = [
      { dept: 'Primary', achieved: 85, target: 100 },
      { dept: 'Secondary', achieved: 78, target: 100 },
      { dept: 'Admin', achieved: 92, target: 100 },
      { dept: 'Sports', achieved: 64, target: 100 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={perfData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="%" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="achieved" name="Achieved %" fill={DS.primary} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Mid-Year Review Progress ────────────────────────────────────────────────
  if (id === 'WGT_MID_YEAR_REVIEW') {
    const reviewData = [
      { name: 'Completed', value: 142, color: DS.success },
      { name: 'In Review', value: 48, color: DS.warning },
      { name: 'Pending', value: 24, color: DS.error },
    ];
    return (
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={100} height={100}>
          <RePieChart>
            <Pie data={reviewData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" strokeWidth={0}>
              {reviewData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 flex-1">
          {reviewData.map(e => (
            <div key={e.name} className="flex items-center justify-between text-xs">
              <span style={{ color: DS.text2 }}>{e.name}</span>
              <span className="font-bold" style={{ color: e.color }}>{e.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── KRA/KPI Approval Pipeline ───────────────────────────────────────────────
  if (id === 'WGT_KRA_APPROVAL') {
    const kraData = [
      { name: 'Rahul Sen', hod: 'Dr. Roy', status: 'HOD Approved', date: '22 Mar' },
      { name: 'Megha V', hod: 'Ms. Alice', status: 'Pending HOD', date: '24 Mar' },
      { name: 'Kevin P', hod: 'Mr. John', status: 'Draft', date: '25 Mar' },
    ];
    return (
      <div className="space-y-2">
        {kraData.map((k, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: DS.bgLow }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ background: DS.primary, color: 'white' }}>{k.name.charAt(0)}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{k.name}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>HOD: {k.hod} · {k.date}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: k.status.includes('Pending') ? DS.warningBg : DS.successBg, color: k.status.includes('Pending') ? DS.warning : DS.success }}>{k.status}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── 360 Feedback Status ─────────────────────────────────────────────────────
  if (id === 'WGT_FEEDBACK360_STATUS') {
    const fbStatus = [
      { stage: 'Invited', count: 450, color: DS.primary },
      { stage: 'Responded', count: 320, color: DS.success },
      { stage: 'Pending', count: 130, color: DS.amber },
    ];
    return (
      <div className="space-y-3">
        {fbStatus.map(s => (
          <div key={s.stage}>
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{ color: DS.text2 }}>{s.stage}</span>
              <span className="font-bold" style={{ color: DS.text }}>{s.count} ({Math.round(s.count / 450 * 100)}%)</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${(s.count / 450) * 100}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Top 360 Competency Scores ───────────────────────────────────────────────
  if (id === 'WGT_FEEDBACK360_SCORES') {
    const scores = [
      { concept: 'Leadership', score: 4.2 },
      { concept: 'Communication', score: 3.8 },
      { concept: 'Teamwork', score: 4.5 },
      { concept: 'Innovation', score: 3.2 },
      { concept: 'Strategy', score: 3.9 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={scores} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
          <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis dataKey="concept" type="category" tick={{ fontSize: 9, fill: DS.text3 }} width={70} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="score" fill={DS.primary} radius={[0, 4, 4, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Calibration Session Status ──────────────────────────────────────────────
  if (id === 'WGT_CALIBRATION_STATUS') {
    const calibData = [
      { session: 'Sr. Faculty Q1', status: 'Completed', participants: 24, bell: 'Normal' },
      { session: 'Admn Staff H1', status: 'In Progress', participants: 42, bell: 'Skewed' },
      { session: 'HOD Annual', status: 'Scheduled', participants: 12, bell: '–' },
    ];
    return (
      <div className="space-y-2">
        {calibData.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: DS.bgLow }}>
            <Sliders className="w-4 h-4" style={{ color: DS.primary }} />
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{c.session}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>{c.participants} staff · Curve: {c.bell}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.status === 'Completed' ? DS.successBg : DS.warningBg, color: c.status === 'Completed' ? DS.success : DS.warning }}>{c.status}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Alumni Network Summary ───────────────────────────────────────────────
  if (id === 'WGT_ALUMNI_STATS') {
    const alData = [
      { label: 'Total Alumni', value: '1,240', delta: '+12%', dt: 'up' },
      { label: 'Active Users', value: '842', delta: '68%', dt: 'neutral' },
    ];
    return (
      <div className="grid grid-cols-2 gap-3">
        {alData.map(item => (
          <div key={item.label} className="rounded-2xl p-4" style={{ background: DS.bgLow }}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: DS.text3 }}>{item.label}</p>
            <p className="text-xl font-black" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{item.value}</p>
            <span className="text-[9px] font-bold" style={{ color: item.dt === 'up' ? DS.success : DS.text3 }}>{item.delta}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── LMS Enrolment Overview ───────────────────────────────────────────────
  if (id === 'WGT_LMS_ENROLMENT') {
    const lmsData = { active: 342, completed: 2150, certifications: 184 };
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: DS.primaryGrad, color: 'white' }}>
          <div><p className="text-[10px] font-bold opacity-80">Active Enrolments</p><p className="text-2xl font-black">{lmsData.active}</p></div>
          <BookOpen className="w-8 h-8 opacity-20" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: DS.bgLow }}><p className="text-[10px] font-semibold" style={{ color: DS.text3 }}>Total Completions</p><p className="text-lg font-black" style={{ color: DS.text }}>{lmsData.completed}</p></div>
          <div className="p-3 rounded-xl" style={{ background: DS.bgLow }}><p className="text-[10px] font-semibold" style={{ color: DS.text3 }}>Certifications</p><p className="text-lg font-black" style={{ color: DS.text }}>{lmsData.certifications}</p></div>
        </div>
      </div>
    );
  }

  // ── Course Completion by Category ────────────────────────────────────────
  if (id === 'WGT_COURSE_COMPLETION') {
    const catData = [
      { name: 'Mandatory', value: 92, color: DS.error },
      { name: 'Elective', value: 64, color: DS.primary },
      { name: 'Leadership', value: 45, color: DS.purple },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={catData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="%" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="value" name="Completion %" radius={[4, 4, 0, 0]}>
            {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Skill Gap Analysis ──────────────────────────────────────────────────
  if (id === 'WGT_SKILL_GAP') {
    const gapData = [
      { skill: 'Digital Literacy', required: 90, actual: 72 },
      { skill: 'Pedagogy', required: 95, actual: 88 },
      { skill: 'Soft Skills', required: 80, actual: 75 },
      { skill: 'Leadership', required: 85, actual: 64 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={gapData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="skill" tick={{ fontSize: 8, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="%" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="required" name="Required" fill={DS.bgLow} />
          <Bar dataKey="actual" name="Actual" fill={DS.primary} radius={[3, 3, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Survey Response Rate ────────────────────────────────────────────────
  if (id === 'WGT_SURVEY_RESPONSE') {
    const surveyData = [
      { name: 'Pulse Survey Q2', rate: 78, color: DS.success },
      { name: 'Curriculum Feedback', rate: 92, color: DS.primary },
      { name: 'Workplace Safety', rate: 45, color: DS.error },
    ];
    return (
      <div className="space-y-3">
        {surveyData.map(s => (
          <div key={s.name}>
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{ color: DS.text2 }}>{s.name}</span>
              <span className="font-bold" style={{ color: s.rate < 50 ? DS.error : DS.text }}>{s.rate}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${s.rate}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── HR Tasks Summary ────────────────────────────────────────────────────
  if (id === 'WGT_TASKS_SUMMARY') {
    const tasks = [
      { title: 'Update Salary Slips', priority: 'High', status: 'Pending' },
      { title: 'Interview Dr. Rao', priority: 'Medium', status: 'Done' },
      { title: 'Policy Revise', priority: 'Low', status: 'In Progress' },
    ];
    return (
       <div className="space-y-2">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: DS.bgLow }}>
            <CheckSquare className="w-4 h-4" style={{ color: t.status === 'Done' ? DS.success : DS.text3 }} />
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{t.title}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>{t.priority} Priority</p>
            </div>
            <span className="text-[10px] font-bold" style={{ color: t.status === 'Done' ? DS.success : DS.warning }}>{t.status}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Month-End Deadline Checklist ─────────────────────────────────────────
  if (id === 'WGT_DEADLINE_CHECKLIST') {
    const checks = [
      { task: 'Attendance Finalise', due: '25th Mar', done: true },
      { task: 'LOP Sync with Payroll', due: '26th Mar', done: true },
      { task: 'Deductions Review', due: '28th Mar', done: false },
      { task: 'Salary Disburse', due: '30th Mar', done: false },
    ];
    return (
      <div className="space-y-2">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: c.done ? DS.successBg : DS.bgLow }}>
            {c.done ? <CheckCircle2 className="w-4 h-4" style={{ color: DS.success }} /> : <Clock className="w-4 h-4" style={{ color: DS.warning }} />}
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: DS.text }}>{c.task}</p>
              <p className="text-[10px]" style={{ color: DS.text3 }}>Due: {c.due}</p>
            </div>
            {c.done && <span className="text-[10px] font-bold" style={{ color: DS.success }}>Done</span>}
          </div>
        ))}
      </div>
    );
  }

  // ── Policy Acknowledgement Tracker ──────────────────────────────────────
  if (id === 'WGT_POLICY_ACK') {
    const polData = [
      { name: 'Sexual Harassment (POSH)', rate: 98, color: DS.success },
      { name: 'Code of Conduct 2024', rate: 84, color: DS.primary },
      { name: 'Leave Policy Update', rate: 62, color: DS.warning },
    ];
    return (
      <div className="space-y-3">
        {polData.map(p => (
          <div key={p.name}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="truncate flex-1 pr-2" style={{ color: DS.text2 }}>{p.name}</span>
              <span className="font-bold" style={{ color: DS.text }}>{p.rate}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${p.rate}%`, background: p.color }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Staff Portfolio Updates ──────────────────────────────────────────────
  if (id === 'WGT_PORTFOLIO_UPDATES') {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: DS.bgLow }}>
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5" style={{ color: DS.primary }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: DS.text }}>Profile Completion</p>
              <p className="text-lg font-black" style={{ color: DS.text }}>86%</p>
            </div>
          </div>
          <button className="text-[10px] font-black px-2 py-1 rounded-lg" style={{ background: DS.primary, color: 'white' }}>Nudge All</button>
        </div>
        <div className="text-[10px] font-semibold" style={{ color: DS.text3 }}>Stale Profiles (Last 90 days): <span style={{ color: DS.error }}>42 staff</span></div>
      </div>
    );
  }

  // ── Certificates Issued ──────────────────────────────────────────────────
  if (id === 'WGT_CERTIFICATES') {
    const certData = [
      { type: 'Relieving', count: 12 },
      { type: 'Experience', count: 24 },
      { type: 'Salary Cert.', count: 18 },
    ];
    return (
      <div className="flex items-center gap-4">
        {certData.map(c => (
          <div key={c.type} className="flex-1 text-center p-2 rounded-xl" style={{ background: DS.bgLow }}>
            <p className="text-lg font-black" style={{ color: DS.primary }}>{c.count}</p>
            <p className="text-[9px] font-medium" style={{ color: DS.text3 }}>{c.type}</p>
          </div>
        ))}
      </div>
    );
  }

  // ── Exit Reasons Analysis ────────────────────────────────────────────────
  if (id === 'WGT_EXIT_REASONS') {
    const exitData = [
      { name: 'Better Comp', value: 35, color: DS.primary },
      { name: 'Location', value: 25, color: DS.teal },
      { name: 'Higher Studies', value: 20, color: DS.purple },
      { name: 'Personal', value: 15, color: DS.amber },
      { name: 'Other', value: 5, color: DS.text3 },
    ];
    return (
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={90} height={90}>
          <RePieChart>
            <Pie data={exitData} cx="50%" cy="50%" innerRadius={22} outerRadius={40} dataKey="value" strokeWidth={0}>
              {exitData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="space-y-1 flex-1">
          {exitData.slice(0, 4).map(e => (
            <div key={e.name} className="flex items-center gap-1.5 overflow-hidden">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-[9px] flex-1 truncate" style={{ color: DS.text2 }}>{e.name}</span>
              <span className="text-[9px] font-bold" style={{ color: DS.text }}>{e.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Workforce Capacity Utilisation ──────────────────────────────────────────
  if (id === 'WGT_CAPACITY_UTILISATION') {
    const capData = [
      { dept: 'Sci', assigned: 1600, capacity: 1800 },
      { dept: 'Mat', assigned: 1450, capacity: 1400 },
      { dept: 'Eng', assigned: 1200, capacity: 1500 },
      { dept: 'Lan', assigned: 900, capacity: 1000 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={capData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="capacity" name="Capacity" fill={DS.bgLow} />
          <Bar dataKey="assigned" name="Assigned" fill={DS.primary} radius={[3, 3, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Research & Publications (Institutional) ─────────────────────────────────
  if (id === 'WGT_RESEARCH_SUMMARY') {
    const resData = [
      { dept: 'Science', papers: 8, conferences: 12 },
      { dept: 'Medicine', papers: 14, conferences: 6 },
      { dept: 'Commerce', papers: 3, conferences: 5 },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={resData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="papers" name="Papers" fill={DS.primary} stackId="a" />
          <Bar dataKey="conferences" name="Conferences" fill={DS.teal} stackId="a" radius={[3, 3, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Lesson Plan Submission Status (Institutional) ───────────────────────────
  if (id === 'WGT_LESSON_PLAN_STATUS') {
    const lpDataArr = [
      { dept: 'Primary', done: 85, total: 100 },
      { dept: 'Secondary', done: 92, total: 100 },
      { dept: 'Higher Sec', done: 64, total: 100 },
    ];
    return (
      <div className="space-y-3">
        {lpDataArr.map(d => (
          <div key={d.dept} className="flex items-center gap-3">
            <span className="text-xs font-medium w-24 flex-shrink-0" style={{ color: DS.text2 }}>{d.dept}</span>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${d.done}%`, background: d.done > 80 ? DS.success : d.done > 70 ? DS.amber : DS.error }} />
            </div>
            <span className="text-xs font-bold w-12 text-right" style={{ color: DS.text }}>{d.done}%</span>
          </div>
        ))}
      </div>
    );
  }

  // ── Org Headcount Breakdown Tree ────────────────────────────────────────────
  if (id === 'WGT_ORG_HEADCOUNT_TREE') {
    const treeData = [
      { name: 'Academic', value: 540, color: DS.primary },
      { name: 'Admin', value: 120, color: DS.teal },
      { name: 'Support', value: 84, color: DS.purple },
      { name: 'Others', value: 36, color: DS.amber },
    ];
    return (
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={treeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="value" name="Headcount" radius={[4, 4, 0, 0]}>
            {treeData.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── 360 Feedback Status ──────────────────────────────────────────────────
  if (id === 'WGT_FEEDBACK360_STATUS') {
    const feedbackData = [
      { name: 'Completed', value: 342, color: DS.success },
      { name: 'Pending', value: 158, color: DS.amber },
      { name: 'Not Started', value: 42, color: DS.text3 },
    ];
    return (
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={100} height={100}>
          <RePieChart>
            <Pie data={feedbackData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" strokeWidth={0}>
              {feedbackData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="space-y-1 flex-1">
          {feedbackData.map(e => (
            <div key={e.name} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-[10px] flex-1" style={{ color: DS.text2 }}>{e.name}</span>
              <span className="text-[10px] font-bold" style={{ color: DS.text }}>{e.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 360 Competency Scores ──────────────────────────────────────────────────
  if (id === 'WGT_FEEDBACK360_SCORES') {
    const scoreData = [
      { name: 'Leadership', score: 8.2 }, { name: 'Comms', score: 7.5 },
      { name: 'Technical', score: 9.0 }, { name: 'Culture', score: 8.8 },
    ];
    return (
      <div className="space-y-2.5">
        {scoreData.map(s => (
          <div key={s.name}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-medium" style={{ color: DS.text2 }}>{s.name}</span>
              <span className="text-[10px] font-bold" style={{ color: DS.text }}>{s.score}/10</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${s.score * 10}%`, background: DS.primary }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Calibration Status ──────────────────────────────────────────────────────
  if (id === 'WGT_CALIBRATION_STATUS') {
    const calData = [
      { bucket: 'Top', pre: 12, post: 10 },
      { bucket: 'Solid', pre: 65, post: 70 },
      { bucket: 'Dev', pre: 15, post: 12 },
      { bucket: 'Concern', pre: 8, post: 8 },
    ];
    return (
      <ResponsiveContainer width="100%" height={150}>
        <ReBarChart data={calData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="bucket" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} unit="%" />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="pre" name="Pre-Cal" fill={DS.bgLow} />
          <Bar dataKey="post" name="Post-Cal" fill={DS.primary} radius={[3, 3, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Alumni & boomerang Tracking ─────────────────────────────────────────────
  if (id === 'WGT_ALUMNI_STATS') {
    const alumniData = [
      { year: '2021', total: 124, boomers: 8 },
      { year: '2022', total: 156, boomers: 12 },
      { year: '2023', total: 142, boomers: 11 },
    ];
    return (
      <ResponsiveContainer width="100%" height={140}>
        <ReBarChart data={alumniData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="year" tick={{ fontSize: 10, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 10, fill: DS.text3 }} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="total" name="Alumni" fill={DS.bgHigh} stackId="a" />
          <Bar dataKey="boomers" name="Boomerangs" fill={DS.teal} stackId="a" radius={[3, 3, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── LMS Enrolment Trends ────────────────────────────────────────────────────
  if (id === 'WGT_LMS_ENROLMENT') {
    const lmsData = [
      { name: 'Pedagogy', count: 184 }, { name: 'Tech Skills', count: 142 },
      { name: 'Soft Skills', count: 96 }, { name: 'Compliance', count: 210 },
    ];
    return (
      <ResponsiveContainer width="100%" height={150}>
        <ReBarChart data={lmsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: DS.text3 }} width={80} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Bar dataKey="count" fill={DS.primary} radius={[0, 4, 4, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Course Completion Status ────────────────────────────────────────────────
  if (id === 'WGT_COURSE_COMPLETION') {
    const courseData = [
      { label: 'Completed', val: 74, color: DS.success },
      { label: 'In Progress', val: 18, color: DS.amber },
      { label: 'Overdue', val: 8, color: DS.error },
    ];
    return (
      <div className="space-y-3">
        {courseData.map(c => (
          <div key={c.label}>
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{ color: DS.text2 }}>{c.label}</span>
              <span className="font-bold" style={{ color: DS.text }}>{c.val}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
              <div className="h-full rounded-full" style={{ width: `${c.val}%`, background: c.color }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Critical Skill Gaps ─────────────────────────────────────────────────────
  if (id === 'WGT_SKILL_GAP') {
    const gapData = [
      { skill: 'AI Literacy', current: 3.2, target: 4.5 },
      { skill: 'Data Analysis', current: 3.8, target: 4.2 },
      { skill: 'LDR-ship', current: 2.9, target: 4.0 },
    ];
    return (
      <ResponsiveContainer width="100%" height={150}>
        <ReBarChart data={gapData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DS.border} />
          <XAxis dataKey="skill" tick={{ fontSize: 9, fill: DS.text3 }} />
          <YAxis tick={{ fontSize: 9, fill: DS.text3 }} domain={[0, 5]} />
          <Tooltip contentStyle={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 12, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="current" name="Current" fill={DS.error} />
          <Bar dataKey="target" name="Target" fill={DS.bgHigh} radius={[3, 3, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  // ── Pulse Survey Participation ──────────────────────────────────────────────
  if (id === 'WGT_SURVEY_RESPONSE') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke={DS.bgLow} strokeWidth="8" fill="transparent" />
            <circle cx="48" cy="48" r="40" stroke={DS.primary} strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.88)} strokeLinecap="round" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black" style={{ color: DS.text }}>88%</span>
            <span className="text-[8px] font-bold tracking-widest text-slate-400">PART.</span>
          </div>
        </div>
        <p className="text-[10px] text-center" style={{ color: DS.text3 }}>824 / 936 Responded<br/>(Engagement Pulse Q2)</p>
      </div>
    );
  }

  // ── Pending Action Tasks ────────────────────────────────────────────────────
  if (id === 'WGT_TASKS_SUMMARY') {
    const taskList = [
      { task: 'Approve Leave', count: 12, color: DS.amber },
      { task: 'KRA Reviews', count: 8, color: DS.primary },
      { task: 'Exit Clearance', count: 3, color: DS.error },
    ];
    return (
      <div className="space-y-2">
        {taskList.map(t => (
          <div key={t.task} className="flex items-center justify-between p-2.5 rounded-xl transition-transform hover:scale-[1.02]" style={{ background: DS.bgLow }}>
            <span className="text-xs font-semibold" style={{ color: DS.text }}>{t.task}</span>
            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black" style={{ background: t.color, color: 'white' }}>{t.count}</span>
          </div>
        ))}
      </div>
    );
  }

  return <div className="flex items-center justify-center h-16 text-xs" style={{ color: DS.text3 }}>Widget data loading…</div>;
}



// ─── Campus Drill-Down Panel (Chairman GOI → Individual Campus) ───────────────
function CampusDrillPanel({ campus, onClose }: { campus: string; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'payroll' | 'talent' | 'learning'>('overview');
  const data = CAMPUS_DRILL_DATA[campus];
  const goiRow = GOI_CAMPUS_DATA.find(r => r.name === campus);
  if (!data || !goiRow) return null;

  const stepIcon = (s: string) => {
    if (s === 'done') return { icon: '✓', bg: DS.successBg, color: DS.success };
    if (s === 'in_progress') return { icon: '…', bg: DS.warningBg, color: DS.warning };
    if (s === 'blocked') return { icon: '✗', bg: DS.errorBg, color: DS.error };
    return { icon: '–', bg: DS.bgLow, color: DS.text3 };
  };
  const attendancePct = Math.round((data.attendance.present / goiRow.staff) * 100);
  const alertTypeColor = (t: string) => t === 'error' ? { bg: DS.errorBg, color: DS.error } : t === 'warning' ? { bg: DS.warningBg, color: DS.warning } : { bg: DS.blueBg, color: DS.blue };
  const statColor = (s: string) => s === 'filed' ? { bg: DS.successBg, color: DS.success } : s === 'pending' ? { bg: DS.warningBg, color: DS.warning } : { bg: DS.errorBg, color: DS.error };
  const budgetColor = data.salary.budgetVariance > 0 ? DS.success : data.salary.budgetVariance < 0 ? DS.error : DS.text3;
  const trendArrow = (t: string) => t === 'up' ? '↑' : t === 'down' ? '↓' : '→';
  const trendColor = (t: string) => t === 'up' ? DS.success : t === 'down' ? DS.error : DS.text3;

  const TABS = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'payroll' as const, label: 'Payroll & Finance' },
    { id: 'talent' as const, label: 'Talent & HR' },
    { id: 'learning' as const, label: 'Learning & Engagement' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(11,28,48,0.32)', backdropFilter: 'blur(6px)' }}>
      {/* Click-away */}
      <div className="flex-1" onClick={onClose} />
      {/* Panel */}
      <div
        className="w-[560px] h-full overflow-y-auto flex flex-col animate-in slide-in-from-right-8 duration-300"
        style={{ background: DS.bg, borderLeft: `1px solid ${DS.border}`, boxShadow: '-8px 0 40px rgba(11,28,48,0.12)' }}
      >
        {/* Sticky Header + Tabs */}
        <div className="sticky top-0 z-10 flex flex-col" style={{ background: DS.bgCard, borderBottom: `1px solid ${DS.border}` }}>
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: DS.bgLow, color: DS.text3 }}>Campus Drill-Down</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: goiRow.type === 'K-12' ? DS.amberBg : DS.blueBg, color: goiRow.type === 'K-12' ? DS.amber : DS.blue }}>{goiRow.type}</span>
              </div>
              <h2 className="text-xl font-black" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{campus}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-xl font-black" style={{ color: goiRow.health >= 80 ? DS.success : goiRow.health >= 60 ? DS.amber : DS.error, fontFamily: 'Manrope, sans-serif' }}>{goiRow.health}%</div>
                <div className="text-[9px] font-semibold" style={{ color: DS.text3 }}>Health Score</div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-red-50" style={{ background: DS.bgLow }}>
                <X className="w-4 h-4" style={{ color: DS.text3 }} />
              </button>
            </div>
          </div>
          {/* Tab Switcher */}
          <div className="px-6 pb-3 flex items-center gap-2 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: activeTab === tab.id ? DS.primary : DS.bgLow,
                  color: activeTab === tab.id ? '#ffffff' : DS.text3,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 space-y-5">
          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <>
              {/* KPI Row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Staff', value: goiRow.staff, icon: Users, color: DS.primary, bg: DS.bgLow },
                  { label: 'Present', value: `${data.attendance.present} (${attendancePct}%)`, icon: UserCheck, color: DS.success, bg: DS.successBg },
                  { label: 'On Leave', value: data.attendance.onLeave, icon: Calendar, color: DS.warning, bg: DS.warningBg },
                  { label: 'UAL / LOP', value: `${data.attendance.ual} / ${data.attendance.lop}`, icon: AlertTriangle, color: DS.error, bg: DS.errorBg },
                ].map(kp => (
                  <div key={kp.label} className="rounded-2xl p-3 text-center" style={{ background: kp.bg }}>
                    <div className="w-7 h-7 rounded-xl mx-auto mb-1.5 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.6)' }}>
                      <kp.icon className="w-3.5 h-3.5" style={{ color: kp.color }} />
                    </div>
                    <div className="text-sm font-black leading-tight" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{kp.value}</div>
                    <div className="text-[9px] font-medium mt-0.5" style={{ color: DS.text3 }}>{kp.label}</div>
                  </div>
                ))}
              </div>

              {/* Alerts */}
              {data.alerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: DS.text3 }}>Campus Alerts</h4>
                  {data.alerts.map((a, i) => {
                    const ac = alertTypeColor(a.type);
                    return (
                      <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: ac.bg }}>
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: ac.color }} />
                        <span className="text-xs font-semibold" style={{ color: DS.text }}>{a.msg}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Attendance + Leave Breakdown side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Staff by Department</h4>
                  <div className="space-y-2">
                    {data.staffByDept.map(d => (
                      <div key={d.dept} className="flex items-center gap-2">
                        <span className="text-[10px] font-medium w-16 flex-shrink-0 truncate" style={{ color: DS.text2 }}>{d.dept}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
                          <div className="h-full rounded-full" style={{ width: `${(d.present / d.count) * 100}%`, background: DS.primary }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: DS.text }}>{d.present}/{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Leave Breakdown</h4>
                  <div className="flex items-center gap-3">
                    <ResponsiveContainer width={70} height={70}>
                      <RePieChart>
                        <Pie data={data.leaveBreakdown} cx="50%" cy="50%" innerRadius={18} outerRadius={32} dataKey="count" strokeWidth={0}>
                          {data.leaveBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 flex-1">
                      {data.leaveBreakdown.map(l => (
                        <div key={l.type} className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                          <span className="text-[10px] flex-1" style={{ color: DS.text2 }}>{l.type}</span>
                          <span className="text-[10px] font-bold" style={{ color: DS.text }}>{l.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payroll Steps */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Payroll Readiness</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {data.payrollSteps.map((step, i) => {
                    const s = stepIcon(step.status);
                    return (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: s.bg, color: s.color }}>{s.icon}</span>
                          <span className="text-[9px] font-medium text-center leading-tight max-w-[60px]" style={{ color: DS.text3 }}>{step.label}</span>
                        </div>
                        {i < data.payrollSteps.length - 1 && <div className="w-6 h-px mt-[-12px]" style={{ background: DS.border }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Top Absentees */}
              {data.topAbsentees.length > 0 && (
                <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Top Absentees MTD</h4>
                  <div className="space-y-2">
                    {data.topAbsentees.map((a, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: DS.errorBg }}>
                        <div>
                          <span className="text-xs font-semibold" style={{ color: DS.text }}>{a.name}</span>
                          <span className="text-[10px] ml-2" style={{ color: DS.text3 }}>{a.dept}</span>
                        </div>
                        <span className="text-xs font-black" style={{ color: DS.error }}>{a.days}d absent</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Payroll & Finance Tab ── */}
          {activeTab === 'payroll' && (
            <>
              {/* Salary Card */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Salary Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Gross Payroll', value: `₹${(data.salary.gross / 100000).toFixed(1)}L`, color: DS.primary },
                    { label: 'Net Payroll', value: `₹${(data.salary.net / 100000).toFixed(1)}L`, color: DS.success },
                    { label: 'LOP Deduction', value: `₹${(data.salary.lopDeduction / 1000).toFixed(0)}K`, color: DS.error },
                    { label: 'Cost per Emp', value: `₹${data.salary.costPerEmp.toLocaleString()}`, color: DS.text2 },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl p-3" style={{ background: DS.bgLow }}>
                      <p className="text-[10px] font-semibold mb-1" style={{ color: DS.text3 }}>{item.label}</p>
                      <p className="text-base font-black" style={{ color: item.color, fontFamily: 'Manrope, sans-serif' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 px-3 py-2 rounded-xl flex items-center justify-between" style={{ background: data.salary.budgetVariance > 0 ? DS.successBg : data.salary.budgetVariance < 0 ? DS.errorBg : DS.bgLow }}>
                  <span className="text-xs font-semibold" style={{ color: DS.text }}>Budget Variance</span>
                  <span className="text-sm font-black" style={{ color: budgetColor }}>
                    {data.salary.budgetVariance > 0 ? '+' : ''}{data.salary.budgetVariance}%
                  </span>
                </div>
              </div>

              {/* Statutory Compliance Grid */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Statutory Compliance</h4>
                <div className="grid grid-cols-4 gap-2">
                  {([['PF', data.statutory.pf], ['ESI', data.statutory.esi], ['TDS', data.statutory.tds], ['PT', data.statutory.pt]] as [string, string][]).map(([label, status]) => {
                    const sc = statColor(status);
                    return (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ background: sc.bg }}>
                        <p className="text-xs font-black mb-1" style={{ color: DS.text }}>{label}</p>
                        <span className="text-[10px] font-bold capitalize" style={{ color: sc.color }}>{status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payroll Steps */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Payroll Readiness Steps</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {data.payrollSteps.map((step, i) => {
                    const s = stepIcon(step.status);
                    return (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: s.bg, color: s.color }}>{s.icon}</span>
                          <span className="text-[9px] font-medium text-center leading-tight max-w-[60px]" style={{ color: DS.text3 }}>{step.label}</span>
                        </div>
                        {i < data.payrollSteps.length - 1 && <div className="w-6 h-px mt-[-12px]" style={{ background: DS.border }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Talent & HR Tab ── */}
          {activeTab === 'talent' && (
            <>
              {/* 4-tile grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Open Positions', value: data.talentAcq.openPositions, color: data.talentAcq.openPositions > 8 ? DS.error : DS.primary, bg: data.talentAcq.openPositions > 8 ? DS.errorBg : DS.bgLow },
                  { label: 'Time-to-Hire (days)', value: data.talentAcq.timeToHire, color: data.talentAcq.timeToHire > 30 ? DS.error : DS.success, bg: data.talentAcq.timeToHire > 30 ? DS.errorBg : DS.successBg },
                  { label: 'Attrition YTD', value: `${data.exitData.attritionYTD}%`, color: data.exitData.attritionYTD > 7 ? DS.error : DS.success, bg: data.exitData.attritionYTD > 7 ? DS.errorBg : DS.successBg },
                  { label: 'F&F Pending', value: data.exitData.ffPending, color: data.exitData.ffPending > 0 ? DS.warning : DS.success, bg: data.exitData.ffPending > 0 ? DS.warningBg : DS.successBg },
                ].map(tile => (
                  <div key={tile.label} className="rounded-2xl p-4" style={{ background: tile.bg }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: DS.text3 }}>{tile.label}</p>
                    <p className="text-2xl font-black" style={{ color: tile.color, fontFamily: 'Manrope, sans-serif' }}>{tile.value}</p>
                  </div>
                ))}
              </div>

              {/* Appraisal Progress */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: DS.text3 }}>Appraisal — {data.appraisal.cycle}</h4>
                  <span className="text-[10px] font-semibold" style={{ color: DS.text3 }}>Total: {data.appraisal.total}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span style={{ color: DS.text2 }}>Submitted</span>
                      <span className="font-bold" style={{ color: DS.text }}>{data.appraisal.submitted}</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
                      <div className="h-full rounded-full" style={{ width: `${(data.appraisal.submitted / data.appraisal.total) * 100}%`, background: DS.primary }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span style={{ color: DS.text2 }}>Completed</span>
                      <span className="font-bold" style={{ color: DS.text }}>{data.appraisal.completed}</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
                      <div className="h-full rounded-full" style={{ width: `${(data.appraisal.completed / data.appraisal.total) * 100}%`, background: DS.success }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Onboarding + Exit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Onboarding</h4>
                  {[
                    { label: 'Active', value: data.onboarding.active, color: DS.primary },
                    { label: 'SLA Breached', value: data.onboarding.slaBreached, color: data.onboarding.slaBreached > 0 ? DS.error : DS.success },
                    { label: 'Completed', value: data.onboarding.completed, color: DS.success },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-1">
                      <span className="text-[10px] font-medium" style={{ color: DS.text2 }}>{row.label}</span>
                      <span className="text-xs font-black" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Exit Pipeline</h4>
                  {[
                    { label: 'Active Exits', value: data.exitData.active, color: DS.error },
                    { label: 'F&F Settled', value: data.exitData.ffSettled, color: DS.success },
                    { label: 'F&F Pending', value: data.exitData.ffPending, color: data.exitData.ffPending > 0 ? DS.warning : DS.success },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-1">
                      <span className="text-[10px] font-medium" style={{ color: DS.text2 }}>{row.label}</span>
                      <span className="text-xs font-black" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Talent Acquisition extras */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Talent Acquisition</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'Offers Out', value: data.talentAcq.offersOut },
                    { label: 'Joined MTD', value: data.talentAcq.joinedMTD },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl px-3 py-2" style={{ background: DS.bgLow }}>
                      <p className="text-[10px] font-semibold mb-0.5" style={{ color: DS.text3 }}>{item.label}</p>
                      <p className="text-lg font-black" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Learning & Engagement Tab ── */}
          {activeTab === 'learning' && (
            <>
              {/* L&D Completion */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: DS.text3 }}>L&D Completion</h4>
                  <span className="text-xs font-black" style={{ color: DS.teal }}>{data.lnd.completionPct}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: DS.bgLow }}>
                  <div className="h-full rounded-full" style={{ width: `${data.lnd.completionPct}%`, background: DS.teal }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Enrolled', value: data.lnd.enrolled, color: DS.primary },
                    { label: 'Completed', value: data.lnd.completed, color: DS.success },
                    { label: 'Certs Issued', value: data.lnd.certIssued, color: DS.purple },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl p-2" style={{ background: DS.bgLow }}>
                      <p className="text-base font-black" style={{ color: item.color, fontFamily: 'Manrope, sans-serif' }}>{item.value}</p>
                      <p className="text-[9px] font-semibold" style={{ color: DS.text3 }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lesson Plans */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: DS.text3 }}>Lesson Plans</h4>
                  <span className="text-xs font-bold" style={{ color: DS.text }}>{data.lessonPlans.submitted}/{data.lessonPlans.total}</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: DS.bgLow }}>
                  <div className="h-full rounded-full" style={{
                    width: `${(data.lessonPlans.submitted / data.lessonPlans.total) * 100}%`,
                    background: (data.lessonPlans.submitted / data.lessonPlans.total) >= 0.9 ? DS.success : (data.lessonPlans.submitted / data.lessonPlans.total) >= 0.75 ? DS.amber : DS.error,
                  }} />
                </div>
                <p className="text-[10px] font-semibold mt-1" style={{ color: DS.text3 }}>{Math.round((data.lessonPlans.submitted / data.lessonPlans.total) * 100)}% submitted</p>
              </div>

              {/* Research Output */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Research Output (YTD)</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Papers', value: data.research.papers, color: DS.primary },
                    { label: 'Conferences', value: data.research.conferences, color: DS.teal },
                    { label: 'Patents', value: data.research.patents, color: DS.purple },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl p-3" style={{ background: DS.bgLow }}>
                      <p className="text-xl font-black" style={{ color: item.color, fontFamily: 'Manrope, sans-serif' }}>{item.value}</p>
                      <p className="text-[9px] font-semibold mt-0.5" style={{ color: DS.text3 }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Score */}
              <div className="rounded-2xl p-4" style={{ background: DS.bgCard, border: `1px solid ${DS.border}` }}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: DS.text3 }}>Engagement & Goals</h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: data.engagement.score >= 75 ? DS.success : data.engagement.score >= 60 ? DS.amber : DS.error, fontFamily: 'Manrope, sans-serif' }}>
                      {data.engagement.score}
                    </div>
                    <div className="text-[9px] font-semibold" style={{ color: DS.text3 }}>Engagement Score</div>
                  </div>
                  <div>
                    <div className="text-xl font-black" style={{ color: trendColor(data.engagement.trend) }}>{trendArrow(data.engagement.trend)}</div>
                    <div className="text-[9px] font-semibold capitalize" style={{ color: DS.text3 }}>{data.engagement.trend}</div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-sm font-black" style={{ color: DS.text }}>{data.engagement.surveyResponse}%</div>
                    <div className="text-[9px] font-semibold" style={{ color: DS.text3 }}>Survey Response</div>
                  </div>
                </div>
                {/* Goals Summary */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Set', value: data.goals.set, color: DS.text },
                    { label: 'On Track', value: data.goals.onTrack, color: DS.success },
                    { label: 'At Risk', value: data.goals.atRisk, color: data.goals.atRisk > 50 ? DS.error : DS.warning },
                    { label: 'Completed', value: data.goals.completed, color: DS.purple },
                  ].map(g => (
                    <div key={g.label} className="rounded-xl p-2" style={{ background: DS.bgLow }}>
                      <p className="text-sm font-black" style={{ color: g.color, fontFamily: 'Manrope, sans-serif' }}>{g.value}</p>
                      <p className="text-[9px] font-semibold" style={{ color: DS.text3 }}>{g.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sortable Widget (Grid mode) ──────────────────────────────────────────────
function SortableWidget({ item, activeChartType, onRemove, onChartTypeChange, isLocked, role, onCampusSelect }: {
  item: LayoutItem;
  activeChartType: ChartTypeOption;
  onRemove: (id: string) => void;
  onChartTypeChange: (id: string, ct: ChartTypeOption) => void;
  isLocked?: boolean;
  role?: DashboardRole;
  onCampusSelect?: (campus: string) => void;
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
          {!isLocked ? (
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded">
              <GripVertical className="w-3.5 h-3.5" style={{ color: DS.text3 }} />
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: DS.bgLow }}>
            <Icon className="w-3 h-3" style={{ color: CAT_COLORS[meta.category] }} />
          </div>
          <span className="text-xs font-semibold flex-1 truncate" style={{ color: DS.text, fontFamily: 'Manrope, sans-serif' }}>{meta.name}</span>
          {/* Chart type selector — always visible when widget has multiple types */}
          {meta.availableChartTypes.length > 1 && (
            <select
              value={activeChartType}
              onChange={e => onChartTypeChange(item.widgetId, e.target.value as ChartTypeOption)}
              className="text-[10px] font-semibold outline-none cursor-pointer px-1.5 py-0.5 rounded-md transition-colors"
              style={{ color: DS.primary, background: DS.bgLow, border: `1px solid ${DS.border}` }}
              onPointerDown={e => e.stopPropagation()}
            >
              {meta.availableChartTypes.map(ct => (
                <option key={ct} value={ct}>{ct.replace(/_/g, ' ')}</option>
              ))}
            </select>
          )}
          {!isLocked && (
            <button onClick={() => onRemove(item.widgetId)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 transition-colors ml-1" onPointerDown={e => e.stopPropagation()}>
              <X className="w-3 h-3" style={{ color: DS.text3 }} />
            </button>
          )}
        </div>
        <div className="flex-1 p-3 min-h-[120px]">{renderWidget(item.widgetId, activeChartType, role, { onCampusSelect })}</div>
      </div>
    </div>
  );
}

// ─── Add Widget Drawer ────────────────────────────────────────────────────────
function AddWidgetDrawer({ open, onClose, role, activeIds, onAdd }: {
  open: boolean; onClose: () => void; role: DashboardRole; activeIds: string[];
  onAdd: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('All Modules');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allModules = Array.from(new Set(WIDGET_CATALOGUE.map(w => w.sourceModule)));

  React.useEffect(() => {
    if (!open) setSelected(new Set());
  }, [open]);

  const toggleSelection = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const available = WIDGET_CATALOGUE.filter(w =>
    (w.roles.includes(role)) &&
    !activeIds.includes(w.id) &&
    (moduleFilter === 'All Modules' || w.sourceModule === moduleFilter) &&
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
          <div className="flex flex-col gap-2">
            <select 
              value={moduleFilter} 
              onChange={e => setModuleFilter(e.target.value)}
              className="text-xs font-semibold px-2 py-1.5 rounded-lg outline-none bg-transparent"
              style={{ color: DS.text, border: `1px solid ${DS.border}` }}
            >
              <option value="All Modules">All Modules</option>
              {allModules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
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
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {(Object.keys(grouped) as WidgetCategory[]).map(cat => (
            <div key={cat}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: CAT_COLORS[cat] }}>{cat.replace('_', ' ')}</p>
              <div className="space-y-2">
                {grouped[cat].map(w => (
                  <button key={w.id} onClick={() => toggleSelection(w.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:-translate-y-0.5"
                    style={{ background: DS.bgLow, border: `1px solid ${selected.has(w.id) ? DS.primary : 'transparent'}` }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${CAT_COLORS[cat]}15` }}>
                      <w.icon className="w-4 h-4" style={{ color: CAT_COLORS[cat] }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: DS.text }}>{w.name}</p>
                      <p className="text-[10px] leading-snug mt-0.5" style={{ color: DS.text3 }}>{w.description}</p>
                    </div>
                    {selected.has(w.id) && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" style={{ color: DS.primary }} />}
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
        <div className="p-4 flex gap-3" style={{ borderTop: `1px solid ${DS.border}`, background: DS.bgCard }}>
          <button 
            onClick={() => { onAdd(available.map(w => w.id)); onClose(); }}
            disabled={available.length === 0}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-50" style={{ background: DS.bgLow, color: DS.text }}>
            Add All ({available.length})
          </button>
          <button 
            onClick={() => { if(selected.size > 0) { onAdd(Array.from(selected)); onClose(); } }}
            disabled={selected.size === 0}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity disabled:opacity-50" 
            style={{ background: DS.primaryGrad }}>
            Add Selected ({selected.size})
          </button>
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [period, setPeriod] = useState<Period>('today');
  const [isLocked, setIsLocked] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  // ── Global chart type preferences (persists across period/tab switches) ──────
  const [widgetChartTypes, setWidgetChartTypes] = useState<Record<string, ChartTypeOption>>(() => {
    // Seed defaults from catalogue
    const defaults: Record<string, ChartTypeOption> = {};
    WIDGET_CATALOGUE.forEach(w => { defaults[w.id] = w.defaultChartType; });
    return defaults;
  });

  const handleChartTypeChange = (widgetId: string, ct: ChartTypeOption) => {
    setWidgetChartTypes(prev => ({ ...prev, [widgetId]: ct }));
  };

  const createLayouts = (role: DashboardRole): Record<Period, LayoutItem[]> => {
    const roleDefaults = DEFAULT_LAYOUTS[role] || DEFAULT_LAYOUTS.HR_MANAGER;
    const generateLayout = (ids: string[]) => ids.map((id, i) => {
      const meta = WIDGET_CATALOGUE.find(w => w.id === id);
      return { widgetId: id, position: i, chartType: meta?.defaultChartType || 'kpi_card', colSpan: meta?.colSpan || 1 };
    });
    return {
      today: generateLayout(roleDefaults.today),
      mtd: generateLayout(roleDefaults.mtd),
      ytd: generateLayout(roleDefaults.ytd),
    };
  };

  const [layouts, setLayouts] = useState<Record<Period, LayoutItem[]>>(() => createLayouts('HR_MANAGER'));
  const layout = layouts[period];

  const setLayout = (updater: React.SetStateAction<LayoutItem[]>) => {
    setLayouts((prev) => ({
      ...prev,
      [period]: typeof updater === 'function' ? updater(prev[period]) : updater,
    }));
  };

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

  const addWidgets = (ids: string[]) => {
    const newItems = ids.map((id, index) => {
      const meta = WIDGET_CATALOGUE.find(w => w.id === id);
      return { widgetId: id, position: layout.length + index, chartType: meta?.defaultChartType || 'kpi_card', colSpan: meta?.colSpan || 1 };
    });
    setLayout(prev => [...prev, ...newItems]);
  };

  const removeWidget = (id: string) => setLayout(prev => prev.filter(i => i.widgetId !== id));

  const handleRoleChange = (r: DashboardRole) => {
    setDashRole(r);
    setLayouts(createLayouts(r));
    // Reset chart types to defaults when role changes
    const defaults: Record<string, ChartTypeOption> = {};
    WIDGET_CATALOGUE.forEach(w => { defaults[w.id] = w.defaultChartType; });
    setWidgetChartTypes(defaults);
  };

  const roleLabels: Record<DashboardRole, string> = {
    HR_MANAGER: 'HR Manager', PRINCIPAL: 'Principal / HOD', CHAIRMAN: 'Group Chairman', FINANCE: 'Finance Head',
  };

  const onCampusSelect = dashRole === 'CHAIRMAN' ? (campus: string) => setSelectedCampus(campus) : undefined;

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
          <button onClick={() => setIsLocked(!isLocked)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: isLocked ? DS.bgLow : DS.warningBg, color: isLocked ? DS.text3 : DS.warning }}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />} {isLocked ? 'Locked' : 'Unlocked'}
          </button>
          {!isLocked && (
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
              {period === 'today' ? 'Right Now · Live attendance & alerts'
                : period === 'mtd' ? 'This Month (MTD) · Payroll, leave & compliance'
                : 'This Year (YTD) · Attrition, appraisals & talent'}
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

        {/* Grid Builder View */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={layout.map(i => i.widgetId)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-4 auto-rows-min">
              {layout.map(item => (
                <SortableWidget
                  key={item.widgetId}
                  item={item}
                  activeChartType={widgetChartTypes[item.widgetId] || item.chartType}
                  onRemove={removeWidget}
                  onChartTypeChange={handleChartTypeChange}
                  isLocked={isLocked}
                  role={dashRole}
                  onCampusSelect={onCampusSelect}
                />
              ))}
              {!isLocked && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="col-span-1 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ border: `2px dashed ${DS.border}`, background: DS.bgLow, color: DS.text3 }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-xs font-semibold">Add Widget</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <AddWidgetDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        role={dashRole}
        activeIds={layout.map(i => i.widgetId)}
        onAdd={addWidgets}
      />
      {selectedCampus && (
        <CampusDrillPanel
          campus={selectedCampus}
          onClose={() => setSelectedCampus(null)}
        />
      )}
    </div>
  );
};

export default ManagementDashboard;
