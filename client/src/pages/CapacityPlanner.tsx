import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Search, 
  Download, 
  Filter, 
  ArrowLeft,
  Settings,
  Zap,
  ShieldCheck,
  ClipboardList,
  History,
  FileText,
  UserPlus,
  ArrowUpRight,
  Monitor,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Clock,
  LayoutDashboard,
  Network,
  Info
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

import { WorkloadPlanner } from './capacity-planner/WorkloadPlanner';
import { PermanentVisitingAnalysis } from './capacity-planner/PermanentVisitingAnalysis';
import { RetirementRisk } from './capacity-planner/RetirementRisk';
import { BudgetHeadcount } from './capacity-planner/BudgetHeadcount';
import { GOIConsolidated } from './capacity-planner/GOIConsolidated';
import { NAACReadiness } from './capacity-planner/NAACReadiness';
import { PTRCompliance } from './capacity-planner/PTRCompliance';

// ─── DESIGN SYSTEM CONSTANTS ──────────────────────────────────────────────────
const DS = {
  primary: '#003f98',
  accent: '#fe9b01',
  bg: '#f8f9ff',
  cardBg: '#FFFFFF',
  border: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#64748b',
  critical: { text: '#dc2626', bg: '#fef2f2' },
  atRisk: { text: '#d97706', bg: '#fffbeb' },
  healthy: { text: '#475569', bg: '#f1f5f9' },
  neutral: { text: '#64748b', bg: '#f8fafc' },
  purple: { text: '#4f46e5', bg: '#eef2ff' },
  fontSans: '"DM Sans", sans-serif',
  fontMono: '"DM Mono", monospace',
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
type ScreenId = 'DASHBOARD' | 'CAPACITY_HUB' | 'HEALTH_HUB' | 'COMPLIANCE_HUB' | 'ACTION_HUB' | 'DEPT_GAPS';
type InstType = 'SCHOOL' | 'COLLEGE' | 'GOI';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const DEPT_DATA = [
  { id: '1', name: 'Physics', required: 8, permanent: 5, visiting: 1, effective: 6, gap: -2, status: 'CRITICAL' },
  { id: '2', name: 'Computer Science', required: 12, permanent: 10, visiting: 1, effective: 11, gap: -1, status: 'CRITICAL' },
  { id: '3', name: 'Mathematics', required: 10, permanent: 9, visiting: 1, effective: 10, gap: 0, status: 'AT_RISK' },
  { id: '4', name: 'Commerce', required: 6, permanent: 7, visiting: 0, effective: 7, gap: 1, status: 'HEALTHY' },
  { id: '5', name: 'English', required: 5, permanent: 5, visiting: 0, effective: 5, gap: 0, status: 'HEALTHY' },
  { id: '6', name: 'Chemistry', required: 7, permanent: 6, visiting: 2, effective: 8, gap: 1, status: 'HEALTHY' },
  { id: '7', name: 'Economics', required: 4, permanent: 3, visiting: 0, effective: 3, gap: -1, status: 'AT_RISK' },
  { id: '8', name: 'Management Studies', required: 8, permanent: 8, visiting: 1, effective: 9, gap: 1, status: 'HEALTHY' },
];

const AUDIT_LOG_DATA = [
  { timestamp: '2026-05-12 14:30:11', action: 'Gap Analysis Run', dept: 'All', actor: 'Sarah HR', before: '—', after: '3 critical gaps detected', note: 'System-wide periodic analysis' },
  { timestamp: '2026-05-11 09:15:44', action: 'Hiring Trigger', dept: 'Physics', actor: 'Sarah HR', before: 'Gap -2', after: '2 Requisitions Created', note: 'Linked to TA&O #REQ-452' },
  { timestamp: '2026-05-10 16:44:22', action: 'Ratio Config Updated', dept: 'All', actor: 'Principal', before: '1:35', after: '1:30', note: 'Aligned with new UGC norms' },
  { timestamp: '2026-05-09 11:20:05', action: 'Staff Redeployed', dept: 'Commerce → Physics', actor: 'Sarah HR', before: 'Physics -3', after: 'Physics -2', note: 'Dr. Rao cross-dept support' },
  { timestamp: '2026-05-08 10:05:33', action: 'Enrollment Updated', dept: 'B.Tech CS', actor: 'Registrar', before: '320 students', after: '365 students', note: 'Final year lateral entries' },
];

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, color }: { label: string; value: string | number; sub: string; accent: string; color: string }) => (
  <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:shadow-md transition-shadow" style={{ borderRadius: '12px' }}>
    <CardContent className="p-5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black leading-none tracking-tight mb-2" style={{ color, fontFamily: DS.fontSans }}>{value}</p>
      <p className="text-[10px] font-medium text-slate-500">{sub}</p>
    </CardContent>
  </Card>
);

