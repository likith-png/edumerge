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
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
    const [isPersonalOpen, setIsPersonalOpen] = useState(false);
    const [experienceDetails, setExperienceDetails] = useState<any[]>(portfolio?.experienceDetails || []);
    const [expForm, setExpForm] = useState<any>({});



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

    const calculateTotalExperience = (from: string, to: string) => {
        if (!from || !to) return '';
        try {
            const [fDay, fMonth, fYear] = from.split('/').map(Number);
            const [tDay, tMonth, tYear] = to.split('/').map(Number);
            
            const startDate = new Date(fYear, fMonth - 1, fDay);
            const endDate = new Date(tYear, tMonth - 1, tDay);
            
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '';
            
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const years = (diffDays / 365.25).toFixed(2);
            return years;
        } catch (e) {
            return '';
        }
    };

    const handleSaveExperience = () => {
        if (selectedExp) {
            setExperienceDetails(prev => prev.map(exp => exp === selectedExp ? expForm : exp));
        } else {
            setExperienceDetails(prev => [...prev, expForm]);
        }
        setIsEditingExperience(false);
    };

    const handleExperienceChange = (field: string, value: string) => {
        const updatedForm = { ...expForm, [field]: value };
        if (field === 'fromDate' || field === 'toDate') {
            const totalExp = calculateTotalExperience(
                field === 'fromDate' ? value : expForm.fromDate,
                field === 'toDate' ? value : expForm.toDate
            );
            updatedForm.totalExp = totalExp;
        }
        setExpForm(updatedForm);
    };

    const parseSalary = (salaryStr: string) => {
        if (!salaryStr) return 0;
        return Number(salaryStr.replace(/[^0-9.-]+/g, ""));
    };

    const formatSalary = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getDisplaySalary = (yearlySalaryStr: string) => {
        const yearly = parseSalary(yearlySalaryStr);
        if (viewMode === 'monthly') {
            return formatSalary(Math.round(yearly / 12)) + " / mo";
        }
        return formatSalary(yearly) + " / yr";
    };

    const calculateServiceDuration = (toDate: string) => {
        const start = new Date(member.joiningDate);
        const end = new Date(toDate);
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        const yrStr = years > 0 ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : '';
        const moStr = months > 0 ? `${months} ${months === 1 ? 'mo' : 'mos'}` : '';
        
        return [yrStr, moStr].filter(Boolean).join(' ') || 'Just Joined';
    };



    return (
        <Layout
            title={member.name}
            description={`${member.designation} • ${member.department}`}
            icon={User}
            showBack
        >
            {/* Action Bar */}
            <div className="flex justify-end mb-8 gap-3">
                <div className="inline-flex items-center bg-white/40 backdrop-blur-md p-1.5 rounded-[16px] border border-white/60 shadow-sm">
                    <button
                        onClick={() => setViewMode('monthly')}
                        className={`px-5 py-2.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'monthly'
                            ? 'bg-white text-blue-800 shadow-sm border border-white'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setViewMode('yearly')}
                        className={`px-5 py-2.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'yearly'
                            ? 'bg-white text-blue-800 shadow-sm border border-white'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
                <Button
                    onClick={() => setIsPersonalOpen(true)}
                    className="bg-white/80 backdrop-blur-md hover:bg-white text-blue-800 border border-white/60 shadow-sm rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] px-6 h-[46px]"
                >
                    <User className="w-4 h-4" /> Personal Details
                </Button>
                <Button
                    onClick={() => setIsEditingBasic(true)} 
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md shadow-blue-900/20 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] border border-blue-700/50 px-6 h-[46px]"
                >
                    <Edit className="w-4 h-4" /> Edit Profile
                </Button>
            </div>


            {/* Header Profile Card */}
            <Card className="mb-8 overflow-hidden relative bg-white/60 backdrop-blur-xl border-white/60 shadow-xl rounded-[40px]">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-800/10 rounded-full blur-[80px] -mr-64 -mt-64 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[60px] -ml-32 -mb-32 opacity-40"></div>
                
                <CardContent className="p-10 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 bg-white/80 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-blue-800 shadow-lg border border-white ring-4 ring-blue-50/50 overflow-hidden">
                            <img src={`https://i.pravatar.cc/300?u=${encodeURIComponent(member.name)}`} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight">{member.name}</h2>
                            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2 mb-6">{member.designation}</p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                                <Badge className="bg-white/80 text-slate-700 border-white shadow-sm px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">{member.department}</Badge>
                                <Badge className="bg-white/80 text-slate-700 border-white shadow-sm px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">{member.id}</Badge>
                                <Badge className={`shadow-sm border-white px-4 py-1.5 font-black uppercase tracking-widest text-[10px] ${member.status === 'Active' ? 'bg-emerald-50/80 text-emerald-700' :
                                    'bg-amber-50/80 text-amber-700'
                                    }`}>
                                    {member.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Joined</div>
                                    <div className="font-bold text-slate-800 text-sm">{new Date(member.joiningDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email</div>
                                    <div className="font-bold text-slate-800 text-sm">{member.email}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reporting To</div>
                                    <div className="font-bold text-slate-800 text-sm">{member.reportingManager}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Qualification</div>
                                    <div className="font-bold text-slate-800 text-sm">{member.qualification}</div>
                                </div>
                            </div>
                            
                            <div className="flex justify-center md:justify-start gap-4 mt-8">
                                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 border border-white rounded-2xl shadow-sm">
                                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{badges.length} Badges</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 border border-white rounded-2xl shadow-sm">
                                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{kudos.length} Kudos</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 border border-white rounded-2xl shadow-sm">
                                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{highlights.length} Highlights</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Educational Qualification Details Table */}
            <Card className="mb-8 overflow-hidden bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-3xl">
                <CardHeader className="bg-white/40 border-b border-white/60 py-5 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-800"><Menu className="w-4 h-4" /></div> 
                        Educational Qualification Details
                    </CardTitle>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="bg-white hover:bg-white/80 text-blue-800 shadow-sm border border-white/60 font-black text-[10px] uppercase tracking-widest gap-2 rounded-xl h-10 px-4"
                        onClick={() => { setSelectedEdu(null); setIsEditingEducation(true); }}
                    >
                        <Plus className="w-4 h-4" /> Add Detail
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/40 border-b border-white/60">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Education</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Course</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Specialization</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Institute</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Board/ Univ</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Class</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">% / CGPA</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Year</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">File</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.educationDetails.map((edu: any, i: number) => (
                                    <tr key={i} className="border-b border-white/60 hover:bg-white/80 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">{edu.level}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{edu.course}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{edu.specialization}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-[150px] truncate">{edu.institute}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-[120px] truncate">{edu.board}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{edu.courseType}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{edu.class}</td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800 text-center">{edu.percentage}%</td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800 text-center">{edu.passingYear}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Button variant="link" className="h-auto p-0 text-[10px] font-black text-blue-800 hover:text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md no-underline hover:no-underline">View</Button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => { setSelectedEdu(edu); setIsEditingEducation(true); }} className="w-8 h-8 rounded-lg bg-white border border-white/60 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-800 transition-colors">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="w-8 h-8 rounded-lg bg-white border border-rose-100 shadow-sm flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors">
                                                    <X className="w-4 h-4" />
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
            <Card className="mb-8 overflow-hidden bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-3xl text-sm">
                <CardHeader className="bg-white/40 border-b border-white/60 py-5 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-800"><Menu className="w-4 h-4" /></div> 
                        Experience Details
                    </CardTitle>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="bg-white hover:bg-white/80 text-blue-800 shadow-sm border border-white/60 font-black text-[10px] uppercase tracking-widest gap-2 rounded-xl h-10 px-4"
                        onClick={() => { 
                            setSelectedExp(null); 
                            setExpForm({});
                            setIsEditingExperience(true); 
                        }}
                    >
                        <Plus className="w-4 h-4" /> Add Detail
                    </Button>

                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-4 bg-rose-50/50 border-b border-rose-100 flex items-center gap-3 px-6">
                        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0"><AlertTriangle className="w-3 h-3" /></div>
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.1em]">
                            NOTE: In Edit mode, Dates must be Entered manually in dd/mm/yyyy format
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/40 border-b border-white/60">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Org. Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Designation</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nature of Job</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Job Type</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">From</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">To</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Exp.</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Last Drawn</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Doc.</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experienceDetails.map((exp: any, i: number) => (
                                    <tr key={i} className="border-b border-white/60 hover:bg-white/80 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">{exp.orgName}</td>
                                        <td className="px-6 py-4 text-[10px] text-slate-600 uppercase font-black tracking-widest">{exp.designation}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">{exp.natureOfJob}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-semibold text-center">{exp.jobType}</td>
                                        <td className="px-6 py-4 text-xs text-slate-600 font-black text-center">{exp.fromDate}</td>
                                        <td className="px-6 py-4 text-xs text-slate-600 font-black text-center">{exp.toDate}</td>
                                        <td className="px-6 py-4 text-xs text-blue-800 font-black text-center">{exp.totalExp}</td>
                                        <td className="px-6 py-4 text-xs text-emerald-600 font-black text-right">{exp.lastDrawn}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Button variant="link" className="h-auto p-0 text-[10px] font-black text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md hover:no-underline">View</Button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => { 
                                                        setSelectedExp(exp); 
                                                        setExpForm(exp);
                                                        setIsEditingExperience(true); 
                                                    }} 
                                                    className="w-8 h-8 rounded-lg bg-white border border-white/60 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-800 transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setExperienceDetails(prev => prev.filter(e => e !== exp));
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-white border border-rose-100 shadow-sm flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
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
                    <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                Performance History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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
                    <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-3xl overflow-hidden mt-6">
                        <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shadow-sm">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                Career Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="text-xs text-slate-500">{new Date(milestone.date).toLocaleDateString()}</div>
                                                <Badge className="bg-slate-100 text-slate-600 text-[10px] border-none font-bold">
                                                    {calculateServiceDuration(milestone.date)}
                                                </Badge>
                                            </div>
                                            <h4 className="font-semibold text-sm text-slate-900 mt-1">{milestone.title}</h4>
                                            <p className="text-xs text-slate-600 mt-1">{milestone.description}</p>

                                            {/* Increment Salary Details */}
                                            {milestone.type === 'Increment' && milestone.beforeIncrementSalary && milestone.afterIncrementSalary && (
                                                <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" /> Salary Revision Details ({viewMode === 'monthly' ? 'Monthly' : 'Yearly'})
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-white border border-slate-100 rounded-lg p-2 text-center">
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Before</div>
                                                            <div className="font-bold text-slate-700 text-sm">{getDisplaySalary(milestone.beforeIncrementSalary)}</div>
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
                                                            <div className="font-black text-emerald-700 text-sm">{getDisplaySalary(milestone.afterIncrementSalary)}</div>
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
                    <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-3xl overflow-hidden mt-6">
                        <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                        <GraduationCap className="h-4 w-4" />
                                    </div>
                                    Learning & Development
                                </div>
                                <div className="flex gap-2">
                                    {trainingJourney.certifications?.map((cert, i) => (
                                        <Badge key={i} className="bg-blue-50 text-blue-800 border border-blue-100 text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-sm">
                                            {cert.issuer}
                                        </Badge>
                                    ))}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <Card className="rounded-[32px] border border-slate-800 shadow-xl bg-slate-900/90 backdrop-blur-xl text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl"></div>
                            <CardHeader className="p-8 pb-4 relative z-10">
                                <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-300">
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                                        <Trophy className="w-4 h-4 text-amber-400" />
                                    </div>
                                    Badges Received
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 relative z-10">
                                <div className="flex flex-wrap gap-4">
                                    {badges.map((badge) => (
                                        <div key={badge.id} className="group relative">
                                            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg border border-white/10 ${badge.level === 'Gold' ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white' :
                                                badge.level === 'Silver' ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                                                    'bg-gradient-to-br from-amber-700 to-orange-900 text-white'
                                                }`}>
                                                {badge.icon === 'Lightbulb' ? <Lightbulb className="w-6 h-6" /> :
                                                    badge.icon === 'Users' ? <Users className="w-6 h-6" /> :
                                                        <Heart className="w-6 h-6" />}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 text-white border border-slate-600 flex items-center justify-center text-[8px] font-black shadow-sm">
                                                {badge.level[0]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[32px] border border-white/60 shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
                            <CardHeader className="p-8 pb-4 border-b border-white/60 bg-white/40">
                                <CardTitle className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    Wall of Kudos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-6 space-y-4">
                                {kudos.map((k) => (
                                    <div key={k.id} className="p-4 rounded-2xl bg-white/80 border border-white shadow-sm relative group hover:shadow-md transition-all">
                                        <div className="absolute top-4 right-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{k.date}</div>
                                        <p className="text-sm font-bold text-slate-700 italic pr-12 pb-2">"{k.message}"</p>
                                        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center gap-2">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">From</div>
                                            <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{k.from}</div>
                                            <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] h-5 px-2 uppercase font-black tracking-widest ml-auto shadow-sm">{k.type}</Badge>
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
                    <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                            <CardTitle className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                                Academic Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div className="p-4 bg-white/80 border border-white rounded-2xl shadow-sm">
                                <div className="text-3xl font-black text-blue-600 leading-none mb-1">{academicContributions.studentsImpacted}</div>
                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Students Taught</div>
                            </div>
                            <div className="p-4 bg-white/80 border border-white rounded-2xl shadow-sm">
                                <div className="text-3xl font-black text-emerald-600 leading-none mb-1">{academicContributions.averagePassPercentage}%</div>
                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Avg Pass Rate</div>
                            </div>
                            <div className="p-4 bg-white/80 border border-white rounded-2xl shadow-sm">
                                <div className="text-3xl font-black text-purple-600 leading-none mb-1">{academicContributions.averageFeedbackRating}/5</div>
                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Student Feedback</div>
                            </div>
                            <div className="pt-4 border-t border-white/60">
                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> Subjects Taught</div>
                                <div className="flex flex-wrap gap-2">
                                    {academicContributions.subjectsTaught.map((subject, idx) => (
                                        <Badge key={idx} className="bg-white hover:bg-white text-slate-700 border border-slate-200 text-[9px] uppercase font-black tracking-widest px-3 py-1 shadow-sm">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Research Output */}
                    <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                            <CardTitle className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                                    <FileText className="h-4 w-4" />
                                </div>
                                Research Output
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Publications</span>
                                <span className="font-black text-lg text-slate-800">{researchOutput.publications}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Conferences</span>
                                <span className="font-black text-lg text-slate-800">{researchOutput.conferences}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Patents</span>
                                <span className="font-black text-lg text-slate-800">{researchOutput.patents}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Citations</span>
                                <span className="font-black text-lg text-slate-800">{researchOutput.citations}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Highlights & Awards */}
                    <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                            <CardTitle className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shadow-sm">
                                    <Star className="h-4 w-4" />
                                </div>
                                Career Highlights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {highlights.map((h) => (
                                <div
                                    key={h.id}
                                    className="flex gap-4 group cursor-pointer hover:bg-white/80 p-3 -m-3 rounded-2xl transition-all border border-transparent hover:border-white shadow-none hover:shadow-sm"
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
                                        <div className="text-sm font-black text-slate-900 group-hover:text-blue-800 transition-colors flex items-center gap-2">
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
                                selectedHighlight?.category === 'Research' ? 'bg-gradient-to-r from-blue-500 to-blue-800' :
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
                                        <div className="text-sm font-black text-blue-800">{selectedHighlight?.impact}</div>
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
                        <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-[32px] overflow-hidden">
                            <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                                <CardTitle className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shadow-sm">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        Probation Insights
                                    </div>
                                    <Badge className="bg-blue-800 text-white border-none uppercase text-[9px] font-black tracking-widest shadow-sm">
                                        {probationData.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-3xl bg-white/80 border border-white shadow-sm flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-black text-slate-900">{probationData.onTimeTasks}</div>
                                            <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-1">On-Time Tasks</div>
                                        </div>
                                        <Clock className="w-5 h-5 text-blue-200" />
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/80 border border-white shadow-sm flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-black text-rose-600">{probationData.delayedTasks}</div>
                                            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Delayed</div>
                                        </div>
                                        <AlertTriangle className="w-5 h-5 text-rose-300" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Completion</h4>
                                        <span className="text-sm font-black text-blue-800">{probationData.completionRate}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-800 rounded-full" style={{ width: `${probationData.completionRate}%` }} />
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
                    <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="bg-white/40 border-b border-white/60 py-5">
                            <CardTitle className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm">
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                Compliance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Attendance</span>
                                <span className="font-black text-lg text-emerald-600">{complianceRecords.currentAttendance}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Leave Balance</span>
                                <span className="font-black text-lg text-slate-800">{complianceRecords.leaveBalance} days</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/80 rounded-xl border border-white shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Disciplinary</span>
                                <span className="font-black text-lg text-emerald-600">{complianceRecords.disciplinaryRecords}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exit Info (if applicable) */}
                    {exitInfo && (
                        <Card className="bg-white/60 backdrop-blur-md border border-rose-100/50 shadow-sm rounded-[32px] overflow-hidden">
                            <CardHeader className="bg-rose-50/50 border-b border-rose-100/50 py-5">
                                <CardTitle className="text-[11px] font-black text-rose-800 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
                                        <AlertTriangle className="h-4 w-4" />
                                    </div>
                                    Exit Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className="p-3 bg-white/80 rounded-xl border border-white shadow-sm flex items-center justify-between">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resignation Date</div>
                                    <div className="font-black text-sm text-slate-800">{exitInfo.resignationDate}</div>
                                </div>
                                <div className="p-3 bg-white/80 rounded-xl border border-white shadow-sm flex items-center justify-between">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reason</div>
                                    <div className="font-black text-sm text-slate-800">{exitInfo.reason}</div>
                                </div>
                                <div className="p-3 bg-white/80 rounded-xl border border-white shadow-sm flex items-center justify-between">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">NOC Status</div>
                                    <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] uppercase font-black tracking-widest shadow-sm">
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
                    <div className="bg-blue-800 h-24 w-full flex items-end p-8 relative">
                        <button onClick={() => setIsEditingBasic(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        <DialogTitle className="text-2xl font-black text-white">Edit Basic Information</DialogTitle>
                    </div>
                    <div className="p-8 bg-white grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                            <input 
                                type="text" value={editForm.name} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-700 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                            <input 
                                type="text" value={editForm.designation} 
                                onChange={(e) => setEditForm({...editForm, designation: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-700 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                            <input 
                                type="text" value={editForm.department} 
                                onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-700 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                            <input 
                                type="email" value={editForm.email} 
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-700 text-sm font-bold"
                            />
                        </div>
                        <div className="col-span-2 pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsEditingBasic(false)} className="rounded-2xl px-6 h-12 font-black uppercase text-[10px]">Cancel</Button>
                            <Button onClick={() => setIsEditingBasic(false)} className="bg-blue-800 text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px]">Save Changes</Button>
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
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" 
                                value={expForm.orgName || ''} 
                                onChange={(e) => handleExperienceChange('orgName', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" 
                                value={expForm.designation || ''} 
                                onChange={(e) => handleExperienceChange('designation', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature of Job</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" 
                                value={expForm.natureOfJob || ''} 
                                onChange={(e) => handleExperienceChange('natureOfJob', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Type</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" 
                                value={expForm.jobType || ''} 
                                onChange={(e) => handleExperienceChange('jobType', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From Date (dd/mm/yyyy)</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" 
                                value={expForm.fromDate || ''} 
                                onChange={(e) => handleExperienceChange('fromDate', e.target.value)}
                                placeholder="dd/mm/yyyy"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To Date (dd/mm/yyyy)</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" 
                                value={expForm.toDate || ''} 
                                onChange={(e) => handleExperienceChange('toDate', e.target.value)}
                                placeholder="dd/mm/yyyy"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Experience (Years)</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50 cursor-not-allowed" 
                                value={expForm.totalExp || ''} 
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Drawn Salary</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold" 
                                value={expForm.lastDrawn || ''} 
                                onChange={(e) => handleExperienceChange('lastDrawn', e.target.value)}
                            />
                        </div>
                        
                        <div className="col-span-4 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <Upload className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Experience Document</span>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsEditingExperience(false)} className="rounded-2xl px-6 h-12 font-black uppercase text-[10px]">Cancel</Button>
                                <Button onClick={handleSaveExperience} className="bg-slate-900 text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px]">Save Details</Button>
                            </div>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>

            {/* Personal Details Modal */}
            <Dialog open={isPersonalOpen} onOpenChange={setIsPersonalOpen}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-[40px] shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-900 to-blue-900 h-32 w-full flex items-end p-10 relative">
                        <button
                            onClick={() => setIsPersonalOpen(false)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Personal Information</h3>
                                <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">Confidential & Verified Records</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 space-y-10 bg-white max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.dob}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.gender}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Group</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.bloodGroup}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.nationality}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Religion</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.religion}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marital Status</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.maritalStatus}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Father's Name</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.fatherName}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mother's Name</label>
                                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{portfolio.personalDetails.motherName}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Aadhar Number
                                </label>
                                <div className="text-sm font-black text-blue-800 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">{portfolio.personalDetails.aadharNumber}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> PAN Number
                                </label>
                                <div className="text-sm font-black text-blue-800 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">{portfolio.personalDetails.panNumber}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> PF Number
                                </label>
                                <div className="text-sm font-black text-blue-800 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">{portfolio.personalDetails.pfNumber}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> ESI Number
                                </label>
                                <div className="text-sm font-black text-blue-800 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">{portfolio.personalDetails.esiNumber}</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Menu className="w-4 h-4 text-slate-400" /> Bank & Financial Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bank Name</div>
                                    <div className="text-sm font-black text-slate-900">{portfolio.personalDetails.bankDetails.bankName}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Branch</div>
                                    <div className="text-sm font-bold text-slate-700">{portfolio.personalDetails.bankDetails.branchName}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Number</div>
                                    <div className="text-sm font-black text-blue-800">{portfolio.personalDetails.bankDetails.accountNumber}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">IFSC Code</div>
                                    <div className="text-sm font-black text-slate-900">{portfolio.personalDetails.bankDetails.ifscCode}</div>
                                </div>
                            </div>
                        </div>

                        {portfolio.personalDetails.passportDetails && (
                            <div className="bg-blue-50/30 rounded-[32px] p-8 border border-blue-100/50">
                                <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-blue-600" /> Passport Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Passport Number</div>
                                        <div className="text-sm font-black text-slate-900">{portfolio.personalDetails.passportDetails.number}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Expiry Date</div>
                                        <div className="text-sm font-black text-slate-900">{portfolio.personalDetails.passportDetails.expiryDate}</div>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div className="space-y-8 pt-8 border-t border-slate-100">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Address</label>
                                <div className="text-sm font-medium text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed italic">
                                    {portfolio.personalDetails.currentAddress}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permanent Address</label>
                                <div className="text-sm font-medium text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed italic">
                                    {portfolio.personalDetails.permanentAddress}
                                </div>
                            </div>
                        </div>

                        <div className="bg-rose-50 rounded-[32px] p-8 border border-rose-100">
                            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Heart className="w-4 h-4" /> Emergency Contact Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-rose-300 uppercase tracking-widest">Contact Person</div>
                                    <div className="text-sm font-black text-slate-900">{portfolio.personalDetails.emergencyContact.name}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-rose-300 uppercase tracking-widest">Relation</div>
                                    <div className="text-sm font-bold text-slate-700 italic">{portfolio.personalDetails.emergencyContact.relation}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-rose-300 uppercase tracking-widest">Phone Number</div>
                                    <div className="text-sm font-black text-rose-600 underline underline-offset-4">{portfolio.personalDetails.emergencyContact.phone}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <Button
                                onClick={() => setIsPersonalOpen(false)}
                                className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs"
                            >
                                Close Records
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </Layout>
    );
};

export default StaffPortfolioDetail;
