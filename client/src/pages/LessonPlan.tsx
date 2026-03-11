import React, { useState } from 'react';
import {
    BookOpen, Home, ChevronRight, AlertTriangle, CheckCircle,
    Clock, Users, Calendar, TrendingUp, Eye, Plus, Search,
    BarChart2, Target, FileText, Activity, Star, Bell, X,
    CalendarClock, AlertOctagon, CheckCircle2, Edit3, MessageSquare, Send
} from 'lucide-react';
import { Settings2 as Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

// ─── Types ───────────────────────────────────────────────────────────────────

type BacklogStatus = 'Healthy' | 'Warning' | 'Backlog Detected' | 'Critical Risk';

interface Teacher {
    id: number; name: string; subject: string; grade: string;
    planned: number; completed: number; rescheduled: number;
    status: BacklogStatus; lastUpdated: string;
}

interface DailyLesson {
    id: number; date: string; topic: string; methodology: string;
    objective: string; homework: string; status: 'Completed' | 'Pending' | 'Rescheduled';
    teacherName: string; subject: string; grade: string;
}

interface Observation {
    id: number; teacher: string; subject: string; observer: string;
    role: string; date: string; methodology: number; engagement: number;
    clarity: number; management: number; outcomes: number;
    improvements: string; status: 'Scheduled' | 'Completed' | 'Pending';
}

interface FreeSlot {
    id: number; day: string; period: string; time: string;
    teacherFree: boolean; classFree: boolean;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const teachers: Teacher[] = [
    { id: 1, name: 'Ms. Reshma Binu Prasad', subject: 'Mathematics', grade: 'Grade 10 – Sec A', planned: 80, completed: 74, rescheduled: 2, status: 'Healthy', lastUpdated: '4 Mar 2026' },
    { id: 2, name: 'Ms. Sanchaiyata Majumdar', subject: 'Physics', grade: 'Grade 11 – Sec B', planned: 72, completed: 59, rescheduled: 3, status: 'Warning', lastUpdated: '3 Mar 2026' },
    { id: 3, name: 'Dr. R Sedhunivas', subject: 'English Literature', grade: 'Grade 9 – Sec C', planned: 60, completed: 43, rescheduled: 0, status: 'Backlog Detected', lastUpdated: '2 Mar 2026' },
    { id: 4, name: 'Dr. Ranjita Saikia', subject: 'Chemistry', grade: 'Grade 12 – Sec A', planned: 88, completed: 62, rescheduled: 5, status: 'Critical Risk', lastUpdated: '1 Mar 2026' },
    { id: 5, name: 'Mr. Manjit Singh', subject: 'Biology', grade: 'Grade 10 – Sec B', planned: 70, completed: 65, rescheduled: 1, status: 'Healthy', lastUpdated: '4 Mar 2026' },
    { id: 6, name: 'Mr. Edwin Vimal A', subject: 'History', grade: 'Grade 8 – Sec A', planned: 55, completed: 48, rescheduled: 2, status: 'Warning', lastUpdated: '4 Mar 2026' },
];

const dailyLessons: DailyLesson[] = [
    { id: 1, date: '2026-03-05', topic: 'Quadratic Equations – Discriminant', methodology: 'Lecture + Practice', objective: 'Identify roots using discriminant', homework: 'Ex 4.3: Q1–Q10', status: 'Completed', teacherName: 'Ms. Reshma Binu Prasad', subject: 'Mathematics', grade: 'Grade 10 – Sec A' },
    { id: 2, date: '2026-03-04', topic: 'Laws of Motion – Newton\'s 3rd Law', methodology: 'Demo + Group Discussion', objective: 'Explain action-reaction pairs', homework: 'Lab report submission', status: 'Completed', teacherName: 'Ms. Sanchaiyata Majumdar', subject: 'Physics', grade: 'Grade 11 – Sec B' },
    { id: 3, date: '2026-03-03', topic: 'Shakespeare – Sonnet Analysis', methodology: 'Critical Reading', objective: 'Identify literary devices', homework: 'Write analysis para', status: 'Rescheduled', teacherName: 'Dr. R Sedhunivas', subject: 'English Literature', grade: 'Grade 9 – Sec C' },
    { id: 4, date: '2026-03-06', topic: 'Organic Chemistry – Alkenes', methodology: 'Flipped Classroom', objective: 'Name and draw alkene structures', homework: 'Complete NCERT Ex 13.1', status: 'Pending', teacherName: 'Dr. Ranjita Saikia', subject: 'Chemistry', grade: 'Grade 12 – Sec A' },
    { id: 5, date: '2026-03-05', topic: 'Cell Division – Mitosis Stages', methodology: 'Video + Diagram', objective: 'Label stages of mitosis', homework: 'Draw prophase diagram', status: 'Completed', teacherName: 'Mr. Manjit Singh', subject: 'Biology', grade: 'Grade 10 – Sec B' },
    { id: 6, date: '2026-03-04', topic: 'World War I – Causes', methodology: 'Socratic Discussion', objective: 'Analyze MAIN causes', homework: 'Read Chapter 7 summary', status: 'Completed', teacherName: 'Mr. Edwin Vimal A', subject: 'History', grade: 'Grade 8 – Sec A' },
];

const observations: Observation[] = [
    { id: 1, teacher: 'Ms. Reshma Binu Prasad', subject: 'Mathematics', observer: 'Mr. Edwin Vimal A', role: 'HOD – Sciences', date: '2026-02-28', methodology: 4, engagement: 5, clarity: 4, management: 5, outcomes: 4, improvements: 'Incorporate more visual aids for complex proofs', status: 'Completed' },
    { id: 2, teacher: 'Ms. Sanchaiyata Majumdar', subject: 'Physics', observer: 'Ms. Reshma Binu Prasad', role: 'Academic Coordinator', date: '2026-03-08', methodology: 3, engagement: 3, clarity: 3, management: 4, outcomes: 3, improvements: 'Improve student questioning techniques; pace the lab demos slower', status: 'Scheduled' },
    { id: 3, teacher: 'Dr. R Sedhunivas', subject: 'English Literature', observer: 'Ms. Sanchaiyata Majumdar', role: 'Principal', date: '2026-02-20', methodology: 3, engagement: 2, clarity: 3, management: 3, outcomes: 3, improvements: 'Strengthen lesson structure; align to learning objectives explicitly', status: 'Completed' },
    { id: 4, teacher: 'Dr. Ranjita Saikia', subject: 'Chemistry', observer: 'Mr. Edwin Vimal A', role: 'HOD – Sciences', date: '2026-03-12', methodology: 0, engagement: 0, clarity: 0, management: 0, outcomes: 0, improvements: '', status: 'Pending' },
    { id: 5, teacher: 'Mr. Manjit Singh', subject: 'Biology', observer: 'Ms. Reshma Binu Prasad', role: 'Academic Coordinator', date: '2026-03-01', methodology: 5, engagement: 4, clarity: 5, management: 4, outcomes: 5, improvements: 'Excellent delivery – consider peer-mentoring role', status: 'Completed' },
];

const freeSlots: FreeSlot[] = [
    { id: 1, day: 'Monday', period: 'Period 3', time: '10:00–10:45', teacherFree: true, classFree: true },
    { id: 2, day: 'Tuesday', period: 'Period 6', time: '13:00–13:45', teacherFree: true, classFree: false },
    { id: 3, day: 'Wednesday', period: 'Period 1', time: '08:00–08:45', teacherFree: false, classFree: true },
    { id: 4, day: 'Thursday', period: 'Period 4', time: '11:00–11:45', teacherFree: true, classFree: true },
    { id: 5, day: 'Friday', period: 'Period 7', time: '14:00–14:45', teacherFree: true, classFree: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusColors = (status: BacklogStatus) => {
    switch (status) {
        case 'Healthy': return { badge: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500', dot: 'bg-emerald-500' };
        case 'Warning': return { badge: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500', dot: 'bg-amber-500' };
        case 'Backlog Detected': return { badge: 'bg-orange-50 text-orange-700', bar: 'bg-orange-500', dot: 'bg-orange-500 animate-pulse' };
        case 'Critical Risk': return { badge: 'bg-red-50 text-red-700', bar: 'bg-red-500', dot: 'bg-red-500 animate-pulse' };
    }
};

const getLessonStatusColors = (status: DailyLesson['status']) => {
    switch (status) {
        case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Pending': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Rescheduled': return 'bg-amber-50 text-amber-700 border-amber-100';
    }
};

const pct = (t: Teacher) => Math.round((t.completed / t.planned) * 100);

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Persona = 'employee' | 'manager' | 'hr';

const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart2, roles: ['employee', 'manager', 'hr'] },
    { id: 'lesson-planning', label: 'Lesson Planning', icon: FileText, roles: ['employee', 'manager', 'hr'] },
    { id: 'curriculum', label: 'Curriculum Tracking', icon: TrendingUp, roles: ['manager', 'hr'] },
    { id: 'backlog', label: 'Backlog Monitoring', icon: AlertTriangle, roles: ['manager', 'hr'] },
    { id: 'recovery', label: 'Backlog Recovery', icon: Calendar, roles: ['employee', 'manager', 'hr'] },
    { id: 'observation', label: 'Classroom Observation', icon: Eye, roles: ['manager', 'hr'] },
    { id: 'performance', label: 'Teacher Performance', icon: Star, roles: ['manager', 'hr'] },
    { id: 'configuration', label: 'Configuration', icon: Settings, roles: ['hr'] },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; color: string; sub?: string }> =
    ({ label, value, icon: Icon, color, sub }) => (
        <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-${color}-50`}>
                    <Icon className={`h-5 w-5 text-${color}-600`} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className="text-2xl font-black text-slate-900">{value}</p>
                    {sub && <p className="text-xs text-slate-400 font-medium">{sub}</p>}
                </div>
            </CardContent>
        </Card>
    );

const ProgressBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
);

// ─── Tab Views ────────────────────────────────────────────────────────────────

const OverviewTab: React.FC = () => {
    const totalPlanned = teachers.reduce((s, t) => s + t.planned, 0);
    const totalCompleted = teachers.reduce((s, t) => s + t.completed, 0);
    const avgCoverage = Math.round((totalCompleted / totalPlanned) * 100);
    const criticalCount = teachers.filter(t => t.status === 'Critical Risk').length;
    const backlogCount = teachers.filter(t => t.status === 'Backlog Detected' || t.status === 'Critical Risk').length;

    return (
        <div className="space-y-8">
            {/* Employee Personas */}
            <div>
                <p className="text-sm font-black text-slate-800 mb-4">Module Personas 👤</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-indigo-100 shadow-sm bg-indigo-50/30">
                        <CardContent className="p-5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                                <Users className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 mb-2">Teacher / Educator</h3>
                            <ul className="text-xs text-slate-600 space-y-2 mb-4">
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-indigo-400 mt-0.5 flex-shrink-0" /> Creates and publishes daily lesson plans</li>
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-indigo-400 mt-0.5 flex-shrink-0" /> Tracks self-coverage & manages backlog</li>
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-indigo-400 mt-0.5 flex-shrink-0" /> Opts in for recovery scheduling in free slots</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="border border-emerald-100 shadow-sm bg-emerald-50/30">
                        <CardContent className="p-5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                <Target className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 mb-2">Head of Department (HOD)</h3>
                            <ul className="text-xs text-slate-600 space-y-2 mb-4">
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" /> Approves & monitors annual curriculum plans</li>
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" /> Conducts classroom observations</li>
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" /> Manages department backlog & interventions</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="border border-blue-100 shadow-sm bg-blue-50/30">
                        <CardContent className="p-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                <BarChart2 className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 mb-2">Principal / Academic Head</h3>
                            <ul className="text-xs text-slate-600 space-y-2 mb-4">
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" /> Views institution-wide curriculum coverage</li>
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" /> Reviews teacher performance & appraisals</li>
                                <li className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" /> Identifies critical risks in academic delivery</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Avg Coverage" value={`${avgCoverage}%`} icon={TrendingUp} color="indigo" sub={`${totalCompleted}/${totalPlanned} lessons`} />
                <StatCard label="Total Teachers" value={teachers.length} icon={Users} color="blue" sub="Tracked this term" />
                <StatCard label="Backlog Alerts" value={backlogCount} icon={AlertTriangle} color="orange" sub="Action required" />
                <StatCard label="Critical Risk" value={criticalCount} icon={Bell} color="red" sub="Immediate review" />
            </div>

            {/* Teacher summary table */}
            <Card className="border-none shadow-sm">
                <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <CardTitle className="text-base font-black text-slate-900">Institution Curriculum Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {teachers.map(t => {
                            const colors = getStatusColors(t.status);
                            const p = pct(t);
                            return (
                                <div key={t.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-sm flex-shrink-0">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">{t.name}</span>
                                                <span className="text-xs text-slate-400 ml-2">{t.subject} · {t.grade}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-700 ml-4">{p}%</span>
                                        </div>
                                        <ProgressBar value={p} color={colors.bar} />
                                    </div>
                                    <Badge className={`${colors.badge} border-none text-[10px] font-bold px-3 py-1 flex-shrink-0`}>{t.status}</Badge>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

type SessionStatus = 'Completed' | 'Pending' | 'Delayed' | 'Rescheduled';

type SessionKey = string; // e.g. "Ch 11-0" = chapter Ch11, session index 0

const LessonPlanningTab: React.FC = () => {
    const [view, setView] = useState<'annual' | 'monthly' | 'daily'>('annual');
    const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
    const [lessons, setLessons] = useState<DailyLesson[]>(dailyLessons);

    const markLessonComplete = (id: number) => {
        setLessons(prev => prev.map(l => l.id === id ? { ...l, status: 'Completed' } : l));
        setDailyComment('');
        setDailyAttachment(null);
    };

    const rescheduleLesson = (id: number) => {
        setLessons(prev => prev.map(l => l.id === id ? { ...l, status: 'Rescheduled' } : l));
        setDailyComment('');
        setDailyAttachment(null);
    };

    // Comment and Attachment for Daily Tracker
    const [dailyComment, setDailyComment] = useState('');
    const [dailyAttachment, setDailyAttachment] = useState<File | null>(null);

    // Mutable session statuses keyed by "ChX-sessionIndex"
    const [sessionStatuses, setSessionStatuses] = useState<Record<SessionKey, SessionStatus>>({});
    const [sessionDates, setSessionDates] = useState<Record<SessionKey, string>>({});
    // Which session has its action panel open
    const [activeSession, setActiveSession] = useState<SessionKey | null>(null);
    // Date-extend input
    const [extendDate, setExtendDate] = useState<Record<SessionKey, string>>({});
    const [showExtendInput, setShowExtendInput] = useState<SessionKey | null>(null);

    // Comment and Attachment for Session Update
    const [sessionComment, setSessionComment] = useState('');
    const [sessionAttachment, setSessionAttachment] = useState<File | null>(null);

    const getSessionStatus = (chKey: string, si: number, original: SessionStatus): SessionStatus =>
        sessionStatuses[`${chKey}-${si}`] ?? original;

    const getSessionDate = (chKey: string, si: number, original: string): string =>
        sessionDates[`${chKey}-${si}`] ?? original;

    const markSession = (chKey: string, si: number, status: SessionStatus) => {
        setSessionStatuses(prev => ({ ...prev, [`${chKey}-${si}`]: status }));
        setActiveSession(null);
        setShowExtendInput(null);
        setSessionComment('');
        setSessionAttachment(null);
    };

    const applyExtendDate = (chKey: string, si: number) => {
        const key = `${chKey}-${si}`;
        const newDate = extendDate[key];
        if (newDate) {
            setSessionDates(prev => ({ ...prev, [key]: new Date(newDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }));
        }
        setShowExtendInput(null);
        setActiveSession(null);
    };

    // Chapter → session-level drilldown data
    const chapterSessions: Record<string, { session: number; topic: string; method: string; date: string; status: SessionStatus }[]> = {
        'Ch 1': [
            { session: 1, topic: 'Introduction to Real Numbers', method: 'Lecture', date: '5 Jun', status: 'Completed' },
            { session: 2, topic: "Euclid's Division Lemma", method: 'Worked examples', date: '7 Jun', status: 'Completed' },
            { session: 3, topic: 'Fundamental Theorem of Arithmetic', method: 'Discussion', date: '10 Jun', status: 'Completed' },
            { session: 4, topic: 'Irrational Numbers – proofs', method: 'Lecture', date: '12 Jun', status: 'Completed' },
            { session: 5, topic: 'Decimal Expansions & revision', method: 'Practice', date: '14 Jun', status: 'Completed' },
        ],
        'Ch 2': [
            { session: 1, topic: 'Polynomials – degree & classification', method: 'Lecture', date: '17 Jun', status: 'Completed' },
            { session: 2, topic: 'Zeros of a polynomial / graph', method: 'Graph activity', date: '19 Jun', status: 'Completed' },
            { session: 3, topic: 'Relationship: zeros & coefficients', method: 'Worked examples', date: '21 Jun', status: 'Completed' },
            { session: 4, topic: 'Division algorithm for polynomials', method: 'Practice', date: '24 Jun', status: 'Completed' },
            { session: 5, topic: 'Revision & worksheet', method: 'Seat work', date: '26 Jun', status: 'Completed' },
        ],
        'Ch 3': [
            { session: 1, topic: 'Pair of linear equations – graphical method', method: 'Demonstration', date: '28 Jun', status: 'Completed' },
            { session: 2, topic: 'Substitution method', method: 'Practice', date: '1 Jul', status: 'Completed' },
            { session: 3, topic: 'Elimination method', method: 'Lecture', date: '3 Jul', status: 'Completed' },
            { session: 4, topic: 'Cross-multiplication', method: 'Worked examples', date: '5 Jul', status: 'Completed' },
            { session: 5, topic: 'Word problems & applications', method: 'Group activity', date: '8 Jul', status: 'Completed' },
        ],
        'Ch 4': [
            { session: 1, topic: 'Standard form & factorisation', method: 'Lecture', date: '10 Jul', status: 'Completed' },
            { session: 2, topic: 'Completing the square', method: 'Worked examples', date: '12 Jul', status: 'Completed' },
            { session: 3, topic: 'Quadratic formula', method: 'Lecture', date: '14 Jul', status: 'Completed' },
            { session: 4, topic: 'Nature of roots – discriminant', method: 'Practice', date: '17 Jul', status: 'Completed' },
            { session: 5, topic: 'Applications & assessment', method: 'Test', date: '19 Jul', status: 'Completed' },
        ],
        'Ch 10': [
            { session: 1, topic: 'Mean – ungrouped data', method: 'Lecture', date: '3 Mar', status: 'Completed' },
            { session: 2, topic: 'Median – grouped data', method: 'Worked examples', date: '4 Mar', status: 'Completed' },
            { session: 3, topic: 'Mode – bimodal sets', method: 'Group activity', date: '5 Mar', status: 'Completed' },
            { session: 4, topic: 'Cumulative frequency & ogive', method: 'Graph work', date: '6 Mar', status: 'Completed' },
            { session: 5, topic: 'Mixed applications & quiz', method: 'Assessment', date: '7 Mar', status: 'Completed' },
        ],
        'Ch 11': [
            { session: 1, topic: 'Probability – definition & experiments', method: 'Flipped classroom', date: '17 Mar', status: 'Pending' },
            { session: 2, topic: 'Sample space & events', method: 'Discussion', date: '18 Mar', status: 'Pending' },
            { session: 3, topic: 'P(A), P(not A)', method: 'Worked examples', date: '19 Mar', status: 'Pending' },
            { session: 4, topic: 'Experimental vs theoretical probability', method: 'Dice activity', date: '20 Mar', status: 'Pending' },
            { session: 5, topic: 'Practice problems – NCERT Ex 15.1', method: 'Seat work', date: '21 Mar', status: 'Pending' },
        ],
        'Ch 12': [
            { session: 1, topic: 'Tree diagrams – independent events', method: 'Lecture', date: '24 Mar', status: 'Pending' },
            { session: 2, topic: 'Compound events – AND / OR', method: 'Worked examples', date: '25 Mar', status: 'Pending' },
            { session: 3, topic: 'Conditional probability intro', method: 'Discussion', date: '26 Mar', status: 'Pending' },
            { session: 4, topic: 'Application word problems', method: 'Group work', date: '27 Mar', status: 'Pending' },
            { session: 5, topic: 'Unit quiz – Statistics & Probability', method: 'Assessment', date: '28 Mar', status: 'Pending' },
        ],
    };

    const annualUnits = [
        {
            unit: 'Unit 1', name: 'Number Systems & Algebra', chapters: 4, sessions: 20, status: 'Completed',
            objective: 'Establish foundational understanding of real numbers, polynomials, and algebraic identities.',
            milestone: 'Term 1 end – all students pass Unit 1 assessment',
            chapterList: [
                { ch: 'Ch 1', title: 'Real Numbers', sessions: 5, done: true },
                { ch: 'Ch 2', title: 'Polynomials', sessions: 5, done: true },
                { ch: 'Ch 3', title: 'Linear Equations in Two Variables', sessions: 5, done: true },
                { ch: 'Ch 4', title: 'Quadratic Equations', sessions: 5, done: true },
            ]
        },
        {
            unit: 'Unit 2', name: 'Geometry & Mensuration', chapters: 5, sessions: 25, status: 'Completed',
            objective: 'Develop spatial reasoning through triangles, circles, and coordinate geometry.',
            milestone: 'Term 1 end – complete geometry practicals',
            chapterList: [
                { ch: 'Ch 5', title: 'Triangles & Congruence', sessions: 6, done: true },
                { ch: 'Ch 6', title: 'Circles', sessions: 5, done: true },
                { ch: 'Ch 7', title: 'Coordinate Geometry', sessions: 5, done: true },
                { ch: 'Ch 8', title: 'Areas of Plane Figures', sessions: 4, done: true },
                { ch: 'Ch 9', title: 'Surface Area & Volume', sessions: 5, done: true },
            ]
        },
        {
            unit: 'Unit 3', name: 'Statistics & Probability', chapters: 3, sessions: 15, status: 'In Progress',
            objective: 'Analyse data using statistical tools and apply probability concepts to real-world problems.',
            milestone: 'March end – class project on data analysis submitted',
            chapterList: [
                { ch: 'Ch 10', title: 'Statistics – Central Tendency', sessions: 5, done: true },
                { ch: 'Ch 11', title: 'Probability Basics', sessions: 5, done: false },
                { ch: 'Ch 12', title: 'Compound Probability & Trees', sessions: 5, done: false },
            ]
        },
        {
            unit: 'Unit 4', name: 'Calculus Fundamentals', chapters: 4, sessions: 20, status: 'Pending',
            objective: 'Introduce limits, derivatives, and their applications in rate of change problems.',
            milestone: 'Term 2 end – unit test and individual solver assessment',
            chapterList: [
                { ch: 'Ch 13', title: 'Limits & Continuity', sessions: 5, done: false },
                { ch: 'Ch 14', title: 'Derivatives – Basics', sessions: 5, done: false },
                { ch: 'Ch 15', title: 'Applications of Derivatives', sessions: 5, done: false },
                { ch: 'Ch 16', title: 'Introduction to Integration', sessions: 5, done: false },
            ]
        },
    ];

    const monthlyTopics = [
        { week: 'Week 1', topic: 'Mean, Median, Mode', sessions: 4, objective: 'Calculate central tendency measures', done: true },
        { week: 'Week 2', topic: 'Frequency Distribution', sessions: 3, objective: 'Construct frequency tables and histograms', done: true },
        { week: 'Week 3', topic: 'Probability Basics', sessions: 4, objective: 'Define and compute simple probabilities', done: false },
        { week: 'Week 4', topic: 'Probability Trees & Compound Events', sessions: 4, objective: 'Solve compound probability problems', done: false },
    ];

    const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
    const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

    const weekDrilldown: Record<number, { day: string; date: string; topic: string; methodology: string; notes: string; done: boolean }[]> = {
        0: [
            { day: 'Monday', date: '3 Mar', topic: 'Mean – definition & formula', methodology: 'Lecture', notes: 'Used real-world salary data examples', done: true },
            { day: 'Tuesday', date: '4 Mar', topic: 'Median – grouped & ungrouped', methodology: 'Worked examples', notes: 'Practice: Ex 14.1 Q1–Q5', done: true },
            { day: 'Wednesday', date: '5 Mar', topic: 'Mode – bimodal & multimodal', methodology: 'Group activity', notes: 'Students collected class data', done: true },
            { day: 'Thursday', date: '6 Mar', topic: 'Comparison & application', methodology: 'Discussion', notes: 'Chose appropriate average for dataset', done: true },
        ],
        1: [
            { day: 'Monday', date: '10 Mar', topic: 'Frequency tables – construction', methodology: 'Demonstration', notes: 'Used NCERT table format', done: true },
            { day: 'Tuesday', date: '11 Mar', topic: 'Histograms & frequency polygons', methodology: 'Graph drawing', notes: 'Graph paper activity', done: true },
            { day: 'Thursday', date: '13 Mar', topic: 'Cumulative frequency & ogive', methodology: 'Lecture + Practice', notes: 'Exam tip: ogive orientation', done: true },
        ],
        2: [
            { day: 'Monday', date: '17 Mar', topic: 'Basic probability – events & outcomes', methodology: 'Flipped classroom', notes: 'Watch: Probability intro video', done: false },
            { day: 'Wednesday', date: '19 Mar', topic: 'P(A), P(not A), P(A or B)', methodology: 'Problem solving', notes: 'Worksheet distributed', done: false },
            { day: 'Thursday', date: '20 Mar', topic: 'Experimental vs theoretical', methodology: 'Lab / dice activity', notes: 'Record results for 50 trials', done: false },
            { day: 'Friday', date: '21 Mar', topic: 'Practice problems', methodology: 'Seat work', notes: 'NCERT Ex 15.1 full set', done: false },
        ],
        3: [
            { day: 'Monday', date: '24 Mar', topic: 'Tree diagrams – basics', methodology: 'Lecture', notes: 'Coin toss & bag problems', done: false },
            { day: 'Tuesday', date: '25 Mar', topic: 'Compound events – AND/OR', methodology: 'Worked examples', notes: 'Venn diagram approach', done: false },
            { day: 'Thursday', date: '27 Mar', topic: 'Application problems', methodology: 'Group work', notes: 'Real-world scenarios', done: false },
            { day: 'Friday', date: '28 Mar', topic: 'Unit revision & quiz', methodology: 'Assessment', notes: 'End-of-unit quiz – 10 marks', done: false },
        ],
    };

    return (
        <div className="space-y-6">
            {/* View switcher */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {(['annual', 'monthly', 'daily'] as const).map(v => (
                    <button key={v} onClick={() => setView(v)}
                        className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${view === v ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}>
                        {v === 'annual' ? 'Annual' : v === 'monthly' ? 'Monthly (POW)' : 'Daily Tracker'}
                    </button>
                ))}
            </div>

            {view === 'annual' && (
                <Card className="border-none shadow-sm">
                    <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-black text-slate-900">Annual Lesson Plan – Mathematics</CardTitle>
                            <p className="text-xs text-slate-400 mt-1">Grade 10 · Section A · Academic Year 2025–26</p>
                        </div>
                        <Badge className="bg-indigo-50 text-indigo-700 border-none">2025–26</Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        {annualUnits.map((u, i) => {
                            const isOpen = expandedUnit === i;
                            return (
                                <div key={i} className="border-b border-slate-50 last:border-0">
                                    <div
                                        onClick={() => setExpandedUnit(isOpen ? null : i)}
                                        className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors select-none"
                                    >
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {u.unit.split(' ')[1]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{u.unit}: {u.name}</p>
                                            <p className="text-xs text-slate-400">{u.chapters} chapters · {u.sessions} planned sessions</p>
                                        </div>
                                        <Badge className={`border-none text-[10px] font-bold mr-2 ${u.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : u.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {u.status}
                                        </Badge>
                                        <ChevronRight className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                    </div>
                                    {isOpen && (
                                        <div className="bg-slate-50/60 border-t border-slate-100 px-6 py-5 space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-white rounded-xl border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Learning Objective</p>
                                                    <p className="text-sm text-slate-700 font-medium">{u.objective}</p>
                                                </div>
                                                <div className="p-4 bg-white rounded-xl border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Milestone</p>
                                                    <p className="text-sm text-slate-700 font-medium">{u.milestone}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Chapters · click to view sessions</p>
                                                <div className="space-y-2">
                                                    {u.chapterList.map((ch, ci) => {
                                                        const chKey = ch.ch;
                                                        const chOpen = expandedChapter === `${i}-${ci}`;
                                                        const sessions = chapterSessions[chKey] || [];
                                                        return (
                                                            <div key={ci} className="rounded-xl border border-slate-100 overflow-hidden">
                                                                {/* Chapter clickable header */}
                                                                <div
                                                                    onClick={() => setExpandedChapter(chOpen ? null : `${i}-${ci}`)}
                                                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors ${chOpen ? 'bg-indigo-50' : 'bg-white hover:bg-slate-50'}`}
                                                                >
                                                                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 ${ch.done ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                                                                        {ch.done ? <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> : <Clock className="h-3.5 w-3.5 text-slate-400" />}
                                                                    </div>
                                                                    <span className={`text-[10px] font-black w-10 flex-shrink-0 ${chOpen ? 'text-indigo-500' : 'text-slate-400'}`}>{ch.ch}</span>
                                                                    <span className={`text-sm flex-1 ${chOpen ? 'text-indigo-700 font-bold' : 'text-slate-800 font-medium'}`}>{ch.title}</span>
                                                                    <span className="text-xs text-slate-400 font-bold flex-shrink-0">{ch.sessions} sessions</span>
                                                                    <Badge className={`border-none text-[9px] font-bold mx-2 ${ch.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                        {ch.done ? 'Completed' : 'Pending'}
                                                                    </Badge>
                                                                    <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${chOpen ? 'rotate-90 text-indigo-500' : 'text-slate-300'}`} />
                                                                </div>
                                                                {/* Session-level drilldown */}
                                                                {chOpen && (
                                                                    <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3 space-y-2">
                                                                        {sessions.length > 0 ? sessions.map((s, si) => {
                                                                            const sKey = `${chKey}-${si}`;
                                                                            const currentStatus = getSessionStatus(chKey, si, s.status);
                                                                            const currentDate = getSessionDate(chKey, si, s.date);
                                                                            const isActionable = currentStatus === 'Pending' || currentStatus === 'Delayed';
                                                                            const isOpen = activeSession === sKey;

                                                                            const statusBadgeClass =
                                                                                currentStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                                                                    currentStatus === 'Delayed' ? 'bg-red-50 text-red-600' :
                                                                                        currentStatus === 'Rescheduled' ? 'bg-amber-50 text-amber-700' :
                                                                                            'bg-blue-50 text-blue-600';

                                                                            return (
                                                                                <div key={si} className={`rounded-lg border transition-all duration-200 overflow-hidden ${isOpen ? 'border-indigo-200 shadow-sm' : 'border-slate-100'
                                                                                    } bg-white`}>
                                                                                    {/* Session row */}
                                                                                    <div className="flex items-center gap-3 px-3 py-2.5">
                                                                                        <span className="text-[10px] font-black text-slate-300 w-5 flex-shrink-0">S{s.session}</span>
                                                                                        <span className="text-sm text-slate-700 flex-1">{s.topic}</span>
                                                                                        <span className="text-xs text-slate-400 font-medium flex-shrink-0 hidden md:block">{s.method}</span>
                                                                                        <span className="text-xs text-slate-400 flex-shrink-0 w-16 text-right">{currentDate}</span>
                                                                                        <Badge className={`border-none text-[9px] font-bold ml-1 flex-shrink-0 ${statusBadgeClass}`}>
                                                                                            {currentStatus}
                                                                                        </Badge>
                                                                                        {isActionable && (
                                                                                            <button
                                                                                                onClick={e => {
                                                                                                    e.stopPropagation();
                                                                                                    setActiveSession(isOpen ? null : sKey);
                                                                                                    setShowExtendInput(null);
                                                                                                    setSessionComment('');
                                                                                                    setSessionAttachment(null);
                                                                                                }}
                                                                                                className={`ml-1 flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600'
                                                                                                    }`}
                                                                                                title="Manage session"
                                                                                            >
                                                                                                <Edit3 className="h-3 w-3" />
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                    {/* Inline action panel */}
                                                                                    {isOpen && (
                                                                                        <div className="border-t border-indigo-100 bg-indigo-50/60 px-3 py-3">
                                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Update Session Status</p>
                                                                                            <div className="mb-3">
                                                                                                <textarea
                                                                                                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 mb-2 resize-none"
                                                                                                    rows={2}
                                                                                                    placeholder="Add an optional comment..."
                                                                                                    value={sessionComment}
                                                                                                    onChange={e => setSessionComment(e.target.value)}
                                                                                                />
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <Button 
                                                                                                        variant="outline" 
                                                                                                        size="sm" 
                                                                                                        className={`h-7 text-[10px] font-bold ${sessionAttachment ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-500'}`}
                                                                                                        onClick={() => {
                                                                                                            const input = document.createElement('input');
                                                                                                            input.type = 'file';
                                                                                                            input.onchange = (e) => {
                                                                                                                const file = (e.target as HTMLInputElement).files?.[0];
                                                                                                                if (file) setSessionAttachment(file);
                                                                                                            };
                                                                                                            input.click();
                                                                                                        }}
                                                                                                    >
                                                                                                        {sessionAttachment ? `✓ ${sessionAttachment.name}` : '+ Attach Evidence'}
                                                                                                    </Button>
                                                                                                    {sessionAttachment && (
                                                                                                        <button onClick={() => setSessionAttachment(null)} className="text-slate-400 hover:text-red-500">
                                                                                                            <X className="h-4 w-4" />
                                                                                                        </button>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex flex-wrap gap-2">
                                                                                                <button
                                                                                                    onClick={e => { e.stopPropagation(); markSession(chKey, si, 'Completed'); }}
                                                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                                                                                                >
                                                                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={e => { e.stopPropagation(); markSession(chKey, si, 'Delayed'); }}
                                                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition-colors"
                                                                                                >
                                                                                                    <AlertOctagon className="h-3.5 w-3.5" /> Mark Delayed
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={e => { e.stopPropagation(); markSession(chKey, si, 'Rescheduled'); }}
                                                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold transition-colors"
                                                                                                >
                                                                                                    <Calendar className="h-3.5 w-3.5" /> Reschedule
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={e => { e.stopPropagation(); setShowExtendInput(sKey === showExtendInput ? null : sKey); }}
                                                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                                                                                                >
                                                                                                    <CalendarClock className="h-3.5 w-3.5" /> Extend Due Date
                                                                                                </button>
                                                                                            </div>
                                                                                            {showExtendInput === sKey && (
                                                                                                <div className="mt-2 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                                                                    <input
                                                                                                        type="date"
                                                                                                        className="h-8 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                                                                                        value={extendDate[sKey] || ''}
                                                                                                        onChange={e => setExtendDate(prev => ({ ...prev, [sKey]: e.target.value }))}
                                                                                                    />
                                                                                                    <button
                                                                                                        onClick={() => applyExtendDate(chKey, si)}
                                                                                                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                                                                                                    >
                                                                                                        Apply
                                                                                                    </button>
                                                                                                    <button
                                                                                                        onClick={() => setShowExtendInput(null)}
                                                                                                        className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-colors"
                                                                                                    >
                                                                                                        Cancel
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        }) : (
                                                                            <p className="text-xs text-slate-400 text-center py-3">Session data available once chapter begins.</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {view === 'monthly' && (
                <Card className="border-none shadow-sm">
                    <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                        <CardTitle className="text-base font-black text-slate-900">Monthly Plan – March 2026</CardTitle>
                        <p className="text-xs text-slate-400 mt-1">Unit 3: Statistics & Probability · Ms. Reshma Binu Prasad · Click a week to view daily sessions</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        {monthlyTopics.map((w, i) => {
                            const isOpen = expandedWeek === i;
                            const days = weekDrilldown[i] || [];
                            return (
                                <div key={i} className="border-b border-slate-50 last:border-0">
                                    {/* Week header – clickable */}
                                    <div
                                        onClick={() => setExpandedWeek(isOpen ? null : i)}
                                        className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors select-none"
                                    >
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${w.done ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                                            {w.done ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Clock className="h-4 w-4 text-slate-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{w.week}: {w.topic}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{w.objective}</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 flex-shrink-0">{w.sessions} sessions</span>
                                        <Badge className={`border-none text-[10px] font-bold mx-2 ${w.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {w.done ? 'Completed' : 'Pending'}
                                        </Badge>
                                        <ChevronRight className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                    </div>
                                    {/* Day-level drill-down */}
                                    {isOpen && (
                                        <div className="bg-slate-50/60 border-t border-slate-100 px-6 py-4 space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Daily Sessions</p>
                                            {days.map((d, di) => (
                                                <div key={di} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100">
                                                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${d.done ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                                                        {d.done ? <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> : <BookOpen className="h-3.5 w-3.5 text-blue-500" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-xs font-black text-slate-400">{d.day}, {d.date}</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-800">{d.topic}</p>
                                                        <div className="flex gap-4 mt-1 text-xs text-slate-400">
                                                            <span><span className="font-bold">Method:</span> {d.methodology}</span>
                                                            <span><span className="font-bold">Notes:</span> {d.notes}</span>
                                                        </div>
                                                    </div>
                                                    <Badge className={`border-none text-[9px] font-bold flex-shrink-0 ${d.done ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
                                                        {d.done ? 'Done' : 'Upcoming'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {view === 'daily' && (
                <div className="space-y-3">
                    <p className="text-xs text-slate-400 font-medium">Click any lesson to view full details</p>
                    {lessons.map(l => {
                        const isOpen = expandedLesson === l.id;
                        return (
                            <Card key={l.id}
                                onClick={() => setExpandedLesson(isOpen ? null : l.id)}
                                className={`border-none shadow-sm cursor-pointer transition-all duration-200 ${isOpen ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:shadow-md'}`}>
                                <CardContent className="p-0">
                                    {/* Summary row */}
                                    <div className="p-5 flex items-start gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-indigo-600' : 'bg-blue-50'}`}>
                                            <BookOpen className={`h-5 w-5 ${isOpen ? 'text-white' : 'text-blue-600'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{l.topic}</p>
                                                    <p className="text-xs text-slate-400">{l.teacherName} · {l.subject} · {l.grade}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`border text-[10px] font-bold ${getLessonStatusColors(l.status)}`}>{l.status}</Badge>
                                                    <ChevronRight className={`h-4 w-4 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                                </div>
                                            </div>
                                            {!isOpen && (
                                                <div className="flex gap-4 mt-1 text-xs text-slate-400">
                                                    <span><span className="font-bold">Date:</span> {l.date}</span>
                                                    <span><span className="font-bold">Method:</span> {l.methodology}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded full detail */}
                                    {isOpen && (
                                        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5 space-y-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { label: 'Date', value: l.date },
                                                    { label: 'Teaching Method', value: l.methodology },
                                                    { label: 'Subject', value: l.subject },
                                                    { label: 'Grade / Section', value: l.grade },
                                                ].map(item => (
                                                    <div key={item.label} className="bg-white rounded-xl p-3 border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                        <p className="text-sm font-bold text-slate-800">{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="bg-white rounded-xl p-4 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Learning Objective</p>
                                                    <p className="text-sm text-slate-700">{l.objective}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Homework / Assignment</p>
                                                    <p className="text-sm text-slate-700">{l.homework}</p>
                                                </div>
                                            </div>
                                            {l.status !== 'Completed' && l.status !== 'Rescheduled' && (
                                                <div className="bg-white border border-slate-100 rounded-xl p-4 mt-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Update Session Status</p>
                                                    
                                                    <div className="space-y-3 mb-4">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
                                                                <FileText className="h-3 w-3" /> Observation Notes / Comments
                                                            </label>
                                                            <textarea
                                                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none placeholder:text-slate-300"
                                                                rows={2}
                                                                placeholder="Add any context before updating the status..."
                                                                value={dailyComment}
                                                                onChange={e => setDailyComment(e.target.value)}
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.onchange = (e: any) => {
                                                                        if (e.target.files && e.target.files[0]) {
                                                                            setDailyAttachment(e.target.files[0]);
                                                                        }
                                                                    };
                                                                    input.click();
                                                                }}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 text-xs font-bold border-dashed border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
                                                            >
                                                                <Plus className="h-3.5 w-3.5 mr-1" />
                                                                Add Attachment
                                                            </Button>
                                                            {dailyAttachment && (
                                                                <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-md text-[10px] font-medium text-indigo-700">
                                                                    <span className="truncate max-w-[150px]">{dailyAttachment.name}</span>
                                                                    <button onClick={e => { e.stopPropagation(); setDailyAttachment(null); }} className="hover:text-red-500">
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 pt-1">
                                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 text-xs font-bold"
                                                            onClick={e => { e.stopPropagation(); markLessonComplete(l.id); }}>
                                                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />Mark as Completed
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="rounded-lg h-8 text-xs font-bold text-slate-500 hover:text-amber-600"
                                                            onClick={e => { e.stopPropagation(); rescheduleLesson(l.id); }}>
                                                            <Calendar className="h-3.5 w-3.5 mr-1.5" />Reschedule
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            {l.status === 'Completed' && (
                                                <div className="flex items-center gap-3 pt-1">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                                        <CheckCircle className="h-3.5 w-3.5" /> Completed
                                                    </span>
                                                </div>
                                            )}
                                            {l.status === 'Rescheduled' && (
                                                <div className="flex items-center gap-3 pt-1">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                                                        <Calendar className="h-3.5 w-3.5" /> Rescheduled
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const CurriculumTrackingTab: React.FC = () => {
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Completed Lessons" value={teachers.reduce((s, t) => s + t.completed, 0)} icon={CheckCircle} color="emerald" />
            <StatCard label="Pending Lessons" value={teachers.reduce((s, t) => s + (t.planned - t.completed - t.rescheduled), 0)} icon={Clock} color="blue" />
            <StatCard label="Rescheduled" value={teachers.reduce((s, t) => s + t.rescheduled, 0)} icon={Calendar} color="amber" />
        </div>

        <Card className="border-none shadow-sm">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                <CardTitle className="text-base font-black text-slate-900">Syllabus Coverage – All Teachers</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
                {teachers.map(t => {
                    const colors = getStatusColors(t.status);
                    const p = pct(t);
                    return (
                        <div 
                            key={t.id}
                            onClick={() => setSelectedTeacherId(t.id)}
                            className="cursor-pointer hover:bg-slate-50 transition-colors rounded-xl p-3 -mx-3"
                        >
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                                    <span className="text-sm font-bold text-slate-900">{t.name}</span>
                                    <span className="text-xs text-slate-400">{t.subject} · {t.grade}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500">{t.completed}/{t.planned}</span>
                                    <span className="text-sm font-black text-slate-800 w-10 text-right">{p}%</span>
                                    <Badge className={`${colors.badge} border-none text-[9px] font-bold px-2`}>{t.status}</Badge>
                                </div>
                            </div>
                            <ProgressBar value={p} color={colors.bar} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>

        {/* Teacher Details Modal */}
        {selectedTeacher && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                <Card className="w-full max-w-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                {selectedTeacher.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedTeacher.name}</h3>
                                <p className="text-xs font-semibold text-slate-500">{selectedTeacher.subject} · {selectedTeacher.grade}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedTeacherId(null)}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Completed Lessons</p>
                                <p className="text-2xl font-black text-emerald-700">{selectedTeacher.completed}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Planned</p>
                                <p className="text-2xl font-black text-slate-700">{selectedTeacher.planned}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Recent Class Activity</h4>
                            <div className="space-y-3">
                                {[
                                    { date: 'Today, 10:30 AM', topic: 'Thermodynamics Part 2', status: 'Completed', color: 'emerald' },
                                    { date: 'Yesterday, 11:45 AM', topic: 'Thermodynamics Part 1', status: 'Completed', color: 'emerald' },
                                    { date: 'Mon, 09:00 AM', topic: 'Chemical Kinetics Overview', status: 'Delayed', color: 'red' }
                                ].map((cls, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{cls.topic}</p>
                                            <p className="text-xs text-slate-400">{cls.date}</p>
                                        </div>
                                        <Badge className={`bg-${cls.color}-50 text-${cls.color}-700 border-none text-[10px] font-bold`}>
                                            {cls.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Latest Observation</h4>
                                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50">View Full Record</Button>
                            </div>
                            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-700">Observed by: Sarah Jenkins (HOD)</span>
                                    <span className="text-xs text-slate-500">Last week</span>
                                </div>
                                <p className="text-sm text-slate-600 italic">"Excellent student engagement during the practical demonstration. Needs to focus slightly more on time management to ensure all learning objectives are covered before the bell."</p>
                                <div className="flex gap-2 mt-3">
                                    <Badge className="bg-indigo-100 text-indigo-700 border-none text-[10px]">Methodology: 4/5</Badge>
                                    <Badge className="bg-indigo-100 text-indigo-700 border-none text-[10px]">Engagement: 5/5</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )}
    </div>
    );
};

const BacklogMonitoringTab: React.FC = () => {
    const thresholds = [
        { range: '90–100%', status: 'Healthy', color: 'emerald' },
        { range: '80–89%', status: 'Warning', color: 'amber' },
        { range: 'Below 80%', status: 'Backlog Detected', color: 'orange' },
        { range: 'Backlog > 20–25%', status: 'Critical Risk', color: 'red' },
    ];

    const alertTeachers = teachers.filter(t => t.status === 'Backlog Detected' || t.status === 'Critical Risk');

    const [notifyingTeacherId, setNotifyingTeacherId] = useState<number | null>(null);
    const [notifyComment, setNotifyComment] = useState('');
    const [notifiedTeachers, setNotifiedTeachers] = useState<number[]>([]);

    const handleNotifySubmit = (id: number) => {
        setNotifiedTeachers(prev => [...prev, id]);
        setNotifyingTeacherId(null);
        setNotifyComment('');
    };

    return (
        <div className="space-y-6">
            {/* Alert banner */}
            {alertTeachers.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-black text-red-900">{alertTeachers.length} teacher{alertTeachers.length > 1 ? 's' : ''} require immediate attention</p>
                        <p className="text-xs text-red-600 mt-0.5">Backlog has exceeded threshold. Notify HOD and schedule recovery classes.</p>
                    </div>
                </div>
            )}

            {/* Threshold table */}
            <Card className="border-none shadow-sm">
                <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <CardTitle className="text-base font-black text-slate-900">Backlog Risk Classification</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {thresholds.map(({ range, status, color }, i) => (
                        <div key={i} className={`flex items-center gap-4 px-6 py-3.5 border-b border-slate-50 last:border-0`}>
                            <div className={`h-3 w-3 rounded-full bg-${color}-500 flex-shrink-0`} />
                            <span className="text-sm font-bold text-slate-700 w-32">{range}</span>
                            <Badge className={`bg-${color}-50 text-${color}-700 border-none text-xs font-bold`}>{status}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Backlog cards */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Active Backlog Alerts</h3>
                {teachers.map(t => {
                    if (t.status === 'Healthy') return null;
                    const colors = getStatusColors(t.status);
                    const p = pct(t);
                    const missed = t.planned - t.completed;
                    const backlogPct = Math.round((missed / t.planned) * 100);
                    return (
                        <Card key={t.id} className={`border-none shadow-sm ${t.status === 'Critical Risk' ? 'ring-2 ring-red-200' : ''}`}>
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className={`h-10 w-10 rounded-xl ${t.status === 'Critical Risk' ? 'bg-red-50' : 'bg-orange-50'} flex items-center justify-center flex-shrink-0 mt-1`}>
                                        <AlertTriangle className={`h-5 w-5 ${t.status === 'Critical Risk' ? 'text-red-500' : 'text-orange-500'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{t.name}</p>
                                                <p className="text-xs text-slate-400">{t.subject} · {t.grade}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${colors.badge} border-none text-[10px] font-bold`}>{t.status}</Badge>
                                            </div>
                                        </div>
                                        <ProgressBar value={p} color={colors.bar} />
                                        <div className="flex justify-between items-center mt-1.5">
                                            <div className="text-xs text-slate-400">
                                                <span>{t.completed}/{t.planned} lessons completed. </span>
                                                <span className="font-bold text-red-600">{missed} missed · {backlogPct}% backlog</span>
                                            </div>
                                            <div>
                                                {notifiedTeachers.includes(t.id) ? (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                                        <CheckCircle2 className="h-3 w-3" /> Notified
                                                    </span>
                                                ) : (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-7 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-3"
                                                        onClick={() => setNotifyingTeacherId(t.id === notifyingTeacherId ? null : t.id)}
                                                    >
                                                        <MessageSquare className="h-3 w-3 mr-1.5" />
                                                        Notify Faculty
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {notifyingTeacherId === t.id && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 pl-14">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                                            <Send className="h-3 w-3" /> Send Communication
                                        </p>
                                        <textarea
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none placeholder:text-slate-300"
                                            rows={2}
                                            placeholder={`Leave a message for ${t.name} regarding the backlog...`}
                                            value={notifyComment}
                                            onChange={e => setNotifyComment(e.target.value)}
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => setNotifyingTeacherId(null)}
                                                className="h-8 text-[10px] font-bold border-slate-200 text-slate-500"
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleNotifySubmit(t.id)}
                                                className="h-8 text-[10px] font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                Send Communication
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

const BacklogRecoveryTab: React.FC = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const [scheduled, setScheduled] = useState<number[]>([]);
    const [expandedSlot, setExpandedSlot] = useState<number | null>(null);
    const [periodView, setPeriodView] = useState<'list' | 'timetable'>('list');

    const handleSchedule = (id: number) => {
        setScheduled(prev => [...prev, id]);
        setSelected(null);
        setExpandedSlot(null);
    };

    const slotDetail: Record<number, { subject: string; topic: string; chapter: string; backlogSessions: number; notes: string }> = {
        1: { subject: 'Chemistry', topic: 'Organic Chemistry – Alkenes', chapter: 'Ch 13', backlogSessions: 5, notes: 'First free slot where both teacher and class are available. Ideal for recovery.' },
        2: { subject: 'Chemistry', topic: 'Alkene Reactions – Addition', chapter: 'Ch 13', backlogSessions: 4, notes: 'Class has another activity during this slot – teacher free only.' },
        3: { subject: 'Chemistry', topic: 'Alkynes – Structure', chapter: 'Ch 14', backlogSessions: 3, notes: 'Teacher has duty during this period – class is free only.' },
        4: { subject: 'Chemistry', topic: 'Named Reactions Overview', chapter: 'Ch 14', backlogSessions: 2, notes: 'Good availability. Second preferred slot for scheduling.' },
        5: { subject: 'Chemistry', topic: 'Organic Chemistry Revision', chapter: 'Ch 13–14', backlogSessions: 2, notes: 'End-of-week slot. Good for consolidation session.' },
    };

    const recoveryHistory = [
        { date: '14 Feb', day: 'Saturday', period: 'Period 2', topic: 'Ionic Bonding – recap', status: 'Completed' },
        { date: '20 Feb', day: 'Friday', period: 'Period 6', topic: 'Chemical Equilibrium – intro', status: 'Completed' },
        { date: '28 Feb', day: 'Friday', period: 'Period 7', topic: 'Acids, Bases & Salts', status: 'Completed' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <Activity className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-black text-blue-900">Intelligent Free Period Detection</p>
                    <p className="text-xs text-blue-600 mt-0.5">The system analyses teacher and class timetables to identify common free slots for backlog recovery scheduling. Click any slot to view topic detail before scheduling.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Free slot list with drill-down */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-black text-slate-900">Available Free Periods</CardTitle>
                            <p className="text-xs text-slate-400 mt-1">Prof. Renu Mehta · Chemistry · Grade 12</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setPeriodView('list')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${periodView === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                List View
                            </button>
                            <button 
                                onClick={() => setPeriodView('timetable')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${periodView === 'timetable' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Timetable View
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {periodView === 'list' ? (
                            freeSlots.map(slot => {
                            const isCommon = slot.teacherFree && slot.classFree;
                            const isScheduled = scheduled.includes(slot.id);
                            const isExpanded = expandedSlot === slot.id;
                            const detail = slotDetail[slot.id];
                            return (
                                <div key={slot.id} className="border-b border-slate-50 last:border-0">
                                    <div
                                        onClick={() => setExpandedSlot(isExpanded ? null : slot.id)}
                                        className={`flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-colors select-none ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${isCommon ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800">{slot.day} – {slot.period}</p>
                                            <p className="text-xs text-slate-400">{slot.time}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slot.teacherFree ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>Teacher {slot.teacherFree ? '✓' : '✗'}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slot.classFree ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>Class {slot.classFree ? '✓' : '✗'}</span>
                                            </div>
                                        </div>
                                        {isScheduled ? (
                                            <Badge className="bg-indigo-50 text-indigo-700 border-none text-[10px] font-bold">Scheduled</Badge>
                                        ) : isCommon ? (
                                            <Button size="sm" onClick={e => { e.stopPropagation(); setSelected(slot.id); }}
                                                className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3">
                                                Schedule
                                            </Button>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 font-bold">Partial</span>
                                        )}
                                        <ChevronRight className={`h-3.5 w-3.5 text-slate-300 flex-shrink-0 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                    </div>
                                    {isExpanded && detail && (
                                        <div className="bg-slate-50/80 border-t border-slate-100 px-6 py-4 space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white rounded-xl p-3 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recovery Topic</p>
                                                    <p className="text-sm font-bold text-slate-800">{detail.topic}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-3 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chapter</p>
                                                    <p className="text-sm font-bold text-slate-800">{detail.chapter}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                                                <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Backlog Sessions Remaining</p>
                                                    <p className="text-sm font-bold text-orange-600">{detail.backlogSessions} sessions</p>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl p-3 border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability Notes</p>
                                                <p className="text-xs text-slate-600">{detail.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                        ) : (
                            // Timetable View
                            <div className="p-6 overflow-x-auto">
                                <div className="min-w-[600px]">
                                    <div className="grid grid-cols-8 gap-1 mb-1">
                                        <div className="col-span-1"></div>
                                        {[1, 2, 3, 4, 5, 6, 7].map(p => (
                                            <div key={p} className="col-span-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2 bg-slate-50 rounded-md">
                                                Per {p}
                                            </div>
                                        ))}
                                    </div>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                        <div key={day} className="grid grid-cols-8 gap-1 mb-1">
                                            <div className="col-span-1 flex items-center justify-center bg-slate-50 rounded-md text-[11px] font-bold text-slate-600">
                                                {day.substring(0, 3)}
                                            </div>
                                            {[1, 2, 3, 4, 5, 6, 7].map(p => {
                                                const slot = freeSlots.find(s => s.day === day && s.period === `Period ${p}`);
                                                const isCommon = slot?.teacherFree && slot?.classFree;
                                                const isScheduled = slot && scheduled.includes(slot.id);
                                                const isSelected = slot && selected === slot.id;

                                                if (!slot) {
                                                    return (
                                                        <div key={p} className="col-span-1 h-12 bg-slate-50/50 rounded-md border border-slate-100 flex items-center justify-center">
                                                            <span className="text-slate-200 text-xl font-light">-</span>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div 
                                                        key={p} 
                                                        onClick={() => {
                                                            if (isScheduled) return;
                                                            if (isCommon && !isSelected) {
                                                                setSelected(slot.id);
                                                            } else if (isSelected) {
                                                                setSelected(null);
                                                            }
                                                        }}
                                                        className={`col-span-1 h-12 rounded-md border flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                                                        ${isScheduled ? 'bg-indigo-50 border-indigo-200' :
                                                            isSelected ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' :
                                                                isCommon ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 
                                                                    'bg-amber-50 border-amber-200'}
                                                        `}
                                                    >
                                                        {isScheduled ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 text-indigo-600 mb-0.5" />
                                                                <span className="text-[9px] font-bold text-indigo-700">Scheduled</span>
                                                            </>
                                                        ) : isCommon ? (
                                                            <>
                                                                <CheckCircle2 className={`h-4 w-4 mb-0.5 ${isSelected ? 'text-indigo-200' : 'text-emerald-500'}`} />
                                                                <span className={`text-[9px] font-bold ${isSelected ? 'text-white' : 'text-emerald-700'}`}>Free</span>
                                                                {!isSelected && <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <span className="text-[10px] font-bold text-emerald-800">Select</span>
                                                                </div>}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <AlertTriangle className="h-4 w-4 text-amber-500 mb-0.5" />
                                                                <span className="text-[9px] font-bold text-amber-700">Partial</span>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                    <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 justify-center">
                                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200"></div><span className="text-[10px] text-slate-500 font-bold">Common Free</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-200"></div><span className="text-[10px] text-slate-500 font-bold">Partial (Teacher/Class)</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-50 border border-slate-200"></div><span className="text-[10px] text-slate-500 font-bold">Busy</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-100 border border-indigo-200"></div><span className="text-[10px] text-slate-500 font-bold">Scheduled</span></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right panel: scheduler + history */}
                <div className="space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                            <CardTitle className="text-base font-black text-slate-900">Schedule Backlog Class</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {selected ? (
                                <>
                                    <div className="p-4 bg-indigo-50 rounded-xl">
                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Selected Slot</p>
                                        <p className="text-sm font-black text-indigo-900 mt-1">
                                            {freeSlots.find(s => s.id === selected)?.day} – {freeSlots.find(s => s.id === selected)?.period} · {freeSlots.find(s => s.id === selected)?.time}
                                        </p>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-slate-500">Teacher</span><span className="font-bold">Prof. Renu Mehta</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Subject</span><span className="font-bold">Chemistry</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Topic</span><span className="font-bold">{slotDetail[selected]?.topic || 'Organic Chemistry – Alkenes'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Backlog Sessions</span><span className="font-bold text-orange-600">{slotDetail[selected]?.backlogSessions || 0} remaining</span></div>
                                    </div>
                                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
                                        ⚠ Scheduling this period will block substitution generation and prevent double-booking.
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button onClick={() => handleSchedule(selected)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 rounded-xl">Confirm & Schedule</Button>
                                        <Button variant="ghost" onClick={() => setSelected(null)} className="flex-1 h-10 rounded-xl">Cancel</Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                                    <Calendar className="h-10 w-10 mb-3 opacity-30" />
                                    <p className="text-sm font-bold">Select a common free slot</p>
                                    <p className="text-xs mt-1">Click "Schedule" on any green slot to begin</p>
                                </div>
                            )}
                            {scheduled.length > 0 && (
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Confirmed This Session</p>
                                    {scheduled.map(id => {
                                        const s = freeSlots.find(f => f.id === id);
                                        return s ? (
                                            <div key={id} className="flex items-center gap-2 py-1.5">
                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                <span className="text-sm text-slate-700 font-medium">{s.day} {s.period} – {slotDetail[id]?.topic || 'Chemistry Backlog'}</span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recovery History */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="px-6 pt-5 pb-3 border-b border-slate-100">
                            <CardTitle className="text-sm font-black text-slate-900">Recovery History – This Term</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recoveryHistory.map((r, i) => (
                                <div key={i} className="flex items-center gap-3 px-6 py-3 border-b border-slate-50 last:border-0">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">{r.topic}</p>
                                        <p className="text-xs text-slate-400">{r.day}, {r.date} · {r.period}</p>
                                    </div>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-none text-[9px] font-bold">{r.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ClassroomObservationTab: React.FC = () => {
    const [selected, setSelected] = useState<Observation | null>(null);
    const [observingId, setObservingId] = useState<number | null>(null);
    const [liveScores, setLiveScores] = useState<Record<string, number>>({});
    const [liveNotes, setLiveNotes] = useState('');
    const [completedObs, setCompletedObs] = useState<Record<number, { methodology: number; engagement: number; clarity: number; management: number; outcomes: number; improvements: string }>>({});
    const observed = observations.filter(o => o.status === 'Completed').length + Object.keys(completedObs).length;

    // Action States per observation ID
    const [pushedToAppraisal, setPushedToAppraisal] = useState<Record<number, boolean>>({});
    
    const [showObserverNoteInput, setShowObserverNoteInput] = useState<number | null>(null);
    const [observerNotes, setObserverNotes] = useState<Record<number, string>>({});
    const [tempNoteText, setTempNoteText] = useState('');

    const [showFollowUpInput, setShowFollowUpInput] = useState<number | null>(null);
    const [followUpDates, setFollowUpDates] = useState<Record<number, string>>({});
    const [tempFollowUpDate, setTempFollowUpDate] = useState('');

    const criteriaLabels = [
        { key: 'methodology' as const, label: 'Teaching Methodology', icon: BookOpen },
        { key: 'engagement' as const, label: 'Student Engagement', icon: Users },
        { key: 'clarity' as const, label: 'Curriculum Clarity', icon: Target },
        { key: 'management' as const, label: 'Classroom Management', icon: Activity },
        { key: 'outcomes' as const, label: 'Learning Outcomes', icon: TrendingUp },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Observed This Term" value={`${observed}/${observations.length}`} icon={Eye} color="indigo" />
                <StatCard label="Coverage" value={`${Math.round((observed / observations.length) * 100)}%`} icon={TrendingUp} color="emerald" />
                <StatCard label="Scheduled" value={observations.filter(o => o.status === 'Scheduled').length} icon={Calendar} color="blue" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Observation list */}
                <div className="space-y-3">
                    <p className="text-xs text-slate-400 font-medium">Click an observation to view full scoring detail</p>
                    {observations.map(o => (
                        <Card key={o.id}
                            onClick={() => setSelected(o)}
                            className={`border-none shadow-sm cursor-pointer hover:shadow-md transition-all ${selected?.id === o.id ? 'ring-2 ring-indigo-500 shadow-md' : ''}`}>
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors ${selected?.id === o.id ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {o.teacher.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">{o.teacher}</p>
                                    <p className="text-xs text-slate-400">{o.subject} · Observed by {o.observer}</p>
                                    <p className="text-xs text-slate-400">{o.role} · {o.date}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge className={`border-none text-[10px] font-bold ${o.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : o.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {o.status}
                                    </Badge>
                                    {o.status === 'Completed' && (
                                        <span className="text-[10px] font-black text-indigo-600">
                                            {Math.round((o.methodology + o.engagement + o.clarity + o.management + o.outcomes) / 5 * 20)}% score
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Detail panel */}
                {selected ? (
                    <Card className="border-none shadow-sm sticky top-4">
                        <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-base font-black text-slate-900">{selected.teacher}</CardTitle>
                                <p className="text-xs text-slate-400 mt-1">{selected.subject} · Observed by {selected.observer}</p>
                                <p className="text-xs text-slate-400">{selected.role} · {selected.date}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
                            {selected.status === 'Completed' ? (
                                <>
                                    {/* Overall score banner */}
                                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl text-white flex items-center gap-4">
                                        <div className="text-4xl font-black leading-none">
                                            {Math.round((selected.methodology + selected.engagement + selected.clarity + selected.management + selected.outcomes) / 5 * 20)}%
                                        </div>
                                        <div>
                                            <p className="text-sm font-black">Overall Observation Score</p>
                                            <p className="text-[11px] text-indigo-200 mt-0.5">Composite across 5 criteria · {selected.date}</p>
                                        </div>
                                    </div>

                                    {/* Criteria score cards */}
                                    <div className="grid grid-cols-1 gap-2">
                                        {criteriaLabels.map(c => {
                                            const score = selected[c.key] as number;
                                            const pctScore = score * 20;
                                            const color = pctScore >= 80 ? 'emerald' : pctScore >= 60 ? 'amber' : 'red';
                                            return (
                                                <div key={c.key} className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3">
                                                    <div className={`h-7 w-7 rounded-lg bg-${color}-50 flex items-center justify-center flex-shrink-0`}>
                                                        <c.icon className={`h-3.5 w-3.5 text-${color}-600`} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 flex-1">{c.label}</span>
                                                    <div className="w-24">
                                                        <ProgressBar value={pctScore} color={`bg-${color}-500`} />
                                                    </div>
                                                    <span className={`text-xs font-black w-8 text-right text-${color}-600`}>{score}/5</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Improvement notes */}
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                        <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-2">Areas for Improvement</p>
                                        <p className="text-sm text-amber-800">{selected.improvements}</p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="space-y-4 pt-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Push to Appraisal */}
                                            <Button
                                                className={`w-full h-9 text-xs font-bold rounded-xl justify-start px-4 gap-2 ${pushedToAppraisal[selected.id]
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                    }`}
                                                onClick={() => setPushedToAppraisal(prev => ({ ...prev, [selected.id]: true }))}
                                            >
                                                <Star className="h-3.5 w-3.5" />
                                                {pushedToAppraisal[selected.id] ? '✓ Pushed to Appraisal System' : 'Push Score to Appraisal'}
                                            </Button>

                                            {/* Observer Note */}
                                            <div className="space-y-2">
                                                <Button
                                                    variant="outline"
                                                    className={`w-full h-9 text-xs font-bold rounded-xl justify-start px-4 gap-2 border-slate-200 ${observerNotes[selected.id] ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-600'
                                                        }`}
                                                    onClick={() => {
                                                        setShowObserverNoteInput(showObserverNoteInput === selected.id ? null : selected.id);
                                                        setTempNoteText(observerNotes[selected.id] || '');
                                                    }}
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    {observerNotes[selected.id] ? '✓ Note Added to Record' : 'Add Observer Note'}
                                                </Button>
                                                {showObserverNoteInput === selected.id && (
                                                    <div className="pl-4 mt-2">
                                                        <textarea
                                                            value={tempNoteText}
                                                            onChange={e => setTempNoteText(e.target.value)}
                                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 mb-2"
                                                            placeholder="Enter private observer note..."
                                                            rows={2}
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold" onClick={() => setShowObserverNoteInput(null)}>Cancel</Button>
                                                            <Button size="sm" className="h-7 text-[10px] font-bold bg-indigo-600 text-white" onClick={() => {
                                                                setObserverNotes(prev => ({ ...prev, [selected.id]: tempNoteText }));
                                                                setShowObserverNoteInput(null);
                                                            }}>Save Note</Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Schedule Follow Up */}
                                            <div className="space-y-2">
                                                <Button
                                                    variant="outline"
                                                    className={`w-full h-9 text-xs font-bold rounded-xl justify-start px-4 gap-2 border-slate-200 ${followUpDates[selected.id] ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-slate-600'
                                                        }`}
                                                    onClick={() => {
                                                        setShowFollowUpInput(showFollowUpInput === selected.id ? null : selected.id);
                                                        setTempFollowUpDate(followUpDates[selected.id] || '');
                                                    }}
                                                >
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {followUpDates[selected.id] ? `✓ Follow-Up: ${followUpDates[selected.id]}` : 'Schedule Follow-Up Observation'}
                                                </Button>
                                                {showFollowUpInput === selected.id && (
                                                    <div className="pl-4 mt-2 flex items-center gap-2">
                                                        <input 
                                                            type="date" 
                                                            className="flex-1 h-8 px-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                                                            value={tempFollowUpDate}
                                                            onChange={e => setTempFollowUpDate(e.target.value)}
                                                        />
                                                        <Button size="sm" className="h-8 text-[10px] font-bold bg-indigo-600 text-white flex-shrink-0 px-3" onClick={() => {
                                                            setFollowUpDates(prev => ({ ...prev, [selected.id]: tempFollowUpDate }));
                                                            setShowFollowUpInput(null);
                                                        }}>Schedule</Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    {observingId === selected.id ? (
                                        /* ─── Live Observation Form ─── */
                                        <div className="space-y-4">
                                            <div className="p-3 bg-indigo-50 rounded-xl flex items-center gap-2">
                                                <Eye className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                                                <p className="text-xs font-black text-indigo-700">Observation in progress – {selected.teacher}</p>
                                            </div>
                                            {[
                                                { key: 'methodology', label: 'Teaching Methodology' },
                                                { key: 'engagement', label: 'Student Engagement' },
                                                { key: 'clarity', label: 'Curriculum Clarity' },
                                                { key: 'management', label: 'Classroom Management' },
                                                { key: 'outcomes', label: 'Learning Outcomes' },
                                            ].map(c => (
                                                <div key={c.key}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-slate-700">{c.label}</span>
                                                        <span className="text-xs font-black text-indigo-600 w-8 text-right">{liveScores[c.key] ?? 3}/5</span>
                                                    </div>
                                                    <input
                                                        type="range" min="1" max="5" step="1"
                                                        value={liveScores[c.key] ?? 3}
                                                        onChange={e => setLiveScores(prev => ({ ...prev, [c.key]: Number(e.target.value) }))}
                                                        className="w-full h-1.5 rounded-full accent-indigo-600 cursor-pointer"
                                                    />
                                                    <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                                                        {['Poor', 'Below Avg', 'Average', 'Good', 'Excellent'].map(l => <span key={l}>{l}</span>)}
                                                    </div>
                                                </div>
                                            ))}
                                            <div>
                                                <p className="text-xs font-bold text-slate-700 mb-1">Areas for Improvement</p>
                                                <textarea
                                                    value={liveNotes}
                                                    onChange={e => setLiveNotes(e.target.value)}
                                                    rows={3}
                                                    placeholder="Note specific areas for teacher improvement..."
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1 h-9 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                                    onClick={() => {
                                                        setCompletedObs(prev => ({
                                                            ...prev,
                                                            [selected.id]: {
                                                                methodology: liveScores['methodology'] ?? 3,
                                                                engagement: liveScores['engagement'] ?? 3,
                                                                clarity: liveScores['clarity'] ?? 3,
                                                                management: liveScores['management'] ?? 3,
                                                                outcomes: liveScores['outcomes'] ?? 3,
                                                                improvements: liveNotes || 'No specific improvements noted.',
                                                            },
                                                        }));
                                                        setObservingId(null);
                                                        setLiveScores({});
                                                        setLiveNotes('');
                                                    }}
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />Submit Observation
                                                </Button>
                                                <Button variant="outline" className="h-9 text-xs font-bold rounded-xl border-slate-200 text-slate-600 px-4"
                                                    onClick={() => setObservingId(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : completedObs[selected.id] ? (
                                        /* ─── Just submitted – show result ─── */
                                        <div className="space-y-3">
                                            <div className="p-3 bg-emerald-50 rounded-xl flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                                <p className="text-xs font-black text-emerald-700">Observation recorded successfully</p>
                                            </div>
                                            {Object.entries(completedObs[selected.id]).filter(([k]) => k !== 'improvements').map(([k, v]) => (
                                                <div key={k} className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-600 capitalize flex-1">{k}</span>
                                                    <ProgressBar value={(v as number) * 20} color="bg-indigo-500" />
                                                    <span className="text-xs font-black text-indigo-600 w-8 text-right">{v as number}/5</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-6 text-center">
                                            <Calendar className="h-10 w-10 text-slate-300 mb-3" />
                                            <p className="text-sm font-bold text-slate-500">Observation {selected.status}</p>
                                            <p className="text-xs text-slate-400 mt-1">Scheduled for {selected.date}</p>
                                        </div>
                                    )}
                                    {selected.status === 'Scheduled' && !observingId && !completedObs[selected.id] && (
                                        <div className="grid grid-cols-1 gap-2 mt-2">
                                            <Button
                                                className="w-full h-9 text-xs font-bold rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                onClick={() => { setObservingId(selected.id); setLiveScores({}); setLiveNotes(''); }}
                                            >
                                                <Eye className="h-3.5 w-3.5" />Begin Observation
                                            </Button>
                                            <Button variant="outline" className="w-full h-9 text-xs font-bold rounded-xl gap-2 border-slate-200 text-slate-600">
                                                <Calendar className="h-3.5 w-3.5" />Reschedule
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                        <Eye className="h-12 w-12 mb-3 opacity-40" />
                        <p className="text-sm font-bold text-slate-400">Select an observation</p>
                        <p className="text-xs text-slate-400 mt-1">Click any record on the left to view scoring detail and actions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TeacherPerformanceTab: React.FC = () => {
    const [expandedTeacher, setExpandedTeacher] = useState<number | null>(null);
    const [appraisalInitiated, setAppraisalInitiated] = useState<number[]>([]);

    const performanceData = teachers.map(t => {
        const obs = observations.find(o => o.teacher === t.name && o.status === 'Completed');
        const coverageScore = pct(t);
        const obsScore = obs ? Math.round(((obs.methodology + obs.engagement + obs.clarity + obs.management + obs.outcomes) / 25) * 100) : null;
        const backlogScore = t.status === 'Healthy' ? 100 : t.status === 'Warning' ? 70 : t.status === 'Backlog Detected' ? 40 : 10;
        const overall = obsScore !== null ? Math.round((coverageScore + obsScore + backlogScore) / 3) : Math.round((coverageScore + backlogScore) / 2);
        return { ...t, coverageScore, obsScore, backlogScore, overall, obs };
    });

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                <Target className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-black text-indigo-900">Appraisal Integration Active</p>
                    <p className="text-xs text-indigo-600 mt-0.5">Data feeds into the Teacher Appraisal system — curriculum coverage, backlog management, and observation results contribute to composite performance score. Click any teacher to view breakdown and initiate appraisal.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <CardTitle className="text-base font-black text-slate-900">Teacher Performance Composite Score</CardTitle>
                    <p className="text-xs text-slate-400 mt-1">Click any row to view full score breakdown and appraisal actions</p>
                </CardHeader>
                <CardContent className="p-0">
                    {performanceData.map(t => {
                        const isOpen = expandedTeacher === t.id;
                        const hasAppraisal = appraisalInitiated.includes(t.id);
                        const overallColor = t.overall >= 80 ? 'emerald' : t.overall >= 60 ? 'amber' : 'red';
                        return (
                            <div key={t.id} className="border-b border-slate-50 last:border-0">
                                {/* Summary row – clickable */}
                                <div
                                    onClick={() => setExpandedTeacher(isOpen ? null : t.id)}
                                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors select-none ${isOpen ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                >
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900">{t.name}</p>
                                        <p className="text-xs text-slate-400">{t.subject} · {t.grade}</p>
                                    </div>
                                    <div className="hidden md:flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold">Coverage</p>
                                            <p className="text-sm font-black text-slate-700">{t.coverageScore}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold">Observation</p>
                                            <p className="text-sm font-black text-slate-700">{t.obsScore !== null ? `${t.obsScore}%` : '–'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold">Backlog</p>
                                            <Badge className={`border-none text-[9px] font-bold ${getStatusColors(t.status).badge}`}>{t.status}</Badge>
                                        </div>
                                    </div>
                                    <div className={`text-xl font-black text-${overallColor}-600 w-14 text-right flex-shrink-0`}>{t.overall}%</div>
                                    {hasAppraisal && <Badge className="bg-emerald-50 text-emerald-700 border-none text-[9px] font-bold flex-shrink-0">Appraisal ✓</Badge>}
                                    <ChevronRight className={`h-4 w-4 text-slate-300 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                </div>

                                {/* Expanded detail panel */}
                                {isOpen && (
                                    <div className="bg-slate-50/60 border-t border-slate-100 px-6 py-5 space-y-5">
                                        {/* Score breakdown */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: 'Curriculum Coverage', value: t.coverageScore, color: t.coverageScore >= 90 ? 'emerald' : t.coverageScore >= 80 ? 'amber' : 'red', sub: `${t.completed}/${t.planned} lessons` },
                                                { label: 'Observation Score', value: t.obsScore ?? 0, color: t.obsScore !== null ? (t.obsScore >= 80 ? 'emerald' : t.obsScore >= 60 ? 'amber' : 'red') : 'slate', sub: t.obsScore !== null ? 'Completed' : 'Pending observation' },
                                                { label: 'Backlog Management', value: t.backlogScore, color: t.backlogScore >= 80 ? 'emerald' : t.backlogScore >= 60 ? 'amber' : 'red', sub: t.status },
                                            ].map(s => (
                                                <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                                                    <p className={`text-2xl font-black text-${s.color}-600 mb-1`}>{s.value > 0 ? `${s.value}%` : '–'}</p>
                                                    <ProgressBar value={s.value} color={`bg-${s.color}-500`} />
                                                    <p className="text-[10px] text-slate-400 mt-1.5">{s.sub}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Observation criteria if available */}
                                        {t.obs && (
                                            <div className="bg-white rounded-xl border border-slate-100 p-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Observation Detail – {t.obs.date}</p>
                                                <div className="space-y-2">
                                                    {[
                                                        { label: 'Teaching Methodology', score: t.obs.methodology },
                                                        { label: 'Student Engagement', score: t.obs.engagement },
                                                        { label: 'Curriculum Clarity', score: t.obs.clarity },
                                                        { label: 'Classroom Management', score: t.obs.management },
                                                        { label: 'Learning Outcomes', score: t.obs.outcomes },
                                                    ].map(c => (
                                                        <div key={c.label} className="flex items-center gap-3">
                                                            <span className="text-xs text-slate-600 w-44 flex-shrink-0">{c.label}</span>
                                                            <div className="flex-1"><ProgressBar value={c.score * 20} color={c.score >= 4 ? 'bg-emerald-500' : c.score >= 3 ? 'bg-amber-500' : 'bg-red-500'} /></div>
                                                            <span className="text-xs font-black text-slate-600 w-8 text-right">{c.score}/5</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {t.obs.improvements && (
                                                    <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                                                        <p className="text-[10px] font-black text-amber-900 mb-1">Improvement Area</p>
                                                        <p className="text-xs text-amber-800">{t.obs.improvements}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Overall + actions */}
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-1 p-4 bg-${overallColor}-50 rounded-xl`}>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Composite Score</p>
                                                <p className={`text-3xl font-black text-${overallColor}-600`}>{t.overall}%</p>
                                                <p className="text-xs text-slate-400 mt-1">{t.obsScore !== null ? 'Avg of 3 metrics' : 'Avg of 2 metrics (obs pending)'}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    className={`h-9 text-xs font-bold rounded-xl px-4 gap-2 ${hasAppraisal ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                        }`}
                                                    onClick={() => setAppraisalInitiated(prev => [...prev, t.id])}
                                                >
                                                    <Star className="h-3.5 w-3.5" />
                                                    {hasAppraisal ? '✓ Appraisal Initiated' : 'Initiate Appraisal'}
                                                </Button>
                                                <Button variant="outline" className="h-9 text-xs font-bold rounded-xl px-4 gap-2 border-slate-200 text-slate-600">
                                                    <FileText className="h-3.5 w-3.5" />Generate Report
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

// ─── Configuration Sub-Module ─────────────────────────────────────────────────

const ConfigurationTab: React.FC = () => {
    const [saved, setSaved] = useState<Record<string, boolean>>({});
    const [config, setConfig] = useState({
        // Lesson planning
        sessionDuration: 45,
        planTemplate: 'Standard',
        autoPublish: true,
        // Curriculum
        coverageThreshold: 85,
        // Backlog monitoring
        backlogAlertAt: 3,
        autoFlag: true,
        // Recovery scheduling
        autoDetectSlots: true,
        minGapDays: 2,
        maxRecoveryPerWeek: 3,
        // Classroom observation
        observFrequency: 2,
        obsRubric: 'Standard 5-point',
        // Teacher appraisal weightings
        coverageWeight: 40,
        obsWeight: 40,
        backlogWeight: 20,
    });

    const handleSave = (section: string) => {
        setSaved(prev => ({ ...prev, [section]: true }));
        setTimeout(() => setSaved(prev => ({ ...prev, [section]: false })), 2000);
    };

    const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`relative h-5 w-9 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
        >
            <span className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : ''
                }`} />
        </button>
    );

    const ConfigSection: React.FC<{ title: string; icon: React.ElementType; desc: string; sectionKey: string; children: React.ReactNode }> = ({
        title, icon: Icon, desc, sectionKey, children
    }) => (
        <Card className="border-none shadow-sm">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg"><Icon className="h-4 w-4 text-indigo-600" /></div>
                    <div className="flex-1">
                        <CardTitle className="text-sm font-black text-slate-900">{title}</CardTitle>
                        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    <Button
                        size="sm"
                        className={`h-8 text-xs font-bold rounded-lg px-4 ${saved[sectionKey] ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        onClick={() => handleSave(sectionKey)}
                    >
                        {saved[sectionKey] ? '✓ Saved' : 'Save'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">{children}</CardContent>
        </Card>
    );

    const Row: React.FC<{ label: string; sub?: string; children: React.ReactNode }> = ({ label, sub, children }) => (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{label}</p>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
            {children}
        </div>
    );

    return (
        <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3">
                <Settings className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-black text-slate-800">Module Configuration</p>
                    <p className="text-xs text-slate-500 mt-0.5">Configure rules, thresholds, and defaults for each sub-module. Changes apply to all teachers and classes in this instance.</p>
                </div>
            </div>

            <ConfigSection title="Lesson Planning" icon={FileText} desc="Session defaults and plan templates" sectionKey="lessonPlanning">
                <Row label="Default Session Duration" sub="Applied when creating new plan entries">
                    <div className="flex items-center gap-2">
                        <input type="number" value={config.sessionDuration} min={30} max={90} step={5}
                            onChange={e => setConfig(c => ({ ...c, sessionDuration: +e.target.value }))}
                            className="w-20 text-sm font-bold text-center border border-slate-200 rounded-lg h-8 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="text-xs text-slate-400">mins</span>
                    </div>
                </Row>
                <Row label="Default Plan Template" sub="Template applied to new lesson plans">
                    <select value={config.planTemplate}
                        onChange={e => setConfig(c => ({ ...c, planTemplate: e.target.value }))}
                        className="text-sm border border-slate-200 rounded-lg h-8 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Standard</option>
                        <option>Detailed</option>
                        <option>Compact</option>
                    </select>
                </Row>
                <Row label="Auto-publish lesson plans" sub="Automatically publish plans on creation">
                    <Toggle checked={config.autoPublish} onChange={v => setConfig(c => ({ ...c, autoPublish: v }))} />
                </Row>
            </ConfigSection>

            <ConfigSection title="Curriculum Tracking" icon={TrendingUp} desc="Coverage thresholds and alert triggers" sectionKey="curriculum">
                <Row label="Coverage Alert Threshold" sub="Trigger alert when coverage falls below this">
                    <div className="flex items-center gap-2">
                        <input type="number" value={config.coverageThreshold} min={50} max={100}
                            onChange={e => setConfig(c => ({ ...c, coverageThreshold: +e.target.value }))}
                            className="w-20 text-sm font-bold text-center border border-slate-200 rounded-lg h-8 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="text-xs text-slate-400">%</span>
                    </div>
                </Row>
                <div>
                    <div className="flex justify-between mb-1">
                        <p className="text-sm font-bold text-slate-800">Threshold Preview</p>
                        <span className={`text-xs font-black ${config.coverageThreshold >= 90 ? 'text-emerald-600' : config.coverageThreshold >= 75 ? 'text-amber-500' : 'text-red-500'}`}>{config.coverageThreshold}%</span>
                    </div>
                    <ProgressBar value={config.coverageThreshold} color={config.coverageThreshold >= 90 ? 'bg-emerald-500' : config.coverageThreshold >= 75 ? 'bg-amber-400' : 'bg-red-500'} />
                </div>
            </ConfigSection>

            <ConfigSection title="Backlog Monitoring" icon={AlertTriangle} desc="Backlog detection rules and auto-flagging" sectionKey="backlog">
                <Row label="Flag backlog when missed sessions ≥" sub="Sessions behind before a backlog alert is raised">
                    <div className="flex items-center gap-2">
                        <input type="number" value={config.backlogAlertAt} min={1} max={10}
                            onChange={e => setConfig(c => ({ ...c, backlogAlertAt: +e.target.value }))}
                            className="w-16 text-sm font-bold text-center border border-slate-200 rounded-lg h-8 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="text-xs text-slate-400">sessions</span>
                    </div>
                </Row>
                <Row label="Auto-flag teachers with backlog" sub="Automatically mark teacher status as 'Backlog Detected'">
                    <Toggle checked={config.autoFlag} onChange={v => setConfig(c => ({ ...c, autoFlag: v }))} />
                </Row>
            </ConfigSection>

            <ConfigSection title="Backlog Recovery Scheduling" icon={Calendar} desc="Auto-detection rules for free-period scheduling" sectionKey="recovery">
                <Row label="Auto-detect common free periods" sub="System scans timetables to suggest slots">
                    <Toggle checked={config.autoDetectSlots} onChange={v => setConfig(c => ({ ...c, autoDetectSlots: v }))} />
                </Row>
                <Row label="Minimum gap between recovery sessions" sub="Days between consecutive recovery classes for same teacher">
                    <div className="flex items-center gap-2">
                        <input type="number" value={config.minGapDays} min={1} max={7}
                            onChange={e => setConfig(c => ({ ...c, minGapDays: +e.target.value }))}
                            className="w-16 text-sm font-bold text-center border border-slate-200 rounded-lg h-8 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="text-xs text-slate-400">days</span>
                    </div>
                </Row>
                <Row label="Max recovery sessions per week" sub="Cap on number of extra recovery classes per teacher per week">
                    <div className="flex items-center gap-2">
                        <input type="number" value={config.maxRecoveryPerWeek} min={1} max={7}
                            onChange={e => setConfig(c => ({ ...c, maxRecoveryPerWeek: +e.target.value }))}
                            className="w-16 text-sm font-bold text-center border border-slate-200 rounded-lg h-8 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="text-xs text-slate-400">sessions</span>
                    </div>
                </Row>
            </ConfigSection>

            <ConfigSection title="Classroom Observation" icon={Eye} desc="Observation frequency and scoring rubric" sectionKey="observation">
                <Row label="Minimum observations per teacher per term" sub="Observers are prompted when count is below this">
                    <div className="flex items-center gap-2">
                        <input type="number" value={config.observFrequency} min={1} max={6}
                            onChange={e => setConfig(c => ({ ...c, observFrequency: +e.target.value }))}
                            className="w-16 text-sm font-bold text-center border border-slate-200 rounded-lg h-8 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="text-xs text-slate-400">/ term</span>
                    </div>
                </Row>
                <Row label="Scoring Rubric" sub="Rubric applied to all classroom observations">
                    <select value={config.obsRubric}
                        onChange={e => setConfig(c => ({ ...c, obsRubric: e.target.value }))}
                        className="text-sm border border-slate-200 rounded-lg h-8 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Standard 5-point</option>
                        <option>Extended 10-point</option>
                        <option>Pass / Fail</option>
                    </select>
                </Row>
                <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
                    ℹ Observation criteria (Teaching Methodology, Student Engagement, Curriculum Clarity, Classroom Management, Learning Outcomes) are fixed and cannot be changed in this version.
                </div>
            </ConfigSection>

            <ConfigSection title="Teacher Performance & Appraisal" icon={Star} desc="Composite score weightings for the appraisal system" sectionKey="performance">
                <p className="text-xs text-slate-400 -mt-2">Weightings must sum to 100%</p>
                {[
                    { label: 'Curriculum Coverage', key: 'coverageWeight' as const },
                    { label: 'Classroom Observation', key: 'obsWeight' as const },
                    { label: 'Backlog Management', key: 'backlogWeight' as const },
                ].map(m => (
                    <div key={m.key}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-800">{m.label}</span>
                            <span className="text-sm font-black text-indigo-600">{config[m.key]}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={5} value={config[m.key]}
                            onChange={e => setConfig(c => ({ ...c, [m.key]: +e.target.value }))}
                            className="w-full h-1.5 rounded-full accent-indigo-600 cursor-pointer" />
                    </div>
                ))}
                <div className={`p-3 rounded-xl text-xs font-bold ${config.coverageWeight + config.obsWeight + config.backlogWeight === 100
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'
                    }`}>
                    Total weight: {config.coverageWeight + config.obsWeight + config.backlogWeight}%
                    {config.coverageWeight + config.obsWeight + config.backlogWeight !== 100 && ' — must equal 100%'}
                </div>
            </ConfigSection>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const LessonPlan: React.FC = () => {
    const [persona, setPersona] = useState<Persona>('employee');
    const [activeTab, setActiveTab] = useState('overview');

    // Make sure we switch tabs if the active one isn't available for the new persona
    const visibleTabs = TABS.filter(t => t.roles.includes(persona));
    if (!visibleTabs.find(t => t.id === activeTab)) {
        setActiveTab('overview');
    }

    const renderTab = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab />;
            case 'lesson-planning': return <LessonPlanningTab />;
            case 'curriculum': return <CurriculumTrackingTab />;
            case 'backlog': return <BacklogMonitoringTab />;
            case 'recovery': return <BacklogRecoveryTab />;
            case 'observation': return <ClassroomObservationTab />;
            case 'performance': return <TeacherPerformanceTab />;
            case 'configuration': return <ConfigurationTab />;
            default: return <OverviewTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Top nav */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button onClick={() => window.location.href = '/'} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                                <Home className="w-4 h-4" />
                            </button>
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg shadow-md shadow-indigo-300/30">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">Lesson Plan & Curriculum</h1>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Academic Management Suite</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2">
                                <button onClick={() => setPersona('employee')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${persona === 'employee' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Employee</button>
                                <button onClick={() => setPersona('manager')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${persona === 'manager' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Manager</button>
                                <button onClick={() => setPersona('hr')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${persona === 'hr' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>HR/Admin</button>
                            </div>
                            <div className="relative hidden md:block">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input className="h-8 w-52 pl-9 pr-4 bg-slate-100 border-none rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Search subjects, teachers…" />
                            </div>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 text-xs">
                                <Plus className="h-3.5 w-3.5 mr-1.5" />New Plan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
                        {visibleTabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                    {tab.label}
                                    {tab.id === 'backlog' && (
                                        <span className="ml-1 bg-red-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">
                                            {teachers.filter(t => t.status === 'Backlog Detected' || t.status === 'Critical Risk').length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
                {renderTab()}
            </div>
        </div>
    );
};

export default LessonPlan;
