import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    User, TrendingUp, GraduationCap, Calendar, FileText,
    CheckCircle, ArrowLeft, BookOpen, Trophy, Heart, Sparkles, Star, Lightbulb, Users, Award, Shield, Clock, AlertTriangle, Target,
    ExternalLink, X, Edit, Plus, Upload, Menu
} from 'lucide-react';
import { getStaffPortfolio } from '../services/staffPortfolioService';
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog';

const StaffPortfolioDetail: React.FC = () => {
    const { staffId } = useParams<{ staffId: string }>();
    const navigate = useNavigate();
    const portfolio = getStaffPortfolio(staffId || '');
    const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [editForm, setEditForm] = useState<any>(portfolio?.member || {});
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [selectedEdu, setSelectedEdu] = useState<any>(null);
    const [isEditingExperience, setIsEditingExperience] = useState(false);
    const [selectedExp, setSelectedExp] = useState<any>(null);

    if (!portfolio) {
        return (
            <Layout title="Staff Portfolio" description="Not found" icon={User}>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-slate-600">Staff member not found</p>
                        <Button onClick={() => navigate('/staff-portfolio')} className="mt-4">
                            Back to List
                        </Button>
                    </CardContent>
                </Card>
            </Layout>
        );
    }

    const { member, performanceHistory, trainingJourney, academicContributions,
        researchOutput, complianceRecords, careerTimeline, exitInfo,
        badges, kudos, highlights, probationData } = portfolio;

    return (
        <Layout
            title={member.name}
            description={`${member.designation} • ${member.department}`}
            icon={User}
            showBack
        >
            {/* Action Bar */}
            <div className="flex justify-end mb-4">
                <Button 
                    onClick={() => setIsEditingBasic(true)} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-xl flex items-center gap-2"
                >
                    <Edit className="w-4 h-4" /> Edit Profile
                </Button>
            </div>

            {/* Header Profile Card */}
            <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-slate-900">{member.name}</h2>
                            <p className="text-slate-600">{member.designation}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge className="bg-blue-100 text-blue-800">{member.department}</Badge>
                                <Badge className="bg-green-100 text-green-800">{member.id}</Badge>
                                <Badge className={`${member.status === 'Active' ? 'bg-green-600 text-white' :
                                    'bg-amber-600 text-white'
                                    }`}>
                                    {member.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                                <div>
                                    <div className="text-slate-600">Joined</div>
                                    <div className="font-semibold">{new Date(member.joiningDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className="text-slate-600">Email</div>
                                    <div className="font-semibold text-xs">{member.email}</div>
                                </div>
                                <div>
                                    <div className="text-slate-600">Reporting To</div>
                                    <div className="font-semibold text-xs">{member.reportingManager}</div>
                                </div>
                                <div>
                                    <div className="text-slate-600">Qualification</div>
                                    <div className="font-semibold text-xs">{member.qualification}</div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6 pt-4 border-t border-blue-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{badges.length} Badges</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{kudos.length} Kudos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{highlights.length} Highlights</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Educational Qualification Details Table */}
            <Card className="mb-6 overflow-hidden border-slate-200">
                <CardHeader className="bg-slate-50 border-b py-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Menu className="w-4 h-4" /> Educational Qualification Details
                    </CardTitle>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-indigo-600 hover:text-indigo-700 font-bold text-xs gap-1"
                        onClick={() => { setSelectedEdu(null); setIsEditingEducation(true); }}
                    >
                        <Plus className="w-3 h-3" /> Add Detail
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Education</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Course</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Specialization</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">School / Institute</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Board/ University</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Course Type</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Class</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">% / CGPA</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">Passing Year</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">File</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.educationDetails.map((edu, i) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-xs font-bold text-slate-700 border-r border-slate-100">{edu.level}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600 border-r border-slate-100">{edu.course}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600 border-r border-slate-100">{edu.specialization}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600 border-r border-slate-100">{edu.institute}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600 border-r border-slate-100">{edu.board}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600 border-r border-slate-100">{edu.courseType}</td>
                                        <td className="px-4 py-3 text-xs text-slate-600 border-r border-slate-100">{edu.class}</td>
                                        <td className="px-4 py-3 text-xs font-bold text-slate-700 border-r border-slate-100 text-center">{edu.percentage}%</td>
                                        <td className="px-4 py-3 text-xs font-bold text-slate-700 border-r border-slate-100 text-center">{edu.passingYear}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-center">
                                            <Button variant="link" className="h-auto p-0 text-[10px] font-black text-blue-600 uppercase">View</Button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => { setSelectedEdu(edu); setIsEditingEducation(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <X className="w-3.5 h-3.5 text-blue-900 border border-blue-900/10 rounded" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Experience Details Table */}
            <Card className="mb-6 overflow-hidden border-slate-200 text-xs shadow-sm">
                <CardHeader className="bg-slate-100/50 border-b py-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Menu className="w-4 h-4 text-slate-500" /> Experience Details
                    </CardTitle>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-indigo-600 hover:text-indigo-700 font-bold text-xs gap-1"
                        onClick={() => { setSelectedExp(null); setIsEditingExperience(true); }}
                    >
                        <Plus className="w-3 h-3" /> Add Detail
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-4 bg-white border-b border-slate-100">
                        <p className="text-[11px] font-black text-rose-600 uppercase tracking-tight">
                            NOTE:- In Edit mode, Dates to be Entered manually in dd/mm/yyyy format
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Org. Name</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Designation</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Nature of Job</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">Job Type</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">From</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">To</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">Total Exp.</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-right">Last Drawn</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100 text-center">Upload Doc.</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.experienceDetails.map((exp, i) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700">
                                        <td className="px-4 py-3 border-r border-slate-100">{exp.orgName}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-slate-600 uppercase font-black">{exp.designation}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-slate-600 font-medium">{exp.natureOfJob}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600 font-medium">{exp.jobType}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600 font-medium">{exp.fromDate}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600 font-medium">{exp.toDate}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600 font-medium">{exp.totalExp}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-right text-slate-600 font-medium">{exp.lastDrawn}</td>
                                        <td className="px-4 py-3 border-r border-slate-100 text-center">
                                            <Button variant="link" className="h-auto p-0 text-[10px] font-black text-blue-600 uppercase">View</Button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => { setSelectedExp(exp); setIsEditingExperience(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="text-slate-400 hover:text-rose-600 transition-colors">
                                                    <X className="w-3.5 h-3.5 text-blue-900 border border-blue-900/10 rounded" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Performance & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance History */}
                    <Card>
                        <CardHeader className="bg-purple-50 border-b">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Performance History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {performanceHistory.map((perf, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg">
                                        <div className="text-center min-w-[60px]">
                                            <div className="text-2xl font-bold text-purple-900">{perf.rating}</div>
                                            <div className="text-[10px] text-slate-600">{perf.year}</div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className={`text-[10px] ${perf.performanceBand === 'Outstanding' ? 'bg-green-100 text-green-800' :
                                                    perf.performanceBand === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {perf.performanceBand}
                                                </Badge>
                                                <Badge className="bg-green-600 text-white text-[10px]">
                                                    +{perf.increment}% Increment
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-600">{perf.remarks}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Career Timeline */}
                    <Card>
                        <CardHeader className="bg-indigo-50 border-b">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Career Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="relative">
                                {careerTimeline.map((milestone, idx) => (
                                    <div key={idx} className="flex gap-4 pb-4">
                                        <div className="relative">
                                            <div className={`w-3 h-3 rounded-full ${milestone.type === 'Joining' ? 'bg-blue-600' :
                                                milestone.type === 'Promotion' ? 'bg-purple-600' :
                                                    milestone.type === 'Award' ? 'bg-yellow-500' :
                                                        milestone.type === 'Publication' ? 'bg-green-600' :
                                                            'bg-slate-400'
                                                }`} />
                                            {idx < careerTimeline.length - 1 && (
                                                <div className="absolute top-3 left-1.5 w-0.5 h-full bg-slate-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="text-xs text-slate-500">{new Date(milestone.date).toLocaleDateString()}</div>
                                            <h4 className="font-semibold text-sm text-slate-900 mt-1">{milestone.title}</h4>
                                            <p className="text-xs text-slate-600 mt-1">{milestone.description}</p>

                                            {/* Increment Salary Details */}
                                            {milestone.type === 'Increment' && milestone.beforeIncrementSalary && milestone.afterIncrementSalary && (
                                                <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" /> Salary Revision Details
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-white border border-slate-100 rounded-lg p-2 text-center">
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Before</div>
                                                            <div className="font-bold text-slate-700 text-sm">{milestone.beforeIncrementSalary}</div>
                                                        </div>
                                                        <div className="flex items-center justify-center">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                                <TrendingUp className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 bg-white border border-emerald-200 rounded-lg p-2 text-center ring-1 ring-emerald-500/10 shadow-sm relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-50 rounded-bl-full flex items-start justify-end p-1">
                                                                <Star className="w-2.5 h-2.5 text-emerald-500" />
                                                            </div>
                                                            <div className="text-[10px] text-emerald-600 font-black uppercase mb-0.5">After</div>
                                                            <div className="font-black text-emerald-700 text-sm">{milestone.afterIncrementSalary}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Training Journey */}
                    <Card>
                        <CardHeader className="bg-green-50 border-b">
                            <CardTitle className="text-base flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Learning & Development
                                </div>
                                <div className="flex gap-2">
                                    {trainingJourney.certifications?.map((cert, i) => (
                                        <Badge key={i} className="bg-indigo-100 text-indigo-700 text-[9px] border-none font-black uppercase">
                                            {cert.issuer}
                                        </Badge>
                                    ))}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 bg-green-50/50 rounded-[24px] border border-green-100 text-center">
                                    <div className="text-3xl font-black text-green-900 leading-none">{trainingJourney.totalHours}</div>
                                    <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Total Hours</div>
                                </div>
                                <div className="p-4 bg-blue-50/50 rounded-[24px] border border-blue-100 text-center">
                                    <div className="text-3xl font-black text-blue-900 leading-none">{trainingJourney.coursesCompleted}</div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Courses</div>
                                </div>
                                <div className="p-4 bg-purple-50/50 rounded-[24px] border border-purple-100 text-center">
                                    <div className="text-3xl font-black text-purple-900 leading-none">{trainingJourney.certifications?.length || 0}</div>
                                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">Certs</div>
                                </div>
                                <div className="p-4 bg-amber-50/50 rounded-[24px] border border-amber-100 text-center">
                                    <div className="text-3xl font-black text-amber-900 leading-none">84%</div>
                                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Compliance</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {trainingJourney.recentTrainings.map((training, idx) => (
                                        <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{training.title}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{training.date} • {training.duration}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recognition Wall */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[40px] border-none shadow-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <Trophy className="w-6 h-6 text-yellow-400" />
                                    Badges Received
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="flex flex-wrap gap-4">
                                    {badges.map((badge) => (
                                        <div key={badge.id} className="group relative">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg ${badge.level === 'Gold' ? 'bg-yellow-500 text-yellow-950' :
                                                badge.level === 'Silver' ? 'bg-slate-300 text-slate-900' :
                                                    'bg-amber-600 text-amber-50'
                                                }`}>
                                                {badge.icon === 'Lightbulb' ? <Lightbulb className="w-8 h-8" /> :
                                                    badge.icon === 'Users' ? <Users className="w-8 h-8" /> :
                                                        <Heart className="w-8 h-8" />}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white text-indigo-900 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black">
                                                {badge.level[0]}
                                            </div>
                                            <div className="mt-3 text-center">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">{badge.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[40px] border-none shadow-xl bg-white overflow-hidden">
                            <CardHeader className="p-8 pb-4 border-b border-slate-50">
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <Heart className="w-6 h-6 text-rose-500" />
                                    Wall of Kudos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-6 space-y-4">
                                {kudos.map((k) => (
                                    <div key={k.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50 relative">
                                        <div className="absolute top-4 right-4 text-[10px] font-black text-rose-300 uppercase tracking-widest">{k.date}</div>
                                        <p className="text-sm font-medium text-slate-700 italic pr-12">"{k.message}"</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From:</div>
                                            <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{k.from}</div>
                                            <Badge className="bg-rose-100 text-rose-700 text-[8px] h-4 border-none px-1.5 uppercase font-black">{k.type}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column - Stats & Info */}
                <div className="space-y-6">
                    {/* Academic Contributions */}
                    <Card>
                        <CardHeader className="bg-blue-50 border-b">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Academic Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div>
                                <div className="text-2xl font-bold text-blue-900">{academicContributions.studentsImpacted}</div>
                                <div className="text-xs text-slate-600">Students Taught</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-900">{academicContributions.averagePassPercentage}%</div>
                                <div className="text-xs text-slate-600">Avg Pass Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-900">{academicContributions.averageFeedbackRating}/5</div>
                                <div className="text-xs text-slate-600">Student Feedback</div>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="text-xs text-slate-600 mb-1">Subjects Taught:</div>
                                <div className="flex flex-wrap gap-1">
                                    {academicContributions.subjectsTaught.map((subject, idx) => (
                                        <Badge key={idx} className="bg-blue-100 text-blue-800 text-[10px]">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Research Output */}
                    <Card>
                        <CardHeader className="bg-amber-50 border-b">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Research Output
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Publications</span>
                                <span className="font-bold text-amber-900">{researchOutput.publications}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Conferences</span>
                                <span className="font-bold text-amber-900">{researchOutput.conferences}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Patents</span>
                                <span className="font-bold text-amber-900">{researchOutput.patents}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Citations</span>
                                <span className="font-bold text-amber-900">{researchOutput.citations}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Highlights & Awards */}
                    <Card className="rounded-[40px] border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-indigo-600 p-6 text-white">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Career Highlights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {highlights.map((h) => (
                                <div
                                    key={h.id}
                                    className="flex gap-4 group cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-2xl transition-all"
                                    onClick={() => setSelectedHighlight(h)}
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${h.category === 'Award' ? 'bg-amber-100 text-amber-600' :
                                        h.category === 'Research' ? 'bg-blue-100 text-blue-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                        {h.category === 'Award' ? <Award className="w-5 h-5" /> :
                                            h.category === 'Research' ? <Target className="w-5 h-5" /> :
                                                <BookOpen className="w-5 h-5" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                            {h.title}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.category} • {h.date}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Highlight Detail Modal */}
                    <Dialog open={!!selectedHighlight} onOpenChange={() => setSelectedHighlight(null)}>
                        <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
                            <div className={`h-32 w-full flex items-end p-8 relative ${selectedHighlight?.category === 'Award' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                                selectedHighlight?.category === 'Research' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                                    'bg-gradient-to-r from-purple-500 to-pink-600'
                                }`}>
                                <button
                                    onClick={() => setSelectedHighlight(null)}
                                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/20 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="space-y-1 text-white">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{selectedHighlight?.category} Recognition</div>
                                    <DialogTitle className="text-2xl font-black text-white">{selectedHighlight?.title}</DialogTitle>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 bg-white">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Received</div>
                                        <div className="text-sm font-bold text-slate-900">{selectedHighlight?.date}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impact Metric</div>
                                        <div className="text-sm font-black text-indigo-600">{selectedHighlight?.impact}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overview</div>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {selectedHighlight?.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags & Competencies</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedHighlight?.tags?.map((tag: string, i: number) => (
                                            <Badge key={i} className="bg-slate-100 text-slate-600 border-none px-3 py-1 rounded-lg font-bold text-[10px] uppercase">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <Button
                                        onClick={() => setSelectedHighlight(null)}
                                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Close Details
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Probation Insights */}
                    {probationData && (
                        <Card className="rounded-[40px] border-2 border-indigo-100 shadow-xl bg-white overflow-hidden">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 p-6">
                                <CardTitle className="text-base flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-indigo-900">
                                        <Shield className="h-5 w-5" />
                                        Probation Insights
                                    </div>
                                    <Badge className="bg-indigo-600 text-white border-none uppercase text-[10px] font-black tracking-widest">
                                        {probationData.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-black text-slate-900">{probationData.onTimeTasks}</div>
                                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">On-Time Tasks</div>
                                        </div>
                                        <Clock className="w-5 h-5 text-indigo-200" />
                                    </div>
                                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-black text-rose-600">{probationData.delayedTasks}</div>
                                            <div className="text-[10px] font-black text-rose-300 uppercase tracking-widest mt-1">Delayed</div>
                                        </div>
                                        <AlertTriangle className="w-5 h-5 text-rose-200" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Completion</h4>
                                        <span className="text-sm font-black text-indigo-600">{probationData.completionRate}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${probationData.completionRate}%` }} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review History</h4>
                                    <div className="space-y-4">
                                        {probationData.history.map((event, i) => (
                                            <div key={i} className="flex gap-4 relative">
                                                {i < probationData.history.length - 1 && (
                                                    <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-100" />
                                                )}
                                                <div className={`w-5 h-5 rounded-full z-10 flex items-center justify-center border-2 border-white shadow-sm ${event.status.includes('On-time') ? 'bg-emerald-500' : 'bg-rose-500'
                                                    }`} />
                                                <div className="space-y-1 pb-4">
                                                    <div className="text-xs font-black text-slate-900 uppercase leading-none">{event.event}</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{event.date} • {event.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 gap-2">
                                    {probationData.kpis.map((kpi, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-xs font-bold text-slate-700">{kpi.title}</span>
                                            <Badge className="bg-emerald-100 text-emerald-700 text-[8px] h-4 border-none uppercase font-black">{kpi.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {/* Compliance */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Compliance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Attendance</span>
                                <span className="font-bold text-green-900">{complianceRecords.currentAttendance}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Leave Balance</span>
                                <span className="font-bold text-slate-900">{complianceRecords.leaveBalance} days</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Disciplinary</span>
                                <span className="font-bold text-green-900">{complianceRecords.disciplinaryRecords}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exit Info (if applicable) */}
                    {exitInfo && (
                        <Card className="border-red-200">
                            <CardHeader className="bg-red-50 border-b border-red-100">
                                <CardTitle className="text-sm text-red-900">Exit Information</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-2 text-sm">
                                <div>
                                    <div className="text-slate-600">Resignation Date</div>
                                    <div className="font-semibold">{exitInfo.resignationDate}</div>
                                </div>
                                <div>
                                    <div className="text-slate-600">Reason</div>
                                    <div className="font-semibold">{exitInfo.reason}</div>
                                </div>
                                <div>
                                    <div className="text-slate-600">NOC Status</div>
                                    <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                                        {exitInfo.nocStatus}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
                <Button onClick={() => navigate('/staff-portfolio')} variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Staff List
                </Button>
            </div>

            {/* Basic Info Edit Modal */}
            <Dialog open={isEditingBasic} onOpenChange={setIsEditingBasic}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
                    <div className="bg-indigo-600 h-24 w-full flex items-end p-8 relative">
                        <button onClick={() => setIsEditingBasic(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        <DialogTitle className="text-2xl font-black text-white">Edit Basic Information</DialogTitle>
                    </div>
                    <div className="p-8 bg-white grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                            <input 
                                type="text" value={editForm.name} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                            <input 
                                type="text" value={editForm.designation} 
                                onChange={(e) => setEditForm({...editForm, designation: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                            <input 
                                type="text" value={editForm.department} 
                                onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                            <input 
                                type="email" value={editForm.email} 
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                            />
                        </div>
                        <div className="col-span-2 pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsEditingBasic(false)} className="rounded-2xl px-6 h-12 font-black uppercase text-[10px]">Cancel</Button>
                            <Button onClick={() => setIsEditingBasic(false)} className="bg-indigo-600 text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px]">Save Changes</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Education Edit Modal */}
            <Dialog open={isEditingEducation} onOpenChange={setIsEditingEducation}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
                    <div className="bg-blue-700 h-24 w-full flex items-end p-8 relative">
                        <button onClick={() => setIsEditingEducation(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        <DialogTitle className="text-2xl font-black text-white">Update Education Detail</DialogTitle>
                    </div>
                    <div className="p-8 bg-white grid grid-cols-3 gap-6">
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.level} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.course} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.specialization} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">School / Institute</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.institute} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Board / University</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.board} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Type</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.courseType} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.class} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentage</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.percentage} /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passing Year</label><input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedEdu?.passingYear} /></div>
                        
                        <div className="col-span-3 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <Upload className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Update Document</span>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsEditingEducation(false)} className="rounded-2xl px-6 h-12 font-black uppercase text-[10px]">Cancel</Button>
                                <Button onClick={() => setIsEditingEducation(false)} className="bg-blue-600 text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px]">Update Detail</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Experience Edit Modal */}
            <Dialog open={isEditingExperience} onOpenChange={setIsEditingExperience}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
                    <div className="bg-slate-800 h-24 w-full flex items-end p-8 relative">
                        <button onClick={() => setIsEditingExperience(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        <DialogTitle className="text-2xl font-black text-white">Update Experience Detail</DialogTitle>
                    </div>
                    <div className="p-8 bg-white grid grid-cols-4 gap-6">
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization Name</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.orgName} />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.designation} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature of Job</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.natureOfJob} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Type</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.jobType} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From Date (dd/mm/yyyy)</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.fromDate} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To Date (dd/mm/yyyy)</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.toDate} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Experience</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.totalExp} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Drawn Salary</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" defaultValue={selectedExp?.lastDrawn} />
                        </div>
                        
                        <div className="col-span-4 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <Upload className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Experience Document</span>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsEditingExperience(false)} className="rounded-2xl px-6 h-12 font-black uppercase text-[10px]">Cancel</Button>
                                <Button onClick={() => setIsEditingExperience(false)} className="bg-slate-900 text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px]">Save Details</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default StaffPortfolioDetail;
