import { useState } from 'react';
import Layout from '../components/Layout';
import { CalendarCheck, Search, Filter, Check, X, Eye, Clock, FileText, AlertTriangle, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const mockPendingApprovals = [
    { id: 'LR-1045', employee: 'Ms. Reshma Binu Prasad', role: 'Asst. Professor', type: 'Casual Leave (CL)', from: '2024-06-12', to: '2024-06-15', days: 4, appliedOn: '2024-06-01', hasProof: true },
    { id: 'LR-1046', employee: 'Ms. Sanchaiyata Majumdar', role: 'Lecturer', type: 'Sick Leave (SL)', from: '2024-06-18', to: '2024-06-18', days: 1, appliedOn: '2024-06-17', hasProof: false },
    { id: 'LR-1047', employee: 'Dr. R Sedhunivas', role: 'HOD', type: 'Earned Leave (EL)', from: '2024-07-10', to: '2024-07-20', days: 10, appliedOn: '2024-06-10', hasProof: true },
    { id: 'LR-1048', employee: 'Dr. Ranjita Saikia', role: 'Professor', type: 'On Exam Duty (OED)', from: '2024-06-20', to: '2024-06-21', days: 2, appliedOn: '2024-06-05', hasProof: true },
    { id: 'LR-1049', employee: 'Mr. Manjit Singh', role: 'Lab Assistant', type: 'Casual Leave (CL)', from: '2024-06-25', to: '2024-06-25', days: 1, appliedOn: '2024-06-15', hasProof: false },
    { id: 'LR-1052', employee: 'Mr. Edwin Vimal A', role: 'Lecturer', type: 'Vacation (VL)', from: '2024-07-01', to: '2024-07-07', days: 7, appliedOn: '2024-06-08', hasProof: false },
];

const LeaveApprovals = () => {
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [rejectMode, setRejectMode] = useState(false);
    const [actionState, setActionState] = useState<'idle' | 'processing' | 'success'>('idle');

    return (
        <Layout title="Leave Approvals" description="Review and action team leave requests" icon={CalendarCheck} showHome>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase">Pending Actions</div>
                                <div className="text-3xl font-black text-slate-800 tracking-tight">3</div>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase">Approved This Month</div>
                                <div className="text-3xl font-black text-emerald-600 tracking-tight">14</div>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <Check className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase">Team on Leave Today</div>
                                <div className="text-3xl font-black text-blue-600 tracking-tight">2</div>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Requests Table */}
                <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" placeholder="Search by name or ID..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <Button variant="outline" className="bg-white whitespace-nowrap"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Request Specs</th>
                                    <th className="px-6 py-4">Documents</th>
                                    <th className="px-6 py-4">Submitted</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {mockPendingApprovals.map((req, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{req.employee}</div>
                                            <div className="text-xs font-semibold text-slate-500">{req.role}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-blue-600 mb-1">{req.type}</div>
                                            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block">{req.days} Days</div>
                                            <span className="text-xs text-slate-500 ml-2">{req.from} → {req.to}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.hasProof ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-flex">
                                                    <FileText className="w-3 h-3" /> Attached
                                                </span>
                                            ) : (
                                                <span className="text-xs font-medium text-slate-400">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{req.appliedOn}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                onClick={() => {
                                                    setSelectedRequest(req);
                                                    setRejectMode(false);
                                                    setActionState('idle');
                                                }}
                                                variant="outline" size="sm" className="bg-white hover:bg-slate-50 shadow-sm"
                                            >
                                                <Eye className="w-4 h-4 mr-2" /> Review
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Review Modal */}
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-2xl text-slate-800 tracking-tight">{selectedRequest.employee}</h3>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{selectedRequest.id}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-500">{selectedRequest.role} • Request submitted on {selectedRequest.appliedOn}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors bg-white shadow-sm border border-slate-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto bg-white flex flex-col md:flex-row gap-8">
                                {/* Request Details */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Leave Request Details</h4>
                                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-4">
                                            <div className="text-xl font-black text-blue-700 mb-2">{selectedRequest.type}</div>
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <div className="text-xs text-slate-500 font-semibold mb-0.5">Duration</div>
                                                    <div className="font-bold text-slate-800">{selectedRequest.days} Days</div>
                                                </div>
                                                <div className="w-px h-8 bg-blue-200"></div>
                                                <div>
                                                    <div className="text-xs text-slate-500 font-semibold mb-0.5">Timeline</div>
                                                    <div className="font-bold text-slate-800">{selectedRequest.from} to {selectedRequest.to}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="text-xs font-bold text-slate-500 mb-1">Employee Reason</div>
                                            <p className="text-sm text-slate-700">Attending a family function out of station. Will ensure all academic duties are covered prior to departure.</p>
                                        </div>
                                    </div>

                                    {selectedRequest.hasProof && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-emerald-600 tracking-wider mb-2 flex items-center gap-1"><Check className="w-3 h-3" /> Supporting Evidence</h4>
                                            <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-white hover:border-emerald-300 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-lg group-hover:bg-emerald-100"><FileText className="w-5 h-5" /></div>
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-800 group-hover:text-emerald-700">Supporting_Doc_024.pdf</div>
                                                        <div className="text-xs text-slate-500">2.4 MB PDF Document</div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-emerald-600">View</Button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedRequest.days > 3 && !selectedRequest.hasProof && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="font-bold text-amber-800 text-sm">Policy Exception Warning</div>
                                                <p className="text-xs text-amber-700 mt-1">Leave duration exceeds 3 days, but no supporting document was uploaded. Edumerge policy typically requires documentation for extensive CLs.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Sidebar - Analytics */}
                                <div className="w-full md:w-64 space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Leave Balances</h4>
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-slate-500">Available</span>
                                                <span className="font-black text-blue-600">8 Days</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1"><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '33%' }}></div></div>
                                            <div className="text-[10px] text-slate-400 font-semibold text-right">Based on Annual CL Limit (12)</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Team Overlap</h4>
                                        {selectedRequest.id === 'LR-1045' ? (
                                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                                <div className="text-xs font-bold text-rose-800 leading-tight">
                                                    1 other staff member (K Pramilarani) is on leave during this period in this department.
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600" />
                                                <div className="text-xs font-bold text-emerald-800 leading-tight">
                                                    Zero overlapping leaves in team.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex flex-col gap-4">
                                {actionState === 'success' ? (
                                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200">
                                        <div className="flex items-center gap-2 font-bold">
                                            <Check className="w-5 h-5" />
                                            Request Processed Successfully
                                        </div>
                                        <Button size="sm" onClick={() => setSelectedRequest(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white">Return to Queue</Button>
                                    </div>
                                ) : rejectMode ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-3">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-slate-400" /> Rejection Reason (Mandatory)</label>
                                        <textarea rows={2} placeholder="Explain why this request is being rejected..." className="w-full text-sm p-3 border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-xl outline-none resize-none bg-white"></textarea>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setRejectMode(false)} disabled={actionState === 'processing'}>Cancel Rejection</Button>
                                            <Button
                                                className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 disabled:opacity-50"
                                                disabled={actionState === 'processing'}
                                                onClick={() => {
                                                    setActionState('processing');
                                                    setTimeout(() => setActionState('success'), 1200);
                                                }}
                                            >
                                                {actionState === 'processing' ? 'Processing...' : 'Confirm Rejection'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end gap-3">
                                        <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setRejectMode(true)}>
                                            <X className="w-4 h-4 mr-2" /> Reject Request
                                        </Button>
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 flex-1 md:flex-none md:w-48 disabled:opacity-50"
                                            disabled={actionState === 'processing'}
                                            onClick={() => {
                                                setActionState('processing');
                                                setTimeout(() => setActionState('success'), 1200);
                                            }}
                                        >
                                            {actionState === 'processing' ? 'Processing...' : <><Check className="w-4 h-4 mr-2" /> Approve Leave</>}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default LeaveApprovals;
