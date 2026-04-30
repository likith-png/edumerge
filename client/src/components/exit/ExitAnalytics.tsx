import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { 
    BarChart2, PieChart, TrendingUp, AlertTriangle, Users, 
    Activity, ShieldAlert, BarChart, Zap, ChevronRight,
    Target, BrainCircuit, LineChart
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const ExitAnalytics: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/exit/analytics/dashboard');
                const result = await response.json();
                setData(result.data);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-48 animate-in fade-in duration-500">
                <div className="p-4 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-100 mb-6">
                    <Activity className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Generating Analytics</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compiling attrition patterns...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-32 space-y-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analytics Data Unavailable</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-2">
            <div className="flex items-center justify-between bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="p-3.5 bg-slate-900 rounded-lg shadow-md">
                        <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">
                            Attrition Analytics
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Institutional Sentiment & Feedback Intelligence
                        </p>
                    </div>
                </div>
                <Badge className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-wider border-none">
                    Live Data
                </Badge>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                    <CardContent className="p-8 flex items-center justify-between">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attrition Rate</p>
                            <h3 className="text-4xl font-bold text-slate-900 tracking-tight leading-none">12.5%</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-3 h-3" /> Projected Annualized
                            </p>
                        </div>
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                    <CardContent className="p-8 flex items-center justify-between">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Sentiment</p>
                            <h3 className="text-4xl font-bold text-slate-900 tracking-tight leading-none">3.2<span className="text-base text-slate-300 ml-1">/ 5</span></h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <BrainCircuit className="w-3 h-3" /> Emotional Response
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 text-slate-600 rounded-xl">
                            <PieChart className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                    <CardContent className="p-8 flex items-center justify-between">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Regrettable Loss</p>
                            <h3 className="text-4xl font-bold text-slate-900 tracking-tight leading-none">
                                {data.risk_profile?.find((r: any) => r.risk_rating === 'High')?.count || 0}
                            </h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldAlert className="w-3 h-3" /> High Impact Exits
                            </p>
                        </div>
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Operational Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: 'Pending NOCs', val: data.operational_metrics?.pending_nocs || 0, icon: ShieldAlert, color: 'slate' },
                    { label: 'Settlements', val: data.operational_metrics?.pending_settlements || 0, icon: Target, color: 'slate' },
                    { label: 'Handovers', val: data.operational_metrics?.pending_handovers || 0, icon: Zap, color: 'slate' },
                    { label: 'Academic Risk', val: data.academic_risk?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0, icon: AlertTriangle, color: 'rose' }
                ].map((m, i) => (
                    <Card key={i} className={`bg-white border rounded-xl shadow-sm ${m.color === 'rose' ? 'border-rose-100 bg-rose-50/50' : 'border-slate-200'} transition-all duration-300`}>
                        <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-2">
                            <span className={`text-3xl font-bold tracking-tight ${m.color === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{m.val}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${m.color === 'rose' ? 'text-rose-400' : 'text-slate-400'}`}>{m.label}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Attrition by Dept */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-slate-900" />
                                Departmental Volume
                            </div>
                            <BarChart className="w-5 h-5 text-slate-300" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-6">
                            {data.attrition_by_dept?.map((item: any, idx: number) => {
                                const isAcademicRisk = data.academic_risk?.find((r: any) => r.department === item.department);
                                return (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${['bg-slate-900', 'bg-slate-600', 'bg-slate-400'][idx % 3]}`}></div>
                                                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">{item.department}</span>
                                                {isAcademicRisk && (
                                                    <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] px-2 py-0.5 rounded-full flex items-center">
                                                        Risk: {isAcademicRisk.count}
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-base font-bold text-slate-900">{item.count}</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${['bg-slate-900', 'bg-slate-600', 'bg-slate-400'][idx % 3]} rounded-full transition-all duration-1000`}
                                                style={{ width: `${Math.min(item.count * 10, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sentiment Analysis */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="w-5 h-5 text-slate-900" />
                                Sentiment Analysis
                            </div>
                            <LineChart className="w-5 h-5 text-slate-300" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-8">
                            {data.sentiment_by_category?.map((item: any) => (
                                <div key={item.category} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Metric Context</span>
                                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight mt-0.5">{item.category}</p>
                                        </div>
                                        <Badge className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border-none
                                            ${item.avg_rating >= 4 ? 'bg-emerald-100 text-emerald-700' :
                                              item.avg_rating >= 3 ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {item.avg_rating.toFixed(1)} / 5
                                        </Badge>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                item.avg_rating >= 4 ? 'bg-emerald-500' :
                                                item.avg_rating >= 3 ? 'bg-orange-500' : 'bg-rose-500'
                                            }`}
                                            style={{ width: `${(item.avg_rating / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Exit Reasons */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight">Exit Reasons Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-wrap gap-4">
                        {data.top_reasons?.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className={`px-6 py-4 rounded-xl font-bold text-[10px] uppercase tracking-wider border flex items-center gap-4 transition-all hover:border-slate-300 shadow-sm
                                    ${idx === 0 ? 'bg-slate-900 border-slate-900 text-white shadow-md' :
                                      'bg-white border-slate-100 text-slate-600'}
                                `}
                            >
                                <span>{item.reason}</span>
                                <Badge className={`px-2 py-0.5 rounded text-[9px]
                                    ${idx === 0 ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
                                    {item.count}
                                </Badge>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExitAnalytics;
