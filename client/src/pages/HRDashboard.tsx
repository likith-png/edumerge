import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Layout from '../components/Layout';
import {
    Calendar, Clock, ChevronRight, FileText, AlertCircle,
    TrendingUp, UserMinus, Activity, Filter, CheckCircle, LogOut, ShieldAlert, FileWarning, Send, Users2,
    ArrowRight, Bell, Zap, Search, Download, Trash2, Edit, Eye, UserCheck, TrendingDown, Clipboard, ListChecks, Smartphone
} from 'lucide-react';
import { getAllExits, getNOCRequests } from '../services/exitService';
import { getAllEmployees } from '../services/employeeService';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';

// ─── Design System Constants ──────────────────────────────────────────────────
const DS = {
    primary: '#003f98',
    primaryGrad: 'linear-gradient(135deg, #003f98 0%, #1a56be 100%)',
    success: '#1a7f4b',
    error: '#c62828',
    warning: '#b45309',
    amber: '#fe9b01',
    blue: '#3b82f6',
    slate: '#445579',
    bgLow: '#f8f9ff',
    border: 'rgba(194,208,232,0.40)',
};

// ─── Helper Components ────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, actions }: { icon: any; title: string; subtitle?: string; actions?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#003f98] to-[#1a56be] rounded-lg shadow-md shadow-blue-500/20">
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

