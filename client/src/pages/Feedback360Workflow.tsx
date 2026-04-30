import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
    MessageSquare, User, Users, GraduationCap, UserCheck, 
    Send, CheckCircle2, ShieldCheck, Info, Star,
    ArrowRight, ChevronRight, Activity, Zap
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

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
        { id: 'self', label: 'Self Feedback', icon: User, desc: 'Personal Qualitative Reflection' },
        { id: 'manager', label: 'Superior Review', icon: UserCheck, desc: 'Institutional Performance Audit' },
        { id: 'peer', label: 'Peer Assessment', icon: Users, desc: 'Colleague Synthesis', completed: true },
        { id: 'student', label: 'Institutional Echo', icon: GraduationCap, desc: 'Stakeholder Feedback Loop' }
    ];

    const feedbackCategories: FeedbackCategory[] = [
        {
            id: 'teaching',
            category: 'Pedagogical Precision',
            question: 'Critique the instructional clarity and depth of conceptual transmission.'
        },
        {
            id: 'communication',
            category: 'Strategic Articulation',
            question: 'Evaluate the effectiveness of multi-channel stakeholder communication.'
        },
        {
            id: 'collaboration',
            category: 'Teamwork Synergy',
            question: 'Assess the faculty synergy within cross-functional institutional pods.'
        },
        {
            id: 'innovation',
            category: 'Creative Protocol',
            question: 'Analyze the proactive implementation of novel pedagogical frameworks.'
        },
        {
            id: 'professionalism',
            category: 'Conduct Integrity',
            question: 'Audit the adherence to institutional standards and professional rigor.'
        }
    ];

    const handleRatingChange = (categoryId: string, rating: number) => {
        setRatings({ ...ratings, [categoryId]: rating });
    };

    const handleSubmit = () => {
        const allRated = feedbackCategories.every(cat => ratings[cat.id]);
        if (allRated && comments.trim()) {
            alert('🎉 360° Qualitative Trace Persisted Successfully!');
        } else {
            alert('Trace obstruction: All categories require qualitative intensity metrics.');
        }
    };

    const activeRater = raterTypes.find(r => r.id === activeRaterType)!;
    const completedCount = raterTypes.filter(r => r.completed).length;

    return (
        <Layout
            title="360° Qualitative Audit"
            description="Multi-rater institutional performance sentiment capture."
            icon={MessageSquare}
            showBack
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto py-6">
                
                {/* Progress Summary */}
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6 text-center md:text-left">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Feedback Progress</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Employee: Reshma Binu Prasad (FAC001) • Performance Period 2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <h1 className="text-5xl font-bold text-slate-900 leading-none">{completedCount}/{raterTypes.length}</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roles Completed</p>
                            </div>
                            <div className="w-px bg-slate-100 h-12" />
                            <div className="flex flex-col gap-1.5">
                                {raterTypes.map((r, i) => (
                                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${r.completed ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rater Selection Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {raterTypes.map((rater) => {
                        const RaterIcon = rater.icon;
                        const isActive = activeRaterType === rater.id;
                        return (
                            <button
                                key={rater.id}
                                onClick={() => setActiveRaterType(rater.id)}
                                className={`group relative p-6 rounded-xl border-2 transition-all text-left overflow-hidden
                                    ${isActive 
                                        ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100' 
                                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-white'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg border transition-colors ${isActive ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-white border-slate-100 text-slate-300'}`}>
                                        <RaterIcon className="w-5 h-5" />
                                    </div>
                                    {rater.completed && (
                                        <div className="bg-emerald-100 text-emerald-600 rounded-full p-1 border border-emerald-200">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{rater.label}</h4>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>{rater.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Main Audit Form */}
                <Card className="border border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white animate-in slide-in-from-bottom-6 duration-700">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                                <activeRater.icon className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-900 leading-none">{activeRater.label} Form</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Please provide objective ratings based on observed performance</p>
                            </div>
                        </div>
                        {activeRater.id === 'student' && (
                            <Badge className="bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Anonymous Submission
                            </Badge>
                        )}
                    </CardHeader>
                    
                    <CardContent className="p-8 md:p-12 space-y-12">
                        {feedbackCategories.map((category, idx) => (
                            <div key={category.id} className="space-y-6 animate-in fade-in duration-500">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Question {idx + 1}</p>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{category.question}</h3>
                                </div>

                                <div className="flex flex-wrap gap-2 md:gap-4">
                                    {[1, 2, 3, 4, 5].map((rating) => {
                                        const isSelected = ratings[category.id] === rating;
                                        return (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => handleRatingChange(category.id, rating)}
                                                className={`flex-1 h-14 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-0.5 relative
                                                    ${isSelected 
                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-slate-50'}`}
                                            >
                                                <span className="text-lg font-bold">{rating}</span>
                                                <p className={`text-[7px] font-bold uppercase tracking-widest ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                    {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="space-y-3 pt-8 border-t border-slate-100">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Detailed Observations</Label>
                            <Textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Provide specific examples and areas for growth..."
                                className="w-full min-h-[160px] bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none outline-none"
                                required
                            />
                        </div>

                        {activeRater.id === 'student' && (
                            <div className="p-6 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-4">
                                <Info className="w-5 h-5 text-orange-600 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-orange-950 uppercase tracking-tight">Identity Protection</h4>
                                    <p className="text-[10px] text-orange-700 font-medium leading-relaxed">Your feedback is anonymous. Only aggregated scores and anonymized comments will be shared with the employee.</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <Button variant="outline" className="h-12 px-8 rounded-lg font-bold uppercase text-[10px] tracking-widest border-slate-200 text-slate-500 hover:text-slate-900 transition-all flex-1">
                                Save Draft
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="flex-[2] h-12 rounded-lg bg-indigo-600 hover:bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 transition-all"
                            >
                                <Send className="w-4 h-4 mr-3" />
                                Submit Feedback
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Feedback360Workflow;
