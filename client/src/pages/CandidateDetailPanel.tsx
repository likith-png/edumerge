import React, { useState } from 'react';
import {
    X, CheckCircle, ChevronRight,
    FileText, BookOpen, ShieldCheck, ClipboardList,
    PenLine, UserCheck, Briefcase, Send, Upload,
    Eye, Flag, ThumbsUp, CalendarCheck, Mail
} from 'lucide-react';
import { Button } from '../components/ui/button';

export interface Candidate {
    id: number;
    name: string;
    role: string;
    dept: string;
    stage: string;
    stageNum: number;
    status: string;
    mode: string;
    joinDate: string;
    slaDay: number;
    slaDue: number;
    docsPending: number;
    bgvStatus: string;
    buddy: string;
    tags: string[];
    avatar: string;
    avatarColor: string;
}

interface StageInfo {
    num: number;
    label: string;
    icon: React.ElementType;
    color: string;
    actions: { label: string; icon: React.ElementType; variant: 'primary' | 'outline' | 'danger' }[];
    fields: { label: string; value: (c: Candidate) => string }[];
}

const STAGES: StageInfo[] = [
    {
        num: 1, label: 'Offer Accepted', icon: Mail, color: 'indigo',
        actions: [],
        fields: [
            { label: 'Join Date', value: c => c.joinDate },
            { label: 'Mode', value: c => c.mode },
        ]
    },
    {
        num: 2, label: 'Documentation', icon: FileText, color: 'violet',
        actions: [
            { label: 'Upload Documents', icon: Upload, variant: 'primary' },
            { label: 'Review Pending', icon: Eye, variant: 'outline' },
            { label: 'Approve Docs', icon: ThumbsUp, variant: 'outline' },
        ],
        fields: [
            { label: 'Docs Pending', value: c => `${c.docsPending}` },
            { label: 'SLA', value: c => `${c.slaDay}/${c.slaDue} days` },
        ]
    },
    {
        num: 3, label: 'Orientation', icon: BookOpen, color: 'blue',
        actions: [
            { label: 'Assign Program', icon: CalendarCheck, variant: 'primary' },
            { label: 'Mark Attendance', icon: UserCheck, variant: 'outline' },
        ],
        fields: [
            { label: 'Buddy / Mentor', value: c => c.buddy },
        ]
    },
    {
        num: 4, label: 'Operational Checklist', icon: ClipboardList, color: 'cyan',
        actions: [
            { label: 'View Checklist', icon: Eye, variant: 'outline' },
            { label: 'Mark Complete', icon: CheckCircle, variant: 'primary' },
        ],
        fields: [
            { label: 'Department', value: c => c.dept },
        ]
    },
    {
        num: 5, label: 'BGV', icon: ShieldCheck, color: 'amber',
        actions: [
            { label: 'Initiate BGV', icon: ShieldCheck, variant: 'primary' },
            { label: 'View Report', icon: Eye, variant: 'outline' },
            { label: 'Flag Issue', icon: Flag, variant: 'danger' },
        ],
        fields: [
            { label: 'BGV Status', value: c => c.bgvStatus },
        ]
    },
    {
        num: 6, label: 'Onboarding Sign-Off', icon: PenLine, color: 'emerald',
        actions: [
            { label: 'Request Sign-Off', icon: Send, variant: 'primary' },
            { label: 'Approve Sign-Off', icon: ThumbsUp, variant: 'outline' },
        ],
        fields: []
    },
    {
        num: 7, label: 'Probation Activation', icon: Briefcase, color: 'green',
        actions: [
            { label: 'Activate Probation', icon: UserCheck, variant: 'primary' },
        ],
        fields: []
    },
];

const stageStatus = (stageNum: number, candidateStageNum: number, status: string) => {
    if (stageNum < candidateStageNum) return 'completed';
    if (stageNum === candidateStageNum) return status === 'SLA Breach' ? 'breach' : 'active';
    return 'upcoming';
};

const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500', violet: 'bg-violet-500', blue: 'bg-blue-500',
    cyan: 'bg-cyan-500', amber: 'bg-amber-500', emerald: 'bg-emerald-500', green: 'bg-green-600',
};
const lightMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    green: 'bg-green-50 text-green-700 border-green-100',
};

