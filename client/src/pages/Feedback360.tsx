import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Users, Calendar, CheckCircle,
    Plus, ChevronRight, Sliders
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";

const Feedback360: React.FC = () => {
    const [activeTab, setActiveTab] = useState('cycles');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Mock Data for Cycles
    const cycles = [
        { id: 1, name: 'Institutional Culture Pulse 2025', status: 'Active', deadline: 'Mar 31, 2025', participation: 45 },
        { id: 2, name: 'Leadership & Team Dynamics 2024', status: 'Completed', deadline: 'Sep 30, 2024', participation: 92 },
    ];

    // Mock Data for Weightage
    const [weights, setWeights] = useState({
        manager: 40,
        peer: 20,
        self: 10,
        subordinate: 20,
        student: 10
    });

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">360° Feedback Engine</h2>
                    <p className="text-slate-500 font-medium">Manage comprehensive feedback cycles and configurations.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    {['cycles', 'configuration', 'raters'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cycles Tab */}
            {activeTab === 'cycles' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md shadow-inner">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="bg-emerald-400/20 text-emerald-100 text-[10px] font-black uppercase px-2 py-1 rounded-full border border-emerald-400/30 backdrop-blur-md">Active Culture Sync</span>
                                </div>
                                <h3 className="text-2xl font-black leading-tight mb-1">Institutional Culture Pulse 2025</h3>
                                <p className="text-indigo-100/80 text-sm font-medium mb-6">Deadline: Mar 31, 2025</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-indigo-100">
                                        <span>Participation</span>
                                        <span>45%</span>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 w-[45%] shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => setIsCreateModalOpen(true)}
                            className="border-slate-200 border-dashed border-2 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all flex flex-col items-center justify-center cursor-pointer group rounded-xl"
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 group-hover:shadow-md transition-all mb-4">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700">Create New Cycle</h3>
                            <p className="text-slate-500 text-sm font-medium">Set up a new feedback period</p>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Past Cycles</h3>
                        {cycles.filter(c => c.status === 'Completed').map(cycle => (
                            <Card key={cycle.id} className="hover:border-indigo-200 transition-all cursor-pointer hover:shadow-md">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{cycle.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium">Ended {cycle.deadline}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participation</div>
                                            <div className="text-lg font-black text-slate-900">{cycle.participation}%</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Configuration Tab */}
            {activeTab === 'configuration' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="rounded-3xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-indigo-600" />
                                Feedback Source Weightage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                                <span className="font-bold text-indigo-900">Total Distribution</span>
                                <span className={`text-xl font-black ${totalWeight === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {totalWeight}%
                                </span>
                            </div>

                            {Object.entries(weights).map(([source, weight]) => (
                                <div key={source} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="capitalize font-bold text-slate-700">{source}</Label>
                                        <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{weight}%</span>
                                    </div>
                                    <Slider
                                        value={[weight]}
                                        max={100}
                                        step={5}
                                        onValueChange={(val) => setWeights({ ...weights, [source]: val[0] })}
                                        className="py-2"
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl shadow-sm">
                        <CardHeader>
                            <CardTitle>Rules & Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-slate-900">Anonymity Level</h4>
                                        <p className="text-xs text-slate-500">Control how feedback is displayed</p>
                                    </div>
                                    <Select defaultValue="semi">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full">Fully Anonymous</SelectItem>
                                            <SelectItem value="semi">Semi-Anonymous</SelectItem>
                                            <SelectItem value="named">Identified</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-slate-900">Minimum Raters</h4>
                                        <p className="text-xs text-slate-500">Required per nominee</p>
                                    </div>
                                    <Input type="number" defaultValue={3} className="w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Raters Tab - Placeholder */}
            {activeTab === 'raters' && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-slate-100 rounded-full">
                        <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Rater Nomination</h3>
                        <p className="text-slate-500 max-w-md">Configure auto-selection rules or manage manual nominations here.</p>
                    </div>
                    <Button onClick={() => alert("Rater management module coming soon!")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-200">Manage Raters</Button>
                </div>
            )}

            {/* Create Cycle Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-xl bg-white rounded-2xl p-0 overflow-hidden">
                    <div className="bg-indigo-600 p-6 text-white text-center">
                        <h2 className="text-xl font-black">Launch New Feedback Cycle</h2>
                        <p className="text-indigo-200 text-sm">Configure the basic details for the upcoming cycle.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Cycle Name</Label>
                            <Input placeholder="e.g., Annual Leadership Review 2025" className="font-medium" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Focus Area</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Focus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="leadership">Leadership & Management</SelectItem>
                                    <SelectItem value="general">General Performance</SelectItem>
                                    <SelectItem value="culture">Cultural Alignment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setIsCreateModalOpen(false); alert("Cycle Created Successfully!"); }}>Launch Cycle</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Feedback360;
