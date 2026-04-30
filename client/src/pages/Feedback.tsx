import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Activity, CheckCircle,
    Layout as LayoutIcon, FileText, Users, Target, MessageSquare,
    Shield, GraduationCap
} from 'lucide-react';
import SurveyBuilder from './SurveyBuilder';
import Feedback360 from './Feedback360';

const Feedback: React.FC = () => {
    const [activeView, setActiveView] = useState('overview');

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutIcon },
        { id: 'builder', label: 'Survey Builder', icon: FileText },
        { id: '360', label: '360° Feedback', icon: Users },
        { id: 'responses', label: 'Responses', icon: MessageSquare },
        { id: 'competency', label: 'Competency Framework', icon: Target },
        { id: 'external', label: 'Student/Parent', icon: GraduationCap },
        { id: 'action', label: 'Action Tracker', icon: CheckCircle },
        { id: 'governance', label: 'Governance', icon: Shield },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'builder':
                return <SurveyBuilder />;
            case '360':
                return <Feedback360 />;
            case 'responses':
                return (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold">Survey Responses</h3>
                        <p className="text-slate-500">Real-time tracking of pulse survey data and sentiment analysis.</p>
                        <Card className="max-w-md mx-auto px-4 py-4 bg-slate-50 border-dashed">
                            <p className="text-sm italic">"The overall campus satisfaction has improved by 12% following the new library hours."</p>
                        </Card>
                    </div>
                );
            // case 'competency': removed as per request
            case 'external':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold">External Stakeholder Feedback</h3>
                                <p className="text-slate-500">Insights from Students, Parents, and Alumni.</p>
                            </div>
                            <Button className="bg-indigo-600 text-white rounded-xl">Generate Link</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { group: 'Students', sentiment: '84%', count: 1200, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { group: 'Parents', sentiment: '78%', count: 850, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' },
                                { group: 'Alumni', sentiment: '92%', count: 450, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                            ].map((s, i) => (
                                <Card key={i} className="rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                    <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">{s.group}</h4>
                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <div className="text-xl font-bold">{s.sentiment}</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">Positive Sentiment</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-slate-600">{s.count}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Responses</div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case 'action':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold">Action Tracker</h3>
                                <p className="text-slate-500">Track interventions based on feedback trends.</p>
                            </div>
                            <Button className="bg-emerald-600 text-white rounded-xl">New Intervention</Button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { task: 'Upgrade Science Lab Ventilation', source: 'Parent Feedback', priority: 'High', status: 'In Progress' },
                                { task: 'Revise Canteen Menu', source: 'Student Pulse', priority: 'Medium', status: 'Pending' },
                                { task: 'Faculty Training on NEP 2020', source: 'Competency Gap', priority: 'High', status: 'Completed' }
                            ].map((t, i) => (
                                <Card key={i} className="rounded-2xl p-4 border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-10 rounded-full ${t.status === 'Completed' ? 'bg-emerald-400' : t.priority === 'High' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t.task}</h4>
                                            <p className="text-xs text-slate-500 font-medium">Source: {t.source}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {t.status}
                                        </span>
                                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">Update</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Hero Card */}
                        <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-slate-900 text-white relative">
                            <CardContent className="p-8 relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase">Active Now</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold uppercase tracking-tight">Current Campus Pulse</h3>
                                    <p className="text-slate-300 font-medium max-w-xl">Help us understand your experience. Your feedback is anonymous and highly valued.</p>
                                </div>
                                <Button onClick={() => setActiveView('responses')} className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 rounded-lg h-10 px-8 font-bold text-xs transition-all">
                                    View Active Surveys
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Surveys Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[
                                { title: 'February Wellness Pulse', status: 'Active', responses: 45, deadline: '2 days left', color: 'bg-emerald-50 border-emerald-100' },
                                { title: 'Course Evaluation Feedback', status: 'Draft', responses: 0, deadline: 'Not started', color: 'bg-slate-50 border-slate-100' }
                            ].map((s, i) => (
                                <Card key={i} className={`rounded-2xl p-6 border border-slate-200 transition-all hover:shadow-md cursor-pointer group ${s.color}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{s.status}</span>
                                        <span className="text-[10px] font-bold text-slate-400 italic">{s.deadline}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-2 tracking-tight group-hover:text-slate-900 transition-colors">{s.title}</h4>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>{s.responses} Responses</span>
                                        <Button variant="ghost" size="sm" onClick={() => setActiveView('governance')} className="h-8 px-3 text-slate-600 hover:bg-white border border-transparent hover:border-slate-200">View Results</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Overall Satisfaction', score: 82, trend: '+4%', desc: 'vs last month' },
                                { label: 'Faculty Workload', score: 74, trend: '-2%', desc: 'needs attention' },
                                { label: 'Academic Support', score: 89, trend: '+1%', desc: 'steady growth' }
                            ].map((item, i) => (
                                <Card key={i} className="p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
                                        <span className={`text-[10px] font-bold ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.trend}</span>
                                    </div>
                                    <div className="text-4xl font-bold tracking-tight text-slate-900 mb-1">{item.score}%</div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <Layout title="Feedback Engine" description="Real-time campus pulse and stakeholder surveys" showHome={true} icon={MessageSquare}>
            {/* Tabbed Navigation */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 sticky top-0 bg-white z-30 pt-2 mb-6">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 ${activeView === item.id
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                            }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="max-w-6xl mx-auto">
                {renderContent()}
            </div>
        </Layout>
    );
};

export default Feedback;
