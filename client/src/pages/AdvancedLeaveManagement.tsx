import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, CalendarCheck, Clock, CheckCircle2, XCircle, AlertCircle,
  FileText, Settings, Users, BarChart3, Shield, Plus, Search,
  ChevronRight, Home, Bell, TrendingUp, TrendingDown,
  Coffee, Briefcase, BookOpen, Heart,
  Download, Upload, Edit, Trash2, Eye, Check, X, AlertTriangle,
  Building2, UserCheck, History, Info, Award, Layers,
  Sun, Moon, MapPin, Lock, ArrowRight, Clipboard, Star,
  LayoutDashboard, ListChecks, CalendarDays, BarChart2, ScrollText,
  Smartphone, Zap, RefreshCw, Filter, ChevronDown
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type LeaveStatus = 'Approved' | 'Rejected' | 'Pending' | 'Cancelled';
type SandwichMode = 'ALLOW' | 'DEDUCT' | 'ONE_SIDE_ONLY' | 'BLOCK';
type AccrualMethod = 'YEARLY_BULK' | 'MONTHLY' | 'SEMESTER' | 'EARNED_DAYS';

interface LeaveTypeConfig {
  id: string; code: string; name: string; icon: string;
  color: string; bg: string; border: string;
  teachingPerm: number; nonTeachingPerm: number;
  accrualMethod: AccrualMethod; sandwichMode: SandwichMode;
  docTriggerDays: number | null; advanceNoticeDays: number;
  maxConsecutive: number | null; carryForwardCap: number | null;
  halfDayAllowed: boolean; active: boolean;
}

interface LeaveApplication {
  id: string; employee: string; role: string; dept: string;
  type: string; typeCode: string; from: string; to: string;
  days: number; status: LeaveStatus; appliedOn: string;
  reason: string; approver: string; level: number;
  slaHours: number; elapsedHours: number; lop: number;
  hasDoc: boolean; sandwich?: number;
}

interface PermissionRecord {
  id: string; date: string; slot: 'LATE_IN' | 'EARLY_OUT';
  time: string; reason: string; status: LeaveStatus; approved: boolean;
}

interface HolidayEntry {
  id: string; date: string; name: string; type: 'NATIONAL' | 'REGIONAL' | 'INSTITUTION' | 'SATURDAY';
}

interface AuditEntry {
  id: string; timestamp: string; actor: string; action: string;
  target: string; details: string; category: 'APPLICATION' | 'CONFIG' | 'APPROVAL' | 'BALANCE';
}

// ─── SEED DATA ─────────────────────────────────────────────────────────────────

