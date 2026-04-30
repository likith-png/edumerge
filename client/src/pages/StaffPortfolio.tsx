import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
    Users, Search, TrendingUp, TrendingDown, Minus, 
    CheckCircle, Trophy, Clock, Target, Plus,
    Building2, Mail, Phone, ChevronRight, UserCircle2
} from 'lucide-react';
import { getAllStaff, getPerformanceSummary, getDepartments, searchStaff } from '../services/staffPortfolioService';
import { usePersona } from '../contexts/PersonaContext';

const StaffPortfolio: React.FC = () => {
    const navigate = useNavigate();
    const { role, user } = usePersona();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');

    const employeeStaffId = 'NH-0010';
    const allStaff = getAllStaff();
    const departments = ['All', ...getDepartments()];

    const filteredStaff = searchQuery
        ? searchStaff(searchQuery)
        : selectedDept === 'All'
            ? allStaff
            : allStaff.filter(s => s.department === selectedDept);

    return (
        <Layout
            title={role === 'EMPLOYEE' ? "My Professional Portfolio" : "Staff Portfolio"}
            description={role === 'EMPLOYEE' ? "Your complete career journey and achievements" : "Complete staff journey tracking and directory"}
            icon={Users}
            showHome
        >
            {role !== 'EMPLOYEE' ? (
                <div className="space-y-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Faculty', value: allStaff.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Active Status', value: allStaff.filter(s => s.status === 'Active').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'On Probation', value: allStaff.filter(s => s.status === 'Probation').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'Departments', value: departments.length - 1, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                        ].map((stat, i) => (
                            <Card key={i} className="border-none shadow-sm bg-white rounded-xl">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Filter Bar */}
                    <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by name, ID, or department..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-slate-50 border-slate-200 rounded-lg h-11 text-sm"
                                    />
                                </div>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staff Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaff.map((staff) => {
                            const summary = getPerformanceSummary(staff.id);
                            const TrendIcon = summary.trend === 'up' ? TrendingUp : summary.trend === 'down' ? TrendingDown : Minus;
                            const trendColor = summary.trend === 'up' ? 'text-emerald-500' : summary.trend === 'down' ? 'text-rose-500' : 'text-slate-400';

                            return (
                                <Card
                                    key={staff.id}
                                    className="group cursor-pointer bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                                    onClick={() => navigate(`/staff-portfolio/${staff.id}`)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-16 h-16 shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                <UserCircle2 className="w-10 h-10" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors truncate">
                                                    {staff.name}
                                                </h3>
                                                <p className="text-xs font-semibold text-slate-500 mt-1">{staff.id}</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-2 py-0.5 text-[10px] font-bold uppercase">
                                                        {staff.designation}
                                                    </Badge>
                                                    <Badge className={`border-none px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                        staff.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                        staff.status === 'Probation' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                                                    }`}>
                                                        {staff.status}
                                                    </Badge>
                                                    {!staff.isOnboardingComplete && (
                                                        <Badge className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase">
                                                            Complete Data
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                                                <p className="font-bold text-slate-700 text-xs truncate">{staff.department}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tenure</p>
                                                <p className="font-bold text-slate-700 text-xs">{summary.yearsOfService} YRS EXP</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Rating</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-lg font-bold text-slate-900">{summary.currentRating}</span>
                                                        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Trainings</p>
                                                <span className="text-lg font-bold text-blue-600">{summary.totalTrainings}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {filteredStaff.length === 0 && (
                        <div className="p-16 text-center bg-white rounded-xl border border-dashed border-slate-200">
                            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">No records found</h3>
                            <p className="text-slate-500 mt-2">Try refining your search parameters.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Employee Hero Profile */}
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
                                <UserCircle2 className="w-20 h-20 md:w-24 md:h-24" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                                    <CheckCircle className="w-3 h-3" /> Active Official
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{user.name}</h1>
                                <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider mb-6 flex items-center justify-center md:justify-start gap-2">
                                    <Building2 className="w-4 h-4 text-slate-400" /> {user.department || 'GOI ADMINISTRATION'}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-amber-500" />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Rating</p>
                                            <p className="text-sm font-bold text-slate-800">4.7 CAP</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Tenure</p>
                                            <p className="text-sm font-bold text-slate-800">4 Years</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/staff-portfolio/${employeeStaffId}`)}
                                className="bg-slate-900 hover:bg-black text-white px-8 h-12 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md"
                            >
                                View Detailed Profile
                            </Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Achievements */}
                        <Card className="lg:col-span-2 shadow-sm bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-amber-500" />
                                        Recognition Hall
                                    </h3>
                                    <Badge variant="outline" className="text-slate-400 border-slate-200 px-3 py-1 font-bold text-[10px] uppercase">Latest Awards</Badge>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { title: 'Best Faculty Award 2023', desc: 'Recognized for outstanding teaching and research contributions in CS.', color: 'amber' },
                                        { title: 'SCOPUS Publication', desc: 'Deep Learning Applications in Medical Imaging published in Q1 Journal.', color: 'blue' }
                                    ].map((ach, idx) => (
                                        <div key={idx} className="flex gap-6 items-start">
                                            <div className={`w-12 h-12 shrink-0 bg-${ach.color}-50 rounded-lg flex items-center justify-center border border-${ach.color}-100`}>
                                                <Trophy className={`w-6 h-6 text-${ach.color}-600`} />
                                            </div>
                                            <div className="flex-1 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                                <h4 className="font-bold text-slate-900 text-lg leading-tight">{ach.title}</h4>
                                                <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">{ach.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pulse Stats */}
                        <Card className="shadow-sm bg-slate-900 rounded-xl text-white border-none p-8">
                            <CardContent className="p-0 flex flex-col h-full">
                                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2 mb-8">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    Quick Pulse
                                </h3>
                                <div className="space-y-4 flex-1">
                                    {[
                                        { label: 'Trainings', value: '8 Completed' },
                                        { label: 'Pass Rate', value: '87% Avg' },
                                        { label: 'Attendance', value: '92%', textColor: 'text-emerald-400' }
                                    ].map((p, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{p.label}</span>
                                            <span className={`font-bold text-lg ${p.textColor || 'text-white'}`}>{p.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed uppercase tracking-wider text-center">Syncing with Central Repository</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default StaffPortfolio;
