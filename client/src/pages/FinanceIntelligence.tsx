import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import {
  TrendingUp, DollarSign, Users, AlertTriangle, CheckCircle2,
  Calendar, ArrowUpRight, Plus, HelpCircle, FileText, Send, Mail, Search, MessageSquare,
  Activity, ShieldCheck, ShieldAlert, LayoutDashboard, LayoutGrid, Info, Clock, Download,
  Coins, FileSpreadsheet, TrendingDown, Check, Zap, Eye, AlertCircle, Database
} from 'lucide-react';

// Status Badge tailored to high-end financial predictions
const StatusBadge = ({ type, text, tooltip }: { type: 'stable' | 'watch' | 'fragile' | 'good' | 'bad' | 'warning', text: string, tooltip?: string }) => {
  const styles = {
    stable: 'bg-teal-50 text-teal-700 border-teal-200',
    watch: 'bg-amber-50 text-amber-700 border-amber-200',
    fragile: 'bg-rose-50 text-rose-700 border-rose-200',
    good: 'bg-teal-50 text-teal-700 border-teal-200',
    bad: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`group relative px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border cursor-help inline-flex items-center gap-1 ${styles[type]}`}>
      {text}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[10px] rounded-md shadow-lg z-50 whitespace-normal text-center font-normal leading-tight">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </span>
  );
};

const MetricBadge = ({ value, type }: { value: string | number, type: 'neutral' | 'good' | 'bad' | 'warning' }) => {
  const styles = {
    neutral: 'bg-slate-100 text-slate-700',
    good: 'bg-teal-100 text-teal-800',
    bad: 'bg-rose-100 text-rose-800',
    warning: 'bg-amber-100 text-amber-800'
  };
  return (
    <span className={`px-2 py-0.5 rounded font-bold text-xs ${styles[type]}`}>{value}</span>
  );
};

const ColumnHeaderWithTooltip = ({ title, tooltip }: { title: string, tooltip: string }) => (
  <div className="flex items-center gap-1.5 group/header relative w-max">
    <span>{title}</span>
    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/header:block w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-md shadow-xl z-50 whitespace-normal text-center font-normal leading-relaxed normal-case tracking-normal font-sans border border-slate-700">
      {tooltip}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px border-4 border-transparent border-b-slate-900"></div>
    </div>
  </div>
);

