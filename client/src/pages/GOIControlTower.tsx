import React, { useState, useMemo } from 'react';
import {
  Building2, Users, IndianRupee, GraduationCap, Users2, AlertTriangle, ShieldCheck, 
  MapPin, Calendar, Clock, Layers, CheckCircle2, AlertCircle, 
  BrainCircuit, Heart, ChevronRight, XCircle, Package, Truck,
  BookCopy, Wrench, BedDouble, Target, Wallet, BarChart4, Receipt
} from 'lucide-react';
import Layout from '../components/Layout';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  ComposedChart
} from 'recharts';

// --- Design System ---
const DS = {
  primary: '#4f46e5', // Indigo 600
  secondary: '#f97316', // Orange 500
  success: '#10b981', 
  error: '#ef4444', 
  warning: '#f59e0b', 
  info: '#3b82f6',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  pink: '#ec4899',
  indigo: '#6366f1',
  text: '#1e293b',
  textLight: '#64748b',
};

// --- Seed Data Base ---
const CAMPUS_DATA = [
  { id: 'c1', name: 'NHCE', type: 'Engineering', students: 4500, staff: 420, collection: 88, compliance: 96, sentiment: 82, assets: 94, transport: 98, placements: 85, hostel: 95 },
  { id: 'c2', name: 'NHC Marathalli', type: 'Degree', students: 2100, staff: 180, collection: 92, compliance: 100, sentiment: 78, assets: 88, transport: 100, placements: 78, hostel: 82 },
  { id: 'c3', name: 'NHC Kasturinagar', type: 'Degree', students: 1800, staff: 150, collection: 85, compliance: 92, sentiment: 85, assets: 95, transport: 92, placements: 80, hostel: 90 },
  { id: 'c4', name: 'NHPUC Kasturinagar', type: 'PU', students: 1200, staff: 95, collection: 95, compliance: 100, sentiment: 88, assets: 98, transport: 95, placements: 95, hostel: 88 },
];

const COLORS = [DS.primary, DS.teal, DS.secondary, DS.purple];

const ALERTS = [
  { id: 1, type: 'error', module: 'Finance', message: 'NHCE: IT Infrastructure Budget exceeded by 12%', time: '30m ago', campus: 'NHCE' },
  { id: 2, type: 'error', module: 'Fee', message: 'NHC Kasturinagar: Fee collection deficit > 15% in B.Com', time: '1h ago', campus: 'NHC Kasturinagar' },
  { id: 3, type: 'warning', module: 'HRMS', message: 'NHPUC Kasturinagar: High attrition risk detected in Science faculty', time: '3h ago', campus: 'NHPUC Kasturinagar' },
  { id: 4, type: 'info', module: 'Compliance', message: 'NHC Marathalli: Affiliation Compliance audit due in 15 days', time: '5h ago', campus: 'NHC Marathalli' },
  { id: 5, type: 'error', module: 'HRMS', message: 'Group: Statutory PF payment overdue by 1 day', time: '1d ago', campus: 'All' },
  { id: 6, type: 'warning', module: 'Transport', message: 'NHCE: Route 4 Bus maintenance delayed', time: '2d ago', campus: 'NHCE' },
  { id: 7, type: 'info', module: 'Placements', message: 'Group: 4 Fortune 500 companies scheduled for next week', time: '5h ago', campus: 'All' },
];

// Data Generators to make dashboards dynamic based on Campus
const generateTrendData = (campus: string, baseMultiplier: number) => {
  const isAll = campus === 'All';
  const m = isAll ? 4 : baseMultiplier;
  
  return [
    { month: 'Apr', due: 30 * m, collected: 10 * m * (isAll ? 1 : Math.random() * 0.4 + 0.8) },
    { month: 'May', due: 30 * m, collected: 16 * m * (isAll ? 1 : Math.random() * 0.4 + 0.8) },
    { month: 'Jun', due: 30 * m, collected: 21 * m * (isAll ? 1 : Math.random() * 0.4 + 0.8) },
    { month: 'Jul', due: 30 * m, collected: 24 * m * (isAll ? 1 : Math.random() * 0.4 + 0.8) },
    { month: 'Aug', due: 30 * m, collected: 26 * m * (isAll ? 1 : Math.random() * 0.4 + 0.8) },
    { month: 'Sep', due: 30 * m, collected: 28 * m * (isAll ? 1 : Math.random() * 0.4 + 0.8) },
  ].map(d => ({ ...d, collected: Math.min(d.due, Math.max(0, Math.round(d.collected))) }));
};

