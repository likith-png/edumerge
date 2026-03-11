import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    Users, Briefcase, ChevronRight, TrendingUp,
    AlertCircle, CheckCircle2, Clock,
    FileText, Zap, Star, ArrowUpRight,
    Target, CalendarCheck
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import { Link } from 'react-router-dom';

const ManagerTeamDashboard: React.FC = () => {
    const { user } = usePersona();

    const teamMembers = [
        { id: 'emp-001', name: 'Ms. Reshma Binu Prasad', role: 'Assistant Professor', status: 'On Track', progress: 85, lastReview: '2 days ago' },
        { id: 'emp-002', name: 'Ms. Sanchaiyata Majumdar', role: 'Associate Professor', status: 'Attention Needed', progress: 45, lastReview: '1 week ago' },
        { id: 'emp-003', name: 'Dr. R Sedhunivas', role: 'Senior Lecturer', status: 'Exceeding', progress: 95, lastReview: 'Yesterday' },
    ];

    const pendingActions = [
        { id: 1, type: 'Onboarding', title: 'Manager Induction: Dr. Ranjita Saikia (Due in 4 days)', priority: 'High', due: 'Oct 29' },
        { id: 2, type: 'Appraisal', title: 'Goal Approval - Ms. Sanchaiyata Majumdar', priority: 'High', due: 'Today' },
        { id: 3, type: 'Exit', title: 'Handover Review: Mr. Manjit Singh', priority: 'Medium', due: 'Oct 25' },
        { id: 4, type: 'Probation', title: 'Monthly Review - Dr. R Sedhunivas', priority: 'Medium', due: 'In 2 days' },
    ];

    return (
        <Layout
            title={`Team Dashboard`}
            description={`Managing ${user.department || 'Academic'} Department Team`}
            icon={Users}
        >
            <div className="flex flex-col gap-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-600 text-white border-none shadow-blue-200 shadow-lg group hover:scale-[1.02] transition-transform cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Team</p>
                                    <h3 className="text-3xl font-bold mt-1">12</h3>
                                </div>
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-100">
                                <ArrowUpRight className="h-3 w-3" />
                                <span>+2 since last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 group hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg. Performance</p>
                                    <h3 className="text-3xl font-bold mt-1 text-slate-900">82%</h3>
                                </div>
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                                <TrendingUp className="h-3 w-3" />
                                <span>Above Dept Average</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 group hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
                                    <h3 className="text-3xl font-bold mt-1 text-slate-900">08</h3>
                                </div>
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                                <AlertCircle className="h-3 w-3" />
                                <span>3 Require Immediate Action</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 group hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Retention Health</p>
                                    <h3 className="text-3xl font-bold mt-1 text-slate-900">High</h3>
                                </div>
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Star className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>No Attrition Risk</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Team List Widget */}
                    <Card className="lg:col-span-2 border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Direct Reports
                            </CardTitle>
                            <Button variant="link" size="sm" className="text-blue-600">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{member.name}</div>
                                                <div className="text-[10px] text-slate-500 uppercase font-semibold">{member.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="hidden md:block w-32">
                                                <div className="flex justify-between text-[10px] mb-1 font-medium italic">
                                                    <span>Goal Progress</span>
                                                    <span>{member.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-1">
                                                    <div
                                                        className={`h-1 rounded-full ${member.progress > 80 ? 'bg-green-500' : member.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                        style={{ width: `${member.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline" className={`text-[10px] border-none ${member.status === 'Exceeding' ? 'bg-green-100 text-green-700' :
                                                    member.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {member.status}
                                                </Badge>
                                                <div className="text-[10px] text-slate-400 mt-1">Last Review: {member.lastReview}</div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Actions Widget */}
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                <Zap className="h-5 w-5 text-amber-500" />
                                Priority Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pendingActions.map((action) => (
                                <div key={action.id} className="relative pl-4 group cursor-pointer">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full transition-all group-hover:w-1.5 ${action.priority === 'High' ? 'bg-red-500' :
                                        action.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'
                                        }`} />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{action.type}</span>
                                            <span className="text-[10px] font-medium text-slate-500">{action.due}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                            {action.title}
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-blue-600 font-bold">Review Now</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Separator className="my-2" />
                            <div className="bg-slate-900 rounded-xl p-4 text-white overflow-hidden relative group cursor-pointer">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Upcoming Milestone</div>
                                    <div className="text-sm font-semibold">Self-Assessment Phase Begins</div>
                                    <div className="text-[10px] text-slate-400 mt-2">Next Week (Nov 1st)</div>
                                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 border-none text-[10px] font-bold uppercase h-8">
                                        Team Prep Guide
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Module Quick Access (Manager Context) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/appraisal" className="group">
                        <Card className="border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Target className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Appraisal Review</div>
                                    <div className="text-[10px] text-slate-500">Review team goals & KPIs</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/probation-dashboard" className="group">
                        <Card className="border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Probation Tracker</div>
                                    <div className="text-[10px] text-slate-500">Oversee team probationers</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/exit" className="group">
                        <Card className="border-slate-200 group-hover:border-pink-400 group-hover:bg-pink-50/30 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Exit Clearances</div>
                                    <div className="text-[10px] text-slate-500">Manage team separations</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/leave/approvals" className="group">
                        <Card className="border-slate-200 group-hover:border-emerald-400 group-hover:bg-emerald-50/30 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <CalendarCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Leave Approvals</div>
                                    <div className="text-[10px] text-slate-500">Action team requests</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

const Separator = ({ className }: { className?: string }) => <div className={`h-[1px] bg-slate-100 w-full ${className}`} />;

export default ManagerTeamDashboard;
