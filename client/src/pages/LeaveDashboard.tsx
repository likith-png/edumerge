import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { defaultLeaveTypes, type LeaveType } from './LeaveConfiguration';
import { Calendar, Plus, Clock, CheckCircle2, History, AlertCircle, Upload, X, Settings, ChevronRight, FileText, Check } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { usePersona } from '../contexts/PersonaContext';
import { useNavigate } from 'react-router-dom';

const mockHistory = [
    { id: 'LR-1044', type: 'Casual Leave (CL)', from: '2024-05-10', to: '2024-05-11', days: 2, status: 'Approved', approver: 'HOD - Dr. Sharma', appliedOn: '2024-05-01', reason: 'Attending a family function out of station.', hasProof: false },
    { id: 'LR-0921', type: 'Vacation (VL)', from: '2023-12-20', to: '2024-01-02', days: 14, status: 'Approved', approver: 'HOD - Dr. Sharma', appliedOn: '2023-11-15', reason: 'Annual winter vacation.', hasProof: false },
    { id: 'LR-0855', type: 'Casual Leave (CL)', from: '2023-10-15', to: '2023-10-15', days: 1, status: 'Approved', approver: 'HOD - Dr. Sharma', appliedOn: '2023-10-10', reason: 'Medical appointment.', hasProof: false },
    { id: 'LR-0830', type: 'On Exam Duty (OED)', from: '2023-09-01', to: '2023-09-02', days: 2, status: 'Rejected', approver: 'HOD - Dr. Sharma', appliedOn: '2023-08-28', reason: 'Assigned as flying squad invigilator at center 45.', hasProof: true, rejectReason: 'Scheduling clash with departmental exam.' },
];

