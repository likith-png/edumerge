import React, { useState, useMemo } from 'react';
import {
  Building2, Users, IndianRupee, GraduationCap, Users2, AlertTriangle, ShieldCheck, 
  Calendar, Clock, Layers, CheckCircle2, AlertCircle, 
  BrainCircuit, Heart, ChevronRight, XCircle, Package, Truck,
  Target, Wallet, BarChart4, Receipt, CalendarCheck, BookOpen, Building, FlaskConical,
  Banknote, Tag, ArrowDownToLine, Scale, BedDouble
} from 'lucide-react';
import Layout from '../components/Layout';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
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
const CAMPUSES = [
  { id: 'c1', name: 'NHCE', type: 'Engineering', students: 4500, staff: 420, collection: 88, compliance: 96, sentiment: 82, assets: 94, transport: 98, placements: 85, hostel: 95 },
  { id: 'c2', name: 'NHC Marathalli', type: 'Degree', students: 2100, staff: 180, collection: 92, compliance: 100, sentiment: 78, assets: 88, transport: 100, placements: 78, hostel: 82 },
  { id: 'c3', name: 'NHC Kasturinagar', type: 'Degree', students: 1800, staff: 150, collection: 85, compliance: 92, sentiment: 85, assets: 95, transport: 92, placements: 80, hostel: 90 },
  { id: 'c4', name: 'NHPUC Kasturinagar', type: 'PU', students: 1200, staff: 95, collection: 95, compliance: 100, sentiment: 88, assets: 98, transport: 95, placements: 95, hostel: 88 },
];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

// Deterministic Generation for Tallying
const CAMPUS_METRICS: Record<string, any> = {};

CAMPUSES.forEach((c, idx) => {
  const multiplier = [2.5, 1.2, 1.0, 0.8][idx];
  
  const feeDemand = Math.round(1500 * multiplier);
  const feeDiscount = Math.round(120 * multiplier);
  const feeCollection = Math.round(1150 * multiplier);
  const feeDue = feeDemand - feeDiscount - feeCollection;
  
  CAMPUS_METRICS[c.name] = {
     feeSummary: {
       demand: feeDemand,
       discount: feeDiscount,
       collection: feeCollection,
       due: feeDue
     },
     fee: MONTHS.map((m, i) => ({ month: m, due: Math.round(50 * multiplier), collected: Math.round(50 * multiplier * (0.4 + i*0.1)) })),
     budget: [
       { category: 'IT & Infra', allocated: Math.round(120 * multiplier), consumed: Math.round(100 * multiplier) },
       { category: 'Academics', allocated: Math.round(200 * multiplier), consumed: Math.round(180 * multiplier) },
       { category: 'Marketing', allocated: Math.round(50 * multiplier), consumed: Math.round(45 * multiplier) },
       { category: 'Operations', allocated: Math.round(150 * multiplier), consumed: Math.round(140 * multiplier) },
       { category: 'Events', allocated: Math.round(40 * multiplier), consumed: Math.round(30 * multiplier) },
     ],
     finance: MONTHS.map((m, i) => ({ month: m, revenue: Math.round(100 * multiplier * (1 + i*0.1)), expense: Math.round(60 * multiplier * (1 + i*0.05)) })),
     students: [
       { subject: 'Science/Eng', passed: Math.round(400 * multiplier), failed: Math.round(50 * multiplier) },
       { subject: 'Commerce', passed: Math.round(300 * multiplier), failed: Math.round(30 * multiplier) },
       { subject: 'Arts', passed: Math.round(200 * multiplier), failed: Math.round(10 * multiplier) },
       { subject: 'Management', passed: Math.round(250 * multiplier), failed: Math.round(40 * multiplier) },
     ],
     hrms: MONTHS.map((m, i) => ({ month: m, voluntary: Math.round(10 * multiplier), involuntary: Math.round(3 * multiplier) })),
     
     // Specific institution modules
     attendance: MONTHS.map((m, i) => ({ month: m, studentRate: Math.round(80 + (idx % 2)*5 + i), staffRate: Math.round(90 + i) })),
     research: [
       { quarter: 'Q1', publications: Math.round(15 * multiplier), patents: Math.round(2 * multiplier) },
       { quarter: 'Q2', publications: Math.round(20 * multiplier), patents: Math.round(3 * multiplier) },
       { quarter: 'Q3', publications: Math.round(25 * multiplier), patents: Math.round(4 * multiplier) },
       { quarter: 'Q4', publications: Math.round(30 * multiplier), patents: Math.round(5 * multiplier) },
     ],
     infra: [
       { type: 'Labs', utilization: Math.round(70 + multiplier*5) },
       { type: 'Classrooms', utilization: Math.round(85 + multiplier*2) },
       { type: 'Auditorium', utilization: Math.round(40 + multiplier*10) },
       { type: 'Library', utilization: Math.round(60 + multiplier*8) },
     ]
  };
});

