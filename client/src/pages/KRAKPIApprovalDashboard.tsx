import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Target, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { teachingStaffKRAs, kpiLibrary, type KRA, type KPI } from '../services/appraisalService';

const KRAKPIApprovalDashboard: React.FC = () => {
    // In a real app, these would be fetched from the backend prioritizing 'Pending Review' items
    const [pendingKRAs, setPendingKRAs] = useState<KRA[]>(
        teachingStaffKRAs.filter(kra => kra.status === 'Pending Review')
    );
    const [pendingKPIs, setPendingKPIs] = useState<KPI[]>(
        kpiLibrary.filter(kpi => kpi.status === 'Pending Review')
    );

    const [activeTab, setActiveTab] = useState<'kra' | 'kpi'>('kra');
    const [selectedKRA, setSelectedKRA] = useState<KRA | null>(null);
    const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
    const [comments, setComments] = useState('');

    const handleApproveKRA = (kra: KRA) => {
        alert(`Approved KRA: ${kra.title}`);
        setPendingKRAs(prev => prev.filter(k => k.id !== kra.id));
        setSelectedKRA(null);
        setComments('');
    };

    const handleRejectKRA = (kra: KRA) => {
        if (!comments.trim()) {
            alert("Feedback is required to reject.");
            return;
        }
        alert(`Rejected KRA: ${kra.title}`);
        setPendingKRAs(prev => prev.filter(k => k.id !== kra.id));
        setSelectedKRA(null);
        setComments('');
    };

    const handleApproveKPI = (kpi: KPI) => {
        alert(`Approved KPI: ${kpi.title}`);
        setPendingKPIs(prev => prev.filter(k => k.id !== kpi.id));
        setSelectedKPI(null);
        setComments('');
    };

    const handleRejectKPI = (kpi: KPI) => {
        if (!comments.trim()) {
            alert("Feedback is required to reject.");
            return;
        }
        alert(`Rejected KPI: ${kpi.title}`);
        setPendingKPIs(prev => prev.filter(k => k.id !== kpi.id));
        setSelectedKPI(null);
        setComments('');
    };

    return (
        <Layout
            title="KRA & KPI Approvals"
            description="Review and approve pending Key Result Areas and Key Performance Indicators."
            icon={Target}
            showBack
        >
            <div className="flex gap-4 mb-4">
                <Button
                    variant={activeTab === 'kra' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('kra')}
                    className={activeTab === 'kra' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                    <Target className="h-4 w-4 mr-2" /> Pending KRAs ({pendingKRAs.length})
                </Button>
                <Button
                    variant={activeTab === 'kpi' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('kpi')}
                    className={activeTab === 'kpi' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                >
                    <Activity className="h-4 w-4 mr-2" /> Pending KPIs ({pendingKPIs.length})
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gapx-4 py-4">
                {/* List View */}
                <div className="space-y-4">
                    {activeTab === 'kra' ? (
                        pendingKRAs.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-lg">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-slate-600">No pending KRAs to review.</p>
                            </div>
                        ) : (
                            pendingKRAs.map(kra => (
                                <Card
                                    key={kra.id}
                                    className={`cursor-pointer border-slate-200 hover:shadow-sm transition-all ${selectedKRA?.id === kra.id ? 'ring-2 ring-blue-500' : ''}`}
                                    onClick={() => setSelectedKRA(kra)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{kra.title}</h3>
                                                <p className="text-sm text-slate-600 mt-1">{kra.category}</p>
                                            </div>
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Pending
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )
                    ) : (
                        pendingKPIs.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-lg">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-slate-600">No pending KPIs to review.</p>
                            </div>
                        ) : (
                            pendingKPIs.map(kpi => (
                                <Card
                                    key={kpi.id}
                                    className={`cursor-pointer border-slate-200 hover:shadow-sm transition-all ${selectedKPI?.id === kpi.id ? 'ring-2 ring-indigo-500' : ''}`}
                                    onClick={() => setSelectedKPI(kpi)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{kpi.title}</h3>
                                                <p className="text-sm text-slate-600 mt-1">Target: {kpi.target}{kpi.unit}</p>
                                            </div>
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Pending
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )
                    )}
                </div>

                {/* Details / Review Panel */}
                <div>
                    {activeTab === 'kra' && selectedKRA && (
                        <Card className="border-slate-200 sticky top-4">
                            <CardHeader className="bg-blue-50 border-b border-blue-100 pb-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle>Review KRA</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Title</div>
                                    <div className="font-semibold">{selectedKRA.title}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Category</div>
                                        <Badge variant="outline">{selectedKRA.category}</Badge>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Weightage</div>
                                        <div className="font-semibold">{selectedKRA.weightage}%</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Description</div>
                                    <p className="text-sm bg-slate-50 p-3 rounded border border-slate-100">{selectedKRA.description}</p>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Applicable Roles</div>
                                    <div className="flex gap-1 flex-wrap">
                                        {selectedKRA.applicableRoles.map(role => (
                                            <Badge key={role} variant="secondary" className="text-[10px]">{role}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="text-xs font-semibold mb-2">Review Comments</div>
                                    <Textarea
                                        placeholder="Add comments or feedback for this KRA..."
                                        value={comments}
                                        onChange={e => setComments(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRejectKRA(selectedKRA)}>
                                            <XCircle className="h-4 w-4 mr-2" /> Reject & Return
                                        </Button>
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleApproveKRA(selectedKRA)}>
                                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'kpi' && selectedKPI && (
                        <Card className="border-slate-200 sticky top-4">
                            <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle>Review KPI</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Title</div>
                                    <div className="font-semibold">{selectedKPI.title}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Target Value</div>
                                        <div className="font-semibold">{selectedKPI.target} {selectedKPI.unit}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Benchmark Type</div>
                                        <Badge variant="outline">{selectedKPI.benchmarkType}</Badge>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Description</div>
                                    <p className="text-sm bg-slate-50 p-3 rounded border border-slate-100">{selectedKPI.description}</p>
                                </div>
                                {selectedKPI.formula && (
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Formula</div>
                                        <code className="text-xs bg-slate-100 p-2 rounded block border border-slate-200">{selectedKPI.formula}</code>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <div className="text-xs font-semibold mb-2">Review Comments</div>
                                    <Textarea
                                        placeholder="Add comments or feedback for this KPI..."
                                        value={comments}
                                        onChange={e => setComments(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRejectKPI(selectedKPI)}>
                                            <XCircle className="h-4 w-4 mr-2" /> Reject & Return
                                        </Button>
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleApproveKPI(selectedKPI)}>
                                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!selectedKRA && activeTab === 'kra' && pendingKRAs.length > 0 && (
                        <div className="text-center p-8 text-slate-500">
                            Select a pending KRA from the list to review it.
                        </div>
                    )}

                    {!selectedKPI && activeTab === 'kpi' && pendingKPIs.length > 0 && (
                        <div className="text-center p-8 text-slate-500">
                            Select a pending KPI from the list to review it.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default KRAKPIApprovalDashboard;
