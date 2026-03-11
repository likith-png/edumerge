import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Activity, Home, CheckCircle,
    Layout, FileText, Users, Target, MessageSquare,
    Shield, GraduationCap
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import SurveyBuilder from './SurveyBuilder';
import Feedback360 from './Feedback360';

const Feedback: React.FC = () => {
    const { role } = usePersona();
    const [activeView, setActiveView] = useState('overview');

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Layout },
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
                        <h3 className="text-2xl font-bold">Survey Responses</h3>
                        <p className="text-slate-500">Real-time tracking of pulse survey data and sentiment analysis.</p>
                        <Card className="max-w-md mx-auto p-6 bg-slate-50 border-dashed">
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
                                <h3 className="text-2xl font-bold">External Stakeholder Feedback</h3>
                                <p className="text-slate-500">Insights from Students, Parents, and Alumni.</p>
                            </div>
                            <Button className="bg-indigo-600 text-white rounded-xl">Generate Link</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { group: 'Students', sentiment: '84%', count: 1200, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { group: 'Parents', sentiment: '78%', count: 850, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { group: 'Alumni', sentiment: '92%', count: 450, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                            ].map((s, i) => (
                                <Card key={i} className="rounded-3xl p-6 border-none shadow-sm hover:shadow-md transition-all">
                                    <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">{s.group}</h4>
                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <div className="text-2xl font-black">{s.sentiment}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Positive Sentiment</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{s.count}</div>
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
                                <h3 className="text-2xl font-bold">Action Tracker</h3>
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
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {t.status}
                                        </span>
                                        <Button variant="ghost" size="sm" className="text-indigo-600">Update</Button>
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
                        <Card className="rounded-[32px] border-none shadow-2xl shadow-indigo-50 overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative">
                            <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
                            <CardContent className="p-8 relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-400 text-emerald-950 rounded-full text-[10px] font-black uppercase shadow-lg shadow-emerald-900/20">Active Now</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">Current Campus Pulse</h3>
                                    <p className="text-indigo-100 font-medium opacity-90 max-w-xl">Help us understand your experience. Your feedback is anonymous and highly valued.</p>
                                </div>
                                <Button onClick={() => setActiveView('responses')} className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl h-12 px-8 font-black shadow-lg uppercase tracking-widest text-xs transition-all hover:scale-105">
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
                                <Card key={i} className={`rounded-[24px] p-6 border transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group ${s.color}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{s.status}</span>
                                        <span className="text-[10px] font-bold text-slate-400 italic">{s.deadline}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{s.title}</h4>
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>{s.responses} Responses</span>
                                        <Button variant="ghost" size="sm" onClick={() => setActiveView('governance')} className="h-8 px-3 text-indigo-600 hover:bg-white">View Results</Button>
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
                                <Card key={i} className="p-6 rounded-[24px] border-slate-100 hover:border-indigo-100 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                        <span className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.trend}</span>
                                    </div>
                                    <div className="text-4xl font-black tracking-tighter text-slate-900 mb-1">{item.score}%</div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 z-20">
                <div className="p-6 border-b border-slate-50">
                    <div className="flex items-center gap-3 text-indigo-600 mb-1">
                        <MessageSquare className="w-8 h-8 fill-indigo-600" />
                        <span className="font-black text-xl tracking-tight">Loop</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-11">Feedback Engine</p>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeView === item.id
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${activeView === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-indigo-600" onClick={() => window.location.href = '/'}>
                        <Home className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {menuItems.find(i => i.id === activeView)?.icon && React.createElement(menuItems.find(i => i.id === activeView)!.icon, { className: "w-5 h-5 text-indigo-500" })}
                        {menuItems.find(i => i.id === activeView)?.label}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-900">{role?.replace('_', ' ')}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logged In</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {role?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-6xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feedback;
