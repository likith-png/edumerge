import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { defaultLeaveTypes, type LeaveType } from './LeaveConfiguration';
import {
    Calendar, Plus, Clock, CheckCircle2, History, AlertCircle,
    Upload, X, Settings, ChevronRight, FileText, Check, Info
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { usePersona } from '../contexts/PersonaContext';
import { useNavigate } from 'react-router-dom';

interface HistoryRecord {
    id: string;
    type: string;
    from: string;
    to: string;
    days: number;
    status: 'Approved' | 'Rejected' | 'Pending';
    approver: string;
    appliedOn: string;
    reason: string;
    hasProof: boolean;
    rejectReason?: string;
}

interface Balance {
    type: string;
    total: number;
    taken: number;
    balance: number;
    color: string;
    bg: string;
    accent: string;
}

const mockHistory: HistoryRecord[] = [
    { id: 'LR-1044', type: 'Casual Leave (CL)', from: '2024-05-10', to: '2024-05-11', days: 2, status: 'Approved', approver: 'HOD - Dr. Sharma', appliedOn: '2024-05-01', reason: 'Attending a family function out of station.', hasProof: false },
    { id: 'LR-0921', type: 'Vacation (VL)', from: '2023-12-20', to: '2024-01-02', days: 14, status: 'Approved', approver: 'HOD - Dr. Sharma', appliedOn: '2023-11-15', reason: 'Annual winter vacation.', hasProof: false },
    { id: 'LR-0855', type: 'Casual Leave (CL)', from: '2023-10-15', to: '2023-10-15', days: 1, status: 'Approved', approver: 'HOD - Dr. Sharma', appliedOn: '2023-10-10', reason: 'Medical appointment.', hasProof: false },
    { id: 'LR-0830', type: 'On Exam Duty (OED)', from: '2023-09-01', to: '2023-09-02', days: 2, status: 'Rejected', approver: 'HOD - Dr. Sharma', appliedOn: '2023-08-28', reason: 'Assigned as flying squad invigilator at center 45.', hasProof: true, rejectReason: 'Scheduling clash with departmental exam.' },
];

const LeaveDashboard = () => {
    const { role } = usePersona();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();

    // Leave Types & Balances State
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [balances, setBalances] = useState<Balance[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('edumerge_leave_types');
        const types: LeaveType[] = stored ? JSON.parse(stored) : defaultLeaveTypes;

        // Mock User Joining Date (e.g., joined on 6th of current month to test rule)
        const joiningDate = new Date();
        joiningDate.setDate(6); // Joined on 6th -> No CL for first month
        const isFirstMonth = new Date().getMonth() === joiningDate.getMonth() && new Date().getFullYear() === joiningDate.getFullYear();
        const joiningDay = joiningDate.getDate();

        const filteredTypes = types.filter(t => {
            if (t.id === 'CL' && isFirstMonth && joiningDay > 5) return false;
            return true;
        });

        setLeaveTypes(filteredTypes);

        const generatedBalances = filteredTypes.map((t, idx) => {
            const numMatch = t.teachingPerm.match(/\d+/);
            const total = numMatch ? parseInt(numMatch[0]) : 0;
            const taken = total > 0 ? Math.floor(total * 0.3) : 0; // Mock taken
            const themes = [
                { color: 'text-indigo-600', bg: 'bg-indigo-50/50', accent: 'bg-indigo-600' },
                { color: 'text-emerald-600', bg: 'bg-emerald-50/50', accent: 'bg-emerald-600' },
                { color: 'text-rose-600', bg: 'bg-rose-50/50', accent: 'bg-rose-600' },
                { color: 'text-amber-600', bg: 'bg-amber-50/50', accent: 'bg-amber-600' },
                { color: 'text-sky-600', bg: 'bg-sky-50/50', accent: 'bg-sky-600' },
                { color: 'text-violet-600', bg: 'bg-violet-50/50', accent: 'bg-violet-600' },
            ];
            const theme = themes[idx % themes.length];

            return {
                type: t.name,
                total: total,
                taken: taken,
                balance: total > 0 ? total - taken : 0,
                color: theme.color,
                bg: theme.bg,
                accent: theme.accent
            };
        });
        setBalances(generatedBalances);
        if (types.length > 0) setLeaveType(types[0].name);
    }, []);

    // Apply Leave Form State
    const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const isHoliday = (date: Date) => {
        const day = date.getDay();
        const d = date.getDate();
        const weekNum = Math.ceil(d / 7);
        const dateString = date.toISOString().split('T')[0];

        const publicHolidays = ['2024-05-01', '2024-08-15', '2024-10-02', '2024-12-25'];

        // Weekly off: Sundays and 1st/3rd Saturdays
        if (day === 0) return true;
        if (day === 6 && [1, 3].includes(weekNum)) return true;
        if (publicHolidays.includes(dateString)) return true;

        return false;
    };

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Basic count
        const diffTime = Math.abs(end.getTime() - start.getTime());
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (leaveType.includes('Casual Leave (CL)')) {
            const beforeStart = new Date(start);
            beforeStart.setDate(beforeStart.getDate() - 1);
            const afterEnd = new Date(end);
            afterEnd.setDate(afterEnd.getDate() + 1);

            const isBeforeHoliday = isHoliday(beforeStart);
            const isAfterHoliday = isHoliday(afterEnd);

            // 1. Sandwich Rule: If CL appears both before and after a holiday
            let holidaysInBetween = 0;
            let current = new Date(start);
            while (current <= end) {
                if (isHoliday(current)) holidaysInBetween++;
                current.setDate(current.getDate() + 1);
            }

            // If it's a CL and it's on both sides of a holiday (either within the range or prefix/suffix)
            if (isBeforeHoliday && isAfterHoliday) {
                diffDays += 1; // Penalty for prefix & suffix combo
            } else if (isBeforeHoliday || isAfterHoliday) {
                if (diffDays === 1) diffDays = 2; // Prefix/Suffix to non-working day counts as 2
            }
        }

        return diffDays;
    };

    const requestedDays = calculateDays();
    const requiresProof = requestedDays > 3 || leaveType === 'On Exam Duty (OED)';

    return (
        <Layout title="Leave Management" description="Institutional absence management and policy compliance." icon={Calendar} showHome>
            <div className="space-y-6 pb-16">


                    {/* Performance Header (Glass) */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 border border-slate-200 bg-white rounded-xl shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Overview</h2>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Rule Engine v4.0</Badge>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <p className="text-xs text-slate-500 font-medium tracking-wide">Institutional Leave Repository</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                            {role === 'HR_ADMIN' && (
                                <Button variant="outline" onClick={() => navigate('/leave/config')} className="h-10 bg-white border border-slate-200 text-slate-700 rounded-lg px-4 hover:bg-slate-50 transition-all font-semibold text-xs uppercase tracking-widest">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configure
                                </Button>
                            )}
                            <Button onClick={() => setShowApplyModal(true)} className="flex-1 lg:flex-none h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-6 font-semibold text-xs uppercase tracking-widest transition-all">
                                <Plus className="w-4 h-4 mr-2" />
                                Apply Leave
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {balances.map((bal, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-lg ${bal.bg} ${bal.color} border border-slate-100 shadow-sm`}>
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Limit</div>
                                        <div className="text-xl font-bold text-slate-900 tracking-tight">{bal.total}</div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-4xl font-bold text-slate-900 tracking-tight leading-none">{bal.balance}</div>
                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{bal.type}</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                        <div
                                            className={`h-full ${bal.accent} rounded-full transition-all duration-1000`}
                                            style={{ width: `${(bal.balance / bal.total) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest leading-none">
                                        <span className="text-slate-400">Consumed: <span className="text-slate-900">{bal.taken}</span></span>
                                        <span className="text-indigo-600">Available</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-900 rounded-xl shadow-md text-white">
                                    <History className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Leave History</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Record of all past and pending requests</p>
                                </div>
                            </div>
                            <div className="hidden md:block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest shadow-none">
                                Unified Ledger
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/80 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Request ID</th>
                                        <th className="px-6 py-4">Leave Type</th>
                                        <th className="px-6 py-4">Duration</th>
                                        <th className="px-6 py-4">Applied On</th>
                                        <th className="px-6 py-4">Status & Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mockHistory.map((hist, idx) => (
                                        <tr key={idx} onClick={() => setSelectedHistory(hist)} className="hover:bg-slate-50 transition-all cursor-pointer group">
                                            <td className="px-6 py-5">
                                                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all">{hist.id}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-slate-900 tracking-tight text-sm">{hist.type}</div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                    Personal Request
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-slate-900 font-bold tracking-tight text-lg leading-none flex items-baseline gap-1">
                                                    {hist.days} <span className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Days</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 bg-slate-100/50 px-2 py-0.5 rounded-md w-fit border border-slate-200/50">
                                                    {hist.from} - {hist.to}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">{hist.appliedOn}</div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Application Date</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-2">
                                                        <Badge variant="outline" className={`font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full
                                                            ${hist.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                              hist.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                              'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                            {hist.status}
                                                        </Badge>
                                                        <p className="text-[10px] text-slate-400 font-medium tracking-wide leading-none px-1">By: {hist.approver.split(' - ')[1] || hist.approver}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-all" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                    {/* Submit Application Modal */}
                    <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
                        <DialogContent className="max-w-3xl bg-white rounded-2xl p-0 overflow-hidden border border-slate-200 shadow-2xl">
                            {submitSuccess ? (
                                <div className="p-20 text-center flex flex-col items-center justify-center space-y-8">
                                    <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 animate-bounce">
                                        <CheckCircle2 className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Application Submitted</h3>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-sm">Your leave request has been successfully submitted and is awaiting approval.</p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            setSubmitSuccess(false);
                                            setShowApplyModal(false);
                                            setStartDate('');
                                            setEndDate('');
                                        }}
                                        className="h-12 bg-slate-900 hover:bg-slate-800 text-white px-12 rounded-lg font-bold text-[10px] uppercase tracking-wider"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <DialogHeader className="bg-slate-900 p-8 text-white relative">
                                        <div className="relative z-10 space-y-1">
                                            <DialogTitle className="text-2xl font-bold tracking-tight">Apply for Leave</DialogTitle>
                                            <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Submit a new leave request for approval.</DialogDescription>
                                        </div>
                                    </DialogHeader>

                                    <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Leave Classification</Label>
                                                <div className="relative">
                                                    <select
                                                        value={leaveType}
                                                        onChange={(e) => setLeaveType(e.target.value)}
                                                        className="w-full h-12 appearance-none bg-slate-50 border border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                                                    >
                                                        {leaveTypes.map((t) => (
                                                            <option key={t.id} value={t.name}>{t.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1" />
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Net Balance: <span className="text-slate-900">{balances.find(b => b.type === leaveType)?.balance || 0} Unit(s)</span></p>
                                                    </div>
                                                    {leaveType === 'Loss of Pay (LOP)' && (balances.find(b => b.type === 'Loss of Pay (LOP)')?.taken || 0) >= 5 && (
                                                        <Badge className="bg-rose-100 text-rose-600 border-none font-bold text-[8px] uppercase tracking-widest">Threshold Exceeded</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Deployment Date</Label>
                                                    <input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-slate-950 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Termination Date</Label>
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-slate-950 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {requestedDays > 0 && (
                                            <div className="space-y-6">
                                        <div className="bg-slate-900 rounded-xl p-6 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-lg">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Duration</span>
                                                    <h4 className="text-lg font-bold text-white tracking-tight mt-0.5">Total Days Requested</h4>
                                                </div>
                                            </div>
                                            <div className="text-4xl font-bold text-white tracking-tighter">{requestedDays} <span className="text-xs uppercase font-bold text-slate-400">Days</span></div>
                                        </div>

                                                {endDate && new Date(endDate).getDay() === 6 && Math.ceil(new Date(endDate).getDate() / 7) === 5 && (
                                                    <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                                                        <Info className="w-5 h-5 text-slate-500 shrink-0" />
                                                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Protocol Override: 5th Saturday applied as full institutional deployment.</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Institutional Context / Rationale</Label>
                                            <textarea
                                                rows={3}
                                                placeholder="Provide context for this leave request..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-slate-950 transition-all resize-none shadow-sm"
                                            ></textarea>
                                        </div>

                                        {requiresProof && (
                                            <div className="space-y-6 animate-in slide-in-from-bottom-8">
                                                <div className="flex items-center gap-4 text-rose-600 bg-rose-50 p-5 rounded-xl border border-rose-100 shadow-sm">
                                                    <AlertCircle className="w-6 h-6 shrink-0" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Verification protocol required for requests exceeding 3 units or OED.</span>
                                                </div>
                                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center hover:bg-slate-50 transition-all cursor-pointer group bg-white shadow-sm">
                                                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 border border-slate-100">
                                                        <Upload className="w-7 h-7" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Initialize Document Upload</span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-widest opacity-60">PDF, JPEG, PNG [Limit 5MiB]</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-10 border-t border-slate-100 bg-slate-50 flex justify-end gap-6">
                                        <Button variant="ghost" className="h-12 px-10 rounded-lg font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-900 transition-all" onClick={() => setShowApplyModal(false)} disabled={isSubmitting}>Abort Request</Button>
                                        <Button
                                            className="h-12 px-12 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
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
                        </DialogContent>
                    </Dialog>

                    {/* Instance Detail Trace */}
                    <Dialog open={!!selectedHistory} onOpenChange={(open) => !open && setSelectedHistory(null)}>
                        <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 overflow-hidden border border-slate-200 shadow-2xl">
                            {selectedHistory && (
                                <>
                                    <DialogHeader className="bg-slate-900 p-8 text-white relative">
                                        <div className="relative z-10 space-y-1">
                                            <div className="flex items-center gap-4">
                                                <DialogTitle className="text-xl font-bold tracking-tight">Request Details</DialogTitle>
                                                <Badge variant="secondary" className="bg-white/10 text-white border-none font-bold text-[10px] tracking-widest px-3 py-0.5 rounded-full">{selectedHistory.id}</Badge>
                                            </div>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Submitted On: {selectedHistory.appliedOn}</p>
                                        </div>
                                    </DialogHeader>

                                    <div className="p-10 space-y-8">
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 shadow-sm space-y-6">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Leave Type</span>
                                                <div className="text-xl font-bold text-slate-900 tracking-tight">{selectedHistory.type}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                                                    <div className="font-bold text-slate-900 text-base">{selectedHistory.days} <span className="text-xs uppercase opacity-40 ml-1">Days</span></div>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Range</span>
                                                    <div className="font-bold text-slate-900 text-base">{selectedHistory.from} - {selectedHistory.to}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Reason for Leave</span>
                                            <div className="bg-white p-4 rounded-xl border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed shadow-sm italic">
                                                "{selectedHistory.reason}"
                                            </div>
                                        </div>

                                        {selectedHistory.hasProof && (
                                            <div className="space-y-4">
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-1 flex items-center gap-2">
                                                    <Check className="w-3 h-3" /> Evidence Verified
                                                </span>
                                                <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 border border-slate-100"><FileText className="w-6 h-6" /></div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm tracking-tight uppercase">Verification_Archive.pdf</div>
                                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">1.2 MiB • Binary Object</div>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" className="h-9 px-6 rounded-md font-bold text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 border border-slate-200">Download</Button>
                                                </div>
                                            </div>
                                        )}

                                        <div className={`p-6 rounded-xl border shadow-sm ${selectedHistory.status === 'Approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${selectedHistory.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                        {selectedHistory.status === 'Approved' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                                                        <div className={`text-xl font-bold tracking-tight uppercase leading-none ${selectedHistory.status === 'Approved' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                            {selectedHistory.status}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approver</span>
                                                    <div className="font-bold text-slate-900 tracking-tight mt-0.5">{selectedHistory.approver}</div>
                                                </div>
                                            </div>
                                            {selectedHistory.rejectReason && (
                                                <div className="mt-6 p-6 bg-white rounded-xl border border-rose-100">
                                                    <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Rejection Context</div>
                                                    <p className="text-sm font-bold text-rose-900 italic leading-relaxed">"{selectedHistory.rejectReason}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
        </Layout>
    );
};

export default LeaveDashboard;
