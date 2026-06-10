import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
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
    PieChart,
    Calendar,
    XCircle,
    Zap,
    Settings2,
    Lock,
    Unlock,
    Settings,
    ShieldCheck,
    Truck,
    Search,
    Building2,
    Activity,
    Brain,
    UserCheck
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerTeamDashboard from './ManagerTeamDashboard';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';


const categories = [
    {
        name: "Talent Acquisition",
        icon: Users,
        color: "blue",
        modules: [
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
                title: "edumerge co-pilot",
                description: "Chat with edumerge's unified AI assistant — get answers across academics, finance, compliance, grievances, paper evaluation and mentoring.",
                icon: Brain,
                path: "/ai-copilot"
            },
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
            },
            {
                title: "Academic co-pilot",
                description: "AI-driven timetable scheduling, workload conflict alerts, and AICTE compliance scorecards.",
                icon: BookOpen,
                path: "/academic-guide"
            },
            {
                title: "Online Paper Evaluation",
                description: "AI-assisted scoring tool utilizing handwritten script OCR scans and custom grading rubrics.",
                icon: Brain,
                path: "/online-paper-evaluation"
            },
            {
                title: "Mentor Management",
                description: "Early warning student risk tracking, NAAC Criterion 5 mentoring compliance, and automated parent communication.",
                icon: UserCheck,
                path: "/mentor-management"
            },
            {
                title: "Academic Content Intelligence",
                description: "AI-powered curriculum content generation system mapped to course outcomes and syllabus units.",
                icon: Brain,
                path: "/academic-content-intelligence"
            },
            {
                title: "Academic Credit Bank",
                description: "NEP-compliant Academic Bank of Credits (ABC) portal. Sync credits via DigiLocker, manage credit transfers, and push academic records.",
                icon: GraduationCap,
                path: "/academic-credit-bank"
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
                path: "/leave/advanced"
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
                title: "Capacity Planner",
                description: "Visualise staff strength, identify gaps, and model future hiring needs against regulatory ratios.",
                icon: Network,
                path: "/capacity-planner"
            },
            {
                title: "Principal Dashboard",
                description: "Smart KPIs, student analytics, staff performance, finance health, and action centre for institution leadership.",
                icon: GraduationCap,
                path: "/principal-dashboard"
            },
            {
                title: "HRMS Control Tower",
                description: "Real-time HRMS command centre — plug-and-play widgets, payroll readiness, approvals and more.",
                icon: Zap,
                path: "/control-tower"
            },
            {
                title: "Workforce Intelligence",
                description: "Track workforce analytics, stability, retention indexes, and faculty retention indicators.",
                icon: Activity,
                path: "/workforce-intelligence"
            },
            {
                title: "Grievance Intelligence",
                description: "AI-powered statutory POSH case analytics, predictive escalation models, and sentiment-based resolution tracking.",
                icon: MessageSquare,
                path: "/grievance-intelligence"
            },
            {
                title: "Compliance & NAAC",
                description: "AI-driven compliance risk prediction, automated document gaps detection, and real-time NAAC criteria progress audits.",
                icon: ShieldCheck,
                path: "/compliance-naac"
            },
            {
                title: "Finance Intelligence",
                description: "AI-predicted billing collections, cash flow anomaly detection, fee aging analysis, and proactive recovery modeling.",
                icon: TrendingUp,
                path: "/finance-intelligence"
            }
        ]
    },
    {
        name: "Operations",
        icon: Truck,
        color: "cyan",
        modules: [
            {
                title: "Vehicle Management",
                description: "Fleet registry, compliance engine, fuel tracking, driver management, routes, fees and analytics.",
                icon: Truck,
                path: "/vehicle-management"
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
            },
            {
                title: "Workforce Intelligence",
                description: "Institution health across continuity, control, reputation and scale.",
                icon: Activity,
                path: "/workforce-intelligence"
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
    const [configTab, setConfigTab] = React.useState<'hrms' | 'ai'>('hrms');
    const [hiddenModules, setHiddenModules] = React.useState<string[]>(() => {
        const saved = localStorage.getItem('hrms_hidden_modules');
        return saved ? JSON.parse(saved) : [
            "Probation Management",
            "Appraisal & Performance",
            "Leave Management",
            "Feedback",
            "Exit Management",
            "Vehicle Management"
        ];
    });

    const aiModuleTitles = React.useMemo(() => [
        "edumerge co-pilot",
        "Academic co-pilot",
        "Online Paper Evaluation",
        "Workforce Intelligence",
        "Grievance Intelligence",
        "Compliance & NAAC",
        "Finance Intelligence",
        "Mentor Management",
        "Academic Content Intelligence"
    ], []);

    const enableAllAiModules = () => {
        const nextHidden = hiddenModules.filter(title => !aiModuleTitles.includes(title));
        setHiddenModules(nextHidden);
        localStorage.setItem('hrms_hidden_modules', JSON.stringify(nextHidden));
    };

    const disableAllAiModules = () => {
        const newHidden = [...hiddenModules];
        aiModuleTitles.forEach(title => {
            if (!newHidden.includes(title)) {
                newHidden.push(title);
            }
        });
        setHiddenModules(newHidden);
        localStorage.setItem('hrms_hidden_modules', JSON.stringify(newHidden));
    };

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

    const [viewMode, setViewMode] = React.useState<'hrms' | 'ai'>(() => {
        const saved = localStorage.getItem('hrms_dashboard_view_mode');
        return (saved === 'ai' || saved === 'hrms') ? saved : 'hrms';
    });

    React.useEffect(() => {
        localStorage.setItem('hrms_dashboard_view_mode', viewMode);
    }, [viewMode]);

    const filteredCategories = React.useMemo(() => {
        const aiModuleTitles = [
            "edumerge co-pilot",
            "Academic co-pilot",
            "Online Paper Evaluation",
            "Workforce Intelligence",
            "Grievance Intelligence",
            "Compliance & NAAC",
            "Finance Intelligence",
            "Mentor Management",
            "Academic Content Intelligence"
        ];

        return categories.map(cat => {
            const filteredModules = cat.modules.filter(mod => {
                // 1. Filter by hidden modules
                if (hiddenModules.includes(mod.title)) return false;

                // 2. Filter by viewMode (HRMS vs AI Innovations)
                const isAiModule = aiModuleTitles.includes(mod.title);
                if (viewMode === 'hrms' && isAiModule) return false;
                if (viewMode === 'ai' && !isAiModule) return false;

                // 3. Filter by search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (
                        mod.title.toLowerCase().includes(query) ||
                        mod.description.toLowerCase().includes(query) ||
                        cat.name.toLowerCase().includes(query)
                    );
                }

                return true;
            });

            return {
                ...cat,
                modules: filteredModules
            };
        }).filter(cat => cat.modules.length > 0);
    }, [viewMode, searchQuery, hiddenModules]);

    return (
        <Layout
            title={isEmployee ? "Employee Portal" : isManager ? "Manager Console" : (viewMode === 'ai' ? "edumerge co-pilot" : "HRMS Platform")}
            description={isEmployee ? `Welcome back, ${user.name}` : isManager ? `Team Overview - ${user.name}` : (viewMode === 'ai' ? "AI-Powered Institution Intelligence Co-Pilot" : "Unified Human Resource Management Environment")}
            icon={isEmployee ? Users : isManager ? Briefcase : (viewMode === 'ai' ? Brain : Network)}
        >
            {isEmployee ? (
                <EmployeeDashboard user={user} />
            ) : isManager ? (
                <ManagerTeamDashboard />
            ) : (
                <div className="space-y-8 pb-10">
                    {/* Welcome Banner */}
                    <div className={`border rounded-xl p-8 shadow-sm transition-all duration-500 ${viewMode === 'ai' ? 'bg-gradient-to-r from-white via-purple-50/10 to-indigo-50/20 border-purple-200 shadow-purple-100/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-slate-900">Welcome back, Admin</h2>
                                    {viewMode === 'ai' && (
                                        <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 rounded-full animate-pulse">
                                            AI Innovations Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-500 mt-1">
                                    {viewMode === 'ai' 
                                        ? "Exploring the next-generation AI-driven institution command center roadmap."
                                        : "Manage institutional operations and staff intelligence."}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                                    <div className="w-full sm:w-80 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search modules..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-10 border-slate-200 focus:ring-blue-500 rounded-lg bg-white"
                                        />
                                    </div>
                                    <div className="w-full sm:w-64">
                                        <Select
                                            value={viewMode}
                                            onValueChange={(val: 'hrms' | 'ai') => setViewMode(val)}
                                        >
                                            <SelectTrigger className="h-10 border-slate-200 focus:ring-blue-500 rounded-lg bg-white text-slate-700 font-medium">
                                                <SelectValue placeholder="Select Module Suite" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hrms" className="text-slate-700">
                                                    <span className="flex items-center gap-2">
                                                        <Network className="h-4 w-4 text-blue-500" />
                                                        HRMS Platform
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="ai" className="text-slate-700">
                                                    <span className="flex items-center gap-2">
                                                        <Brain className="h-4 w-4 text-purple-500 animate-pulse" />
                                                        AI - Innovations & Roadmap
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            
                            <Button
                                variant="outline"
                                onClick={() => setShowPinModal(true)}
                                className="border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 shrink-0 self-start md:self-center"
                            >
                                <Settings2 className="w-4 h-4" /> Configuration
                            </Button>
                        </div>
                    </div>

                    {/* Module Categories */}
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
                            <Network className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                            <h4 className="font-semibold text-slate-900">No modules found</h4>
                            <p className="text-sm text-slate-500 mt-1">Try a different search query</p>
                        </div>
                    ) : filteredCategories.map((category) => (
                        <div key={category.name} className="space-y-4">
                            <div className="flex items-center gap-3 px-1">
                                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                                    <category.icon className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{category.name}</h3>
                                <div className="flex-1 h-px bg-slate-200 ml-2"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {category.modules.map((module) => (
                                    <Card
                                        key={module.path}
                                        className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group border-slate-200"
                                        onClick={() => {
                                            if (module.path.endsWith('.html')) {
                                                window.location.href = module.path;
                                            } else {
                                                navigate(module.path);
                                            }
                                        }}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 transition-colors">
                                                    <module.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">{module.title}</h4>
                                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                                        {module.description}
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform self-center" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PIN Entry Modal (Glass) */}
            {showPinModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="w-full max-w-sm glass-card border-white/60 p-10 shadow-2xl relative overflow-hidden text-center space-y-8">
                        {/* Security header */}
                        <div className="mx-auto w-20 h-20 glass-icon-container bg-blue-50 text-blue-600 border-white/80 scale-110 mb-2">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-xl premium-text">Security Protocol</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-tight">Enter authorization PIN to access Governance Tier</p>
                        </div>

                        <form onSubmit={handlePinSubmit} className="space-y-6">
                            <div 
                                onClick={() => pinInputRef.current?.focus()}
                                className="flex justify-center gap-4 cursor-text"
                            >
                                {[0, 1, 2, 3].map((i) => (
                                    <div 
                                        key={i} 
                                        className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${pinError ? 'border-rose-400 bg-rose-50 text-rose-600 animate-shake' : pinInput.length > i ? 'border-slate-900 bg-slate-900 text-white scale-110 shadow-xl' : 'glass-card border-white/60 bg-white/40'}`}
                                    >
                                        {pinInput.length > i ? '•' : ''}
                                    </div>
                                ))}
                            </div>
                            <input 
                                ref={pinInputRef}
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
                            />
                            <p className={`text-[10px] font-black uppercase tracking-widest transition-all ${pinError ? 'text-rose-600 opacity-100' : 'text-slate-400 opacity-0'}`}>
                                Authorization Failed. Protocol Active.
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* Developer Configuration Modal (Premium Glass) */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-700">
                    <div className="w-full max-w-5xl h-[85vh] glass-panel border-white/20 rounded-[48px] shadow-2xl relative flex flex-col overflow-hidden">
                        {/* Ambient glow in modal */}
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]"></div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]"></div>

                        {/* Header */}
                        <div className="shrink-0 p-10 border-b border-white/10 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-3xl bg-white text-slate-900 shadow-2xl">
                                    <Settings className="w-8 h-8 animate-[spin_10s_linear_infinite]" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                                        Governance Configuration <span className="text-[10px] py-1 px-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full font-black uppercase tracking-widest leading-none">Security Tier 5</span>
                                    </h2>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Institutional Visibility Control Matrix</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsSettingsOpen(false)}
                                className="px-10 py-4 rounded-2xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                            >
                                Persist Changes
                            </button>
                        </div>

                        {/* Sub-tabs switchers */}
                        <div className="shrink-0 px-10 py-3 border-b border-white/10 bg-black/10 flex gap-4 relative z-10">
                            <button
                                onClick={() => setConfigTab('hrms')}
                                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${configTab === 'hrms' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                HRMS Core Modules
                            </button>
                            <button
                                onClick={() => setConfigTab('ai')}
                                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${configTab === 'ai' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 border border-purple-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                AI Co-Pilots & Intelligence
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-10 space-y-12 relative z-10 no-scrollbar">
                            {configTab === 'hrms' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {categories.map(category => {
                                        const hrmsModules = category.modules.filter(m => !aiModuleTitles.includes(m.title));
                                        if (hrmsModules.length === 0) return null;
                                        return (
                                            <div key={category.name} className="space-y-6">
                                                <div className="flex items-center gap-4 px-4">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">{category.name}</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {hrmsModules.map(module => (
                                                        <div 
                                                            key={module.title}
                                                            className={`p-5 rounded-[28px] border transition-all flex items-center justify-between group ${hiddenModules.includes(module.title) ? 'bg-white/5 border-white/5 opacity-40' : 'bg-white/10 border-white/10 hover:border-white/30 hover:bg-white/15'}`}
                                                        >
                                                            <div className="flex items-center gap-5">
                                                                <div className={`p-3 rounded-2xl shadow-inner ${hiddenModules.includes(module.title) ? 'bg-white/5 text-white/20' : 'bg-white text-slate-900'}`}>
                                                                    <module.icon className="w-5 h-5" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <h4 className="text-sm font-black text-white tracking-tight">{module.title}</h4>
                                                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{category.name} Integration</p>
                                                                </div>
                                                            </div>
                                                            <Switch 
                                                                checked={!hiddenModules.includes(module.title)}
                                                                onCheckedChange={() => toggleModuleVisibility(module.title)}
                                                                className="data-[state=checked]:bg-blue-600 border-none shadow-xl scale-110"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* AI Master control panel */}
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-[36px] flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="space-y-1 text-center sm:text-left">
                                            <h4 className="text-sm font-black text-white uppercase tracking-wider">AI Co-Pilots Master Switches</h4>
                                            <p className="text-[10px] text-white/40 font-bold uppercase">Toggle visibility of all neural command widgets</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={disableAllAiModules}
                                                className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Disable All AI Modules
                                            </button>
                                            <button 
                                                onClick={enableAllAiModules}
                                                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Enable All AI Modules
                                            </button>
                                        </div>
                                    </div>

                                    {/* AI modules listing */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(() => {
                                            const renderedAiTitles = new Set();
                                            const aiList: any[] = [];
                                            categories.forEach(cat => {
                                                cat.modules.forEach(mod => {
                                                    if (aiModuleTitles.includes(mod.title) && !renderedAiTitles.has(mod.title)) {
                                                        renderedAiTitles.add(mod.title);
                                                        aiList.push({ ...mod, categoryName: cat.name });
                                                    }
                                                });
                                            });

                                            return aiList.map(module => (
                                                <div 
                                                    key={module.title}
                                                    className={`p-6 rounded-[32px] border transition-all flex items-center justify-between gap-4 ${hiddenModules.includes(module.title) ? 'bg-white/5 border-white/5 opacity-40' : 'bg-white/10 border-white/10 hover:border-white/30 hover:bg-white/15'}`}
                                                >
                                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                                        <div className={`p-3.5 rounded-2xl shrink-0 shadow-inner ${hiddenModules.includes(module.title) ? 'bg-white/5 text-white/20' : 'bg-white text-slate-900'}`}>
                                                            <module.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="space-y-1 min-w-0">
                                                            <h4 className="text-sm font-black text-white tracking-tight truncate">{module.title}</h4>
                                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{module.categoryName} Integration</p>
                                                        </div>
                                                    </div>
                                                    <Switch 
                                                        checked={!hiddenModules.includes(module.title)}
                                                        onCheckedChange={() => toggleModuleVisibility(module.title)}
                                                        className="data-[state=checked]:bg-purple-600 border-none shadow-xl scale-110 shrink-0"
                                                    />
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="shrink-0 px-10 py-6 border-t border-white/10 bg-black/20 flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Encrypted Session Active</span>
                            </div>
                            <div className="flex gap-4">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">v2.0.26-ALPHA</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