const ScreenLayout = ({ children, title, subtitle, topbarActions }: { children: React.ReactNode; title: string; subtitle: string; topbarActions?: React.ReactNode }) => (
  <div className="flex-1 flex flex-col min-h-screen bg-[#f8f9ff]">
    {/* Topbar */}
    <div className="h-[52px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30" style={{ borderColor: DS.border }}>
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: DS.textSecondary }}>Capacity Planner</span>
        <ChevronRight className="h-3 w-3" style={{ color: DS.border }} />
        <span className="font-bold" style={{ color: DS.text }}>{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {topbarActions}
      </div>
    </div>
    
    {/* Page Content */}
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1" style={{ color: DS.text, fontFamily: DS.fontSans }}>{title}</h1>
        <p className="text-sm font-medium" style={{ color: DS.textSecondary }}>{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

const CapacityPlanner: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('DASHBOARD');
  const [instType, setInstType] = useState<InstType>('COLLEGE');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showReqModal, setShowReqModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState(1);
  const [semester, setSemester] = useState('CURRENT');
  const [showToast, setShowToast] = useState('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showRedeployModal, setShowRedeployModal] = useState(false);
  const [showRetirementConfig, setShowRetirementConfig] = useState(false);

  // ─── INNER HUB TAB STATES ───────────────────────────────────────────────────
  const [capacityTab, setCapacityTab] = useState('WORKLOAD');
  const [healthTab, setHealthTab] = useState('BUDGET');
  const [complianceTab, setComplianceTab] = useState('RATIOS');
  const [actionTab, setActionTab] = useState('SCENARIO');

  const handleToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };


  // ─── NAVIGATION HANDLERS ────────────────────────────────────────────────────
  const navigateTo = (screen: ScreenId) => setCurrentScreen(screen);

  // ─── RENDERERS ──────────────────────────────────────────────────────────────
  
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Institution Type Banner */}
      <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-[11px] font-bold ${instType === 'COLLEGE' ? 'bg-[#EEF2FF] text-blue-700' : 'bg-[#F5F3FF] text-purple-700'}`}>
        <Building2 className="h-4 w-4" />
        {instType === 'COLLEGE' 
          ? "Institution type: Degree College · UGC ratio norms applied · NAAC Criterion 2 active" 
          : "Institution type: K-12 School · CBSE PTR norms applied · Section-based planning active"}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="CRITICAL GAPS" value="3" sub="Departments below minimum requirement" accent="#993C1D" color="#993C1D" />
        <StatCard label="AT RISK" value="5" sub="Departments within 1 of minimum" accent="#854F0B" color="#854F0B" />
        <StatCard label="HEALTHY" value="12" sub="Meeting or exceeding requirement" accent="#0F6E56" color="#0F6E56" />
        <StatCard label="HIRING IN FLIGHT" value="4" sub="Open requisitions covering gaps" accent="#003f98" color="#003f98" />
      </div>

      {/* Alert Banner */}
      <div className="p-3 rounded-lg border flex items-center justify-between" style={{ backgroundColor: DS.atRisk.bg, borderColor: '#FAE0B2' }}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" style={{ color: DS.atRisk.text }} />
          <p className="text-xs font-semibold" style={{ color: DS.atRisk.text }}>
            Physics and Computer Science departments are below UGC minimum. Payroll headcount does not meet regulatory threshold. 3 requisitions recommended.
          </p>
        </div>
        <button className="text-xs font-bold underline" style={{ color: DS.atRisk.text }}>Review gaps →</button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Table */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-0">
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: DS.border }}>
                <h3 className="text-sm font-bold">Department-wise Capacity Status</h3>
                <div className="flex gap-2">
                  <select className="text-xs bg-white border rounded px-2 py-1 outline-none" style={{ borderColor: DS.border }}>
                    <option>All departments</option>
                  </select>
                  <select className="text-xs bg-white border rounded px-2 py-1 outline-none" style={{ borderColor: DS.border }}>
                    <option>All roles</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Req.</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Perm.</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Vis.</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Effective</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Gap</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: DS.border }}>
                    {DEPT_DATA.map((dept) => (
                      <tr key={dept.id} className="hover:bg-[#f8f9ff] cursor-pointer" onClick={() => { setSelectedDept(dept); navigateTo('DEPT_GAPS'); }}>
                        <td className="px-4 py-3 font-bold">{dept.name}</td>
                        <td className="px-4 py-3">{dept.required}</td>
                        <td className="px-4 py-3">{dept.permanent}</td>
                        <td className="px-4 py-3">{dept.visiting}</td>
                        <td className="px-4 py-3 font-semibold">{dept.effective}</td>
                        <td className={`px-4 py-3 font-bold text-center ${dept.gap < 0 ? 'text-[#993C1D]' : dept.gap > 0 ? 'text-[#0F6E56]' : ''}`}>
                          {dept.gap > 0 ? `+${dept.gap}` : dept.gap}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="text-[9px] font-bold uppercase px-2 py-0" 
                            style={{ 
                              backgroundColor: dept.status === 'CRITICAL' ? DS.critical.bg : dept.status === 'AT_RISK' ? DS.atRisk.bg : DS.healthy.bg,
                              color: dept.status === 'CRITICAL' ? DS.critical.text : dept.status === 'AT_RISK' ? DS.atRisk.text : DS.healthy.text,
                              border: 'none'
                            }}>
                            {dept.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {dept.gap < 0 ? (
                            <Button size="sm" className="h-7 text-[10px] font-bold px-3 text-white bg-[#003f98]" 
                              onClick={(e) => { e.stopPropagation(); setSelectedDept(dept); setShowReqModal(true); }}>
                              Trigger hire
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold px-3 border-slate-200">
                              View
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#F1EFE8] font-bold" style={{ color: DS.textSecondary }}>
                    <tr>
                      <td className="px-4 py-3" colSpan={1}>Total</td>
                      <td className="px-4 py-3">60</td>
                      <td className="px-4 py-3">53</td>
                      <td className="px-4 py-3">6</td>
                      <td className="px-4 py-3">59</td>
                      <td className="px-4 py-3 text-center">-1</td>
                      <td className="px-4 py-3" colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="mt-3 text-[10px]" style={{ color: DS.textSecondary }}>
            Required count calculated from enrolled students ÷ UGC ratio 1:30. Visiting faculty counted at 0.5 weight towards effective total.
          </p>
        </div>

        {/* Right Summaries */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-4">Overall Capacity Health</h3>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="stroke-[#F1EFE8]" fill="none" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="stroke-[#003f98]" fill="none" strokeWidth="3" strokeDasharray="78, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black" style={{ color: DS.primary }}>78</span>
                    <span className="text-[10px] font-bold" style={{ color: DS.textSecondary }}>/ 100</span>
                  </div>
                </div>
                <p className="mt-4 text-[11px] font-bold text-center" style={{ color: DS.textSecondary }}>Effective strength vs total requirement</p>
              </div>
              <div className="space-y-3 mt-4 border-t pt-4" style={{ borderColor: DS.border }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Permanent fill rate</span>
                  <span className="text-xs font-bold text-[#0F6E56]">88%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Visiting dependency</span>
                  <span className="text-xs font-bold text-[#854F0B]">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Gap severity score</span>
                  <span className="text-xs font-bold text-[#993C1D]">High</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-1">Staff in Probation</h3>
              <p className="text-[10px] text-slate-500 mb-4">Impacting confirmed headcount</p>
              <div className="space-y-3">
                {[
                  { label: 'Confirming this month', value: 3, color: DS.healthy.text, bg: DS.healthy.bg },
                  { label: 'At risk of extension', value: 2, color: DS.atRisk.text, bg: DS.atRisk.bg },
                  { label: 'Pending evaluation', value: 4, color: DS.neutral.text, bg: DS.neutral.bg }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <Badge className="font-bold border-none" style={{ backgroundColor: item.bg, color: item.color }}>{item.value} staff</Badge>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-[11px] font-bold text-[#003f98] border-t pt-3 flex items-center justify-center gap-1" style={{ borderColor: DS.border }}>
                View in Probation Hub <ArrowUpRight className="h-3 w-3" />
              </button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-1">Known Exits</h3>
              <p className="text-[10px] text-slate-500 mb-4">From Exit Management</p>
              <div className="space-y-3">
                {[
                  { label: 'Confirmed resignations', value: 2, color: DS.critical.text, bg: DS.critical.bg },
                  { label: 'Retirement due (90 days)', value: 1, color: DS.atRisk.text, bg: DS.atRisk.bg },
                  { label: 'Contract expiring', value: 3, color: DS.atRisk.text, bg: DS.atRisk.bg }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <Badge className="font-bold border-none" style={{ backgroundColor: item.bg, color: item.color }}>{item.value}</Badge>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-[11px] font-bold text-[#003f98] border-t pt-3 flex items-center justify-center gap-1" style={{ borderColor: DS.border }}>
                View in Exit Management <ArrowUpRight className="h-3 w-3" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderDeptGaps = () => (
    <div className="space-y-6">
      <button className="flex items-center gap-1 text-xs font-bold text-[#003f98] mb-2" onClick={() => navigateTo('DASHBOARD')}>
        <ArrowLeft className="h-3 w-3" /> All departments
      </button>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black" style={{ color: DS.text }}>Physics</h2>
          <p className="text-xs text-slate-500">Degree College · Odd Semester 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Required Faculty" value="8" sub="As per UGC norms" accent="#993C1D" color="#993C1D" />
        <StatCard label="Current Effective" value="6" sub="Weightage-adjusted headcount" accent="#993C1D" color="#993C1D" />
        <StatCard label="Gap" value="-2" sub="Immediate requirement" accent="#993C1D" color="#993C1D" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-0">
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: DS.border }}>
                <h3 className="text-sm font-bold">Current Faculty — Physics</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Designation</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Load</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: DS.border }}>
                  {[
                    { name: 'Dr. Ananya Prasad', role: 'Asst. Professor', type: 'Permanent', status: 'Confirmed', load: '18 hrs', since: 'Apr 2023' },
                    { name: 'Dr. Rajan Kumar', role: 'Assoc. Professor', type: 'Permanent', status: 'Confirmed', load: '18 hrs', since: 'Jan 2021' },
                    { name: 'Sneha Mehta', role: 'Asst. Professor', type: 'Permanent', status: 'Probation', load: '14 hrs', since: 'Oct 2024' },
                    { name: 'Vijay Nair', role: 'Lecturer', type: 'Permanent', status: 'At Risk', load: '12 hrs', since: 'Apr 2024' },
                    { name: 'Dr. Deepa Rao', role: 'Guest Faculty', type: 'Visiting', status: 'Contract', load: '10 hrs', since: 'Jul 2025' },
                  ].map((staff, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-bold">{staff.name}</td>
                      <td className="px-4 py-3">{staff.role}</td>
                      <td className="px-4 py-3">{staff.type}</td>
                      <td className="px-4 py-3">
                        <Badge className="text-[9px] font-bold px-2 py-0 border-none" 
                          style={{ 
                            backgroundColor: staff.status === 'Confirmed' ? DS.healthy.bg : staff.status === 'At Risk' ? DS.atRisk.bg : DS.neutral.bg,
                            color: staff.status === 'Confirmed' ? DS.healthy.text : staff.status === 'At Risk' ? DS.atRisk.text : DS.neutral.text
                          }}>
                          {staff.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-bold">{staff.load}</td>
                      <td className="px-4 py-3 text-slate-400">{staff.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 flex items-center gap-8 text-[11px] font-bold">
                <div className="flex gap-2"><span className="text-slate-400">Total load:</span> <span style={{ color: DS.text }}>72 hrs/week</span></div>
                <div className="flex gap-2"><span className="text-slate-400">Department capacity:</span> <span style={{ color: DS.text }}>90 hrs/week required</span></div>
                <div className="flex gap-2"><span className="text-slate-400">Load gap:</span> <span className="text-[#993C1D]">18 hrs/week uncovered</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-4">Recommended Actions</h3>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg hover:border-[#003f98] transition-colors" style={{ borderColor: DS.border }}>
                  <p className="text-xs font-bold mb-1">1. Trigger TA&O Requisition</p>
                  <p className="text-[10px] text-slate-500 mb-3">Open 2 Asst. Professor positions in Physics</p>
                  <Button size="sm" className="w-full h-8 text-[10px] font-bold bg-[#003f98] text-white" onClick={() => setShowReqModal(true)}>
                    Create Requisition
                  </Button>
                </div>
                <div className="p-3 border rounded-lg hover:border-[#003f98] transition-colors" style={{ borderColor: DS.border }}>
                  <p className="text-xs font-bold mb-1">2. Deploy Visiting Faculty</p>
                  <p className="text-[10px] text-slate-500 mb-3">Add 1 visiting faculty at 10 hrs/week to partially cover</p>
                  <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold border-slate-200">
                    Add Visiting
                  </Button>
                </div>
                <div className="p-3 border rounded-lg hover:border-[#003f98] transition-colors" style={{ borderColor: DS.border }}>
                  <p className="text-xs font-bold mb-1">3. Redistribute from Commerce</p>
                  <p className="text-[10px] text-slate-500 mb-3">Commerce has 1 surplus faculty eligible for cross-dept support</p>
                  <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold border-slate-200">
                    View Redeployment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSectionCoverage = () => (
    <div className="space-y-6">
      {instType === 'COLLEGE' && (
        <div className="p-3 bg-[#EEF2FF] border border-blue-100 rounded-lg text-xs font-semibold text-blue-700 flex items-center gap-2">
          <Info className="h-4 w-4" /> Section Coverage is available for School institutions only.
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <select className="text-xs bg-white border rounded px-3 py-1.5 outline-none min-w-[120px]" style={{ borderColor: DS.border }}><option>All Grades</option></select>
          <select className="text-xs bg-white border rounded px-3 py-1.5 outline-none min-w-[120px]" style={{ borderColor: DS.border }}><option>All Sections</option></select>
          <select className="text-xs bg-white border rounded px-3 py-1.5 outline-none min-w-[120px]" style={{ borderColor: DS.border }}><option>All Subjects</option></select>
        </div>
      </div>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Grade × Subject Coverage</h3>
            <div className="flex gap-4 text-[10px] font-bold mt-1">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#E1F5EE]" /><span style={{ color: DS.healthy.text }}>Covered</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#FAEEDA]" /><span style={{ color: DS.atRisk.text }}>At Load Limit</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#FAECE7]" /><span style={{ color: DS.critical.text }}>No Teacher Assigned</span></div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-left border-r" style={{ borderColor: DS.border }}>Grade & Section</th>
                  {['Math', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer'].map(sub => (
                    <th key={sub} className="px-4 py-3 font-bold uppercase tracking-wider">{sub}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '6A', m: 'G', s: 'G', e: 'G', ss: 'G', h: 'G', c: 'G' },
                  { id: '6B', m: 'G', s: 'G', e: 'G', ss: 'G', h: 'G', c: 'G' },
                  { id: '7A', m: 'G', s: 'A', e: 'G', ss: 'G', h: 'R', c: 'G' },
                  { id: '7B', m: 'A', s: 'G', e: 'G', ss: 'G', h: 'R', c: 'G' },
                  { id: '8A', m: 'R', s: 'G', e: 'G', ss: 'A', h: 'G', c: 'G' },
                  { id: '8B', m: 'R', s: 'G', e: 'R', ss: 'G', h: 'G', c: 'G' },
                  { id: '9A', m: 'G', s: 'G', e: 'G', ss: 'G', h: 'G', c: 'A' },
                  { id: '9B', m: 'G', s: 'G', e: 'G', ss: 'G', h: 'G', c: 'G' },
                ].map((row) => (
                  <tr key={row.id} className="border-b" style={{ borderColor: DS.border }}>
                    <td className="px-4 py-4 font-bold text-left border-r bg-slate-50/50" style={{ borderColor: DS.border }}>Grade {row.id}</td>
                    {[row.m, row.s, row.e, row.ss, row.h, row.c].map((status, idx) => (
                      <td key={idx} className="p-1">
                        <div className={`h-10 flex items-center justify-center rounded-md border border-white/20 cursor-pointer hover:opacity-80 transition-opacity ${
                          status === 'G' ? 'bg-[#E1F5EE] text-[#0F6E56]' : status === 'A' ? 'bg-[#FAEEDA] text-[#854F0B]' : 'bg-[#FAECE7] text-[#993C1D]'
                        }`}>
                          <span className="font-black text-[12px]">{status === 'G' ? '✓' : status === 'A' ? '⚠' : '✗'}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">3 critical gaps · 4 at load limit · 42 fully covered</span>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-slate-200">Export for Board Submission</Button>
              <Button size="sm" className="h-8 text-[11px] font-bold bg-[#003f98] text-white">Trigger Hire for Gaps</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-sm overflow-hidden" style={{ borderRadius: '14px' }}>
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="stroke-[#F1EFE8]" fill="none" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="stroke-[#854F0B]" fill="none" strokeWidth="3" strokeDasharray="72, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#854F0B]">72%</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black mb-1" style={{ color: DS.text }}>Overall Regulatory Compliance Score</h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">Based on current effective headcount vs UGC/CBSE norms</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-[#E1F5EE] px-3 py-1.5 rounded-full border border-[#C6EFDE]">
                <span className="text-xs font-bold text-[#0F6E56]">UGC Compliant: 14 depts</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAECE7] px-3 py-1.5 rounded-full border border-[#F5D5CB]">
                <span className="text-xs font-bold text-[#993C1D]">Non-Compliant: 2 depts</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAEEDA] px-3 py-1.5 rounded-full border border-[#F7E1C3]">
                <span className="text-xs font-bold text-[#854F0B]">At Threshold: 4 depts</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-0">
              <div className="p-4 border-b" style={{ borderColor: DS.border }}>
                <h3 className="text-sm font-bold">UGC Ratio Compliance — Department Wise</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Enrolled</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Required (1:30)</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Effective</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Compliant?</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: DS.border }}>
                  {DEPT_DATA.slice(0, 6).map((dept, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-bold">{dept.name}</td>
                      <td className="px-4 py-3 text-center">{dept.required * 30 - Math.floor(Math.random() * 20)}</td>
                      <td className="px-4 py-3 text-center font-bold">{dept.required}</td>
                      <td className="px-4 py-3 text-center font-bold">{dept.effective}</td>
                      <td className="px-4 py-3">
                        <Badge className="text-[9px] font-bold border-none" style={{ 
                          backgroundColor: dept.effective >= dept.required ? DS.healthy.bg : DS.critical.bg,
                          color: dept.effective >= dept.required ? DS.healthy.text : DS.critical.text
                        }}>
                          {dept.effective >= dept.required ? 'YES' : 'NO'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm h-full" style={{ borderRadius: '14px' }}>
            <CardContent className="p-4 flex flex-col h-full">
              <h3 className="text-sm font-bold mb-4">NAAC Criterion 2 — Faculty Adequacy</h3>
              <div className="space-y-6 flex-1">
                {[
                  { label: 'Faculty with PhD', value: '68%', status: 'HEALTHY', benchmark: '>60%' },
                  { label: 'Permanent vs Visiting ratio', value: '82%', status: 'HEALTHY', benchmark: '>80%' },
                  { label: 'Faculty with 10+ yrs experience', value: '44%', status: 'AT_RISK', benchmark: '>50%' },
                  { label: 'Faculty adequacy score', value: '3.2 / 4', status: 'AT_RISK', benchmark: 'Target 4' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">{item.label}</span>
                      <span style={{ color: item.status === 'HEALTHY' ? DS.healthy.text : DS.atRisk.text }}>{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ 
                        width: item.value.includes('%') ? item.value : '80%',
                        backgroundColor: item.status === 'HEALTHY' ? DS.healthy.text : DS.atRisk.text 
                      }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">Benchmark: {item.benchmark}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t text-[9px] font-bold text-slate-300" style={{ borderColor: DS.border }}>
                Data auto-derived from Staff Profiles and Payroll.<br />Last synced: Today 09:14 AM
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderScenarioPlanner = () => (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[700px]">
      {/* Left List */}
      <div className="lg:col-span-3 space-y-4 flex flex-col">
        <Card className="border-none shadow-sm flex-1" style={{ borderRadius: '14px' }}>
          <CardContent className="p-0 flex flex-col h-full">
            <div className="p-4 border-b" style={{ borderColor: DS.border }}><h3 className="text-sm font-bold">Saved Scenarios</h3></div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {[
                { id: 1, name: 'New Campus — Whitefield Jan 2027', status: 'DRAFT', date: 'May 12' },
                { id: 2, name: 'Enrollment Growth 20%', status: 'SAVED', date: 'May 10' },
                { id: 3, name: '3 Resignations — Physics Q2', status: 'SAVED', date: 'May 08' },
              ].map((s) => (
                <div key={s.id} onClick={() => setActiveScenario(s.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${activeScenario === s.id ? 'border-[#003f98] bg-[#EEF2FF]' : 'border-transparent hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400">{s.date}</span>
                    <Badge className="text-[8px] font-black border-none" 
                      style={{ backgroundColor: s.status === 'DRAFT' ? DS.neutral.bg : DS.healthy.bg, color: s.status === 'DRAFT' ? DS.neutral.text : DS.healthy.text }}>
                      {s.status}
                    </Badge>
                  </div>
                  <p className="text-xs font-bold leading-snug" style={{ color: DS.text }}>{s.name}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex flex-col gap-2" style={{ borderColor: DS.border }}>
              <Button variant="outline" className="w-full h-9 text-xs font-bold border-[#003f98] text-[#003f98]"><Plus className="h-3 w-3 mr-1" /> New Scenario</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-7 text-[9px] font-bold border-slate-200">New Campus</Button>
                <Button variant="outline" className="flex-1 h-7 text-[9px] font-bold border-slate-200">Enrollment</Button>
              </div>
              <Button variant="secondary" className="w-full h-9 text-xs font-bold bg-[#EEF2FF] text-[#003f98] hover:bg-[#E0E7FF] mt-2" onClick={() => setShowCompareModal(true)}>Compare Scenarios</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Detail */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
          <CardContent className="p-6">
            <h3 className="text-sm font-bold mb-4">Scenario Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected enrollment</Label>
                  <Input defaultValue="800 students" className="h-9 text-xs font-bold mt-1" />
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Regulatory framework</Label>
                  <select className="w-full h-9 text-xs font-bold bg-white border rounded-md px-3 mt-1 outline-none"><option>UGC 1:30 ratio</option></select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Programme mix</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['BBA', 'BCA', 'BCom'].map(t => <Badge key={t} className="bg-slate-100 text-slate-600 border-none font-bold text-[10px]">{t} ✕</Badge>)}
                    <button className="text-[10px] font-bold text-[#003f98]">+ Add</button>
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus opening date</Label>
                  <Input type="date" defaultValue="2027-01-15" className="h-9 text-xs font-bold mt-1" />
                </div>
              </div>
            </div>
            <div className="mt-6 p-3 bg-[#EEF2FF] rounded-lg border border-blue-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700">Redeployable staff available from surplus depts:</span>
              <span className="text-xs font-black text-blue-700">4 staff</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
          <CardContent className="p-6">
            <h3 className="text-sm font-bold mb-4">Computed Staffing Requirement</h3>
            <div className="space-y-3">
              {['BBA: 9 faculty required', 'BCA: 9 faculty required', 'BCom: 8 faculty required'].map((text, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-medium py-1 border-b" style={{ borderColor: DS.border }}>
                  <span>{text.split(': ')[0]}</span>
                  <span className="font-bold">{text.split(': ')[1]}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 text-xs font-bold"><span>Total Required Dec 2026</span><span className="text-lg">26</span></div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400"><span>Minus redeployable</span><span>-4</span></div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t text-sm font-black" style={{ color: DS.primary, borderColor: DS.border }}>
                <span>Net new hires required</span>
                <span className="text-3xl">22</span>
              </div>
            </div>

            <div className="mt-4 p-4 border rounded-xl bg-slate-50" style={{ borderColor: DS.border }}>
              <h4 className="text-xs font-bold mb-3">Estimated Annual Cost Impact</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Average cost per faculty</span><span className="font-bold">₹8.5L / year</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Net new hires</span><span className="font-bold">22</span></div>
                <div className="flex justify-between pt-2 border-t font-black"><span className="text-slate-800">Estimated annual addition</span><span className="text-[#993C1D]">₹1.87 Cr</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-slate-400">One-time recruitment cost (est.)</span><span className="text-slate-400 font-bold">₹22L</span></div>
              </div>
              <p className="text-[9px] text-slate-400 mt-3 text-center">Cost estimates are configurable. Update in Configure ratios → Cost parameters.</p>
            </div>

            <div className="mt-6 p-4 bg-[#EEEDFE] rounded-lg flex flex-col gap-1 border border-[#DEDCFC]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estimated Hiring Timeline</p>
              <p className="text-xs font-bold text-slate-800">To hire 22 faculty by Dec 2026, TA&O pipeline must open by <span className="text-[#003f98]">Aug 2026</span>.</p>
              <p className="text-[10px] font-medium text-slate-400">That is 3 months from today.</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 h-10 text-xs font-bold bg-[#003f98] text-white">Create Hiring Plan in TA&O</Button>
              <Button variant="outline" className="flex-1 h-10 text-xs font-bold border-slate-200">Assign from Existing Campuses</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderHiringTriggers = () => (
    <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
      <CardContent className="p-0">
        <div className="p-4 border-b" style={{ borderColor: DS.border }}><h3 className="text-sm font-bold">Active and Recommended Triggers</h3></div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Gap</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Recommended Role</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: DS.border }}>
            {[
              { dept: 'Physics', gap: -2, role: 'Asst. Professor', status: 'OPEN', created: 'Apr 28 2026' },
              { dept: 'Computer Science', gap: -1, role: 'Asst. Professor', status: 'RECOMMENDED', created: '—' },
              { dept: 'Economics', gap: -1, role: 'Lecturer', status: 'RECOMMENDED', created: '—' },
              { dept: 'Hindi (Grade 7)', gap: '-2 sections', role: 'TGT Hindi', status: 'NOT_STARTED', created: '—' },
            ].map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-4 font-bold">{row.dept}</td>
                <td className="px-4 py-4 text-center font-bold text-[#993C1D]">{row.gap}</td>
                <td className="px-4 py-4 font-medium">{row.role}</td>
                <td className="px-4 py-4">
                  <Badge className="text-[9px] font-black border-none" style={{ 
                    backgroundColor: row.status === 'OPEN' ? DS.healthy.bg : row.status === 'RECOMMENDED' ? DS.atRisk.bg : DS.critical.bg,
                    color: row.status === 'OPEN' ? DS.healthy.text : row.status === 'RECOMMENDED' ? DS.atRisk.text : DS.critical.text
                  }}>
                    {row.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-slate-400 font-medium">{row.created}</td>
                <td className="px-4 py-4">
                  {row.status === 'OPEN' ? (
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200">View Requisition</Button>
                  ) : (
                    <Button size="sm" className="h-8 text-[10px] font-bold bg-[#003f98] text-white" onClick={() => { setSelectedDept({name: row.dept}); setShowReqModal(true); }}>Create Requisition</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400">
          Requisitions created here open directly in TA&O module. Capacity Planner auto-updates when positions are filled.
        </div>
      </CardContent>
    </Card>
  );

  const renderAuditLog = () => (
    <div className="space-y-4">
      <div className="p-3 bg-[#F5F3FF] border border-purple-100 rounded-lg text-xs font-bold text-[#534AB7] flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" /> All records in this log are immutable. No edits or deletions permitted.
      </div>
      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Actor</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Before</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">After</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">System Note</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: DS.border }}>
              {AUDIT_LOG_DATA.map((row, idx) => (
                <tr key={idx} className="font-medium hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4" style={{ fontFamily: DS.fontMono, color: DS.textSecondary }}>{row.timestamp}</td>
                  <td className="px-4 py-4 font-bold" style={{ color: DS.text }}>{row.action}</td>
                  <td className="px-4 py-4 font-bold">{row.dept}</td>
                  <td className="px-4 py-4">{row.actor}</td>
                  <td className="px-4 py-4">{row.before}</td>
                  <td className="px-4 py-4 font-bold" style={{ color: DS.primary }}>{row.after}</td>
                  <td className="px-4 py-4 text-slate-400 italic">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]" style={{ fontFamily: DS.fontSans }}>
      {/* Sidebar */}
      <div className="w-[232px] bg-[#003f98] flex flex-col sticky top-0 h-screen z-40 overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Network className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-black tracking-tight">Capacity Planner</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="px-3 text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 mt-4">Hubs</p>
          <button 
            onClick={() => navigateTo('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${currentScreen === 'DASHBOARD' ? 'bg-white text-[#003f98] shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard className="h-4 w-4" /> Overview Hub
          </button>
          <button 
            onClick={() => navigateTo('CAPACITY_HUB')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${currentScreen === 'CAPACITY_HUB' ? 'bg-white text-[#003f98] shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
            <Clock className="h-4 w-4" /> Capacity & Workload
          </button>
          <button 
            onClick={() => navigateTo('HEALTH_HUB')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${currentScreen === 'HEALTH_HUB' ? 'bg-white text-[#003f98] shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
            <Users className="h-4 w-4" /> Workforce Health
          </button>
          <button 
            onClick={() => navigateTo('COMPLIANCE_HUB')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${currentScreen === 'COMPLIANCE_HUB' ? 'bg-white text-[#003f98] shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
            <ShieldCheck className="h-4 w-4" /> Governance & Compliance
          </button>
          <button 
            onClick={() => navigateTo('ACTION_HUB')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${currentScreen === 'ACTION_HUB' ? 'bg-white text-[#003f98] shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
            <Zap className="h-4 w-4" /> Action Center
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Institution</p>
            <p className="text-[11px] font-bold text-white truncate">Garden City University</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-bold text-white/40">2026–27</span>
              <Badge className="bg-[#fe9b01] text-white border-none text-[8px] font-black px-1.5 py-0 h-4 cursor-pointer" onClick={() => setInstType(t => t === 'COLLEGE' ? 'SCHOOL' : t === 'SCHOOL' ? 'GOI' : 'COLLEGE')}>
                {instType}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Toast Notification */}
        {showToast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full text-xs font-bold shadow-xl animate-in fade-in slide-in-from-top-4 z-50 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#0F6E56]" />
            {showToast}
          </div>
        )}

        {currentScreen === 'DASHBOARD' && (
          <ScreenLayout 
            title="Capacity Overview" 
            subtitle={instType === 'COLLEGE' ? `Faculty strength vs regulatory requirements · ${semester === 'CURRENT' ? 'Odd Semester 2026' : 'Even Semester 2027'}` : `Teacher coverage vs section load · ${semester === 'CURRENT' ? 'Academic Year 2026–27' : 'Academic Year 2027–28'}`}
            topbarActions={<>
              <div className="mr-4 flex flex-col items-end">
                <div className="flex bg-slate-100 p-0.5 rounded-md">
                  <button onClick={() => { setSemester('CURRENT'); handleToast(`Capacity data updated for ${instType === 'SCHOOL' ? 'Academic Year 2026–27' : 'Odd Semester 2026'}`); }} className={`px-3 py-1 text-[10px] font-bold rounded ${semester === 'CURRENT' ? 'bg-white shadow-sm text-[#003f98]' : 'text-slate-500'}`}>
                    {instType === 'SCHOOL' ? 'Academic Year 2026–27' : 'Odd Semester 2026'}
                  </button>
                  <button onClick={() => { setSemester('NEXT'); handleToast(`Capacity data updated for ${instType === 'SCHOOL' ? 'Academic Year 2027–28' : 'Even Semester 2027'}`); }} className={`px-3 py-1 text-[10px] font-bold rounded ${semester === 'NEXT' ? 'bg-white shadow-sm text-[#003f98]' : 'text-slate-500'}`}>
                    {instType === 'SCHOOL' ? 'Academic Year 2027–28' : 'Even Semester 2027'}
                  </button>
                </div>
                <span className="text-[8px] font-medium text-slate-400 mt-0.5">Planning horizon: {instType === 'SCHOOL' ? 'Annual' : 'Semester-wise'}</span>
              </div>
              <Button variant="outline" className="h-8 text-[11px] font-bold border-slate-200" onClick={() => setShowConfigModal(true)}><Settings className="h-3 w-3 mr-1.5" /> Configure ratios</Button>
              <Button className="h-8 text-[11px] font-bold bg-gradient-to-br from-[#003f98] to-[#1a56be] text-white">Run gap analysis</Button>
            </>}
          >
            {instType === 'GOI' ? <GOIConsolidated handleToast={handleToast} /> : renderDashboard()}
          </ScreenLayout>
        )}

        {currentScreen === 'CAPACITY_HUB' && (
          <ScreenLayout title="Capacity & Workload" subtitle="Detailed breakdown of teaching requirements vs actual capacity">
            <div className="mb-6 flex gap-2 border-b border-slate-200 pb-px">
              <button onClick={() => setCapacityTab('WORKLOAD')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${capacityTab === 'WORKLOAD' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Workload Model</button>
              <button onClick={() => setCapacityTab('GAPS')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${capacityTab === 'GAPS' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Department Gaps (Ratios)</button>
              {instType === 'SCHOOL' && (
                <button onClick={() => setCapacityTab('SECTIONS')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${capacityTab === 'SECTIONS' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Section Coverage Map</button>
              )}
            </div>
            {capacityTab === 'WORKLOAD' && <WorkloadPlanner instType={instType === 'GOI' ? 'COLLEGE' : instType} />}
            {capacityTab === 'GAPS' && renderDeptGaps()}
            {capacityTab === 'SECTIONS' && renderSectionCoverage()}
          </ScreenLayout>
        )}

        {currentScreen === 'HEALTH_HUB' && (
          <ScreenLayout title="Workforce Health" subtitle="Budget, composition, and pipeline risks">
            <div className="mb-6 flex gap-2 border-b border-slate-200 pb-px">
              <button onClick={() => setHealthTab('BUDGET')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${healthTab === 'BUDGET' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Budget vs Actuals</button>
              <button onClick={() => setHealthTab('COMPOSITION')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${healthTab === 'COMPOSITION' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Permanent vs Visiting</button>
              <button onClick={() => setHealthTab('RETIREMENT')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${healthTab === 'RETIREMENT' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Succession Pipeline</button>
            </div>
            {healthTab === 'BUDGET' && <BudgetHeadcount />}
            {healthTab === 'COMPOSITION' && <PermanentVisitingAnalysis />}
            {healthTab === 'RETIREMENT' && (
              <div className="relative">
                <div className="absolute top-[-52px] right-0 z-10">
                  <Button variant="outline" className="h-8 text-[11px] font-bold border-slate-200" onClick={() => setShowRetirementConfig(true)}><Settings className="h-3 w-3 mr-1.5" /> Config Limits</Button>
                </div>
                <RetirementRisk />
              </div>
            )}
          </ScreenLayout>
        )}

        {currentScreen === 'COMPLIANCE_HUB' && (
          <ScreenLayout title="Governance & Compliance" subtitle="Regulatory readiness and ratio health">
            <div className="mb-6 flex gap-2 border-b border-slate-200 pb-px">
              <button onClick={() => setComplianceTab('RATIOS')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${complianceTab === 'RATIOS' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Basic Ratios (UGC/CBSE)</button>
              {instType !== 'SCHOOL' && (
                <button onClick={() => setComplianceTab('NAAC')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${complianceTab === 'NAAC' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>NAAC Readiness (Criterion 2)</button>
              )}
              {instType !== 'COLLEGE' && (
                <button onClick={() => setComplianceTab('PTR')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${complianceTab === 'PTR' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>PTR Report (CBSE)</button>
              )}
            </div>
            {complianceTab === 'RATIOS' && renderCompliance()}
            {complianceTab === 'NAAC' && <NAACReadiness instType={instType === 'GOI' ? 'COLLEGE' : instType} />}
            {complianceTab === 'PTR' && <PTRCompliance instType={instType === 'GOI' ? 'SCHOOL' : instType} />}
          </ScreenLayout>
        )}

        {currentScreen === 'ACTION_HUB' && (
          <ScreenLayout title="Action Center" subtitle="Future planning and historical audit">
            <div className="mb-6 flex gap-2 border-b border-slate-200 pb-px">
              <button onClick={() => setActionTab('SCENARIO')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${actionTab === 'SCENARIO' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Scenario Planner</button>
              <button onClick={() => setActionTab('TRIGGERS')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${actionTab === 'TRIGGERS' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Active Requisitions</button>
              <button onClick={() => setActionTab('AUDIT')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${actionTab === 'AUDIT' ? 'border-[#003f98] text-[#003f98]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Audit Log</button>
            </div>
            {actionTab === 'SCENARIO' && renderScenarioPlanner()}
            {actionTab === 'TRIGGERS' && renderHiringTriggers()}
            {actionTab === 'AUDIT' && renderAuditLog()}
          </ScreenLayout>
        )}
      </div>

      {/* Modals */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="max-w-md" style={{ borderRadius: '14px', fontFamily: DS.fontSans }}>
          <DialogHeader><DialogTitle className="text-base font-bold">Regulatory Ratio Configuration</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution type</Label>
                <Input value={instType === 'COLLEGE' ? 'Degree College' : 'K-12 School'} disabled className="h-9 text-xs font-bold bg-slate-50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regulatory framework</Label>
                <select className="w-full h-9 text-xs font-bold bg-white border rounded-md px-3 outline-none"><option>UGC</option><option>AICTE</option><option>CBSE</option></select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faculty to student ratio</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">1 :</span>
                  <Input defaultValue="30" className="h-9 text-xs font-bold" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max teaching load</Label>
                <Input defaultValue="18" className="h-9 text-xs font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visiting faculty weight</Label>
                <select className="w-full h-9 text-xs font-bold bg-white border rounded-md px-3 outline-none"><option>0.5</option><option>1.0</option><option>Exclude</option></select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Planning horizon</Label>
                <select className="w-full h-9 text-xs font-bold bg-white border rounded-md px-3 outline-none"><option>Semester-wise</option><option>Annual</option></select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 h-10 text-xs font-bold" onClick={() => setShowConfigModal(false)}>Cancel</Button>
              <Button className="flex-1 h-10 text-xs font-bold bg-[#003f98] text-white" onClick={() => setShowConfigModal(false)}>Save Configuration</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReqModal} onOpenChange={setShowReqModal}>
        <DialogContent className="max-w-md" style={{ borderRadius: '14px', fontFamily: DS.fontSans }}>
          <DialogHeader><DialogTitle className="text-base font-bold">Create TA&O Requisition — {selectedDept?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Position</Label>
                <Input defaultValue="Asst. Professor" className="h-9 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Number of positions</Label>
                <Input defaultValue={selectedDept?.gap ? Math.abs(selectedDept.gap) : 1} className="h-9 text-xs font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target join date</Label>
                <Input type="date" className="h-9 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</Label>
                <select className="w-full h-9 text-xs font-bold bg-white border rounded-md px-3 outline-none"><option>Critical</option><option>High</option><option>Normal</option></select>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linked Gap Reference</p>
              <p className="text-[11px] font-bold text-slate-600 mt-0.5">{selectedDept?.name} gap {selectedDept?.gap} · Capacity Planner · May 2026</p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 h-10 text-xs font-bold" onClick={() => setShowReqModal(false)}>Cancel</Button>
              <Button className="flex-1 h-10 text-xs font-bold bg-[#003f98] text-white" onClick={() => setShowReqModal(false)}>Create in TA&O</Button>
            </div>
            <p className="text-[9px] text-center font-medium text-slate-400">
              This will open a requisition in TA&O module. Capacity Planner will update automatically when positions are filled.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compare Scenarios Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-2xl" style={{ borderRadius: '14px', fontFamily: DS.fontSans }}>
          <DialogHeader><DialogTitle className="text-base font-bold">Scenario Comparison</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-500 mb-4">Select two scenarios to compare side by side</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select className="w-full h-10 text-sm font-bold bg-white border rounded-md px-3 outline-none"><option>New Campus — Whitefield Jan 2027</option></select>
              <select className="w-full h-10 text-sm font-bold bg-white border rounded-md px-3 outline-none"><option>Enrollment Growth 20%</option></select>
            </div>
            <table className="w-full text-left text-xs border">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-3 font-bold">Input / Metric</th>
                  <th className="p-3 font-bold border-l text-[#003f98]">Scenario A</th>
                  <th className="p-3 font-bold border-l text-[#fe9b01]">Scenario B</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { m: 'Expected Enrollment', a: '+800 (New)', b: '+1200 (Existing)' },
                  { m: 'Programmes', a: 'BBA, BCA, BCom', b: 'All UG' },
                  { m: 'Required Faculty', a: '26', b: '38' },
                  { m: 'Redeployable Staff', a: '4', b: '0' },
                  { m: 'Net New Hires', a: '22', b: '38' },
                  { m: 'Est. Annual Cost', a: '₹1.87 Cr', b: '₹3.23 Cr' },
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="p-3 font-bold text-slate-600">{r.m}</td>
                    <td className="p-3 border-l font-bold">{r.a}</td>
                    <td className="p-3 border-l font-bold">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 h-10 text-xs font-bold" onClick={() => setShowCompareModal(false)}>Cancel</Button>
              <Button className="flex-1 h-10 text-xs font-bold bg-[#003f98] text-white" onClick={() => { setShowCompareModal(false); handleToast('Scenario comparison exported as PDF'); }}>Export Comparison</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Retirement Config Modal */}
      <Dialog open={showRetirementConfig} onOpenChange={setShowRetirementConfig}>
        <DialogContent className="max-w-sm" style={{ borderRadius: '14px', fontFamily: DS.fontSans }}>
          <DialogHeader><DialogTitle className="text-base font-bold">Retirement Age Configuration</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default retirement age</Label>
              <Input defaultValue="60" type="number" className="h-9 text-xs font-bold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teaching staff retirement age</Label>
              <Input defaultValue="60" type="number" className="h-9 text-xs font-bold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Non-teaching staff retirement age</Label>
              <Input defaultValue="58" type="number" className="h-9 text-xs font-bold" />
            </div>
            <p className="text-[9px] text-slate-500 font-medium">Changes apply from next gap analysis run.</p>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 h-10 text-xs font-bold" onClick={() => setShowRetirementConfig(false)}>Cancel</Button>
              <Button className="flex-1 h-10 text-xs font-bold bg-[#003f98] text-white" onClick={() => setShowRetirementConfig(false)}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CapacityPlanner;
