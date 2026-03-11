import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { CheckCircle, XCircle, Edit2, Clock } from 'lucide-react';

interface GoalSubmission {
    id: string;
    employeeName: string;
    employeeId: string;
    department: string;
    submittedDate: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Revision';
    goals: Goal[];
}

interface Goal {
    id: string;
    title: string;
    description: string;
    type: string;
    target: string;
    timeline: string;
    proposedKRA: string;
}

const GoalApprovalDashboard: React.FC = () => {
    const [selectedSubmission, setSelectedSubmission] = useState<GoalSubmission | null>(null);
    const [hodComments, setHodComments] = useState('');

    const pendingSubmissions: GoalSubmission[] = [
        {
            id: 'sub-001',
            employeeName: 'Ms. Reshma Binu Prasad',
            employeeId: 'FAC001',
            department: 'Computer Science',
            submittedDate: '2024-05-10',
            status: 'Pending',
            goals: [
                {
                    id: 'g1',
                    title: 'Improve Student Pass Percentage',
                    description: 'Achieve 95% pass rate in all subjects taught',
                    type: 'Academic',
                    target: '95%',
                    timeline: 'By End of Academic Year',
                    proposedKRA: 'Academic Result Performance'
                },
                {
                    id: 'g2',
                    title: 'Complete Advanced Python Certification',
                    description: 'Obtain industry certification to enhance teaching quality',
                    type: 'Professional Development',
                    target: 'Certificate obtained',
                    timeline: 'Within 6 months',
                    proposedKRA: 'Professional Development'
                }
            ]
        },
        {
            id: 'sub-002',
            employeeName: 'Ms. Sanchaiyata Majumdar',
            employeeId: 'FAC002',
            department: 'Computer Science',
            submittedDate: '2024-05-08',
            status: 'Pending',
            goals: [
                {
                    id: 'g3',
                    title: 'Publish Research Paper',
                    description: 'Submit 1 paper to peer-reviewed journal',
                    type: 'Research',
                    target: '1 publication',
                    timeline: '12 months',
                    proposedKRA: 'Research & Publications'
                }
            ]
        }
    ];

    const handleApprove = () => {
        if (selectedSubmission) {
            console.log('Approving goals for:', selectedSubmission.employeeName);
            alert('Goals approved and locked for ' + selectedSubmission.employeeName);
        }
    };

    const handleReject = () => {
        if (selectedSubmission && hodComments.trim()) {
            console.log('Rejecting goals for:', selectedSubmission.employeeName);
            alert('Goals sent back for revision with feedback');
        }
    };

    return (
        <Layout
            title="Goal Approval Dashboard"
            description="Review and approve employee goal submissions"
            icon={CheckCircle}
            showBack
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-amber-900">{pendingSubmissions.length}</div>
                        <div className="text-xs text-amber-700">Pending Approval</div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-green-900">12</div>
                        <div className="text-xs text-green-700">Approved</div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-blue-900">15</div>
                        <div className="text-xs text-blue-700">Total Faculty</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submissions List */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900 mb-3">Pending Submissions</h3>
                    {pendingSubmissions.map((submission) => (
                        <Card
                            key={submission.id}
                            className={`cursor-pointer border-slate-200 hover:shadow-md transition-all ${selectedSubmission?.id === submission.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                            onClick={() => setSelectedSubmission(submission)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{submission.employeeName}</h3>
                                        <p className="text-sm text-slate-600">
                                            {submission.employeeId} • {submission.department}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge className="bg-blue-100 text-blue-700 text-[10px]">
                                                {submission.goals.length} Goals
                                            </Badge>
                                            <Badge className="bg-amber-100 text-amber-700 text-[10px] gap-1">
                                                <Clock className="h-3 w-3" />
                                                Pending
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Review Panel */}
                <div>
                    {selectedSubmission ? (
                        <Card className="border-slate-200">
                            <CardHeader className="pb-3 bg-blue-50 border-b border-blue-100">
                                <CardTitle className="text-base">
                                    Review: {selectedSubmission.employeeName}
                                </CardTitle>
                                <p className="text-xs text-slate-600">
                                    {selectedSubmission.employeeId} • Submitted:{' '}
                                    {new Date(selectedSubmission.submittedDate).toLocaleDateString()}
                                </p>
                            </CardHeader>
                            <CardContent className="pt-4 max-h-[600px] overflow-y-auto">
                                <div className="space-y-4">
                                    {/* Goals List */}
                                    {selectedSubmission.goals.map((goal, index) => (
                                        <div key={goal.id} className="border border-slate-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-slate-900">
                                                            Goal {index + 1}: {goal.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-2">
                                                        {goal.description}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-slate-500">Type:</span>{' '}
                                                            <strong>{goal.type}</strong>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500">Target:</span>{' '}
                                                            <strong>{goal.target}</strong>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500">Timeline:</span>{' '}
                                                            <strong>{goal.timeline}</strong>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500">Linked KRA:</span>{' '}
                                                            <strong>{goal.proposedKRA}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1"
                                                    onClick={() =>
                                                        alert(
                                                            'Modify goal: ' +
                                                            goal.title +
                                                            '\n(Feature to be implemented)'
                                                        )
                                                    }
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                    Modify
                                                </Button>
                                            </div>

                                            {/* HOD Adjustments */}
                                            <div className="mt-3 p-2 bg-purple-50 rounded border border-purple-100">
                                                <Label className="text-xs text-purple-900">
                                                    HOD Target Adjustment (Optional)
                                                </Label>
                                                <Input
                                                    placeholder="e.g., Increase to 98%"
                                                    className="mt-1 text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {/* HOD Comments */}
                                    <div>
                                        <Label htmlFor="hodComments">HOD Comments & Feedback</Label>
                                        <Textarea
                                            id="hodComments"
                                            value={hodComments}
                                            onChange={(e) => setHodComments(e.target.value)}
                                            placeholder="Provide feedback on the goals, suggestions for improvement, or reasons for rejection..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            className="flex-1 gap-2 border-red-200 text-red-700 hover:bg-red-50"
                                            onClick={handleReject}
                                            disabled={!hodComments.trim()}
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Send Back for Revision
                                        </Button>
                                        <Button
                                            onClick={handleApprove}
                                            className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Approve & Lock Goals
                                        </Button>
                                    </div>

                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                                        <strong>Note:</strong> Once approved, goals will be locked and the
                                        employee can begin tracking progress. You can still modify targets during
                                        mid-year review if needed.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-slate-200">
                            <CardContent className="pt-6 text-center text-slate-500">
                                Select a submission to review goals
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default GoalApprovalDashboard;
