import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    AlertTriangle, Settings, Clock, Home, Shield, CheckCircle,
    Search, Plus, Calendar, TrendingUp, Monitor, Info, Users, FileText,
    Target, Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { usePersona } from '../contexts/PersonaContext';

// Types
interface KPI {
    id: number;
    title: string;
    description: string;
    status: 'Pending' | 'Met' | 'Not Met';
}

interface TimelineEvent {
    id: number;
    date: string;
    event: string;
    details: string;
}

interface Employee {
    id: number;
    name: string;
    department: string;
    designation: string;
    joining_date: string;
    status: string;
    review_status?: 'Pending' | 'Submitted' | 'Reviewed' | 'Confirmed' | 'Terminated';
    review_date?: string;
    probation_end_date: string;
    next_review_date: string;
    performance_score?: number;
    risk_level?: 'Low' | 'Medium' | 'High';
    sla_days_remaining?: number;
    kpis?: KPI[];
    timeline?: TimelineEvent[];
    policyId?: number;
    currentStageId?: string;
}

// Helper to determine stages dynamically
const getIcon = (iconName: string | any) => {
    // If it's already a component (legacy), return it
    if (typeof iconName !== 'string') return iconName;

    const icons: any = { Target, Clock, Users, Shield, AlertTriangle, CheckCircle, Plus, Settings };
    return icons[iconName] || Target;
};

