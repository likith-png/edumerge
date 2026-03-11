import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    Target, TrendingUp, CheckCircle, Clock, AlertCircle,
    Zap, ArrowRight, Calendar, Award, BookOpen, Users,
    Upload, PlusCircle, BarChart3, Settings, Rocket
} from 'lucide-react';
import { calculateAutomatedEvaluation, getMockMetrics } from '../services/evaluationEngine';
import { usePersona } from '../contexts/PersonaContext';
import { checkActiveCycle, getAllCycles, deleteCycle, getCurrentPhase, type AppraisalCycle } from '../services/cycleService';
import { Eye, Trash2, XCircle, Info, Calculator, Scale } from 'lucide-react';


const AppraisalFlowView: React.FC = () => {
    const navigate = useNavigate();
    const { role, user } = usePersona();
    const [autoEval, setAutoEval] = useState<any>(null);
    const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
    const [selectedCycle, setSelectedCycle] = useState<AppraisalCycle | null>(null);
    const [showCalibrationInfo, setShowCalibrationInfo] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);

    // Check if an active cycle exists
    const activeCycle = checkActiveCycle() as AppraisalCycle | null;

    useEffect(() => {
        // Load automated evaluation
        const metrics = getMockMetrics();
        const evaluation = calculateAutomatedEvaluation(metrics, activeCycle || undefined);
        setAutoEval(evaluation);

        // Load all cycles for HR history
        setCycles(getAllCycles());

        // Fetch employees for global stats
        fetch('/api/employee')
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setEmployees(data.data.filter((e: any) => e.status !== 'Onboarding'));
                }
            })
            .catch(err => console.error('Error fetching employees:', err));
    }, [user, activeCycle]);

    const handleDeleteCycle = (id: string) => {
        if (confirm('Are you sure you want to delete this appraisal cycle?')) {
            deleteCycle(id);
            setCycles(getAllCycles());
        }
    };

    // If no active cycle and not HR, show employee empty state
    if (!activeCycle && role !== 'ADMIN' && role !== 'HR_ADMIN') {
        return (
            <Layout
                title="Appraisal & Performance"
                description="No active cycle"
                icon={Target}
            >
                <Card className="max-w-2xl mx-auto mt-12">
                    <CardContent className="pt-8 pb-8 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-10 w-10 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            📭 No Active Appraisal Cycle
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Your HR team hasn't set up this year's appraisal cycle yet.
                            <br />
                            Please check back soon!
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-600 mb-4">Meanwhile, you can:</p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/staff-portfolio/${user?.id || 'FAC001'}`)}
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    View Your Portfolio
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/learning-development')}
                                >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Browse L&D Trainings
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Layout>
        );
    }

    // Use phases from active cycle, or fallback to default if none (though empty state usually handles this)
    const currentPhase = activeCycle ? getCurrentPhase(activeCycle) : null;
    const phases = activeCycle ? activeCycle.phases.map(p => ({
        ...p,
        status: currentPhase && p.id === currentPhase.id ? 'active' :
            (currentPhase && p.id < currentPhase.id ? 'completed' : 'locked')
    })) : [
        { id: 1, name: 'Set Goals', icon: 'Target', status: 'completed' },
        { id: 2, name: 'Track Progress', icon: 'TrendingUp', status: 'active' },
        { id: 3, name: 'Mid-Year Review', icon: 'Calendar', status: 'locked' },
        { id: 4, name: '360° Feedback', icon: 'Users', status: 'locked' },
        { id: 5, name: 'Final Review', icon: 'Award', status: 'locked' }
    ];

    // Helper to get icon component
    const getPhaseIcon = (iconName: string) => {
        switch (iconName) {
            case 'Target': return Target;
            case 'TrendingUp': return TrendingUp;
            case 'Calendar': return Calendar;
            case 'Users': return Users;
            case 'Award': return Award;
            default: return Clock;
        }
    };

    const renderFacultyView = () => (
        <>
            {/* Progressive Stepper */}
            <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-slate-900">Your Appraisal Journey</h2>
                        <Badge className="bg-blue-600 text-white">Academic Year 2024-25</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        {phases.map((phase, idx) => (
                            <React.Fragment key={phase.id}>
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                                        ${phase.status === 'completed' ? 'bg-green-600 text-white' :
                                            phase.status === 'active' ? 'bg-blue-600 text-white shadow-lg scale-110' :
                                                'bg-slate-200 text-slate-400'}
                                    `}>
                                        {phase.status === 'completed' ? (
                                            <CheckCircle className="h-6 w-6" />
                                        ) : phase.status === 'locked' ? (
                                            <Clock className="h-5 w-5" />
                                        ) : (
                                            React.createElement(getPhaseIcon(phase.icon), { className: "h-6 w-6" })
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium text-center ${phase.status === 'active' ? 'text-blue-900' : 'text-slate-600'
                                        }`}>
                                        {phase.name}
                                    </span>
                                    {phase.status === 'active' && (
                                        <Badge className="mt-1 bg-blue-600 text-white text-[10px]">
                                            YOU ARE HERE
                                        </Badge>
                                    )}
                                </div>
                                {idx < phases.length - 1 && (
                                    <div className={`flex-1 h-1 mb-8 ${phase.status === 'completed' ? 'bg-green-600' : 'bg-slate-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main: YOUR CURRENT ACTION */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-2 border-blue-300 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-6 w-6" />
                                YOUR CURRENT ACTION: Track Your Performance
                                <Badge className="ml-auto bg-white text-blue-900 text-xs">
                                    Phase 2 of 5
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {/* Auto Score Display */}
                            {autoEval && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-sm text-slate-600 mb-1">
                                                Auto-Calculated Performance Score
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-bold text-blue-900">
                                                    {autoEval.overallRating}
                                                </span>
                                                <span className="text-2xl text-slate-600">/5</span>
                                                <Badge className="ml-2 bg-green-600 text-white">
                                                    {autoEval.performanceBand}
                                                </Badge>
                                                <Zap className="h-5 w-5 text-yellow-500 ml-1" />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-slate-600">Predicted Year-End</div>
                                            <div className="text-3xl font-bold text-indigo-900">
                                                {autoEval.predictedYearEndRating}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Component Breakdown */}
                                    <div className="grid grid-cols-4 gap-3 mb-4">
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="text-xs text-blue-700 mb-1">Academic (40%)</div>
                                            <div className="text-2xl font-bold text-blue-900">
                                                {autoEval.componentScores.academic}
                                            </div>
                                            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                            <div className="text-xs text-purple-700 mb-1">Professional (30%)</div>
                                            <div className="text-2xl font-bold text-purple-900">
                                                {autoEval.componentScores.professional}
                                            </div>
                                            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                        </div>
                                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                            <div className="text-xs text-amber-700 mb-1">Development (20%)</div>
                                            <div className="text-2xl font-bold text-amber-900">
                                                {autoEval.componentScores.development}
                                            </div>
                                            <AlertCircle className="h-4 w-4 text-amber-600 mt-1" />
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="text-xs text-slate-700 mb-1">Compliance (10%)</div>
                                            <div className="text-2xl font-bold text-slate-900">
                                                {autoEval.componentScores.compliance}
                                            </div>
                                            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                        </div>
                                    </div>

                                    {/* Specific Suggestions */}
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-amber-900 mb-1">
                                                    To Boost Your Score to Outstanding (4.7+):
                                                </h4>
                                                <ul className="text-sm text-amber-800 space-y-1">
                                                    <li>• Complete <strong>1 more training course</strong> (currently 2/3)</li>
                                                    <li>• Improve lesson plan compliance to <strong>95%+</strong> (currently 92%)</li>
                                                    <li>• Add <strong>1 research publication</strong> for extra points</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Inline Quick Updates */}
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-blue-600" />
                                    Quick Updates (Update Your Progress Here)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Button
                                        variant="outline"
                                        className="justify-start gap-2 h-auto py-3 border-blue-200 hover:bg-blue-50 cursor-pointer"
                                        onClick={() => navigate('/appraisal/tracking')}
                                    >
                                        <PlusCircle className="h-5 w-5 text-blue-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-sm">Update KPI Progress</div>
                                            <div className="text-xs text-slate-600">Add monthly achievements</div>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="justify-start gap-2 h-auto py-3 border-green-200 hover:bg-green-50 cursor-pointer"
                                        onClick={() => navigate('/learning-development?action=log-training')}
                                    >
                                        <BookOpen className="h-5 w-5 text-green-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-sm">Log Training</div>
                                            <div className="text-xs text-slate-600">Complete 1 more course</div>
                                        </div>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="justify-start gap-2 h-auto py-3 border-purple-200 hover:bg-purple-50 cursor-pointer"
                                        onClick={() => navigate('/learning-development?action=upload-certificate')}
                                    >
                                        <Upload className="h-5 w-5 text-purple-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-sm">Upload Certificate</div>
                                            <div className="text-xs text-slate-600">Add proof of completion</div>
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            {/* Primary Actions */}
                            <div className="flex gap-3 mt-6">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => navigate('/appraisal/tracking')}
                                >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Detailed Breakdown
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-slate-300"
                                    disabled
                                >
                                    Skip to Mid-Year
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WHAT'S NEXT Card */}
                    <Card className="border-indigo-200 bg-indigo-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-indigo-600" />
                                What's Next: Mid-Year Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-indigo-600" />
                                    <span className="font-semibold text-indigo-900">Opens in 45 days</span>
                                    <Badge className="ml-auto bg-indigo-600 text-white">March 1, 2025</Badge>
                                </div>
                                <div className="text-sm text-slate-700">
                                    <strong>Your manager will review:</strong>
                                    <ul className="mt-2 space-y-1 ml-4">
                                        <li>• Your goal progress and achievements</li>
                                        <li>• KPI completion percentage</li>
                                        <li>• Development areas and training needs</li>
                                    </ul>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-3">
                                    <div className="flex items-start gap-2">
                                        <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                                        <div className="text-sm text-blue-900">
                                            <strong>Pro Tip:</strong> Complete that 1 extra training course before mid-year to show strong development commitment!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Portfolio Quick Stats */}
                    <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Your Portfolio
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-center p-3 bg-white rounded-lg">
                                    <div className="text-3xl font-bold text-pink-900">
                                        {autoEval?.overallRating || '4.3'}/5
                                    </div>
                                    <div className="text-xs text-slate-600">Current Rating</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <div className="text-slate-600">Trend</div>
                                        <div className="font-semibold text-green-700 flex items-center gap-1">
                                            <TrendingUp className="h-4 w-4" />
                                            +0.2
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-600">Trainings</div>
                                        <div className="font-semibold text-slate-900">8 courses</div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full text-xs"
                                    onClick={() => navigate(`/staff-portfolio/${user?.id || 'FAC001'}`)}
                                >
                                    View Complete Journey
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Help */}
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Quick Help</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-sm h-auto py-2"
                                onClick={() => navigate('/learning-development')}
                            >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Browse L&D Trainings
                                <ArrowRight className="h-3 w-3 ml-auto" />
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-sm h-auto py-2"
                                onClick={() => navigate('/appraisal/workflow')}
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                View Full Workflow
                                <ArrowRight className="h-3 w-3 ml-auto" />
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-sm h-auto py-2"
                            >
                                <Users className="h-4 w-4 mr-2" />
                                Contact HR
                                <ArrowRight className="h-3 w-3 ml-auto" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Strengths Preview */}
                    {autoEval && autoEval.strengths.length > 0 && (
                        <Card className="border-green-200">
                            <CardHeader className="pb-3 bg-green-50">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Your Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-3">
                                <ul className="space-y-2 text-xs">
                                    {autoEval.strengths.slice(0, 3).map((strength: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-green-800">
                                            <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );

    // @ts-ignore - HOD view available for future role-based rendering
    const renderHODView = () => (
        <>
            {/* Cycle Header */}
            <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Department Overview</h2>
                            <p className="text-sm text-slate-600">Academic Year 2024-25 • Phase 2: Tracking</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/appraisal/analytics')}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Analytics
                        </Button>
                    </div>

                    {/* Department Progress */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-3">Overall Progress: 73% Complete</h3>
                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-700">Goals Set</span>
                                    <span className="font-semibold text-green-900">87% (26/30 faculty)</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-700">Tracking Progress</span>
                                    <span className="font-semibold text-blue-900">65% (20/30 faculty)</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-700">Mid-Year Review</span>
                                    <span className="font-semibold text-slate-600">Opens March 1</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-900">
                                4 faculty need attention - Click to review
                            </span>
                            <Button size="sm" variant="outline" className="ml-auto border-amber-300">
                                Review Now
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Approvals Card */}
            <Card className="mb-6 border-orange-200">
                <CardHeader className="bg-orange-50 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        Pending Approvals
                        <Badge className="ml-auto bg-orange-600 text-white">6 Waiting</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-3">
                        {/* Sample Approval Item */}
                        <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-all">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-slate-900">Ms. Reshma Binu Prasad</h4>
                                    <p className="text-sm text-slate-600">Goals Submitted • 2 days ago</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800">5 Goals</Badge>
                            </div>
                            <div className="text-sm text-slate-700 mb-3">
                                ✓ All goals aligned with department targets<br />
                                ✓ Clear KPIs defined for each goal
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => navigate('/appraisal/goal-approval')}
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                </Button>
                                <Button size="sm" variant="outline">
                                    Request Changes
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate('/appraisal/goal-approval')}
                                >
                                    <Users className="h-4 w-4 mr-1" />
                                    Review Details
                                </Button>
                            </div>
                        </div>

                        {/* More pending items preview */}
                        <div className="p-3 bg-slate-50 rounded-lg text-center">
                            <span className="text-sm text-slate-600">+ 5 more pending approvals</span>
                            <Button
                                variant="link"
                                className="ml-2 h-auto p-0"
                                onClick={() => navigate('/appraisal/goal-approval')}
                            >
                                View All
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions for HOD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/appraisal/goal-approval')}>
                    <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-slate-900">Review Goals</h3>
                        <p className="text-sm text-slate-600 mt-1">Approve faculty submissions</p>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/appraisal/analytics')}>
                    <CardContent className="pt-6 text-center">
                        <BarChart3 className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-slate-900">Analytics</h3>
                        <p className="text-sm text-slate-600 mt-1">Department insights</p>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/staff-portfolio')}>
                    <CardContent className="pt-6 text-center">
                        <Users className="h-10 w-10 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-slate-900">Staff Portfolios</h3>
                        <p className="text-sm text-slate-600 mt-1">View team performance</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );

    const renderHRView = () => {
        // If no active cycle, show empty state with create button
        if (!activeCycle) {
            return (
                <>
                    {/* Empty State for HR */}
                    <Card className="mb-6 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                        <CardContent className="pt-6 pb-6">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Settings className="h-10 w-10 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    No Appraisal Cycle Configured
                                </h2>
                                <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                                    Get started by creating your first appraisal cycle.
                                    You'll define phases, weightages, and rating criteria in a simple 5-step wizard.
                                </p>
                                <Button
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                    onClick={() => navigate('/appraisal/setup-wizard')}
                                >
                                    <Rocket className="h-5 w-5 mr-2" />
                                    Start Configuration
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuration Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(!activeCycle || (activeCycle as AppraisalCycle).enabledStages?.kra !== false) && (
                            <Card
                                className="border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => navigate('/appraisal/kra')}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Target className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 mb-1">Define KRAs</h3>
                                            <p className="text-sm text-slate-600 mb-3">
                                                Key Result Areas for performance tracking
                                            </p>
                                            <Button size="sm" variant="outline" className="w-full">
                                                Configure KRAs →
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {(!activeCycle || (activeCycle as AppraisalCycle).enabledStages?.kpi !== false) && (
                            <Card
                                className="border-green-200 hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => navigate('/appraisal/kpi')}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <BarChart3 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 mb-1">Setup KPIs</h3>
                                            <p className="text-sm text-slate-600 mb-3">
                                                Measurable indicators for each KRA
                                            </p>
                                            <Button size="sm" variant="outline" className="w-full">
                                                Configure KPIs →
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {(!activeCycle || ((activeCycle as AppraisalCycle).enabledStages?.kra !== false || (activeCycle as AppraisalCycle).enabledStages?.kpi !== false)) && (
                            <Card
                                className="border-purple-200 hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => navigate('/appraisal/goals')}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 mb-1">Goal Templates</h3>
                                            <p className="text-sm text-slate-600 mb-3">
                                                Pre-define common goals for faculty
                                            </p>
                                            <Button size="sm" variant="outline" className="w-full">
                                                Manage Goals →
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </>
            );
        }

        // If cycle exists, show normal HR dashboard
        return (
            <>
                {/* Cycle Management Header */}
                <Card className="mb-6 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Appraisal Cycle Management</h2>
                                <p className="text-sm text-slate-600">{activeCycle.name}</p>
                            </div>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700"
                                onClick={() => navigate('/appraisal/setup-wizard')}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Create New Cycle
                            </Button>
                        </div>

                        {/* Institution-Wide Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">
                                <div className="text-3xl font-bold text-blue-900">{employees.length}</div>
                                <div className="text-xs text-slate-600 mt-1">Total Faculty</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
                                <div className="text-3xl font-bold text-green-900">89%</div>
                                <div className="text-xs text-slate-600 mt-1">Goals Set</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-amber-200 text-center">
                                <div className="text-3xl font-bold text-amber-900">12</div>
                                <div className="text-xs text-slate-600 mt-1">Pending Approvals</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-purple-200 text-center">
                                <div className="text-3xl font-bold text-purple-900">4.2</div>
                                <div className="text-xs text-slate-600 mt-1">Avg Rating (Projected)</div>
                            </div>
                        </div>

                        {/* Configuration Buttons */}
                        <div className="mt-4 flex gap-2 flex-wrap">
                            {(!activeCycle || (activeCycle as AppraisalCycle).enabledStages?.kra !== false) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/appraisal/kra')}
                                >
                                    <Target className="h-4 w-4 mr-1" />
                                    Manage KRAs
                                </Button>
                            )}
                            {(!activeCycle || (activeCycle as AppraisalCycle).enabledStages?.kpi !== false) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/appraisal/kpi')}
                                >
                                    <BarChart3 className="h-4 w-4 mr-1" />
                                    Manage KPIs
                                </Button>
                            )}
                            {(!activeCycle || ((activeCycle as AppraisalCycle).enabledStages?.kra !== false || (activeCycle as AppraisalCycle).enabledStages?.kpi !== false)) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/appraisal/goals')}
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Goal Templates
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/appraisal/cycle-setup')}
                            >
                                <Settings className="h-4 w-4 mr-1" />
                                Adjust Weightages
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/appraisal/cycle-setup')}
                            >
                                <Calendar className="h-4 w-4 mr-1" />
                                Modify Deadlines
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/staff-portfolio')}
                            >
                                <Users className="h-4 w-4 mr-1" />
                                Manage Staff
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-blue-200"
                        onClick={() => navigate('/appraisal/analytics')}
                    >
                        <CardContent className="pt-6">
                            <BarChart3 className="h-12 w-12 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg text-slate-900">Analytics Dashboard</h3>
                            <p className="text-sm text-slate-600 mt-2">Performance insights and trends</p>
                            <Button variant="link" className="mt-3 p-0">
                                View Dashboard
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-purple-200"
                        onClick={() => setShowCalibrationInfo(!showCalibrationInfo)}
                    >
                        <CardContent className="pt-6">
                            <Scale className="h-12 w-12 text-purple-600 mb-3" />
                            <h3 className="font-semibold text-lg text-slate-900">Calibration & Normalization</h3>
                            <p className="text-sm text-slate-600 mt-2">Normalize ratings across departments</p>
                            <Button variant="link" className="mt-3 p-0" onClick={(e) => {
                                e.stopPropagation();
                                navigate('/appraisal/calibration');
                            }}>
                                Manage Calibration
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-green-200"
                        onClick={() => navigate('/staff-portfolio')}
                    >
                        <CardContent className="pt-6">
                            <Users className="h-12 w-12 text-green-600 mb-3" />
                            <h3 className="font-semibold text-lg text-slate-900">Staff Portfolios</h3>
                            <p className="text-sm text-slate-600 mt-2">Complete performance history</p>
                            <Button variant="link" className="mt-3 p-0">
                                Browse All
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Calibration Info Block */}
                {showCalibrationInfo && (
                    <Card className="mt-6 border-purple-300 bg-purple-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                                <Info className="h-5 w-5" />
                                How Calibration & Normalization Works
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-purple-800 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-bold flex items-center gap-1">
                                        <Scale className="h-4 w-4" /> Calibration
                                    </h4>
                                    <p className="text-xs leading-relaxed">
                                        Calibration is the process of reviewing employee performance ratings as a committee to ensure that managers have applied the same standards across all teams. It eliminates individual manager bias (leniency or strictness).
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold flex items-center gap-1">
                                        <Calculator className="h-4 w-4" /> Normalization (Bell Curve)
                                    </h4>
                                    <p className="text-xs leading-relaxed">
                                        Normalization fits the final ratings into a pre-defined distribution (e.g., Top 10%, Mid 70%, Bottom 20%). This ensures institution-wide budget alignment for increments and maintains consistent performance benchmarks.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-purple-200 flex justify-end">
                                <Button size="sm" variant="ghost" onClick={() => setShowCalibrationInfo(false)}>Dismiss</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cycle History / List */}
                <Card className="mt-6">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-base flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-slate-600" />
                                Appraisal Cycle History
                            </div>
                            <Badge variant="outline">{cycles.length} Total Cycles</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {cycles.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 text-sm">
                                No previous cycles found.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cycles.map(cycle => {
                                    const phase = getCurrentPhase(cycle);
                                    return (
                                        <div key={cycle.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-slate-900">{cycle.name}</h4>
                                                    {activeCycle?.id === cycle.id && (
                                                        <Badge className="bg-green-100 text-green-700 text-[10px]">ACTIVE</Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 flex gap-3">
                                                    <span>Range: {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="text-indigo-600 font-medium">Phase: {phase?.name || 'Full Workflow'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => setSelectedCycle(cycle)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDeleteCycle(cycle.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Detail Modal Integration */}
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
                                        <Clock className="h-4 w-4 text-purple-600" />
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
            </>
        );
    };

    // Determine which view to render based on role
    const renderView = () => {
        // HR and Management see the cycle management/oversight view
        if (role === 'ADMIN' || role === 'HR_ADMIN') {
            return renderHRView();
        }
        // Managers see their team oversight view
        if (role === 'MANAGER') {
            return renderHODView();
        }
        // Default to faculty personal journey view
        return renderFacultyView();
    };

    return (
        <Layout
            title="Appraisal & Performance"
            description="Track your performance journey"
            icon={Target}
        >
            {renderView()}
        </Layout>
    );
};

export default AppraisalFlowView;
