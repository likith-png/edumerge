import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { MessageSquare, User, Users, GraduationCap, UserCheck, Send, CheckCircle2 } from 'lucide-react';

interface FeedbackCategory {
    id: string;
    category: string;
    question: string;
}

const Feedback360Workflow: React.FC = () => {
    const [activeRaterType, setActiveRaterType] = useState<string>('self');
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [comments, setComments] = useState('');

    const raterTypes = [
        { id: 'self', label: 'Self Feedback', icon: User, color: 'blue', completed: false },
        { id: 'manager', label: 'Manager Feedback', icon: UserCheck, color: 'indigo', completed: false },
        { id: 'peer', label: 'Peer Feedback', icon: Users, color: 'purple', completed: true },
        { id: 'student', label: 'Student Feedback', icon: GraduationCap, color: 'pink', completed: false }
    ];

    const feedbackCategories: FeedbackCategory[] = [
        {
            id: 'teaching',
            category: 'Teaching Effectiveness',
            question: 'How would you rate the teaching quality and clarity of instruction?'
        },
        {
            id: 'communication',
            category: 'Communication Skills',
            question: 'How effectively does the faculty communicate complex concepts?'
        },
        {
            id: 'collaboration',
            category: 'Collaboration & Teamwork',
            question: 'How well does the faculty work with colleagues and students?'
        },
        {
            id: 'innovation',
            category: 'Innovation & Initiative',
            question: 'How innovative and proactive is the faculty in their approach?'
        },
        {
            id: 'professionalism',
            category: 'Professionalism',
            question: 'How would you rate the overall professionalism and conduct?'
        }
    ];

    const handleRatingChange = (categoryId: string, rating: number) => {
        setRatings({ ...ratings, [categoryId]: rating });
    };

    const handleSubmit = () => {
        const allRated = feedbackCategories.every(cat => ratings[cat.id]);
        if (allRated && comments.trim()) {
            console.log('Submitting feedback:', { ratings, comments, raterType: activeRaterType });
            alert('360° Feedback submitted successfully!');
        } else {
            alert('Please rate all categories and provide comments before submitting.');
        }
    };

    const activeRater = raterTypes.find(r => r.id === activeRaterType)!;
    const completedCount = raterTypes.filter(r => r.completed).length;

    return (
        <Layout
            title="360° Feedback Collection"
            description="Multi-rater performance feedback system"
            icon={MessageSquare}
            showBack
        >
            {/* Progress Summary */}
            <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-900">Feedback Collection Progress</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                For: Ms. Reshma Binu Prasad (FAC001) • Academic Year 2024-25
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-900">
                                {completedCount}/{raterTypes.length}
                            </div>
                            <div className="text-xs text-blue-700">Completed</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rater Type Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {raterTypes.map((rater) => {
                    const RaterIcon = rater.icon;
                    return (
                        <button
                            key={rater.id}
                            onClick={() => setActiveRaterType(rater.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${activeRaterType === rater.id
                                ? `border-${rater.color}-600 bg-${rater.color}-50`
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <RaterIcon
                                    className={`h-5 w-5 ${activeRaterType === rater.id
                                        ? `text-${rater.color}-600`
                                        : 'text-slate-500'
                                        }`}
                                />
                                {rater.completed && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                            </div>
                            <p className="text-sm font-medium text-left">{rater.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Feedback Form */}
            <Card>
                <CardHeader className={`bg-${activeRater.color}-50 border-b border-${activeRater.color}-100`}>
                    <CardTitle className="text-base flex items-center gap-2">
                        <activeRater.icon className="h-5 w-5" />
                        {activeRater.label} Form
                    </CardTitle>
                    {activeRater.id === 'student' && (
                        <p className="text-xs text-slate-600 mt-1">
                            Anonymous submission • Your identity will not be revealed
                        </p>
                    )}
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    {/* Rating Questions */}
                    {feedbackCategories.map((category) => (
                        <div key={category.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="mb-3">
                                <h4 className="font-semibold text-slate-900">{category.category}</h4>
                                <p className="text-sm text-slate-600 mt-1">{category.question}</p>
                            </div>

                            {/* Rating Scale */}
                            <div>
                                <Label className="text-xs mb-2 block">Your Rating (1-5)</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => handleRatingChange(category.id, rating)}
                                            className={`flex-1 py-3 text-sm rounded-lg border-2 transition-all ${ratings[category.id] === rating
                                                ? `border-${activeRater.color}-600 bg-${activeRater.color}-50 text-${activeRater.color}-900 font-semibold`
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {rating}
                                            <div className="text-[10px] mt-0.5">
                                                {rating === 1 && 'Poor'}
                                                {rating === 2 && 'Below Avg'}
                                                {rating === 3 && 'Average'}
                                                {rating === 4 && 'Good'}
                                                {rating === 5 && 'Excellent'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Overall Comments */}
                    <div>
                        <Label htmlFor="comments">Overall Comments*</Label>
                        <Textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Share your overall feedback, specific examples, strengths, and areas for improvement..."
                            rows={5}
                            required
                        />
                    </div>

                    {/* Competency Matrix (Optional) */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-sm text-slate-900 mb-3">
                            Current Average Ratings
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                            {feedbackCategories.map((cat) => (
                                <div key={cat.id} className="text-center">
                                    <div
                                        className={`text-lg font-bold ${ratings[cat.id]
                                            ? `text-${activeRater.color}-900`
                                            : 'text-slate-400'
                                            }`}
                                    >
                                        {ratings[cat.id] || '-'}
                                    </div>
                                    <div className="text-[10px] text-slate-600">{cat.category}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" className="flex-1">
                            Save Draft
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className={`flex-1 bg-${activeRater.color}-600 hover:bg-${activeRater.color}-700 gap-2`}
                        >
                            <Send className="h-4 w-4" />
                            Submit Feedback
                        </Button>
                    </div>

                    {activeRater.id === 'student' && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded text-xs text-purple-900">
                            <strong>Anonymous Submission:</strong> Your feedback is completely anonymous and
                            will be aggregated with other student responses. Faculty will only see average
                            ratings and anonymized comments.
                        </div>
                    )}
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Feedback360Workflow;
