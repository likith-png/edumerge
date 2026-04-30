import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Calendar, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    target: string;
    progressPercentage: number;
    status: 'On Track' | 'At Risk' | 'Ahead';
    achievements: string;
}

const MidYearReview: React.FC = () => {
    const [selfReflection, setSelfReflection] = useState('');
    const [challenges, setChallenges] = useState('');
    const [supportNeeded, setSupportNeeded] = useState('');

    const goals: Goal[] = [
        {
            id: 'g1',
            title: 'Improve Student Pass Percentage',
            target: '95%',
            progressPercentage: 88,
            status: 'On Track',
            achievements: 'Currently at 88%, improved from 85% in previous semester'
        },
        {
            id: 'g2',
            title: 'Complete Advanced Python Certification',
            target: 'Certificate obtained',
            progressPercentage: 40,
            status: 'At Risk',
            achievements: 'Completed 3 modules out of 8, delayed due to heavy teaching load'
        },
        {
            id: 'g3',
            title: 'Publish Research Paper',
            target: '1 publication',
            progressPercentage: 75,
            status: 'Ahead',
            achievements: 'Paper submitted and under review at SCOPUS journal'
        }
    ];

    const overallProgress =
        goals.reduce((sum, goal) => sum + goal.progressPercentage, 0) / goals.length;

    const handleSubmit = () => {
        if (selfReflection.trim() && challenges.trim()) {
            console.log('Submitting mid-year review');
            alert('Mid-Year Review submitted successfully! Your HOD will be notified.');
        } else {
            alert('Please complete all required sections before submitting.');
        }
    };

    const getStatusColor = (status: string) => {
        if (status === 'Ahead') return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
        if (status === 'On Track') return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
    };

    return (
        <Layout
            title="Mid-Year Review"
            description="Performance check-in and goal progress assessment"
            icon={Calendar}
            showBack
        >
            {/* Header Info */}
            <Card className="mb-4 border-purple-200 bg-purple-50">
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-purple-900">Mid-Year Review - AY 2024-25</h3>
                            <p className="text-sm text-purple-700 mt-1">
                                Ms. Reshma Binu Prasad • Computer Science • Review Period: Apr 2024 - Oct 2024
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-purple-900">
                                {overallProgress.toFixed(0)}%
                            </div>
                            <div className="text-xs text-purple-700">Overall Progress</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Goal Progress Review
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {goals.map((goal) => {
                        const colors = getStatusColor(goal.status);
                        return (
                            <div
                                key={goal.id}
                                className={`border ${colors.border} rounded-lg p-4 ${goal.status === 'At Risk' ? 'bg-red-50' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Target: <strong>{goal.target}</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${colors.bg} ${colors.text}`}>
                                            {goal.status}
                                        </Badge>
                                        <div className="text-xl font-bold text-slate-900">
                                            {goal.progressPercentage}%
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                                    <div
                                        className={`h-2 rounded-full transition-all ${goal.status === 'Ahead'
                                            ? 'bg-green-600'
                                            : goal.status === 'On Track'
                                                ? 'bg-blue-600'
                                                : 'bg-red-600'
                                            }`}
                                        style={{ width: `${goal.progressPercentage}%` }}
                                    />
                                </div>

                                <div className="p-3 bg-white rounded border border-slate-200">
                                    <p className="text-sm text-slate-700">
                                        <strong>Achievements:</strong> {goal.achievements}
                                    </p>
                                </div>

                                {goal.status === 'At Risk' && (
                                    <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-700" />
                                        <p className="text-xs text-red-800">
                                            This goal needs attention. Consider discussing with HOD for support.
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Self-Reflection Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Mid-Year Reflection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="reflection">
                            Self-Reflection on Progress*
                            <span className="text-xs text-slate-500 ml-1">(Strengths, achievements, learning)</span>
                        </Label>
                        <Textarea
                            id="reflection"
                            value={selfReflection}
                            onChange={(e) => setSelfReflection(e.target.value)}
                            placeholder="Reflect on your progress over the past 6 months. What went well? What did you learn?"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="challenges">
                            Challenges Faced*
                            <span className="text-xs text-slate-500 ml-1">(Obstacles, roadblocks)</span>
                        </Label>
                        <Textarea
                            id="challenges"
                            value={challenges}
                            onChange={(e) => setChallenges(e.target.value)}
                            placeholder="What challenges did you encounter? What prevented you from achieving certain goals?"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="support">
                            Support Needed
                            <span className="text-xs text-slate-500 ml-1">(Resources, training, guidance)</span>
                        </Label>
                        <Textarea
                            id="support"
                            value={supportNeeded}
                            onChange={(e) => setSupportNeeded(e.target.value)}
                            placeholder="What support do you need to achieve your goals? (e.g., training, resources, time allocation)"
                            rows={3}
                        />
                    </div>

                    {/* Goal Revision Options */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Goal Revision (Optional)</h4>
                        <p className="text-sm text-blue-700 mb-3">
                            If circumstances have changed, you can propose revisions to your goals. Your HOD will
                            review and approve any changes.
                        </p>
                        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                            Propose Goal Revisions
                        </Button>
                    </div>

                    {/* Submit Section */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" className="flex-1">
                            Save Draft
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Submit Mid-Year Review
                        </Button>
                    </div>

                    <div className="p-3 bg-purple-50 border border-purple-200 rounded text-xs text-purple-900">
                        <strong>Next Steps:</strong> After submission, your HOD will review your progress and
                        schedule a discussion meeting. You'll receive feedback and any necessary support to achieve
                        your year-end goals.
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default MidYearReview;
