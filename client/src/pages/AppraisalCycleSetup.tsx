import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { Settings, Lock } from 'lucide-react';

const AppraisalCycleSetup: React.FC = () => {
    const [step, setStep] = useState(1);
    const [cycleData, setCycleData] = useState({
        academicYear: '2024-25',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        staffCategories: ['Teaching Staff', 'HOD', 'Principal', 'Non-Teaching Staff'] as string[],
        kraWeightage: 40,
        kpiWeightage: 30,
        feedback360Weightage: 20,
        complianceWeightage: 10,
        ratingScaleType: '1-5' as '1-5' | '1-10' | 'A-F',
        allowMidYearReview: true,
        enableNormalization: true,
        bellCurveEnforced: false,
        deadlines: {
            goalSetting: '2024-05-15',
            midReview: '2024-10-31',
            feedbackCollection: '2025-02-15',
            finalReview: '2025-03-15',
            calibration: '2025-03-25',
            approved: '2025-03-31'
        }
    });

    const totalWeightage = cycleData.kraWeightage + cycleData.kpiWeightage +
        cycleData.feedback360Weightage + cycleData.complianceWeightage;

    const handleWeightageChange = (field: string, value: number) => {
        setCycleData({ ...cycleData, [field]: value });
    };

    const toggleCategory = (category: string) => {
        const categories = cycleData.staffCategories.includes(category)
            ? cycleData.staffCategories.filter(c => c !== category)
            : [...cycleData.staffCategories, category];
        setCycleData({ ...cycleData, staffCategories: categories });
    };

    const handleActivate = () => {
        console.log('Activating cycle:', cycleData);
        alert('Appraisal Cycle Activated! Framework is now locked.');
    };

    const steps = [
        { id: 1, title: 'Basic Info', desc: 'Academic year & categories' },
        { id: 2, title: 'Weightage', desc: 'Configure scoring weights' },
        { id: 3, title: 'Rating Scale', desc: 'Define rating system' },
        { id: 4, title: 'Calendar', desc: 'Set phase deadlines' },
        { id: 5, title: 'Review & Activate', desc: 'Lock and activate' }
    ];

    return (
        <Layout
            title="Appraisal Cycle Setup"
            description="Configure and activate performance appraisal cycle"
            icon={Settings}
            showBack
        >
            {/* Progress Stepper */}
            <div className="mb-6 bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                    {steps.map((s, index) => (
                        <React.Fragment key={s.id}>
                            <div
                                className={`flex flex-col items-center ${s.id <= step ? 'cursor-pointer' : 'cursor-not-allowed'
                                    }`}
                                onClick={() => s.id <= step && setStep(s.id)}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${s.id < step
                                        ? 'bg-green-600 text-white'
                                        : s.id === step
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-200 text-slate-500'
                                        }`}
                                >
                                    {s.id}
                                </div>
                                <p className="text-xs font-medium mt-1">{s.title}</p>
                                <p className="text-[10px] text-slate-500">{s.desc}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 ${s.id < step ? 'bg-green-600' : 'bg-slate-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Academic Year*</Label>
                                <Input
                                    value={cycleData.academicYear}
                                    onChange={(e) => setCycleData({ ...cycleData, academicYear: e.target.value })}
                                    placeholder="2024-25"
                                />
                            </div>
                            <div>
                                <Label>Start Date*</Label>
                                <Input
                                    type="date"
                                    value={cycleData.startDate}
                                    onChange={(e) => setCycleData({ ...cycleData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>End Date*</Label>
                                <Input
                                    type="date"
                                    value={cycleData.endDate}
                                    onChange={(e) => setCycleData({ ...cycleData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Staff Categories*</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {['Teaching Staff', 'HOD', 'Principal', 'Non-Teaching Staff', 'Admin Support'].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => toggleCategory(cat)}
                                        className={`p-3 rounded-lg border-2 transition-all ${cycleData.staffCategories.includes(cat)
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{cat}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700">
                            Next: Configure Weightage
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Weightage Configuration */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Weightage Configuration</CardTitle>
                        <p className="text-sm text-slate-600">Total must equal 100%</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`p-4 rounded-lg ${totalWeightage === 100 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="text-3xl font-bold">{totalWeightage}%</div>
                            <div className="text-sm">{totalWeightage === 100 ? '✓ Total is correct' : `⚠ Total must be 100% (currently ${totalWeightage}%)`}</div>
                        </div>

                        {[
                            { field: 'kraWeightage', label: 'KRA (Key Result Areas)', color: 'blue' },
                            { field: 'kpiWeightage', label: 'KPI (Key Performance Indicators)', color: 'indigo' },
                            { field: 'feedback360Weightage', label: '360° Feedback', color: 'purple' },
                            { field: 'complianceWeightage', label: 'Compliance & Documentation', color: 'pink' }
                        ].map(({ field, label, color }) => {
                            const value = cycleData[field as keyof typeof cycleData] as number;
                            return (
                                <div key={field}>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>{label}</Label>
                                        <span className="text-sm font-semibold">{value}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={value}
                                        onChange={(e) => handleWeightageChange(field, parseInt(e.target.value))}
                                        className={`w-full h-2 bg-${color}-200 rounded-lg appearance-none cursor-pointer`}
                                    />
                                </div>
                            );
                        })}

                        <div className="flex gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button
                                onClick={() => setStep(3)}
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={totalWeightage !== 100}
                            >
                                Next: Rating Scale
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Rating Scale */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Rating Scale Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Select Rating Scale Type</Label>
                            <Select
                                value={cycleData.ratingScaleType}
                                onValueChange={(value: '1-5' | '1-10' | 'A-F') =>
                                    setCycleData({ ...cycleData, ratingScaleType: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-5">1-5 Scale (Most Common)</SelectItem>
                                    <SelectItem value="1-10">1-10 Scale</SelectItem>
                                    <SelectItem value="A-F">Letter Grades (A-F)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {['allowMidYearReview', 'enableNormalization', 'bellCurveEnforced'].map((field) => (
                                <label key={field} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="checkbox"
                                        checked={cycleData[field as keyof typeof cycleData] as boolean}
                                        onChange={(e) => setCycleData({ ...cycleData, [field]: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm">
                                        {field === 'allowMidYearReview' && 'Mid-Year Review'}
                                        {field === 'enableNormalization' && 'Enable Normalization'}
                                        {field === 'bellCurveEnforced' && 'Enforce Bell Curve'}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                            <Button onClick={() => setStep(4)} className="bg-blue-600 hover:bg-blue-700">
                                Next: Calendar Setup
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Calendar */}
            {step === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Calendar & Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { field: 'goalSetting', label: 'Goal Setting Deadline' },
                                { field: 'midReview', label: 'Mid-Year Review Deadline' },
                                { field: 'feedbackCollection', label: '360° Feedback Deadline' },
                                { field: 'finalReview', label: 'Final Review Deadline' },
                                { field: 'calibration', label: 'Calibration Deadline' },
                                { field: 'approved', label: 'Final Approval Deadline' }
                            ].map(({ field, label }) => (
                                <div key={field}>
                                    <Label>{label}</Label>
                                    <Input
                                        type="date"
                                        value={cycleData.deadlines[field as keyof typeof cycleData.deadlines]}
                                        onChange={(e) =>
                                            setCycleData({
                                                ...cycleData,
                                                deadlines: { ...cycleData.deadlines, [field]: e.target.value }
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                            <Button onClick={() => setStep(5)} className="bg-blue-600 hover:bg-blue-700">
                                Next: Review & Activate
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 5: Review & Activate */}
            {step === 5 && (
                <Card className="border-green-200">
                    <CardHeader className="bg-green-50">
                        <CardTitle>Review & Activate Cycle</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Basic Info</h4>
                                <div className="text-sm space-y-1">
                                    <div>Year: <strong>{cycleData.academicYear}</strong></div>
                                    <div>Duration: {cycleData.startDate} to {cycleData.endDate}</div>
                                    <div>Categories: {cycleData.staffCategories.join(', ')}</div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Weightage</h4>
                                <div className="text-sm space-y-1">
                                    <div>KRA: {cycleData.kraWeightage}%</div>
                                    <div>KPI: {cycleData.kpiWeightage}%</div>
                                    <div>360°: {cycleData.feedback360Weightage}%</div>
                                    <div>Compliance: {cycleData.complianceWeightage}%</div>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <h4 className="font-semibold text-sm mb-2">Rating & Options</h4>
                                <div className="text-sm space-y-1">
                                    <div>Rating Scale: {cycleData.ratingScaleType}</div>
                                    <div>Mid-Year Review: {cycleData.allowMidYearReview ? 'Enabled' : 'Disabled'}</div>
                                    <div>Normalization: {cycleData.enableNormalization ? 'Yes' : 'No'}</div>
                                    <div>Bell Curve: {cycleData.bellCurveEnforced ? 'Enforced' : 'Optional'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-900">
                                <strong>⚠ Warning:</strong> Once activated, the cycle configuration will be <strong>locked</strong>. You will not be able to modify weightage, rating scales, or deadlines.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
                            <Button onClick={handleActivate} className="bg-green-600 hover:bg-green-700 gap-2">
                                <Lock className="h-4 w-4" />
                                Activate & Lock Cycle
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </Layout>
    );
};

export default AppraisalCycleSetup;
