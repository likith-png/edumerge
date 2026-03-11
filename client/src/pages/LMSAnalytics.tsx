import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, AlertCircle, FileText,
    Download, ChevronDown, CheckCircle, Clock,
    Shield, Target, Calendar, Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

const LMSAnalytics: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'Principal' | 'HOD' | 'HR'>('Principal');
    const [timeRange] = useState('This Academic Year');

    // --- Mock Data ---
    const stats = {
        completionRate: 78,
        avgHours: 32,
        compliance: 84,
        activeCertifications: 142
    };

    const overdueStaff = [
        { id: 1, name: 'Ms. Reshma Binu Prasad', dept: 'Mathematics', course: 'Child Safety Protocols', daysOverdue: 5 },
        { id: 2, name: 'Ms. Sanchaiyata Majumdar', dept: 'Science', course: 'POSH Compliance', daysOverdue: 2 },
        { id: 3, name: 'Dr. R Sedhunivas', dept: 'Humanities', course: 'NEP 2020 Basics', daysOverdue: 12 },
    ];

    const deptPerformance = [
        { dept: 'Science', completion: 92, engagement: 'High' },
        { dept: 'Mathematics', completion: 88, engagement: 'High' },
        { dept: 'Languages', completion: 74, engagement: 'Medium' },
        { dept: 'Humanities', completion: 65, engagement: 'Low' },
        { dept: 'Sports', completion: 95, engagement: 'High' },
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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Governance</h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-11">Comprehensive insights into institutional learning efficacy and compliance.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                        <SelectTrigger className="w-[180px] bg-white border-slate-200 font-bold">
                            <SelectValue placeholder="View As" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Principal">Principal View</SelectItem>
                            <SelectItem value="HOD">HOD View</SelectItem>
                            <SelectItem value="HR">HR View</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2 bg-white font-bold text-slate-600">
                        <Calendar className="w-4 h-4" /> {timeRange}
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100">
                        <Download className="w-4 h-4" /> Export Audit Report
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+4.5%</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.completionRate}%</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Completion Rate</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+2h</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.avgHours} Hrs</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learning Per Staff</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <Shield className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">High</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.compliance}%</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandatory Compliance</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <Award className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.activeCertifications}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certifications Issued</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Charts & Detailed Stats */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Compliance & Risk Section */}
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Compliance & Mandatory Training</CardTitle>
                                <CardDescription>Tracking legal and institutional training requirements</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50">
                                View Full Report
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {/* Risk Alerts */}
                                <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                                    <div className="p-3 bg-red-100 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-red-900">Compliance Risk Alert</h4>
                                        <p className="text-xs text-red-700 mt-1">
                                            <span className="font-bold">3 Staff Members</span> are overdue for mandatory "Child Safety" training by more than 7 days.
                                        </p>
                                    </div>
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-md">
                                        Send Reminder
                                    </Button>
                                </div>

                                {/* Overdue List */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                                        Overdue Staff <Badge className="bg-slate-100 text-slate-600 border-none">{overdueStaff.length}</Badge>
                                    </h4>
                                    <div className="space-y-3">
                                        {overdueStaff.map(staff => (
                                            <div key={staff.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                        {staff.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                                                        <p className="text-xs text-slate-400">{staff.dept}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-red-600">{staff.daysOverdue} Days Overdue</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{staff.course}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Department Performance */}
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <CardTitle className="text-lg font-bold text-slate-900">Department-wise Learning Adoption</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {deptPerformance.map((dept, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-slate-700">{dept.dept}</span>
                                            <span className="text-xs font-bold text-slate-500">{dept.completion}% Completion</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${dept.completion >= 90 ? 'bg-emerald-500' :
                                                    dept.completion >= 75 ? 'bg-indigo-500' :
                                                        'bg-amber-500'
                                                    }`}
                                                style={{ width: `${dept.completion}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Alerts & Quick Actions */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Configurable Alerts */}
                    <Card className="border-none shadow-sm rounded-3xl bg-indigo-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-lg font-bold">Automated Governance</CardTitle>
                            <CardDescription className="text-indigo-200">System monitored thresholds</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Target className="w-5 h-5 text-emerald-400" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Learning Target</p>
                                    <p className="text-xs text-indigo-200">Alert if dept avg &lt; 20 hrs</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Shield className="w-5 h-5 text-amber-400" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Compliance Watch</p>
                                    <p className="text-xs text-indigo-200">Alert if overdue &gt; 5 days</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                            </div>
                            <Button className="w-full bg-white text-indigo-900 font-bold hover:bg-indigo-50 mt-2">
                                Configure Alerts
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Audit Exports */}
                    <Card className="border-none shadow-sm rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Audit Reports</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-between h-auto py-3 px-4 border-slate-200 hover:bg-slate-50 hover:border-indigo-200 group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                        <FileText className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-700">Monthly Compliance</p>
                                        <p className="text-[10px] text-slate-400">PDF • Last gen: 2d ago</p>
                                    </div>
                                </div>
                                <Download className="w-4 h-4 text-slate-400" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between h-auto py-3 px-4 border-slate-200 hover:bg-slate-50 hover:border-emerald-200 group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                        <Users className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-700">Staff Adoption</p>
                                        <p className="text-[10px] text-slate-400">XLSX • Real-time</p>
                                    </div>
                                </div>
                                <Download className="w-4 h-4 text-slate-400" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Start of Award Component (Mock for icon usage)

export default LMSAnalytics;
