import React, { useEffect, useState } from 'react';

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
    if (activeExit?.meeting_status === 'Pending') {
        upcomingEvents.push({ title: "1:1 Exit Meeting", time: "Pending Scheduling", type: "meeting" });
    }
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

        // Workflow stages count based on PRD v1.2
        const workflowStages = [
            { label: 'Initiated', count: allExits.filter(e => e.status === 'Pending').length },
            { label: 'Pre-Approval (1:1)', count: allExits.filter(e => e.meeting_status === 'Pending').length },
            { label: 'Approved & Active', count: allExits.filter(e => ['Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status)).length },
            { label: 'Parallel Clearances', count: allExits.filter(e => e.status === 'Approved').length }, // NOC & Handover
            { label: 'F&F & Completed', count: completedExits },
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Active Exits */}
                    <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/40 backdrop-blur-md rounded-xl shadow-sm group-hover:bg-white/60 transition-colors">
                                <UserMinus className="w-5 h-5 text-indigo-700" />
                            </div>
                            <span className="text-xs font-bold text-indigo-900 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">+{((activeExits.length / allExits.length) * 100 || 0).toFixed(0)}%</span>
                        </div>
                        <h3 className="text-4xl font-black bg-gradient-to-br from-indigo-900 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">{activeExits.length}</h3>
                        <p className="text-sm font-medium text-slate-700 mt-1">Active Exits</p>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="glass-card p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/5 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/40 backdrop-blur-md rounded-xl shadow-sm group-hover:bg-white/60 transition-colors">
                                <CheckCircle className="w-5 h-5 text-amber-700" />
                            </div>
                            {pendingApprovals > 0 && <span className="text-xs font-bold text-amber-900 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm animate-pulse">Action Needed</span>}
                        </div>
                        <h3 className="text-4xl font-black bg-gradient-to-br from-amber-900 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">{pendingApprovals}</h3>
                        <p className="text-sm font-medium text-slate-700 mt-1">Pending Approvals</p>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>

                    {/* Avg Notice Period */}
                    <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/40 backdrop-blur-md rounded-xl shadow-sm group-hover:bg-white/60 transition-colors">
                                <Clock className="w-5 h-5 text-cyan-700" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-black bg-gradient-to-br from-cyan-900 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">{avgNoticePeriod}</h3>
                        <p className="text-sm font-medium text-slate-700 mt-1">Avg Notice Days</p>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>

                    {/* Attrition Rate */}
                    <div className="glass-card p-6 bg-gradient-to-br from-rose-500/20 to-rose-600/5 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/40 backdrop-blur-md rounded-xl shadow-sm group-hover:bg-white/60 transition-colors">
                                <BarChart className="w-5 h-5 text-rose-700" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-black bg-gradient-to-br from-rose-900 to-rose-600 bg-clip-text text-transparent drop-shadow-sm">{attritionRate}%</h3>
                        <p className="text-sm font-medium text-slate-700 mt-1">Attrition Rate</p>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-rose-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                </div>

                {/* Workflow Funnel & Department Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Workflow Funnel */}
                    <div className="glass-panel p-6 shadow-xl relative z-10 overflow-hidden">
                        <h3 className="font-bold text-xl text-slate-900 mb-6 drop-shadow-sm">Exit Workflow Funnel</h3>
                        <div className="space-y-5">
                            {workflowStages.map((stage, idx) => {
                                const maxCount = Math.max(...workflowStages.map(s => s.count), 1);
                                const widthPercent = (stage.count / maxCount) * 100;
                                return (
                                    <div key={idx} className="relative z-10">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-bold text-slate-800">{stage.label}</span>
                                            <span className="text-slate-600 font-medium bg-white/50 px-2 py-0.5 rounded backdrop-blur-sm">{stage.count} Active</span>
                                        </div>
                                        <div className="h-4 w-full bg-white/30 rounded-full overflow-hidden shadow-inner border border-white/40">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                style={{ width: `${widthPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="absolute top-1/2 -right-10 w-48 h-48 bg-indigo-300 rounded-full blur-3xl opacity-20"></div>
                    </div>

                    {/* Department Breakdown */}
                    <div className="glass-panel p-6 shadow-xl relative z-10 overflow-hidden">
                        <h3 className="font-bold text-xl text-slate-900 mb-6 drop-shadow-sm">Department Breakdown</h3>
                        <div className="space-y-5">
                            {Object.entries(deptBreakdown).map(([dept, count], idx) => {
                                const total = allExits.length;
                                const percentage = ((count / total) * 100).toFixed(0);
                                const colors = ['from-purple-500 to-purple-400', 'from-blue-500 to-blue-400', 'from-emerald-500 to-emerald-400', 'from-orange-500 to-orange-400', 'from-pink-500 to-pink-400'];
                                const dotColors = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];
                                return (
                                    <div key={idx} className="flex items-center gap-4 relative z-10">
                                        <div className={`w-4 h-4 rounded-full ${dotColors[idx % dotColors.length]} shadow-sm`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-bold text-slate-800">{dept}</span>
                                                <span className="text-slate-600 font-medium bg-white/50 px-2 py-0.5 rounded backdrop-blur-sm">{count} ({percentage}%)</span>
                                            </div>
                                            <div className="h-3 w-full bg-white/30 rounded-full overflow-hidden shadow-inner border border-white/40">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="absolute top-1/2 -left-10 w-48 h-48 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>
                    </div>
                </div>

                {/* Pending Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Actions Table */}
                    <div className="lg:col-span-2 glass-panel p-6 shadow-xl relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-900 drop-shadow-sm">Pending Actions</h3>
                            <button onClick={() => setActiveTab('approvals')} className="text-sm font-bold text-indigo-700 bg-white/60 hover:bg-white/80 px-4 py-2 rounded-full backdrop-blur-md shadow-sm transition-all flex items-center">
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/40 text-left">
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">Employee</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">Department</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">LWD</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allExits.filter(e => ['Pending', 'Manager_Approved'].includes(e.status)).slice(0, 5).map((exit, idx) => (
                                        <tr key={idx} className="border-b border-white/20 hover:bg-white/30 transition-colors group">
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exit.employee_name}`}
                                                        className="w-10 h-10 rounded-full border-2 border-white/50 shadow-sm"
                                                        alt={exit.employee_name}
                                                    />
                                                    <span className="text-sm font-bold text-slate-800">{exit.employee_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm font-medium text-slate-600">{exit.department}</td>
                                            <td className="py-3">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${exit.status === 'Pending' ? 'bg-amber-100/80 text-amber-900 border border-amber-200' :
                                                    exit.status === 'Manager_Approved' ? 'bg-blue-100/80 text-blue-900 border border-blue-200' :
                                                        'bg-emerald-100/80 text-emerald-900 border border-emerald-200'
                                                    }`}>
                                                    {exit.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-sm font-medium text-slate-600">{exit.lwd_proposed || 'TBD'}</td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => setActiveTab('approvals')}
                                                    className="px-4 py-1.5 bg-white/50 hover:bg-white text-indigo-700 font-bold rounded-full text-xs shadow-sm transition-all border border-indigo-100"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {allExits.filter(e => ['Pending', 'Manager_Approved'].includes(e.status)).length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-sm font-medium text-slate-500">
                                                No pending actions at this time
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="glass-panel p-6 shadow-xl relative z-10 overflow-hidden">
                        <h3 className="font-bold text-xl text-slate-900 mb-6 drop-shadow-sm">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex gap-4 p-3 bg-white/30 rounded-xl border border-white/40 shadow-sm hover:bg-white/50 transition-colors cursor-pointer">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-inner">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{activity.employee}</p>
                                        <p className="text-xs font-medium text-slate-600 mt-0.5">{activity.action}</p>
                                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <p className="text-sm font-medium text-slate-500 text-center py-4">No recent activity</p>
                            )}
                        </div>
                    </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="glass-card p-6 flex flex-col items-center text-center relative z-10 overflow-hidden group">
                        <div className="absolute top-4 right-4 text-indigo-400 cursor-pointer hover:text-indigo-600 transition-colors">↻</div>
                        <div className="relative w-24 h-24 mb-4 mt-2">
                            <div className="absolute inset-0 rounded-full border-4 border-white/40 border-t-indigo-500 animate-spin-slow shadow-lg"></div>
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeExit.employee_name}`}
                                alt="Profile"
                                className="w-full h-full rounded-full p-1 border-2 border-white/60 shadow-inner"
                            />
                            <div className="absolute bottom-0 right-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full p-1 border-2 border-white/80 shadow-md">
                                <span className="text-[10px] font-bold block w-4 h-4 leading-4">★</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 drop-shadow-sm">{activeExit.employee_name}</h3>
                        <p className="text-sm font-medium text-slate-600 mb-4">{activeExit.department || 'Department'}</p>

                        <div className="flex justify-center gap-8 w-full mt-2">
                            <div className="text-center">
                                <span className="block font-black text-2xl text-slate-800">{handoverStatus.total}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tasks</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-black text-2xl text-slate-800">{overallProgress}%</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>

                    {/* Gradient Card 1 (Prioritized Tasks) */}
                    <div className="glass-card bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start z-10">
                            <h3 className="font-bold text-lg text-indigo-900 w-2/3 drop-shadow-sm">Exit Checklist Progress</h3>
                            <div className="p-3 bg-white/40 rounded-xl backdrop-blur-md shadow-sm">
                                <Clock className="w-5 h-5 text-indigo-700" />
                            </div>
                        </div>
                        <div className="z-10 mt-6">
                            <h2 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm mb-1">{overallProgress}%</h2>
                            <p className="text-sm font-bold text-slate-600 mt-1">Completion Rate</p>
                        </div>

                        {/* Abstract blobs for gradient effect */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    </div>

                    {/* Gradient Card 2 (Notice Period / Shortfall) */}
                    <div className="glass-card bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start z-10">
                            <h3 className="font-bold text-lg text-cyan-900 w-2/3 drop-shadow-sm">Notice Period Tracking</h3>
                            <div className="p-3 bg-white/40 rounded-xl backdrop-blur-md shadow-sm">
                                <CheckCircle className="w-5 h-5 text-cyan-700" />
                            </div>
                        </div>
                        <div className="z-10 mt-6">
                            {activeExit.shortfall_days > 0 ? (
                                <div>
                                    <h2 className="text-4xl font-black text-rose-600 drop-shadow-sm">{activeExit.shortfall_days} Days</h2>
                                    <p className="text-xs font-bold text-rose-500">Shortfall Detected</p>
                                    <p className="text-xs font-medium text-slate-600 mt-1">Buyout: ₹{activeExit.buyout_amount}</p>
                                    {!activeExit.waiver_requested ? (
                                        <button
                                            className="mt-3 px-4 py-1.5 text-xs font-bold rounded-full bg-white/50 text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
                                            onClick={() => {
                                                const reason = prompt("Enter reason for waiver request:");
                                                if (reason) {
                                                    // Request waiver logic here
                                                    import('../../services/exitService').then(({ requestWaiver }) => {
                                                        requestWaiver(activeExit.id, reason)
                                                            .then(() => alert("Waiver requested"))
                                                            .catch(err => alert(err.message));
                                                    });
                                                }
                                            }}
                                        >
                                            Request Waiver
                                        </button>
                                    ) : (
                                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full mt-3 inline-block shadow-sm">
                                            Waiver Pending
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mb-1">{daysLeft}</h2>
                                    <p className="text-sm font-bold text-slate-600 mt-1">Days Remaining</p>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1 bg-white/50 inline-block px-2 py-0.5 rounded backdrop-blur-sm">LWD: {activeExit.lwd_approved || activeExit.lwd_proposed}</p>
                                </div>
                            )}
                        </div>

                        {/* Abstract blobs */}
                        <div className="absolute top-10 left-10 w-48 h-48 bg-cyan-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                </div>

                {/* Connections / Quick Actions Row */}
                <div className="glass-panel p-6 shadow-xl relative z-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="font-bold text-xl text-slate-900 drop-shadow-sm">Quick Actions</h3>
                        <p className="text-sm font-medium text-slate-600">Frequently used modules</p>
                    </div>
                    <div className="flex gap-6">
                        {[
                            { label: 'Resign', icon: FileText, tab: 'submit', color: 'from-indigo-500 to-purple-500', iconColor: 'text-white' },
                            { label: 'NOC', icon: ShieldAlert, tab: 'noc', color: 'from-emerald-500 to-teal-500', iconColor: 'text-white' },
                            { label: 'Assets', icon: Briefcase, tab: 'handover', color: 'from-orange-500 to-amber-500', iconColor: 'text-white' },
                            { label: 'Interview', icon: MoreHorizontal, tab: 'interview', color: 'from-slate-600 to-slate-500', iconColor: 'text-white' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(action.tab)}
                                className="group flex flex-col items-center gap-3"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] bg-gradient-to-br ${action.color}`}>
                                    <action.icon className={`w-6 h-6 ${action.iconColor} drop-shadow-sm`} />
                                </div>
                                <span className="text-xs font-bold text-slate-700">{action.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
                </div>

                {/* Focusing / Analytics Chart Section */}
                <div className="glass-panel p-6 shadow-xl h-72 relative z-10 overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-20">
                        <div>
                            <h3 className="font-bold text-xl text-slate-900 drop-shadow-sm">Activity Trends</h3>
                            <p className="text-sm font-medium text-slate-600">Resignation & Clearance volume</p>
                        </div>
                        <select className="text-xs font-bold bg-white/50 border border-white/60 rounded-full px-4 py-2 text-slate-700 cursor-pointer outline-none backdrop-blur-md shadow-sm">
                            <option>Last Month</option>
                            <option>Last 3 Months</option>
                        </select>
                    </div>

                    {/* Mock Chart Visualization (Wavy Line placeholder) */}
                    <div className="absolute inset-x-6 bottom-6 h-36 flex items-end justify-between px-2 z-10">
                        {/* Simple CSS-based bar chart to mimic the vibe */}
                        {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 65, 85].map((h, i) => (
                            <div key={i} className="w-full mx-1 bg-white/20 rounded-t-md relative group h-full flex items-end overflow-hidden border border-white/10">
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-1000 ease-out opacity-80 group-hover:opacity-100 group-hover:from-indigo-500 group-hover:to-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-6 right-8 text-right z-20 bg-white/70 p-4 rounded-2xl backdrop-blur-md shadow-lg border border-white/60">
                        <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-900 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">{overallProgress}%</h2>
                        <p className="text-xs font-bold text-slate-600 mt-1">Avg. Completion</p>
                    </div>
                </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6">

                {/* My Meetings / Upcoming Events */}
                <div className="glass-panel p-6 shadow-xl relative z-10 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-slate-900 drop-shadow-sm">Upcoming Events</h3>
                        <button className="h-10 w-10 rounded-full border border-white/60 bg-white/40 flex items-center justify-center hover:bg-white/60 transition-colors shadow-sm">
                            <Calendar className="w-5 h-5 text-indigo-700" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-white/30 rounded-xl border border-white/40 shadow-sm hover:bg-white/50 transition-colors cursor-pointer group">
                                <div className="flex flex-col items-center justify-center w-12 h-12 bg-white/60 rounded-lg shadow-inner">
                                    <span className="text-[10px] font-black text-indigo-800 uppercase text-center block leading-none">{event.type.substring(0,3)}</span>
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shadow-[0_0_5px_rgba(99,102,241,0.8)]"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-900 transition-colors">{event.title}</h4>
                                    <p className="text-xs font-bold text-slate-500 mt-0.5 flex items-center">
                                        <Clock className="w-3 h-3 mr-1 text-slate-400" /> {event.time}
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        )) : (
                            <p className="text-sm font-medium text-slate-500 text-center py-4 bg-white/20 rounded-xl border border-white/30">No upcoming events.</p>
                        )}
                    </div>

                    <div className="mt-6 pt-4 text-center border-t border-white/30">
                        <button className="text-sm font-bold text-indigo-700 hover:text-indigo-900 flex items-center justify-center w-full transition-colors">
                            See all events <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>

                {/* Tracking / Developed Areas */}
                <div className="glass-panel p-6 shadow-xl relative z-10 overflow-hidden">
                    <div className="mb-6">
                        <h3 className="font-bold text-xl text-slate-900 drop-shadow-sm">Clearance Status</h3>
                        <p className="text-sm font-medium text-slate-600">Departmental approvals</p>
                    </div>

                    <div className="space-y-5">
                        {nocData.length > 0 ? nocData.map((dept, i) => (
                            <div key={i} className="relative z-10">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-bold text-slate-800">{dept.department}</span>
                                    <span className={`font-bold px-2 py-0.5 rounded backdrop-blur-sm text-[10px] uppercase tracking-wider ${dept.status === 'Cleared' ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : dept.status === 'Rejected' ? 'bg-rose-100/80 text-rose-800 border border-rose-200' : 'bg-amber-100/80 text-amber-800 border border-amber-200'}`}>{dept.status}</span>
                                </div>
                                <div className="h-3 w-full bg-white/30 rounded-full overflow-hidden shadow-inner border border-white/40">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${dept.status === 'Cleared' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : dept.status === 'Rejected' ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                                        style={{ width: dept.status === 'Cleared' ? '100%' : '30%' }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm font-medium text-slate-500 text-center bg-white/20 p-4 rounded-xl border border-white/30">No clearance requests initiated.</p>
                        )}
                    </div>
                    <div className="absolute top-1/2 -right-10 w-48 h-48 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>
                </div>

            </div>
        </div>
    );
};

export default ExitDashboard;
