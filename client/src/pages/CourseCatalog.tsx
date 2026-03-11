import React, { useState } from 'react';
import {
    Search, Star, Clock, Globe,
    CheckCircle, PlayCircle, Users, Award, ChevronLeft,
    BarChart
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Catalog</h1>
                        <p className="text-sm font-bold text-slate-400">Discover, Learn, and Grow</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
                        <button
                            onClick={() => setViewMode('Learner')}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'Learner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Learner View
                        </button>
                        <button
                            onClick={() => setViewMode('Admin')}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'Admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Admin View
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommendation (Learner View Only) */}
            {viewMode === 'Learner' && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                    <div className="relative z-10">
                        <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-300 border-none px-3 py-1 mb-4 font-black uppercase tracking-widest">Recommended For You</Badge>
                        <h2 className="text-3xl font-black mb-2">Mastering AI in Education</h2>
                        <p className="text-indigo-100 max-w-xl mb-8 font-medium text-lg leading-relaxed">
                            Stay ahead of the curve with our comprehensive guide to integrating Artificial Intelligence in your daily teaching workflow.
                        </p>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => handleEnroll(MOCK_COURSES[2])}
                                className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl h-12 px-8 shadow-lg cursor-pointer transition-transform hover:scale-105"
                            >
                                Enroll Now - Free
                            </Button>
                            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold rounded-xl h-12 px-8 backdrop-blur-sm cursor-pointer">
                                View Syllabus
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search & Stats Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search for courses, skills, or instructors..."
                        className="pl-11 h-12 rounded-2xl bg-white border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[140px] h-12 rounded-2xl bg-white border-slate-200 font-bold text-slate-600">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {categories.map(cat => <SelectItem key={cat} value={cat} className="font-medium">{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger className="w-[130px] h-12 rounded-2xl bg-white border-slate-200 font-bold text-slate-600">
                            <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="All" className="font-medium">All Levels</SelectItem>
                            <SelectItem value="Beginner" className="font-medium">Beginner</SelectItem>
                            <SelectItem value="Intermediate" className="font-medium">Intermediate</SelectItem>
                            <SelectItem value="Advanced" className="font-medium">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedMode} onValueChange={setSelectedMode}>
                        <SelectTrigger className="w-[130px] h-12 rounded-2xl bg-white border-slate-200 font-bold text-slate-600">
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="All" className="font-medium">All Modes</SelectItem>
                            <SelectItem value="Self-Paced" className="font-medium">Self-Paced</SelectItem>
                            <SelectItem value="Live Cohort" className="font-medium">Live Cohort</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <Card
                        key={course.id}
                        className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-[2rem] overflow-hidden cursor-pointer flex flex-col h-full"
                        onClick={() => setSelectedCourse(course)}
                    >
                        {/* Thumbnail */}
                        <div className="h-48 relative overflow-hidden">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                {course.isMandatory && (
                                    <Badge className="bg-rose-500 text-white border-none shadow-lg px-2 py-1 uppercase tracking-wider text-[10px] font-black">Mandatory</Badge>
                                )}
                                <Badge className="bg-white/90 text-slate-900 border-none shadow-lg px-2 py-1 uppercase tracking-wider text-[10px] font-black backdrop-blur-md">
                                    {course.category}
                                </Badge>
                            </div>
                            <div className="absolute bottom-4 right-4">
                                <Badge className={`border-none shadow-lg px-2 py-1 uppercase tracking-wider text-[10px] font-black ${course.price === 'Free' ? 'bg-emerald-400 text-emerald-950' : 'bg-white text-indigo-600'}`}>
                                    {course.price === 'Free' ? 'Free' : `₹${course.price}`}
                                </Badge>
                            </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1.5 text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-xs font-bold text-slate-700">{course.rating}</span>
                                    <span className="text-[10px] font-medium text-slate-400">({course.reviews})</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <BarChart className="w-3 h-3" /> {course.level}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-1">By {course.instructor}</p>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-300" /> {course.duration}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <PlayCircle className="w-3.5 h-3.5 text-slate-300" />
                                    {course.mode === 'Live Cohort' ? 'Live (Zoom/Meet)' : course.mode}
                                </span>
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
                <DialogContent className="max-w-3xl rounded-[32px] p-0 overflow-hidden bg-white border-none shadow-2xl">
                    {selectedCourse && (
                        <>
                            <div className="relative h-64">
                                <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="flex gap-2 mb-3">
                                        <Badge className="bg-indigo-500 text-white border-none">{selectedCourse.category}</Badge>
                                        <Badge className="bg-white/20 text-white border-none backdrop-blur-md">{selectedCourse.level}</Badge>
                                    </div>
                                    <h2 className="text-3xl font-black leading-tight mb-2">{selectedCourse.title}</h2>
                                    <div className="flex items-center gap-4 text-sm font-medium text-slate-200">
                                        <span>{selectedCourse.instructor}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-current" /> {selectedCourse.rating} ({selectedCourse.reviews} reviews)</span>
                                        <span>•</span>
                                        <span>{selectedCourse.enrolledCount.toLocaleString()} enrolled</span>
                                    </div>
                                </div>
                                <Button
                                    className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 text-white border-none w-10 h-10 p-0 backdrop-blur-md"
                                    onClick={() => setSelectedCourse(null)}
                                >
                                    <ChevronLeft className="w-5 h-5 rotate-180" /> {/* Using generic close icon behavior */}
                                    <span className="sr-only">Close</span>
                                </Button>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 mb-3">What you'll learn</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Master the core concepts', 'Practical implementation guide', 'Case studies analysis', 'Certification preparation'].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 mb-3">Description</h3>
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                This comprehensive course is designed to equip educators with the latest strategies and tools necessary for modern classroom environments.
                                                You will dive deep into pedagogical theories, practical applications, and assessment techniques that drive student success.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-bold text-sm">Price</span>
                                                <span className="text-2xl font-black text-indigo-600">
                                                    {selectedCourse.price === 'Free' ? 'Free' : `₹${selectedCourse.price}`}
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => handleEnroll(selectedCourse)}
                                                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 cursor-pointer transition-transform hover:scale-[1.02]"
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
                <DialogContent className="max-w-md bg-white rounded-[32px] p-8 text-center border-none shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Enrollment Successful!</h2>
                    <p className="text-slate-600 mb-6 font-medium">
                        You have successfully enrolled in <br />
                        <span className="font-bold text-indigo-900">{enrolledCourse?.title}</span>
                    </p>
                    <Button
                        onClick={() => setEnrolledCourse(null)}
                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200"
                    >
                        Start Learning
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseCatalog;
