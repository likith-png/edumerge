import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

import {
    CheckCircle, Upload, FileText, BookOpen, ClipboardList,
    MessageSquare, Send, Home,
    Clock, Download, PenLine, Zap, UserCheck, CheckCircle2
} from 'lucide-react';

// ─── Types & Mock Data ─────────────────────────────────────────────────────────

interface Message { id: number; from: 'HR' | 'Me'; text: string; time: string; }

const candidateInfo = {
    name: 'Ms. Reshma Binu Prasad', role: 'Assistant Professor', dept: 'Computer Science',
    joinDate: '2026-03-15', employeeId: 'EMP-2026-0042',
    buddy: { name: 'Dr. Ramesh Kumar', role: 'Senior Professor', avatar: 'RK', daysLeft: 14 },
    currentStage: 2,
    stages: [
        { id: 1, label: 'Offer Accepted', done: true },
        { id: 2, label: 'Documentation', done: false, active: true },
        { id: 3, label: 'Orientation', done: false },
        { id: 4, label: 'Op. Checklist', done: false },
        { id: 5, label: 'BGV', done: false },
        { id: 6, label: 'Sign-Off', done: false },
    ]
};

const requiredDocs = [
    { id: 1, name: 'Aadhar Card / Passport', required: true, originalRequired: true, status: 'Verified', uploaded: true },
    { id: 2, name: 'PAN Card', required: true, originalRequired: false, status: 'Pending Review', uploaded: true },
    { id: 3, name: 'Educational Certificates (All Degrees)', required: true, originalRequired: true, status: 'Not Uploaded', uploaded: false },
    { id: 4, name: 'Previous Employment Letters', required: true, originalRequired: false, status: 'Not Uploaded', uploaded: false },
    { id: 5, name: 'Passport Size Photos (4 copies)', required: true, originalRequired: false, status: 'Verified', uploaded: true },
    { id: 6, name: 'Bank Account Details', required: true, originalRequired: false, status: 'Pending Review', uploaded: true },
];

const orientationModules = [
    {
        id: 1, title: 'HR Orientation', owner: 'HR Team', duration: '2 Days',
        topics: ['Organization Overview', 'HR Policies & Leave', 'Code of Conduct', 'POSH Policy'],
        completed: false, canComplete: true
    },
    {
        id: 2, title: 'Department Orientation', owner: 'HOD – Computer Science', duration: '3 Days',
        topics: ['Department Goals', 'Academic Calendar', 'Team Introduction', 'Research Areas'],
        completed: false, canComplete: false
    },
    {
        id: 3, title: 'Trainer / LMS Orientation', owner: 'Training Team', duration: '1 Day',
        topics: ['LMS Portal Access', 'Online Certification Paths', 'Training Schedule'],
        completed: false, canComplete: false
    },
];

const operationalChecklist = [
    { id: 1, task: 'Institute Email Account Created', dept: 'IT Team', status: 'Done' },
    { id: 2, task: 'Biometric Access Activated', dept: 'Admin Team', status: 'Pending' },
    { id: 3, task: 'IT System Access Provisioned', dept: 'IT Team', status: 'Done' },
    { id: 4, task: 'ID Card Issued', dept: 'Admin Team', status: 'Pending' },
    { id: 5, task: 'Library Card Created', dept: 'Library', status: 'Pending' },
    { id: 6, task: 'Parking Pass Issued', dept: 'Admin Team', status: 'Pending' },
];

const mockMessages: Message[] = [
    { id: 1, from: 'HR', text: 'Welcome, Reshma! Please upload your Educational Certificates at the earliest.', time: '9:15 AM' },
    { id: 2, from: 'Me', text: 'Thank you! I will upload them by today evening.', time: '9:32 AM' },
    { id: 3, from: 'HR', text: 'Great! Also, your PAN card is under review. We will confirm shortly.', time: '10:01 AM' },
];

// ─── Progress Stepper ──────────────────────────────────────────────────────────

const ProgressStepper: React.FC = () => (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {candidateInfo.stages.map((s, i) => (
            <React.Fragment key={s.id}>
                <div className={`flex flex-col items-center min-w-[80px] ${s.active ? 'opacity-100' : s.done ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 transition-all
                        ${s.done ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' :
                            s.active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-100' :
                                'bg-slate-200 text-slate-500'}`}>
                        {s.done ? <CheckCircle className="w-4 h-4" /> : s.id}
                    </div>
                    <span className={`text-[9px] font-bold text-center leading-tight ${s.active ? 'text-indigo-600' : s.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {s.label}
                    </span>
                </div>
                {i < candidateInfo.stages.length - 1 && (
                    <div className={`h-0.5 flex-1 min-w-[16px] mb-5 ${s.done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                )}
            </React.Fragment>
        ))}
    </div>
);

