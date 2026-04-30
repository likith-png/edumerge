import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    CheckCircle, Calendar, Settings, Star, Rocket,
    ArrowRight, ArrowLeft, Target, TrendingUp, Users, Award,
    CheckCircle2, AlertCircle, Info, Activity, History,
    Eye, Trash2, XCircle, ShieldCheck, Zap,
    ChevronRight, LayoutGrid, Clock, Sparkles, Plus
} from 'lucide-react';
import { calculateAutomatedEvaluation, getMockMetrics } from '../services/evaluationEngine';
import { usePersona } from '../contexts/PersonaContext';
import { getAllCycles, deleteCycle, getCurrentPhase, checkActiveCycle, type AppraisalCycle } from '../services/cycleService';
import { Separator } from '../components/ui/separator';

const AppraisalManagement: React.FC = () => {
    const navigate = useNavigate();
    const { role, user } = usePersona();
    const [autoEval, setAutoEval] = useState<any>(null);
    const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
    const [activeCycle, setActiveCycle] = useState<AppraisalCycle | null>(null);
    const [selectedCycle, setSelectedCycle] = useState<AppraisalCycle | null>(null);

    useEffect(() => {
        // Load cycles
        const allCycles = getAllCycles();
        setCycles(allCycles);

        // Load active cycle
        const currentActive = checkActiveCycle();
        setActiveCycle(currentActive);

        // Load automated evaluation
        const metrics = getMockMetrics();
        const evaluation = calculateAutomatedEvaluation(metrics);
        setAutoEval(evaluation);
    }, [user]);

    const handleDeleteCycle = (id: string) => {
        if (confirm('Are you sure you want to delete this appraisal cycle?')) {
            deleteCycle(id);
            setCycles(getAllCycles());
        }
    };

    const quickActions = [
        { id: 'goals', title: 'My Strategic Goals', desc: 'Personal KPI Mapping', icon: Target, color: 'indigo', route: '/appraisal/goals', roles: ['Faculty', 'HOD', 'Management'] },
        { id: 'workflow', title: 'Workflow Hub', desc: 'Phase Execution Trace', icon: Activity, color: 'indigo', route: '/appraisal/workflow', roles: ['Faculty', 'HOD', 'Management', 'HR_ADMIN'] },
        { id: 'tracking', title: 'Metric Tracking', desc: 'Real-time Pulse Monitoring', icon: TrendingUp, color: 'emerald', route: '/appraisal/tracking', roles: ['Faculty', 'HOD', 'Management'] },
        { id: 'approvals', title: 'Governance Queue', desc: 'Authorization Matrix', icon: ShieldCheck, color: 'orange', route: '/appraisal/goal-approval', roles: ['HOD', 'Management'] },
        { id: 'analytics', title: 'Intelligence', desc: 'Institutional Data Synthesis', icon: Zap, color: 'rose', route: '/appraisal/analytics', roles: ['HOD', 'Management', 'HR_ADMIN'] },
        { id: 'portfolio', title: 'History Trace', desc: 'Longitudinal Record Archive', icon: Users, color: 'slate', route: '/staff-portfolio/' + (user?.id || 'FAC001'), roles: ['Faculty', 'HOD', 'Management'] },
        { id: 'kra-kpi-approvals', title: 'KRA/KPI Registry', desc: 'Strategic Parameter Audit', icon: Award, color: 'indigo', route: '/appraisal/kra-kpi-approvals', roles: ['HOD', 'Management', 'HR_ADMIN'] }
    ];

    const visibleActions = quickActions.filter(action => {
        if (!action.roles.includes(role)) return false;
        if (activeCycle && activeCycle.enabledStages) {
            const { enabledStages } = activeCycle;
            if ((action.id === 'goals' || action.id === 'kra-kpi-approvals') && !enabledStages.kra && !enabledStages.kpi) return false;
            if (action.id === 'tracking' && !enabledStages.kpi) return false;
            if (action.id === 'approvals' && !enabledStages.review && !enabledStages.kra) return false;
        }
        return true;
    });

    return (
        <Layout
            title="Appraisal Management"
            description="Institutional appraisal cycles, performance goals, and review workflows."
            icon={Target}
        >
            <div className="space-y-6 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visibleActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => navigate(action.route)}
                            className="p-6 border border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col gap-4 group"
                        >
                            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{action.title}</h4>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{action.desc}</p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Execute</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
                            </div>
                        </button>
                    ))}

                        {/* Add New Cycle Action (Glass Dotted) */}
                        {role === 'HR_ADMIN' && (
                            <button
                                onClick={() => navigate('/appraisal/setup-wizard')}
                                className="p-6 rounded-xl border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all text-center flex flex-col items-center justify-center gap-3 group"
                            >
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                    <Plus className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Create New cycle</h4>
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                            <div className="px-6 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-900 rounded-xl text-white shadow-md">
                                        <LayoutGrid className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Appraisal Cycles</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Historical Review Repository</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none font-bold text-[10px] tracking-widest px-4 py-1">
                                    ACTIVE
                                </Badge>
                            </div>
                            <div className="p-6 space-y-4 flex-1">
                                {cycles.length === 0 ? (
                                    <div className="py-20 text-center space-y-4 text-slate-400 italic">
                                        <p className="text-xs uppercase tracking-widest">No active cycles detected</p>
                                    </div>
                                ) : (
                                    cycles.map(cycle => {
                                        const progress = 45; // Mock progress
                                        return (
                                            <div key={cycle.id} className="p-6 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 group">
                                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                            <Clock className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-md font-bold text-slate-900 tracking-tight">{cycle.name}</h3>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <Badge variant="secondary" className="bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-0.5">{'In Progress'}</Badge>
                                                                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
 
                                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                                        <div className="flex-1 md:w-48">
                                                            <div className="flex justify-between items-end mb-1.5">
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Progress</p>
                                                                <p className="text-[11px] font-bold text-indigo-600">{progress}%</p>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 text-slate-600 hover:text-indigo-600" onClick={() => setSelectedCycle(cycle)}>
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            {role === 'HR_ADMIN' && (
                                                                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 text-slate-600 hover:text-rose-600" onClick={() => handleDeleteCycle(cycle.id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col sticky top-6">
                            <div className="px-6 py-8 border-b border-slate-100 bg-slate-900 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg text-white">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight">AI Insights</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Evaluation Summary</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-8">
                                {autoEval && (
                                    <div className="space-y-8">
                                        <div className="text-center p-8 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center">
                                            <h1 className="text-6xl font-bold text-slate-900 tracking-tighter">{autoEval.overallRating}</h1>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Overall Score</p>
                                            <Badge className="mt-6 bg-slate-900 text-white hover:bg-slate-900 px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-none">
                                                {autoEval.performanceBand} BAND
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'Academic', val: autoEval.componentScores.academic, color: 'text-blue-700', bg: 'bg-blue-50' },
                                                { label: 'Professional', val: autoEval.componentScores.professional, color: 'text-indigo-700', bg: 'bg-indigo-50' },
                                                { label: 'Culture', val: autoEval.componentScores.development, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                                                { label: 'Compliance', val: autoEval.componentScores.compliance, color: 'text-rose-700', bg: 'bg-rose-50' }
                                            ].map((stat, i) => (
                                                <div key={i} className={`p-4 ${stat.bg} border border-white/50 rounded-xl text-center shadow-sm`}>
                                                    <h4 className={`text-xl font-bold ${stat.color}`}>{stat.val}</h4>
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-70">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-6 bg-slate-900 rounded-xl text-white space-y-3 relative overflow-hidden">
                                            <div className="flex items-center gap-3 relative z-10 text-slate-400">
                                                <ShieldCheck className="w-4 h-4" />
                                                <p className="text-[9px] font-bold uppercase tracking-widest">Projection</p>
                                            </div>
                                            <div className="flex justify-between items-center relative z-10">
                                                <h3 className="text-2xl font-bold text-white tracking-tight">{autoEval.predictedYearEndRating}<span className="text-xs opacity-40 ml-1">/5.0</span></h3>
                                                <div className="text-right">
                                                    <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Year-End Goal</div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button className="w-full h-12 rounded-lg bg-indigo-600 text-white hover:bg-black font-bold uppercase text-[10px] tracking-widest shadow-md transition-all border-none">
                                            Detailed Report
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inspect Modal Refactor */}
                {selectedCycle && (
                    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4">
                        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl rounded-xl bg-white animate-in zoom-in-95 duration-300">
                            <CardHeader className="p-8 border-b border-slate-100 bg-slate-900 text-white flex flex-row items-center justify-between sticky top-0 z-10">
                                <div>
                                    <CardTitle className="text-xl font-bold">{selectedCycle.name}</CardTitle>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Institutional Governance Configuration</p>
                                </div>
                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-lg text-white hover:bg-white/10" onClick={() => setSelectedCycle(null)}>
                                    <XCircle className="w-6 h-6" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-8 space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                                            Cycle Workflow
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedCycle.phases.map((p, i) => (
                                                <div key={p.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-700">{i + 1}. {p.name}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{p.startDate} — {p.endDate}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                                            Performance Weights
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(selectedCycle.weightages).map(([cat, val]) => (
                                                <div key={cat} className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center shadow-sm">
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{cat}</p>
                                                    <h4 className="text-lg font-bold text-slate-900">{val}%</h4>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-slate-100" />

                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber-600 rounded-full" />
                                        Threshold Requirements
                                    </h3>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500">Band</th>
                                                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 text-center">Score %</th>
                                                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 text-center">Attendance</th>
                                                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 text-center">Feedback</th>
                                                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 text-center">Training</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {Object.entries(selectedCycle.ratingRules).map(([band, rules]) => (
                                                    <tr key={band} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 text-xs font-bold text-slate-700 uppercase">{band}</td>
                                                        <td className="px-6 py-4 text-xs font-bold text-center text-slate-600">{rules.passPercentage}%</td>
                                                        <td className="px-6 py-4 text-xs font-bold text-center text-slate-600">{rules.attendance}%</td>
                                                        <td className="px-6 py-4 text-xs font-bold text-center text-slate-600 uppercase">{rules.feedback}</td>
                                                        <td className="px-6 py-4 text-xs font-bold text-center text-slate-600">{rules.trainingCourses} Modules</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-lg font-bold uppercase text-[10px] tracking-widest transition-all" onClick={() => setSelectedCycle(null)}>Close Inspection</Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
        </Layout>
    );
};

export default AppraisalManagement;
