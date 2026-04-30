import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
    TrendingUp,
    MessageSquare,
    Heart,
    LogOut,
    Network,
    BookOpen,
    GraduationCap,
    ChevronRight,
    Users,
    UserCircle,
    Star,
    Award,
    Calendar,
    Target,
    Zap,
    Activity,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    type LucideIcon
} from 'lucide-react';
import { Separator } from '../components/ui/separator';

interface Module {
    title: string;
    description: string;
    icon: LucideIcon;
    path: string;
    color?: string;
}

interface Category {
    name: string;
    icon: LucideIcon;
    modules: Module[];
}

interface User {
    name: string;
    id: string;
    department?: string;
}

const employeeCategories: Category[] = [
    {
        name: "My Development & Growth",
        icon: Star,
        modules: [
            {
                title: "Appraisal Hub",
                description: "Institutional performance governance and strategic KPI mapping.",
                icon: TrendingUp,
                path: "/appraisal",
                color: "indigo"
            },
            {
                title: "Skill Pathways",
                description: "Access curated certifications and upskill recommendations.",
                icon: GraduationCap,
                path: "/skill-pathways",
                color: "emerald"
            },
            {
                title: "Staff Portfolio",
                description: "Your complete longitudinal record and professional timeline.",
                icon: Users,
                path: "/staff-portfolio",
                color: "indigo"
            }
        ]
    },
    {
        name: "Academics",
        icon: BookOpen,
        modules: [
            {
                title: "Curriculum Engine",
                description: "Strategic lesson planning and academic progress auditing.",
                icon: BookOpen,
                path: "/lesson-plan",
                color: "indigo"
            }
        ]
    },
    {
        name: "Workplace & Culture",
        icon: Heart,
        modules: [
            {
                title: "Org Structure",
                description: "Explore the team hierarchy and institutional pods.",
                icon: Network,
                path: "/org-structure",
                color: "indigo"
            },
            {
                title: "Policy & Guides",
                description: "Access institutional directives and culture manuals.",
                icon: BookOpen,
                path: "/policy",
                color: "indigo"
            },
            {
                title: "Engagement Hub",
                description: "Join community events and cultural synthesis activities.",
                icon: Heart,
                path: "/engagement",
                color: "rose"
            }
        ]
    },
    {
        name: "Communications",
        icon: UserCircle,
        modules: [
            {
                title: "Feedback 360",
                description: "Multi-rater qualitative feedback and sentiment capture.",
                icon: MessageSquare,
                path: "/feedback",
                color: "orange"
            },
            {
                title: "Exit Management",
                description: "Institutional separation and offboarding governance.",
                icon: LogOut,
                path: "/exit",
                color: "rose"
            }
        ]
    }
];

const EmployeeDashboard: React.FC<{ user: User }> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-20 pb-20 animate-in fade-in duration-1000">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 xl:p-12 text-white shadow-xl border border-slate-800 group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-10 -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600 rounded-full blur-[100px] opacity-10 -ml-40 -mb-40" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center p-2 border border-white/20 transition-all duration-300">
                            <div className="w-full h-full rounded-xl bg-blue-600 flex items-center justify-center text-4xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight">
                                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, <br />
                                <span className="text-blue-400">{user.name.split(' ')[0]}</span>
                            </h2>
                            <div className="flex items-center gap-4">
                                <Badge className="bg-white/10 text-white px-4 py-1 rounded-full text-xs font-bold border border-white/20">{user.department || 'General Staff'}</Badge>
                                <Separator orientation="vertical" className="h-4 bg-white/20" />
                                <span className="text-slate-400 text-xs font-medium">ID: {user.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all cursor-default">
                            <div className="p-4 bg-blue-500/20 rounded-xl">
                                <Activity className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Persistence</div>
                                <div className="text-2xl font-bold text-white tracking-tight">96.4%</div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all cursor-default">
                            <div className="p-4 bg-blue-500/20 rounded-xl">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Appraisal</div>
                                <div className="text-2xl font-bold text-white tracking-tight">Phase 2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & High-Contrast Notifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { title: "Certificate Trace", desc: "React Professional Persistence", icon: Award, color: "indigo", route: "/skill-pathways", badge: "New" },
                    { title: "Strategic Review", desc: "2 Pending Mid-Cycle Goals", icon: Target, color: "emerald", route: "/appraisal", badge: "Active" },
                    { title: "Sentiment Audit", desc: "Institutional Leadership FB", icon: MessageSquare, color: "orange", route: "/feedback", badge: "Action Required" }
                ].map((action, i) => (
                    <Card key={i} className="group relative p-1 transition-all duration-300 border border-slate-200 shadow-md hover:shadow-xl overflow-hidden rounded-3xl">
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-${action.color}-500 group-hover:w-2 transition-all duration-300`} />
                        <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full bg-white">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-6 bg-white rounded-3xl p-6 bg-white rounded-3xl text-${action.color}-600 shadow-inner border border-slate-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
                                    <action.icon className="w-8 h-8" />
                                </div>
                                <Badge className={`bg-${action.color}-50 text-${action.color}-600 border-none rounded-lg text-[9px] font-black uppercase tracking-widest px-3 py-1`}>{action.badge}</Badge>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 tracking-tight">{action.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                            </div>
                            <Button 
                                className={`mt-8 w-full h-12 rounded-xl bg-${action.color === 'indigo' ? 'blue' : action.color}-600 hover:bg-slate-900 text-white font-bold transition-all flex items-center justify-center gap-2`}
                                onClick={() => navigate(action.route)}
                            >
                                Take Action
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Premium Institutional Module Grid */}
            {employeeCategories.map((category) => (
                <div key={category.name} className="animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-lg">
                            <category.icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {category.name}
                            </h3>
                            <p className="text-xs font-medium text-slate-400">Institutional Module Cluster</p>
                        </div>
                        <div className="flex-1 h-px bg-slate-100 ml-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {category.modules.map((module) => (
                            <Card
                                key={module.path}
                                className="group relative cursor-pointer overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-xl hover:border-blue-200 rounded-2xl min-h-[260px]"
                                onClick={() => navigate(module.path)}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 group-hover:bg-indigo-500/10 transition-all duration-1000`} />
                                <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-600 transition-all duration-300">
                                            <module.icon className="h-6 w-6 text-blue-600 group-hover:text-white" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-all duration-300">
                                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-0.5 bg-blue-600 rounded-full" />
                                            <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">{module.title}</h4>
                                        </div>
                                        <p className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
                                            {module.title}
                                        </p>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            {module.description}
                                        </p>
                                    </div>
                                </CardContent>
                                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-indigo-600 group-hover:w-full transition-all duration-1000" />
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeDashboard;
