import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Users, Calendar, CheckCircle,
    Plus, ChevronRight, Sliders, Zap, AlertCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import Layout from '../components/Layout';

interface Cycle {
    id: number;
    name: string;
    status: 'Active' | 'Completed';
    deadline: string;
    participation: number;
}

interface Weights {
    manager: number;
    peer: number;
    self: number;
    subordinate: number;
    student: number;
}

const Feedback360: React.FC = () => {
    const [activeTab, setActiveTab] = useState('cycles');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Mock Data for Cycles
    const cycles: Cycle[] = [
        { id: 1, name: 'Institutional Culture Pulse 2025', status: 'Active', deadline: 'Mar 31, 2025', participation: 45 },
        { id: 2, name: 'Leadership & Team Dynamics 2024', status: 'Completed', deadline: 'Sep 30, 2024', participation: 92 },
    ];

    // Mock Data for Weightage
    const [weights, setWeights] = useState<Weights>({
        manager: 40,
        peer: 20,
        self: 10,
        subordinate: 20,
        student: 10
    });

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    return (
        <Layout
            title="360° Feedback Engine"
            description="Manage comprehensive feedback cycles, source weightages, and nominee rater nominations."
            headerActions={
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 border-none hover:bg-slate-800 text-white font-bold h-10 px-6 rounded-lg shadow-sm text-xs transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Launch New Cycle
                </Button>
            }
        >
            <div className="space-y-6 animate-in fade-in duration-500">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-lg mb-6 w-fit justify-start h-auto border border-slate-200 shadow-sm">
                        <TabsTrigger value="cycles" className="rounded-md px-8 py-2.5 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
                            Cycles
                        </TabsTrigger>
                        <TabsTrigger value="configuration" className="rounded-md px-8 py-2.5 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
                            Configuration
                        </TabsTrigger>
                        <TabsTrigger value="raters" className="rounded-md px-8 py-2.5 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
                            Raters
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="cycles" className="space-y-12 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cycles.filter(c => c.status === 'Active').map(cycle => (
                                <Card key={cycle.id} className="bg-slate-900 text-white border border-slate-800 shadow-lg relative overflow-hidden rounded-2xl group">
                                    <CardContent className="p-8 relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                                                <Calendar className="w-6 h-6 text-white" />
                                            </div>
                                            <Badge className="bg-emerald-500 text-white border-none px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Active Cycle</Badge>
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight mb-1 uppercase">{cycle.name}</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Deadline: <span className="text-white">{cycle.deadline}</span></p>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participation Rate</span>
                                                <span className="text-2xl font-bold text-emerald-400 tracking-tight">{cycle.participation}%</span>
                                            </div>
                                            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${cycle.participation}%` }} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card
                                onClick={() => setIsCreateModalOpen(true)}
                                className="border-slate-200 border-dashed border-2 bg-slate-50 hover:bg-white hover:border-slate-400 transition-all flex flex-col items-center justify-center cursor-pointer group rounded-2xl h-full min-h-[260px] shadow-sm"
                            >
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:scale-110 transition-all duration-300 mb-6">
                                    <Plus className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Launch New Period</h3>
                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Configure your next cycle</p>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-emerald-500" /> Past Feedback Cycles
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {cycles.filter(c => c.status === 'Completed').map(cycle => (
                                    <Card key={cycle.id} className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all group flex items-center">
                                        <CardContent className="p-6 flex items-center justify-between w-full">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                                    <CheckCircle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">{cycle.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-1">Finalized on <span className="text-slate-600">{cycle.deadline}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-12 mr-4">
                                                <div className="text-right">
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Final Participation</div>
                                                    <div className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{cycle.participation}%</div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-all">
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="configuration" className="outline-none space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="rounded-2xl shadow-sm bg-white border border-slate-200 overflow-hidden">
                                <CardHeader className="p-8 border-b border-slate-100 pb-6">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
                                        <Sliders className="w-6 h-6 text-slate-900" />
                                        Source Weightage
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Define the impact from each feedback source cluster.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                                        <div>
                                            <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Total Distribution</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`text-3xl font-bold tracking-tight ${totalWeight === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {totalWeight}%
                                            </div>
                                            {totalWeight === 100 && <Zap className="w-6 h-6 text-amber-500" />}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {Object.entries(weights).map(([source, weight]) => (
                                            <div key={source} className="space-y-4">
                                                <div className="flex justify-between items-center px-1">
                                                    <Label className="capitalize font-bold text-slate-900 text-sm tracking-tight">{source} Feedback</Label>
                                                    <Badge className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-4 py-1 rounded-full">{weight}%</Badge>
                                                </div>
                                                <div className="px-1">
                                                    <Slider
                                                        value={[weight]}
                                                        max={100}
                                                        step={5}
                                                        onValueChange={(val) => setWeights({ ...weights, [source as keyof Weights]: val[0] })}
                                                        className="py-2"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {totalWeight !== 100 && (
                                        <div className="p-4 bg-rose-50 rounded-xl flex items-center gap-3 border border-rose-100">
                                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                                            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest">
                                                Distribution error: Adjustment required ({totalWeight}%)
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl shadow-sm bg-white border border-slate-200 overflow-hidden">
                                <CardHeader className="p-8 border-b border-slate-100 pb-6">
                                    <CardTitle className="text-xl font-bold tracking-tight uppercase">Institutional Policy</CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Governance rules and rater transparency protocols.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white transition-all">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-900 text-sm tracking-tight uppercase">Transparency</h4>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Anonymity protocol for cycle reports</p>
                                                </div>
                                                <Select defaultValue="semi">
                                                    <SelectTrigger className="w-[180px] bg-white font-bold text-[10px] h-10 tracking-widest uppercase rounded-lg border-slate-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-lg border-slate-200">
                                                        <SelectItem value="full" className="font-bold text-[10px] uppercase text-slate-700">Fully Anonymous</SelectItem>
                                                        <SelectItem value="semi" className="font-bold text-[10px] uppercase text-slate-700">Semi-Anonymous</SelectItem>
                                                        <SelectItem value="named" className="font-bold text-[10px] uppercase text-slate-700">Identified</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white transition-all">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-900 text-sm tracking-tight uppercase">Rater Floor</h4>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Minimum valid responses per nominee</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Input type="number" defaultValue={3} className="w-20 bg-white h-10 text-center font-bold text-slate-900 rounded-lg border-slate-200" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Raters</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-sm mt-4">
                                        Save Governance Protocol
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="raters" className="outline-none">
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed group">
                            <div className="p-8 bg-white rounded-full shadow-sm group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                <Users className="w-12 h-12 text-slate-400 group-hover:text-white" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Rater Management Hub</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-sm mt-1 leading-relaxed">
                                    Configure auto-selection algorithms or manage manual nominations for each candidate.
                                </p>
                            </div>
                            <Button onClick={() => alert("Rater management module coming soon!")} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest px-12 h-12 rounded-lg shadow-sm transition-all active:scale-95">
                                Launch Selection Engine
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            {/* Create Cycle Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 overflow-hidden border border-slate-200 shadow-2xl">
                    <DialogHeader className="bg-slate-900 px-10 py-8 text-white relative">
                        <div className="relative z-10 space-y-2">
                            <DialogTitle className="text-2xl font-bold tracking-tight uppercase">Initiate Feedback Cycle</DialogTitle>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Define parameters for the upcoming institutional survey.</p>
                        </div>
                    </DialogHeader>
                    <div className="p-10 space-y-10">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cycle Identity</Label>
                            <Input placeholder="e.g., Annual Leadership Review 2025" className="h-12 bg-slate-50 rounded-lg border-slate-200 font-bold text-slate-900 placeholder:text-slate-400 px-6" />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deployment Date</Label>
                                <Input type="date" className="h-12 bg-slate-50 rounded-lg border-slate-200 font-bold text-slate-900 px-6" />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Termination Date</Label>
                                <Input type="date" className="h-12 bg-slate-50 rounded-lg border-slate-200 font-bold text-slate-900 px-6" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Primary Focus Cluster</Label>
                            <Select>
                                <SelectTrigger className="h-12 bg-slate-50 rounded-lg border-slate-200 font-bold text-slate-900 px-6 tracking-tight">
                                    <SelectValue placeholder="Select Evaluation Focus" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-slate-200 shadow-xl">
                                    <SelectItem value="leadership" className="font-bold text-[10px] uppercase text-slate-700">Leadership & Management</SelectItem>
                                    <SelectItem value="general" className="font-bold text-[10px] uppercase text-slate-700">General Performance</SelectItem>
                                    <SelectItem value="culture" className="font-bold text-[10px] uppercase text-slate-700">Cultural Alignment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-6 flex gap-6">
                            <Button variant="ghost" className="flex-1 h-12 rounded-lg font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-100" onClick={() => setIsCreateModalOpen(false)}>Abort</Button>
                            <Button className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm" onClick={() => { setIsCreateModalOpen(false); alert("Cycle Created Successfully!"); }}>Commission Cycle</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default Feedback360;
