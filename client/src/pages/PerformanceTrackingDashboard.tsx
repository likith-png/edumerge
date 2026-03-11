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
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import {
    TrendingUp, Plus, Calendar,
    CheckCircle, FileText,
    MessageSquare, Target, Award, Zap, ArrowRight,
    Info
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import {
    getKRAsWithKPIsByRole,
    getManagerFeedbackByPeriod,
    getGoalTemplatesByRole,
    type KRA,
    type KPI,
} from '../services/appraisalService';

const PerformanceTrackingDashboard: React.FC = () => {
    const { role } = usePersona();
    const [selectedMonth, setSelectedMonth] = useState<string>('2024-07');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedKPIForUpdate, setSelectedKPIForUpdate] = useState<KPI | null>(null);

    // Load data based on persona
    const krasWithKPIs = getKRAsWithKPIsByRole(role || 'Teaching Staff');
    const managerFeedback = getManagerFeedbackByPeriod(selectedMonth);
    const goals = getGoalTemplatesByRole(role || 'Teaching Staff');

    const getAchievementPercentage = (kpi: KPI) => {
        if (!kpi.achieved) return 0;
        return (kpi.achieved / kpi.target) * 100;
    };

    const getStatusColor = (percentage: number) => {
        if (percentage >= 100) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', bar: 'bg-green-600' };
        if (percentage >= 75) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-600' };
        if (percentage >= 50) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-600' };
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-600' };
    };

    return (
        <Layout
            title="Performance & Goal Tracking"
            description="Manage your KRAs, KPIs, and professional goals"
            icon={Target}
            showBack
        >
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Month Selector & Overall Status */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="font-semibold text-slate-900 border-none bg-transparent focus:ring-0 cursor-pointer"
                            >
                                <option value="2024-07">July 2024</option>
                                <option value="2024-08">August 2024 (Current)</option>
                                <option value="2024-06">June 2024</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge className="bg-green-100 text-green-700 border-none py-1.5 px-3">
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                On Track
                            </Badge>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-1.5" />
                                Add Self-Update
                            </Button>
                        </div>
                    </div>

                    {/* manager feedback layer */}
                    {managerFeedback.length > 0 && (
                        <Card className="border-indigo-200 bg-indigo-50/50 border-dashed">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2 text-indigo-900">
                                    <MessageSquare className="h-4 w-4 text-indigo-600" />
                                    Manager Review for {selectedMonth}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {managerFeedback.map(fb => (
                                    <div key={fb.id} className="flex gap-3 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-indigo-600">{fb.managerName[0]}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-800 italic">"{fb.comment}"</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-500">{fb.managerName}</span>
                                                <span className="text-[10px] text-slate-400">• {new Date(fb.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* KRAs and Grouped KPIs */}
                    <div className="space-y-8">
                        {krasWithKPIs.map((kra: KRA & { kpis: KPI[] }) => (
                            <div key={kra.id} className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Target className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">{kra.title}</h2>
                                            <p className="text-xs text-slate-500">{kra.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-900">{kra.weightage}%</div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Weightage</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {kra.kpis.map(kpi => {
                                        const percentage = getAchievementPercentage(kpi);
                                        const colors = getStatusColor(percentage);
                                        return (
                                            <Card key={kpi.id} className={`group hover:shadow-md transition-all border-slate-200`}>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                                {kpi.title}
                                                            </h4>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">{kpi.description}</p>
                                                        </div>
                                                        <Badge variant="outline" className={`text-[10px] ${kpi.autoCalculated ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                            {kpi.autoCalculated ? 'Auto' : 'Manual'}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-xs text-slate-600">
                                                            Target: <span className="font-bold text-slate-900">{kpi.target}{kpi.unit}</span>
                                                        </div>
                                                        <div className={`text-sm font-bold ${colors.text}`}>
                                                            {kpi.achieved || 0}{kpi.unit} ({percentage.toFixed(0)}%)
                                                        </div>
                                                    </div>

                                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                                                        <div
                                                            className={`${colors.bar} h-1.5 rounded-full transition-all duration-1000`}
                                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-[11px] px-2 text-blue-600 hover:bg-blue-50"
                                                            onClick={() => {
                                                                setSelectedKPIForUpdate(kpi);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                        >
                                                            <Plus className="h-3.5 w-3.5 mr-1" /> Update progress
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 text-[11px] px-2 text-slate-500 hover:bg-slate-50">
                                                            <Info className="h-3.5 w-3.5 mr-1" /> History
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* goals Section */}
                    <Card className="border-pink-200 bg-gradient-to-br from-white to-pink-50/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2 text-pink-900">
                                <Award className="h-5 w-5 text-pink-600" />
                                Personal Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {goals.map((goal, idx) => (
                                <div key={idx} className="p-3 bg-white rounded-lg border border-pink-100 shadow-sm hover:border-pink-300 transition-colors">
                                    <h5 className="text-xs font-bold text-slate-900 underline decoration-pink-200 decoration-2 underline-offset-4">
                                        {goal.title}
                                    </h5>
                                    <p className="text-[10px] text-slate-600 mt-1.5 leading-relaxed">{goal.description}</p>
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                        <Badge className="text-[9px] bg-slate-100 text-slate-600 border-none px-2 py-0">Draft</Badge>
                                        <Button variant="link" size="sm" className="h-4 p-0 text-[10px] text-pink-600">
                                            Details <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 text-xs py-2">
                                <Plus className="h-3.5 w-3.5 mr-1" /> Set New Goal
                            </Button>
                        </CardContent>
                    </Card>

                    {/* schedule insight */}
                    <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
                        <Zap className="absolute -right-4 -top-4 h-24 w-24 text-white/10 rotate-12" />
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-5 w-5 text-blue-400" />
                                <span className="text-sm font-bold uppercase tracking-wider">Review Cycle</span>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="flex gap-3">
                                    <div className="w-1 bg-blue-500 rounded-full" />
                                    <div>
                                        <div className="text-xs font-bold text-blue-400">Self-Update Period</div>
                                        <p className="text-[10px] text-slate-300">Aug 20 - Aug 25</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1 bg-slate-700 rounded-full" />
                                    <div>
                                        <div className="text-xs font-bold text-slate-500">Manager Review</div>
                                        <p className="text-[10px] text-slate-300 italic underline">Upcoming: Sep 1-5</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resources */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Learning Resources</Label>
                        <Button variant="ghost" className="w-full justify-between text-xs font-medium hover:bg-blue-50 hover:text-blue-600 group">
                            Academic Excellence Guide <FileText className="h-3 w-3 text-slate-400 group-hover:text-blue-500" />
                        </Button>
                        <Button variant="ghost" className="w-full justify-between text-xs font-medium hover:bg-blue-50 hover:text-blue-600 group">
                            KRA Alignment Video <Zap className="h-3 w-3 text-slate-400 group-hover:text-blue-500" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Update Progress Modal */}
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Update KPI Progress
                        </DialogTitle>
                    </DialogHeader>
                    {selectedKPIForUpdate && (
                        <div className="space-y-4 pt-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <Label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">KPI Selected</Label>
                                <h4 className="font-bold text-slate-900">{selectedKPIForUpdate.title}</h4>
                                <p className="text-xs text-slate-600 mt-1">{selectedKPIForUpdate.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Achieved Value ({selectedKPIForUpdate.unit})</Label>
                                    <Input
                                        type="number"
                                        placeholder={`Target: ${selectedKPIForUpdate.target}`}
                                        defaultValue={selectedKPIForUpdate.achieved}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Evidence / Accomplishment Notes</Label>
                                <Textarea
                                    placeholder="Briefly describe what was achieved or link to evidence..."
                                    rows={3}
                                />
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                                <p className="text-[10px] text-blue-800">
                                    Updates submitted will be final for the current month once saved. Your manager will be notified for review.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setIsUpdateModalOpen(false)}>Save Update</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default PerformanceTrackingDashboard;
