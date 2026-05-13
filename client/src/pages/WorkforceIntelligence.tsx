import React, { useState } from 'react';
import {
    LayoutDashboard, Activity, ShieldCheck, ShieldAlert,
    TrendingUp, ChevronRight, X, Info, LayoutGrid, AlertCircle, CheckCircle2, Database, Search, History, Clock, AlertTriangle, Check
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';

// Shared Status Badge tailored to the design specs
const StatusBadge = ({ type, text, tooltip }: { type: 'stable' | 'watch' | 'fragile' | 'matched' | 'mismatch' | 'strong' | 'developing' | 'weak' | 'structural' | 'isolated' | 'default' | 'documented' | 'good' | 'bad', text: string, tooltip?: string }) => {
    const styles = {
        stable: 'bg-teal-50 text-teal-700 border-teal-200',
        watch: 'bg-amber-50 text-amber-700 border-amber-200',
        fragile: 'bg-rose-50 text-rose-700 border-rose-200',
        matched: 'bg-teal-50 text-teal-700 border-teal-200',
        mismatch: 'bg-rose-50 text-rose-700 border-rose-200',
        strong: 'bg-teal-50 text-teal-700 border-teal-200',
        developing: 'bg-amber-50 text-amber-700 border-amber-200',
        weak: 'bg-rose-50 text-rose-700 border-rose-200',
        structural: 'bg-rose-50 text-rose-700 border-rose-200',
        isolated: 'bg-gray-50 text-gray-700 border-gray-200',
        default: 'bg-rose-50 text-rose-700 border-rose-200',
        documented: 'bg-teal-50 text-teal-700 border-teal-200',
        good: 'bg-teal-50 text-teal-700 border-teal-200',
        bad: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
        <span className={`group relative px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border cursor-help inline-flex items-center gap-1 ${styles[type]}`}>
            {text}
            {tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[10px] rounded-md shadow-lg z-50 whitespace-normal text-center font-normal leading-tight">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                </div>
            )}
        </span>
    );
};

const MetricBadge = ({ value, type }: { value: string | number, type: 'neutral' | 'good' | 'bad' | 'warning' }) => {
    const styles = {
        neutral: 'bg-slate-100 text-slate-700',
        good: 'bg-teal-100 text-teal-800',
        bad: 'bg-rose-100 text-rose-800',
        warning: 'bg-amber-100 text-amber-800'
    };
    return (
        <span className={`px-2 py-0.5 rounded font-bold text-xs ${styles[type]}`}>{value}</span>
    );
};

const ColumnHeaderWithTooltip = ({ title, tooltip }: { title: string, tooltip: string }) => (
    <div className="flex items-center gap-1.5 group/header relative w-max">
        <span>{title}</span>
        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/header:block w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-md shadow-xl z-50 whitespace-normal text-center font-normal leading-relaxed normal-case tracking-normal font-sans border border-slate-700">
            {tooltip}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px border-4 border-transparent border-b-slate-900"></div>
        </div>
    </div>
);

