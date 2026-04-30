import React, { useState } from 'react';
import {
    BookOpen, Clock, Award, TrendingUp, ChevronLeft,
    MoreHorizontal, Target, GraduationCap, Zap, CheckCircle2
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
            thumbnail: "bg-indigo-600",
            totalLessons: 24,
            completedLessons: 16,
            lastAccessed: "2 hours ago"
        },
        {
            id: 2,
            title: "NEP 2020 Implementation Guide",
            instructor: "CBSE Training Unit",
            progress: 30,
            thumbnail: "bg-rose-600",
            totalLessons: 10,
            completedLessons: 3,
            lastAccessed: "1 day ago"
        }
    ];

    const recentAchievements = [
        { id: 1, title: "Child Safety Certified", date: "Jan 15, 2024", type: "Certification", color: "text-emerald-600 bg-emerald-50" },
        { id: 2, title: "Digital Literacy: Level 1", date: "Dec 20, 2023", type: "Badge", color: "text-blue-600 bg-blue-50" },
        { id: 3, title: "Quiz Master: Science", date: "Dec 10, 2023", type: "Trophy", color: "text-amber-600 bg-amber-50" }
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

    const showPersonal = isStaff || adminViewMode === 'personal';

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Unified Hero Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
                <div className="flex items-center gap-6">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onBack} 
                        className="h-10 w-10 rounded-lg bg-white shadow-sm hover:bg-slate-50 transition-all text-slate-800 border border-slate-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {showPersonal ? "Mastery Path" : "L&D Command Center"}
                            </h1>
                            {showPersonal && (
                                <Badge className="bg-slate-900 text-white border-none text-[10px] font-bold uppercase px-3 py-1 rounded-full">LEVEL 12</Badge>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                            {showPersonal ? "Pursuing Professional Excellence" : "Institutional Compliance Dashboard"}
                        </p>
                    </div>
                </div>

                {!isStaff && (
                    <div className="bg-slate-100 p-1 rounded-lg flex gap-1 border border-slate-200">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAdminViewMode('team')}
                            className={`rounded-md font-bold text-[10px] uppercase tracking-wider px-6 h-9 transition-all ${adminViewMode === 'team' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Team Intelligence
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAdminViewMode('personal')}
                            className={`rounded-md font-bold text-[10px] uppercase tracking-wider px-6 h-9 transition-all ${adminViewMode === 'personal' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Personal Progress
                        </Button>
                    </div>
                )}
            </div>

            {showPersonal ? (
                // --- PERSONAL VIEW ---
                <>
                    {/* High-Impact Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Clocked Hours', value: `${personalStats.hoursLearned}h`, icon: Clock, color: 'slate' },
                            { label: 'Acquired Skills', value: personalStats.coursesCompleted, icon: GraduationCap, color: 'slate' },
                            { label: 'Validated Certs', value: personalStats.certifications, icon: Award, color: 'slate' },
                            { label: 'Learning Streak', value: `${personalStats.streak}D`, icon: Zap, color: 'slate' }
                        ].map((stat, idx) => (
                            <Card key={idx} className="border border-slate-200 shadow-sm rounded-2xl bg-white group hover:shadow-md transition-all duration-300">
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Continue Learning - Premium Grid */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-2">
                             <div>
                                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Active Curriculum</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pick up from your last session</p>
                             </div>
                            <Button variant="ghost" className="text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-lg px-4 border border-slate-200">Catalog Explorer</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {activeCourses.map((course) => (
                                <div key={course.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-8 relative overflow-hidden group">
                                    <div className={`w-full sm:w-32 h-32 rounded-xl ${course.thumbnail} shrink-0 shadow-sm flex items-center justify-center text-white/20`}>
                                        <GraduationCap className="w-12 h-12" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <Badge variant="outline" className="border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mb-2">In Progress</Badge>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{course.lastAccessed}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight leading-tight mb-1">{course.title}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{course.instructor}</p>
                                        </div>
                                        <div className="space-y-3 mt-4">
                                            <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                                                <span className="text-slate-900">{course.progress}% CONCLUDED</span>
                                                <span className="text-slate-400">{course.completedLessons}/{course.totalLessons} UNITS</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-slate-900 rounded-full transition-all duration-1000"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest h-9 rounded-lg mt-2">
                                                Resume Learning
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements & Goals */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="font-bold text-slate-900 uppercase tracking-tight text-lg">Hall of Achievements</CardTitle>
                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your verified professional milestones</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-2 grid gap-4 overflow-x-auto sm:grid-cols-1">
                                {recentAchievements.map((ach) => (
                                    <div key={ach.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-lg ${ach.color}`}>
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm uppercase tracking-tight leading-tight">{ach.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{ach.type} • VERIFIED ON {ach.date.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                                            <ChevronLeft className="w-5 h-5 rotate-180" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 shadow-sm rounded-2xl bg-slate-900 text-white overflow-hidden">
                            <CardContent className="p-10 flex flex-col h-full bg-slate-900">
                                <div className="p-4 bg-white/10 rounded-xl w-fit mb-6">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight leading-tight mb-2">Quarterly Learning Target</h3>
                                <p className="text-slate-400 text-sm mb-8">Maintain professional excellence by completing mandatory compliance units.</p>
                                
                                <div className="space-y-8 mt-auto">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                                            <span>Current Velocity</span>
                                            <span className="text-white">82%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full w-[82%]" />
                                        </div>
                                    </div>
                                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-[10px] uppercase tracking-widest h-12 rounded-lg shadow-sm">
                                        View Goal Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                // --- TEAM VIEW (Admin/Manager) ---
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Intelligence Base', value: teamStats.totalStaff, sub: 'Faculty Members' },
                            { label: 'Global Compliance', value: `${teamStats.avgCompliance}%`, sub: '+3.4% This Month' },
                            { label: 'Active Learners', value: teamStats.activeLearners, sub: 'Synced Today' },
                            { label: 'Critical Overdue', value: teamStats.overdueTraining, sub: 'Immediate Action', color: 'text-rose-600' }
                        ].map((stat, idx) => (
                            <Card key={idx} className="border border-slate-200 shadow-sm rounded-2xl bg-white">
                                <CardContent className="p-8">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                    <h4 className={`text-4xl font-bold tracking-tight ${stat.color || 'text-slate-900'}`}>{stat.value}</h4>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">{stat.sub}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="font-bold text-slate-900 uppercase tracking-tight">Departmental Matrix</CardTitle>
                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill acquisition depth across faculties</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-2 space-y-6">
                                {teamProgress.map((dept, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-sm text-slate-900 uppercase tracking-tight">{dept.name}</p>
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                                                dept.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                                                dept.status === 'Needs Attention' ? 'bg-amber-50 text-amber-600' :
                                                'bg-rose-50 text-rose-600'
                                            }`}>
                                                {dept.completion}% • {dept.status}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    dept.status === 'On Track' ? 'bg-emerald-500' :
                                                    dept.status === 'Needs Attention' ? 'bg-amber-500' :
                                                    'bg-rose-500'
                                                }`} 
                                                style={{ width: `${dept.completion}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="space-y-8">
                             <div className="p-10 bg-slate-900 rounded-2xl text-white shadow-sm relative overflow-hidden group">
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-white/10 rounded-xl">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold uppercase tracking-tight">Active Strategic Focus</h3>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex justify-between items-start mb-3">
                                                <h5 className="font-bold text-sm uppercase tracking-tight">Digital Literacy Drive</h5>
                                                <Badge className="bg-white/10 text-white border-none font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">CRITICAL</Badge>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">System-wide mandate to ensure all faculty members are proficient with advanced LMS analytics by End of Month.</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                                    <span>Faculty Completion Velocity</span>
                                                    <span>45%</span>
                                                </div>
                                                <Progress value={45} className="h-2 bg-white/10" />
                                            </div>
                                        </div>
                                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-[10px] uppercase tracking-widest h-12 rounded-lg shadow-sm">
                                            Initiate Departmental Sync
                                        </Button>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyLearning;
