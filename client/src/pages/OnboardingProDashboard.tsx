import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    Home, Users, FileText, ShieldCheck, AlertTriangle,
    CheckCircle, Clock, Plus, Search,
    Bell, BookOpen, Settings, BarChart2,
    ChevronDown, ChevronRight, Zap,
    UserPlus, XCircle, Eye
} from 'lucide-react';
import CandidateDetailPanel from './CandidateDetailPanel';
import type { Candidate } from './CandidateDetailPanel';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_CANDIDATES: Candidate[] = [
    {
        id: 1, name: 'Ms. Reshma Binu Prasad', role: 'Assistant Professor', dept: 'Computer Science',
        stage: 'Documentation', stageNum: 2, status: 'In Progress', mode: 'Self',
        joinDate: '2026-03-15', slaDay: 3, slaDue: 7, docsPending: 2,
        bgvStatus: 'Pending', buddy: 'Dr. Ramesh K.', tags: ['Pending Docs'],
        avatar: 'RB', avatarColor: 'bg-violet-100 text-violet-700'
    },
    {
        id: 2, name: 'Ms. Sanchaiyata Majumdar', role: 'Lab Instructor', dept: 'Physics',
        stage: 'Orientation', stageNum: 3, status: 'On Track', mode: 'Self',
        joinDate: '2026-03-10', slaDay: 8, slaDue: 14, docsPending: 0,
        bgvStatus: 'In Progress', buddy: 'Dr. Kavitha M.', tags: [],
        avatar: 'SM', avatarColor: 'bg-emerald-100 text-emerald-700'
    },
    {
        id: 3, name: 'Dr. R Sedhunivas', role: 'Admin Officer', dept: 'Administration',
        stage: 'BGV', stageNum: 5, status: 'SLA Breach', mode: 'Manual',
        joinDate: '2026-02-28', slaDay: 15, slaDue: 14, docsPending: 0,
        bgvStatus: 'Flagged', buddy: 'Sunita R.', tags: ['BGV Issue', 'Onboarding Delay'],
        avatar: 'RS', avatarColor: 'bg-rose-100 text-rose-700'
    },
    {
        id: 4, name: 'Dr. Ranjita Saikia', role: 'Lecturer', dept: 'Mathematics',
        stage: 'Operational Checklist', stageNum: 4, status: 'On Track', mode: 'Self',
        joinDate: '2026-03-12', slaDay: 5, slaDue: 7, docsPending: 0,
        bgvStatus: 'Cleared', buddy: 'Prof. Anand S.', tags: [],
        avatar: 'RS', avatarColor: 'bg-blue-100 text-blue-700'
    },
    {
        id: 5, name: 'Mr. Manjit Singh', role: 'Research Associate', dept: 'Chemistry',
        stage: 'Sign-Off', stageNum: 6, status: 'On Track', mode: 'Self',
        joinDate: '2026-03-01', slaDay: 12, slaDue: 14, docsPending: 0,
        bgvStatus: 'Cleared', buddy: 'Dr. Meena L.', tags: [],
        avatar: 'MS', avatarColor: 'bg-amber-100 text-amber-700'
    },
];

const funnelStages = [
    { label: 'Offer Accepted', count: 8, color: 'bg-indigo-500' },
    { label: 'Documentation', count: 2, color: 'bg-violet-500' },
    { label: 'Orientation', count: 1, color: 'bg-blue-500' },
    { label: 'Op. Checklist', count: 1, color: 'bg-cyan-500' },
    { label: 'BGV', count: 1, color: 'bg-amber-500' },
    { label: 'Sign-Off', count: 1, color: 'bg-emerald-500' },
    { label: 'Probation', count: 2, color: 'bg-green-600' },
];

const orientationPrograms = [
    {
        id: 1, name: 'HR Orientation', owner: 'HR Team', duration: '2 Days',
        topics: ['Organization Introduction', 'HR Policy Overview', 'Code of Conduct', 'Leave Policies'],
        candidates: 3, status: 'Active'
    },
    {
        id: 2, name: 'Department Orientation', owner: 'HOD', duration: '3 Days',
        topics: ['Department Goals', 'Team Introduction', 'Tools & Systems', 'Academic Calendar'],
        candidates: 2, status: 'Active'
    },
    {
        id: 3, name: 'Trainer Orientation', owner: 'Training Team', duration: '1 Day',
        topics: ['LMS Access', 'Training Modules', 'Certification Paths'],
        candidates: 1, status: 'Active'
    },
];

