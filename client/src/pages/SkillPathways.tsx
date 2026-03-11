import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Award, BookOpen, Target, ChevronRight,
    CheckCircle, Lock, AlertCircle, ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';

const SkillPathways: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-pathway');

    // --- Mock Data ---

    const myPathway = {
        currentRole: "Senior Teacher",
        nextRole: "Head of Department (HOD)",
        readinessScore: 72,
        requiredCertifications: [
            { id: 1, name: "Leadership in Education", status: "Completed", date: "Jan 2025" },
            { id: 2, name: "Advanced Curriculum Design", status: "In Progress", progress: 65 },
            { id: 3, name: "Conflict Resolution", status: "Pending", progress: 0 },
        ],
        skillGaps: [
            { skill: "Strategic Planning", current: 3, target: 5 },
            { skill: "Budget Management", current: 2, target: 4 },
        ]
    };

    const skillLibrary = [
        { category: "Teaching Excellence", skills: ["Classroom Management", "Differentiated Instruction", "Assessment Strategies"] },
        { category: "Leadership", skills: ["Team Management", "Strategic Planning", "Conflict Resolution"] },
        { category: "Digital Fluency", skills: ["LMS Usage", "Smart Board Proficiency", "Hybrid Teaching"] },
        { category: "Compliance", skills: ["Child Safety", "POSH", "Data Privacy"] },
    ];

    const departmentHeatmap = [
        { dept: "Science", strategy: 3.5, digital: 4.2, leadership: 2.8 },
        { dept: "Math", strategy: 3.8, digital: 4.5, leadership: 3.0 },
        { dept: "Humanities", strategy: 3.2, digital: 3.5, leadership: 4.0 },
        { dept: "Languages", strategy: 3.0, digital: 3.0, leadership: 3.5 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 rounded-full hover:bg-slate-200">
                            <ChevronDown className="w-5 h-5 rotate-90 text-slate-500" />
                        </Button>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill & Career Pathways</h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-11">Map your professional journey and track readiness for future roles.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <TabsTrigger value="my-pathway" className="px-6 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 font-bold">
                        My Pathway
                    </TabsTrigger>
                    <TabsTrigger value="skill-matrix" className="px-6 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 font-bold">
                        Skill Matrix & Library
                    </TabsTrigger>
                    <TabsTrigger value="readiness" className="px-6 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 font-bold">
                        Readiness Analytics
                    </TabsTrigger>
                </TabsList>

                {/* My Pathway Tab */}
                <TabsContent value="my-pathway" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Current Status Card */}
                        <Card className="col-span-1 border-none shadow-lg bg-gradient-to-br from-indigo-900 to-indigo-800 text-white rounded-[2rem] overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                            <CardContent className="p-8 relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
                                    Current Role
                                </span>
                                <h2 className="text-3xl font-black mb-1">{myPathway.currentRole}</h2>
                                <p className="text-indigo-200 font-medium mb-8">Dept. of Science & Technology</p>

                                <div className="space-y-2 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold opacity-80">Readiness Score</span>
                                        <span className="text-2xl font-black text-emerald-400">{myPathway.readinessScore}%</span>
                                    </div>
                                    <Progress value={myPathway.readinessScore} className="h-2 bg-indigo-950" />
                                    <p className="text-xs text-indigo-300 mt-2">
                                        You are <span className="text-white font-bold">28% away</span> from being eligible for HOD role.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/30 rounded-lg">
                                            <Target className="w-5 h-5 text-indigo-200" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-200 font-bold uppercase">Next Target</p>
                                            <p className="font-bold">{myPathway.nextRole}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-indigo-300" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pathway Timeline / Requirements */}
                        <div className="col-span-1 lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-sm rounded-3xl">
                                <CardHeader>
                                    <CardTitle className="font-bold text-slate-900">Promotion Eligibility Rules</CardTitle>
                                    <CardDescription>Required milestones to unlock the {myPathway.nextRole} role.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {myPathway.requiredCertifications.map((cert) => (
                                        <div key={cert.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${cert.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                                cert.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                {cert.status === 'Completed' ? <CheckCircle className="w-6 h-6" /> :
                                                    cert.status === 'In Progress' ? <BookOpen className="w-6 h-6" /> :
                                                        <Lock className="w-6 h-6" />
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className={`font-bold ${cert.status === 'Pending' ? 'text-slate-400' : 'text-slate-900'}`}>{cert.name}</h4>
                                                    {cert.status === 'Completed' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Completed {cert.date}</span>}
                                                    {cert.status === 'In Progress' && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{cert.progress}% Done</span>}
                                                    {cert.status === 'Pending' && <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Locked</span>}
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${cert.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${cert.status === 'Completed' ? 100 : cert.progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="font-bold"
                                                disabled={cert.status === 'Pending'}
                                                onClick={() => navigate('/learning-development')}
                                            >
                                                {cert.status === 'Completed' ? 'View' : 'Resume'}
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm rounded-3xl bg-amber-50/50">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="p-3 bg-amber-100 rounded-xl">
                                        <TrendingUp className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Appraisal Linkage</h4>
                                        <p className="text-sm text-slate-600 mt-1 max-w-xl">
                                            Training completion directly impacts your annual appraisal KRA score.
                                            Ensure all mandatory certifications are completed before <span className="font-bold text-slate-900">March 31st</span>.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Skill Matrix Tab */}
                <TabsContent value="skill-matrix" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skillLibrary.map((category, idx) => (
                            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-all">
                                <CardHeader className="bg-slate-50 rounded-t-xl pb-4">
                                    <h3 className="font-black text-slate-900">{category.category}</h3>
                                </CardHeader>
                                <CardContent className="p-6 pt-4 space-y-3">
                                    {category.skills.map((skill, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            {skill}
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-indigo-600 font-bold hover:bg-indigo-50 mt-2"
                                        onClick={() => alert("Skill Library management is restricted to Admin.")}
                                    >
                                        + Add Skill
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-none shadow-sm rounded-3xl">
                        <CardHeader>
                            <CardTitle className="font-bold text-slate-900">Role &rarr; Skill Matrix Setup</CardTitle>
                            <CardDescription>Define required and optional skills for each institutional role.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 font-bold">
                                        <tr>
                                            <th className="px-6 py-3 rounded-l-lg">Role</th>
                                            <th className="px-6 py-3">Leadership Skills</th>
                                            <th className="px-6 py-3">Teaching Skills</th>
                                            <th className="px-6 py-3">Digital Skills</th>
                                            <th className="px-6 py-3 rounded-r-lg">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { role: "Class Teacher", lead: "Optional", teach: "Required", digi: "Required" },
                                            { role: "HOD", lead: "Required", teach: "Required", digi: "Required" },
                                            { role: "Lab Assistant", lead: "N/A", teach: "Optional", digi: "Required" },
                                        ].map((row, rIdx) => (
                                            <tr key={rIdx} className="bg-white hover:bg-slate-50">
                                                <td className="px-6 py-4 font-bold text-slate-900">{row.role}</td>
                                                <td className="px-6 py-4"><Badge variant="outline" className={row.lead === 'Required' ? 'bg-red-50 text-red-600 border-red-100' : 'text-slate-500'}>{row.lead}</Badge></td>
                                                <td className="px-6 py-4"><Badge variant="outline" className={row.teach === 'Required' ? 'bg-red-50 text-red-600 border-red-100' : 'text-slate-500'}>{row.teach}</Badge></td>
                                                <td className="px-6 py-4"><Badge variant="outline" className={row.digi === 'Required' ? 'bg-red-50 text-red-600 border-red-100' : 'text-slate-500'}>{row.digi}</Badge></td>
                                                <td className="px-6 py-4">
                                                    <Button variant="ghost" size="sm" className="text-indigo-600 font-bold" onClick={() => alert("Edit Matrix feature coming in next sprint!")}>Edit</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Readiness & Analytics Tab */}
                <TabsContent value="readiness" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none shadow-sm rounded-3xl">
                            <CardHeader>
                                <CardTitle className="font-bold text-slate-900">Skill Gap Heatmap</CardTitle>
                                <CardDescription>Average proficiency vs. Target by Department</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {departmentHeatmap.map((dept, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-slate-900">{dept.dept}</h4>
                                            <span className="text-xs font-bold text-slate-400">Avg Score</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* Strategy */}
                                            <div className="space-y-1">
                                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${(dept.strategy / 5) * 100}%` }} />
                                                </div>
                                                <p className="text-[10px] text-slate-500">Strategy ({dept.strategy})</p>
                                            </div>
                                            {/* Digital */}
                                            <div className="space-y-1">
                                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${(dept.digital / 5) * 100}%` }} />
                                                </div>
                                                <p className="text-[10px] text-slate-500">Digital ({dept.digital})</p>
                                            </div>
                                            {/* Leadership */}
                                            <div className="space-y-1">
                                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className="h-full bg-purple-500" style={{ width: `${(dept.leadership / 5) * 100}%` }} />
                                                </div>
                                                <p className="text-[10px] text-slate-500">Leadership ({dept.leadership})</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="border-none shadow-sm bg-slate-900 text-white rounded-3xl p-6">
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-400" /> Top Talent
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { name: "Sarah J.", role: "Physics HOD", score: 98 },
                                        { name: "Mike T.", role: "Senior Teacher", score: 95 },
                                        { name: "Jessica R.", role: "Admin Lead", score: 92 },
                                    ].map((p, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{p.name}</p>
                                                    <p className="text-xs text-indigo-200">{p.role}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-black text-emerald-400">{p.score}%</span>
                                                <p className="text-[10px] uppercase text-indigo-300">Readiness</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="border-none shadow-sm rounded-3xl border-l-4 border-l-amber-400">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900">Skill Gaps (My Role)</h3>
                                        <AlertCircle className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">You are below the required proficiency for <span className="font-bold text-slate-700">Senior Teacher</span> in:</p>
                                    <div className="space-y-3">
                                        {myPathway.skillGaps.map((gap, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span>{gap.skill}</span>
                                                    <span className="text-amber-600">Level {gap.current} / {gap.target}</span>
                                                </div>
                                                <Progress value={(gap.current / gap.target) * 100} className="h-1.5 bg-slate-100" />
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-4 font-bold text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                                        onClick={() => navigate('/learning-development')}
                                    >
                                        View Recommended Courses
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SkillPathways;
