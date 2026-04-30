import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Layout from '../components/Layout';
import {
    Calendar, Clock, ChevronRight, FileText, AlertCircle,
    TrendingUp, UserMinus, Activity, Filter, CheckCircle, LogOut, ShieldAlert, FileWarning, Send, BrainCircuit, Zap, Users2
} from 'lucide-react';
import { getAllExits, getNOCRequests } from '../services/exitService';
import { getAllEmployees } from '../services/employeeService';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';

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
            avatarColor: 'bg-blue-100 text-blue-700'
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
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-slate-600">Loading…</p>
            </div>
        </div>
    );    return (
        <Layout
            title="HR Dashboard"
            description="Overview of Exit Management & Attrition Trends"
            icon={Activity}
            showHome
        >
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <UserMinus className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Exits This Month</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.totalExitsMonth}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.pendingApprovals}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">NOC Clearance Delays</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.nocDelays}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Annual Attrition</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.attritionRate}%</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Column 1: Lists & Tasks */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <LogOut className="h-4 w-4 text-blue-500" /> Upcoming Exits
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600" onClick={() => navigate('/exit')}>
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {upcomingExits.length > 0 ? upcomingExits.map((exit: any) => (
                                    <div key={exit.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/exit')}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${exit.avatarColor}`}>
                                            {exit.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-900 truncate">{exit.name}</h4>
                                            <p className="text-xs text-slate-500">{exit.dept}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="text-[10px] font-medium bg-slate-50">
                                                {exit.date}
                                            </Badge>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 opacity-60">
                                        <LogOut className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                                        <p className="text-xs">No upcoming exits</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader className="py-4 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-indigo-500" /> ICIS Usage Index
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-3xl font-bold text-slate-900">84.2%</span>
                                    <span className="text-xs font-medium text-emerald-600">+4.2% week</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>System Adoption</span>
                                        <span>76%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '76%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2: Trends & Analytics */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-slate-200 h-[450px] flex flex-col">
                        <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-500" /> Weekly Exit Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-end justify-between gap-4 p-8">
                            {stats.trends.map((h, i) => {
                                const maxVal = Math.max(...stats.trends, 1);
                                const heightPercentage = (h / maxVal) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full bg-slate-50 rounded-md flex flex-col justify-end overflow-hidden h-[250px] border border-slate-100">
                                            <div
                                                className="bg-slate-900 transition-all duration-500"
                                                style={{ height: `${heightPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400">W{i + 1}</span>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader className="py-4 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold">Today's Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {todaySchedule.map((task) => (
                                    <div key={task.id} className="flex gap-4">
                                        <div className="w-16 pt-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.time}</div>
                                        <div className="flex-1 pl-4 border-l-2 border-slate-200">
                                            <h4 className="text-sm font-semibold text-slate-800">{task.title}</h4>
                                            <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] font-bold uppercase tracking-wider ${task.color.split(' ').slice(0, 2).join(' ')}`}>
                                                {task.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 3: Maintenance & Archives */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader className="py-4 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-amber-500" /> Compliance Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {documentExpiries.map((doc) => (
                                <div key={doc.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                                            <p className="text-[10px] text-slate-500">{doc.type}</p>
                                        </div>
                                        <Badge variant={doc.severity === 'high' ? 'destructive' : 'secondary'} className="text-[9px]">
                                            {doc.expires}
                                        </Badge>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px] w-full" onClick={(e) => handleSendReminder(e, doc.id)}>
                                        <Send className="h-3 w-3 mr-1" /> Send Reminder
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader className="py-4 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold">Recent Exits</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {recentResignations.map((res: any) => (
                                    <div key={res.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                                        <span className="font-medium text-slate-700">{res.employee_name}</span>
                                        <span className="text-slate-400">Processed</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 h-8 text-xs text-slate-500" onClick={() => navigate('/exit')}>
                                View Directory <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
;
};

export default HRDashboard;
