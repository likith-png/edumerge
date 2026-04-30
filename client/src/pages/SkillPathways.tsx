import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Award, BookOpen, Target, ChevronRight,
    CheckCircle, Lock, AlertCircle, Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

import Layout from '../components/Layout';

const SkillPathways: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-pathway');

    interface SkillPathwayItem {
        id: number;
        name: string;
        status: 'Completed' | 'In Progress' | 'Pending';
        date?: string;
        progress?: number;
    }

    interface SkillGap {
        skill: string;
        current: number;
        target: number;
    }

    interface HeatmapData {
        dept: string;
        strategy: number;
        digital: number;
        leadership: number;
    }

    const myPathway = {
        currentRole: "Senior Teacher",
        nextRole: "Head of Department (HOD)",
        readinessScore: 72,
        requiredCertifications: [
            { id: 1, name: "Leadership in Education", status: "Completed", date: "Jan 2025" },
            { id: 2, name: "Advanced Curriculum Design", status: "In Progress", progress: 65 },
            { id: 3, name: "Conflict Resolution", status: "Pending", progress: 0 },
        ] as SkillPathwayItem[],
        skillGaps: [
            { skill: "Strategic Planning", current: 3, target: 5 },
            { skill: "Budget Management", current: 2, target: 4 },
        ] as SkillGap[]
    };

    const departmentHeatmap: HeatmapData[] = [
        { dept: "Science", strategy: 3.5, digital: 4.2, leadership: 2.8 },
        { dept: "Math", strategy: 3.8, digital: 4.5, leadership: 3.0 },
        { dept: "Humanities", strategy: 3.2, digital: 3.5, leadership: 4.0 },
        { dept: "Languages", strategy: 3.0, digital: 3.0, leadership: 3.5 },
    ];

    const skillLibrary = [
        { category: "Teaching Excellence", skills: ["Classroom Management", "Differentiated Instruction", "Assessment Strategies"] },
        { category: "Leadership", skills: ["Team Management", "Strategic Planning", "Conflict Resolution"] },
        { category: "Digital Fluency", skills: ["LMS Usage", "Smart Board Proficiency", "Hybrid Teaching"] },
        { category: "Compliance", skills: ["Child Safety", "POSH", "Data Privacy"] },
    ];

    return (
        <Layout
            title="Skill & Career Pathways"
            description="Map your professional journey and track readiness for future roles."
        >
            <div className="space-y-8 animate-in fade-in duration-500">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-slate-100 p-1.5 rounded-xl mb-8 w-full justify-start overflow-x-auto h-auto border border-slate-200 shadow-sm">
                        <TabsTrigger value="my-pathway" className="rounded-lg px-8 py-3 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all">
                            My Pathway
                        </TabsTrigger>
                        <TabsTrigger value="skill-matrix" className="rounded-lg px-8 py-3 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all">
                            Skill Matrix
                        </TabsTrigger>
                        <TabsTrigger value="readiness" className="rounded-lg px-8 py-3 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all">
                            Readiness Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* My Pathway Tab */}
                    <TabsContent value="my-pathway" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Current Status Card */}
                            <Card className="col-span-1 border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden relative group">
                                <CardContent className="p-8">
                                    <Badge className="bg-indigo-50 text-indigo-600 border-none px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-6">
                                        Current Position
                                    </Badge>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{myPathway.currentRole}</h2>
                                    <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-[10px]">Division of Science</p>

                                    <div className="space-y-4 mb-10">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Career Readiness</span>
                                            <span className="text-2xl font-bold text-emerald-600">{myPathway.readinessScore}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${myPathway.readinessScore}%` }} />
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2 font-medium">
                                            Required to reach <span className="text-slate-900 font-bold">100%</span> for HOD eligibility.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-600 rounded-lg shadow-md">
                                                <Target className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Next Target Role</p>
                                                <p className="font-bold text-lg text-slate-900 tracking-tight">{myPathway.nextRole}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pathway Timeline / Requirements */}
                            <div className="col-span-1 lg:col-span-2 space-y-6">
                                <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-xl font-bold text-slate-900">Career Advancement Roadmap</CardTitle>
                                        <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Institutional requirements for {myPathway.nextRole}.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0 space-y-4">
                                        {myPathway.requiredCertifications.map((cert) => (
                                            <div key={cert.id} className="flex items-center gap-6 p-5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm">
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${cert.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                                    cert.status === 'In Progress' ? 'bg-indigo-100 text-indigo-600' :
                                                        'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {cert.status === 'Completed' ? <CheckCircle className="w-6 h-6" /> :
                                                        cert.status === 'In Progress' ? <BookOpen className="w-6 h-6" /> :
                                                            <Lock className="w-6 h-6" />
                                                    }
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className={`text-sm font-bold ${cert.status === 'Pending' ? 'text-slate-400' : 'text-slate-900'}`}>{cert.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            {cert.status === 'Completed' && <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">{cert.date}</Badge>}
                                                            {cert.status === 'In Progress' && <Badge className="bg-indigo-50 text-indigo-600 border-none px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">{cert.progress}% Complete</Badge>}
                                                            {cert.status === 'Pending' && <Badge className="bg-slate-50 text-slate-400 border-none px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">Locked</Badge>}
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${cert.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                                            style={{ width: `${cert.status === 'Completed' ? 100 : cert.progress || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="rounded-lg h-9 px-4 font-bold text-[9px] uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all ml-4"
                                                    disabled={cert.status === 'Pending'}
                                                    onClick={() => navigate('/learning-development')}
                                                >
                                                    {cert.status === 'Completed' ? 'Review' : 'Continue'}
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="border border-amber-200 shadow-sm rounded-xl bg-amber-50">
                                    <CardContent className="px-6 py-4 flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-lg shadow-sm text-amber-600 border border-amber-100">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Performance Linkage</h4>
                                            <p className="text-[10px] font-bold text-slate-600 mt-1 max-w-xl leading-relaxed">
                                                Curriculum milestones are mapped to your annual KRA.
                                                Complete all assigned units before <span className="text-slate-900">March 31, 2026</span>.
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
                                <Card key={idx} className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">{category.category}</h3>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-3">
                                        {category.skills.map((skill, sIdx) => (
                                            <div key={sIdx} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                {skill}
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            className="w-full h-10 rounded-lg border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all mt-2"
                                            onClick={() => alert("Skill Library management is restricted to Admin.")}
                                        >
                                            <Plus className="w-3 h-3 mr-2" /> Add Skill
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Institutional Skill Matrix</CardTitle>
                                <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Skill requirements mapped to organizational roles.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-6">
                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-[10px] text-slate-500 uppercase bg-slate-50 font-bold tracking-widest border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4">Organizational Role</th>
                                                <th className="px-6 py-4">Leadership</th>
                                                <th className="px-6 py-4">Curriculum</th>
                                                <th className="px-6 py-4">Operations</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {[
                                                { role: "Class Teacher", lead: "Optional", teach: "Required", digi: "Required" },
                                                { role: "HOD", lead: "Required", teach: "Required", digi: "Required" },
                                                { role: "Lab Assistant", lead: "N/A", teach: "Optional", digi: "Required" },
                                            ].map((row, rIdx) => (
                                                <tr key={rIdx} className="bg-white hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-900">{row.role}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={row.lead === 'Required' ? 'bg-indigo-50 text-indigo-700 border-none' : 'bg-slate-100 text-slate-500 border-none'}>{row.lead}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={row.teach === 'Required' ? 'bg-indigo-50 text-indigo-700 border-none' : 'bg-slate-100 text-slate-500 border-none'}>{row.teach}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={row.digi === 'Required' ? 'bg-indigo-50 text-indigo-700 border-none' : 'bg-slate-100 text-slate-500 border-none'}>{row.digi}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" className="h-9 rounded-lg text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 border border-transparent hover:border-indigo-100">Edit Settings</Button>
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
                            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                                <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Institutional Heatmap</CardTitle>
                                    <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Skill efficiency index across departments.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-6 space-y-8">
                                    {departmentHeatmap.map((dept, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{dept.dept}</h4>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Healthy</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-6">
                                                {/* Strategy */}
                                                <div className="space-y-2">
                                                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                        <div className="h-full bg-indigo-600" style={{ width: `${(dept.strategy / 5) * 100}%` }} />
                                                    </div>
                                                    <div className="flex justify-between items-center px-1">
                                                        <span className="text-[8px] font-bold text-slate-500 uppercase">Strategy</span>
                                                        <span className="text-[10px] font-bold text-slate-900">{dept.strategy}/5</span>
                                                    </div>
                                                </div>
                                                {/* Digital */}
                                                <div className="space-y-2">
                                                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                        <div className="h-full bg-emerald-600" style={{ width: `${(dept.digital / 5) * 100}%` }} />
                                                    </div>
                                                    <div className="flex justify-between items-center px-1">
                                                        <span className="text-[8px] font-bold text-slate-500 uppercase">Digital</span>
                                                        <span className="text-[10px] font-bold text-slate-900">{dept.digital}/5</span>
                                                    </div>
                                                </div>
                                                {/* Leadership */}
                                                <div className="space-y-2">
                                                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                        <div className="h-full bg-rose-600" style={{ width: `${(dept.leadership / 5) * 100}%` }} />
                                                    </div>
                                                    <div className="flex justify-between items-center px-1">
                                                        <span className="text-[8px] font-bold text-slate-500 uppercase">Leadership</span>
                                                        <span className="text-[10px] font-bold text-slate-900">{dept.leadership}/5</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Card className="border-none shadow-lg bg-slate-900 text-white rounded-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] -mr-16 -mt-16" />
                                    <CardHeader className="p-8 pb-4 relative z-10 font-bold border-b border-white/5">
                                        <CardTitle className="text-base font-bold flex items-center gap-3">
                                            <Award className="w-5 h-5 text-amber-400" /> Top Skill Contributors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-6 space-y-4 relative z-10">
                                        {[
                                            { name: "Sarah Jenkins", role: "Physics HOD", score: 98 },
                                            { name: "Michael Thompson", role: "Sr. Faculty", score: 95 },
                                            { name: "Jessica Reed", role: "Operations Head", score: 92 },
                                        ].map((p, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all cursor-default">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-inner">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm tracking-tight">{p.name}</p>
                                                        <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">{p.role}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-lg text-emerald-400">{p.score}%</span>
                                                    <p className="text-[7px] uppercase text-slate-500 font-bold tracking-widest">Efficiency</p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                                    <CardContent className="p-8 pt-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Personal Focus Areas</h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Gaps identified for your transition path</p>
                                            </div>
                                            <div className="p-2 bg-amber-50 rounded-lg">
                                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            {myPathway.skillGaps.map((gap, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between items-end px-1">
                                                        <span className="text-xs font-bold text-slate-900 tracking-tight">{gap.skill}</span>
                                                        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Target Lvl {gap.target}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${(gap.current / gap.target) * 100}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-[8px] font-bold text-slate-400 text-right uppercase">Current proficiency: {gap.current}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            variant="secondary"
                                            className="w-full h-11 mt-8 rounded-lg bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm"
                                            onClick={() => navigate('/learning-development')}
                                        >
                                            Explore Curated Training
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default SkillPathways;