// Overview Data
const overviewCards = [
    { id: 'continuity', title: 'Operational Continuity', metric: '3 departments flagged', desc: 'Workforce fragility signals across departments', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'control', title: 'Institutional Control', metric: '6 signals need attention', desc: 'Where decisions are being made, delayed, or avoided', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'reputation', title: 'Reputation Protection', metric: '4 compliance gaps', desc: 'Compliance, statutory accuracy, and accreditation readiness', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'scale', title: 'Scale Readiness', metric: 'Campus 3 needs review', desc: 'Cross-campus workforce health and process maturity', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' }
];

// Continuity Data
const continuityDepts = [
    { name: 'Physics', confirmed: 8, probation: 4, phaseEnds: 2, evalRate: 45, extensionRate: 40, vacancies: 1, exits: 2, status: 'fragile' },
    { name: 'Maths', confirmed: 10, probation: 3, phaseEnds: 2, evalRate: 60, extensionRate: 30, vacancies: 1, exits: 1, status: 'watch' },
    { name: 'Computer Science', confirmed: 12, probation: 2, phaseEnds: 1, evalRate: 80, extensionRate: 10, vacancies: 0, exits: 0, status: 'stable' },
    { name: 'Commerce', confirmed: 9, probation: 4, phaseEnds: 2, evalRate: 40, extensionRate: 50, vacancies: 2, exits: 3, status: 'fragile' },
    { name: 'English', confirmed: 7, probation: 1, phaseEnds: 0, evalRate: 90, extensionRate: 5, vacancies: 0, exits: 0, status: 'stable' },
    { name: 'Chemistry', confirmed: 6, probation: 2, phaseEnds: 1, evalRate: 70, extensionRate: 20, vacancies: 0, exits: 1, status: 'watch' }
];

const continuityTimeline = [
    { name: 'Arjun M', initials: 'AM', dept: 'Physics', phase: 'Mid-Phase', end: '12 Oct 2026', days: 12, evalStatus: 'Not started' },
    { name: 'Sarah K', initials: 'SK', dept: 'Maths', phase: 'Final Confirmation', end: '18 Oct 2026', days: 18, evalStatus: 'In progress' },
    { name: 'Priya R', initials: 'PR', dept: 'Commerce', phase: 'Extension Review', end: '28 Oct 2026', days: 28, evalStatus: 'Not started' },
    { name: 'John D', initials: 'JD', dept: 'Physics', phase: 'Mid-Phase', end: '15 Nov 2026', days: 46, evalStatus: 'Submitted' },
    { name: 'Amit P', initials: 'AP', dept: 'Chemistry', phase: 'Final Confirmation', end: '22 Nov 2026', days: 53, evalStatus: 'In progress' },
    { name: 'Neha S', initials: 'NS', dept: 'Commerce', phase: 'Mid-Phase', end: '05 Dec 2026', days: 66, evalStatus: 'Not started' }
];

// Control Data
const controlHODs = [
    { name: 'Dr. Ramesh Kumar', dept: 'Physics', due: 12, onTime: 3, late: 6, missed: 3, avgTime: '1 day after deadline', rate: 25 },
    { name: 'Dr. Sunita Sharma', dept: 'Computer Science', due: 8, onTime: 8, late: 0, missed: 0, avgTime: '4 days before deadline', rate: 100 },
    { name: 'Prof. Ankit Desai', dept: 'Commerce', due: 15, onTime: 7, late: 5, missed: 3, avgTime: '2 days after deadline', rate: 46 },
    { name: 'Dr. Meera Reddy', dept: 'English', due: 5, onTime: 4, late: 1, missed: 0, avgTime: '1 day before deadline', rate: 80 },
    { name: 'Prof. Vivek Singh', dept: 'Maths', due: 10, onTime: 6, late: 3, missed: 1, avgTime: 'On deadline', rate: 60 }
];

const controlApprovers = [
    { name: 'Dr. AP Singh', role: 'Principal', due: 24, onTime: 16, breached: 8, avgTime: 4.2, status: 'bad' },
    { name: 'Mrs. V Manjula', role: 'HR Head', due: 45, onTime: 42, breached: 3, avgTime: 1.5, status: 'good' },
    { name: 'Mr. Surya Prakash', role: 'Registrar', due: 12, onTime: 10, breached: 2, avgTime: 2.1, status: 'good' },
    { name: 'Dr. K Rajeev', role: 'Director', due: 8, onTime: 4, breached: 4, avgTime: 5.5, status: 'bad' }
];

const defaultConfirmations = [
    { name: 'Rahul M', dept: 'Physics', date: '01 Sep 2026', checks: '1 of 3', score: 'N/A', timing: 'Missed', classification: 'Default Confirmation' },
    { name: 'Sneha P', dept: 'Computer Science', date: '15 Aug 2026', checks: '3 of 3', score: '85 / 70', timing: '4 days before', classification: 'Documented Confirmation' },
    { name: 'Vikram S', dept: 'Commerce', date: '10 Sep 2026', checks: '0 of 3', score: 'N/A', timing: 'Missed', classification: 'Default Confirmation' },
    { name: 'Anjali D', dept: 'Maths', date: '22 Aug 2026', checks: '3 of 3', score: '92 / 70', timing: '1 day before', classification: 'Documented Confirmation' },
    { name: 'Karan V', dept: 'Chemistry', date: '05 Sep 2026', checks: '1 of 3', score: '71 / 70', timing: '1 day after', classification: 'Default Confirmation' },
    { name: 'Pooja N', dept: 'English', date: '28 Aug 2026', checks: '3 of 3', score: '88 / 70', timing: '3 days before', classification: 'Documented Confirmation' }
];

// Reputation Data
const statAccuracy = [
    { name: 'Rahul M', dept: 'Physics', phase: 'Confirmed', hub: 'Regular', payroll: 'Probation', status: 'mismatch' },
    { name: 'Sneha P', dept: 'Computer Science', phase: 'Probation', hub: 'Probation', payroll: 'Probation', status: 'matched' },
    { name: 'Vikram S', dept: 'Commerce', phase: 'Extension', hub: 'Probation', payroll: 'Probation', status: 'matched' },
    { name: 'Anjali D', dept: 'Maths', phase: 'Confirmed', hub: 'Regular', payroll: 'Regular', status: 'matched' },
    { name: 'Karan V', dept: 'Chemistry', phase: 'Probation', hub: 'Probation', payroll: 'Regular', status: 'mismatch' },
    { name: 'Pooja N', dept: 'English', phase: 'Confirmed', hub: 'Regular', payroll: 'Regular', status: 'matched' }
];

const incompleteTrails = [
    { name: 'Rahul M', dept: 'Physics', missing: 'Mid-phase checkpoint not completed' },
    { name: 'Vikram S', dept: 'Commerce', missing: 'Final evaluation not submitted' },
    { name: 'Karan V', dept: 'Chemistry', missing: 'HOD signature missing on extension' },
    { name: 'Priya R', dept: 'Commerce', missing: 'Goal setting not acknowledged' },
    { name: 'Arjun M', dept: 'Physics', missing: 'Initial induction sign-off missing' }
];

// Scale Data
const campusData = [
    { id: 'all', name: 'All Campuses', total: 316, confirmed: 78, evalCompliance: 67, avgTime: 12.4, burnEvents: 4, burnCost: '9.3L', maturity: 'developing' },
    { id: 'c1', name: 'Campus 1 — Koramangala', total: 142, confirmed: 88, evalCompliance: 91, avgTime: 10.8, burnEvents: 0, burnCost: '0', maturity: 'strong' },
    { id: 'c2', name: 'Campus 2 — Whitefield', total: 98, confirmed: 79, evalCompliance: 72, avgTime: 12.4, burnEvents: 1, burnCost: '2.1L', maturity: 'developing' },
    { id: 'c3', name: 'Campus 3 — Hebbal', total: 76, confirmed: 65, evalCompliance: 38, avgTime: 14.2, burnEvents: 3, burnCost: '7.2L', maturity: 'weak' }
];

const burnEvents = [
    { name: 'Rajesh K', role: 'Lab Assistant', campus: 'Hebbal', window: '01-15 Aug 2026', exit: '30 Sep 2026', cost: '1.2L', cause: 'HOD evaluation submitted 3 days before phase end. No mid-phase checkpoints completed.' },
    { name: 'Smita J', role: 'Admin Exec', campus: 'Hebbal', window: '10-25 Jul 2026', exit: '15 Sep 2026', cost: '2.4L', cause: 'Delayed principal approval caused automatic system confirmation before termination decision.' },
    { name: 'Vikas T', role: 'Lecturer', campus: 'Whitefield', window: '05-20 Aug 2026', exit: '10 Oct 2026', cost: '2.1L', cause: 'Lack of documented feedback prevented clean exit, resulting in paid notice period.' },
    { name: 'Anita B', role: 'Librarian', campus: 'Hebbal', window: '15-30 Jun 2026', exit: '31 Aug 2026', cost: '3.6L', cause: 'Employee contested exit due to absence of performance improvement plan documentation.' }
];

const recurringExits = [
    { role: 'Junior Lab Assistant', campus: 'Hebbal', times: 4, tenure: '4.5 mos', status: 'structural' },
    { role: 'Front Desk Admin', campus: 'Whitefield', times: 3, tenure: '6.2 mos', status: 'structural' },
    { role: 'Physics Lecturer', campus: 'Koramangala', times: 1, tenure: '14 mos', status: 'isolated' },
    { role: 'Accountant', campus: 'Hebbal', times: 2, tenure: '8.1 mos', status: 'isolated' }
];

const salaryStagnationData = [
    { name: 'Suresh Menon', dept: 'Facilities', ctc: '₹3.2L', lastRevision: '12 Jan 2024', months: 26, phase: 'Confirmed', risk: 'high' },
    { name: 'Priya L', dept: 'Admissions', ctc: '₹4.5L', lastRevision: '05 Aug 2024', months: 20, phase: 'Confirmed', risk: 'watch' },
    { name: 'Karthik S', dept: 'Accounts', ctc: '₹5.1L', lastRevision: '22 Mar 2024', months: 25, phase: 'Confirmed', risk: 'high' },
    { name: 'Ankita R', dept: 'Library', ctc: '₹3.8L', lastRevision: '15 Sep 2024', months: 19, phase: 'Confirmed', risk: 'watch' }
];

const actionHistoryData = [
    { type: 'evaluation', title: 'Triggered evaluation', detail: 'Employee: Arjun M (Physics)', user: 'HR Head', date: '2 hours ago', source: 'Continuity', status: 'Completed' },
    { type: 'escalation', title: 'Sent escalation summary', detail: 'Approver: Dr. AP Singh', user: 'HR Head', date: '4 hours ago', source: 'Control', status: 'Completed' },
    { type: 'compliance', title: 'Created documentation task', detail: 'Employee: Rahul M (Physics)', user: 'Group HR Head', date: 'Yesterday', source: 'Reputation', status: 'Completed' },
    { type: 'campus', title: 'Initiated campus audit', detail: 'Campus: Hebbal', user: 'Group HR Head', date: 'Yesterday', source: 'Scale', status: 'Pending' }
];

const WorkforceIntelligence: React.FC = () => {
    const { role } = usePersona();
    const [activeTab, setActiveTab] = useState('overview');
    const [drawerData, setDrawerData] = useState<{ title: string, data: any } | null>(null);
    const [actionDrawer, setActionDrawer] = useState<{ title: string, type: string, data: any } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ title: string, type: string, data: any } | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeCampusTab, setActiveCampusTab] = useState('all');
    const [selectedDeepDive, setSelectedDeepDive] = useState<string | null>(null);
    const [selectedInstitution, setSelectedInstitution] = useState('All Institutions');

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 4000);
    };

    const processAction = (callback: () => void, toastMsg: string) => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            callback();
            showToast(toastMsg);
        }, 800);
    };

    // Access Control Mapping based on persona role
    // Assuming HR Head, Principal -> all; HOD -> continuity; Trustee/Chairman -> scale; Payroll -> reputation
    const isFullAccess = ['ADMIN', 'HR_ADMIN', 'PRINCIPAL'].includes(role || 'HR_ADMIN');
    const isHOD = role === 'HOD';
    const isTrustee = role === 'TRUSTEE' || role === 'CHAIRMAN';
    const isPayroll = role === 'PAYROLL';

    const tabs = [
        ...(isFullAccess || (!isHOD && !isTrustee && !isPayroll) ? [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }] : []),
        ...(isFullAccess || isHOD || (!isHOD && !isTrustee && !isPayroll) ? [{ id: 'continuity', label: 'Continuity', icon: Activity }] : []),
        ...(isFullAccess || (!isHOD && !isTrustee && !isPayroll) ? [{ id: 'control', label: 'Control', icon: ShieldCheck }] : []),
        ...(isFullAccess || isPayroll || (!isHOD && !isTrustee && !isPayroll) ? [{ id: 'reputation', label: 'Reputation', icon: ShieldAlert }] : []),
        ...(isFullAccess || isTrustee || (!isHOD && !isTrustee && !isPayroll) ? [{ id: 'scale', label: 'Scale', icon: TrendingUp }] : []),
        ...(isFullAccess ? [{ id: 'modules', label: 'Module Health', icon: LayoutGrid }] : [])
    ];

    // Data multiplier based on institution selection to show dynamic reaction
    const instMultiplier = selectedInstitution === 'All Institutions' ? 1 : selectedInstitution.includes('NHCE') ? 0.6 : 0.4;

    // Auto-select first available tab if activeTab is not in available tabs
    if (!tabs.find(t => t.id === activeTab) && tabs.length > 0) {
        setActiveTab(tabs[0].id);
    }

    const getActiveTabTitle = () => tabs.find(t => t.id === activeTab)?.label || 'Report';

    const handleRowClick = (title: string, data: any) => {
        setDrawerData({ title, data });
    };

    const renderPriorityAlerts = () => (
        <div className="mb-8 space-y-3">
            <div className="bg-rose-600 rounded-xl p-4 text-white shadow-lg flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="font-bold text-lg">Critical Governance Alert: Multiple Single Point Failures Detected</div>
                        <div className="text-sm text-white/80 font-medium">Payroll and Admissions workflows have 100% dependency on single owners. Impact: High.</div>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveTab('control')}
                    className="px-4 py-2 bg-white text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors"
                >
                    Take Action Now
                </button>
            </div>
            {activeTab === 'continuity' && (
                <div className="bg-[#FF9A01] rounded-xl p-4 text-white shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-lg">Fragility Alert: Physics Department</div>
                            <div className="text-sm text-white/80 font-medium">3 recent exits and 4 open vacancies. Operational continuity risk detected.</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleRowClick('Department Deep Dive', { name: 'Physics', status: 'fragile', vacancies: 4, exits: 3 })}
                        className="px-4 py-2 bg-white text-[#FF9A01] rounded-lg text-sm font-bold hover:bg-amber-50 transition-colors"
                    >
                        Review Department
                    </button>
                </div>
            )}
        </div>
    );

    const renderOverview = () => (
        <div className="space-y-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#000099]">Institution Risk Summary</h2>
                    <p className="text-slate-500 mt-1">Monday Morning Executive Dashboard: Where we are fragile today</p>
                </div>
                <div className="md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Workforce Stability Score</div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-lg font-bold text-amber-700">Moderate Risk</span>
                    </div>
                </div>
            </div>

            {renderPriorityAlerts()}

            {/* RAG Indicators / Hero metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-5 border-l-4 border-l-rose-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('continuity')}>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500"/> Attrition Signals</div>
                    <div className="text-3xl font-bold text-rose-600 mb-1">3</div>
                    <div className="text-xs text-slate-600 font-medium">Depts showing instability (Leave spikes, LOP trends)</div>
                </div>
                <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5 border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('control')}>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500"/> Pending Evaluations</div>
                    <div className="text-3xl font-bold text-amber-600 mb-1">12</div>
                    <div className="text-xs text-slate-600 font-medium">Delayed confirmations creating operational risk</div>
                </div>
                <div className="bg-white rounded-xl border border-teal-200 shadow-sm p-5 border-l-4 border-l-teal-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('reputation')}>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Database className="w-4 h-4 text-teal-500"/> Payroll Health</div>
                    <div className="text-3xl font-bold text-teal-600 mb-1">98%</div>
                    <div className="text-xs text-slate-600 font-medium">Accuracy rate with only minor retro adjustments detected</div>
                </div>
                <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-5 border-l-4 border-l-rose-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('reputation')}>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-rose-500"/> Compliance Alerts</div>
                    <div className="text-3xl font-bold text-rose-600 mb-1">5</div>
                    <div className="text-xs text-slate-600 font-medium">Missing employee documents impacting audit readiness</div>
                </div>
            </div>

            {/* V2 Additions: Actions taken this month */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-[#000099]">Actions taken this month</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Closed signals across all reports</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-4 flex flex-col justify-center items-center text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">8</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Evaluations triggered</div>
                    </div>
                    <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-4 flex flex-col justify-center items-center text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">3</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Escalations sent</div>
                    </div>
                    <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-4 flex flex-col justify-center items-center text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">4</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance gaps closed</div>
                    </div>
                    <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-4 flex flex-col justify-center items-center text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">2</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campus actions initiated</div>
                    </div>
                </div>

                <div className="bg-white border border-[#E2E0D8] rounded-[10px] overflow-hidden mt-6">
                    <div className="p-4 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                        <h4 className="font-bold text-slate-900 text-sm">Recent activity</h4>
                    </div>
                    <div className="divide-y divide-[#E2E0D8]">
                        {[
                            { icon: Activity, title: 'Triggered evaluation for Arjun M (Physics)', user: 'HR Head', time: '2 hours ago', source: 'Continuity', status: 'Completed', color: 'text-[#FF9A01]', bg: 'bg-[#FF9A01]/10' },
                            { icon: ShieldCheck, title: 'Sent escalation summary to Dr. AP Singh', user: 'HR Head', time: '4 hours ago', source: 'Control', status: 'Completed', color: 'text-teal-600', bg: 'bg-teal-50' },
                            { icon: ShieldAlert, title: 'Created documentation task for Rahul M', user: 'Group HR Head', time: 'Yesterday', source: 'Reputation', status: 'Completed', color: 'text-rose-600', bg: 'bg-rose-50' },
                            { icon: TrendingUp, title: 'Initiated campus audit for Hebbal', user: 'Group HR Head', time: 'Yesterday', source: 'Scale', status: 'Pending', color: 'text-[#000099]', bg: 'bg-indigo-50' },
                            { icon: Activity, title: 'Triggered evaluation for Sarah K (Maths)', user: 'HR Exec', time: '2 days ago', source: 'Continuity', status: 'Completed', color: 'text-[#FF9A01]', bg: 'bg-[#FF9A01]/10' },
                            { icon: Database, title: 'Statutory correction sent to Payroll for Karan V', user: 'HR Head', time: '3 days ago', source: 'Reputation', status: 'Completed', color: 'text-teal-600', bg: 'bg-teal-50' }
                        ].map((act, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${act.bg} ${act.color}`}>
                                        <act.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{act.title}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-slate-500">{act.user}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{act.time}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{act.source}</span>
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge type={act.status === 'Completed' ? 'good' : 'warning'} text={act.status} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 Risks */}
                <div className="bg-white border border-[#E2E0D8] rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6] flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Top 5 Open Critical Risks</h3>
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase">Immediate</span>
                    </div>
                    <div className="divide-y divide-[#E2E0D8]">
                        <div className="p-4 hover:bg-slate-50 flex items-start justify-between gap-3 cursor-pointer group" onClick={() => handleRowClick('Critical Dependency', { risk: 'Critical Dependency', detail: 'Payroll operation depends on single employee', impact: 'High', status: 'Unresolved' })}>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                                <div>
                                    <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">Payroll operation depends on single employee</div>
                                    <div className="text-xs text-slate-500 mt-1 font-medium">No backup mapped for Senior Accounts Executive (Hebbal Campus)</div>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmModal({
                                        title: 'Trigger Backup Mapping',
                                        type: 'backup_mapping',
                                        data: {
                                            body: 'This will notify the Hebbal Campus Head and HR Head to immediately identify and train a backup for the Senior Accounts Executive role.\n\nCurrent exposure: 100% (Single point of failure)',
                                            destructive: false,
                                            confirmText: 'Trigger workflow',
                                            successMsg: 'Backup mapping workflow initiated for Senior Accounts Executive',
                                            toggles: ['Assign as high priority']
                                        }
                                    });
                                }}
                                className="h-7 px-3 text-[10px] font-bold bg-[#000099] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Resolve
                            </button>
                        </div>
                        <div className="p-4 hover:bg-slate-50 flex items-start justify-between gap-3 cursor-pointer group" onClick={() => handleRowClick('Accreditation Risk', { risk: 'Accreditation Risk', detail: 'Faculty-student ratio alert in Computer Science', impact: 'High', status: 'Unresolved' })}>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                                <div>
                                    <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">Faculty-student ratio alert in Computer Science</div>
                                    <div className="text-xs text-slate-500 mt-1 font-medium">Current ratio 1:32 (Norm is 1:20). 3 open vacancies aging &gt;45 days.</div>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmModal({
                                        title: 'Escalate Recruitment',
                                        type: 'recruit_escalation',
                                        data: {
                                            body: 'Escalate 3 pending CS vacancies to the Recruitment Head for immediate external agency sourcing.\n\nCurrent status: Breach of accreditation norms (1:32)',
                                            destructive: false,
                                            confirmText: 'Escalate now',
                                            successMsg: 'Recruitment escalation sent to Recruitment Head',
                                            toggles: []
                                        }
                                    });
                                }}
                                className="h-7 px-3 text-[10px] font-bold bg-[#000099] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Resolve
                            </button>
                        </div>
                        <div className="p-4 hover:bg-slate-50 flex items-start gap-3 cursor-pointer group" onClick={() => handleRowClick('Policy Violation', { risk: 'Policy Violation', detail: 'High LOP concentration in Physics Dept', impact: 'Medium', status: 'Unresolved' })}>
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                            <div>
                                <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">High LOP concentration in Physics Dept</div>
                                <div className="text-xs text-slate-500 mt-1 font-medium">42 LOP days taken by 3 staff members in last 30 days.</div>
                            </div>
                        </div>
                        <div className="p-4 hover:bg-slate-50 flex items-start gap-3 cursor-pointer group" onClick={() => handleRowClick('SLA Breach', { risk: 'SLA Breach', detail: 'Principal approval bottleneck', impact: 'Medium', status: 'Unresolved' })}>
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                            <div>
                                <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">Principal approval bottleneck</div>
                                <div className="text-xs text-slate-500 mt-1 font-medium">8 evaluation workflows delayed past SLA window.</div>
                            </div>
                        </div>
                        <div className="p-4 hover:bg-slate-50 flex items-start justify-between gap-3 cursor-pointer group" onClick={() => handleRowClick('Compliance Gap', { risk: 'Compliance Gap', detail: 'Statutory mismatch detected', impact: 'Medium', status: 'Unresolved' })}>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                                <div>
                                    <div className="font-bold text-slate-900 group-hover:text-[#000099] transition-colors">Statutory mismatch detected</div>
                                    <div className="text-xs text-slate-500 mt-1 font-medium">4 employees hub status conflicts with statutory filings.</div>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('reputation');
                                }}
                                className="h-7 px-3 text-[10px] font-bold bg-white border border-[#000099] text-[#000099] rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                View Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Department Alerts */}
                    <div className="bg-white border border-[#E2E0D8] rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6] flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Department Alerts</h3>
                            <button className="text-xs font-bold text-[#000099] hover:underline" onClick={() => setActiveTab('continuity')}>View All</button>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-4 flex-1">
                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-sm transition-shadow" onClick={() => handleRowClick('Department Risk', { dept: 'Physics', riskType: 'High Attrition Risk', signals: '2 exits, high LOP' })}>
                                <div className="text-rose-700 font-bold mb-1">Physics</div>
                                <div className="text-xs text-rose-600 font-medium">High Attrition Risk</div>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-sm transition-shadow" onClick={() => handleRowClick('Department Risk', { dept: 'Commerce', riskType: 'Delayed Approvals', signals: '3 overdue workflows' })}>
                                <div className="text-amber-700 font-bold mb-1">Commerce</div>
                                <div className="text-xs text-amber-600 font-medium">Delayed Approvals</div>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-sm transition-shadow" onClick={() => handleRowClick('Department Risk', { dept: 'Maths', riskType: 'Leave Spikes', signals: 'Abnormal short leaves' })}>
                                <div className="text-amber-700 font-bold mb-1">Maths</div>
                                <div className="text-xs text-amber-600 font-medium">Leave Spikes</div>
                            </div>
                            <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-sm transition-shadow" onClick={() => handleRowClick('Department Health', { dept: 'English', riskType: 'Stable', signals: 'Normal' })}>
                                <div className="text-teal-700 font-bold mb-1">English</div>
                                <div className="text-xs text-teal-600 font-medium">Stable Operations</div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Exposure */}
                    <div className="bg-white border border-[#E2E0D8] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900">Operational Exposure</h3>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Last 30 Days</span>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="text-slate-600">Manual Attendance Overrides</span>
                                    <span className="text-slate-900">142 instances</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full" style={{ width: '65%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="text-slate-600">Pending Workflow Backlog</span>
                                    <span className="text-slate-900">28 tasks</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="text-slate-600">Unresolved Staff Grievances</span>
                                    <span className="text-slate-900">2 active</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContinuity = () => (
        <div className="space-y-8">
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#000099]">Operational Continuity Report</h2>
                    <p className="text-slate-500 mt-1">Workforce fragility signals across departments</p>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stability Score</div>
                    <div className="text-3xl font-bold text-teal-600">82/100</div>
                </div>
            </div>

            {renderPriorityAlerts()}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Confirmed staff</div>
                    <div className="text-3xl font-bold text-slate-900">186</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Probationary staff</div>
                    <div className="text-3xl font-bold text-slate-900">34</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Phase-ends in 60 days</div>
                    <div className="text-3xl font-bold text-amber-600">6</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Open vacancies</div>
                    <div className="text-3xl font-bold text-slate-900">4</div>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                    <h3 className="font-bold text-slate-900">Department Risk Heatmap</h3>
                    <p className="text-xs text-slate-500 mt-1">Identify which departments are fragile based on evaluation delays, vacancies, and exits.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#F8F8F6] border-b border-[#E2E0D8] text-slate-600 font-bold">
                            <tr>
                                <th className="px-6 py-4">Department name</th>
                                <th className="px-6 py-4">Confirmed</th>
                                <th className="px-6 py-4">Probationary</th>
                                <th className="px-6 py-4">Ends in 60d</th>
                                <th className="px-6 py-4"><ColumnHeaderWithTooltip title="Eval rate" tooltip="% of eligible employees with completed HOD evaluations" /></th>
                                <th className="px-6 py-4"><ColumnHeaderWithTooltip title="Ext. rate (12m)" tooltip="% of probations extended rather than confirmed or terminated" /></th>
                                <th className="px-6 py-4">Vacancies</th>
                                <th className="px-6 py-4">Exits (6m)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            {continuityDepts.map((d, i) => (
                                <tr key={i} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleRowClick('Department Details', d)}>
                                    <td className="px-6 py-4 font-bold text-slate-900">{d.name}</td>
                                    <td className="px-6 py-4">{d.confirmed}</td>
                                    <td className="px-6 py-4">{d.probation}</td>
                                    <td className="px-6 py-4">{d.phaseEnds}</td>
                                    <td className="px-6 py-4">
                                        <MetricBadge value={`${d.evalRate}%`} type={d.evalRate >= 80 ? 'good' : d.evalRate <= 50 ? 'bad' : 'warning'} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <MetricBadge value={`${d.extensionRate}%`} type={d.extensionRate <= 10 ? 'good' : d.extensionRate >= 40 ? 'bad' : 'warning'} />
                                    </td>
                                    <td className="px-6 py-4">{d.vacancies}</td>
                                    <td className="px-6 py-4">{d.exits}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge 
                                            type={d.status as any} 
                                            text={d.status.charAt(0).toUpperCase() + d.status.slice(1)} 
                                            tooltip={`Department has ${d.status === 'fragile' ? '2+' : d.status === 'watch' ? '1' : '0'} of: high extension rate, low eval compliance, open vacancies, recent exits`}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {d.status === 'fragile' && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActionDrawer({
                                                        title: `Department Review — ${d.name}`,
                                                        type: 'continuity_review',
                                                        data: {
                                                            content: (
                                                                <div className="space-y-6">
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-900 mb-3">What we are seeing</h4>
                                                                        <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E2E0D8]">
                                                                            <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Confirmed vs probationary ratio</span><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-sm font-bold text-slate-900">{d.confirmed}:{d.probation}</span></div></div>
                                                                            <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Phase-ends in next 60 days</span><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-sm font-bold text-slate-900">{d.phaseEnds}</span></div></div>
                                                                            <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Evaluation compliance rate</span><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-sm font-bold text-slate-900">{d.evalRate}%</span></div></div>
                                                                            <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Extension rate</span><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-sm font-bold text-slate-900">{d.extensionRate}%</span></div></div>
                                                                            <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Open vacancies</span><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-sm font-bold text-slate-900">{d.vacancies}</span></div></div>
                                                                            <div className="flex justify-between items-center"><span className="text-sm text-slate-600">Recent exits</span><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-sm font-bold text-slate-900">{d.exits}</span></div></div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-900 mb-3">Choose your action</h4>
                                                                        <div className="space-y-3">
                                                                            <div className="bg-white p-4 rounded-xl border border-[#E2E0D8]">
                                                                                <div className="font-bold text-slate-900 mb-1">Trigger pending evaluations</div>
                                                                                <div className="text-xs text-slate-600 mb-3">Create evaluation tasks for all employees with phase-ends in 60 days and no evaluation started.</div>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">Impact: {d.phaseEnds} employees will receive evaluation tasks today</span>
                                                                                    <button onClick={() => processAction(() => setActionDrawer(null), `Triggered ${d.phaseEnds} evaluations for ${d.name}`)} className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg">Trigger evaluations</button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="bg-white p-4 rounded-xl border border-[#E2E0D8]">
                                                                                <div className="font-bold text-slate-900 mb-1">Escalate to Principal</div>
                                                                                <div className="text-xs text-slate-600 mb-3">Send a department fragility summary to the Principal with the current signals attached.</div>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">Impact: Principal receives summary within 5 mins</span>
                                                                                    <button onClick={() => processAction(() => setActionDrawer(null), `Escalation sent to Principal for ${d.name}`)} className="h-8 px-3 text-xs font-medium border border-[#000099] text-[#000099] rounded-lg">Send escalation</button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="bg-white p-4 rounded-xl border border-[#E2E0D8]">
                                                                                <div className="font-bold text-slate-900 mb-1">Schedule HOD review</div>
                                                                                <div className="text-xs text-slate-600 mb-3">Create a calendar event between Principal and HOD with department health data pre-attached.</div>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">Impact: Meeting request sent to both parties</span>
                                                                                    <button onClick={() => processAction(() => setActionDrawer(null), `Review scheduled with HOD of ${d.name}`)} className="h-8 px-3 text-xs font-medium border border-[#000099] text-[#000099] rounded-lg">Schedule review</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-900 mb-3">Previous actions</h4>
                                                                        <div className="bg-white p-4 rounded-xl border border-[#E2E0D8] space-y-4">
                                                                            <div className="relative pl-4 border-l-2 border-slate-200">
                                                                                <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[5px] top-1"></div>
                                                                                <div className="text-xs font-bold text-slate-900">Sent automated reminder</div>
                                                                                <div className="text-[10px] text-slate-500 mt-0.5">By System • 2 days ago</div>
                                                                                <div className="text-[10px] text-slate-600 mt-1">Outcome: No response from HOD</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                            primaryAction: null
                                                        }
                                                    });
                                                }}
                                                className="h-8 px-3 bg-[#000099] hover:bg-[#000099]/90 text-white text-xs font-medium rounded-lg transition-colors"
                                            >
                                                Review now
                                            </button>
                                        )}
                                        {d.status === 'watch' && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActionDrawer({
                                                        title: `Monitoring Plan — ${d.name}`,
                                                        type: 'monitor_plan',
                                                        data: {
                                                            content: (
                                                                <div className="space-y-6">
                                                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                                                        <div className="text-sm font-bold text-amber-900 mb-2">Why monitoring is required?</div>
                                                                        <div className="text-xs text-amber-800 leading-relaxed">
                                                                            {d.name} department has shown {d.vacancies} open vacancies and {d.exits} recent exits. While not yet fragile, the trend suggests operational strain.
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-4">
                                                                        <h4 className="font-bold text-slate-900 text-sm">Active Monitoring Protocol</h4>
                                                                        <div className="space-y-3">
                                                                            <div className="flex items-center gap-3 p-3 bg-white border border-[#E2E0D8] rounded-lg">
                                                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                                                <div className="text-xs font-bold text-slate-700 flex-1">Weekly vacancy status check</div>
                                                                                <span className="text-[10px] text-slate-400 font-bold uppercase">System Auto</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-3 p-3 bg-white border border-[#E2E0D8] rounded-lg">
                                                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                                                <div className="text-xs font-bold text-slate-700 flex-1">Bi-weekly 1:1 with HOD</div>
                                                                                <span className="text-[10px] text-[#000099] font-bold uppercase">HR Action</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                            primaryAction: 'Update monitoring plan',
                                                            successMsg: `Monitoring plan updated for ${d.name}`
                                                        }
                                                    });
                                                }}
                                                className="h-8 px-3 bg-white border border-[#000099] text-[#000099] hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors"
                                            >
                                                Monitor
                                            </button>
                                        )}
                                        {d.status === 'stable' && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick('Department Deep Dive', d);
                                                }}
                                                className="h-8 px-3 text-slate-500 hover:text-[#000099] text-xs font-medium transition-colors"
                                            >
                                                View detail
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-[#E2E0D8] border-l-4 border-l-rose-500 overflow-hidden mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-rose-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                        <div>
                            <h3 className="font-bold text-rose-900">Critical Dependency Intelligence (Single Point Failures)</h3>
                            <p className="text-xs text-rose-700 mt-0.5">Detects operational areas dependent on specific individuals without assigned backups.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Risk Level</div>
                        <div className="text-xs font-bold text-rose-600">CRITICAL</div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-[#E2E0D8] text-slate-600 font-bold">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Impact Area</th>
                                <th className="px-6 py-4">Dependency Risk</th>
                                <th className="px-6 py-4">Backup Availability</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleRowClick('Dependency Risk', { employee: 'Ravi Kumar', role: 'Payroll Executive', area: 'Compliance Filing & Bank Upload', risk: 'High', backup: 'None' })}>
                                <td className="px-6 py-4 font-bold text-slate-900">Ravi Kumar</td>
                                <td className="px-6 py-4">Payroll Executive</td>
                                <td className="px-6 py-4">Compliance Filing & Bank Upload</td>
                                <td className="px-6 py-4"><StatusBadge type="fragile" text="High" /></td>
                                <td className="px-6 py-4 font-bold text-rose-600">None Assigned</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActionDrawer({
                                                title: `Dependency History — Ravi Kumar`,
                                                type: 'dependency_history',
                                                data: {
                                                    content: (
                                                        <div className="space-y-6">
                                                            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                                                                <div className="text-sm font-bold text-rose-900 mb-2">Exposure Impact</div>
                                                                <div className="text-xs text-rose-800 font-medium">Critical: Payroll delay across 3 campuses if Ravi is unavailable.</div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 mb-3">Past 3 Month History</h4>
                                                                <div className="space-y-3">
                                                                    {[
                                                                        { month: 'Oct 2026', risk: 'High', status: 'Unresolved', detail: 'Primary payroll owner for Hebbal' },
                                                                        { month: 'Sep 2026', risk: 'High', status: 'Unresolved', detail: 'Added Whitefield compliance to role' },
                                                                        { month: 'Aug 2026', risk: 'Medium', status: 'Under Review', detail: 'Initial dependency signal detected' }
                                                                    ].map((h, i) => (
                                                                        <div key={i} className="p-3 border border-[#E2E0D8] rounded-lg bg-white">
                                                                            <div className="flex justify-between items-center mb-1">
                                                                                <span className="text-xs font-bold text-slate-900">{h.month}</span>
                                                                                <StatusBadge type={h.risk === 'High' ? 'fragile' : 'watch'} text={h.risk} />
                                                                            </div>
                                                                            <div className="text-[10px] text-slate-600 mb-1">{h.detail}</div>
                                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Result: {h.status}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => setConfirmModal({
                                                                    title: 'Assign Backup',
                                                                    type: 'assign_backup',
                                                                    data: {
                                                                        body: 'Assign a secondary owner for "Compliance Filing & Bank Upload" for Hebbal campus.',
                                                                        destructive: false,
                                                                        confirmText: 'Assign now',
                                                                        successMsg: 'Backup assignment task created for HR Head',
                                                                        toggles: ['Include in handover document']
                                                                    }
                                                                })}
                                                                className="w-full h-10 bg-[#000099] text-white rounded-lg text-sm font-bold"
                                                            >
                                                                Assign Emergency Backup
                                                            </button>
                                                        </div>
                                                    ),
                                                    primaryAction: null
                                                }
                                            });
                                        }}
                                        className="h-8 px-3 bg-[#000099] text-white text-xs font-medium rounded-lg"
                                    >
                                        View details
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleRowClick('Dependency Risk', { employee: 'Meena S', role: 'Admissions Coordinator', area: 'Seat Matrix Approval', risk: 'High', backup: 'None' })}>
                                <td className="px-6 py-4 font-bold text-slate-900">Meena S</td>
                                <td className="px-6 py-4">Admissions Coordinator</td>
                                <td className="px-6 py-4">Seat Matrix Approval</td>
                                <td className="px-6 py-4"><StatusBadge type="fragile" text="High" /></td>
                                <td className="px-6 py-4 font-bold text-rose-600">None Assigned</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRowClick('Dependency Risk', { employee: 'Meena S', role: 'Admissions Coordinator', area: 'Seat Matrix Approval', risk: 'High', backup: 'None' });
                                        }}
                                        className="h-8 px-3 bg-white border border-[#000099] text-[#000099] text-xs font-medium rounded-lg"
                                    >
                                        View details
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleRowClick('Dependency Risk', { employee: 'Dr. Vivek M', role: 'CS HOD', area: 'AI Lab Certifications', risk: 'Medium', backup: 'In Training' })}>
                                <td className="px-6 py-4 font-bold text-slate-900">Dr. Vivek M</td>
                                <td className="px-6 py-4">CS HOD</td>
                                <td className="px-6 py-4">AI Lab Certifications</td>
                                <td className="px-6 py-4"><StatusBadge type="watch" text="Medium" /></td>
                                <td className="px-6 py-4 font-bold text-amber-600">In Training (Prof. Anita)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Workforce Stability Signals */}
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                        <h3 className="font-bold text-slate-900">Workforce Stability Signals</h3>
                        <p className="text-xs text-slate-500 mt-1">Early indicators of instability before resignation.</p>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="px-5 py-3">Department</th>
                                    <th className="px-5 py-3">Instability Signals</th>
                                    <th className="px-5 py-3">Primary Factor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E0D8]">
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Stability Signal', { dept: 'Accounts', signals: 7, factor: 'Leave Pattern Changes' })}>
                                    <td className="px-5 py-4 font-bold text-slate-900">Accounts</td>
                                    <td className="px-5 py-4 font-bold text-rose-600">7 Signals</td>
                                    <td className="px-5 py-4">Leave Pattern Changes</td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Stability Signal', { dept: 'Admissions', signals: 5, factor: 'Attendance Instability' })}>
                                    <td className="px-5 py-4 font-bold text-slate-900">Admissions</td>
                                    <td className="px-5 py-4 font-bold text-amber-600">5 Signals</td>
                                    <td className="px-5 py-4">Attendance Instability</td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Stability Signal', { dept: 'HR', signals: 1, factor: 'Evaluation Delays' })}>
                                    <td className="px-5 py-4 font-bold text-slate-900">HR</td>
                                    <td className="px-5 py-4 font-bold text-slate-700">1 Signal</td>
                                    <td className="px-5 py-4">Evaluation Delays</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Vacancy Exposure Intelligence */}
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                        <h3 className="font-bold text-slate-900">Vacancy Exposure Intelligence</h3>
                        <p className="text-xs text-slate-500 mt-1">Operational impact caused by hiring gaps.</p>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="px-5 py-3">Open Position</th>
                                    <th className="px-5 py-3">Aging Bucket</th>
                                    <th className="px-5 py-3">Capacity Gap</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E0D8]">
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Vacancy Exposure', { pos: 'Senior Payroll Officer', aging: '30+ days', gap: 'High Workload Pressure' })}>
                                    <td className="px-5 py-4 font-bold text-slate-900">Snr Payroll Officer</td>
                                    <td className="px-5 py-4 font-bold text-rose-600">42 Days</td>
                                    <td className="px-5 py-4">High Workload Pressure</td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Vacancy Exposure', { pos: 'Physics Lab Assistant', aging: '16–30 days', gap: 'Moderate' })}>
                                    <td className="px-5 py-4 font-bold text-slate-900">Physics Lab Assistant</td>
                                    <td className="px-5 py-4 font-bold text-amber-600">22 Days</td>
                                    <td className="px-5 py-4">Moderate</td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Vacancy Exposure', { pos: 'Transport Admin', aging: '0–15 days', gap: 'Normal' })}>
                                    <td className="px-5 py-4 font-bold text-slate-900">Transport Admin</td>
                                    <td className="px-5 py-4 font-bold text-teal-600">12 Days</td>
                                    <td className="px-5 py-4">Normal</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Evaluation & Confirmation Readiness (Next 90 Days)</h3>
                <div className="space-y-4">
                    {continuityTimeline.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-[#E2E0D8] rounded-lg hover:border-[#000099] hover:shadow-sm cursor-pointer transition-all" onClick={() => handleRowClick('Phase End Timeline', item)}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#000099] text-white flex items-center justify-center font-bold">
                                    {item.initials}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.dept} · {item.phase}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-bold text-slate-900">{item.end}</div>
                                    <div className={`text-xs font-bold ${item.days < 30 ? 'text-rose-600' : item.days < 60 ? 'text-amber-600' : 'text-slate-500'}`}>
                                        {item.days} days left
                                    </div>
                                </div>
                                <div className="w-[120px] text-right">
                                    <StatusBadge 
                                        type={item.evalStatus === 'Submitted' ? 'good' : item.evalStatus === 'In progress' ? 'watch' : 'default'} 
                                        text={item.evalStatus} 
                                    />
                                </div>
                                <div className="w-[140px] text-right flex justify-end">
                                    {item.evalStatus === 'Not started' && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmModal({
                                                    title: `Trigger evaluation — ${item.name}`,
                                                    type: 'trigger_evaluation',
                                                    data: {
                                                        body: `Employee: ${item.name}\nPhase: ${item.phase}\nPhase end: ${item.end} (${item.days} days remaining)\n\nEvaluator assigned: HOD (${item.dept})\nEvaluation form: Standard Faculty Matrix\nSLA: HOD must submit within 7 days.`,
                                                        destructive: false,
                                                        confirmText: 'Trigger evaluation',
                                                        successMsg: `Evaluation triggered for ${item.name} — HOD notified`,
                                                        toggles: []
                                                    }
                                                });
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg hover:bg-[#000099]/90 transition-colors"
                                        >
                                            Start evaluation
                                        </button>
                                    )}
                                    {item.evalStatus === 'In progress' && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmModal({
                                                    title: `Send reminder to HOD`,
                                                    type: 'send_reminder',
                                                    data: {
                                                        body: `This will send a reminder to the HOD to complete the evaluation for ${item.name}.\n\nPhase ends in ${item.days} days.`,
                                                        destructive: false,
                                                        confirmText: 'Send reminder',
                                                        successMsg: `Reminder sent to HOD for ${item.name}'s evaluation.`,
                                                        toggles: []
                                                    }
                                                });
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            Send reminder
                                        </button>
                                    )}
                                    {item.evalStatus === 'Submitted' && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowClick('Phase End Timeline', item);
                                            }}
                                            className="h-8 px-3 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                                        >
                                            View evaluation
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderControl = () => (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#000099]">Institutional Control Report</h2>
                    <p className="text-slate-500 mt-1">Operational Governance Radar — Detecting discipline erosion before institutional chaos</p>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Control Score</div>
                    <div className="text-3xl font-bold text-rose-600">68/100</div>
                </div>
            </div>

            {renderPriorityAlerts()}

            {/* Executive Governance Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Campuses w/ Gaps</div>
                    <div className="text-3xl font-bold text-amber-600">3</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Approval Bottlenecks</div>
                    <div className="text-3xl font-bold text-rose-600">18</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Manual Overrides (30d)</div>
                    <div className="text-3xl font-bold text-rose-600">147</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Missing Employee Docs</div>
                    <div className="text-3xl font-bold text-slate-900">92</div>
                </div>
            </div>

            {/* Governance Heatmap */}
            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                    <h3 className="font-bold text-slate-900">Governance Heatmap</h3>
                    <p className="text-xs text-slate-500 mt-1">Identify where institutional discipline and policy adherence is weakening.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3">Department</th>
                                <th className="px-5 py-3">Risk Level</th>
                                <th className="px-5 py-3">Primary Issue</th>
                                <th className="px-5 py-3">Secondary Issue</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Governance Risk', { dept: 'Accounts', risk: 'Governance Risk', primary: 'Frequent manual payroll overrides', secondary: 'Approval delays' })}>
                                <td className="px-5 py-4 font-bold text-slate-900">Accounts</td>
                                <td className="px-5 py-4"><StatusBadge type="fragile" text="🔴 Governance Risk" /></td>
                                <td className="px-5 py-4 font-bold text-rose-600">Frequent manual payroll overrides</td>
                                <td className="px-5 py-4 text-slate-600">Approval delays</td>
                                <td className="px-5 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmModal({
                                                title: 'Trigger Compliance Audit',
                                                type: 'trigger_audit',
                                                data: {
                                                    body: 'Trigger a deep-dive compliance audit for the Accounts department due to high manual override volume.',
                                                    destructive: false,
                                                    confirmText: 'Trigger Audit',
                                                    successMsg: 'Audit team notified and case file created',
                                                    toggles: ['Include last 3 months data']
                                                }
                                            });
                                        }}
                                        className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg"
                                    >
                                        Trigger Audit
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Governance Risk', { dept: 'Admissions', risk: 'Weakening', primary: 'Approval bottlenecks', secondary: 'Workflow bypasses' })}>
                                <td className="px-5 py-4 font-bold text-slate-900">Admissions</td>
                                <td className="px-5 py-4"><StatusBadge type="watch" text="🟠 Weakening" /></td>
                                <td className="px-5 py-4 font-bold text-amber-600">Approval bottlenecks</td>
                                <td className="px-5 py-4 text-slate-600">Workflow bypasses</td>
                                <td className="px-5 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            processAction(() => {}, 'Internal review requested for Admissions')
                                        }}
                                        className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg"
                                    >
                                        Request Review
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Governance Risk', { dept: 'HR', risk: 'Watch', primary: 'Incomplete employee records', secondary: 'Leave inconsistencies' })}>
                                <td className="px-5 py-4 font-bold text-slate-900">HR</td>
                                <td className="px-5 py-4"><StatusBadge type="watch" text="🟡 Watch" /></td>
                                <td className="px-5 py-4 font-bold text-slate-700">Incomplete employee records</td>
                                <td className="px-5 py-4 text-slate-600">Leave inconsistencies</td>
                                <td className="px-5 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            processAction(() => {}, 'Documentation drive requested for HR')
                                        }}
                                        className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg"
                                    >
                                        Trigger Drive
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Governance Risk', { dept: 'Science Dept', risk: 'Controlled', primary: 'None', secondary: 'None' })}>
                                <td className="px-5 py-4 font-bold text-slate-900">Science Dept</td>
                                <td className="px-5 py-4"><StatusBadge type="stable" text="🟢 Controlled" /></td>
                                <td className="px-5 py-4 text-slate-400">—</td>
                                <td className="px-5 py-4 text-slate-400">—</td>
                                <td className="px-5 py-4 text-right text-teal-600 font-bold text-xs">
                                    <div className="flex items-center justify-end gap-1"><Check className="w-4 h-4" /> SECURE</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Override Intelligence */}
            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden border-l-4 border-l-rose-500 mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-rose-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-rose-900 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Manual Override Intelligence</h3>
                        <p className="text-xs text-rose-700 mt-1">Tracks attendance edited manually, off-cycle payroll exceptions, and unauthorized workflow bypasses.</p>
                    </div>
                    <div className="text-left md:text-right">
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">30-Day Trend</div>
                        <div className="text-sm font-bold text-rose-600">↑ Increasing (+14%)</div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3">Campus/Dept</th>
                                <th className="px-5 py-3">Volume (30d)</th>
                                <th className="px-5 py-3">Top Editor</th>
                                <th className="px-5 py-3">Risk Vector</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Manual Override', { cat: 'Attendance Edits', loc: 'Hebbal - Admin', vol: '84 Records', editor: 'Campus Admin', risk: 'Biometric Integrity Bypassed' })}>
                                <td className="px-5 py-4 font-bold text-slate-900">Attendance Edits</td>
                                <td className="px-5 py-4 text-slate-600">Hebbal - Admin</td>
                                <td className="px-5 py-4 font-bold text-rose-600">84 Records</td>
                                <td className="px-5 py-4">Campus Admin</td>
                                <td className="px-5 py-4 text-slate-700">Biometric Integrity Bypassed</td>
                                <td className="px-5 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRowClick('Audit Trail', { item: 'Attendance Edits', vol: 84 });
                                        }}
                                        className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg"
                                    >
                                        View Trail
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Manual Override', { cat: 'Payroll Exceptions', loc: 'Accounts', vol: '42 Records', editor: 'Payroll Officer', risk: 'Unapproved Salary Adjustments' })}>
                                <td className="px-5 py-4 font-bold text-slate-900">Payroll Exceptions</td>
                                <td className="px-5 py-4 text-slate-600">Accounts</td>
                                <td className="px-5 py-4 font-bold text-rose-600">42 Records</td>
                                <td className="px-5 py-4">Payroll Officer</td>
                                <td className="px-5 py-4 text-slate-700">Unapproved Salary Adjustments</td>
                                <td className="px-5 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmModal({
                                                title: 'Block Payroll Batch',
                                                type: 'block_payroll',
                                                data: {
                                                    body: 'Unauthorized manual exceptions detected in this batch. Block for investigation?',
                                                    destructive: true,
                                                    confirmText: 'Block Batch',
                                                    successMsg: 'Payroll batch blocked and Finance Head notified',
                                                    toggles: []
                                                }
                                            });
                                        }}
                                        className="h-8 px-3 text-xs font-medium bg-rose-600 text-white rounded-lg"
                                    >
                                        Block & Investigate
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Manual Override', { cat: 'Workflow Bypass', loc: 'Whitefield - Admissions', vol: '21 Records', editor: 'HOD', risk: 'SOP Adherence Failure' })}>
                                <td className="px-5 py-4 font-bold text-slate-900">Workflow Bypass</td>
                                <td className="px-5 py-4 text-slate-600">Whitefield - Admissions</td>
                                <td className="px-5 py-4 font-bold text-amber-600">21 Records</td>
                                <td className="px-5 py-4">HOD</td>
                                <td className="px-5 py-4 text-slate-700">SOP Adherence Failure</td>
                                <td className="px-5 py-4 text-right">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            processAction(() => {}, 'Admissions workflow locked to SOP')
                                        }}
                                        className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg"
                                    >
                                        Force Lock SOP
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workflow Control Intelligence */}
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                        <h3 className="font-bold text-slate-900">Workflow Control Intelligence</h3>
                        <p className="text-xs text-slate-500 mt-1">Approval delays and escalation failures.</p>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Workflow</th>
                                    <th className="px-4 py-3">Avg Delay</th>
                                    <th className="px-4 py-3">Pending SLA Breach</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E0D8]">
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Workflow Control', { wf: 'Leave Approval', delay: '+4 Days', breach: '14 Requests' })}>
                                    <td className="px-4 py-3 font-bold text-slate-900">Leave Approval</td>
                                    <td className="px-4 py-3 font-bold text-rose-600">+4 Days</td>
                                    <td className="px-4 py-3 font-medium">14 Requests</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActionDrawer({
                                                    title: 'Workflow Escalation Rule',
                                                    type: 'workflow_rule',
                                                    data: {
                                                        content: (
                                                            <div className="space-y-4 text-sm">
                                                                <p className="font-bold">Automated Escalation Protocol</p>
                                                                <p className="text-slate-600">Current rule: Escalate to Principal after 3 days of delay.</p>
                                                                <button className="w-full h-10 bg-[#000099] text-white rounded-lg font-bold">Adjust Rule (SLA-2 Days)</button>
                                                            </div>
                                                        ),
                                                        primaryAction: null
                                                    }
                                                });
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg"
                                        >
                                            Set Rule
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Workflow Control', { wf: 'Payroll Verification', delay: '+2 Days', breach: '1 Batch' })}>
                                    <td className="px-4 py-3 font-bold text-slate-900">Payroll Verification</td>
                                    <td className="px-4 py-3 font-bold text-amber-600">+2 Days</td>
                                    <td className="px-4 py-3 font-medium">1 Batch</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                processAction(() => {}, 'Urgent nudge sent to Payroll verifier')
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg"
                                        >
                                            Nudge Verifier
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Workflow Control', { wf: 'Asset Requisition', delay: '+8 Days', breach: '24 Requests' })}>
                                    <td className="px-4 py-3 font-bold text-slate-900">Asset Requisition</td>
                                    <td className="px-4 py-3 font-bold text-rose-600">+8 Days</td>
                                    <td className="px-4 py-3 font-medium">24 Requests</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                processAction(() => {}, 'Escalated Asset Requisition to Admin Head')
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-rose-600 text-white rounded-lg"
                                        >
                                            Escalate Now
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Data Integrity Intelligence */}
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                        <h3 className="font-bold text-slate-900">Data Integrity Intelligence</h3>
                        <p className="text-xs text-slate-500 mt-1">Incomplete records, missing docs, and compliance gaps.</p>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Gaps</th>
                                    <th className="px-4 py-3">Highest Concentration</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E0D8]">
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Data Integrity', { cat: 'Statutory Documents', gaps: '48 Employees', conc: 'Hebbal Campus' })}>
                                    <td className="px-4 py-3 font-bold text-slate-900">Statutory Documents</td>
                                    <td className="px-4 py-3 font-bold text-rose-600">48 Employees</td>
                                    <td className="px-4 py-3 font-medium">Hebbal Campus</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                processAction(() => {}, 'Data cleanup requested for Hebbal statutory docs')
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg"
                                        >
                                            Request Cleanup
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Data Integrity', { cat: 'Qualification Records', gaps: '22 Employees', conc: 'Science Dept' })}>
                                    <td className="px-4 py-3 font-bold text-slate-900">Qualification Records</td>
                                    <td className="px-4 py-3 font-bold text-amber-600">22 Employees</td>
                                    <td className="px-4 py-3 font-medium">Science Dept</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                processAction(() => {}, 'Qualification audit requested for Science')
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg"
                                        >
                                            Trigger Audit
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Data Integrity', { cat: 'Master Data Changes', gaps: '12 Unauthorized', conc: 'Accounts Dept' })}>
                                    <td className="px-4 py-3 font-bold text-slate-900">Master Data Changes</td>
                                    <td className="px-4 py-3 font-bold text-rose-600">12 Unauthorized</td>
                                    <td className="px-4 py-3 font-medium">Accounts Dept</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmModal({
                                                    title: 'Rollback Master Changes',
                                                    type: 'rollback_master',
                                                    data: {
                                                        body: '12 unauthorized master data changes detected. Rollback to last approved state?',
                                                        destructive: true,
                                                        confirmText: 'Rollback Now',
                                                        successMsg: 'Master data rollback initiated',
                                                        toggles: ['Notify Audit Team']
                                                    }
                                                });
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-rose-600 text-white rounded-lg"
                                        >
                                            Rollback
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* V2 Additions: Missing Control Tables */}
            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                    <h3 className="font-bold text-slate-900">HOD Evaluation Compliance</h3>
                    <p className="text-xs text-slate-500 mt-1">HOD adherence to evaluation deadlines.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3">HOD Name</th>
                                <th className="px-5 py-3">Dept</th>
                                <th className="px-5 py-3">Compliance Rate</th>
                                <th className="px-5 py-3">Avg Submission</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            {controlHODs.map((hod, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-5 py-4 font-bold text-slate-900">{hod.name}</td>
                                    <td className="px-5 py-4 text-slate-600">{hod.dept}</td>
                                    <td className="px-5 py-4 font-bold">
                                        <span className={hod.rate < 60 ? 'text-rose-600' : hod.rate <= 80 ? 'text-amber-600' : 'text-teal-600'}>{hod.rate}%</span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">{hod.avgTime}</td>
                                    <td className="px-5 py-4 text-right">
                                        {hod.rate < 60 && (
                                            <button 
                                                onClick={() => {
                                                    setActionDrawer({
                                                        title: `Reminder Configuration — ${hod.name}`,
                                                        type: 'reminder_config',
                                                        data: {
                                                            content: (
                                                                <div className="space-y-6">
                                                                    <div className="bg-slate-50 p-4 rounded-xl border border-[#E2E0D8]">
                                                                        <div className="text-sm font-bold text-slate-900 mb-2">Current Setting</div>
                                                                        <div className="text-xs text-slate-600 mb-1">Reminder sent 14 days before phase end</div>
                                                                        <div className="text-xs text-slate-600 mb-1">Last reminder: 10 Oct 2026</div>
                                                                        <div className="text-xs text-slate-600 font-bold text-rose-600 mt-2">HOD average submission: {hod.avgTime}</div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-900 mb-3">Update reminder schedule for this HOD</h4>
                                                                        <div className="space-y-3">
                                                                            <label className="flex items-center gap-3 p-3 bg-white border border-[#000099] rounded-lg cursor-pointer">
                                                                                <input type="radio" name="reminder" defaultChecked className="text-[#000099] focus:ring-[#000099]"/>
                                                                                <div className="flex-1">
                                                                                    <div className="text-sm font-bold text-slate-900">45 days before phase end</div>
                                                                                </div>
                                                                                <span className="text-[10px] font-bold text-[#000099] bg-indigo-50 px-2 py-1 rounded">Recommended</span>
                                                                            </label>
                                                                            <label className="flex items-center gap-3 p-3 bg-white border border-[#E2E0D8] rounded-lg cursor-pointer">
                                                                                <input type="radio" name="reminder" className="text-[#000099] focus:ring-[#000099]"/>
                                                                                <div className="flex-1">
                                                                                    <div className="text-sm font-bold text-slate-900">30 days before phase end</div>
                                                                                </div>
                                                                            </label>
                                                                            <label className="flex items-center gap-3 p-3 bg-white border border-[#E2E0D8] rounded-lg cursor-pointer">
                                                                                <input type="radio" name="reminder" className="text-[#000099] focus:ring-[#000099]"/>
                                                                                <div className="flex-1">
                                                                                    <div className="text-sm font-bold text-slate-900">Custom</div>
                                                                                    <div className="mt-2"><input type="number" placeholder="Days" className="w-20 px-2 py-1 text-sm border rounded" /></div>
                                                                                </div>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                                                                        <input type="checkbox" className="rounded border-slate-300 text-[#000099] focus:ring-[#000099]" />
                                                                        <span className="text-sm font-medium text-slate-700">Also copy HR Head on all reminders for this HOD</span>
                                                                    </label>

                                                                    <div>
                                                                        <h4 className="font-bold text-slate-900 mb-3">Previous Reminder Logs</h4>
                                                                        <div className="bg-slate-100/50 p-4 rounded-xl border border-[#E2E0D8] space-y-3">
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <div className="text-xs font-bold text-slate-900">Follow-up Reminder #2</div>
                                                                                    <div className="text-[10px] text-slate-500">12 Oct 2026 • 09:15 AM</div>
                                                                                </div>
                                                                                <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">FAILED</span>
                                                                            </div>
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <div className="text-xs font-bold text-slate-900">Standard Phase-End Reminder</div>
                                                                                    <div className="text-[10px] text-slate-500">10 Oct 2026 • 08:30 AM</div>
                                                                                </div>
                                                                                <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">DELIVERED</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                            primaryAction: 'Save reminder config',
                                                            successMsg: `Reminder schedule updated for ${hod.name} — takes effect next cycle`
                                                        }
                                                    });
                                                }}
                                                className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg transition-colors"
                                            >
                                                Set stricter reminder
                                            </button>
                                        )}
                                        {hod.rate >= 60 && hod.rate <= 80 && (
                                            <button 
                                                onClick={() => processAction(() => {}, `Nudge sent to ${hod.name}`)}
                                                className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Send nudge
                                            </button>
                                        )}
                                        {hod.rate > 80 && (
                                            <Check className="w-5 h-5 text-teal-600 inline-block" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                    <h3 className="font-bold text-slate-900">Approval SLA Control</h3>
                    <p className="text-xs text-slate-500 mt-1">Management responsiveness metrics.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3">Approver</th>
                                <th className="px-5 py-3">Role</th>
                                <th className="px-5 py-3">Breached SLAs</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            {controlApprovers.map((app, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-5 py-4 font-bold text-slate-900">{app.name}</td>
                                    <td className="px-5 py-4 text-slate-600">{app.role}</td>
                                    <td className="px-5 py-4 font-bold text-rose-600">{app.breached}</td>
                                    <td className="px-5 py-4 text-right">
                                        {app.breached > 0 && (
                                            <button 
                                                onClick={() => {
                                                    setConfirmModal({
                                                        title: `Escalation summary — ${app.name}`,
                                                        type: 'escalation_summary',
                                                        data: {
                                                            body: `This will send ${app.name} a summary of all pending decisions that have breached SLA.\n\nPending decisions:\n- Employee A (Leave) - 5 days overdue\n- Employee B (Confirmation) - 12 days overdue`,
                                                            toggles: ['Also notify HR Head', 'Also notify Principal'],
                                                            destructive: false,
                                                            confirmText: 'Send escalation',
                                                            successMsg: `Escalation summary sent to ${app.name}`
                                                        }
                                                    });
                                                }}
                                                className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Send escalation summary
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6]">
                    <h3 className="font-bold text-slate-900">Default Confirmation Tracker</h3>
                    <p className="text-xs text-slate-500 mt-1">Employees confirmed automatically without required evaluations.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3">Employee</th>
                                <th className="px-5 py-3">Dept</th>
                                <th className="px-5 py-3">Type</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            {defaultConfirmations.filter(c => c.classification === 'Default Confirmation').map((conf, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-5 py-4 font-bold text-slate-900">{conf.name}</td>
                                    <td className="px-5 py-4 text-slate-600">{conf.dept}</td>
                                    <td className="px-5 py-4 font-bold text-rose-600">{conf.classification}</td>
                                    <td className="px-5 py-4 text-right">
                                        <button 
                                            onClick={() => {
                                                setActionDrawer({
                                                    title: `Post-Confirmation Review — ${conf.name}`,
                                                    type: 'post_conf_review',
                                                    data: {
                                                        content: (
                                                            <div className="space-y-6">
                                                                <div>
                                                                    <h4 className="font-bold text-slate-900 mb-3">Why this was flagged</h4>
                                                                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 space-y-2 text-sm text-rose-800">
                                                                        <div>• Evaluation submitted <strong>Missed deadline</strong></div>
                                                                        <div>• Score: <strong>N/A</strong></div>
                                                                        <div>• Checkpoints completed: <strong>{conf.checks}</strong></div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-slate-900 mb-3">Initiate review</h4>
                                                                    <p className="text-sm text-slate-600 mb-4">This employee was confirmed without a documented positive basis. A 90-day post-confirmation review will create structured checkpoints to validate fit before the 6-month mark.</p>
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-slate-700 mb-1">Review period</label>
                                                                            <input type="text" disabled value="90 days" className="w-full px-3 py-2 border border-[#E2E0D8] bg-slate-50 rounded-lg text-sm" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-slate-700 mb-1">Reviewer</label>
                                                                            <select className="w-full px-3 py-2 border border-[#E2E0D8] rounded-lg text-sm bg-white"><option>HOD - {conf.dept}</option></select>
                                                                        </div>
                                                                        <div className="bg-slate-50 p-3 rounded-lg border border-[#E2E0D8] space-y-2">
                                                                            <div className="text-xs text-slate-600 flex justify-between"><span>Checkpoint 1:</span> <span className="font-bold text-slate-900">30 days from today</span></div>
                                                                            <div className="text-xs text-slate-600 flex justify-between"><span>Checkpoint 2:</span> <span className="font-bold text-slate-900">60 days from today</span></div>
                                                                            <div className="text-xs text-slate-600 flex justify-between"><span>Final Review:</span> <span className="font-bold text-slate-900">90 days from today</span></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                        primaryAction: 'Initiate review',
                                                        successMsg: `Post-confirmation review initiated for ${conf.name} — HOD notified`
                                                    }
                                                });
                                            }}
                                            className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            Initiate post-confirmation review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden mb-8">
                <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6] flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900">Salary stagnation signals</h3>
                        <p className="text-xs text-slate-500 mt-1">Staff with no revision in 18 or more months</p>
                    </div>
                    <button 
                        onClick={() => {
                            setConfirmModal({
                                title: `Flag for compensation review`,
                                type: 'comp_review',
                                data: {
                                    body: `4 employees will be flagged for compensation review. HR Head will receive a review task with the full list attached.`,
                                    toggles: [],
                                    destructive: false,
                                    confirmText: 'Confirm',
                                    successMsg: `Flagged 4 employees for compensation review`
                                }
                            });
                        }}
                        className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Flag for compensation review
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3 w-10"><input type="checkbox" className="rounded border-slate-300" defaultChecked/></th>
                                <th className="px-5 py-3">Employee Name</th>
                                <th className="px-5 py-3">Department</th>
                                <th className="px-5 py-3">Current CTC</th>
                                <th className="px-5 py-3">Last Revision</th>
                                <th className="px-5 py-3">Months</th>
                                <th className="px-5 py-3">Phase Status</th>
                                <th className="px-5 py-3">Risk Signal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            {salaryStagnationData.map((stag, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-5 py-4"><input type="checkbox" className="rounded border-slate-300" defaultChecked/></td>
                                    <td className="px-5 py-4 font-bold text-slate-900">{stag.name}</td>
                                    <td className="px-5 py-4 text-slate-600">{stag.dept}</td>
                                    <td className="px-5 py-4 text-slate-900 font-medium">{stag.ctc}</td>
                                    <td className="px-5 py-4 text-slate-600">{stag.lastRevision}</td>
                                    <td className="px-5 py-4 font-bold text-slate-900">{stag.months}</td>
                                    <td className="px-5 py-4 text-slate-600">{stag.phase}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${stag.risk === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {stag.risk === 'high' ? 'High risk' : 'Watch'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderReputation = () => (
        <div className="space-y-8">
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#000099]">Reputation Protection Report</h2>
                    <p className="text-slate-500 mt-1">Compliance, statutory accuracy, and accreditation readiness</p>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Accuracy Score</div>
                    <div className="text-3xl font-bold text-[#000099]">91/100</div>
                </div>
            </div>

            {renderPriorityAlerts()}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Complete eval trail</div>
                    <div className="text-3xl font-bold text-teal-600">182<span className="text-lg text-slate-400 font-normal ml-1">of 220</span></div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Statutory mismatches</div>
                    <div className="text-3xl font-bold text-rose-600">4</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">Pending letters</div>
                    <div className="text-3xl font-bold text-slate-900">3</div>
                </div>
                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-5">
                    <div className="text-sm text-slate-500 mb-1">LOP payroll mismatches</div>
                    <div className="text-3xl font-bold text-rose-600">2</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-[#E2E0D8] border-l-4 border-l-rose-500 overflow-hidden shadow-sm col-span-1 lg:col-span-1">
                    <div className="p-5 border-b border-[#E2E0D8] bg-rose-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-rose-900 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" /> Statutory Accuracy (Hub vs Statutory)
                            </h3>
                            <p className="text-xs text-rose-700 mt-1">Detects mismatches between internal HRMS records and external statutory filings.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Alert Level</div>
                            <div className="text-xs font-bold text-rose-600">Critical (4 Gaps)</div>
                        </div>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Hub vs Payroll</th>
                                    <th className="px-4 py-3 text-right">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E0D8]">
                                {statAccuracy.map((s, i) => (
                                    <tr key={i} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Statutory Record', s)}>
                                        <td className="px-4 py-3 font-bold text-slate-900">{s.name}<br/><span className="text-xs font-normal text-slate-500">{s.dept}</span></td>
                                        <td className="px-4 py-3 text-xs text-slate-600">{s.hub} / {s.payroll}</td>
                                        <td className="px-4 py-3 text-right">
                                            <StatusBadge type={s.status as any} text={s.status === 'matched' ? 'Matched' : 'Mismatch'} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {s.status === 'mismatch' && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionDrawer({
                                                            title: `Resolve Statutory Mismatch — ${s.name}`,
                                                            type: 'stat_mismatch',
                                                            data: {
                                                                content: (
                                                                    <div className="space-y-6">
                                                                        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                                                                            <h4 className="font-bold text-rose-900 mb-2">Mismatch Details</h4>
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                <div><div className="text-xs text-rose-700">Hub Record (PF)</div><div className="font-bold text-slate-900">{s.hub}</div></div>
                                                                                <div><div className="text-xs text-rose-700">Payroll Filing (PF)</div><div className="font-bold text-slate-900">{s.payroll}</div></div>
                                                                            </div>
                                                                            <div className="text-xs text-rose-700 mt-3 pt-3 border-t border-rose-200">The employee's Hub status shows Active, but the payroll file submitted to PF portal shows Inactive.</div>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-slate-900 mb-3">Resolution Action</h4>
                                                                            <div className="space-y-3">
                                                                                <label className="flex items-start gap-3 p-3 bg-white border border-[#E2E0D8] rounded-lg cursor-pointer">
                                                                                    <input type="radio" name="res" className="mt-1 text-[#000099] focus:ring-[#000099]"/>
                                                                                    <div><div className="text-sm font-bold text-slate-900">Push Hub data to Payroll</div><div className="text-xs text-slate-600 mt-0.5">Overrides payroll system with correct Hub data</div></div>
                                                                                </label>
                                                                                <label className="flex items-start gap-3 p-3 bg-white border border-[#E2E0D8] rounded-lg cursor-pointer">
                                                                                    <input type="radio" name="res" className="mt-1 text-[#000099] focus:ring-[#000099]"/>
                                                                                    <div><div className="text-sm font-bold text-slate-900">Flag for manual review by Payroll Head</div><div className="text-xs text-slate-600 mt-0.5">Creates a high-priority task for payroll team</div></div>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                                primaryAction: 'Apply resolution',
                                                                successMsg: `Statutory mismatch resolved for ${s.name}`
                                                            }
                                                        });
                                                    }}
                                                    className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg hover:bg-[#000099]/90 transition-colors"
                                                >
                                                    Correct now
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-6 col-span-1">
                    <h3 className="font-bold text-slate-900 mb-6">Confirmation Trail Readiness</h3>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                            <div className="text-3xl font-bold text-teal-600">182</div>
                            <div className="text-xs text-slate-500">Complete trail</div>
                        </div>
                        <div className="w-px h-10 bg-[#E2E0D8]"></div>
                        <div className="flex-1 text-right">
                            <div className="text-3xl font-bold text-rose-600">38</div>
                            <div className="text-xs text-slate-500">Incomplete trail</div>
                        </div>
                    </div>
                    
                    <div className="w-full bg-rose-100 rounded-full h-2.5 mb-8 flex overflow-hidden">
                        <div className="bg-teal-500 h-2.5 rounded-l-full" style={{ width: '82%' }}></div>
                        <div className="bg-rose-500 h-2.5 rounded-r-full" style={{ width: '18%' }}></div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Incomplete Samples</div>
                        {incompleteTrails.map((t, i) => (
                            <div key={i} className="text-sm p-3 border border-[#E2E0D8] rounded-md hover:border-[#000099] cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center gap-2" onClick={() => handleRowClick('Trail Investigation', t)}>
                                <div>
                                    <span className="font-bold text-slate-900">{t.name}</span> <span className="text-slate-500">({t.dept})</span>
                                    <div className="text-xs text-rose-600 mt-1">{t.missing}</div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmModal({
                                            title: `Create documentation task — ${t.name}`,
                                            type: 'create_doc_task',
                                            data: {
                                                body: `Create an urgent task for HR Exec to upload the missing "${t.missing}" document for ${t.name}.\n\nThis gap prevents confirmation trail completeness.`,
                                                destructive: false,
                                                confirmText: 'Create task',
                                                successMsg: `Documentation task created for ${t.name}`,
                                                toggles: []
                                            }
                                        });
                                    }}
                                    className="h-8 px-3 text-xs font-medium bg-white border border-[#000099] text-[#000099] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                                >
                                    Create documentation task
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[10px] border border-[#E2E0D8] p-6 col-span-1">
                    <h3 className="font-bold text-slate-900 mb-6">Pending Actions</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-slate-50 rounded-lg border border-[#E2E0D8] cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleRowClick('Pending Letters', {})}>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <div className="font-bold text-slate-900">3 confirmation letters not generated</div>
                                    <div className="text-xs text-slate-500 mt-0.5">Requires HR Admin action</div>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmModal({
                                        title: 'Generate confirmation letters',
                                        type: 'generate_letters',
                                        data: {
                                            body: 'This will auto-generate confirmation letters for all 3 pending employees using the standard template and route them for Principal signature.',
                                            destructive: false,
                                            confirmText: 'Generate all',
                                            successMsg: '3 confirmation letters generated and routed for signature',
                                            toggles: []
                                        }
                                    });
                                }}
                                className="mt-2 md:mt-0 h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Generate all
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-slate-50 rounded-lg border border-[#E2E0D8] cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleRowClick('Payroll Mismatches', {})}>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <div className="font-bold text-slate-900">2 LOP payroll mismatches unresolved</div>
                                    <div className="text-xs text-slate-500 mt-0.5">Discrepancy between Leave and Payroll</div>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActionDrawer({
                                        title: 'Reconcile LOP Mismatches',
                                        type: 'reconcile_lop',
                                        data: {
                                            content: (
                                                <div className="space-y-6">
                                                    <div className="bg-white border border-[#E2E0D8] rounded-xl overflow-hidden">
                                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                                            <thead className="bg-[#F8F8F6] border-b border-[#E2E0D8] text-xs font-bold text-slate-500 uppercase">
                                                                <tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Hub LOP</th><th className="px-4 py-3">Payroll LOP</th></tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-[#E2E0D8]">
                                                                <tr><td className="px-4 py-3 font-bold">Karan S</td><td className="px-4 py-3 text-rose-600 font-bold">4 days</td><td className="px-4 py-3">0 days</td></tr>
                                                                <tr><td className="px-4 py-3 font-bold">Divya M</td><td className="px-4 py-3 text-rose-600 font-bold">2 days</td><td className="px-4 py-3">1 day</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 mb-3">Resolution Action</h4>
                                                        <div className="space-y-3">
                                                            <label className="flex items-start gap-3 p-3 bg-white border border-[#000099] rounded-lg cursor-pointer">
                                                                <input type="radio" name="lop" defaultChecked className="mt-1 text-[#000099] focus:ring-[#000099]"/>
                                                                <div><div className="text-sm font-bold text-slate-900">Sync Hub data to Payroll</div><div className="text-xs text-slate-600 mt-0.5">Force overrides payroll module with accurate Hub attendance data</div></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                            primaryAction: 'Reconcile mismatches',
                                            successMsg: '2 LOP mismatches successfully reconciled'
                                        }
                                    });
                                }}
                                className="mt-2 md:mt-0 h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Reconcile
                            </button>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-[#E2E0D8] cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleRowClick('Statutory Mismatches', {})}>
                            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                            <div>
                                <div className="font-bold text-slate-900">4 employees with statutory mismatch</div>
                                <div className="text-xs text-slate-500 mt-0.5">Hub status conflicts with statutory filings</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-[#E2E0D8] cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleRowClick('Approval Bypass', {})}>
                            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                            <div>
                                <div className="font-bold text-slate-900">1 employee confirmed without Principal approval</div>
                                <div className="text-xs text-slate-500 mt-0.5">System auto-confirmed due to SLA breach</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderScale = () => (
        <div className="space-y-8">
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#000099]">Scale Readiness Report</h2>
                    <p className="text-slate-500 mt-1">Cross-campus workforce health and process maturity</p>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Readiness Score</div>
                    <div className="text-3xl font-bold text-[#FF9A01]">74/100</div>
                </div>
            </div>

            {renderPriorityAlerts()}

            <div className="flex gap-2 border-b border-[#E2E0D8] mb-6">
                {['all', 'c1', 'c2', 'c3'].map((tabId) => (
                    <button
                        key={tabId}
                        onClick={() => setActiveCampusTab(tabId)}
                        className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                            activeCampusTab === tabId ? 'border-[#000099] text-[#000099]' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tabId === 'all' ? 'All Campuses' : tabId === 'c1' ? 'Campus 1 — Koramangala' : tabId === 'c2' ? 'Campus 2 — Whitefield' : 'Campus 3 — Hebbal'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#F8F8F6] border-b border-[#E2E0D8] text-slate-600 font-bold">
                            <tr>
                                <th className="px-6 py-4">Campus name</th>
                                <th className="px-6 py-4">Headcount</th>
                                <th className="px-6 py-4">Confirmed %</th>
                                <th className="px-6 py-4"><ColumnHeaderWithTooltip title="Eval Compliance" tooltip="% of mandatory evaluations submitted on time" /></th>
                                <th className="px-6 py-4"><ColumnHeaderWithTooltip title="Avg confirm time" tooltip="Average tenure required for an employee to receive final confirmation" /></th>
                                <th className="px-6 py-4"><ColumnHeaderWithTooltip title="Burn events (12m)" tooltip="Incidents of forced exits, legal disputes, or SLA violations leading to financial impact" /></th>
                                <th className="px-6 py-4"><ColumnHeaderWithTooltip title="Burn cost" tooltip="Estimated financial impact of burn events" /></th>
                                <th className="px-6 py-4">Process Maturity</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E0D8]">
                            {campusData.filter(c => activeCampusTab === 'all' ? c.id !== 'all' : c.id === activeCampusTab).map((c, i) => (
                                <tr key={i} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Campus Details', c)}>
                                    <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                                    <td className="px-6 py-4">{c.total}</td>
                                    <td className="px-6 py-4">{c.confirmed}%</td>
                                    <td className="px-6 py-4">
                                        <MetricBadge value={`${c.evalCompliance}%`} type={c.evalCompliance >= 80 ? 'good' : c.evalCompliance <= 50 ? 'bad' : 'warning'} />
                                    </td>
                                    <td className="px-6 py-4">{c.avgTime} mos</td>
                                    <td className="px-6 py-4">{c.burnEvents}</td>
                                    <td className="px-6 py-4 font-mono">₹{c.burnCost}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge type={c.maturity as any} text={c.maturity.charAt(0).toUpperCase() + c.maturity.slice(1)} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {c.burnEvents > 0 && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmModal({
                                                        title: `Trigger Campus Audit — ${c.name}`,
                                                        type: 'campus_audit',
                                                        data: {
                                                            body: `This will initiate a full operational audit for ${c.name} campus.\n\nFocus areas:\n- Burn event root causes (${c.burnEvents} events)\n- Evaluation compliance gaps (${c.evalCompliance}% rate)\n- Process maturity erosion`,
                                                            toggles: ['Include financial audit', 'Include payroll review'],
                                                            destructive: true,
                                                            confirmText: 'Initiate audit',
                                                            successMsg: `Campus audit initiated for ${c.name}. Internal Audit team notified.`
                                                        }
                                                    });
                                                }}
                                                className="h-8 px-3 text-xs font-medium bg-[#993C1D] text-white rounded-lg transition-colors"
                                            >
                                                Trigger audit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Burn events — what happened and when</h3>
                    <div className="space-y-4">
                        {burnEvents.filter(b => activeCampusTab === 'all' || (activeCampusTab === 'c1' && b.campus === 'Koramangala') || (activeCampusTab === 'c2' && b.campus === 'Whitefield') || (activeCampusTab === 'c3' && b.campus === 'Hebbal')).map((b, i) => (
                            <div key={i} className="p-4 bg-white border border-rose-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-rose-500" onClick={() => handleRowClick('Burn Event Investigation', b)}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold text-slate-900">{b.name}</div>
                                        <div className="text-xs text-slate-500">{b.role} · {b.campus}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-rose-600">Avoidable: ₹{b.cost}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-600 mb-2 flex gap-4">
                                    <span>Clean exit: {b.window}</span>
                                    <span className="font-bold">Actual: {b.exit}</span>
                                </div>
                                <div className="text-sm bg-rose-50 p-2 rounded text-rose-800">
                                    <span className="font-bold mr-1">Root cause:</span>
                                    {b.cause}
                                </div>
                            </div>
                        ))}
                        {burnEvents.filter(b => activeCampusTab === 'all' || (activeCampusTab === 'c1' && b.campus === 'Koramangala') || (activeCampusTab === 'c2' && b.campus === 'Whitefield') || (activeCampusTab === 'c3' && b.campus === 'Hebbal')).length === 0 && (
                            <div className="text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                <div className="text-slate-400 mb-2">No burn events reported for this campus in the last 12 months.</div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recurring role exits — structural signal</h3>
                    <div className="bg-white rounded-[10px] border border-[#E2E0D8] overflow-hidden">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#F8F8F6] border-b border-[#E2E0D8] text-slate-600 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Campus</th>
                                    <th className="px-4 py-3 text-center">Vacated (24m)</th>
                                    <th className="px-4 py-3">Avg Tenure</th>
                                    <th className="px-4 py-3">Signal</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E0D8]">
                                {recurringExits.filter(r => activeCampusTab === 'all' || (activeCampusTab === 'c1' && r.campus === 'Koramangala') || (activeCampusTab === 'c2' && r.campus === 'Whitefield') || (activeCampusTab === 'c3' && r.campus === 'Hebbal')).map((r, i) => (
                                    <tr key={i} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick('Recurring Exit Pattern', r)}>
                                        <td className="px-4 py-3 font-bold text-slate-900">{r.role}</td>
                                        <td className="px-4 py-3 text-slate-600">{r.campus}</td>
                                        <td className="px-4 py-3 text-center font-bold">{r.times}x</td>
                                        <td className="px-4 py-3 text-slate-600">{r.tenure}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge 
                                                type={r.status as any} 
                                                text={r.status === 'structural' ? 'Structural Risk' : 'Isolated'} 
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {r.status === 'structural' && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmModal({
                                                            title: `Initiate leadership review`,
                                                            type: 'leadership_review',
                                                            data: {
                                                                body: `Flagged structural risk for role: "${r.role}" at ${r.campus}.\n\nThis role has been vacated ${r.times} times in 24 months with an average tenure of only ${r.tenure}.\n\nA leadership review will investigate reporting lines, workload, and compensation specific to this role.`,
                                                                destructive: false,
                                                                confirmText: 'Initiate review',
                                                                successMsg: `Leadership review initiated for ${r.role} role at ${r.campus}`,
                                                                toggles: []
                                                            }
                                                        });
                                                    }}
                                                    className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg transition-colors"
                                                >
                                                    Review pattern
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recurringExits.filter(r => activeCampusTab === 'all' || (activeCampusTab === 'c1' && r.campus === 'Koramangala') || (activeCampusTab === 'c2' && r.campus === 'Whitefield') || (activeCampusTab === 'c3' && r.campus === 'Hebbal')).length === 0 && (
                            <div className="text-center p-8 bg-slate-50 rounded-b-lg">
                                <div className="text-slate-400">No recurring exits reported.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderModules = () => {
        const modulesHealth = [
            { name: 'Attendance Tracker', metric: '94% Avg', subtext: 'Daily Attendance', alerts: 12, alertText: 'Habitual absentees flagged', status: 'watch', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
            { name: 'Leave Management', metric: '432 Days', subtext: 'Unplanned Leave YTD', alerts: 5, alertText: 'High leave balance liabilities', status: 'watch', icon: LayoutDashboard, color: 'text-amber-600', bg: 'bg-amber-50' },
            { name: 'Payroll Central', metric: '100%', subtext: 'Processing Accuracy', alerts: 0, alertText: 'All statutory compliances met', status: 'stable', icon: ShieldCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
            { name: 'Asset Management', metric: '₹14.2L', subtext: 'Assigned Asset Value', alerts: 8, alertText: 'Unreturned assets from ex-employees', status: 'fragile', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
            { name: 'Staff Appraisals', metric: '82%', subtext: 'Cycle Completion', alerts: 3, alertText: 'Departments behind schedule', status: 'watch', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
            { name: 'Exit Management', metric: '14%', subtext: 'Annual Turnover', alerts: 4, alertText: 'Regrettable exits this quarter', status: 'fragile', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
        ];

        if (selectedDeepDive) {
            const mod = modulesHealth.find(m => m.name === selectedDeepDive) || modulesHealth[0];
            
            let deepDiveData: any[] = [];
            let columns: string[] = [];

            if (selectedDeepDive === 'Attendance Tracker') {
                columns = ['Campus', 'Department', 'Daily Avg', 'Habitual Absentees', 'Late Arrivals (>3)', 'Overrides', 'Trend', 'Status'];
                deepDiveData = [
                    { campus: 'Hebbal', dept: 'Physics', col1: '88%', col2: '4 Flagged', col3: '12 Instances', col4: '14 Auto-approved', col5: '↓ -2.4%', status: 'fragile', riskLevel: 'High', lastAudit: '2 days ago', auditor: 'System Auto', remediation: 'Trigger HOD review' },
                    { campus: 'Hebbal', dept: 'Commerce', col1: '91%', col2: '2 Flagged', col3: '8 Instances', col4: '5 Manual', col5: '↓ -0.8%', status: 'watch', riskLevel: 'Medium', lastAudit: '1 week ago', auditor: 'HR Partner', remediation: 'Monitor closely' },
                    { campus: 'Whitefield', dept: 'Computer Science', col1: '98%', col2: '0', col3: '1 Instance', col4: '0 Manual', col5: '↑ +1.2%', status: 'stable', riskLevel: 'Low', lastAudit: 'Today', auditor: 'System Auto', remediation: 'None required' },
                    { campus: 'Koramangala', dept: 'Maths', col1: '92%', col2: '1 Flagged', col3: '5 Instances', col4: '2 Manual', col5: '— 0.0%', status: 'watch', riskLevel: 'Medium', lastAudit: '3 days ago', auditor: 'System Auto', remediation: 'Schedule alignment check' },
                    { campus: 'Whitefield', dept: 'Biology', col1: '85%', col2: '6 Flagged', col3: '18 Instances', col4: '22 Auto-approved', col5: '↓ -4.1%', status: 'fragile', riskLevel: 'Critical', lastAudit: 'Today', auditor: 'HR Head', remediation: 'Immediate escalation required' },
                    { campus: 'Hebbal', dept: 'History', col1: '96%', col2: '0', col3: '2 Instances', col4: '1 Manual', col5: '↑ +0.5%', status: 'stable', riskLevel: 'Low', lastAudit: 'Yesterday', auditor: 'System Auto', remediation: 'None required' }
                ];
            } else if (selectedDeepDive === 'Leave Management') {
                columns = ['Campus', 'Department', 'Total Leaves YTD', 'Unplanned Spike', 'LOP Days', 'Pending Approvals', 'Liability', 'Status'];
                deepDiveData = [
                    { campus: 'Hebbal', dept: 'Physics', col1: '142 Days', col2: '+45%', col3: '42 Days', col4: '8 Tasks', col5: '₹4.2L', status: 'fragile', riskLevel: 'High', manager: 'Dr. Ramesh K', policyAdherence: '68%' },
                    { campus: 'Whitefield', dept: 'Commerce', col1: '98 Days', col2: '+12%', col3: '14 Days', col4: '3 Tasks', col5: '₹1.8L', status: 'watch', riskLevel: 'Medium', manager: 'Prof. Anita S', policyAdherence: '85%' },
                    { campus: 'Koramangala', dept: 'Computer Science', col1: '45 Days', col2: '-5%', col3: '2 Days', col4: '0 Tasks', col5: '₹0.5L', status: 'stable', riskLevel: 'Low', manager: 'Dr. Vivek M', policyAdherence: '99%' },
                    { campus: 'Hebbal', dept: 'English', col1: '62 Days', col2: 'Normal', col3: '5 Days', col4: '1 Task', col5: '₹1.2L', status: 'stable', riskLevel: 'Low', manager: 'Sarah J', policyAdherence: '95%' },
                    { campus: 'Whitefield', dept: 'Chemistry', col1: '110 Days', col2: '+22%', col3: '28 Days', col4: '12 Tasks', col5: '₹3.1L', status: 'watch', riskLevel: 'High', manager: 'Dr. K.V. Rao', policyAdherence: '72%' }
                ];
            } else if (selectedDeepDive === 'Payroll Central') {
                columns = ['Campus', 'Department', 'Accuracy Rate', 'Retro Adjustments', 'Overhead Variance', 'Compliance Gaps', 'Trend', 'Status'];
                deepDiveData = [
                    { campus: 'Hebbal', dept: 'Physics', col1: '95%', col2: '4 Records', col3: '+2.1%', col4: '0', col5: 'Improving', status: 'watch', riskLevel: 'Medium', payoutCycle: '1st of Month', errors: 'PF Mismatch (Resolved)' },
                    { campus: 'All', dept: 'Admin/Accounts', col1: '88%', col2: '12 Records', col3: '+8.4%', col4: '2 Open', col5: 'Declining', status: 'fragile', riskLevel: 'High', payoutCycle: '1st of Month', errors: 'Multiple TDS miscalculations' },
                    { campus: 'Whitefield', dept: 'Computer Science', col1: '100%', col2: '0', col3: '0%', col4: '0', col5: 'Stable', status: 'stable', riskLevel: 'Low', payoutCycle: '1st of Month', errors: 'None' },
                    { campus: 'Koramangala', dept: 'Facilities', col1: '92%', col2: '6 Records', col3: '+4.2%', col4: '1 Open', col5: 'Declining', status: 'watch', riskLevel: 'Medium', payoutCycle: '5th of Month', errors: 'Overtime claim backlog' },
                    { campus: 'Hebbal', dept: 'Transport', col1: '85%', col2: '18 Records', col3: '+12.5%', col4: '4 Open', col5: 'Critical', status: 'fragile', riskLevel: 'Critical', payoutCycle: '5th of Month', errors: 'Driver log mismatch' }
                ];
            } else if (selectedDeepDive === 'Asset Management') {
                columns = ['Campus', 'Department', 'Assigned Value', 'Unreturned Assets', 'Aging > 30 Days', 'Audit Status', 'Recovery', 'Status'];
                deepDiveData = [
                    { campus: 'Whitefield', dept: 'Computer Science', col1: '₹42.5L', col2: '1 Laptop', col3: '0 Days', col4: 'Cleared', col5: '98%', status: 'stable', riskLevel: 'Low', custodian: 'IT Admin' },
                    { campus: 'Hebbal', dept: 'Admin/Accounts', col1: '₹8.2L', col2: '4 Devices', col3: '3 Items', col4: 'Pending', col5: '65%', status: 'fragile', riskLevel: 'High', custodian: 'Facilities Dept' },
                    { campus: 'Koramangala', dept: 'Physics', col1: '₹14.5L', col2: '2 Equipments', col3: '1 Item', col4: 'Flagged', col5: '85%', status: 'watch', riskLevel: 'Medium', custodian: 'Lab Manager' },
                    { campus: 'Hebbal', dept: 'Media Arts', col1: '₹28.4L', col2: '6 Cameras', col3: '4 Items', col4: 'Failed Audit', col5: '40%', status: 'fragile', riskLevel: 'Critical', custodian: 'Studio Head' }
                ];
            } else if (selectedDeepDive === 'Staff Appraisals') {
                columns = ['Campus', 'Department', 'Completion %', 'Overdue Reviews', 'Avg Rating', 'Top Performers', 'Calibration', 'Status'];
                deepDiveData = [
                    { campus: 'Whitefield', dept: 'Computer Science', col1: '100%', col2: '0', col3: '4.2', col4: '8 Staff', col5: 'Aligned', status: 'stable', riskLevel: 'Low', deadline: 'Met (On-time)' },
                    { campus: 'Hebbal', dept: 'Commerce', col1: '45%', col2: '14 Pending', col3: '3.8', col4: '2 Staff', col5: 'Skewed', status: 'fragile', riskLevel: 'High', deadline: 'Missed (+12 days)' },
                    { campus: 'Koramangala', dept: 'Maths', col1: '75%', col2: '4 Pending', col3: '3.9', col4: '3 Staff', col5: 'Aligned', status: 'watch', riskLevel: 'Medium', deadline: 'Approaching (2 days)' },
                    { campus: 'Hebbal', dept: 'Languages', col1: '20%', col2: '22 Pending', col3: 'N/A', col4: 'TBD', col5: 'Pending', status: 'fragile', riskLevel: 'Critical', deadline: 'Missed (+20 days)' }
                ];
            } else if (selectedDeepDive === 'Exit Management') {
                columns = ['Campus', 'Department', 'YTD Exits', 'Regrettable', 'Avg Tenure', 'Open Replacements', 'Cost Impact', 'Status'];
                deepDiveData = [
                    { campus: 'Hebbal', dept: 'Physics', col1: '4 Exits', col2: '3 Staff', col3: '1.2 Yrs', col4: '2 Roles', col5: '₹4.2L', status: 'fragile', riskLevel: 'High', primaryCause: 'Better Compensation' },
                    { campus: 'Koramangala', dept: 'Facilities', col1: '8 Exits', col2: '0 Staff', col3: '0.8 Yrs', col4: '1 Role', col5: '₹1.5L', status: 'structural', riskLevel: 'Medium', primaryCause: 'Role Mismatch' },
                    { campus: 'Whitefield', dept: 'Computer Science', col1: '1 Exit', col2: '0 Staff', col3: '4.5 Yrs', col4: '0 Roles', col5: '₹0L', status: 'stable', riskLevel: 'Low', primaryCause: 'Relocation' },
                    { campus: 'Hebbal', dept: 'Admissions', col1: '6 Exits', col2: '4 Staff', col3: '2.1 Yrs', col4: '3 Roles', col5: '₹8.6L', status: 'fragile', riskLevel: 'Critical', primaryCause: 'Management Friction' }
                ];
            }

            return (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setSelectedDeepDive(null)} className="text-slate-500 hover:text-[#000099] flex items-center gap-1 text-sm font-bold transition-colors">
                            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Modules
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-[#E2E0D8] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${mod.bg} ${mod.color}`}>
                                <mod.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{mod.name} Deep Dive</h2>
                                <p className="text-slate-500 mt-1 font-medium">Granular breakdown of signals and operational metrics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Module Status</div>
                                <StatusBadge type={mod.status as any} text={mod.status.charAt(0).toUpperCase() + mod.status.slice(1)} />
                            </div>
                            <div className="h-10 w-px bg-[#E2E0D8]"></div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Alerts</div>
                                <div className="text-2xl font-bold text-rose-600 leading-none">{mod.alerts}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-[#E2E0D8] overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-[#E2E0D8] bg-[#F8F8F6] flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Departmental Risk Distribution</h3>
                            <button className="text-xs font-bold border border-[#000099] text-[#000099] rounded-md px-4 py-1.5 hover:bg-[#000099] hover:text-white transition-colors">
                                Export Data
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white border-b border-[#E2E0D8] text-slate-500 text-xs uppercase">
                                    <tr>
                                        {columns.map((col, idx) => (
                                            <th key={idx} className="px-6 py-4">{col}</th>
                                        ))}
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E0D8]">
                                    {deepDiveData.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleRowClick(`${row.dept} Specifics`, row)}>
                                            <td className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">{row.campus}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{row.dept}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{row.col1}</td>
                                            <td className="px-6 py-4 text-rose-600 font-bold">{row.col2}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{row.col3}</td>
                                            <td className="px-6 py-4 font-medium">{row.col4}</td>
                                            <td className="px-6 py-4 font-bold text-[#FF9A01]">{row.col5}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge type={row.status as any} text={row.status.charAt(0).toUpperCase() + row.status.slice(1)} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {(row.status === 'fragile' || row.status === 'watch') && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setConfirmModal({
                                                                title: `Initiate Correction — ${row.dept}`,
                                                                type: 'module_correction',
                                                                data: {
                                                                    body: `Flagged health signal in ${mod.name} for ${row.dept}.\n\nPrimary risk: ${row.col2} alerts detected.\n\nInitiating correction will notify the ${row.dept} HOD and create a reconciliation task in their dashboard.`,
                                                                    destructive: false,
                                                                    confirmText: 'Initiate correction',
                                                                    successMsg: `Correction workflow initiated for ${row.dept} ${mod.name}`,
                                                                    toggles: ['Attach diagnostic report', 'Request immediate response']
                                                                }
                                                            });
                                                        }}
                                                        className="h-8 px-3 text-xs font-medium bg-[#000099] text-white rounded-lg transition-colors"
                                                    >
                                                        Correct now
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8 animate-in fade-in duration-300">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#000099]">Cross-Module Intelligence</h2>
                        <p className="text-slate-500 mt-1">Aggregated health signals across all HRMS modules</p>
                    </div>
                    <div className="md:text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Global Alert Engine</div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-50 border border-rose-200">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                            <span className="text-lg font-bold text-rose-700">42 Total Alerts</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modulesHealth.map((mod, i) => (
                        <div key={i} className="bg-white rounded-xl border border-[#E2E0D8] p-6 hover:shadow-lg hover:border-[#000099]/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setSelectedDeepDive(mod.name)}>
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3.5 rounded-xl ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform`}>
                                        <mod.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">{mod.name}</h3>
                                </div>
                                <StatusBadge type={mod.status as any} text={mod.status.charAt(0).toUpperCase() + mod.status.slice(1)} />
                            </div>
                            
                            <div className="mb-8">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Indicator</div>
                                <div className="text-3xl font-bold text-slate-900">{mod.metric}</div>
                                <div className="text-sm text-slate-500 font-medium mt-1">{mod.subtext}</div>
                            </div>
                            
                            <div className="mt-auto pt-5 border-t border-[#E2E0D8] flex items-start gap-3">
                                {mod.alerts > 0 ? (
                                    <div className="p-2 rounded-full bg-rose-100 text-rose-600 shrink-0">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <div className="p-2 rounded-full bg-teal-100 text-teal-600 shrink-0">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                )}
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Top Signal</div>
                                    <div className="text-sm font-medium text-slate-700 leading-tight">
                                        {mod.alerts > 0 ? <span className="font-bold text-rose-600">{mod.alerts} alerts: </span> : <span className="font-bold text-teal-600">All clear: </span>}
                                        {mod.alertText}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDeepDive(mod.name);
                                    }}
                                    className="w-full h-8 flex items-center justify-center gap-2 text-xs font-bold bg-[#000099] text-white rounded-lg hover:bg-[#000099]/90 transition-colors"
                                >
                                    View health report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'continuity': return renderContinuity();
            case 'control': return renderControl();
            case 'reputation': return renderReputation();
            case 'scale': return renderScale();
            case 'modules': return renderModules();
            default: return (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                        <Activity className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No signals this period</h3>
                    <p className="text-slate-500 mt-2">This report will update at the next data refresh.</p>
                </div>
            );
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#F8F8F6] font-['DM_Sans',sans-serif] overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[232px] bg-white border-r border-[#E2E0D8] flex flex-col shrink-0">
                {/* Header */}
                <div className="h-[52px] flex items-center px-4 border-b border-[#E2E0D8]">
                    <div className="font-bold text-[#000099] flex items-center gap-2 text-lg">
                        <Activity className="w-5 h-5 text-[#FF9A01]" /> Intelligence
                    </div>
                </div>
                
                {/* Nav items */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Reports</div>
                    <div className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-bold transition-colors ${
                                    activeTab === tab.id 
                                        ? 'bg-[#000099] text-white' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#000099]'
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#FF9A01]' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Topbar */}
                <div className="h-[52px] bg-white border-b border-[#E2E0D8] flex items-center justify-between px-6 shrink-0 relative z-10 shadow-sm">
                    {/* Left Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs w-[200px] lg:w-[300px]">
                        <span className="text-slate-400 font-medium">Intelligence</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        <span className="font-bold text-slate-900">{getActiveTabTitle()}</span>
                    </div>

                    {/* Center Title */}
                    <div className="font-bold text-[#000099] text-lg tracking-tight hidden lg:block text-center flex-1">
                        Workforce Intelligence
                    </div>

                    {/* Right Tools */}
                    <div className="flex items-center gap-3 lg:gap-4 justify-end w-[200px] lg:w-[auto]">
                        <select 
                            className="text-[10px] lg:text-xs font-bold text-slate-700 bg-transparent border border-[#E2E0D8] rounded-md px-2 lg:px-3 py-1.5 outline-none focus:border-[#000099] cursor-pointer max-w-[120px] lg:max-w-none"
                            value={selectedInstitution}
                            onChange={(e) => setSelectedInstitution(e.target.value)}
                        >
                            <option>All Institutions</option>
                            <option>NHCE (Engineering)</option>
                            <option>NHCM (Commerce)</option>
                        </select>
                        <select className="text-[10px] lg:text-xs font-bold text-slate-700 bg-transparent border border-[#E2E0D8] rounded-md px-2 lg:px-3 py-1.5 outline-none focus:border-[#000099] cursor-pointer hidden sm:block">
                            <option>Last 12 months</option>
                            <option>Last 6 months</option>
                            <option>Year to Date</option>
                        </select>
                        <button 
                            onClick={() => setHistoryDrawerOpen(true)}
                            className="p-1.5 text-slate-500 hover:text-[#000099] hover:bg-slate-100 rounded-md transition-colors"
                            title="Action History"
                        >
                            <Clock className="w-4 h-4" />
                        </button>
                        <button className="text-[10px] lg:text-xs font-bold border border-[#000099] text-[#000099] rounded-md px-2 lg:px-4 py-1.5 hover:bg-[#000099] hover:text-white transition-colors">
                            Export
                        </button>
                    </div>
                </div>

                {/* Page scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
                    <div className="max-w-[1200px] mx-auto">
                        {renderContent()}
                    </div>

                    {/* Footer */}
                    <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-[#E2E0D8] text-center pb-8">
                        <div className="flex justify-center items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                            <span>Probation Hub</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>Leave Management</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>Payroll</span>
                        </div>
                        <p className="text-xs text-slate-500">
                            All figures are derived from operational records in edumerge HRMS. Click any row to view source record.
                        </p>
                    </div>
                </div>

                {/* Drawer Overlay & Content */}
                {drawerData && (
                    <div className="absolute inset-0 z-50 flex justify-end items-end md:items-start">
                        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setDrawerData(null)}></div>
                        <div className="w-full md:max-w-md bg-white border-t md:border-t-0 md:border-l border-[#E2E0D8] h-[85vh] md:h-full relative z-10 flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right duration-300 shadow-2xl rounded-t-2xl md:rounded-none">
                            <div className="flex items-center justify-between p-6 border-b border-[#E2E0D8] bg-white rounded-t-2xl md:rounded-none">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                        <Database className="w-5 h-5 text-[#000099]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Source Record</h3>
                                        <p className="text-xs text-[#FF9A01] font-bold uppercase tracking-wider mt-0.5">{drawerData.title}</p>
                                    </div>
                                </div>
                                <button onClick={() => setDrawerData(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 bg-[#F8F8F6]">
                                <div className="bg-white border border-[#E2E0D8] rounded-xl shadow-sm overflow-hidden mb-6">
                                    <div className="px-5 py-3 border-b border-[#E2E0D8] bg-slate-50 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#000099]"></div>
                                        <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Data Extract</span>
                                    </div>
                                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                                        {Object.entries(drawerData.data).map(([key, value]) => {
                                            if (key === 'icon') return null; // Skip icon rendering in data extract
                                            const isStatus = typeof value === 'string' && ['watch', 'stable', 'fragile', 'strong', 'developing', 'weak', 'structural', 'isolated', 'matched', 'mismatch', 'good', 'bad', 'default', 'documented'].includes(value.toLowerCase());
                                            
                                            return (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    {isStatus ? (
                                                        <div className="w-max">
                                                            <StatusBadge type={value.toLowerCase() as any} text={String(value).charAt(0).toUpperCase() + String(value).slice(1)} />
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm font-bold text-slate-800 break-words bg-slate-50 px-3 py-2 rounded-md border border-[#E2E0D8]">
                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {drawerData.title.toLowerCase().includes('stability signal') && (
                                    <div className="bg-white border border-[#E2E0D8] rounded-xl shadow-sm overflow-hidden mb-6">
                                        <div className="px-5 py-3 border-b border-[#E2E0D8] bg-rose-50 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-600" />
                                            <span className="font-bold text-xs text-rose-800 uppercase tracking-wider">Detected Instability Patterns</span>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            {drawerData.data.factor === 'Leave Pattern Changes' && (
                                                <>
                                                    <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">Sudden consecutive leaves</div>
                                                            <div className="text-xs text-slate-600 mt-0.5">3 employees in this department took 4+ consecutive unplanned days off this month.</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">Monday/Friday patterns</div>
                                                            <div className="text-xs text-slate-600 mt-0.5">26% increase in weekend-adjacent unplanned leaves compared to last quarter.</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {drawerData.data.factor === 'Attendance Instability' && (
                                                <>
                                                    <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">Frequent late arrivals</div>
                                                            <div className="text-xs text-slate-600 mt-0.5">5 employees have arrived {'>'}30 mins late more than 3 times this week.</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">Missing punch trends</div>
                                                            <div className="text-xs text-slate-600 mt-0.5">14 manual attendance corrections submitted in the last 48 hours.</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {drawerData.data.factor === 'Evaluation Delays' && (
                                                <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">Overdue evaluations</div>
                                                        <div className="text-xs text-slate-600 mt-0.5">HOD has failed to submit 30-day performance reviews for 2 probationary staff.</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {drawerData.title.toLowerCase().includes('vacancy exposure') && (
                                    <div className="bg-white border border-[#E2E0D8] rounded-xl shadow-sm overflow-hidden mb-6">
                                        <div className="px-5 py-3 border-b border-[#E2E0D8] bg-rose-50 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-600" />
                                            <span className="font-bold text-xs text-rose-800 uppercase tracking-wider">Operational Impact Analysis</span>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            {drawerData.data.gap === 'High Workload Pressure' && (
                                                <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">Critical Workflow Dependency</div>
                                                        <div className="text-xs text-slate-600 mt-0.5">
                                                            This open position is delaying <strong>14 compliance processes</strong> and causing high workload pressure on adjacent roles. The vacancy aging indicates a bottleneck in the HR interview phase.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {drawerData.data.gap === 'Moderate' && (
                                                <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">Lab Session Redistribution</div>
                                                        <div className="text-xs text-slate-600 mt-0.5">
                                                            Remaining lab assistants are covering <strong>2.5x their normal sessions</strong>. Candidate offer pending background verification.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {drawerData.data.gap === 'Normal' && (
                                                <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">Routine Hiring Cycle</div>
                                                        <div className="text-xs text-slate-600 mt-0.5">
                                                            The vacancy is within standard operational tolerances. Existing administrative staff are temporarily handling vendor coordination.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {drawerData.title.toLowerCase().includes('phase end timeline') && (
                                    <div className="bg-white border border-[#E2E0D8] rounded-xl shadow-sm overflow-hidden mb-6">
                                        <div className="px-5 py-3 border-b border-[#E2E0D8] bg-indigo-50 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-[#000099]" />
                                            <span className="font-bold text-xs text-[#000099] uppercase tracking-wider">Evaluation & Assessment Data</span>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            {drawerData.data.evalStatus === 'Submitted' ? (
                                                <>
                                                    <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                        <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <div className="font-bold text-slate-900 text-sm">HOD Final Rating</div>
                                                                <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">4.2 / 5.0</div>
                                                            </div>
                                                            <div className="text-xs text-slate-600 mt-1 italic">
                                                                "Employee has demonstrated excellent adaptability and meets all core performance metrics. Highly recommended for confirmation."
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-[#F8F8F6] rounded-lg border border-[#E2E0D8]">
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Action</span>
                                                        <span className="text-sm font-bold text-slate-900">Proceed to Confirmation</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-start gap-3 p-3 bg-[#F8F8F6] rounded-lg border border-rose-200">
                                                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-rose-900 text-sm">Evaluation Pending</div>
                                                            <div className="text-xs text-rose-700 mt-0.5">
                                                                The HOD evaluation is currently <strong>{drawerData.data.evalStatus}</strong>. This assessment must be completed within the next {drawerData.data.days} days to prevent a default confirmation or illegal phase extension.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mt-4">
                                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Actions Before Phase End</div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-1 h-1 rounded-full bg-slate-400"></div> Submit 360-degree feedback form</div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-1 h-1 rounded-full bg-slate-400"></div> Complete HOD performance matrix</div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-1 h-1 rounded-full bg-slate-400"></div> Final HR clearance</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(drawerData.title.toLowerCase().includes('probation history') || drawerData.title.toLowerCase().includes('confirmation history')) && (
                                    <div className="bg-white border border-[#E2E0D8] rounded-xl shadow-sm overflow-hidden mb-6">
                                        <div className="px-5 py-3 border-b border-[#E2E0D8] bg-amber-50 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#FF9A01]"></div>
                                            <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">Probation History Log</span>
                                        </div>
                                        <div className="p-5">
                                            <div className="relative border-l-2 border-[#E2E0D8] ml-3 space-y-6 pb-2">
                                                <div className="relative pl-6">
                                                    <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Aug 15, 2026</div>
                                                    <div className="font-bold text-slate-900 text-sm">Probation Extended (60 days)</div>
                                                    <div className="text-xs text-slate-600 mt-1 font-medium">HOD Review: "Requires additional support in cross-departmental coordination."</div>
                                                </div>
                                                <div className="relative pl-6">
                                                    <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jun 10, 2026</div>
                                                    <div className="font-bold text-slate-900 text-sm">First Assessment Completed</div>
                                                    <div className="text-xs text-slate-600 mt-1 font-medium">Status: Meets Expectations (Marginal)</div>
                                                </div>
                                                <div className="relative pl-6">
                                                    <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jan 01, 2026</div>
                                                    <div className="font-bold text-slate-900 text-sm">Joined Institution</div>
                                                    <div className="text-xs text-slate-600 mt-1 font-medium">Initial 6-month probation period started.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center flex flex-col items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border border-indigo-100">
                                        <Search className="w-4 h-4 text-[#000099]" />
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-[260px]">
                                        This is a read-only, non-editable view of the exact operational record that triggered the intelligence system signal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* V2 UI Overlays */}
                {/* Toast Notification */}
                {toast && (
                    <div className="fixed bottom-6 right-6 bg-[#000099] text-white px-4 py-3 rounded-lg shadow-xl z-[100] flex items-center gap-3 animate-in slide-in-from-bottom-5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF9A01]" />
                        <span className="text-sm font-medium">{toast}</span>
                    </div>
                )}

                {/* Confirmation Modal */}
                {confirmModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmModal(null)}></div>
                        <div className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmModal.title}</h3>
                                <div className="text-sm text-slate-600 mb-6 whitespace-pre-wrap">{confirmModal.data.body}</div>
                                
                                {confirmModal.data.toggles && confirmModal.data.toggles.map((t: any, i: number) => (
                                    <label key={i} className="flex items-center gap-2 mb-3 cursor-pointer">
                                        <input type="checkbox" className="rounded border-slate-300 text-[#000099] focus:ring-[#000099]" />
                                        <span className="text-sm font-medium text-slate-700">{t}</span>
                                    </label>
                                ))}

                                <div className="flex items-center justify-end gap-3 mt-6">
                                    <button onClick={() => setConfirmModal(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => processAction(() => setConfirmModal(null), confirmModal.data.successMsg)}
                                        disabled={isProcessing}
                                        className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors flex items-center gap-2 ${confirmModal.data.destructive ? 'bg-[#993C1D] hover:bg-[#993C1D]/90' : 'bg-[#000099] hover:bg-[#000099]/90'}`}
                                    >
                                        {isProcessing ? 'Processing...' : confirmModal.data.confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Drawer */}
                {actionDrawer && (
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setActionDrawer(null)}></div>
                        <div className="w-full md:w-[480px] bg-[#F8F8F6] border-l border-[#E2E0D8] h-full relative z-10 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
                            <div className="h-[52px] flex items-center justify-between px-6 border-b border-[#E2E0D8] bg-white shrink-0">
                                <h3 className="font-bold text-slate-900 text-lg">{actionDrawer.title}</h3>
                                <button onClick={() => setActionDrawer(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {actionDrawer.data.content}
                            </div>
                            <div className="h-[64px] bg-white border-t border-[#E2E0D8] px-6 flex items-center justify-between shrink-0">
                                <button onClick={() => setActionDrawer(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                {actionDrawer.data.primaryAction && (
                                    <button 
                                        onClick={() => processAction(() => setActionDrawer(null), actionDrawer.data.successMsg)}
                                        disabled={isProcessing}
                                        className="px-4 py-2 text-xs font-bold bg-[#000099] hover:bg-[#000099]/90 text-white rounded-lg transition-colors"
                                    >
                                        {isProcessing ? 'Processing...' : actionDrawer.data.primaryAction}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action History Drawer */}
                {historyDrawerOpen && (
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setHistoryDrawerOpen(false)}></div>
                        <div className="w-full md:w-[480px] bg-white border-l border-[#E2E0D8] h-full relative z-10 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
                            <div className="h-[52px] flex items-center justify-between px-6 border-b border-[#E2E0D8] bg-white shrink-0">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Action History</h3>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Last 30 days</div>
                                </div>
                                <button onClick={() => setHistoryDrawerOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 border-b border-[#E2E0D8] bg-slate-50 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search actions..." 
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E0D8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000099]/20"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {['All', 'Evaluations', 'Escalations', 'Audits'].map(filter => (
                                        <button key={filter} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${filter === 'All' ? 'bg-[#000099] text-white' : 'bg-white text-slate-600 border border-[#E2E0D8] hover:border-[#000099]'}`}>
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-[#E2E0D8]">
                                {actionHistoryData.map((log, i) => (
                                    <div key={i} className="p-5 hover:bg-slate-50 group transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.type === 'evaluation' ? 'bg-indigo-50 text-[#000099]' : 'bg-[#FF9A01]/10 text-[#FF9A01]'}`}>
                                                    {log.type === 'evaluation' ? <Activity className="w-4 h-4"/> : <ShieldCheck className="w-4 h-4"/>}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-900 group-hover:text-[#000099] transition-colors">{log.title}</div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{log.detail}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.date}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{log.user}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 border-dashed">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{log.source}</span>
                                                <span className={`text-[10px] font-bold uppercase ${log.status === 'Completed' ? 'text-teal-600' : 'text-amber-600'}`}>{log.status}</span>
                                            </div>
                                            <button className="text-[10px] font-bold text-[#000099] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-6 bg-slate-50 border-t border-[#E2E0D8]">
                                <button className="w-full h-10 flex items-center justify-center gap-2 text-xs font-bold bg-white border border-[#E2E0D8] text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                                    <Download className="w-4 h-4" /> Export full audit log
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkforceIntelligence;
