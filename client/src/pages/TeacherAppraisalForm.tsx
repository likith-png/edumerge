import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { UserCheck, Upload, Save, Send, AlertCircle } from 'lucide-react';
import { getKRAsByRole, getKPIsByKRA } from '../services/appraisalService';

const TeacherAppraisalForm: React.FC = () => {
    const [activeSection, setActiveSection] = useState('kra');
    const kras = getKRAsByRole('Teaching Staff');

    const sections = [
        { id: 'kra', label: 'KRA Self-Rating', icon: '📊' },
        { id: 'academic', label: 'Academic Metrics', icon: '🎓' },
        { id: 'evidence', label: 'Evidence & Achievements', icon: '📁' },
        { id: 'feedback', label: 'Self-Reflection', icon: '💭' }
    ];

    return (
        <Layout title="Teaching Staff Appraisal" description="Complete your self-assessment for Academic Year 2024-25" icon={UserCheck} showBack>
            {/* Progress Tracker */}
            <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Overall Progress</span>
                        <span className="text-sm text-blue-700">60% Complete</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="flex items-center gap-2 mt-3 text-xs text-blue-700">
                        <AlertCircle className="h-4 w-4" />
                        Deadline: June 15, 2025 | HOD Review: June 20, 2025
                    </div>
                </CardContent>
            </Card>

            {/* Section Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeSection === section.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <span>{section.icon}</span>
                        <span className="text-sm font-medium">{section.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            {activeSection === 'kra' && <KRASelfRating kras={kras} />}
            {activeSection === 'academic' && <AcademicMetrics />}
            {activeSection === 'evidence' && <EvidenceUpload />}
            {activeSection === 'feedback' && <SelfReflection />}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button variant="outline" className="gap-2">
                    <Save className="h-4 w-4" /> Save as Draft
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Send className="h-4 w-4" /> Submit for HOD Review
                </Button>
            </div>
        </Layout>
    );
};

// KRA Self-Rating Section
const KRASelfRating: React.FC<{ kras: any[] }> = ({ kras }) => {
    const [ratings, setRatings] = useState<Record<string, number>>({});

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                <p className="text-sm text-blue-700">
                    Rate yourself on each KRA using a scale of 1-5. Provide specific examples and evidence in the comments section.
                </p>
            </div>

            {kras.filter(kra => kra.isMandatory).map((kra) => {
                const kpis = getKPIsByKRA(kra.id);
                return (
                    <Card key={kra.id} className="border-slate-200">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        {kra.title}
                                        <Badge variant="destructive" className="text-[10px] bg-red-100 text-red-700">
                                            {kra.weightage}%
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-sm text-slate-600 mt-1">{kra.description}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* KPI Display */}
                            {kpis.length > 0 && (
                                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                    <h4 className="text-xs font-semibold text-slate-700 mb-2">Linked KPIs</h4>
                                    <div className="space-y-2">
                                        {kpis.map((kpi) => (
                                            <div key={kpi.id} className="flex items-center justify-between text-xs">
                                                <span className="text-slate-700">{kpi.title}</span>
                                                <span className="font-semibold text-slate-900">
                                                    {kpi.achieved || 0} / {kpi.target} {kpi.unit}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rating Scale */}
                            <div className="mb-3">
                                <Label className="text-sm mb-2 block">Self-Rating (1 = Poor, 5 = Excellent)</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setRatings({ ...ratings, [kra.id]: rating })}
                                            className={`flex-1 py-2 rounded-lg border-2 transition-all ${ratings[kra.id] === rating
                                                ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                                                : 'border-slate-200 hover:border-blue-300'
                                                }`}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <Label htmlFor={`comments-${kra.id}`} className="text-sm">Evidence & Comments</Label>
                                <Textarea
                                    id={`comments-${kra.id}`}
                                    placeholder="Provide specific examples of achievements, initiatives taken, or evidence supporting your rating..."
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

// Academic Metrics Section
const AcademicMetrics: React.FC = () => {
    return (
        <div className="space-y-4">
            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-base">Class Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="passPercentage">Pass Percentage (%)</Label>
                            <Input id="passPercentage" type="number" placeholder="e.g., 88" />
                        </div>
                        <div>
                            <Label htmlFor="avgScore">Average Student Score</Label>
                            <Input id="avgScore" type="number" placeholder="e.g., 78" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="lessonPlan">Lesson Plan Completion (%)</Label>
                        <Input id="lessonPlan" type="number" placeholder="e.g., 95" />
                    </div>

                    <div>
                        <Label htmlFor="studentFeedback">Student Feedback Score (out of 5)</Label>
                        <Input id="studentFeedback" type="number" step="0.1" placeholder="e.g., 4.3" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-base">Professional Development</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fdpHours">FDP Hours Completed</Label>
                            <Input id="fdpHours" type="number" placeholder="e.g., 45" />
                        </div>
                        <div>
                            <Label htmlFor="certifications">Certifications Obtained</Label>
                            <Input id="certifications" type="number" placeholder="e.g., 3" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Evidence Upload Section
const EvidenceUpload: React.FC = () => {
    return (
        <div className="space-y-4">
            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-base">Upload Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {['Lesson Plans', 'Student Feedback Forms', 'Certificates & FDP Proof', 'Research Papers', 'Event Reports'].map((category) => (
                        <div key={category} className="border border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-sm">{category}</h4>
                                    <p className="text-xs text-slate-500">PDF, DOC, JPEG (Max 10MB)</p>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Upload className="h-4 w-4" /> Upload
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

// Self-Reflection Section
const SelfReflection: React.FC = () => {
    return (
        <div className="space-y-4">
            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-base">Self-Reflection & Future Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="achievements">Key Achievements This Year</Label>
                        <Textarea
                            id="achievements"
                            placeholder="Describe your major accomplishments and successes..."
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="challenges">Challenges Faced & How You Overcame Them</Label>
                        <Textarea
                            id="challenges"
                            placeholder="Share the obstacles you encountered and your problem-solving approach..."
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="futureGoals">Goals for Next Academic Year</Label>
                        <Textarea
                            id="futureGoals"
                            placeholder="What are your professional development goals for 2025-26?..."
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="support">Support Needed from Institution</Label>
                        <Textarea
                            id="support"
                            placeholder="What resources or support would help you achieve your goals?..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherAppraisalForm;