// Calculate "All" to tally perfectly
const ALL_METRICS = {
  feeSummary: { demand: 0, discount: 0, collection: 0, due: 0 },
  fee: MONTHS.map(m => ({ month: m, due: 0, collected: 0 })),
  budget: CAMPUS_METRICS['NHCE'].budget.map((b: any) => ({ category: b.category, allocated: 0, consumed: 0 })),
  finance: MONTHS.map(m => ({ month: m, revenue: 0, expense: 0 })),
  students: CAMPUS_METRICS['NHCE'].students.map((s: any) => ({ subject: s.subject, passed: 0, failed: 0 })),
  hrms: MONTHS.map(m => ({ month: m, voluntary: 0, involuntary: 0 })),
};

CAMPUSES.forEach(c => {
  const m = CAMPUS_METRICS[c.name];
  ALL_METRICS.feeSummary.demand += m.feeSummary.demand;
  ALL_METRICS.feeSummary.discount += m.feeSummary.discount;
  ALL_METRICS.feeSummary.collection += m.feeSummary.collection;
  ALL_METRICS.feeSummary.due += m.feeSummary.due;
  
  m.fee.forEach((f: any, i: number) => { ALL_METRICS.fee[i].due += f.due; ALL_METRICS.fee[i].collected += f.collected; });
  m.budget.forEach((b: any, i: number) => { ALL_METRICS.budget[i].allocated += b.allocated; ALL_METRICS.budget[i].consumed += b.consumed; });
  m.finance.forEach((f: any, i: number) => { ALL_METRICS.finance[i].revenue += f.revenue; ALL_METRICS.finance[i].expense += f.expense; });
  m.students.forEach((s: any, i: number) => { ALL_METRICS.students[i].passed += s.passed; ALL_METRICS.students[i].failed += s.failed; });
  m.hrms.forEach((h: any, i: number) => { ALL_METRICS.hrms[i].voluntary += h.voluntary; ALL_METRICS.hrms[i].involuntary += h.involuntary; });
});
CAMPUS_METRICS['All'] = ALL_METRICS;

const ALERTS = [
  { id: 1, type: 'error', module: 'Finance', message: 'NHCE: IT Infrastructure Budget exceeded by 12%', time: '30m ago', campus: 'NHCE' },
  { id: 2, type: 'error', module: 'Fee', message: 'NHC Kasturinagar: Fee collection deficit > 15% in B.Com', time: '1h ago', campus: 'NHC Kasturinagar' },
  { id: 3, type: 'warning', module: 'HRMS', message: 'NHPUC Kasturinagar: High attrition risk detected in Science faculty', time: '3h ago', campus: 'NHPUC Kasturinagar' },
  { id: 4, type: 'info', module: 'Compliance', message: 'NHC Marathalli: Affiliation Compliance audit due in 15 days', time: '5h ago', campus: 'NHC Marathalli' },
  { id: 5, type: 'error', module: 'HRMS', message: 'Group: Statutory PF payment overdue by 1 day', time: '1d ago', campus: 'All' },
  { id: 6, type: 'warning', module: 'Transport', message: 'NHCE: Route 4 Bus maintenance delayed', time: '2d ago', campus: 'NHCE' },
];

const glassCard = "bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] rounded-[24px] relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(31,38,135,0.08)] hover:bg-white/80";