const generateBudget = (campus: string, m: number) => {
  const isAll = campus === 'All';
  const base = isAll ? 4 : m;
  return [
    { category: 'IT & Infra', allocated: 120 * base, consumed: (isAll ? 110 : 80 + Math.random() * 50) * base },
    { category: 'Academics', allocated: 200 * base, consumed: (isAll ? 170 : 150 + Math.random() * 40) * base },
    { category: 'Marketing', allocated: 50 * base, consumed: (isAll ? 45 : 30 + Math.random() * 30) * base },
    { category: 'Operations', allocated: 150 * base, consumed: (isAll ? 140 : 120 + Math.random() * 40) * base },
    { category: 'Events', allocated: 40 * base, consumed: (isAll ? 35 : 20 + Math.random() * 30) * base },
  ].map(d => ({ ...d, consumed: Math.round(d.consumed), allocated: Math.round(d.allocated) }));
};

const generateFinance = (campus: string, m: number) => {
  const isAll = campus === 'All';
  const base = isAll ? 4 : m;
  return [
    { month: 'Apr', revenue: 100 * base, expense: 60 * base },
    { month: 'May', revenue: 150 * base, expense: 70 * base },
    { month: 'Jun', revenue: 180 * base, expense: 80 * base },
    { month: 'Jul', revenue: 200 * base, expense: 95 * base },
    { month: 'Aug', revenue: 190 * base, expense: 90 * base },
    { month: 'Sep', revenue: 220 * base, expense: 110 * base },
  ].map(d => ({ ...d, revenue: Math.round(d.revenue * (isAll ? 1 : 0.8 + Math.random() * 0.4)), expense: Math.round(d.expense * (isAll ? 1 : 0.8 + Math.random() * 0.4)) }));
};

const generateStudentPerf = (campus: string) => {
  return [
    { subject: 'Science/Eng', passed: 85 + Math.random() * 10, failed: Math.random() * 15 },
    { subject: 'Commerce', passed: 88 + Math.random() * 10, failed: Math.random() * 12 },
    { subject: 'Arts', passed: 92 + Math.random() * 5, failed: Math.random() * 8 },
    { subject: 'Management', passed: 80 + Math.random() * 15, failed: Math.random() * 20 },
  ].map(d => ({ ...d, passed: Math.round(d.passed), failed: Math.round(d.failed) }));
};

const generateHRMS = (campus: string) => {
  return [
    { month: 'Apr', voluntary: 1 + Math.random() * 2, involuntary: Math.random() * 1 },
    { month: 'May', voluntary: 1 + Math.random() * 2, involuntary: Math.random() * 1 },
    { month: 'Jun', voluntary: 2 + Math.random() * 2, involuntary: Math.random() * 1 },
    { month: 'Jul', voluntary: 1 + Math.random() * 1.5, involuntary: Math.random() * 1 },
    { month: 'Aug', voluntary: 1 + Math.random() * 2, involuntary: Math.random() * 1 },
    { month: 'Sep', voluntary: 1 + Math.random() * 2, involuntary: Math.random() * 1 },
  ].map(d => ({ ...d, voluntary: Number(d.voluntary.toFixed(1)), involuntary: Number(d.involuntary.toFixed(1)) }));
};

const glassCard = "bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] rounded-[24px] relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(31,38,135,0.08)] hover:bg-white/80";

