import React, { useState, useEffect } from 'react';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`glass-card p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 ${className || ''}`}>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-300/30 transition-colors"></div>
        <div className="relative z-10">{children}</div>
    </div>
);
const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`mb-4 ${className || ''}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`text-base font-black text-indigo-950 drop-shadow-sm uppercase tracking-wider flex items-center gap-2 ${className || ''}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={className}>{children}</div>;
import { Button } from '../ui/button';
import { Label } from '../ui/label';

import { getExitInterview, updateExitInterview } from '../../services/exitService';
import { MessageSquare, Star, CheckCircle, UserCog, ClipboardList } from 'lucide-react';

interface ExitInterviewProps {
    exitId?: number;
    onSuccess?: () => void;
}

// Add finalizeInterview service here locally for now or import if available
const finalizeInterview = async (id: number, data: any) => {
    const response = await fetch(`/api/exit/${id}/interview/finalize`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to finalize interview');
    return response.json();
};

const ExitInterview: React.FC<ExitInterviewProps> = ({ exitId, onSuccess }) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'Employee' | 'HR'>('Employee');

    // HR Fields
    const [riskRating, setRiskRating] = useState('Low');
    const [hrNotes, setHrNotes] = useState('');

    useEffect(() => {
        if (exitId) {
            fetchQuestions();
        }
    }, [exitId]);

    const fetchQuestions = async () => {
        if (!exitId) return;
        setLoading(true);
        try {
            const data = await getExitInterview(exitId);
            setQuestions(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: number, field: string, value: any) => {
        // Optimistic update
        const updatedQuestions = questions.map(q => q.id === id ? { ...q, [field]: value } : q);
        setQuestions(updatedQuestions);

        try {
            const question = updatedQuestions.find(q => q.id === id);
            if (question) {
                await updateExitInterview(id, { answer: question.answer, rating: question.rating });
            }
        } catch (error) {
            console.error("Failed to save", error);
        }
    };

    const handleSubmit = async () => {
        if (mode === 'Employee') {
            const allAnswered = questions.every(q => q.answer && q.answer.trim().length > 0 && q.rating > 0);
            if (!allAnswered) {
                alert("Please answer all questions and provide a rating for each.");
                return;
            }
            alert("Exit Interview Submitted Successfully!");
            if (onSuccess) onSuccess();
        } else {
            // HR Finalize
            if (!exitId) return;
            try {
                await finalizeInterview(exitId, {
                    risk_rating: riskRating,
                    hr_notes: hrNotes,
                    interview_mode: 'HR-Led'
                });
                alert("Interview Finalized & Recorded");
                if (onSuccess) onSuccess();
            } catch (error) {
                alert("Failed to finalize");
            }
        }
    };

    // Group items by category
    const groupedQuestions = questions.reduce((acc: any, q: any) => {
        const cat = q.category || 'General';
        acc[cat] = acc[cat] || [];
        acc[cat].push(q);
        return acc;
    }, {});

    if (!exitId) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500">No active exit request found for interview.</p>
                <p className="text-xs text-slate-400 mt-2">Submit a resignation request first.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMode(mode === 'Employee' ? 'HR' : 'Employee')}
                    className="flex items-center gap-2"
                >
                    <UserCog className="w-4 h-4" /> Switch to {mode === 'Employee' ? 'HR' : 'Employee'} Mode
                </Button>
            </div>

            <Card className={`border-slate-200 ${mode === 'HR' ? 'bg-orange-50/50' : 'bg-white'}`}>
                <CardHeader className="py-4 px-6 bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                        {mode === 'HR' ? 'HR-Led Exit Interview' : 'Exit Interview'}
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                        {mode === 'HR' ? 'Record candidate responses and internal risk assessment.' : 'Please provide your honest feedback to help us improve.'}
                    </p>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    {loading ? <p>Loading questions...</p> : Object.keys(groupedQuestions).map((category) => (
                        <div key={category} className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">{category}</h3>
                            {groupedQuestions[category].map((q: any) => (
                                <div key={q.id} className="space-y-3 pb-4 border-b border-dashed border-slate-100 last:border-0 pl-2">
                                    <Label className="text-base font-medium text-slate-800 block">
                                        {q.question}
                                    </Label>
                                    <div className="space-y-4 pl-4">
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1.5 block">Response</Label>
                                            <textarea
                                                className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder={mode === 'HR' ? "Candidate's response..." : "Your answer..."}
                                                value={q.answer || ''}
                                                onChange={(e) => handleUpdate(q.id, 'answer', e.target.value)}
                                                onBlur={(e) => handleUpdate(q.id, 'answer', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 mb-1.5 block">Rating</Label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => handleUpdate(q.id, 'rating', star)}
                                                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${(q.rating || 0) >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                                                    >
                                                        <Star className="w-5 h-5 fill-current" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {mode === 'HR' && (
                        <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-4">
                            <h3 className="font-semibold text-orange-800 flex items-center">
                                <ClipboardList className="w-4 h-4 mr-2" /> HR Assessment
                            </h3>
                            <div className="grid gap-2">
                                <Label>Attrition Risk Rating</Label>
                                <select
                                    className="h-10 rounded-md border border-slate-200 px-3 py-2 text-sm"
                                    value={riskRating}
                                    onChange={(e) => setRiskRating(e.target.value)}
                                >
                                    <option value="Low">Low - Standard Exit</option>
                                    <option value="Medium">Medium - Regrettable Loss</option>
                                    <option value="High">High - Critical Impact / Key Talent</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label>HR Confidential Notes</Label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    placeholder="Internal notes on retention attempts, future rehiring potential, etc."
                                    value={hrNotes}
                                    onChange={(e) => setHrNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <Button className={mode === 'HR' ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"} onClick={handleSubmit}>
                            <CheckCircle className="w-4 h-4 mr-2" /> {mode === 'HR' ? 'Finalize & Record Exit' : 'Submit Interview'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExitInterview;
