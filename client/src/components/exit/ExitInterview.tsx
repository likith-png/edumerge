import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { getExitInterview, updateExitInterview } from '../../services/exitService';
import { 
    ChevronDown, ChevronUp, Download, CheckCircle2,
    Calendar, Clock, User, MessageSquare, ClipboardList,
    ShieldCheck, Star, Target, Info, AlertCircle, HelpCircle, ArrowLeft, ArrowRight, Save, Send, Heart,
    Users, Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

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

    const groupedQuestions = questions.reduce((acc: any, q: any) => {
        const cat = q.category || 'General';
        acc[cat] = acc[cat] || [];
        acc[cat].push(q);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-48 animate-in fade-in duration-500">
                <div className="p-4 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-100 mb-6">
                    <MessageSquare className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Loading Interview</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retrieving survey data...</p>
                </div>
            </div>
        );
    }

    if (!exitId) {
        return (
            <div className="text-center py-32 space-y-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Exit Context</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-2">
            {/* Control Section */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/50">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-slate-900 rounded-lg shadow-sm">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
                                {mode === 'HR' ? 'Governance Interview' : 'Exit Feedback'}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                {mode === 'HR' ? 'Institutional Risk Assessment' : 'Qualitative Feedback Collection'}
                            </p>
                        </div>
                    </div>

                    <Button 
                        variant="outline"
                        onClick={() => setMode(mode === 'Employee' ? 'HR' : 'Employee')}
                        className="h-12 px-6 border-slate-200 text-slate-600 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-slate-50 shadow-sm transition-all"
                    >
                        <User className="w-4 h-4 mr-2.5" />
                        Switch to {mode === 'Employee' ? 'Admin' : 'Personal'} Mode
                    </Button>
                </div>
            </Card>

            {/* Questions Matrix */}
            <div className="space-y-16">
                {Object.keys(groupedQuestions).map((category) => (
                    <div key={category} className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-5">
                            <div className="w-2 h-8 bg-slate-900 rounded-full shadow-sm" />
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{category} Phase</h3>
                            <Separator className="flex-1 bg-slate-100" />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {groupedQuestions[category].map((q: any) => (
                                <Card key={q.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                                    <div className="p-8 space-y-8">
                                        <Activity className="w-3.5 h-3.5 opacity-40" />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question Context</p>
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-snug">
                                                {q.question}
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <Label className="text-[9px] font-bold text-slate-900 uppercase tracking-widest ml-1">Your response</Label>
                                                <textarea
                                                    className="w-full min-h-[120px] bg-white border border-slate-200 rounded-xl p-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-slate-100 transition-all resize-none shadow-sm placeholder:text-slate-300"
                                                    placeholder={mode === 'HR' ? "Document response..." : "Provide your feedback..."}
                                                    value={q.answer || ''}
                                                    onChange={(e) => handleUpdate(q.id, 'answer', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-5">
                                                <Label className="text-[9px] font-bold text-slate-900 uppercase tracking-widest ml-1">Rating Level</Label>
                                                <div className="flex bg-slate-50 p-5 rounded-xl border border-slate-100 justify-between items-center transition-colors">
                                                    <div className="flex gap-3">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => handleUpdate(q.id, 'rating', star)}
                                                                className={`p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                                                                    (q.rating || 0) >= star 
                                                                        ? 'bg-slate-900 text-white shadow-md' 
                                                                        : 'bg-white text-slate-200 border border-slate-100'
                                                                }`}
                                                            >
                                                                <Star className={`w-5 h-5 ${ (q.rating || 0) >= star ? 'fill-white' : '' }`} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <Badge className="bg-white text-slate-600 border border-slate-100 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase">
                                                        {q.rating || 0} / 5
                                                    </Badge>
                                                </div>
                                                <div className="p-5 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex items-center gap-3">
                                                    <Info className="w-4 h-4 text-slate-400" />
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">This rating helps us improve institutional processes.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {mode === 'HR' && (
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden mt-20">
                        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="flex items-center gap-5 text-slate-900 text-lg font-bold uppercase tracking-tight">
                                <div className="p-2.5 bg-slate-900 text-white rounded-lg shadow-sm"><ClipboardList className="w-5 h-5" /></div>
                                Risk Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[9px] font-bold text-slate-900 uppercase tracking-widest ml-1">Attrition Risk Rating</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 bg-white border border-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-wider rounded-lg px-6 appearance-none cursor-pointer shadow-sm transition-all focus:ring-2 focus:ring-slate-100"
                                            value={riskRating}
                                            onChange={(e) => setRiskRating(e.target.value)}
                                        >
                                            <option value="Low">Low - Standard Exit</option>
                                            <option value="Medium">Medium - Strategic Friction</option>
                                            <option value="High">High - Critical Institutional breach</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[9px] font-bold text-slate-900 uppercase tracking-widest ml-1">Administrative Notes</Label>
                                    <textarea
                                        className="w-full h-12 bg-white border border-slate-200 rounded-lg px-6 py-3 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-slate-100 transition-all resize-none shadow-sm"
                                        placeholder="Internal notes on exit..."
                                        value={hrNotes}
                                        onChange={(e) => setHrNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="pt-12 flex justify-end">
                    <Button 
                        className="h-12 px-12 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-95 bg-slate-900 hover:bg-black text-white"
                        onClick={handleSubmit}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2.5" />
                        {mode === 'HR' ? 'Finalize Interview' : 'Submit Feedback'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExitInterview;
