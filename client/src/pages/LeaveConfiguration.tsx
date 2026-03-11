import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Settings, Save, Shield, Clock, FileText, Check, FileQuestion, Users, Briefcase, Plus, Trash2, Edit, X, User } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export interface LeaveType {
    id: string;
    name: string;
    teachingPerm: string;
    teachingProb: string;
    nonTeachingPerm: string;
    nonTeachingProb: string;
}

export interface StaffBalance {
    id: string;
    name: string;
    role: string;
    category: 'Teaching (Perm)' | 'Teaching (Prob)' | 'Non-Teaching (Perm)' | 'Non-Teaching (Prob)';
    balances: Record<string, number>;
}

export interface ApprovalWorkflow {
    id: string;
    roleGroup: string;
    level1: string;
    level2: string;
}

export const defaultLeaveTypes: LeaveType[] = [
    { id: 'CL', name: 'Casual Leave (CL)', teachingPerm: '12 / year', teachingProb: '1 / month (Prorated)', nonTeachingPerm: '12 / year', nonTeachingProb: '1 / month (Prorated)' },
    { id: 'VL', name: 'Vacation (VL)', teachingPerm: '28 days / yr', teachingProb: '14 days / yr', nonTeachingPerm: '14 days\nOr 6 days', nonTeachingProb: '6 days / yr' },
    { id: 'OED', name: 'On Exam Duty (OED)', teachingPerm: '14 / year', teachingProb: '14 / year', nonTeachingPerm: 'N/A', nonTeachingProb: 'N/A' },
    { id: 'OOD', name: 'On Official Duty (OOD)', teachingPerm: 'Eng: 10 / yr\nDegree: 7 / yr', teachingProb: 'Eng: 10 / yr\nDegree: 7 / yr', nonTeachingPerm: '7 / year', nonTeachingProb: '7 / year' },
    { id: 'EL', name: 'Earned Leave (EL)', teachingPerm: 'Heads Only: 21 / yr', teachingProb: 'N/A', nonTeachingPerm: 'Heads Only: 21 / yr', nonTeachingProb: 'N/A' },
    { id: 'LOP', name: 'Loss of Pay (LOP)', teachingPerm: 'As per approval', teachingProb: 'As per approval', nonTeachingPerm: 'As per approval', nonTeachingProb: 'As per approval' },
    { id: 'COMP', name: 'Comp Off', teachingPerm: 'Based on extra days', teachingProb: 'Based on extra days', nonTeachingPerm: 'Based on extra days', nonTeachingProb: 'Based on extra days' }
];

export const defaultStaffBalances: StaffBalance[] = [
    { id: 'EMP001', name: 'Ms. Reshma Binu Prasad', role: 'Asst. Professor', category: 'Teaching (Perm)', balances: { 'CL': 12, 'VL': 28, 'OED': 14, 'OOD': 10 } },
    { id: 'EMP002', name: 'Ms. Sanchaiyata Majumdar', role: 'Lecturer', category: 'Teaching (Perm)', balances: { 'CL': 12, 'VL': 28, 'OED': 14, 'OOD': 10 } },
    { id: 'EMP003', name: 'Dr. R Sedhunivas', role: 'HOD', category: 'Teaching (Perm)', balances: { 'CL': 12, 'VL': 28, 'OED': 14, 'OOD': 10, 'EL': 21 } },
    { id: 'EMP004', name: 'Dr. Ranjita Saikia', role: 'Professor', category: 'Teaching (Perm)', balances: { 'CL': 12, 'VL': 28, 'OED': 14, 'OOD': 10 } },
    { id: 'EMP005', name: 'Mr. Manjit Singh', role: 'Lab Assistant', category: 'Non-Teaching (Perm)', balances: { 'CL': 12, 'VL': 14, 'OOD': 7 } },
    { id: 'EMP006', name: 'Mr. Edwin Vimal A', role: 'Lecturer', category: 'Teaching (Perm)', balances: { 'CL': 12, 'VL': 28, 'OED': 14, 'OOD': 10 } },
];

export const defaultWorkflows: ApprovalWorkflow[] = [
    { id: '1', roleGroup: 'Teaching Staff', level1: 'HOD', level2: 'HR Admin' },
    { id: '2', roleGroup: 'HODs (Academic)', level1: 'Principal', level2: 'HR Admin' },
    { id: '3', roleGroup: 'Non-Academic Heads', level1: 'Chairman', level2: 'HR Admin' },
];

const StructuredEntitlementInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const parseValue = (val: string) => {
        if (!val) return { amount: '', type: 'Custom', customText: '' };
        if (val === 'N/A') return { amount: '', type: 'N/A', customText: '' };
        if (val === 'As per approval') return { amount: '', type: 'As per approval', customText: '' };
        if (val === 'Based on extra days') return { amount: '', type: 'Based on extra days', customText: '' };

        const match = val.match(/^(\d+)(?:\s*days)?\s*\/\s*(year|yr|month\s*\(Prorated\))/i);
        if (match) {
            let type = match[2].toLowerCase() === 'yr' ? 'year' : match[2];
            if (type.toLowerCase().includes('month')) type = 'month (Prorated)';
            return { amount: match[1], type, customText: '' };
        }
        return { amount: '', type: 'Custom', customText: val };
    };

    const [state, setState] = useState(parseValue(value));

    useEffect(() => { setState(parseValue(value)); }, [value]);

    const handleChange = (field: string, val: string) => {
        const newState = { ...state, [field]: val };
        setState(newState);

        if (newState.type === 'Custom') {
            onChange(newState.customText);
        } else if (newState.type === 'N/A' || newState.type === 'As per approval' || newState.type === 'Based on extra days') {
            onChange(newState.type);
        } else {
            onChange(`${newState.amount || 0} / ${newState.type}`);
        }
    };

    return (
        <div className="flex flex-col gap-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <select
                value={state.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-slate-700"
            >
                <option value="year">Days per Year</option>
                <option value="month (Prorated)">Days per Month (Prorated)</option>
                <option value="N/A">Not Applicable (N/A)</option>
                <option value="As per approval">As per approval</option>
                <option value="Based on extra days">Based on extra days</option>
                <option value="Custom">Custom Text / Complex Rule</option>
            </select>

            {(state.type === 'year' || state.type === 'month (Prorated)') && (
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={state.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        className="w-24 bg-white border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-800"
                    />
                    <span className="text-xs font-bold text-slate-500 uppercase">Days</span>
                </div>
            )}

            {state.type === 'Custom' && (
                <textarea
                    rows={2}
                    placeholder="Enter custom allocation rule (e.g. 14 free days or 6 days)..."
                    value={state.customText}
                    onChange={(e) => handleChange('customText', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                />
            )}
        </div>
    );
};

const LeaveConfiguration = () => {
    const [activeTab, setActiveTab] = useState<'policies' | 'balances' | 'rules' | 'workflows'>('policies');

    // Core states
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [staffBalances, setStaffBalances] = useState<StaffBalance[]>([]);
    const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);

    // Toast state
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Leave Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState<LeaveType | null>(null);
    const [formData, setFormData] = useState<LeaveType>({
        id: '', name: '', teachingPerm: '', teachingProb: '', nonTeachingPerm: '', nonTeachingProb: ''
    });

    // Staff Edit Modal state
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffBalance | null>(null);

    // Workflow Builder state
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<ApprovalWorkflow | null>(null);
    const [workflowForm, setWorkflowForm] = useState<ApprovalWorkflow>({ id: '', roleGroup: '', level1: '', level2: '' });

    useEffect(() => {
        const storedPolicies = localStorage.getItem('edumerge_leave_types');
        if (storedPolicies) setLeaveTypes(JSON.parse(storedPolicies));
        else { setLeaveTypes(defaultLeaveTypes); localStorage.setItem('edumerge_leave_types', JSON.stringify(defaultLeaveTypes)); }

        const storedBalances = localStorage.getItem('edumerge_staff_balances');
        if (storedBalances) setStaffBalances(JSON.parse(storedBalances));
        else { setStaffBalances(defaultStaffBalances); localStorage.setItem('edumerge_staff_balances', JSON.stringify(defaultStaffBalances)); }

        const storedWorkflows = localStorage.getItem('edumerge_approval_workflows');
        if (storedWorkflows) setWorkflows(JSON.parse(storedWorkflows));
        else { setWorkflows(defaultWorkflows); localStorage.setItem('edumerge_approval_workflows', JSON.stringify(defaultWorkflows)); }
    }, []);

    const handleSaveConfig = () => {
        setIsSaving(true);
        localStorage.setItem('edumerge_leave_types', JSON.stringify(leaveTypes));
        localStorage.setItem('edumerge_staff_balances', JSON.stringify(staffBalances));
        localStorage.setItem('edumerge_approval_workflows', JSON.stringify(workflows));
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 800);
    };

    // ----- Policies Handlers -----
    const openModal = (type?: LeaveType) => {
        if (type) { setEditingType(type); setFormData(type); }
        else { setEditingType(null); setFormData({ id: '', name: '', teachingPerm: '', teachingProb: '', nonTeachingPerm: '', nonTeachingProb: '' }); }
        setShowModal(true);
    };
    const saveLeaveType = () => {
        if (!formData.id || !formData.name) return alert('ID and Name are required');
        let updated = editingType ? leaveTypes.map(t => t.id === editingType.id ? formData : t) : [...leaveTypes, formData];
        setLeaveTypes(updated);
        setShowModal(false);
    };
    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this leave type?')) setLeaveTypes(leaveTypes.filter(t => t.id !== id));
    };

    // ----- Staff Balances Handlers -----
    const openStaffModal = (staff: StaffBalance) => {
        setEditingStaff({ ...staff, balances: { ...staff.balances } });
        setShowStaffModal(true);
    };
    const saveStaffBalance = () => {
        if (!editingStaff) return;
        setStaffBalances(staffBalances.map(s => s.id === editingStaff.id ? editingStaff : s));
        setShowStaffModal(false);
    };

    // ----- Workflow Handlers -----
    const openWorkflowModal = (flow?: ApprovalWorkflow) => {
        if (flow) { setEditingWorkflow(flow); setWorkflowForm(flow); }
        else { setEditingWorkflow(null); setWorkflowForm({ id: Date.now().toString(), roleGroup: '', level1: '', level2: '' }); }
        setShowWorkflowModal(true);
    };
    const saveWorkflow = () => {
        if (!workflowForm.roleGroup || !workflowForm.level1) return alert('Role Group and Level 1 are required');
        let updated = editingWorkflow ? workflows.map(w => w.id === editingWorkflow.id ? workflowForm : w) : [...workflows, workflowForm];
        setWorkflows(updated);
        setShowWorkflowModal(false);
    };
    const deleteWorkflow = (id: string) => {
        if (confirm('Delete this workflow?')) setWorkflows(workflows.filter(w => w.id !== id));
    };

    return (
        <Layout title="Leave Configuration" description="Configure leave types, allocations, and approval workflows" icon={Settings} showBack>
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
                    <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 font-bold">
                        <Check className="w-5 h-5" /> Configuration Saved Successfully!
                    </div>
                </div>
            )}

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Policy Settings</h2>
                        <p className="text-slate-500 text-sm">Manage global leave policies, staff balances, and approval routing.</p>
                    </div>
                    <Button onClick={handleSaveConfig} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 w-48">
                        {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
                    </Button>
                </div>

                <div className="flex border-b border-slate-200 gap-2">
                    <button onClick={() => setActiveTab('policies')} className={`py-3 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'policies' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <Briefcase className="w-4 h-4" /> Policy Matrices
                    </button>
                    <button onClick={() => setActiveTab('balances')} className={`py-3 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'balances' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <User className="w-4 h-4" /> Staff Balances
                    </button>
                    <button onClick={() => setActiveTab('workflows')} className={`py-3 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'workflows' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <Users className="w-4 h-4" /> Approval Workflows
                    </button>
                    <button onClick={() => setActiveTab('rules')} className={`py-3 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'rules' ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <Shield className="w-4 h-4" /> Global Rules
                    </button>
                </div>

                <div className="pt-2 animate-in slide-in-from-right-2">
                    {/* POLICIES TAB */}
                    {activeTab === 'policies' && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Leave Entitlements Matrix</h3>
                                    <Button onClick={() => openModal()} variant="outline" size="sm" className="text-xs h-8 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                        <Plus className="w-4 h-4 mr-1" /> Add Leave Type
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 whitespace-nowrap">Leave Type</th>
                                                <th className="px-6 py-4">Teaching (Perm)</th>
                                                <th className="px-6 py-4">Teaching (Prob)</th>
                                                <th className="px-6 py-4">Non-Teaching (Perm)</th>
                                                <th className="px-6 py-4">Non-Teaching (Prob)</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {leaveTypes.map((type) => (
                                                <tr key={type.id} className="hover:bg-slate-50 transition-colors group bg-white">
                                                    <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{type.name}</td>
                                                    <td className="px-6 py-4 text-slate-600 whitespace-pre-wrap">{type.teachingPerm}</td>
                                                    <td className="px-6 py-4 text-slate-600 whitespace-pre-wrap">{type.teachingProb}</td>
                                                    <td className="px-6 py-4 text-slate-600 whitespace-pre-wrap">{type.nonTeachingPerm}</td>
                                                    <td className="px-6 py-4 text-slate-600 whitespace-pre-wrap">{type.nonTeachingProb}</td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openModal(type)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDelete(type.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* STAFF BALANCES TAB */}
                    {activeTab === 'balances' && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Staff Wise Leave Balances</h3>
                                    <p className="text-xs text-slate-500">Edit numeric overrides for specific staff</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 whitespace-nowrap">Employee</th>
                                                <th className="px-6 py-4">Role & Category</th>
                                                <th className="px-6 py-4">Leave Balances</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {staffBalances.map((staff) => (
                                                <tr key={staff.id} className="hover:bg-slate-50 transition-colors group bg-white">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-slate-800">{staff.name}</div>
                                                        <div className="text-xs text-slate-400">{staff.id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-semibold text-slate-700">{staff.role}</div>
                                                        <div className="text-xs text-blue-600 font-bold">{staff.category}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.entries(staff.balances).map(([type, amount]) => (
                                                                <span key={type} className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                                                                    {type}: <span className={amount < 5 ? 'text-amber-600' : 'text-emerald-600'}>{amount}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <Button onClick={() => openStaffModal(staff)} variant="outline" size="sm" className="bg-white group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                                            <Edit className="w-4 h-4 mr-2" /> Edit Balances
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* WORKFLOWS TAB */}
                    {activeTab === 'workflows' && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-100">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Hierarchical Approval Chains</h3>
                                    <Button onClick={() => openWorkflowModal()} variant="outline" size="sm" className="text-xs h-8 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                        <Plus className="w-4 h-4 mr-1" /> Add Chain
                                    </Button>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    {workflows.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 font-medium">No approval workflows configured.</div>
                                    ) : (
                                        workflows.map((flow) => (
                                            <div key={flow.id} className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto] items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold uppercase text-slate-500 mb-1">Role Group</div>
                                                    <div className="font-black text-slate-800 text-lg">{flow.roleGroup}</div>
                                                </div>
                                                <div className="text-slate-300 font-bold tracking-widest">---&gt;</div>
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                                    <div className="text-xs font-bold text-slate-500">Level 1</div>
                                                    <div className="font-bold text-blue-700">{flow.level1}</div>
                                                </div>
                                                <div className="text-slate-300 font-bold tracking-widest">---&gt;</div>
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                                    <div className="text-xs font-bold text-slate-500">Level 2 (Final)</div>
                                                    <div className="font-bold text-emerald-700">{flow.level2 || 'Auto Approve'}</div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-4">
                                                    <button onClick={() => openWorkflowModal(flow)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => deleteWorkflow(flow.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* GLOBAL RULES TAB */}
                    {activeTab === 'rules' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:ring-blue-200 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0"><Clock className="w-6 h-6" /></div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-800 text-lg mb-1">Sandwich Leave Enforcement</h4>
                                            <p className="text-sm text-slate-500 mb-4">CL prefixed or suffixed to non-working days (weekends/holidays) will be counted as two days of leave.</p>
                                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">Strict Enforcement Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:ring-emerald-200 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><FileText className="w-6 h-6" /></div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-800 text-lg mb-1">Mandatory Document Proof</h4>
                                            <p className="text-sm text-slate-500 mb-4">Leaves extending beyond 3 days or specific types (OED) require supporting documentation.</p>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                                                    Require for &gt; 3 Consecutive Days
                                                </label>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                                                    Require for ALL OED (Exam Duty) requests
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:ring-amber-200 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0"><FileQuestion className="w-6 h-6" /></div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-800 text-lg mb-1">Unapproved Action Policy</h4>
                                            <p className="text-sm text-slate-500 mb-4">Determine how the system handles leaves taken without prior approvals.</p>
                                            <div className="flex items-center gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                                <Check className="w-5 h-5 text-amber-600" />
                                                <span className="text-sm font-bold text-slate-800">Automatically classify as LOPNR</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:ring-purple-200 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0"><Settings className="w-6 h-6" /></div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-800 text-lg mb-1">Advanced Accrual & Policies</h4>
                                            <p className="text-sm text-slate-500 mb-4">Configure carry-forwards, fractional leaves, and limits.</p>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer">
                                                    <input type="checkbox" className="rounded text-purple-600" />
                                                    Allow Negative Leave Balances (Advance)
                                                </label>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                                                    Enable Year-end Carry Forward (Earned)
                                                </label>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                                                    Allow Half-Day Applications
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                </div>
            </div>

            {/* Leave Type Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-xl text-slate-800 tracking-tight">{editingType ? 'Edit Leave Type' : 'Add New Leave Type'}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Leave ID</label>
                                    <input type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })} disabled={!!editingType} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold disabled:opacity-50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" />
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Entitlements / Allocations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Teaching (Permanent)</label>
                                    <StructuredEntitlementInput value={formData.teachingPerm} onChange={(val) => setFormData({ ...formData, teachingPerm: val })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Teaching (Probationer)</label>
                                    <StructuredEntitlementInput value={formData.teachingProb} onChange={(val) => setFormData({ ...formData, teachingProb: val })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Non-Teaching (Permanent)</label>
                                    <StructuredEntitlementInput value={formData.nonTeachingPerm} onChange={(val) => setFormData({ ...formData, nonTeachingPerm: val })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Non-Teaching (Probationer)</label>
                                    <StructuredEntitlementInput value={formData.nonTeachingProb} onChange={(val) => setFormData({ ...formData, nonTeachingProb: val })} />
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowModal(false)} className="bg-white">Cancel</Button>
                            <Button onClick={saveLeaveType} className="bg-blue-600 hover:bg-blue-700 shadow-sm">Save Type</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff Balance Modal */}
            {showStaffModal && editingStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-lg text-slate-800 tracking-tight">Override Balances</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{editingStaff.name} ({editingStaff.id})</p>
                            </div>
                            <button onClick={() => setShowStaffModal(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {leaveTypes.map(type => (
                                <div key={type.id} className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                                    <div className="font-bold text-slate-700 text-sm">{type.name}</div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingStaff.balances[type.id] !== undefined ? editingStaff.balances[type.id] : 0}
                                        onChange={(e) => {
                                            const newBals = { ...editingStaff.balances };
                                            newBals[type.id] = parseInt(e.target.value) || 0;
                                            setEditingStaff({ ...editingStaff, balances: newBals });
                                        }}
                                        className="w-20 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-center"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowStaffModal(false)} className="bg-white">Cancel</Button>
                            <Button onClick={saveStaffBalance} className="bg-blue-600 hover:bg-blue-700 shadow-sm">Save Overrides</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Workflow Builder Modal */}
            {showWorkflowModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 tracking-tight">{editingWorkflow ? 'Edit Approval Chain' : 'New Approval Chain'}</h3>
                            <button onClick={() => setShowWorkflowModal(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Role Group</label>
                                <input type="text" placeholder="e.g. Teaching Staff" value={workflowForm.roleGroup} onChange={(e) => setWorkflowForm({ ...workflowForm, roleGroup: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Level 1 Approver</label>
                                <select value={workflowForm.level1} onChange={(e) => setWorkflowForm({ ...workflowForm, level1: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold">
                                    <option value="">Select Level 1</option>
                                    <option value="HOD">HOD</option>
                                    <option value="Principal">Principal</option>
                                    <option value="Chairman">Chairman</option>
                                    <option value="HR Admin">HR Admin</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Level 2 Approver (Optional)</label>
                                <select value={workflowForm.level2} onChange={(e) => setWorkflowForm({ ...workflowForm, level2: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold">
                                    <option value="">None (Auto Approve)</option>
                                    <option value="HOD">HOD</option>
                                    <option value="Principal">Principal</option>
                                    <option value="Chairman">Chairman</option>
                                    <option value="HR Admin">HR Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowWorkflowModal(false)} className="bg-white">Cancel</Button>
                            <Button onClick={saveWorkflow} className="bg-blue-600 hover:bg-blue-700 shadow-sm">Save Chain</Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default LeaveConfiguration;
