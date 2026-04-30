import React, { useState } from 'react';
import {
    Search, Star, Clock, Globe,
    CheckCircle, PlayCircle, Users, Award, ChevronLeft,
    BarChart, MonitorPlay, User, X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';

// --- Types ---
interface Course {
    id: string;
    title: string;
    instructor: string;
    rating: number;
    reviews: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    lectures: number;
    enrolledCount: number;
    price: number | 'Free';
    language: string;
    category: string;
    tags: string[];
    thumbnail: string;
    mode: 'Self-Paced' | 'Live Cohort';
    lastUpdated: string;
    isMandatory?: boolean;
}

// --- Mock Data ---
const MOCK_COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Advanced Pedagogy for 21st Century Classrooms',
        instructor: 'Dr. Sarah Mitchell',
        rating: 4.8,
        reviews: 1240,
        level: 'Intermediate',
        duration: '12h 30m',
        lectures: 24,
        enrolledCount: 3500,
        price: 'Free',
        language: 'English',
        category: 'Pedagogy',
        tags: ['Classroom Mgmt', 'Student Engagement'],
        thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
        mode: 'Self-Paced',
        lastUpdated: 'Jan 2024',
        isMandatory: true
    },
    {
        id: 'c2',
        title: 'NEP 2020: Comprehensive Implementation Guide',
        instructor: 'CBSE Training Unit',
        rating: 4.9,
        reviews: 850,
        level: 'Beginner',
        duration: '6h',
        lectures: 10,
        enrolledCount: 12000,
        price: 'Free',
        language: 'Hindi',
        category: 'Policy & Compliance',
        tags: ['NEP 2020', 'Compliance'],
        thumbnail: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1000',
        mode: 'Self-Paced',
        lastUpdated: 'Feb 2024',
        isMandatory: true
    },
    {
        id: 'c3',
        title: 'AI Tools for Educators: ChatGPT & Beyond',
        instructor: 'Tech for Teach Academy',
        rating: 4.7,
        reviews: 560,
        level: 'Intermediate',
        duration: '8h 15m',
        lectures: 16,
        enrolledCount: 2100,
        price: 499,
        language: 'English',
        category: 'Technology',
        tags: ['AI', 'EdTech', 'Productivity'],
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000',
        mode: 'Live Cohort',
        lastUpdated: 'Mar 2024'
    },
    {
        id: 'c4',
        title: 'Effective Classroom Management Strategies',
        instructor: 'Prof. David Lee',
        rating: 4.5,
        reviews: 320,
        level: 'Beginner',
        duration: '4h',
        lectures: 8,
        enrolledCount: 1500,
        price: 'Free',
        language: 'English',
        category: 'Pedagogy',
        tags: ['Discipline', 'Soft Skills'],
        thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000',
        mode: 'Self-Paced',
        lastUpdated: 'Dec 2023'
    },
    {
        id: 'c5',
        title: 'Inclusive Education: Supporting Diverse Learners',
        instructor: 'Special Needs Resource Ctr',
        rating: 4.9,
        reviews: 210,
        level: 'Advanced',
        duration: '15h',
        lectures: 30,
        enrolledCount: 800,
        price: 'Free',
        language: 'English',
        category: 'Inclusive Education',
        tags: ['Special Needs', 'Empathy'],
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000',
        mode: 'Self-Paced',
        lastUpdated: 'Jan 2024'
    },
    {
        id: 'c6',
        title: 'Financial Literacy for School Administrators',
        instructor: 'Finance Dept',
        rating: 4.6,
        reviews: 150,
        level: 'Intermediate',
        duration: '10h',
        lectures: 12,
        enrolledCount: 400,
        price: 999,
        language: 'English',
        category: 'Administration',
        tags: ['Finance', 'Budgeting'],
        thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
        mode: 'Live Cohort',
        lastUpdated: 'Feb 2024'
    }
];