interface Props {
    candidate: Candidate;
    onClose: () => void;
    onUpdate?: (c: Candidate) => void;
}

const CandidateDetailPanel: React.FC<Props> = ({ candidate, onClose, onUpdate }) => {
    const [actionLog, setActionLog] = useState<{ time: string; text: string }[]>([]);
    const [expandedStage, setExpandedStage] = useState<number>(candidate.stageNum);
    const [showProbationModal, setShowProbationModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [probationForm, setProbationForm] = useState({ policy: 'Standard Academic Probation', manager: '' });

    // New Document Verification State
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [docStatuses, setDocStatuses] = useState({ aadhar: false, degree: false, photos: false });
    const [showDocViewer, setShowDocViewer] = useState<string | null>(null);
    const [showLndModal, setShowLndModal] = useState(false);
    const [showChecklistModal, setShowChecklistModal] = useState(false);
    const [showBgvReportModal, setShowBgvReportModal] = useState(false);

    const logAction = (label: string) => {
        const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        setActionLog(prev => [{ time: now, text: label }, ...prev]);
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-6 py-5 text-white flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${candidate.avatarColor} bg-white/20`}>
                                {candidate.avatar}
                            </div>
                            <div>
                                <h2 className="text-lg font-black">{candidate.name}</h2>
                                <p className="text-indigo-200 text-xs font-medium">{candidate.role} · {candidate.dept}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Join: {candidate.joinDate}</span>
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Buddy: {candidate.buddy}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${candidate.status === 'SLA Breach' ? 'bg-rose-400/80' : 'bg-emerald-400/80'}`}>
                                        {candidate.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mini stage progress bar */}
                    <div className="mt-4 flex items-center gap-1">
                        {STAGES.map((s, i) => {
                            const st = stageStatus(s.num, candidate.stageNum, candidate.status);
                            return (
                                <React.Fragment key={s.num}>
                                    <div className={`h-1.5 flex-1 rounded-full transition-all ${st === 'completed' ? 'bg-white' : st === 'active' ? 'bg-white/60' : 'bg-white/20'}`} />
                                    {i < STAGES.length - 1 && <div className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[9px] text-indigo-200 font-bold">Offer Accepted</span>
                        <span className="text-[9px] text-indigo-200 font-bold">Probation Active</span>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">All Onboarding Stages · Click a stage to manage</p>

                    {STAGES.map(stage => {
                        const st = stageStatus(stage.num, candidate.stageNum, candidate.status);
                        const isExpanded = expandedStage === stage.num;
                        const Icon = stage.icon;

                        const rowBg = st === 'active' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-300'
                            : st === 'breach' ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-300'
                                : st === 'completed' ? 'bg-slate-50 border-slate-100'
                                    : 'bg-white border-slate-100 opacity-60';

                        return (
                            <div key={stage.num} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${rowBg}`}>
                                {/* Stage header row */}
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                                    onClick={() => setExpandedStage(isExpanded ? 0 : stage.num)}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${st === 'completed' ? 'bg-emerald-100' : st === 'active' || st === 'breach' ? colorMap[stage.color] + ' text-white' : 'bg-slate-100'}`}>
                                        {st === 'completed'
                                            ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            : <Icon className="w-4 h-4" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${st === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>{stage.label}</span>
                                            {st === 'active' && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${lightMap[stage.color]}`}>Current</span>}
                                            {st === 'breach' && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">SLA Breach</span>}
                                            {st === 'completed' && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Done</span>}
                                        </div>
                                        {/* Fields inline */}
                                        {stage.fields.length > 0 && (
                                            <div className="flex gap-3 mt-0.5">
                                                {stage.fields.map(f => (
                                                    <span key={f.label} className="text-[10px] text-slate-500">
                                                        <span className="font-bold">{f.label}:</span> {f.value(candidate)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[10px] font-bold text-slate-400">Stage {stage.num}/7</span>
                                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                    </div>
                                </button>

                                {/* Expanded actions */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100 bg-white/70 px-4 py-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Actions</p>
                                        <div className="flex flex-wrap gap-2">
                                            {stage.actions.map(action => {
                                                const AIcon = action.icon;
                                                const handleActionClick = () => {
                                                    logAction(`${action.label} for ${candidate.name}`);
                                                    if (!onUpdate) return;
                                                    let updated = { ...candidate };
                                                    if (action.label === 'Review Pending') {
                                                        setShowDocsModal(true);
                                                        return;
                                                    } else if (action.label === 'Assign Program') {
                                                        setShowLndModal(true);
                                                        return;
                                                    } else if (action.label === 'View Checklist') {
                                                        setShowChecklistModal(true);
                                                        return;
                                                    } else if (action.label === 'View Report') {
                                                        setShowBgvReportModal(true);
                                                        return;
                                                    } else if (action.label === 'Activate Probation') {
                                                        setShowProbationModal(true);
                                                        return; // Don't trigger onUpdate yet
                                                    }
                                                    onUpdate(updated);
                                                };
                                                return (
                                                    <button
                                                        key={action.label}
                                                        onClick={handleActionClick}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${action.variant === 'primary'
                                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                            : action.variant === 'danger'
                                                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                                            }`}
                                                    >
                                                        <AIcon className="w-3.5 h-3.5" />
                                                        {action.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Activity Log */}
                    {actionLog.length > 0 && (
                        <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Activity Log</p>
                            <div className="space-y-2">
                                {actionLog.map((entry, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-400 font-bold w-12 flex-shrink-0">{entry.time}</span>
                                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                        <span className="text-slate-700">{entry.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
                    <div className="text-xs text-slate-400 font-medium">
                        SLA: <span className={`font-bold ${candidate.slaDay > candidate.slaDue ? 'text-rose-600' : 'text-emerald-600'}`}>{candidate.slaDay}/{candidate.slaDue}d</span>
                        {' · '} BGV: <span className={`font-bold ${candidate.bgvStatus === 'Flagged' ? 'text-rose-600' : candidate.bgvStatus === 'Cleared' ? 'text-emerald-600' : 'text-amber-600'}`}>{candidate.bgvStatus}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={onClose} className="text-xs h-8">Close</Button>
                </div>
            </div>

            {/* Probation Linking Modal */}
            {showProbationModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Activate Probation</h2>
                                <p className="text-sm text-slate-500">Link candidate to Staff Portfolio</p>
                            </div>
                            <button onClick={() => setShowProbationModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        
                        {successMsg ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Activation Successful!</h3>
                                <p className="text-sm text-slate-600 mb-6">{successMsg}</p>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => {
                                    setShowProbationModal(false);
                                    if (onUpdate) onUpdate({ ...candidate, stageNum: 8, stage: 'Completed', status: 'Completed' });
                                    onClose(); // Auto close the panel as they are fully onboarded
                                }}>Go to Staff Portfolio</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Select Probation Policy</label>
                                    <select 
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                                        value={probationForm.policy}
                                        onChange={e => setProbationForm(p => ({ ...p, policy: e.target.value }))}
                                    >
                                        <option value="Standard Academic Probation (12 Months)">Standard Academic Probation (12 Months)</option>
                                        <option value="Standard Admin Probation (6 Months)">Standard Admin Probation (6 Months)</option>
                                        <option value="Leadership Probation (6 Months)">Leadership Probation (6 Months)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Assign Reporting Manager</label>
                                    <input type="text" placeholder="Search staff database..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        value={probationForm.manager} onChange={e => setProbationForm(p => ({ ...p, manager: e.target.value }))} />
                                </div>
                                
                                <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl text-xs flex items-start gap-2 mt-4">
                                    <Briefcase className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>Upon activation, the profile will be created in the <strong>Staff Portfolio</strong> module, and tracked within the <strong>Probation Dashboard</strong> automatically.</p>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" className="flex-1" onClick={() => setShowProbationModal(false)}>Cancel</Button>
                                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2" 
                                        onClick={() => {
                                            setSuccessMsg(`Profile for ${candidate.name} has been created in Staff Portfolio and added to the selected Probation Policy.`);
                                        }}>
                                        <CheckCircle className="w-4 h-4" /> Finalize Setup
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Document Review Modal */}
            {showDocsModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Document Review</h2>
                                <p className="text-sm text-slate-500">Verify uploaded records from {candidate.name}</p>
                            </div>
                            <button onClick={() => setShowDocsModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            {[
                                { key: 'aadhar', label: 'Aadhar Card / Gov ID' },
                                { key: 'degree', label: 'PG Degree Certificate' },
                                { key: 'photos', label: 'Passport Photos (x4)' }
                            ].map(doc => {
                                const isVerified = docStatuses[doc.key as keyof typeof docStatuses];
                                return (
                                    <div key={doc.key} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-slate-200"><FileText className="w-4 h-4 text-slate-400" /></div>
                                            <span className="text-sm font-semibold text-slate-700">{doc.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setShowDocViewer(doc.label)}
                                                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                                title="View Document"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setDocStatuses(p => ({ ...p, [doc.key]: !isVerified }))}
                                                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {isVerified ? 'Verified' : 'Verify'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <Button 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50" 
                            disabled={!Object.values(docStatuses).every(Boolean)}
                            onClick={() => {
                                setShowDocsModal(false);
                                logAction('All Documents Verified manually');
                                if (onUpdate) {
                                    onUpdate({ ...candidate, stageNum: 3, stage: 'Orientation', status: 'On Track', docsPending: 0 });
                                }
                            }}
                        >
                            Approve All & Complete Stage
                        </Button>
                    </div>
                </div>
            )}

            {/* L&D / Orientation Program Modal */}
            {showLndModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Assign Learning Program</h2>
                                <p className="text-sm text-slate-500">Linked to Learning & Development Module</p>
                            </div>
                            <button onClick={() => setShowLndModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                                <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-3">Available L&D Paths</h4>
                                <div className="space-y-2">
                                    {['Teaching Excellence Framework', 'Institutional Compliance 101', 'Advanced Pedagogy', 'Security & Ethics'].map(prog => (
                                        <div key={prog} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100 group cursor-pointer hover:bg-indigo-600 hover:text-white transition-all">
                                            <BookOpen className="w-4 h-4 text-indigo-500 group-hover:text-white" />
                                            <span className="text-sm font-bold">{prog}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button className="w-full bg-indigo-600" onClick={() => {
                                setShowLndModal(false);
                                logAction('L&D Program Assigned');
                                if (onUpdate) onUpdate({ ...candidate, tags: [...candidate.tags, 'L&D Assigned'] });
                            }}>Confirm Selection</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Operational Checklist Modal */}
            {showChecklistModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-slate-900">Operational Checklist</h2>
                            <button onClick={() => setShowChecklistModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-4 mb-6">
                            {['ID Card Issued', 'IT Assets Allocated', 'Workstation Setup', 'Biometric Enrollment', 'Bank Account Linked'].map(item => (
                                <div key={item} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white"></div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full bg-indigo-600" onClick={() => setShowChecklistModal(false)}>Save Progress</Button>
                    </div>
                </div>
            )}

            {/* BGV Report Modal */}
            {showBgvReportModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-slate-900">BGV Report Summary</h2>
                            <button onClick={() => setShowBgvReportModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-slate-900">Verification Cleared</h3>
                                <p className="text-sm text-slate-500">Report generated by Befise API on 10/03/2026</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase">Education</div>
                                    <div className="text-xs font-bold text-emerald-600">Verified</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase">Criminal</div>
                                    <div className="text-xs font-bold text-emerald-600">No Records</div>
                                </div>
                            </div>
                            <Button className="w-full bg-slate-900" onClick={() => setShowBgvReportModal(false)}>Download Full PDF</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Doc Viewer Mock Modal */}
            {showDocViewer && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-8">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
                            <h3 className="font-bold">{showDocViewer} - Document Preview</h3>
                            <button onClick={() => setShowDocViewer(null)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex-1 bg-slate-100 flex items-center justify-center p-12">
                            <div className="bg-white p-12 shadow-inner border border-slate-200 aspect-[1/1.4] h-full flex flex-col items-center justify-center text-center">
                                <FileText className="w-24 h-24 text-slate-200 mb-6" />
                                <h4 className="text-xl font-black text-slate-800 mb-2">Authenticated Copy</h4>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">This document has been retrieved from the candidate's self-onboarding portal.</p>
                                <div className="mt-12 py-3 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Electronic Signature</div>
                                    <div className="font-serif italic text-xl text-indigo-900">{candidate.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateDetailPanel;
