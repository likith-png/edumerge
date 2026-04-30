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
import Layout from '../components/Layout';

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

    const content = (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-slate-900 p-8 text-white shadow-md">

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">LMS Suite v3.0</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Digital Learning Ecosystem
                        </h1>
                        <p className="text-slate-300 font-medium max-w-xl">
                            A comprehensive environment for course creation, certification, and skill-based growth.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Button onClick={() => setCurrentView('catalog')} className="h-11 px-6 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors">
                                Explore Catalog
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentView('my-learning')}
                                className="h-11 px-6 rounded-lg border-white/20 text-white hover:bg-white/10 font-bold"
                            >
                                My Learning
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="grid grid-cols-2 gap-4 opacity-40">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                                    <div className="h-8 w-8 rounded-lg bg-white/20" />
                                    <div className="h-2 w-full bg-white/20 rounded-full" />
                                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Enterprise Suite</h2>
                    <Button variant="ghost" className="text-slate-600 font-bold hover:bg-slate-100 rounded-lg gap-2 text-sm">
                        System Configuration <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            onClick={feature.action}
                            className={`group border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-white rounded-xl ${feature.action ? 'cursor-pointer' : ''}`}
                        >
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-4 rounded-xl ${feature.color} shadow-sm`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${feature.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        feature.status === 'New' ? 'bg-slate-50 text-slate-600 border-slate-100' :
                                            feature.status === 'Beta' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                        {feature.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 font-medium text-[13px] leading-relaxed mb-4 italic">
                                    {feature.description}
                                </p>
                                <div className="flex items-center text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                                    Access Application <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gapx-4 py-4">
                {[
                    { label: "Active Learners", value: "2,405", trend: "+12%" },
                    { label: "Completions", value: "856", trend: "+5%" },
                    { label: "Avg. Duration", value: "24h", trend: "+8%" },
                    { label: "Credentials", value: "142", trend: "+15%" }
                ].map((stat, i) => (
                    <Card key={i} className="border-slate-200 shadow-sm bg-slate-50 rounded-xl overflow-hidden group">
                        <CardContent className="p-5">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                                <span className="text-emerald-600 text-[10px] font-bold">{stat.trend}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <Layout
            title="Digital LMS Hub"
            description="Manage your learning journey, certifications, and course authored content."
            icon={BookOpen}
        >
            {currentView === 'catalog' ? <CourseCatalog onBack={() => setCurrentView('dashboard')} /> :
                currentView === 'authoring' ? <CourseAuthoring onBack={() => setCurrentView('dashboard')} /> :
                    currentView === 'learning' ? <LearningDelivery onBack={() => setCurrentView('dashboard')} /> :
                        currentView === 'my-learning' ? <MyLearning onBack={() => setCurrentView('dashboard')} /> :
                            content}
        </Layout>
    );
};

export default DigitalLMS;
