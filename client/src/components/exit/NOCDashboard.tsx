import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getNOCRequests, updateNOCStatus } from '../../services/exitService';
import { CheckCircle, XCircle, Filter, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Label } from '../ui/label';

// Let's use standard native checkbox since ui/checkbox might not be available
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

            // Inject mock tasks into the data since backend doesn't have them yet
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
            await updateNOCStatus(id, { status, remarks, cleared_by: 999 }); // Mock ID
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

    return (
        <div className="space-y-6">
            <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 drop-shadow-sm">Departmental Clearances</h2>
                        <p className="text-xs font-medium text-slate-500">Manage NOC tasks & approvals</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-inner">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <Label className="text-sm font-bold text-slate-700">Filter:</Label>
                    <select
                        className="bg-transparent border-none text-sm font-medium text-indigo-900 focus:outline-none focus:ring-0 cursor-pointer"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                    >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 glass-panel shadow-sm object-center flex flex-col items-center">
                    <div className="inline-block animate-spin-slow rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 shadow-sm"></div>
                    <p className="mt-4 font-bold text-slate-600 animate-pulse">Loading clearance data...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="glass-panel text-center py-16 shadow-lg relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl"></div>
                    <ShieldCheck className="w-16 h-16 mx-auto text-emerald-400 mb-4 drop-shadow-md relative z-10" />
                    <p className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent relative z-10">All Clear!</p>
                    <p className="text-sm font-medium text-slate-500 mt-2 relative z-10">No pending clearance requests found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {requests.map(req => (
                        <div key={req.id} className="glass-card overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div
                                className="p-5 bg-white/40 backdrop-blur-md border-b border-white/60 relative overflow-hidden flex flex-row justify-between items-center cursor-pointer hover:bg-white/60 transition-colors"
                                onClick={() => toggleExpand(req.id)}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="p-2 bg-white/60 rounded-xl shadow-sm border border-white/80 group-hover:scale-110 transition-transform">
                                        {req.expanded ? <ChevronUp className="w-5 h-5 text-indigo-600 drop-shadow-sm" /> : <ChevronDown className="w-5 h-5 text-indigo-600 drop-shadow-sm" />}
                                    </div>
                                    <div>
                                        <span className="font-bold text-base text-slate-900 block drop-shadow-sm">{req.employee_name}</span>
                                        <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 mt-1.5 inline-block bg-indigo-100/80 text-indigo-800 rounded-full border border-indigo-200/50 shadow-sm">{req.department} Dept</span>
                                    </div>
                                </div>
                                <div className="text-right relative z-10">
                                    <span className="text-xs font-bold text-slate-500 block">LWD: {req.resignation_date}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold mt-1.5 inline-block shadow-sm border
                                        ${req.status === 'Pending' ? 'bg-amber-100/80 text-amber-800 border-amber-200/50' :
                                            req.status === 'Cleared' ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200/50' : 'bg-rose-100/80 text-rose-800 border-rose-200/50'}`}>
                                        {req.status}
                                    </span>
                                </div>
                            </div>

                            {req.expanded && (
                                <div className="p-0 animate-in slide-in-from-top-2 duration-300 bg-white/20">
                                    <div className="p-6 bg-white/30 border-b border-white/50 relative overflow-hidden">
                                        <div className="absolute top-1/2 -right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none"></div>
                                        <h4 className="text-xs font-black text-indigo-900/50 uppercase tracking-widest mb-4 drop-shadow-sm flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Clearance Checklist
                                        </h4>
                                        <div className="space-y-3 relative z-10">
                                            {req.tasks.map((task: any) => (
                                                <label key={task.id} htmlFor={`task-${task.id}`} className="group/task flex items-center p-3 bg-white/50 hover:bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm cursor-pointer transition-all hover:scale-[1.01]">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`task-${task.id}`}
                                                            checked={task.completed || req.status === 'Cleared'}
                                                            disabled={req.status !== 'Pending'}
                                                            onChange={() => toggleTask(req.id, task.id)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="w-6 h-6 rounded-md border-2 border-indigo-200 bg-white shadow-inner flex items-center justify-center peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors">
                                                            <CheckCircle className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                    <span className={`ml-4 text-sm font-bold transition-all ${task.completed || req.status === 'Cleared' ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800 group-hover/task:text-indigo-900'}`}>
                                                        {task.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>

                                        {req.status === 'Pending' && req.tasks.length > 0 && !req.tasks.every((t: any) => t.completed) && (
                                            <p className="text-xs font-bold text-amber-700 mt-5 bg-amber-50/80 backdrop-blur-sm p-3 rounded-xl border border-amber-200/60 shadow-inner flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                Please complete all checklist items to clear NOC.
                                            </p>
                                        )}
                                    </div>

                                    <div className="p-5 bg-white/40 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex-1 w-full text-center sm:text-left">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status Summary</p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm border inline-flex items-center gap-1.5
                                                ${req.status === 'Pending' ? 'bg-amber-100/80 text-amber-900 border-amber-200' :
                                                    req.status === 'Cleared' ? 'bg-emerald-100/80 text-emerald-900 border-emerald-200' : 'bg-rose-100/80 text-rose-900 border-rose-200'}`}>
                                                {req.status === 'Cleared' && <CheckCircle className="w-3.5 h-3.5" />}
                                                {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                                                {req.status}
                                            </span>
                                            {req.remarks && <p className="text-xs font-medium text-slate-600 mt-2 bg-white/60 p-2 rounded-lg border border-white/80 shadow-inner italic">"{req.remarks}"</p>}
                                        </div>
                                        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                                            {req.status === 'Pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 sm:flex-none text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                                                        onClick={() => handleAction(req.id, 'Cleared')}
                                                        disabled={!req.tasks.every((t: any) => t.completed)}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1.5 drop-shadow-sm" /> Clear NOC
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-rose-600 border-rose-200 bg-white/80 hover:bg-rose-50 shadow-sm rounded-xl font-bold transition-all" onClick={() => handleAction(req.id, 'Rejected')}>
                                                        <XCircle className="w-4 h-4 mr-1.5" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NOCDashboard;