const bgvCandidates = [
    { id: 1, name: 'Ms. Reshma Binu Prasad', type: 'Manual', status: 'Pending', checks: ['Education', 'Previous Employment', 'Police Clearance'], submitted: '2026-03-05' },
    { id: 2, name: 'Ms. Sanchaiyata Majumdar', type: 'API (Befise)', status: 'In Progress', checks: ['Education', 'Criminal Record', 'Address'], submitted: '2026-03-03' },
    { id: 3, name: 'Dr. R Sedhunivas', type: 'Manual', status: 'Flagged', checks: ['Education', 'Previous Employment'], submitted: '2026-02-28' },
    { id: 4, name: 'Dr. Ranjita Saikia', type: 'API (Befise)', status: 'Cleared', checks: ['Education', 'Criminal Record', 'Address', 'Previous Employment'], submitted: '2026-03-01' },
];

const slaData = [
    { name: 'Ms. Reshma Binu Prasad', stage: 'Documentation', elapsed: 3, sla: 7, breach: false },
    { name: 'Ms. Sanchaiyata Majumdar', stage: 'Orientation', elapsed: 8, sla: 14, breach: false },
    { name: 'Dr. R Sedhunivas', stage: 'BGV', elapsed: 15, sla: 14, breach: true },
    { name: 'Dr. Ranjita Saikia', stage: 'Op. Checklist', elapsed: 5, sla: 7, breach: false },
    { name: 'Mr. Manjit Singh', stage: 'Sign-Off', elapsed: 12, sla: 14, breach: false },
];


// ─── Sub-components ───────────────────────────────────────────────────────────

const StageChip: React.FC<{ stage: string }> = ({ stage }) => {
    const colors: Record<string, string> = {
        'Offer Accepted': 'bg-indigo-50 text-indigo-700',
        'Documentation': 'bg-violet-50 text-violet-700',
        'Orientation': 'bg-blue-50 text-blue-700',
        'Operational Checklist': 'bg-cyan-50 text-cyan-700',
        'BGV': 'bg-amber-50 text-amber-700',
        'Sign-Off': 'bg-emerald-50 text-emerald-700',
        'Probation': 'bg-green-50 text-green-700',
    };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors[stage] || 'bg-slate-50 text-slate-600'}`}>{stage}</span>;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const map: Record<string, string> = {
        'On Track': 'bg-emerald-100 text-emerald-700',
        'In Progress': 'bg-indigo-100 text-indigo-700',
        'SLA Breach': 'bg-rose-100 text-rose-700',
        'Pending': 'bg-amber-100 text-amber-700',
        'Cleared': 'bg-emerald-100 text-emerald-700',
        'Flagged': 'bg-rose-100 text-rose-700',
        'Active': 'bg-blue-100 text-blue-700',
    };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const OverviewTab: React.FC<{ candidates: Candidate[]; onInitiate: () => void; onSelectCandidate: (c: Candidate) => void }> = ({ candidates, onInitiate, onSelectCandidate }) => (
    <div className="space-y-6">
        {/* Funnel */}
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-500" /> Onboarding Funnel
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-3 h-32">
                    {funnelStages.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                            <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">{s.count}</span>
                            <div className={`w-full rounded-t-lg ${s.color} transition-all group-hover:opacity-90`} style={{ height: `${(s.count / 8) * 100}%`, minHeight: '12px' }} />
                            <span className="text-[9px] font-bold text-slate-500 text-center leading-tight">{s.label}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Candidate Table */}
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" /> Active Candidates ({candidates.length})
                    </CardTitle>
                    <Button size="sm" onClick={onInitiate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5">
                        <Plus className="w-3 h-3" /> Initiate Onboarding
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                    {candidates.map(c => (
                        <div key={c.id}
                            onClick={() => onSelectCandidate(c)}
                            className="flex items-center gap-4 p-4 hover:bg-indigo-50/60 cursor-pointer transition-colors group">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${c.avatarColor}`}>{c.avatar}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">{c.name}</span>
                                    {c.tags.map(t => <span key={t} className="text-[9px] font-bold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">{t}</span>)}
                                </div>
                                <p className="text-xs text-slate-500">{c.role} · {c.dept} · Buddy: {c.buddy}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <StageChip stage={c.stage} />
                                <StatusBadge status={c.status} />
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-700">{c.slaDay}/{c.slaDue}d</div>
                                    <div className="text-[10px] text-slate-400">SLA</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

