import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Calendar, Clock, ChevronRight, FileText, AlertCircle, ArrowLeft,
    TrendingUp, UserMinus, Activity, Filter, CheckCircle, LogOut, ShieldAlert, FileWarning, Send
} from 'lucide-react';
import { getAllExits } from '../services/exitService';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
// import { Progress } from '../components/ui/progress';

const HRDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [exits, setExits] = useState<any[]>([]);
    const [stats, setStats] = useState({
        pendingApprovals: 0,
        nocDelays: 0,
        totalExitsMonth: 0,
        attritionRate: 12.5 // Mock data
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getAllExits();
            const allExits = response.data || [];
            setExits(allExits);

            const pending = allExits.filter((e: any) => e.status === 'Pending').length;
            const currentMonth = new Date().getMonth();
            const totalMonth = allExits.filter((e: any) => {
                const date = new Date(e.resignation_date);
                return date.getMonth() === currentMonth;
            }).length;

            setStats(prev => ({
                ...prev,
                pendingApprovals: pending,
                totalExitsMonth: totalMonth
            }));
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
            avatarColor: 'bg-indigo-100 text-indigo-700'
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
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-8 font-sans animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white/50 hover:bg-white shadow-sm ring-1 ring-slate-200/50">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">HR Dashboard</h1>
                        <p className="text-slate-500 font-medium">Overview of Exit Management & Attrition Trends</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-slate-200 text-slate-600 font-bold hover:bg-white">
                        <Calendar className="w-4 h-4 mr-2" /> {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200">
                        <FileText className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                </div>
            </header>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-none shadow-sm bg-white/60 backdrop-blur-xl hover:bg-white hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-rose-50 rounded-2xl group-hover:bg-rose-100 transition-colors">
                                <UserMinus className="w-6 h-6 text-rose-600" />
                            </div>
                            <Badge className="bg-rose-100 text-rose-700 border-none px-2 py-0.5">+2.4%</Badge>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.totalExitsMonth}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exits This Month</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/60 backdrop-blur-xl hover:bg-white hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 border-none px-2 py-0.5">Action Req</Badge>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.pendingApprovals}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/60 backdrop-blur-xl hover:bg-white hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                                <Activity className="w-6 h-6 text-indigo-600" />
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5">-0.5%</Badge>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.attritionRate}%</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Attrition</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-slate-900 text-white hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300">
                    <CardContent className="p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-20"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <Clock className="w-6 h-6 text-indigo-300" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black mb-1">5</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Settlement Days</p>
                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-indigo-300">
                                <span>Target: 7 Days</span> <CheckCircle className="w-3 h-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Masonry Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Lists & Tasks */}
                <div className="space-y-6">
                    {/* Upcoming Exits */}
                    <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl hover:shadow-md transition-all duration-300">
                        <CardHeader className="pb-2 border-b border-slate-100/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <LogOut className="w-4 h-4 text-indigo-500" /> Upcoming Exits
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-indigo-600 hover:bg-indigo-50" onClick={() => navigate('/exit')}>
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100/50">
                                {upcomingExits.length > 0 ? upcomingExits.map((exit: any) => (
                                    <div key={exit.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors cursor-pointer group" onClick={() => navigate('/exit')}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm transition-transform group-hover:scale-105 ${exit.avatarColor}`}>
                                            {exit.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{exit.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium truncate">{exit.dept}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <Badge variant="outline" className="bg-slate-100 border-none text-slate-600 font-bold mb-1 block">
                                                {exit.date}
                                            </Badge>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LWD</span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-slate-400 text-center py-8 font-medium">No upcoming exits</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Actions */}
                    <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="bg-rose-50/50 pb-4 border-b border-rose-100/50">
                            <CardTitle className="text-sm font-bold text-rose-900 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-500" /> Attention Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 hover:bg-rose-50/30 cursor-pointer transition-colors border-b border-slate-50 flex items-center justify-between" onClick={() => navigate('/exit?tab=approvals')}>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                    <span className="text-sm font-bold text-slate-700">Pending Resignation Approvals</span>
                                </div>
                                <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none">{stats.pendingApprovals}</Badge>
                            </div>
                            <div className="p-4 hover:bg-rose-50/30 cursor-pointer transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    <span className="text-sm font-bold text-slate-700">Overdue NOC Clearances</span>
                                </div>
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">3</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Document Expiry Alerts Widget */}
                    <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl hover:shadow-md transition-all duration-300">
                        <CardHeader className="pb-3 border-b border-slate-100/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-purple-600" /> Compliance Expirations
                                </CardTitle>
                                <Badge className="bg-purple-100 text-purple-700 border-none">{documentExpiries.length}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100/50">
                                {documentExpiries.map((doc) => (
                                    <div key={doc.id} className="p-4 hover:bg-slate-50/80 transition-colors group flex items-center gap-4">
                                        <div className={`p-2 rounded-lg 
                                            ${doc.severity === 'high' ? 'bg-rose-50 text-rose-600' :
                                                doc.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}
                                        `}>
                                            <FileWarning className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                                            <p className="text-xs font-semibold text-slate-500 truncate">{doc.type}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                                                ${doc.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                                                    doc.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}
                                            `}>
                                                in {doc.expires}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-[10px] bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 rounded transition-colors"
                                                onClick={(e) => handleSendReminder(e, doc.id)}
                                            >
                                                <Send className="w-3 h-3 mr-1" /> Reminder
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2: Visualizations */}
                <div className="space-y-6">
                    {/* Attrition Trends Graph */}
                    <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl h-[420px] flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Attrition Trends
                                </CardTitle>
                                <Button variant="outline" size="sm" className="h-7 text-xs bg-white border-slate-200">
                                    <Filter className="w-3 h-3 mr-1" /> Monthly
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-end justify-between gap-3 p-6 pt-0">
                            {[45, 60, 35, 75, 50, 80, 55].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer h-full">
                                    <div className="relative w-full rounded-2xl bg-slate-100 overflow-hidden h-[85%]">
                                        <div
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500 ease-out group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:shadow-lg group-hover:shadow-indigo-500/20 rounded-t-lg"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                                                {h} Exits
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-center text-slate-400 mt-3 uppercase tracking-wider">W{i + 1}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Column 3: Schedule & Recent List */}
                <div className="space-y-6">
                    {/* Today Schedule */}
                    <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                        <CardHeader className="pb-4 border-b border-slate-100/50">
                            <CardTitle className="text-base font-bold text-slate-900 flex justify-between items-center">
                                <span>Today's Schedule</span>
                                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">{new Date().toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="relative p-6">
                                {/* Timeline Line */}
                                <div className="absolute left-[4.5rem] top-6 bottom-6 w-px bg-slate-200 border-l border-dashed border-slate-300/50"></div>

                                <div className="space-y-6">
                                    {todaySchedule.map((task) => (
                                        <div key={task.id} className="flex relative group">
                                            <div className="w-14 pt-2.5 text-xs font-bold text-slate-400 text-right pr-4">{task.time}</div>
                                            <div className="absolute left-[4.25rem] top-3 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm z-10 group-hover:scale-125 transition-transform"></div>
                                            <div className={`flex-1 p-3 rounded-xl border-l-[3px] shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer bg-white/50 hover:bg-white hover:shadow-md ${task.color}`}>
                                                <h4 className="font-bold text-sm text-slate-800">{task.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{task.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Resignations */}
                    <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-900">Recent Resignations</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100/50">
                                {recentResignations.map((res: any) => (
                                    <div key={res.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                {res.employee_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{res.employee_name}</div>
                                                <div className="text-[10px] font-medium text-slate-500 uppercase">{res.department || 'Gen'}</div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`border-none font-bold ${res.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                            {res.status}
                                        </Badge>
                                    </div>
                                ))}
                                {recentResignations.length === 0 && (
                                    <div className="p-6 text-center text-xs text-slate-400 font-medium">No recent activity</div>
                                )}
                            </div>
                            <Button variant="ghost" className="w-full text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 h-10 border-t border-slate-100/50 rounded-t-none rounded-b-xl" onClick={() => navigate('/exit')}>
                                View All Activity <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
