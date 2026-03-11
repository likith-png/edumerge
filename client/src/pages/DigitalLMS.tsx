import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    BookOpen, Layers, MonitorPlay, Award,
    TrendingUp, Building2, BarChart3, ChevronRight
} from 'lucide-react';
import CourseAuthoring from './CourseAuthoring';
import CourseCatalog from './CourseCatalog';
import LearningDelivery from './LearningDelivery';
import MyLearning from './MyLearning';

const DigitalLMS: React.FC = () => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState<'dashboard' | 'catalog' | 'authoring' | 'learning' | 'my-learning'>('dashboard');

    const features = [
        {
            title: "Course Marketplace & Catalog",
            description: "Access a vast library of curated courses.",
            icon: BookOpen,
            color: "bg-blue-50 text-blue-600",
            status: "Active",
            action: () => setCurrentView('catalog')
        },
        {
            title: "Course Authoring Studio",
            description: "Create and publish your own content.",
            icon: Layers,
            color: "bg-purple-50 text-purple-600",
            status: "Beta",
            action: () => setCurrentView('authoring')
        },
        {
            title: "Learning Delivery Engine",
            description: "Seamless content delivery experience.",
            icon: MonitorPlay,
            color: "bg-indigo-50 text-indigo-600",
            status: "Active",
            action: () => setCurrentView('learning')
        },
        {
            title: "Certification & Credentials",
            description: "Earn and verify digital certificates.",
            icon: Award,
            color: "bg-amber-50 text-amber-600",
            status: "Active",
            action: () => navigate('/certificates')
        },
        {
            title: "Skill & Career Pathways",
            description: "Map your professional growth journey.",
            icon: TrendingUp,
            color: "bg-rose-50 text-rose-600",
            status: "New",
            action: () => navigate('/skill-pathways')
        },
        {
            title: "Institution-Branded Academy",
            description: "Exclusive courses for our staff.",
            icon: Building2,
            color: "bg-cyan-50 text-cyan-600",
            status: "Active"
        },
        {
            title: "Analytics & Governance",
            description: "Leadership dashboards, compliance tracking & audit logs.",
            icon: BarChart3,
            color: "bg-slate-50 text-slate-600",
            status: "New",
            action: () => navigate('/lms-analytics')
        }
    ];

    if (currentView === 'catalog') {
        return <CourseCatalog onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'authoring') {
        return <CourseAuthoring onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'learning') {
        return <LearningDelivery onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'my-learning') {
        return <MyLearning onBack={() => setCurrentView('dashboard')} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[3rem] bg-indigo-900 p-10 text-white shadow-2xl shadow-indigo-900/20">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 p-24 bg-rose-500/20 rounded-full blur-3xl translate-y-12 -translate-x-12" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold tracking-wide uppercase">New Module 2.0</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight leading-[1.1]">
                            Digital Learning <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">Management System</span>
                        </h1>
                        <p className="text-lg text-indigo-100/80 font-medium max-w-xl leading-relaxed">
                            Empower your professional journey with our comprehensive digital learning ecosystem.
                            From course creation to certification, everything you need to excel is right here.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Button onClick={() => setCurrentView('catalog')} className="h-12 px-8 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10">
                                Explore Catalog
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentView('my-learning')}
                                className="h-12 px-8 rounded-xl border-white/20 text-white hover:bg-white/10 font-bold backdrop-blur-sm"
                            >
                                My Progress
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-transparent z-10" />
                        {/* Abstract Visual Representation */}
                        <div className="grid grid-cols-2 gap-4 opacity-80 transform rotate-[-5deg] scale-90">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-40 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4">
                                    <div className="h-8 w-8 rounded-lg bg-white/20 mb-3" />
                                    <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                                    <div className="h-2 w-16 bg-white/10 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Core Modules</h2>
                    <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl gap-2">
                        View All Features <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            onClick={feature.action}
                            className={`group border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white rounded-[2rem] ${feature.action ? 'cursor-pointer' : ''}`}
                        >
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${feature.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        feature.status === 'New' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                            feature.status === 'Beta' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                        {feature.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                                    {feature.description}
                                </p>
                                <div className="flex items-center text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Access Module <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Learners", value: "2,405", trend: "+12%" },
                    { label: "Course Completions", value: "856", trend: "+5%" },
                    { label: "Avg. Learning Hours", value: "24h", trend: "+8%" },
                    { label: "Certifications Issued", value: "142", trend: "+15%" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-slate-900 text-white rounded-[24px]">
                        <CardContent className="p-6">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-2xl font-black">{stat.value}</h4>
                                <span className="text-emerald-400 text-xs font-bold">{stat.trend}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DigitalLMS;
