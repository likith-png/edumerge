import React, { useState } from 'react';
import {
    Users, AlertCircle, FileText,
    Download, CheckCircle, Clock,
    Shield, Target, Calendar, Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

import Layout from '../components/Layout';

const LMSAnalytics: React.FC = () => {
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
        <Layout
            title="Analytics & Governance"
            description="Comprehensive insights into institutional learning efficacy and compliance."
            headerActions={
                <div className="flex items-center gap-3">
                    <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                        <SelectTrigger className="w-[180px] bg-white border-slate-200 font-bold h-10 rounded-lg">
                            <SelectValue placeholder="View As" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Principal">Principal View</SelectItem>
                            <SelectItem value="HOD">HOD View</SelectItem>
                            <SelectItem value="HR">HR View</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2 bg-white font-bold text-slate-600 h-10 rounded-lg border-slate-200">
                        <Calendar className="w-4 h-4" /> {timeRange}
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6 rounded-lg shadow-sm">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                </div>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-500">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-emerald-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">+4.5%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.completionRate}%</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Completion Rate</p>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-blue-50 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-widest">+2h</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.avgHours} Hrs</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning Per Staff</p>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-indigo-50 rounded-lg">
                                <Shield className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-widest">Stable</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.compliance}%</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mandatory Compliance</p>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-amber-50 rounded-lg">
                                <Award className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-widest">Active</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.activeCertifications}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certifications Issued</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Charts & Detailed Stats */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Compliance & Risk Section */}
                    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold text-slate-900">Compliance & Regulatory Tracking</CardTitle>
                                <CardDescription className="text-xs">Monitoring institutional training requirements</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-3">
                                Detailed Stats
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
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm">
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
                    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <CardTitle className="text-base font-bold text-slate-900">Departmental Learning Adoption</CardTitle>
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
                    <Card className="border-none shadow-md rounded-xl bg-slate-900 text-white overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-base font-bold">LMS Governance</CardTitle>
                            <CardDescription className="text-slate-400 text-xs mt-1">Status monitoring thresholds</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <Target className="w-5 h-5 text-emerald-400" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-white/90">Learning Target</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Alert if dept avg &lt; 20 hrs</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <Shield className="w-5 h-5 text-amber-400" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-white/90">Compliance Watch</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Alert if overdue &gt; 5 days</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-amber-400" />
                            </div>
                            <Button variant="secondary" className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-[10px] uppercase tracking-widest h-10 mt-2">
                                Manage Thresholds
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Audit Exports */}
                    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <CardTitle className="text-base font-bold text-slate-900">Governance Reports</CardTitle>
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
        </Layout>
    );
};

// Start of Award Component (Mock for icon usage)

export default LMSAnalytics;
