import React, { useState } from 'react';
import {
    BookOpen, Settings, FileText, Upload,
    Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
    CheckCircle, Video, File, Link as LinkIcon,
    ChevronLeft, Mic, Layers, UserCheck, Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

// --- Types ---
type ContentType = 'Video' | 'PDF' | 'PPT' | 'Audio' | 'SCORM' | 'Link' | 'Quiz' | 'Assignment';

interface Lesson {
    id: string;
    title: string;
    type: ContentType;
    duration: string; // e.g., "10m"
    isMandatory: boolean;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Section {
    id: string;
    title: string;
    modules: Module[];
}

interface CourseMetadata {
    title: string;
    description: string;
    category: string;
    level: string;
    language: string;
    template: 'Standard' | 'CBSE' | 'FDP' | 'Policy';
    complianceMap: string;
}

interface CourseAuthoringProps {
    onBack: () => void;
}

// --- Mock Initial Data ---
const INITIAL_SECTIONS: Section[] = [
    {
        id: 's1',
        title: 'Section 1: Introduction',
        modules: [
            {
                id: 'm1',
                title: 'Module 1: Getting Started',
                lessons: [
                    { id: 'l1', title: 'Welcome Video', type: 'Video', duration: '5m', isMandatory: true },
                    { id: 'l2', title: 'Course Overview', type: 'PDF', duration: '10m', isMandatory: false }
                ]
            }
        ]
    }
];

const CourseAuthoring: React.FC<CourseAuthoringProps> = ({ onBack }) => {
    const [metadata, setMetadata] = useState<CourseMetadata>({
        title: 'Untitled Course',
        description: '',
        category: 'Pedagogy',
        level: 'Intermediate',
        language: 'English',
        template: 'Standard',
        complianceMap: 'N/A'
    });

    const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
    const [activeTab, setActiveTab] = useState('curriculum');
    const [workflowStatus, setWorkflowStatus] = useState<'Draft' | 'Review' | 'Approved' | 'Published'>('Draft');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ 's1': true });

    // --- Helpers ---
    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const addSection = () => {
        const newSection: Section = {
            id: `s${Date.now()}`,
            title: 'New Section',
            modules: []
        };
        setSections([...sections, newSection]);
    };

    const addModule = (sectionId: string) => {
        setSections(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    modules: [...s.modules, { id: `m${Date.now()}`, title: 'New Module', lessons: [] }]
                };
            }
            return s;
        }));
    };

    const addLesson = (sectionId: string, moduleId: string, type: ContentType = 'Video', title: string = 'New Lesson', duration: string = '5m') => {
        setSections(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    modules: s.modules.map(m => {
                        if (m.id === moduleId) {
                            return {
                                ...m,
                                lessons: [...m.lessons, {
                                    id: `l${Date.now()}`,
                                    title,
                                    type,
                                    duration,
                                    isMandatory: true
                                }]
                            };
                        }
                        return m;
                    })
                };
            }
            return s;
        }));
    };

    const LessonContentDialog = ({ onAdd }: { onAdd: (type: ContentType, title: string, duration: string) => void }) => {
        const [step, setStep] = useState<'type' | 'details'>('type');
        const [selectedType, setSelectedType] = useState<ContentType>('Video');
        const [title, setTitle] = useState('');
        const [duration, setDuration] = useState('');

        const handleTypeSelect = (type: ContentType) => {
            setSelectedType(type);
            setStep('details');
            setTitle(`New ${type} Lesson`);
        };

        return (
            <>
                <DialogHeader>
                    <DialogTitle>{step === 'type' ? 'Select Lesson Type' : `Configure ${selectedType} Content`}</DialogTitle>
                </DialogHeader>

                {step === 'type' ? (
                    <div className="grid grid-cols-4 gap-4 py-6">
                        {[
                            { type: 'Video', icon: Video, color: 'text-blue-500 bg-blue-50' },
                            { type: 'PDF', icon: FileText, color: 'text-red-500 bg-red-50' },
                            { type: 'Quiz', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
                            { type: 'Link', icon: LinkIcon, color: 'text-slate-500 bg-slate-50' },
                        ].map((item) => (
                            <button
                                key={item.type}
                                onClick={() => handleTypeSelect(item.type as ContentType)}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group/type"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} group-hover/type:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-slate-700 text-sm">{item.type}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Lesson Title</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration (e.g. 10m)</Label>
                                <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="5m" />
                            </div>
                        </div>

                        {selectedType === 'Video' && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="border-2 border-dashed border-slate-200 rounded-xl px-4 py-4 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-700">Upload Video File</p>
                                    <p className="text-xs text-slate-400">MP4, WebM up to 2GB</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or import URL</span></div>
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="https://youtube.com/..." />
                                    <Button variant="secondary">Import</Button>
                                </div>
                            </div>
                        )}

                        {selectedType === 'PDF' && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-700">Upload Document</p>
                                    <p className="text-xs text-slate-400">PDF, PPTX, DOCX</p>
                                </div>
                            </div>
                        )}

                        {selectedType === 'Link' && (
                            <div className="space-y-2 pt-4 border-t border-slate-100">
                                <Label>External Resource URL</Label>
                                <Input placeholder="https://..." />
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setStep('type')}>Back</Button>
                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => onAdd(selectedType, title, duration || '5m')}>
                                Add Lesson
                            </Button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const deleteSection = (sectionId: string) => {
        setSections(sections.filter(s => s.id !== sectionId));
    };

    const deleteLesson = (sectionId: string, moduleId: string, lessonId: string) => {
        setSections(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    modules: s.modules.map(m => {
                        if (m.id === moduleId) {
                            return {
                                ...m,
                                lessons: m.lessons.filter(l => l.id !== lessonId)
                            };
                        }
                        return m;
                    })
                };
            }
            return s;
        }));
    };

    const [editingLesson, setEditingLesson] = useState<{ sectionId: string, moduleId: string, lesson: Lesson } | null>(null);

    const updateLesson = (updates: Partial<Lesson>) => {
        if (!editingLesson) return;
        setSections(sections.map(s => {
            if (s.id === editingLesson.sectionId) {
                return {
                    ...s,
                    modules: s.modules.map(m => {
                        if (m.id === editingLesson.moduleId) {
                            return {
                                ...m,
                                lessons: m.lessons.map(l => {
                                    if (l.id === editingLesson.lesson.id) {
                                        return { ...l, ...updates };
                                    }
                                    return l;
                                })
                            };
                        }
                        return m;
                    })
                };
            }
            return s;
        }));
        setEditingLesson(prev => prev ? { ...prev, lesson: { ...prev.lesson, ...updates } } : null);
    };

    const getIconForType = (type: ContentType) => {
        switch (type) {
            case 'Video': return <Video className="w-4 h-4 text-blue-500" />;
            case 'PDF': return <FileText className="w-4 h-4 text-red-500" />;
            case 'Audio': return <Mic className="w-4 h-4 text-purple-500" />;
            case 'Link': return <LinkIcon className="w-4 h-4 text-slate-500" />;
            case 'SCORM': return <Layers className="w-4 h-4 text-orange-500" />;
            default: return <File className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Top Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all w-10 h-10">
                        <ChevronLeft className="w-5 h-5 text-slate-900" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">{metadata.title}</h1>
                            <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-100 ${
                                workflowStatus === 'Draft' ? 'bg-slate-100 text-slate-500' :
                                workflowStatus === 'Review' ? 'bg-amber-100 text-amber-700' :
                                workflowStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                'bg-indigo-600 text-white'
                            }`}>{workflowStatus}</Badge>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Authoring Hub</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Workflow Actions */}
                    {workflowStatus === 'Draft' && (
                        <Button
                            onClick={() => setWorkflowStatus('Review')}
                            className="h-9 px-4 rounded-lg gap-2 font-bold text-[10px] uppercase tracking-widest bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                        >
                            <Upload className="w-4 h-4" /> Submit Review
                        </Button>
                    )}

                    {workflowStatus === 'Review' && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setWorkflowStatus('Draft')}
                                className="h-9 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest text-red-600 border-red-100 hover:bg-red-50"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => setWorkflowStatus('Approved')}
                                className="h-9 px-4 rounded-lg gap-2 font-bold text-[10px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            >
                                <UserCheck className="w-4 h-4" /> Approve
                            </Button>
                        </div>
                    )}

                    {workflowStatus === 'Approved' && (
                        <Button
                            onClick={() => setWorkflowStatus('Published')}
                            className="h-9 px-4 rounded-lg gap-2 font-bold text-[10px] uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        >
                            <Upload className="w-4 h-4" /> Go Live
                        </Button>
                    )}

                    <div className="h-6 w-px bg-slate-200 mx-1"></div>

                    <Button variant="ghost" size="icon" onClick={() => setActiveTab('settings')} className="text-slate-400 hover:text-slate-900 transition-colors w-9 h-9 rounded-lg bg-slate-50 border border-slate-200">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Nav */}
                <div className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 space-y-8">
                    <div className="space-y-2">
                        {[
                            { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                            { id: 'assessments', label: 'Assessments', icon: CheckCircle },
                            { id: 'settings', label: 'Basics', icon: Settings },
                            { id: 'certification', label: 'Credentials', icon: Award },
                            { id: 'review', label: 'Publishing', icon: Upload },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === item.id
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-4 border-t border-slate-100">
                        <div className="bg-indigo-50 rounded-xl p-4 text-center">
                            <p className="text-xs font-bold text-indigo-900 mb-2">Need Guidance?</p>
                            <Button size="sm" variant="outline" className="w-full bg-white border-indigo-100 text-indigo-600 text-xs font-bold h-8 rounded-lg">
                                Review Docs
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">

                        {activeTab === 'settings' && (
                            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900">System Basics</CardTitle>
                                            <CardDescription className="text-xs font-medium text-slate-500">Foundational configuration for your course content</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Course Title</Label>
                                        <Input
                                            value={metadata.title}
                                            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                            className="h-11 bg-white border-slate-200 focus:ring-1 focus:ring-indigo-500 font-semibold rounded-lg"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Category</Label>
                                            <Select value={metadata.category} onValueChange={(v) => setMetadata({ ...metadata, category: v })}>
                                                <SelectTrigger className="h-11 bg-white border-slate-200 rounded-lg font-semibold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-slate-200">
                                                    <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                                    <SelectItem value="Technology">Technology</SelectItem>
                                                    <SelectItem value="Leadership">Leadership</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Template</Label>
                                            <Select value={metadata.template} onValueChange={(v) => setMetadata({ ...metadata, template: v as any })}>
                                                <SelectTrigger className="h-11 bg-white border-slate-200 rounded-lg font-semibold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-slate-200">
                                                    <SelectItem value="Standard">Standard Course</SelectItem>
                                                    <SelectItem value="CBSE">CBSE Compatible (50Hrs)</SelectItem>
                                                    <SelectItem value="FDP">Faculty Development Program</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-6 border-t border-slate-100">
                                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            Compliance Mapping
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Norm/Rule</Label>
                                                <Select value={metadata.complianceMap} onValueChange={(v) => setMetadata({ ...metadata, complianceMap: v })}>
                                                    <SelectTrigger className="h-11 bg-white border-slate-200 rounded-lg font-semibold">
                                                        <SelectValue placeholder="Select Rule..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-slate-200">
                                                        <SelectItem value="N/A">Not Applicable</SelectItem>
                                                        <SelectItem value="CBSE-50h">CBSE 50 Hours Mandate</SelectItem>
                                                        <SelectItem value="NEP-2020">NEP 2020 Implementation</SelectItem>
                                                        <SelectItem value="POSH">POSH / Safety Compliance</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Credit Hours</Label>
                                                <Input
                                                    className="h-11 bg-white border-slate-200 rounded-lg font-semibold px-4"
                                                    placeholder="e.g. 5"
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Description</Label>
                                        <Textarea
                                            value={metadata.description}
                                            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                            className="min-h-[120px] bg-white border-slate-200 rounded-lg resize-none p-4 font-medium"
                                            placeholder="Describe what learners will achieve..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'curriculum' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Curriculum Hierarchy</h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Building functional knowledge modules</p>
                                    </div>
                                    <Button onClick={addSection} className="h-10 px-6 rounded-lg bg-slate-900 text-white hover:bg-black font-bold text-xs gap-2">
                                        <Plus className="w-4 h-4" /> New Section
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {sections.map((section) => (
                                        <div key={section.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group/section">
                                            <div
                                                className="flex items-center gap-4 p-5 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
                                                onClick={() => toggleSection(section.id)}
                                            >
                                                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                                                        {expandedSections[section.id] ? <ChevronDown className="w-4 h-4 text-slate-900" /> : <ChevronRight className="w-4 h-4 text-slate-900" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 text-base">{section.title}</h3>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{section.modules.length} Modules • {section.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Units</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addModule(section.id); }} className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest gap-1.5 border-slate-200 text-slate-700 hover:bg-white shadow-sm">
                                                        <Plus className="w-3 h-3" /> Module
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className="h-8 w-8 text-slate-400 hover:text-red-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {expandedSections[section.id] && (
                                                <div className="p-6 space-y-4 bg-white">
                                                    {section.modules.length === 0 && (
                                                        <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                                                                <Layers className="w-5 h-5 text-slate-300" />
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">No content modules established</p>
                                                            <Button size="sm" variant="outline" onClick={() => addModule(section.id)} className="h-9 px-4 rounded-lg text-indigo-600 hover:bg-indigo-50 font-bold text-[10px] uppercase tracking-widest border-indigo-100">
                                                                Add First Module
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {section.modules.map((module) => (
                                                        <div key={module.id} className="ml-8 border-l border-indigo-100 pl-6 relative pb-6 last:pb-2">
                                                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-400 shadow-sm"></div>
                                                            <div className="mb-4 flex items-center justify-between group/module">
                                                                <div className="flex-1">
                                                                    <Input
                                                                        defaultValue={module.title}
                                                                        className="h-8 border-transparent hover:border-slate-200 focus:border-indigo-500 bg-transparent font-bold text-slate-700 px-0 w-full max-w-sm transition-all text-sm"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2 opacity-0 group-hover/module:opacity-100 transition-opacity">
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button size="sm" variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 gap-1.5 border border-indigo-100">
                                                                                <Plus className="w-3.5 h-3.5" /> Unit
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="sm:max-w-lg rounded-xl p-6">
                                                                            <LessonContentDialog
                                                                                onAdd={(type, title, duration) => addLesson(section.id, module.id, type, title, duration)}
                                                                            />
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                {module.lessons.map((lesson) => (
                                                                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-white rounded-lg group/lesson hover:shadow-sm border border-slate-100 transition-all">
                                                                        <GripVertical className="w-3.5 h-3.5 text-slate-200 cursor-grab" />
                                                                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                                                            {getIconForType(lesson.type)}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <span className="text-sm font-bold text-slate-900 block">{lesson.title}</span>
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lesson.type} • {lesson.duration}</span>
                                                                        </div>
                                                                        <div className="opacity-0 group-hover/lesson:opacity-100 flex gap-1 transition-opacity">
                                                                            <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                    <Button size="icon" variant="ghost" onClick={() => setEditingLesson({ sectionId: section.id, moduleId: module.id, lesson })} className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-lg">
                                                                                        <Settings className="w-4 h-4" />
                                                                                    </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="rounded-xl p-8">
                                                                                    <DialogHeader>
                                                                                        <DialogTitle className="text-xl font-bold">Unit Configuration</DialogTitle>
                                                                                    </DialogHeader>
                                                                                    <div className="space-y-5 py-5">
                                                                                        <div className="space-y-1.5">
                                                                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Unit Display Title</Label>
                                                                                            <Input
                                                                                                className="h-11 rounded-lg bg-slate-50 border-slate-200 font-bold"
                                                                                                value={editingLesson?.lesson?.title || ''}
                                                                                                onChange={(e) => updateLesson({ title: e.target.value })}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="space-y-1.5">
                                                                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Duration</Label>
                                                                                            <Input
                                                                                                className="h-11 rounded-lg bg-slate-50 border-slate-200 font-bold"
                                                                                                value={editingLesson?.lesson?.duration || ''}
                                                                                                onChange={(e) => updateLesson({ duration: e.target.value })}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-lg border border-slate-200">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                id="mandatory"
                                                                                                checked={editingLesson?.lesson?.isMandatory}
                                                                                                onChange={(e) => updateLesson({ isMandatory: e.target.checked })}
                                                                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                                                            />
                                                                                            <Label htmlFor="mandatory" className="text-sm font-bold text-slate-700 cursor-pointer">Mark as Mandatory</Label>
                                                                                        </div>
                                                                                    </div>
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                            <Button size="icon" variant="ghost" onClick={() => deleteLesson(section.id, module.id, lesson.id)} className="h-8 w-8 text-slate-300 hover:text-red-500 rounded-lg">
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAuthoring;
