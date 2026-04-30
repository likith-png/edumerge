import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Briefcase, CheckCircle, Search, Filter, Download, AlertTriangle, Users, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Layout from '../components/Layout';
import { getTalentStats } from '../services/talentService';

const attritionData = [
    { month: 'Jan', rate: 2, tenure: 140 },
    { month: 'Feb', rate: 3, tenure: 120 },
    { month: 'Mar', rate: 1, tenure: 180 },
    { month: 'Apr', rate: 4, tenure: 90 },
    { month: 'May', rate: 2, tenure: 150 },
    { month: 'Jun', rate: 5, tenure: 110 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const TalentDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [viewMode, setViewMode] = useState<'Standalone' | 'Group'>('Standalone');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({ viewMode: 'Standalone', startDate: '', endDate: '', deptFilter: '' });

    useEffect(() => {
        setLoading(true);
        getTalentStats(appliedFilters.viewMode, appliedFilters.startDate, appliedFilters.endDate, appliedFilters.deptFilter)
            .then(data => { setStats(data); setLoading(false); })
            .catch(err => { console.error("Failed to fetch talent stats", err); setLoading(false); });
    }, [appliedFilters]);

    useEffect(() => {
        setAppliedFilters(prev => ({ ...prev, viewMode }));
    }, [viewMode]);

    const handleFilter = () => setAppliedFilters({ viewMode, startDate, endDate, deptFilter });
    const clearFilters = () => {
        setStartDate(''); setEndDate(''); setDeptFilter('');
        setAppliedFilters({ viewMode, startDate: '', endDate: '', deptFilter: '' });
    };

    const groupData = [
        { name: 'Bangalore', attrition: 12, hiring: 85, engagement: 78 },
        { name: 'Mumbai', attrition: 15, hiring: 92, engagement: 72 },
        { name: 'Delhi', attrition: 8, hiring: 88, engagement: 82 },
        { name: 'Chennai', attrition: 10, hiring: 76, engagement: 75 },
        { name: 'Hyderabad', attrition: 18, hiring: 80, engagement: 68 },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'recruitment', label: 'Acquisition' },
        { id: 'lnd', label: 'Learning' },
        { id: 'performance', label: 'Performance' },
        { id: 'engagement', label: 'Engagement' },
        { id: 'probation', label: 'Probation' },
        { id: 'exit', label: 'Exit' },
    ];

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-slate-500">Loading Talent Insights…</p>
            </div>
        </div>
    );

    return (
        <Layout title="Talent Dashboard" description="Strategic insights into acquisition, development & retention" icon={TrendingUp} showHome>
            {/* Standard Tab Bar */}
            <div className="sticky top-0 z-30 -mx-4 px-4 md:-mx-8 md:px-8 mb-8 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3">
                <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                                activeTab === t.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Standard Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            className="pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 transition-all shadow-sm"
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-sm">
                        <input type="date" className="bg-transparent text-xs font-medium py-1 focus:outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <div className="w-px h-4 bg-slate-200"></div>
                        <input type="date" className="bg-transparent text-xs font-medium py-1 focus:outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <Button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 h-10 text-xs font-semibold shadow-sm">
                        <Filter className="h-4 w-4 mr-2" /> Apply Filters
                    </Button>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    {(['Standalone', 'Group'] as const).map(m => (
                        <button key={m} onClick={() => setViewMode(m)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {viewMode === 'Group' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Group Attrition Rate', key: 'attrition', color: '#ef4444' },
                                { title: 'Hiring Velocity', key: 'hiring', color: '#10b981' },
                                { title: 'Engagement Score', key: 'engagement', color: '#3b82f6' },
                            ].map(({ title, key, color }) => (
                                <Card key={key} className="border-slate-200 shadow-sm">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100">
                                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">{title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="h-[200px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={groupData} layout="vertical">
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                                                    <Tooltip />
                                                    <Bar dataKey={key} fill={color} radius={[0, 4, 4, 0]} barSize={16} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Strategic Insights Banner */}
                            <Card className="border-blue-100 bg-blue-50/30 overflow-hidden shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-600 rounded-lg">
                                            <Sparkles className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">Strategic Advisory</h3>
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">AI Insights Layer</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { label: 'Attention Required', text: '3 Probationers in Engineering are flagged as "High Risk" due to low project delivery scores.', color: 'border-red-100 bg-white' },
                                            { label: 'Positive Trend', text: 'Learning adoption is up +12% — active participation in the new "AI for Educators" module.', color: 'border-emerald-100 bg-white' },
                                            { label: 'Forecast', text: 'Hiring velocity needs to increase by 15% to meet Q3 academic staffing requirements.', color: 'border-amber-100 bg-white' },
                                        ].map(({ label, text, color }) => (
                                            <div key={label} className={`rounded-xl border p-4 shadow-sm ${color}`}>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                                                <p className="text-xs font-medium text-slate-700 leading-relaxed">{text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* KPI Metrics Engine */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {[
                                    { label: 'Open Positions', value: stats.recruitment?.openPositions || 12, icon: Search, color: 'text-blue-600', bg: 'bg-blue-100', sub: 'Acquisition' },
                                    { label: 'Avg Onboard', value: `${stats.avgOnboardingDays || 14}d`, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', sub: 'Onboarding' },
                                    { label: 'Compliance Rate', value: `${stats.lnd?.overallCompletion}%`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', sub: 'L&D' },
                                    { label: 'Participation', value: `${stats.engagement?.participation}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100', sub: 'Engagement' },
                                    { label: 'High Risk Cases', value: stats.probation?.highRisk || 3, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', sub: 'Probation' },
                                    { label: 'Attrition Rate', value: '4.2%', icon: Briefcase, color: 'text-slate-700', bg: 'bg-slate-100', sub: 'Exit' },
                                ].map(({ label, value, icon: Icon, color, bg, sub }) => (
                                    <div key={label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`p-1.5 rounded-lg ${bg} ${color}`}>
                                                <Icon className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{sub}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-0.5">{value}</h4>
                                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Visual Analytics Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 flex justify-between items-center">
                                        <CardTitle className="text-sm font-bold text-slate-800">Recruitment Funnel</CardTitle>
                                        <Badge variant="outline" className="text-[9px] font-bold px-2 py-0 border-slate-200">ANALYTICS</Badge>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="h-[260px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={stats.recruitment?.pipeline} layout="vertical" margin={{ left: 10 }}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 10, fontWeight: 600 }} />
                                                    <Tooltip />
                                                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                                        {stats.recruitment?.pipeline.map((_: any, i: number) => (
                                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 flex justify-between items-center">
                                        <CardTitle className="text-sm font-bold text-slate-800">Hiring Sources</CardTitle>
                                        <Badge variant="outline" className="text-[9px] font-bold px-2 py-0 border-slate-200">GLOBAL MIX</Badge>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="h-[200px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={stats.recruitment?.sources} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="#fff" strokeWidth={2}>
                                                        {stats.recruitment?.sources.map((_: any, i: number) => (
                                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex justify-center flex-wrap gap-4 mt-6">
                                            {stats.recruitment?.sources.map((e: any, i: number) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                    <span className="text-[10px] font-semibold text-slate-600 uppercase">{e.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── RECRUITMENT ── */}
            {activeTab === 'recruitment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {viewMode === 'Group' ? (
                        <>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Group Hiring Velocity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[260px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={groupData} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <Tooltip />
                                                <Bar dataKey="hiring" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Unified Recruitment Funnel</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[260px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={groupData}>
                                                <defs>
                                                    <linearGradient id="colorHiringG" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="hiring" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHiringG)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recruitment Funnel</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[260px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.recruitment?.pipeline} layout="vertical" margin={{ left: 10 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                                    {stats.recruitment?.pipeline.map((_: any, i: number) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hiring Sources</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={stats.recruitment?.sources} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="#fff" strokeWidth={2}>
                                                    {stats.recruitment?.sources.map((_: any, i: number) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center flex-wrap gap-4 mt-4">
                                        {stats.recruitment?.sources.map((e: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                <span className="text-[10px] font-semibold text-slate-600 uppercase">{e.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            )}

            {/* ── L&D ── */}
            {activeTab === 'lnd' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {viewMode === 'Group' ? (
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="py-3 px-4 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Group Training Completion Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={groupData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <Tooltip />
                                            <Bar dataKey="engagement" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Training Completion by Dept</CardTitle>
                                        <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px] uppercase font-bold px-2 py-0.5 shadow-sm">CBSE: 94%</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[260px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.lnd?.deptPerformance}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="dept" tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <Tooltip />
                                                <Bar dataKey="completion" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Skill Development Hours</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[260px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={stats.lnd?.deptPerformance}>
                                                <defs>
                                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="dept" tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="hours" stroke="#10b981" fillOpacity={1} fill="url(#colorHours)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            )}

            {/* ── PERFORMANCE ── */}
            {activeTab === 'performance' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {viewMode === 'Group' ? (
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="py-3 px-4 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Group Average Ratings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={groupData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <Tooltip />
                                            <Bar dataKey="engagement" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Performance Bell Curve</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[260px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.performance?.bellCurve}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="rating" tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={28} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Appraisals Completed', value: `${stats.performance?.appraisalsCompleted}%`, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100 shadow-sm' },
                                    { label: 'Average Rating', value: stats.performance?.avgRating, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100 shadow-sm' },
                                    { label: 'Top Performers', value: stats.performance?.topPerformers, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100 shadow-sm' },
                                    { label: 'PIP Cases', value: stats.performance?.pipCases, color: 'text-red-600', bg: 'bg-red-50 border-red-100 shadow-sm' },
                                ].map(({ label, value, color, bg }) => (
                                    <div key={label} className={`p-5 rounded-xl border flex flex-col items-center justify-center transition-all hover:shadow-md ${bg}`}>
                                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1.5">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── ENGAGEMENT ── */}
            {activeTab === 'engagement' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {viewMode === 'Group' ? (
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="py-3 px-4 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Group Engagement Scores</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={groupData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <Tooltip />
                                            <Bar dataKey="engagement" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Engagement Mix</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={stats.engagement?.categories} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="#fff" strokeWidth={2}>
                                                    {stats.engagement?.categories.map((_: any, i: number) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center flex-wrap gap-4 mt-4">
                                        {stats.engagement?.categories.map((e: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                <span className="text-[10px] font-semibold text-slate-600 uppercase">{e.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'eNPS Score', value: stats.engagement?.eNPS, sub: 'Excellent Range', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100 shadow-sm' },
                                    { label: 'Mood Score', value: stats.engagement?.moodScore, sub: 'Out of 10', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100 shadow-sm' },
                                    { label: 'Participation', value: `${stats.engagement?.participation}%`, sub: 'Across surveys', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100 shadow-sm' },
                                    { label: 'Wellness Level', value: 'High', sub: 'Baseline Standard', color: 'text-red-600', bg: 'bg-red-50 border-red-100 shadow-sm' },
                                ].map(({ label, value, sub, color, bg }) => (
                                    <div key={label} className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all hover:shadow-md ${bg}`}>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── PROBATION ── */}
            {activeTab === 'probation' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {viewMode === 'Group' ? (
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="py-3 px-4 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Group Probation SLA Compliance</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={groupData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <Tooltip />
                                            <Bar dataKey="engagement" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Probation Outcomes Trend</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[240px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={stats.probation?.trend}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                                                <Line type="monotone" dataKey="extended" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-6 mt-4">
                                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Confirmed</span></div>
                                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Extended</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Risk Profile</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="divide-y divide-slate-100">
                                        <div className="flex justify-between items-center py-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Risk Cases</p>
                                                <p className="text-xl font-bold text-red-600 mt-1">03</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg text-[10px] font-bold uppercase tracking-wider">View Trace</Button>
                                        </div>
                                        <div className="flex justify-between items-center py-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SLA Compliance</p>
                                                <p className="text-xl font-bold text-emerald-600 mt-1">98%</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 border-emerald-100">TARGET: 95%</Badge>
                                        </div>
                                        <div className="py-4">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Time to Confirm</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">180 <span className="text-xs font-semibold text-slate-400">days</span></p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            )}

            {/* ── EXIT ── */}
            {activeTab === 'exit' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {viewMode === 'Group' ? (
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="py-3 px-4 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Group Attrition Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={groupData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <Tooltip />
                                            <Bar dataKey="attrition" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Attrition vs Retention Trend</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="h-[260px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={attritionData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600 }} />
                                                <YAxis hide />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="tenure" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                                <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="py-3 px-4 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Primary Exit Reasons</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-5 pt-2">
                                        {[
                                            { label: 'Higher Studies', val: 45, color: 'bg-blue-600' },
                                            { label: 'Better Opportunity', val: 30, color: 'bg-emerald-600' },
                                            { label: 'Personal Reasons', val: 15, color: 'bg-amber-600' },
                                            { label: 'Relocation', val: 10, color: 'bg-slate-500' },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                    <span>{item.label}</span>
                                                    <span>{item.val}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                                                    <div className={`${item.color} h-full transition-all duration-1000 shadow-sm`} style={{ width: `${item.val}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default TalentDashboard;
