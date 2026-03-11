import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
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
    Target
} from 'lucide-react';

const employeeCategories = [
    {
        name: "My Development & Growth",
        icon: Star,
        modules: [
            {
                title: "Appraisal & Performance",
                description: "Track your goals, view your ratings, and complete self-evaluations.",
                icon: TrendingUp,
                path: "/appraisal"
            },
            {
                title: "Learning & Development",
                description: "Access training modules, certifications, and upskill recommendations.",
                icon: GraduationCap,
                path: "/learning-development"
            },
            {
                title: "Staff Portfolio",
                description: "Your complete journey, documents, and professional timeline.",
                icon: Users,
                path: "/staff-portfolio"
            }
        ]
    },
    {
        name: "Academics",
        icon: BookOpen,
        modules: [
            {
                title: "Lesson Plan & Curriculum",
                description: "Manage lesson plans, track curriculum progress, sessions, and academic schedules.",
                icon: BookOpen,
                path: "/lesson-plan"
            }
        ]
    },
    {
        name: "My Workplace & Culture",
        icon: Heart,
        modules: [
            {
                title: "Organisation Structure",
                description: "Explore the team hierarchy and connect with your colleagues.",
                icon: Network,
                path: "/org-structure"
            },
            {
                title: "Policy & Guides",
                description: "Access company policies, employee handbook, and cultural guides.",
                icon: BookOpen,
                path: "/policy"
            },
            {
                title: "Engagement & Culture",
                description: "Join community events, surveys, and cultural activities.",
                icon: Heart,
                path: "/engagement"
            }
        ]
    },
    {
        name: "Communications & Life Cycle",
        icon: UserCircle,
        modules: [
            {
                title: "Feedback Hub",
                description: "Give and receive constructive feedback across the organization.",
                icon: MessageSquare,
                path: "/feedback"
            },
            {
                title: "Exit Management",
                description: "Initiate separation or track your exit clearance process.",
                icon: LogOut,
                path: "/exit"
            }
        ]
    }
];

const EmployeeDashboard: React.FC<{ user: { name: string; id: string; department?: string } }> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-10">
            {/* Employee Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-15 -ml-32 -mb-32"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1 shadow-inner">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-1">Happy {new Date().toLocaleDateString(undefined, { weekday: 'long' })}, {user.name.split(' ')[0]}!</h2>
                            <div className="flex items-center gap-3">
                                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">{user.department}</span>
                                <span className="text-indigo-200 text-xs font-medium tracking-wide">Employee ID: {user.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Calendar className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-indigo-300 uppercase font-black tracking-tighter">Attendance</div>
                                <div className="text-lg font-black text-white leading-none">96.4%</div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Target className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-indigo-300 uppercase font-black tracking-tighter">Current Appraisal</div>
                                <div className="text-lg font-black text-white leading-none">Phase 2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Quick Actions/Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-indigo-50/50 border-indigo-100 shadow-sm relative overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">New Certification!</h4>
                                <p className="text-xs text-slate-500">You've completed React Advanced.</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-4 w-full text-xs font-bold text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50" onClick={() => navigate('/learning-development')}>
                            View Certification
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">Goal Setting Active</h4>
                                <p className="text-xs text-slate-500">2 goals pending for Mid-Year review.</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-4 w-full text-xs font-bold text-emerald-600 border border-emerald-200 bg-white hover:bg-emerald-50" onClick={() => navigate('/appraisal')}>
                            Update Goals
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-slate-600">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">Feedback Pending</h4>
                                <p className="text-xs text-slate-500">Share your thoughts on the last event.</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-4 w-full text-xs font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50" onClick={() => navigate('/feedback')}>
                            Give Feedback
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Categorized Modules for Employee */}
            {employeeCategories.map((category) => (
                <div key={category.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                            <category.icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{category.name}</h3>
                        <div className="flex-1 h-px bg-slate-200 ml-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.modules.map((module) => (
                            <Card
                                key={module.path}
                                className="group relative cursor-pointer overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1"
                                onClick={() => navigate(module.path)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <module.icon className="h-6 w-6 text-slate-400 group-hover:text-white transition-all duration-300" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{module.title}</h4>
                                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">
                                                {module.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeDashboard;