export default function FinanceIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerData, setDrawerData] = useState<{ title: string, data: any } | null>(null);
  const [actionDrawer, setActionDrawer] = useState<{ title: string, type: string, data: any } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ title: string, type: string, data: any } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState('All Institutions');

  // Simulation states
  const [recoverySchemeDiscount, setRecoverySchemeDiscount] = useState(5); // 0-20% slider
  const [projectedFeeHike, setProjectedFeeHike] = useState(6); // -5% to 15% fee hike slider

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const processAction = (callback: () => void, toastMsg: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      callback();
      showToast(toastMsg);
    }, 800);
  };

  // Base Data
  const stats = {
    billed: 48200000,
    collected: 39800000,
    outstanding: 8400000,
    defaultersCount: 142,
    collectionRate: '82.5%',
    budgetUtilized: '68.4%'
  };

  // Defaulter List with Risk & Recovery Predictions
  const [defaulters, setDefaulters] = useState([
    { id: 'STD-2026-441', name: 'Aman Sethi', course: 'B.Tech CSE (Sem 6)', campus: 'East Campus', outstanding: 45000, agingDays: 95, category: '90+ Days', lastCommunication: 'SMS Sent (18 May)', status: 'Escalated', risk: 'fragile', prob: 25 },
    { id: 'STD-2026-302', name: 'Megha Sharma', course: 'MBA (Sem 4)', campus: 'Main Campus', outstanding: 35000, agingDays: 42, category: '60 Days', lastCommunication: 'Email Dispatched (14 May)', status: 'Notified', risk: 'watch', prob: 60 },
    { id: 'STD-2026-891', name: 'Rohan Verma', course: 'B.Sc Physics (Sem 2)', campus: 'North Campus', outstanding: 18000, agingDays: 14, category: '30 Days', lastCommunication: 'Auto-Alert Sent (20 May)', status: 'Notified', risk: 'stable', prob: 88 },
    { id: 'STD-2026-114', name: 'Ishita Sen', course: 'B.Tech ECE (Sem 8)', campus: 'Main Campus', outstanding: 62000, agingDays: 105, category: '90+ Days', lastCommunication: 'Call Logged (12 May)', status: 'Escalated', risk: 'fragile', prob: 15 },
    { id: 'STD-2026-562', name: 'Kunal Kapoor', course: 'B.Arch (Sem 6)', campus: 'East Campus', outstanding: 28000, agingDays: 35, category: '30 Days', lastCommunication: 'SMS Sent (15 May)', status: 'Notified', risk: 'watch', prob: 70 },
    { id: 'STD-2026-724', name: 'Tanya Goel', course: 'BA English (Sem 4)', campus: 'North Campus', outstanding: 12000, agingDays: 78, category: '90+ Days', lastCommunication: 'Letter Posted (02 May)', status: 'Escalated', risk: 'fragile', prob: 30 },
    { id: 'STD-2026-218', name: 'Vikram Roy', course: 'B.Tech Mechanical (Sem 4)', campus: 'East Campus', outstanding: 32000, agingDays: 55, category: '60 Days', lastCommunication: 'Email Dispatched (19 May)', status: 'Notified', risk: 'watch', prob: 55 },
    { id: 'STD-2026-609', name: 'Sneha Patel', course: 'M.Tech CSE (Sem 2)', campus: 'Main Campus', outstanding: 50000, agingDays: 22, category: '30 Days', lastCommunication: 'Auto-Alert Sent (21 May)', status: 'Notified', risk: 'stable', prob: 92 }
  ]);

  // Billing and Concession SLA Control Records
  const concessionSLA = [
    { name: 'Dr. Ramesh Kumar', dept: 'Physics', items: 14, approved: 9, pending: 3, breached: 2, avgDays: '1.2 days', rate: 78, status: 'stable' },
    { name: 'Dr. Sunita Sharma', dept: 'Computer Science', items: 25, approved: 23, pending: 2, breached: 0, avgDays: '0.4 days', rate: 96, status: 'stable' },
    { name: 'Prof. Ankit Desai', dept: 'Commerce', items: 30, approved: 18, pending: 8, breached: 4, avgDays: '3.1 days', rate: 60, status: 'watch' },
    { name: 'Dr. Meera Reddy', dept: 'English', items: 8, approved: 5, pending: 2, breached: 1, avgDays: '2.0 days', rate: 75, status: 'stable' },
    { name: 'Prof. Vivek Singh', dept: 'Maths', items: 18, approved: 10, pending: 5, breached: 3, avgDays: '4.5 days', rate: 55, status: 'fragile' }
  ];

  const principalWaiverSLAs = [
    { name: 'Dr. AP Singh', role: 'Principal Approval', requests: 18, approved: 12, breached: 6, avgDays: 5.4, status: 'bad' },
    { name: 'Mrs. V Manjula', role: 'HR Concessions', requests: 32, approved: 30, breached: 2, avgDays: 1.2, status: 'good' },
    { name: 'Mr. Surya Prakash', role: 'Refund Audits', requests: 14, approved: 11, breached: 3, avgDays: 3.5, status: 'warning' }
  ];

  const gracePeriodBreaches = [
    { student: 'Amit Mishra', course: 'B.Tech CSE', invoiceDate: '10 Feb 2026', graceEnd: '25 Feb 2026', penaltyWaived: 'Yes', reason: 'Principal Override', author: 'Dr. AP Singh' },
    { student: 'Neha Gupta', course: 'MBA', invoiceDate: '15 Jan 2026', graceEnd: '30 Jan 2026', penaltyWaived: 'Yes', reason: 'HOD Recommendation', author: 'Prof. Ankit Desai' },
    { student: 'Vikas Shah', course: 'B.Sc Chemistry', invoiceDate: '01 Feb 2026', graceEnd: '16 Feb 2026', penaltyWaived: 'No', reason: 'N/A - Direct Default', author: 'System' }
  ];

  // Statutory & Compliance Audit Discrepancies
  const auditDiscrepancies = [
    { detail: 'Hostel accommodation registers vs billing logs', campus: 'East Campus', mismatchCount: 12, value: 480000, risk: 'high', desc: '12 students booked in room allocation register but not invoiced' },
    { detail: 'Research grant expenditure variance mapping', campus: 'Main Campus', mismatchCount: 1, value: 1200000, risk: 'high', desc: 'UGC grant funding nearing expiration with 80% remaining unutilized' },
    { detail: 'Transport bus route list vs transport invoices', campus: 'North Campus', mismatchCount: 8, value: 96000, risk: 'watch', desc: '8 students listed on route sheets have no active transport fee billing' },
    { detail: 'TDS tax filing logs vs bank statutory transfer logs', campus: 'All Campuses', mismatchCount: 0, value: 0, risk: 'stable', desc: '100% matched compliance check for current financial quarter' }
  ];

  // Cross Campus Collection Efficiency & Profitability
  const campusFinancials = [
    { id: 'all', name: 'All Campuses', collections: 82.5, badDebtRisk: 1.8, leakageRate: 2.1, leakageValue: '18.4L', maturity: 'developing' },
    { id: 'c1', name: 'Campus 1 — Koramangala', collections: 91.2, badDebtRisk: 0.5, leakageRate: 0.8, leakageValue: '2.2L', maturity: 'strong' },
    { id: 'c2', name: 'Campus 2 — Whitefield', collections: 78.4, badDebtRisk: 1.4, leakageRate: 2.5, leakageValue: '6.4L', maturity: 'developing' },
    { id: 'c3', name: 'Campus 3 — Hebbal', collections: 65.1, badDebtRisk: 4.8, leakageRate: 4.5, leakageValue: '9.8L', maturity: 'weak' }
  ];

  // Dynamic calculations for predictions based on recovery scheme discount slider
  const predictedRecovery = Math.round(
    stats.outstanding * (0.35 + (recoverySchemeDiscount / 100) * 1.5)
  );
  const collectionProbDelta = Math.round(recoverySchemeDiscount * 1.8);
  const averageCollectionProb = Math.min(95, Math.round(48 + collectionProbDelta));

  // Dynamic calculations for fee hike vs retention simulator
  // Basic simulation model: Higher hike leads to high retention risk / student churn
  const baseRetention = 96.5;
  const retentionLoss = projectedFeeHike > 0 ? (projectedFeeHike * 0.9) : (projectedFeeHike * 0.2);
  const simulatedRetention = Math.max(70, Math.min(100, Number((baseRetention - retentionLoss).toFixed(1))));
  const simulatedRevenueDelta = Math.round(stats.billed * (projectedFeeHike / 100) * (simulatedRetention / 100));
  const totalSimulatedRevenue = stats.billed + simulatedRevenueDelta;

  const handleLaunchCampaign = (rec: any) => {
    setActionDrawer({
      title: rec.title,
      type: 'campaign',
      data: rec
    });
  };

  const handleSendReminder = (id: string, name: string) => {
    setDefaulters(prev =>
      prev.map(d =>
        d.id === id ? { ...d, lastCommunication: 'Reminder Dispatched (Just Now)', status: 'Notified' as const } : d
      )
    );
    showToast(`Urgent fee payment reminder dispatched to ${name}'s parents via SMS and Email.`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'continuity', label: 'Cash Flow Continuity', icon: Activity },
    { id: 'control', label: 'Billing SLA Control', icon: ShieldCheck },
    { id: 'reputation', label: 'Audit & Compliance', icon: ShieldAlert },
    { id: 'scale', label: 'Fiscal Scale & Simulation', icon: TrendingUp }
  ];

  const formatCurrency = (value: number) => {
    return '₹' + value.toLocaleString('en-IN');
  };

  const filteredDefaulters = defaulters.filter(d => {
    return d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.campus.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#000099]">Institutional Finance risk summary</h2>
          <p className="text-slate-500 mt-1">Monday Morning Executive Finance Overview: Predictive cash risk assessment</p>
        </div>
        <div className="md:text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Collection Stability Score</div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-lg font-bold text-amber-700">Moderate Risk Exposure</span>
          </div>
        </div>
      </div>

      {/* Critical System Warnings */}
      <div className="mb-8 space-y-3">
        <div className="bg-rose-600 rounded-xl p-4 text-white shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">Critical Finance Alert: Unutilized Research Funding Near Expiry</div>
              <div className="text-sm text-white/80 font-medium">UGC Nanotechnology Research Grant (₹1.2 Cr) has only 18% fund utilization. Statutory expiry in 90 days.</div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reputation')}
            className="px-4 py-2 bg-white text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors"
          >
            Audit Grant Details
          </button>
        </div>
      </div>

      {/* Hero Financial Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-5 border-l-4 border-l-rose-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('continuity')}>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500" /> Cash Flow Continuity</div>
          <div className="text-3xl font-bold text-rose-600 mb-1">{formatCurrency(stats.outstanding)}</div>
          <div className="text-xs text-slate-600 font-medium">Fee collection defaults at risk (142 defaulters)</div>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5 border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('control')}>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500" /> Billing SLA breaches</div>
          <div className="text-3xl font-bold text-amber-600 mb-1">13 pending</div>
          <div className="text-xs text-slate-600 font-medium">Delayed fee concessions and waiver approvals</div>
        </div>
        <div className="bg-white rounded-xl border border-teal-200 shadow-sm p-5 border-l-4 border-l-teal-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('reputation')}>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Database className="w-4 h-4 text-teal-500" /> Audit Reconciliation</div>
          <div className="text-3xl font-bold text-teal-600 mb-1">3 gaps</div>
          <div className="text-xs text-slate-600 font-medium">Hostel, transport registries vs fee invoice conflicts</div>
        </div>
        <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-5 border-l-4 border-l-rose-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('scale')}>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-rose-500" /> Scholarship Leakage</div>
          <div className="text-3xl font-bold text-rose-600 mb-1">₹18.4 Lakhs</div>
          <div className="text-xs text-slate-600 font-medium">Sub-optimal financial resource leakage at Hebbal campus</div>
        </div>
      </div>

      {/* Visual Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Comparison Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E2E0D8] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Cross-Campus Revenue Collections</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Billed vs. collected fee ledger status</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 py-0.5 px-2 text-[10px]">
              Compliance: {stats.collectionRate}
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Main Campus', Billed: 240, Collected: 210 },
                { name: 'East Campus', Billed: 150, Collected: 120 },
                { name: 'North Campus', Billed: 92, Collected: 68 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip formatter={(value) => [`₹${value} Lakhs`, '']} contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '6px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Billed" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Collected" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Open Financial Risks */}
        <div className="bg-white border border-[#E2E0D8] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6] flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Critical Financial Risks</h3>
            <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase">Immediate</span>
          </div>
          <div className="divide-y divide-[#E2E0D8] flex-1">
            <div className="p-4 hover:bg-slate-50 flex items-start justify-between gap-3 cursor-pointer group" onClick={() => setActiveTab('continuity')}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">90+ Days East Campus Defaulters</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">₹24 Lakhs fee collection overdue with default conversion signals.</div>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-slate-50 flex items-start justify-between gap-3 cursor-pointer group" onClick={() => setActiveTab('reputation')}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">Hostel Booking vs Billing Discrepancy</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">12 students currently allocated rooms with ₹4.8L unbilled.</div>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-slate-50 flex items-start justify-between gap-3 cursor-pointer group" onClick={() => setActiveTab('scale')}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">Scholarship Overuse Leakage (Hebbal)</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">Over-allocation exceeds budget thresholds by ₹9.8L.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <Button size="sm" className="w-full bg-[#000099] text-white hover:bg-blue-900" onClick={() => setActiveTab('scale')}>
              Launch Simulations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContinuity = () => (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#000099]">Fee Continuity & Cash Flow Predictor</h2>
          <p className="text-slate-500 mt-1">AI-driven cash flow forecasting and parent collection response probabilities</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Collection Probability Index</div>
          <div className="text-3xl font-bold text-teal-600">{averageCollectionProb}%</div>
        </div>
      </div>

      {/* Simulator / Predictor control panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              Fee Recovery Probability Predictor & Optimizer
            </h3>
            <span className="bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider py-0.5 px-2 rounded-full">AI Model active</span>
          </div>
          <p className="text-xs text-indigo-700 leading-normal mb-5">
            Adjust parent recovery schemes dynamically to model cash flow recovery against the outstanding balance of <strong>{formatCurrency(stats.outstanding)}</strong>.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-900">
                <span>Proposed Early Settlement Discount Plan:</span>
                <span className="text-indigo-600 font-extrabold">{recoverySchemeDiscount}% Discount</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={recoverySchemeDiscount}
                onChange={(e) => setRecoverySchemeDiscount(Number(e.target.value))}
                className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-indigo-500 font-medium">
                <span>0% (Standard outreach)</span>
                <span>20% (Aggressive Settlement)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 text-center">
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Original Outstanding</p>
                <p className="text-base font-black text-slate-800">{formatCurrency(stats.outstanding)}</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 text-center">
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Estimated Recovery</p>
                <p className="text-base font-black text-emerald-600">+{formatCurrency(predictedRecovery)}</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 text-center">
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Collection probability</p>
                <p className="text-base font-black text-indigo-600">{averageCollectionProb}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E0D8] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Collection Campaign Recommendations</h3>
            <p className="text-xs text-slate-500 leading-normal mb-4">Launch automated alert triggers based on predicted recovery likelihoods.</p>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between gap-2.5">
              <div>
                <h4 className="font-bold text-slate-800 text-[11px] leading-tight">East Campus 90+ Days SMS Reminder Campaign</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Forecasted to retrieve ₹8.2L in outstanding dues.</p>
              </div>
              <Button size="sm" className="w-full h-7 text-[10px] bg-slate-900 hover:bg-slate-800 text-white" onClick={() => handleLaunchCampaign({ title: 'East Campus 90+ Days SMS Campaign', target: 'East Campus', expected: '₹8.2L' })}>
                Deploy Broadcast
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Defaulter Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base text-slate-800">Fee Defaulters & Aging Register</CardTitle>
              <CardDescription className="text-xs">Predictive modeling metrics based on historical defaults & communication response logs</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-[11px] w-48 border-slate-200 rounded-md focus-visible:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="px-4 py-2.5 uppercase tracking-wider">Student ID</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider">Student Name</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider">Course / Stream</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider">Campus</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider">Outstanding</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider text-center">Delay</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider"><ColumnHeaderWithTooltip title="Collection Prob" tooltip="Predicted likelihood of parent clearing balance in response to next reminder" /></th>
                  <th className="px-4 py-2.5 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDefaulters.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400">No defaulters matching search criteria found.</td>
                  </tr>
                ) : (
                  filteredDefaulters.map((def) => (
                    <tr key={def.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-slate-900 mono">{def.id}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-900">{def.name}</td>
                      <td className="px-4 py-2.5 text-slate-600">{def.course}</td>
                      <td className="px-4 py-2.5 text-slate-500">{def.campus}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{formatCurrency(def.outstanding)}</td>
                      <td className="px-4 py-2.5 text-center font-medium text-slate-600">{def.agingDays} days</td>
                      <td className="px-4 py-2.5">
                        <MetricBadge value={`${Math.min(99, def.prob + (recoverySchemeDiscount > 0 ? collectionProbDelta : 0))}%`} type={def.prob >= 80 ? 'good' : def.prob <= 30 ? 'bad' : 'warning'} />
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge
                          type={def.risk as any}
                          text={def.risk.toUpperCase()}
                          tooltip={`System labels client risk status as ${def.risk} based on payment delay threshold`}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] py-0.5 px-2 border-slate-200 hover:bg-slate-50 text-slate-600"
                          onClick={() => setDrawerData({ title: `Student Financial Profile - ${def.name}`, data: def })}
                        >
                          Ledger
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 text-[10px] py-0.5 px-2 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleSendReminder(def.id, def.name)}
                        >
                          Send Alert
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderControl = () => (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#000099]">Billing Concession & Waiver Control</h2>
          <p className="text-slate-500 mt-1">Review approval speeds, pending scholarship reconciliations, and unauthorized waivers</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Approval SLA Compliance</div>
          <div className="text-3xl font-bold text-amber-600">72.4%</div>
        </div>
      </div>

      {/* Overview Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {principalWaiverSLAs.map((sla, i) => (
          <div key={i} className="bg-white border border-[#E2E0D8] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sla.role}</p>
                <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">{sla.name}</h4>
              </div>
              <Badge variant={sla.status === 'good' ? 'secondary' : 'destructive'} className="text-[9px]">
                {sla.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">Processed Items</span>
              <span className="font-bold text-slate-800">{sla.requests}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">SLA Breached Cases</span>
              <span className="font-bold text-rose-600">{sla.breached}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-slate-500">Avg. Turnaround Time</span>
              <span className="font-bold text-slate-800">{sla.avgDays} days</span>
            </div>
          </div>
        ))}
      </div>

      {/* Concession table */}
      <div className="bg-white rounded-xl border border-[#E2E0D8] overflow-hidden">
        <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
          <h3 className="font-bold text-slate-900">Faculty/HOD Waiver SLA Health</h3>
          <p className="text-xs text-slate-500 mt-1">Concession waiver recommendations logged by department heads</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8F8F6] border-b border-[#E2E0D8] text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">Department Head</th>
                <th className="px-6 py-4 text-center">Waivers Initiated</th>
                <th className="px-6 py-4 text-center">Approved</th>
                <th className="px-6 py-4 text-center">Pending</th>
                <th className="px-6 py-4 text-center">Breached SLA</th>
                <th className="px-6 py-4"><ColumnHeaderWithTooltip title="SLA Success Rate" tooltip="Percentage of waiver workflows completed within the standard 48-hour window" /></th>
                <th className="px-6 py-4">Avg Processing Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D8] text-slate-700">
              {concessionSLA.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{c.dept}</div>
                  </td>
                  <td className="px-6 py-4 text-center">{c.items}</td>
                  <td className="px-6 py-4 text-center">{c.approved}</td>
                  <td className="px-6 py-4 text-center">{c.pending}</td>
                  <td className="px-6 py-4 text-center font-bold text-rose-600">{c.breached}</td>
                  <td className="px-6 py-4">
                    <MetricBadge value={`${c.rate}%`} type={c.rate >= 80 ? 'good' : c.rate <= 60 ? 'bad' : 'warning'} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{c.avgDays}</td>
                  <td className="px-6 py-4">
                    <StatusBadge type={c.status as any} text={c.status.toUpperCase()} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-[#000099] text-[#000099]" onClick={() => setDrawerData({ title: `${c.dept} waiver list`, data: c })}>
                      Audit List
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Penalty Audit Logs */}
      <div className="bg-white rounded-xl border border-[#E2E0D8] p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Grace Period Penalty Overrides</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="px-4 py-2.5">Student</th>
                <th className="px-4 py-2.5">Course</th>
                <th className="px-4 py-2.5">Invoice Date</th>
                <th className="px-4 py-2.5">Grace End Date</th>
                <th className="px-4 py-2.5">Late Fee Waived</th>
                <th className="px-4 py-2.5">Waive Justification</th>
                <th className="px-4 py-2.5">Authorized By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {gracePeriodBreaches.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">{row.student}</td>
                  <td className="px-4 py-2.5">{row.course}</td>
                  <td className="px-4 py-2.5">{row.invoiceDate}</td>
                  <td className="px-4 py-2.5">{row.graceEnd}</td>
                  <td className="px-4 py-2.5 font-semibold text-rose-600">{row.penaltyWaived}</td>
                  <td className="px-4 py-2.5">{row.reason}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{row.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReputation = () => (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#000099]">Audit & Statutory Compliance</h2>
          <p className="text-slate-500 mt-1">Cross-referencing campus facility allocation logs against billing ledger accounts</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Financial Compliance Index</div>
          <div className="text-3xl font-bold text-[#000099]">96.8%</div>
        </div>
      </div>

      {/* Discrepancy details */}
      <div className="bg-white rounded-xl border border-[#E2E0D8] overflow-hidden">
        <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
          <h3 className="font-bold text-slate-900">Statutory Reconciliation Conflicts</h3>
          <p className="text-xs text-slate-500 mt-1">Unbilled services and potential revenue leakages detected by system comparisons</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8F8F6] border-b border-[#E2E0D8] text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">Reconciliation Target Area</th>
                <th className="px-6 py-4">Campus</th>
                <th className="px-6 py-4 text-center">Conflict Items</th>
                <th className="px-6 py-4">Revenue Exposure</th>
                <th className="px-6 py-4">Discrepancy Details</th>
                <th className="px-6 py-4">Risk Tier</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D8] text-slate-700">
              {auditDiscrepancies.map((audit, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{audit.detail}</td>
                  <td className="px-6 py-4">{audit.campus}</td>
                  <td className="px-6 py-4 text-center font-bold">{audit.mismatchCount}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">
                    {audit.value > 0 ? formatCurrency(audit.value) : '—'}
                  </td>
                  <td className="px-6 py-4 max-w-[280px] truncate text-slate-500 text-xs" title={audit.desc}>
                    {audit.desc}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge type={audit.risk as any} text={audit.risk.toUpperCase()} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {audit.value > 0 ? (
                      <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleLaunchCampaign({ title: 'Resolve audit discrepancy', ...audit })}>
                        Auto-Resolve
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold">Compliant</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderScale = () => (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#000099]">Fiscal Scale Readiness & Fee Simulator</h2>
          <p className="text-slate-500 mt-1">Simulate tuition increases, predict enrollment churn, and identify campus leakages</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Scale Readiness Score</div>
          <div className="text-3xl font-bold text-amber-600">developing</div>
        </div>
      </div>

      {/* Simulator Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Tuition Fee Hike & Churn Predictor Simulator
            </h3>
            <span className="bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider py-0.5 px-2 rounded-full">Predictive Modeling Active</span>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-emerald-900">
                <span>Proposed Annual Fee Hike Percent:</span>
                <span className="text-emerald-600 font-extrabold">{projectedFeeHike}% Increase</span>
              </div>
              <input
                type="range"
                min="-5"
                max="15"
                step="1"
                value={projectedFeeHike}
                onChange={(e) => setProjectedFeeHike(Number(e.target.value))}
                className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-emerald-500 font-medium">
                <span>-5% (Fee Relief)</span>
                <span>0% (Constant)</span>
                <span>15% (Max Increase)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 text-center">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Simulated Retention Rate</p>
                <p className="text-base font-black text-slate-800">{simulatedRetention}%</p>
                <p className="text-[9px] text-rose-500 font-semibold mt-0.5">-{retentionLoss.toFixed(1)}% predicted churn</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 text-center">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Simulated Total Billing</p>
                <p className="text-base font-black text-slate-800">{formatCurrency(totalSimulatedRevenue)}</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 text-center">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Billing Net Difference</p>
                <p className={`text-base font-black ${simulatedRevenueDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {simulatedRevenueDelta >= 0 ? '+' : ''}{formatCurrency(simulatedRevenueDelta)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leakage card */}
        <div className="bg-white border border-[#E2E0D8] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Scholarship Leakage Warning</h3>
            <p className="text-xs text-slate-500 leading-normal mb-4">
              Hebbal campus has registered leakage of <strong>₹9.8 Lakhs</strong> due to scholarship allocations breaching maximum regulatory caps by 15%.
            </p>
          </div>
          <Button size="sm" className="w-full bg-[#000099] text-white hover:bg-blue-900" onClick={() => showToast("Scholarship restriction policy updated for Hebbal Campus.")}>
            Enforce Scholarship Caps
          </Button>
        </div>
      </div>

      {/* Campus financials table */}
      <div className="bg-white rounded-xl border border-[#E2E0D8] overflow-hidden">
        <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
          <h3 className="font-bold text-slate-900">Campus Financial Maturity & Leakage Indices</h3>
          <p className="text-xs text-slate-500 mt-1">Cross-campus review of fee collections, estimated bad debts, and resource leakages</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8F8F6] border-b border-[#E2E0D8] text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">Campus Location</th>
                <th className="px-6 py-4">Collection Rate</th>
                <th className="px-6 py-4">Bad Debt Risk Probability</th>
                <th className="px-6 py-4">Resource Leakage Rate</th>
                <th className="px-6 py-4">Leakage Value (YTD)</th>
                <th className="px-6 py-4">Maturity Classification</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D8] text-slate-700">
              {campusFinancials.map((camp, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{camp.name}</td>
                  <td className="px-6 py-4">
                    <MetricBadge value={`${camp.collections}%`} type={camp.collections >= 90 ? 'good' : camp.collections <= 70 ? 'bad' : 'warning'} />
                  </td>
                  <td className="px-6 py-4 font-semibold">{camp.badDebtRisk}%</td>
                  <td className="px-6 py-4 font-semibold text-rose-600">{camp.leakageRate}%</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{camp.leakageValue}</td>
                  <td className="px-6 py-4">
                    <StatusBadge type={camp.maturity === 'strong' ? 'stable' : camp.maturity === 'developing' ? 'watch' : 'fragile'} text={camp.maturity.toUpperCase()} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-[#000099] text-[#000099]" onClick={() => setDrawerData({ title: `Campus Deep-Dive - ${camp.name}`, data: camp })}>
                      Financial Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      title="Finance Intelligence"
      description="AI-driven cash flow forecasting, payment SLA compliance, statutory audit readiness, and resource leakage predictions"
      icon={TrendingUp}
      showHome={true}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'continuity' && renderContinuity()}
      {activeTab === 'control' && renderControl()}
      {activeTab === 'reputation' && renderReputation()}
      {activeTab === 'scale' && renderScale()}

      {/* Action Dialog / Campaign Modal */}
      {actionDrawer && (
        <Dialog open={true} onOpenChange={() => setActionDrawer(null)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-lg p-5">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-blue-600" />
                Configure Bulk Concession Outreach
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">Launch automated alert triggers to target list</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campaign Target</Label>
                <p className="font-semibold text-slate-800 text-xs bg-slate-50 p-2 rounded border border-slate-200">{actionDrawer.title}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel Strategy</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border border-blue-200 bg-blue-50/50 rounded-lg flex flex-col items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-[9px] uppercase tracking-wider">SMS & Whatsapp Broadcast</span>
                  </div>
                  <div className="p-2 border border-slate-200 rounded-lg flex flex-col items-center gap-1">
                    <Mail className="w-4 h-4 text-slate-600" />
                    <span className="font-bold text-[9px] uppercase tracking-wider">Email Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" size="sm" onClick={() => setActionDrawer(null)} className="h-8 text-xs border-slate-200 text-slate-600">
                Cancel
              </Button>
              <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => processAction(() => setActionDrawer(null), "Broadcast outreach triggered successfully.")}>
                Initiate Broadcast
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Ledger Detail Modal */}
      {drawerData && (
        <Dialog open={true} onOpenChange={() => setDrawerData(null)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-lg p-5">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-sm font-bold text-slate-900">{drawerData.title}</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">Detailed financial metric registry audit logs</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div className="space-y-2 border border-slate-100 bg-slate-50 p-2.5 rounded">
                <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Entity Breakdown Summary</p>
                {Object.entries(drawerData.data).map(([k, v]: any) => (
                  <div key={k} className="flex justify-between py-1 border-b border-slate-100 last:border-b-0">
                    <span className="text-slate-600 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium text-slate-900">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" size="sm" onClick={() => setDrawerData(null)} className="h-8 text-xs border-slate-200 text-slate-600">
                Close Audit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}
