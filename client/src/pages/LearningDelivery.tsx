import React, { useState } from 'react';
import {
    PlayCircle, CheckCircle, Clock, BookOpen,
    FileText, Download, ChevronLeft, ChevronRight,
    Award, Layout, User, Search, Share2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';

interface LearningDeliveryProps {
    onBack: () => void;
}

// --- Mock Data ---

const MY_COURSES = [
    {
        id: 'c1',
        title: 'Advanced Classroom Management Strategies',
        instructor: 'Dr. Ranjita Saikia',
        progress: 65,
        totalLessons: 24,
        completedLessons: 16,
        lastAccessed: '2 hours ago',
        thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
        status: 'In Progress',
        dueDate: 'Feb 28, 2024'
    },
    {
        id: 'c2',
        title: 'NEP 2020: Implementation Guide',
        instructor: 'CBSE Training Unit',
        progress: 0,
        totalLessons: 10,
        completedLessons: 0,
        lastAccessed: null,
        thumbnail: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1000',
        status: 'Assigned',
        dueDate: 'Mar 15, 2024'
    },
    {
        id: 'c3',
        title: 'Inclusive Education Fundamentals',
        instructor: 'Special Needs Resource Ctr',
        progress: 100,
        totalLessons: 15,
        completedLessons: 15,
        lastAccessed: '1 week ago',
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000',
        status: 'Completed',
        completedDate: 'Jan 20, 2024'
    }
];

const COURSE_CONTENT = {
    id: 'c1',
    title: 'Advanced Classroom Management Strategies',
    sections: [
        {
            id: 's1',
            title: 'Section 1: Understanding Student Behavior',
            lessons: [
                { id: 'l1', title: 'The Psychology of Behavior', duration: '15:00', type: 'Video', completed: true },
                { id: 'l2', title: 'Identifying Triggers', duration: '10:00', type: 'Video', completed: true },
                { id: 'l3', title: 'Case Study Analysis', duration: '20 min', type: 'Reading', completed: true },
            ]
        },
        {
            id: 's2',
            title: 'Section 2: Proactive Strategies',
            lessons: [
                { id: 'l4', title: 'Setting Clear Expectations', duration: '12:00', type: 'Video', completed: true },
                { id: 'l5', title: 'Building Relationships', duration: '18:00', type: 'Video', completed: false, current: true },
                { id: 'l6', title: 'Classroom Layout Optimization', duration: '15 min', type: 'Reading', completed: false },
            ]
        },
        {
            id: 's3',
            title: 'Section 3: Reactive Strategies',
            lessons: [
                { id: 'l7', title: 'De-escalation Techniques', duration: '25:00', type: 'Video', completed: false },
                { id: 'l8', title: 'Restorative Justice Practices', duration: '20:00', type: 'Video', completed: false },
            ]
        }
    ]
};

const LearningDelivery: React.FC<LearningDeliveryProps> = ({ onBack }) => {
    const [viewMode, setViewMode] = useState<'dashboard' | 'player'>('dashboard');
    const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('in-progress');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleStartCourse = (courseId: string) => {
        setActiveCourseId(courseId);
        setViewMode('player');
    };

    if (viewMode === 'player') {
        const activeCourse = MY_COURSES.find(c => c.id === activeCourseId) || MY_COURSES[0];
        const activeContent = COURSE_CONTENT; // In real app, fetch based on ID

        return (
            <div className="flex flex-col h-screen bg-slate-50 animate-in fade-in zoom-in-95 duration-300">
                {/* Player Header */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md z-20">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setViewMode('dashboard')} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="font-bold text-sm md:text-base line-clamp-1">{activeCourse.title}</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {activeCourse.instructor}</span>
                                <span>•</span>
                                <span>{activeCourse.progress}% Completed</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="hidden md:flex text-slate-300 hover:text-white hover:bg-white/10">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        <Button size="sm" variant="secondary" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none font-bold">
                            Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Course Sidebar */}
                    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden`}>
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-2">Course Content</h3>
                            <Progress value={activeCourse.progress} className="h-2 mb-2" />
                            <p className="text-xs text-slate-500 font-medium text-right">{activeCourse.completedLessons}/{activeCourse.totalLessons} Lessons</p>
                        </div>
                        <div className="flex-1 overflow-auto p-4 space-y-6">
                            {activeContent.sections.map((section) => (
                                <div key={section.id}>
                                    <h4 className="font-bold text-slate-800 text-sm mb-3 px-2">{section.title}</h4>
                                    <div className="space-y-1">
                                        {section.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${lesson.current
                                                    ? 'bg-indigo-50 border-indigo-100 text-indigo-900'
                                                    : 'hover:bg-slate-50 text-slate-600'
                                                    }`}
                                            >
                                                <div className="mt-0.5">
                                                    {lesson.completed ? (
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    ) : lesson.type === 'Video' ? (
                                                        <PlayCircle className={`w-4 h-4 ${lesson.current ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                    ) : (
                                                        <FileText className={`w-4 h-4 ${lesson.current ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${lesson.current ? 'font-bold' : ''}`}>{lesson.title}</p>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                                        <Clock className="w-3 h-3" /> {lesson.duration}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-black/95 relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 left-4 z-10 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                        </Button>

                        <div className="flex-1 flex items-center justify-center p-8">
                            {/* Mock Video Player */}
                            <div className="w-full max-w-4xl aspect-video bg-slate-900 rounded-xl shadow-2xl relative group overflow-hidden border border-white/10">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-indigo-600/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                                        <PlayCircle className="w-10 h-10 text-white ml-1" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-1 bg-white/30 rounded-full mb-4 cursor-pointer overflow-hidden">
                                        <div className="h-full w-1/3 bg-indigo-500" />
                                    </div>
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-sm">05:20 / 18:00</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">1.0x</span>
                                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">CC</span>
                                            <Layout className="w-5 h-5 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Player Tabs (Notes, Q&A) */}
                        <div className="h-1/3 bg-white border-t border-slate-200 flex flex-col">
                            <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                                <div className="px-6 pt-2 border-b border-slate-100">
                                    <TabsList className="bg-transparent h-12">
                                        <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 font-bold">Overview</TabsTrigger>
                                        <TabsTrigger value="qa" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 font-bold">Q&A</TabsTrigger>
                                        <TabsTrigger value="notes" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 font-bold">My Notes</TabsTrigger>
                                        <TabsTrigger value="resources" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 font-bold">Resources</TabsTrigger>
                                    </TabsList>
                                </div>
                                <div className="flex-1 overflow-auto p-6">
                                    <TabsContent value="overview" className="mt-0 space-y-4">
                                        <h2 className="text-xl font-bold text-slate-900">Module 2: Proactive Strategies</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            In this module, we explore the proactive measures teachers can take to prevent disruptive behavior before it starts.
                                            Key topics include setting expectations, building rapport, and environmental design.
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="qa" className="mt-0">
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                                                <img src="https://github.com/shadcn.png" alt="JD" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Textarea placeholder="Ask a question..." className="min-h-[80px]" />
                                                <Button size="sm" className="bg-indigo-600">Post Question</Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="notes" className="mt-0">
                                        <Textarea placeholder="Take notes at 05:20..." className="min-h-[150px] font-mono text-sm bg-yellow-50 border-yellow-100 focus:border-yellow-300" />
                                    </TabsContent>
                                    <TabsContent value="resources" className="mt-0">
                                        <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <FileText className="w-8 h-8 text-red-500" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-900">Module_Handout.pdf</p>
                                                <p className="text-xs text-slate-500">2.4 MB</p>
                                            </div>
                                            <Download className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    // --- Dashboard View ---
    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-right-4 duration-500 p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-200">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Learning</h1>
                        <p className="text-slate-500 font-medium">Track your progress and continue learning.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Search my courses..."
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="in-progress" onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white p-1 h-12 rounded-xl shadow-sm border border-slate-100 inline-flex">
                    <TabsTrigger value="in-progress" className="rounded-lg h-10 px-6 font-bold data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                        In Progress
                    </TabsTrigger>
                    <TabsTrigger value="assigned" className="rounded-lg h-10 px-6 font-bold data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                        Assigned <Badge className="ml-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-100 border-none h-5 px-1.5">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="rounded-lg h-10 px-6 font-bold data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                        Completed
                    </TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {MY_COURSES.filter(c => {
                        if (activeTab === 'in-progress') return c.status === 'In Progress';
                        if (activeTab === 'assigned') return c.status === 'Assigned';
                        return c.status === 'Completed';
                    }).map((course) => (
                        <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200 rounded-2xl flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <Badge className="bg-white/20 backdrop-blur-md border-white/20 text-white mb-2 hover:bg-white/30">
                                        {course.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="flex-1 p-6 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                                    <User className="w-4 h-4" /> {course.instructor}
                                </p>

                                <div className="mt-auto space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-600">
                                            <span>{course.progress}% Complete</span>
                                            <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                                        </div>
                                        <Progress value={course.progress} className="h-2" />
                                    </div>

                                    {course.status === 'Completed' ? (
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-200 gap-2">
                                            <Award className="w-4 h-4" /> View Certificate
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleStartCourse(course.id)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-200 gap-2 group-hover:translate-y-[-2px] transition-transform"
                                        >
                                            {course.progress > 0 ? 'Resume Learning' : 'Start Course'} <PlayCircle className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Empty State Mock */}
                    {MY_COURSES.filter(c => {
                        if (activeTab === 'in-progress') return c.status === 'In Progress';
                        if (activeTab === 'assigned') return c.status === 'Assigned';
                        return c.status === 'Completed';
                    }).length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-400">
                                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No courses found in this category.</p>
                            </div>
                        )}
                </div>
            </Tabs>
        </div>
    );
};

export default LearningDelivery;
