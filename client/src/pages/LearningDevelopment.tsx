import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
    BookOpen, Award, Plus,
    Calendar, BarChart3, Settings,
    FileText, ShieldCheck, Search, Filter, Download, Eye,
    Clock, AlertCircle, User, Home, UserCog, Star, Edit3, Trash2, ChevronRight, MonitorPlay, CheckCircle
} from 'lucide-react';
import DigitalLMS from './DigitalLMS';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { usePersona } from '../contexts/PersonaContext';

// --- Types ---
interface TrainingRecord {
    id: string;
    staffId?: string; // Optional if assigned to multiple
    staffName?: string;
    title: string;
    organizer: string;
    mode: 'Online' | 'Offline';
    startDate: string;
    endDate: string;
    hours: number;
    category: string;
    status: 'Draft' | 'Submitted' | 'Verified' | 'Approved' | 'Rejected';
    type: 'Self-Logged' | 'Assigned';
    targetStaff?: string[]; // Array of staff IDs for assigned items
    completionStatus?: 'Pending' | 'Completed';
    certificateUrl?: string;
    feedback?: string;
    isCbseRecognized: boolean; // New field for CBSE mandate
}

interface ComplianceNorms {
    academicYear: string;
    totalRequiredHours: number;
    cbseRequiredHours: number;
    categoryNorms: {
        category: string;
        requiredHours: number;
        isCbse: boolean;
    }[];
}

// --- Mock Data ---
const MOCK_NORMS: ComplianceNorms = {
    academicYear: '2023-24',
    totalRequiredHours: 50,
    cbseRequiredHours: 25,
    categoryNorms: [
        { category: 'Pedagogy', requiredHours: 10, isCbse: true },
        { category: 'Child Protection', requiredHours: 5, isCbse: true },
        { category: 'NEP Orientation', requiredHours: 5, isCbse: true },
        { category: 'Subject Upgradation', requiredHours: 5, isCbse: true },
        { category: 'Soft Skills', requiredHours: 25, isCbse: false },
    ]
};

const MOCK_STAFF = [
    { id: 'emp-001', name: 'Ms. Reshma Binu Prasad', role: 'Teacher', department: 'Mathematics' },
    { id: 'emp-002', name: 'Ms. Sanchaiyata Majumdar', role: 'Teacher', department: 'English' },
    { id: 'emp-003', name: 'Dr. R Sedhunivas', role: 'Teacher', department: 'Science' },
    { id: 'emp-004', name: 'Dr. Ranjita Saikia', role: 'Teacher', department: 'History' },
    { id: 'emp-005', name: 'Mr. Manjit Singh', role: 'Teacher', department: 'Physical Education' },
];

const MOCK_RECORDS: TrainingRecord[] = [
    {
        id: 'tr-1',
        staffId: 'emp-001',
        staffName: 'Ms. Reshma Binu Prasad',
        title: 'Effective Pedagogy for 21st Century',
        organizer: 'CBSE COE Chennai',
        mode: 'Online',
        startDate: '2023-06-15',
        endDate: '2023-06-16',
        hours: 8,
        category: 'Pedagogy',
        status: 'Approved',
        type: 'Self-Logged',
        certificateUrl: '#',
        isCbseRecognized: true
    },
    {
        id: 'tr-2',
        staffId: 'emp-001',
        staffName: 'Ms. Reshma Binu Prasad',
        title: 'Inclusive Classroom Strategies',
        organizer: 'Institution Internal',
        mode: 'Offline',
        startDate: '2023-08-20',
        endDate: '2023-08-20',
        hours: 4,
        category: 'Inclusive Education',
        status: 'Verified',
        type: 'Self-Logged',
        certificateUrl: '#',
        isCbseRecognized: false
    },
    {
        id: 'tr-3',
        staffId: 'emp-002',
        staffName: 'Ms. Sanchaiyata Majumdar',
        title: 'NEP 2020: Implementation Roadmap',
        organizer: 'DIET Bangalore',
        mode: 'Offline',
        startDate: '2023-09-10',
        endDate: '2023-09-10',
        hours: 6,
        category: 'NEP Orientation',
        status: 'Approved',
        type: 'Self-Logged',
        certificateUrl: '#',
        isCbseRecognized: true
    },
    {
        id: 'tr-4',
        title: 'Mandatory Child Safety Awareness',
        organizer: 'School Management',
        mode: 'Online',
        startDate: '2023-11-01',
        endDate: '2023-11-02',
        hours: 5,
        category: 'Child Protection',
        status: 'Approved',
        type: 'Assigned',
        targetStaff: ['emp-001', 'emp-002', 'emp-003', 'emp-004', 'emp-005'],
        completionStatus: 'Pending',
        isCbseRecognized: true
    },
    {
        id: 'tr-5',
        staffId: 'emp-003',
        staffName: 'Dr. R Sedhunivas',
        title: 'Advanced Science Lab Safety',
        organizer: 'Science Board',
        mode: 'Offline',
        startDate: '2023-12-05',
        endDate: '2023-12-05',
        hours: 4,
        category: 'Subject Upgradation',
        status: 'Approved',
        type: 'Self-Logged',
        certificateUrl: '#',
        isCbseRecognized: false
    }
];

