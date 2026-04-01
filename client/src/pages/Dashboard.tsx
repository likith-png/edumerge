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
    Calendar,
    XCircle,
    Zap,
    Settings2,
    Lock,
    Unlock,
    Settings,
    ShieldCheck
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerTeamDashboard from './ManagerTeamDashboard';
import { Switch } from '../components/ui/switch';

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
                title: "Control Tower",
                description: "Real-time HRMS command centre — plug-and-play widgets, GOI view, payroll readiness, approvals and more.",
                icon: Zap,
                path: "/control-tower"
            },
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
    const [searchQuery, setSearchQuery] = React.useState("");
    const pinInputRef = React.useRef<HTMLInputElement>(null);

    const isEmployee = role === 'EMPLOYEE';
    const isManager = role === 'MANAGER';

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [showPinModal, setShowPinModal] = React.useState(false);
    const [pinInput, setPinInput] = React.useState("");
    const [pinError, setPinError] = React.useState(false);
    const [hiddenModules, setHiddenModules] = React.useState<string[]>(() => {
        const saved = localStorage.getItem('hrms_hidden_modules');
        return saved ? JSON.parse(saved) : [];
    });

    const handlePinSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (pinInput === "2012") {
            setShowPinModal(false);
            setIsSettingsOpen(true);
            setPinInput("");
            setPinError(false);
        } else {
            setPinError(true);
            setPinInput("");
            setTimeout(() => {
                setPinError(false);
                pinInputRef.current?.focus();
            }, 1000);
        }
    };

    React.useEffect(() => {
        if (showPinModal) {
            setTimeout(() => pinInputRef.current?.focus(), 100);
        }
    }, [showPinModal]);

    const toggleModuleVisibility = (moduleTitle: string) => {
        const newHidden = hiddenModules.includes(moduleTitle)
            ? hiddenModules.filter(t => t !== moduleTitle)
            : [...hiddenModules, moduleTitle];
        
        setHiddenModules(newHidden);
        localStorage.setItem('hrms_hidden_modules', JSON.stringify(newHidden));
    };

    const filteredCategories = (searchQuery 
        ? categories.map(cat => ({
            ...cat,
            modules: cat.modules.filter(mod => 
                (mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                !hiddenModules.includes(mod.title)
            )
        })).filter(cat => cat.modules.length > 0)
        : categories.map(cat => ({
            ...cat,
            modules: cat.modules.filter(mod => !hiddenModules.includes(mod.title))
        })).filter(cat => cat.modules.length > 0)
    );

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
                    <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, #003f98 0%, #1a56be 100%)' }}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl opacity-10 -ml-32 -mb-32"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1 w-full md:w-auto text-left">
                                <h2 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Welcome Back, HR Team</h2>
                                <p className="text-slate-400 font-medium max-w-md mb-6">
                                    Let's streamline your workforce operations.
                                </p>

                                {/* Module Search */}
                                <div className="max-w-md relative group">
                                    <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none transition-all group-focus-within:pl-4">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                            <Network className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search modules or submodules..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-4 text-sm font-bold placeholder:text-slate-500 transition-all focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none"
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-400"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                </div>



                            {/* Settings Gateway */}
                            <button 
                                onClick={() => setShowPinModal(true)}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-105 transition-all group relative mt-[-10px]"
                            >
                                <Settings2 className="w-4 h-4 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
                                <div className="absolute -top-1 -right-1 p-0.5 bg-amber-400 rounded-full border border-[#1a56be]">
                                    <Lock className="w-1.5 h-1.5 text-[#003f98]" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Categorized Modules */}
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <div className="p-4 rounded-3xl bg-white shadow-sm inline-block mb-4">
                                <Network className="w-8 h-8 text-slate-300" />
                            </div>
                            <h4 className="font-black text-slate-800 tracking-tight">No modules found</h4>
                            <p className="text-sm text-slate-500 font-medium">Try searching for something else, like "Onboarding" or "Academics"</p>
                        </div>
                    ) : filteredCategories.map((category) => (
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
                                        className="group relative cursor-pointer overflow-hidden border-none bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1"
                                        onClick={() => navigate(module.path)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex flex-col h-full gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors duration-200">
                                                        <module.icon className="h-6 w-6 text-slate-400 group-hover:text-blue-800 transition-colors duration-300" />
                                                    </div>
                                                    <div className="p-1 rounded-full bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-black text-slate-900 mb-1 group-hover:text-blue-800 transition-colors">{module.title}</h4>
                                                    <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">
                                                        {module.description}
                                                    </p>
                                                </div>

                                                {/* Subtle line at bottom */}
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                            </div>
                                        </CardContent>
                                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-100 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PIN Entry Modal */}
            {showPinModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-sm glass-card border border-white/20 rounded-[40px] p-8 shadow-2xl relative overflow-hidden bg-white/90">
                        <button 
                            onClick={() => { setShowPinModal(false); setPinInput(""); }}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="inline-flex p-4 rounded-3xl bg-blue-50 text-blue-600 ring-4 ring-blue-100">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Security Verification</h3>
                                <p className="text-sm text-slate-500 font-medium">Enter secret PIN to access Developer Room</p>
                            </div>

                            <form onSubmit={handlePinSubmit} className="space-y-4">
                                <div 
                                    onClick={() => pinInputRef.current?.focus()}
                                    className="flex justify-center gap-3 cursor-text"
                                >
                                    {[0, 1, 2, 3].map((i) => (
                                        <div 
                                            key={i} 
                                            className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${pinError ? 'border-red-400 bg-red-50 text-red-600 animate-shake' : pinInput.length > i ? 'border-blue-600 bg-blue-50 text-blue-800 scale-105' : 'border-slate-200 bg-slate-50'}`}
                                        >
                                            {pinInput.length > i ? '•' : ''}
                                        </div>
                                    ))}
                                </div>
                                <input 
                                    ref={pinInputRef}
                                    autoFocus
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={4}
                                    value={pinInput}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
                                        setPinInput(val);
                                        if (val.length === 4 && val === "2012") {
                                            setTimeout(() => {
                                                setShowPinModal(false);
                                                setIsSettingsOpen(true);
                                                setPinInput("");
                                            }, 300);
                                        } else if (val.length === 4) {
                                            setPinError(true);
                                            setTimeout(() => { 
                                                setPinInput(""); 
                                                setPinError(false);
                                                pinInputRef.current?.focus();
                                            }, 1000);
                                        }
                                    }}
                                    className="absolute opacity-0 pointer-events-none inset-0 w-full h-full"
                                    style={{ caretColor: 'transparent' }}
                                />
                                <p className={`text-xs font-bold transition-all ${pinError ? 'text-red-500 opacity-100' : 'text-slate-400 opacity-0'}`}>
                                    Incorrect PIN. Access Denied.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Developer Configuration Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-lg animate-in fade-in duration-500">
                    <div className="w-full max-w-4xl h-[85vh] glass-card border border-white/20 rounded-[48px] shadow-2xl relative flex flex-col overflow-hidden bg-white/95">
                        {/* Header */}
                        <div className="shrink-0 p-8 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-slate-900 shadow-xl shadow-slate-900/20">
                                    <Settings className="w-6 h-6 text-white animate-[spin_4s_linear_infinite]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                        Developer Configuration <span className="text-[10px] py-0.5 px-2 bg-blue-100 text-blue-700 rounded-full font-black uppercase leading-tight">Master Admin</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic opacity-60">Visibility Control Room</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsSettingsOpen(false)}
                                className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
                            >
                                Save & Exit
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-8 bg-slate-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {categories.map(category => (
                                    <div key={category.name} className="space-y-4">
                                        <div className="flex items-center gap-2 px-2">
                                            <category.icon className="w-4 h-4 text-slate-400" />
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{category.name}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {category.modules.map(module => (
                                                <div 
                                                    key={module.title}
                                                    className={`p-4 rounded-3xl border transition-all flex items-center justify-between group ${hiddenModules.includes(module.title) ? 'bg-white/50 border-slate-100 opacity-60' : 'bg-white border-white shadow-sm ring-1 ring-slate-100'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl ${hiddenModules.includes(module.title) ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                                                            <module.icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-slate-800">{module.title}</h4>
                                                            <p className="text-[10px] text-slate-400 font-medium">{module.description.substring(0, 40)}...</p>
                                                        </div>
                                                    </div>
                                                    <Switch 
                                                        checked={!hiddenModules.includes(module.title)}
                                                        onCheckedChange={() => toggleModuleVisibility(module.title)}
                                                        className="data-[state=checked]:bg-blue-700"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="shrink-0 p-6 border-t border-slate-100 bg-white/50 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Unlock className="w-3 h-3" />
                                <span>Security Level 5</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-300">Config: LOCAL_STORAGE_PERSISTENCE_V1</p>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
