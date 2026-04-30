import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    CheckCircle, Calendar, Settings, Star, Rocket,
    ArrowRight, ArrowLeft, Target, TrendingUp, Users, Award,
    CheckCircle2, AlertCircle, Info, Activity, History,
    Eye, Trash2, XCircle, ShieldCheck,
    ChevronRight, LayoutGrid, Clock, Sparkles, Plus
} from 'lucide-react';
import {
    createCycle, validateWeightages, validatePhases,
    DEFAULT_RATING_RULES, getCategories,
    type Phase, type Weightages, type RatingRules
} from '../services/cycleService';
import { usePersona } from '../contexts/PersonaContext';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <label className={`text-sm font-bold text-slate-700 block mb-2 ${className}`}>
        {children}
    </label>
);

const AppraisalSetupWizard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = usePersona();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Form data
    const [cycleData, setCycleData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        enabledStages: {
            kra: true,
            kpi: true,
            feedback360: true,
            review: true
        }
    });

    const [phases, setPhases] = useState<Phase[]>([
        { id: 1, name: 'Goal Setting', startDate: '', endDate: '', icon: 'Target' },
        { id: 2, name: 'Performance Tracking', startDate: '', endDate: '', icon: 'TrendingUp' },
        { id: 3, name: 'Mid-Year Review', startDate: '', endDate: '', icon: 'Calendar' },
        { id: 4, name: '360° Feedback', startDate: '', endDate: '', icon: 'Users' },
        { id: 5, name: 'Final Review', startDate: '', endDate: '', icon: 'Award' }
    ]);

    const [weightages, setWeightages] = useState<Weightages>(() => {
        const cats = getCategories();
        const initial: Weightages = {};
        const baseWeight = Math.floor(100 / cats.length);
        cats.forEach((cat, idx) => {
            initial[cat] = idx === cats.length - 1 ? 100 - (baseWeight * (cats.length - 1)) : baseWeight;
        });
        return initial;
    });
    const [ratingRules, setRatingRules] = useState<RatingRules>(DEFAULT_RATING_RULES);

    const steps = [
        { id: 1, name: 'Basics', icon: Calendar, description: 'Cycle Identity' },
        { id: 2, name: 'Timeline', icon: Settings, description: 'Workflow Phases' },
        { id: 3, name: 'Weightages', icon: Target, description: 'Value Distribution' },
        { id: 4, name: 'Rules', icon: Star, description: 'Rating Matrix' },
        { id: 5, name: 'Launch', icon: Rocket, description: 'Final Review' }
    ];

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!cycleData.name) newErrors.name = 'Cycle name is required';
            if (!cycleData.startDate) newErrors.startDate = 'Start date is required';
            if (!cycleData.endDate) newErrors.endDate = 'End date is required';
            if (cycleData.startDate && cycleData.endDate && cycleData.endDate <= cycleData.startDate) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        if (step === 2) {
            const phaseValidation = validatePhases(phases);
            if (!phaseValidation.valid) {
                newErrors.phases = phaseValidation.error || 'Invalid phase configuration';
            }
            phases.forEach((phase, idx) => {
                if (!phase.startDate) newErrors[`phase${idx}Start`] = 'Start date required';
                if (!phase.endDate) newErrors[`phase${idx}End`] = 'End date required';
            });
        }

        if (step === 3) {
            if (!validateWeightages(weightages, cycleData.enabledStages)) {
                newErrors.weightages = 'Weightages of enabled stages must sum to exactly 100%';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLaunch = () => {
        if (!validateStep(5)) return;

        try {
            createCycle({
                name: cycleData.name,
                startDate: cycleData.startDate,
                endDate: cycleData.endDate,
                description: cycleData.description,
                enabledStages: cycleData.enabledStages,
                phases,
                weightages,
                ratingRules,
                createdBy: user?.id || 'admin'
            });

            alert('Appraisal cycle successfully initialized!');
            navigate('/appraisal');
        } catch (error) {
            console.error('Error creating cycle:', error);
            alert('Error creating cycle. Please try again.');
        }
    };

    const renderStep1 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                    <Label>Cycle Name</Label>
                    <Input
                        placeholder="e.g., Performance Review 2024-25"
                        value={cycleData.name}
                        onChange={(e) => setCycleData({ ...cycleData, name: e.target.value })}
                        className={`h-12 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                            type="date"
                            value={cycleData.startDate}
                            onChange={(e) => setCycleData({ ...cycleData, startDate: e.target.value })}
                            className={`h-12 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.startDate ? 'border-red-500' : ''}`}
                        />
                        {errors.startDate && <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">{errors.startDate}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                            type="date"
                            value={cycleData.endDate}
                            onChange={(e) => setCycleData({ ...cycleData, endDate: e.target.value })}
                            className={`h-12 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.endDate ? 'border-red-500' : ''}`}
                        />
                        {errors.endDate && <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">{errors.endDate}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Cycle Description</Label>
                    <textarea
                        className="w-full min-h-[120px] bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none outline-none"
                        placeholder="Briefly describe the objectives and guidelines for this appraisal cycle..."
                        value={cycleData.description}
                        onChange={(e) => setCycleData({ ...cycleData, description: e.target.value })}
                    />
                </div>
            </div>

            {/* Stage Configuration Selection */}
            <div className="pt-8 border-t border-slate-200">
                <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-900">Appraisal Modules</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Select the components to include in this cycle</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { id: 'kra', label: 'Key Result Areas (KRA)', desc: 'Strategic goal mapping for faculties', icon: Target },
                        { id: 'kpi', label: 'Performance Indicators (KPI)', desc: 'Measurable quantitative performance tracking', icon: TrendingUp },
                        { id: 'feedback360', label: '360° Feedback', desc: 'Peer, subordinate, and superior reviews', icon: Users },
                        { id: 'review', label: 'Final Review', desc: 'Administrative and HOD approval workflow', icon: Award }
                    ].map((stage) => {
                        const isEnabled = cycleData.enabledStages[stage.id as keyof typeof cycleData.enabledStages];
                        return (
                            <div
                                key={stage.id}
                                onClick={() => {
                                    setCycleData({
                                        ...cycleData,
                                        enabledStages: {
                                            ...cycleData.enabledStages,
                                            [stage.id]: !isEnabled
                                        }
                                    });
                                }}
                                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-5
                                    ${isEnabled 
                                        ? 'border-indigo-600 bg-indigo-50/50' 
                                        : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all bg-white border border-slate-200 shadow-sm
                                    ${isEnabled ? 'text-indigo-600 border-indigo-200' : 'text-slate-400'}`}>
                                    <stage.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-xs font-bold tracking-tight ${isEnabled ? 'text-indigo-900' : 'text-slate-700'}`}>{stage.label}</h4>
                                    <p className="text-[10px] text-slate-500 font-medium">{stage.desc}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                    ${isEnabled ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 bg-white'}`}>
                                    {isEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-4">
                <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="space-y-1">
                    <p className="font-bold text-indigo-950 text-xs">Timeline Guidelines</p>
                    <p className="text-[10px] text-indigo-600 font-medium leading-relaxed">Ensure all phases follow a logical chronological order without overlaps. Dates will be validated against the cycle's overall timeline.</p>
                </div>
            </div>

            {errors.phases && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phases}
                </div>
            )}

            <div className="space-y-6 relative pl-8 border-l-2 border-slate-100">
                {phases.map((phase, idx) => (
                    <div key={phase.id} className="relative group">
                        <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold text-sm shadow-sm z-10 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                            {phase.id}
                        </div>
                        
                        <Card className="border border-slate-200 shadow-sm hover:border-indigo-200 transition-all overflow-hidden rounded-xl bg-white">
                            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                        <Activity className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{phase.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SOP Phase {idx + 1}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start</p>
                                        <Input
                                            type="date"
                                            value={phase.startDate}
                                            onChange={(e) => {
                                                const updated = [...phases];
                                                updated[idx].startDate = e.target.value;
                                                setPhases(updated);
                                            }}
                                            className={`h-10 w-40 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 ${errors[`phase${idx}Start`] ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    <div className="w-px h-8 bg-slate-100 mt-4" />
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">End</p>
                                        <Input
                                            type="date"
                                            value={phase.endDate}
                                            onChange={(e) => {
                                                const updated = [...phases];
                                                updated[idx].endDate = e.target.value;
                                                setPhases(updated);
                                            }}
                                            className={`h-10 w-40 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 ${errors[`phase${idx}End`] ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep3 = () => {
        const categories = getCategories();
        const totalWeightage = Object.entries(weightages).reduce((sum, [cat, val]) => {
            let isEnabled = true;
            if (cat === 'Academic' && !cycleData.enabledStages.kra) isEnabled = false;
            if (cat === 'Professional Conduct' && !cycleData.enabledStages.kpi) isEnabled = false;
            if (cat === 'Learning & Development' && !cycleData.enabledStages.feedback360) isEnabled = false;
            if (cat === 'Compliance' && !cycleData.enabledStages.review) isEnabled = false;
            return isEnabled ? sum + val : sum;
        }, 0);

        return (
            <div className="space-y-10 animate-in zoom-in-95 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        {categories.map((cat, idx) => {
                            let isCategoryEnabled = true;
                            if (cat === 'Academic' && !cycleData.enabledStages.kra) isCategoryEnabled = false;
                            if (cat === 'Professional Conduct' && !cycleData.enabledStages.kpi) isCategoryEnabled = false;
                            if (cat === 'Learning & Development' && !cycleData.enabledStages.feedback360) isCategoryEnabled = false;
                            if (cat === 'Compliance' && !cycleData.enabledStages.review) isCategoryEnabled = false;

                            if (!isCategoryEnabled) return null;

                            return (
                                <div key={cat} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Category {idx + 1}</p>
                                            <h4 className="text-sm font-bold text-slate-800 tracking-tight">{cat}</h4>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={weightages[cat] || 0}
                                                onChange={(e) => setWeightages({
                                                    ...weightages,
                                                    [cat]: parseInt(e.target.value) || 0
                                                })}
                                                className="w-20 h-10 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                                            />
                                            <span className="text-sm font-bold text-slate-400">%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${weightages[cat] || 0}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="space-y-10">
                        <Card className={`p-8 rounded-xl border-2 transition-all h-full flex flex-col justify-between items-center text-center
                            ${totalWeightage === 100 
                                ? 'bg-emerald-50 border-emerald-100' 
                                : 'bg-red-50 border-red-100'}`}>
                            
                            <div className="space-y-3">
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto shadow-sm transition-transform hover:scale-105
                                    ${totalWeightage === 100 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {totalWeightage === 100 ? <ShieldCheck className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Weightage Validation</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Allocated Distribution</p>
                            </div>

                            <div className="space-y-2">
                                <h1 className={`text-7xl font-bold tracking-tighter leading-none
                                    ${totalWeightage === 100 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {totalWeightage}%
                                </h1>
                                <p className={`text-[10px] font-bold uppercase tracking-widest
                                    ${totalWeightage === 100 ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {totalWeightage === 100 ? 'Config Verified' : 'Allocation Incomplete'}
                                </p>
                            </div>

                            {totalWeightage !== 100 && (
                                <div className="p-4 bg-white/80 border border-red-200 rounded-lg w-full text-[9px] font-medium text-red-900 leading-relaxed uppercase tracking-wider">
                                    The total weightage across all categories must equal exactly 100% to proceed with the cycle setup.
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep4 = () => (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(['outstanding', 'excellent', 'good', 'satisfactory'] as const).map((band, idx) => (
                    <Card key={band} className="border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden rounded-xl bg-white">
                        <CardHeader className="p-6 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-tight">{band}</CardTitle>
                            <Badge className="bg-white border-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-lg uppercase">Level 0{idx + 1}</Badge>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: 'Pass Score %', key: 'passPercentage', icon: Award },
                                    { label: 'Attendance %', key: 'attendance', icon: History },
                                    { label: 'Feedback (5.0)', key: 'feedback', icon: Star },
                                    { label: 'Courses req.', key: 'trainingCourses', icon: Activity }
                                ].map((field) => (
                                    <div key={field.key} className="space-y-2">
                                        <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            <field.icon className="w-3 h-3 text-indigo-500" />
                                            {field.label}
                                        </Label>
                                        <Input
                                            type="number"
                                            step={field.key === 'feedback' ? '0.1' : '1'}
                                            value={ratingRules[band][field.key as keyof typeof ratingRules[typeof band]]}
                                            onChange={(e) => setRatingRules({
                                                ...ratingRules,
                                                [band]: { ...ratingRules[band], [field.key]: parseFloat(e.target.value) || 0 }
                                            })}
                                            className="h-10 bg-white border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-10 animate-in zoom-in-95 duration-500">
            <div className="p-8 bg-indigo-900 rounded-xl border border-indigo-800 shadow-lg relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Configuration Complete</h2>
                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Verify the cycle parameters before final deployment</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-lg">
                        <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider leading-relaxed max-w-sm text-center md:text-left">Launching this cycle will activate performance monitoring and goal setting for all relevant stakeholders according to the defined timeline.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardHeader className="p-6 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-xs font-bold text-slate-600 uppercase tracking-widest">General Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {[
                            { label: 'Cycle Name', value: cycleData.name, icon: Target },
                            { label: 'Timeline', value: `${cycleData.startDate} to ${cycleData.endDate}`, icon: Calendar },
                            { label: 'Active Modules', value: `${Object.entries(cycleData.enabledStages).filter(([_, v]) => v).length} Modules Selected`, icon: LayoutGrid }
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><item.icon className="w-4 h-4" /></div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900">{item.value}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardHeader className="p-6 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-xs font-bold text-slate-600 uppercase tracking-widest">Weightage Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-2 gap-4">
                        {Object.entries(weightages).map(([cat, val], idx) => {
                            let isEnabled = true;
                                if (cat === 'Academic' && !cycleData.enabledStages.kra) isEnabled = false;
                                if (cat === 'Professional Conduct' && !cycleData.enabledStages.kpi) isEnabled = false;
                                if (cat === 'Learning & Development' && !cycleData.enabledStages.feedback360) isEnabled = false;
                                if (cat === 'Compliance' && !cycleData.enabledStages.review) isEnabled = false;
                                if (!isEnabled) return null;

                            return (
                                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center space-y-1">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{cat}</p>
                                    <h4 className="text-xl font-bold text-indigo-600">{val}%</h4>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <Layout
            title="Setup Appraisal Cycle"
            description="Configure the timeline, weightages, and rules for a new performance appraisal cycle."
            icon={Rocket}
            showHome
        >
            <div className="max-w-5xl mx-auto space-y-12 py-8">
                {/* Visual Progress Navigation */}
                <div className="flex items-center justify-between px-6 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-3 bg-slate-50 px-2 group">
                            <button
                                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all relative z-10 shadow-sm
                                    ${currentStep === step.id 
                                        ? 'bg-indigo-600 text-white border-indigo-600 scale-110 shadow-indigo-200' 
                                        : currentStep > step.id 
                                        ? 'bg-white text-emerald-600 border-emerald-500' 
                                        : 'bg-white text-slate-300 border-slate-200'}`}
                            >
                                {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                            </button>
                            <div className="text-center">
                                <h4 className={`text-[10px] font-bold uppercase tracking-widest ${currentStep === step.id ? 'text-indigo-600' : 'text-slate-400'}`}>{step.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Action Surface */}
                <Card className="border border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white animate-in zoom-in-95 duration-500">
                    <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                                {React.createElement(steps[currentStep - 1].icon, { className: "w-8 h-8" })}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{steps[currentStep - 1].name}</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 px-1">Step {currentStep} of 5 • {steps[currentStep - 1].description}</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 md:p-12 min-h-[400px]">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                        {currentStep === 5 && renderStep5()}
                    </CardContent>
                    
                    {/* Navigation persistent Toolbar */}
                    <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="h-12 px-8 rounded-lg font-bold uppercase text-[10px] tracking-widest border-slate-200 text-slate-500 hover:text-slate-900 transition-all disabled:opacity-30"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous Step
                        </Button>

                        <div className="flex gap-4 w-full sm:w-auto">
                            {currentStep < 5 ? (
                                <Button
                                    onClick={handleNext}
                                    className="h-12 px-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 transition-all w-full sm:w-auto"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleLaunch}
                                    className="h-12 px-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100 transition-all w-full sm:w-auto"
                                >
                                    <Rocket className="w-4 h-4 mr-2" />
                                    Launch Cycle
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

// Mock Icons for demonstration if not available
const ShieldAlert = (props: any) => <Activity {...props} />;
const StarIcon = (props: any) => <Activity {...props} />;

export default AppraisalSetupWizard;
