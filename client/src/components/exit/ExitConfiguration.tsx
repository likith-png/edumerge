import React, { useState, useEffect } from 'react';
import {
    Save, RotateCcw, Shield, Clock, GitMerge, GraduationCap,
    BookOpen, Building, MessageSquare, DollarSign, FileText,
    Lock, Bell, Check, ChevronRight, Workflow, Settings
} from 'lucide-react';

import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

import { getExitConfig, updateExitConfig } from '../../services/exitService';

// Proxy UI components to apply Glassmorphism globally in this file
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

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
            requireOneOnOne: true,
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
                it: true,
                admin: true,
                finance: true,
                hod: true,
                library: true,
                payroll: true
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
        { id: 'integrations', label: 'Integrations', icon: Workflow, description: 'Connect with core system modules' },
        { id: 'general', label: 'General Rules', icon: Shield, description: 'Basic exit eligibility and rules' },
        { id: 'noticePeriod', label: 'Notice Period', icon: Clock, description: 'Duration and buyout policies' },
        { id: 'workflow', label: 'Approval Workflow', icon: GitMerge, description: 'Routing and authority matrix' },
        { id: 'academic', label: 'Academic Rules', icon: GraduationCap, description: 'Exam and admission cycle protection' },
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
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader title="Module Integrations" description="Manage synchronization with core system modules for automated offboarding." />
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'orgStructure', label: 'Organisation Structure', description: 'Synchronize authority matrix and approval hierarchy from the central HR registry.' },
                                { id: 'academicCalendar', label: 'Academic Calendar', description: 'Enforce exit restrictions based on examination cycles and institutional calendars.' },
                                { id: 'payroll', label: 'Payroll Integration', description: 'Automate Full & Final (F&F) calculations via the integrated payroll module.' },
                                { id: 'accessManagement', label: 'Access Management', description: 'Trigger automatic revocation of network, email, and ERP credentials.' },
                                { id: 'workforcePlanning', label: 'Workforce Planning', description: 'Automatically broadcast vacancy alerts and trigger recruitment cycles on departure.' }
                            ].map((item) => (
                                <Card key={item.id} className={`bg-white border transition-all duration-300 overflow-hidden relative ${(config.integrations as any)[item.id] ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200'}`}>
                                    <CardContent className="p-8">
                                        <ToggleItem
                                            label={item.label}
                                            description={item.description}
                                            checked={(config.integrations as any)[item.id]}
                                            onChange={() => handleToggle('integrations', item.id)}
                                        />
                                    </CardContent>
                                    {(config.integrations as any)[item.id] && <div className="absolute top-0 right-0 p-4"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /></div>}
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case 'general':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <SectionHeader title="General Configuration" description="Define the foundational rules for the exit management process." />
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Module Activation</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ToggleItem
                                    label="Enable Exit Management"
                                    description="Turn off to disable all exit-related workflows system-wide."
                                    checked={config.general.enableExitManagement}
                                    onChange={() => handleToggle('general', 'enableExitManagement')}
                                />
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Applicable Employee Types</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-3">
                                    <CheckboxItem label="Teaching Staff" checked={config.general.allowedEmployeeTypes.teaching} onChange={() => handleToggle('general', 'allowedEmployeeTypes', 'teaching')} />
                                    <CheckboxItem label="Non-Teaching Staff" checked={config.general.allowedEmployeeTypes.nonTeaching} onChange={() => handleToggle('general', 'allowedEmployeeTypes', 'nonTeaching')} />
                                    <CheckboxItem label="Contract / Guest Faculty" checked={config.general.allowedEmployeeTypes.contract} onChange={() => handleToggle('general', 'allowedEmployeeTypes', 'contract')} />
                                </CardContent>
                            </Card>
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Allowed Exit Types</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <CheckboxItem label="Resignation" checked={config.general.allowedExitTypes.voluntary} onChange={() => handleToggle('general', 'allowedExitTypes', 'voluntary')} />
                                        <CheckboxItem label="End of Contract" checked={config.general.allowedExitTypes.contractEnd} onChange={() => handleToggle('general', 'allowedExitTypes', 'contractEnd')} />
                                        <CheckboxItem label="Retirement" checked={config.general.allowedExitTypes.retirement} onChange={() => handleToggle('general', 'allowedExitTypes', 'retirement')} />
                                        <CheckboxItem label="Termination" checked={config.general.allowedExitTypes.termination} onChange={() => handleToggle('general', 'allowedExitTypes', 'termination')} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Eligibility Criteria</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex items-center gap-6">
                                    <Label className="w-48 text-sm font-bold text-slate-600">Minimum Service (Months)</Label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
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
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Notice Duration (Days)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Teaching Staff</Label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm pr-12 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                                                value={config.noticePeriod.teachingDays}
                                                onChange={(e) => handleChange('noticePeriod', 'teachingDays', parseInt(e.target.value))}
                                            />
                                            <span className="absolute right-3 top-2.5 text-[10px] uppercase font-bold text-slate-300">Days</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Non-Teaching</Label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm pr-12 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                                                value={config.noticePeriod.nonTeachingDays}
                                                onChange={(e) => handleChange('noticePeriod', 'nonTeachingDays', parseInt(e.target.value))}
                                            />
                                            <span className="absolute right-3 top-2.5 text-[10px] uppercase font-bold text-slate-300">Days</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Contract Staff</Label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm pr-12 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                                                value={config.noticePeriod.contractDays}
                                                onChange={(e) => handleChange('noticePeriod', 'contractDays', parseInt(e.target.value))}
                                            />
                                            <span className="absolute right-3 top-2.5 text-[10px] uppercase font-bold text-slate-300">Days</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Exceptions & Buyout Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <ToggleItem label="Notice Period Buyout" description="Enable employees to pay for shortfall in notice period" checked={config.noticePeriod.allowBuyout} onChange={() => handleToggle('noticePeriod', 'allowBuyout')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="Early Release" description="Manager can waive off remaining notice days" checked={config.noticePeriod.allowEarlyRelease} onChange={() => handleToggle('noticePeriod', 'allowEarlyRelease')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="Leave during Warning Period" description="Employees can take leave during notice period" checked={config.noticePeriod.allowLeave} onChange={() => handleToggle('noticePeriod', 'allowLeave')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'workflow':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Approval Workflows" description="Configure sequential or parallel approval routes and establish service level agreements." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Routing Strategy</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Routing Protocol</Label>
                                    <select
                                        value={config.workflow.type}
                                        onChange={(e) => handleChange('workflow', 'type', e.target.value)}
                                        className="h-12 w-full max-w-md rounded-lg bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/20 text-sm font-bold text-slate-900 px-4 outline-none cursor-pointer"
                                    >
                                        <option value="Sequential">Sequential (Step-by-Step)</option>
                                        <option value="Parallel">Parallel (Simultaneous broadcast)</option>
                                    </select>
                                </div>
 
                                <div className="p-8 bg-slate-900 rounded-xl shadow-lg relative overflow-hidden">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Approval Hierarchy</h4>
                                    <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                                        <Badge className="bg-slate-800 text-white border-slate-700">Originator</Badge>
                                        <ChevronRight className="w-4 h-4 text-slate-700" />
                                        <Badge className="bg-slate-800 text-white border-slate-700">HoD / Manager</Badge>
                                        <ChevronRight className="w-4 h-4 text-slate-700" />
                                        <Badge className="bg-slate-800 text-white border-slate-700">Principal / Director</Badge>
                                        <ChevronRight className="w-4 h-4 text-slate-700" />
                                        <Badge className="bg-slate-800 text-white border-slate-700">HR Admin</Badge>
                                    </div>
                                </div>
                                <ToggleItem label="Mandatory 1-on-1 Session" description="Enforce a mandatory meeting before final approval." checked={config.workflow.requireOneOnOne} onChange={() => handleToggle('workflow', 'requireOneOnOne')} />
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Temporal Compliance (SLA)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-center gap-8">
                                    <div className="space-y-1 flex-1">
                                        <Label className="text-sm font-bold text-slate-900">Standard Approval SLA</Label>
                                        <p className="text-xs text-slate-500 italic">Maximum permissible duration for each node.</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="h-12 w-24 rounded-lg bg-white border border-slate-200 text-xl font-bold text-slate-900 text-center focus:border-indigo-500 outline-none"
                                            value={config.workflow.slaDays}
                                            onChange={(e) => handleChange('workflow', 'slaDays', parseInt(e.target.value))}
                                        />
                                        <span className="absolute -bottom-5 left-0 w-full text-center text-[8px] font-bold text-slate-300 uppercase tracking-widest">Days</span>
                                    </div>
                                </div>
                                <Separator className="opacity-50" />
                                <ToggleItem label="Auto-Approve on Breach" description="Automatically approve if no action is taken within the SLA window." checked={config.workflow.autoApproveBreach} onChange={() => handleToggle('workflow', 'autoApproveBreach')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'noc':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader title="Departmental Clearance" description="Manage No-Objection Certificate (NOC) requirements across departments." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Clearance Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ToggleItem
                                    label="Enable NOC Workflow"
                                    description="Enable system-wide tracking of departmental assets and fiscal clearances."
                                    checked={config.noc.enabled}
                                    onChange={() => handleToggle('noc', 'enabled')}
                                />
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Departments</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { id: 'it', label: 'IT Assets' },
                                    { id: 'admin', label: 'Administration' },
                                    { id: 'finance', label: 'Finance' },
                                    { id: 'hod', label: 'Academic HOD' },
                                    { id: 'library', label: 'Library' },
                                    { id: 'payroll', label: 'Payroll' }
                                ].map(dept => (
                                    <CheckboxItem key={dept.id} label={dept.label} checked={(config.noc.departments as any)[dept.id]} onChange={() => handleToggle('noc', 'departments', dept.id)} />
                                ))}
                            </CardContent>
                        </Card>
 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">NOC SLA</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-bold text-slate-600 uppercase tracking-tight">Department SLA (Days)</Label>
                                        <input
                                            type="number"
                                            className="h-10 w-24 rounded-lg bg-white border border-slate-200 text-base font-bold text-slate-900 text-center focus:border-indigo-500 outline-none"
                                            value={config.noc.slaDays}
                                            onChange={(e) => handleChange('noc', 'slaDays', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <ToggleItem label="Auto-Clear" description="Auto-clear if no assets are recorded in the repository." checked={config.noc.autoClearNoAssets} onChange={() => handleToggle('noc', 'autoClearNoAssets')} />
                                </CardContent>
                            </Card>
 
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">System Behavior</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    <ToggleItem
                                        label="Automated Tasks"
                                        description="Broadcast clearance requests immediately upon initiation."
                                        checked={config.noc.systemBehavior.autoCreateTasks}
                                        onChange={() => handleToggle('noc', 'systemBehavior', 'autoCreateTasks')}
                                    />
                                    <Separator className="opacity-50" />
                                    <ToggleItem
                                        label="Escalate Overdue"
                                        description="Alert HR Admin if NOC remains pending beyond SLA."
                                        checked={config.noc.systemBehavior.escalateOverdue}
                                        onChange={() => handleToggle('noc', 'systemBehavior', 'escalateOverdue')}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            case 'academic':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Academic Continuity" description="Enforce safeguards to protect institutional stability during critical cycles." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Blackout Windows</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-2">
                                <ToggleItem label="Restrict during Examinations" description="Intercept LWDs falling within active exam schedules." checked={config.academic.restrictExamPeriods} onChange={() => handleToggle('academic', 'restrictExamPeriods')} />
                                <ToggleItem label="Protect Admission Cycles" description="Restrict critical staff from departing during peak enrollment." checked={config.academic.restrictAdmissionCycles} onChange={() => handleToggle('academic', 'restrictAdmissionCycles')} />
                                <ToggleItem label="Hold during Audits" description="Prevent separation for stakeholders involved in active audits." checked={config.academic.restrictAudits} onChange={() => handleToggle('academic', 'restrictAudits')} />
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Overrides</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <ToggleItem label="Executive Override" description="Principal or Director can manually bypass restrictions." checked={config.academic.principalOverride} onChange={() => handleToggle('academic', 'principalOverride')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="Succession Lock" description="Require a verified replacement candidate before authorizing separation." checked={config.academic.mandatoryReplacement} onChange={() => handleToggle('academic', 'mandatoryReplacement')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'handover':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Knowledge Transfer" description="Orchestrate the migration of assets and operational responsibilities." />
                        
                        <Card className="bg-white border border-slate-200 overflow-hidden">
                            <CardHeader className="bg-slate-900 p-8">
                                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Handover Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <ToggleItem label="Enforce Handover" description="Require documentation of duties prior to NOC clearance." checked={config.handover.enabled} onChange={() => handleToggle('handover', 'enabled')} />
                                
                                {config.handover.enabled && (
                                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mandatory Rules</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <CheckboxItem label="Teaching Staff" checked={config.handover.mandatoryFor.teaching} onChange={() => handleToggle('handover', 'mandatoryFor', 'teaching')} />
                                            <CheckboxItem label="Admin Staff" checked={config.handover.mandatoryFor.admin} onChange={() => handleToggle('handover', 'mandatoryFor', 'admin')} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
 
                        {config.handover.enabled && (
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sign-off Matrix</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    <CheckboxItem label="Successor Validation" checked={config.handover.approvalRequired.successor} onChange={() => handleToggle('handover', 'approvalRequired', 'successor')} />
                                    <CheckboxItem label="HOD Verification" checked={config.handover.approvalRequired.hod} onChange={() => handleToggle('handover', 'approvalRequired', 'hod')} />
                                    <CheckboxItem label="HR Compliance" checked={config.handover.approvalRequired.hr} onChange={() => handleToggle('handover', 'approvalRequired', 'hr')} />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                );
            case 'interview':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Feedback Collection" description="Gather critical feedback and analyze reason for departure." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Interview Mode</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <ToggleItem label="Mandatory Feedback" description="Employees must complete exit survey before settlement." checked={config.interview.mandatory} onChange={() => handleToggle('interview', 'mandatory')} />
 
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Interview Mode</Label>
                                    <select
                                        value={config.interview.mode}
                                        onChange={(e) => handleChange('interview', 'mode', e.target.value)}
                                        className="h-12 w-full max-w-md rounded-lg bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/20 text-sm font-bold text-slate-900 px-4 outline-none cursor-pointer"
                                    >
                                        <option value="Self-Service">Digital Form Only</option>
                                        <option value="HR Interview">1-on-1 with HR</option>
                                        <option value="Hybrid">Hybrid (Form + Review)</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Privacy & Audit</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <ToggleItem label="Anonymized Data" description="Mask identities during sentiment analysis." checked={config.interview.anonymous} onChange={() => handleToggle('interview', 'anonymous')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="HR Review Mandatory" description="Require HR to validate feedback before closure." checked={config.interview.hrReviewMandatory} onChange={() => handleToggle('interview', 'hrReviewMandatory')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'settlement':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Final Settlement" description="Configure calculation vectors for Full & Final (F&F) settlement." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Financial Setup</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ToggleItem label="Payroll Integration" description="Fetch dues and deductions directly from core Payroll." checked={config.settlement.payrollIntegration} onChange={() => handleToggle('settlement', 'payrollIntegration')} />
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Settlement Components</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CheckboxItem label="Prorated Salary" checked={config.settlement.components.salaryLwd} onChange={() => handleToggle('settlement', 'components', 'salaryLwd')} />
                                <CheckboxItem label="Leave Encashment" checked={config.settlement.components.encashment} onChange={() => handleToggle('settlement', 'components', 'encashment')} />
                                <CheckboxItem label="Deductions" checked={config.settlement.components.deductions} onChange={() => handleToggle('settlement', 'components', 'deductions')} />
                                <CheckboxItem label="Gratuity" checked={config.settlement.components.gratuity} onChange={() => handleToggle('settlement', 'components', 'gratuity')} />
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Approval Chain</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <CheckboxItem label="HR Admin Review" checked={config.settlement.approvalLevels.hr} onChange={() => handleToggle('settlement', 'approvalLevels', 'hr')} />
                                <CheckboxItem label="Finance Sign-off" checked={config.settlement.approvalLevels.finance} onChange={() => handleToggle('settlement', 'approvalLevels', 'finance')} />
                                <CheckboxItem label="Management Approval" checked={config.settlement.approvalLevels.management} onChange={() => handleToggle('settlement', 'approvalLevels', 'management')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'documents':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Document Generation" description="Manage the automated generation of letters and certificates." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Automated Letters</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <CheckboxItem label="Relieving Letter" checked={config.documents.autoGenerate.relievingLetter} onChange={() => handleToggle('documents', 'autoGenerate', 'relievingLetter')} />
                                <CheckboxItem label="Experience Cert" checked={config.documents.autoGenerate.experienceCert} onChange={() => handleToggle('documents', 'autoGenerate', 'experienceCert')} />
                                <CheckboxItem label="Service Cert" checked={config.documents.autoGenerate.serviceCert} onChange={() => handleToggle('documents', 'autoGenerate', 'serviceCert')} />
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <ToggleItem label="Digital Signature" description="Enforce digital signing for all generated documents." checked={config.documents.digitalSignature} onChange={() => handleToggle('documents', 'digitalSignature')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="Legacy Manual Upload" description="Allow custom letter uploads." checked={config.documents.manualUpload} onChange={() => handleToggle('documents', 'manualUpload')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'access':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Access Governance" description="Orchestrate security protocols and automated credential revocation." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Revocation Setup</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <ToggleItem label="System Auto-Block" description="Automatically decommission active sessions and login capabilities." checked={config.access.autoRevoke} onChange={() => handleToggle('access', 'autoRevoke')} />
 
                                {config.access.autoRevoke && (
                                    <div className="space-y-4 p-6 bg-slate-50 border border-slate-100 rounded-xl">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Timing Trigger</Label>
                                        <select
                                            value={config.access.timing}
                                            onChange={(e) => handleChange('access', 'timing', e.target.value)}
                                            className="h-12 w-full max-w-md rounded-lg bg-white border border-slate-200 focus:border-indigo-500 text-sm font-bold text-slate-900 px-4 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="On LWD">End of Last Working Day</option>
                                            <option value="After F&F">Following Final Settlement</option>
                                        </select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Audit Compliance</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-center gap-8">
                                    <div className="space-y-1 flex-1">
                                        <Label className="text-sm font-bold text-slate-900">Retention Threshold</Label>
                                        <p className="text-xs text-slate-500 italic">Years for retaining separation audit trails.</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="h-12 w-24 rounded-lg bg-white border border-slate-200 text-xl font-bold text-slate-900 text-center focus:border-indigo-500 outline-none"
                                            value={config.access.auditRetention}
                                            onChange={(e) => handleChange('access', 'auditRetention', parseInt(e.target.value))}
                                        />
                                        <span className="absolute -bottom-5 left-0 w-full text-center text-[8px] font-bold text-slate-300 uppercase tracking-widest">Years</span>
                                    </div>
                                </div>
                                <Separator className="opacity-50" />
                                <ToggleItem label="Archival Mode" description="Transition individuals to read-only compliance clusters." checked={config.access.complianceMode} onChange={() => handleToggle('access', 'complianceMode')} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="System Notifications" description="Manage broadcast triggers and communication channels." />
                        
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Distribution Channels</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <CheckboxItem label="Push / In-App" checked={config.notifications.channels.inApp} onChange={() => handleToggle('notifications', 'channels', 'inApp')} />
                                <CheckboxItem label="Email" checked={config.notifications.channels.email} onChange={() => handleToggle('notifications', 'channels', 'email')} />
                                <CheckboxItem label="SMS" checked={config.notifications.channels.sms} onChange={() => handleToggle('notifications', 'channels', 'sms')} />
                            </CardContent>
                        </Card>
 
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Broadcast Triggers</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <ToggleItem label="New Resignation" description="Notify supervisors and HR Admin immediately." checked={config.notifications.alerts.submitted} onChange={() => handleToggle('notifications', 'alerts', 'submitted')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="Pending Approvals" description="Remind supervisors of pending actions before SLA breach." checked={config.notifications.alerts.approvalPending} onChange={() => handleToggle('notifications', 'alerts', 'approvalPending')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="NOC Overdue" description="Notify departments if NOC remains pending beyond SLA." checked={config.notifications.alerts.nocOverdue} onChange={() => handleToggle('notifications', 'alerts', 'nocOverdue')} />
                                <Separator className="opacity-50" />
                                <ToggleItem label="Handover Threshold" description="Warning 72 hours prior to LWD if handover is incomplete." checked={config.notifications.alerts.handoverIncomplete} onChange={() => handleToggle('notifications', 'alerts', 'handoverIncomplete')} />
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
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-[320px] bg-white border-r border-slate-200 flex flex-col z-10">
                <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/30">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <Settings className="w-5 h-5 text-indigo-600" /> Registry
                    </h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-1 opacity-70">Configuration Engine</p>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 group
                                ${activeSection === section.id
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <div className={`p-2 rounded-lg transition-all ${activeSection === section.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                                <section.icon className="w-4 h-4" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <span className="block font-bold truncate">{section.label}</span>
                                <span className={`text-[8px] uppercase font-bold tracking-wider block truncate mt-0.5 opacity-50`}>
                                    {section.description}
                                </span>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>
 
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-white">
                {/* Header Actions */}
                <div className="bg-white border-b border-slate-100 px-10 py-6 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">{sections.find(s => s.id === activeSection)?.label}</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ml-0.5">Global Protocol Editor</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="h-10 px-6 border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[9px] rounded-lg hover:bg-slate-50">
                            <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
                        </Button>
                        <Button size="sm" className="h-10 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-[9px] rounded-lg shadow-md transition-all active:scale-95" onClick={handleSave} disabled={loading}>
                            <Save className="w-3.5 h-3.5 mr-2" /> {loading ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </div>
                </div>
 
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
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
    <div className="mb-8 p-8 bg-white border border-slate-200 rounded-xl shadow-md relative overflow-hidden group">
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2 leading-none">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{description}</p>
    </div>
);
 
const ToggleItem: React.FC<{ label: string; description?: string; checked: boolean; onChange: () => void }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 group border-b border-slate-50 last:border-0">
        <div className="space-y-1 pr-6 flex-1">
            <Label className="text-sm font-bold text-slate-900 uppercase tracking-tight block">{label}</Label>
            {description && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">{description}</p>}
        </div>
        <div
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${checked ? 'bg-slate-900 shadow-lg' : 'bg-slate-200'}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </div>
    </div>
);
 
const CheckboxItem: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <div
        onClick={onChange}
        className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${checked ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300'}`}
    >
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-white border-white' : 'bg-slate-50 border-slate-200'}`}>
            {checked && <Check className="w-3.5 h-3.5 text-slate-900 stroke-[4px]" />}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${checked ? 'text-white' : 'text-slate-600'}`}>{label}</span>
    </div>
);
 
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${className}`}>
        {children}
    </span>
);

export default ExitConfiguration;
