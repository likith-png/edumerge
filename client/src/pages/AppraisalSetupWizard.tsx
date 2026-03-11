import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
    CheckCircle, Calendar, Settings, Star, Rocket,
    ArrowRight, ArrowLeft, Target, TrendingUp, Users, Award
} from 'lucide-react';
import {
    createCycle, validateWeightages, validatePhases,
    DEFAULT_RATING_RULES, getCategories,
    type Phase, type Weightages, type RatingRules
} from '../services/cycleService';
import { usePersona } from '../contexts/PersonaContext';

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
        { id: 1, name: 'Cycle Basics', icon: Calendar },
        { id: 2, name: 'Workflow Phases', icon: Settings },
        { id: 3, name: 'Weightages', icon: Target },
        { id: 4, name: 'Rating Rules', icon: Star },
        { id: 5, name: 'Review & Launch', icon: Rocket }
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
        }
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
    };

    const handleLaunch = () => {
        if (!validateStep(5)) return;

        try {
            const newCycle = createCycle({
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

            console.log('Cycle created:', newCycle);

            // Show success and redirect
            alert('🎉 Appraisal cycle created successfully!');
            navigate('/appraisal');
        } catch (error) {
            console.error('Error creating cycle:', error);
            alert('Error creating cycle. Please try again.');
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cycle Name <span className="text-red-500">*</span>
                </label>
                <Input
                    placeholder="e.g., Academic Year 2024-25"
                    value={cycleData.name}
                    onChange={(e) => setCycleData({ ...cycleData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="date"
                        value={cycleData.startDate}
                        onChange={(e) => setCycleData({ ...cycleData, startDate: e.target.value })}
                        className={errors.startDate ? 'border-red-500' : ''}
                    />
                    {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="date"
                        value={cycleData.endDate}
                        onChange={(e) => setCycleData({ ...cycleData, endDate: e.target.value })}
                        className={errors.endDate ? 'border-red-500' : ''}
                    />
                    {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description of this appraisal cycle..."
                    value={cycleData.description}
                    onChange={(e) => setCycleData({ ...cycleData, description: e.target.value })}
                />
            </div>

            {/* Stage Configuration Selection */}
            <div className="pt-4 border-t border-slate-200 mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Stage Configuration <span className="text-slate-500 font-normal">(Select which modules to include in this cycle)</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: 'kra', label: 'Key Result Areas (KRA)', icon: Target },
                        { id: 'kpi', label: 'Key Performance Indicators (KPI)', icon: TrendingUp },
                        { id: 'feedback360', label: '360° Feedback (Student/Parent)', icon: Users },
                        { id: 'review', label: 'Final Review / HOD Review', icon: Award }
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
                                className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${isEnabled
                                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isEnabled ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                                    }`}>
                                    {isEnabled && <CheckCircle className="w-3 h-3" />}
                                </div>
                                <stage.icon className={`w-5 h-5 ${isEnabled ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span className="font-medium text-sm">{stage.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
                Define the timeline for each workflow phase. Phases must be sequential with no overlaps.
            </p>
            {errors.phases && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-4">
                    {errors.phases}
                </div>
            )}
            {phases.map((phase, idx) => (
                <Card key={phase.id} className="border-slate-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                                {phase.id}
                            </div>
                            <h4 className="font-semibold text-slate-900">{phase.name}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                                <Input
                                    type="date"
                                    value={phase.startDate}
                                    onChange={(e) => {
                                        const updated = [...phases];
                                        updated[idx].startDate = e.target.value;
                                        setPhases(updated);
                                    }}
                                    className={errors[`phase${idx}Start`] ? 'border-red-500' : ''}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-600 mb-1">End Date</label>
                                <Input
                                    type="date"
                                    value={phase.endDate}
                                    onChange={(e) => {
                                        const updated = [...phases];
                                        updated[idx].endDate = e.target.value;
                                        setPhases(updated);
                                    }}
                                    className={errors[`phase${idx}End`] ? 'border-red-500' : ''}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderStep3 = () => {
        const categories = getCategories();

        return (
            <div className="space-y-6">
                <p className="text-sm text-slate-600">
                    Set the weightage for each performance component. Total must equal 100%.
                </p>

                {errors.weightages && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        {errors.weightages}
                    </div>
                )}

                <div className="space-y-4">
                    {categories.map((cat) => {
                        // Determine if this category should be shown based on enabled stages
                        let isCategoryEnabled = true;
                        if (cat === 'Academic' && !cycleData.enabledStages.kra) isCategoryEnabled = false;
                        if (cat === 'Professional Conduct' && !cycleData.enabledStages.kpi) isCategoryEnabled = false;
                        if (cat === 'Learning & Development' && !cycleData.enabledStages.feedback360) isCategoryEnabled = false;
                        if (cat === 'Compliance' && !cycleData.enabledStages.review) isCategoryEnabled = false;

                        if (!isCategoryEnabled) return null;

                        return (
                            <div key={cat} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="font-semibold text-slate-900">{cat}</div>
                                    <div className="text-xs text-slate-600">Performance weightage for {cat}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={weightages[cat] || 0}
                                        onChange={(e) => setWeightages({
                                            ...weightages,
                                            [cat]: parseInt(e.target.value) || 0
                                        })}
                                        className="w-20 text-center"
                                    />
                                    <span className="text-slate-600">%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={`p-4 rounded-lg border-2 ${validateWeightages(weightages, cycleData.enabledStages) ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'
                    }`}>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Total Weightage:</span>
                        <span className={`text-2xl font-bold ${validateWeightages(weightages, cycleData.enabledStages) ? 'text-green-700' : 'text-amber-700'
                            }`}>
                            {Object.entries(weightages).reduce((sum, [cat, val]) => {
                                let isEnabled = true;
                                if (cat === 'Academic' && !cycleData.enabledStages.kra) isEnabled = false;
                                if (cat === 'Professional Conduct' && !cycleData.enabledStages.kpi) isEnabled = false;
                                if (cat === 'Learning & Development' && !cycleData.enabledStages.feedback360) isEnabled = false;
                                if (cat === 'Compliance' && !cycleData.enabledStages.review) isEnabled = false;
                                return isEnabled ? sum + val : sum;
                            }, 0)}%
                        </span>
                    </div>
                    {validateWeightages(weightages, cycleData.enabledStages) && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-green-700">
                            <CheckCircle className="h-4 w-4" />
                            <span>Perfect! Weightages are balanced.</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderStep4 = () => (
        <div className="space-y-6">
            <p className="text-sm text-slate-600">
                Define minimum thresholds for each rating band. Higher bands require higher thresholds.
            </p>

            {(['outstanding', 'excellent', 'good', 'satisfactory'] as const).map((band) => (
                <Card key={band} className="border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base capitalize">{band}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <label className="text-slate-600">Pass Rate (%)</label>
                                <Input
                                    type="number"
                                    value={ratingRules[band].passPercentage}
                                    onChange={(e) => setRatingRules({
                                        ...ratingRules,
                                        [band]: { ...ratingRules[band], passPercentage: parseInt(e.target.value) || 0 }
                                    })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-slate-600">Attendance (%)</label>
                                <Input
                                    type="number"
                                    value={ratingRules[band].attendance}
                                    onChange={(e) => setRatingRules({
                                        ...ratingRules,
                                        [band]: { ...ratingRules[band], attendance: parseInt(e.target.value) || 0 }
                                    })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-slate-600">Feedback (out of 5)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={ratingRules[band].feedback}
                                    onChange={(e) => setRatingRules({
                                        ...ratingRules,
                                        [band]: { ...ratingRules[band], feedback: parseFloat(e.target.value) || 0 }
                                    })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-slate-600">Training Courses</label>
                                <Input
                                    type="number"
                                    value={ratingRules[band].trainingCourses}
                                    onChange={(e) => setRatingRules({
                                        ...ratingRules,
                                        [band]: { ...ratingRules[band], trainingCourses: parseInt(e.target.value) || 0 }
                                    })}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Review Your Configuration</h3>
                <p className="text-sm text-blue-800">
                    Please review all settings before launching the cycle. You can go back to make changes.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Cycle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Name:</span>
                        <span className="font-semibold">{cycleData.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-semibold">{cycleData.startDate} to {cycleData.endDate}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Workflow Phases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {phases.map((phase) => (
                        <div key={phase.id} className="flex justify-between">
                            <span className="text-slate-600">{phase.id}. {phase.name}:</span>
                            <span className="font-semibold">{phase.startDate} to {phase.endDate}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Weightages</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(weightages).map(([cat, weight]) => (
                            <div key={cat}>{cat}: <strong>{weight}%</strong></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, idx) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                                        ${currentStep > step.id ? 'bg-green-600 text-white' :
                                            currentStep === step.id ? 'bg-blue-600 text-white shadow-lg scale-110' :
                                                'bg-slate-200 text-slate-400'}
                                    `}>
                                        {currentStep > step.id ? (
                                            <CheckCircle className="h-6 w-6" />
                                        ) : (
                                            <step.icon className="h-6 w-6" />
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium text-center ${currentStep === step.id ? 'text-blue-900' : 'text-slate-600'
                                        }`}>
                                        {step.name}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 mb-8 ${currentStep > step.id ? 'bg-green-600' : 'bg-slate-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Main Card */}
                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <CardTitle className="flex items-center gap-2">
                            {React.createElement(steps[currentStep - 1].icon, { className: "h-6 w-6" })}
                            {steps[currentStep - 1].name}
                            <Badge className="ml-auto bg-white text-blue-900">
                                Step {currentStep} of 5
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 min-h-[400px]">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                        {currentStep === 5 && renderStep5()}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>

                    {currentStep < 5 ? (
                        <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleLaunch}
                            className="bg-green-600 hover:bg-green-700 gap-2"
                        >
                            <Rocket className="h-4 w-4" />
                            Launch Cycle!
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppraisalSetupWizard;
