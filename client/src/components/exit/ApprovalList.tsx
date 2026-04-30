import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getAllExits, updateExitStatus, approveWaiver } from '../../services/exitService';
import { 
    CheckCircle, XCircle, ChevronRight, UserMinus, ShieldCheck, 
    AlertTriangle, Clock, ArrowRight, UserCheck, ClipboardCheck,
    Shield, Briefcase, FileText
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

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
                approver_role: simulatedRole
            });
            alert(`Action ${status} submitted successfully`);
            fetchExits();
        } catch (error: any) {
            alert(error.message || "Failed to update status");
        }
    };

    const filteredExits = exits.filter(exit => {
        if (simulatedRole === 'HR' && exit.waiver_requested && !exit.waiver_approved) return true;
        if (exit.status === 'Approved' || exit.status === 'Rejected') return true; 

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-48 animate-in fade-in duration-500">
                <div className="p-4 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-100 mb-6">
                    <ShieldCheck className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Loading Validations</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Please wait...</p>
                </div>
            </div>
        );
    }

        return (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 p-2">
            {/* Persona Management Block */}
            {/* Persona Selection Block */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-slate-900 rounded-lg shadow-sm">
                            <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Simulated Role</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Reviewing as different authority</p>
                        </div>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <select
                            className="w-full md:w-64 h-11 bg-white border border-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-wider rounded-lg px-5 outline-none focus:ring-2 focus:ring-slate-100"
                            value={simulatedRole}
                            onChange={(e) => setSimulatedRole(e.target.value)}
                        >
                            <option value="Reporting Manager">Reporting Manager</option>
                            <option value="Head of Department">Head of Department</option>
                            <option value="Principal">Principal</option>
                            <option value="HR">HR View</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>
            </Card>

            {filteredExits.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                    <div className="w-16 h-16 bg-white border border-slate-100 text-slate-200 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <ClipboardCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">No Pending Approvals</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-sm mx-auto">Tasks are completed for <span className="text-indigo-600 font-bold">{simulatedRole}</span>.</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-8">
                    {filteredExits.map(exit => {
                        const canApprove = (simulatedRole === exit.current_approver_role) || 
                                         (simulatedRole === 'HR' && exit.current_approver_role === 'HR');
                        const timeline = getTimeline(exit);
                        const isExpanded = expandedExit === exit.id;
                        
                        return (
                            <Card key={exit.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                                <div className="p-10 space-y-10">
                                    {/* Record Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-xl bg-slate-900 p-0.5 shadow-sm">
                                                <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exit.employee_name}`} alt={exit.employee_name} />
                                                </div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{exit.employee_name}</h3>
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-slate-100 text-slate-600 border-none px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-none">{exit.department}</Badge>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{exit.designation}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                            <Badge className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border-none shadow-sm
                                                ${exit.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                  exit.status.includes('Approved') ? 'bg-indigo-100 text-indigo-700' :
                                                  'bg-rose-100 text-rose-700'}`}>
                                                {exit.status}
                                            </Badge>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" /> Filed: <span className="text-slate-900">{exit.resignation_date}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Analysis Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5" /> Reason
                                            </p>
                                            <p className="text-[11px] font-bold text-slate-900 uppercase leading-relaxed tracking-tight line-clamp-2">{exit.reason}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all">
                                            <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" /> Proposed LWD
                                            </p>
                                            <p className="text-2xl font-bold text-orange-600 leading-none tracking-tight">{exit.lwd_proposed}</p>
                                        </div>
                                        <div className="p-6 bg-slate-900 rounded-xl shadow-md">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Shield className="w-3.5 h-3.5" /> Current Status
                                            </p>
                                            <p className="text-[11px] font-bold text-white uppercase tracking-wider">{exit.current_approver_role || 'Approved'}</p>
                                        </div>
                                    </div>

                                    {/* Timeline Toggle */}
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setExpandedExit(isExpanded ? null : exit.id)}
                                            className="w-full h-14 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-xl px-6 flex items-center justify-between transition-all active:scale-[0.99]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-slate-900 text-white rotate-90' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Approval Workflow</span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                {timeline.map((s: any, i: number) => (
                                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${s.status === 'completed' ? 'bg-emerald-500' : s.status === 'current' ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'}`} />
                                                ))}
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-8 bg-slate-50 rounded-xl space-y-10 animate-in slide-in-from-top-2 duration-300 border border-slate-100">
                                                {timeline.map((step, idx) => (
                                                    <div key={idx} className="flex gap-8 group/step relative">
                                                        {idx !== timeline.length - 1 && <div className="absolute left-[21px] top-12 bottom-0 w-0.5 bg-slate-200 rounded-full" />}
                                                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-sm border-2
                                                            ${step.status === 'completed' ? 'bg-emerald-500 border-emerald-50 text-white' :
                                                              step.status === 'current' ? 'bg-slate-900 border-slate-800 text-white scale-105 z-10' :
                                                              'bg-white border-slate-100 text-slate-200'}`}>
                                                            {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                        </div>
                                                        <div className="flex-1 space-y-1 pt-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className={`text-md font-bold tracking-tight uppercase transition-colors
                                                                    ${step.status === 'completed' ? 'text-emerald-700' : step.status === 'current' ? 'text-slate-900' : 'text-slate-300'}`}>
                                                                    {step.label}
                                                                </h4>
                                                                {step.status === 'current' && <Badge className="bg-orange-500 text-white border-none font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">Required</Badge>}
                                                            </div>
                                                            {step.date && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                {new Date(step.date).toLocaleDateString()}
                                                            </p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Waiver Block */}
                                    {exit.waiver_requested === 1 && (
                                        <Card className="bg-orange-50/50 border-orange-100 rounded-xl overflow-hidden">
                                            <div className="p-8 space-y-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="p-3 bg-orange-600 text-white rounded-lg shadow-sm">
                                                        <AlertTriangle className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-orange-950 uppercase tracking-tight">Waiver Request</h4>
                                                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-0.5">Approval required</p>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-white border border-orange-100 rounded-lg shadow-sm">
                                                    <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-2">Request Reason:</p>
                                                    <p className="text-[13px] font-bold text-slate-900 uppercase leading-snug tracking-tight">"{exit.waiver_reason}"</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="p-5 bg-white border border-orange-50 rounded-lg">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Notice Shortfall</p>
                                                        <h5 className="text-3xl font-bold text-rose-600 tracking-tight mt-1">{exit.shortfall_days} <span className="text-sm opacity-50">Days</span></h5>
                                                    </div>
                                                    <div className="p-5 bg-white border border-orange-50 rounded-lg">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Buyout Amount</p>
                                                        <h5 className="text-3xl font-bold text-rose-600 tracking-tight mt-1">₹{exit.buyout_amount}</h5>
                                                    </div>
                                                </div>
                                                
                                                {simulatedRole === 'HR' && exit.waiver_approved === 0 && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                                        <Button
                                                            className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
                                                            onClick={() => handleWaiver(exit.id, true)}
                                                        >
                                                            Approve Waiver
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all"
                                                            onClick={() => handleWaiver(exit.id, false)}
                                                        >
                                                            Reject Waiver
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    )}

                                    <div className="pt-8 border-t border-slate-100">
                                        {canApprove ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <Button
                                                    className="h-14 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[12px] uppercase tracking-widest shadow-md transition-all active:scale-[0.98]"
                                                    onClick={() => handleApproval(exit.id, 'Approved', exit.lwd_proposed)}
                                                >
                                                    Approve
                                                    <ArrowRight className="w-5 h-5 ml-3" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[12px] uppercase tracking-widest shadow-sm transition-all active:scale-[0.98]"
                                                    onClick={() => handleApproval(exit.id, 'Rejected')}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="w-full h-14 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                                    <Shield className="w-4 h-4" />
                                                    {exit.status !== 'Pending' ? 'Processed' : `Pending: ${exit.current_approver_role}`}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ApprovalList;
