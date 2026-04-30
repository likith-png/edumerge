import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Archive, PlusCircle, CheckCircle2, ShieldCheck, Gavel,
    BookOpen, Book, Megaphone, AlertTriangle, BarChart3,
    Search, Filter, Download, Plus, Shield, Edit3, Save, Trash2,
    Activity, User
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { usePersona } from '../contexts/PersonaContext';

const PolicyGuides: React.FC = () => {
    const { role, user } = usePersona();
    const [activeTab, setActiveTab] = useState('repository');

    // Determine view mode based on persona
    const isHR = role === 'HR_ADMIN' || role === 'ADMIN';
    const viewMode = isHR ? 'HR_Admin' : 'Employee';

    // Handbook State
    const [handbookData, setHandbookData] = useState({
        title: 'Staff Handbook 2024',
        description: 'Unified orientation guide for all teaching and non-teaching personnel.',
        isActive: true,
        sections: ['Heritage & Values', 'Leave & Attendance', 'Professional Ethics', 'Payroll & Benefits', 'Conflict Resolution', 'Dress Code Guidelines']
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingHandbook, setEditingHandbook] = useState({ ...handbookData });

    // Unified Creation State
    const [newPolicy, setNewPolicy] = useState({
        title: '',
        type: 'Repository', // Repository, SOP, Handbook, Statutory
        category: 'HR',
        content: '',
        isConsentForm: false,
        creationMode: 'description' as 'description' | 'attachment'
    });

    const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Approval Workflow State
    const [governanceQueue, setGovernanceQueue] = useState([
        {
            id: 'GQ-101',
            title: 'Finance Procurement Policy 2024',
            category: 'Internal Audit Review',
            description: 'Submitted by HR Admin for review before board publication.',
            status: 'Pending',
            type: 'Draft Revision',
            reviewers: [1, 2, 3]
        },
        {
            id: 'GQ-102',
            title: 'Digital Privacy Handbook Update',
            category: 'IT Compliance Review',
            description: 'Proposed changes to student data handling protocols.',
            status: 'Pending',
            type: 'Policy Patch',
            reviewers: [1, 4]
        }
    ]);

    const handleApprove = (id: string) => {
        setGovernanceQueue(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'Approved' } : item
        ));
    };

    const handleReject = (id: string) => {
        setGovernanceQueue(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'Rejected' } : item
        ));
    };

    // SOP State
    const [sopViewMode, setSopViewMode] = useState<'Guides' | 'Videos'>('Guides');
    const [selectedSOP, setSelectedSOP] = useState<any>(null);
    const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);

    const subModules = [
        { id: 'repository', label: 'Policy Repository', icon: Archive, roles: ['Employee', 'HR_Admin'] },
        { id: 'creation', label: 'Policy Creation', icon: PlusCircle, roles: ['HR_Admin'] },
        { id: 'approval', label: 'Approval Workflow', icon: CheckCircle2, roles: ['HR_Admin'] },
        { id: 'compliance', label: 'Compliance Tracking', icon: ShieldCheck, roles: ['HR_Admin'] },
        { id: 'statutory', label: 'Statutory Library', icon: Gavel, roles: ['Employee', 'HR_Admin'] },
        { id: 'sop', label: 'Departmental SOP', icon: BookOpen, roles: ['Employee', 'HR_Admin'] },
        { id: 'handbook', label: 'Employee Handbook', icon: Book, roles: ['Employee', 'HR_Admin'] },
        { id: 'communication', label: 'Announcements', icon: Megaphone, roles: ['Employee', 'HR_Admin'] },
        { id: 'violation', label: 'Violation Tracker', icon: AlertTriangle, roles: ['HR_Admin'] },
        { id: 'analytics', label: 'Analytics & Audit', icon: BarChart3, roles: ['HR_Admin'] },
    ];

    const DEFAULT_POLICIES = [
        {
            id: 'P-101',
            title: 'Code of Conduct 2024',
            category: 'HR',
            status: 'Approved',
            version: 'V-3.1',
            updated: '2024-02-10',
            role: 'All',
            acknowledged: true,
            mandatory: true,
            description: 'Core behavioral guidelines and ethical standards for all institutional personnel.',
            content: 'The 2024 Code of Conduct outlines the mandatory standards of behavior expected from all employees.'
        },
        {
            id: 'P-104',
            title: 'Safety & POSH Policy',
            category: 'Compliance',
            status: 'Approved',
            version: 'V-4.0',
            updated: '2023-11-20',
            role: 'All',
            acknowledged: false,
            mandatory: true,
            description: 'Institutional safety standards and prevention of sexual harassment guidelines.',
            content: 'Edumerge Institution is committed to providing a safe and fair environment for all.'
        },
        {
            id: 'P-103',
            title: 'Academic Assessment Guide',
            category: 'Academic',
            status: 'Approved',
            version: 'V-2.4',
            updated: '2024-01-15',
            role: 'Teaching',
            acknowledged: true,
            mandatory: false,
            description: 'Standardized grading and assessment templates for the academic year.',
            content: 'The Assessment Guide provides faculty with the validated rubrics for student evaluations.'
        }
    ];

    const [policies, setPolicies] = useState(DEFAULT_POLICIES);

    React.useEffect(() => {
        const savedPolicies = localStorage.getItem(`policy_module_${user?.id || 'demo'}`);
        if (savedPolicies) {
            try {
                setPolicies(JSON.parse(savedPolicies));
            } catch (e) { }
        }
    }, [user?.id]);

    const handleSignPolicy = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // prevent opening the view modal
        setPolicies(prev => {
            const updated = prev.map(p => p.id === id ? { ...p, acknowledged: true } : p);
            localStorage.setItem(`policy_module_${user?.id || 'demo'}`, JSON.stringify(updated));
            return updated;
        });
    };

    const currentTabs = subModules.filter(tab => tab.roles.includes(viewMode));

    return (
        <Layout
            title="Policy & Guides"
            description="Institutional Governance Portal"
            icon={Book}
            showHome={true}
        >
            <div className="max-w-7xl mx-auto space-y-8 mt-6 pb-20">
            {/* View Switcher & Navigation */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-1 sticky top-0 z-[40] mb-8">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg shadow-sm">
                        <Shield className="w-4 h-4 text-white/80" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            {isHR ? 'Admin' : 'Employee'}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block opacity-20"></div>

                    {/* Pill-style Tabs */}
                    <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-50 p-1 rounded-lg">
                        {currentTabs.slice(0, 5).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                        {currentTabs.length > 5 && (
                            <div className="relative group">
                                <select
                                    className={`px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest bg-transparent text-slate-500 border-none outline-none cursor-pointer hover:bg-white/50 hover:text-indigo-600 transition-all appearance-none ${currentTabs.find(t => t.id === activeTab && currentTabs.indexOf(t) >= 5) ? 'bg-white !text-indigo-600 shadow-xl shadow-indigo-100/50' : ''}`}
                                    onChange={(e) => setActiveTab(e.target.value)}
                                    value={currentTabs.find(t => t.id === activeTab && currentTabs.indexOf(t) >= 5) ? activeTab : "more"}
                                >
                                    <option value="more" disabled>More...</option>
                                    {currentTabs.slice(5).map(tab => (
                                        <option key={tab.id} value={tab.id}>{tab.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </nav>
                </div>
            </div>

                    {/* Module Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            {subModules.find(t => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-slate-500 text-xs font-medium">Institutional Governance Portal</p>
                    </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    className="pl-11 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none w-72 shadow-xl shadow-slate-100/50 transition-all"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl shadow-sm border-slate-100 hover:bg-white"><Filter className="w-4 h-4" /></Button>
                            {viewMode === 'HR_Admin' && (
                                <Button className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm text-sm font-medium gap-2 transition-all">
                                    <Plus className="w-4 h-4" /> Create New
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                        {/* Left/Main Column */}
                        <div className="md:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
                            {activeTab === 'repository' && (
                                <div className="flex flex-col h-full">
                                    <div className="px-8 py-6 border-b border-indigo-100/50 flex gap-4 overflow-x-auto no-scrollbar bg-white/20">
                                        {['All', 'HR', 'Academic', 'IT', 'Safety', 'Finance'].map(cat => (
                                            <Button key={cat} variant="ghost" size="sm" className="rounded-2xl text-[10px] font-black uppercase tracking-widest px-6 hover:bg-white transition-all shadow-sm hover:shadow-md">
                                                {cat}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="divide-y divide-indigo-50/50 flex-1">
                                        {policies.map(p => (
                                            <div
                                                key={p.id}
                                                className="p-8 flex items-center justify-between hover:bg-indigo-50/30 transition-all duration-500 cursor-pointer group"
                                                onClick={() => {
                                                    setSelectedPolicy(p);
                                                    setIsViewModalOpen(true);
                                                }}
                                            >
                                                <div className="flex gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${p.category === 'HR' ? 'bg-indigo-100/50 text-indigo-600' : 'bg-emerald-100/50 text-emerald-600'}`}>
                                                        <Archive className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-indigo-950 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.title}</h4>
                                                        <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                                            <span className="px-2 py-0.5 rounded bg-slate-100">{p.category}</span>
                                                            <span className={`px-2 py-0.5 rounded ${p.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{p.status}</span>
                                                            {p.mandatory && <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-600">MANDATORY</span>}
                                                            {p.acknowledged && <span className="px-2 py-0.5 rounded bg-indigo-600 text-white">ACKNOWLEDGED</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        if (!p.acknowledged) {
                                                            handleSignPolicy(e, p.id);
                                                        }
                                                    }}
                                                    className={`h-12 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${p.acknowledged ? 'bg-white/50 text-slate-400 border-slate-100 px-8' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-100'}`}
                                                >
                                                    {p.acknowledged ? <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3"/> Signed</span> : 'Review & Execute'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}                            {activeTab === 'creation' && (
                                <div className="p-10 space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Unified Policy Creator</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-1">Draft and distribute institutional protocols</p>
                                        </div>
                                        <div className="flex items-center gap-4 px-6 py-3 bg-indigo-50/50 backdrop-blur-md rounded-2xl border border-indigo-100">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Consent Form</Label>
                                            <Switch
                                                checked={newPolicy.isConsentForm}
                                                onCheckedChange={(val) => {
                                                    if (val) {
                                                        setNewPolicy({
                                                            ...newPolicy,
                                                            isConsentForm: true,
                                                            title: 'New Employee Consent & Acknowledgement',
                                                            type: 'Repository',
                                                            category: 'HR',
                                                            content: 'I hereby acknowledge that I have received and read the institutional policies including the Staff Handbook. I agree to abide by the terms and conditions set forth by the institution...'
                                                        });
                                                    } else {
                                                        setNewPolicy({ ...newPolicy, isConsentForm: false, title: '', content: '' });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Module</Label>
                                            <Select value={newPolicy.type} onValueChange={(val) => setNewPolicy({ ...newPolicy, type: val })}>
                                                <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm focus:ring-indigo-500/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-slate-100 rounded-2xl shadow-2xl">
                                                    <SelectItem value="Repository">Policy Repository</SelectItem>
                                                    <SelectItem value="SOP">Operational SOP</SelectItem>
                                                    <SelectItem value="Handbook">Employee Handbook</SelectItem>
                                                    <SelectItem value="Statutory">Statutory Library</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                                            <Select value={newPolicy.category} onValueChange={(val) => setNewPolicy({ ...newPolicy, category: val })}>
                                                <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm focus:ring-indigo-500/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-slate-100 rounded-2xl shadow-2xl">
                                                    <SelectItem value="HR">HR & Admin</SelectItem>
                                                    <SelectItem value="Academic">Academic</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                    <SelectItem value="IT">IT & Security</SelectItem>
                                                    <SelectItem value="Safety">Safety & POSH</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Policy Title</Label>
                                            <Input
                                                value={newPolicy.title}
                                                onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                                                className="h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:ring-blue-500/20 font-semibold"
                                                placeholder="e.g. Remote Work Policy 2024"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content Input Strategy</Label>
                                            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
                                                <button
                                                    onClick={() => setNewPolicy({ ...newPolicy, creationMode: 'description' })}
                                                    className={`px-6 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${newPolicy.creationMode === 'description' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                                                >
                                                    Rich Text Description
                                                </button>
                                                <button
                                                    onClick={() => setNewPolicy({ ...newPolicy, creationMode: 'attachment' })}
                                                    className={`px-6 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${newPolicy.creationMode === 'attachment' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                                                >
                                                    File Attachment
                                                </button>
                                            </div>
                                        </div>

                                        {newPolicy.creationMode === 'description' ? (
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Policy Details & Formatted Clauses</Label>
                                                <Textarea
                                                    value={newPolicy.content}
                                                    onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                                                    className="h-60 rounded-3xl bg-white border-slate-100 shadow-sm p-6 focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium leading-relaxed"
                                                    placeholder="Draft your comprehensive policy details here..."
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Upload Source Document</Label>
                                                <div className="h-60 rounded-[40px] border-2 border-dashed border-indigo-100 bg-indigo-50/20 flex flex-col items-center justify-center space-y-4 group hover:border-indigo-300 hover:bg-white transition-all cursor-pointer shadow-inner">
                                                    <div className="p-6 bg-white rounded-3xl shadow-xl shadow-indigo-100 text-indigo-400 group-hover:text-indigo-600 transition-all group-hover:scale-110">
                                                        <Download className="w-10 h-10" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-black text-indigo-950 uppercase tracking-tight">Drop your policy PDF or Word doc here</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Max 10MB • AES-256 Encrypted</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="h-10 rounded-xl font-black uppercase text-[10px] tracking-widest border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white transition-all">Browse Secure Files</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 bg-indigo-900 rounded-[32px] shadow-2xl shadow-indigo-200 flex items-center justify-between group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                                        <div className="flex items-center gap-5 text-white relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                                <Shield className="w-6 h-6 text-indigo-300" />
                                            </div>
                                            <p className="text-[10px] font-black leading-relaxed uppercase tracking-[2px]">
                                                {newPolicy.isConsentForm ? 'Institutional Onboarding Protocol Ready' : 'Global Statutory Compliance Tracking Active'}
                                            </p>
                                        </div>
                                        <div className="flex gap-4 relative z-10">
                                            <Button variant="ghost" className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest text-indigo-100 hover:bg-white/10">Draft Template</Button>
                                            <Button className="h-12 px-10 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95">
                                                <Save className="w-4 h-4" /> Securely Publish
                                            </Button>
                                        </div>
                                        </div>
                                    </div>
                            )}

                            {activeTab === 'compliance' && (
                                <div className="p-10">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Acknowledgement Progress</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Real-time compliance tracking system</p>
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-900 uppercase tracking-tight text-lg mb-4">{i === 1 ? 'Attendance Policy 2024' : i === 2 ? 'Remote Work Protocol' : 'Code of Conduct'}</p>
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: i === 1 ? '92%' : i === 2 ? '45%' : '78%' }} />
                                                    </div>
                                                </div>
                                                <div className="text-right pl-10">
                                                    <p className="text-2xl font-bold text-blue-600 tracking-tighter">{i === 1 ? '92%' : i === 2 ? '45%' : '78%'}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Consensus</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'analytics' && (
                                <div className="p-10">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="p-8 bg-white/50 rounded-[40px] border border-white shadow-sm">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[3px] mb-8">Compliance Heatmap</p>
                                            <div className="h-48 flex items-end justify-between gap-2">
                                                {[60, 80, 40, 90, 70, 85].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-indigo-500/10 rounded-2xl relative group overflow-hidden h-full">
                                                        <div className="absolute bottom-0 w-full bg-indigo-500 hover:bg-orange-500 transition-all duration-700 rounded-t-xl shadow-[0_-10px_20px_rgba(99,102,241,0.2)]" style={{ height: `${h}%` }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-8 bg-white/50 rounded-[40px] border border-white shadow-sm">
                                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-[3px] mb-8">Deviation Log</p>
                                            <div className="space-y-4">
                                                <div className="flex gap-4 items-start p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed uppercase">IT Security breach reported in Academic block.</p>
                                                </div>
                                                <div className="flex gap-4 items-start p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed uppercase">Code of Conduct inquiry pending - Case #821</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <Button className="w-full h-16 bg-indigo-950 hover:bg-black rounded-3xl font-black text-[10px] uppercase tracking-[3px] text-white gap-3 shadow-2xl transition-all">
                                            <Download className="w-5 h-5 text-indigo-400" /> Export Governance Audit PDF
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'approval' && (
                                <div className="p-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h3 className="text-2xl font-black text-indigo-950 uppercase italic">Governance Queue</h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Policy Review & Approval Workflow</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-orange-200">
                                                {governanceQueue.filter(i => i.status === 'Pending').length} Pending
                                            </span>
                                            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-200">
                                                {governanceQueue.filter(i => i.status === 'Approved').length + 15} Deployed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {governanceQueue.map(item => (
                                            <div key={item.id} className={`p-8 bg-white/60 backdrop-blur-md border rounded-[40px] shadow-xl transition-all duration-500 ${item.status === 'Approved' ? 'border-emerald-200 bg-emerald-50/20' : item.status === 'Rejected' ? 'border-red-200 bg-red-50/20' : 'border-indigo-100 hover:border-indigo-400 hover:shadow-indigo-100/50'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-3 px-3 py-1 bg-indigo-50 rounded-full w-fit border border-indigo-100">{item.category}</p>
                                                        <div className="flex items-center gap-4">
                                                            <h4 className="text-xl font-black text-indigo-950 uppercase italic tracking-tight">{item.title}</h4>
                                                            {item.status !== 'Pending' && (
                                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                                                                    {item.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">{item.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-block px-4 py-2 bg-white/50 border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">{item.type}</span>
                                                        <div className="flex -space-x-3 justify-end">
                                                            {item.reviewers.map(u => <div key={u} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 border-4 border-white shadow-xl" />)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-8 pt-8 border-t border-slate-100/50 flex items-center justify-between">
                                                    <div className="flex gap-4">
                                                        <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">Review Diff</Button>
                                                        <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">Governance Notes</Button>
                                                    </div>
                                                    {item.status === 'Pending' ? (
                                                        <div className="flex gap-3">
                                                            <Button
                                                                onClick={() => handleApprove(item.id)}
                                                                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                                            >
                                                                Approve v1.0
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleReject(item.id)}
                                                                className="h-12 px-8 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                                                            >
                                                                Request Changes
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] font-black text-slate-400 italic uppercase tracking-widest">Decision Authenticated</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'statutory' && (
                                <div className="p-10 h-full flex flex-col">
                                    <div className="bg-slate-900 rounded-3xl p-10 mb-10 text-white relative overflow-hidden shadow-xl min-h-[300px] flex flex-col justify-center">
                                        <div className="absolute top-0 right-0 p-10 opacity-10"><Gavel className="w-64 h-64" /></div>
                                        <div className="relative z-10 max-w-lg space-y-4">
                                            <h3 className="text-3xl font-bold uppercase tracking-tight">Statutory Library</h3>
                                            <p className="text-slate-300 font-medium leading-relaxed text-lg pr-12">Mandatory regulatory compliance repository for Institutional Accreditation.</p>
                                            <div className="flex gap-4 pt-4">
                                                <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/10">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Affiliation Status</p>
                                                    <p className="text-sm font-bold uppercase text-emerald-400">Valid until 2026</p>
                                                </div>
                                                <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/10">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Safety Audit</p>
                                                    <p className="text-sm font-bold uppercase text-orange-400">Review in 45 Days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[4px] mb-8 pl-2">Regulatory Documentation</h4>
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        {[
                                            { title: 'Affiliation Bye-Laws', date: 'Release V-2023', icon: Gavel },
                                            { title: 'POSH Compliance v4', date: 'Regulatory Patch 4.1', icon: Shield },
                                            { title: 'Labor Law Guidelines', date: '2024 Institutional Final', icon: Book },
                                            { title: 'UGC Service Rulebook', date: 'Academic Edition 22', icon: BookOpen }
                                        ].map((doc, i) => (
                                            <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-blue-200 transition-all duration-300 flex items-center gap-4 cursor-pointer group">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                    <doc.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 uppercase tracking-tight text-sm group-hover:text-blue-600 transition-colors">{doc.title}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{doc.date}</p>
                                                </div>
                                                <Download className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sop' && (
                                <div className="p-10">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 uppercase">Operational SOPs</h3>
                                                <p className="text-sm text-slate-500 font-medium mt-1">Standard Operating Procedures</p>
                                            </div>
                                        <div className="bg-slate-100/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSopViewMode('Guides')}
                                                className={`h-10 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${sopViewMode === 'Guides' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-white'}`}
                                            >
                                                Guides
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSopViewMode('Videos')}
                                                className={`h-10 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${sopViewMode === 'Videos' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-white'}`}
                                            >
                                                Videos
                                            </Button>
                                        </div>
                                    </div>

                                    {sopViewMode === 'Guides' ? (
                                        <div className="grid grid-cols-1 gap-6">
                                            {[
                                                { id: 1, dept: 'Academic', title: 'Answer Sheet Grading Workflow', steps: 12 },
                                                { id: 2, dept: 'Finance', title: 'Quarterly Vendor Settlement', steps: 8 },
                                                { id: 3, dept: 'Security', title: 'Emergency Drill Response', steps: 15 },
                                                { id: 4, dept: 'HR', title: 'New Joiner Induction Journey', steps: 22 }
                                            ].map((sop, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedSOP(sop);
                                                        setIsSOPModalOpen(true);
                                                    }}
                                                    className="flex gap-6 p-6 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                                                >
                                                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">0{i + 1}</div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">{sop.dept}</p>
                                                        <h4 className="font-bold text-slate-900 text-lg tracking-tight uppercase leading-none">{sop.title}</h4>
                                                        <div className="flex items-center gap-4 mt-3">
                                                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: '60%' }} />
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sop.steps} Steps</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                            <Archive className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-8">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="group cursor-pointer">
                                                    <div className="aspect-video bg-indigo-950 rounded-[40px] relative overflow-hidden flex items-center justify-center shadow-2xl group-hover:shadow-indigo-200 transition-all duration-700">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-950 transition-all duration-500 shadow-2xl">
                                                            <Plus className="w-8 h-8 rotate-45" /> 
                                                        </div>
                                                        <div className="absolute bottom-6 left-8 right-8">
                                                            <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                                                                <div className="h-full bg-indigo-400 w-1/3 shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 px-4">
                                                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[3px] mb-2">Video Training Cluster</p>
                                                        <h4 className="font-black text-indigo-950 group-hover:text-indigo-600 transition-colors uppercase italic text-lg tracking-tight">Institutional Protocol Module #{i}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Duration: 04:20 • v2024 Archive</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'handbook' && (
                                <div className="p-8">
                                    <div className={`border-2 rounded-3xl p-8 mb-4 flex items-center justify-between transition-colors ${handbookData.isActive ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-100 border-slate-200 grayscale opacity-60'}`}>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-xl font-black tracking-tight ${handbookData.isActive ? 'text-indigo-900' : 'text-slate-600'}`}>{handbookData.title}</h3>
                                                {!handbookData.isActive && <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px] font-black uppercase">Inactive</span>}
                                            </div>
                                            <p className={`max-w-sm font-medium leading-relaxed italic opacity-80 ${handbookData.isActive ? 'text-indigo-700' : 'text-slate-500'}`}>{handbookData.description}</p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className={`rounded-xl font-bold px-6 shadow-sm ${handbookData.isActive ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`} disabled={!handbookData.isActive}>Live Web Version</Button>
                                                <Button size="sm" variant="outline" className={`rounded-xl font-bold px-6 shadow-sm ${handbookData.isActive ? 'border-indigo-200 text-indigo-700 hover:bg-white' : 'border-slate-300 text-slate-400'}`}>Download Layout (In-Design)</Button>
                                                {viewMode === 'HR_Admin' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="rounded-xl font-bold px-4 text-indigo-600 hover:bg-white flex items-center gap-2"
                                                        onClick={() => {
                                                            setEditingHandbook({ ...handbookData });
                                                            setIsEditModalOpen(true);
                                                        }}
                                                    >
                                                        <Edit3 className="w-4 h-4" /> Edit Handbook
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-32 h-44 rounded-xl shadow-2xl border-4 rotate-6 hover:rotate-0 transition-all cursor-pointer flex items-center justify-center overflow-hidden ${handbookData.isActive ? 'bg-white border-indigo-200' : 'bg-slate-200 border-slate-300'}`}>
                                            <div className={`w-full h-full p-4 font-black text-sm text-white ${handbookData.isActive ? 'bg-gradient-to-tr from-indigo-500 to-indigo-700' : 'bg-slate-400'}`}>
                                                {handbookData.title.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-xs font-black text-slate-400 tracking-[3px] uppercase mb-4">Structure & Sections</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {handbookData.sections.map((sec, i) => (
                                            <div key={i} className={`p-4 border rounded-2xl transition-all text-center group ${handbookData.isActive ? 'bg-white border-slate-200 hover:border-indigo-500 cursor-pointer' : 'bg-slate-50 border-slate-200 opacity-50'}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-black text-xs transition-colors ${handbookData.isActive ? 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>{i + 1}</div>
                                                <p className={`text-xs font-bold ${handbookData.isActive ? 'text-slate-900' : 'text-slate-500'}`}>{sec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'communication' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-black text-slate-900 border-l-4 border-amber-500 pl-4">Institutional Announcements</h3>
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-sm shadow-amber-100">Broadcast Update</Button>
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gapx-4 py-4 pb-6 border-b border-slate-100 group">
                                                <div className="w-16 h-16 rounded-3xl bg-amber-50 flex flex-col items-center justify-center text-amber-600 font-bold border border-amber-100/50 group-hover:scale-105 transition-transform">
                                                    <span className="text-lg">1{i}</span>
                                                    <span className="text-[10px] uppercase font-black">FEB</span>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[9px] font-black uppercase">Critical Update</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled: 09:00 AM</span>
                                                    </div>
                                                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Revised Travel & Reimbursement Policy effective immediately.</h4>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">System-wide update to reimbursement slabs for varsity events has been published. All HODs are requested to sync before the weekend.</p>
                                                    <div className="flex gap-4 pt-2">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                            <CheckCircle2 className="w-3 h-3" /> 88% Delivered
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                                            <Archive className="w-3 h-3" /> 1,240 Views
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                    <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-amber-50 hover:text-amber-600"><Search className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'violation' && (
                                <div className="p-8">
                                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 mb-8 flex justify-between items-center relative overflow-hidden group">
                                        <div className="space-y-4 relative z-10">
                                            <h3 className="text-xl font-bold text-red-900 border-l-4 border-red-500 pl-4">Violation Tracker</h3>
                                            <p className="text-red-700/80 max-w-sm font-medium text-sm">Record and audit policy deviations with traceable evidentiary support.</p>
                                            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold px-6 shadow-sm gap-2">
                                                <AlertTriangle className="w-4 h-4" /> Log New Case
                                            </Button>
                                        </div>
                                        <div className="bg-white px-6 py-4 rounded-xl shadow-md border border-red-100 text-center min-w-[120px]">
                                            <p className="text-4xl font-bold text-red-600 tracking-tighter">04</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Open Cases</p>
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-2xl font-black text-indigo-950 uppercase italic tracking-tight">Institutional Friction Log</h3>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Real-time policy deviation & enforcement tracking</p>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { id: 'CSE-841', policy: 'IT Security Bypass', severity: 'High', date: '2d ago', status: 'Inquiry' },
                                            { id: 'ADM-211', policy: 'Academic Ethics Violation', severity: 'Critical', date: '5d ago', status: 'Committee Assigned' }
                                        ].map((v) => (
                                            <div key={v.id} className="p-8 bg-white/40 backdrop-blur-xl border border-white rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-700 group flex items-center justify-between">
                                                <div className="flex items-center gap-8">
                                                    <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-xl ${v.severity === 'Critical' ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-orange-500 text-white shadow-orange-200'}`}>
                                                        <AlertTriangle className="w-10 h-10" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-indigo-950 uppercase italic leading-tight mb-2 tracking-tight">{v.policy}</h4>
                                                        <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                            <span className="text-indigo-600 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">Case Registry #{v.id}</span>
                                                            <span className={`px-3 py-1 rounded-full border ${v.severity === 'Critical' ? 'border-rose-100 text-rose-600' : 'border-orange-100 text-orange-600'}`}>{v.severity} Level</span>
                                                            <span className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 italic">{v.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-indigo-950 uppercase tracking-[2px]">{v.status}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Governance Active</p>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="w-14 h-14 rounded-2xl bg-white/50 border border-slate-100 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"><Filter className="w-5 h-5" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                                {activeTab === 'handbook' && (
                                    <div className="p-10">
                                        <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 rounded-[48px] p-10 mb-10 text-white relative overflow-hidden shadow-2xl">
                                            <div className="absolute top-0 right-0 p-10 opacity-10"><BookOpen className="w-64 h-64" /></div>
                                            <div className="relative z-10 space-y-6">
                                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Employee Handbook</h3>
                                                <p className="text-indigo-100/70 font-medium leading-relaxed italic text-lg pr-12">The authoritative guide to institutional life, benefits, and operational standards.</p>
                                                <div className="flex gap-4 pt-4">
                                                    <Button className="h-14 px-10 bg-white text-indigo-950 rounded-[20px] font-black uppercase tracking-[2px] text-[10px] shadow-xl hover:bg-indigo-50 transition-all">Download v.2.4 PDF</Button>
                                                    {isHR && <Button variant="outline" className="h-14 px-10 border-white/20 text-white rounded-[20px] font-black uppercase tracking-[2px] text-[10px] hover:bg-white/10" onClick={() => setIsEditModalOpen(true)}>Update Master Copy</Button>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            {handbookData.sections.map((sec, i) => (
                                                <div key={i} className="p-8 bg-white/50 border border-white rounded-[40px] shadow-xl hover:shadow-indigo-100 transition-all duration-500 group flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 italic">0{i+1}</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-black text-indigo-950 uppercase tracking-tight italic text-lg leading-none">{sec}</h4>
                                                        <p className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-widest">Master Section Governance</p>
                                                    </div>
                                                    <Plus className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 transition-colors" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'communication' && (
                                    <div className="p-10">
                                        <div className="flex justify-between items-center mb-10">
                                            <div>
                                                <h3 className="text-2xl font-black text-indigo-950 uppercase italic tracking-tight">Governance Announcements</h3>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Institutional updates & policy broadcasts</p>
                                            </div>
                                            <Button className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100">Broadcast Update</Button>
                                        </div>
                                        <div className="space-y-8">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="p-8 bg-white/60 backdrop-blur-xl border border-white rounded-[48px] shadow-2xl relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[120px] -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                                                    <div className="flex gap-8 items-start relative z-10">
                                                        <div className="w-20 h-20 rounded-[32px] bg-white border border-slate-100 flex items-center justify-center shadow-xl">
                                                            <Megaphone className="w-10 h-10 text-indigo-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">Policy Release</span>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">12 Hours Ago</span>
                                                            </div>
                                                            <h4 className="text-2xl font-black text-indigo-950 uppercase italic leading-none mb-4 tracking-tighter">Updated Leave Policy v.4.0 Deployment</h4>
                                                            <p className="text-slate-500 font-medium italic leading-relaxed text-sm pr-12">The board of governors has approved the revised leave structure. All department heads are requested to disseminate the updated digital guidebook to their respective clusters by EOD Friday.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Default Fallback for generic tabs */}
                            {!['repository', 'creation', 'compliance', 'analytics', 'approval', 'statutory', 'sop', 'handbook', 'communication', 'violation'].includes(activeTab) && (
                                <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                                        <BookOpen className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">{subModules.find(t => t.id === activeTab)?.label}</h3>
                                        <p className="max-w-xs mx-auto text-xs text-slate-500 font-medium">This module is currently being provisioned with institutional data.</p>
                                    </div>
                                    <Button variant="outline" className="rounded-xl font-bold">Request Setup</Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                             {isHR ? (
                                 <>
                                     <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl group">
                                         <div className="absolute top-0 right-0 p-8 opacity-10">
                                             <Shield className="w-32 h-32" />
                                         </div>
                                         <div className="relative z-10 space-y-8">
                                             <div className="flex justify-between items-start">
                                                 <h3 className="text-2xl font-black uppercase tracking-tight italic">Global Compliance</h3>
                                                 <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                     <Activity className="w-6 h-6" />
                                                 </div>
                                             </div>
                                             <div className="flex items-end gap-3">
                                                 <span className="text-5xl font-bold tracking-tighter">98%</span>
                                                 <div className="mb-2">
                                                     <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 leading-none">Verified</p>
                                                     <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Institutional</p>
                                                 </div>
                                             </div>
                                             <p className="text-sm font-medium text-indigo-100 italic leading-relaxed pr-12">Total institutional consensus reached across 100+ mandatory regulatory documents.</p>
                                             <Button className="w-full h-12 bg-white text-indigo-900 hover:bg-slate-100 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95">Trigger Global Audit</Button>
                                         </div>
                                     </div>

                                     <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
                                         <div className="flex items-center justify-between">
                                             <h3 className="font-bold text-slate-900 uppercase tracking-widest flex items-center gap-4">
                                                 <Megaphone className="w-6 h-6 text-orange-500" />
                                                 Recent Broadcasts
                                             </h3>
                                             <Plus className="w-5 h-5 text-slate-300" />
                                         </div>
                                         <div className="space-y-8">
                                             {[1, 2].map((u) => (
                                                 <div key={u} className="flex gap-6 group cursor-pointer">
                                                     <div className="w-1.5 h-16 bg-orange-500 rounded-full group-hover:h-20 transition-all duration-500" />
                                                     <div>
                                                         <p className="text-lg font-black text-indigo-950 uppercase italic tracking-tight group-hover:text-orange-500 transition-colors">Leave Policy v.4.2 Revision</p>
                                                         <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium italic pr-6">Updated special leave sections and bereavement protocols effective immediately.</p>
                                                     </div>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                 </>
                             ) : (
                                 <>
                                     <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg group">
                                         <div className="absolute top-0 right-0 p-8 opacity-10">
                                             <CheckCircle2 className="w-32 h-32" />
                                         </div>
                                         <div className="relative z-10 space-y-8">
                                             <div className="flex justify-between items-start">
                                                 <h3 className="text-2xl font-black uppercase tracking-tight italic">My Compliance</h3>
                                                 <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                     <User className="w-6 h-6" />
                                                 </div>
                                             </div>
                                             <div className="flex items-end gap-3">
                                                 <span className="text-5xl font-bold tracking-tighter">66%</span>
                                                 <div className="mb-2">
                                                     <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 leading-none">Active</p>
                                                     <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Pending Actions</p>
                                                 </div>
                                             </div>
                                             <p className="text-sm font-medium text-emerald-100 italic leading-relaxed pr-8">Complete the remaining mandatory acknowledgements to ensure institutional adherence.</p>
                                             <Button className="w-full h-12 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all" onClick={() => setActiveTab('repository')}>Sign Pending Docs</Button>
                                         </div>
                                     </div>

                                     <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
                                         <h3 className="font-bold text-slate-900 uppercase tracking-widest flex items-center gap-4">
                                             <AlertTriangle className="w-6 h-6 text-rose-500" />
                                             Governance Alerts
                                         </h3>
                                         <div className="space-y-6">
                                             {policies.filter(p => p.mandatory && !p.acknowledged).map((p) => (
                                                 <div key={p.id} className="p-8 bg-rose-50/50 border border-rose-100 rounded-[40px] space-y-4 group">
                                                     <div className="flex justify-between items-start">
                                                         <p className="text-[9px] font-black text-rose-600 uppercase tracking-[3px]">Immediate Action</p>
                                                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"><Archive className="w-4 h-4 text-rose-500" /></div>
                                                     </div>
                                                     <p className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-tight">{p.title}</p>
                                                     <Button size="sm" className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-rose-100 transition-all active:scale-95" onClick={() => {
                                                         setSelectedPolicy(p);
                                                         setIsViewModalOpen(true);
                                                     }}>Authenticate Signature</Button>
                                                 </div>
                                             ))}
                                             {policies.filter(p => p.mandatory && !p.acknowledged).length === 0 && (
                                                 <div className="p-10 bg-emerald-50/50 border border-emerald-100 rounded-[48px] text-center">
                                                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-emerald-100">
                                                         <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                                     </div>
                                                     <p className="text-xl font-bold text-slate-900 uppercase tracking-tight">Status Verified</p>
                                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">No pending governance tasks.</p>
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 </>
                             )}
                         </div>
                     </div>

                    {/* Bottom Status Section */}
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t border-slate-200 pt-8 mt-12 px-2">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                <span className="text-indigo-950">System: Operational Authenticated</span>
                            </div>
                            <span className="opacity-40">•</span>
                            <span>Primary Cluster: Asia_ME_01</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 opacity-40" />
                                <span>Registry Heartbeat: 2m</span>
                            </div>
                            <span className="opacity-40">•</span>
                            <span className="text-indigo-600 cursor-pointer hover:underline transition-all">Institutional Archives</span>
                        </div>
                    </div>
                </div>
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl p-0">
                    <div className="bg-indigo-600 px-4 py-4 text-white">
                        <DialogTitle className="text-xl font-black">Edit Employee Handbook</DialogTitle>
                        <DialogDescription className="text-indigo-100 mt-1">Configure handbook content and global visibility.</DialogDescription>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between p-6 bg-indigo-50/30 backdrop-blur-md rounded-3xl border border-indigo-100/50">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold text-slate-900">Handbook Status</Label>
                                <p className="text-xs text-slate-500 font-medium">Toggle visibility for all employees</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black uppercase ${editingHandbook.isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {editingHandbook.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <Switch
                                    checked={editingHandbook.isActive}
                                    onCheckedChange={(val) => setEditingHandbook({ ...editingHandbook, isActive: val })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-slate-400 ml-1">Handbook Title</Label>
                                <Input
                                    value={editingHandbook.title}
                                    onChange={(e) => setEditingHandbook({ ...editingHandbook, title: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-slate-400 ml-1">Manual Summary</Label>
                                <Textarea
                                    value={editingHandbook.description}
                                    onChange={(e) => setEditingHandbook({ ...editingHandbook, description: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-black uppercase text-slate-400 ml-1">Handbook Sections</Label>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 rounded-lg text-indigo-600 border-indigo-100 bg-indigo-50 hover:bg-indigo-100"
                                    onClick={() => setEditingHandbook({ ...editingHandbook, sections: [...editingHandbook.sections, 'New Section'] })}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add Section
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {editingHandbook.sections.map((sec, idx) => (
                                    <div key={idx} className="flex gap-2 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs shrink-0">{idx + 1}</div>
                                        <Input
                                            value={sec}
                                            onChange={(e) => {
                                                const newSecs = [...editingHandbook.sections];
                                                newSecs[idx] = e.target.value;
                                                setEditingHandbook({ ...editingHandbook, sections: newSecs });
                                            }}
                                            className="h-10 rounded-xl border-slate-200"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            onClick={() => {
                                                const newSecs = editingHandbook.sections.filter((_, i) => i !== idx);
                                                setEditingHandbook({ ...editingHandbook, sections: newSecs });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="px-8 py-6 bg-white/50 backdrop-blur-xl border-t border-slate-100 rounded-b-[40px]">
                        <Button variant="ghost" className="font-bold text-slate-600" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl flex items-center gap-2 shadow-sm shadow-indigo-100"
                            onClick={() => {
                                setHandbookData({ ...editingHandbook });
                                setIsEditModalOpen(false);
                            }}
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detailed Policy View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    {selectedPolicy && (
                        <div className="flex flex-col h-[80vh]">
                            <div className="p-8 bg-indigo-600 text-white relative">
                                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Archive className="w-48 h-48" /></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">{selectedPolicy.category} Module</span>
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Version {selectedPolicy.version}</span>
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight mb-2">{selectedPolicy.title}</h2>
                                    <p className="text-indigo-100 font-medium italic opacity-80">{selectedPolicy.description}</p>
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-8 bg-white">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-indigo-600" />
                                        Policy Clauses & Guidelines
                                    </h3>
                                    <div className="bg-white px-8 py-8 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                                        {selectedPolicy.content}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Target Persona</p>
                                        <p className="font-bold text-slate-900">{selectedPolicy.role}</p>
                                    </div>
                                    <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                                        <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Last Mandatory Review</p>
                                        <p className="font-bold text-slate-900">{selectedPolicy.updated}</p>
                                    </div>
                                </div>

                                <div className="px-4 py-4 bg-slate-900 rounded-3xl text-white flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Compliance Status</p>
                                        <div className="flex items-center gap-2 text-xl font-black">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                            {selectedPolicy.status}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {!selectedPolicy.acknowledged && !isHR && (
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black gap-2 px-8">
                                                <Save className="w-4 h-4" /> Sign & Acknowledge
                                            </Button>
                                        )}
                                        <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black gap-2 px-8">
                                            <Download className="w-4 h-4" /> Download PDF
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6 border-t border-slate-100 bg-white/50 backdrop-blur-xl flex justify-end">
                                <Button onClick={() => setIsViewModalOpen(false)} variant="ghost" className="rounded-xl font-bold text-slate-500">Close Viewer</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* SOP Detail Modal */}
            <Dialog open={isSOPModalOpen} onOpenChange={setIsSOPModalOpen}>
                <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    {selectedSOP && (
                        <div className="flex flex-col">
                            <div className="p-8 bg-slate-900 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><BookOpen className="w-32 h-32" /></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">{selectedSOP.dept} Department</span>
                                        <span className="px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedSOP.steps} Steps</span>
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight mb-2">{selectedSOP.title}</h2>
                                    <p className="text-slate-400 font-medium text-sm line-clamp-2">{selectedSOP.description}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-indigo-600" />
                                        Process Control Checklist
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedSOP.details.split('. ').map((step: string, idx: number) => (
                                            <div key={idx} className="flex gap-6 p-6 bg-white/40 backdrop-blur-md rounded-[32px] border border-white hover:border-indigo-200 transition-all shadow-sm">
                                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{idx + 1}</div>
                                                <p className="flex-1 text-sm font-bold text-slate-700 leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 py-4 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Archive className="w-5 h-5 text-indigo-600" /></div>
                                        <div>
                                            <p className="text-xs font-black text-indigo-600 uppercase">Compliance Status</p>
                                            <p className="text-sm font-bold text-slate-900 tracking-tight">ISO-9001:2015 Validated</p>
                                        </div>
                                    </div>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold gap-2 px-6">
                                        Get Certified
                                    </Button>
                                </div>
                            </div>

                            <div className="px-8 py-6 border-t border-slate-100 bg-white/50 backdrop-blur-xl flex justify-end">
                                <Button onClick={() => setIsSOPModalOpen(false)} variant="ghost" className="rounded-xl font-bold text-slate-500">Close SOP</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default PolicyGuides;
