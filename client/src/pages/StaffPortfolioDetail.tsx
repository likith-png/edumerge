import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    User, TrendingUp, GraduationCap, Calendar, FileText,
    CheckCircle, ArrowLeft, BookOpen, Trophy, Heart, Sparkles, Star, Lightbulb, Users, Award, Shield, Clock, AlertTriangle, Target,
    ExternalLink, X, Edit, Plus, Upload, Menu, IndianRupee, Activity, Download, Send
} from 'lucide-react';
import { getStaffPortfolio, updateStaffMember, updateStaffExperience, updateStaffEducation, updateStaffPersonalDetails, getPerformanceSummary } from '../services/staffPortfolioService';
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import * as researchService from '../services/researchService';
import type { Publication } from '../services/researchService';

const StaffPortfolioDetail: React.FC = () => {
    const { staffId } = useParams<{ staffId: string }>();
    const navigate = useNavigate();
    const portfolio = getStaffPortfolio(staffId || '');
    
    const [researchRecords, setResearchRecords] = useState<Publication[]>([]);
    const [isResearchLoading, setIsResearchLoading] = useState(false);

    useEffect(() => {
        const fetchResearch = async () => {
            if (!staffId) return;
            setIsResearchLoading(true);
            try {
                // Mapping Mock ID to DB ID: NH-0010 -> 1, NH-0015 -> 1 (HOD), etc.
                // In a real system, this would be a single coherent ID.
                const dbId = staffId === 'NH-0010' ? 1 : staffId === 'NH-0015' ? 2 : 1;
                const res = await researchService.getMyPublications(dbId);
                setResearchRecords(res.data);
            } catch (err) {
                console.error("Research sync failed:", err);
            } finally {
                setIsResearchLoading(false);
            }
        };
        fetchResearch();
    }, [staffId]);

    const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [editForm, setEditForm] = useState<any>(portfolio?.member || {});
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [selectedEdu, setSelectedEdu] = useState<any>(null);
    const [isEditingExperience, setIsEditingExperience] = useState(false);
    const [selectedExp, setSelectedExp] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
    const [isPersonalOpen, setIsPersonalOpen] = useState(false);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [personalForm, setPersonalForm] = useState<any>(portfolio?.personalDetails || {});
    const [experienceDetails, setExperienceDetails] = useState<any[]>(portfolio?.experienceDetails || []);
    const [educationDetails, setEducationDetails] = useState<any[]>(portfolio?.educationDetails || []);
    const [expForm, setExpForm] = useState<any>({});
    const [editEduForm, setEditEduForm] = useState<any>({});


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
        badges, kudos, highlights, probationData, salaryDetails, biometricData, monthlyLeave, yearlyLeave } = portfolio;

    if (!member.isOnboardingComplete) {
        return (
            <Layout
                title={member.name}
                description="Profile Initiation in Progress"
                icon={User}
                showBack
            >
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150" />
                        <Card className="relative bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] p-12 text-center max-w-lg">
                            <CardContent className="space-y-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl transform hover:rotate-6 transition-transform">
                                    <Sparkles className="w-12 h-12 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Badge className="bg-blue-100 text-blue-600 border-none uppercase tracking-widest text-[10px] font-black px-4 py-1">Phase: Initiation</Badge>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Complete Data to View Details</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        This staff member is newly onboarded. Please finalize the documentation process in Talent Acquisition to unlock the full professional portfolio.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 text-left">
                                    <div className="p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-xs font-bold text-slate-700 uppercase">Waitlisting</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Dept</p>
                                        <div className="flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-xs font-bold text-slate-700 uppercase">{member.department}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => navigate('/talent-acquisition')}
                                    className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:scale-[1.02]"
                                >
                                    Proceed to Talent Acquisition
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }

    const calculateTotalExperience = (from: string, to: string) => {
        if (!from || !to) return '';
        try {
            const [fDay, fMonth, fYear] = from.split('/').map(Number);
            const [tDay, tMonth, tYear] = to.split('/').map(Number);

            const startDate = new Date(fYear, fMonth - 1, fDay);
            const endDate = new Date(tYear, tMonth - 1, tDay);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '';
            if (endDate < startDate) return '';

            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();

            if (endDate.getDate() < startDate.getDate()) months--;
            if (months < 0) { years--; months += 12; }

            const yStr = years > 0 ? `${years} ${years === 1 ? 'Year' : 'Years'}` : '';
            const mStr = months > 0 ? `${months} ${months === 1 ? 'Month' : 'Months'}` : '';
            return [yStr, mStr].filter(Boolean).join(' ') || '0 Months';
        } catch (e) {
            return '';
        }
    };

    const handleSaveBasicDetails = () => {
        updateStaffMember(member.id, {
            name: editForm.name,
            designation: editForm.designation,
            department: editForm.department,
            email: editForm.email
        });
        setIsEditingBasic(false);
    };

    const handleSaveExperience = () => {
        let updated: any[] = [];
        if (selectedExp) {
            updated = experienceDetails.map(exp => exp === selectedExp ? expForm : exp);
        } else {
            updated = [...experienceDetails, expForm];
        }
        setExperienceDetails(updated);
        updateStaffExperience(member.id, updated);
        setIsEditingExperience(false);
    };

    const handleSaveEducation = () => {
        let updated: any[] = [];
        if (selectedEdu) {
            updated = educationDetails.map(edu => edu === selectedEdu ? editEduForm : edu);
        } else {
            updated = [...educationDetails, editEduForm];
        }
        setEducationDetails(updated);
        updateStaffEducation(member.id, updated);
        setIsEditingEducation(false);
    };

    const handleSavePersonal = () => {
        updateStaffPersonalDetails(member.id, personalForm);
        setIsEditingPersonal(false);
        // Refresh local portfolio data if needed, or rely on state
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
            <div className="flex justify-end items-center mb-6 gap-3">
                <div className="inline-flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('monthly')}
                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'monthly'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setViewMode('yearly')}
                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'yearly'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
                <Button
                    onClick={() => setIsPersonalOpen(true)}
                    variant="outline"
                    className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider text-xs px-6 h-11"
                >
                    <User className="w-4 h-4 text-blue-600" /> Personal Identity
                </Button>
                <Button
                    onClick={() => setIsEditingBasic(true)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider text-xs px-6 h-11"
                >
                    <Edit className="w-4 h-4" /> Refine Profile
                </Button>
            </div>


            {/* Header Profile Card */}
            <Card className="mb-8 overflow-hidden bg-white border border-slate-200 shadow-sm rounded-2xl">
                <CardContent className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                        <div className={`w-32 h-32 md:w-40 md:h-40 ${['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-violet-600', 'bg-teal-600', 'bg-sky-600'][member.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 8]} rounded-2xl flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-lg`}>
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider mb-4">
                                Institutional Faculty Record
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 leading-tight">{member.name}</h2>
                            <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mb-6 flex items-center justify-center md:justify-start gap-2">
                                <Shield className="w-4 h-4 text-slate-400" /> {member.designation}
                            </p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-1.5 font-bold uppercase tracking-wider text-[10px] rounded-lg">{member.department}</Badge>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-1.5 font-bold uppercase tracking-wider text-[10px] rounded-lg">ID: {member.id}</Badge>
                                <Badge className={`px-4 py-1.5 font-bold uppercase tracking-wider text-[10px] rounded-lg border-none ${member.status === 'Active' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'}`}>
                                    {member.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Joined</p>
                                    <p className="font-bold text-slate-700 text-sm">{new Date(member.joiningDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                    <p className="font-bold text-slate-700 text-sm lowercase">{member.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reporting Manager</p>
                                    <p className="font-bold text-slate-700 text-sm">{member.reportingManager}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Qualification</p>
                                    <p className="font-bold text-slate-700 text-sm uppercase">{member.qualification}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                                <div className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-bold text-slate-600">{badges.length} Badges</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm">
                                    <Heart className="w-4 h-4 text-rose-500" />
                                    <span className="text-xs font-bold text-slate-600">{kudos.length} Kudos</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold text-slate-600">{getPerformanceSummary(member.id).yearsOfService}y Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Educational Qualification Details Table */}
            <Card className="mb-6 overflow-hidden bg-white border border-slate-200 shadow-sm rounded-xl">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <Menu className="w-4 h-4 text-blue-600" />
                        Educational Qualification Details
                    </CardTitle>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white hover:bg-slate-50 text-blue-600 border-slate-200 font-bold text-[10px] uppercase tracking-wider gap-2 rounded-lg h-9 px-4"
                        onClick={() => { setSelectedEdu(null); setEditEduForm({}); setIsEditingEducation(true); }}
                    >
                        <Plus className="w-4 h-4" /> Add Detail
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Education</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institute</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Board/ Univ</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">% / CGPA</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Year</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">File</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {educationDetails.map((edu: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">{edu.level}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{edu.course}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{edu.specialization}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-[150px] truncate">{edu.institute}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-[120px] truncate">{edu.board}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{edu.courseType}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{edu.class}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800 text-center">{edu.percentage}%</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800 text-center">{edu.passingYear}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md hover:no-underline">View</Button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => { setSelectedEdu(edu); setEditEduForm(edu); setIsEditingEducation(true); }} className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => {
                                                    const updated = educationDetails.filter(e => e !== edu);
                                                    setEducationDetails(updated);
                                                    updateStaffEducation(member.id, updated);
                                                }} className="w-8 h-8 rounded-lg bg-white border border-rose-100 shadow-sm flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors">
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
            <Card className="mb-6 overflow-hidden bg-white border border-slate-200 shadow-sm rounded-xl text-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <Menu className="w-4 h-4 text-blue-600" />
                        Experience Details
                    </CardTitle>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white hover:bg-slate-50 text-blue-600 border-slate-200 font-bold text-[10px] uppercase tracking-wider gap-2 rounded-lg h-9 px-4"
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
                    <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2 px-6">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                            NOTE: Dates must be entered manually in dd/mm/yyyy format
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Org. Name</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nature of Job</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Job Type</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">From</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">To</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Exp.</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Last Drawn</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Doc.</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experienceDetails.map((exp: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">{exp.orgName}</td>
                                        <td className="px-6 py-4 text-[10px] text-slate-600 uppercase font-bold tracking-wider">{exp.designation}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">{exp.natureOfJob}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-semibold text-center">{exp.jobType}</td>
                                        <td className="px-6 py-4 text-xs text-slate-600 font-bold text-center">{exp.fromDate}</td>
                                        <td className="px-6 py-4 text-xs text-slate-600 font-bold text-center">{exp.toDate}</td>
                                        <td className="px-6 py-4 text-xs text-blue-600 font-bold text-center">{exp.totalExp}</td>
                                        <td className="px-6 py-4 text-xs text-emerald-600 font-bold text-right">{exp.lastDrawn}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md hover:no-underline">View</Button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => { 
                                                        setSelectedExp(exp); 
                                                        setExpForm(exp);
                                                        setIsEditingExperience(true); 
                                                    }} 
                                                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        const updated = experienceDetails.filter(e => e !== exp);
                                                        setExperienceDetails(updated);
                                                        updateStaffExperience(member.id, updated);
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

            {/* Salary & Benefits */}
            {salaryDetails && (
                <Card className="mb-8 overflow-hidden bg-white border border-slate-200 shadow-sm rounded-xl">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <IndianRupee className="w-5 h-5 text-emerald-600" /> 
                            Compensation Blueprint
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-2 lg:grid-cols-6 border-b border-slate-100">
                            {[
                                { l: 'Basic Pay', v: salaryDetails.basic },
                                { l: 'DA', v: salaryDetails.da },
                                { l: 'HRA', v: salaryDetails.hra },
                                { l: 'CCA', v: salaryDetails.cca },
                                { l: 'AGP (Ind)', v: salaryDetails.agp },
                                { l: 'Variable', v: salaryDetails.variablePay }
                            ].map((s, i) => (
                                <div key={i} className="p-8 border-r border-slate-100 last:border-r-0">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{s.l}</p>
                                    <p className="text-xl font-bold text-slate-800">₹{s.v.toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-slate-900 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500 rounded-lg text-slate-900 shadow-lg">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Aggregate Monthly Gross</p>
                                    <p className="text-3xl font-bold text-white tracking-tight">₹{salaryDetails.gross.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-1.5 font-bold uppercase tracking-wider text-[10px] rounded-lg">Verified Record</Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Attendance & Compliance Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* 1. Biometric Authentication Sync */}
                <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <Activity className="h-5 w-5 text-blue-600" />
                            Biometric Precision Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {biometricData ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-900 rounded-xl shadow-md">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Institutional Presence</p>
                                        <p className="text-2xl font-bold text-white tracking-tight">{biometricData.status.filter((s: string) => s === 'P').length} Verified Days</p>
                                    </div>
                                    <div className="p-5 bg-rose-50 rounded-xl border border-rose-100">
                                        <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-2">Temporal Variance</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{biometricData.in_times.filter((t: string) => t && t > '10:00').length} Cycles</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Menu className="w-3 h-3" /> Micro-Attendance Lattice (Monthly)
                                    </p>
                                    <div className="grid grid-cols-7 gap-2">
                                        {Array.from({ length: 31 }, (_, i) => {
                                            const status = biometricData.status[i];
                                            return (
                                                <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${
                                                    status === 'P' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                    status === 'A' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                                    'bg-slate-50 border-slate-200 text-slate-400'
                                                }`}>
                                                    <span className="text-[9px] font-bold">{i + 1}</span>
                                                    <span className="text-[7px] font-bold uppercase">{status || '-'}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm italic">
                                Authentication matrices pending sync.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Institutional Leave Matrix */}
                <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-teal-600" />
                            Leave Capital Reserve
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {yearlyLeave ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { l: 'EL', b: yearlyLeave.BalanceEL, t: yearlyLeave.TakenEL, total: yearlyLeave.TotalEL, c: 'blue' },
                                        { l: 'CL', b: yearlyLeave.BalanceCL, t: yearlyLeave.TakenCL, total: yearlyLeave.TotalCL, c: 'teal' },
                                        { l: 'SL', b: yearlyLeave.BalanceSL, t: yearlyLeave.TakenSL, total: yearlyLeave.TotalSL, c: 'rose' }
                                    ].map((lv, i) => (
                                        <div key={i} className={`p-4 bg-slate-50 rounded-xl border border-slate-100`}>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{lv.l}</p>
                                            <div className="text-2xl font-bold text-slate-900 tracking-tight">{lv.b} <span className="text-[10px] text-slate-400 lowercase font-normal">rem</span></div>
                                            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                                                <div className={`h-full bg-slate-900 rounded-full`} style={{ width: `${(Number(lv.t) / Number(lv.total)) * 100}%` }} />
                                            </div>
                                            <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-tight">{lv.t}/{lv.total} Consumed</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-900 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Temporal Audit (Current Month)</p>
                                        <Badge className="bg-emerald-500 text-white text-[8px] border-none px-2 py-0.5 font-bold uppercase tracking-wider">Live</Badge>
                                    </div>
                                    {monthlyLeave ? (
                                        <div className="flex flex-wrap gap-6">
                                            {[
                                                { k: 'EL', v: monthlyLeave.EL, c: 'white' },
                                                { k: 'CL', v: monthlyLeave.CL, c: 'white' },
                                                { k: 'LOP', v: monthlyLeave.LOP, c: 'rose-400' }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.k}</span>
                                                    <span className={`text-xl font-bold ${stat.c === 'white' ? 'text-white' : 'text-rose-400'}`}>{stat.v}</span>
                                                </div>
                                            ))}
                                            {monthlyLeave['HR Comments'] && (
                                                <div className="w-full mt-4 pt-4 border-t border-white/10 text-[10px] text-slate-400 italic">
                                                    HR: {monthlyLeave['HR Comments']}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">Monthly audit pulse not detected.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm italic">
                                Institutional leave capital pending initialization.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-4">
                {/* Left Column - Core Professional Metrics & History */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* 1. Performance Evolution */}
                            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                                <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                        <TrendingUp className="h-5 w-5 text-purple-600" />
                                        Performance History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    {performanceHistory.map((perf, idx) => (
                                        <div key={idx} className="flex items-center gap-6 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-all">
                                            <div className="text-center min-w-[70px]">
                                                <div className="text-2xl font-bold text-slate-900">{perf.rating}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{perf.year}</div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="secondary" className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-lg border-none ${
                                                        perf.performanceBand === 'Outstanding' ? 'bg-emerald-100 text-emerald-700' :
                                                        perf.performanceBand === 'Excellent' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {perf.performanceBand}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-slate-500 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-white">
                                                        +{perf.increment}% Revision
                                                    </Badge>
                                                </div>
                                                <p className="text-xs font-medium text-slate-500 italic">{perf.remarks}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* 2. Institutional Career Timeline */}
                            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                                <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        Career Milestones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-10">
                                    <div className="relative pl-8 border-l-2 border-slate-100 space-y-10">
                                        {careerTimeline.map((milestone, idx) => (
                                            <div key={idx} className="relative">
                                                <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-md ${
                                                    milestone.type === 'Joining' ? 'bg-blue-600' :
                                                    milestone.type === 'Promotion' ? 'bg-purple-600' :
                                                    milestone.type === 'Award' ? 'bg-amber-500' :
                                                    milestone.type === 'Publication' ? 'bg-emerald-600' :
                                                    'bg-slate-400'
                                                }`} />
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(milestone.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[8px] font-bold uppercase tracking-wider border-none px-2">{calculateServiceDuration(milestone.date)}</Badge>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{milestone.title}</h4>
                                                    <p className="text-xs font-medium text-slate-500 leading-relaxed">{milestone.description}</p>
                                                    
                                                    {milestone.type === 'Increment' && milestone.beforeIncrementSalary && milestone.afterIncrementSalary && (
                                                        <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-100 inline-flex flex-col gap-3">
                                                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Salary Revision</p>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-center">
                                                                    <div className="text-[8px] font-bold text-slate-300 uppercase mb-0.5">Prior</div>
                                                                    <div className="text-sm font-bold text-slate-400">{getDisplaySalary(milestone.beforeIncrementSalary)}</div>
                                                                </div>
                                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                                <div className="text-center">
                                                                    <div className="text-[8px] font-bold text-emerald-500 uppercase mb-0.5">Updated</div>
                                                                    <div className="text-sm font-bold text-slate-900">{getDisplaySalary(milestone.afterIncrementSalary)}</div>
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
                        </div>
                    </div>
                </div>

                {/* Learning & Scholarly Dominance Section (Inside Left Column) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* 1. Training & Certifications */}
                <Card className="lg:col-span-1 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-emerald-600" />
                            Competency Matrix
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Skill Hours</p>
                                <p className="text-2xl font-bold text-slate-900">{trainingJourney.totalHours}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Courses</p>
                                <p className="text-2xl font-bold text-slate-900">{trainingJourney.coursesCompleted}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Menu className="w-3 h-3 text-emerald-500" /> Recent Academic Drill
                            </p>
                            {trainingJourney.recentTrainings.map((training, idx) => (
                                <div key={idx} className="p-4 bg-white rounded-lg border border-slate-100 flex items-center gap-4 hover:border-slate-300 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wide">{training.title}</div>
                                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1">{training.date} • {training.duration}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Research & Scholarly Output */}
                <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            Research Output
                        </CardTitle>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white hover:bg-slate-50 text-indigo-600 border-slate-200 font-bold text-[10px] uppercase tracking-wider gap-2 rounded-lg h-10 px-6 shadow-sm"
                            onClick={() => navigate('/research-publication')}
                        >
                            <ExternalLink className="w-4 h-4" /> Global Repository
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8">
                        {isResearchLoading ? (
                            <div className="py-12 text-center">
                                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Syncing records...</p>
                            </div>
                        ) : researchRecords.length > 0 ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-6 bg-indigo-600 rounded-xl text-white shadow-md">
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-2">Manuscripts</p>
                                        <h4 className="text-3xl font-bold">{researchRecords.length}</h4>
                                        <Badge className="bg-white/20 text-white border-none text-[8px] font-bold mt-3 uppercase tracking-wider">SCOPUS</Badge>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Citations</p>
                                        <h4 className="text-3xl font-bold text-slate-900">{researchRecords.reduce((acc, r) => acc + (r.citations || 0), 0)}</h4>
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase mt-3">Impact: {researchRecords.reduce((acc, r) => acc + (r.impact_factor || 0), 0).toFixed(2)}</p>
                                    </div>
                                    <div className="p-6 bg-slate-900 rounded-xl text-white">
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-2">Value</p>
                                        <h4 className="text-3xl font-bold text-emerald-400">
                                            {researchRecords.reduce((acc, r) => acc + (r.status === 'Approved' ? (r.type === 'Journal' ? 25 : r.type === 'Book' ? 50 : 15) : 0), 0)}
                                        </h4>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-bold mt-3 uppercase tracking-wider">Approved</Badge>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Menu className="w-3 h-3 text-indigo-500" /> Key Artefacts
                                    </p>
                                    {researchRecords.slice(0, 3).map((pub, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-all flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{pub.type}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{pub.date}</span>
                                                </div>
                                                <h6 className="font-bold text-slate-800 text-xs italic">{pub.title}</h6>
                                            </div>
                                            <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border-none shadow-sm ${
                                                pub.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                            }`}>
                                                {pub.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Research synchronizing...</p>
                                <Button variant="link" onClick={() => navigate('/research-publication')} className="text-indigo-600 font-bold text-[10px] uppercase mt-2 tracking-wider">Global Repository</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recognition Wall */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <Card className="bg-slate-900 border-none shadow-lg rounded-xl overflow-hidden relative">
                        <CardHeader className="p-8 border-b border-white/5">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-3 text-slate-300">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                Badges Received
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-wrap gap-4">
                                {badges.map((badge) => (
                                    <div key={badge.id} className="relative group">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 ${badge.level === 'Gold' ? 'bg-amber-500/20 text-amber-400' :
                                            badge.level === 'Silver' ? 'bg-slate-400/20 text-slate-300' :
                                                'bg-amber-800/20 text-amber-900'
                                            }`}>
                                            {badge.icon === 'Lightbulb' ? <Lightbulb className="w-6 h-6" /> :
                                                badge.icon === 'Users' ? <Users className="w-6 h-6" /> :
                                                    <Heart className="w-6 h-6" />}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 text-white border border-slate-700 flex items-center justify-center text-[8px] font-bold">
                                            {badge.level[0]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                <Heart className="w-4 h-4 text-rose-500" />
                                Wall of Kudos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            {kudos.map((k) => (
                                <div key={k.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 relative">
                                    <div className="absolute top-4 right-4 text-[9px] font-bold text-slate-400 uppercase">{k.date}</div>
                                    <p className="text-sm font-medium text-slate-700 italic pr-12 mb-2">"{k.message}"</p>
                                    <Badge variant="secondary" className="bg-rose-50 text-rose-600 border-none text-[8px] h-4 px-2 uppercase font-bold tracking-wider">{k.type}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                </div>

                {/* Right Column - Stats, Compliance & Special Context */}
                <div className="space-y-10">
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
                                <div className="text-xl font-black text-blue-600 leading-none mb-1">{academicContributions.studentsImpacted}</div>
                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Students Taught</div>
                            </div>
                            <div className="p-4 bg-white/80 border border-white rounded-2xl shadow-sm">
                                <div className="text-xl font-black text-emerald-600 leading-none mb-1">{academicContributions.averagePassPercentage}%</div>
                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Avg Pass Rate</div>
                            </div>
                            <div className="p-4 bg-white/80 border border-white rounded-2xl shadow-sm">
                                <div className="text-xl font-black text-purple-600 leading-none mb-1">{academicContributions.averageFeedbackRating}/5</div>
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

                    {/* Research Output Summary */}
                    <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-3">
                                <FileText className="w-4 h-4 text-amber-500" />
                                Research Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Publications</span>
                                <span className="font-bold text-lg text-slate-900">{researchOutput.publications}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conferences</span>
                                <span className="font-bold text-lg text-slate-900">{researchOutput.conferences}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patents</span>
                                <span className="font-bold text-lg text-slate-900">{researchOutput.patents}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Citations</span>
                                <span className="font-bold text-lg text-slate-900">{researchOutput.citations}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Career Highlights */}
                    <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-3">
                                <Star className="w-4 h-4 text-blue-600" />
                                Career Highlights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {highlights.map((h) => (
                                <div
                                    key={h.id}
                                    className="flex gap-4 p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group"
                                    onClick={() => setSelectedHighlight(h)}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${h.category === 'Award' ? 'bg-amber-100 text-amber-600' :
                                        h.category === 'Research' ? 'bg-blue-100 text-blue-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                        {h.category === 'Award' ? <Award className="w-5 h-5" /> :
                                            h.category === 'Research' ? <Target className="w-5 h-5" /> :
                                                <BookOpen className="w-5 h-5" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                            {h.title}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h.category} • {h.date}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Highlight Detail Modal */}
                    <Dialog open={!!selectedHighlight} onOpenChange={() => setSelectedHighlight(null)}>
                        <DialogContent className="max-w-xl p-0 overflow-hidden border border-slate-200 rounded-xl shadow-2xl">
                            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between border-b border-slate-800">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{selectedHighlight?.category} Recognition</div>
                                    <DialogTitle className="text-lg font-bold text-white uppercase tracking-wider">{selectedHighlight?.title}</DialogTitle>
                                </div>
                                <button
                                    onClick={() => setSelectedHighlight(null)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 bg-white">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Received</div>
                                        <div className="text-sm font-bold text-slate-900">{selectedHighlight?.date}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Impact Metric</div>
                                        <div className="text-sm font-bold text-blue-600">{selectedHighlight?.impact}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overview</div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                                        {selectedHighlight?.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags & Competencies</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedHighlight?.tags?.map((tag: string, i: number) => (
                                            <Badge key={i} className="bg-slate-100 text-slate-600 border-none px-4 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <Button
                                        onClick={() => setSelectedHighlight(null)}
                                        className="bg-slate-900 text-white hover:bg-black rounded-lg px-8 h-11 font-bold uppercase tracking-wider text-[10px] transition-colors"
                                    >
                                        Close Details
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Probation Insights */}
                    {probationData && (
                        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                        Probation Insights
                                    </div>
                                    <Badge className="bg-blue-600 text-white border-none uppercase text-[9px] font-bold tracking-wider rounded-lg px-3 py-1">
                                        {probationData.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-slate-900">{probationData.onTimeTasks}</div>
                                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1">On-Time</div>
                                        </div>
                                        <Clock className="w-5 h-5 text-blue-200" />
                                    </div>
                                    <div className="p-5 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-rose-600">{probationData.delayedTasks}</div>
                                            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mt-1">Delayed</div>
                                        </div>
                                        <AlertTriangle className="w-5 h-5 text-rose-200" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</h4>
                                        <span className="text-sm font-bold text-blue-600">{probationData.completionRate}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${probationData.completionRate}%` }} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review History</h4>
                                    <div className="space-y-4">
                                        {probationData.history.map((event: any, i: number) => (
                                            <div key={i} className="flex gap-4 relative">
                                                {i < probationData.history.length - 1 && (
                                                    <div className="absolute top-0 left-2 w-0.5 h-full bg-slate-100" />
                                                )}
                                                <div className={`w-4 h-4 rounded-full z-10 flex items-center justify-center border-2 border-white shadow-sm shrink-0 mt-0.5 ${event.status.includes('On-time') ? 'bg-emerald-500' : 'bg-rose-500'
                                                    }`} />
                                                <div className="space-y-1 pb-4">
                                                    <div className="text-xs font-bold text-slate-900 uppercase">{event.event}</div>
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{event.date} • {event.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-100 grid grid-cols-1 gap-2">
                                    {probationData.kpis.map((kpi: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-xs font-bold text-slate-700">{kpi.title}</span>
                                            <Badge className="bg-emerald-100 text-emerald-700 text-[8px] h-5 border-none uppercase font-bold rounded-lg px-3">{kpi.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {/* Compliance */}
                    <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                Compliance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance</span>
                                <span className="font-bold text-lg text-emerald-600">{complianceRecords.currentAttendance}%</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Leave Balance</span>
                                <span className="font-bold text-lg text-slate-900">{complianceRecords.leaveBalance} days</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Disciplinary</span>
                                <span className="font-bold text-lg text-emerald-600">{complianceRecords.disciplinaryRecords}</span>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Exit Info (if applicable) */}
                    {exitInfo && (
                        <Card className="bg-white border border-rose-100 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="p-8 border-b border-rose-100 bg-rose-50/50">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-3">
                                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                                    Exit Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <div className="p-4 bg-white rounded-xl border border-rose-100 flex items-center justify-between">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resignation Date</div>
                                    <div className="font-bold text-sm text-slate-800">{portfolio?.exitInfo?.resignationDate}</div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-rose-100 flex items-center justify-between">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reason</div>
                                    <div className="font-bold text-sm text-slate-800">{portfolio?.exitInfo?.reason}</div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-rose-100 flex items-center justify-between">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NOC Status</div>
                                    <Badge variant="secondary" className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] uppercase font-bold tracking-wider rounded-lg px-3 py-1">
                                        {portfolio?.exitInfo?.nocStatus}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            
            {/* Action Buttons Group */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200">
                <Button 
                    onClick={() => navigate('/staff-portfolio')} 
                    variant="outline" 
                    className="gap-3 h-12 px-8 rounded-xl border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs shadow-sm hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Staff List
                </Button>
                
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline"
                        className="h-12 px-8 rounded-xl border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" /> Download Dossier
                    </Button>
                    <Button 
                        className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-wider text-xs shadow-md"
                    >
                        <Send className="w-4 h-4 mr-2" /> Share Profile
                    </Button>
                </div>
            </div>

            {/* Basic Info Edit Modal */}
            <Dialog open={isEditingBasic} onOpenChange={setIsEditingBasic}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border border-slate-200 rounded-xl shadow-2xl">
                    <div className="bg-slate-900 px-8 py-6 flex items-center justify-between border-b border-slate-800">
                        <DialogTitle className="text-lg font-bold text-white uppercase tracking-wider">Edit Basic Information</DialogTitle>
                        <button onClick={() => setIsEditingBasic(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-8 bg-white space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" value={editForm.name} 
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</label>
                                <input 
                                    type="text" value={editForm.designation} 
                                    onChange={(e) => setEditForm({...editForm, designation: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                                <input 
                                    type="text" value={editForm.department} 
                                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input 
                                    type="email" value={editForm.email} 
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-semibold"
                                />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsEditingBasic(false)} className="rounded-lg px-6 h-11 font-bold uppercase text-[10px] border-slate-200 text-slate-600">Cancel</Button>
                            <Button onClick={handleSaveBasicDetails} className="bg-slate-900 text-white rounded-lg px-8 h-11 font-bold uppercase text-[10px] hover:bg-black transition-colors">Save Changes</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Education Edit Modal */}
            <Dialog open={isEditingEducation} onOpenChange={setIsEditingEducation}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border border-slate-200 rounded-xl shadow-2xl">
                    <div className="bg-slate-900 px-8 py-6 flex items-center justify-between border-b border-slate-800">
                        <DialogTitle className="text-lg font-bold text-white uppercase tracking-wider">Update Education Detail</DialogTitle>
                        <button onClick={() => setIsEditingEducation(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-8 bg-white space-y-6 overflow-y-auto max-h-[80vh]">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Education</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.level || ''} onChange={(e) => setEditEduForm({...editEduForm, level: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.course || ''} onChange={(e) => setEditEduForm({...editEduForm, course: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.specialization || ''} onChange={(e) => setEditEduForm({...editEduForm, specialization: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Institute</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.institute || ''} onChange={(e) => setEditEduForm({...editEduForm, institute: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Board/University</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.board || ''} onChange={(e) => setEditEduForm({...editEduForm, board: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Type</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.courseType || ''} onChange={(e) => setEditEduForm({...editEduForm, courseType: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.class || ''} onChange={(e) => setEditEduForm({...editEduForm, class: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Percentage</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.percentage || ''} onChange={(e) => setEditEduForm({...editEduForm, percentage: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passing Year</label><input type="text" className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold" value={editEduForm.passingYear || ''} onChange={(e) => setEditEduForm({...editEduForm, passingYear: e.target.value})} /></div>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors flex-1">
                                <Upload className="w-5 h-5 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Update Educational Proof</span>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsEditingEducation(false)} className="rounded-lg px-6 h-11 font-bold uppercase text-[10px] border-slate-200 text-slate-600">Cancel</Button>
                                <Button onClick={handleSaveEducation} className="bg-blue-600 text-white rounded-lg px-8 h-11 font-bold uppercase text-[10px] hover:bg-blue-700 transition-colors shadow-sm">Update Records</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Experience Edit Modal */}
            <Dialog open={isEditingExperience} onOpenChange={setIsEditingExperience}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden border border-slate-200 rounded-xl shadow-2xl">
                    <div className="bg-slate-900 px-8 py-6 flex items-center justify-between border-b border-slate-800">
                        <DialogTitle className="text-lg font-bold text-white uppercase tracking-wider">Update Experience Detail</DialogTitle>
                        <button onClick={() => setIsEditingExperience(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-8 bg-white space-y-6 overflow-y-auto max-h-[80vh]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization Name</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" 
                                    value={expForm.orgName || ''} 
                                    onChange={(e) => handleExperienceChange('orgName', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" 
                                    value={expForm.designation || ''} 
                                    onChange={(e) => handleExperienceChange('designation', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nature of Job</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" 
                                    value={expForm.natureOfJob || ''} 
                                    onChange={(e) => handleExperienceChange('natureOfJob', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Type</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" 
                                    value={expForm.jobType || ''} 
                                    onChange={(e) => handleExperienceChange('jobType', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From Date</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" 
                                    value={expForm.fromDate || ''} 
                                    onChange={(e) => handleExperienceChange('fromDate', e.target.value)}
                                    placeholder="dd/mm/yyyy"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To Date</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" 
                                    value={expForm.toDate || ''} 
                                    onChange={(e) => handleExperienceChange('toDate', e.target.value)}
                                    placeholder="dd/mm/yyyy"
                                />
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors flex-1">
                                <Upload className="w-5 h-5 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Service Certificate</span>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsEditingExperience(false)} className="rounded-lg px-6 h-11 font-bold uppercase text-[10px] border-slate-200 text-slate-600">Cancel</Button>
                                <Button onClick={handleSaveExperience} className="bg-slate-900 text-white rounded-lg px-8 h-11 font-bold uppercase text-[10px] hover:bg-black transition-colors shadow-sm">Update Experience</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Personal Details Modal */}
            <Dialog open={isPersonalOpen} onOpenChange={setIsPersonalOpen}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border border-slate-200 rounded-xl shadow-2xl">
                    <div className="bg-slate-900 px-10 py-8 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-white uppercase tracking-wider">Personal Portfolio</DialogTitle>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Verified Identity Records</p>
                            </div>
                        </div>
                        <button onClick={() => setIsPersonalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-10 bg-white space-y-10 max-h-[70vh] overflow-y-auto">
                        {!isEditingPersonal && (
                            <div className="flex justify-end">
                                <Button 
                                    onClick={() => {
                                        setPersonalForm(portfolio?.personalDetails);
                                        setIsEditingPersonal(true);
                                    }}
                                    variant="outline"
                                    className="rounded-lg border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px] h-9 px-4 flex items-center gap-2"
                                >
                                    <Edit className="w-3.5 h-3.5" /> Edit Record
                                </Button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Date of Birth', key: 'dob', type: 'date' },
                                { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                                { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
                                { label: 'Nationality', key: 'nationality', type: 'text' },
                                { label: 'Religion', key: 'religion', type: 'text' },
                                { label: 'Marital Status', key: 'maritalStatus', type: 'select', options: ['Married', 'Single', 'Divorced', 'Widowed'] },
                                { label: "Father's Name", key: 'fatherName', type: 'text' },
                                { label: "Mother's Name", key: 'motherName', type: 'text' },
                            ].map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                                    {isEditingPersonal ? (
                                        field.type === 'select' ? (
                                            <select 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 outline-none"
                                                value={personalForm[field.key]}
                                                onChange={(e) => setPersonalForm({ ...personalForm, [field.key]: e.target.value })}
                                            >
                                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <Input 
                                                type={field.type}
                                                className="bg-slate-50 border-slate-200 rounded-lg h-11 font-semibold"
                                                value={personalForm[field.key]}
                                                onChange={(e) => setPersonalForm({ ...personalForm, [field.key]: e.target.value })}
                                            />
                                        )
                                    ) : (
                                        <div className="text-sm font-semibold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100">{(portfolio?.personalDetails as any)[field.key]}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                            {[
                                { label: 'Aadhar Number', key: 'aadharNumber', icon: Shield },
                                { label: 'PAN Number', key: 'panNumber', icon: Shield },
                                { label: 'PF Number', key: 'pfNumber', icon: Shield },
                                { label: 'ESI Number', key: 'esiNumber', icon: Shield },
                            ].map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <field.icon className="w-3 h-3" /> {field.label}
                                    </label>
                                    {isEditingPersonal ? (
                                        <Input 
                                            className="bg-blue-50/30 border-blue-100/50 rounded-lg h-11 font-semibold text-blue-800"
                                            value={personalForm[field.key]}
                                            onChange={(e) => setPersonalForm({ ...personalForm, [field.key]: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-sm font-bold text-blue-800 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">{(portfolio?.personalDetails as any)[field.key]}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-3">
                                <Menu className="w-4 h-4 text-slate-400" /> Bank & Financial Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Bank Name', key: 'bankName' },
                                    { label: 'Branch', key: 'branchName' },
                                    { label: 'Account No', key: 'accountNumber', color: 'text-blue-700' },
                                    { label: 'IFSC Code', key: 'ifscCode' },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-1">
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</div>
                                        {isEditingPersonal ? (
                                            <Input 
                                                className={`bg-white border-slate-200 rounded-lg h-9 text-xs font-semibold ${field.color || 'text-slate-900'}`}
                                                value={personalForm.bankDetails[field.key]}
                                                onChange={(e) => setPersonalForm({ ...personalForm, bankDetails: { ...personalForm.bankDetails, [field.key]: e.target.value } })}
                                            />
                                        ) : (
                                            <div className={`text-sm font-bold ${field.color || 'text-slate-900'}`}>{(portfolio?.personalDetails?.bankDetails as any)[field.key]}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {portfolio?.personalDetails.passportDetails && (
                            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-blue-400" /> Passport Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Passport Number</div>
                                        {isEditingPersonal ? (
                                            <Input 
                                                className="bg-slate-800 border-slate-700 text-white rounded-lg h-9 text-xs font-semibold"
                                                value={personalForm.passportDetails?.number}
                                                onChange={(e) => setPersonalForm({ ...personalForm, passportDetails: { ...personalForm.passportDetails, number: e.target.value } })}
                                            />
                                        ) : (
                                            <div className="text-sm font-bold text-white tracking-widest">{portfolio?.personalDetails?.passportDetails?.number}</div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date</div>
                                        {isEditingPersonal ? (
                                            <Input 
                                                type="date"
                                                className="bg-slate-800 border-slate-700 text-white rounded-lg h-9 text-xs font-semibold"
                                                value={personalForm.passportDetails?.expiryDate}
                                                onChange={(e) => setPersonalForm({ ...personalForm, passportDetails: { ...personalForm.passportDetails, expiryDate: e.target.value } })}
                                            />
                                        ) : (
                                            <div className="text-sm font-bold text-white">{portfolio?.personalDetails?.passportDetails?.expiryDate}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8 pt-8 border-t border-slate-100">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Address</label>
                                {isEditingPersonal ? (
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm font-medium italic min-h-[100px] outline-none focus:ring-2 focus:ring-blue-600/10"
                                        value={personalForm.currentAddress}
                                        onChange={(e) => setPersonalForm({ ...personalForm, currentAddress: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-sm font-medium text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100 leading-relaxed italic">
                                        {portfolio?.personalDetails.currentAddress}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permanent Address</label>
                                {isEditingPersonal ? (
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm font-medium italic min-h-[100px] outline-none focus:ring-2 focus:ring-blue-600/10"
                                        value={personalForm.permanentAddress}
                                        onChange={(e) => setPersonalForm({ ...personalForm, permanentAddress: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-sm font-medium text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100 leading-relaxed italic">
                                        {portfolio?.personalDetails.permanentAddress}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-rose-50 rounded-2xl p-8 border border-rose-100">
                            <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-6 flex items-center gap-3">
                                <Heart className="w-4 h-4" /> Emergency Contact
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Contact Person', key: 'name' },
                                    { label: 'Relation', key: 'relation', isItalic: true },
                                    { label: 'Phone Number', key: 'phone', color: 'text-rose-600' },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-1">
                                        <div className="text-[9px] font-bold text-rose-300 uppercase tracking-wider">{field.label}</div>
                                        {isEditingPersonal ? (
                                            <Input 
                                                className={`bg-white border-rose-100 rounded-lg h-9 text-xs font-semibold ${field.color || 'text-slate-900'}`}
                                                value={personalForm.emergencyContact[field.key]}
                                                onChange={(e) => setPersonalForm({ ...personalForm, emergencyContact: { ...personalForm.emergencyContact, [field.key]: e.target.value } })}
                                            />
                                        ) : (
                                            <div className={`text-sm font-bold ${field.color || 'text-slate-900'} ${field.isItalic ? 'italic' : ''}`}>{(portfolio?.personalDetails?.emergencyContact as any)[field.key]}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            {isEditingPersonal ? (
                                <>
                                    <Button
                                        onClick={() => setIsEditingPersonal(false)}
                                        variant="ghost"
                                        className="rounded-lg px-8 h-12 font-bold uppercase tracking-wider text-[10px] text-slate-500 hover:bg-slate-100"
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        onClick={handleSavePersonal}
                                        className="bg-slate-900 text-white rounded-lg px-10 h-12 font-bold uppercase tracking-wider text-[10px] hover:bg-black transition-colors"
                                    >
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setIsPersonalOpen(false)}
                                    className="bg-slate-900 text-white rounded-lg px-10 h-12 font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors"
                                >
                                    Close Portfolio
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </Layout>
    );
};

export default StaffPortfolioDetail;
