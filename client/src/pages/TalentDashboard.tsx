import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Briefcase, CheckCircle, Search, Filter, Download, AlertTriangle, Users, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Home } from 'lucide-react';
import { getTalentStats } from '../services/talentService';

// Mock Data for Charts if API data is simple
const attritionData = [
    { month: 'Jan', rate: 2, tenure: 140 },
    { month: 'Feb', rate: 3, tenure: 120 },
    { month: 'Mar', rate: 1, tenure: 180 },
    { month: 'Apr', rate: 4, tenure: 90 },
    { month: 'May', rate: 2, tenure: 150 },
    { month: 'Jun', rate: 5, tenure: 110 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

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
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch talent stats", err);
                setLoading(false);
            });
    }, [appliedFilters]);

    useEffect(() => {
        setAppliedFilters(prev => ({ ...prev, viewMode }));
    }, [viewMode]);

    const handleFilter = () => {
        setAppliedFilters({ viewMode, startDate, endDate, deptFilter });
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setDeptFilter('');
        setAppliedFilters({ viewMode, startDate: '', endDate: '', deptFilter: '' });
    };

    // Group View Mock Data (for charts that need array data)
    const groupData = [
        { name: 'Bangalore Campus', attrition: 12, hiring: 85, engagement: 78 },
        { name: 'Mumbai Campus', attrition: 15, hiring: 92, engagement: 72 },
        { name: 'Delhi Campus', attrition: 8, hiring: 88, engagement: 82 },
        { name: 'Chennai Campus', attrition: 10, hiring: 76, engagement: 75 },
        { name: 'Hyderabad Campus', attrition: 18, hiring: 80, engagement: 68 },
    ];

    const tabs = [
        { id: 'overview', label: 'Management Overview' },
        { id: 'recruitment', label: 'Talent Acquisition' },
        { id: 'onboarding', label: 'Onboarding Pro' },
        { id: 'lnd', label: 'Learning & Dev' },
        { id: 'performance', label: 'Performance' },
        { id: 'engagement', label: 'Engagement' },
        { id: 'probation', label: 'Probation' },
        { id: 'exit', label: 'Exit & Attrition' },
    ];

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-slate-500 animate-pulse">Loading Talent Insights...</div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans">
            {/* Sticky Header - Aligned with ExitManagement */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-slate-50"
                            >
                                <Home className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">
                                        Talent Dashboard
                                    </h1>
                                    <p className="text-xs text-slate-500">Strategic insights into acquisition & retention</p>
                                </div>
                                {viewMode === 'Group' && (
                                    <div className="hidden lg:flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl h-fit self-center ml-4">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs font-bold text-amber-700">Note: This is seed data for the demo account</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1 md:pb-0">
                            <nav className="flex items-center space-x-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500 ring-offset-1'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Action Bar */}
                    <div className="flex justify-between items-center w-full overflow-x-auto pb-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative min-w-[200px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Filter by Dept..."
                                    className="w-full pl-9 pr-4 py-2 h-9 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={deptFilter}
                                    onChange={(e) => setDeptFilter(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-2 py-1">
                                <span className="text-xs text-slate-500 font-medium">From:</span>
                                <input
                                    type="date"
                                    className="h-7 text-sm focus:outline-none text-slate-700 bg-transparent"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <span className="text-xs text-slate-500 font-medium ml-2">To:</span>
                                <input
                                    type="date"
                                    className="h-7 text-sm focus:outline-none text-slate-700 bg-transparent"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <Button variant="default" size="sm" className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm" onClick={handleFilter}>
                                <Filter className="h-4 w-4" /> Filter Data
                            </Button>
                            {(startDate || endDate || deptFilter) && (
                                <Button variant="ghost" size="sm" className="h-9 text-slate-500 hover:text-slate-700" onClick={clearFilters}>
                                    Clear
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
                                <button
                                    onClick={() => setViewMode('Standalone')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Standalone' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Standalone
                                </button>
                                <button
                                    onClick={() => setViewMode('Group')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Group' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Group View
                                </button>
                            </div>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Download className="h-4 w-4" /> Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Overview Tab Content */}
                    {activeTab === 'overview' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="shadow-md border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Group Attrition Rate</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[250px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="attrition" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#ef4444', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="shadow-md border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Hiring Velocity</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[250px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="hiring" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#10b981', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="shadow-md border-blue-100 bg-gradient-to-br from-white to-blue-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Engagement Score</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[250px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="engagement" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#3b82f6', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Unified Health Matrix</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={groupData}>
                                                        <defs>
                                                            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorHiring" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                                        <YAxis />
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <Tooltip />
                                                        <Area type="monotone" dataKey="engagement" stroke="#8884d8" fillOpacity={1} fill="url(#colorEngagement)" />
                                                        <Area type="monotone" dataKey="hiring" stroke="#82ca9d" fillOpacity={1} fill="url(#colorHiring)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <>
                                    {/* Top Metrics Cards */}
                                    {/* Management Quick Stats - Cross Module */}
                                    {/* Management Quick Stats - Cross Module Executive View */}

                                    {/* AI Insights Section */}
                                    <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden mb-8">
                                        <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                                        <div className="absolute bottom-0 left-0 p-32 bg-rose-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                                                    <Sparkles className="w-5 h-5 text-amber-300" />
                                                </div>
                                                <h3 className="text-xl font-bold tracking-tight">Strategic Insights</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Attention Required</p>
                                                    <p className="font-medium text-sm leading-relaxed">3 Probationers in <span className="text-rose-300 font-bold">Engineering</span> are flagged as "High Risk" due to low project delivery scores.</p>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Positive Trend</p>
                                                    <p className="font-medium text-sm leading-relaxed">Learning adoption is up <span className="text-emerald-300 font-bold">+12%</span> active participation in the new "AI for Educators" module.</p>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Forecast</p>
                                                    <p className="font-medium text-sm leading-relaxed">Hiring velocity needs to increase by <span className="text-amber-300 font-bold">15%</span> to meet the Q3 academic staffing requirements.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                        {/* 1. Recruitment */}
                                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                                        <Search className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recruitment</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">{stats.recruitment?.openPositions || 12}</h3>
                                                    <p className="text-[10px] font-bold text-slate-500 mt-1">Open Positions</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 2. Onboarding */}
                                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="p-2 bg-violet-50 text-violet-600 rounded-xl group-hover:scale-110 transition-transform">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Onboarding</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">{stats.avgOnboardingDays || 14}<span className="text-sm text-slate-400 ml-1">days</span></h3>
                                                    <p className="text-[10px] font-bold text-slate-500 mt-1">Avg Time to Onboard</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 3. L&D */}
                                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Development</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">{stats.lnd?.overallCompletion}%</h3>
                                                    <p className="text-[10px] font-bold text-slate-500 mt-1">Compliance Rate</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 4. Engagement */}
                                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                                                        <TrendingUp className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Engagement</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">{stats.engagement?.participation}%</h3>
                                                    <p className="text-[10px] font-bold text-slate-500 mt-1">Participation Score</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 5. Probation */}
                                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group ring-1 ring-rose-100 bg-rose-50/30">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                                                        <AlertTriangle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-rose-400 tracking-widest">Probation</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-rose-600">{stats.probation?.highRisk || 3}</h3>
                                                    <p className="text-[10px] font-bold text-rose-600/80 mt-1">High Risk Cases</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 6. Exit */}
                                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                                                        <Briefcase className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Attrition</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">4.2%</h3>
                                                    <p className="text-[10px] font-bold text-slate-500 mt-1">Annualized Rate</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Charts Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card className="shadow-sm border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-base font-semibold text-slate-800">Recruitment Funnel</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={stats.recruitment?.pipeline} layout="vertical" margin={{ left: 20 }}>
                                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="stage" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} />
                                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                            <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={30}>
                                                                {stats.recruitment?.pipeline.map((_entry: any, index: number) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="shadow-sm border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-base font-semibold text-slate-800">Hiring Sources</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={stats.recruitment?.sources}
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={60}
                                                                outerRadius={100}
                                                                fill="#8884d8"
                                                                paddingAngle={5}
                                                                dataKey="value"
                                                            >
                                                                {stats.recruitment?.sources.map((_entry: any, index: number) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div className="flex justify-center flex-wrap gap-4 mt-4">
                                                        {stats.recruitment?.sources.map((entry: any, index: number) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                                <span className="text-xs text-slate-600">{entry.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'recruitment' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="shadow-md border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Group Hiring Velocity</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="hiring" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#4f46e5', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="shadow-sm border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-base font-semibold text-slate-800">Unified Recruitment Funnel</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={groupData}>
                                                            <defs>
                                                                <linearGradient id="colorHiring" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                                            <YAxis />
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <Tooltip />
                                                            <Area type="monotone" dataKey="hiring" stroke="#4f46e5" fillOpacity={1} fill="url(#colorHiring)" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Recruitment Funnel</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={stats.recruitment?.pipeline} layout="vertical" margin={{ left: 20 }}>
                                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                                        <XAxis type="number" hide />
                                                        <YAxis dataKey="stage" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} />
                                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                        <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={30}>
                                                            {stats.recruitment?.pipeline.map((_entry: any, index: number) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Hiring Sources</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={stats.recruitment?.sources}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={100}
                                                            fill="#8884d8"
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {stats.recruitment?.sources.map((_entry: any, index: number) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'lnd' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="shadow-md border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <CardTitle className="text-base font-semibold text-slate-800">Group Training Completion Rate</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                            <Bar dataKey="engagement" fill="#10b981" radius={[4, 4, 0, 0]} barSize={35} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle className="text-base font-semibold text-slate-800">Training Completion by Dept</CardTitle>
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">CBSE Mandate: 94%</Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={stats.lnd?.deptPerformance}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                        <Bar dataKey="completion" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={35} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Skill Development Hours</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={stats.lnd?.deptPerformance}>
                                                        <defs>
                                                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip />
                                                        <Area type="monotone" dataKey="hours" stroke="#10b981" fillOpacity={1} fill="url(#colorHours)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'performance' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="shadow-md border-amber-100 bg-gradient-to-br from-white to-amber-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Group Average Ratings</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="engagement" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#f59e0b', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Performance Bell Curve</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={stats.performance?.bellCurve}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="p-5 border-slate-100 bg-violet-50/50 flex flex-col justify-center items-center text-center">
                                            <h4 className="text-4xl font-black text-violet-700">{stats.performance?.appraisalsCompleted}%</h4>
                                            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mt-2">Appraisals Completed</p>
                                        </Card>
                                        <Card className="p-5 border-slate-100 bg-amber-50/50 flex flex-col justify-center items-center text-center">
                                            <h4 className="text-4xl font-black text-amber-600">{stats.performance?.avgRating}</h4>
                                            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-2">Average Rating</p>
                                        </Card>
                                        <Card className="p-5 border-slate-100 bg-emerald-50/50 flex flex-col justify-center items-center text-center">
                                            <h4 className="text-4xl font-black text-emerald-600">{stats.performance?.topPerformers}</h4>
                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-2">Top Performers</p>
                                        </Card>
                                        <Card className="p-5 border-slate-100 bg-rose-50/50 flex flex-col justify-center items-center text-center">
                                            <h4 className="text-4xl font-black text-rose-600">{stats.performance?.pipCases}</h4>
                                            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mt-2">PIP Cases</p>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'engagement' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="shadow-md border-blue-100 bg-gradient-to-br from-white to-blue-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Group Engagement Scores</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="engagement" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#3b82f6', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Engagement Mix</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={stats.engagement?.categories}
                                                            innerRadius={60}
                                                            outerRadius={100}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {stats.engagement?.categories.map((_entry: any, index: number) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="flex justify-center gap-4 mt-2">
                                                {stats.engagement?.categories.map((entry: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                        <span className="text-xs text-slate-500">{entry.type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="p-4 border-slate-100 bg-indigo-50/30">
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">eNPS Score</p>
                                            <h4 className="text-2xl font-black text-indigo-900 mt-2">{stats.engagement?.eNPS}</h4>
                                            <p className="text-[10px] text-indigo-500 mt-1">Excellent Range</p>
                                        </Card>
                                        <Card className="p-4 border-slate-100 bg-emerald-50/30">
                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Mood Score</p>
                                            <h4 className="text-2xl font-black text-emerald-900 mt-2">{stats.engagement?.moodScore}</h4>
                                            <p className="text-[10px] text-emerald-500 mt-1">Out of 10</p>
                                        </Card>
                                        <Card className="p-4 border-slate-100 bg-amber-50/30">
                                            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Participation</p>
                                            <h4 className="text-2xl font-black text-amber-900 mt-2">{stats.engagement?.participation}%</h4>
                                            <p className="text-[10px] text-amber-500 mt-1">Across all surveys</p>
                                        </Card>
                                        <Card className="p-4 border-slate-100 bg-rose-50/30">
                                            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Wellness Level</p>
                                            <h4 className="text-2xl font-black text-rose-900 mt-2">High</h4>
                                            <p className="text-[10px] text-rose-500 mt-1">Based on survey results</p>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'onboarding' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="shadow-md border-violet-100 bg-gradient-to-br from-white to-violet-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-base font-semibold text-slate-800">Group Onboarding Days</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                                                                cursor={{ fill: '#f1f5f9' }}
                                                            />
                                                            <Bar dataKey="hiring" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Avg Onboarding Days by Dept</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={stats.onboarding?.stageBreakdown}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                                                            cursor={{ fill: '#f1f5f9' }}
                                                        />
                                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'probation' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="shadow-sm border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Group Probation SLA Compliance</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="engagement" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#10b981', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Probation Outcomes Trend</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={stats.probation?.trend}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip />
                                                        <Line type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                                                        <Line type="monotone" dataKey="extended" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="flex justify-center gap-6 mt-4">
                                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-xs text-slate-600">Confirmed</span></div>
                                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="text-xs text-slate-600">Extended</span></div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Risk Profile</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-end border-b pb-4 border-slate-50">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">High Risk Cases</p>
                                                        <h4 className="text-3xl font-black text-rose-600 mt-1">03</h4>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="text-rose-600 border-rose-100 hover:bg-rose-50">View List</Button>
                                                </div>
                                                <div className="flex justify-between items-end border-b pb-4 border-slate-50">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">SLA Compliance</p>
                                                        <h4 className="text-3xl font-black text-emerald-600 mt-1">98%</h4>
                                                    </div>
                                                    <span className="text-xs text-emerald-500 font-bold mb-1">Target: 95%</span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Time to Confirm</p>
                                                        <h4 className="text-3xl font-black text-indigo-900 mt-1">180</h4>
                                                        <p className="text-xs text-slate-500">Days</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'exit' && (
                        <>
                            {viewMode === 'Group' ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="shadow-md border-rose-100 bg-gradient-to-br from-white to-rose-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-semibold text-slate-700">Group Attrition Rate</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[300px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={groupData} layout="vertical">
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="attrition" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#ef4444', fontSize: 10 }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Attrition vs Retention Trend</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={attritionData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                                        <YAxis hide />
                                                        <Tooltip />
                                                        <Area type="monotone" dataKey="tenure" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                                                        <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm border-slate-200">
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold text-slate-800">Primary Exit Reasons</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Higher Studies', val: 45, color: 'bg-indigo-500' },
                                                    { label: 'Better Opportunity', val: 30, color: 'bg-emerald-500' },
                                                    { label: 'Personal Reasons', val: 15, color: 'bg-amber-500' },
                                                    { label: 'Relocation', val: 10, color: 'bg-slate-400' },
                                                ].map((item, i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between text-xs font-bold text-slate-600">
                                                            <span>{item.label}</span>
                                                            <span>{item.val}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                            <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TalentDashboard;
