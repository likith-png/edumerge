import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    FileText, UserMinus, CheckSquare, ShieldAlert, AlertCircle, Briefcase, MessageSquare, CreditCard, BarChart, Settings, Home
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

    // Sync viewMode if role changes
    useEffect(() => {
        if (role === 'HR_ADMIN' || role === 'ADMIN') setViewMode('Admin');
        else if (role === 'MANAGER') setViewMode('Manager');
        else setViewMode('Faculty');

        setActiveTab(role === 'HR_ADMIN' || role === 'ADMIN' ? 'analytics' : role === 'MANAGER' ? 'approvals' : 'dashboard');
    }, [role]);

    // Helper to filter relevant exits for Admin dropdown
    const adminSelectableExits = exits.filter(e => {
        if (viewMode === 'Admin') return ['Approved', 'Manager_Approved', 'HR_Approved'].includes(e.status);
        if (viewMode === 'Manager') {
            // Filter by manager's team - in mock we'll use department
            return e.department === user.department;
        }
        return false;
    });

    const AdminExitSelector = () => (
        <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Label className="mb-2 block text-sm font-medium text-slate-700">
                {viewMode === 'Manager' ? 'Select Team Member' : 'Select Employee to Manage'}
            </Label>
            <select
                className="w-full md:w-1/3 h-10 rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={selectedExitId || ''}
                onChange={(e) => setSelectedExitId(Number(e.target.value))}
            >
                <option value="">-- Select Employee --</option>
                {adminSelectableExits.map(e => (
                    <option key={e.id} value={e.id}>{e.employee_name} ({e.status})</option>
                ))}
            </select>
        </div>
    );

    // Get current user's active exit (Mock logic: assumes 1st active exit found linked to user)
    // In real app, this would filter by logged-in user ID
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
            setEmployees(data.data || data); // Handle both {data: []} and [] formats
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

        // Find current user's numeric ID from employees list
        const currentUser = employees.find(emp => emp.name === user.name || emp.email.includes(user.name.toLowerCase().split(' ')[0]));
        const empId = currentUser?.id || 1; // Fallback to 1 if not found

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
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm relative">
                <div className="max-w-7xl auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-slate-50"
                            >
                                <Home className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <UserMinus className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">
                                        Exit Management
                                    </h1>
                                    <p className="text-xs text-slate-500">
                                        {viewMode === 'Manager' ? 'Team Separation Hub' : 'Full-cycle separation portal'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* View Switcher & Navigation */}
                        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar max-w-full pb-1 md:pb-0">


                            {/* Role Switcher - Visible for Admin and Managers to toggle personal vs team view */}
                            {(role === 'HR_ADMIN' || role === 'ADMIN' || role === 'MANAGER') && (
                                <select
                                    value={viewMode}
                                    onChange={(e) => {
                                        const newMode = e.target.value as 'Faculty' | 'Admin' | 'Manager';
                                        setViewMode(newMode);
                                        setActiveTab(newMode === 'Admin' ? 'analytics' : newMode === 'Manager' ? 'approvals' : 'dashboard');
                                        setSelectedExitId(undefined); // Reset selection
                                    }}
                                    className="bg-slate-100 border-none text-sm font-semibold text-slate-700 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                >
                                    <option value="Faculty">Personal View</option>
                                    {role === 'MANAGER' && <option value="Manager">Manager View</option>}
                                    {(role === 'HR_ADMIN' || role === 'ADMIN') && <option value="Admin">Admin View</option>}
                                </select>
                            )}

                            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                            {/* Tabs */}
                            <nav className="flex items-center space-x-1">
                                {currentTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500 ring-offset-1'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                    >
                                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-100' : 'text-slate-500'}`} />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        {/* Admin View: Show Select Employee Dropdown for specific tabs */}
                        {viewMode === 'Admin' && ['handover', 'settlement'].includes(activeTab) && (
                            <AdminExitSelector />
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
                            <Card className="max-w-2xl mx-auto shadow-sm border-slate-200">
                                <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800">Resignation Form</h3>
                                    <p className="text-xs text-slate-500">Initiate your exit process formally.</p>
                                </div>
                                <CardContent className="p-6">
                                    {exits.some(e => ['Pending', 'Approved'].includes(e.status)) ? (
                                        <div className="text-center py-8">
                                            <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
                                            <h3 className="text-lg font-medium text-slate-900">Active Request Found</h3>
                                            <p className="text-slate-500 max-w-sm mx-auto mt-2">
                                                You already have an active resignation request. Please check the "My Requests" tab for updates.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="mt-6"
                                                onClick={() => setActiveTab('status')}
                                            >
                                                View My Request
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="type">Resignation Type</Label>
                                                    <select
                                                        id="type"
                                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={formData.resignation_type || 'Voluntary'}
                                                        onChange={(e) => setFormData({ ...formData, resignation_type: e.target.value })}
                                                        required
                                                    >
                                                        <option value="Voluntary">Voluntary Resignation</option>
                                                        <option value="Contract End">End of Contract</option>
                                                        <option value="Retirement">Retirement</option>
                                                        <option value="Termination">Involuntary Termination</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="reason">Reason Category</Label>
                                                    <select
                                                        id="reason"
                                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={formData.reason}
                                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select a reason</option>
                                                        <option value="Better Opportunity">Better Opportunity</option>
                                                        <option value="Higher Studies">Higher Studies</option>
                                                        <option value="Personal Reasons">Personal Reasons</option>
                                                        <option value="Relocation">Relocation</option>
                                                        <option value="Health">Health</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="lwd">Proposed Last Working Day</Label>
                                                    <Input
                                                        id="lwd"
                                                        type="date"
                                                        value={formData.lwd_proposed}
                                                        onChange={(e) => setFormData({ ...formData, lwd_proposed: e.target.value })}
                                                        required
                                                    />
                                                    <p className="text-xs text-slate-500">
                                                        Policy Notice: {formData.resignation_type === 'Retirement' ? '90 Days' : formData.resignation_type === 'Contract End' ? '30 Days' : formData.resignation_type === 'Termination' ? 'Immediate' : '60 Days'}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="attachment">Supporting Document (Optional)</Label>
                                                    <Input
                                                        id="attachment"
                                                        type="file"
                                                        className="cursor-pointer"
                                                        onChange={(e) => {
                                                            // Mock upload
                                                            if (e.target.files?.[0]) {
                                                                setFormData({ ...formData, attachment_url: URL.createObjectURL(e.target.files[0]) });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="comments">Additional Comments / Remarks</Label>
                                                <textarea
                                                    id="comments"
                                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    value={formData.comments}
                                                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <Button type="submit" className="w-full">Submit Resignation</Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'status' && (
                            <div className="space-y-4">
                                {exits.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        <p>No exit requests found.</p>
                                        <Button variant="link" onClick={() => setActiveTab('submit')}>
                                            Submit a resignation
                                        </Button>
                                    </div>
                                ) : (
                                    exits.map((exit) => (
                                        <Card key={exit.id} className="shadow-sm border-slate-200 relative">
                                            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-base font-medium">
                                                    Exit Request #{exit.id} - {exit.employee_name}
                                                </CardTitle>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${exit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        exit.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            exit.status === 'Withdrawn' ? 'bg-slate-100 text-slate-500' : 'bg-slate-100 text-slate-800'}`}>
                                                    {exit.status}
                                                </span>
                                            </CardHeader>
                                            <CardContent className="px-4 pb-4 pt-2">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-slate-500 text-xs block">Resignation Date</span>
                                                        <span className="font-medium text-slate-700">{exit.resignation_date}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 text-xs block">Type</span>
                                                        <span className="font-medium text-slate-700">{exit.resignation_type || 'Voluntary'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 text-xs block">Proposed LWD</span>
                                                        <span className="font-medium text-slate-700">{exit.lwd_proposed}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 text-xs block">Notice Ends</span>
                                                        <span className="font-medium text-slate-700">{exit.notice_period_end || '-'}</span>
                                                    </div>
                                                </div>
                                                {exit.status === 'Pending' && (
                                                    <div className="mt-4 flex justify-end">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            onClick={async () => {
                                                                if (!confirm("Are you sure you want to withdraw your resignation?")) return;
                                                                try {
                                                                    await updateExitStatus(exit.id, { status: 'Withdrawn', comments: 'Withdrawn by user' });
                                                                    fetchExits();
                                                                } catch (e) {
                                                                    console.error(e);
                                                                    alert("Failed to withdraw");
                                                                }
                                                            }}
                                                        >
                                                            Withdraw Resignation
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'approvals' && <ApprovalList />}
                        {activeTab === 'noc' && <NOCDashboard />}

                        {activeTab === 'handover' && (
                            <>
                                {viewMode === 'Admin' && <AdminExitSelector />}
                                <HandoverList
                                    exitId={viewMode === 'Admin' ? selectedExitId : myActiveExit?.id}
                                    viewMode={viewMode}
                                />
                            </>
                        )}

                        {activeTab === 'interview' && (
                            <ExitInterview
                                exitId={viewMode === 'Admin' ? selectedExitId : myActiveExit?.id}
                                onSuccess={() => setActiveTab('status')}
                            />
                        )}

                        {activeTab === 'settlement' && (
                            <>
                                {viewMode === 'Admin' && <AdminExitSelector />}
                                <SettlementDashboard
                                    exitId={viewMode === 'Admin' ? selectedExitId : myActiveExit?.id}
                                    viewMode={viewMode}
                                />
                            </>
                        )}
                        {activeTab === 'terminate' && viewMode === 'Admin' && (
                            <Card className="max-w-2xl mx-auto shadow-sm border-slate-200">
                                <div className="bg-gradient-to-r from-red-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                                    <h3 className="text-lg font-semibold text-red-800">Involuntary Termination</h3>
                                    <p className="text-xs text-slate-500">Initiate immediate termination for a staff member.</p>
                                </div>
                                <CardContent className="p-6">
                                    <form onSubmit={handleTerminate} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="employee">Select Staff Member</Label>
                                            <select
                                                id="employee"
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={terminationFormData.employee_id}
                                                onChange={(e) => setTerminationFormData({ ...terminationFormData, employee_id: Number(e.target.value) })}
                                                required
                                            >
                                                <option value="0">-- Select Staff --</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="term_reason">Termination Reason</Label>
                                                <select
                                                    id="term_reason"
                                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    value={terminationFormData.reason}
                                                    onChange={(e) => setTerminationFormData({ ...terminationFormData, reason: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select a reason</option>
                                                    <option value="Performance Issues">Performance Issues</option>
                                                    <option value="Conduct Violation">Conduct Violation</option>
                                                    <option value="Policy Non-compliance">Policy Non-compliance</option>
                                                    <option value="Attendance Issues">Attendance Issues</option>
                                                    <option value="Other">Other Administrative Reason</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="term_lwd">Effective Termination Date</Label>
                                                <Input
                                                    id="term_lwd"
                                                    type="date"
                                                    value={terminationFormData.lwd_proposed}
                                                    onChange={(e) => setTerminationFormData({ ...terminationFormData, lwd_proposed: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="term_comments">Administrative Remarks / Evidence</Label>
                                            <textarea
                                                id="term_comments"
                                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                placeholder="Enter details regarding the termination..."
                                                value={terminationFormData.comments}
                                                onChange={(e) => setTerminationFormData({ ...terminationFormData, comments: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-4 p-4 bg-red-50 rounded-lg border border-red-100 mb-4">
                                            <div className="flex gap-3">
                                                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                                                <p className="text-xs text-red-700">
                                                    <strong>Warning:</strong> This action is permanent and will immediately trigger the exit workflow, including NOC clearances and settlement for the selected employee.
                                                </p>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                                            Confirm Termination
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        {activeTab === 'analytics' && <ExitAnalytics />}
                    </div>
                </div>
            </main>
        </div >
    );
};

export default ExitManagement;
