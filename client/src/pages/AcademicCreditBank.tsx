import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import {
    GraduationCap,
    Database,
    RefreshCw,
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    Plus,
    Search,
    Share2,
    ExternalLink,
    ChevronRight,
    Download,
    UserCheck,
    Building2,
    Sparkles,
    Shield,
    Trash2,
    Filter,
    ArrowRight,
    Terminal,
    Award
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    PieChart,
    Pie
} from 'recharts';

// Initial course ledger
const INITIAL_LEDGER = [
    { code: 'CS101', title: 'Discrete Mathematics', credits: 4, grade: 'A', sem: 'Sem I', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS102', title: 'Programming in C++', credits: 4, grade: 'A+', sem: 'Sem I', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS103', title: 'Digital Logic Design', credits: 4, grade: 'B+', sem: 'Sem I', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'HU101', title: 'Professional Communication', credits: 2, grade: 'O', sem: 'Sem I', type: 'AEC', source: 'Edumerge University', status: 'Synced' },
    { code: 'ES101', title: 'Environmental Studies', credits: 2, grade: 'A', sem: 'Sem I', type: 'VAC', source: 'Edumerge University', status: 'Synced' },
    
    { code: 'CS201', title: 'Data Structures & Algorithms', credits: 4, grade: 'A', sem: 'Sem II', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS202', title: 'Computer Organization', credits: 4, grade: 'B', sem: 'Sem II', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS203', title: 'Database Management Systems', credits: 4, grade: 'A+', sem: 'Sem II', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'MA201', title: 'Linear Algebra', credits: 4, grade: 'A', sem: 'Sem II', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS204', title: 'Web Technologies', credits: 4, grade: 'O', sem: 'Sem II', type: 'SEC', source: 'Edumerge University', status: 'Synced' },
    
    { code: 'CS301', title: 'Operating Systems', credits: 4, grade: 'B+', sem: 'Sem III', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS302', title: 'Theory of Computation', credits: 4, grade: 'A', sem: 'Sem III', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS303', title: 'Computer Networks', credits: 4, grade: 'A+', sem: 'Sem III', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS304', title: 'Design & Analysis of Algorithms', credits: 4, grade: 'A', sem: 'Sem III', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS305', title: 'Cyber Security & Laws', credits: 3, grade: 'A', sem: 'Sem III', type: 'SEC', source: 'Edumerge University', status: 'Synced' },
    
    { code: 'CS401', title: 'Software Engineering', credits: 4, grade: 'A+', sem: 'Sem IV', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS402', title: 'Artificial Intelligence', credits: 4, grade: 'A', sem: 'Sem IV', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'CS403', title: 'Machine Learning', credits: 4, grade: 'O', sem: 'Sem IV', type: 'Core', source: 'Edumerge University', status: 'Synced' },
    { code: 'HU401', title: 'Organizational Behavior', credits: 3, grade: 'B+', sem: 'Sem IV', type: 'Elective', source: 'Edumerge University', status: 'Synced' },
    { code: 'PE401', title: 'Yoga & Wellness', credits: 2, grade: 'O', sem: 'Sem IV', type: 'VAC', source: 'Edumerge University', status: 'Synced' }
];

// External credits loaded during DigiLocker Sync
const DIGILOCKER_COURSES = [
    { code: 'MOOC-01', title: 'Introduction to Cloud Computing', credits: 4, grade: 'O', sem: 'Sem V', type: 'Elective', source: 'NPTEL (IIT Kharagpur)', status: 'Synced' },
    { code: 'MOOC-02', title: 'Big Data Analytics', credits: 4, grade: 'A', sem: 'Sem V', type: 'Elective', source: 'NPTEL (IIT Madras)', status: 'Synced' },
    { code: 'MOOC-03', title: 'DevOps Essentials', credits: 3, grade: 'A+', sem: 'Sem V', type: 'SEC', source: 'Coursera (UC Santa Cruz)', status: 'Synced' }
];

const AcademicCreditBank: React.FC = () => {
    const navigate = useNavigate();
    
    // Demo Personas: 'student' | 'registrar'
    const [persona, setPersona] = useState<'student' | 'registrar'>('student');
    
    // Ledger state
    const [ledger, setLedger] = useState(INITIAL_LEDGER);
    const [hasSyncedExternal, setHasSyncedExternal] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string>('Never');
    const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'completed'>('idle');
    const [syncLogs, setSyncLogs] = useState<string[]>([]);
    
    // Transfer Requests queue (Admin view and student pending items)
    const [transferRequests, setTransferRequests] = useState([
        {
            id: 'req_001',
            studentName: 'Likith V.',
            abcId: 'ABC-5942-8392-1029',
            courseName: 'Deep Learning Specialization',
            courseCode: 'MOOC-04',
            credits: 4,
            grade: 'A+',
            offeringBody: 'NPTEL (IIT Madras)',
            semester: 'Sem V',
            type: 'Elective',
            certId: 'NPTEL-DL-2026-9481',
            status: 'Pending',
            dateSubmitted: 'May 25, 2026'
        }
    ]);
    
    // Search and filter ledger
    const [searchTerm, setSearchTerm] = useState('');
    const [semFilter, setSemFilter] = useState('All');
    
    // Form for requesting new credit transfers
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCredits, setNewCredits] = useState('4');
    const [newGrade, setNewGrade] = useState('A');
    const [newSource, setNewSource] = useState('Coursera');
    const [newCertId, setNewCertId] = useState('');
    const [newSem, setNewSem] = useState('Sem V');
    const [newType, setNewType] = useState('Elective');

    // Registrar batch push to NAD state
    const [batchPushState, setBatchPushState] = useState<'idle' | 'pushing' | 'completed'>('idle');
    const [batchPushProgress, setBatchPushProgress] = useState(0);
    const [batchTxHash, setBatchTxHash] = useState('');

    const logTerminalRef = useRef<HTMLDivElement>(null);

    // Auto scroll sync log terminal
    useEffect(() => {
        if (logTerminalRef.current) {
            logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
        }
    }, [syncLogs]);

    // Calculate aggregated stats
    const totalCredits = ledger.reduce((sum, item) => sum + (item.status === 'Synced' || item.status === 'Approved' ? item.credits : 0), 0);
    const requiredCredits = 160;
    const progressPercent = Math.min(100, Math.round((totalCredits / requiredCredits) * 100));

    // Credit breakdown by type for charting
    const creditByType = React.useMemo(() => {
        const types: Record<string, number> = {
            'Core': 0,
            'Elective': 0,
            'SEC (Skill)': 0,
            'VAC (Value Added)': 0,
            'AEC (Ability)': 0
        };
        
        ledger.forEach(item => {
            if (item.status === 'Synced' || item.status === 'Approved') {
                const typeName = item.type === 'Core' ? 'Core' 
                                : item.type === 'Elective' ? 'Elective'
                                : item.type === 'SEC' ? 'SEC (Skill)'
                                : item.type === 'VAC' ? 'VAC (Value Added)'
                                : 'AEC (Ability)';
                types[typeName] = (types[typeName] || 0) + item.credits;
            }
        });

        return Object.entries(types).map(([name, value]) => ({ name, value }));
    }, [ledger]);

    const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];

    // Credit accumulation by semester
    const creditBySem = React.useMemo(() => {
        const sems: Record<string, number> = {
            'Sem I': 0,
            'Sem II': 0,
            'Sem III': 0,
            'Sem IV': 0,
            'Sem V': 0
        };
        ledger.forEach(item => {
            if (item.status === 'Synced' || item.status === 'Approved') {
                sems[item.sem] = (sems[item.sem] || 0) + item.credits;
            }
        });
        return Object.entries(sems).map(([name, credits]) => ({ name, credits }));
    }, [ledger]);

    // Simulate DigiLocker sync
    const handleSync = () => {
        if (syncState === 'syncing') return;
        setSyncState('syncing');
        setSyncLogs([]);

        const logs = [
            'Establishing secure socket handshake with DigiLocker Gateway...',
            'Verifying client credentials & Aadhaar-linked phone endpoint...',
            'SSL Session active. Transmitting authenticated ID Token key...',
            'Querying National Academic Depository (NAD) central credit registry...',
            'Record match found for candidate: LIKITH V (DOB: 12-08-2004)...',
            'ABC Registry found: ABC-5942-8392-1029. Retrieving active credits ledger...',
            'Discovered 3 external credit vouchers signed by approved NPTEL & Coursera nodes.',
            'Cross-referencing credit codes with university curriculum policies...',
            'Sync complete. Injecting verified ledger entries into active profile.'
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                setSyncLogs(prev => [...prev, `[${timeStr}] ${logs[index]}`]);
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setSyncState('completed');
                    const now = new Date();
                    setLastSyncTime(now.toLocaleString());
                    if (!hasSyncedExternal) {
                        setLedger(prev => [...prev, ...DIGILOCKER_COURSES]);
                        setHasSyncedExternal(true);
                    }
                }, 500);
            }
        }, 600);
    };

    // Handle Transfer Credit submission
    const handleAddTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseName || !newCourseCode) return;

        const newRequest = {
            id: `req_${Date.now()}`,
            studentName: 'Likith V.',
            abcId: 'ABC-5942-8392-1029',
            courseName: newCourseName,
            courseCode: newCourseCode,
            credits: parseInt(newCredits),
            grade: newGrade,
            offeringBody: newSource,
            semester: newSem,
            type: newType,
            certId: newCertId || `CERT-${Math.floor(Math.random() * 90000) + 10000}`,
            status: 'Pending',
            dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        setTransferRequests(prev => [newRequest, ...prev]);
        
        // Also add as "Pending Approval" to the student's ledger
        const ledgerItem = {
            code: newCourseCode,
            title: newCourseName,
            credits: parseInt(newCredits),
            grade: newGrade,
            sem: newSem,
            type: newType,
            source: newSource,
            status: 'Pending Approval'
        };
        setLedger(prev => [...prev, ledgerItem]);

        // Reset Form
        setNewCourseName('');
        setNewCourseCode('');
        setNewCredits('4');
        setNewCertId('');
        setShowTransferModal(false);
    };

    // Registrar approves credit transfer
    const handleApproveRequest = (id: string) => {
        const req = transferRequests.find(r => r.id === id);
        if (!req) return;

        // Mark request as Approved
        setTransferRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));

        // Update corresponding ledger course status from "Pending Approval" to "Approved"
        setLedger(prev => prev.map(item => 
            item.code === req.courseCode && item.status === 'Pending Approval' 
                ? { ...item, status: 'Approved' } 
                : item
        ));
    };

    // Registrar rejects credit transfer
    const handleRejectRequest = (id: string) => {
        const req = transferRequests.find(r => r.id === id);
        if (!req) return;

        setTransferRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));

        // Remove from ledger
        setLedger(prev => prev.filter(item => !(item.code === req.courseCode && item.status === 'Pending Approval')));
    };

    // Registrar batch push to NAD simulator
    const handlePushBatch = () => {
        if (batchPushState === 'pushing') return;
        setBatchPushState('pushing');
        setBatchPushProgress(0);

        const timer = setInterval(() => {
            setBatchPushProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setBatchPushState('completed');
                    setBatchTxHash(`tx_nad_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    // Filtered ledger rows
    const filteredLedger = ledger.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.source.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSem = semFilter === 'All' || item.sem === semFilter;
        return matchesSearch && matchesSem;
    });

    return (
        <Layout
            title="Academic Credit Bank Integration"
            description="Secure National Academic Depository (NAD) & DigiLocker credit verification engine mapped to NEP 2020 framework."
            icon={GraduationCap}
            showHome={true}
            headerActions={
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setPersona('student')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${persona === 'student' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                    >
                        Student Portal
                    </button>
                    <button
                        onClick={() => setPersona('registrar')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${persona === 'registrar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                    >
                        Registrar Desk
                    </button>
                </div>
            }
        >
            {persona === 'student' ? (
                // STUDENT PORTAL VIEW
                <div className="space-y-8 pb-20 animate-in fade-in duration-500">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-950 rounded-2xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-500/30">
                                        NEP 2020 Compliant
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                                        <Shield className="w-3.5 h-3.5" /> Aadhaar Verified
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Likith V.</h2>
                                <p className="text-indigo-200 text-sm max-w-xl">
                                    View and manage accumulated academic credits. Sync external certifications via the DigiLocker NAD node, or submit credit redemption requests.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-4 bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/10 shrink-0">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">ABC ID / Registry Pin</span>
                                    <span className="font-mono font-bold text-lg tracking-wider text-white select-all">ABC-5942-8392-1029</span>
                                    <span className="text-[9px] text-slate-400 block">Linked via DigiLocker API</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden group transition-all hover:shadow-md">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-105 transition-all">
                                    <Database className="w-7 h-7" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Graduation Progress</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-3xl font-extrabold text-slate-900">{totalCredits}</h3>
                                        <span className="text-slate-400 text-xs">/ {requiredCredits} Credits</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                                        <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden group transition-all hover:shadow-md">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-all">
                                    <CheckCircle className="w-7 h-7" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Courses</p>
                                    <h3 className="text-3xl font-extrabold text-slate-900">{ledger.filter(c => c.status === 'Synced' || c.status === 'Approved').length}</h3>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Fully Synced with NAD
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden group transition-all hover:shadow-md">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-105 transition-all">
                                    <RefreshCw className={`w-7 h-7 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last DigiLocker Sync</p>
                                    <h3 className="text-sm font-bold text-slate-900 truncate mt-1">
                                        {syncState === 'syncing' ? 'Syncing now...' : lastSyncTime}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                                        {hasSyncedExternal ? '3 MOOC Courses Imported' : 'Click sync to check external credits'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Central Sync Console & Visual Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Interactive Sync Module */}
                        <Card className="lg:col-span-1 rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-[400px]">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-indigo-600" />
                                    <h3 className="font-bold text-slate-900 text-sm">DigiLocker NAD Integrator</h3>
                                </div>
                                {syncState === 'syncing' && (
                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded-full animate-pulse">
                                        Syncing
                                    </span>
                                )}
                            </div>
                            <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <p className="text-xs text-slate-500">
                                        Establish secure handshake with the national registry node to scan for and import credits earned from external MOOC platforms and exchange colleges.
                                    </p>
                                    
                                    {/* Terminal Screen */}
                                    <div 
                                        ref={logTerminalRef}
                                        className="h-44 bg-slate-950 rounded-xl p-3 font-mono text-[9px] text-emerald-400 overflow-y-auto space-y-2 border border-slate-900 shadow-inner no-scrollbar"
                                    >
                                        {syncLogs.length === 0 ? (
                                            <div className="text-slate-500 flex flex-col items-center justify-center h-full gap-2">
                                                <Database className="w-8 h-8 opacity-20" />
                                                <span className="animate-pulse">Awaiting Sync Trigger</span>
                                            </div>
                                        ) : (
                                            syncLogs.map((log, i) => (
                                                <div key={i} className="leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                                                    {log}
                                                </div>
                                            ))
                                        )}
                                        {syncState === 'syncing' && (
                                            <div className="text-indigo-400 animate-pulse flex items-center gap-1 mt-2 pl-2">
                                                <span>&gt; Querying node transaction ledger...</span>
                                                <span className="inline-block w-1.5 h-3 bg-indigo-400 animate-[ping_1s_infinite]"></span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSync}
                                    disabled={syncState === 'syncing'}
                                    className={`w-full mt-4 h-11 font-bold rounded-xl gap-2 shadow-sm text-xs uppercase tracking-wider ${syncState === 'syncing' ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                >
                                    <RefreshCw className={`w-4 h-4 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                                    {syncState === 'syncing' ? 'Fetching Credits...' : 'Sync DigiLocker Credits'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Chart 1: Category Distribution */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden p-5 flex flex-col h-[400px]">
                            <div className="mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Credit distribution</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">By academic requirement type</p>
                            </div>
                            <div className="flex-1 min-h-0 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={creditByType}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {creditByType.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                                            formatter={(value) => [`${value} Credits`, 'Requirement']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-[10px] font-medium text-slate-500">
                                {creditByType.map((entry, idx) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                        <span className="truncate">{entry.name}: <strong className="text-slate-800">{entry.value}</strong></span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Chart 2: Semester Accumulation */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden p-5 flex flex-col h-[400px]">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Semester Timeline</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Credit velocity progression</p>
                                </div>
                            </div>
                            <div className="flex-grow min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={creditBySem} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                                            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                            formatter={(value) => [`${value} Credits`, 'Accumulated']}
                                        />
                                        <Bar dataKey="credits" radius={[6, 6, 0, 0]}>
                                            {creditBySem.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.name === 'Sem V' ? '#a855f7' : '#6366f1'} 
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Credit Ledger Table */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">Academic Credit Ledger</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Permanent ledger containing all earned qualifications</p>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search ledger..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-10 border-slate-200 rounded-xl bg-white focus:ring-indigo-500/20 focus:ring-2"
                                    />
                                </div>
                                <select
                                    value={semFilter}
                                    onChange={(e) => setSemFilter(e.target.value)}
                                    className="h-10 border border-slate-200 bg-white rounded-xl text-slate-600 text-xs px-3 font-semibold focus:outline-none"
                                >
                                    <option value="All">All Semesters</option>
                                    <option value="Sem I">Sem I</option>
                                    <option value="Sem II">Sem II</option>
                                    <option value="Sem III">Sem III</option>
                                    <option value="Sem IV">Sem IV</option>
                                    <option value="Sem V">Sem V</option>
                                </select>
                                <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
                                    <DialogTrigger asChild>
                                        <Button className="h-10 px-4 font-bold bg-indigo-600 text-white rounded-xl gap-2 shadow-sm text-xs shrink-0">
                                            <Plus className="w-4 h-4" /> Request Transfer
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-slate-100 p-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-bold text-slate-900">Submit Credit Transfer Request</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleAddTransfer} className="space-y-4 mt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Name</label>
                                                    <Input 
                                                        required 
                                                        placeholder="e.g. Deep Learning" 
                                                        value={newCourseName}
                                                        onChange={(e) => setNewCourseName(e.target.value)}
                                                        className="border-slate-200 rounded-lg h-10"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Code</label>
                                                    <Input 
                                                        required 
                                                        placeholder="e.g. MOOC-04" 
                                                        value={newCourseCode}
                                                        onChange={(e) => setNewCourseCode(e.target.value)}
                                                        className="border-slate-200 rounded-lg h-10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits</label>
                                                    <select
                                                        value={newCredits}
                                                        onChange={(e) => setNewCredits(e.target.value)}
                                                        className="w-full h-10 border border-slate-200 bg-white rounded-lg text-slate-700 text-sm px-2 focus:outline-none"
                                                    >
                                                        <option value="2">2 Credits</option>
                                                        <option value="3">3 Credits</option>
                                                        <option value="4">4 Credits</option>
                                                        <option value="6">6 Credits</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade Earned</label>
                                                    <select
                                                        value={newGrade}
                                                        onChange={(e) => setNewGrade(e.target.value)}
                                                        className="w-full h-10 border border-slate-200 bg-white rounded-lg text-slate-700 text-sm px-2 focus:outline-none"
                                                    >
                                                        <option value="O">O (Outstanding)</option>
                                                        <option value="A+">A+</option>
                                                        <option value="A">A</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B">B</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semester</label>
                                                    <select
                                                        value={newSem}
                                                        onChange={(e) => setNewSem(e.target.value)}
                                                        className="w-full h-10 border border-slate-200 bg-white rounded-lg text-slate-700 text-sm px-2 focus:outline-none"
                                                    >
                                                        <option value="Sem IV">Sem IV</option>
                                                        <option value="Sem V">Sem V</option>
                                                        <option value="Sem VI">Sem VI</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offering Body / Inst.</label>
                                                    <Input 
                                                        required 
                                                        placeholder="e.g. NPTEL (IIT Madras)" 
                                                        value={newSource}
                                                        onChange={(e) => setNewSource(e.target.value)}
                                                        className="border-slate-200 rounded-lg h-10"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Type</label>
                                                    <select
                                                        value={newType}
                                                        onChange={(e) => setNewType(e.target.value)}
                                                        className="w-full h-10 border border-slate-200 bg-white rounded-lg text-slate-700 text-sm px-2 focus:outline-none"
                                                    >
                                                        <option value="Elective">Elective Course</option>
                                                        <option value="Core">Core Subject</option>
                                                        <option value="SEC">SEC (Skill Enhancement)</option>
                                                        <option value="VAC">VAC (Value Added)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DigiLocker Cert Ref ID</label>
                                                <Input 
                                                    placeholder="e.g. MOE-NPTEL-8291A (Optional)" 
                                                    value={newCertId}
                                                    onChange={(e) => setNewCertId(e.target.value)}
                                                    className="border-slate-200 rounded-lg h-10"
                                                />
                                            </div>

                                            <div className="pt-4 flex justify-end gap-3">
                                                <Button type="button" variant="outline" onClick={() => setShowTransferModal(false)} className="h-10 rounded-lg">
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="h-10 bg-indigo-600 text-white rounded-lg px-6 font-bold shadow-md hover:bg-indigo-700">
                                                    Submit Request
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                            <th className="py-4 px-6">Course Code</th>
                                            <th className="py-4 px-6">Course Title</th>
                                            <th className="py-4 px-6">Credits</th>
                                            <th className="py-4 px-6 text-center">Grade</th>
                                            <th className="py-4 px-6">Source Node</th>
                                            <th className="py-4 px-6">Semester</th>
                                            <th className="py-4 px-6 text-right">Integrity Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                                        {filteredLedger.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="py-10 text-center text-slate-400">
                                                    No credit matching filters found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLedger.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{row.code}</td>
                                                    <td className="py-4 px-6 text-slate-950 font-bold">{row.title}</td>
                                                    <td className="py-4 px-6">
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">
                                                            {row.credits} Credits
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`inline-block w-8 py-0.5 rounded font-black text-center text-[10px] ${
                                                            row.grade === 'O' ? 'bg-amber-100 text-amber-800' :
                                                            row.grade.startsWith('A') ? 'bg-indigo-100 text-indigo-800' :
                                                            'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {row.grade}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 flex items-center gap-1.5 text-slate-500 font-medium">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        {row.source}
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-slate-400">{row.sem}</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <Badge className={`border-none font-bold text-[8px] tracking-wider uppercase px-2.5 py-1 rounded-full ${
                                                            row.status === 'Synced' ? 'bg-emerald-50 text-emerald-700' :
                                                            row.status === 'Approved' ? 'bg-indigo-50 text-indigo-700' :
                                                            row.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 animate-pulse' :
                                                            'bg-slate-100 text-slate-500'
                                                        }`}>
                                                            {row.status === 'Synced' && '✓ Synced (NAD)'}
                                                            {row.status === 'Approved' && '✓ Approved (Univ)'}
                                                            {row.status === 'Pending Approval' && '⌛ Pending Approval'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // REGISTRAR / ADMIN PORTAL VIEW
                <div className="space-y-8 pb-20 animate-in fade-in duration-500">
                    {/* Header Compliance Panel */}
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 border border-purple-950 rounded-2xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-purple-500/30">
                                        Registrar Administration Desk
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-500/30">
                                        NAD Portal Connected
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">University Registry Console</h2>
                                <p className="text-purple-200 text-sm max-w-xl">
                                    Approve credit transfer request vouchers submitted by students, verify DigiLocker blockchain hashes, and push institutional grade ledger records to the national depository.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-all">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ABC ID Linkage</p>
                                <h3 className="text-2xl font-bold text-slate-900">94.2%</h3>
                                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">4,541 / 4,821 Students</p>
                            </div>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-all">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Approvals</p>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {transferRequests.filter(r => r.status === 'Pending').length}
                                </h3>
                                <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">Vouchers Awaiting Review</p>
                            </div>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-all">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Credits Uploaded</p>
                                <h3 className="text-2xl font-bold text-slate-900">328.4K</h3>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Pushed to NAD Node</p>
                            </div>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-all">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Status</p>
                                <h3 className="text-2xl font-bold text-slate-900">100%</h3>
                                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">NEP Framework Compliant</p>
                            </div>
                        </Card>
                    </div>

                    {/* Pending Credit Transfer Queue */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">Student Credit Transfer Review Queue</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Voucher submissions from external universities or approved MOOC channels</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {transferRequests.length === 0 ? (
                                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                    <span className="font-bold text-slate-600">Verification queue is completely clear</span>
                                </div>
                            ) : (
                                transferRequests.map((req) => (
                                    <div 
                                        key={req.id} 
                                        className={`bg-white border rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all duration-300 ${
                                            req.status === 'Approved' ? 'border-emerald-200 bg-emerald-50/10' :
                                            req.status === 'Rejected' ? 'border-rose-100 bg-rose-50/5' :
                                            'border-slate-200 hover:border-purple-300'
                                        }`}
                                    >
                                        <div className="space-y-3 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="font-extrabold text-slate-900 text-sm">{req.studentName}</h4>
                                                <span className="text-slate-400 text-xs">({req.abcId})</span>
                                                <Badge className={`border-none font-bold text-[8px] tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                                                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                                                    'bg-amber-50 text-amber-700 animate-pulse'
                                                }`}>
                                                    {req.status === 'Pending' ? '⌛ Awaiting Verification' : `✓ ${req.status}`}
                                                </Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                                                <div className="space-y-0.5">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Transfer Course</span>
                                                    <span className="text-xs text-slate-800 font-bold block truncate">{req.courseName} <code className="text-slate-500 font-mono">({req.courseCode})</code></span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Credits / Grade</span>
                                                    <span className="text-xs text-slate-800 font-bold block">{req.credits} Credits <span className="text-indigo-600 font-black">[{req.grade}]</span></span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Source Institution</span>
                                                    <span className="text-xs text-slate-500 font-medium block truncate">{req.offeringBody}</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">DigiLocker Verification Hash</span>
                                                    <span className="text-xs font-mono text-slate-400 font-medium block truncate select-all">{req.certId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                                            {req.status === 'Pending' ? (
                                                <>
                                                    <Button 
                                                        variant="ghost" 
                                                        onClick={() => handleRejectRequest(req.id)}
                                                        className="h-10 px-4 font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs uppercase tracking-wider"
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleApproveRequest(req.id)}
                                                        className="h-10 px-5 font-bold bg-purple-600 text-white hover:bg-purple-700 rounded-xl gap-2 shadow-sm text-xs uppercase tracking-wider"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Approve & Sync
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                    <Shield className="w-4 h-4 text-emerald-500" /> Linked on {req.dateSubmitted}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Batch grade upload to National depository */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden p-6 space-y-6">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base">Semester Credit Registry Push (NAD Node)</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Submit completed semester grades for verification to central national academic portal</p>
                            </div>

                            <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className="border-none font-bold text-[8px] tracking-wider uppercase px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                                            Awaiting Registrar Transmission
                                        </Badge>
                                        <span className="text-slate-400 text-xs font-bold">Batch: #S2026-CS-04</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm">Computer Science Dept. • Semester IV Grades</h4>
                                    <p className="text-xs text-slate-500 font-medium">420 Student Grade Records (Total: 7,140 Credits) awaiting sealing.</p>
                                </div>
                                
                                <div className="shrink-0 w-full md:w-auto">
                                    {batchPushState === 'idle' && (
                                        <Button 
                                            onClick={handlePushBatch}
                                            className="w-full h-11 bg-purple-600 text-white hover:bg-purple-700 rounded-xl px-6 font-bold shadow-md text-xs uppercase tracking-wider gap-2"
                                        >
                                            <Database className="w-4 h-4" /> Push Batch to NAD
                                        </Button>
                                    )}
                                    
                                    {batchPushState === 'pushing' && (
                                        <div className="w-full md:w-48 space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                <span>Transmitting data...</span>
                                                <span>{batchPushProgress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${batchPushProgress}%` }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {batchPushState === 'completed' && (
                                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-wider block leading-none">Transmission Sealed</span>
                                                <span className="text-[8px] font-mono text-slate-400 block mt-1 truncate max-w-[140px] select-all">{batchTxHash}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Registry Push Operations</h4>
                                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs font-semibold text-slate-600">
                                    <div className="p-4 flex justify-between items-center bg-slate-50/20">
                                        <div>
                                            <span className="text-slate-900 block">Batch #S2026-ME-02 (Mechanical Dept - Sem II)</span>
                                            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">380 Students • Transmitted by Registrar R. Sharma</span>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-bold text-[8px] uppercase tracking-wider py-1 px-2.5 rounded-full">✓ Sealed & Verified</Badge>
                                            <span className="text-[9px] font-mono text-slate-400 block mt-1 select-all">tx_nad_098a1bf10f82</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-center bg-slate-50/20">
                                        <div>
                                            <span className="text-slate-900 block">Batch #S2026-EE-06 (Electrical Dept - Sem VI)</span>
                                            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">290 Students • Transmitted by Registrar R. Sharma</span>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-bold text-[8px] uppercase tracking-wider py-1 px-2.5 rounded-full">✓ Sealed & Verified</Badge>
                                            <span className="text-[9px] font-mono text-slate-400 block mt-1 select-all">tx_nad_8f12cb8491d9</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Integration Status Diagnostics */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden p-6 flex flex-col justify-between h-auto space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-sm">NAD Integration Health</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">National Academic Depository node state</p>
                                </div>

                                <div className="space-y-3 font-semibold text-xs text-slate-600">
                                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/30">
                                        <span className="text-slate-500">API Gateway Endpoint</span>
                                        <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                            Online (Active)
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/30">
                                        <span className="text-slate-500">DigiLocker Auth Node</span>
                                        <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                            Operational
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/30">
                                        <span className="text-slate-500">Aadhaar e-KYC Server</span>
                                        <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                            Active (99.8% SLA)
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/30">
                                        <span className="text-slate-500">University Block Registry</span>
                                        <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                            Sealed & Synced
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl text-purple-950 font-medium space-y-2">
                                <h4 className="text-[10px] font-black text-purple-800 uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles className="w-4 h-4 text-purple-600" /> NEP-2020 Compliance Tip
                                </h4>
                                <p className="text-[10px] leading-relaxed">
                                    Universities must register students via DigiLocker e-KYC to guarantee credits are safely stored under their permanent ABC ID, enabling seamless credit portability.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AcademicCreditBank;
