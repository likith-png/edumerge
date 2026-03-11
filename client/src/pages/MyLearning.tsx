import React, { useState } from 'react';
import {
    BookOpen, Clock, Award, TrendingUp, ChevronRight,
    MoreHorizontal, Target
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { usePersona } from '../contexts/PersonaContext';

interface MyLearningProps {
    onBack: () => void;
}

const MyLearning: React.FC<MyLearningProps> = ({ onBack }) => {
    const { role } = usePersona();
    const isStaff = role === 'EMPLOYEE';
    const [adminViewMode, setAdminViewMode] = useState<'team' | 'personal'>('team');

    // --- Mock Data ---

    const personalStats = {
        hoursLearned: 24,
        coursesCompleted: 12,
        certifications: 5,
        streak: 15
    };

    const activeCourses = [
        {
            id: 1,
            title: "Advanced Classroom Management",
            instructor: "Dr. Ranjita Saikia",
            progress: 65,
            thumbnail: "bg-indigo-100",
            totalLessons: 24,
            completedLessons: 16
        },
        {
            id: 2,
            title: "NEP 2020 Implementation Guide",
            instructor: "CBSE Training Unit",
            progress: 30,
            thumbnail: "bg-rose-100",
            totalLessons: 10,
            completedLessons: 3
        }
    ];

    const recentAchievements = [
        { id: 1, title: "Child Safety Certified", date: "Jan 15, 2024", type: "Certification" },
        { id: 2, title: "Digital Literacy: Level 1", date: "Dec 20, 2023", type: "Badge" },
        { id: 3, title: "Quiz Master: Science", date: "Dec 10, 2023", type: "Trophy" }
    ];

    const teamStats = {
        totalStaff: 45,
        avgCompliance: 88,
        activeLearners: 32,
        overdueTraining: 5
    };

    const teamProgress = [
        { name: "Science Dept", completion: 92, status: "On Track" },
        { name: "Math Dept", completion: 85, status: "On Track" },
        { name: "Languages", completion: 74, status: "Needs Attention" },
        { name: "Humanities", completion: 65, status: "At Risk" }
    ];

    // Determine what to render based on Role and Toggle
    const showPersonal = isStaff || adminViewMode === 'personal';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full hover:bg-slate-200">
                        <ChevronRight className="w-5 h-5 rotate-180 text-slate-500" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {showPersonal ? "My Learning Journey" : "Team Learning Overview"}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {showPersonal ? "Track your progress and continue where you left off." : "Monitor department performance and compliance."}
                        </p>
                    </div>
                </div>

                {!isStaff && (
                    <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAdminViewMode('team')}
                            className={`rounded-md font-bold text-xs px-4 ${adminViewMode === 'team' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Team View
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAdminViewMode('personal')}
                            className={`rounded-md font-bold text-xs px-4 ${adminViewMode === 'personal' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            My Learning
                        </Button>
                    </div>
                )}
            </div>

            {showPersonal ? (
                // --- PERSONAL VIEW ---
                <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-none shadow-sm bg-indigo-50/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{personalStats.hoursLearned}h</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Learned</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-emerald-50/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <BookOpen className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{personalStats.coursesCompleted}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completed</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-amber-50/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Award className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{personalStats.certifications}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Certificates</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-rose-50/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-rose-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{personalStats.streak} Days</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Streak</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Continue Learning */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
                            <Button variant="link" className="text-indigo-600 font-bold">View All</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeCourses.map((course) => (
                                <div key={course.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                                    <div className={`w-24 h-24 rounded-xl ${course.thumbnail} shrink-0`} />
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{course.instructor}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                                <span>{course.progress}% Complete</span>
                                                <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                                            </div>
                                            <Progress value={course.progress} className="h-2" />
                                        </div>
                                        <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg">
                                            Resume Course
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <Card className="border-none shadow-sm rounded-3xl">
                        <CardHeader>
                            <CardTitle className="font-bold text-slate-900">Recent Achievements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentAchievements.map((ach) => (
                                <div key={ach.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <Award className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{ach.title}</p>
                                            <p className="text-xs text-slate-500">{ach.type} • {ach.date}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 font-bold hover:text-indigo-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </>
            ) : (
                // --- TEAM VIEW (Admin/Manager) ---
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="border-none shadow-sm bg-slate-900 text-white">
                            <CardContent className="p-6">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Staff</p>
                                <h4 className="text-3xl font-black">{teamStats.totalStaff}</h4>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between mb-1">
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Compliance</p>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none">{teamStats.avgCompliance}%</Badge>
                                </div>
                                <Progress value={teamStats.avgCompliance} className="h-2 mt-2" />
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Learners</p>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-2xl font-black text-slate-900">{teamStats.activeLearners}</h4>
                                    <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">+4 this week</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm border-l-4 border-l-red-500">
                            <CardContent className="p-6">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Overdue Training</p>
                                <h4 className="text-2xl font-black text-red-600">{teamStats.overdueTraining} <span className="text-sm font-medium text-slate-400">Staff</span></h4>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none shadow-sm rounded-3xl">
                            <CardHeader>
                                <CardTitle className="font-bold text-slate-900">Department Performance</CardTitle>
                                <CardDescription>Completion rates by department.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {teamProgress.map((dept, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-1/3">
                                            <p className="font-bold text-sm text-slate-700">{dept.name}</p>
                                        </div>
                                        <div className="flex-1">
                                            <Progress value={dept.completion} className={`h-2 ${dept.status === 'At Risk' ? 'bg-red-100' : 'bg-slate-100'
                                                }`} />
                                        </div>
                                        <div className="w-20 text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${dept.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                                                dept.status === 'Needs Attention' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-red-50 text-red-600'
                                                }`}>
                                                {dept.completion}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-3xl bg-indigo-900 text-white">
                            <CardHeader>
                                <CardTitle className="font-bold text-white flex items-center gap-2">
                                    <Target className="w-5 h-5 text-indigo-300" /> Focus Areas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <h5 className="font-bold text-sm mb-1">Digital Literacy Drive</h5>
                                    <p className="text-xs text-indigo-200 mb-3">Ensure all Humanities staff complete "Smart Board Basics" by Friday.</p>
                                    <div className="flex items-center gap-2">
                                        <Progress value={45} className="h-1.5 bg-indigo-950/50 flex-1" />
                                        <span className="text-xs font-bold">45%</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <h5 className="font-bold text-sm mb-1">Compliance Audit Prep</h5>
                                    <p className="text-xs text-indigo-200 mb-3">POSH certification renewal for 5 staff members pending.</p>
                                    <Button size="sm" variant="secondary" className="w-full text-indigo-900 font-bold h-8">View Pending List</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyLearning;