const LearningDevelopment: React.FC = () => {
    const navigate = useNavigate();
    const { role, user } = usePersona();

    // Map system role to Persona strings for UI logic
    const persona = role === 'EMPLOYEE' ? 'teacher' :
        (role === 'HR_ADMIN' || role === 'ADMIN') ? 'hr' : 'principal';

    const [activeTab, setActiveTab] = useState('overview');
    const [records, setRecords] = useState<TrainingRecord[]>(() => {
        const saved = localStorage.getItem('ld_records');
        return saved ? JSON.parse(saved) : MOCK_RECORDS;
    });
    const [norms, setNorms] = useState<ComplianceNorms>(() => {
        const saved = localStorage.getItem('ld_norms');
        return saved ? JSON.parse(saved) : MOCK_NORMS;
    });
    const [staffNotes, setStaffNotes] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('ld_staff_notes');
        return saved ? JSON.parse(saved) : {};
    });

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isNormsOpen, setIsNormsOpen] = useState(false);
    const [newRecord, setNewRecord] = useState<Partial<TrainingRecord>>({
        mode: 'Online',
        category: norms.categoryNorms[0]?.category || 'Other'
    });
    const [editingNorm, setEditingNorm] = useState<ComplianceNorms>(norms);
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedStaffId, setSelectedStaffId] = useState<string>(persona === 'teacher' ? user.id : '');

    useEffect(() => {
        fetch('/api/employee')
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    // Filter out students in onboarding
                    setEmployees(data.data.filter((e: any) => e.status !== 'Onboarding'));
                }
            })
            .catch(err => console.error('Error fetching employees:', err));
    }, []);

    // Action States
    const [selectedRecord, setSelectedRecord] = useState<TrainingRecord | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        // Safe to use user.id directly for teachers
        if (persona === 'teacher') {
            setSelectedStaffId(user.id);
        }
    }, [user.id, persona]);

    const filteredRecords = records.filter(r => {
        const matchesStaff = selectedStaffId ? (r.staffId === selectedStaffId || (r.type === 'Assigned' && r.targetStaff?.includes(selectedStaffId))) : true;
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        return matchesStaff && matchesSearch;
    });

    // For Admin/Principal viewing aggregate or specific staff
    // For Teachers, show their own records + assigned records targeting them
    const displayRecords = persona === 'teacher' ?
        records.filter(r => r.staffId === user.id || (r.type === 'Assigned' && r.targetStaff?.includes(user.id))) :
        (selectedStaffId && selectedStaffId !== ' ' ?
            records.filter(r => r.staffId === selectedStaffId || (r.type === 'Assigned' && r.targetStaff?.includes(selectedStaffId))) :
            records);

    useEffect(() => {
        localStorage.setItem('ld_records', JSON.stringify(records));
    }, [records]);

    useEffect(() => {
        localStorage.setItem('ld_norms', JSON.stringify(norms));
    }, [norms]);

    useEffect(() => {
        localStorage.setItem('ld_staff_notes', JSON.stringify(staffNotes));
    }, [staffNotes]);

    // Calculate Stats for the selected staff
    const totalApprovedHours = displayRecords
        .filter(r => r.status === 'Approved')
        .reduce((acc, curr) => acc + curr.hours, 0);

    const totalCbseHours = displayRecords
        .filter(r => r.status === 'Approved' && r.isCbseRecognized)
        .reduce((acc, curr) => acc + curr.hours, 0);

    const compliancePercent = Math.min(100, Math.round((totalApprovedHours / norms.totalRequiredHours) * 100));
    const cbseCompliancePercent = Math.min(100, Math.round((totalCbseHours / norms.cbseRequiredHours) * 100));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Verified': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Submitted': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <Layout
            title="Learning & Development"
            description="CBSE Aligned Compliance Portal"
            icon={BookOpen}
            showHome={true}
            headerActions={
                <div className="bg-white border border-slate-200 text-sm font-semibold text-slate-600 rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span className="capitalize">{persona} View</span>
                    <div className="h-3 w-px bg-slate-300 mx-1"></div>
                    <span className="text-[10px] text-slate-500">AY 2023-24</span>
                </div>
            }
        >
            <div className="flex items-center gap-4 border-b border-slate-200 mb-6 bg-white sticky top-0 z-30 pt-2 pb-4">
                <nav className="flex items-center space-x-1">
                     {[
                         { id: 'overview', label: 'Dashboard', icon: BarChart3 },
                         { id: 'records', label: persona === 'teacher' ? 'My Training' : 'All Records', icon: FileText },
                         ...(persona !== 'teacher' ? [{ id: 'verification', label: 'Verification', icon: ShieldCheck }] : []),
                         { id: 'digital-lms', label: 'Digital LMS', icon: MonitorPlay },
                         { id: 'norms', label: 'Norms', icon: Settings },
                         { id: 'core-modules', label: 'Core Modules', icon: ShieldCheck },
                         { id: 'credentials', label: 'Credentials', icon: Award }
                     ].map((tab) => (
                         <button
                             key={tab.id}
                             onClick={() => setActiveTab(tab.id)}
                             className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                 ${activeTab === tab.id
                                     ? 'bg-slate-900 text-white shadow-sm'
                                     : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                 }`}
                         >
                             <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`} />
                             <span>{tab.label}</span>
                         </button>
                     ))}
                 </nav>
            </div>
                {/* Staff Selection & Actions */}
                {/* Staff Selection & Actions - Hidden in Digital LMS */}
                {activeTab !== 'digital-lms' && (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        {persona !== 'teacher' && (
                            <div className="w-full md:w-[300px]">
                                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                                    <SelectTrigger className="bg-white border-slate-200 rounded-lg">
                                        <SelectValue placeholder="All Staff Members" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Staff Members</SelectItem>
                                        {employees.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name} ({s.department})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex items-center gap-3 ml-auto">
                            {selectedStaffId && (
                                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-100 uppercase tracking-wider">
                                    <User className="w-3 h-3" />
                                    Monitoring: {employees.find(ps => ps.id === selectedStaffId)?.name || 'Multiple Staff'}
                                </div>
                            )}
                            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 shadow-sm rounded-lg px-6" onClick={() => setIsAddOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Add Entry
                            </Button>
                        </div>
                    </div>
                )}

                <Tabs value={activeTab} className="space-y-6">
                    {/* TabsList removed as we use the header nav */}

                    <TabsContent value="digital-lms" className="mt-6">
                        <DigitalLMS />
                    </TabsContent>

                    <TabsContent value="core-modules" className="mt-6">
                        <OnboardingPolicyEngine persona={persona} />
                    </TabsContent>

                    <TabsContent value="credentials" className="mt-6">
                        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
                                <Award className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Redirecting to Credentials...</h3>
                            <p className="text-slate-500 max-w-md">Access your digital certificates and badges in the dedicated portfolio view.</p>
                            <Button onClick={() => navigate('/certificates')} className="mt-4 bg-indigo-600 text-white">
                                Open Portfolio
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gapx-4 py-4">
                            {/* Left Column (Main Content) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Welcome Header & Search */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                            {selectedStaffId ? `Staff Insights: ${employees.find(s => s.id === selectedStaffId)?.name || 'Selected User'}` : `Welcome back, ${user.name}!`}
                                        </h1>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tracking professional growth & compliance</p>
                                    </div>
                                    <div className="hidden md:flex items-center bg-white rounded-lg px-4 py-2 border border-slate-200 shadow-sm w-72 focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                                        <Search className="w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search certifications..."
                                            className="ml-2 outline-none text-sm w-full bg-transparent"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Top Cards Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Profile Card */}
                                    <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden relative group">
                                        <CardContent className="px-4 py-4 flex flex-col items-center text-center pt-8">
                                            <div className="absolute top-4 right-4 text-slate-200 group-hover:text-slate-900 transition-colors cursor-pointer">
                                                <Edit3 className="w-4 h-4" />
                                            </div>
                                             <div className="relative w-16 h-16 mb-4">
                                                <div className="w-full h-full rounded-full bg-slate-50 p-1 border border-slate-200">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStaffId ? (employees.find(s => s.id === selectedStaffId)?.name) : user.name}`}
                                                        alt="Profile"
                                                        className="w-full h-full rounded-full"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white rounded-full p-1 border-2 border-white">
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-slate-900 leading-tight">
                                                {selectedStaffId ? (employees.find(s => s.id === selectedStaffId)?.name) : user.name}
                                            </h3>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                                                {selectedStaffId ? (employees.find(s => s.id === selectedStaffId)?.department) : "Department Staff"}
                                            </p>

                                             <div className="flex justify-center gap-6 w-full mt-6 pt-6 border-t border-slate-100">
                                                <div className="text-center">
                                                    <span className="block font-bold text-slate-900">{records.filter(r => r.staffId === (selectedStaffId || user.id)).length}</span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Certificates</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block font-bold text-slate-900">{compliancePercent}%</span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Compliance</span>
                                                    <div className="text-[7px] text-emerald-600 font-bold mt-1">CBSE: {cbseCompliancePercent}%</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Score Card (Progress Theme) */}
                                    <div className="bg-slate-900 rounded-xl px-6 py-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                                        <div className="flex justify-between items-start z-10">
                                            <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Growth Credits</h3>
                                            <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                                                <Award className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="z-10 mt-6 text-white text-center">
                                            <h2 className="text-4xl font-bold tracking-tight">{totalApprovedHours}</h2>
                                            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Approved Hours</p>
                                        </div>
                                    </div>

                                     {/* Deadline Card */}
                                     <div className="bg-white rounded-xl px-6 py-6 flex flex-col justify-between shadow-sm relative overflow-hidden group border border-slate-200">
                                        <div className="flex justify-between items-start z-10">
                                            <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">AY Compliance</h3>
                                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                <Clock className="w-4 h-4 text-slate-600" />
                                            </div>
                                        </div>
                                        <div className="z-10 mt-6 text-center">
                                            <h2 className="text-4xl font-bold tracking-tight text-slate-900">{compliancePercent}<span className="text-xl text-slate-400">%</span></h2>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Goal Progress</p>
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <span className="text-[9px] font-bold text-slate-600 tracking-wider uppercase">CBSE: {cbseCompliancePercent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions Row */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between gapx-4 py-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-tight">Quick Actions</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Standard L&D operations</p>
                                    </div>
                                     <div className="flex gap-6">
                                        {[
                                            { label: 'Add Entry', icon: Plus, action: () => setIsAddOpen(true), color: 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white border-slate-100' },
                                            { label: 'Guidelines', icon: FileText, action: () => setActiveTab('norms'), color: 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white border-slate-100' },
                                            { label: 'Verify', icon: ShieldCheck, action: () => setActiveTab('verification'), color: 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white border-slate-100', hidden: persona === 'teacher' },
                                        ].filter(a => !a.hidden).map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={action.action}
                                                className="group flex flex-col items-center gap-2"
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 border ${action.color}`}>
                                                    <action.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Breakdown */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Thematic Progress</h3>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-slate-200">
                                            {norms.categoryNorms.length} Active Domains
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {norms.categoryNorms.map((n) => {
                                            const actualHrs = displayRecords
                                                .filter(r => r.category === n.category && r.status === 'Approved')
                                                .reduce((acc, curr) => acc + curr.hours, 0);
                                            const catPercent = Math.min(100, Math.round((actualHrs / n.requiredHours) * 100)) || 0;

                                            return (
                                                <Card key={n.category} className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden hover:bg-slate-50 transition-colors group">
                                                    <CardContent className="p-5 flex items-center gap-4">
                                                        <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                            <Star className={`w-4 h-4 ${catPercent >= 100 ? 'text-amber-400 fill-current' : 'text-slate-300 group-hover:text-white'}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight leading-tight">{n.category}</h4>
                                                                <span className="text-[10px] font-bold text-slate-900">{catPercent}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-slate-900 rounded-full transition-all duration-1000" style={{ width: `${catPercent}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Sidebar) */}
                            <div className="space-y-6">
                                {/* Upcoming / Assigned */}
                                <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-slate-200 relative group overflow-hidden">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                        <h3 className="font-bold text-slate-900 tracking-tight uppercase text-xs">Training Queue</h3>
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                    </div>

                                    <div className="space-y-5">
                                        {records.filter(r => r.type === 'Assigned' && r.completionStatus === 'Pending' && (persona === 'teacher' ? (r.targetStaff?.includes(user.id)) : true)).map((r, i) => (
                                            <div key={i} className="flex items-start gap-4 group/item">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                    <div className="w-[1px] h-10 bg-slate-100"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover/item:text-slate-900 transition-colors uppercase">{r.title}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{r.organizer} | {r.hours} Hrs</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-200 mt-1" />
                                            </div>
                                        ))}
                                        {records.filter(r => r.type === 'Assigned' && r.completionStatus === 'Pending' && (persona === 'teacher' ? (r.targetStaff?.includes(user.id)) : true)).length === 0 && (
                                            <p className="text-xs text-slate-400 text-center py-4 italic">No pending assignments</p>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 flex items-center justify-center w-full">
                                            View Performance Plan <ChevronRight className="w-3 h-3 ml-1" />
                                        </button>
                                    </div>
                                </div>

                                {/* Analytics Mini Card */}
                                <div className="bg-slate-900 rounded-2xl px-6 py-6 shadow-sm relative overflow-hidden group">
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest leading-tight">Monthly Engagement</h3>
                                            <Badge className="bg-white/10 text-white border-white/20 text-[8px] font-bold">AY 23-24</Badge>
                                        </div>

                                        <div className="flex items-end h-12 gap-1 px-1">
                                            {[30, 50, 40, 70, 45, 60, 85].map((h, i) => (
                                                <div key={i} className="flex-1 bg-white/10 rounded-t-sm relative group/bar h-full">
                                                    <div className="absolute bottom-0 inset-x-0 bg-white/20 rounded-t-sm transition-all duration-700" style={{ height: `${h}%` }}></div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 flex justify-between items-center text-white border-t border-white/10">
                                            <div>
                                                <h4 className="text-xl font-bold">{compliancePercent}%</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg Compliance</p>
                                            </div>
                                            <div className="text-right">
                                                <h4 className="text-xl font-bold text-emerald-400">+{Math.round(totalApprovedHours / 2)}</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Credits Added</p>
                                            </div>
                                        </div>
                                    </div>
                                    <BarChart3 className="absolute top-0 right-0 p-8 opacity-5 text-white w-32 h-32" />
                                </div>
                            </div>
                        </div>

                        {/* Staff Summary (Admin/Principal Only) - Redesigned */}
                        {persona !== 'teacher' && !selectedStaffId && (
                            <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h4 className="font-bold text-slate-900 flex items-center gap-3 text-lg uppercase tracking-tight">
                                            <div className="p-2 bg-slate-900 rounded-lg text-white">
                                                <UserCog className="w-5 h-5" />
                                            </div>
                                            Staff Training Summary
                                        </h4>
                                        <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Monitoring school-wide professional development</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] font-bold">{employees.length} Active Faculty</Badge>
                                        <Badge className="bg-slate-900 text-white border-none px-3 py-1 rounded-md uppercase tracking-wider text-[10px] font-bold">AY 23-24</Badge>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                                            <tr>
                                                <th className="px-8 py-5">Staff Member</th>
                                                <th className="px-6 py-5">Department</th>
                                                <th className="px-6 py-5 text-center">Assigned</th>
                                                <th className="px-6 py-5 text-center">Completed</th>
                                                <th className="px-6 py-5 text-center">Hours</th>
                                                <th className="px-6 py-5">Reviewer Notes</th>
                                                <th className="px-8 py-5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {employees.map(s => {
                                                const staffRecords = records.filter(r => r.staffId === s.id || (r.type === 'Assigned' && r.targetStaff?.includes(s.id)));
                                                const completed = staffRecords.filter(r => r.status === 'Approved' || r.completionStatus === 'Completed').length;
                                                const totalHrs = staffRecords.filter(r => r.status === 'Approved').reduce((a, b) => a + b.hours, 0);
                                                const cbseHrs = staffRecords.filter(r => r.status === 'Approved' && r.isCbseRecognized).reduce((a, b) => a + b.hours, 0);
                                                const assigned = staffRecords.filter(r => r.type === 'Assigned').length;
                                                const complianceX = Math.round((totalHrs / norms.totalRequiredHours) * 100);
                                                const cbseComplianceX = Math.round((cbseHrs / norms.cbseRequiredHours) * 100);

                                                return (
                                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors group/row">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] uppercase group-hover/row:bg-slate-900 group-hover/row:text-white transition-all">
                                                                    {s.name.split(' ').map((n: string) => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 group-hover/row:text-slate-900 transition-colors uppercase tracking-tight text-sm">{s.name}</div>
                                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {s.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-sm font-medium text-slate-500">{s.department}</td>
                                                        <td className="px-6 py-5 text-center text-sm font-black text-slate-600">{assigned}</td>
                                                        <td className="px-6 py-5 text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={`text-sm font-bold ${completed > 0 ? 'text-slate-900' : 'text-slate-300'}`}>{completed}</span>
                                                                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-slate-400" style={{ width: `${Math.min(100, (completed / 5) * 100)}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <div className="flex items-center gap-1 font-bold text-sm">
                                                                    <span className={complianceX >= 100 ? 'text-slate-900' : 'text-slate-500'}>{totalHrs}h</span>
                                                                    <span className="text-slate-300">/</span>
                                                                    <span className={cbseComplianceX >= 100 ? 'text-emerald-600' : 'text-slate-500'}>{cbseHrs}h</span>
                                                                </div>
                                                                <div className="text-[9px] text-slate-400 font-bold uppercase">CBSE: {cbseComplianceX}%</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="relative max-w-[200px]">
                                                                <Input
                                                                    className="h-9 text-[10px] bg-white border-slate-200 focus:ring-0 rounded-lg text-slate-600 pr-8"
                                                                    placeholder="Add feedback..."
                                                                    value={staffNotes[s.id] || ''}
                                                                    onChange={(e) => setStaffNotes({ ...staffNotes, [s.id]: e.target.value })}
                                                                />
                                                                <Edit3 className="absolute right-3 top-2.5 w-3 h-3 text-slate-300" />
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-lg hover:bg-slate-900 hover:text-white font-bold text-[10px] uppercase tracking-wider h-8"
                                                                onClick={() => { setSelectedStaffId(s.id); setActiveTab('records'); }}
                                                            >
                                                                Analyze
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-4 py-4 bg-slate-50 text-center border-t border-slate-200">
                                    <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900">Download Detailed Audit Report</Button>
                                </div>
                            </div>
                        )}

                        {/* Recent History - High Fidelity */}
                        <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Latest Activity Log</h4>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">Professional Development Timeline</p>
                                </div>
                                <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-lg h-8 px-4 flex items-center gap-2 shadow-sm">
                                    Full Audit History
                                </Button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {displayRecords.slice(0, 5).map((r) => (
                                    <div key={r.id} className="px-4 py-4 hover:bg-slate-50 transition-all group/item">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm
                                                    ${r.type === 'Assigned' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    {r.type === 'Assigned' ? <ShieldCheck className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="font-bold text-slate-900 tracking-tight group-hover/item:text-slate-900 transition-colors uppercase text-sm">{r.title}</h5>
                                                        <Badge className={`text-[8px] font-bold uppercase border-none px-2 py-0 h-4 rounded shadow-none ${getStatusColor(r.status)}`}>
                                                            {r.status}
                                                        </Badge>
                                                        {r.type === 'Assigned' && <Badge className="text-[8px] font-bold uppercase bg-slate-100 text-slate-600 border-none px-2 py-0 h-4">Mandatory</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><Home className="w-3 h-3 text-slate-300" /> {r.organizer}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-300" /> {r.hours} Hours</span>
                                                        {r.staffName && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                                <span className="flex items-center gap-1.5 text-slate-600 font-bold"><User className="w-3 h-3" /> {r.staffName}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gapx-4 py-4">
                                                {r.type === 'Assigned' && r.completionStatus === 'Pending' && persona === 'teacher' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg px-5 shadow-sm active:scale-95 transition-all"
                                                        onClick={() => {
                                                            setRecords(records.map(rec => rec.id === r.id ? { ...rec, completionStatus: 'Completed' } : rec));
                                                        }}
                                                    >
                                                        Mark Completed
                                                    </Button>
                                                )}
                                                <div className="text-right flex items-center gap-3">
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 leading-none">{r.hours}h</div>
                                                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">{r.category}</div>
                                                    </div>
                                                    {r.certificateUrl && (
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 rounded-lg border-slate-200 text-slate-400 hover:text-slate-900"
                                                            onClick={() => {
                                                                setSelectedRecord(r);
                                                                setIsPreviewOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="verification">
                        <div className="space-y-6">
                            {/* Verification Inbox - Redesigned */}
                            <Card className="border border-slate-200 shadow-sm bg-slate-900 overflow-hidden relative group rounded-2xl">
                                <CardHeader className="p-8 border-b border-white/10 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-white text-xl font-bold uppercase tracking-tight">Verification Inbox</CardTitle>
                                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Pending approval for academic compliance</CardDescription>
                                        </div>
                                        <Badge className="bg-amber-500 text-white font-bold px-3 py-1 rounded-md shadow-sm border-none uppercase tracking-wider text-[10px]">
                                            {records.filter(r => r.status === 'Submitted' || r.status === 'Verified').length} PENDING
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 relative z-10">
                                    <div className="divide-y divide-white/10">
                                        {records.filter(r => r.status === 'Submitted' || r.status === 'Verified').map((r) => (
                                            <div key={r.id} className="p-8 flex items-center justify-between group/v hover:bg-white/5 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover/v:bg-white/10 transition-all">
                                                        <UserCog className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-lg tracking-tight mb-1 uppercase">{r.title}</div>
                                                        <div className="text-[10px] text-slate-400 flex items-center gap-3 font-bold uppercase tracking-widest">
                                                            <span className="text-slate-300">{r.staffName}</span>
                                                            <span>•</span>
                                                            <span>{r.hours} Hours</span>
                                                            <span>•</span>
                                                            <span className="bg-white/10 px-2 py-0.5 rounded text-[9px]">{r.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button variant="ghost" className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold text-[10px] tracking-widest uppercase rounded-lg px-6 h-9">Reject</Button>
                                                    <Button
                                                        className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-[10px] tracking-widest uppercase rounded-lg px-8 h-10 shadow-sm transition-all"
                                                        onClick={() => {
                                                            const newStatus = r.status === 'Submitted' ? 'Verified' : 'Approved';
                                                            setRecords(records.map(rec => rec.id === r.id ? { ...rec, status: newStatus } : rec));
                                                        }}
                                                    >
                                                        {r.status === 'Submitted' ? 'Verify' : 'Final Approve'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {records.filter(r => r.status === 'Submitted' || r.status === 'Verified').length === 0 && (
                                            <div className="p-16 text-center">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                    <ShieldCheck className="w-8 h-8 text-slate-500" />
                                                </div>
                                                <p className="text-white/20 font-bold text-[10px] uppercase tracking-widest">All Caught Up!</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="norms">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Institution L&D Policy</h3>
                                <p className="text-xs text-slate-500">Academic Year {norms.academicYear} Requirements</p>
                            </div>
                            {persona !== 'teacher' && (
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-sm"
                                    onClick={() => {
                                        setEditingNorm(JSON.parse(JSON.stringify(norms)));
                                        setIsNormsOpen(true);
                                    }}
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configure Norms
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gapx-4 py-4">
                            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                    <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">Category-wise Hour Targets</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-3">
                                        {norms.categoryNorms.map((n, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-indigo-200 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                                    <div className="font-semibold text-slate-700">{n.category}</div>
                                                </div>
                                                <div className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">{n.requiredHours} Hrs</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-indigo-100 shadow-sm rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-wider text-indigo-600 font-bold">Institution-wide Target</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2 space-y-6">
                                    <div className="px-4 py-4 rounded-xl border border-slate-200 bg-white shadow-sm relative overflow-hidden group">
                                        <div className="relative z-10 flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Total Academic Year Target</p>
                                                <p className="text-4xl font-bold text-slate-900 tracking-tight">{norms.totalRequiredHours} <span className="text-xl text-slate-400">Hrs</span></p>
                                            </div>
                                            <Badge className="bg-slate-900 text-white border-none shadow-none uppercase text-[8px] font-bold tracking-wider">Active Policy</Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 mt-4">
                                        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-900 uppercase mb-1 tracking-widest">CBSE Minimum Mandate</p>
                                            <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold tracking-tight">Of the total hours, <span className="text-slate-900 font-bold">{norms.cbseRequiredHours} Hrs</span> must be CBSE-recognized training as per mandate.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="records">
                        <Card className="border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                                <div>
                                    <CardTitle>{persona === 'teacher' ? 'My Training History' : 'All Teacher Training Records'}</CardTitle>
                                    <CardDescription>View and manage professional development records for the current academic year.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Search records..."
                                            className="w-[280px] pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setSearchTerm('')}
                                        title="Clear Filter"
                                    >
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const headers = ["Title", "Category", "Organizer", "Hours", "Status", "Date"];
                                            const rows = filteredRecords.map(r => [
                                                r.title, r.category, r.organizer, r.hours.toString(), r.status, `${r.startDate} to ${r.endDate}`
                                            ]);
                                            const csvContent = "data:text/csv;charset=utf-8,"
                                                + headers.join(",") + "\n"
                                                + rows.map(e => e.join(",")).join("\n");
                                            const encodedUri = encodeURI(csvContent);
                                            const link = document.createElement("a");
                                            link.setAttribute("href", encodedUri);
                                            link.setAttribute("download", "training_records_export.csv");
                                            document.body.appendChild(link);
                                            link.click();
                                        }}
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4">Training Title</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Organizer</th>
                                                <th className="px-6 py-4 text-center">Hours</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 italic">
                                            {filteredRecords.map((record) => (
                                                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-900">{record.title}</div>
                                                        <div className="text-xs text-slate-400">{record.startDate} to {record.endDate}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium">
                                                                {record.category}
                                                            </Badge>
                                                            {record.isCbseRecognized && (
                                                                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] font-black uppercase ring-1 ring-emerald-200">CBSE</Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{record.organizer}</td>
                                                    <td className="px-6 py-4 text-center font-bold text-slate-700">{record.hours}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={`border ${getStatusColor(record.status)}`}>
                                                            {record.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {record.certificateUrl && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-indigo-600 hover:bg-indigo-50"
                                                                    onClick={() => {
                                                                        setSelectedRecord(record);
                                                                        setIsPreviewOpen(true);
                                                                    }}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    <span className="text-[10px] font-bold uppercase">View</span>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-slate-400 hover:text-slate-900"
                                                                onClick={() => {
                                                                    setSelectedRecord(record);
                                                                    setNewRecord({ ...record });
                                                                    setIsEditOpen(true);
                                                                }}
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-slate-400 hover:text-red-500"
                                                                onClick={() => {
                                                                    if (window.confirm('Are you sure you want to delete this record?')) {
                                                                        setRecords(records.filter(r => r.id !== record.id));
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            {/* Add Training Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Professional Development Record</DialogTitle>
                        <DialogDescription>Enter details for your CBSE COE or external training program.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gapx-4 py-4 py-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Training Title</Label>
                            <Input
                                placeholder="e.g. NEP Orientation Workshop"
                                value={newRecord.title || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Conducting Body / Organizer</Label>
                            <Input
                                placeholder="e.g. CBSE COE Kochi"
                                value={newRecord.organizer || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, organizer: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Training Category</Label>
                            <Select
                                value={newRecord.category}
                                onValueChange={(val: any) => setNewRecord({ ...newRecord, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {norms.categoryNorms.map(cn => (
                                        <SelectItem key={cn.category} value={cn.category}>{cn.category}</SelectItem>
                                    ))}
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={newRecord.startDate || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={newRecord.endDate || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, endDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Hours</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 5"
                                value={newRecord.hours || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, hours: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mode</Label>
                            <Select
                                value={newRecord.mode}
                                onValueChange={(val: any) => setNewRecord({ ...newRecord, mode: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Online">Online / Webinar</SelectItem>
                                    <SelectItem value="Offline">Offline / Workshop</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end pb-1">
                            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setNewRecord({ ...newRecord, isCbseRecognized: !newRecord.isCbseRecognized })}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newRecord.isCbseRecognized ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300'}`}>
                                    {newRecord.isCbseRecognized && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <Label className="text-xs font-bold text-slate-700 cursor-pointer uppercase tracking-tight">CBSE Recognized Training</Label>
                            </div>
                        </div>
                        {persona !== 'teacher' && (
                            <div className="col-span-2 space-y-2">
                                <Label>Target Staff (Assignment)</Label>
                                <Select
                                    value={newRecord.targetStaff ? (newRecord.targetStaff.length === (MOCK_STAFF?.length || 0) ? 'all' : newRecord.targetStaff[0]) : ''}
                                    onValueChange={(val: any) => {
                                        if (val === 'all') setNewRecord({ ...newRecord, targetStaff: MOCK_STAFF.map(s => s.id), type: 'Assigned', completionStatus: 'Pending' });
                                        else if (val === 'none') setNewRecord({ ...newRecord, targetStaff: [], type: 'Self-Logged' });
                                        else setNewRecord({ ...newRecord, targetStaff: [val], type: 'Assigned', completionStatus: 'Pending' });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Self-Logged (Default)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Self-Logged (No Assignment)</SelectItem>
                                        <SelectItem value="all">Assign to All Staff</SelectItem>
                                        {MOCK_STAFF.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name} ({s.department})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="col-span-2 space-y-2 mt-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Certificate Upload</Label>
                            {!newRecord.certificateUrl ? (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="application/pdf,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewRecord({ ...newRecord, certificateUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 transition-transform">
                                        <Download className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="mt-4 text-xs font-bold text-slate-900 leading-none">Drop certificate here or click</p>
                                    <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF or Images up to 5MB</p>
                                </div>
                            ) : (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-emerald-100">
                                            <FileText className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-900 leading-none">Certificate Attached</p>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Ready for verification</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-400 hover:bg-red-50"
                                        onClick={() => setNewRecord({ ...newRecord, certificateUrl: undefined })}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-lg" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 rounded-lg" onClick={() => {
                            const record: TrainingRecord = {
                                ...newRecord as TrainingRecord,
                                id: (records.length + 1).toString(),
                                staffId: newRecord.targetStaff && newRecord.targetStaff.length === 1 ? newRecord.targetStaff[0] : (persona === 'teacher' ? user.id : undefined),
                                staffName: newRecord.targetStaff && newRecord.targetStaff.length === 1 ? (MOCK_STAFF.find(s => s.id === newRecord.targetStaff![0])?.name) : (persona === 'teacher' ? user.name : 'Multiple Staff'),
                                type: newRecord.type || 'Self-Logged',
                                status: (newRecord.type === 'Assigned' ? 'Approved' : 'Submitted'),
                                completionStatus: newRecord.completionStatus,
                                isCbseRecognized: !!newRecord.isCbseRecognized
                            };
                            setRecords([...records, record]);
                            setIsAddOpen(false);
                            setNewRecord({ mode: 'Online', category: norms.categoryNorms[0]?.category || 'Other', isCbseRecognized: false });
                        }}>
                            Submit for Verification
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Modify Norms Dialog */}
            <Dialog open={isNormsOpen} onOpenChange={setIsNormsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 p-0 shadow-2xl">
                    <DialogHeader className="px-6 py-6 border-b border-slate-100">
                        <DialogTitle className="text-xl font-bold text-slate-900 uppercase tracking-tight">Institution L&D Policy</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update target hours and category norms for AY {norms.academicYear}</DialogDescription>
                    </DialogHeader>
                    <div className="px-6 py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Institution Target (Hrs)</Label>
                                <div className="h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 flex items-center">
                                    {editingNorm.totalRequiredHours} Hours
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CBSE Mandated (Hrs)</Label>
                                <div className="h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 flex items-center">
                                    {editingNorm.cbseRequiredHours} Hours
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-slate-900 uppercase tracking-tight text-sm">Category-wise Targets</h4>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-[10px] font-bold uppercase tracking-widest border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg"
                                    onClick={() => {
                                        setEditingNorm({
                                            ...editingNorm,
                                            categoryNorms: [...editingNorm.categoryNorms, { category: 'New Category', requiredHours: 0, isCbse: false }]
                                        });
                                    }}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add Category
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {editingNorm.categoryNorms.map((n, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group/cat">
                                        <div className="flex-1 space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Category Name</Label>
                                            <Input
                                                className="h-9 font-bold text-slate-700 bg-white rounded-lg border-slate-200"
                                                value={n.category}
                                                onChange={(e) => {
                                                    const updatedCategories = [...editingNorm.categoryNorms];
                                                    updatedCategories[i].category = e.target.value;
                                                    setEditingNorm({ ...editingNorm, categoryNorms: updatedCategories });
                                                }}
                                            />
                                        </div>
                                        <div className="w-24 space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Target (Hrs)</Label>
                                            <Input
                                                type="number"
                                                className="h-9 font-bold text-slate-900 bg-white rounded-lg border-slate-200"
                                                value={n.requiredHours}
                                                onChange={(e) => {
                                                    const updatedCategories = [...editingNorm.categoryNorms];
                                                    updatedCategories[i].requiredHours = parseInt(e.target.value) || 0;
                                                    const total = updatedCategories.reduce((acc, c) => acc + c.requiredHours, 0);
                                                    const cbse = updatedCategories.filter(c => c.isCbse).reduce((acc, c) => acc + c.requiredHours, 0);
                                                    setEditingNorm({ ...editingNorm, categoryNorms: updatedCategories, totalRequiredHours: total, cbseRequiredHours: cbse });
                                                }}
                                            />
                                        </div>
                                        <div className="w-24 space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">CBSE Norm</Label>
                                            <Button
                                                variant="ghost"
                                                className={`h-9 w-full rounded-lg border flex items-center justify-center gap-2 transition-all ${n.isCbse ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                                                onClick={() => {
                                                    const updatedCategories = [...editingNorm.categoryNorms];
                                                    updatedCategories[i].isCbse = !updatedCategories[i].isCbse;
                                                    const cbse = updatedCategories.filter(c => c.isCbse).reduce((acc, c) => acc + c.requiredHours, 0);
                                                    const total = updatedCategories.reduce((acc, c) => acc + c.requiredHours, 0);
                                                    setEditingNorm({ ...editingNorm, categoryNorms: updatedCategories, cbseRequiredHours: cbse, totalRequiredHours: total });
                                                }}
                                            >
                                                <ShieldCheck className={`w-3.5 h-3.5 ${n.isCbse ? 'text-white' : 'opacity-30'}`} />
                                                <span className="text-[10px] font-bold">{n.isCbse ? 'YES' : 'NO'}</span>
                                            </Button>
                                        </div>
                                        <div className="pt-5 flex items-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-9 w-9 text-slate-300 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => {
                                                    const updatedCategories = editingNorm.categoryNorms.filter((_, idx) => idx !== i);
                                                    const total = updatedCategories.reduce((acc, c) => acc + c.requiredHours, 0);
                                                    const cbse = updatedCategories.filter(c => c.isCbse).reduce((acc, c) => acc + c.requiredHours, 0);
                                                    setEditingNorm({
                                                        ...editingNorm,
                                                        categoryNorms: updatedCategories,
                                                        totalRequiredHours: total,
                                                        cbseRequiredHours: cbse
                                                    });
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="px-6 py-6 border-t border-slate-100">
                        <Button variant="outline" className="rounded-lg" onClick={() => setIsNormsOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-slate-900 hover:bg-slate-800 rounded-lg px-8 shadow-sm"
                            onClick={() => {
                                setNorms(editingNorm);
                                setIsNormsOpen(false);
                            }}
                        >
                            Update Policy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Training Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Professional Development Record</DialogTitle>
                        <DialogDescription>Update the details of your training record.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gapx-4 py-4 py-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Training Title</Label>
                            <Input
                                placeholder="e.g. NEP Orientation Workshop"
                                value={newRecord.title || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Conducting Body / Organizer</Label>
                            <Input
                                placeholder="e.g. CBSE COE Kochi"
                                value={newRecord.organizer || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, organizer: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Training Category</Label>
                            <Select
                                value={newRecord.category}
                                onValueChange={(val: any) => setNewRecord({ ...newRecord, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {norms.categoryNorms.map(cn => (
                                        <SelectItem key={cn.category} value={cn.category}>{cn.category}</SelectItem>
                                    ))}
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={newRecord.startDate || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={newRecord.endDate || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, endDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Hours</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 5"
                                value={newRecord.hours || ''}
                                onChange={(e) => setNewRecord({ ...newRecord, hours: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mode</Label>
                            <Select
                                value={newRecord.mode}
                                onValueChange={(val: any) => setNewRecord({ ...newRecord, mode: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Online">Online / Webinar</SelectItem>
                                    <SelectItem value="Offline">Offline / Workshop</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end pb-1">
                            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setNewRecord({ ...newRecord, isCbseRecognized: !newRecord.isCbseRecognized })}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newRecord.isCbseRecognized ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300'}`}>
                                    {newRecord.isCbseRecognized && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <Label className="text-xs font-bold text-slate-700 cursor-pointer uppercase tracking-tight">CBSE Recognized Training</Label>
                            </div>
                        </div>
                        <div className="col-span-2 space-y-2 mt-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Attached Certificate</Label>
                            {newRecord.certificateUrl && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-emerald-100">
                                            <FileText className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-900 leading-none">Certificate Attached</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-400 hover:bg-red-50"
                                        onClick={() => setNewRecord({ ...newRecord, certificateUrl: undefined })}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                            {!newRecord.certificateUrl && (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="application/pdf,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewRecord({ ...newRecord, certificateUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <Download className="w-6 h-6 text-slate-400" />
                                    <p className="mt-2 text-[10px] font-bold text-slate-900 uppercase tracking-widest">Upload new certificate</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-lg" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 rounded-lg" onClick={() => {
                            if (selectedRecord) {
                                setRecords(records.map(r => r.id === selectedRecord.id ? { ...r, ...newRecord } as TrainingRecord : r));
                                setIsEditOpen(false);
                                setSelectedRecord(null);
                                setNewRecord({ mode: 'Online', category: norms.categoryNorms[0]?.category || 'Other', isCbseRecognized: false });
                            }
                        }}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Certificate Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden rounded-xl border border-slate-200 shadow-2xl">
                    <DialogHeader className="p-6 border-b bg-slate-50">
                        <DialogTitle className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-tight">
                            <Award className="w-5 h-5 text-slate-900" />
                            Certificate: {selectedRecord?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-100 overflow-auto p-4 flex items-center justify-center">
                        {selectedRecord && selectedRecord.certificateUrl ? (
                            selectedRecord.certificateUrl.startsWith('data:application/pdf') || selectedRecord.certificateUrl.endsWith('.pdf') ? (
                                <iframe
                                    src={selectedRecord.certificateUrl}
                                    className="w-full h-full rounded-lg border-none shadow-sm bg-white"
                                    title="Certificate PDF"
                                />
                            ) : (
                                <img
                                    src={selectedRecord.certificateUrl}
                                    alt="Certificate"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                                />
                            )
                        ) : (
                            <div className="text-slate-400 italic">No certificate preview available</div>
                        )}
                    </div>
                    <DialogFooter className="p-6 border-t bg-slate-50">
                        <Button variant="outline" onClick={() => setIsPreviewOpen(false)} className="rounded-lg">Close</Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 rounded-lg" onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedRecord?.certificateUrl || '';
                            link.download = `Certificate_${selectedRecord?.title.replace(/\s+/g, '_')}`;
                            link.click();
                        }}>
                            Download
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

const OnboardingPolicyEngine = ({ persona }: { persona: string }) => {
    const isHR = persona === 'hr' || persona === 'principal';
    const [policies, setPolicies] = useState<any[]>(() => {
        const saved = localStorage.getItem('onboarding_ld_policies');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'General Faculty Induction', modules: [1, 2, 3], lastUpdated: '2024-01-15' },
            { id: 2, name: 'Admin Staff Essential', modules: [1, 2, 6], lastUpdated: '2024-01-20' },
            { id: 3, name: 'Technical Support Track', modules: [2, 6, 7], lastUpdated: '2024-02-01' }
        ];
    });

    const ALL_MODULES = [
        { id: 1, name: 'Cultural Induction', category: 'Orientation' },
        { id: 2, name: 'System Training (EduMerge OS)', category: 'Technical' },
        { id: 3, name: 'Policy Compliance & Ethics', category: 'Legal' },
        { id: 4, name: 'Teaching Methodology', category: 'Academic' },
        { id: 5, name: 'Student Psychology', category: 'Academic' },
        { id: 6, name: 'Data Security Protocols', category: 'Technical' },
        { id: 7, name: 'Classroom Technology', category: 'Technical' }
    ];

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<any>(null);
    const [newName, setNewName] = useState('');
    const [selectedModules, setSelectedModules] = useState<number[]>([]);

    useEffect(() => {
        localStorage.setItem('onboarding_ld_policies', JSON.stringify(policies));
    }, [policies]);

    const handleSave = () => {
        if (!newName) return;

        if (editingPolicy) {
            const updated = policies.map(p => p.id === editingPolicy.id ?
                { ...p, name: newName, modules: selectedModules, lastUpdated: new Date().toISOString().split('T')[0] } : p);
            setPolicies(updated);
        } else {
            const newPolicy = {
                id: Date.now(),
                name: newName,
                modules: selectedModules,
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            setPolicies([...policies, newPolicy]);
        }

        setIsCreateOpen(false);
        setEditingPolicy(null);
        setNewName('');
        setSelectedModules([]);
    };

    const handleEdit = (policy: any) => {
        setEditingPolicy(policy);
        setNewName(policy.name);
        setSelectedModules(policy.modules);
        setIsCreateOpen(true);
    };

    const toggleModule = (id: number) => {
        setSelectedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Core Training Modules</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Standard training packages and mandatory induction modules.</p>
                </div>
                {isHR && (
                    <Button onClick={() => { setEditingPolicy(null); setNewName(''); setSelectedModules([]); setIsCreateOpen(true); }} className="bg-slate-900 hover:bg-slate-800 shadow-sm rounded-lg h-12 px-8 font-bold text-[10px] uppercase tracking-widest">
                        <Plus className="w-4 h-4 mr-2" /> New Policy
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map(policy => (
                    <Card key={policy.id} className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden group hover:bg-slate-50 transition-colors">
                        <CardHeader className="px-6 py-6 pb-0 flex flex-row items-start justify-between">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            {isHR && (
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(policy)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit3 className="w-4 h-4 text-slate-400" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="px-6 py-6 pt-4">
                            <h4 className="text-base font-bold text-slate-900 leading-tight mb-3 uppercase tracking-tight">{policy.name}</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {policy.modules.map((mId: number) => {
                                    const mod = ALL_MODULES.find(m => m.id === mId);
                                    return mod ? (
                                        <Badge key={mId} variant="secondary" className="bg-slate-100 text-slate-500 text-[9px] font-bold uppercase rounded border-none shadow-none">
                                            {mod.name.split(' (')[0]}
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                <span>{policy.modules.length} Modules</span>
                                <span>{policy.lastUpdated}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl rounded-xl border border-slate-200 shadow-2xl p-0 overflow-hidden bg-white">
                    <div className="bg-slate-900 p-8 text-white relative">
                        <DialogTitle className="text-xl font-bold uppercase tracking-tight">
                            {editingPolicy ? 'Update Policy' : 'New Training Policy'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                            Group modules into a standard package for onboarding.
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Policy Template Name</Label>
                            <Input
                                placeholder="e.g. Science Faculty Induction"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="h-12 rounded-lg border border-slate-200 bg-white focus:ring-0 transition-all font-bold text-slate-900"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Mandatory Modules</Label>
                            <div className="grid grid-cols-1 gap-3">
                                {ALL_MODULES.map(mod => {
                                    const isSelected = selectedModules.includes(mod.id);
                                    return (
                                        <div
                                            key={mod.id}
                                            onClick={() => toggleModule(mod.id)}
                                            className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer
                                                ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                                    ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-sm uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{mod.name}</div>
                                                    <div className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>{mod.category}</div>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                                                ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'}`}>
                                                {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button onClick={handleSave} className="flex-1 bg-slate-900 hover:bg-slate-800 h-12 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm">
                                {editingPolicy ? 'Update Policy' : 'Create Policy'}
                            </Button>
                            <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="h-12 px-8 rounded-lg text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LearningDevelopment;
