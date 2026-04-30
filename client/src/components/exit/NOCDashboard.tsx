import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getNOCRequests, updateNOCStatus } from '../../services/exitService';
import { 
    CheckCircle, XCircle, Filter, ChevronDown, ChevronUp, ChevronRight,
    ShieldCheck, ClipboardList, Briefcase, Info, AlertCircle,
    Building2, UserCheck, Search, Clock
} from 'lucide-react';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const NOCDashboard: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterDept, setFilterDept] = useState('All');

    useEffect(() => {
        fetchNOCs();
    }, [filterDept]);

    const fetchNOCs = async () => {
        setLoading(true);
        try {
            const department = filterDept === 'All' ? undefined : filterDept;
            const data = await getNOCRequests(department);

            // Inject mock tasks
            const requestsWithTasks = data.data.map((req: any) => {
                let tasks = [];
                if (req.department === 'IT') {
                    tasks = [
                        { id: 1, name: 'Revoke Email Access', completed: false },
                        { id: 2, name: 'Collect Laptop & Charger', completed: false },
                        { id: 3, name: 'Deactivate System Accounts', completed: false }
                    ];
                } else if (req.department === 'Library') {
                    tasks = [
                        { id: 4, name: 'Collect Borrowed Books', completed: false },
                        { id: 5, name: 'Cancel Membership', completed: false }
                    ];
                } else if (req.department === 'Finance') {
                    tasks = [
                        { id: 6, name: 'Clear Salary Advances', completed: false },
                        { id: 7, name: 'Clear Travel Reimbursements', completed: false }
                    ];
                } else if (req.department === 'Admin') {
                    tasks = [
                        { id: 8, name: 'Collect ID Card & Assets', completed: false },
                        { id: 9, name: 'Revoke Physical Access', completed: false }
                    ];
                } else if (req.department === 'HOD') {
                    tasks = [
                        { id: 10, name: 'Verify Document Handover', completed: false },
                        { id: 11, name: 'Confirm Project Transition', completed: false }
                    ];
                } else if (req.department === 'Payroll') {
                    tasks = [
                        { id: 12, name: 'Confirm Payroll Inputs', completed: false },
                        { id: 13, name: 'Verify Notice Period Adjustments', completed: false }
                    ];
                } else {
                    tasks = [
                        { id: 99, name: 'General Clearance Verification', completed: false }
                    ];
                }
                return { ...req, tasks, expanded: req.status === 'Pending' };
            });

            setRequests(requestsWithTasks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: number, status: 'Cleared' | 'Rejected') => {
        const remarks = prompt("Enter remarks (optional):") || "";
        try {
            await updateNOCStatus(id, { status, remarks, cleared_by: 999 }); 
            alert(`NOC ${status} successfully`);
            fetchNOCs();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const toggleTask = (reqId: number, taskId: number) => {
        setRequests(prev => prev.map(req => {
            if (req.id === reqId) {
                return {
                    ...req,
                    tasks: req.tasks.map((t: any) => t.id === taskId ? { ...t, completed: !t.completed } : t)
                };
            }
            return req;
        }));
    };

    const toggleExpand = (reqId: number) => {
        setRequests(prev => prev.map(req =>
            req.id === reqId ? { ...req, expanded: !req.expanded } : req
        ));
    };

    const departments = ['All', 'IT', 'Admin', 'Finance', 'HOD', 'Library', 'Payroll'];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-48 animate-in fade-in duration-500">
                <div className="p-4 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-100 mb-6">
                    <ShieldCheck className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Loading Clearances</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Updating pipeline...</p>
                </div>
            </div>
        );
    }

        return (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 p-2">
            {/* Header / Filter Block */}
            {/* Filter Section */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/50">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-slate-900 rounded-lg shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Departmental NOC</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Manage institutional clearances</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
                            <Filter className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 pr-6 border-r border-slate-100">
                            <Label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Filter Department</Label>
                            <select
                                className="bg-transparent border-none text-[11px] font-bold text-slate-900 focus:outline-none focus:ring-0 cursor-pointer uppercase tracking-wider p-0 min-w-[110px]"
                                value={filterDept}
                                onChange={(e) => setFilterDept(e.target.value)}
                            >
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="pl-4">
                            <Badge className="bg-slate-900 text-white border-none px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                {requests.length} Requests
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card>

            {requests.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-16 h-16 bg-white border border-slate-100 text-slate-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <UserCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">Pipeline Empty</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-sm mx-auto">No pending clearance requests found.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {requests.map(req => (
                        <Card key={req.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                            <div
                                className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer hover:bg-slate-50/50 transition-all"
                                onClick={() => toggleExpand(req.id)}
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`p-1.5 rounded-lg transition-all ${req.expanded ? 'bg-slate-900 text-white rotate-90' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-slate-900 p-0.5 shadow-sm">
                                            <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.employee_name}`} alt={req.employee_name} />
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">{req.employee_name}</h3>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-slate-100 text-slate-600 border-none px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-none">{req.department}</Badge>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" /> LWD: <span className="text-slate-900">{req.resignation_date}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                    <Badge className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border-none shadow-sm
                                        ${req.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                          req.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {req.status}
                                    </Badge>
                                </div>
                            </div>
                                {req.expanded && (
                                <div className="p-8 space-y-10 animate-in slide-in-from-top-2 duration-300 bg-slate-50/30 border-t border-slate-100">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                                <ClipboardList className="w-5 h-5 text-slate-900" />
                                                Checklist
                                            </h4>
                                            <Badge className="bg-white text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-sm">
                                                {req.tasks.filter((t: any) => t.completed).length} / {req.tasks.length} Done
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {req.tasks.map((task: any) => (
                                                <label 
                                                    key={task.id} 
                                                    htmlFor={`task-${task.id}`} 
                                                    className={`group/task flex items-center p-6 rounded-xl border-2 transition-all cursor-pointer shadow-sm
                                                        ${task.completed || req.status === 'Cleared' 
                                                            ? 'bg-emerald-50 border-emerald-100 opacity-60' 
                                                            : 'bg-white border-white hover:border-slate-200 hover:shadow-md transition-all'}`}
                                                >
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`task-${task.id}`}
                                                            checked={task.completed || req.status === 'Cleared'}
                                                            disabled={req.status !== 'Pending'}
                                                            onChange={() => toggleTask(req.id, task.id)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center
                                                            ${task.completed || req.status === 'Cleared'
                                                                ? 'bg-emerald-600 border-emerald-600'
                                                                : 'bg-slate-50 border-slate-200 group-hover/task:border-slate-900'}`}>
                                                            <CheckCircle className={`w-4 h-4 text-white transition-opacity ${task.completed || req.status === 'Cleared' ? 'opacity-100' : 'opacity-0'}`} />
                                                        </div>
                                                    </div>
                                                    <span className={`ml-4 text-[11px] font-bold transition-all uppercase tracking-tight ${task.completed || req.status === 'Cleared' ? 'text-emerald-700 line-through' : 'text-slate-900'}`}>
                                                        {task.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>

                                        {req.status === 'Pending' && req.tasks.length > 0 && !req.tasks.every((t: any) => t.completed) && (
                                            <Card className="p-5 bg-orange-50 border-orange-100 rounded-lg shadow-sm flex items-center gap-4">
                                                <div className="p-2 bg-orange-600 rounded-lg text-white">
                                                    <Info className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-orange-950 uppercase tracking-wider">Incomplete Sequence</p>
                                                    <p className="text-[9px] text-orange-600 font-bold uppercase tracking-wider mt-0.5">Please complete all checklist items to process the NOC.</p>
                                                </div>
                                            </Card>
                                        )}
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex-1 w-full space-y-2">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Record Info</p>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge className={`px-4 py-1 rounded-full text-[9px] font-bold shadow-sm border-none uppercase tracking-wider
                                                    ${req.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                      req.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {req.status}
                                                </Badge>
                                                {req.remarks && (
                                                    <Badge variant="outline" className="px-3 py-0.5 rounded-full text-[9px] font-bold text-slate-600 border-slate-200 bg-white">
                                                        "{req.remarks}"
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                                            {req.status === 'Pending' && (
                                                <>
                                                    <Button
                                                        className="h-11 flex-1 sm:flex-none px-8 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98] disabled:opacity-40"
                                                        onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'Cleared'); }}
                                                        disabled={!req.tasks.every((t: any) => t.completed)}
                                                    >
                                                        Review & Issue
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        className="h-11 flex-1 sm:flex-none px-8 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all" 
                                                        onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'Rejected'); }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NOCDashboard;