interface CourseCatalogProps {
    onBack: () => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedMode, setSelectedMode] = useState('All');
    const [viewMode, setViewMode] = useState<'Learner' | 'Admin'>('Learner');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [enrolledCourse, setEnrolledCourse] = useState<Course | null>(null);

    const handleEnroll = (course: Course) => {
        setEnrolledCourse(course);
        setSelectedCourse(null);
    };

    const filteredCourses = MOCK_COURSES.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
        const matchesMode = selectedMode === 'All' || course.mode === selectedMode;

        return matchesSearch && matchesCategory && matchesLevel && matchesMode;
    });

    const categories = ['All', ...Array.from(new Set(MOCK_COURSES.map(c => c.category)))];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header / Nav */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all w-10 h-10">
                        <ChevronLeft className="w-5 h-5 text-slate-900" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Marketplace Catalog</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discovery Hub</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                            onClick={() => setViewMode('Learner')}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'Learner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Learner
                        </button>
                        <button
                            onClick={() => setViewMode('Admin')}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'Admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Admin
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommendation (Learner View Only) */}
            {viewMode === 'Learner' && (
                <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden shadow-md">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <Badge className="bg-amber-500 text-slate-950 hover:bg-amber-400 border-none px-3 py-1 font-bold uppercase tracking-widest text-[10px]">Featured Selection</Badge>
                            <h2 className="text-3xl font-bold tracking-tight">Mastering AI Tools for <br /><span className="text-indigo-400">Modern Pedagogy</span></h2>
                            <p className="text-slate-300 max-w-lg font-medium">
                                "The fastest way to future-proof your teaching career in the age of generative intelligence."
                            </p>
                            <div className="flex items-center gap-6 pt-2">
                                <Button
                                    onClick={() => handleEnroll(MOCK_COURSES[2])}
                                    className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-lg h-12 px-8 shadow-sm text-[10px] uppercase tracking-widest"
                                >
                                    Enroll Now (Free)
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-end">
                            <div className="w-full max-w-sm rounded-xl p-6 border border-white/10 bg-white/5 space-y-4 shadow-xl">
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/50 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-bold text-white">Advanced Learning Path</h4>
                                <p className="text-xs text-slate-400 font-medium">8 Modules • 15h 45m • Practical Assessments</p>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none">Gen-AI</Badge>
                                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none">Future Skills</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search & Stats Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search for courses, skills, or instructors..."
                        className="pl-11 h-12 rounded-lg bg-white border-slate-200 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar pr-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[150px] h-12 rounded-lg bg-white border-slate-200 font-semibold text-slate-700 px-4 text-[10px] uppercase tracking-widest shadow-sm">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-slate-200 shadow-lg bg-white">
                            {categories.map(cat => <SelectItem key={cat} value={cat} className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger className="w-[140px] h-12 rounded-lg bg-white border-slate-200 font-semibold text-slate-700 px-4 text-[10px] uppercase tracking-widest shadow-sm">
                            <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-slate-200 shadow-lg bg-white">
                            <SelectItem value="All" className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">Level</SelectItem>
                            <SelectItem value="Beginner" className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">Beginner</SelectItem>
                            <SelectItem value="Intermediate" className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">Intermediate</SelectItem>
                            <SelectItem value="Advanced" className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedMode} onValueChange={setSelectedMode}>
                        <SelectTrigger className="w-[140px] h-12 rounded-lg bg-white border-slate-200 font-semibold text-slate-700 px-4 text-[10px] uppercase tracking-widest shadow-sm">
                            <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-slate-200 shadow-lg bg-white">
                            <SelectItem value="All" className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">Format</SelectItem>
                            <SelectItem value="Self-Paced" className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">Self-Paced</SelectItem>
                            <SelectItem value="Live Cohort" className="font-semibold text-[10px] uppercase tracking-widest rounded-md mb-1">Live Cohort</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gapx-4 py-4">
                {filteredCourses.map(course => (
                    <Card
                        key={course.id}
                        className="group border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl overflow-hidden cursor-pointer flex flex-col h-full"
                        onClick={() => setSelectedCourse(course)}
                    >
                        {/* Thumbnail */}
                        <div className="h-48 relative overflow-hidden">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                {course.isMandatory && (
                                    <Badge className="bg-rose-600 text-white border-none px-2 py-1 text-[8px] font-bold uppercase tracking-widest">Mandatory</Badge>
                                )}
                                <Badge variant="secondary" className="bg-white/90 text-slate-900 border-none px-2 py-1 text-[8px] font-bold uppercase tracking-widest">
                                    {course.category}
                                </Badge>
                            </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-5 flex-1 flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-amber-600">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-[10px] font-bold">{course.rating}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">({course.reviews})</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <BarChart className="w-3.5 h-3.5" /> {course.level}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5">
                                    <User className="w-3 h-3" /> {course.instructor}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                                        <Globe className="w-3.5 h-3.5" />
                                        <span>{course.mode}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold ${course.price === 'Free' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {course.price === 'Free' ? 'Free' : `₹${course.price}`}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No courses found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </div>
            )}

            {/* Course Details Modal */}
            <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
                <DialogContent className="max-w-3xl rounded-xl p-0 overflow-hidden bg-white border-none shadow-xl">
                    {selectedCourse && (
                        <>
                            <div className="relative h-64">
                                <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="flex gap-2 mb-3">
                                        <Badge className="bg-indigo-600 text-white border-none">{selectedCourse.category}</Badge>
                                        <Badge className="bg-white/20 text-white border-none">{selectedCourse.level}</Badge>
                                    </div>
                                    <h2 className="text-2xl font-bold leading-tight mb-2">{selectedCourse.title}</h2>
                                    <div className="flex items-center gap-4 text-sm font-medium text-slate-200">
                                        <span>{selectedCourse.instructor}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-current" /> {selectedCourse.rating} ({selectedCourse.reviews})</span>
                                        <span>•</span>
                                        <span>{selectedCourse.enrolledCount.toLocaleString()} enrolled</span>
                                    </div>
                                </div>
                                <Button
                                    className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 text-white border-none w-8 h-8 p-0"
                                    onClick={() => setSelectedCourse(null)}
                                >
                                    <X className="w-4 h-4" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-3">What you'll learn</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Master the core concepts', 'Practical implementation guide', 'Case studies analysis', 'Certification preparation'].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
                                            <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                                This comprehensive course is designed to equip educators with the latest strategies and tools necessary for modern classroom environments.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 rounded-xl space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-bold text-sm">Price</span>
                                                <span className="text-xl font-bold text-indigo-600">
                                                    {selectedCourse.price === 'Free' ? 'Free' : `₹${selectedCourse.price}`}
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => handleEnroll(selectedCourse)}
                                                className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                                            >
                                                Enroll Now
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-slate-900 text-sm">Course Features</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { icon: Clock, label: `${selectedCourse.duration} on-demand video` },
                                                    { icon: Award, label: 'Certificate of completion' },
                                                    { icon: Globe, label: `${selectedCourse.language}` },
                                                    { icon: Users, label: 'Accessible on all devices' },
                                                ].map((f, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                        <f.icon className="w-4 h-4 text-slate-400" />
                                                        <span>{f.label}</span>
                                                    </div>
                                                ))}
                                                {selectedCourse.mode === 'Live Cohort' && (
                                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                                        <Globe className="w-4 h-4 text-slate-400" />
                                                        <span>Via Google Meet / Zoom</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Enrollment Success Dialog */}
            <Dialog open={!!enrolledCourse} onOpenChange={() => setEnrolledCourse(null)}>
                <DialogContent className="max-w-md bg-white rounded-xl p-8 text-center border-none shadow-xl">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Enrollment Successful!</h2>
                    <p className="text-slate-600 mb-4 font-medium">
                        You have successfully enrolled in <br />
                        <span className="font-bold text-indigo-900">{enrolledCourse?.title}</span>
                    </p>
                    <Button
                        onClick={() => setEnrolledCourse(null)}
                        className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                    >
                        Start Learning
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseCatalog;
