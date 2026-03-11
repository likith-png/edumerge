import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Save, Shield, Clock, AlertTriangle, Users, Settings, Target, Plus, CheckCircle, Trash2, ListOrdered, MessageSquare, GripVertical } from 'lucide-react';

const ProbationConfig = () => {
    const navigate = useNavigate();
    const [activeStage, setActiveStage] = useState('general');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
    const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);
    const [newPolicy, setNewPolicy] = useState<{ name: string; duration: number; stages: string[] }>({ name: '', duration: 6, stages: ['kpi', '90_day', 'decision'] });
    const [policies, setPolicies] = useState<any[]>(() => {
        const saved = localStorage.getItem('probation_policies');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Standard Academic Probation', duration: 12, type: 'Months', stages: ['kpi', '30_day', '60_day', '90_day', 'decision'] },
            { id: 2, name: 'Standard Admin Probation', duration: 6, type: 'Months', stages: ['kpi', '90_day', 'decision'] }
        ];
    });

    const [stageConfigs, setStageConfigs] = useState<Record<string, any>>(() => {
        const saved = localStorage.getItem('probation_stage_configs');
        return saved ? JSON.parse(saved) : {
            'kpi': {
                points: [
                    { id: '1', title: 'Core Technical Competency', weight: '40', type: 'rating' },
                    { id: '2', title: 'Project Delivery Timeline', weight: '30', type: 'boolean' },
                    { id: '3', title: 'Team Collaboration & Soft Skills', weight: '30', type: 'rating' }
                ]
            },
            'feedback': {
                points: [
                    { id: '1', title: "How well has the employee integrated into the team's workflow?", sub: "Manager observation", type: "scale" },
                    { id: '2', title: "Identify key strengths observed during this period", sub: "Qualitative feedback", type: "text" }
                ]
            }
        };
    });

    const updateStageConfig = (stageId: string, data: any) => {
        const newConfigs = { ...stageConfigs, [stageId]: data };
        setStageConfigs(newConfigs);
        localStorage.setItem('probation_stage_configs', JSON.stringify(newConfigs));
    };

    const [stageDefinitions, setStageDefinitions] = useState<any[]>(() => {
        const saved = localStorage.getItem('probation_stage_definitions');
        return saved ? JSON.parse(saved) : [
            { id: 'kpi', label: 'KPI Setting', description: 'Initial goal setting stage', icon: 'Target', color: 'indigo' },
            { id: '30_day', label: '30-Day Check-in', description: 'First month review', icon: 'Clock', color: 'blue' },
            { id: '60_day', label: '60-Day Review', description: 'Mid-term evaluation', icon: 'Users', color: 'emerald' },
            { id: '90_day', label: 'Final Assessment', description: '90-Day confirmation review', icon: 'Shield', color: 'amber' },
            { id: 'decision', label: 'Confirmation Decision', description: 'HR Final Approval', icon: 'AlertTriangle', color: 'rose' }
        ];
    });

    const updateStageDefinition = (id: string, updates: any) => {
        const newStages = stageDefinitions.map(s => s.id === id ? { ...s, ...updates } : s);
        setStageDefinitions(newStages);
        localStorage.setItem('probation_stage_definitions', JSON.stringify(newStages));
    };

    const handleAddStage = () => {
        const newId = `stage_${Date.now()}`;
        const newStage = {
            id: newId,
            label: 'New Stage',
            description: 'Custom milestone',
            icon: 'Target',
            color: 'slate'
        };
        const newStages = [...stageDefinitions, newStage];
        setStageDefinitions(newStages);
        localStorage.setItem('probation_stage_definitions', JSON.stringify(newStages));
        setActiveStage(newId);
    };

    const handleDeleteStage = (id: string) => {
        const newStages = stageDefinitions.filter(s => s.id !== id);
        setStageDefinitions(newStages);
        localStorage.setItem('probation_stage_definitions', JSON.stringify(newStages));
        if (activeStage === id) setActiveStage('general');
    };

    // Helper to get icon component
    const getIcon = (iconName: string) => {
        const icons: any = { Target, Clock, Users, Shield, AlertTriangle, CheckCircle, Plus, Settings };
        return icons[iconName] || Target;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
            {/* Background Blurs */}
            <div className="absolute top-0 -left-1/4 w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-1/4 w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 space-y-8">
                {/* Premium Header */}
                <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-sm">
                    <div className="flex items-center space-x-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/probation-dashboard')}
                            className="rounded-2xl hover:bg-white/60 transition-all shadow-sm"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Probation Config</h1>
                            <p className="text-sm font-medium text-slate-500">Orchestrate the journey of your new talent</p>
                        </div>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 rounded-2xl px-6 h-12 font-bold transition-all hover:scale-105 active:scale-95">
                        <Save className="h-5 w-5 mr-2" />
                        Save Configuration
                    </Button>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    {/* Sidebar Navigation - Floating Crystal Items */}
                    <div className="col-span-3 space-y-8">
                        <div>
                            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Core Engine</h3>
                            <button
                                onClick={() => setActiveStage('general')}
                                className={`group w-full relative p-4 rounded-[24px] transition-all duration-300 ${activeStage === 'general'
                                    ? 'bg-white shadow-xl ring-1 ring-black/5 translate-x-2'
                                    : 'hover:bg-white/50 hover:translate-x-1'
                                    }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${activeStage === 'general' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white shadow-sm text-slate-400 group-hover:text-indigo-600'}`}>
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className={`block text-sm font-bold ${activeStage === 'general' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>Policy Architect</span>
                                        <span className="text-[10px] text-slate-400 font-medium">Duration & Templates</span>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div>
                            <div className="flex items-center justify-between px-4 mb-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Stage Designer</h3>
                                <Button onClick={handleAddStage} variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-indigo-50 text-indigo-600">
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>

                            <div className="px-4 mb-6">
                                <Select
                                    value={selectedPolicyId?.toString() || 'all'}
                                    onValueChange={(v) => setSelectedPolicyId(v === 'all' ? null : parseInt(v))}
                                >
                                    <SelectTrigger className="h-10 rounded-xl bg-white/60 backdrop-blur-md border-white/50 shadow-sm focus:ring-indigo-500">
                                        <SelectValue placeholder="All Templates" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-white/50 backdrop-blur-xl">
                                        <SelectItem value="all">Global (All Stages)</SelectItem>
                                        {policies.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                {stageDefinitions.filter((s: any) => !selectedPolicyId || policies.find(p => p.id === selectedPolicyId)?.stages?.includes(s.id)).map((stage: any) => (
                                    <button
                                        key={stage.id}
                                        onClick={() => setActiveStage(stage.id)}
                                        className={`group w-full relative p-4 rounded-[24px] transition-all duration-300 ${activeStage === stage.id
                                            ? 'bg-white shadow-xl ring-1 ring-black/5 translate-x-3'
                                            : 'hover:bg-white/50 hover:translate-x-1'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`p-2.5 rounded-xl transition-all duration-300 ${activeStage === stage.id ? `bg-${stage.color}-600 text-white shadow-lg shadow-${stage.color}-200` : 'bg-white shadow-sm text-slate-400 group-hover:text-slate-600'}`}>
                                                {React.createElement(getIcon(stage.icon) as any, { className: "w-5 h-5" })}
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className={`block text-sm font-bold truncate ${activeStage === stage.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{stage.label}</span>
                                                    {activeStage === stage.id && (
                                                        <div className={`h-1.5 w-1.5 rounded-full bg-${stage.color}-500 shadow-sm`} />
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium truncate block">{stage.description}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Configuration Area */}
                    <div className="col-span-9 space-y-10">

                        {/* GENERAL SETTINGS VIEW - Policy Architect */}
                        {activeStage === 'general' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {isModalOpen && (
                                    <Card className="border-none shadow-2xl rounded-[40px] bg-white/80 backdrop-blur-2xl overflow-hidden border border-white/50 relative z-20 ring-1 ring-black/5">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                                                    <Plus className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-2xl font-black text-slate-900 leading-none">
                                                        {editingPolicyId ? 'Refine Policy' : 'New Policy Architect'}
                                                    </CardTitle>
                                                    <CardDescription className="text-slate-500 font-medium">Define the timeline and milestone structure.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Policy Identity</Label>
                                                    <Input
                                                        placeholder="e.g. Senior Academic Track"
                                                        className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
                                                        value={newPolicy.name}
                                                        onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Duration (Months)</Label>
                                                    <Input
                                                        type="number"
                                                        className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
                                                        value={newPolicy.duration}
                                                        onChange={(e) => setNewPolicy({ ...newPolicy, duration: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Journey Milestones</Label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {stageDefinitions.map((s: any) => (
                                                        <label key={s.id} className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all border-2 ${newPolicy.stages.includes(s.id) ? 'bg-indigo-50/50 border-indigo-600 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only"
                                                                    checked={newPolicy.stages.includes(s.id)}
                                                                    onChange={(e) => {
                                                                        const stages = e.target.checked
                                                                            ? [...newPolicy.stages, s.id]
                                                                            : newPolicy.stages.filter(id => id !== s.id);
                                                                        setNewPolicy({ ...newPolicy, stages });
                                                                    }}
                                                                />
                                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${newPolicy.stages.includes(s.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                                                    {newPolicy.stages.includes(s.id) && <CheckCircle className="w-4 h-4 text-white" />}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`text-sm font-black ${newPolicy.stages.includes(s.id) ? 'text-indigo-900' : 'text-slate-900'}`}>{s.label}</div>
                                                                <p className="text-[10px] text-slate-500 font-medium truncate">{s.description}</p>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>

                                                {/* Stage Reordering Sequence */}
                                                {newPolicy.stages.length > 0 && (
                                                    <div className="mt-6 space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Journey Sequence (Ordered)</Label>
                                                        <div className="space-y-2 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                                            {newPolicy.stages.map((stageId, index) => {
                                                                const stageDef = stageDefinitions.find((s: any) => s.id === stageId);
                                                                if (!stageDef) return null;
                                                                return (
                                                                    <div key={stageId} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-left-2">
                                                                        <div className="flex items-center gap-3">
                                                                            <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none h-6 w-6 rounded-full flex items-center justify-center p-0 text-[10px] font-black">{index + 1}</Badge>
                                                                            <div className="flex items-center gap-2">
                                                                                {React.createElement(getIcon(stageDef.icon) as any, { className: `w-4 h-4 text-${stageDef.color}-500` })}
                                                                                <span className={`text-sm font-bold text-slate-700`}>{stageDef.label}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <Button
                                                                                variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                                                disabled={index === 0}
                                                                                onClick={() => {
                                                                                    const newStages = [...newPolicy.stages];
                                                                                    [newStages[index], newStages[index - 1]] = [newStages[index - 1], newStages[index]];
                                                                                    setNewPolicy({ ...newPolicy, stages: newStages });
                                                                                }}
                                                                            >
                                                                                <ArrowLeft className="w-3 h-3 rotate-90" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                                                disabled={index === newPolicy.stages.length - 1}
                                                                                onClick={() => {
                                                                                    const newStages = [...newPolicy.stages];
                                                                                    [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
                                                                                    setNewPolicy({ ...newPolicy, stages: newStages });
                                                                                }}
                                                                            >
                                                                                <ArrowLeft className="w-3 h-3 -rotate-90" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-end gap-4 pt-8 mt-4 border-t border-slate-100">
                                                <Button
                                                    variant="ghost"
                                                    className="h-12 px-8 rounded-2xl font-bold text-slate-500 hover:text-slate-900"
                                                    onClick={() => { setIsModalOpen(false); setEditingPolicyId(null); setNewPolicy({ name: '', duration: 6, stages: ['kpi', '90_day', 'decision'] }); }}
                                                >
                                                    Discard
                                                </Button>
                                                <Button
                                                    className="h-12 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100"
                                                    disabled={!newPolicy.name}
                                                    onClick={() => {
                                                        let updated;
                                                        if (editingPolicyId) {
                                                            updated = policies.map(p => p.id === editingPolicyId ? { ...newPolicy, id: editingPolicyId, type: 'Months' } : p);
                                                        } else {
                                                            const policy = { ...newPolicy, id: Date.now(), type: 'Months' };
                                                            updated = [...policies, policy];
                                                        }
                                                        setPolicies(updated);
                                                        localStorage.setItem('probation_policies', JSON.stringify(updated));
                                                        setIsModalOpen(false);
                                                        setEditingPolicyId(null);
                                                        setNewPolicy({ name: '', duration: 6, stages: ['kpi', '90_day', 'decision'] });
                                                    }}
                                                >
                                                    {editingPolicyId ? 'Update Evolution' : 'Initialize Policy'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Policies</h2>
                                            <p className="text-xs font-medium text-slate-500">Manage institutional probation frameworks</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-2xl px-6 h-10 font-black tracking-tight"
                                            onClick={() => setIsModalOpen(true)}
                                            disabled={isModalOpen}
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> CREATE NEW
                                        </Button>
                                    </div>

                                    <div className="grid gap-6">
                                        {policies.map(policy => (
                                            <div key={policy.id} className="group relative overflow-hidden rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 p-8 hover:-translate-y-1">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-indigo-600/10 transition-colors" />

                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-16 w-16 rounded-[24px] bg-indigo-600 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-200">
                                                            <span className="text-2xl font-black leading-none">{policy.duration}</span>
                                                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">MOS</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{policy.name}</h3>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-100 text-[10px] font-bold py-1 px-3 rounded-lg uppercase tracking-wider">
                                                                    {policy.type || 'Standard'}
                                                                </Badge>
                                                                <Separator orientation="vertical" className="h-4" />
                                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                    {policy.stages?.length || 0} MILESTONES
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            className="h-11 px-6 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                                                            onClick={() => {
                                                                setNewPolicy({ name: policy.name, duration: policy.duration, stages: policy.stages || [] });
                                                                setEditingPolicyId(policy.id);
                                                                setIsModalOpen(true);
                                                            }}
                                                        >
                                                            Refine
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-11 w-11 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all"
                                                            onClick={() => {
                                                                const updated = policies.filter(p => p.id !== policy.id);
                                                                setPolicies(updated);
                                                                localStorage.setItem('probation_policies', JSON.stringify(updated));
                                                            }}
                                                        >
                                                            <AlertTriangle className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                                                    {policy.stages?.map((sid: string) => {
                                                        const stageInfo = stageDefinitions.find((s: any) => s.id === sid);
                                                        return (
                                                            <div key={sid} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl transition-all hover:bg-white hover:shadow-sm">
                                                                {stageInfo?.icon && <stageInfo.icon className={`w-3.5 h-3.5 text-${stageInfo?.color}-500`} />}
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                                                    {stageInfo?.label || sid}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        {policies.length === 0 && (
                                            <div className="flex flex-col items-center justify-center p-20 rounded-[40px] border-4 border-dashed border-slate-100 bg-slate-50/50">
                                                <div className="p-6 bg-slate-100 rounded-full mb-6">
                                                    <Settings className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-400 tracking-tight">No Policies Architected</h3>
                                                <p className="text-sm font-medium text-slate-400 mt-1 max-w-xs text-center leading-relaxed">Initialization required to begin managing institutional probation cycles.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STAGE SETTINGS VIEW - Workflow, SLA, Notifications */}
                        {activeStage !== 'general' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-4 rounded-[28px] bg-${stageDefinitions.find((s: any) => s.id === activeStage)?.color}-600 text-white shadow-xl shadow-${stageDefinitions.find((s: any) => s.id === activeStage)?.color}-100`}>
                                        {React.createElement(stageDefinitions.find((s: any) => s.id === activeStage)?.icon || Settings, { className: "w-8 h-8" } as any)}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                            {stageDefinitions.find((s: any) => s.id === activeStage)?.label} Configuration
                                        </h2>
                                        <p className="text-sm font-medium text-slate-500 mt-2">Personalize the experience for this specific milestone.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    {/* 1. Workflow Settings */}
                                    <Card className="border-none shadow-xl rounded-[40px] bg-white/80 backdrop-blur-2xl overflow-hidden border border-white/50 relative group">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600/50 group-hover:w-4 transition-all" />
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg font-black text-slate-900 tracking-tight">
                                                <Shield className="w-5 h-5 mr-3 text-indigo-500" />
                                                Workflow Rules
                                            </CardTitle>
                                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Auth & Approvals</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Stage Owner</Label>
                                                    <Select
                                                        value={stageConfigs[activeStage]?.owner || 'manager'}
                                                        onValueChange={(v) => updateStageConfig(activeStage, { ...stageConfigs[activeStage], owner: v })}
                                                    >
                                                        <SelectTrigger className="h-12 rounded-2xl bg-white/60 border-slate-100 shadow-sm"><SelectValue /></SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-white/50 backdrop-blur-xl">
                                                            <SelectItem value="manager">Reporting Manager</SelectItem>
                                                            <SelectItem value="hr">HR Manager</SelectItem>
                                                            <SelectItem value="skip_level">Skip Level Manager</SelectItem>
                                                            <SelectItem value="employee">Employee (Self)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Checker Role</Label>
                                                    <Select
                                                        value={stageConfigs[activeStage]?.checker || 'hr'}
                                                        onValueChange={(v) => updateStageConfig(activeStage, { ...stageConfigs[activeStage], checker: v })}
                                                    >
                                                        <SelectTrigger className="h-12 rounded-2xl bg-white/60 border-slate-100 shadow-sm"><SelectValue /></SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-white/50 backdrop-blur-xl">
                                                            <SelectItem value="none">None (Self-Approval)</SelectItem>
                                                            <SelectItem value="manager">Reporting Manager</SelectItem>
                                                            <SelectItem value="hr">HR Manager</SelectItem>
                                                            <SelectItem value="head">Department Head</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <Separator className="bg-slate-50" />

                                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                <div className="space-y-0.5">
                                                    <Label className="text-sm font-black text-slate-900">Allow "Reopen Stage"</Label>
                                                    <p className="text-[10px] font-medium text-slate-500">Enable retro-active edits by Admins</p>
                                                </div>
                                                <Switch
                                                    checked={stageConfigs[activeStage]?.allowReopen ?? true}
                                                    onCheckedChange={(v) => updateStageConfig(activeStage, { ...stageConfigs[activeStage], allowReopen: v })}
                                                    className="data-[state=checked]:bg-indigo-600"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* 2. SLA & Escalation */}
                                    <div className="space-y-8">
                                        <Card className="border-none shadow-xl rounded-[40px] bg-white/80 backdrop-blur-2xl overflow-hidden border border-white/50 relative group">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500/50 group-hover:w-4 transition-all" />
                                            <CardHeader>
                                                <CardTitle className="flex items-center text-lg font-black text-slate-900 tracking-tight">
                                                    <Clock className="w-5 h-5 mr-3 text-amber-500" />
                                                    SLA & Scheduling
                                                </CardTitle>
                                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timelines & Reminders</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-8">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="col-span-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Schedule Offset (Days after Joining)</Label>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <Input
                                                                type="number"
                                                                value={stageConfigs[activeStage]?.scheduleOffset || 30}
                                                                onChange={(e) => updateStageConfig(activeStage, { ...stageConfigs[activeStage], scheduleOffset: e.target.value })}
                                                                className="h-12 rounded-2xl bg-white border-slate-100 shadow-sm font-black text-lg w-full"
                                                            />
                                                            <div className="h-12 px-4 rounded-2xl bg-slate-100 flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                                                Days from Join
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-2">Determines the expected date for this review.</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">SLA Limit (Days)</Label>
                                                        <Input
                                                            type="number"
                                                            value={stageConfigs[activeStage]?.slaLimit || 7}
                                                            onChange={(e) => updateStageConfig(activeStage, { ...stageConfigs[activeStage], slaLimit: e.target.value })}
                                                            className="h-12 rounded-2xl bg-white border-slate-100 shadow-sm font-black text-lg"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Frequency</Label>
                                                        <Select
                                                            value={stageConfigs[activeStage]?.slaFrequency || 'daily'}
                                                            onValueChange={(v) => updateStageConfig(activeStage, { ...stageConfigs[activeStage], slaFrequency: v })}
                                                        >
                                                            <SelectTrigger className="h-12 rounded-2xl bg-white/60 border-slate-100 shadow-sm"><SelectValue /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-white/50 backdrop-blur-xl">
                                                                <SelectItem value="daily">Daily</SelectItem>
                                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                                <SelectItem value="once">Once</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>


                                        {/* 3. Notifications */}
                                        <Card className="border-none shadow-xl rounded-[40px] bg-white/80 backdrop-blur-2xl overflow-hidden border border-white/50 relative group">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/50 group-hover:w-4 transition-all" />
                                            <CardHeader>
                                                <CardTitle className="flex items-center text-lg font-black text-slate-900 tracking-tight">
                                                    <Users className="w-5 h-5 mr-3 text-blue-500" />
                                                    Notifications
                                                </CardTitle>
                                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Triggers & Alerts</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {[
                                                    { id: 'notifyStart', label: 'Email on Start', sub: 'Notify owner when stage activates', color: 'blue' },
                                                    { id: 'notifySuccess', label: 'Email on Success', sub: 'Notify team on completion', color: 'emerald' },
                                                    { id: 'notifySMS', label: 'SMS Alerts', sub: 'For critical overdue escalations', color: 'rose' }
                                                ].map((mod, i) => (
                                                    <div key={mod.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
                                                        <div className="space-y-0.5">
                                                            <Label className="text-sm font-black text-slate-900">{mod.label}</Label>
                                                            <p className="text-[10px] font-medium text-slate-500">{mod.sub}</p>
                                                        </div>
                                                        <Switch
                                                            checked={stageConfigs[activeStage]?.notifications?.[mod.id] ?? (i < 2)}
                                                            onCheckedChange={(v) => {
                                                                const currentNoitfs = stageConfigs[activeStage]?.notifications || {};
                                                                updateStageConfig(activeStage, {
                                                                    ...stageConfigs[activeStage],
                                                                    notifications: { ...currentNoitfs, [mod.id]: v }
                                                                });
                                                            }}
                                                            className={`data-[state=checked]:bg-${mod.color}-600`}
                                                        />
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* CONTENT DESIGNER SECTION */}
                                <div className="space-y-8 mt-10">
                                    <div className="flex items-center justify-between px-2">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Stage Designer</h2>
                                            <p className="text-xs font-medium text-slate-500">Define the input fields and requirements for this specific milestone</p>
                                        </div>
                                    </div>

                                    {stageDefinitions.map((s: any) => s.id).includes(activeStage) && (
                                        <Card className="border-none shadow-2xl rounded-[40px] bg-white/90 backdrop-blur-2xl overflow-hidden border border-white/50 relative group p-8">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-32 -mt-32 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
                                            <div className="relative z-10 space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                                                            <Target className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            {activeStage !== 'general' ? (
                                                                <div className="group/edit flex items-center gap-2">
                                                                    <Input
                                                                        className="text-xl font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full hover:bg-slate-50 transition-colors rounded-lg px-2 -ml-2 h-auto"
                                                                        value={stageDefinitions.find((s: any) => s.id === activeStage)?.label || ''}
                                                                        onChange={(e) => updateStageDefinition(activeStage, { label: e.target.value })}
                                                                    />
                                                                    <div className="flex items-center gap-1 opacity-0 group-hover/edit:opacity-100 transition-opacity focus-within:opacity-100">
                                                                        {/* Color Picker Trigger */}
                                                                        <Select
                                                                            value={stageDefinitions.find((s: any) => s.id === activeStage)?.color || 'indigo'}
                                                                            onValueChange={(v) => updateStageDefinition(activeStage, { color: v })}
                                                                        >
                                                                            <SelectTrigger className="h-8 w-8 p-0 border-none bg-transparent hover:bg-slate-100 rounded-full flex items-center justify-center">
                                                                                <div className={`w-4 h-4 rounded-full bg-${stageDefinitions.find((s: any) => s.id === activeStage)?.color || 'indigo'}-500`} />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {['indigo', 'blue', 'emerald', 'amber', 'rose', 'slate', 'violet', 'orange'].map(c => (
                                                                                    <SelectItem key={c} value={c}>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div className={`w-3 h-3 rounded-full bg-${c}-500`} />
                                                                                            <span className="capitalize">{c}</span>
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>

                                                                        {/* Icon Picker Trigger */}
                                                                        <Select
                                                                            value={stageDefinitions.find((s: any) => s.id === activeStage)?.icon || 'Target'}
                                                                            onValueChange={(v) => updateStageDefinition(activeStage, { icon: v })}
                                                                        >
                                                                            <SelectTrigger className="h-8 w-8 p-0 border-none bg-transparent hover:bg-slate-100 rounded-full flex items-center justify-center">
                                                                                {React.createElement(getIcon(stageDefinitions.find((s: any) => s.id === activeStage)?.icon || 'Target') as any, { className: "w-4 h-4 text-slate-500" })}
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {['Target', 'Clock', 'Users', 'Shield', 'AlertTriangle', 'CheckCircle', 'Plus', 'Settings'].map(icon => (
                                                                                    <SelectItem key={icon} value={icon}>
                                                                                        <div className="flex items-center gap-2">
                                                                                            {React.createElement(getIcon(icon) as any, { className: "w-4 h-4" })}
                                                                                            <span>{icon}</span>
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>

                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-full"
                                                                            onClick={() => handleDeleteStage(activeStage)}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <h3 className="text-xl font-black text-slate-900">{stageDefinitions.find((s: any) => s.id === activeStage)?.label || 'Stage'} Designer</h3>
                                                            )}
                                                            {activeStage !== 'general' ? (
                                                                <input
                                                                    className="text-xs font-medium text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                                                                    value={stageDefinitions.find((s: any) => s.id === activeStage)?.description || ''}
                                                                    onChange={(e) => updateStageDefinition(activeStage, { description: e.target.value })}
                                                                />
                                                            ) : (
                                                                <p className="text-xs font-medium text-slate-500">Configure parameters and evaluation points</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            const newPoint = { id: Date.now().toString(), title: 'New Target', weight: '10', type: 'rating' };
                                                            const current = stageConfigs[activeStage] || { points: [] };
                                                            updateStageConfig(activeStage, { ...current, points: [...(current.points || []), newPoint] });
                                                        }}
                                                        variant="outline"
                                                        className="rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" /> ADD PARAMETER
                                                    </Button>
                                                </div>

                                                <div className="grid gap-4">
                                                    {(stageConfigs[activeStage]?.points || []).map((point: any, i: number) => (
                                                        <div key={point.id} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm hover:shadow-md transition-all group/item">
                                                            <div className="flex items-center gap-6 flex-1">
                                                                <div className="cursor-grab active:cursor-grabbing text-slate-200 hover:text-slate-400 transition-colors">
                                                                    <GripVertical className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <input
                                                                        className="text-sm font-black text-slate-900 bg-transparent border-none outline-none w-full focus:ring-0"
                                                                        value={point.title}
                                                                        onChange={(e) => {
                                                                            const newPoints = [...(stageConfigs[activeStage].points || [])];
                                                                            newPoints[i].title = e.target.value;
                                                                            updateStageConfig(activeStage, { ...stageConfigs[activeStage], points: newPoints });
                                                                        }}
                                                                        placeholder="Enter parameter title..."
                                                                    />
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        <Select
                                                                            value={point.type}
                                                                            onValueChange={(v) => {
                                                                                const newPoints = [...(stageConfigs[activeStage].points || [])];
                                                                                newPoints[i].type = v;
                                                                                updateStageConfig(activeStage, { ...stageConfigs[activeStage], points: newPoints });
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="h-6 w-24 rounded-lg bg-indigo-50 border-none text-indigo-600 text-[9px] font-black uppercase"><SelectValue /></SelectTrigger>
                                                                            <SelectContent className="rounded-xl border-none shadow-xl">
                                                                                <SelectItem value="rating">Rating (1-5)</SelectItem>
                                                                                <SelectItem value="boolean">Yes/No</SelectItem>
                                                                                <SelectItem value="text">Text Input</SelectItem>
                                                                                <SelectItem value="scale">Scale (1-10)</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Weight:</span>
                                                                            <input
                                                                                type="number"
                                                                                className="w-10 text-[10px] font-bold text-slate-900 bg-slate-50 border border-slate-100 rounded px-1"
                                                                                value={point.weight}
                                                                                onChange={(e) => {
                                                                                    const newPoints = [...(stageConfigs[activeStage].points || [])];
                                                                                    newPoints[i].weight = e.target.value;
                                                                                    updateStageConfig(activeStage, { ...stageConfigs[activeStage], points: newPoints });
                                                                                }}
                                                                            />
                                                                            <span className="text-[10px] font-bold text-slate-400 leading-none">%</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-xl hover:bg-rose-50 text-rose-500"
                                                                    onClick={() => {
                                                                        const newPoints = stageConfigs['kpi'].points.filter((_: any, idx: number) => idx !== i);
                                                                        updateStageConfig('kpi', { ...stageConfigs['kpi'], points: newPoints });
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                    )}

                                    {(activeStage === '30_day' || activeStage === '60_day' || activeStage === '90_day') && (
                                        <Card className="border-none shadow-2xl rounded-[40px] bg-white/90 backdrop-blur-2xl overflow-hidden border border-white/50 relative group p-8">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />
                                            <div className="relative z-10 space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                                                            <MessageSquare className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black text-slate-900">Feedback Designer</h3>
                                                            <p className="text-xs font-medium text-slate-500">Build the questionnaire for this review milestone</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            const newPoint = { id: Date.now().toString(), title: "New Question?", sub: "Observation detail", type: "scale" };
                                                            const current = stageConfigs['feedback'] || { points: [] };
                                                            updateStageConfig('feedback', { ...current, points: [...current.points, newPoint] });
                                                        }}
                                                        variant="outline"
                                                        className="rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" /> ADD QUESTION
                                                    </Button>
                                                </div>

                                                <div className="grid gap-4">
                                                    {(stageConfigs['feedback']?.points || []).map((q: any, i: number) => (
                                                        <div key={q.id} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm hover:shadow-md transition-all group/item">
                                                            <div className="flex items-center gap-6 flex-1">
                                                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 group-hover/item:text-blue-600 group-hover/item:bg-blue-50 transition-all">
                                                                    <ListOrdered className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <input
                                                                        className="text-sm font-black text-slate-900 bg-transparent border-none outline-none w-full focus:ring-0"
                                                                        value={q.title}
                                                                        onChange={(e) => {
                                                                            const newPoints = [...stageConfigs['feedback'].points];
                                                                            newPoints[i].title = e.target.value;
                                                                            updateStageConfig('feedback', { ...stageConfigs['feedback'], points: newPoints });
                                                                        }}
                                                                    />
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        <Select
                                                                            value={q.type}
                                                                            onValueChange={(v) => {
                                                                                const newPoints = [...stageConfigs['feedback'].points];
                                                                                newPoints[i].type = v;
                                                                                updateStageConfig('feedback', { ...stageConfigs['feedback'], points: newPoints });
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="h-6 w-24 rounded-lg bg-blue-50 border-none text-blue-600 text-[9px] font-black uppercase"><SelectValue /></SelectTrigger>
                                                                            <SelectContent className="rounded-xl border-none shadow-xl"><SelectItem value="scale">Scale (1-5)</SelectItem><SelectItem value="text">Text Area</SelectItem></SelectContent>
                                                                        </Select>
                                                                        <input
                                                                            className="text-[10px] font-bold text-slate-400 bg-transparent border-none outline-none w-full focus:ring-0"
                                                                            value={q.sub}
                                                                            onChange={(e) => {
                                                                                const newPoints = [...stageConfigs['feedback'].points];
                                                                                newPoints[i].sub = e.target.value;
                                                                                updateStageConfig('feedback', { ...stageConfigs['feedback'], points: newPoints });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-xl hover:bg-rose-50 text-rose-500"
                                                                    onClick={() => {
                                                                        const newPoints = stageConfigs['feedback'].points.filter((_: any, idx: number) => idx !== i);
                                                                        updateStageConfig('feedback', { ...stageConfigs['feedback'], points: newPoints });
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                    )}

                                    {/* Decision Matrix */}
                                    {activeStage === 'decision' && (
                                        <Card className="border-none shadow-2xl rounded-[40px] bg-white/90 backdrop-blur-2xl overflow-hidden border border-white/50 relative group p-8">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />
                                            <div className="relative z-10 space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-100">
                                                            <AlertTriangle className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black text-slate-900">Decision Framework</h3>
                                                            <p className="text-xs font-medium text-slate-500">Configure final outcomes and authorization gates</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-6">
                                                    {[
                                                        { id: 'confirmed', label: 'Confirmed', sub: 'Permanent appointment', color: 'bg-emerald-500', ring: 'ring-emerald-100', border: 'border-emerald-500', bgSoft: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-600' },
                                                        { id: 'extended', label: 'Extended', sub: 'Specify extra duration', color: 'bg-amber-500', ring: 'ring-amber-100', border: 'border-amber-500', bgSoft: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-600' },
                                                        { id: 'terminated', label: 'Terminated', sub: 'Subject to HR legal', color: 'bg-rose-500', ring: 'ring-rose-100', border: 'border-rose-500', bgSoft: 'bg-rose-50', text: 'text-rose-600', iconBg: 'bg-rose-600' }
                                                    ].map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            onClick={() => updateStageConfig('decision', { ...stageConfigs['decision'], selectedOutcome: opt.id })}
                                                            className={`p-8 bg-white border rounded-[32px] shadow-sm hover:shadow-xl transition-all group/item text-center relative overflow-hidden cursor-pointer
                                                                ${stageConfigs['decision']?.selectedOutcome === opt.id ? `${opt.border} ring-2 ${opt.ring}` : 'border-slate-100 hover:border-slate-300'}`}
                                                        >
                                                            <div className={`absolute top-0 left-0 w-full h-1 ${opt.color} opacity-50`} />
                                                            <div className={`w-14 h-14 rounded-2xl ${opt.bgSoft} ${opt.text} flex items-center justify-center mx-auto mb-4 group-hover/item:scale-110 transition-transform shadow-sm
                                                                ${stageConfigs['decision']?.selectedOutcome === opt.id ? `${opt.iconBg} text-white` : ''}`}>
                                                                <CheckCircle className="w-7 h-7" />
                                                            </div>
                                                            <div className="text-base font-black text-slate-900 mb-1">{opt.label}</div>
                                                            <p className="text-[10px] font-medium text-slate-500 leading-tight uppercase tracking-widest">{opt.sub}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 space-y-8 relative overflow-hidden">
                                                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-0" />
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] text-center relative z-10 bg-slate-50/50 w-fit mx-auto px-4">Approval Sequence</h4>
                                                    <div className="flex items-center justify-between gap-4 relative z-10 px-10">
                                                        {[
                                                            { id: 'hod', label: 'HOD Gate', step: 1 },
                                                            { id: 'hr', label: 'HR Gate', step: 2 },
                                                            { id: 'principal', label: 'Principal', step: 3 }
                                                        ].map((gate) => (
                                                            <div
                                                                key={gate.id}
                                                                onClick={() => {
                                                                    const currentGates = stageConfigs['decision']?.approvalGates || ['hod', 'hr'];
                                                                    const newGates = currentGates.includes(gate.id)
                                                                        ? currentGates.filter((g: string) => g !== gate.id)
                                                                        : [...currentGates, gate.id];
                                                                    updateStageConfig('decision', { ...stageConfigs['decision'], approvalGates: newGates });
                                                                }}
                                                                className="flex flex-col items-center gap-4 group/gate cursor-pointer"
                                                            >
                                                                <div className={`w-16 h-16 rounded-full bg-white border-2 flex items-center justify-center font-black shadow-xl transition-all group-hover/gate:scale-110
                                                                    ${(stageConfigs['decision']?.approvalGates || ['hod', 'hr']).includes(gate.id)
                                                                        ? 'border-indigo-600 text-indigo-600 shadow-indigo-100'
                                                                        : 'border-slate-200 text-slate-300 shadow-none'}`}>
                                                                    {gate.step}
                                                                </div>
                                                                <span className={`text-[10px] font-black uppercase tracking-widest
                                                                    ${(stageConfigs['decision']?.approvalGates || ['hod', 'hr']).includes(gate.id)
                                                                        ? 'text-slate-600' : 'text-slate-300 italic'}`}>
                                                                    {gate.label}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                </div>

                                {/* Escalation Path - Bottom Banner */}
                                <div className="p-8 rounded-[40px] bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-2xl shadow-rose-100 relative overflow-hidden group mt-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-black tracking-tight mb-6 flex items-center">
                                            <AlertTriangle className="w-6 h-6 mr-3" />
                                            CRITICAL ESCALATION PATH
                                        </h3>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                                <span className="font-bold text-sm tracking-tight">Escalate to L2 Manager after</span>
                                                <div className="flex items-center gap-3">
                                                    <Input type="number" className="w-16 h-10 bg-white/20 border-white/30 text-center font-black rounded-xl" defaultValue={3} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Days</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                                <span className="font-bold text-sm tracking-tight">Notify HR Head after</span>
                                                <div className="flex items-center gap-3">
                                                    <Input type="number" className="w-16 h-10 bg-white/20 border-white/30 text-center font-black rounded-xl" defaultValue={5} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Days</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProbationConfig;