const ProbationDashboard: React.FC = () => {
    const { role, user } = usePersona();
    const isManager = role === 'MANAGER';
    const isHR = role === 'HR_ADMIN' || role === 'ADMIN';

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [actionType, setActionType] = useState<'Review' | 'Decision' | 'KPI' | 'History' | 'Hire' | null>(null);
    const [stageConfigs, setStageConfigs] = useState<Record<string, any>>(() => {
        const saved = localStorage.getItem('probation_stage_configs');
        return saved ? JSON.parse(saved) : null;
    });

    // Dynamic Configuration State
    const [stageDefinitions, setStageDefinitions] = useState<any[]>([]);
    const [policies, setPolicies] = useState<any[]>([]);

    useEffect(() => {
        const loadConfig = () => {
            const savedDefs = localStorage.getItem('probation_stage_definitions');
            const savedPolicies = localStorage.getItem('probation_policies');

            if (savedDefs) {
                setStageDefinitions(JSON.parse(savedDefs));
            } else {
                // Default fallback if nothing configured
                setStageDefinitions([
                    { id: 'kpi', label: 'KPI Setting', icon: 'Target', color: 'indigo' },
                    { id: '30_day', label: '30-Day Check-in', icon: 'Clock', color: 'blue' },
                    { id: '60_day', label: '60-Day Review', icon: 'Users', color: 'emerald' },
                    { id: '90_day', label: 'Final Assessment', icon: 'Shield', color: 'amber' },
                    { id: 'decision', label: 'Confirmation Decision', icon: 'AlertTriangle', color: 'rose' }
                ]);
            }

            if (savedPolicies) setPolicies(JSON.parse(savedPolicies));
        };
        loadConfig();

        // Listen for storage updates from Config page
        window.addEventListener('storage', loadConfig);
        return () => window.removeEventListener('storage', loadConfig);
    }, []);

    const getEmployeeStages = (emp: Employee | null) => {
        // Default stages if no policy or definitions
        const defaults = [
            { id: 'kpi', label: 'KPI Setting', icon: Target, color: 'indigo' },
            { id: '30_day', label: '30-Day Check', icon: Clock, color: 'blue' },
            { id: '60_day', label: '60-Day Review', icon: Users, color: 'emerald' },
            { id: '90_day', label: 'Final Assessment', icon: Shield, color: 'amber' },
            { id: 'decision', label: 'Confirmation', icon: AlertTriangle, color: 'rose' }
        ];

        if (!emp) return defaults;

        // Find policy
        const policy = policies.find(p => p.id === emp.policyId);

        // If policy exists, map stages. If not, check if we have custom definitions to fallback to (e.g. legacy linear default)
        // For now, if no policy, use defaults.
        if (!policy) return defaults;

        return policy.stages.map((stageId: string) => {
            const def = stageDefinitions.find(d => d.id === stageId);
            return def ? { ...def, icon: getIcon(def.icon) } : null;
        }).filter(Boolean);
    };

    // Filtered data for view
    const [activeTab, setActiveTab] = useState('probation');

    const getFilteredEmployees = () => {
        let baseList = isManager ? employees.filter(e => e.department === user.department) : employees;

        return baseList.filter(emp => {
            const status = emp.review_status || 'Pending';

            if (activeTab === 'probation') {
                // Show Pending, In Progress, Extended, PIP
                return ['Pending', 'Submitted', 'Reviewed', 'In Progress'].includes(status) ||
                    status.startsWith('Extended') ||
                    status.includes('PIP');
            }
            if (activeTab === 'completed') {
                return status === 'Confirmed';
            }
            if (activeTab === 'rejected') {
                return ['Terminated', 'Separated', 'Rejected'].includes(status);
            }
            return true;
        });
    };

    const visibleEmployees = getFilteredEmployees();

    // Form State
    const [reviewForm, setReviewForm] = useState({ feedback: '', ratings: {} as Record<string, string> });
    const [decisionForm, setDecisionForm] = useState({ decision: 'Confirmed', extendedUntil: '', pipReason: '' });
    const [kpiForm, setKpiForm] = useState({ title: '', description: '', metricType: 'rating', weightage: '30' });
    const [hireForm, setHireForm] = useState({ name: '', department: 'Computer Science', designation: 'Asst. Professor', joiningDate: new Date().toISOString().split('T')[0] });
    const [previewLetter, setPreviewLetter] = useState<{ open: boolean; title: string; content: string }>({ open: false, title: '', content: '' });

    // New Feedback and Profile States
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'Performance' | 'Culture' | 'Technical' | 'General'>('General');
    const [feedbackData, setFeedbackData] = useState({ rating: '3', comment: '', strengths: '', improvements: '' });

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            const saved = localStorage.getItem('probation_stage_configs');
            if (saved) setStageConfigs(JSON.parse(saved));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        fetch('/api/probation/dashboard')
            .then(res => res.json())
            .then(data => {
                const enhancedEmployees = (data.employees || []).map((emp: any) => ({
                    ...emp,
                    policyId: emp.policyId || 1,
                    currentStageId: emp.currentStageId || (emp.review_status === 'Submitted' ? 'decision' : '90_day'),
                    kpis: emp.kpis || [
                        { id: 1, title: 'Technical Integration', description: 'Mastery of internal frameworks', status: 'Met' },
                        { id: 2, title: 'Project Delivery', description: 'On-time delivery of first module', status: 'Pending' }
                    ],
                    timeline: emp.timeline || [
                        { id: 1, date: '2024-01-15', event: 'Probation Kickoff', details: 'Initial onboarding and goal setting session.' },
                        { id: 2, date: '2024-02-15', event: '30-Day Sync', details: 'Manager review: Performing well, culture fit confirmed.' }
                    ]
                }));
                setEmployees(enhancedEmployees);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching probation data, using mock:", err);
                const mockEmployees: Employee[] = [
                    {
                        id: 101, name: "Ms. Reshma Binu Prasad", department: "Computer Science", designation: "Asst. Professor",
                        joining_date: "2024-01-10", status: "Probation", review_status: "Pending",
                        probation_end_date: "2024-07-10", next_review_date: "2024-04-10",
                        risk_level: "Low", performance_score: 4.5, currentStageId: "kpi", policyId: 1,
                        timeline: [{ id: 1, date: "2024-01-10", event: "Hired", details: "Joined as Asst. Professor" }]
                    },
                    {
                        id: 102, name: "Ms. Sanchaiyata Majumdar", department: "Computer Science", designation: "Lecturer",
                        joining_date: "2024-01-15", status: "Probation", review_status: "Pending",
                        probation_end_date: "2024-07-15", next_review_date: "2024-04-15",
                        risk_level: "High", performance_score: 2.8, currentStageId: "60_day", policyId: 1,
                        timeline: [
                            { id: 1, date: "2024-01-15", event: "Hired", details: "Joined as Lecturer" },
                            { id: 2, date: "2024-02-15", event: "30-Day Check", details: "Critical feedback on research output" }
                        ]
                    },
                    {
                        id: 103, name: "Dr. R Sedhunivas", department: "Administration", designation: "Registrar",
                        joining_date: "2023-11-20", status: "Probation", review_status: "Submitted",
                        probation_end_date: "2024-05-20", next_review_date: "2024-02-20",
                        risk_level: "Medium", performance_score: 3.9, currentStageId: "decision", policyId: 1,
                        timeline: [
                            { id: 1, date: "2023-11-20", event: "Hired", details: "Registrar induction" },
                            { id: 2, date: "2024-02-10", event: "Final Review", details: "Positive feedback from all departments" }
                        ]
                    },
                    {
                        id: 104, name: "Dr. Ranjita Saikia", department: "Science", designation: "Professor",
                        joining_date: "2023-10-01", status: "Probation", review_status: "Pending",
                        probation_end_date: "2024-04-01", next_review_date: "2024-03-01",
                        risk_level: "Low", performance_score: 4.2, currentStageId: "90_day", policyId: 1,
                        timeline: [
                            { id: 1, date: "2023-10-01", event: "Hired", details: "Joined Science Department" }
                        ]
                    },
                    {
                        id: 105, name: "Mr. Manjit Singh", department: "Physical Education", designation: "Instructor",
                        joining_date: "2024-02-01", status: "Probation", review_status: "Pending",
                        probation_end_date: "2024-08-01", next_review_date: "2024-03-01",
                        risk_level: "Low", performance_score: 4.0, currentStageId: "30_day", policyId: 1,
                        timeline: [
                            { id: 1, date: "2024-02-01", event: "Hired", details: "Joined as PE Instructor" }
                        ]
                    },
                    {
                        id: 106, name: "Mr. Edwin Vimal A", department: "Mathematics", designation: "Lecturer",
                        joining_date: "2023-12-15", status: "Probation", review_status: "Reviewed",
                        probation_end_date: "2024-06-15", next_review_date: "2024-03-15",
                        risk_level: "Medium", performance_score: 3.5, currentStageId: "60_day", policyId: 1,
                        timeline: [
                            { id: 1, date: "2023-12-15", event: "Hired", details: "Joined Mathematics Dept" }
                        ]
                    }
                ];
                setEmployees(mockEmployees);
                setLoading(false);
            });
    };

    const handleReviewSubmit = async () => {
        if (!selectedEmployee) return;

        const stages = getEmployeeStages(selectedEmployee);
        const currentStageIdx = stages.findIndex((s: any) => s.id === selectedEmployee.currentStageId);
        const nextStage = stages[currentStageIdx + 1]?.id || 'completed';

        // Mock update for demo
        const updatedEmployees = employees.map(emp => {
            if (emp.id === selectedEmployee.id) {
                const eventTitle = stages.find((s: any) => s.id === emp.currentStageId)?.label || 'Review';
                return {
                    ...emp,
                    currentStageId: nextStage,
                    review_status: (nextStage === 'decision' || nextStage === 'completed' ? 'Submitted' : 'Pending') as any,
                    review_date: new Date().toISOString().split('T')[0],
                    performance_score: Object.values(reviewForm.ratings).reduce((a, b) => a + parseInt(b), 0) / Object.keys(reviewForm.ratings).length,
                    timeline: [
                        ...(emp.timeline || []),
                        {
                            id: Date.now(),
                            date: new Date().toISOString().split('T')[0],
                            event: `${eventTitle} Completed`,
                            details: `Stage advanced to ${nextStage}. Feedback: ${reviewForm.feedback}`
                        }
                    ]
                };
            }
            return emp;
        });

        setEmployees(updatedEmployees);
        alert(`Stage "${stages.find((s: any) => s.id === selectedEmployee.currentStageId)?.label}" completed. Moving to next phase.`);
        setSelectedEmployee(null);
        setActionType(null);
    };

    const handleHireSubmit = () => {
        if (!hireForm.name) return;

        const newEmployee: Employee = {
            id: Date.now(),
            name: hireForm.name,
            department: hireForm.department,
            designation: hireForm.designation,
            joining_date: hireForm.joiningDate,
            status: 'Probation',
            review_status: 'Pending',
            probation_end_date: new Date(new Date(hireForm.joiningDate).setMonth(new Date(hireForm.joiningDate).getMonth() + 6)).toISOString().split('T')[0],
            next_review_date: new Date(new Date(hireForm.joiningDate).setMonth(new Date(hireForm.joiningDate).getMonth() + 1)).toISOString().split('T')[0],
            risk_level: 'Low',
            performance_score: 0,
            currentStageId: 'kpi',
            policyId: 1,
            timeline: [{ id: 1, date: hireForm.joiningDate, event: 'Hired', details: 'Joined as ' + hireForm.designation }]
        };

        setEmployees([newEmployee, ...employees]);
        setActionType(null);
        setHireForm({ name: '', department: 'Computer Science', designation: 'Asst. Professor', joiningDate: new Date().toISOString().split('T')[0] });
        alert(`New Hire "${hireForm.name}" added and assigned to KPI stage.`);
    };

    const handleKpiSubmit = () => {
        if (!selectedEmployee) return;
        const newKpi: KPI = {
            id: Date.now(),
            title: kpiForm.title,
            description: kpiForm.description,
            status: 'Pending'
        };
        // Update local state for mock
        const updatedEmployees = employees.map(emp => {
            if (emp.id === selectedEmployee.id) {
                return { ...emp, kpis: [...(emp.kpis || []), newKpi] };
            }
            return emp;
        });
        setEmployees(updatedEmployees);
        setKpiForm({ title: '', description: '', metricType: 'rating', weightage: '30' });
        alert("KPI Assigned Successfully");
        setActionType(null);
    };

    const handleDecisionSubmit = () => {
        if (!selectedEmployee) return;

        // Mock update
        const updatedEmployees = employees.map(emp => {
            if (emp.id === selectedEmployee.id) {
                let newStatus = emp.status;
                if (decisionForm.decision === 'Confirmed') newStatus = 'Confirmed';
                else if (decisionForm.decision === 'Extended') newStatus = `Extended until ${decisionForm.extendedUntil}`;
                else if (decisionForm.decision === 'PIP') newStatus = 'PIP - Active';
                else if (decisionForm.decision === 'Terminated') newStatus = 'Separated';

                return {
                    ...emp,
                    status: newStatus,
                    review_status: 'Reviewed' as const,
                    timeline: [
                        ...(emp.timeline || []),
                        {
                            id: Date.now(),
                            date: new Date().toISOString().split('T')[0],
                            event: `Final Decision: ${decisionForm.decision}`,
                            details: decisionForm.decision === 'Extended'
                                ? `Probation extended until ${decisionForm.extendedUntil}`
                                : decisionForm.pipReason || `Employee marked as ${decisionForm.decision}`
                        }
                    ]
                };
            }
            return emp;
        });
        setEmployees(updatedEmployees);
        alert(`Probation Outcome: ${decisionForm.decision} - Status updated.`);
        setActionType(null);
        setSelectedEmployee(null);
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Top Navigation Bar - Premium Glassmorphism */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-10 h-10 rounded-xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-slate-50"
                            >
                                <Home className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">
                                        {isHR ? 'Probation Hub' : isManager ? 'Team Probation' : 'Probation Status'}
                                    </h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Oversight</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="h-10 w-64 pl-10 pr-4 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Search staff..."
                                />
                            </div>
                            {(role === 'HR_ADMIN' || role === 'ADMIN') && (
                                <Button
                                    onClick={() => window.location.href = '/probation/config'}
                                    variant="ghost"
                                    className="h-10 px-4 rounded-xl gap-2 font-bold text-slate-600 hover:bg-slate-100"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wider">Configure</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    {role !== 'EMPLOYEE' ? (
                        <>
                            {/* Premium Stats Overview - Floating Crystal Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Active staff', value: visibleEmployees.length, icon: Users, color: 'blue' },
                                    { label: 'Reviews Pending', value: visibleEmployees.filter(e => !e.review_status || e.review_status === 'Pending').length, icon: Clock, color: 'amber' },
                                    { label: 'Confirmation ready', value: visibleEmployees.filter(e => e.review_status === 'Submitted').length, icon: CheckCircle, color: 'emerald' },
                                    { label: 'High Risk cases', value: visibleEmployees.filter(e => e.risk_level === 'High').length, icon: AlertTriangle, color: 'rose' }
                                ].map((stat, i) => (
                                    <div key={i} className="group relative">
                                        <div className={`absolute inset-0 bg-${stat.color}-500 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity rounded-[32px]`} />
                                        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[32px] overflow-hidden relative border border-white/50">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                                                        <stat.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            {/* Filters & Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Probation Pool</h2>
                                    <p className="text-slate-500 font-medium mt-1">Managing {visibleEmployees.length} staff members in induction.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => setActionType('Hire')}
                                        className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest px-8 h-11 shadow-lg"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> New Hire
                                    </Button>
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="bg-slate-100/50 p-1 rounded-2xl mb-8 w-full justify-start overflow-x-auto h-auto">
                                    <TabsTrigger value="probation" className="rounded-xl px-6 py-3 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                                        In Probation
                                        <Badge className="ml-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-100 border-none h-5 px-1.5 min-w-[20px] justify-center">
                                            {employees.filter(e => {
                                                const s = e.review_status || 'Pending';
                                                return ['Pending', 'Submitted', 'Reviewed', 'In Progress'].includes(s) || s.startsWith('Extended') || s.includes('PIP');
                                            }).length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="completed" className="rounded-xl px-6 py-3 font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
                                        Completed
                                        <Badge className="ml-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none h-5 px-1.5 min-w-[20px] justify-center">
                                            {employees.filter(e => e.review_status === 'Confirmed').length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="rejected" className="rounded-xl px-6 py-3 font-bold data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm">
                                        Released
                                        <Badge className="ml-2 bg-rose-100 text-rose-600 hover:bg-rose-100 border-none h-5 px-1.5 min-w-[20px] justify-center">
                                            {employees.filter(e => ['Terminated', 'Separated', 'Rejected'].includes(e.review_status || '')).length}
                                        </Badge>
                                    </TabsTrigger>
                                </TabsList>

                                {/* Masonry-style Grid for Employees */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                    {visibleEmployees.map((emp) => {
                                        const empStages = getEmployeeStages(emp);
                                        return (
                                            <div key={emp.id} className="group relative">
                                                {/* Dynamic Risk Background Blur */}
                                                <div className={`absolute inset-0 blur-3xl opacity-5 transition-opacity duration-700
                                                ${emp.risk_level === 'High' ? 'bg-rose-500' : emp.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                                />

                                                <Card className="border-none shadow-sm hover:shadow-2xl bg-white rounded-[40px] overflow-hidden transition-all duration-500 border border-white/40 relative z-10 hover:-translate-y-2">
                                                    <CardHeader className="p-8 pb-0">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 text-xl font-black shadow-inner">
                                                                    {emp.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <CardTitle className="text-lg font-black text-slate-900 tracking-tight leading-none">{emp.name}</CardTitle>
                                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{emp.designation}</p>
                                                                </div>
                                                            </div>
                                                            <Badge className={`rounded-xl border-none font-black text-[9px] uppercase tracking-[0.15em] px-3 py-1 shadow-sm
                                                            ${emp.risk_level === 'High' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                                                                {emp.risk_level || 'Safe'}
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="p-8">
                                                        {/* Milestone Stats */}
                                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                                            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Confirmation Due</p>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                                                                    <span className="text-sm font-black text-slate-800 tracking-tight">{emp.probation_end_date}</span>
                                                                </div>
                                                            </div>
                                                            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`h-2 w-2 rounded-full ${emp.review_status === 'Submitted' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{emp.review_status || 'Pending'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Mini Progress Bar */}
                                                        <div className="space-y-3 mb-8">
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] italic">Journey Progress</span>
                                                                <span className="text-xs font-black text-slate-900">
                                                                    {(emp.review_status === 'Confirmed' || emp.review_status === 'Terminated') ? '100%' : `${Math.round((empStages.findIndex((s: any) => s.id === emp.currentStageId) / empStages.length) * 100)}%`}
                                                                </span>
                                                            </div>
                                                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-100">
                                                                <div
                                                                    className={`h-full rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000 
                                                                    ${emp.review_status === 'Confirmed' ? 'bg-emerald-500' : emp.review_status === 'Terminated' ? 'bg-rose-500' : 'bg-indigo-600'}`}
                                                                    style={{ width: (emp.review_status === 'Confirmed' || emp.review_status === 'Terminated') ? '100%' : `${(empStages.findIndex((s: any) => s.id === emp.currentStageId) / empStages.length) * 100}%` }}
                                                                />
                                                            </div>
                                                            <p className={`text-[10px] font-bold text-right uppercase tracking-widest ${emp.review_status === 'Terminated' || emp.status === 'Separated' ? 'text-rose-500' : 'text-slate-400'}`}>
                                                                {emp.review_status === 'Confirmed' ? 'Converted' : emp.review_status === 'Terminated' || emp.status === 'Separated' ? 'Moved to Exit Mgmt' : 'In Probation'}
                                                            </p>
                                                        </div>

                                                        {/* Actions Crystal Buttons */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Button
                                                                variant="ghost"
                                                                className="rounded-2xl bg-indigo-50/50 hover:bg-indigo-600 hover:text-white font-black text-[10px] uppercase tracking-widest h-12 transition-all border border-indigo-100/50"
                                                                onClick={() => { setSelectedEmployee(emp); setActionType('History'); }}
                                                            >
                                                                Full Profiler
                                                            </Button>
                                                            {emp.review_status === 'Terminated' || emp.status === 'Separated' ? (
                                                                <Button
                                                                    className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest h-12 shadow-xl shadow-rose-100"
                                                                    onClick={() => alert('Redirecting to Exit Management Module...')}
                                                                >
                                                                    Exit Management
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    className="rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest h-12 shadow-xl shadow-slate-100"
                                                                    onClick={() => {
                                                                        setSelectedEmployee(emp);
                                                                        const currentConfigs = stageConfigs || {};
                                                                        const stageKey = emp.currentStageId || 'kpi';
                                                                        const points = currentConfigs[stageKey]?.points || [];

                                                                        const initialRatings: Record<string, string> = {};
                                                                        points.forEach((p: any) => initialRatings[p.id] = '3');

                                                                        setReviewForm({ feedback: '', ratings: initialRatings });
                                                                        setActionType('Review');
                                                                    }}
                                                                >
                                                                    Record Review
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Tabs>
                        </>
                    ) : (
                        /* Enhanced Employee View */
                        <div className="max-w-4xl mx-auto pb-20">
                            <div className="relative">
                                {/* Blurred background shapes */}
                                <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

                                <Card className="border-none shadow-2xl rounded-[60px] bg-white/80 backdrop-blur-2xl overflow-hidden border border-white/50 relative z-10">
                                    <div className="h-48 bg-slate-900 relative p-12 overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8">
                                            <Badge className="bg-white/10 backdrop-blur-md text-white border-white/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                                                Hiring ID: EMP-2024-88
                                            </Badge>
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic">Welcome to the Team</h2>
                                            <p className="text-indigo-200 font-bold mt-4 flex items-center gap-3">
                                                <Monitor className="w-5 h-5" />
                                                <span>{user?.department || 'Academic Affairs'} • Senior Faculty</span>
                                            </p>
                                        </div>
                                        {/* Abstract background elements */}
                                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl" />
                                    </div>

                                    <CardContent className="p-12">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                            {/* Summary Stats */}
                                            <div className="md:col-span-1 space-y-4">
                                                {[
                                                    {
                                                        label: 'Next Review', value: (() => {
                                                            const offset = stageConfigs?.[(user as any)?.currentStageId || '']?.scheduleOffset || 30;
                                                            const joinDate = new Date((user as any)?.joining_date || Date.now());
                                                            joinDate.setDate(joinDate.getDate() + parseInt(offset));
                                                            return joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                                        })(), icon: Calendar, color: 'indigo'
                                                    },
                                                    { label: 'Confirmation', value: '45 Days to go', icon: Clock, color: 'emerald' },
                                                    { label: 'Scorecard', value: '4.8 / 5.0', icon: TrendingUp, color: 'amber' }
                                                ].map((stat, i) => (
                                                    <div key={i} className={`p-6 rounded-[32px] bg-${stat.color}-50 border border-${stat.color}-100/50 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-500`}>
                                                        <div className={`h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-${stat.color}-600 mb-4`}>
                                                            <stat.icon className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                                        <p className={`text-xl font-black text-${stat.color}-950 tracking-tight`}>{stat.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Vertical Journey Timeline */}
                                            <div className="md:col-span-2 space-y-8">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Your Journey Roadmap</h3>
                                                    <Info className="w-5 h-5 text-slate-300 cursor-help" />
                                                </div>

                                                <div className="space-y-12 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-100 before:z-0">
                                                    {getEmployeeStages(user as any).map((step: any, i: number, arr: any[]) => {
                                                        const currentIdx = arr.findIndex((s: any) => s.id === ((user as any)?.currentStageId || '90_day'));
                                                        const isCompleted = i < currentIdx;
                                                        const isCurrent = i === currentIdx;
                                                        const isPending = i > currentIdx;

                                                        return (
                                                            <div key={i} className={`relative z-10 pl-16 group`}>
                                                                <div className={`absolute left-4 top-1 h-4 w-4 rounded-full ring-4 transition-all duration-500
                                                                    ${isCompleted ? 'bg-emerald-500 ring-emerald-50' :
                                                                        isCurrent ? 'bg-indigo-600 ring-indigo-100 animate-bounce' :
                                                                            'bg-white ring-slate-100'}`}
                                                                />
                                                                <div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`text-xs font-black uppercase tracking-widest transition-colors
                                                                            ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                            {step.label}
                                                                        </span>
                                                                        <span className="h-px w-8 bg-slate-100" />
                                                                        <span className="text-[10px] font-black text-slate-300">
                                                                            {isCompleted ? 'Verified' : isCurrent ? 'Active Milestone' : 'Upcoming'}
                                                                        </span>
                                                                    </div>
                                                                    <p className={`text-sm font-bold mt-2 leading-relaxed transition-colors
                                                                        ${isPending ? 'text-slate-400' : 'text-slate-700'}`}>
                                                                        {isCompleted ? 'Requirements met and validated.' : isCurrent ? 'Finalizing current assessments and peer reviews.' : 'Phase opens upon milestone clearance.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="pt-8 border-t border-slate-50 flex justify-end">
                                                    <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest px-10 h-14 shadow-2xl shadow-indigo-100">
                                                        Access Resources
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Dynamic Stage-Wise Review Modal */}
                    {/* Dynamic Stage-Wise Review Modal */}
                    <Dialog open={actionType === 'Review' || getEmployeeStages(selectedEmployee).map((s: any) => s.id).includes(actionType as string)} onOpenChange={() => setActionType(null)}>
                        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[40px] border-none shadow-2xl">
                            <div className="flex h-[600px]">
                                {/* Left Side: Journey Roadmap */}
                                <div className="w-1/3 bg-slate-900 p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10 h-full flex flex-col">
                                        <div className="mb-8">
                                            <Badge className="bg-white/10 text-indigo-300 border-none mb-4">Milestone Tracker</Badge>
                                            <h2 className="text-2xl font-black tracking-tight italic">The Journey</h2>
                                        </div>

                                        <div className="flex-1 space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-px before:bg-white/10 before:z-0">
                                            {getEmployeeStages(selectedEmployee).map((s: any, i: number, arr: any[]) => {
                                                const currentIdx = arr.findIndex((st: any) => st.id === selectedEmployee?.currentStageId);
                                                const isCompleted = i < currentIdx;
                                                const isActive = i === currentIdx;

                                                return (
                                                    <div key={s.id} className="relative z-10 pl-10 group">
                                                        <div className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg
                                                            ${isCompleted ? 'bg-emerald-500 scale-110 cursor-pointer hover:ring-4 hover:ring-emerald-200' : isActive ? 'bg-indigo-600 ring-4 ring-indigo-500/30' : 'bg-slate-800'}`}
                                                            onClick={() => isCompleted && setActionType(s.id as any)}
                                                        >
                                                            {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>{s.label}</p>
                                                                {isCompleted && (
                                                                    <Badge
                                                                        onClick={() => setActionType(s.id as any)}
                                                                        className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer text-[8px] px-1.5 py-0 border-none"
                                                                    >
                                                                        VIEW
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {/* Scheduled Date Display */}
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                                                Scheduled: {(() => {
                                                                    const offset = stageConfigs?.[s.id]?.scheduleOffset || 30;
                                                                    const joinDate = new Date(selectedEmployee?.joining_date || Date.now());
                                                                    joinDate.setDate(joinDate.getDate() + parseInt(offset));
                                                                    return joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                                })()}
                                                            </div>
                                                            {/* Scheduled Date Display */}
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                                                Scheduled: {(() => {
                                                                    const offset = stageConfigs?.[s.id]?.scheduleOffset || 30;
                                                                    const joinDate = new Date(selectedEmployee?.joining_date || Date.now());
                                                                    joinDate.setDate(joinDate.getDate() + parseInt(offset));
                                                                    return joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                                })()}
                                                            </div>
                                                            {isActive && <div className="h-1 w-4 bg-indigo-500 rounded-full mt-1" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="pt-6 border-t border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate</p>
                                                    <p className="text-sm font-bold">{selectedEmployee?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Abstract decor */}
                                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
                                </div>

                                {/* Right Side: Dynamic Content */}
                                <div className="flex-1 bg-white p-10 flex flex-col">
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-2">
                                                {getEmployeeStages(selectedEmployee).find((s: any) => s.id === selectedEmployee?.currentStageId)?.label}
                                            </h3>
                                            <p className="text-slate-500 font-medium">Please complete the required assessment for this milestone.</p>
                                        </div>

                                        {/* Historical Feedback View */}
                                        {(['kpi', '30_day', '60_day', '90_day'].includes(actionType as string) && actionType !== selectedEmployee?.currentStageId) && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100/50">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900/50 italic leading-none">Completed Milestone</p>
                                                            <h4 className="text-lg font-black text-emerald-900 mt-1">Feedback Archive</h4>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {(selectedEmployee?.timeline?.filter(t => t.event.includes('Feedback') || t.event.includes('Review')) || []).map((t, i) => (
                                                            <div key={i} className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <p className="text-xs font-black text-slate-900">{t.event}</p>
                                                                    <span className="text-[10px] font-bold text-slate-400">{t.date}</span>
                                                                </div>
                                                                <p className="text-xs font-medium text-slate-600 leading-relaxed">{t.details}</p>
                                                            </div>
                                                        ))}
                                                        {(!selectedEmployee?.timeline?.some(t => t.event.includes('Feedback'))) && (
                                                            <div className="text-center py-8">
                                                                <p className="text-xs font-bold text-slate-400 italic">No detailed feedback records found for this stage.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => setActionType('Review')}
                                                    className="w-full h-12 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest hover:bg-slate-200"
                                                >
                                                    Back to Current Review
                                                </Button>
                                            </div>
                                        )}

                                        {/* KPI Mode */}
                                        {selectedEmployee?.currentStageId === 'kpi' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100/50">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                                                            <Target className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-900/50 italic leading-none">Goal Alignment Phase</p>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {(stageConfigs?.['kpi']?.points || []).map((p: any) => (
                                                            <div key={p.id} className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs font-black text-slate-900">{p.title}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Weight: {p.weight}% • {p.type}</p>
                                                                </div>
                                                                {p.type === 'rating' ? (
                                                                    <div className="flex gap-1">
                                                                        {[1, 2, 3, 4, 5].map(v => (
                                                                            <button key={v} className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black">{v}</button>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <Switch className="data-[state=checked]:bg-indigo-600" />
                                                                )}
                                                            </div>
                                                        ))}
                                                        {(!stageConfigs?.['kpi']?.points || stageConfigs['kpi'].points.length === 0) && (
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Performance Goal</Label>
                                                                    <input
                                                                        className="w-full h-12 bg-white border-slate-200 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                                                        placeholder="e.g. Master technical stack..."
                                                                        value={kpiForm.title}
                                                                        onChange={(e) => setKpiForm({ ...kpiForm, title: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Metric Type</Label>
                                                                        <Select
                                                                            value={kpiForm.metricType}
                                                                            onValueChange={(v) => setKpiForm({ ...kpiForm, metricType: v })}
                                                                        >
                                                                            <SelectTrigger className="rounded-2xl h-12 border-slate-200">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                                                                <SelectItem value="rating">Rating (1-5)</SelectItem>
                                                                                <SelectItem value="boolean">Success/Fail</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Weightage</Label>
                                                                        <Select
                                                                            value={kpiForm.weightage}
                                                                            onValueChange={(v) => setKpiForm({ ...kpiForm, weightage: v })}
                                                                        >
                                                                            <SelectTrigger className="rounded-2xl h-12 border-slate-200">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                                                                <SelectItem value="30">30%</SelectItem>
                                                                                <SelectItem value="50">50%</SelectItem>
                                                                                <SelectItem value="100">100%</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Feedback Mode (30/60/90 Day) */}
                                        {(selectedEmployee?.currentStageId?.includes('day')) && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="space-y-8">
                                                    {[
                                                        { id: 'q1', label: 'Quality of Engagement', sub: 'Team interaction and collaboration' },
                                                        { id: 'q2', label: 'Technical Proficiency', sub: 'Ability to handle assigned tasks independently' }
                                                    ].map((q) => (
                                                        <div key={q.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-black text-slate-900 italic tracking-tight">{q.label}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{q.sub}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center gap-2">
                                                                {[1, 2, 3, 4, 5].map(v => (
                                                                    <button
                                                                        key={v}
                                                                        onClick={() => setReviewForm({
                                                                            ...reviewForm,
                                                                            ratings: { ...reviewForm.ratings, [q.id]: v.toString() }
                                                                        })}
                                                                        className={`flex-1 h-12 rounded-xl border transition-all shadow-sm font-black text-xs
                                                                            ${reviewForm.ratings[q.id] === v.toString()
                                                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                                                                : 'border-slate-100 bg-white text-slate-400 hover:bg-slate-50'}`}
                                                                    >
                                                                        {v}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reviewer Remarks</Label>
                                                        <Textarea
                                                            placeholder="Add specific observations..."
                                                            className="rounded-[24px] border-slate-200 min-h-[120px] p-6 text-sm font-medium focus:ring-indigo-500 transition-all"
                                                            value={reviewForm.feedback}
                                                            onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Decision Mode */}
                                        {selectedEmployee?.currentStageId === 'decision' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'Confirmed', label: 'Confirm', icon: CheckCircle, color: 'emerald' },
                                                        { id: 'Terminated', label: 'Terminate', icon: Trash2, color: 'rose' }
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => setDecisionForm({ ...decisionForm, decision: opt.id })}
                                                            className={`p-6 rounded-[32px] border-2 transition-all duration-500 flex flex-col items-center gap-3 group
                                                                ${decisionForm.decision === opt.id ? `bg-${opt.color}-50 border-${opt.color}-500 shadow-lg shadow-${opt.color}-100` : 'bg-white border-slate-100 hover:border-slate-300'}`}
                                                        >
                                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500
                                                                ${decisionForm.decision === opt.id ? `bg-${opt.color}-600 text-white` : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                                                <opt.icon className="w-6 h-6" />
                                                            </div>
                                                            <span className={`text-xs font-black uppercase tracking-widest ${decisionForm.decision === opt.id ? `text-${opt.color}-900` : 'text-slate-400'}`}>
                                                                {opt.label}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Final Rationale</Label>
                                                    <Textarea
                                                        placeholder="Provide the core reason for the final decision..."
                                                        className="rounded-[24px] border-slate-200 min-h-[100px] p-6 text-sm font-medium"
                                                        value={decisionForm.pipReason}
                                                        onChange={(e) => setDecisionForm({ ...decisionForm, pipReason: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 flex gap-4">
                                        <Button variant="ghost" onClick={() => setActionType(null)} className="rounded-2xl px-10 h-14 font-black text-xs uppercase tracking-widest text-slate-400">
                                            Discard
                                        </Button>
                                        <Button onClick={handleReviewSubmit} className="flex-1 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest h-14 shadow-2xl transition-all active:scale-95">
                                            {selectedEmployee?.currentStageId === 'decision' ? 'Finalize Journey' : 'Submit & Advance'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* KPI Assignment Modal */}
                    <Dialog open={actionType === 'KPI'} onOpenChange={() => setActionType(null)}>
                        {/* ... Existing KPI Modal ... */}
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Assign KPIs / Goals</DialogTitle>
                                <CardDescription>Set performance goals for {selectedEmployee?.name}.</CardDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>KPI Title</Label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                        placeholder="e.g. Complete Onboarding Projects"
                                        value={kpiForm.title}
                                        onChange={(e) => setKpiForm({ ...kpiForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description / Metrics</Label>
                                    <Textarea
                                        placeholder="Details of success criteria..."
                                        value={kpiForm.description}
                                        onChange={(e) => setKpiForm({ ...kpiForm, description: e.target.value })}
                                    />
                                </div>

                                {/* Existing KPIs List */}
                                {selectedEmployee?.kpis && selectedEmployee.kpis.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Current KPIs</h4>
                                        <ul className="space-y-2">
                                            {selectedEmployee.kpis.map(kpi => (
                                                <li key={kpi.id} className="text-sm border p-2 rounded bg-slate-50">
                                                    <div className="font-medium">{kpi.title}</div>
                                                    <div className="text-xs text-slate-500">{kpi.description}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setActionType(null)}>Close</Button>
                                <Button onClick={handleKpiSubmit} className="bg-indigo-600">Assign KPI</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* New Hire Modal */}
                    <Dialog open={actionType === 'Hire'} onOpenChange={() => setActionType(null)}>
                        <DialogContent className="max-w-xl rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
                            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <Badge className="bg-indigo-500/20 text-indigo-300 border-none mb-4">Talent Acquisition</Badge>
                                    <h2 className="text-3xl font-black italic tracking-tight">Onboard New Talent</h2>
                                    <p className="text-slate-400 text-sm mt-2">Add a staff member directly to the central probation pool.</p>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">FullName</Label>
                                        <input
                                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                            placeholder="DR. Jane Smith"
                                            value={hireForm.name}
                                            onChange={(e) => setHireForm({ ...hireForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</Label>
                                        <Select
                                            value={hireForm.department}
                                            onValueChange={(v) => setHireForm({ ...hireForm, department: v })}
                                        >
                                            <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                                <SelectItem value="Mechanical Eng">Mechanical Eng</SelectItem>
                                                <SelectItem value="Administration">Administration</SelectItem>
                                                <SelectItem value="Research">Research</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Designation</Label>
                                        <input
                                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                            placeholder="Asst. Professor"
                                            value={hireForm.designation}
                                            onChange={(e) => setHireForm({ ...hireForm, designation: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Joining Date</Label>
                                        <input
                                            type="date"
                                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                            value={hireForm.joiningDate}
                                            onChange={(e) => setHireForm({ ...hireForm, joiningDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <Button variant="ghost" onClick={() => setActionType(null)} className="flex-1 rounded-2xl h-14 font-black text-xs uppercase tracking-widest text-slate-400">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleHireSubmit} className="flex-1 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest h-14 shadow-2xl transition-all">
                                        Add to Pool
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Detailed Profile / History Modal */}
                    <Dialog open={actionType === 'History'} onOpenChange={() => setActionType(null)}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-4">
                                    <span>Staff Probation Profile</span>
                                    <Badge className="bg-indigo-600/10 text-indigo-600 border-none px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        Stage: {getEmployeeStages(selectedEmployee).find((s: any) => s.id === selectedEmployee?.currentStageId)?.label || 'Alpha'}
                                    </Badge>
                                </DialogTitle>
                                <CardDescription>Comprehensive view of {selectedEmployee?.name}'s journey milestones</CardDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-8 py-6">
                                {/* Profile Stats */}
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Probation Metadata</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Joining Date</span>
                                                <span className="font-bold text-slate-900">{selectedEmployee?.joining_date}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Probation End</span>
                                                <span className="font-bold text-slate-900">{selectedEmployee?.probation_end_date}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Next Review</span>
                                                <span className="font-bold text-slate-900 text-indigo-600">{selectedEmployee?.next_review_date}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Performance Score</span>
                                                <span className="font-extrabold text-amber-600 text-lg">
                                                    {selectedEmployee?.performance_score || 'N/A'}/5
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Current KPIs</h4>
                                        <div className="space-y-2">
                                            {selectedEmployee?.kpis?.map(kpi => (
                                                <div key={kpi.id} className="text-xs bg-white p-2 rounded-lg border border-indigo-50">
                                                    <div className="font-bold text-indigo-900">{kpi.title}</div>
                                                    <div className="text-indigo-500 mt-1">{kpi.status}</div>
                                                </div>
                                            ))}
                                            {(!selectedEmployee?.kpis || selectedEmployee.kpis.length === 0) && (
                                                <div className="text-xs text-indigo-400 italic">No KPIs assigned yet.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Review History / Timeline */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review History</h4>
                                    <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 max-h-[300px] overflow-y-auto pr-2">
                                        {selectedEmployee?.timeline?.map((event, idx) => (
                                            <div key={idx} className="ml-6 relative">
                                                <span className="absolute -left-[33px] flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-slate-100 shadow-sm transition-all group-hover:ring-indigo-500">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                                </span>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-900 uppercase">{event.event}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{event.date}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{event.details}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-[30px] border-t border-slate-100">
                                <Button variant="outline" className="rounded-xl" onClick={() => setActionType(null)}>Close Profile</Button>
                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100" onClick={() => { setActionType(null); setShowFeedbackModal(true); }}>
                                    Assess Feedback
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Customizable Feedback Modal */}
                    <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Probation Feedback Form</DialogTitle>
                                <CardDescription>Customizable performance assessment for {selectedEmployee?.name}</CardDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                {/* Form Customization Selector */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Form Template</Label>
                                        <Select value={feedbackType} onValueChange={(val: 'Performance' | 'Culture' | 'Technical' | 'General') => setFeedbackType(val)}>
                                            <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                <SelectValue placeholder="Select Template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Performance">Performance Assessment</SelectItem>
                                                <SelectItem value="Culture">Culture & Soft Skills</SelectItem>
                                                <SelectItem value="Technical">Technical Competency</SelectItem>
                                                <SelectItem value="General">Monthly General Review</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overall Rating</Label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <button
                                                    key={num}
                                                    onClick={() => setFeedbackData({ ...feedbackData, rating: num.toString() })}
                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${feedbackData.rating === num.toString() ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Key Strengths observed</Label>
                                        <Textarea
                                            className="rounded-xl border-slate-200 min-h-[80px]"
                                            placeholder="What did they do exceptionally well?"
                                            value={feedbackData.strengths}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, strengths: e.target.value })}
                                        />
                                    </div>

                                    {feedbackType !== 'Culture' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Areas for Improvement</Label>
                                            <Textarea
                                                className="rounded-xl border-slate-200 min-h-[80px]"
                                                placeholder="Concrete areas to focus on in next cycle..."
                                                value={feedbackData.improvements}
                                                onChange={(e) => setFeedbackData({ ...feedbackData, improvements: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Detailed Comments</Label>
                                        <Textarea
                                            className="rounded-xl border-slate-200 min-h-[100px]"
                                            placeholder="Any other observations or remarks..."
                                            value={feedbackData.comment}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="rounded-xl" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
                                <Button
                                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    onClick={() => {
                                        alert(`Feedback (${feedbackType}) submitted for ${selectedEmployee?.name}`);
                                        setShowFeedbackModal(false);
                                        // Update local status for demo
                                        if (selectedEmployee) {
                                            const updated = employees.map(emp => emp.id === selectedEmployee.id ? {
                                                ...emp,
                                                review_status: 'Submitted' as const,
                                                timeline: [
                                                    ...(emp.timeline || []),
                                                    {
                                                        id: Date.now(),
                                                        date: new Date().toISOString().split('T')[0],
                                                        event: `${feedbackType} Feedback Submitted`,
                                                        details: `Rating: ${feedbackData.rating}/5. Strengths: ${feedbackData.strengths}`
                                                    }
                                                ]
                                            } : emp);
                                            setEmployees(updated);
                                        }
                                    }}
                                >
                                    Submit Feedback
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                    {/* HR Decision Modal */}
                    <Dialog open={actionType === 'Decision'} onOpenChange={() => setActionType(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Final Probation Decision</DialogTitle>
                                <CardDescription>Determine the employment outcome for {selectedEmployee?.name}.</CardDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Outcome Decision</Label>
                                    <Select
                                        value={decisionForm.decision}
                                        onValueChange={(val) => setDecisionForm({ ...decisionForm, decision: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select decision" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Confirmed">Confirm Employment</SelectItem>
                                            <SelectItem value="Extended">Extend Probation</SelectItem>
                                            <SelectItem value="PIP">Move to PIP</SelectItem>
                                            <SelectItem value="Terminated">Terminate Employment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {decisionForm.decision === 'Extended' && (
                                    <div className="space-y-2">
                                        <Label>Extended Until</Label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded-md text-sm"
                                            value={decisionForm.extendedUntil}
                                            onChange={(e) => setDecisionForm({ ...decisionForm, extendedUntil: e.target.value })}
                                        />
                                    </div>
                                )}

                                {(decisionForm.decision === 'PIP' || decisionForm.decision === 'Terminated') && (
                                    <div className="space-y-2">
                                        <Label>Reason / Justification</Label>
                                        <Textarea
                                            placeholder="Provide detailed reason..."
                                            value={decisionForm.pipReason}
                                            onChange={(e) => setDecisionForm({ ...decisionForm, pipReason: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs text-slate-500">
                                    <p className="font-semibold mb-1">System Actions:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Update employee status to {decisionForm.decision}</li>
                                        <li>Notify Employee & Manager via Email</li>
                                    </ul>
                                    <div className="mt-3 pt-2 border-t border-slate-200 flex gap-2">
                                        <Button
                                            variant="outline" size="sm" className="h-7 text-xs"
                                            onClick={() => {
                                                const title = `${decisionForm.decision} Letter - ${selectedEmployee?.name}`;
                                                const content = `Dear ${selectedEmployee?.name},\n\nThis is to formally notify you regarding the outcome of your probation period. Based on the performance reviews and assessments, we have reached the following decision: ${decisionForm.decision.toUpperCase()}.\n\n${decisionForm.decision === 'Extended' ? `Your probation period is extended until ${decisionForm.extendedUntil}.` : ''}\n${decisionForm.pipReason ? `Rationale: ${decisionForm.pipReason}` : ''}\n\nWe appreciate your contributions to the team.\n\nBest Regards,\nHR Management`;
                                                setPreviewLetter({ open: true, title, content });
                                            }}
                                        >
                                            <FileText className="w-3 h-3 mr-1" /> Preview {decisionForm.decision} Letter
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setActionType(null)}>Cancel</Button>
                                <Button
                                    className={
                                        decisionForm.decision === 'Confirmed' ? "bg-emerald-600 hover:bg-emerald-700 text-white" :
                                            decisionForm.decision === 'Terminated' ? "bg-red-600 hover:bg-red-700 text-white" : "bg-indigo-600 text-white"
                                    }
                                    onClick={handleDecisionSubmit}
                                >
                                    Confirm Decision
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Letter Preview Modal */}
                    <Dialog open={previewLetter.open} onOpenChange={() => setPreviewLetter({ ...previewLetter, open: false })}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{previewLetter.title}</DialogTitle>
                            </DialogHeader>
                            <div className="bg-white border rounded-lg p-8 shadow-inner font-serif whitespace-pre-wrap text-slate-800 h-96 overflow-y-auto">
                                {previewLetter.content}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setPreviewLetter({ ...previewLetter, open: false })}>Close</Button>
                                <Button className="bg-indigo-600 text-white" onClick={() => { alert("Downloading Letter..."); setPreviewLetter({ ...previewLetter, open: false }); }}>
                                    Download PDF
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </main>
        </div>
    );
};

export default ProbationDashboard;
