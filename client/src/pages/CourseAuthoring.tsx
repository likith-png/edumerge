import React, { useState } from 'react';
import {
    BookOpen, Settings, FileText, Upload,
    Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
    CheckCircle, Video, File, Link as LinkIcon,
    ChevronLeft, Mic, Layers, ArrowUp, ArrowDown, UserCheck, Award
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
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
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

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        setSections(newSections);
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
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100/80">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">{metadata.title}</h1>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-slate-200 text-slate-500">{workflowStatus}</Badge>
                        </div>
                        <p className="text-xs font-bold text-slate-400">Last saved: Just now</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Workflow Status Indicator */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 px-3">
                        <div className={`w-2 h-2 rounded-full ${workflowStatus === 'Draft' ? 'bg-slate-400' :
                            workflowStatus === 'Review' ? 'bg-amber-500 animate-pulse' :
                                workflowStatus === 'Approved' ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`} />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">{workflowStatus}</span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2"></div>

                    {/* Workflow Actions */}
                    {workflowStatus === 'Draft' && (
                        <Button
                            onClick={() => setWorkflowStatus('Review')}
                            className="gap-2 font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200"
                        >
                            <Upload className="w-4 h-4" /> Submit for Review
                        </Button>
                    )}

                    {workflowStatus === 'Review' && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setWorkflowStatus('Draft')}
                                className="gap-2 font-bold text-red-600 hover:bg-red-50 border-red-100"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => setWorkflowStatus('Approved')}
                                className="gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                            >
                                <UserCheck className="w-4 h-4" /> Approve
                            </Button>
                        </>
                    )}

                    {workflowStatus === 'Approved' && (
                        <Button
                            onClick={() => setWorkflowStatus('Published')}
                            className="gap-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        >
                            <Upload className="w-4 h-4" /> Publish Course
                        </Button>
                    )}

                    <Button variant="ghost" size="icon" onClick={() => setActiveTab('settings')} className="text-slate-400 hover:text-slate-600">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Nav */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 space-y-1">
                        {[
                            { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                            { id: 'assessments', label: 'Assessments', icon: CheckCircle },
                            { id: 'settings', label: 'Settings', icon: Settings },
                            { id: 'certification', label: 'Certification', icon: Award },
                            { id: 'review', label: 'Review & Publish', icon: Upload },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-4 border-t border-slate-100">
                        <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                            <p className="text-xs font-bold text-indigo-900 mb-2">Need Help?</p>
                            <Button size="sm" variant="outline" className="w-full bg-white border-indigo-200 text-indigo-600 text-xs font-bold h-8">
                                Documentation
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">

                        {activeTab === 'settings' && (
                            <Card className="border-none shadow-xl rounded-[2rem]">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-2xl font-black text-slate-900">Course Settings</CardTitle>
                                    <CardDescription>Configure basic course information and compliance mapping.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-6">
                                    <div className="space-y-2">
                                        <Label>Course Title</Label>
                                        <Input
                                            value={metadata.title}
                                            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                            className="h-12 bg-slate-50 border-slate-200 font-bold text-lg"
                                            placeholder="e.g. Advanced Classroom Management"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select value={metadata.category} onValueChange={(v) => setMetadata({ ...metadata, category: v })}>
                                                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                                    <SelectItem value="Technology">Technology</SelectItem>
                                                    <SelectItem value="Leadership">Leadership</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Template</Label>
                                            <Select value={metadata.template} onValueChange={(v) => setMetadata({ ...metadata, template: v as any })}>
                                                <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Standard">Standard Course</SelectItem>
                                                    <SelectItem value="CBSE">CBSE Compatible (50Hrs)</SelectItem>
                                                    <SelectItem value="FDP">Faculty Development Program</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            Compliance & Credit Mapping
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Mapped Rule/Norm</Label>
                                                <Select value={metadata.complianceMap} onValueChange={(v) => setMetadata({ ...metadata, complianceMap: v })}>
                                                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                                                        <SelectValue placeholder="Select Rule..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="N/A">Not Applicable</SelectItem>
                                                        <SelectItem value="CBSE-50h">CBSE 50 Hours Mandate</SelectItem>
                                                        <SelectItem value="NEP-2020">NEP 2020 Implementation</SelectItem>
                                                        <SelectItem value="POSH">POSH / Safety Compliance</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Credit Hours Awarded</Label>
                                                <Input
                                                    className="h-11 bg-slate-50 border-slate-200"
                                                    placeholder="e.g. 5"
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={metadata.description}
                                            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                            className="min-h-[120px] bg-slate-50 border-slate-200 resize-none"
                                            placeholder="Describe what learners will achieve..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'certification' && (
                            <Card className="border-none shadow-xl rounded-[2rem]">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-2xl font-black text-slate-900">Certification & Rewards</CardTitle>
                                    <CardDescription>Configure automatic badge awards and issuance criteria.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-6">
                                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-6">
                                        <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                                            <Award className="w-5 h-5" />
                                            Auto-Issuance Rules
                                        </h3>
                                        <p className="text-xs text-indigo-700">Define the logic for awarding credentials upon course completion.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-yellow-500" />
                                            Available Badges
                                        </h3>

                                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900">High Achiever (Silver)</h4>
                                                <p className="text-xs text-slate-500">Awarded for &gt;90% score in assessments.</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-indigo h-5 w-9 rounded-full bg-slate-200 checked:bg-indigo-600 cursor-pointer" />
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
                                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900">Master (Gold)</h4>
                                                <p className="text-xs text-slate-500">Awarded for 100% score + Early Completion.</p>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-indigo h-5 w-9 rounded-full bg-slate-200 checked:bg-indigo-600 cursor-pointer" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-slate-100">
                                        <h3 className="font-bold text-slate-900">Certificate Template</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border-2 border-indigo-600 bg-indigo-50/50 rounded-xl p-4 text-center cursor-pointer">
                                                <div className="h-24 bg-white border border-indigo-100 rounded-lg mb-2 mx-auto shadow-sm flex items-center justify-center text-[10px] text-slate-400">Preview</div>
                                                <p className="text-xs font-bold text-indigo-700">Standard Certificate</p>
                                            </div>
                                            <div className="border border-slate-200 hover:border-indigo-300 rounded-xl p-4 text-center cursor-pointer transition-colors">
                                                <div className="h-24 bg-slate-50 border border-slate-100 rounded-lg mb-2 mx-auto flex items-center justify-center text-[10px] text-slate-400">Preview</div>
                                                <p className="text-xs font-bold text-slate-600">Clean Minimal</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'curriculum' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Curriculum Builder</h2>
                                        <p className="text-slate-500 font-medium">Structure your course with sections, modules, and lessons.</p>
                                    </div>
                                    <Button onClick={addSection} className="bg-slate-900 text-white hover:bg-slate-800 font-bold gap-2">
                                        <Plus className="w-4 h-4" /> Add Section
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {sections.map((section) => (
                                        <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group/section">
                                            <div
                                                className="flex items-center gap-4 p-4 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
                                                onClick={() => toggleSection(section.id)}
                                            >
                                                <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                                                <button className="p-1 rounded-md hover:bg-slate-200 text-slate-400">
                                                    {expandedSections[section.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </button>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900 text-base">{section.title}</h3>
                                                    <p className="text-xs text-slate-400 font-medium">{section.modules.length} Modules • {section.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</p>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                                    <div className="flex items-center mr-2 bg-slate-100 rounded-lg p-0.5">
                                                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); moveSection(sections.indexOf(section), 'up'); }} className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                                            <ArrowUp className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); moveSection(sections.indexOf(section), 'down'); }} className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                                            <ArrowDown className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addModule(section.id); }} className="h-8 text-xs font-bold gap-1">
                                                        <Plus className="w-3 h-3" /> Module
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className="h-8 w-8 text-slate-400 hover:text-red-500">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {expandedSections[section.id] && (
                                                <div className="p-4 space-y-4 bg-white">
                                                    {section.modules.length === 0 && (
                                                        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                                                            <p className="text-xs text-slate-400 font-bold mb-2">No modules yet</p>
                                                            <Button size="sm" variant="ghost" onClick={() => addModule(section.id)} className="text-indigo-600 hover:bg-indigo-50 font-bold text-xs">
                                                                Create First Module
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {section.modules.map((module) => (
                                                        <div key={module.id} className="ml-8 border-l-2 border-slate-100 pl-6 relative">
                                                            <div className="absolute -left-[7px] top-3 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></div>
                                                            <div className="mb-3 flex items-center justify-between group/module">
                                                                <div className="flex-1">
                                                                    <Input
                                                                        defaultValue={module.title}
                                                                        className="h-9 border-transparent hover:border-slate-200 focus:border-indigo-500 bg-transparent font-bold text-slate-700 px-2 -ml-2 w-full max-w-md transition-all"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2 opacity-0 group-hover/module:opacity-100 transition-opacity">
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-indigo-600 hover:bg-indigo-50 gap-1">
                                                                                <Plus className="w-3 h-3" /> Lesson
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="sm:max-w-xl">
                                                                            <LessonContentDialog
                                                                                onAdd={(type, title, duration) => addLesson(section.id, module.id, type, title, duration)}
                                                                            />
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                {module.lessons.map((lesson) => (
                                                                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group/lesson hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
                                                                        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                                                                        <div className="p-2 bg-white rounded-md shadow-sm">
                                                                            {getIconForType(lesson.type)}
                                                                        </div>
                                                                        <span className="text-sm font-medium text-slate-700 flex-1">{lesson.title}</span>
                                                                        <Badge variant="secondary" className="text-[10px] font-bold bg-slate-200 text-slate-500">{lesson.duration}</Badge>
                                                                        <div className="opacity-0 group-hover/lesson:opacity-100 flex gap-1">
                                                                            <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                    <Button size="icon" variant="ghost" onClick={() => setEditingLesson({ sectionId: section.id, moduleId: module.id, lesson })} className="h-7 w-7 text-slate-400 hover:text-indigo-600">
                                                                                        <Settings className="w-3.5 h-3.5" />
                                                                                    </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent>
                                                                                    <DialogHeader>
                                                                                        <DialogTitle>Edit Lesson Details</DialogTitle>
                                                                                    </DialogHeader>
                                                                                    <div className="space-y-4 py-4">
                                                                                        <div className="space-y-2">
                                                                                            <Label>Lesson Title</Label>
                                                                                            <Input
                                                                                                value={editingLesson?.lesson?.title || ''}
                                                                                                onChange={(e) => updateLesson({ title: e.target.value })}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="space-y-2">
                                                                                            <Label>Duration</Label>
                                                                                            <Input
                                                                                                value={editingLesson?.lesson?.duration || ''}
                                                                                                onChange={(e) => updateLesson({ duration: e.target.value })}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                id="mandatory"
                                                                                                checked={editingLesson?.lesson?.isMandatory}
                                                                                                onChange={(e) => updateLesson({ isMandatory: e.target.checked })}
                                                                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                                                            />
                                                                                            <Label htmlFor="mandatory">Mandatory Lesson</Label>
                                                                                        </div>
                                                                                    </div>
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                            <Button size="icon" variant="ghost" onClick={() => deleteLesson(section.id, module.id, lesson.id)} className="h-7 w-7 text-slate-400 hover:text-red-500">
                                                                                <Trash2 className="w-3.5 h-3.5" />
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
