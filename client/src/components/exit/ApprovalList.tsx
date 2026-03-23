import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getAllExits, updateExitStatus, approveWaiver } from '../../services/exitService';
import { CheckCircle, XCircle } from 'lucide-react';


const ApprovalList: React.FC = () => {
    const [exits, setExits] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [simulatedRole, setSimulatedRole] = useState<string>('Reporting Manager'); // Default role
    const [expandedExit, setExpandedExit] = useState<number | null>(null);

    useEffect(() => {
        fetchExits();
    }, []);

    const fetchExits = async () => {
        setLoading(true);
        try {
            const data = await getAllExits();
            // Filter only pending or relevant statuses for approval view
            setExits(data.data.filter((e: any) => e.status !== 'Withdrawn'));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id: number, status: 'Approved' | 'Rejected', lwd?: string) => {
        const comments = prompt("Enter remarks for this action:");
        if (comments === null) return;

        try {
            await updateExitStatus(id, {
                status,
                lwd_approved: status === 'Approved' ? (lwd || new Date().toISOString().split('T')[0]) : undefined,
                comments,
                approver_role: simulatedRole // Pass the simulated role
            });
            alert(`Action ${status} submitted successfully`);
            fetchExits();
        } catch (error: any) {
            alert(error.message || "Failed to update status");
        }
    };

    // Filter exits based on simulated role
    const filteredExits = exits.filter(exit => {
        // HR should see waiver requests regardless of resignation stage
        if (simulatedRole === 'HR' && exit.waiver_requested && !exit.waiver_approved) return true;

        if (exit.status === 'Approved' || exit.status === 'Rejected') return true; // Show history
        if (!exit.current_approver_role) return true; // Fallback

        // Match role map
        const roleMap: any = {
            'Reporting Manager': ['Reporting Manager'],
            'Head of Department': ['Head of Department'],
            'Principal': ['Principal'],
            'HR': ['HR']
        };
        return roleMap[simulatedRole]?.includes(exit.current_approver_role) ||
            (simulatedRole === 'HR' && exit.current_approver_role === 'HR');
    });

    const handleWaiver = async (id: number, approved: boolean) => {
        try {
            await approveWaiver(id, approved);
            alert(`Waiver ${approved ? 'Approved' : 'Rejected'}`);
            fetchExits();
        } catch (error: any) {
            alert(error.message);
        }
    };

    // Generate timeline steps based on V1.2 PRD
    const getTimeline = (exit: any) => {
        const timeline = [
            { label: 'Initiation Triggered', status: 'completed', date: exit.submission_date || exit.resignation_date },
            { label: 'Pre-Approval (1:1 Meeting)', status: exit.meeting_status === 'Waived' ? 'completed' : exit.meeting_status === 'Pending' ? 'current' : 'completed', date: null },
            { label: 'Manager / HR Approval', status: exit.status === 'Pending' && exit.meeting_status !== 'Pending' ? 'current' : exit.status.includes('Approved') ? 'completed' : 'pending', date: exit.manager_approved_date },
            { label: 'Parallel Clearances (NOCs)', status: exit.status === 'Approved' ? 'current' : 'pending', date: null },
            { label: 'F&F Processing & Closure', status: exit.status === 'Completed' ? 'completed' : 'pending', date: exit.completion_date }
        ];
        return timeline;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Exit Approvals</h2>
                    <p className="text-sm text-slate-500">Review and process resignation requests</p>
                </div>
                <select
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={simulatedRole}
                    onChange={(e) => setSimulatedRole(e.target.value)}
                >
                    <option value="Reporting Manager">View as: Reporting Manager</option>
                    <option value="Head of Department">View as: Head of Department</option>
                    <option value="Principal">View as: Principal</option>
                    <option value="HR">View as: HR</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12 glass-panel shadow-sm">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 shadow-sm"></div>
                    <p className="mt-4 font-bold text-slate-600 animate-pulse">Loading approvals...</p>
                </div>
            ) : filteredExits.length === 0 ? (
                <div className="glass-panel text-center py-16 shadow-lg relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl"></div>
                    <CheckCircle className="w-16 h-16 mx-auto text-emerald-400 mb-4 drop-shadow-md relative z-10" />
                    <p className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent relative z-10">Inbox Zero!</p>
                    <p className="text-sm font-medium text-slate-500 mt-2 relative z-10">No pending approvals for {simulatedRole}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredExits.map(exit => {
                        const timeline = getTimeline(exit);
                        const isExpanded = expandedExit === exit.id;
                        const canApprove = exit.status === 'Pending' && exit.current_approver_role === simulatedRole;

                        return (
                            <div key={exit.id} className="glass-card overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                <div className="p-6 bg-white/40 backdrop-blur-md border-b border-white/60 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-indigo-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exit.employee_name}`}
                                                    className="w-14 h-14 rounded-full border-2 border-white shadow-md relative z-10"
                                                    alt={exit.employee_name}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">{exit.employee_name}</h3>
                                                <p className="text-sm font-medium text-slate-600">{exit.department} • {exit.designation || 'Employee'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${exit.status === 'Approved' ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-200' :
                                                    exit.status === 'Rejected' ? 'bg-rose-100/90 text-rose-900 border border-rose-200' :
                                                        exit.status === 'Manager_Approved' ? 'bg-blue-100/90 text-blue-900 border border-blue-200' :
                                                            exit.status === 'HR_Approved' ? 'bg-cyan-100/90 text-cyan-900 border border-cyan-200' :
                                                                'bg-amber-100/90 text-amber-900 border border-amber-200'
                                                }`}>
                                                {exit.status}
                                            </span>
                                            <p className="text-xs font-bold text-slate-500 mt-2">Submitted: {exit.resignation_date}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-8 bg-white/20">
                                    {/* Key Information Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white/40 rounded-xl p-5 shadow-inner border border-white/60">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason</p>
                                            <p className="text-base font-bold text-slate-800">{exit.reason}</p>
                                        </div>
                                        <div className="bg-white/40 rounded-xl p-5 shadow-inner border border-white/60">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proposed LWD</p>
                                            <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-slate-400" /> {exit.lwd_proposed}
                                            </p>
                                        </div>
                                        <div className="bg-white/40 rounded-xl p-5 shadow-inner border border-white/60 relative overflow-hidden">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Approver</p>
                                            <p className="text-base font-black bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent relative z-10">{exit.current_approver_role || 'Completed ✅'}</p>
                                            <div className="absolute top-1/2 -right-4 w-16 h-16 bg-indigo-200 rounded-full blur-xl opacity-40"></div>
                                        </div>
                                    </div>

                                    {/* Timeline View */}
                                    <div className="bg-white/30 rounded-xl p-6 border border-white/50 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
                                        <button
                                            onClick={() => setExpandedExit(isExpanded ? null : exit.id)}
                                            className="flex items-center justify-between w-full text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                                    <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                                                </div>
                                                <span className="text-base font-bold text-slate-800 tracking-wide">{isExpanded ? 'Hide' : 'Show'} Cinematic Timeline</span>
                                            </div>
                                            <div className="flex gap-1.5 hidden sm:flex">
                                                {timeline.map((s: any, i: number) => (
                                                    <div key={i} className={`w-2 h-2 rounded-full ${s.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : s.status === 'current' ? 'bg-indigo-500 animate-pulse shadow-[0_0_5px_rgba(99,102,241,0.5)]' : 'bg-white/60 border border-slate-200'}`}></div>
                                                ))}
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="relative pl-8 border-l-2 border-indigo-200 ml-4 mt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                                {timeline.map((step, idx) => (
                                                    <div key={idx} className="relative group/timeline">
                                                        <div className={`absolute -left-[41px] w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${step.status === 'completed' ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110' :
                                                                step.status === 'current' ? 'bg-indigo-500 border-indigo-200 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-125 z-10' :
                                                                    'bg-slate-100 border-white shadow-sm'
                                                            }`}>
                                                            {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-white drop-shadow-sm" />}
                                                        </div>
                                                        <div className={`ml-2 transition-all duration-300 ${step.status === 'current' ? 'bg-white/60 px-5 py-4 rounded-xl shadow-lg border border-indigo-100/50 backdrop-blur-sm -translate-y-2' : 'group-hover/timeline:translate-x-1'}`}>
                                                            <p className={`text-base font-black ${step.status === 'completed' ? 'text-emerald-700' :
                                                                    step.status === 'current' ? 'bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent' :
                                                                        'text-slate-400'
                                                                }`}>
                                                                {step.label}
                                                            </p>
                                                            {step.date && (
                                                                <p className="text-xs font-bold text-slate-500 mt-1">{new Date(step.date).toLocaleDateString()}</p>
                                                            )}
                                                            {step.status === 'current' && (
                                                                <p className="text-xs font-bold text-indigo-500 mt-2 bg-indigo-50 inline-block px-2 py-1 rounded-sm border border-indigo-100/50 shadow-sm uppercase tracking-wide">⏳ Awaiting action</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Waiver Request Details */}
                                    {exit.waiver_requested === 1 && (
                                        <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-xl p-5 shadow-sm relative overflow-hidden">
                                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>
                                            <p className="font-black text-amber-900 mb-3 flex items-center gap-3 text-lg drop-shadow-sm">
                                                <span className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"></span>
                                                Waiver Requested
                                            </p>
                                            <p className="text-sm font-medium text-slate-700 italic border-l-2 border-amber-300 pl-3 py-1 mb-4 bg-white/40 rounded-r-lg">"{exit.waiver_reason}"</p>
                                            <div className="flex gap-6 text-xs text-slate-700 bg-white/40 p-3 rounded-lg border border-white/50">
                                                <span className="font-medium">Shortfall: <strong className="font-black text-rose-600 text-sm ml-1">{exit.shortfall_days} days</strong></span>
                                                <span className="font-medium">Buyout Amount: <strong className="font-black text-rose-600 text-sm ml-1">₹{exit.buyout_amount}</strong></span>
                                            </div>
                                            <div className="mt-4 border-t border-amber-200/50 pt-4">
                                                {exit.waiver_approved === 1 ? (
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shadow-sm border border-emerald-200">
                                                        <CheckCircle className="w-4 h-4 mr-1.5" /> Waiver Approved
                                                    </span>
                                                ) : exit.waiver_approved === 0 ? (
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 shadow-sm border border-amber-200 animate-pulse">
                                                        Pending Review
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 shadow-sm border border-rose-200">
                                                        <XCircle className="w-4 h-4 mr-1.5" /> Waiver Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-2 border-t border-white/40 relative z-20">
                                        {/* Waiver Actions for HR */}
                                        {simulatedRole === 'HR' && exit.waiver_requested === 1 && exit.waiver_approved === 0 && (
                                            <>
                                                <Button
                                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 rounded-full h-12 text-sm font-bold transition-all hover:scale-[1.02]"
                                                    onClick={() => handleWaiver(exit.id, true)}
                                                >
                                                    <CheckCircle className="w-5 h-5 mr-2 drop-shadow-sm" />
                                                    Approve Waiver
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-rose-200 text-rose-600 bg-white/60 hover:bg-rose-50 rounded-full h-12 text-sm font-bold shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02]"
                                                    onClick={() => handleWaiver(exit.id, false)}
                                                >
                                                    <XCircle className="w-5 h-5 mr-2" />
                                                    Reject Waiver
                                                </Button>
                                            </>
                                        )}

                                        {/* Resignation Approval Actions */}
                                        {canApprove ? (
                                            <>
                                                <Button
                                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 rounded-full h-12 text-sm font-bold transition-all hover:scale-[1.02]"
                                                    onClick={() => handleApproval(exit.id, 'Approved', exit.lwd_proposed)}
                                                >
                                                    <CheckCircle className="w-5 h-5 mr-2 drop-shadow-sm" />
                                                    Approve Resignation
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1 shadow-lg shadow-rose-500/30 rounded-full h-12 text-sm font-bold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all hover:scale-[1.02]"
                                                    onClick={() => handleApproval(exit.id, 'Rejected')}
                                                >
                                                    <XCircle className="w-5 h-5 mr-2 drop-shadow-sm" />
                                                    Reject Request
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex-1 text-center bg-white/40 backdrop-blur-sm p-3 rounded-full border border-white/60 shadow-inner">
                                                {exit.status !== 'Pending' ? (
                                                    <span className="inline-flex items-center gap-2 text-slate-600 font-bold text-sm">
                                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                        Action Successfully Logged
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500 font-bold text-sm">
                                                        Awaiting Action from <span className="text-indigo-600">{exit.current_approver_role}</span>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ApprovalList;
