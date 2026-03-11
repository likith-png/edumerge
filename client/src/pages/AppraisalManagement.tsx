import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Target, TrendingUp, Calendar, Award, Users, Zap, Activity, Eye, Trash2, XCircle } from 'lucide-react';
import { calculateAutomatedEvaluation, getMockMetrics } from '../services/evaluationEngine';
import { usePersona } from '../contexts/PersonaContext';
import { getAllCycles, deleteCycle, getCurrentPhase, checkActiveCycle, type AppraisalCycle } from '../services/cycleService';

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

    // Role-based quick actions
    const quickActions = [
        {
            id: 'goals',
            title: 'My Goals',
            description: 'View & track your goals',
            icon: Target,
            color: 'blue',
            route: '/appraisal/goals',
            roles: ['Faculty', 'HOD', 'Management']
        },
        {
            id: 'workflow',
            title: 'Workflow Hub',
            description: 'See current phase & actions',
            icon: Activity,
            color: 'purple',
            route: '/appraisal/workflow',
            roles: ['Faculty', 'HOD', 'Management', 'HR Admin']
        },
        {
            id: 'tracking',
            title: 'Performance Tracking',
            description: 'Monitor KPI progress',
            icon: TrendingUp,
            color: 'green',
            route: '/appraisal/tracking',
            roles: ['Faculty', 'HOD', 'Management']
        },
        {
            id: 'approvals',
            title: 'Pending Approvals',
            description: 'Review staff submissions',
            icon: Users,
            color: 'amber',
            route: '/appraisal/goal-approval',
            roles: ['HOD', 'Management']
        },
        {
            id: 'analytics',
            title: 'Analytics',
            description: 'Department insights',
            icon: Award,
            color: 'indigo',
            route: '/appraisal/analytics',
            roles: ['HOD', 'Management', 'HR Admin']
        },
        {
            id: 'portfolio',
            title: 'My Portfolio',
            description: 'Complete performance history',
            icon: Users,
            color: 'pink',
            route: '/staff-portfolio/' + (user?.id || 'FAC001'),
            roles: ['Faculty', 'HOD', 'Management']
        },
        {
            id: 'kra-kpi-approvals',
            title: 'KRA/KPI Approvals',
            description: 'Review updated KRAs & KPIs',
            icon: Target,
            color: 'red',
            route: '/appraisal/kra-kpi-approvals',
            roles: ['HOD', 'Management', 'HR Admin']
        }
    ];

    const visibleActions = quickActions.filter(action => {
        // First filter by role
        if (!action.roles.includes(role)) return false;

        // Then filter by active cycle configuration if one exists
        if (activeCycle && activeCycle.enabledStages) {
            const { enabledStages } = activeCycle;

            // Goals / KRA Approval -> depends on KRA
            if ((action.id === 'goals' || action.id === 'kra-kpi-approvals') && !enabledStages.kra && !enabledStages.kpi) return false;

            // Performance tracking -> relies on KPI usually
            if (action.id === 'tracking' && !enabledStages.kpi) return false;

            // Approvals -> depends on Review/Feedback/KRA
            if (action.id === 'approvals' && !enabledStages.review && !enabledStages.kra) return false;
        }

        return true;
    });

    return (
        <Layout
            title="Appraisal & Performance"
            description="Automated evaluation and performance management"
            icon={Target}
        >
            {/* Section 1: Quick Actions */}
            <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {visibleActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.id}
                                    onClick={() => navigate(action.route)}
                                    className={`p-4 rounded-lg border-2 border-${action.color}-200 bg-white hover:bg-${action.color}-50 transition-all hover:shadow-md text-left`}
                                >
                                    <Icon className={`h-6 w-6 text-${action.color}-600 mb-2`} />
                                    <h3 className="font-semibold text-sm text-slate-900">{action.title}</h3>
                                    <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section 2: Current Cycle Status */}
                <Card className="flex flex-col h-full">
                    <CardHeader className="pb-3 bg-purple-50 border-b border-purple-100 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Appraisal Cycles
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-purple-200 text-purple-700 hover:bg-purple-100"
                            onClick={() => navigate('/appraisal/setup-wizard')}
                        >
                            <Calendar className="h-3.5 w-3.5 mr-1" /> New Cycle
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1">
                        <div className="space-y-4">
                            {cycles.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                        <Calendar className="h-6 w-6 text-slate-300" />
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-900">No cycles created yet</h3>
                                    <p className="text-xs text-slate-500 mt-1 mb-4">Start by creating your first appraisal cycle</p>
                                    <Button onClick={() => navigate('/appraisal/setup-wizard')} size="sm">
                                        Launch Setup Wizard
                                    </Button>
                                </div>
                            ) : (
                                cycles.map(cycle => {
                                    const currentPhase = getCurrentPhase(cycle);
                                    // Mock progress logic
                                    const progress = 45; // Placeholder

                                    return (
                                        <div key={cycle.id} className="p-3 border rounded-lg border-slate-200 hover:border-purple-300 transition-colors bg-slate-50/50">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-sm">{cycle.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[9px] py-0 h-4 bg-purple-50 text-purple-700 border-purple-100">
                                                            {currentPhase?.name || 'Not Started'}
                                                        </Badge>
                                                        <span className="text-[10px] text-slate-500">
                                                            {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-blue-600"
                                                        onClick={() => setSelectedCycle(cycle)}
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-red-600"
                                                        onClick={() => handleDeleteCycle(cycle.id)}
                                                        title="Delete Cycle"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-[10px] mb-1">
                                                    <span className="text-slate-500 font-medium">Cycle Heat: {progress}%</span>
                                                    <span className="text-purple-700 font-semibold">{cycle.status.toUpperCase()}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-purple-600 h-1.5 rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {cycles.length > 0 && (
                                <Button
                                    onClick={() => navigate('/appraisal/workflow')}
                                    className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
                                >
                                    View Active Workflow Hub
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Auto-Evaluation Summary */}
                <Card>
                    <CardHeader className="pb-3 bg-green-50 border-b border-green-100">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            AI Performance Snapshot
                            <Badge className="bg-green-600 text-white text-[10px]">AUTO-GENERATED</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {autoEval && (
                            <div className="space-y-4">
                                {/* Overall Rating */}
                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <div className="text-4xl font-bold text-green-900">
                                        {autoEval.overallRating}/5
                                    </div>
                                    <div className="text-sm text-green-700 mt-1">Current Performance Rating</div>
                                    <Badge className="mt-2 bg-green-600 text-white">
                                        {autoEval.performanceBand}
                                    </Badge>
                                </div>

                                {/* Component Scores */}
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-900 mb-2">
                                        Performance Breakdown
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-blue-50 rounded border border-blue-100">
                                            <div className="text-2xl font-bold text-blue-900">
                                                {autoEval.componentScores.academic}
                                            </div>
                                            <div className="text-[10px] text-blue-700">Academic (40%)</div>
                                        </div>
                                        <div className="p-2 bg-purple-50 rounded border border-purple-100">
                                            <div className="text-2xl font-bold text-purple-900">
                                                {autoEval.componentScores.professional}
                                            </div>
                                            <div className="text-[10px] text-purple-700">Professional (30%)</div>
                                        </div>
                                        <div className="p-2 bg-amber-50 rounded border border-amber-100">
                                            <div className="text-2xl font-bold text-amber-900">
                                                {autoEval.componentScores.development}
                                            </div>
                                            <div className="text-[10px] text-amber-700">Development (20%)</div>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded border border-slate-200">
                                            <div className="text-2xl font-bold text-slate-900">
                                                {autoEval.componentScores.compliance}
                                            </div>
                                            <div className="text-[10px] text-slate-700">Compliance (10%)</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Strengths */}
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-900 mb-2">Key Strengths</h4>
                                    <ul className="space-y-1">
                                        {autoEval.strengths.slice(0, 2).map((strength: string, idx: number) => (
                                            <li key={idx} className="text-xs text-green-700 flex items-start gap-1">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Predicted Year-End */}
                                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                                    <p className="text-xs text-indigo-900">
                                        <strong>Projected Year-End Rating:</strong>{' '}
                                        {autoEval.predictedYearEndRating}/5
                                    </p>
                                    <p className="text-[10px] text-indigo-700 mt-1">
                                        Based on current performance trend
                                    </p>
                                </div>

                                <Button
                                    onClick={() => navigate('/appraisal/tracking')}
                                    variant="outline"
                                    className="w-full border-green-300 text-green-700"
                                >
                                    View Detailed Performance
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info Banner */}
            <Card className="mt-6 border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                    <p className="text-sm text-blue-900">
                        <strong>Smart Automation:</strong> Your performance is automatically tracked from student
                        results, attendance, feedback, and training completion. Review the AI-generated summary
                        above and update manually if needed.
                    </p>
                </CardContent>
            </Card>
            {/* Cycle Details Modal */}
            {selectedCycle && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center justify-between sticky top-0 z-10">
                            <div>
                                <CardTitle className="text-xl">{selectedCycle.name}</CardTitle>
                                <p className="text-xs text-blue-100 mt-1">Full Appraisal Parameters</p>
                            </div>
                            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setSelectedCycle(null)}>
                                <XCircle className="h-6 w-6" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Phases */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                                    <Activity className="h-4 w-4 text-purple-600" />
                                    Workflow Timeline
                                </h3>
                                <div className="space-y-2">
                                    {selectedCycle.phases.map(p => (
                                        <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                                            <span className="font-semibold text-slate-700">{p.name}</span>
                                            <span className="text-slate-500">
                                                {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weightages */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                                    <Target className="h-4 w-4 text-blue-600" />
                                    Component Weightages
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(selectedCycle.weightages).map(([cat, val]) => (
                                        <div key={cat} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">{cat}</div>
                                            <div className="text-2xl font-bold text-blue-900">{val}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Rules */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                                    <Award className="h-4 w-4 text-amber-600" />
                                    Rating Thresholds
                                </h3>
                                <div className="border rounded-lg overflow-hidden border-slate-200">
                                    <table className="w-full text-[10px]">
                                        <thead className="bg-slate-50 text-slate-500 border-b">
                                            <tr>
                                                <th className="px-3 py-2 text-left">Band</th>
                                                <th className="px-3 py-2 text-center">Pass %</th>
                                                <th className="px-3 py-2 text-center">Attend %</th>
                                                <th className="px-3 py-2 text-center">FB Score</th>
                                                <th className="px-3 py-2 text-center">FDP Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-slate-700">
                                            {Object.entries(selectedCycle.ratingRules).map(([band, rules]) => (
                                                <tr key={band}>
                                                    <td className="px-3 py-2 font-bold capitalize">{band}</td>
                                                    <td className="px-3 py-2 text-center">{rules.passPercentage}%</td>
                                                    <td className="px-3 py-2 text-center">{rules.attendance}%</td>
                                                    <td className="px-3 py-2 text-center">{rules.feedback}</td>
                                                    <td className="px-3 py-2 text-center">{rules.trainingCourses}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Button className="w-full" onClick={() => setSelectedCycle(null)}>Close Inspection</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Layout>
    );
};

export default AppraisalManagement;
