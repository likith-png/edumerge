import React, { useState, useEffect } from 'react';
import {
    Save, RotateCcw, Shield, Clock, GitMerge, GraduationCap,
    BookOpen, Building, MessageSquare, DollarSign, FileText,
    Lock, Bell, Check, ChevronRight, Workflow, Settings
} from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

import { getExitConfig, updateExitConfig } from '../../services/exitService';

const ExitConfiguration: React.FC = () => {
    const [activeSection, setActiveSection] = useState('integrations'); // Default to new section
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({
        general: {
            enableExitManagement: true,
            allowedEmployeeTypes: {
                teaching: true,
                nonTeaching: true,
                contract: true
            },
            allowedExitTypes: {
                voluntary: true,
                contractEnd: true,
                retirement: true,
                termination: true
            },
            minServicePeriod: 6 // months
        },
        noticePeriod: {
            teachingDays: 90,
            nonTeachingDays: 30,
            contractDays: 15,
            allowBuyout: true,
            allowEarlyRelease: true,
            allowExtension: false,
            allowLeave: true,
            maxLeaveDays: 5
        },
        workflow: {
            type: 'Sequential', // Sequential | Parallel
            approvalMatrix: {
                teaching: ['HoD', 'Principal', 'HR'],
                nonTeaching: ['Manager', 'HR']
            },
            optionalManagementApproval: false,
            slaDays: 3,
            autoApproveBreach: false
        },
        academic: {
            restrictExamPeriods: true,
            restrictAdmissionCycles: true,
            restrictAudits: false,
            principalOverride: true,
            mandatoryReplacement: true
        },
        handover: {
            enabled: true,
            mandatoryFor: {
                teaching: true,
                admin: true
            },
            approvalRequired: {
                successor: true,
                hod: true,
                hr: false
            }
        },
        noc: {
            enabled: true,
            departments: {
                library: true,
                it: true,
                assets: true,
                inventory: true,
                finance: true,
                hostel: false,
                transport: false
            },
            slaDays: 2,
            autoClearNoAssets: true,
            systemBehavior: {
                autoCreateTasks: true,
                escalateOverdue: true
            }
        },
        interview: {
            mandatory: true,
            mode: 'Hybrid', // Self-Service | HR Interview | Hybrid
            anonymous: false,
            hrReviewMandatory: true
        },
        settlement: {
            payrollIntegration: true,
            components: {
                salaryLwd: true,
                encashment: true,
                deductions: true,
                gratuity: true
            },
            approvalLevels: {
                hr: true,
                finance: true,
                management: false
            }
        },
        documents: {
            autoGenerate: {
                relievingLetter: true,
                experienceCert: true,
                serviceCert: true
            },
            digitalSignature: true,
            manualUpload: false
        },
        access: {
            autoRevoke: true,
            timing: 'On LWD', // On LWD | After F&F
            auditRetention: 5, // years
            complianceMode: true
        },
        notifications: {
            channels: {
                email: true,
                inApp: true,
                sms: false
            },
            alerts: {
                submitted: true,
                approvalPending: true,
                handoverIncomplete: true,
                nocOverdue: true
            }
        },
        integrations: {
            orgStructure: true,
            academicCalendar: true,
            payroll: true,
            accessManagement: true,
            workforcePlanning: true
        }
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const res = await getExitConfig();
            if (res.data) setConfig(res.data);
        } catch (error) {
            console.error("Failed to load config", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await updateExitConfig(config);
            alert("Configuration saved successfully!");
        } catch (error) {
            console.error("Failed to save config", error);
            alert("Failed to save configuration.");
        }
    };

    const handleToggle = (section: string, key: string, subKey?: string) => {
        setConfig(prev => {
            const sectionData = { ...prev[section as keyof typeof prev] };
            if (subKey) {
                // @ts-ignore
                const subData = { ...sectionData[key] };
                // @ts-ignore
                subData[subKey] = !subData[subKey];
                // @ts-ignore
                sectionData[key] = subData;
            } else {
                // @ts-ignore
                sectionData[key] = !sectionData[key];
            }
            return { ...prev, [section]: sectionData };
        });
    };

    const handleChange = (section: string, key: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [key]: value
            }
        }));
    };

    const sections = [
        { id: 'integrations', label: 'Module Integrations', icon: Workflow, description: 'Connect with core system modules' },
        { id: 'general', label: 'General Rules', icon: Shield, description: 'Basic exit eligibility and rules' },
        { id: 'noticePeriod', label: 'Notice Period', icon: Clock, description: 'Duration and buyout policies' },
        { id: 'workflow', label: 'Approval Workflow', icon: GitMerge, description: 'Routing and authority matrix' },
        { id: 'academic', label: 'Academic Safeguards', icon: GraduationCap, description: 'Exam and admission cycle protection' },
        { id: 'handover', label: 'Knowledge Handover', icon: BookOpen, description: 'Asset and file transfer protocols' },
        { id: 'noc', label: 'Department NOC', icon: Building, description: 'Clearance from various departments' },
        { id: 'interview', label: 'Exit Interview', icon: MessageSquare, description: 'Feedback collection and analysis' },
        { id: 'settlement', label: 'Final Settlement', icon: DollarSign, description: 'F&F calculation and payout' },
        { id: 'documents', label: 'Documents', icon: FileText, description: 'Letters and certificates' },
        { id: 'access', label: 'Access Control', icon: Lock, description: 'System revocation and security' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts and communication channels' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'integrations':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Module Integrations" description="Manage connections with other system modules for seamless data flow." />
                        <div className="grid grid-cols-1 gap-4">
                            <Card className={`${config.integrations.orgStructure ? 'border-indigo-200 bg-indigo-50/50' : ''}`}>
                                <CardContent className="pt-6">
                                    <ToggleItem
                                        label="Organisation Structure"
                                        description="Sync approval routing and hierarchy from Core HR."
                                        checked={config.integrations.orgStructure}
                                        onChange={() => handleToggle('integrations', 'orgStructure')}
                                    />
                                </CardContent>
                            </Card>
                            <Card className={`${config.integrations.academicCalendar ? 'border-indigo-200 bg-indigo-50/50' : ''}`}>
                                <CardContent className="pt-6">
                                    <ToggleItem
                                        label="Academic Calendar"
                                        description="Enforce exit restrictions based on Exam and Admission cycles."
                                        checked={config.integrations.academicCalendar}
                                        onChange={() => handleToggle('integrations', 'academicCalendar')}
                                    />
                                </CardContent>
                            </Card>
                            <Card className={`${config.integrations.payroll ? 'border-indigo-200 bg-indigo-50/50' : ''}`}>
                                <CardContent className="pt-6">
                                    <ToggleItem
                                        label="Payroll System"
                                        description="Automate Full & Final (F&F) settlement calculations."
                                        checked={config.integrations.payroll}
                                        onChange={() => handleToggle('integrations', 'payroll')}
                                    />
                                </CardContent>
                            </Card>
                            <Card className={`${config.integrations.accessManagement ? 'border-indigo-200 bg-indigo-50/50' : ''}`}>
                                <CardContent className="pt-6">
                                    <ToggleItem
                                        label="Access Management"
                                        description="Trigger IT offboarding and system access revocation."
                                        checked={config.integrations.accessManagement}
                                        onChange={() => handleToggle('integrations', 'accessManagement')}
                                    />
                                </CardContent>
                            </Card>
                            <Card className={`${config.integrations.workforcePlanning ? 'border-indigo-200 bg-indigo-50/50' : ''}`}>
                                <CardContent className="pt-6">
                                    <ToggleItem
                                        label="Workforce Planning"
                                        description="Automatically trigger vacancy creation and hiring workflows."
                                        checked={config.integrations.workforcePlanning}
                                        onChange={() => handleToggle('integrations', 'workforcePlanning')}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            case 'general':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="General Configuration" description="Define the foundational rules for the exit management process." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Module Activation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem
                                    label="Enable Exit Management Module"
                                    description="Turn off to disable all exit-related workflows system-wide."
                                    checked={config.general.enableExitManagement}
                                    onChange={() => handleToggle('general', 'enableExitManagement')}
                                />
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold text-slate-900">Applicable Employee Types</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <CheckboxItem label="Teaching Staff" checked={config.general.allowedEmployeeTypes.teaching} onChange={() => handleToggle('general', 'allowedEmployeeTypes', 'teaching')} />
                                    <CheckboxItem label="Non-Teaching Staff" checked={config.general.allowedEmployeeTypes.nonTeaching} onChange={() => handleToggle('general', 'allowedEmployeeTypes', 'nonTeaching')} />
                                    <CheckboxItem label="Contract / Guest Faculty" checked={config.general.allowedEmployeeTypes.contract} onChange={() => handleToggle('general', 'allowedEmployeeTypes', 'contract')} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold text-slate-900">Allowed Exit Types</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <CheckboxItem label="Voluntary Resignation" checked={config.general.allowedExitTypes.voluntary} onChange={() => handleToggle('general', 'allowedExitTypes', 'voluntary')} />
                                        <CheckboxItem label="End of Contract" checked={config.general.allowedExitTypes.contractEnd} onChange={() => handleToggle('general', 'allowedExitTypes', 'contractEnd')} />
                                        <CheckboxItem label="Retirement" checked={config.general.allowedExitTypes.retirement} onChange={() => handleToggle('general', 'allowedExitTypes', 'retirement')} />
                                        <CheckboxItem label="Termination" checked={config.general.allowedExitTypes.termination} onChange={() => handleToggle('general', 'allowedExitTypes', 'termination')} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Eligibility Criteria</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Label className="w-48">Minimum Service Period (Months)</Label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={config.general.minServicePeriod}
                                        onChange={(e) => handleChange('general', 'minServicePeriod', parseInt(e.target.value))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'noticePeriod':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Notice Period Settings" description="Configure duration and waiver policies for different staff categories." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Notice Duration (Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Teaching Staff</Label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm pr-12 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={config.noticePeriod.teachingDays}
                                                onChange={(e) => handleChange('noticePeriod', 'teachingDays', parseInt(e.target.value))}
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs text-slate-400">Days</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Non-Teaching Staff</Label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm pr-12 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={config.noticePeriod.nonTeachingDays}
                                                onChange={(e) => handleChange('noticePeriod', 'nonTeachingDays', parseInt(e.target.value))}
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs text-slate-400">Days</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contract Staff</Label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm pr-12 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={config.noticePeriod.contractDays}
                                                onChange={(e) => handleChange('noticePeriod', 'contractDays', parseInt(e.target.value))}
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs text-slate-400">Days</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Exceptions & Buyout Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Allow Notice Period Buyout" description="Enable employees to pay for shortfall in notice period" checked={config.noticePeriod.allowBuyout} onChange={() => handleToggle('noticePeriod', 'allowBuyout')} />
                                <Separator />
                                <ToggleItem label="Allow Early Release" description="Manager can waive off remaining notice days" checked={config.noticePeriod.allowEarlyRelease} onChange={() => handleToggle('noticePeriod', 'allowEarlyRelease')} />
                                <Separator />
                                <ToggleItem label="Allow Leave during Warning Period" description="Employees can take leave during notice period" checked={config.noticePeriod.allowLeave} onChange={() => handleToggle('noticePeriod', 'allowLeave')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'workflow':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Approval Workflow" description="Set up the routing logic for exit approvals." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Flow Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Workflow Type</Label>
                                    <select
                                        value={config.workflow.type}
                                        onChange={(e) => handleChange('workflow', 'type', e.target.value)}
                                        className="flex h-10 w-full max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="Sequential">Sequential (Chain of Command)</option>
                                        <option value="Parallel">Parallel (Simultaneous Approval)</option>
                                    </select>
                                    <p className="text-xs text-slate-500">
                                        Sequential: Request moves to next approver only after current approval.
                                        Parallel: All approvers receive request simultaneously.
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Teaching Staff Matrix</h4>
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                        <Badge>HoD</Badge>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                        <Badge>Principal</Badge>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                        <Badge>HR Manager</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">SLA & Automation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Label className="w-48">Approval SLA (Days)</Label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-indigo-500"
                                        value={config.workflow.slaDays}
                                        onChange={(e) => handleChange('workflow', 'slaDays', parseInt(e.target.value))}
                                    />
                                </div>
                                <ToggleItem label="Auto-approve if SLA breached" description="Automatically approve request if no action taken within SLA" checked={config.workflow.autoApproveBreach} onChange={() => handleToggle('workflow', 'autoApproveBreach')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'noc':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Department NOC Settings" description="Manage clearance requirements from various internal departments." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Global Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ToggleItem
                                    label="Enable NOC Management"
                                    description="Require clearances from support departments before final settlement."
                                    checked={config.noc.enabled}
                                    onChange={() => handleToggle('noc', 'enabled')}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Departments Requiring Clearance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CheckboxItem label="Library" checked={config.noc.departments.library} onChange={() => handleToggle('noc', 'departments', 'library')} />
                                    <CheckboxItem label="IT" checked={config.noc.departments.it} onChange={() => handleToggle('noc', 'departments', 'it')} />
                                    <CheckboxItem label="Asset Management" checked={config.noc.departments.assets} onChange={() => handleToggle('noc', 'departments', 'assets')} />
                                    <CheckboxItem label="Inventory / Stores" checked={config.noc.departments.inventory} onChange={() => handleToggle('noc', 'departments', 'inventory')} />
                                    <CheckboxItem label="Finance" checked={config.noc.departments.finance} onChange={() => handleToggle('noc', 'departments', 'finance')} />
                                    <CheckboxItem label="Hostel" checked={config.noc.departments.hostel} onChange={() => handleToggle('noc', 'departments', 'hostel')} />
                                    <CheckboxItem label="Transport" checked={config.noc.departments.transport} onChange={() => handleToggle('noc', 'departments', 'transport')} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">SLA & Automation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Label className="w-48">NOC SLA per Dept (Days)</Label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-indigo-500"
                                        value={config.noc.slaDays}
                                        onChange={(e) => handleChange('noc', 'slaDays', parseInt(e.target.value))}
                                    />
                                </div>
                                <ToggleItem label="Auto-clear if no assets assigned" description="Automatically clear NOC if employee has no borrowed items from department" checked={config.noc.autoClearNoAssets} onChange={() => handleToggle('noc', 'autoClearNoAssets')} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">System Behavior</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem
                                    label="Auto-create NOC tasks"
                                    description="Automatically generate NOC tasks for departments upon exit approval."
                                    checked={config.noc.systemBehavior.autoCreateTasks}
                                    onChange={() => handleToggle('noc', 'systemBehavior', 'autoCreateTasks')}
                                />
                                <Separator />
                                <ToggleItem
                                    label="Escalate overdue clearances"
                                    description="Notify Admin/HR if NOC is not cleared within SLA days."
                                    checked={config.noc.systemBehavior.escalateOverdue}
                                    onChange={() => handleToggle('noc', 'systemBehavior', 'escalateOverdue')}
                                />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'academic':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Academic Safeguards" description="Enforce policies to prevent disruptions during critical academic periods." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Timing Restrictions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Restrict Exits during Exam Periods" description="Block LWDs falling within 15 days of major exams based on Academic Calendar." checked={config.academic.restrictExamPeriods} onChange={() => handleToggle('academic', 'restrictExamPeriods')} />
                                <Separator />
                                <ToggleItem label="Restrict Exits during Admission Cycles" description="Prevent key admission staff from exiting during peak enrollment." checked={config.academic.restrictAdmissionCycles} onChange={() => handleToggle('academic', 'restrictAdmissionCycles')} />
                                <Separator />
                                <ToggleItem label="Restrict Exits during Audits" description="Hold exits for staff involved in active compliance or financial audits." checked={config.academic.restrictAudits} onChange={() => handleToggle('academic', 'restrictAudits')} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Exceptions & Succession</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Allow Principal Override" description="Principal/Director can bypass timing restrictions under exceptional circumstances." checked={config.academic.principalOverride} onChange={() => handleToggle('academic', 'principalOverride')} />
                                <Separator />
                                <ToggleItem label="Mandatory Replacement Assigned" description="Require a designated successor before allowing LWD for teaching staff." checked={config.academic.mandatoryReplacement} onChange={() => handleToggle('academic', 'mandatoryReplacement')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'handover':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Knowledge Handover" description="Manage requirements for passing on duties, files, and assets." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Handover Applicability</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Enable Handover Workflows" description="Require formal handover documentation before NOC clearance." checked={config.handover.enabled} onChange={() => handleToggle('handover', 'enabled')} />
                                {config.handover.enabled && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <Label className="text-sm font-semibold mb-3 block">Mandatory For:</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <CheckboxItem label="Teaching Staff" checked={config.handover.mandatoryFor.teaching} onChange={() => handleToggle('handover', 'mandatoryFor', 'teaching')} />
                                            <CheckboxItem label="Administrative Staff" checked={config.handover.mandatoryFor.admin} onChange={() => handleToggle('handover', 'mandatoryFor', 'admin')} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        {config.handover.enabled && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold text-slate-900">Handover Approvals Required</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <CheckboxItem label="Successor Sign-off" checked={config.handover.approvalRequired.successor} onChange={() => handleToggle('handover', 'approvalRequired', 'successor')} />
                                    <CheckboxItem label="Reporting Manager / HoD" checked={config.handover.approvalRequired.hod} onChange={() => handleToggle('handover', 'approvalRequired', 'hod')} />
                                    <CheckboxItem label="HR Verification" checked={config.handover.approvalRequired.hr} onChange={() => handleToggle('handover', 'approvalRequired', 'hr')} />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                );
            case 'interview':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Exit Interview" description="Configure how departure feedback is collected and analyzed." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Process Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Mandatory Exit Interview" description="Employees cannot proceed to F&F settlement without completing an interview." checked={config.interview.mandatory} onChange={() => handleToggle('interview', 'mandatory')} />

                                <div className="space-y-2 mt-4">
                                    <Label>Interview Mode</Label>
                                    <select
                                        value={config.interview.mode}
                                        onChange={(e) => handleChange('interview', 'mode', e.target.value)}
                                        className="flex h-10 w-full max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="Self-Service">Self-Service (Online Form Only)</option>
                                        <option value="HR Interview">1-on-1 with HR Only</option>
                                        <option value="Hybrid">Hybrid (Form + Optional HR Meeting)</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Form Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Allow Anonymous Feedback" description="Employee name will be hidden in sentiment analysis and management reports." checked={config.interview.anonymous} onChange={() => handleToggle('interview', 'anonymous')} />
                                <Separator />
                                <ToggleItem label="HR Review Mandatory" description="Require HR to review and categorize the interview feedback before marking it complete." checked={config.interview.hrReviewMandatory} onChange={() => handleToggle('interview', 'hrReviewMandatory')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'settlement':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Final Settlement (F&F)" description="Configure financial clearance and automated component calculation." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Financial Systems</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ToggleItem label="Enable Direct Payroll Integration" description="Automatically fetch pending salaries and dues directly from the integrated Payroll engine." checked={config.settlement.payrollIntegration} onChange={() => handleToggle('settlement', 'payrollIntegration')} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Automated F&F Components</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CheckboxItem label="Salary Till LWD" checked={config.settlement.components.salaryLwd} onChange={() => handleToggle('settlement', 'components', 'salaryLwd')} />
                                    <CheckboxItem label="Leave Encashment" checked={config.settlement.components.encashment} onChange={() => handleToggle('settlement', 'components', 'encashment')} />
                                    <CheckboxItem label="Asset Deduction Penalties" checked={config.settlement.components.deductions} onChange={() => handleToggle('settlement', 'components', 'deductions')} />
                                    <CheckboxItem label="Gratuity Clearance" checked={config.settlement.components.gratuity} onChange={() => handleToggle('settlement', 'components', 'gratuity')} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Settlement Approval Chain</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <CheckboxItem label="HR Approval" checked={config.settlement.approvalLevels.hr} onChange={() => handleToggle('settlement', 'approvalLevels', 'hr')} />
                                <CheckboxItem label="Finance Approval" checked={config.settlement.approvalLevels.finance} onChange={() => handleToggle('settlement', 'approvalLevels', 'finance')} />
                                <CheckboxItem label="Management / Director Approval" checked={config.settlement.approvalLevels.management} onChange={() => handleToggle('settlement', 'approvalLevels', 'management')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'documents':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Post-Exit Documents" description="Manage relieving letters and employment certificates." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Automatic Generation</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Select documents to auto-generate upon F&F clearance.</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CheckboxItem label="Relieving Letter" checked={config.documents.autoGenerate.relievingLetter} onChange={() => handleToggle('documents', 'autoGenerate', 'relievingLetter')} />
                                    <CheckboxItem label="Experience Certificate" checked={config.documents.autoGenerate.experienceCert} onChange={() => handleToggle('documents', 'autoGenerate', 'experienceCert')} />
                                    <CheckboxItem label="Service Certificate" checked={config.documents.autoGenerate.serviceCert} onChange={() => handleToggle('documents', 'autoGenerate', 'serviceCert')} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Document Issuance Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Require Digital Signature" description="HR must digitally sign the auto-generated documents before they become accessible to the employee." checked={config.documents.digitalSignature} onChange={() => handleToggle('documents', 'digitalSignature')} />
                                <Separator />
                                <ToggleItem label="Allow Manual Override/Upload" description="Allow HR to upload physically signed or custom written physical letters instead of system templates." checked={config.documents.manualUpload} onChange={() => handleToggle('documents', 'manualUpload')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'access':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Access Control" description="IT revocation and security protocols post-employment." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Revocation Triggers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="Auto-Revoke System Access" description="Automatically block login capability for ERP, LMS, and Email servers based on mapping." checked={config.access.autoRevoke} onChange={() => handleToggle('access', 'autoRevoke')} />

                                {config.access.autoRevoke && (
                                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                                        <Label>Revocation Timing</Label>
                                        <select
                                            value={config.access.timing}
                                            onChange={(e) => handleChange('access', 'timing', e.target.value)}
                                            className="flex h-10 w-full max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="On LWD">End of Last Working Day (LWD)</option>
                                            <option value="After F&F">After Final Settlement Clearance</option>
                                        </select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Audit & Compliance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Label className="w-56">Data Retention Period (Years)</Label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-indigo-500"
                                        value={config.access.auditRetention}
                                        onChange={(e) => handleChange('access', 'auditRetention', parseInt(e.target.value))}
                                    />
                                </div>
                                <ToggleItem label="Strict Compliance Archival" description="Convert employee records to Read-Only archives rather than deletion." checked={config.access.complianceMode} onChange={() => handleToggle('access', 'complianceMode')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="Notifications Framework" description="Configure communication channels and critical event triggers." />
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Communication Channels</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <CheckboxItem label="Push / In-App" checked={config.notifications.channels.inApp} onChange={() => handleToggle('notifications', 'channels', 'inApp')} />
                                    <CheckboxItem label="Email" checked={config.notifications.channels.email} onChange={() => handleToggle('notifications', 'channels', 'email')} />
                                    <CheckboxItem label="SMS Gateway" checked={config.notifications.channels.sms} onChange={() => handleToggle('notifications', 'channels', 'sms')} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-900">Important Alert Triggers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ToggleItem label="New Resignation Submitted" description="Notify HoD and HR immediately." checked={config.notifications.alerts.submitted} onChange={() => handleToggle('notifications', 'alerts', 'submitted')} />
                                <Separator />
                                <ToggleItem label="Approval Action Required" description="Remind managers if a step requires their input before SLA breaches." checked={config.notifications.alerts.approvalPending} onChange={() => handleToggle('notifications', 'alerts', 'approvalPending')} />
                                <Separator />
                                <ToggleItem label="NOC Clearance Overdue" description="Notify Departments if they have failed to clear NOCs." checked={config.notifications.alerts.nocOverdue} onChange={() => handleToggle('notifications', 'alerts', 'nocOverdue')} />
                                <Separator />
                                <ToggleItem label="Incomplete Handover approaching LWD" description="Warn employees and successors 3 days prior to LWD if handover is unsigned." checked={config.notifications.alerts.handoverIncomplete} onChange={() => handleToggle('notifications', 'alerts', 'handoverIncomplete')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400 border border-slate-200">
                            <Settings className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Under Construction</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">This configuration module is being mapped. Select another section from the sidebar.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full bg-slate-50/50 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Configuration</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage system-wide settings</p>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 group
                                ${activeSection === section.id
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-200'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <div className={`p-1.5 rounded-md ${activeSection === section.id ? 'bg-white shadow-sm text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700'}`}>
                                <section.icon className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <span className="block">{section.label}</span>
                                <span className={`text-[10px] leading-tight line-clamp-1 ${activeSection === section.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                                    {section.description}
                                </span>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
                {/* Header Actions */}
                <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{sections.find(s => s.id === activeSection)?.label}</h2>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="h-9">
                            <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
                        </Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-9 shadow-md shadow-indigo-200" onClick={handleSave} disabled={loading}>
                            <Save className="w-3.5 h-3.5 mr-2" /> {loading ? 'Loading...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto pb-20">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components for Cleaner Code ---

const SectionHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
    </div>
);

const ToggleItem: React.FC<{ label: string; description?: string; checked: boolean; onChange: () => void }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-1">
        <div className="space-y-0.5">
            <Label className="text-base font-medium text-slate-800">{label}</Label>
            {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
        <div
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </div>
    </div>
);

const CheckboxItem: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <div
        onClick={onChange}
        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${checked ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
    >
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
            {checked && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className={`text-sm font-medium ${checked ? 'text-indigo-900' : 'text-slate-700'}`}>{label}</span>
    </div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-sm">
        {children}
    </span>
);

export default ExitConfiguration;
