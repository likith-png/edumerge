import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    Target,
    TrendingUp,
    MessageSquare,
    FileText,
    BarChart3,
    CheckCircle2,
    DollarSign,
    Lock,
    AlertCircle,
    Calendar,
    Clock,
    ArrowRight,
    Settings
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import {
    getActiveCycle,
    getMyAppraisalInstance,
    getAvailableActions,
    getUpcomingDeadlines,
    WorkflowPhase,
    type AppraisalCycle,
    type AppraisalInstance
} from '../services/workflowService';

const AppraisalWorkflowHub: React.FC = () => {
    const navigate = useNavigate();
    const { role } = usePersona();
    const [activeCycle] = useState<AppraisalCycle>(getActiveCycle());
    const [myAppraisal] = useState<AppraisalInstance>(getMyAppraisalInstance(role));
    const upcomingDeadlines = getUpcomingDeadlines(activeCycle);
    const availableActions = getAvailableActions(myAppraisal, role);

    // Workflow Phases Configuration
    const workflowPhases = [
        { phase: WorkflowPhase.NOT_STARTED, icon: Clock, label: 'Not Started', color: 'bg-slate-400' },
        { phase: WorkflowPhase.GOAL_SETTING, icon: Target, label: 'Goal Setting', color: 'bg-blue-600', route: '/appraisal/goals' },
        { phase: WorkflowPhase.IN_PROGRESS, icon: TrendingUp, label: 'In Progress', color: 'bg-indigo-600', route: '/appraisal/tracking' },
        { phase: WorkflowPhase.MID_REVIEW, icon: FileText, label: 'Mid Review', color: 'bg-purple-600', route: '/appraisal/mid-review' },
        { phase: WorkflowPhase.FEEDBACK_COLLECTION, icon: MessageSquare, label: '360° Feedback', color: 'bg-pink-600', route: '/appraisal/feedback360' },
        { phase: WorkflowPhase.FINAL_REVIEW, icon: CheckCircle2, label: 'Final Review', color: 'bg-amber-600', route: '/appraisal/teacher-form' },
        { phase: WorkflowPhase.CALIBRATION, icon: BarChart3, label: 'Calibration', color: 'bg-orange-600', route: '/appraisal/calibration' },
        { phase: WorkflowPhase.APPROVED, icon: CheckCircle2, label: 'Approved', color: 'bg-green-600', route: '/appraisal/final-approval' },
        { phase: WorkflowPhase.INCREMENT_PROCESSED, icon: DollarSign, label: 'Increment', color: 'bg-emerald-600', route: '/appraisal/increment' },
        { phase: WorkflowPhase.CLOSED, icon: Lock, label: 'Closed', color: 'bg-slate-700' }
    ];

    const currentPhaseIndex = workflowPhases.findIndex(p => p.phase === myAppraisal.currentPhase);

    const getPhaseStatus = (index: number): 'completed' | 'current' | 'upcoming' | 'locked' => {
        if (index < currentPhaseIndex) return 'completed';
        if (index === currentPhaseIndex) return 'current';
        if (activeCycle.status === 'Locked' || activeCycle.status === 'Completed') return 'locked';
        return 'upcoming';
    };

    const handlePhaseClick = (phaseConfig: typeof workflowPhases[0], status: string) => {
        if (status === 'current' && phaseConfig.route) {
            navigate(phaseConfig.route);
        }
    };

    const handleActionClick = (action: string) => {
        const actionRoutes: Record<string, string> = {
            'Set Goals': '/appraisal/goals',
            'Submit for Approval': '/appraisal/goals',
            'View KPI Progress': '/appraisal/tracking',
            'Add Manual Entries': '/appraisal/tracking',
            'Complete Mid-Year Review': '/appraisal/mid-review',
            'Submit Self Feedback': '/appraisal/feedback360',
            'Submit Final Appraisal': '/appraisal/teacher-form',
            'Review Goals': '/appraisal/goal-approval',
            'Approve Goals': '/appraisal/goal-approval',
            'Review Faculty Appraisals': '/appraisal/hod-review',
            'Calibrate Ratings': '/appraisal/calibration',
            'Normalize Scores': '/appraisal/calibration',
            'Process Increments': '/appraisal/increment',
            'Generate Letters': '/appraisal/increment'
        };

        const route = actionRoutes[action];
        if (route) navigate(route);
    };

    return (
        <Layout
            title="Appraisal Workflow"
            description={`${activeCycle.academicYear} Performance Appraisal System`}
            icon={Target}
        >
            {/* Active Cycle Info Banner */}
            <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-blue-900">Academic Year {activeCycle.academicYear}</h2>
                            <p className="text-sm text-blue-700 mt-1">
                                {new Date(activeCycle.startDate).toLocaleDateString()} - {new Date(activeCycle.endDate).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge className="bg-blue-600 text-white text-xs">
                                    {activeCycle.status}
                                </Badge>
                                <div className="text-xs text-blue-600">
                                    KRA: {activeCycle.weightageConfig.kra}% | KPI: {activeCycle.weightageConfig.kpi}% |
                                    360°: {activeCycle.weightageConfig.feedback360}% | Compliance: {activeCycle.weightageConfig.compliance}%
                                </div>
                            </div>
                        </div>
                        {(role === 'HR_ADMIN' || role === 'MANAGER') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/appraisal/cycle-setup')}
                                className="gap-2"
                            >
                                <Settings className="h-4 w-4" />
                                Cycle Settings
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Workflow Timeline Stepper */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-base">Workflow Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200">
                            <div
                                className="h-full bg-blue-600 transition-all"
                                style={{ width: `${(currentPhaseIndex / (workflowPhases.length - 1)) * 100}%` }}
                            />
                        </div>

                        {/* Phase Steps */}
                        <div className="relative grid grid-cols-5 gap-2">
                            {workflowPhases.map((phaseConfig, index) => {
                                const status = getPhaseStatus(index);
                                const PhaseIcon = phaseConfig.icon;

                                return (
                                    <div
                                        key={phaseConfig.phase}
                                        className={`flex flex-col items-center text-center ${status === 'current' ? 'cursor-pointer' : ''
                                            }`}
                                        onClick={() => handlePhaseClick(phaseConfig, status)}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-all ${status === 'completed'
                                                ? 'bg-green-600 text-white'
                                                : status === 'current'
                                                    ? `${phaseConfig.color} text-white shadow-lg scale-110`
                                                    : status === 'locked'
                                                        ? 'bg-slate-300 text-slate-500'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}
                                        >
                                            {status === 'completed' ? (
                                                <CheckCircle2 className="h-6 w-6" />
                                            ) : status === 'locked' ? (
                                                <Lock className="h-5 w-5" />
                                            ) : (
                                                <PhaseIcon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <p
                                            className={`text-xs mt-2 font-medium ${status === 'current' ? 'text-blue-900' : 'text-slate-600'
                                                }`}
                                        >
                                            {phaseConfig.label}
                                        </p>
                                        {status === 'current' && (
                                            <Badge className="mt-1 bg-blue-100 text-blue-700 text-[10px]">Active</Badge>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Appraisal Status */}
                <Card className="lg:col-span-2 border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">My Performance Appraisal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Status Overview */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-blue-900">{myAppraisal.employeeName}</h3>
                                        <p className="text-sm text-blue-700">{myAppraisal.role} • {myAppraisal.department}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge className="bg-blue-600 text-white text-xs">
                                                {myAppraisal.currentPhase}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${myAppraisal.status === 'Active'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : myAppraisal.status === 'PIP'
                                                        ? 'bg-red-50 text-red-700 border-red-200'
                                                        : 'bg-slate-50 text-slate-700'
                                                    }`}
                                            >
                                                {myAppraisal.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    {myAppraisal.finalRating && (
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-blue-900">{myAppraisal.finalRating.toFixed(1)}</div>
                                            <div className="text-xs text-blue-600">Final Rating</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Completion Checklist */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-slate-700">Completion Status</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'Goals Approved', completed: myAppraisal.goalsApproved },
                                        { label: 'Mid-Year Review', completed: myAppraisal.midYearCompleted },
                                        { label: '360° Feedback', completed: myAppraisal.feedback360Completed },
                                        { label: 'Final Submission', completed: myAppraisal.finalSubmitted },
                                        { label: 'HOD Review', completed: myAppraisal.hodReviewCompleted },
                                        { label: 'Calibration', completed: myAppraisal.calibrationCompleted }
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-2 text-xs">
                                            {item.completed ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                                            )}
                                            <span className={item.completed ? 'text-green-700' : 'text-slate-600'}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Items */}
                <Card className="border-amber-200 bg-amber-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            Action Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {availableActions.length > 0 ? (
                            <div className="space-y-2">
                                {availableActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleActionClick(action)}
                                        className="w-full p-3 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all text-left group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-900">{action}</span>
                                            <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-amber-700">No pending actions at this time.</p>
                        )}

                        {/* Upcoming Deadlines */}
                        {upcomingDeadlines.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-amber-200">
                                <h4 className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Upcoming Deadlines
                                </h4>
                                <div className="space-y-1">
                                    {upcomingDeadlines.map((deadline, index) => (
                                        <div key={index} className="text-xs text-amber-700">
                                            {deadline.phase}: {new Date(deadline.dueDate).toLocaleDateString()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Access Modules */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card
                    className="cursor-pointer border-slate-200 hover:shadow-md transition-all"
                    onClick={() => navigate('/appraisal/kra')}
                >
                    <CardContent className="pt-6 text-center">
                        <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">KRA Library</p>
                    </CardContent>
                </Card>
                <Card
                    className="cursor-pointer border-slate-200 hover:shadow-md transition-all"
                    onClick={() => navigate('/appraisal/kpi')}
                >
                    <CardContent className="pt-6 text-center">
                        <BarChart3 className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">KPI Tracking</p>
                    </CardContent>
                </Card>
                <Card
                    className="cursor-pointer border-slate-200 hover:shadow-md transition-all"
                    onClick={() => navigate('/appraisal/analytics')}
                >
                    <CardContent className="pt-6 text-center">
                        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Analytics</p>
                    </CardContent>
                </Card>
                {myAppraisal.isPIP && (
                    <Card
                        className="cursor-pointer border-red-200 bg-red-50 hover:shadow-md transition-all"
                        onClick={() => navigate('/appraisal/pip')}
                    >
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-red-900">PIP Active</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default AppraisalWorkflowHub;
