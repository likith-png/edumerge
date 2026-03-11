import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Users, Search, TrendingUp, TrendingDown, Minus, CheckCircle } from 'lucide-react';
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
                        <Card className="border-blue-200 bg-blue-50">
                            <CardContent className="pt-4">
                                <div className="text-3xl font-bold text-blue-900">{allStaff.length}</div>
                                <div className="text-xs text-blue-700">Total Faculty</div>
                            </CardContent>
                        </Card>
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="pt-4">
                                <div className="text-3xl font-bold text-green-900">
                                    {allStaff.filter(s => s.status === 'Active').length}
                                </div>
                                <div className="text-xs text-green-700">Active</div>
                            </CardContent>
                        </Card>
                        <Card className="border-amber-200 bg-amber-50">
                            <CardContent className="pt-4">
                                <div className="text-3xl font-bold text-amber-900">
                                    {allStaff.filter(s => s.status === 'Probation').length}
                                </div>
                                <div className="text-xs text-amber-700">On Probation</div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-200 bg-slate-50">
                            <CardContent className="pt-4">
                                <div className="text-3xl font-bold text-slate-900">{departments.length - 1}</div>
                                <div className="text-xs text-slate-700">Departments</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by name, ID, or department..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg"
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staff List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStaff.map((staff) => {
                            const summary = getPerformanceSummary(staff.id);
                            const TrendIcon = summary.trend === 'up' ? TrendingUp : summary.trend === 'down' ? TrendingDown : Minus;
                            const trendColor = summary.trend === 'up' ? 'text-green-600' : summary.trend === 'down' ? 'text-red-600' : 'text-slate-600';

                            return (
                                <Card
                                    key={staff.id}
                                    className="cursor-pointer hover:shadow-lg transition-all border-slate-200 hover:border-blue-300"
                                    onClick={() => navigate(`/staff-portfolio/${staff.id}`)}
                                >
                                    <CardContent className="pt-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900">{staff.name}</h3>
                                                <p className="text-xs text-slate-600">{staff.id}</p>
                                                <Badge className="mt-1 bg-slate-100 text-slate-700 text-[10px]">
                                                    {staff.designation}
                                                </Badge>
                                            </div>
                                            <Badge
                                                className={`${staff.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    staff.status === 'Probation' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-slate-100 text-slate-800'
                                                    } text-[10px]`}
                                            >
                                                {staff.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Department:</span>
                                                <span className="font-medium text-slate-900">{staff.department}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Joined:</span>
                                                <span className="font-medium text-slate-900">
                                                    {new Date(staff.joiningDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Years:</span>
                                                <span className="font-medium text-slate-900">{summary.yearsOfService} yrs</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-slate-600">Current Rating</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold text-blue-900">
                                                            {summary.currentRating}
                                                        </span>
                                                        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-slate-600">Trainings</div>
                                                    <div className="text-xl font-bold text-green-900">
                                                        {summary.totalTrainings}
                                                    </div>
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
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="w-32 h-32 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center text-indigo-700 text-4xl font-black shadow-inner">
                                PS
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-black text-slate-900 mb-2">Ms. Reshma Binu Prasad</h2>
                                <p className="text-slate-500 font-bold tracking-wide uppercase text-xs mb-4">Assistant Professor • Computer Science</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-1.5 rounded-xl font-bold">Active Status</Badge>
                                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 px-4 py-1.5 rounded-xl font-bold">4.7 Overall Rating</Badge>
                                    <Badge className="bg-amber-50 text-amber-700 border-amber-100 px-4 py-1.5 rounded-xl font-bold">4 Years Service</Badge>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/staff-portfolio/${employeeStaffId}`)}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                            >
                                View Detailed Portfolio
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-black text-slate-900 mb-6">Recent Achievements</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <TrendingUp className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Best Faculty Award 2023</h4>
                                            <p className="text-sm text-slate-500 mt-1">Recognized for outstanding teaching and research contributions in CS.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">SCOPUS Publication</h4>
                                            <p className="text-sm text-slate-500 mt-1">Deep Learning Applications in Medical Imaging published in Q1 Journal.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-black text-slate-900 mb-6">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm font-bold text-slate-500">Trainings</span>
                                        <span className="font-black text-slate-900">8 Completed</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm font-bold text-slate-500">Pass Rate</span>
                                        <span className="font-black text-slate-900">87% Avg</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm font-bold text-slate-500">Attendance</span>
                                        <span className="font-black text-emerald-600">92%</span>
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
