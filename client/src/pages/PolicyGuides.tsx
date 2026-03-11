import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Archive, PlusCircle, CheckCircle2, ShieldCheck, Gavel,
    BookOpen, Book, Megaphone, AlertTriangle, BarChart3,
    Home, Search, Filter, Download, Plus, Shield, Edit3, Save, Trash2
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
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
                        {/* Header Section */}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-slate-50"
                            >
                                <Home className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-indigo-100 rounded-lg shadow-sm">
                                    <Book className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                        Policy & Guides
                                    </h1>
                                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Institutional Governance Portal</p>
                                </div>
                            </div>
                        </div>

                        {/* View Switcher & Navigation */}
                        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar max-w-full pb-1 md:pb-0">


                            {/* Role Indicator (Auto-managed by Persona) */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
                                <Shield className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-black text-indigo-700 uppercase tracking-tight">
                                    {isHR ? 'Admin Control' : 'Employee View'}
                                </span>
                            </div>

                            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                            {/* Pill-style Tabs */}
                            <nav className="flex items-center space-x-1">
                                {currentTabs.slice(0, 5).map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-1 ring-indigo-500 ring-offset-1 scale-105'
                                                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                                            }`}
                                    >
                                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-100' : 'text-slate-400'}`} />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                                {currentTabs.length > 5 && (
                                    <select
                                        className={`px-4 py-2 rounded-full text-sm font-bold bg-slate-100 text-slate-600 border-none outline-none cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-all ${currentTabs.find(t => t.id === activeTab && currentTabs.indexOf(t) >= 5) ? 'bg-indigo-600 !text-white' : ''}`}
                                        onChange={(e) => setActiveTab(e.target.value)}
                                        value={currentTabs.find(t => t.id === activeTab && currentTabs.indexOf(t) >= 5) ? activeTab : "more"}
                                    >
                                        <option value="more" disabled>More Modules...</option>
                                        {currentTabs.slice(5).map(tab => (
                                            <option key={tab.id} value={tab.id}>{tab.label}</option>
                                        ))}
                                    </select>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Module Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                {subModules.find(t => t.id === activeTab)?.label}
                                <span className="text-indigo-500/20">—</span>
                            </h2>
                            <p className="text-slate-500 font-medium">Manage and view critical {subModules.find(t => t.id === activeTab)?.label.toLowerCase()} details.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl shadow-sm"><Filter className="w-4 h-4" /></Button>
                            {viewMode === 'HR_Admin' && (
                                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md gap-2">
                                    <Plus className="w-4 h-4" /> Create New
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left/Main Column */}
                        <Card className="md:col-span-2 border-slate-200 shadow-sm rounded-3xl overflow-hidden min-h-[500px]">
                            {activeTab === 'repository' && (
                                <div className="p-0">
                                    <div className="p-6 border-b border-slate-100 flex gap-4 overflow-x-auto no-scrollbar">
                                        {['All', 'HR', 'Academic', 'IT', 'Safety', 'Finance'].map(cat => (
                                            <Button key={cat} variant="ghost" size="sm" className="rounded-full font-bold px-4">{cat}</Button>
                                        ))}
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {policies.map(p => (
                                            <div
                                                key={p.id}
                                                className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                                                onClick={() => {
                                                    setSelectedPolicy(p);
                                                    setIsViewModalOpen(true);
                                                }}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`p-3 rounded-2xl ${p.category === 'HR' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        <Archive className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</h4>
                                                        <div className="flex gap-2 text-[10px] font-black uppercase text-slate-400 mt-1">
                                                            <span>{p.category}</span>
                                                            <span>•</span>
                                                            <span className={p.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}>{p.status}</span>
                                                            {p.mandatory && <span className="text-rose-500">• MANDATORY</span>}
                                                            {p.acknowledged && <span className="text-emerald-500">• ACKNOWLEDGED</span>}
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
                                                    className={`rounded-xl font-bold transition-all ${p.acknowledged ? 'bg-slate-100 text-slate-400' : 'group-hover:bg-indigo-600 group-hover:text-white'}`}
                                                >
                                                    {p.acknowledged ? 'View Copy' : 'Read & Sign'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'creation' && (
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Unified Policy Creator</h3>
                                            <p className="text-sm text-slate-500 font-medium tracking-tight">Draft and distribute policies across all institutional modules.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400">Consent Form Template</Label>
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

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-slate-400 ml-1">Target Module</Label>
                                            <Select value={newPolicy.type} onValueChange={(val) => setNewPolicy({ ...newPolicy, type: val })}>
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectItem value="Repository">Policy Repository</SelectItem>
                                                    <SelectItem value="SOP">Operational SOP</SelectItem>
                                                    <SelectItem value="Handbook">Employee Handbook</SelectItem>
                                                    <SelectItem value="Statutory">Statutory Library</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-slate-400 ml-1">Category</Label>
                                            <Select value={newPolicy.category} onValueChange={(val) => setNewPolicy({ ...newPolicy, category: val })}>
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectItem value="HR">HR & Admin</SelectItem>
                                                    <SelectItem value="Academic">Academic</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                    <SelectItem value="IT">IT & Security</SelectItem>
                                                    <SelectItem value="Safety">Safety & POSH</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-slate-400 ml-1">Policy Title</Label>
                                            <Input
                                                value={newPolicy.title}
                                                onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-200"
                                                placeholder="e.g. Remote Work Policy 2024"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-black uppercase text-slate-400 ml-1">Policy Content Type</Label>
                                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                                <button
                                                    onClick={() => setNewPolicy({ ...newPolicy, creationMode: 'description' })}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${newPolicy.creationMode === 'description' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                                                >
                                                    Add Description
                                                </button>
                                                <button
                                                    onClick={() => setNewPolicy({ ...newPolicy, creationMode: 'attachment' })}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${newPolicy.creationMode === 'attachment' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                                                >
                                                    Attach Document
                                                </button>
                                            </div>
                                        </div>

                                        {newPolicy.creationMode === 'description' ? (
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase text-slate-400 ml-1">Policy Details & Clauses</Label>
                                                <Textarea
                                                    value={newPolicy.content}
                                                    onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                                                    className="h-48 rounded-xl bg-slate-50 border-slate-200 p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="Draft your policy details here..."
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase text-slate-400 ml-1">Upload Policy Document</Label>
                                                <div className="h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center space-y-3 group hover:border-indigo-300 transition-colors cursor-pointer">
                                                    <div className="p-4 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                        <Download className="w-8 h-8" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-slate-700">Drop your policy PDF or Word doc here</p>
                                                        <p className="text-xs text-slate-400 mt-1">Maximum file size: 10MB</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="rounded-xl font-bold border-indigo-200 text-indigo-600 bg-white">Browse Files</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-indigo-700">
                                            <Shield className="w-5 h-5 text-indigo-500" />
                                            <p className="text-xs font-bold leading-tight uppercase tracking-wide">
                                                {newPolicy.isConsentForm ? 'Ready for Onboarding Integration' : 'Standard Compliance Tracking enabled'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" className="rounded-xl font-bold text-slate-500">Save as Template</Button>
                                            <Button className="bg-indigo-600 rounded-xl font-black text-white px-8 shadow-lg shadow-indigo-100 flex items-center gap-2">
                                                <Save className="w-4 h-4" /> Publish Policy
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'compliance' && (
                                <div className="p-8">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-black text-slate-900">Acknowledgement Progress</h3>
                                        <p className="text-sm text-slate-500">Track which employees have signed off on mandatory policies.</p>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-slate-900">Attendance Policy 2024</p>
                                                    <div className="w-64 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: i === 1 ? '92%' : i === 2 ? '45%' : '78%' }} />
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-indigo-600">{i === 1 ? '92%' : i === 2 ? '45%' : '78%'}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Compliant</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'analytics' && (
                                <div className="p-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Compliance Heatmap</p>
                                            <div className="h-40 flex items-end justify-between gap-1 mt-4">
                                                {[60, 80, 40, 90, 70, 85].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-lg relative group overflow-hidden">
                                                        <div className="absolute bottom-0 w-full bg-indigo-600 transition-all group-hover:bg-indigo-700" style={{ height: `${h}%` }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Violations</p>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex gap-3 items-start">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1" />
                                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">IT Security breach reported in Academic block.</p>
                                                </div>
                                                <div className="flex gap-3 items-start">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1" />
                                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">Code of Conduct inquiry pending - Case #821</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <Button className="w-full bg-slate-900 h-12 rounded-2xl font-black text-white gap-2">
                                            <Download className="w-4 h-4" /> Export Audit-Ready PDF Report
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'approval' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-black text-slate-900">Governance Queue</h3>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">
                                                {governanceQueue.filter(i => i.status === 'Pending').length} Pending Review
                                            </span>
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                                                {governanceQueue.filter(i => i.status === 'Approved').length + 15} Approved
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {governanceQueue.map(item => (
                                            <div key={item.id} className={`p-6 bg-white border rounded-3xl shadow-sm transition-all ${item.status === 'Approved' ? 'border-emerald-200 bg-emerald-50/30' : item.status === 'Rejected' ? 'border-red-200 bg-red-50/30' : 'border-slate-200 hover:border-indigo-300'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{item.category}</p>
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-lg font-black text-slate-900">{item.title}</h4>
                                                            {item.status !== 'Pending' && (
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {item.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold mb-2">{item.type}</span>
                                                        <div className="flex -space-x-2 justify-end">
                                                            {item.reviewers.map(u => <div key={u} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex gap-4">
                                                        <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">Review Changes</Button>
                                                        <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">Add Comment</Button>
                                                    </div>
                                                    {item.status === 'Pending' ? (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => handleApprove(item.id)}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-6 shadow-md"
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleReject(item.id)}
                                                                className="bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold px-6"
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs font-bold text-slate-400 italic">Decision recorded</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'statutory' && (
                                <div className="p-8">
                                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-20"><Gavel className="w-40 h-40" /></div>
                                        <div className="relative z-10 max-w-lg space-y-4">
                                            <h3 className="text-2xl font-black">Statutory Compliance Library</h3>
                                            <p className="text-indigo-100 font-medium leading-relaxed italic">Access core regulatory documents for CBSE, Labor Laws, and institutional affiliations.</p>
                                            <div className="flex gap-4 pt-4">
                                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                                    <p className="text-[10px] font-black uppercase text-indigo-300">CBSE Affiliation</p>
                                                    <p className="text-sm font-bold">Expires: Dec 2026</p>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                                    <p className="text-[10px] font-black uppercase text-indigo-300">Fire & Safety</p>
                                                    <p className="text-sm font-bold">Valid until Oct 2024</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Affiliation & Regulatory Documents</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { title: 'CBSE Affiliation Bye-Laws', date: 'V-2023', icon: Gavel },
                                            { title: 'POSH Compliance Template', date: 'V-4.1', icon: Shield },
                                            { title: 'Regional Labor Law Guidelines', date: '2024 Final', icon: Book },
                                            { title: 'UGC Service Rulebook', date: 'Ed-22', icon: BookOpen }
                                        ].map((doc, i) => (
                                            <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer group">
                                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    <doc.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 truncate">{doc.title}</p>
                                                    <p className="text-xs text-slate-500">{doc.date}</p>
                                                </div>
                                                <Download className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sop' && (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">Operational SOPs</h3>
                                            <p className="text-sm text-slate-500">Standard operating procedures for institutional excellence.</p>
                                        </div>
                                        <div className="bg-white border border-slate-200 p-1 rounded-xl flex">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSopViewMode('Guides')}
                                                className={`rounded-lg px-4 transition-all ${sopViewMode === 'Guides' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50'}`}
                                            >
                                                Guides
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSopViewMode('Videos')}
                                                className={`rounded-lg px-4 transition-all ${sopViewMode === 'Videos' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50'}`}
                                            >
                                                Videos
                                            </Button>
                                        </div>
                                    </div>

                                    {sopViewMode === 'Guides' ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                {
                                                    id: 1,
                                                    dept: 'Academic',
                                                    title: 'Answer Sheet Grading Workflow',
                                                    steps: 12,
                                                    description: 'Complete end-to-end workflow for manual and digital grading of periodic assessments.',
                                                    details: '1. Collection of scripts from central bank. 2. Allocation to registered evaluators. 3. Verification of moderator samples. 4. Digital entry of marks into ERP. 5. Archiving of physical scripts.'
                                                },
                                                {
                                                    id: 2,
                                                    dept: 'Finance',
                                                    title: 'Quarterly Vendor Settlement SOP',
                                                    steps: 8,
                                                    description: 'Financial protocols for clearing outstanding vendor invoices and procurement audits.',
                                                    details: '1. PO-Invoice matching. 2. HOD approval clearing. 3. Tax compliance verification. 4. NEFT scheduling. 5. Receipt archiving.'
                                                },
                                                {
                                                    id: 3,
                                                    dept: 'Security',
                                                    title: 'Emergency Drill Response Guide',
                                                    steps: 15,
                                                    description: 'Standard emergency evacuation and response protocols for all staff and students.',
                                                    details: '1. Alarm activation protocol. 2. Floor warden assembly. 3. Staircase clearance. 4. Assembly point headcount. 5. First-aid team dispatch.'
                                                },
                                                {
                                                    id: 4,
                                                    dept: 'HR',
                                                    title: 'New Joiner Induction Checklist',
                                                    steps: 22,
                                                    description: 'Comprehensive 7-day induction journey for new teaching and non-teaching staff.',
                                                    details: '1. Document verification. 2. IT Asset allocation. 3. Portal orientation. 4. Department head meet. 5. Performance benchmark setting.'
                                                }
                                            ].map((sop, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedSOP(sop);
                                                        setIsSOPModalOpen(true);
                                                    }}
                                                    className="flex gap-6 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-indigo-100 transition-all cursor-pointer group shadow-sm hover:shadow-indigo-50"
                                                >
                                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center font-black text-lg text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">{i + 1}</div>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{sop.dept} Block</p>
                                                        <h4 className="font-black text-slate-900 text-lg leading-tight">{sop.title}</h4>
                                                        <p className="text-xs text-slate-500 font-medium italic underline underline-offset-4 decoration-indigo-200 group-hover:text-indigo-600 transition-colors">View {sop.steps} Process Control Steps</p>
                                                    </div>
                                                    <div className="flex flex-col justify-center items-end gap-2">
                                                        <Button size="icon" variant="ghost" className="rounded-full bg-white shadow-sm border border-slate-100 group-hover:text-indigo-600"><Plus className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-6">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="group cursor-pointer">
                                                    <div className="aspect-video bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-indigo-100 transition-all">
                                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                                                            <Plus className="w-6 h-6 rotate-45" /> {/* Use as Play icon for now */}
                                                        </div>
                                                        <div className="absolute bottom-4 left-4 right-4">
                                                            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-500 w-1/3" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 px-2">
                                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Video Guide {i}</p>
                                                        <h4 className="font-bold text-slate-900">Institutional Protocol #{i}</h4>
                                                        <p className="text-xs text-slate-500 mt-1">4 min • Professional Development</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'handbook' && (
                                <div className="p-8">
                                    <div className={`border-2 rounded-3xl p-8 mb-8 flex items-center justify-between transition-colors ${handbookData.isActive ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-100 border-slate-200 grayscale opacity-60'}`}>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-2xl font-black tracking-tight ${handbookData.isActive ? 'text-indigo-900' : 'text-slate-600'}`}>{handbookData.title}</h3>
                                                {!handbookData.isActive && <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px] font-black uppercase">Inactive</span>}
                                            </div>
                                            <p className={`max-w-sm font-medium leading-relaxed italic opacity-80 ${handbookData.isActive ? 'text-indigo-700' : 'text-slate-500'}`}>{handbookData.description}</p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className={`rounded-xl font-bold px-6 shadow-lg ${handbookData.isActive ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`} disabled={!handbookData.isActive}>Live Web Version</Button>
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
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black text-slate-900 border-l-4 border-amber-500 pl-4">Institutional Announcements</h3>
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md shadow-amber-100">Broadcast Update</Button>
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-6 pb-6 border-b border-slate-100 group">
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
                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">System-wide update to reimbursement slabs for varsity events has been published. All HODs are requested to sync before the weekend.</p>
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
                                    <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 mb-8 flex justify-between items-center relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform"><AlertTriangle className="w-48 h-48" /></div>
                                        <div className="space-y-4 relative z-10">
                                            <h3 className="text-2xl font-black text-red-900">Governance & Violation Tracker</h3>
                                            <p className="text-red-700 max-w-sm font-medium leading-relaxed italic border-l-2 border-red-200 pl-4">Record and audit policy deviations with traceable evidentiary support.</p>
                                            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold px-8 shadow-lg shadow-red-100 gap-2">
                                                <AlertTriangle className="w-4 h-4" /> Log New Violation
                                            </Button>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-red-200/50 border border-white text-center min-w-[140px]">
                                            <p className="text-5xl font-black text-red-600 tracking-tighter">04</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Open Cases</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'CSE-841', policy: 'IT Security Bypass', severity: 'High', date: '2d ago', status: 'Inquiry' },
                                            { id: 'ADM-211', policy: 'Academic Ethics Violation', severity: 'Critical', date: '5d ago', status: 'Committee Assigned' }
                                        ].map(v => (
                                            <div key={v.id} className="p-5 flex items-center justify-between bg-white border border-slate-200 rounded-3xl hover:border-red-300 transition-colors shadow-sm group">
                                                <div className="flex gap-4">
                                                    <div className={`w-2 h-12 rounded-full ${v.severity === 'High' ? 'bg-amber-500' : 'bg-red-600'}`} />
                                                    <div>
                                                        <h4 className="font-black text-slate-900">{v.policy}</h4>
                                                        <div className="flex gap-3 text-[10px] font-black uppercase text-slate-400 mt-1">
                                                            <span className="text-slate-900 italic font-black">Case #{v.id}</span>
                                                            <span>•</span>
                                                            <span className={v.severity === 'Critical' ? 'text-red-600' : 'text-amber-600'}>{v.severity}</span>
                                                            <span>•</span>
                                                            <span>{v.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-slate-700">{v.status}</p>
                                                        <p className="text-[10px] font-medium text-slate-400">Escalation active</p>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-50"><Filter className="w-4 h-4" /></Button>
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
                                        <p className="max-w-xs mx-auto text-sm text-slate-500 font-medium">This module is currently being provisioned with institutional data.</p>
                                    </div>
                                    <Button variant="outline" className="rounded-xl font-bold">Request Setup</Button>
                                </div>
                            )}
                        </Card>

                        <div className="space-y-6">
                            {isHR ? (
                                <>
                                    <Card className="bg-indigo-600 border-none shadow-indigo-100 shadow-xl rounded-3xl text-white p-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                                            <Shield className="w-32 h-32" />
                                        </div>
                                        <div className="relative z-10 space-y-4">
                                            <h3 className="text-xl font-black">Global Compliance</h3>
                                            <div className="flex items-end gap-2">
                                                <span className="text-5xl font-black italic">98%</span>
                                                <span className="text-xs font-bold text-indigo-100 mb-2 tracking-widest uppercase">Verified</span>
                                            </div>
                                            <p className="text-sm text-indigo-100 leading-relaxed font-medium">98 out of 100 documents have been successfully acknowledged across the institution.</p>
                                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 w-full rounded-2xl font-black shadow-lg">Refresh Audit</Button>
                                        </div>
                                    </Card>

                                    <Card className="border-slate-200 shadow-sm rounded-3xl p-6 space-y-4">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <Megaphone className="w-5 h-5 text-amber-500" />
                                            Recent Updates
                                        </h3>
                                        <div className="space-y-4">
                                            {[1, 2].map((u) => (
                                                <div key={u} className="flex gap-4">
                                                    <div className="w-1 h-12 bg-amber-200 rounded-full" />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 line-clamp-1">New Leave Policy Revision</p>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">Please review the updated special leave sections effective from April 2024...</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </>
                            ) : (
                                <>
                                    <Card className="bg-emerald-600 border-none shadow-emerald-100 shadow-xl rounded-3xl text-white p-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                                            <CheckCircle2 className="w-32 h-32" />
                                        </div>
                                        <div className="relative z-10 space-y-4">
                                            <h3 className="text-xl font-black">My Compliance</h3>
                                            <div className="flex items-end gap-2">
                                                <span className="text-5xl font-black italic">66%</span>
                                                <span className="text-xs font-bold text-emerald-100 mb-2 tracking-widest uppercase">Action Needed</span>
                                            </div>
                                            <p className="text-sm text-emerald-100 leading-relaxed font-medium">You have 1 pending mandatory policy to acknowledge to reach 100% compliance.</p>
                                            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 w-full rounded-2xl font-black shadow-lg" onClick={() => setActiveTab('repository')}>View My Tasks</Button>
                                        </div>
                                    </Card>

                                    <Card className="border-slate-200 shadow-sm rounded-3xl p-6 space-y-4">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                                            Pending Actions
                                        </h3>
                                        <div className="space-y-4">
                                            {policies.filter(p => p.mandatory && !p.acknowledged).map((p) => (
                                                <div key={p.id} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
                                                    <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Mandatory</p>
                                                    <p className="text-sm font-bold text-slate-900">{p.title}</p>
                                                    <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold" onClick={() => {
                                                        setSelectedPolicy(p);
                                                        setIsViewModalOpen(true);
                                                    }}>Sign Now</Button>
                                                </div>
                                            ))}
                                            {policies.filter(p => p.mandatory && !p.acknowledged).length === 0 && (
                                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                                    <p className="text-sm font-bold text-emerald-700">All caught up!</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bottom Status Section */}
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[3px] text-slate-400 border-t border-slate-200 pt-8 mt-8">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" /> System Active</span>
                            <span>Region: Asia/Middle_East</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Last Sync: 2m ago</span>
                            <span className="text-indigo-500 cursor-pointer hover:text-indigo-600 transition-colors">Documentation & Help</span>
                        </div>
                    </div>

                </div>
            </main>
            {/* Handbook Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl p-0">
                    <div className="bg-indigo-600 p-6 text-white">
                        <DialogTitle className="text-2xl font-black">Edit Employee Handbook</DialogTitle>
                        <DialogDescription className="text-indigo-100 mt-1">Configure handbook content and global visibility.</DialogDescription>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
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
                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-3xl">
                        <Button variant="ghost" className="font-bold text-slate-600" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-100"
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
                                    <h2 className="text-3xl font-black tracking-tight mb-2">{selectedPolicy.title}</h2>
                                    <p className="text-indigo-100 font-medium italic opacity-80">{selectedPolicy.description}</p>
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-8 bg-white">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-indigo-600" />
                                        Policy Clauses & Guidelines
                                    </h3>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-700 leading-relaxed font-medium">
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

                                <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-center justify-between">
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

                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
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
                                    <h2 className="text-2xl font-black tracking-tight mb-2">{selectedSOP.title}</h2>
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
                                            <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{idx + 1}</div>
                                                <p className="flex-1 text-sm font-bold text-slate-700 leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center justify-between">
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

                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <Button onClick={() => setIsSOPModalOpen(false)} variant="ghost" className="rounded-xl font-bold text-slate-500">Close SOP</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PolicyGuides;