const OrientationTab: React.FC = () => {
    const [expanded, setExpanded] = useState<number | null>(null);
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Orientation Programs</h3>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1"><Plus className="w-3 h-3" /> Add Program</Button>
            </div>
            {orientationPrograms.map(p => (
                <Card key={p.id} className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                    <div className="p-4 cursor-pointer flex items-center justify-between" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg"><BookOpen className="w-4 h-4 text-indigo-600" /></div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                                <p className="text-xs text-slate-500">Owner: {p.owner} · Duration: {p.duration} · {p.candidates} candidates assigned</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={p.status} />
                            {expanded === p.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        </div>
                    </div>
                    {expanded === p.id && (
                        <CardContent className="pt-0 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 mt-4">Topics Covered</p>
                            <div className="grid grid-cols-2 gap-2">
                                {p.topics.map((t, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                        <span className="text-xs text-slate-700">{t}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button size="sm" variant="outline" className="text-xs h-7">Edit Program</Button>
                                <Button size="sm" variant="outline" className="text-xs h-7">Assign Candidates</Button>
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

const BGVTab: React.FC = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
            {[{ label: 'Cleared', count: 1, color: 'text-emerald-600 bg-emerald-50' }, { label: 'In Progress', count: 2, color: 'text-amber-600 bg-amber-50' }, { label: 'Flagged', count: 1, color: 'text-rose-600 bg-rose-50' }].map(s => (
                <Card key={s.label} className="border-none shadow-sm">
                    <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-black ${s.color.split(' ')[0]} mb-1`}>{s.count}</div>
                        <p className="text-xs font-bold text-slate-500">{s.label}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-500" /> Background Verification Tracker</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                    {bgvCandidates.map(c => (
                        <div key={c.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/80 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">{c.name.charAt(0)}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-slate-900">{c.name}</span>
                                    <Badge className={`text-[10px] border-none ${c.type.includes('API') ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>{c.type}</Badge>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {c.checks.map(ch => <span key={ch} className="text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-600">{ch}</span>)}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Submitted: {c.submitted}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <StatusBadge status={c.status} />
                                {c.status === 'Pending' && <Button size="sm" className="text-[10px] h-6 px-2 bg-indigo-600 hover:bg-indigo-700 text-white">Initiate</Button>}
                                {c.status === 'Flagged' && <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 text-rose-600 border-rose-200">Review</Button>}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

const SLATab: React.FC = () => (
    <div className="space-y-4">
        <Card className="border-none shadow-sm bg-rose-50 border-rose-100">
            <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                    <p className="font-bold text-rose-800 text-sm">1 SLA Breach Detected</p>
                    <p className="text-xs text-rose-600">Dr. R Sedhunivas has exceeded the 14-day BGV stage SLA by 1 day. Immediate action required.</p>
                </div>
                <Button size="sm" className="ml-auto bg-rose-600 hover:bg-rose-700 text-white text-xs shrink-0">Notify HR</Button>
            </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> SLA Progress Tracker</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {slaData.map((s, i) => {
                    const pct = Math.min((s.elapsed / s.sla) * 100, 100);
                    return (
                        <div key={i}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-bold text-slate-800">{s.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">{s.stage}</span>
                                    <span className={`text-xs font-bold ${s.breach ? 'text-rose-600' : 'text-emerald-600'}`}>{s.elapsed}d / {s.sla}d</span>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${s.breach ? 'bg-rose-500' : pct > 70 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    </div>
);

const ConfigTab: React.FC = () => {
    const [wfStages, setWfStages] = useState([
        'Offer Accepted', 'Details & Documentation', 'Orientation Program', 'Operational Checklist', 'Background Verification', 'Onboarding Sign-Off', 'Probation Activation'
    ]);
    const [slaValues, setSlaValues] = useState({ documentation: 7, orientation: 14, checklist: 5, bgv: 14, signoff: 3 });
    const [docSettings, setDocSettings] = useState({ collectOriginals: true, storeOriginals: true, trackReturn: false });
    const [bgvEnabled, setBgvEnabled] = useState(true);
    const [bgvMode, setBgvMode] = useState<'manual' | 'api'>('api');

    return (
        <div className="space-y-6">
            {/* Workflow Engine */}
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-500" /> Custom Workflow Engine</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                        {wfStages.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 group">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0">{i + 1}</div>
                                <span className="flex-1 text-sm font-semibold text-slate-800">{s}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {i > 0 && <button className="text-slate-400 hover:text-indigo-600 text-xs px-1" onClick={() => { const a = [...wfStages];[a[i - 1], a[i]] = [a[i], a[i - 1]]; setWfStages(a); }}>↑</button>}
                                    {i < wfStages.length - 1 && <button className="text-slate-400 hover:text-indigo-600 text-xs px-1" onClick={() => { const a = [...wfStages];[a[i], a[i + 1]] = [a[i + 1], a[i]]; setWfStages(a); }}>↓</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SLA Config */}
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> SLA Configuration (Days)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(slaValues).map(([key, val]) => (
                        <div key={key}>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize block mb-1">{key}</label>
                            <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={val} onChange={e => setSlaValues(p => ({ ...p, [key]: +e.target.value }))} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Document Config */}
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Document Collection Policy</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    {[
                        { label: 'Collect Original Documents', key: 'collectOriginals' },
                        { label: 'Store Originals in Organization', key: 'storeOriginals' },
                        { label: 'Track Document Return', key: 'trackReturn' },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                            <button onClick={() => setDocSettings(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                                className={`w-11 h-6 rounded-full transition-colors relative ${docSettings[item.key as keyof typeof docSettings] ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform ${docSettings[item.key as keyof typeof docSettings] ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* BGV Config */}
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Background Verification Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-semibold text-slate-700">Enable Background Verification</span>
                        <button onClick={() => setBgvEnabled(p => !p)} className={`w-11 h-6 rounded-full transition-colors relative ${bgvEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform ${bgvEnabled ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>
                    {bgvEnabled && (
                        <div className="flex gap-2">
                            <button onClick={() => setBgvMode('manual')} className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${bgvMode === 'manual' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Manual</button>
                            <button onClick={() => setBgvMode('api')} className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${bgvMode === 'api' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>API (Befise)</button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Configuration</Button>
            </div>
        </div>
    );
};

// ─── Initiate Onboarding Modal ────────────────────────────────────────────────

const AVATAR_COLORS = [
    'bg-violet-100 text-violet-700', 'bg-emerald-100 text-emerald-700',
    'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700', 'bg-cyan-100 text-cyan-700',
];

const InitiateModal: React.FC<{ onClose: () => void; onAdd: (c: Candidate) => void }> = ({ onClose, onAdd }) => {
    const [form, setForm] = useState({ name: '', email: '', dept: '', role: '', joinDate: '', mode: 'self', buddy: '' });
    const [error, setError] = useState('');

    const handleCreate = () => {
        if (!form.name.trim() || !form.dept.trim() || !form.role.trim()) {
            setError('Name, Department and Role are required.');
            return;
        }
        const initials = form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const newCandidate: Candidate = {
            id: Date.now(),
            name: form.name.trim(),
            role: form.role.trim(),
            dept: form.dept.trim(),
            stage: 'Offer Accepted',
            stageNum: 1,
            status: 'On Track',
            mode: form.mode === 'self' ? 'Self' : 'Manual',
            joinDate: form.joinDate || 'TBD',
            slaDay: 0,
            slaDue: 7,
            docsPending: 0,
            bgvStatus: 'Pending',
            buddy: form.buddy.trim() || 'Unassigned',
            tags: [],
            avatar: initials,
            avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        };
        onAdd(newCandidate);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Initiate Onboarding</h2>
                        <p className="text-sm text-slate-500">Create a new onboarding profile</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><XCircle className="w-5 h-5 text-slate-400" /></button>
                </div>
                {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mb-4 font-bold">{error}</p>}
                <div className="space-y-4">
                    {[
                        { label: 'Candidate Name *', key: 'name', type: 'text', placeholder: 'Full Name' },
                        { label: 'Email Address', key: 'email', type: 'email', placeholder: 'email@institution.edu' },
                        { label: 'Department *', key: 'dept', type: 'text', placeholder: 'e.g. Computer Science' },
                        { label: 'Role / Designation *', key: 'role', type: 'text', placeholder: 'e.g. Assistant Professor' },
                        { label: 'Joining Date', key: 'joinDate', type: 'date', placeholder: '' },
                        { label: 'Buddy / Mentor', key: 'buddy', type: 'text', placeholder: 'Search employee...' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={form[f.key as keyof typeof form]} onChange={e => { setError(''); setForm(p => ({ ...p, [f.key]: e.target.value })); }} />
                        </div>
                    ))}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Onboarding Mode</label>
                        <div className="flex gap-2">
                            {['self', 'manual'].map(m => (
                                <button key={m} onClick={() => setForm(p => ({ ...p, mode: m }))}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors capitalize ${form.mode === m ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{m}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreate}>
                        <UserPlus className="w-4 h-4 mr-2" /> Create Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'orientation', label: 'Orientation', icon: BookOpen },
    { id: 'bgv', label: 'BGV', icon: ShieldCheck },
    { id: 'sla', label: 'SLA Tracking', icon: Clock },
    { id: 'config', label: 'Configuration', icon: Settings },
];

const OnboardingProDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [showInitiate, setShowInitiate] = useState(false);
    const [search, setSearch] = useState('');
    const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    const filtered = candidates.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dept.toLowerCase().includes(search.toLowerCase())
    );

    const slaBreaches = candidates.filter(c => c.status === 'SLA Breach').length;
    const pendingDocs = candidates.reduce((acc, c) => acc + c.docsPending, 0);
    const bgvPending = bgvCandidates.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <Home className="w-5 h-5 text-slate-500" />
                        </button>
                        <div className="h-6 w-px bg-slate-200" />
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Onboarding Pro</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HR Admin · Command Center</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates…"
                                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52 bg-white" />
                        </div>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                            <Bell className="w-4 h-4" /> Alerts <Badge className="bg-rose-500 text-white text-[9px] px-1 ml-1">{slaBreaches}</Badge>
                        </Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs" onClick={() => navigate('/onboarding-pro/portal')}>
                            <Eye className="w-4 h-4" /> Candidate Portal
                        </Button>
                    </div>
                </div>
                {/* Tabs */}
                <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                            <t.icon className="w-3.5 h-3.5" /> {t.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Stats */}
            <div className="max-w-7xl mx-auto w-full px-6 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Active Onboardings', value: candidates.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'SLA Breaches', value: slaBreaches, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
                        { label: 'Documents Pending', value: pendingDocs, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'BGV In Progress', value: bgvPending, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map(s => (
                        <Card key={s.label} className="border-none shadow-sm bg-white/80 backdrop-blur-xl hover:shadow-md transition-all">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 ${s.bg} rounded-xl`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
                                </div>
                                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Active Tab Content */}
                {activeTab === 'overview' && <OverviewTab candidates={filtered} onInitiate={() => setShowInitiate(true)} onSelectCandidate={setSelectedCandidate} />}
                {activeTab === 'orientation' && <OrientationTab />}
                {activeTab === 'bgv' && <BGVTab />}
                {activeTab === 'sla' && <SLATab />}
                {activeTab === 'config' && <ConfigTab />}
            </div>

            {showInitiate && <InitiateModal onClose={() => setShowInitiate(false)} onAdd={c => setCandidates(prev => [...prev, c])} />}
            {selectedCandidate && <CandidateDetailPanel candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
        </div>
    );
};

export default OnboardingProDashboard;
