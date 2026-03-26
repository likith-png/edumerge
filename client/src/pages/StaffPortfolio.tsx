import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Users, Search, TrendingUp, TrendingDown, Minus, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { getAllStaff, getPerformanceSummary, getDepartments, searchStaff } from '../services/staffPortfolioService';
import { usePersona } from '../contexts/PersonaContext';

const StaffPortfolio: React.FC = () => {
    const navigate = useNavigate();
    const { role } = usePersona();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');

    // If employee, we directly show their portfolio. 
    // In a real app, this ID would come from the auth/persona context.
    const employeeStaffId = 'FAC001';

    const allStaff = getAllStaff();
    const departments = ['All', ...getDepartments()];

    // Filter staff
    const filteredStaff = searchQuery
        ? searchStaff(searchQuery)
        : selectedDept === 'All'
            ? allStaff
            : allStaff.filter(s => s.department === selectedDept);

    return (
        <Layout
            title={role === 'EMPLOYEE' ? "My Professional Portfolio" : "Staff Portfolio"}
            description={role === 'EMPLOYEE' ? "Your complete career journey and achievements" : "Complete staff journey tracking from day 1"}
            icon={Users}
            showBack
        >
            {role !== 'EMPLOYEE' ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-800 overflow-hidden relative">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-800/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-4 relative z-10">
                                <div className="text-3xl font-black text-slate-800 tracking-tight">{allStaff.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Total Faculty</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500 overflow-hidden relative">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-4 relative z-10">
                                <div className="text-3xl font-black text-slate-800 tracking-tight">
                                    {allStaff.filter(s => s.status === 'Active').length}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Active</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-500 overflow-hidden relative">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-4 relative z-10">
                                <div className="text-3xl font-black text-slate-800 tracking-tight">
                                    {allStaff.filter(s => s.status === 'Probation').length}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">On Probation</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/60 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-all border-l-4 border-l-slate-400 overflow-hidden relative">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-500/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-4 relative z-10">
                                <div className="text-3xl font-black text-slate-800 tracking-tight">{departments.length - 1}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Departments</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6 bg-white/60 backdrop-blur-md border border-white/60 shadow-sm">
                        <CardContent className="pt-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by name, ID, or department..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 bg-white/80 border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-xl h-12 shadow-sm"
                                    />
                                </div>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                    className="px-4 py-3 border border-slate-200 rounded-xl bg-white/80 shadow-sm focus:border-indigo-300 outline-none text-slate-700 font-medium"
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staff List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaff.map((staff) => {
                            const summary = getPerformanceSummary(staff.id);
                            const TrendIcon = summary.trend === 'up' ? TrendingUp : summary.trend === 'down' ? TrendingDown : Minus;
                            const trendColor = summary.trend === 'up' ? 'text-emerald-500' : summary.trend === 'down' ? 'text-rose-500' : 'text-slate-400';

                            return (
                                <Card
                                    key={staff.id}
                                    className="cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-white/60 backdrop-blur-md border border-white/60 hover:border-blue-200 shadow-sm hover:shadow-xl rounded-[24px] overflow-hidden"
                                    onClick={() => navigate(`/staff-portfolio/${staff.id}`)}
                                >
                                    <CardContent className="pt-6 relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10 group-hover:bg-blue-800/10 transition-colors"></div>
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 bg-blue-50/80 rounded-2xl flex items-center justify-center text-blue-800 font-bold shadow-sm border border-blue-100 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/150?u=${encodeURIComponent(staff.name)}`} alt={staff.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-blue-800 transition-colors">{staff.name}</h3>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{staff.id}</div>
                                                <Badge className="mt-2 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                                    {staff.designation}
                                                </Badge>
                                            </div>
                                            <Badge
                                                className={`border-none px-2 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm ${staff.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                    staff.status === 'Probation' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                        'bg-slate-50 text-slate-600 border border-slate-200'
                                                    }`}
                                            >
                                                {staff.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-3 text-sm px-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</span>
                                                <span className="font-bold text-slate-700 text-xs">{staff.department}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</span>
                                                <span className="font-bold text-slate-700 text-xs">
                                                    {new Date(staff.joiningDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tenure</span>
                                                <span className="font-bold text-slate-700 text-xs">{summary.yearsOfService} yrs</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 px-2 flex items-center justify-between">
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Rating</div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-lg font-black text-slate-800">
                                                        {summary.currentRating}
                                                    </span>
                                                    <TrendIcon className={`h-3 w-3 ${trendColor}`} strokeWidth={3} />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Trainings</div>
                                                <div className="text-lg font-black text-blue-800">
                                                    {summary.totalTrainings}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {filteredStaff.length === 0 && (
                        <Card>
                            <CardContent className="pt-6 text-center text-slate-500">
                                No staff members found matching your search
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-white/60 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl -mr-64 -mt-32 opacity-50 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="w-32 h-32 bg-white/80 rounded-[2.5rem] flex items-center justify-center text-blue-800 text-4xl font-black shadow-lg border border-white/60 ring-4 ring-indigo-50/50 overflow-hidden">
                                <img src={`https://i.pravatar.cc/300?u=${encodeURIComponent('Ms. Reshma Binu Prasad')}`} alt="Ms. Reshma Binu Prasad" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-black text-slate-800 mb-2">Ms. Reshma Binu Prasad</h2>
                                <p className="text-slate-500 font-black tracking-[0.2em] uppercase text-xs mb-4">Assistant Professor • Computer Science</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-xl font-bold shadow-sm text-[10px] uppercase tracking-widest">Active Status</Badge>
                                    <Badge className="bg-blue-50 text-blue-800 border border-blue-100 px-4 py-1.5 rounded-xl font-bold shadow-sm text-[10px] uppercase tracking-widest">4.7 Overall Rating</Badge>
                                    <Badge className="bg-amber-50 text-amber-700 border border-amber-100 px-4 py-1.5 rounded-xl font-bold shadow-sm text-[10px] uppercase tracking-widest">4 Years Service</Badge>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/staff-portfolio/${employeeStaffId}`)}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-800 transition-colors shadow-xl shadow-slate-900/20"
                            >
                                View Detailed Portfolio
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 shadow-sm bg-white/60 backdrop-blur-md border border-white/60 rounded-[32px]">
                            <CardContent className="p-8">
                                <h3 className="font-black text-slate-800 mb-8 uppercase tracking-widest text-xs flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Recent Achievements</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4 group">
                                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100 shadow-sm group-hover:scale-110 transition-transform">
                                            <TrendingUp className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div className="flex-1 border-b border-slate-100 pb-6">
                                            <h4 className="font-black text-slate-800 text-lg">Best Faculty Award 2023</h4>
                                            <p className="text-sm font-medium text-slate-500 mt-1">Recognized for outstanding teaching and research contributions in CS.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 group">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform">
                                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 pb-2">
                                            <h4 className="font-black text-slate-800 text-lg">SCOPUS Publication</h4>
                                            <p className="text-sm font-medium text-slate-500 mt-1">Deep Learning Applications in Medical Imaging published in Q1 Journal.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm bg-indigo-600 rounded-[32px] text-white border border-indigo-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            <CardContent className="p-8 relative z-10">
                                <h3 className="font-black text-indigo-100 mb-8 uppercase tracking-widest text-xs flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-300" /> Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Trainings</span>
                                        <span className="font-black text-lg">8 Completed</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Pass Rate</span>
                                        <span className="font-black text-lg">87% Avg</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Attendance</span>
                                        <span className="font-black text-emerald-300 text-lg">92%</span>
                                    </div>
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
