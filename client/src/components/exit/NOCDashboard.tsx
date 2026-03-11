import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { getNOCRequests, updateNOCStatus } from '../../services/exitService';
import { CheckCircle, XCircle, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
                        { id: 3, name: 'Deactivate ERP Account', completed: false }
                    ];
                } else if (req.department === 'Library') {
                    tasks = [
                        { id: 4, name: 'Collect Borrowed Books', completed: false },
                        { id: 5, name: 'Cancel Library Membership', completed: false }
                    ];
                } else if (req.department === 'Finance') {
                    tasks = [
                        { id: 6, name: 'Clear Salary Advances', completed: false },
                        { id: 7, name: 'Clear Travel Reimbursements', completed: false }
                    ];
                } else {
                    tasks = [
                        { id: 8, name: 'General Clearance Verification', completed: false }
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

    const departments = ['All', 'IT', 'Library', 'Finance', 'Admin', 'Asset Management', 'Inventory / Stores', 'Hostel', 'Transport'];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-slate-500" />
                <Label className="text-sm">Filter Department:</Label>
                <select
                    className="h-9 rounded-md border border-slate-200 text-sm px-2"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            {loading ? <p>Loading requests...</p> : requests.map(req => (
                <Card key={req.id} className="border-slate-200">
                    <CardHeader
                        className="py-3 px-4 bg-slate-50 border-b border-slate-100 flex flex-row justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleExpand(req.id)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white rounded-md border border-slate-200">
                                {req.expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>
                            <div>
                                <span className="font-semibold text-sm block">{req.employee_name}</span>
                                <span className="text-xs px-2 py-0.5 mt-1 inline-block bg-blue-100 text-blue-800 rounded-full">{req.department} Dept</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-500 block">Resigned: {req.resignation_date}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold mt-1 inline-block
                                ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    req.status === 'Cleared' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {req.status}
                            </span>
                        </div>
                    </CardHeader>

                    {req.expanded && (
                        <CardContent className="p-0">
                            <div className="p-4 bg-white border-b border-slate-100">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Clearance Checklist</h4>
                                <div className="space-y-3">
                                    {req.tasks.map((task: any) => (
                                        <div key={task.id} className="flex items-start space-x-3">
                                            <input
                                                type="checkbox"
                                                id={`task-${task.id}`}
                                                checked={task.completed || req.status === 'Cleared'}
                                                disabled={req.status !== 'Pending'}
                                                onChange={() => toggleTask(req.id, task.id)}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <div className="grid gap-1.5 leading-none mt-1">
                                                <label
                                                    htmlFor={`task-${task.id}`}
                                                    className={`text-sm font-medium leading-none ${task.completed || req.status === 'Cleared' ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                                                >
                                                    {task.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {req.status === 'Pending' && req.tasks.length > 0 && !req.tasks.every((t: any) => t.completed) && (
                                    <p className="text-xs text-amber-600 mt-4 bg-amber-50 p-2 rounded border border-amber-100">
                                        Please complete all checklist items above before clearing this NOC.
                                    </p>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50 flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500">Status</p>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                                ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            req.status === 'Cleared' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {req.status}
                                    </span>
                                    {req.remarks && <p className="text-xs text-slate-500 mt-1">Remarks: {req.remarks}</p>}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {req.status === 'Pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-600 border-green-200 hover:bg-green-50 disabled:opacity-50"
                                                onClick={() => handleAction(req.id, 'Cleared')}
                                                disabled={!req.tasks.every((t: any) => t.completed)}
                                            >
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Clear
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(req.id, 'Rejected')}>
                                                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default NOCDashboard;
