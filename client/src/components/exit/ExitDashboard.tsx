import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
    Calendar, Clock, CheckCircle, FileText, ShieldAlert, Briefcase, ChevronRight, MoreHorizontal, UserMinus, BarChart
} from 'lucide-react';
import { getExitDetails, getHandoverItems, getExitInterview } from '../../services/exitService';

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
            // 1. Get NOCs (via Exit Details)
            const exitDetails = await getExitDetails(activeExit.id);
            if (exitDetails.noc) setNocData(exitDetails.noc);

            // 2. Get Handover Status
            const handoverItems = await getHandoverItems(activeExit.id);
            if (handoverItems.data) {
                const total = handoverItems.data.length;
                const completed = handoverItems.data.filter((i: any) => i.status === 'Completed').length;
                setHandoverStatus({ total, completed });
            }

            // 3. Get Interview Status
            const interviewData = await getExitInterview(activeExit.id);
            // Check if any answer is provided or if status is completed (mocking 'completed' if any answer exists for now)
            if (interviewData.data && interviewData.data.some((q: any) => q.answer && q.answer.length > 0)) {
                setInterviewStatus(true);
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    // Calculate Days Left
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
    if (!interviewStatus && activeExit?.status === 'Approved') {
        upcomingEvents.push({ title: "Exit Interview", time: "Pending", type: "meeting" });
    }
    if (handoverStatus.completed < handoverStatus.total) {
        upcomingEvents.push({ title: "Asset Handover", time: "In Progress", type: "task" });
    }
    if (activeExit?.status === 'Approved') {
        upcomingEvents.push({ title: "Final Settlement", time: activeExit.lwd_approved ? new Date(activeExit.lwd_approved).toLocaleDateString() : "Pending", type: "event" });
    }

    // HR Admin Dashboard View
    if (viewMode === 'Admin') {
        // Calculate KPIs from all exits
        const activeExits = allExits.filter(e => ['Pending', 'Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status));
        const pendingApprovals = allExits.filter(e => e.status === 'Pending' || e.status === 'Manager_Approved').length;
        const completedExits = allExits.filter(e => e.status === 'Completed').length;

        // Calculate average notice period
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

        // Calculate attrition rate (mock: percentage of total employees)
        const totalEmployees = 150; // Mock data
        const attritionRate = ((allExits.length / totalEmployees) * 100).toFixed(1);

        // Workflow stages count
        const workflowStages = [
            { label: 'Submitted', count: allExits.filter(e => e.status === 'Pending').length },
            { label: 'Approved', count: allExits.filter(e => ['Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status)).length },
            { label: 'NOC', count: allExits.filter(e => e.status === 'HR_Approved').length },
            { label: 'Handover', count: allExits.filter(e => e.status === 'HR_Approved').length },
            { label: 'Completed', count: completedExits },
        ];

        // Department breakdown
        const deptBreakdown: { [key: string]: number } = {};
        allExits.forEach(e => {
            const dept = e.department || 'Unknown';
            deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
        });

        // Recent activity
        const recentActivity = allExits.slice(0, 5).map(e => ({
            employee: e.employee_name,
            action: `Resignation ${e.status}`,
            time: e.submission_date ? new Date(e.submission_date).toLocaleDateString() : 'Recently',
            status: e.status
        }));

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">HR Exit Dashboard</h2>
                        <p className="text-sm text-slate-500">Organizational exit management overview</p>
                    </div>
                </div>

                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Active Exits */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl overflow-hidden relative">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <UserMinus className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="text-xs font-medium text-indigo-700 bg-white px-2 py-1 rounded-full">+{((activeExits.length / allExits.length) * 100 || 0).toFixed(0)}%</span>
                            </div>
                            <h3 className="text-3xl font-bold text-indigo-900">{activeExits.length}</h3>
                            <p className="text-sm text-indigo-700 mt-1">Active Exits</p>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-40"></div>
                        </CardContent>
                    </Card>

                    {/* Pending Approvals */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl overflow-hidden relative">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <CheckCircle className="w-5 h-5 text-amber-600" />
                                </div>
                                {pendingApprovals > 0 && <span className="text-xs font-medium text-amber-700 bg-white px-2 py-1 rounded-full">Action Needed</span>}
                            </div>
                            <h3 className="text-3xl font-bold text-amber-900">{pendingApprovals}</h3>
                            <p className="text-sm text-amber-700 mt-1">Pending Approvals</p>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200 rounded-full blur-2xl opacity-40"></div>
                        </CardContent>
                    </Card>

                    {/* Avg Notice Period */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl overflow-hidden relative">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Clock className="w-5 h-5 text-cyan-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-cyan-900">{avgNoticePeriod}</h3>
                            <p className="text-sm text-cyan-700 mt-1">Avg Notice Days</p>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-200 rounded-full blur-2xl opacity-40"></div>
                        </CardContent>
                    </Card>

                    {/* Attrition Rate */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl overflow-hidden relative">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <BarChart className="w-5 h-5 text-rose-600" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-rose-900">{attritionRate}%</h3>
                            <p className="text-sm text-rose-700 mt-1">Attrition Rate</p>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-200 rounded-full blur-2xl opacity-40"></div>
                        </CardContent>
                    </Card>
                </div>

                {/* Workflow Funnel & Department Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Workflow Funnel */}
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Exit Workflow Funnel</h3>
                            <div className="space-y-4">
                                {workflowStages.map((stage, idx) => {
                                    const maxCount = Math.max(...workflowStages.map(s => s.count), 1);
                                    const widthPercent = (stage.count / maxCount) * 100;
                                    return (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium text-slate-700">{stage.label}</span>
                                                <span className="text-slate-500">{stage.count}</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${widthPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Department Breakdown */}
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Department Breakdown</h3>
                            <div className="space-y-4">
                                {Object.entries(deptBreakdown).map(([dept, count], idx) => {
                                    const total = allExits.length;
                                    const percentage = ((count / total) * 100).toFixed(0);
                                    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
                                    return (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-slate-700">{dept}</span>
                                                    <span className="text-slate-500">{count} ({percentage}%)</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${colors[idx % colors.length]} rounded-full`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Actions Table */}
                    <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-slate-900">Pending Actions</h3>
                                <Button variant="outline" size="sm" onClick={() => setActiveTab('approvals')}>
                                    View All <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-left">
                                            <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                                            <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Department</th>
                                            <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                            <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">LWD</th>
                                            <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allExits.filter(e => ['Pending', 'Manager_Approved'].includes(e.status)).slice(0, 5).map((exit, idx) => (
                                            <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exit.employee_name}`}
                                                            className="w-8 h-8 rounded-full"
                                                            alt={exit.employee_name}
                                                        />
                                                        <span className="text-sm font-medium text-slate-900">{exit.employee_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-sm text-slate-600">{exit.department}</td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${exit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        exit.status === 'Manager_Approved' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                        {exit.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-sm text-slate-600">{exit.lwd_proposed || 'TBD'}</td>
                                                <td className="py-3">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setActiveTab('approvals')}
                                                        className="h-7 text-xs"
                                                    >
                                                        Review
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {allExits.filter(e => ['Pending', 'Manager_Approved'].includes(e.status)).length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                                                    No pending actions at this time
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity Feed */}
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {recentActivity.map((activity, idx) => (
                                    <div key={idx} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{activity.employee}</p>
                                            <p className="text-xs text-slate-600 mt-0.5">{activity.action}</p>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!activeExit) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-slate-700">No Active Exit Request</h2>
                <p className="text-slate-500 mb-6">You are currently not in an exit process.</p>
                <Button onClick={() => setActiveTab('submit')}>Initiate Resignation</Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-6">

                {/* Welcome Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome, {activeExit.employee_name || 'Employee'}</h1>
                        <p className="text-slate-500">Your transition dashboard overview</p>
                    </div>
                    {/* Search bar placeholder as per design */}
                    <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 border border-slate-200 shadow-sm w-64">
                        <span className="text-slate-400">🔍</span>
                        <input type="text" placeholder="Search..." className="ml-2 outline-none text-sm w-full" />
                    </div>
                </div>

                {/* Top Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Profile Card */}
                    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden relative">
                        <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                            <div className="absolute top-4 right-4 text-slate-400 cursor-pointer hover:text-slate-600">↻</div>
                            <div className="relative w-24 h-24 mb-4">
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin-slow"></div>
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeExit.employee_name}`}
                                    alt="Profile"
                                    className="w-full h-full rounded-full p-1"
                                />
                                <div className="absolute bottom-0 right-0 bg-slate-900 text-white rounded-full p-1 border-2 border-white">
                                    <span className="text-[10px] font-bold block w-4 h-4 leading-4">★</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">{activeExit.employee_name}</h3>
                            <p className="text-xs text-slate-500 mb-4">{activeExit.department || 'Department'}</p>

                            <div className="flex justify-center gap-6 w-full mt-2">
                                <div className="text-center">
                                    <span className="block font-bold text-slate-700">{handoverStatus.total}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tasks</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-slate-700">{overallProgress}%</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gradient Card 1 (Prioritized Tasks) */}
                    <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start z-10">
                            <h3 className="font-medium text-slate-700 w-2/3">Exit Checklist Progress</h3>
                            <div className="p-2 bg-white/50 rounded-full backdrop-blur-sm">
                                <Clock className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                        <div className="z-10 mt-6">
                            <h2 className="text-4xl font-bold text-slate-800">{overallProgress}%</h2>
                            <p className="text-xs text-slate-500 mt-1">Completion Rate</p>
                        </div>

                        {/* Abstract blobs for gradient effect */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-50"></div>
                    </div>

                    {/* Gradient Card 2 (Notice Period / Shortfall) */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start z-10">
                            <h3 className="font-medium text-slate-700 w-2/3">Notice Period Tracking</h3>
                            <div className="p-2 bg-white/50 rounded-full backdrop-blur-sm">
                                <CheckCircle className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                        <div className="z-10 mt-6">
                            {activeExit.shortfall_days > 0 ? (
                                <div>
                                    <h2 className="text-3xl font-bold text-red-600">{activeExit.shortfall_days} Days</h2>
                                    <p className="text-xs text-red-500 font-medium">Shortfall Detected</p>
                                    <p className="text-xs text-slate-500 mt-1">Buyout: ₹{activeExit.buyout_amount}</p>
                                    {!activeExit.waiver_requested ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-2 h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                const reason = prompt("Enter reason for waiver request:");
                                                if (reason) {
                                                    // Request waiver logic here (need to import requestWaiver)
                                                    import('../../services/exitService').then(({ requestWaiver }) => {
                                                        requestWaiver(activeExit.id, reason)
                                                            .then(() => alert("Waiver requested"))
                                                            .catch(err => alert(err.message));
                                                    });
                                                }
                                            }}
                                        >
                                            Request Waiver
                                        </Button>
                                    ) : (
                                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full mt-2 inline-block">
                                            Waiver Pending
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-4xl font-bold text-slate-800">{daysLeft}</h2>
                                    <p className="text-xs text-slate-500 mt-1">Days Remaining</p>
                                    <p className="text-[10px] text-slate-400 mt-1">LWD: {activeExit.lwd_approved || activeExit.lwd_proposed}</p>
                                </div>
                            )}
                        </div>

                        {/* Abstract blobs */}
                        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>
                    </div>
                </div>

                {/* Connections / Quick Actions Row */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-800">Quick Actions</h3>
                        <p className="text-xs text-slate-500">Frequently used modules</p>
                    </div>
                    <div className="flex gap-4">
                        {[
                            { label: 'Resign', icon: FileText, tab: 'submit', color: 'bg-indigo-100 text-indigo-600' },
                            { label: 'NOC', icon: ShieldAlert, tab: 'noc', color: 'bg-green-100 text-green-600' },
                            { label: 'Assets', icon: Briefcase, tab: 'handover', color: 'bg-orange-100 text-orange-600' },
                            { label: 'Interview', icon: MoreHorizontal, tab: 'interview', color: 'bg-slate-100 text-slate-600' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(action.tab)}
                                className="group flex flex-col items-center gap-2"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-medium text-slate-600">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Focusing / Analytics Chart Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-64 relative">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Activity Trends</h3>
                            <p className="text-xs text-slate-500">Resignation & Clearance volume</p>
                        </div>
                        <select className="text-xs bg-slate-50 border-none rounded-md px-2 py-1 text-slate-600 cursor-pointer outline-none">
                            <option>Last Month</option>
                            <option>Last 3 Months</option>
                        </select>
                    </div>

                    {/* Mock Chart Visualization (Wavy Line placeholder) */}
                    <div className="absolute inset-x-6 bottom-6 h-32 flex items-end justify-between px-2">
                        {/* Simple CSS-based bar chart to mimic the vibe */}
                        {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 65, 85].map((h, i) => (
                            <div key={i} className="w-full mx-1 bg-indigo-50 rounded-t-sm relative group h-full flex items-end">
                                <div
                                    className="w-full bg-indigo-500/80 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-600"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-6 right-8 text-right">
                        <h2 className="text-3xl font-bold text-slate-900">{overallProgress}%</h2>
                        <p className="text-xs text-slate-500">Avg. Completion</p>
                    </div>
                </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6">

                {/* My Meetings / Upcoming Events */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Upcoming Events</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-slate-200">
                            <Calendar className="w-4 h-4 text-slate-500" />
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                            <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">{event.type}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-800 text-sm">{event.title}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" /> {event.time}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 text-center py-4">No upcoming events.</p>
                        )}
                    </div>

                    <div className="mt-6 pt-2 text-center">
                        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center w-full">
                            See all events <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                </div>

                {/* Tracking / Developed Areas */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Clearance Status</h3>
                        <p className="text-xs text-slate-500">Departmental approvals</p>
                    </div>

                    <div className="space-y-5">
                        {nocData.length > 0 ? nocData.map((dept, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-medium text-slate-700">{dept.department}</span>
                                    <span className="text-slate-500">{dept.status}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${dept.status === 'Cleared' ? 'bg-green-500' : dept.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                        style={{ width: dept.status === 'Cleared' ? '100%' : '30%' }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 text-center">No clearance requests initiated.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExitDashboard;
