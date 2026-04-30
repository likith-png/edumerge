import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
    Calendar, Clock, CheckCircle, FileText, ShieldAlert, Briefcase, 
    ChevronRight, MoreHorizontal, UserMinus, BarChart, ArrowRight,
    TrendingUp, ShieldCheck, Activity, Users, ClipboardCheck,
    CheckCircle2, XCircle, AlertTriangle, MessageSquare, Shield
} from 'lucide-react';
import { getExitDetails, getHandoverItems, getExitInterview } from '../../services/exitService';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

interface ExitDashboardProps {
    setActiveTab: (tab: string) => void;
    activeExit?: any;
    viewMode?: 'Faculty' | 'Admin' | 'Manager';
    allExits?: any[];
}

const ExitDashboard: React.FC<ExitDashboardProps> = ({ setActiveTab, activeExit, viewMode = 'Faculty', allExits = [] }) => {
    const [nocData, setNocData] = useState<any[]>([]);
    const [handoverStatus, setHandoverStatus] = useState({ total: 0, completed: 0 });
    const [interviewStatus, setInterviewStatus] = useState<boolean>(false);

    useEffect(() => {
        if (activeExit?.id) {
            fetchDashboardData();
        }
    }, [activeExit]);

    const fetchDashboardData = async () => {
        try {
            const exitDetails = await getExitDetails(activeExit.id);
            if (exitDetails.noc) setNocData(exitDetails.noc);

            const handoverItems = await getHandoverItems(activeExit.id);
            if (handoverItems.data) {
                const total = handoverItems.data.length;
                const completed = handoverItems.data.filter((i: any) => i.status === 'Completed').length;
                setHandoverStatus({ total, completed });
            }

            const interviewData = await getExitInterview(activeExit.id);
            if (interviewData.data && interviewData.data.some((q: any) => q.answer && q.answer.length > 0)) {
                setInterviewStatus(true);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    const calculateDaysLeft = () => {
        if (!activeExit?.lwd_proposed) return 0;
        const lwd = new Date(activeExit.lwd_approved || activeExit.lwd_proposed);
        const today = new Date();
        const diffTime = Math.abs(lwd.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return lwd > today ? diffDays : 0;
    };

    const daysLeft = calculateDaysLeft();
    const overallProgress = Math.round(
        ((nocData.filter(ip => ip.status === 'Cleared').length + handoverStatus.completed + (interviewStatus ? 1 : 0)) /
            (Math.max(nocData.length, 1) + Math.max(handoverStatus.total, 1) + 1)) * 100
    ) || 0;

    const upcomingEvents = [];
    if (activeExit?.meeting_status === 'Pending') {
        upcomingEvents.push({ title: "1:1 Exit Meeting", time: "Pending Scheduling", type: "MEET" });
    }
    if (!interviewStatus && activeExit?.status === 'Approved') {
        upcomingEvents.push({ title: "Exit Interview", time: "Available", type: "TASK" });
    }
    if (handoverStatus.completed < handoverStatus.total) {
        upcomingEvents.push({ title: "Asset Handover", time: "In Progress", type: "HAND" });
    }
    if (activeExit?.status === 'Approved') {
        upcomingEvents.push({ title: "Final Settlement", time: activeExit.lwd_approved ? new Date(activeExit.lwd_approved).toLocaleDateString() : "TBD", type: "FIN" });
    }

    // HR Admin Dashboard View
    if (viewMode === 'Admin' || viewMode === 'Manager') {
        const activeExits = allExits.filter(e => ['Pending', 'Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status));
        const pendingApprovals = allExits.filter(e => e.status === 'Pending' || e.status === 'Manager_Approved').length;
        const completedExits = allExits.filter(e => e.status === 'Completed').length;

        const avgNoticePeriod = activeExits.length > 0
            ? Math.round(activeExits.reduce((sum, e) => {
                if (e.lwd_proposed) {
                    const lwd = new Date(e.lwd_proposed);
                    const submitted = new Date(e.submission_date || Date.now());
                    const diff = Math.abs(lwd.getTime() - submitted.getTime());
                    return sum + Math.ceil(diff / (1000 * 60 * 60 * 24));
                }
                return sum;
            }, 0) / activeExits.length)
            : 0;

        const totalEmployees = 150; 
        const attritionRate = ((allExits.length / totalEmployees) * 100).toFixed(1);

        const workflowStages = [
            { label: 'Initiated', count: allExits.filter(e => e.status === 'Pending').length, color: 'bg-indigo-600' },
            { label: 'Pre-Approval (1:1)', count: allExits.filter(e => e.meeting_status === 'Pending').length, color: 'bg-emerald-600' },
            { label: 'Approved & Active', count: allExits.filter(e => ['Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status)).length, color: 'bg-sky-600' },
            { label: 'Clearance Pipeline', count: allExits.filter(e => e.status === 'Approved').length, color: 'bg-violet-600' },
            { label: 'F&F & Completed', count: completedExits, color: 'bg-indigo-950' },
        ];

        const deptBreakdown: { [key: string]: number } = {};
        allExits.forEach(e => {
            const dept = e.department || 'Unknown';
            deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
        });

        const recentActivity = allExits.slice(0, 5).map(e => ({
            employee: e.employee_name,
            action: `Protocol: ${e.status}`,
            time: e.submission_date ? new Date(e.submission_date).toLocaleDateString() : 'Active',
            status: e.status
        }));

        return (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 p-2">
                {/* Administrative Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Ongoing Departures', value: activeExits.length, icon: UserMinus, color: 'text-blue-600', bgColor: 'bg-blue-50', badge: 'Active' },
                        { label: 'Pending Validations', value: pendingApprovals, icon: ClipboardCheck, color: 'text-orange-600', bgColor: 'bg-orange-50', badge: 'Action Required' },
                        { label: 'Avg Notice Days', value: avgNoticePeriod, icon: Clock, color: 'text-emerald-600', bgColor: 'bg-emerald-50', badge: 'Policy Avg' },
                        { label: 'Attrition Metric', value: `${attritionRate}%`, icon: TrendingUp, color: 'text-rose-600', bgColor: 'bg-rose-50', badge: 'Risk Index' }
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                            <div className="p-8 flex flex-col justify-between h-full bg-slate-50/10">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 ${stat.bgColor} ${stat.color} rounded-lg border border-slate-100 shadow-sm`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <Badge className="bg-slate-900 text-white font-bold text-[8px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">{stat.badge}</Badge>
                                </div>
                                <div className="mt-8 space-y-1">
                                    <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Workflow Funnel & Department Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-900 rounded-lg shadow-sm">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Workflow Progress</h3>
                            </div>
                            <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[8px] uppercase tracking-wider px-3 py-1 rounded-full">Pipeline Stats</Badge>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            {workflowStages.map((stage, idx) => {
                                const maxCount = Math.max(...workflowStages.map(s => s.count), 1);
                                const widthPercent = (stage.count / maxCount) * 100;
                                return (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-600">{stage.label}</span>
                                            <span className="text-slate-400">{stage.count} Records</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                            <div
                                                className={`h-full ${stage.color.replace('indigo-600', 'blue-600').replace('emerald-600', 'emerald-500').replace('sky-600', 'sky-500').replace('violet-600', 'violet-500').replace('indigo-950', 'slate-800')} rounded-full transition-all duration-700 ease-out`}
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-900 rounded-lg shadow-sm">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Departmental Analysis</h3>
                            </div>
                            <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[8px] uppercase tracking-wider px-3 py-1 rounded-full">Impact Matrix</Badge>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            {Object.entries(deptBreakdown).map(([dept, count], idx) => {
                                const total = allExits.length || 1;
                                const percentage = ((count / total) * 100).toFixed(0);
                                const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-violet-500'];
                                return (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-600">{dept}</span>
                                            <span className="text-slate-400">{percentage}% Impact</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-700 ease-out`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Validation Pipeline Table */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg shadow-sm">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Separation Logs</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Validated record archives</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setActiveTab('approvals')} className="h-11 bg-white border-slate-200 hover:bg-slate-50 rounded-lg px-8 font-bold text-[10px] uppercase tracking-wider text-slate-900 shadow-sm transition-all active:scale-[0.98]">
                            Full View
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="px-10 py-6">EMPLOYEE</th>
                                    <th className="px-10 py-6">DEPARTMENT</th>
                                    <th className="px-10 py-6">STATUS</th>
                                    <th className="px-10 py-6">LWD</th>
                                    <th className="px-10 py-6">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allExits.filter(e => ['Pending', 'Manager_Approved'].includes(e.status)).slice(0, 5).map((exit, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exit.employee_name}`} alt={exit.employee_name} />
                                                </div>
                                                <div className="font-bold text-lg text-slate-900 tracking-tight uppercase">{exit.employee_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">{exit.department}</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <Badge className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border-none shadow-sm ${
                                                exit.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {exit.status}
                                            </Badge>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-slate-900 font-bold tracking-tight text-lg">{exit.lwd_proposed || 'TBD'}</div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Proposed LWD</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <Button
                                                onClick={() => setActiveTab('approvals')}
                                                className="h-11 bg-slate-900 hover:bg-black text-white px-8 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-md transition-all group/btn active:scale-[0.98]"
                                            >
                                                Approve
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {allExits.filter(e => ['Pending', 'Manager_Approved'].includes(e.status)).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-16 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <XCircle className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No pending records found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        );
    }

    // Faculty Dashboard View
    if (!activeExit) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2">
            {/* Transition Intelligence Section */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Personal Status Cluster */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="p-8 space-y-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</div>
                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{overallProgress}%</h3>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 rounded-full transition-all duration-700"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Clearance In Progress
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="p-8 space-y-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Remaining</div>
                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{daysLeft} Day{daysLeft !== 1 ? 's' : ''}</h3>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg inline-block">
                                    LWD: <span className="text-slate-900 ml-1 font-bold">{activeExit.lwd_approved || activeExit.lwd_proposed}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Status: {activeExit.status}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Access Section */}
                <Card className="bg-slate-900 border-none rounded-xl overflow-hidden shadow-lg">
                    <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="space-y-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Quick Actions</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Management portal</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { label: 'Submit', icon: FileText, tab: 'submit' },
                                { label: 'NOC', icon: ShieldAlert, tab: 'noc' },
                                { label: 'Assets', icon: Briefcase, tab: 'handover' },
                                { label: 'Interview', icon: MessageSquare, tab: 'interview' },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(action.tab)}
                                    className="flex flex-col items-center gap-3 group/action"
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center transition-all group-hover/action:bg-white/20 group-hover/action:scale-110">
                                        <action.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover/action:text-white transition-colors">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Institutional Timeline */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-900 rounded-lg shadow-sm">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Separation Timeline</h3>
                        </div>
                        <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[8px] uppercase tracking-wider px-3 py-1 rounded-full">Record Log</Badge>
                    </div>
                    <CardContent className="p-8 space-y-10">
                        {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                            <div key={i} className="flex gap-6 group relative">
                                {i !== upcomingEvents.length - 1 && <div className="absolute left-[23px] top-14 bottom-0 w-px bg-slate-100" />}
                                <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
                                </div>
                                <div className="flex-1 space-y-1.5 pt-0.5 border-b border-slate-50 pb-6 group-last:border-none">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{event.title}</h4>
                                        <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Active</Badge>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Scheduled: <span className="text-slate-600">{event.time}</span>
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                <Activity className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="font-bold text-[10px] uppercase tracking-wider text-slate-400">No upcoming events</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Persistence Side Column */}
            <div className="space-y-12">
                
                {/* Profile Card */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="p-8 space-y-8 flex flex-col items-center text-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-xl bg-slate-900 p-1 shadow-md ring-4 ring-slate-50">
                                <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeExit.employee_name}`} alt="Avatar" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-lg shadow-md ring-4 ring-white">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{activeExit.employee_name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeExit.department || 'General'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 w-full pt-6 border-t border-slate-100">
                            <div className="space-y-1">
                                <div className="text-lg font-bold text-slate-900 tracking-tight">{handoverStatus.completed}/{handoverStatus.total}</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Assets</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-lg font-bold text-slate-900 tracking-tight">{overallProgress}%</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Overall</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Clearance Status */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-900 rounded-lg shadow-sm">
                                <ShieldAlert className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Clearances</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Status reports</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-8 space-y-6">
                        {nocData.length > 0 ? nocData.map((dept, i) => (
                            <div key={i} className="space-y-2.5">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-slate-600">{dept.department}</span>
                                    <Badge className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border-none shadow-sm ${
                                        dept.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 
                                        dept.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                        {dept.status}
                                    </Badge>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${
                                            dept.status === 'Cleared' ? 'bg-emerald-500' : 
                                            dept.status === 'Rejected' ? 'bg-rose-500' : 
                                            'bg-orange-500'
                                        }`}
                                        style={{ width: dept.status === 'Cleared' ? '100%' : '30%' }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">No clearance records.</div>
                        )}
                        <Button variant="outline" className="w-full h-12 bg-white border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] mt-4">
                            Detailed Report
                        </Button>
                    </CardContent>
                </Card>

                {/* Warning Card */}
                <Card className="bg-rose-600 rounded-xl shadow-lg border-none overflow-hidden group">
                    <CardContent className="p-8 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white/20 text-white rounded-lg">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-bold text-white uppercase tracking-tight">Requirement</h4>
                        </div>
                        <p className="text-[10px] font-medium text-rose-100 uppercase tracking-wider leading-relaxed">Please ensure all tasks are completed in the given sequence to avoid processing delays.</p>
                        <Button className="w-full h-11 bg-white text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-[0.98]">
                            View Sequence
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default ExitDashboard;
