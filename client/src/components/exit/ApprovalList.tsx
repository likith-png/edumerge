import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
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

    // Generate timeline steps based on exit status
    const getTimeline = (exit: any) => {
        const timeline = [
            { label: 'Submitted', status: 'completed', date: exit.submission_date || exit.resignation_date },
            { label: 'Manager Review', status: exit.status === 'Pending' ? 'current' : exit.status.includes('Approved') ? 'completed' : 'pending', date: exit.manager_approved_date },
            { label: 'HR Approval', status: exit.status === 'HR_Approved' || exit.status === 'Approved' ? 'completed' : exit.status === 'Manager_Approved' ? 'current' : 'pending', date: exit.hr_approved_date },
            { label: 'NOC Clearance', status: exit.status === 'HR_Approved' ? 'current' : exit.status === 'Approved' ? 'completed' : 'pending', date: null },
            { label: 'Completed', status: exit.status === 'Approved' ? 'completed' : 'pending', date: exit.completion_date }
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
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-slate-500">Loading approvals...</p>
                </div>
            ) : filteredExits.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="text-center py-12">
                        <CheckCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">No pending approvals for {simulatedRole}</p>
                        <p className="text-xs text-slate-400 mt-1">All requests have been processed</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredExits.map(exit => {
                        const timeline = getTimeline(exit);
                        const isExpanded = expandedExit === exit.id;
                        const canApprove = exit.status === 'Pending' && exit.current_approver_role === simulatedRole;

                        return (
                            <Card key={exit.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exit.employee_name}`}
                                                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                                alt={exit.employee_name}
                                            />
                                            <div>
                                                <CardTitle className="text-lg font-bold text-slate-900">{exit.employee_name}</CardTitle>
                                                <p className="text-sm text-slate-500">{exit.department} • {exit.designation || 'Employee'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${exit.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    exit.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        exit.status === 'Manager_Approved' ? 'bg-blue-100 text-blue-800' :
                                                            exit.status === 'HR_Approved' ? 'bg-cyan-100 text-cyan-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {exit.status}
                                            </span>
                                            <p className="text-xs text-slate-400 mt-1">Submitted: {exit.resignation_date}</p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    {/* Key Information Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Reason</p>
                                            <p className="text-sm font-semibold text-slate-900">{exit.reason}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Proposed LWD</p>
                                            <p className="text-sm font-semibold text-slate-900">{exit.lwd_proposed}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Current Approver</p>
                                            <p className="text-sm font-semibold text-indigo-600">{exit.current_approver_role || 'Completed'}</p>
                                        </div>
                                    </div>

                                    {/* Timeline View */}
                                    <div>
                                        <button
                                            onClick={() => setExpandedExit(isExpanded ? null : exit.id)}
                                            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-3"
                                        >
                                            <span>{isExpanded ? '▼' : '▶'}</span>
                                            {isExpanded ? 'Hide' : 'Show'} Approval Timeline
                                        </button>

                                        {isExpanded && (
                                            <div className="relative pl-8 border-l-2 border-slate-200 ml-2 space-y-6">
                                                {timeline.map((step, idx) => (
                                                    <div key={idx} className="relative">
                                                        <div className={`absolute -left-[37px] w-6 h-6 rounded-full border-2 flex items-center justify-center ${step.status === 'completed' ? 'bg-green-500 border-green-500' :
                                                                step.status === 'current' ? 'bg-indigo-500 border-indigo-500 animate-pulse' :
                                                                    'bg-slate-200 border-slate-300'
                                                            }`}>
                                                            {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                                                        </div>
                                                        <div className={`pb-6 ${step.status === 'current' ? 'bg-indigo-50 -ml-6 pl-6 pr-4 py-3 rounded-r-lg border-l-2 border-indigo-500' : ''}`}>
                                                            <p className={`text-sm font-semibold ${step.status === 'completed' ? 'text-green-700' :
                                                                    step.status === 'current' ? 'text-indigo-700' :
                                                                        'text-slate-400'
                                                                }`}>
                                                                {step.label}
                                                            </p>
                                                            {step.date && (
                                                                <p className="text-xs text-slate-500 mt-1">{new Date(step.date).toLocaleDateString()}</p>
                                                            )}
                                                            {step.status === 'current' && (
                                                                <p className="text-xs text-indigo-600 mt-1 font-medium">⏳ Awaiting action</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Waiver Request Details */}
                                    {exit.waiver_requested === 1 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <p className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                Waiver Requested
                                            </p>
                                            <p className="text-sm text-slate-700 italic mb-2">"{exit.waiver_reason}"</p>
                                            <div className="flex gap-4 text-xs text-slate-600">
                                                <span>Shortfall: <strong>{exit.shortfall_days} days</strong></span>
                                                <span>Buyout Amount: <strong>₹{exit.buyout_amount}</strong></span>
                                            </div>
                                            <div className="mt-2">
                                                {exit.waiver_approved === 1 ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Waiver Approved
                                                    </span>
                                                ) : exit.waiver_approved === 0 ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                        Pending Review
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                        <XCircle className="w-3 h-3 mr-1" /> Waiver Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                                        {/* Waiver Actions for HR */}
                                        {simulatedRole === 'HR' && exit.waiver_requested === 1 && exit.waiver_approved === 0 && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleWaiver(exit.id, true)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Approve Waiver
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleWaiver(exit.id, false)}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject Waiver
                                                </Button>
                                            </>
                                        )}

                                        {/* Resignation Approval Actions */}
                                        {canApprove ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                                                    onClick={() => handleApproval(exit.id, 'Approved', exit.lwd_proposed)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Approve Resignation
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1 shadow-md"
                                                    onClick={() => handleApproval(exit.id, 'Rejected')}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject Request
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex-1 text-center text-sm text-slate-500 py-2">
                                                {exit.status !== 'Pending' ? (
                                                    <span className="inline-flex items-center gap-2 text-slate-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Already Processed
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        Awaiting {exit.current_approver_role}'s approval
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ApprovalList;
