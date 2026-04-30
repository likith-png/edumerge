import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
    Plus, Trash2, GripVertical, Save,
    Type, CheckSquare, List, Calendar, AlignLeft,
    Eye, Copy
} from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { X } from 'lucide-react';
import Layout from '../components/Layout';

type QuestionType = 'short_text' | 'long_text' | 'multiple_choice' | 'checkbox' | 'rating' | 'date';

interface Question {
    id: string;
    type: QuestionType;
    title: string;
    required: boolean;
    options?: string[];
}

const SurveyBuilder: React.FC = () => {
    const [title, setTitle] = useState('Untitled Survey');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
    const [isPreview, setIsPreview] = useState(false);

    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            type,
            title: '',
            required: false,
            options: ['Option 1']
        };
        setQuestions([...questions, newQuestion]);
        setActiveQuestion(newQuestion.id);
    };

    const duplicateQuestion = (id: string) => {
        const qToDuplicate = questions.find(q => q.id === id);
        if (qToDuplicate) {
            const newQuestion = { ...qToDuplicate, id: crypto.randomUUID() };
            const index = questions.findIndex(q => q.id === id);
            const newQuestions = [...questions];
            newQuestions.splice(index + 1, 0, newQuestion);
            setQuestions(newQuestions);
            setActiveQuestion(newQuestion.id);
        }
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const deleteQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const addOption = (qId: string) => {
        setQuestions(questions.map(q =>
            q.id === qId ? { ...q, options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] } : q
        ));
    };

    const updateOption = (qId: string, idx: number, value: string) => {
        setQuestions(questions.map(q =>
            q.id === qId && q.options ? {
                ...q,
                options: q.options.map((opt, i) => i === idx ? value : opt)
            } : q
        ));
    };

    if (isPreview) {
        return (
            <Layout
                title={title || 'Untitled Survey'}
                description={description || 'Survey Preview'}
                headerActions={
                    <Button variant="secondary" onClick={() => setIsPreview(false)} className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold border-indigo-100 h-10 px-6 shadow-sm">
                        <Eye className="w-4 h-4 mr-2" /> Back to Editor
                    </Button>
                }
            >
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-4">
                        {questions.map((q, idx) => (
                            <Card key={q.id} className="border-none shadow-sm hover:shadow-sm transition-shadow rounded-2xl overflow-hidden bg-white">
                                <CardContent className="px-4 py-4 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="font-bold text-lg text-slate-900 leading-tight">
                                                {q.title || 'Untitled Question'}
                                                {q.required && <span className="text-rose-500 ml-1">*</span>}
                                            </p>

                                            <div className="pt-2">
                                                {q.type === 'short_text' && <Input disabled placeholder="Short answer text" className="bg-slate-50 h-11 border-slate-100 rounded-xl" />}
                                                {q.type === 'long_text' && <textarea disabled className="w-full h-24 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm resize-none" placeholder="Long answer text" />}
                                                {q.type === 'date' && <Input disabled type="date" className="w-full sm:w-auto bg-slate-50 h-11 border-slate-100 rounded-xl" />}
                                                {q.type === 'rating' && (
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map(v => (
                                                            <div key={v} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 text-slate-400 font-bold hover:bg-white transition-colors">
                                                                {v}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {(q.type === 'multiple_choice' || q.type === 'checkbox') && (
                                                    <div className="space-y-3">
                                                        {q.options?.map((opt, i) => (
                                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-transparent">
                                                                <div className={`w-4 h-4 rounded-full border border-slate-300 ${q.type === 'checkbox' ? 'rounded-md' : ''}`} />
                                                                <span className="text-slate-700 font-medium">{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title="Survey Builder"
            description="Create custom questionnaires, intake forms, or professional assessments."
            headerActions={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="text-slate-500 font-bold hover:bg-slate-100 hover:text-indigo-600 rounded-full px-4"
                        onClick={() => setIsPreview(true)}
                    >
                        <Eye className="w-4 h-4 mr-2" /> Runtime Preview
                    </Button>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm shadow-indigo-100 h-10 px-8 rounded-full"
                    >
                        <Save className="w-4 h-4 mr-2" /> Save Form
                    </Button>
                </div>
            }
        >
            <div className="max-w-6xl mx-auto flex gapx-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Canvas */}
            <div className="flex-1 space-y-6 pb-20">
                {/* Survey Header */}
                <Card className="border-t-4 border-t-indigo-600 shadow-sm hover:shadow-sm transition-shadow">
                    <CardContent className="p-8 space-y-4">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-4xl font-black border-none px-0 h-auto focus-visible:ring-0 placeholder:text-slate-300 bg-transparent"
                            placeholder="Survey Title"
                        />
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="text-xl text-slate-500 border-none px-0 focus-visible:ring-0 placeholder:text-slate-300 bg-transparent font-medium"
                            placeholder="Form description"
                        />
                    </CardContent>
                </Card>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <Card
                            key={q.id}
                            className={`transition-all duration-200 border-l-4 ${activeQuestion === q.id ? 'border-l-indigo-600 ring-1 ring-indigo-100 shadow-xl scale-[1.01]' : 'border-l-transparent hover:shadow-sm'
                                }`}
                            onClick={() => setActiveQuestion(q.id)}
                        >
                            <CardContent className="px-4 pb-4">
                                <div className="flex gap-4">
                                    <div className="mt-2 text-slate-300 cursor-move hover:text-indigo-400">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex gap-4">
                                            <Input
                                                value={q.title}
                                                onChange={(e) => updateQuestion(q.id, 'title', e.target.value)}
                                                placeholder={`Question ${idx + 1}`}
                                                className={`bg-slate-50 border-slate-200 text-lg font-bold transition-all ${activeQuestion === q.id ? 'bg-white border-indigo-200' : ''}`}
                                            />
                                            <Select
                                                value={q.type}
                                                onValueChange={(v) => updateQuestion(q.id, 'type', v as QuestionType)}
                                            >
                                                <SelectTrigger className="w-[200px] font-bold text-slate-600">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="short_text"><div className="flex items-center gap-2"><Type className="w-4 h-4" /> Short Answer</div></SelectItem>
                                                    <SelectItem value="long_text"><div className="flex items-center gap-2"><AlignLeft className="w-4 h-4" /> Paragraph</div></SelectItem>
                                                    <SelectItem value="multiple_choice"><div className="flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Multiple Choice</div></SelectItem>
                                                    <SelectItem value="checkbox"><div className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-slate-500" /> Checkboxes</div></SelectItem>
                                                    <SelectItem value="rating"><div className="flex items-center gap-2"><List className="w-4 h-4" /> Rating Scale</div></SelectItem>
                                                    <SelectItem value="date"><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</div></SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Question Type Specific Inputs */}
                                        <div className="pl-1">
                                            {(q.type === 'multiple_choice' || q.type === 'checkbox') && (
                                                <div className="space-y-3">
                                                    {q.options?.map((opt, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 group">
                                                            <div className={`w-4 h-4 border border-slate-300 ${q.type === 'checkbox' ? 'rounded-md' : 'rounded-full'}`} />
                                                            <Input
                                                                value={opt}
                                                                onChange={(e) => updateOption(q.id, idx, e.target.value)}
                                                                className="h-9 text-sm border-transparent hover:border-slate-200 focus:border-indigo-400 focus:bg-white transition-all bg-transparent"
                                                                placeholder={`Option ${idx + 1}`}
                                                            />
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                                                const newOptions = q.options?.filter((_, i) => i !== idx);
                                                                updateQuestion(q.id, 'options', newOptions);
                                                            }}>
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => addOption(q.id)}
                                                        className="text-indigo-600 hover:text-indigo-700 font-bold h-8 px-2 hover:bg-indigo-50"
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> Add Option
                                                    </Button>
                                                </div>
                                            )}
                                            {q.type === 'short_text' && (
                                                <div className="border-b border-dashed border-slate-300 py-2 text-slate-400 text-sm">Short answer text</div>
                                            )}
                                            {q.type === 'long_text' && (
                                                <div className="border border-dashed border-slate-300 rounded h-20 p-2 text-slate-400 text-sm">Long answer text</div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); duplicateQuestion(q.id); }}
                                                className="text-slate-500 hover:text-indigo-600"
                                                title="Duplicate"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <div className="w-px h-4 bg-slate-200" />
                                            <div className="flex items-center gap-2 mr-2">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required</span>
                                                <Switch
                                                    checked={q.required}
                                                    onCheckedChange={(c) => updateQuestion(q.id, 'required', c)}
                                                />
                                            </div>
                                            <div className="w-px h-4 bg-slate-200" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {questions.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                            <h3 className="text-slate-400 font-bold">Your survey is empty</h3>
                            <p className="text-slate-400 text-sm mb-4">Add a question from the toolbox to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Toolbox */}
            <div className="w-64 space-y-4">
                <Card className="sticky topx-4 py-4 shadow-xl shadow-indigo-100 border-indigo-100">
                    <CardHeader className="pb-3 bg-indigo-50/50">
                        <CardTitle className="text-sm font-black uppercase tracking-wider text-indigo-900">Toolbox</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-3">
                        <Button variant="ghost" className="w-full justify-start font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => addQuestion('multiple_choice')}>
                            <Plus className="w-4 h-4 mr-2" /> Add Question
                        </Button>
                        <div className="h-px bg-slate-100 my-2" />
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="justify-center border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600" onClick={() => addQuestion('short_text')} title="Short Text">
                                <Type className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="justify-center border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600" onClick={() => addQuestion('long_text')} title="Paragraph">
                                <AlignLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="justify-center border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600" onClick={() => addQuestion('multiple_choice')} title="Multiple Choice">
                                <CheckSquare className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="justify-center border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600" onClick={() => addQuestion('rating')} title="Rating">
                                <List className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm shadow-indigo-200"
                                onClick={() => setIsPreview(true)}
                            >
                                <Eye className="w-4 h-4 mr-2" /> Preview
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold"
                            >
                                <Save className="w-4 h-4 mr-2" /> Save Form
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </div>
        </Layout>
    );
};

export default SurveyBuilder;