// ─── Documentation Section ─────────────────────────────────────────────────────

const DocumentationSection: React.FC = () => {
    const [docs, setDocs] = useState(requiredDocs);
    const uploaded = docs.filter(d => d.uploaded).length;

    const getDocStatusStyle = (status: string) => {
        if (status === 'Verified') return 'bg-emerald-50 text-emerald-700';
        if (status === 'Pending Review') return 'bg-amber-50 text-amber-700';
        return 'bg-slate-50 text-slate-500';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="font-bold text-slate-900">Required Documents</h3>
                    <p className="text-xs text-slate-500">{uploaded} of {docs.length} submitted</p>
                </div>
                <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(uploaded / docs.length) * 100}%` }} />
                </div>
            </div>
            <div className="space-y-3">
                {docs.map(d => (
                    <div key={d.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className={`p-2 rounded-xl ${d.uploaded ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                            <FileText className={`w-4 h-4 ${d.uploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-800">{d.name}</h4>
                                {d.originalRequired && <span className="text-[9px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full">Original Required</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDocStatusStyle(d.status)}`}>{d.status}</span>
                            {!d.uploaded ? (
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 gap-1"
                                    onClick={() => setDocs(p => p.map(doc => doc.id === d.id ? { ...doc, uploaded: true, status: 'Pending Review' } : doc))}>
                                    <Upload className="w-3 h-3" /> Upload
                                </Button>
                            ) : (
                                <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                                    <Download className="w-3 h-3" /> View
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Orientation Section ───────────────────────────────────────────────────────

const OrientationSection: React.FC = () => {
    const [modules, setModules] = useState(orientationModules);
    const [signOffId, setSignOffId] = useState<number | null>(null);

    const handleComplete = (id: number) => {
        setModules(p => p.map(m => m.id === id ? { ...m, completed: true } : m.id === id + 1 ? { ...m, canComplete: true } : m));
        setSignOffId(null);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Orientation Programs</h3>
            {modules.map(m => (
                <Card key={m.id} className={`border-none shadow-sm transition-all ${m.completed ? 'bg-emerald-50/50' : 'bg-white'}`}>
                    <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.completed ? 'bg-emerald-100' : m.canComplete ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                {m.completed
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    : <BookOpen className={`w-5 h-5 ${m.canComplete ? 'text-indigo-600' : 'text-slate-400'}`} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div>
                                        <h4 className={`font-bold text-sm ${m.completed ? 'text-emerald-700' : 'text-slate-900'}`}>{m.title}</h4>
                                        <p className="text-xs text-slate-500">By {m.owner} · {m.duration}</p>
                                    </div>
                                    {m.completed
                                        ? <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Completed & Signed Off</span>
                                        : m.canComplete
                                            ? <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 gap-1" onClick={() => setSignOffId(m.id)}>
                                                <PenLine className="w-3 h-3" /> Sign Off Completion
                                            </Button>
                                            : <span className="text-xs text-slate-400 font-medium">Locked — complete previous first</span>}
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {m.topics.map((t, i) => (
                                        <span key={i} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${m.completed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Confirm Modal */}
            {signOffId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><PenLine className="w-7 h-7 text-indigo-600" /></div>
                            <h3 className="text-lg font-black text-slate-900">Confirm Completion</h3>
                            <p className="text-sm text-slate-500 mt-1">By signing off, you confirm that you have attended and understood all topics in this orientation.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setSignOffId(null)}>Cancel</Button>
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleComplete(signOffId!)}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Operational Checklist ─────────────────────────────────────────────────────

const ChecklistSection: React.FC = () => {
    const done = operationalChecklist.filter(c => c.status === 'Done').length;
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Operational Checklist</h3>
                <span className="text-sm font-bold text-slate-500">{done}/{operationalChecklist.length} Complete</span>
            </div>
            <div className="space-y-3">
                {operationalChecklist.map(item => (
                    <div key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${item.status === 'Done' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.status === 'Done' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                            {item.status === 'Done' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-bold ${item.status === 'Done' ? 'text-emerald-700 line-through opacity-70' : 'text-slate-800'}`}>{item.task}</p>
                            <p className="text-xs text-slate-500">Assigned to: {item.dept}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Communication Channel ─────────────────────────────────────────────────────

const CommunicationSection: React.FC = () => {
    const [messages, setMessages] = useState(mockMessages);
    const [newMsg, setNewMsg] = useState('');

    const send = () => {
        if (!newMsg.trim()) return;
        setMessages(p => [...p, { id: Date.now(), from: 'Me', text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setNewMsg('');
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-slate-900">HR Communication Channel</h3>
            <Card className="border-none shadow-sm bg-white">
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                    {messages.map(m => (
                        <div key={m.id} className={`flex ${m.from === 'Me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] ${m.from === 'Me' ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'} px-4 py-3`}>
                                <p className="text-sm">{m.text}</p>
                                <p className={`text-[10px] mt-1 ${m.from === 'Me' ? 'text-indigo-200' : 'text-slate-400'}`}>{m.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-slate-100 p-3 flex gap-2">
                    <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type your message…" className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    <Button size="sm" onClick={send} className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 w-9 p-0 rounded-xl">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// ─── Final Sign-Off Section ────────────────────────────────────────────────────

const SignOffSection: React.FC = () => {
    const [signed, setSigned] = useState(false);

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Onboarding Sign-Off</h3>
            {!signed ? (
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <PenLine className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">Complete Your Onboarding</h4>
                            <p className="text-sm text-slate-500 max-w-md mx-auto">By signing off, you confirm that you have completed all onboarding stages, submitted all required documents, attended orientation programs, and are ready to begin your role.</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2">
                            {[
                                { label: 'Documents Submitted', ok: true },
                                { label: 'Orientation Completed', ok: false },
                                { label: 'Operational Checklist', ok: false },
                                { label: 'BGV Clearance', ok: false },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-3">
                                    {item.ok ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-400" />}
                                    <span className={`text-sm font-medium ${item.ok ? 'text-emerald-700' : 'text-amber-700'}`}>{item.label}</span>
                                    <span className={`ml-auto text-xs font-bold ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{item.ok ? 'Ready' : 'In Progress'}</span>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 text-base font-bold rounded-2xl"
                            onClick={() => setSigned(true)}>
                            <PenLine className="w-5 h-5 mr-2" /> Sign Off & Complete Onboarding
                        </Button>
                        <p className="text-center text-xs text-slate-400 mt-3">Note: Complete all stages before final sign-off to activate Probation.</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-none shadow-sm bg-emerald-50">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h4 className="text-xl font-black text-emerald-800 mb-2">Onboarding Complete!</h4>
                        <p className="text-sm text-emerald-600 mb-6">Your onboarding sign-out document has been generated. Your profile will now transition to the Probation stage.</p>
                        <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 gap-2">
                            <Download className="w-4 h-4" /> Download Sign-Out Document
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

// ─── Main Portal Component ─────────────────────────────────────────────────────

const portalTabs = [
    { id: 'docs', label: 'Documents', icon: FileText },
    { id: 'orientation', label: 'Orientation', icon: BookOpen },
    { id: 'checklist', label: 'Checklist', icon: ClipboardList },
    { id: 'comms', label: 'Messages', icon: MessageSquare },
    { id: 'signoff', label: 'Sign-Off', icon: PenLine },
];

const OnboardingProPortal: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('docs');

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 font-sans">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <Home className="w-5 h-5 text-slate-500" />
                        </button>
                        <div className="h-6 w-px bg-slate-200" />
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-black text-slate-900">My Onboarding Portal</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Onboarding Pro · Self-Service</p>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => navigate('/onboarding-pro')}>
                        <UserCheck className="w-4 h-4" /> HR Dashboard
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full px-6 py-6 space-y-6">
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-300/30">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Welcome to Onboarding Pro</p>
                            <h2 className="text-2xl font-black">Hello, {candidateInfo.name}! 👋</h2>
                            <p className="text-indigo-200 text-sm mt-1">{candidateInfo.role} · {candidateInfo.dept}</p>
                            <p className="text-indigo-200 text-xs mt-1">Joining: {candidateInfo.joinDate} · ID: {candidateInfo.employeeId}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center shrink-0">
                            <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Your Buddy</div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-lg font-black mx-auto mb-1">{candidateInfo.buddy.avatar}</div>
                            <div className="font-bold text-sm">{candidateInfo.buddy.name}</div>
                            <div className="text-[10px] text-indigo-200">{candidateInfo.buddy.role}</div>
                            <div className="text-[10px] text-indigo-300 mt-1">{candidateInfo.buddy.daysLeft} days support left</div>
                        </div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Your Onboarding Journey</p>
                        <ProgressStepper />
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-slate-500">Currently at: <strong className="text-indigo-600">Stage 2 – Documentation</strong></span>
                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1"><Clock className="w-3 h-3" /> SLA: 3 of 7 days used</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <div className="flex gap-1 bg-white/60 p-1 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                    {portalTabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex-1 justify-center ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'}`}>
                            <t.icon className="w-3.5 h-3.5" /> {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'docs' && <DocumentationSection />}
                {activeTab === 'orientation' && <OrientationSection />}
                {activeTab === 'checklist' && <ChecklistSection />}
                {activeTab === 'comms' && <CommunicationSection />}
                {activeTab === 'signoff' && <SignOffSection />}
            </div>
        </div>
    );
};

export default OnboardingProPortal;
