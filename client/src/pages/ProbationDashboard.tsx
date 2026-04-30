import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    AlertTriangle, Settings, Clock, Shield, CheckCircle,
    Search, Plus, Calendar, TrendingUp, Monitor, Info, Users, FileText,
    Target, Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
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
    isOnboardingComplete?: boolean;
}

interface StageDefinition {
    id: string;
    label: string;
    icon: string;
    color: string;
    description?: string;
}

interface Policy {
    id: number;
    name: string;
    duration: number;
    type?: string;
    stages: string[];
}

interface StageConfig {
    points?: Array<{ id: string; title: string; weight: string; type: string; sub?: string }>;
    owner?: string;
    checker?: string;
    allowReopen?: boolean;
    scheduleOffset?: string | number;
    slaLimit?: string | number;
    slaFrequency?: string;
    notifications?: Record<string, boolean>;
}

// Helper to determine stages dynamically
const getIcon = (iconName: string | React.ElementType) => {
    if (typeof iconName !== 'string') return iconName;
    const icons: Record<string, React.ElementType> = { Target, Clock, Users, Shield, AlertTriangle, CheckCircle, Plus, Settings };
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
    const [stageConfigs, setStageConfigs] = useState<Record<string, StageConfig>>(() => {
        const saved = localStorage.getItem('probation_stage_configs');
        return saved ? JSON.parse(saved) : null;
    });

    // Dynamic Configuration State
    const [stageDefinitions, setStageDefinitions] = useState<StageDefinition[]>([]);
    const [policies, setPolicies] = useState<Policy[]>([]);

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
        const defaults: StageDefinition[] = [
            { id: 'kpi', label: 'KPI Setting', icon: 'Target', color: 'indigo' },
            { id: '30_day', label: '30-Day Check', icon: 'Clock', color: 'blue' },
            { id: '60_day', label: '60-Day Review', icon: 'Users', color: 'emerald' },
            { id: '90_day', label: 'Final Assessment', icon: 'Shield', color: 'amber' },
            { id: 'decision', label: 'Confirmation', icon: 'AlertTriangle', color: 'rose' }
        ];

        if (!emp) return defaults;

        // Find policy
        const policy = policies.find(p => p.id === emp.policyId);

        // If policy exists, map stages. If not, check if we have custom definitions to fallback to (e.g. legacy linear default)
        // For now, if no policy, use defaults.
        if (!policy) return defaults;

        return policy.stages.map((stageId: string) => {
            const def = stageDefinitions.find(d => d.id === stageId);
            return def ? { ...def } : null;
        }).filter((s): s is StageDefinition => s !== null);
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
                        isOnboardingComplete: false,
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

    if (loading) return <div className="px-4 py-4 text-center">Loading...</div>;
    if (error) return <div className="px-4 py-4 text-center text-red-500">Error: {error}</div>;

    return (
        <Layout 
            title={isHR ? 'Probation Hub' : isManager ? 'Team Probation' : 'Probation Status'} 
            description="Institutional Oversight & Performance Review" 
            showHome={true} 
            icon={Shield}
            headerActions={
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="h-10 w-72 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-400"
                            placeholder="Search staff members..."
                        />
                    </div>
                    {isHR && (
                            <Button
                                onClick={() => window.location.href = '/probation/config'}
                                className="h-10 bg-white border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-all shadow-sm font-bold text-xs uppercase tracking-widest px-4"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Config
                            </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-12">
                    {role !== 'EMPLOYEE' ? (
                        <>
                            {/* Professional Stats Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
                                {[
                                    { label: 'Total In Probation', value: visibleEmployees.length, icon: Users, color: 'slate' },
                                    { label: 'Review Pending', value: visibleEmployees.filter(e => !e.review_status || e.review_status === 'Pending').length, icon: Clock, color: 'slate' },
                                    { label: 'Reviews Submitted', value: visibleEmployees.filter(e => e.review_status === 'Submitted').length, icon: CheckCircle, color: 'slate' },
                                    { label: 'High Risk Assets', value: visibleEmployees.filter(e => e.risk_level === 'High').length, icon: AlertTriangle, color: 'slate' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                                            {React.createElement(stat.icon, { className: "w-5 h-5" })}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                            <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">{stat.value}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 mt-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Probation Pool</h2>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Managing {visibleEmployees.length} personnel in probation period.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() => setActionType('Hire')}
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest px-8 h-11 rounded-lg transition-all"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> New Hire
                                    </Button>
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="bg-slate-100 p-1 rounded-lg mb-8 w-fit border border-slate-200 gap-1 h-auto">
                                    <TabsTrigger value="probation" className="rounded-md px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                        In Progress
                                        <Badge className="ml-2 bg-slate-200 text-slate-600 border-none h-4 px-1.5 font-bold text-[9px]">
                                            {employees.filter(e => {
                                                const s = e.review_status || 'Pending';
                                                return ['Pending', 'Submitted', 'Reviewed', 'In Progress'].includes(s) || s.startsWith('Extended') || s.includes('PIP');
                                            }).length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="completed" className="rounded-md px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                        Confirmed
                                        <Badge className="ml-2 bg-slate-200 text-slate-600 border-none h-4 px-1.5 font-bold text-[9px]">
                                            {employees.filter(e => e.review_status === 'Confirmed').length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="rejected" className="rounded-md px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                        Terminated
                                        <Badge className="ml-2 bg-slate-200 text-slate-600 border-none h-4 px-1.5 font-bold text-[9px]">
                                            {employees.filter(e => ['Terminated', 'Separated', 'Rejected'].includes(e.review_status || '')).length}
                                        </Badge>
                                    </TabsTrigger>
                                </TabsList>

                                {/* Masonry Grid for Candidates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                    {visibleEmployees.map((emp) => {
                                        const empStages = getEmployeeStages(emp);
                                        const isHighRisk = emp.risk_level === 'High' || (emp.performance_score !== undefined && emp.performance_score > 0 && emp.performance_score < 3) || emp.kpis?.some(k => k.status === 'Not Met');
                                        
                                        return (
                                                 <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all relative z-10">
                                                    <CardHeader className="p-6 pb-0">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xl font-bold">
                                                                    {emp.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">{emp.name}</CardTitle>
                                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{emp.designation}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <Badge className={`rounded-md border-none font-bold text-[9px] uppercase tracking-wider px-2 py-1
                                                                ${(emp.review_status === 'Terminated' || emp.status === 'Separated') ? 'bg-rose-600 text-white' : 
                                                                  isHighRisk ? 'bg-rose-500 text-white' : 
                                                                  emp.risk_level === 'Medium' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}>
                                                                    {emp.review_status === 'Terminated' || emp.status === 'Separated' ? 'Separated' : 
                                                                     isHighRisk ? 'Critical' :
                                                                     emp.risk_level || 'Normal'}
                                                                </Badge>
                                                                {emp.isOnboardingComplete === false && (
                                                                    <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                                                        Complete Data
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="p-6">
                                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Milestone Due</p>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-slate-600" />
                                                                    <span className="text-sm font-bold text-slate-900 tracking-tight">{emp.probation_end_date}</span>
                                                                </div>
                                                            </div>
                                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Cycle Phase</p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`h-2 w-2 rounded-full ${emp.review_status === 'Submitted' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                                                    <span className="text-xs font-bold text-slate-700 uppercase">{emp.review_status || 'Active'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Progress Architecture */}
                                                        <div className="space-y-3 mb-6">
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Journey Progress</span>
                                                                <span className="text-xs font-bold text-slate-900">
                                                                    {(() => {
                                                                        if (emp.review_status === 'Confirmed' || emp.review_status === 'Terminated' || emp.status === 'Separated' || emp.status === 'Confirmed') return '100%';
                                                                        const idx = empStages.findIndex((s: any) => s.id === emp.currentStageId);
                                                                        if (idx === -1) return '0%';
                                                                        return `${Math.round((idx / (empStages.length - 1 || 1)) * 100)}%`;
                                                                    })()}
                                                                </span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-1000
                                                                    ${emp.review_status === 'Confirmed' || emp.status === 'Confirmed' ? 'bg-emerald-500' : 
                                                                      emp.review_status === 'Terminated' || emp.status === 'Separated' ? 'bg-rose-500' : 'bg-blue-600'}`}
                                                                    style={{ 
                                                                        width: (() => {
                                                                            if (emp.review_status === 'Confirmed' || emp.review_status === 'Terminated' || emp.status === 'Separated' || emp.status === 'Confirmed') return '100%';
                                                                            const idx = empStages.findIndex((s: any) => s.id === emp.currentStageId);
                                                                            if (idx === -1) return '0%';
                                                                            return `${(idx / (empStages.length - 1 || 1)) * 100}%`;
                                                                        })()
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Strategic Actions */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Button
                                                                variant="ghost"
                                                                className="rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-[10px] uppercase tracking-widest h-12 transition-all border border-slate-200"
                                                                onClick={() => { setSelectedEmployee(emp); setActionType('History'); }}
                                                            >
                                                                Insights
                                                            </Button>
                                                            {emp.review_status === 'Terminated' || emp.status === 'Separated' ? (
                                                                <Button
                                                                    className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase tracking-widest h-12 shadow-sm transition-all active:scale-95"
                                                                    onClick={() => alert('Redirecting to Exit Management Module...')}
                                                                >
                                                                    Exit Protocol
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    className={`rounded-lg font-bold text-[10px] uppercase tracking-widest h-12 shadow-sm transition-all active:scale-95 flex-1 ${emp.isOnboardingComplete === false ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                                                    disabled={emp.isOnboardingComplete === false}
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
                                                                    {emp.isOnboardingComplete === false ? 'Awaiting Sync' : 'Review'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
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
                                <Card className="border border-slate-200 shadow-xl rounded-3xl bg-white overflow-hidden relative z-10">
                                    <div className="h-40 bg-slate-900 relative p-10 overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6">
                                            <Badge className="bg-white/10 text-white border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                ID: EMP-2024-88
                                            </Badge>
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to the Team</h2>
                                            <p className="text-slate-300 font-medium mt-1 flex items-center gap-2">
                                                <Monitor className="w-4 h-4" />
                                                <span>{user?.department || 'Academic Affairs'} • Senior Faculty</span>
                                            </p>
                                        </div>
                                    </div>

                                    <CardContent className="p-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                            {/* Summary Stats */}
                                            <div className="md:col-span-1 space-y-4">
                                                {[
                                                    {
                                                        label: 'Next Review', value: (() => {
                                                            const offset = stageConfigs?.[(user as any)?.currentStageId || '']?.scheduleOffset || 30;
                                                            const joinDate = new Date((user as any)?.joining_date || Date.now());
                                                            joinDate.setDate(joinDate.getDate() + Number(offset));
                                                            return joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                                        })(), icon: Calendar, color: 'slate'
                                                    },
                                                    { label: 'Confirmation', value: '45 Days to go', icon: Clock, color: 'slate' },
                                                    { label: 'Scorecard', value: '4.8 / 5.0', icon: TrendingUp, color: 'slate' }
                                                ].map((stat, i) => (
                                                    <div key={i} className={`p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center`}>
                                                        <div className={`h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 mb-3`}>
                                                            {React.createElement(stat.icon, { className: "w-5 h-5" })}
                                                        </div>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                                        <p className={`text-lg font-bold text-slate-900 tracking-tight`}>{stat.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Vertical Journey Timeline */}
                                            <div className="md:col-span-2 space-y-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Journey Roadmap</h3>
                                                </div>

                                                <div className="space-y-10 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-100 before:z-0">
                                                    {getEmployeeStages(user as any).map((step: any, i: number, arr: any[]) => {
                                                        const currentIdx = arr.findIndex((s: any) => s.id === ((user as any)?.currentStageId || '90_day'));
                                                        const isCompleted = i < currentIdx;
                                                        const isCurrent = i === currentIdx;
                                                        const isPending = i > currentIdx;

                                                        return (
                                                            <div key={i} className={`relative z-10 pl-16 group`}>
                                                                <div className={`absolute left-4 top-1 h-4 w-4 rounded-full ring-4 transition-all duration-300
                                                                    ${isCompleted ? 'bg-emerald-500 ring-emerald-50' :
                                                                        isCurrent ? 'bg-slate-900 ring-slate-100' :
                                                                            'bg-white ring-slate-100'}`}
                                                                />
                                                                <div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`text-xs font-bold uppercase tracking-wider transition-colors
                                                                            ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                            {step.label}
                                                                        </span>
                                                                        <span className="h-px w-6 bg-slate-100" />
                                                                        <span className="text-[10px] font-bold text-slate-300">
                                                                            {isCompleted ? 'Verified' : isCurrent ? 'Active Milestone' : 'Upcoming'}
                                                                        </span>
                                                                    </div>
                                                                    <p className={`text-sm font-medium mt-1 transition-colors
                                                                        ${isPending ? 'text-slate-400' : 'text-slate-600'}`}>
                                                                        {isCompleted ? 'Requirements met and validated.' : isCurrent ? 'Finalizing current assessments.' : 'Phase opens after milestone clearance.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="pt-8 border-t border-slate-100 flex justify-end">
                                                    <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 h-12 shadow-lg">
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
                        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white">
                            <div className="flex h-[700px]">
                                {/* Left Side: Journey Roadmap */}
                                <div className="w-1/3 bg-slate-50 p-8 border-r border-slate-200 relative overflow-hidden">
                                    <div className="relative z-10 h-full flex flex-col">
                                        <div className="mb-6">
                                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Timeline</h2>
                                        </div>

                                        <div className="flex-1 space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-slate-200 before:z-0">
                                            {getEmployeeStages(selectedEmployee).map((s: any, i: number, arr: any[]) => {
                                                const currentIdx = arr.findIndex((st: any) => st.id === selectedEmployee?.currentStageId);
                                                const isCompleted = i < currentIdx;
                                                const isActive = i === currentIdx;

                                                return (
                                                    <div key={s.id} className="relative z-10 pl-12 group">
                                                        <div className={`absolute left-0 top-1 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm
                                                            ${isCompleted ? 'bg-emerald-500 scale-100 cursor-pointer' : isActive ? 'bg-slate-900 ring-4 ring-slate-100' : 'bg-white border border-slate-200'}`}
                                                            onClick={() => isCompleted && setActionType(s.id as any)}
                                                        >
                                                            {(() => {
                                                                const IconComp = getIcon(s.icon);
                                                                return isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />;
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{s.label}</p>
                                                            </div>
                                                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mt-0.5">
                                                                {isCompleted ? 'Completed' : isActive ? 'Active Phase' : 'Next'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="pt-6 border-t border-slate-200">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">CANDIDATE</p>
                                                    <p className="text-sm font-bold text-slate-900 tracking-tight">{selectedEmployee?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Dynamic Content */}
                                <div className="flex-1 bg-white p-10 flex flex-col overflow-hidden">
                                    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                        <div className="mb-8">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assessment Module</p>
                                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight italic mt-2">
                                                {getEmployeeStages(selectedEmployee).find((s: any) => s.id === selectedEmployee?.currentStageId)?.label}
                                            </h3>
                                        </div>

                                        {/* Feedback Mode (30/60/90 Day) */}
                                        {(selectedEmployee?.currentStageId?.includes('day')) && (
                                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                                                <div className="space-y-10">
                                                    {[
                                                        { id: 'q1', label: 'Strategic Alignment', sub: 'Depth of team integration & cultural fit' },
                                                        { id: 'q2', label: 'Operational Velocity', sub: 'Task ownership and independent execution' }
                                                    ].map((q) => (
                                                        <div key={q.id} className="px-8 py-8 rounded-[32px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-700 group">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div className="space-y-1">
                                                                    <p className="text-lg font-black text-slate-900 italic tracking-tight group-hover:text-indigo-600 transition-colors">{q.label}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{q.sub}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center gap-3">
                                                                {[1, 2, 3, 4, 5].map(v => (
                                                                    <button
                                                                        key={v}
                                                                        onClick={() => setReviewForm({
                                                                            ...reviewForm,
                                                                            ratings: { ...reviewForm.ratings, [q.id]: v.toString() }
                                                                        })}
                                                                        className={`flex-1 h-14 rounded-2xl transition-all shadow-sm font-black text-sm
                                                                            ${reviewForm.ratings[q.id] === v.toString()
                                                                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 ring-4 ring-slate-900/10'
                                                                                : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 hover:border-slate-200'}`}
                                                                    >
                                                                        {v}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Reviewer Thesis & Observations</Label>
                                                        <Textarea
                                                            placeholder="Synthesize the candidate's performance during this cycle..."
                                                            className="rounded-[32px] border-slate-200 min-h-[160px] px-8 py-8 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white/50"
                                                            value={reviewForm.feedback}
                                                            onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Decision Mode */}
                                        {selectedEmployee?.currentStageId === 'decision' && (
                                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                                                <div className="grid grid-cols-2 gap-6">
                                                    {[
                                                        { id: 'Confirmed', label: 'Authorize Confirmation', icon: CheckCircle, color: 'emerald' },
                                                        { id: 'Terminated', label: 'Initiate Separation', icon: Trash2, color: 'rose' }
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => setDecisionForm({ ...decisionForm, decision: opt.id })}
                                                            className={`p-10 rounded-[48px] border-2 transition-all duration-700 flex flex-col items-center gap-6 group
                                                                ${decisionForm.decision === opt.id ? `bg-${opt.color}-50 border-${opt.color}-500 shadow-2xl shadow-${opt.color}-100` : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                                        >
                                                            <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center transition-all duration-700
                                                                ${decisionForm.decision === opt.id ? `bg-${opt.color}-600 text-white shadow-xl shadow-${opt.color}-100` : 'bg-slate-100 text-slate-400 group-hover:scale-110'}`}>
                                                                <opt.icon className="w-8 h-8" />
                                                            </div>
                                                            <span className={`text-xs font-black uppercase tracking-widest ${decisionForm.decision === opt.id ? `text-${opt.color}-900` : 'text-slate-400 hover:text-slate-600'}`}>
                                                                {opt.label}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Executive Summary & Rationale</Label>
                                                    <Textarea
                                                        placeholder="Provide the institutional grounds for this final decision..."
                                                        className="rounded-[40px] border-slate-200 min-h-[160px] px-8 py-8 text-sm font-medium bg-white/50"
                                                        value={decisionForm.pipReason}
                                                        onChange={(e) => setDecisionForm({ ...decisionForm, pipReason: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-10 border-t border-slate-100 mt-auto flex gap-6">
                                        <Button variant="ghost" onClick={() => setActionType(null)} className="rounded-2xl px-12 h-16 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                                            Abort
                                        </Button>
                                        <Button onClick={handleReviewSubmit} className="flex-1 rounded-3xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest h-16 shadow-2xl transition-all transform active:scale-95 group">
                                            <span className="flex items-center gap-3">
                                                {selectedEmployee?.currentStageId === 'decision' ? 'Seal Deployment' : 'Validate & Progress'}
                                                <Shield className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                            </span>
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
                        <DialogContent className="max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white/90 backdrop-blur-3xl">
                            <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <Badge className="bg-indigo-500/20 text-indigo-300 border-none mb-6 font-black uppercase tracking-widest text-[10px] px-4 py-1">Hiring Engine</Badge>
                                    <h2 className="text-4xl font-black italic tracking-tighter leading-none">Onboard<br />New Talent</h2>
                                    <p className="text-slate-400 font-bold mt-4 max-w-sm">Initialize a new staff member into the institutional probation pipeline.</p>
                                </div>
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl -mr-40 -mt-40" />
                            </div>
                            <div className="p-12 space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Identity</Label>
                                        <input
                                            className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-base font-black italic focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                            placeholder="DR. JANE SMITH"
                                            value={hireForm.name}
                                            onChange={(e) => setHireForm({ ...hireForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Faculty / Dept</Label>
                                        <Select
                                            value={hireForm.department}
                                            onValueChange={(v) => setHireForm({ ...hireForm, department: v })}
                                        >
                                            <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white px-6 font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-xl">
                                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                                <SelectItem value="Mechanical Eng">Mechanical Eng</SelectItem>
                                                <SelectItem value="Administration">Administration</SelectItem>
                                                <SelectItem value="Research">Research</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Designation</Label>
                                        <input
                                            className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold uppercase focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                            placeholder="Asst. Professor"
                                            value={hireForm.designation}
                                            onChange={(e) => setHireForm({ ...hireForm, designation: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Joining Date</Label>
                                        <input
                                            type="date"
                                            className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                            value={hireForm.joiningDate}
                                            onChange={(e) => setHireForm({ ...hireForm, joiningDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-8 flex gap-6">
                                    <Button variant="ghost" onClick={() => setActionType(null)} className="flex-1 rounded-2xl h-16 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                                        Discard
                                    </Button>
                                    <Button onClick={handleHireSubmit} className="flex-1 rounded-3xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest h-16 shadow-2xl transition-all active:scale-95">
                                        Initialize Onboarding
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
                            <DialogFooter className="bg-slate-50 -mx-6 -mb-4 px-4 py-4 rounded-b-[30px] border-t border-slate-100">
                                <Button variant="outline" className="rounded-xl" onClick={() => setActionType(null)}>Close Profile</Button>
                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100" onClick={() => { setActionType(null); setShowFeedbackModal(true); }}>
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
                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${feedbackData.rating === num.toString() ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
        </Layout>
    );
};

export default ProbationDashboard;