export default function GOIControlTower() {
  const [selectedCampus, setSelectedCampus] = useState('All');
  const [expandedCampus, setExpandedCampus] = useState<string | null>(null);

  // Dynamic Data based on Campus Selection
  const campusData = useMemo(() => {
    let multiplier = 1;
    if (selectedCampus === 'NHCE') multiplier = 2;
    if (selectedCampus === 'NHC Marathalli') multiplier = 1.2;
    if (selectedCampus === 'NHC Kasturinagar') multiplier = 1.0;
    if (selectedCampus === 'NHPUC Kasturinagar') multiplier = 0.8;

    return {
      fee: generateTrendData(selectedCampus, multiplier),
      budget: generateBudget(selectedCampus, multiplier),
      finance: generateFinance(selectedCampus, multiplier),
      students: generateStudentPerf(selectedCampus),
      hrms: generateHRMS(selectedCampus),
    };
  }, [selectedCampus]);

  const filteredAlerts = ALERTS.filter(a => selectedCampus === 'All' || a.campus === 'All' || a.campus === selectedCampus);
  
  // Calculate Top KPIs dynamically
  const kpiData = useMemo(() => {
    if (selectedCampus === 'All') {
      return {
        fee: '₹ 112 Cr',
        headcount: '845',
        students: '9,600',
        budget: '₹ 45 Cr',
      };
    }
    const c = CAMPUS_DATA.find(x => x.name === selectedCampus);
    if (c) {
      return {
        fee: `₹ ${(c.students * 0.012).toFixed(1)} Cr`,
        headcount: c.staff.toString(),
        students: c.students.toLocaleString(),
        budget: `₹ ${(c.students * 0.005).toFixed(1)} Cr`,
      };
    }
    return { fee: '-', headcount: '-', students: '-', budget: '-' };
  }, [selectedCampus]);

  return (
    <Layout
      title="GOI Control Tower"
      description="Group of Institutions command center - Cross-module ERP Analytics"
      icon={Building2}
    >
      <div className="relative min-h-screen w-full -mt-8 pt-8 pb-12">
        {/* Animated Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-teal-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
        </div>

        <div className="space-y-6 max-w-7xl mx-auto px-2">
          
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-2 p-1.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 shadow-sm w-fit overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedCampus('All')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCampus === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-white/60'}`}
              >
                All Campuses
              </button>
              {CAMPUS_DATA.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCampus(c.name)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCampus === c.name ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-white/60'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3 shrink-0">
               <button className="flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-white/90 transition-all">
                  <Calendar className="w-4 h-4 text-indigo-600" /> AY 2025-26
               </button>
            </div>
          </div>

          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
               { label: 'Fee Collection', value: kpiData.fee, delta: '+8.4% YoY', dir: 'up', icon: IndianRupee, color: DS.success, bg: 'bg-emerald-500/10' },
               { label: 'OPEX Budget', value: kpiData.budget, delta: 'On Track', dir: 'up', icon: Wallet, color: DS.teal, bg: 'bg-teal-500/10' },
               { label: 'Headcount', value: kpiData.headcount, delta: '+12 MT', dir: 'up', icon: Users, color: DS.primary, bg: 'bg-indigo-500/10' },
               { label: 'Students', value: kpiData.students, delta: '+4.2% YoY', dir: 'up', icon: GraduationCap, color: DS.purple, bg: 'bg-purple-500/10' },
               { label: 'Placements', value: '82%', delta: '250+ Offers', dir: 'up', icon: Target, color: DS.pink, bg: 'bg-pink-500/10' },
               { label: 'Compliance', value: '96%', delta: '2 warnings', dir: 'warn', icon: ShieldCheck, color: DS.warning, bg: 'bg-amber-500/10' },
            ].map((kpi, i) => (
               <div key={i} className={`${glassCard} flex flex-col justify-between group p-5`}>
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="flex justify-between items-start mb-3 relative z-10">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight w-2/3">{kpi.label}</span>
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.bg} shadow-sm border border-white/40 shrink-0`}>
                       <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                     </div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-2xl font-black text-slate-800 mb-1 tracking-tight">{kpi.value}</div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit shadow-sm border border-white/40 ${kpi.dir === 'up' ? 'bg-emerald-100/80 text-emerald-700' : kpi.dir === 'down' ? 'bg-rose-100/80 text-rose-700' : 'bg-amber-100/80 text-amber-700'}`}>
                       {kpi.delta}
                    </div>
                  </div>
               </div>
            ))}
          </div>

          {/* ROW 1: Finance & Budgeting (NEW) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Finance Overview */}
             <div className={`${glassCard} flex flex-col`}>
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <BarChart4 className="w-5 h-5 text-indigo-600" />
                        Financial Performance
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Monthly Revenue vs Expenditure (Lakhs)</p>
                   </div>
                </div>
                <div className="flex-1 min-h-[260px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={campusData.finance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor={DS.primary} stopOpacity={0.4}/>
                               <stop offset="95%" stopColor={DS.primary} stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                         <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                         <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                         <Area type="monotone" dataKey="revenue" name="Revenue" stroke={DS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                         <Bar dataKey="expense" name="Expense" fill={DS.secondary} radius={[4, 4, 0, 0]} barSize={20} />
                      </ComposedChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Budget Utilization */}
             <div className={`${glassCard} flex flex-col`}>
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-teal-600" />
                        Budget Utilization
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Allocated vs Consumed by Department (Lakhs)</p>
                   </div>
                </div>
                <div className="flex-1 min-h-[260px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={campusData.budget} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                         <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                         <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: DS.text, fontWeight: 600 }} width={80} />
                         <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                         <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                         <Bar dataKey="allocated" name="Allocated" fill={DS.teal} fillOpacity={0.4} radius={[0, 4, 4, 0]} barSize={16} />
                         <Bar dataKey="consumed" name="Consumed" fill={DS.teal} radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* ROW 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* ERP: Fee Management */}
             <div className={`${glassCard} flex flex-col`}>
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-indigo-600" />
                        Fee Management
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Actual vs Expected (Lakhs)</p>
                   </div>
                </div>
                <div className="flex-1 min-h-[220px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={campusData.fee} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <defs>
                            <linearGradient id="colorFee" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor={DS.success} stopOpacity={0.4}/>
                               <stop offset="95%" stopColor={DS.success} stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                         <Tooltip cursor={{ stroke: 'rgba(0,0,0,0.1)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                         <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                         <Area type="monotone" dataKey="collected" name="Collected" stroke={DS.success} strokeWidth={3} fillOpacity={1} fill="url(#colorFee)" />
                         <Line type="stepAfter" dataKey="due" name="Due Target" stroke={DS.textLight} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Student Performance */}
             <div className={`${glassCard} flex flex-col`}>
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-emerald-500" />
                        Student Analytics
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Pass/Fail ratio by stream</p>
                   </div>
                </div>
                <div className="flex-1 min-h-[220px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={campusData.students} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                         <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                         <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: DS.text, fontWeight: 600 }} width={85} />
                         <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                         <Bar dataKey="passed" name="Passed" stackId="a" fill={DS.success} radius={[0, 0, 0, 0]} barSize={20} />
                         <Bar dataKey="failed" name="Failed" stackId="a" fill={DS.error} radius={[0, 6, 6, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* HRMS Attrition */}
             <div className={`${glassCard} flex flex-col`}>
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-purple-500" />
                        HRMS: Attrition
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Voluntary vs Involuntary (%)</p>
                   </div>
                </div>
                <div className="flex-1 min-h-[220px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={campusData.hrms} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                         <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                         <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                         <Bar dataKey="voluntary" name="Voluntary" stackId="a" fill={DS.purple} radius={[0, 0, 6, 6]} barSize={24} />
                         <Bar dataKey="involuntary" name="Involuntary" stackId="a" fill={DS.secondary} radius={[6, 6, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Action Center */}
             <div className={`${glassCard} lg:col-span-3 flex flex-col p-0 overflow-hidden`}>
                <div className="p-6 border-b border-white/60 bg-white/40 shrink-0">
                   <div className="flex justify-between items-center">
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Cross-Module Action Center ({selectedCampus})
                      </h3>
                      <div className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-rose-200">{filteredAlerts.length} Active Issues</div>
                   </div>
                </div>
                <div className="p-4 flex-1 overflow-x-auto no-scrollbar">
                   <div className="flex gap-3 min-w-max">
                      {filteredAlerts.map(alert => (
                         <div key={alert.id} className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm flex flex-col gap-3 transition-all hover:shadow-md hover:bg-white/80 cursor-pointer group min-w-[300px] max-w-[350px]">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{alert.module}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{alert.campus}</span>
                               </div>
                               <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${alert.type === 'error' ? 'bg-rose-100 text-rose-600' : alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {alert.type === 'error' ? <XCircle className="w-4 h-4" /> : alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                               </div>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors mb-2">{alert.message}</p>
                               <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.time}</span>
                            </div>
                         </div>
                      ))}
                      {filteredAlerts.length === 0 && (
                         <div className="p-8 w-full text-center text-slate-500 flex flex-col items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 mb-3 text-emerald-400" />
                            <p className="text-sm font-bold">All systems nominal for {selectedCampus}</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Campus Drilldown Table (Span Full) */}
          <div className={`${glassCard} overflow-hidden flex flex-col p-0 mt-6`}>
             <div className="p-6 border-b border-white/60 flex justify-between items-center bg-white/30">
                <div>
                   <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                     <Layers className="w-5 h-5 text-indigo-600" />
                     Campus Deep Dive
                   </h3>
                   <p className="text-xs text-slate-500 font-medium">Cross-module KPI breakdown per institution (Click row to expand)</p>
                </div>
             </div>
             <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-white/60">
                         <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Campus Name</th>
                         <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Students</th>
                         <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Staff</th>
                         <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Fee Coll.</th>
                         <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Compliance</th>
                         <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Assets</th>
                         <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Details</th>
                      </tr>
                   </thead>
                   <tbody>
                      {CAMPUS_DATA.map((c) => (
                         <React.Fragment key={c.id}>
                            <tr 
                              onClick={() => setExpandedCampus(expandedCampus === c.id ? null : c.id)}
                              className={`border-b border-white/40 transition-colors cursor-pointer group ${expandedCampus === c.id ? 'bg-indigo-50/40' : 'hover:bg-white/60'}`}
                            >
                               <td className="py-4 px-6">
                                  <div className="font-black text-slate-800 text-sm">{c.name}</div>
                                  <div className="text-xs text-slate-500 font-medium">{c.type}</div>
                               </td>
                               <td className="py-4 px-6 text-right font-bold text-slate-700">{c.students.toLocaleString()}</td>
                               <td className="py-4 px-6 text-right font-bold text-slate-700">{c.staff}</td>
                               <td className="py-4 px-6 w-[200px]">
                                  <div className="flex items-center gap-2 justify-center">
                                     <div className="w-full h-2.5 bg-slate-200/50 rounded-full overflow-hidden max-w-[100px] shadow-inner">
                                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${c.collection}%`, backgroundColor: c.collection > 90 ? DS.success : c.collection > 80 ? DS.warning : DS.error }}></div>
                                     </div>
                                     <span className="text-xs font-bold w-10 text-slate-700">{c.collection}%</span>
                                  </div>
                               </td>
                               <td className="py-4 px-6 text-center">
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-white/40 ${c.compliance === 100 ? 'bg-emerald-100/80 text-emerald-700' : 'bg-amber-100/80 text-amber-700'}`}>
                                     {c.compliance}%
                                  </span>
                               </td>
                               <td className="py-4 px-6 text-center">
                                 <div className="text-xs font-bold text-slate-700">{c.assets}% Good</div>
                               </td>
                               <td className="py-4 px-6 text-right">
                                  <button className={`p-2 rounded-xl transition-all ${expandedCampus === c.id ? 'bg-indigo-100 text-indigo-600 rotate-90' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                     <ChevronRight className="w-4 h-4" />
                                  </button>
                               </td>
                            </tr>
                            {/* Expanded Drill-down View */}
                            {expandedCampus === c.id && (
                               <tr className="bg-indigo-50/20 backdrop-blur-sm border-b border-white/40">
                                  <td colSpan={7} className="p-6">
                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="bg-white/60 p-4 rounded-xl border border-white/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                           <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-pink-500"/> Placements</h4>
                                           <div className="text-2xl font-black text-slate-800 mb-1">{c.placements}% <span className="text-sm font-semibold text-emerald-500">+4%</span></div>
                                           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-3 shadow-inner"><div className="h-full bg-pink-500" style={{width: `${c.placements}%`}}></div></div>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-xl border border-white/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                           <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2"><BedDouble className="w-4 h-4 text-purple-500"/> Hostel Occupancy</h4>
                                           <div className="text-2xl font-black text-slate-800 mb-1">{c.hostel}% <span className="text-sm font-semibold text-slate-500">Filled</span></div>
                                           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-3 shadow-inner"><div className="h-full bg-purple-500" style={{width: `${c.hostel}%`}}></div></div>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-xl border border-white/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                           <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-indigo-500"/> Staff Sentiment</h4>
                                           <div className="text-2xl font-black text-slate-800 mb-1">{c.sentiment}% <span className="text-sm font-semibold text-emerald-500">+2%</span></div>
                                           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-3 shadow-inner"><div className="h-full bg-indigo-500" style={{width: `${c.sentiment}%`}}></div></div>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-xl border border-white/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                           <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-secondary"/> Transport Health</h4>
                                           <div className="text-2xl font-black text-slate-800 mb-1">{c.transport}% <span className="text-sm font-semibold text-slate-500">Active</span></div>
                                           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-3 shadow-inner"><div className="h-full bg-orange-500" style={{width: `${c.transport}%`}}></div></div>
                                        </div>
                                     </div>
                                  </td>
                               </tr>
                            )}
                         </React.Fragment>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