export default function GOIControlTower() {
  const [selectedCampus, setSelectedCampus] = useState('All');
  const [expandedCampus, setExpandedCampus] = useState<string | null>(null);

  const campusData = CAMPUS_METRICS[selectedCampus];
  const filteredAlerts = ALERTS.filter(a => selectedCampus === 'All' || a.campus === 'All' || a.campus === selectedCampus);
  
  // Calculate Top KPIs dynamically for exact tallying
  const kpiData = useMemo(() => {
    const feeSum = campusData.feeSummary;
    const formatLakhs = (val: number) => `₹ ${val.toLocaleString()} L`;

    if (selectedCampus === 'All') {
      const totalStudents = CAMPUSES.reduce((acc, c) => acc + c.students, 0);
      const totalStaff = CAMPUSES.reduce((acc, c) => acc + c.staff, 0);
      const totalBudget = ALL_METRICS.budget.reduce((acc: number, b: any) => acc + b.allocated, 0);
      return {
        demand: formatLakhs(feeSum.demand),
        discount: formatLakhs(feeSum.discount),
        collection: formatLakhs(feeSum.collection),
        due: formatLakhs(feeSum.due),
        headcount: totalStaff.toString(),
        students: totalStudents.toLocaleString(),
        budget: formatLakhs(totalBudget),
      };
    }
    const c = CAMPUSES.find(x => x.name === selectedCampus);
    const specificBudget = campusData.budget.reduce((acc: any, b: any) => acc + b.allocated, 0);
    
    if (c) {
      return {
        demand: formatLakhs(feeSum.demand),
        discount: formatLakhs(feeSum.discount),
        collection: formatLakhs(feeSum.collection),
        due: formatLakhs(feeSum.due),
        headcount: c.staff.toString(),
        students: c.students.toLocaleString(),
        budget: formatLakhs(specificBudget),
      };
    }
    return { demand: '-', discount: '-', collection: '-', due: '-', headcount: '-', students: '-', budget: '-' };
  }, [selectedCampus, campusData]);

  return (
    <Layout
      title="GOI Control Tower"
      description="Group of Institutions command center - Cross-module ERP Analytics"
      icon={Building2}
      showBack={true}
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
              {CAMPUSES.map(c => (
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

          {/* DEDICATED FEE MANAGEMENT KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
               { label: 'Total Demand', value: kpiData.demand, delta: 'Total Generated', dir: 'up', icon: Banknote, color: DS.primary, bg: 'bg-indigo-500/10' },
               { label: 'Discount/Concession', value: kpiData.discount, delta: 'Approved', dir: 'warn', icon: Tag, color: DS.warning, bg: 'bg-amber-500/10' },
               { label: 'Total Collection', value: kpiData.collection, delta: 'Realized', dir: 'up', icon: ArrowDownToLine, color: DS.success, bg: 'bg-emerald-500/10' },
               { label: 'Total Due', value: kpiData.due, delta: 'Pending', dir: 'down', icon: Scale, color: DS.error, bg: 'bg-rose-500/10' },
            ].map((kpi, i) => (
               <div key={i} className={`${glassCard} flex flex-col justify-between group p-5 border-l-4`} style={{ borderLeftColor: kpi.color }}>
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="flex justify-between items-start mb-3 relative z-10">
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-600 leading-tight w-2/3">{kpi.label}</span>
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

          {/* Other Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
               { label: 'OPEX Budget', value: kpiData.budget, delta: 'Allocated', dir: 'up', icon: Wallet, color: DS.teal, bg: 'bg-teal-500/10' },
               { label: 'Headcount', value: kpiData.headcount, delta: 'Total Staff', dir: 'up', icon: Users, color: DS.primary, bg: 'bg-indigo-500/10' },
               { label: 'Students', value: kpiData.students, delta: 'Enrolled', dir: 'up', icon: GraduationCap, color: DS.purple, bg: 'bg-purple-500/10' },
               { label: 'Placements', value: '82%', delta: '250+ Offers', dir: 'up', icon: Target, color: DS.pink, bg: 'bg-pink-500/10' },
               { label: 'Compliance', value: '96%', delta: 'Optimal', dir: 'up', icon: ShieldCheck, color: DS.warning, bg: 'bg-amber-500/10' },
            ].map((kpi, i) => (
               <div key={i} className={`${glassCard} flex flex-col justify-between group p-4`}>
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight w-2/3">{kpi.label}</span>
                     <div className={`w-6 h-6 rounded flex items-center justify-center ${kpi.bg} shadow-sm border border-white/40 shrink-0`}>
                       <kpi.icon className="w-3 h-3" style={{ color: kpi.color }} />
                     </div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-xl font-black text-slate-800 mb-1 tracking-tight">{kpi.value}</div>
                  </div>
               </div>
            ))}
          </div>

          {/* ROW 1: Finance & Budgeting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* ROW 2 Charts: ERP Fee & Student Perf */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className={`${glassCard} flex flex-col`}>
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-indigo-600" />
                        Fee Management Trend
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Monthly Actuals vs Targets (Lakhs)</p>
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

             <div className={`${glassCard} flex flex-col`}>
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-emerald-500" />
                        Student Analytics
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Headcount Pass/Fail by stream</p>
                   </div>
                </div>
                <div className="flex-1 min-h-[220px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={campusData.students} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                         <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                         <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: DS.text, fontWeight: 600 }} width={85} />
                         <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                         <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                         <Bar dataKey="passed" name="Passed" stackId="a" fill={DS.success} radius={[0, 0, 0, 0]} barSize={20} />
                         <Bar dataKey="failed" name="Failed" stackId="a" fill={DS.error} radius={[0, 6, 6, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* INDIVIDUAL INSTITUTION SPECIFIC MODULES (Hidden in 'All') */}
          {selectedCampus !== 'All' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
               
               {/* Attendance Module */}
               <div className={`${glassCard} flex flex-col`}>
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                          <CalendarCheck className="w-5 h-5 text-indigo-500" />
                          Attendance Trends
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Student vs Staff (%)</p>
                     </div>
                  </div>
                  <div className="flex-1 min-h-[220px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={campusData.attendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                           <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} domain={[0, 100]} />
                           <Tooltip cursor={{ stroke: 'rgba(0,0,0,0.1)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                           <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                           <Line type="monotone" dataKey="studentRate" name="Student %" stroke={DS.indigo} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                           <Line type="monotone" dataKey="staffRate" name="Staff %" stroke={DS.purple} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Research & Publications */}
               <div className={`${glassCard} flex flex-col`}>
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                          <FlaskConical className="w-5 h-5 text-pink-500" />
                          Research & Publications
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Quarterly Output</p>
                     </div>
                  </div>
                  <div className="flex-1 min-h-[220px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={campusData.research} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                           <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                           <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                           <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                           <Bar dataKey="publications" name="Papers" fill={DS.pink} radius={[4, 4, 0, 0]} barSize={16} />
                           <Bar dataKey="patents" name="Patents" fill={DS.secondary} radius={[4, 4, 0, 0]} barSize={16} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Infrastructure Utilization */}
               <div className={`${glassCard} flex flex-col`}>
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                          <Building className="w-5 h-5 text-teal-600" />
                          Infra Utilization
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Facility usage %</p>
                     </div>
                  </div>
                  <div className="flex-1 min-h-[220px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={campusData.infra} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                           <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: DS.textLight }} />
                           <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: DS.text, fontWeight: 600 }} width={75} />
                           <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                           <Bar dataKey="utilization" name="Usage %" fill={DS.teal} radius={[0, 4, 4, 0]} barSize={16} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

          {/* Action Center - Moved down to fit narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          {/* Campus Drilldown Table (ONLY VISIBLE IN 'All' MODE) */}
          {selectedCampus === 'All' && (
            <div className={`${glassCard} overflow-hidden flex flex-col p-0 mt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in`}>
               <div className="p-6 border-b border-white/60 flex justify-between items-center bg-white/30">
                  <div>
                     <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                       <Layers className="w-5 h-5 text-indigo-600" />
                       Group-wide Deep Dive
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
                        {CAMPUSES.map((c) => (
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
          )}

        </div>
      </div>
    </Layout>
  );
}