const KPICard = ({ label, value, sub, color, icon: Icon, trend, trendValue }: { label: string; value: string | number; sub?: string; color: string; icon: any; trend?: 'up' | 'down' | 'neutral', trendValue?: string }) => (
    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-2xl font-black ${color} leading-none tracking-tight`}>{value}</p>
                    {sub && <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>}
                </div>
                <div className={`p-2.5 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-50').replace('-700', '-50')}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
            </div>
            {trend && (
                <div className={`flex items-center gap-1 mt-3 text-[10px] font-bold ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                    {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                    <span>{trendValue || (trend === 'up' ? '+2 from last month' : trend === 'down' ? '-1 from last month' : 'No change')}</span>
                </div>
            )}
        </CardContent>
    </Card>
);

const HRDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [exits, setExits] = useState<any[]>([]);
    const [stats, setStats] = useState({
        pendingApprovals: 0,
        nocDelays: 0,
        totalExitsMonth: 0,
        attritionRate: 0,
        trends: [0, 0, 0, 0, 0, 0, 0] as number[]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [exitResponse, employeeResponse, nocResponse] = await Promise.all([
                getAllExits(),
                getAllEmployees(),
                getNOCRequests()
            ]);

            const allExits = exitResponse.data || [];
            const allEmployees = employeeResponse.data || [];
            const allNOCs = nocResponse.data || [];

            setExits(allExits);

            const pending = allExits.filter((e: any) => e.status === 'Pending').length;
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const totalMonth = allExits.filter((e: any) => {
                const date = new Date(e.resignation_date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length;

            const overdueNOCs = allNOCs.filter((n: any) => n.status === 'Pending').length;

            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const exitsLastYear = allExits.filter((e: any) => new Date(e.resignation_date) > oneYearAgo).length;
            const attrition = allEmployees.length > 0 ? ((exitsLastYear / allEmployees.length) * 100).toFixed(1) : 0;

            const trends = Array(7).fill(0);
            const now = new Date();
            allExits.forEach((e: any) => {
                const exitDate = new Date(e.resignation_date);
                const diffWeeks = Math.floor((now.getTime() - exitDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
                if (diffWeeks >= 0 && diffWeeks < 7) {
                    trends[6 - diffWeeks]++;
                }
            });

            setStats({
                pendingApprovals: pending,
                nocDelays: overdueNOCs,
                totalExitsMonth: totalMonth,
                attritionRate: Number(attrition),
                trends: trends
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived Data
    const upcomingExits = exits
        .filter((e: any) => {
            if (!e.lwd_proposed) return false;
            const diffDays = Math.ceil((new Date(e.lwd_proposed).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 30;
        })
        .sort((a: any, b: any) => new Date(a.lwd_proposed).getTime() - new Date(b.lwd_proposed).getTime())
        .slice(0, 3)
        .map((e: any) => ({
            id: e.id,
            name: e.employee_name || 'Unknown',
            dept: e.department || 'General',
            status: 'LWD',
            date: new Date(e.lwd_proposed).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            avatarColor: 'bg-blue-100 text-[#003f98]'
        }));

    const recentResignations = [...exits]
        .sort((a: any, b: any) => new Date(b.resignation_date).getTime() - new Date(a.resignation_date).getTime())
        .slice(0, 5);

    const todaySchedule = [
        { id: 1, time: "09:30 AM", title: "Exit Interview: Ms. Reshma Binu Prasad", type: "Interview", color: "bg-emerald-50 border-emerald-500 text-emerald-700" },
        { id: 2, time: "11:00 AM", title: "Asset Handover: Ms. Sanchaiyata Majumdar", type: "Handover", color: "bg-amber-50 border-amber-500 text-amber-700" },
        { id: 3, time: "02:00 PM", title: "Final Settlement Review", type: "Finance", color: "bg-blue-50 border-blue-500 text-blue-700" },
    ];

    const documentExpiries = [
        { id: 1, name: "Dr. R Sedhunivas", type: "Work Visa", expires: "14 Days", severity: "high" },
        { id: 2, name: "Dr. Ranjita Saikia", type: "First Aid Certification", expires: "30 Days", severity: "medium" },
        { id: 3, name: "Mr. Manjit Singh", type: "Medical License", expires: "45 Days", severity: "low" },
    ];

    const handleSendReminder = (e: React.MouseEvent, docId: number) => {
        e.stopPropagation();
        alert(`Reminder sent successfully to employee for document ID: ${docId}`);
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#003f98] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-slate-600 font-medium">Loading Dashboard…</p>
            </div>
        </div>
    );

    return (
        <Layout
            title="HR Intelligence"
            description="Operational governance & workforce stability metrics"
            icon={Activity}
            showHome
        >
            <div className="max-w-[1600px] mx-auto">
                {/* KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <KPICard 
                        label="Exits This Month" 
                        value={stats.totalExitsMonth} 
                        sub="Current active notices" 
                        color="text-red-600" 
                        icon={UserMinus} 
                        trend="up" 
                        trendValue="+2 from last month" 
                    />
                    <KPICard 
                        label="Pending Approvals" 
                        value={stats.pendingApprovals} 
                        sub="Awaiting HR/Principal" 
                        color="text-amber-600" 
                        icon={Clock} 
                        trend="down" 
                        trendValue="-4 vs yesterday"
                    />
                    <KPICard 
                        label="NOC Clearance Delays" 
                        value={stats.nocDelays} 
                        sub="Flagged bottlenecks" 
                        color="text-emerald-600" 
                        icon={CheckCircle} 
                        trend="neutral" 
                    />
                    <KPICard 
                        label="Annual Attrition" 
                        value={`${stats.attritionRate}%`} 
                        sub="Industry benchmark: 12%" 
                        color="text-[#003f98]" 
                        icon={TrendingUp} 
                        trend="up" 
                        trendValue="↑ 0.4% YoY"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: Operations */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Weekly Trends Chart (Refined) */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">Weekly Exit Volume Trend</h3>
                                    </div>
                                    <Badge className="bg-white text-slate-500 border border-slate-200 font-bold text-[10px]">LAST 7 WEEKS</Badge>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-end justify-between gap-6 h-[200px]">
                                        {stats.trends.map((h, i) => {
                                            const maxVal = Math.max(...stats.trends, 1);
                                            const heightPercentage = (h / maxVal) * 100;
                                            return (
                                                <div key={i} className="flex-1 group relative">
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                                        {h} exits
                                                    </div>
                                                    <div className="w-full bg-slate-50 rounded-t-lg flex flex-col justify-end overflow-hidden h-[200px] border-x border-t border-slate-100">
                                                        <div
                                                            className="bg-gradient-to-t from-[#003f98] to-[#1a56be] transition-all duration-700 ease-out rounded-t-sm"
                                                            style={{ height: `${heightPercentage}%` }}
                                                        />
                                                    </div>
                                                    <div className="mt-3 text-center">
                                                        <span className="text-[10px] font-bold text-slate-400">WK {i + 1}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Two column sub-grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Upcoming Exits */}
                            <Card className="border-none shadow-sm ring-1 ring-slate-100">
                                <CardContent className="p-0">
                                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                            <LogOut className="h-4 w-4 text-blue-500" /> Upcoming LWDs
                                        </h3>
                                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-blue-600 hover:bg-blue-50" onClick={() => navigate('/exit')}>
                                            MANAGE ALL
                                        </Button>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {upcomingExits.length > 0 ? upcomingExits.map((exit: any) => (
                                            <div key={exit.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/exit')}>
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${exit.avatarColor} shadow-sm`}>
                                                    {exit.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-800 truncate leading-none mb-1">{exit.name}</h4>
                                                    <p className="text-[10px] font-medium text-slate-400">{exit.dept}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[11px] font-black text-slate-700">{exit.date}</p>
                                                    <p className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">FINAL DAY</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 opacity-60">
                                                <LogOut className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                                                <p className="text-xs font-medium">No exits scheduled in 30d</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Today's Schedule */}
                            <Card className="border-none shadow-sm ring-1 ring-slate-100">
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-indigo-500" /> Exit Ops Schedule
                                    </h3>
                                    <div className="space-y-5">
                                        {todaySchedule.map((task) => (
                                            <div key={task.id} className="flex gap-4 group">
                                                <div className="w-16 pt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.time}</div>
                                                <div className="flex-1 pl-4 border-l-2 border-slate-100 group-hover:border-blue-500 transition-colors">
                                                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{task.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${task.color.split(' ').slice(0, 2).join(' ')}`}>
                                                            {task.type}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-300">Room 4B</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Compliance & Archives */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Compliance Alerts */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-amber-500" /> Compliance Monitor
                                    </h3>
                                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">3 ALERTS</Badge>
                                </div>
                                <div className="space-y-3">
                                    {documentExpiries.map((doc) => (
                                        <div key={doc.id} className="p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-slate-800 truncate">{doc.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.type}</p>
                                                </div>
                                                <Badge variant={doc.severity === 'high' ? 'destructive' : 'secondary'} className="text-[9px] font-black px-1.5 py-0">
                                                    {doc.expires}
                                                </Badge>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-7 text-[10px] font-black w-full border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors" onClick={(e) => handleSendReminder(e, doc.id)}>
                                                <Send className="h-3 w-3 mr-1.5" /> SEND REMINDER
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Directory Highlights */}
                        <Card className="border-none shadow-sm ring-1 ring-slate-100">
                            <CardContent className="p-4">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Recent Processed Exits</h3>
                                <div className="space-y-2">
                                    {recentResignations.map((res: any) => (
                                        <div key={res.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                <span className="text-[11px] font-bold text-slate-700">{res.employee_name}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">SUCCESS</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-4 h-9 text-xs font-bold text-slate-500 hover:text-[#003f98] hover:bg-blue-50 group" onClick={() => navigate('/exit')}>
                                    EXPLORE EXIT DIRECTORY <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Retention Nudge */}
                        <div className="bg-gradient-to-br from-[#003f98] to-[#1a56be] rounded-2xl p-5 shadow-lg shadow-blue-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                            <Activity className="h-6 w-6 text-white/40 mb-3" />
                            <h4 className="text-white font-black text-sm mb-1 leading-tight">Retention Insights</h4>
                            <p className="text-white/70 text-[10px] font-medium leading-relaxed mb-4">
                                Attrition in Science Dept is 14% higher than group average. Review HOD feedback reports.
                            </p>
                            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-none h-8 text-[10px] font-black backdrop-blur-sm">
                                VIEW ANALYTICS
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HRDashboard;
