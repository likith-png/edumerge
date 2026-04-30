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
import { Activity, Plus, TrendingUp, TrendingDown, Edit, Calculator, Trash2, Target } from 'lucide-react';
import { kpiLibrary, getAllKRAs, type KPI, type KRA } from '../services/appraisalService';

const KPIConfiguration: React.FC = () => {
    const [kpis, setKpis] = useState<KPI[]>(kpiLibrary);
    const [kras] = useState<KRA[]>(getAllKRAs());
    const [selectedKRA, setSelectedKRA] = useState<string>('all');
    const [selectedBenchmark, setSelectedBenchmark] = useState<string>('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingKPI, setEditingKPI] = useState<KPI | null>(null);

    // Filter KPIs
    const filteredKPIs = kpis.filter(kpi => {
        const kraMatch = selectedKRA === 'all' || kpi.kraId === selectedKRA;
        const benchmarkMatch = selectedBenchmark === 'all' || kpi.benchmarkType === selectedBenchmark;
        return kraMatch && benchmarkMatch;
    });

    // Calculate achievement percentage
    const getAchievementPercentage = (kpi: KPI) => {
        if (!kpi.achieved) return 0;
        return (kpi.achieved / kpi.target) * 100;
    };

    const handleOpenCreate = () => {
        setEditingKPI(null);
        setIsCreateDialogOpen(true);
    };

    const handleOpenEdit = (kpi: KPI) => {
        setEditingKPI(kpi);
        setIsCreateDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this KPI?')) {
            setKpis(prev => prev.filter(k => k.id !== id));
        }
    };

    const handleSave = (kpiData: Omit<KPI, 'id' | 'status'>) => {
        if (editingKPI) {
            setKpis(prev => prev.map(k => k.id === editingKPI.id ? { ...k, ...kpiData, status: 'Pending Review' } : k));
        } else {
            const newKPI: KPI = {
                ...kpiData,
                id: `kpi-${Date.now()}`,
                status: 'Pending Review'
            };
            setKpis(prev => [...prev, newKPI]);
        }
        setIsCreateDialogOpen(false);
    };

    const getAchievementColor = (percentage: number) => {
        if (percentage >= 100) return 'text-green-600';
        if (percentage >= 75) return 'text-blue-600';
        if (percentage >= 50) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <Layout title="KPI Configuration Engine" description="Define and track Key Performance Indicators" icon={Activity} showBack>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-blue-900">{kpis.length}</div>
                        <div className="text-xs text-blue-700">Total KPIs</div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-green-900">
                            {kpis.filter(k => k.achieved && getAchievementPercentage(k) >= 100).length}
                        </div>
                        <div className="text-xs text-green-700">Targets Achieved</div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-amber-900">
                            {kpis.filter(k => k.autoCalculated).length}
                        </div>
                        <div className="text-xs text-amber-700">Auto-Calculated</div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="pt-4 flex justify-center items-center h-full">
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={handleOpenCreate}>
                                    <Plus className="h-4 w-4 mr-2" /> Create KPI
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{editingKPI ? 'Edit KPI' : 'Create New KPI'}</DialogTitle>
                                    <DialogDescription>
                                        {editingKPI ? 'Update the details for this measurable indicator' : 'Define a measurable Key Performance Indicator'}
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateKPIForm
                                    initialData={editingKPI}
                                    kras={kras}
                                    onSave={handleSave}
                                    onClose={() => setIsCreateDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <Select value={selectedKRA} onValueChange={setSelectedKRA}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Filter by KRA" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All KRAs</SelectItem>
                        {kras.map(kra => (
                            <SelectItem key={kra.id} value={kra.id}>{kra.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Benchmark Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Benchmarks</SelectItem>
                        <SelectItem value="Department">Department</SelectItem>
                        <SelectItem value="Institution">Institution</SelectItem>
                        <SelectItem value="National">National</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI List */}
            <div className="space-y-3">
                {filteredKPIs.map((kpi) => {
                    const kra = kras.find(k => k.id === kpi.kraId);
                    const achievementPercentage = getAchievementPercentage(kpi);

                    return (
                        <Card key={kpi.id} className="border-slate-200 hover:shadow-sm transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CardTitle className="text-base">{kpi.title}</CardTitle>
                                            {kpi.status === 'Pending Review' && (
                                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">Pending Review</Badge>
                                            )}
                                            {kpi.status === 'Rejected' && (
                                                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px]">Rejected</Badge>
                                            )}
                                            {kpi.autoCalculated && (
                                                <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                                                    <Calculator className="h-3 w-3 mr-1" />
                                                    Auto
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600">{kpi.description}</p>
                                        {kra && (
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-100 py-0 flex items-center gap-1">
                                                    <Target className="h-2.5 w-2.5" />
                                                    {kra.title}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEdit(kpi)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(kpi.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Target & Achievement */}
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500">Target</div>
                                        <div className="text-lg font-semibold text-slate-900">
                                            {kpi.target} {kpi.unit}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500">Achieved</div>
                                        <div className={`text-lg font-semibold ${getAchievementColor(achievementPercentage)}`}>
                                            {kpi.achieved || 0} {kpi.unit}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500">Performance</div>
                                        <div className="flex items-center gap-2">
                                            <div className={`text-lg font-semibold ${getAchievementColor(achievementPercentage)}`}>
                                                {achievementPercentage.toFixed(0)}%
                                            </div>
                                            {achievementPercentage >= 100 ? (
                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-3">
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${achievementPercentage >= 100 ? 'bg-green-600' :
                                                achievementPercentage >= 75 ? 'bg-blue-600' :
                                                    achievementPercentage >= 50 ? 'bg-amber-600' : 'bg-red-600'
                                                }`}
                                            style={{ width: `${Math.min(achievementPercentage, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Formula & Benchmark */}
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    {kpi.formula && (
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Calculator className="h-3.5 w-3.5" />
                                            <code className="bg-slate-100 px-2 py-0.5 rounded">{kpi.formula}</code>
                                        </div>
                                    )}
                                    <Badge variant="outline" className="text-[10px]">
                                        {kpi.benchmarkType} Benchmark
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </Layout>
    );
};

// Create KPI Form
const CreateKPIForm: React.FC<{
    initialData?: KPI | null;
    kras: KRA[];
    onSave: (data: any) => void;
    onClose: () => void;
}> = ({ initialData, kras, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        kraId: initialData?.kraId || '',
        title: initialData?.title || '',
        description: initialData?.description || '',
        unit: initialData?.unit || '%',
        target: initialData?.target || 0,
        formula: initialData?.formula || '',
        autoCalculated: initialData?.autoCalculated || false,
        benchmarkType: initialData?.benchmarkType || 'Department' as 'Department' | 'Institution' | 'National'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="kraId">Linked KRA*</Label>
                <Select value={formData.kraId} onValueChange={(value) => setFormData({ ...formData, kraId: value })} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select KRA" />
                    </SelectTrigger>
                    <SelectContent>
                        {kras.map(kra => (
                            <SelectItem key={kra.id} value={kra.id}>{kra.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="title">KPI Title*</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Student Pass Percentage"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this KPI measures..."
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="unit">Unit of Measurement*</Label>
                    <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="%, Count, Hours, INR"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="target">Target Value*</Label>
                    <Input
                        id="target"
                        type="number"
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) })}
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="formula">Calculation Formula (Optional)</Label>
                <Input
                    id="formula"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                    placeholder="e.g., (Passed Students / Total Students) × 100"
                />
            </div>

            <div>
                <Label htmlFor="benchmark">Benchmark Type</Label>
                <Select value={formData.benchmarkType} onValueChange={(value: 'Department' | 'Institution' | 'National') => setFormData({ ...formData, benchmarkType: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Department">Department Level</SelectItem>
                        <SelectItem value="Institution">Institution Level</SelectItem>
                        <SelectItem value="National">National Level</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="autoCalculated"
                    checked={formData.autoCalculated}
                    onChange={(e) => setFormData({ ...formData, autoCalculated: e.target.checked })}
                    className="h-4 w-4"
                />
                <Label htmlFor="autoCalculated" className="cursor-pointer">Auto-calculate from system data</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {initialData ? 'Save Changes' : 'Create KPI'}
                </Button>
            </div>
        </form>
    );
};

export default KPIConfiguration;