const LEAVE_TYPES: LeaveTypeConfig[] = [
  { id: '1', code: 'CL', name: 'Casual Leave', icon: '☕', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', teachingPerm: 12, nonTeachingPerm: 12, accrualMethod: 'MONTHLY', sandwichMode: 'ONE_SIDE_ONLY', docTriggerDays: null, advanceNoticeDays: 1, maxConsecutive: 3, carryForwardCap: 0, halfDayAllowed: true, active: true },
  { id: '2', code: 'SL', name: 'Sick Leave', icon: '🏥', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', teachingPerm: 10, nonTeachingPerm: 10, accrualMethod: 'YEARLY_BULK', sandwichMode: 'ALLOW', docTriggerDays: 3, advanceNoticeDays: 0, maxConsecutive: null, carryForwardCap: 5, halfDayAllowed: true, active: true },
  { id: '3', code: 'EL', name: 'Earned Leave', icon: '⭐', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', teachingPerm: 21, nonTeachingPerm: 21, accrualMethod: 'EARNED_DAYS', sandwichMode: 'DEDUCT', docTriggerDays: null, advanceNoticeDays: 15, maxConsecutive: null, carryForwardCap: 30, halfDayAllowed: false, active: true },
  { id: '4', code: 'CO', name: 'Comp Off', icon: '🔄', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', teachingPerm: 0, nonTeachingPerm: 0, accrualMethod: 'EARNED_DAYS', sandwichMode: 'ALLOW', docTriggerDays: null, advanceNoticeDays: 0, maxConsecutive: null, carryForwardCap: 0, halfDayAllowed: true, active: true },
  { id: '5', code: 'OOD', name: 'On Official Duty', icon: '🎒', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', teachingPerm: 10, nonTeachingPerm: 7, accrualMethod: 'YEARLY_BULK', sandwichMode: 'ALLOW', docTriggerDays: 0, advanceNoticeDays: 1, maxConsecutive: null, carryForwardCap: 0, halfDayAllowed: false, active: true },
  { id: '6', code: 'OED', name: 'On Exam Duty', icon: '📝', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', teachingPerm: 14, nonTeachingPerm: 0, accrualMethod: 'YEARLY_BULK', sandwichMode: 'ALLOW', docTriggerDays: 0, advanceNoticeDays: 1, maxConsecutive: null, carryForwardCap: 0, halfDayAllowed: false, active: true },
  { id: '7', code: 'ML', name: 'Maternity Leave', icon: '👶', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200', teachingPerm: 182, nonTeachingPerm: 182, accrualMethod: 'YEARLY_BULK', sandwichMode: 'ALLOW', docTriggerDays: 0, advanceNoticeDays: 30, maxConsecutive: 182, carryForwardCap: 0, halfDayAllowed: false, active: true },
  { id: '8', code: 'LOP', name: 'Loss of Pay', icon: '⚠️', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', teachingPerm: 5, nonTeachingPerm: 5, accrualMethod: 'YEARLY_BULK', sandwichMode: 'ALLOW', docTriggerDays: null, advanceNoticeDays: 0, maxConsecutive: null, carryForwardCap: 0, halfDayAllowed: true, active: true },
  { id: '9', code: 'VL', name: 'Vacation Leave', icon: '🌴', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', teachingPerm: 28, nonTeachingPerm: 14, accrualMethod: 'SEMESTER', sandwichMode: 'ALLOW', docTriggerDays: null, advanceNoticeDays: 7, maxConsecutive: null, carryForwardCap: 0, halfDayAllowed: false, active: true },
  { id: '10', code: 'WFH', name: 'Work from Home', icon: '🏠', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', teachingPerm: 4, nonTeachingPerm: 8, accrualMethod: 'MONTHLY', sandwichMode: 'ALLOW', docTriggerDays: null, advanceNoticeDays: 1, maxConsecutive: 3, carryForwardCap: 0, halfDayAllowed: false, active: true },
];

const MOCK_BALANCES = [
  { emp: 'EMP001', name: 'Ms. Reshma Binu Prasad', dept: 'Computer Science', cat: 'Teaching', CL: 8, SL: 7, EL: 15, CO: 2, OOD: 6, OED: 10, LOP: 0, VL: 14 },
  { emp: 'EMP002', name: 'Ms. Sanchaiyata Majumdar', dept: 'Mathematics', cat: 'Teaching', CL: 10, SL: 10, EL: 18, CO: 0, OOD: 8, OED: 12, LOP: 0, VL: 14 },
  { emp: 'EMP003', name: 'Dr. R Sedhunivas', dept: 'Computer Science', cat: 'Teaching', CL: 5, SL: 8, EL: 21, CO: 1, OOD: 10, OED: 14, LOP: 1, VL: 7 },
  { emp: 'EMP004', name: 'Dr. Ranjita Saikia', dept: 'Physics', cat: 'Teaching', CL: 9, SL: 10, EL: 0, CO: 0, OOD: 7, OED: 12, LOP: 0, VL: 14 },
  { emp: 'EMP005', name: 'Mr. Manjit Singh', dept: 'Admin', cat: 'Non-Teaching', CL: 6, SL: 4, EL: 12, CO: 3, OOD: 5, OED: 0, LOP: 2, VL: 7 },
  { emp: 'EMP006', name: 'Mr. Edwin Vimal A', dept: 'Electronics', cat: 'Teaching', CL: 11, SL: 9, EL: 14, CO: 0, OOD: 9, OED: 13, LOP: 0, VL: 14 },
];

const MOCK_APPLICATIONS: LeaveApplication[] = [
  { id: 'LR-1045', employee: 'Ms. Reshma Binu Prasad', role: 'Asst. Professor', dept: 'Computer Science', type: 'Casual Leave', typeCode: 'CL', from: '2026-05-12', to: '2026-05-13', days: 2, status: 'Pending', appliedOn: '2026-05-07', reason: 'Family function out of station.', approver: 'Dr. Rajesh (HOD)', level: 1, slaHours: 48, elapsedHours: 6, lop: 0, hasDoc: false },
  { id: 'LR-1046', employee: 'Ms. Sanchaiyata Majumdar', role: 'Lecturer', dept: 'Mathematics', type: 'Sick Leave', typeCode: 'SL', from: '2026-05-08', to: '2026-05-10', days: 3, status: 'Pending', appliedOn: '2026-05-07', reason: 'High fever — doctor visit.', approver: 'Dr. Rajesh (HOD)', level: 1, slaHours: 24, elapsedHours: 18, lop: 0, hasDoc: false },
  { id: 'LR-1047', employee: 'Dr. R Sedhunivas', role: 'HOD', dept: 'Computer Science', type: 'Earned Leave', typeCode: 'EL', from: '2026-05-20', to: '2026-05-25', days: 6, status: 'Pending', appliedOn: '2026-04-28', reason: 'Personal travel — family pilgrimage.', approver: 'Principal', level: 2, slaHours: 72, elapsedHours: 71, lop: 0, hasDoc: false },
  { id: 'LR-1048', employee: 'Dr. Ranjita Saikia', role: 'Professor', dept: 'Physics', type: 'On Exam Duty', typeCode: 'OED', from: '2026-05-14', to: '2026-05-15', days: 2, status: 'Pending', appliedOn: '2026-05-05', reason: 'Invigilator duty at Board Exam centre 45.', approver: 'Dr. Rajesh (HOD)', level: 1, slaHours: 48, elapsedHours: 48, lop: 0, hasDoc: true },
  { id: 'LR-1049', employee: 'Mr. Manjit Singh', role: 'Lab Assistant', dept: 'Admin', type: 'Loss of Pay', typeCode: 'LOP', from: '2026-05-09', to: '2026-05-09', days: 1, status: 'Pending', appliedOn: '2026-05-09', reason: 'Balance exhausted — emergency situation.', approver: 'HR Admin', level: 2, slaHours: 24, elapsedHours: 20, lop: 1, hasDoc: false },
  { id: 'LR-1040', employee: 'Mr. Edwin Vimal A', role: 'Lecturer', dept: 'Electronics', type: 'Casual Leave', typeCode: 'CL', from: '2026-04-28', to: '2026-04-28', days: 1, status: 'Approved', appliedOn: '2026-04-25', reason: 'Personal work.', approver: 'Dr. Rajesh (HOD)', level: 1, slaHours: 48, elapsedHours: 12, lop: 0, hasDoc: false },
  { id: 'LR-1038', employee: 'Ms. Reshma Binu Prasad', role: 'Asst. Professor', dept: 'Computer Science', type: 'Sick Leave', typeCode: 'SL', from: '2026-04-15', to: '2026-04-17', days: 3, status: 'Approved', appliedOn: '2026-04-15', reason: 'Viral fever.', approver: 'Dr. Rajesh (HOD)', level: 1, slaHours: 24, elapsedHours: 6, lop: 0, hasDoc: true },
  { id: 'LR-1030', employee: 'Dr. Ranjita Saikia', role: 'Professor', dept: 'Physics', type: 'Casual Leave', typeCode: 'CL', from: '2026-04-10', to: '2026-04-10', days: 1, status: 'Rejected', appliedOn: '2026-04-08', reason: 'Personal work.', approver: 'Principal', level: 2, slaHours: 48, elapsedHours: 24, lop: 0, hasDoc: false },
];

const DEPT_LEAVE_DATA = [
  { dept: 'Computer Science', onLeave: 2, total: 12 },
  { dept: 'Mathematics', onLeave: 1, total: 8 },
  { dept: 'Physics', onLeave: 0, total: 7 },
  { dept: 'Chemistry', onLeave: 1, total: 6 },
  { dept: 'Electronics', onLeave: 0, total: 9 },
  { dept: 'Admin', onLeave: 2, total: 11 },
];

const HOLIDAYS: HolidayEntry[] = [
  { id: 'H1', date: '2026-05-01', name: 'Labour Day', type: 'NATIONAL' },
  { id: 'H2', date: '2026-05-12', name: 'Buddha Purnima', type: 'NATIONAL' },
  { id: 'H3', date: '2026-06-15', name: 'Institution Foundation Day', type: 'INSTITUTION' },
  { id: 'H4', date: '2026-08-15', name: 'Independence Day', type: 'NATIONAL' },
  { id: 'H5', date: '2026-10-02', name: 'Gandhi Jayanti', type: 'NATIONAL' },
  { id: 'H6', date: '2026-10-24', name: 'Dussehra', type: 'REGIONAL' },
  { id: 'H7', date: '2026-11-01', name: 'Karnataka Rajyotsava', type: 'REGIONAL' },
  { id: 'H8', date: '2026-11-12', name: 'Diwali', type: 'REGIONAL' },
  { id: 'H9', date: '2026-12-25', name: 'Christmas', type: 'NATIONAL' },
];

const PERMISSIONS: PermissionRecord[] = [
  { id: 'P1', date: '2026-05-06', slot: 'LATE_IN', time: '09:42', reason: 'Traffic delay', status: 'Approved', approved: true },
  { id: 'P2', date: '2026-05-05', slot: 'EARLY_OUT', time: '16:15', reason: 'Bank work', status: 'Approved', approved: true },
  { id: 'P3', date: '2026-04-28', slot: 'LATE_IN', time: '10:05', reason: 'Medical appointment (half month 3/3)', status: 'Approved', approved: true },
];

const AUDIT_LOG: AuditEntry[] = [
  { id: 'A1', timestamp: '2026-05-07 09:15:22', actor: 'Ms. Reshma Binu Prasad', action: 'Applied Leave', target: 'LR-1045 (CL)', details: '2 days – 12 May to 13 May', category: 'APPLICATION' },
  { id: 'A2', timestamp: '2026-05-07 09:02:11', actor: 'Ms. Sanchaiyata Majumdar', action: 'Applied Leave', target: 'LR-1046 (SL)', details: '3 days – 8 May to 10 May', category: 'APPLICATION' },
  { id: 'A3', timestamp: '2026-05-06 17:44:05', actor: 'Sarah HR (HR Admin)', action: 'Config Updated', target: 'CL Policy Rule', details: 'Sandwich mode changed: DEDUCT → ONE_SIDE_ONLY', category: 'CONFIG' },
  { id: 'A4', timestamp: '2026-05-06 14:22:33', actor: 'Dr. Rajesh (HOD)', action: 'Approved Leave', target: 'LR-1040 (CL)', details: 'Edwin Vimal – 28 Apr, 1 day', category: 'APPROVAL' },
  { id: 'A5', timestamp: '2026-05-05 11:10:18', actor: 'Sarah HR (HR Admin)', action: 'Balance Adjusted', target: 'EMP005 – Manjit Singh', details: 'LOP balance reset: 2 → 0 (manual correction)', category: 'BALANCE' },
  { id: 'A6', timestamp: '2026-05-04 16:55:07', actor: 'Principal', action: 'Rejected Leave', target: 'LR-1030 (CL)', details: 'Dr. Ranjita Saikia – 10 Apr', category: 'APPROVAL' },
  { id: 'A7', timestamp: '2026-05-03 08:30:00', actor: 'System', action: 'Holiday Calendar Updated', target: 'May 2026', details: 'Buddha Purnima added – 12 May 2026', category: 'CONFIG' },
];

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, title, subtitle, actions }: { icon: any; title: string; subtitle?: string; actions?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md shadow-blue-500/20">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {actions}
  </div>
);

const KPICard = ({ label, value, sub, color, icon: Icon, trend }: { label: string; value: string | number; sub?: string; color: string; icon: any; trend?: 'up' | 'down' | 'neutral' }) => (
  <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-2xl font-black ${color} leading-none`}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-50').replace('-700', '-50')}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
          {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
          <span>{trend === 'up' ? '+2 from last month' : trend === 'down' ? '-1 from last month' : 'No change'}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: LeaveStatus }) => {
  const cfg = {
    Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Rejected: 'bg-red-50 text-red-700 border border-red-200',
    Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    Cancelled: 'bg-slate-100 text-slate-500 border border-slate-200',
  }[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg}`}>{status}</span>;
};

const SlaBar = ({ elapsed, total }: { elapsed: number; total: number }) => {
  const pct = Math.min((elapsed / total) * 100, 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold ${pct >= 90 ? 'text-red-600' : 'text-slate-500'}`}>{elapsed}h/{total}h</span>
    </div>
  );
};

// ─── SECTION: DASHBOARD ────────────────────────────────────────────────────────

const DashboardSection = () => {
  const pending = MOCK_APPLICATIONS.filter(a => a.status === 'Pending');
  const overdue = pending.filter(a => a.elapsedHours >= a.slaHours);
  const onLeaveToday = 4;

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Pending Approvals" value={pending.length} sub="Across all levels" color="text-amber-600" icon={Clock} trend="up" />
        <KPICard label="On Leave Today" value={onLeaveToday} sub="Out of 86 staff" color="text-blue-600" icon={Users} trend="neutral" />
        <KPICard label="Overdue SLA" value={overdue.length} sub="Needs immediate action" color="text-red-600" icon={AlertTriangle} trend="down" />
        <KPICard label="LOP This Month" value={3} sub="Days deducted" color="text-orange-600" icon={AlertCircle} trend="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department Heatmap */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Department Leave Heatmap — Today</h3>
                <span className="text-xs text-slate-400">May 7, 2026</span>
              </div>
              <div className="space-y-2.5">
                {DEPT_LEAVE_DATA.map(d => {
                  const pct = (d.onLeave / d.total) * 100;
                  const color = pct > 25 ? 'bg-red-400' : pct > 10 ? 'bg-amber-400' : 'bg-emerald-400';
                  return (
                    <div key={d.dept} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-36 truncate">{d.dept}</span>
                      <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                        <div className={`h-full ${color} rounded transition-all`} style={{ width: `${pct || 2}%` }} />
                      </div>
                      <span className={`text-xs font-bold w-12 text-right ${pct > 25 ? 'text-red-600' : pct > 10 ? 'text-amber-600' : 'text-slate-500'}`}>{d.onLeave}/{d.total}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                {[['bg-emerald-400', '≤10% absent'], ['bg-amber-400', '10–25%'], ['bg-red-400', '>25%']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-sm ${c}`} /><span className="text-xs text-slate-500">{l}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Alerts */}
        <Card className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">SLA Overdue Alerts</h3>
            <div className="space-y-2.5">
              {overdue.length === 0 && (
                <div className="flex flex-col items-center py-6 text-slate-400">
                  <CheckCircle2 className="h-8 w-8 mb-2 text-emerald-400" />
                  <p className="text-xs">All SLAs on track!</p>
                </div>
              )}
              {overdue.map(app => (
                <div key={app.id} className="p-2.5 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{app.employee.split(' ').slice(-1)[0]}</p>
                      <p className="text-xs text-red-600">{app.typeCode} · {app.days}d</p>
                    </div>
                    <Badge className="bg-red-100 text-red-700 text-[10px] border-none">Overdue</Badge>
                  </div>
                  <SlaBar elapsed={app.elapsedHours} total={app.slaHours} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Recent Activity</h3>
          <div className="divide-y divide-slate-50">
            {AUDIT_LOG.slice(0, 5).map(entry => (
              <div key={entry.id} className="py-2 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.category === 'APPLICATION' ? 'bg-blue-400' : entry.category === 'APPROVAL' ? 'bg-emerald-400' : entry.category === 'CONFIG' ? 'bg-purple-400' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{entry.actor} — <span className="font-normal text-slate-500">{entry.action} · {entry.target}</span></p>
                  <p className="text-xs text-slate-400">{entry.details}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{entry.timestamp.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── SECTION: LEAVE CALENDAR ───────────────────────────────────────────────────

const CalendarSection = () => {
  const [selectedMonth] = useState('May 2026');
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const leaveMap: Record<number, { code: string; color: string }[]> = {
    1: [{ code: 'HOLIDAY', color: 'bg-slate-300' }],
    7: [{ code: 'CL', color: 'bg-blue-400' }, { code: 'SL', color: 'bg-red-400' }],
    8: [{ code: 'SL', color: 'bg-red-400' }],
    9: [{ code: 'SL', color: 'bg-red-400' }, { code: 'LOP', color: 'bg-orange-400' }],
    10: [{ code: 'SL', color: 'bg-red-400' }],
    12: [{ code: 'HOLIDAY', color: 'bg-slate-300' }, { code: 'CL', color: 'bg-blue-400' }],
    13: [{ code: 'CL', color: 'bg-blue-400' }],
    14: [{ code: 'OED', color: 'bg-teal-400' }],
    15: [{ code: 'OED', color: 'bg-teal-400' }],
    20: [{ code: 'EL', color: 'bg-amber-400' }],
    21: [{ code: 'EL', color: 'bg-amber-400' }],
    22: [{ code: 'EL', color: 'bg-amber-400' }],
    23: [{ code: 'EL', color: 'bg-amber-400' }],
    24: [{ code: 'EL', color: 'bg-amber-400' }, { code: 'CL', color: 'bg-blue-400' }],
    25: [{ code: 'EL', color: 'bg-amber-400' }],
  };
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDay = 4; // May 2026 starts on Friday

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Leave Calendar — {selectedMonth}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs">All Departments</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs"><Download className="h-3 w-3 mr-1" />Export</Button>
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(d => {
              const entries = leaveMap[d] || [];
              const isWeekend = (d + startDay - 1) % 7 === 0 || (d + startDay - 1) % 7 === 6;
              const isHoliday = entries.some(e => e.code === 'HOLIDAY');
              return (
                <div key={d} className={`min-h-[60px] p-1 rounded-lg border text-xs cursor-pointer hover:border-blue-300 transition-colors ${isWeekend ? 'bg-slate-50 border-slate-100' : isHoliday ? 'bg-slate-100 border-slate-200' : 'border-slate-100 bg-white hover:bg-blue-50/30'}`}>
                  <span className={`font-semibold ${isWeekend ? 'text-slate-300' : isHoliday ? 'text-slate-400' : d === 7 ? 'text-blue-600' : 'text-slate-700'}`}>{d}</span>
                  <div className="mt-0.5 space-y-0.5">
                    {entries.filter(e => e.code !== 'HOLIDAY').map((e, idx) => (
                      <div key={idx} className={`${e.color} text-white text-[9px] font-bold px-1 py-0.5 rounded`}>{e.code}</div>
                    ))}
                    {isHoliday && <div className="bg-slate-400 text-white text-[9px] font-bold px-1 py-0.5 rounded">HOL</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[['bg-blue-400', 'Casual Leave (CL)'], ['bg-red-400', 'Sick Leave (SL)'], ['bg-amber-400', 'Earned Leave (EL)'], ['bg-teal-400', 'Exam Duty (OED)'], ['bg-orange-400', 'Loss of Pay (LOP)'], ['bg-slate-300', 'Holiday']].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded ${c}`} /><span className="text-xs text-slate-600">{l}</span></div>
        ))}
      </div>
    </div>
  );
};

// ─── SECTION: MY LEAVES ────────────────────────────────────────────────────────

const MyLeavesSection = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'past'>('pending');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ type: 'CL', from: '', to: '', halfDay: false, reason: '' });
  const [sandwichWarning, setSandwichWarning] = useState(false);

  const myBalance = MOCK_BALANCES[0];
  const myApps = MOCK_APPLICATIONS.filter(a => a.employee === myBalance.name);

  const currentMonth = 5;
  const annualCL = 12;
  const visibleCL = Math.min(myBalance.CL, Math.floor((annualCL / 12) * currentMonth));

  const balanceCards = [
    { code: 'CL', label: 'Casual Leave', total: annualCL, balance: myBalance.CL, visible: visibleCL, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { code: 'SL', label: 'Sick Leave', total: 10, balance: myBalance.SL, visible: myBalance.SL, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { code: 'EL', label: 'Earned Leave', total: 21, balance: myBalance.EL, visible: myBalance.EL, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { code: 'OED', label: 'Exam Duty', total: 14, balance: myBalance.OED, visible: myBalance.OED, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    { code: 'OOD', label: 'Official Duty', total: 10, balance: myBalance.OOD, visible: myBalance.OOD, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { code: 'CO', label: 'Comp Off', total: 0, balance: myBalance.CO, visible: myBalance.CO, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  ];

  return (
    <div className="space-y-5">
      {/* Balance Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800">My Leave Balances <span className="text-xs font-normal text-slate-400">(FY 2026-27)</span></h3>
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
            <Info className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">Monthly quota view enabled</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {balanceCards.map(b => (
            <div key={b.code} className={`${b.bg} ${b.border} border rounded-xl p-3 text-center`}>
              <p className="text-xs font-semibold text-slate-500 mb-1">{b.label}</p>
              <p className={`text-2xl font-black ${b.color}`}>{b.visible}</p>
              <p className="text-xs text-slate-400">of {b.total || '∞'}</p>
              <Progress value={b.total ? (b.visible / b.total) * 100 : 50} className="h-1 mt-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex items-center gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs" onClick={() => setShowApplyModal(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />Apply Leave
        </Button>
        <div className="flex gap-1">
          {(['pending', 'upcoming', 'past'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${activeTab === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-2">
        {myApps.filter(a => {
          if (activeTab === 'pending') return a.status === 'Pending';
          if (activeTab === 'upcoming') return a.status === 'Approved' && new Date(a.from) >= new Date();
          return a.status !== 'Pending';
        }).map(app => (
          <Card key={app.id} className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-center bg-blue-50 rounded-lg p-2 w-12">
                    <p className="text-xs font-bold text-blue-600">{app.typeCode}</p>
                    <p className="text-lg font-black text-slate-800">{app.days}</p>
                    <p className="text-xs text-slate-400">days</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{app.type}</p>
                    <p className="text-xs text-slate-500">{app.from} → {app.to}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Approver: {app.approver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={app.status} />
                  <p className="text-xs text-slate-400 mt-1">Applied: {app.appliedOn}</p>
                </div>
              </div>
              {app.status === 'Pending' && <SlaBar elapsed={app.elapsedHours} total={app.slaHours} />}
            </CardContent>
          </Card>
        ))}
        {myApps.filter(a => activeTab === 'pending' ? a.status === 'Pending' : activeTab === 'upcoming' ? a.status === 'Approved' && new Date(a.from) >= new Date() : a.status !== 'Pending').length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <CalendarCheck className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No {activeTab} leave records</p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Leave Type</Label>
              <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={applyForm.type} onChange={e => setApplyForm(f => ({ ...f, type: e.target.value }))}>
                {LEAVE_TYPES.filter(t => t.active && t.code !== 'WFH').map(lt => (
                  <option key={lt.id} value={lt.code}>{lt.icon} {lt.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">From Date</Label>
                <Input type="date" className="mt-1 h-9 text-sm" value={applyForm.from}
                  onChange={e => {
                    setApplyForm(f => ({ ...f, from: e.target.value }));
                    setSandwichWarning(e.target.value === '2026-05-11');
                  }} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">To Date</Label>
                <Input type="date" className="mt-1 h-9 text-sm" value={applyForm.to} onChange={e => setApplyForm(f => ({ ...f, to: e.target.value }))} />
              </div>
            </div>
            {sandwichWarning && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-700">Sandwich Rule — ONE_SIDE_ONLY</p>
                  <p className="text-xs text-amber-600">May 12 is a public holiday (Buddha Purnima). CL cannot be prefixed AND suffixed around this holiday. 1 additional day will be counted if applied on both sides.</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Switch checked={applyForm.halfDay} onCheckedChange={v => setApplyForm(f => ({ ...f, halfDay: v }))} />
              <Label className="text-xs text-slate-600">Half Day</Label>
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Reason</Label>
              <textarea className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none" rows={3}
                placeholder="Brief reason for leave..." value={applyForm.reason} onChange={e => setApplyForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm" onClick={() => setShowApplyModal(false)}>Submit Application</Button>
              <Button variant="outline" className="h-9 text-sm" onClick={() => setShowApplyModal(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── SECTION: APPROVALS ────────────────────────────────────────────────────────

const ApprovalsSection = () => {
  const [selected, setSelected] = useState<LeaveApplication | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actions, setActions] = useState<Record<string, 'approved' | 'rejected'>>({});
  const pending = MOCK_APPLICATIONS.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Pending" value={pending.length} color="text-amber-600" icon={Clock} />
        <KPICard label="Overdue SLA" value={pending.filter(a => a.elapsedHours >= a.slaHours).length} color="text-red-600" icon={AlertTriangle} />
        <KPICard label="Approved (May)" value={3} color="text-emerald-600" icon={CheckCircle2} />
        <KPICard label="Rejected (May)" value={1} color="text-slate-500" icon={XCircle} />
      </div>

      <div className="space-y-2.5">
        {pending.map(app => (
          <Card key={app.id} className={`border-none shadow-sm ring-1 ${app.elapsedHours >= app.slaHours ? 'ring-red-200 bg-red-50/30' : 'ring-slate-100'}`}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {app.employee.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{app.employee}</p>
                    <p className="text-xs text-slate-500">{app.role} · {app.dept}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] h-4">{app.typeCode}</Badge>
                      <span className="text-xs text-slate-500">{app.from} → {app.to} ({app.days}d)</span>
                      {app.lop > 0 && <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-[10px] h-4">LOP: {app.lop}d</Badge>}
                      {app.hasDoc && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] h-4">Doc ✓</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {actions[app.id] ? (
                    <Badge className={`${actions[app.id] === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} border-none`}>
                      {actions[app.id] === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </Badge>
                  ) : (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs"
                        onClick={() => setActions(a => ({ ...a, [app.id]: 'approved' }))}>
                        <Check className="h-3 w-3 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-7 text-xs"
                        onClick={() => setSelected(app)}>
                        <X className="h-3 w-3 mr-1" />Reject
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelected(app)}>
                        <Eye className="h-3 w-3 mr-1" />View
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2.5">
                <p className="text-xs text-slate-500 mb-1">SLA: Level {app.level} · {app.approver}</p>
                <SlaBar elapsed={app.elapsedHours} total={app.slaHours} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reject Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected ? `${selected.employee} — ${selected.type}` : ''}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 py-2">
              <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-slate-500"><strong>Period:</strong> {selected.from} to {selected.to} ({selected.days} days)</p>
                <p className="text-xs text-slate-500"><strong>Reason:</strong> {selected.reason}</p>
                {selected.lop > 0 && <p className="text-xs text-orange-600 font-semibold"><strong>LOP:</strong> {selected.lop} day(s) will be deducted</p>}
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Rejection Reason (required)</Label>
                <textarea className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none" rows={3}
                  placeholder="Provide reason for rejection..." value={rejectNote} onChange={e => setRejectNote(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white h-9 text-sm" disabled={!rejectNote.trim()}
                  onClick={() => { setActions(a => ({ ...a, [selected.id]: 'rejected' })); setSelected(null); setRejectNote(''); }}>
                  Confirm Reject
                </Button>
                <Button variant="outline" className="h-9 text-sm" onClick={() => setSelected(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── SECTION: MY POLICY ────────────────────────────────────────────────────────

const MyPolicySection = () => (
  <div className="space-y-4">
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
      <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-blue-800">NHC Leave Policy — FY 2026-27</p>
        <p className="text-xs text-blue-600 mt-0.5">This is a read-only view of your entitlements and leave rules. Contact HR Admin for any queries.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {LEAVE_TYPES.slice(0, 8).map(lt => (
        <Card key={lt.id} className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{lt.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-800">{lt.name}</p>
                <p className="text-xs text-slate-400">{lt.code}</p>
              </div>
              <Badge className={`ml-auto ${lt.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'} text-[10px]`}>{lt.active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="text-slate-400">Entitlement:</span> <span className="font-semibold text-slate-700">{lt.teachingPerm || '∞'} days/year</span></div>
              <div><span className="text-slate-400">Accrual:</span> <span className="font-semibold text-slate-700">{lt.accrualMethod.toLowerCase().replace('_', ' ')}</span></div>
              <div><span className="text-slate-400">Sandwich rule:</span> <span className="font-semibold text-slate-700">{lt.sandwichMode.toLowerCase().replace('_', ' ')}</span></div>
              <div><span className="text-slate-400">Advance notice:</span> <span className="font-semibold text-slate-700">{lt.advanceNoticeDays}d</span></div>
              <div><span className="text-slate-400">Half day:</span> <span className="font-semibold text-slate-700">{lt.halfDayAllowed ? 'Allowed' : 'Not allowed'}</span></div>
              <div><span className="text-slate-400">Doc required:</span> <span className="font-semibold text-slate-700">{lt.docTriggerDays === null ? 'Never' : lt.docTriggerDays === 0 ? 'Always' : `After ${lt.docTriggerDays}d`}</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="border-none shadow-sm ring-1 ring-slate-100">
      <CardContent className="p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Approval Workflow</h3>
        <div className="space-y-2.5">
          {[{ group: 'Teaching Staff (CL/SL)', chain: ['HOD (L1)', 'HR Admin (L2 — terminal)'], sla: '48h / 72h' }, { group: 'Teaching Staff (EL)', chain: ['HOD (L1)', 'Principal (L2)', 'HR Admin (L3)'], sla: '72h / 72h / 72h' }, { group: 'HODs', chain: ['Principal (L1)', 'HR Admin (L2)'], sla: '72h / 72h' }].map(wf => (
            <div key={wf.group} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-44">{wf.group}</span>
              <div className="flex items-center gap-1 flex-1">
                {wf.chain.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">{step}</Badge>
                    {idx < wf.chain.length - 1 && <ArrowRight className="h-3 w-3 text-slate-300" />}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400">{wf.sla}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ─── SECTION: PERMISSIONS ─────────────────────────────────────────────────────

const PermissionsSection = () => {
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ date: '', slot: 'LATE_IN', time: '', reason: '' });
  const usedThisMonth = PERMISSIONS.length;
  const quota = 3;
  const willConvert = usedThisMonth >= quota;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KPICard label="Used This Month" value={`${usedThisMonth}/${quota}`} sub="Permission quota" color="text-blue-600" icon={Clock} />
        <KPICard label="Quota Status" value={willConvert ? 'Exceeded' : 'Available'} sub={willConvert ? 'Next converts to ½ CL' : `${quota - usedThisMonth} remaining`} color={willConvert ? 'text-red-600' : 'text-emerald-600'} icon={willConvert ? AlertTriangle : CheckCircle2} />
        <KPICard label="Converted to Leave" value={0} sub="Half-day CL conversions" color="text-amber-600" icon={RefreshCw} />
      </div>

      {willConvert && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700"><strong>Quota full:</strong> You have used all 3 permission slots this month. Any new permission will automatically be converted to a half-day Casual Leave deduction.</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Permission History — May 2026</h3>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs" onClick={() => setShowApply(true)}>
          <Plus className="h-3 w-3 mr-1" />Apply Permission
        </Button>
      </div>

      <div className="space-y-2">
        {PERMISSIONS.map(p => (
          <Card key={p.id} className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-3 flex items-center gap-4">
              <div className={`p-2 rounded-lg ${p.slot === 'LATE_IN' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                {p.slot === 'LATE_IN' ? <Sun className="h-4 w-4 text-amber-600" /> : <Moon className="h-4 w-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{p.slot === 'LATE_IN' ? 'Late Login' : 'Early Logout'} — {p.time}</p>
                <p className="text-xs text-slate-500">{p.date} · {p.reason}</p>
              </div>
              <StatusBadge status={p.status} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Apply Permission</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs font-semibold">Date</Label>
              <Input type="date" className="mt-1 h-9 text-sm" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Type</Label>
              <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={form.slot} onChange={e => setForm(f => ({ ...f, slot: e.target.value }))}>
                <option value="LATE_IN">Late Login (after 9:15 AM)</option>
                <option value="EARLY_OUT">Early Logout (before 5:00 PM)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Time</Label>
              <Input type="time" className="mt-1 h-9 text-sm" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Reason</Label>
              <textarea className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500" rows={2}
                value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm" onClick={() => setShowApply(false)}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── SECTION: WFH ─────────────────────────────────────────────────────────────

const WFHSection = () => {
  const [showApply, setShowApply] = useState(false);
  const wfhHistory = [
    { id: 'W1', from: '2026-04-14', to: '2026-04-14', days: 1, reason: 'Home repairs', status: 'Approved' as LeaveStatus },
    { id: 'W2', from: '2026-04-07', to: '2026-04-08', days: 2, reason: 'Family health matter', status: 'Approved' as LeaveStatus },
    { id: 'W3', from: '2026-05-09', to: '2026-05-09', days: 1, reason: 'Online coordination work', status: 'Pending' as LeaveStatus },
  ];
  const usedThisMonth = 1;
  const monthlyCapWFH = 4;

  return (
    <div className="space-y-5">
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex gap-3">
        <Info className="h-4 w-4 text-cyan-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-cyan-800">WFH is not a leave type</p>
          <p className="text-xs text-cyan-600 mt-0.5">Work-from-Home is a distinct attendance mode. No leave balance is consumed. Attendance is marked as PRESENT-REMOTE. Full salary is maintained.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <KPICard label="Used This Month" value={`${usedThisMonth}/${monthlyCapWFH}`} sub="Monthly WFH cap" color="text-cyan-600" icon={Building2} />
        <KPICard label="Total This Year" value={3} sub="WFH days taken" color="text-blue-600" icon={CalendarDays} />
        <KPICard label="Remaining Cap" value={monthlyCapWFH - usedThisMonth} sub="May 2026" color="text-emerald-600" icon={CheckCircle2} />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">WFH History</h3>
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white h-7 text-xs" onClick={() => setShowApply(true)}>
          <Plus className="h-3 w-3 mr-1" />Apply WFH
        </Button>
      </div>

      <div className="space-y-2">
        {wfhHistory.map(w => (
          <Card key={w.id} className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg"><Building2 className="h-4 w-4 text-cyan-600" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Work from Home — {w.days} day{w.days > 1 ? 's' : ''}</p>
                <p className="text-xs text-slate-500">{w.from}{w.days > 1 ? ` → ${w.to}` : ''} · {w.reason}</p>
              </div>
              <StatusBadge status={w.status} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Apply Work from Home</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs font-semibold">From</Label><Input type="date" className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs font-semibold">To</Label><Input type="date" className="mt-1 h-9 text-sm" /></div>
            </div>
            <div><Label className="text-xs font-semibold">Reason</Label>
              <textarea className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Why WFH?" />
            </div>
            <div><Label className="text-xs font-semibold">Work Plan (optional)</Label>
              <textarea className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Tasks planned for WFH day..." />
            </div>
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-9 text-sm" onClick={() => setShowApply(false)}>Submit WFH Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── SECTION: POLICY ENGINE ────────────────────────────────────────────────────

const PolicyEngineSection = () => {
  const [selected, setSelected] = useState<LeaveTypeConfig>(LEAVE_TYPES[0]);
  const [edited, setEdited] = useState<LeaveTypeConfig>(LEAVE_TYPES[0]);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
        <Shield className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700"><strong>HR Admin only.</strong> Policy rule changes take effect from the next application cycle. All changes are audit-logged.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leave Type List */}
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Leave Types</p>
          {LEAVE_TYPES.map(lt => (
            <button key={lt.id} onClick={() => { setSelected(lt); setEdited({ ...lt }); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${selected.id === lt.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}>
              <span className="text-base">{lt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{lt.name}</p>
                <p className={`text-xs ${selected.id === lt.id ? 'text-blue-200' : 'text-slate-400'}`}>{lt.code}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${lt.active ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            </button>
          ))}
        </div>

        {/* Rule Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selected.icon}</span>
              <h3 className="text-sm font-bold text-slate-800">{selected.name} — Policy Rules</h3>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={edited.active} onCheckedChange={v => setEdited(e => ({ ...e, active: v }))} />
              <span className="text-xs text-slate-500">{edited.active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Teaching Perm. (days/yr)', key: 'teachingPerm', type: 'number' },
              { label: 'Non-Teaching Perm. (days/yr)', key: 'nonTeachingPerm', type: 'number' },
              { label: 'Advance Notice (days)', key: 'advanceNoticeDays', type: 'number' },
              { label: 'Max Consecutive (days)', key: 'maxConsecutive', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <Label className="text-xs font-semibold text-slate-700">{f.label}</Label>
                <Input type={f.type} className="mt-1 h-8 text-sm" value={(edited as any)[f.key] ?? ''} onChange={e => setEdited(v => ({ ...v, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Sandwich Mode</Label>
              <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={edited.sandwichMode} onChange={e => setEdited(v => ({ ...v, sandwichMode: e.target.value as SandwichMode }))}>
                {(['ALLOW', 'DEDUCT', 'ONE_SIDE_ONLY', 'BLOCK'] as SandwichMode[]).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Accrual Method</Label>
              <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={edited.accrualMethod} onChange={e => setEdited(v => ({ ...v, accrualMethod: e.target.value as AccrualMethod }))}>
                {(['YEARLY_BULK', 'MONTHLY', 'SEMESTER', 'EARNED_DAYS'] as AccrualMethod[]).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg">
              <Switch checked={edited.halfDayAllowed} onCheckedChange={v => setEdited(e => ({ ...e, halfDayAllowed: v }))} />
              <span className="text-xs text-slate-600">Half Day</span>
            </div>
            <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg">
              <Switch checked={edited.docTriggerDays !== null} onCheckedChange={v => setEdited(e => ({ ...e, docTriggerDays: v ? 3 : null }))} />
              <span className="text-xs text-slate-600">Doc Required</span>
            </div>
            <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg">
              <Switch checked={edited.carryForwardCap !== 0} onCheckedChange={v => setEdited(e => ({ ...e, carryForwardCap: v ? 10 : 0 }))} />
              <span className="text-xs text-slate-600">Carry Forward</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs" onClick={handleSave}>
              {saved ? <><Check className="h-3 w-3 mr-1" />Saved!</> : 'Save Policy Rules'}
            </Button>
            <Button variant="outline" className="h-8 text-xs" onClick={() => setEdited({ ...selected })}>Discard Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SECTION: HOLIDAY CALENDAR ────────────────────────────────────────────────

const HolidayCalendarSection = () => {
  const [holidays, setHolidays] = useState<HolidayEntry[]>(HOLIDAYS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: '', name: '', type: 'NATIONAL' as HolidayEntry['type'] });

  const typeColor: Record<HolidayEntry['type'], string> = {
    NATIONAL: 'bg-blue-50 text-blue-700 border-blue-200',
    REGIONAL: 'bg-purple-50 text-purple-700 border-purple-200',
    INSTITUTION: 'bg-amber-50 text-amber-700 border-amber-200',
    SATURDAY: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Holiday Calendar — FY 2026-27</h3>
          <p className="text-xs text-slate-500">{holidays.length} holidays configured</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs" onClick={() => setShowAdd(true)}>
          <Plus className="h-3 w-3 mr-1" />Add Holiday
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {holidays.map(h => (
          <Card key={h.id} className="border-none shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="text-center bg-slate-50 rounded-lg p-2 w-12 flex-shrink-0">
                <p className="text-xs font-bold text-slate-500">{new Date(h.date).toLocaleString('default', { month: 'short' })}</p>
                <p className="text-lg font-black text-slate-800">{new Date(h.date).getDate()}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{h.name}</p>
                <span className={`inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded border ${typeColor[h.type]}`}>{h.type}</span>
              </div>
              <button onClick={() => setHolidays(prev => prev.filter(x => x.id !== h.id))} className="text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Holiday</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs font-semibold">Date</Label><Input type="date" className="mt-1 h-9 text-sm" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><Label className="text-xs font-semibold">Holiday Name</Label><Input className="mt-1 h-9 text-sm" placeholder="e.g. Republic Day" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div>
              <Label className="text-xs font-semibold">Type</Label>
              <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as HolidayEntry['type'] }))}>
                {(['NATIONAL', 'REGIONAL', 'INSTITUTION', 'SATURDAY'] as HolidayEntry['type'][]).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
              onClick={() => { if (form.date && form.name) { setHolidays(prev => [...prev, { id: `H${prev.length + 1}`, ...form }]); setShowAdd(false); setForm({ date: '', name: '', type: 'NATIONAL' }); } }}>
              Add Holiday
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── SECTION: BALANCE ALLOCATION ─────────────────────────────────────────────

const BalanceAllocationSection = () => {
  const [search, setSearch] = useState('');
  const [adjStaff, setAdjStaff] = useState<typeof MOCK_BALANCES[0] | null>(null);

  const filtered = MOCK_BALANCES.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Staff Leave Balances — FY 2026-27</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input className="pl-8 h-7 text-xs w-48" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs"><Upload className="h-3 w-3 mr-1" />Bulk Upload</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border border-slate-200 rounded-lg">
              {['Employee', 'Dept', 'Category', 'CL', 'SL', 'EL', 'CO', 'OED', 'OOD', 'LOP', 'VL', ''].map(h => (
                <th key={h} className="text-left px-3 py-2 font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(emp => (
              <tr key={emp.emp} className="hover:bg-slate-50">
                <td className="px-3 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{emp.name.split(' ').slice(0, 2).join(' ')}</td>
                <td className="px-3 py-2.5 text-slate-500">{emp.dept}</td>
                <td className="px-3 py-2.5"><Badge className="bg-slate-100 text-slate-600 border-none text-[10px]">{emp.cat}</Badge></td>
                {(['CL', 'SL', 'EL', 'CO', 'OED', 'OOD', 'LOP', 'VL'] as (keyof typeof emp)[]).map(k => (
                  <td key={k} className={`px-3 py-2.5 font-bold text-center ${k === 'LOP' && (emp as any)[k] > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                    {(emp as any)[k]}
                  </td>
                ))}
                <td className="px-3 py-2.5">
                  <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => setAdjStaff(emp)}>
                    <Edit className="h-2.5 w-2.5 mr-1" />Adjust
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!adjStaff} onOpenChange={() => setAdjStaff(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Manual Balance Adjustment</DialogTitle></DialogHeader>
          {adjStaff && (
            <div className="space-y-3 py-2">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-bold text-slate-800">{adjStaff.name}</p>
                <p className="text-xs text-slate-500">{adjStaff.dept} · {adjStaff.cat}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs font-semibold">Leave Type</Label>
                  <select className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none"><option>CL</option><option>SL</option><option>EL</option><option>LOP</option></select>
                </div>
                <div><Label className="text-xs font-semibold">New Balance</Label><Input type="number" className="mt-1 h-8 text-sm" placeholder="Days" /></div>
              </div>
              <div><Label className="text-xs font-semibold">Reason (mandatory)</Label>
                <textarea className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none outline-none" rows={2} placeholder="Reason for manual adjustment..." />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-sm" onClick={() => setAdjStaff(null)}>Save Adjustment</Button>
                <Button variant="outline" className="h-8 text-sm" onClick={() => setAdjStaff(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── SECTION: REPORTS ─────────────────────────────────────────────────────────

const ReportsSection = () => {
  const [activeReport, setActiveReport] = useState('balance');
  const reports = [
    { id: 'balance', label: 'Balance Report', icon: BarChart2 },
    { id: 'lop', label: 'LOP Report', icon: AlertCircle },
    { id: 'transactions', label: 'Transaction History', icon: History },
    { id: 'trends', label: 'YTD Trends', icon: TrendingUp },
  ];

  const lopData = MOCK_BALANCES.filter(b => b.LOP > 0).map(b => ({ name: b.name.split(' ').slice(-1)[0], lop: b.LOP, dept: b.dept }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {reports.map(r => (
          <button key={r.id} onClick={() => setActiveReport(r.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeReport === r.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <r.icon className="h-3 w-3" />{r.label}
          </button>
        ))}
        <Button variant="outline" size="sm" className="h-7 text-xs ml-auto"><Download className="h-3 w-3 mr-1" />Export CSV</Button>
      </div>

      {activeReport === 'balance' && (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 border border-slate-200">{['Staff', 'Dept', 'CL Balance', 'SL Balance', 'EL Balance', 'LOP YTD', 'VL Balance'].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_BALANCES.map(b => (
                  <tr key={b.emp} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-800">{b.name.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="px-3 py-2 text-slate-500">{b.dept}</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-600">{b.CL}</td>
                    <td className="px-3 py-2 text-center font-bold text-red-600">{b.SL}</td>
                    <td className="px-3 py-2 text-center font-bold text-amber-600">{b.EL}</td>
                    <td className={`px-3 py-2 text-center font-bold ${b.LOP > 0 ? 'text-orange-600' : 'text-slate-400'}`}>{b.LOP}</td>
                    <td className="px-3 py-2 text-center font-bold text-green-600">{b.VL}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'lop' && (
        <div className="space-y-3">
          {lopData.length === 0 && <div className="text-center py-10 text-slate-400"><CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-400" /><p className="text-sm">No LOP deductions this year</p></div>}
          {lopData.map(d => (
            <Card key={d.name} className="border-none shadow-sm ring-1 ring-orange-100 bg-orange-50/30">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg"><AlertCircle className="h-4 w-4 text-orange-600" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{d.name}</p>
                  <p className="text-xs text-slate-500">{d.dept}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-orange-600">{d.lop}d</p>
                  <p className="text-xs text-slate-400">LOP deducted</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeReport === 'transactions' && (
        <div className="divide-y divide-slate-100">
          {MOCK_APPLICATIONS.map(app => (
            <div key={app.id} className="py-2.5 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${app.status === 'Approved' ? 'bg-emerald-400' : app.status === 'Rejected' ? 'bg-red-400' : 'bg-amber-400'}`} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-700">{app.employee} — {app.type} ({app.days}d)</p>
                <p className="text-xs text-slate-400">{app.from} → {app.to} · Approver: {app.approver}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      )}

      {activeReport === 'trends' && (
        <Card className="border-none shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Leave Consumption by Month (FY 2026-27)</h3>
            <div className="space-y-2">
              {[{ month: 'April 2026', CL: 8, SL: 4, EL: 2, LOP: 1 }, { month: 'May 2026', CL: 5, SL: 5, EL: 0, LOP: 2 }].map(m => (
                <div key={m.month} className="space-y-1">
                  <p className="text-xs font-semibold text-slate-600">{m.month}</p>
                  <div className="flex gap-1 h-5">
                    {[['bg-blue-400', m.CL, 'CL'], ['bg-red-400', m.SL, 'SL'], ['bg-amber-400', m.EL, 'EL'], ['bg-orange-400', m.LOP, 'LOP']].map(([c, v, l]) => (
                      <div key={l as string} className={`${c} rounded flex items-center justify-center text-white text-[9px] font-bold`} style={{ width: `${Number(v) * 8}px`, minWidth: '24px' }}>{v}{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ─── SECTION: AUDIT LOG ────────────────────────────────────────────────────────

const AuditLogSection = () => {
  const [filter, setFilter] = useState<string>('ALL');
  const catColor: Record<string, string> = {
    APPLICATION: 'bg-blue-100 text-blue-700',
    APPROVAL: 'bg-emerald-100 text-emerald-700',
    CONFIG: 'bg-purple-100 text-purple-700',
    BALANCE: 'bg-amber-100 text-amber-700',
  };
  const filtered = filter === 'ALL' ? AUDIT_LOG : AUDIT_LOG.filter(e => e.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {['ALL', 'APPLICATION', 'APPROVAL', 'CONFIG', 'BALANCE'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto text-xs text-slate-400">
          <Lock className="h-3 w-3" />Immutable log — cannot be edited
        </div>
      </div>

      <div className="space-y-1.5">
        {filtered.map(entry => (
          <div key={entry.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
            <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 mt-0.5 ${catColor[entry.category]}`}>{entry.category.slice(0, 3)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700"><span className="text-blue-600">{entry.actor}</span> — {entry.action}</p>
              <p className="text-xs text-slate-500">{entry.target} · {entry.details}</p>
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0">{entry.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

type Section = 'dashboard' | 'calendar' | 'my-leaves' | 'approvals' | 'my-policy' | 'permissions' | 'wfh' | 'policy-engine' | 'holiday' | 'balance' | 'reports' | 'audit';

interface NavItem { id: Section; label: string; icon: any; roles: string[]; badge?: number; }

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN'] },
  { id: 'calendar', label: 'Leave Calendar', icon: CalendarDays, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN'] },
  { id: 'my-leaves', label: 'My Leaves', icon: CalendarCheck, roles: ['MANAGER', 'EMPLOYEE'] },
  { id: 'approvals', label: 'Approvals', icon: ListChecks, roles: ['HR_ADMIN', 'MANAGER', 'ADMIN'], badge: 5 },
  { id: 'my-policy', label: 'My Leave Policy', icon: BookOpen, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN'] },
  { id: 'permissions', label: 'Permissions', icon: Clock, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN'] },
  { id: 'wfh', label: 'Work from Home', icon: Building2, roles: ['HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN'] },
  { id: 'policy-engine', label: 'Policy Rules', icon: Settings, roles: ['HR_ADMIN', 'ADMIN'] },
  { id: 'holiday', label: 'Holiday Calendar', icon: Sun, roles: ['HR_ADMIN', 'ADMIN'] },
  { id: 'balance', label: 'Balance Allocation', icon: Users, roles: ['HR_ADMIN', 'ADMIN'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['HR_ADMIN', 'MANAGER', 'ADMIN'] },
  { id: 'audit', label: 'Audit Log', icon: ScrollText, roles: ['HR_ADMIN', 'ADMIN'] },
];

export default function AdvancedLeaveManagement() {
  const navigate = useNavigate();
  const { role } = usePersona();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const visibleNav = NAV_ITEMS.filter(n => n.roles.includes(role));

  const defaultIfNotVisible = () => {
    if (!visibleNav.find(n => n.id === activeSection)) {
      setActiveSection(visibleNav[0]?.id || 'dashboard');
    }
  };
  if (!visibleNav.find(n => n.id === activeSection)) defaultIfNotVisible();

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardSection />;
      case 'calendar': return <CalendarSection />;
      case 'my-leaves': return <MyLeavesSection />;
      case 'approvals': return <ApprovalsSection />;
      case 'my-policy': return <MyPolicySection />;
      case 'permissions': return <PermissionsSection />;
      case 'wfh': return <WFHSection />;
      case 'policy-engine': return <PolicyEngineSection />;
      case 'holiday': return <HolidayCalendarSection />;
      case 'balance': return <BalanceAllocationSection />;
      case 'reports': return <ReportsSection />;
      case 'audit': return <AuditLogSection />;
      default: return null;
    }
  };

  const current = NAV_ITEMS.find(n => n.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-slate-50/50" />
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => navigate('/')}>
                <Home className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md shadow-blue-500/20">
                <CalendarCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Leave Management</h1>
                <p className="text-slate-500 text-xs">Advanced Leave & Attendance Policy Engine</p>
              </div>
              <Badge className={`ml-2 text-[10px] border-none ${role === 'HR_ADMIN' ? 'bg-purple-100 text-purple-700' : role === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {role.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative">
                <Bell className="h-4 w-4 text-slate-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSidebarOpen(v => !v)}>
                <Layers className="h-3 w-3 mr-1" />{sidebarOpen ? 'Hide' : 'Show'} Nav
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-5 flex gap-5">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-0.5 sticky top-20">
              {visibleNav.map(item => (
                <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 text-sm ${activeSection === item.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  <item.icon className={`h-3.5 w-3.5 flex-shrink-0 ${activeSection === item.id ? 'text-white' : 'text-slate-400'}`} />
                  <span className="font-medium truncate">{item.label}</span>
                  {item.badge && <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeSection === item.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>{item.badge}</span>}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <SectionHeader icon={current?.icon || CalendarCheck} title={current?.label || ''} subtitle={`Leave Management · NHC · FY 2026-27`} />
          </div>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
