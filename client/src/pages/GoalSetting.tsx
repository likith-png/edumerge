import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { Flag, Plus, Calendar, CheckCircle, Clock, XCircle, Target, Cpu, MousePointer, Info } from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import { getGoalTemplatesByRole } from '../services/appraisalService';

interface Milestone {
    id: string;
    title: string;
    targetDate: string;
    status: 'Pending' | 'Completed';
    isAutomated: boolean;
}

interface Goal {
    id: string;
    title: string;
    description: string;
    type: 'Academic' | 'Professional' | 'Research' | 'Administrative';
    startDate: string;
    endDate: string;
    status: 'Draft' | 'Pending Approval' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
    milestones: Milestone[];
}

const GoalSetting: React.FC = () => {
    const { role } = usePersona();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [goals] = useState<Goal[]>([
        {
            id: 'goal-1',
            title: 'Improve Class Pass Percentage to 90%',
            description: 'Achieve 90% pass rate in Mathematics Grade 10 by implementing weekly remedial classes and personalized attention to weak students',
            type: 'Academic',
            startDate: '2024-04-01',
            endDate: '2025-03-31',
            status: 'Approved',
            milestones: [
                { id: 'm1', title: 'Identify weak students', targetDate: '2024-05-15', status: 'Completed', isAutomated: false },
                { id: 'm2', title: 'Conduct remedial classes', targetDate: '2024-12-31', status: 'Pending', isAutomated: false },
                { id: 'm3', title: 'Mid-term assessment', targetDate: '2024-10-15', status: 'Pending', isAutomated: true }
            ]
        },
        {
            id: 'goal-2',
            title: 'Complete Advanced Certification in AI/ML',
            description: 'Obtain Professional Certificate in Machine Learning from Coursera/Google to enhance subject expertise',
            type: 'Professional',
            startDate: '2024-06-01',
            endDate: '2024-12-31',
            status: 'In Progress',
            milestones: [
                { id: 'm4', title: 'Enroll in course', targetDate: '2024-06-15', status: 'Completed', isAutomated: false },
                { id: 'm5', title: 'Complete modules 1-5', targetDate: '2024-09-30', status: 'Pending', isAutomated: true }
            ]
        },
        {
            id: 'goal-3',
            title: 'Publish Research Paper on Educational Technology',
            description: 'Submit and publish 1 research paper in a UGC-approved journal on Gamification in Education',
            type: 'Research',
            startDate: '2024-07-01',
            endDate: '2025-02-28',
            status: 'Pending Approval',
            milestones: []
        }
    ]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Draft': 'bg-slate-100 text-slate-700',
            'Pending Approval': 'bg-amber-100 text-amber-700',
            'Approved': 'bg-green-100 text-green-700',
            'In Progress': 'bg-blue-100 text-blue-700',
            'Completed': 'bg-emerald-100 text-emerald-700',
            'Rejected': 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'Academic': 'text-blue-600',
            'Professional': 'text-purple-600',
            'Research': 'text-pink-600',
            'Administrative': 'text-slate-600'
        };
        return colors[type] || 'text-gray-600';
    };

    return (
        <Layout title="Goal Setting & Target Management" description="Set SMART goals aligned with institutional objectives" icon={Flag} showBack>
            {/* Stats & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-blue-900">{goals.filter(g => g.status === 'Approved' || g.status === 'In Progress').length}</div>
                        <div className="text-xs text-blue-700">Active Goals</div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-amber-900">{goals.filter(g => g.status === 'Pending Approval').length}</div>
                        <div className="text-xs text-amber-700">Pending Approval</div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-green-900">{goals.filter(g => g.status === 'Completed').length}</div>
                        <div className="text-xs text-green-700">Completed</div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="pt-4 flex justify-center items-center h-full">
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                                    <Plus className="h-4 w-4 mr-2" /> Set New Goal
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Set New Goal</DialogTitle>
                                    <DialogDescription>Create a SMART goal aligned with your role and institutional objectives</DialogDescription>
                                </DialogHeader>
                                <CreateGoalForm role={role} onClose={() => setIsCreateDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>

            {/* Goals List */}
            <div className="space-y-4">
                {goals.map((goal) => (
                    <Card key={goal.id} className="border-slate-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className={`h-5 w-5 ${getTypeColor(goal.type)}`} />
                                        <CardTitle className="text-base">{goal.title}</CardTitle>
                                    </div>
                                    <p className="text-sm text-slate-600">{goal.description}</p>
                                </div>
                                <Badge className={`${getStatusColor(goal.status)} text-[10px]`}>
                                    {goal.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">{goal.type}</Badge>
                                </div>

                                {goal.milestones.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-xs text-slate-600">
                                            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                            {goal.milestones.filter(m => m.status === 'Completed').length}/{goal.milestones.length} Milestones
                                        </div>
                                        <div className="w-24 bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(goal.milestones.filter(m => m.status === 'Completed').length / goal.milestones.length) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {goal.milestones.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-semibold text-slate-700 mb-2">Milestones</h4>
                                    <div className="space-y-2">
                                        {goal.milestones.map((milestone) => (
                                            <div key={milestone.id} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    {milestone.status === 'Completed' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Clock className="h-4 w-4 text-slate-400" />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className={milestone.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-700 font-medium'}>
                                                            {milestone.title}
                                                        </span>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            {milestone.isAutomated ? (
                                                                <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-700 border-purple-100 py-0 h-4 flex items-center gap-1">
                                                                    <Cpu className="h-2.5 w-2.5" /> System-Automated
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700 border-blue-100 py-0 h-4 flex items-center gap-1">
                                                                    <MousePointer className="h-2.5 w-2.5" /> Manual Tracking
                                                                </Badge>
                                                            )}
                                                            <span className="text-[10px] text-slate-400 ml-1">Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Layout>
    );
};

// Create Goal Form Component
const CreateGoalForm: React.FC<{ role: string; onClose: () => void }> = ({ role, onClose }) => {
    const templates = getGoalTemplatesByRole(role);
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        type: 'Academic' | 'Professional' | 'Research' | 'Administrative';
        startDate: string;
        endDate: string;
        milestones: { title: string; targetDate: string; isAutomated: boolean }[];
    }>({
        title: '',
        description: '',
        type: 'Academic',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        milestones: []
    });

    const applyTemplate = (index: number) => {
        const template = templates[index];
        setFormData({
            ...formData,
            title: template.title,
            description: template.description,
            type: template.type
        });
        setSelectedTemplate(index);
    };

    const addMilestone = () => {
        setFormData({
            ...formData,
            milestones: [...formData.milestones, { title: '', targetDate: '', isAutomated: false }]
        });
    };

    const removeMilestone = (index: number) => {
        setFormData({
            ...formData,
            milestones: formData.milestones.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating goal:', formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Goal Templates */}
            {templates.length > 0 && (
                <div>
                    <Label>Quick Templates (Optional)</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        {templates.map((template, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => applyTemplate(index)}
                                className={`p-3 text-left border rounded-lg hover:bg-blue-50 transition-colors ${selectedTemplate === index ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                                    }`}
                            >
                                <div className="font-medium text-sm">{template.title}</div>
                                <div className="text-xs text-slate-500">{template.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <Label htmlFor="title">Goal Title (Specific)*</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Improve Class Pass Percentage to 90%"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description (Measurable & Achievable)*</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe how you will achieve this goal and what success looks like..."
                    rows={3}
                    required
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="type">Goal Type</Label>
                    <Select value={formData.type} onValueChange={(value: 'Academic' | 'Professional' | 'Research' | 'Administrative') => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                            <SelectItem value="Administrative">Administrative</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="endDate">End Date (Time-bound)*</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label>Milestones (Optional)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                        <Plus className="h-3 w-3 mr-1" /> Add Milestone
                    </Button>
                </div>
                <div className="space-y-2">
                    {formData.milestones.map((milestone, index) => (
                        <div key={index} className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex gap-2">
                                <Input
                                    className="flex-1"
                                    placeholder="Milestone title"
                                    value={milestone.title}
                                    onChange={(e) => {
                                        const newMilestones = [...formData.milestones];
                                        newMilestones[index].title = e.target.value;
                                        setFormData({ ...formData, milestones: newMilestones });
                                    }}
                                />
                                <Input
                                    type="date"
                                    className="w-40"
                                    value={milestone.targetDate}
                                    onChange={(e) => {
                                        const newMilestones = [...formData.milestones];
                                        newMilestones[index].targetDate = e.target.value;
                                        setFormData({ ...formData, milestones: newMilestones });
                                    }}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(index)}>
                                    <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 px-1">
                                <Label className="text-xs text-slate-500">Tracking Method:</Label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`milestone-${index}-type`}
                                            checked={!milestone.isAutomated}
                                            onChange={() => {
                                                const newMilestones = [...formData.milestones];
                                                newMilestones[index].isAutomated = false;
                                                setFormData({ ...formData, milestones: newMilestones });
                                            }}
                                            className="h-3.5 w-3.5"
                                        />
                                        <span className="text-xs flex items-center gap-1">
                                            <MousePointer className="h-3 w-3" /> Manual
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`milestone-${index}-type`}
                                            checked={milestone.isAutomated}
                                            onChange={() => {
                                                const newMilestones = [...formData.milestones];
                                                newMilestones[index].isAutomated = true;
                                                setFormData({ ...formData, milestones: newMilestones });
                                            }}
                                            className="h-3.5 w-3.5"
                                        />
                                        <span className="text-xs flex items-center gap-1">
                                            <Cpu className="h-3 w-3" /> Automated (KPI Linked)
                                        </span>
                                    </label>
                                </div>
                            </div>
                            {milestone.isAutomated && (
                                <div className="text-[10px] text-indigo-600 bg-indigo-50 p-1.5 rounded flex items-start gap-1.5">
                                    <Info className="h-3 w-3 shrink-0 mt-0.5" />
                                    <span>This milestone will be automatically marked as completed when the linked system KPIs are achieved.</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Submit for Approval</Button>
            </div>
        </form>
    );
};

export default GoalSetting;
