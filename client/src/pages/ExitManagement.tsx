import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Layout from '../components/Layout';
import {
    FileText, UserMinus, CheckSquare, ShieldAlert, AlertCircle, Briefcase, 
    MessageSquare, CreditCard, BarChart, Settings, UserX, Trash2, 
    ArrowRight, Clock, ShieldCheck, ChevronRight
} from 'lucide-react';
import ExitConfiguration from '../components/exit/ExitConfiguration';
import { submitResignation, getAllExits, updateExitStatus, terminateEmployee } from '../services/exitService';
import { getAllEmployees } from '../services/employeeService';
import type { Employee } from '../services/employeeService';

import ApprovalList from '../components/exit/ApprovalList';
import NOCDashboard from '../components/exit/NOCDashboard';
import HandoverList from '../components/exit/HandoverList';
import ExitInterview from '../components/exit/ExitInterview';
import SettlementDashboard from '../components/exit/SettlementDashboard';
import ExitAnalytics from '../components/exit/ExitAnalytics';
import ExitDashboard from '../components/exit/ExitDashboard';
import { usePersona } from '../contexts/PersonaContext';
import { Badge } from '../components/ui/badge';

const ExitManagement: React.FC = () => {
    const { role, user } = usePersona();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [viewMode, setViewMode] = useState<'Faculty' | 'Admin' | 'Manager'>(
        role === 'HR_ADMIN' || role === 'ADMIN' ? 'Admin' :
            role === 'MANAGER' ? 'Manager' : 'Faculty'
    );
    const [exits, setExits] = useState<any[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedExitId, setSelectedExitId] = useState<number | undefined>();
    const [terminationFormData, setTerminationFormData] = useState({
        employee_id: 0,
        reason: '',
        lwd_proposed: '',
        comments: ''
    });

    useEffect(() => {
        if (role === 'HR_ADMIN' || role === 'ADMIN') setViewMode('Admin');
        else if (role === 'MANAGER') setViewMode('Manager');
        else setViewMode('Faculty');
        setActiveTab('dashboard');
    }, [role]);

    const adminSelectableExits = exits.filter(e => {
        if (viewMode === 'Admin') return ['Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status);
        if (viewMode === 'Manager') return e.department === user.department;
        return false;
    });

    const AdminExitSelector = () => (
        <div className="mb-10 p-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-lg shadow-sm">
                    <UserX className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Employee Search</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Select personnel record for review</p>
                </div>
            </div>
            <div className="relative z-10 w-full md:w-1/2">
                <select
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all appearance-none cursor-pointer"
                    value={selectedExitId || ''}
                    onChange={(e) => setSelectedExitId(Number(e.target.value))}
                >
                    <option value="">-- Active Departure List --</option>
                    {adminSelectableExits.map(e => (
                        <option key={e.id} value={e.id}>{e.employee_name} ({e.status})</option>
                    ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
            </div>
        </div>
    );

    const myActiveExit = exits.find(e => ['Pending', 'Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status));

    const [formData, setFormData] = useState({
        reason: '',
        lwd_proposed: '',
        comments: '',
        resignation_type: 'Voluntary',
        attachment_url: ''
    });

    useEffect(() => {
        fetchExits();
        fetchEmployees();
    }, [activeTab]);

    const fetchExits = async () => {
        try {
            const data = await getAllExits();
            setExits(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const data = await getAllEmployees();
            setEmployees(data.data || data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTerminate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (terminationFormData.employee_id === 0) return alert("Please select an employee");
        try {
            await terminateEmployee({
                ...terminationFormData,
                resignation_type: 'Termination'
            });
            alert("Employee Terminated Successfully");
            setActiveTab('analytics');
            fetchExits();
            setTerminationFormData({ employee_id: 0, reason: '', lwd_proposed: '', comments: '' });
        } catch (error: any) {
            alert(error.message || "Failed to terminate employee");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentUser = employees.find(emp => emp.name === user.name || emp.email.includes(user.name.toLowerCase().split(' ')[0]));
        const empId = currentUser?.id || 1;
        try {
            await submitResignation({ ...formData, employee_id: empId });
            alert("Resignation Submitted Successfully");
            setActiveTab('status');
            fetchExits();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const allTabs = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart, roles: ['Faculty', 'Admin', 'Manager'] },
        { id: 'status', label: 'My Requests', icon: UserMinus, roles: ['Faculty'] },
        { id: 'submit', label: 'Resign', icon: FileText, roles: ['Faculty'] },
        { id: 'interview', label: 'Interview', icon: MessageSquare, roles: ['Faculty'] },
        { id: 'approvals', label: 'Approvals', icon: CheckSquare, roles: ['Admin', 'Manager'] },
        { id: 'noc', label: 'NOC', icon: ShieldAlert, roles: ['Admin'] },
        { id: 'handover', label: 'Handover', icon: Briefcase, roles: ['Admin', 'Faculty', 'Manager'] },
        { id: 'settlement', label: 'Settlement', icon: CreditCard, roles: ['Admin', 'Faculty'] },
        { id: 'analytics', label: 'Analytics', icon: BarChart, roles: ['Admin', 'Manager'] },
        { id: 'terminate', label: 'Terminate', icon: ShieldAlert, roles: ['Admin'] },
        { id: 'configuration', label: 'Configuration', icon: Settings, roles: ['Admin'] },
    ];

    const currentTabs = allTabs.filter(tab => tab.roles.includes(viewMode));

    return (
        <Layout title="Exit Management" description="Streamlined employee separation and clearance workflows." icon={UserX} showHome>
            
            {/* Standard Tab Navigation */}
            <div className="mb-8 border-b border-slate-200">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
                        {currentTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {(role === 'HR_ADMIN' || role === 'ADMIN' || role === 'MANAGER') && (
                        <div className="relative min-w-[180px] pb-2">
                            <select
                                value={viewMode}
                                onChange={(e) => {
                                    const newMode = e.target.value as 'Faculty' | 'Admin' | 'Manager';
                                    setViewMode(newMode);
                                    setActiveTab(newMode === 'Admin' ? 'analytics' : newMode === 'Manager' ? 'approvals' : 'dashboard');
                                    setSelectedExitId(undefined);
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest focus:ring-2 focus:ring-slate-900 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Faculty">Personal View</option>
                                {role === 'MANAGER' && <option value="Manager">Manager View</option>}
                                {(role === 'HR_ADMIN' || role === 'ADMIN') && <option value="Admin">Admin Console</option>}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-[calc(50%+4px)] pointer-events-none text-slate-400">
                                <ChevronRight className="w-3 h-3 rotate-90" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8 pb-16">
                {viewMode === 'Admin' && ['handover', 'settlement'].includes(activeTab) && (
                    <div className="mb-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg text-white shadow-md">
                                <UserX className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Personnel Search</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Select employee for terminal review</p>
                            </div>
                        </div>
                        <div className="relative w-full md:w-1/2">
                            <select
                                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none cursor-pointer"
                                value={selectedExitId || ''}
                                onChange={(e) => setSelectedExitId(Number(e.target.value))}
                            >
                                <option value="">-- Active Departure List --</option>
                                {adminSelectableExits.map(e => (
                                    <option key={e.id} value={e.id}>{e.employee_name} ({e.status})</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronRight className="w-4 h-4 rotate-90" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <ExitDashboard
                        setActiveTab={setActiveTab}
                        activeExit={viewMode === 'Faculty' ? myActiveExit : exits.find(e => e.id === selectedExitId)}
                        viewMode={viewMode}
                        allExits={exits}
                    />
                )}
                {activeTab === 'configuration' && <ExitConfiguration />}

                {activeTab === 'submit' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center space-y-2 mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Resignation Request</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initiate formal separation protocols.</p>
                        </div>

                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-900 rounded-lg shadow-sm">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Initiate Resignation</h3>
                                </div>
                                <ShieldCheck className="w-5 h-5 text-emerald-500 opacity-40" />
                            </div>
                            <CardContent className="px-10 py-10">
                                {exits.some(e => ['Pending', 'Approved'].includes(e.status)) ? (
                                    <div className="text-center py-20 space-y-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                                            <AlertCircle className="h-8 w-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-bold text-slate-900 uppercase">Active Request Found</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-xs mx-auto">You already have an active separation request in the pipeline.</p>
                                        </div>
                                        <Button
                                            onClick={() => setActiveTab('status')}
                                            className="h-12 bg-slate-900 hover:bg-black text-white px-10 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm"
                                        >
                                            View Status
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Separation Type</Label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all appearance-none cursor-pointer"
                                                        value={formData.resignation_type || 'Voluntary'}
                                                        onChange={(e) => setFormData({ ...formData, resignation_type: e.target.value })}
                                                        required
                                                    >
                                                        <option value="Voluntary">Voluntary Resignation</option>
                                                        <option value="Forced Resignation">Directive Resignation</option>
                                                        <option value="Contract End">Contract End</option>
                                                        <option value="Retirement">Retirement</option>
                                                        <option value="Termination">Termination</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Reason for Leaving</Label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all appearance-none cursor-pointer"
                                                        value={formData.reason}
                                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">-- Select Reason --</option>
                                                        <option value="Better Opportunity">Better Opportunity</option>
                                                        <option value="Higher Studies">Higher Studies</option>
                                                        <option value="Personal Reasons">Personal Reasons</option>
                                                        <option value="Relocation">Relocation</option>
                                                        <option value="Health">Health Reasons</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Proposed last working day</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.lwd_proposed}
                                                    onChange={(e) => setFormData({ ...formData, lwd_proposed: e.target.value })}
                                                    className="h-12 bg-slate-50 border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none"
                                                    required
                                                />
                                                <div className="flex items-center gap-2 px-1 mt-1">
                                                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Standard Notice: <span className="text-slate-900 font-bold">{formData.resignation_type === 'Retirement' ? '90 Days' : formData.resignation_type === 'Contract End' ? '30 Days' : ['Termination', 'Forced Resignation'].includes(formData.resignation_type) ? 'Immediate' : '60 Days'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2.5 relative">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Attachment (Optional)</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        className="h-12 bg-slate-50 border-slate-200 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none pt-3.5 cursor-pointer file:hidden"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) {
                                                                setFormData({ ...formData, attachment_url: URL.createObjectURL(e.target.files[0]) });
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Upload proof</span>
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Detailed comments</Label>
                                            <textarea
                                                className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-6 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none resize-none transition-all"
                                                placeholder="Provide relevant details for your resignation..."
                                                value={formData.comments}
                                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] group">
                                                Submit Resignation Request
                                                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'status' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between mb-8 px-4">
                            <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Resignation Status</h3>
                            <Badge className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{exits.length} Records</Badge>
                        </div>
                        
                        {exits.length === 0 ? (
                            <div className="text-center py-24 space-y-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                                    <UserMinus className="h-10 w-10" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold text-slate-900 uppercase">No active requests</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No active separation requests identified.</p>
                                </div>
                                <Button onClick={() => setActiveTab('submit')} className="h-12 bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm">
                                    Initiate Request
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {exits.map((exit) => (
                                    <Card key={exit.id} className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden group hover:border-slate-300 transition-all duration-300">
                                        <CardHeader className="px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 bg-slate-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-slate-900 rounded-lg shadow-sm flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">#{exit.id}</span>
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight">{exit.employee_name}</CardTitle>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Verification Status: Confirmed</p>
                                                </div>
                                            </div>
                                            <Badge className={`px-5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border-none shadow-sm
                                                ${exit.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                  exit.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                  exit.status === 'Withdrawn' ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white'}`}>
                                                {exit.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="px-10 py-8">
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Applied on</span>
                                                    <div className="text-sm font-bold text-slate-900 uppercase">{exit.resignation_date}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                                                    <div className="text-sm font-bold text-slate-900 uppercase">{exit.resignation_type || 'Voluntary'}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Last Working Day</span>
                                                    <div className="text-sm font-bold text-blue-600 uppercase">{exit.lwd_proposed}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Notice Period End</span>
                                                    <div className="text-sm font-bold text-slate-900 uppercase">{exit.notice_period_end || '-'}</div>
                                                </div>
                                            </div>
                                            {exit.status === 'Pending' && (
                                                <div className="mt-8 flex justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        className="h-11 px-8 rounded-lg font-bold text-[10px] uppercase tracking-wider text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-rose-100 border-dashed"
                                                        onClick={async () => {
                                                            if (!confirm("Confirm withdrawal of resignation request?")) return;
                                                            try {
                                                                await updateExitStatus(exit.id, { status: 'Withdrawn', comments: 'Withdrawn by employee' });
                                                                fetchExits();
                                                            } catch (e) {
                                                                console.error(e);
                                                                alert("Withdrawal protocol failed");
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Withdraw Request
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'approvals' && <ApprovalList />}
                {activeTab === 'noc' && <NOCDashboard />}

                {activeTab === 'handover' && (
                    <div className="animate-in fade-in duration-500">
                        {viewMode === 'Admin' && <AdminExitSelector />}
                        <HandoverList
                            exitId={viewMode === 'Admin' ? selectedExitId : myActiveExit?.id}
                            viewMode={viewMode}
                        />
                    </div>
                )}

                {activeTab === 'interview' && (
                    <ExitInterview
                        exitId={viewMode === 'Admin' ? selectedExitId : myActiveExit?.id}
                        onSuccess={() => setActiveTab('status')}
                    />
                )}

                {activeTab === 'settlement' && (
                    <div className="animate-in fade-in duration-500">
                        {viewMode === 'Admin' && <AdminExitSelector />}
                        <SettlementDashboard
                            exitId={viewMode === 'Admin' ? selectedExitId : myActiveExit?.id}
                            viewMode={viewMode}
                        />
                    </div>
                )}

                {activeTab === 'terminate' && viewMode === 'Admin' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center space-y-2 mb-12">
                            <h2 className="text-3xl font-bold text-rose-600 uppercase tracking-tight">Administrative Termination</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initiate mandatory separation protocols.</p>
                        </div>

                        <Card className="border border-rose-100 shadow-xl shadow-rose-900/5 bg-white rounded-xl overflow-hidden">
                            <CardHeader className="px-10 py-6 border-b border-rose-50 bg-rose-50/50 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-rose-600 rounded-lg shadow-sm">
                                        <ShieldAlert className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-rose-900 uppercase tracking-tight">Termination Directive</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="px-10 py-10">
                                <form onSubmit={handleTerminate} className="space-y-10">
                                    <div className="space-y-2.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Select Employee Persona</Label>
                                        <div className="relative">
                                            <select
                                                className="w-full h-12 bg-slate-50 border border-rose-100 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all appearance-none cursor-pointer"
                                                value={terminationFormData.employee_id}
                                                onChange={(e) => setTerminationFormData({ ...terminationFormData, employee_id: Number(e.target.value) })}
                                                required
                                            >
                                                <option value="0">-- Active Personnel Directory --</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Primary Violation</Label>
                                            <div className="relative">
                                                <select
                                                    className="w-full h-12 bg-slate-50 border border-rose-100 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all appearance-none cursor-pointer"
                                                    value={terminationFormData.reason}
                                                    onChange={(e) => setTerminationFormData({ ...terminationFormData, reason: e.target.value })}
                                                    required
                                                >
                                                    <option value="">-- Violation Category --</option>
                                                    <option value="Performance Issues">Performance Deficit</option>
                                                    <option value="Conduct Violation">Ethical Conduct Violation</option>
                                                    <option value="Policy Non-compliance">Protocol Non-Compliance</option>
                                                    <option value="Attendance Issues">Deployment Failure</option>
                                                    <option value="Other">Administrative Other</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Expulsion Effective Date</Label>
                                            <Input
                                                type="date"
                                                value={terminationFormData.lwd_proposed}
                                                onChange={(e) => setTerminationFormData({ ...terminationFormData, lwd_proposed: e.target.value })}
                                                className="h-12 bg-slate-50 border border-rose-100 rounded-lg px-6 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Rationale & Archive Evidence</Label>
                                        <textarea
                                            className="w-full min-h-[120px] bg-slate-50 border border-rose-100 rounded-xl p-6 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none resize-none transition-all"
                                            placeholder="Document institutional violations for archive..."
                                            value={terminationFormData.comments}
                                            onChange={(e) => setTerminationFormData({ ...terminationFormData, comments: e.target.value })}
                                        />
                                    </div>

                                    <div className="p-6 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-5">
                                        <div className="p-2.5 bg-rose-500 text-white rounded-lg shadow-sm">
                                            <ShieldAlert className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">Permanent Action Directive</p>
                                            <p className="text-[10px] text-rose-600 font-medium leading-relaxed opacity-90">Warning: Proceeding with this directive will permanently modify the personnel persona. All access, clearance trails, and fiscal settlements will be initialized immediately.</p>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] group">
                                        Execute Termination Directive
                                        <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'analytics' && <ExitAnalytics />}
            </div>
        </Layout>
    );
};

export default ExitManagement;
