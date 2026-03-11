import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
    UserPlus,
    TrendingUp,
    MessageSquare,
    Heart,
    Briefcase,
    LogOut,
    Network,
    BookOpen,
    GraduationCap,
    ChevronRight,
    CheckCircle,
    Users,
    BrainCircuit,
    PieChart,
    Calendar
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerTeamDashboard from './ManagerTeamDashboard';

const categories = [
    {
        name: "Talent Acquisition",
        icon: UserPlus,
        color: "blue",
        modules: [
            {
                title: "Onboarding Pro",
                description: "Full-cycle onboarding from offer acceptance to probation. Self-service portal, BGV, SLA tracking and more.",
                icon: UserPlus,
                path: "/onboarding-pro"
            },
            {
                title: "Probation Management",
                description: "Track performance reviews and confirmation workflows.",
                icon: CheckCircle,
                path: "/probation-dashboard"
            }
        ]
    },
    {
        name: "Academics",
        icon: BookOpen,
        color: "indigo",
        modules: [
            {
                title: "Lesson Plan & Curriculum",
                description: "Manage lesson plans, curriculum design, and academic schedules.",
                icon: BookOpen,
                path: "/lesson-plan"
            },
            {
                title: "Research & Publication",
                description: "Track academic papers, projects, and calculate UGC API scores.",
                icon: GraduationCap,
                path: "/research-publication"
            }
        ]
    },
    {
        name: "Talent Cycle",
        icon: TrendingUp,
        color: "indigo",
        modules: [
            {
                title: "Policy & Guides",
                description: "Videos, cultural guides, and POSH policies for onboarding.",
                icon: BookOpen,
                path: "/policy"
            },
            {
                title: "Learning & Development",
                description: "Training programs, certifications, and skill development.",
                icon: GraduationCap,
                path: "/learning-development"
            },
            {
                title: "Leave Management",
                description: "Apply for leaves, track balances, and manage team approvals.",
                icon: Calendar,
                path: "/leave/dashboard"
            },
            {
                title: "Organisation Structure",
                description: "Visual hierarchy of the organization and departments.",
                icon: Network,
                path: "/org-structure"
            },
            {
                title: "Engagement & Culture",
                description: "Employee engagement surveys, events, and cultural activities.",
                icon: Heart,
                path: "/engagement"
            },
            {
                title: "Feedback",
                description: "Provide and receive feedback across the organization.",
                icon: MessageSquare,
                path: "/feedback"
            },
            {
                title: "Appraisal & Performance",
                description: "Comprehensive performance management, goals, and 360° reviews.",
                icon: TrendingUp,
                path: "/appraisal"
            },
            {
                title: "Staff Portfolio",
                description: "Complete staff journey tracking from joining to present day.",
                icon: Users,
                path: "/staff-portfolio"
            },
            {
                title: "Exit Management",
                description: "Handle employee resignations, exit interviews, and clearances.",
                icon: LogOut,
                path: "/exit"
            },
            {
                title: "Task Management",
                description: "Central hub for all your automated and manual action items.",
                icon: CheckCircle,
                path: "/task-management"
            }
        ]
    },
    {
        name: "Governance & Strategy",
        icon: Network,
        color: "slate",
        modules: [
            {
                title: "Capacity Intelligence (ICIS)",
                description: "Unified AI engine for academic, faculty, infra, and financial capacity.",
                icon: BrainCircuit,
                path: "/capacity-intelligence"
            },
            {
                title: "Talent Dashboard",
                description: "Strategic insights into talent acquisition and retention.",
                icon: TrendingUp,
                path: "/talent-dashboard"
            },
            {
                title: "HR Dashboard",
                description: "Overview of Exit Management, Attrition, and key metrics.",
                icon: TrendingUp,
                path: "/hr-dashboard"
            }
        ]
    },
    {
        name: "Reports",
        icon: PieChart,
        color: "emerald",
        modules: [
            {
                title: "Reports",
                description: "Comprehensive analytical reports, custom report builder, and PDF/Excel exports.",
                icon: PieChart,
                path: "/reports"
            }
        ]
    }
];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { role, user } = usePersona();

    const isEmployee = role === 'EMPLOYEE';
    const isManager = role === 'MANAGER';

    return (
        <Layout
            title={isEmployee ? "Employee Portal" : isManager ? "Manager Console" : "HRMS Dashboard"}
            description={isEmployee ? `Welcome back, ${user.name}` : isManager ? `Team Overview - ${user.name}` : "Unified Human Resource Management Environment"}
            icon={isEmployee ? Users : isManager ? Briefcase : Network}
        >
            {isEmployee ? (
                <EmployeeDashboard user={user} />
            ) : isManager ? (
                <ManagerTeamDashboard />
            ) : (
                <div className="space-y-12 pb-10">
                    {/* Hero Greeting */}
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-10 -ml-32 -mb-32"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight mb-2">Welcome Back, HR Team</h2>
                                <p className="text-slate-400 font-medium max-w-md">
                                    You have 4 pending approvals and 12 upcoming onboarding sessions this week.
                                    Let's streamline your workforce operations.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 text-center md:text-left">Current System Status</div>
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-xl font-black text-blue-400">98%</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-black">Attendance</div>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div className="text-center">
                                        <div className="text-xl font-black text-emerald-400">12</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-black">Active Tasks</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categorized Modules */}
                    {categories.map((category) => (
                        <div key={category.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2.5 rounded-xl bg-white shadow-sm ring-1 ring-slate-200`}>
                                    <category.icon className={`h-5 w-5 text-slate-600`} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{category.name}</h3>
                                <div className="flex-1 h-px bg-slate-200 ml-4"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {category.modules.map((module) => (
                                    <Card
                                        key={module.path}
                                        className="group relative cursor-pointer overflow-hidden border-none bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                                        onClick={() => navigate(module.path)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex flex-col h-full gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors duration-300">
                                                        <module.icon className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" />
                                                    </div>
                                                    <div className="p-1 rounded-full bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{module.title}</h4>
                                                    <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">
                                                        {module.description}
                                                    </p>
                                                </div>

                                                {/* Subtle line at bottom */}
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                            </div>
                                        </CardContent>
                                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
