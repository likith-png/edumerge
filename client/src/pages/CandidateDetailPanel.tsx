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
        actions: [
            { label: 'Send Welcome Email', icon: Send, variant: 'primary' },
            { label: 'View Offer Letter', icon: Eye, variant: 'outline' },
        ],
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
}

const CandidateDetailPanel: React.FC<Props> = ({ candidate, onClose }) => {
    const [actionLog, setActionLog] = useState<{ time: string; text: string }[]>([]);
    const [expandedStage, setExpandedStage] = useState<number>(candidate.stageNum);

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
                                                return (
                                                    <button
                                                        key={action.label}
                                                        onClick={() => logAction(`${action.label} for ${candidate.name}`)}
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
        </div>
    );
};

export default CandidateDetailPanel;