const LeaveDashboard = () => {
    const { user, role } = usePersona();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();

    // Leave Types & Balances State
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [balances, setBalances] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('edumerge_leave_types');
        const types: LeaveType[] = stored ? JSON.parse(stored) : defaultLeaveTypes;
        setLeaveTypes(types);

        const generatedBalances = types.map((t, idx) => {
            const numMatch = t.teachingPerm.match(/\d+/);
            const total = numMatch ? parseInt(numMatch[0]) : 0;
            const taken = total > 0 ? Math.floor(total * 0.3) : 0; // Mock taken
            const colors = [
                { color: 'text-blue-600', bg: 'bg-blue-50' },
                { color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { color: 'text-purple-600', bg: 'bg-purple-50' },
                { color: 'text-amber-600', bg: 'bg-amber-50' },
                { color: 'text-rose-600', bg: 'bg-rose-50' },
                { color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { color: 'text-slate-600', bg: 'bg-slate-50' }
            ];
            const theme = colors[idx % colors.length];

            return {
                type: t.name,
                total: total,
                taken: taken,
                balance: total > 0 ? total - taken : 0,
                color: theme.color,
                bg: theme.bg
            };
        });
        setBalances(generatedBalances);
        if (types.length > 0) setLeaveType(types[0].name);
    }, []);

    // Apply Leave Form State
    const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
        return diffDays;
    };

    const requestedDays = calculateDays();
    const requiresProof = requestedDays > 3 || leaveType === 'On Exam Duty (OED)';

    return (
        <Layout title="My Leave Dashboard" description={`Manage your time off, ${user.name}`} icon={Calendar} showHome>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

                {/* Header Action */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">Leave Balances for 2024</h2>
                        <p className="text-sm text-slate-500">Your entitlements calculate based on 'Teaching (Permanent)' policy rules.</p>
                    </div>
                    <div className="flex gap-3">
                        {role === 'HR_ADMIN' && (
                            <Button variant="outline" onClick={() => navigate('/leave/config')} className="bg-white">
                                <Settings className="w-4 h-4 mr-2" />
                                Configure Policy
                            </Button>
                        )}
                        <Button onClick={() => setShowApplyModal(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" />
                            Apply for Leave
                        </Button>
                    </div>
                </div>

                {/* Balances Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {balances.map((bal, idx) => (
                        <Card key={idx} className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:-translate-y-1 transition-transform duration-300">
                            <CardContent className="p-5 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2.5 rounded-xl ${bal.bg} ${bal.color}`}>
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Total: {bal.total}</span>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-800 mb-1">{bal.balance}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{bal.type}</div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs">
                                    <span className="font-semibold text-slate-500">Taken: <span className="text-slate-700">{bal.taken}</span></span>
                                    <span className="font-semibold text-emerald-600">Avail: {bal.balance}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* History Table */}
                <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-800">Leave Application History</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Request ID</th>
                                    <th className="px-6 py-4">Leave Type</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Applied On</th>
                                    <th className="px-6 py-4">Status & Approver</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {mockHistory.map((hist, idx) => (
                                    <tr key={idx} onClick={() => setSelectedHistory(hist)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 font-bold text-blue-600 group-hover:text-blue-700">{hist.id}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">{hist.type}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800 font-semibold">{hist.days} Days</div>
                                            <div className="text-xs text-slate-500">{hist.from} to {hist.to}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{hist.appliedOn}</td>
                                        <td className="px-6 py-4 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {hist.status === 'Approved' ? (
                                                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Approved
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-full flex items-center gap-1">
                                                            <X className="w-3 h-3" /> Rejected
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 font-medium">{hist.approver}</div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Apply Leave Modal */}
                {showApplyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">

                            {submitSuccess ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center animate-in zoom-in-95">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">Request Submitted!</h3>
                                    <p className="text-slate-500 mb-8 max-w-sm">Your leave application has been routed to your approvers as per the policy workflow.</p>
                                    <Button
                                        onClick={() => {
                                            setSubmitSuccess(false);
                                            setShowApplyModal(false);
                                            setStartDate('');
                                            setEndDate('');
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Done
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <div>
                                            <h3 className="font-black text-xl text-slate-800 tracking-tight">Apply for Leave</h3>
                                            <p className="text-sm text-slate-500 mt-1">Submit your request for necessary approvals.</p>
                                        </div>
                                        <button onClick={() => setShowApplyModal(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-8 overflow-y-auto space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Leave Type</label>
                                            <select
                                                value={leaveType}
                                                onChange={(e) => setLeaveType(e.target.value)}
                                                className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm"
                                            >
                                                {leaveTypes.map((t) => (
                                                    <option key={t.id} value={t.name}>{t.name}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-slate-500 mt-1">Available balance: <span className="font-bold text-slate-700">{balances.find(b => b.type === leaveType)?.balance || 0} days</span></p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-slate-700">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-slate-700">End Date</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                        </div>

                                        {requestedDays > 0 && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <span className="text-sm font-bold text-blue-900">Total Duration Calculated</span>
                                                </div>
                                                <span className="text-lg font-black text-blue-700">{requestedDays} Days</span>
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Reason / Notes</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Please provide additional context for your approvers..."
                                                className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                                            ></textarea>
                                        </div>

                                        {requiresProof && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                                    <span className="text-xs font-bold">Policy rules require supporting documentation for this request (e.g. OED proof, or CL &gt; 3 days).</span>
                                                </div>
                                                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">Click to upload document</span>
                                                    <span className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                        <Button variant="outline" onClick={() => setShowApplyModal(false)} disabled={isSubmitting}>Cancel</Button>
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                            disabled={isSubmitting || !startDate || !endDate}
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                setTimeout(() => {
                                                    setIsSubmitting(false);
                                                    setSubmitSuccess(true);
                                                }, 1000);
                                            }}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* History Details Slide-over / Modal */}
                {selectedHistory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-xl text-slate-800 tracking-tight">Request Details</h3>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{selectedHistory.id}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-500">Submitted on {selectedHistory.appliedOn}</p>
                                </div>
                                <button onClick={() => setSelectedHistory(null)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors bg-white shadow-sm border border-slate-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[70vh]">
                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                                    <div className="text-xl font-black text-blue-700 mb-2">{selectedHistory.type}</div>
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <div className="text-xs text-slate-500 font-semibold mb-0.5">Duration</div>
                                            <div className="font-bold text-slate-800">{selectedHistory.days} Days</div>
                                        </div>
                                        <div className="w-px h-8 bg-blue-200"></div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-semibold mb-0.5">Timeline</div>
                                            <div className="font-bold text-slate-800">{selectedHistory.from} to {selectedHistory.to}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="text-xs font-bold text-slate-500 mb-1">Your Reason / Notes</div>
                                    <p className="text-sm text-slate-700">{selectedHistory.reason}</p>
                                </div>

                                {selectedHistory.hasProof && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-emerald-600 tracking-wider mb-2 flex items-center gap-1"><Check className="w-3 h-3" /> Supporting Evidence attached</h4>
                                        <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-white hover:border-emerald-300 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-lg group-hover:bg-emerald-100"><FileText className="w-5 h-5" /></div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-800 group-hover:text-emerald-700">Exam_Duty_Proof.pdf</div>
                                                    <div className="text-xs text-slate-500">1.2 MB PDF Document</div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-emerald-600">Download</Button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Routing & Verification</h4>
                                    <div className={`p-4 rounded-xl border ${selectedHistory.status === 'Approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            {selectedHistory.status === 'Approved' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <X className="w-5 h-5 text-rose-600" />}
                                            <span className={`font-bold ${selectedHistory.status === 'Approved' ? 'text-emerald-800' : 'text-rose-800'}`}>
                                                Status: {selectedHistory.status}
                                            </span>
                                        </div>
                                        <div className={`text-sm ${selectedHistory.status === 'Approved' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            Processed by <span className="font-bold">{selectedHistory.approver}</span>
                                        </div>
                                        {selectedHistory.rejectReason && (
                                            <div className="mt-3 p-3 bg-white/60 rounded-lg text-sm font-medium text-rose-800 border border-rose-100">
                                                <strong>Notes:</strong> {selectedHistory.rejectReason}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default LeaveDashboard;
