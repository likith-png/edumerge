
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart2, PieChart, TrendingUp, AlertTriangle, Users } from 'lucide-react';

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

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Analytics...</div>;
    if (!data) return <div className="p-8 text-center text-slate-500">No data available</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" /> Attrition Analytics & Insights
            </h2>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-orange-100">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-orange-600 uppercase">Attrition Rate</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">12.5%</h3>
                            <p className="text-xs text-slate-500 mt-1">Expected Annualized</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-full">
                            <TrendingUp className="w-6 h-6 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-blue-600 uppercase">Avg Sentiment</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">3.2 / 5</h3>
                            <p className="text-xs text-slate-500 mt-1">Based on Exit Surveys</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-full">
                            <PieChart className="w-6 h-6 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 uppercase">Regrettable Loss</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                {data.risk_profile?.find((r: any) => r.risk_rating === 'High')?.count || 0}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">High Impact Exits</p>
                        </div>
                        <div className="p-3 bg-white/60 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Operational Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white border-slate-200">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-slate-700">{data.operational_metrics?.pending_nocs || 0}</span>
                        <span className="text-xs text-slate-500 font-medium uppercase mt-1">Pending NOCs</span>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-slate-700">{data.operational_metrics?.pending_settlements || 0}</span>
                        <span className="text-xs text-slate-500 font-medium uppercase mt-1">Pending Settlements</span>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-slate-700">{data.operational_metrics?.pending_handovers || 0}</span>
                        <span className="text-xs text-slate-500 font-medium uppercase mt-1">Pending Handovers</span>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-red-700">
                            {data.academic_risk?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0}
                        </span>
                        <span className="text-xs text-red-600 font-medium uppercase mt-1">Academic High Risk Exits</span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attrition by Dept */}
                <Card className="border-slate-200">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3">
                        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center">
                            <Users className="w-4 h-4 mr-2" /> Attrition by Department
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {data.attrition_by_dept?.map((item: any, idx: number) => {
                                const isAcademicRisk = data.academic_risk?.find((r: any) => r.department === item.department);
                                return (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${['bg-blue-500', 'bg-indigo-500', 'bg-violet-500'][idx % 3]}`}></div>
                                            <span className="text-sm font-medium text-slate-700">{item.department}</span>
                                            {isAcademicRisk && (
                                                <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
                                                    <AlertTriangle className="w-3 h-3 mr-0.5" /> High Risk ({isAcademicRisk.count})
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${['bg-blue-500', 'bg-indigo-500', 'bg-violet-500'][idx % 3]} rounded-full`}
                                                    style={{ width: `${Math.min(item.count * 10, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 w-6 text-right">{item.count}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sentiment Analysis */}
                <Card className="border-slate-200">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3">
                        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center">
                            <BarChart2 className="w-4 h-4 mr-2" /> Sentiment by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            {data.sentiment_by_category?.map((item: any) => (
                                <div key={item.category}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-slate-600">{item.category}</span>
                                        <span className="font-bold text-slate-800">{item.avg_rating.toFixed(1)} / 5</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${item.avg_rating >= 4 ? 'bg-green-500' :
                                                item.avg_rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
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

            {/* Top Reasons */}
            <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Top Reasons for Leaving</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                        {data.top_reasons?.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2
                                    ${idx === 0 ? 'bg-red-50 border-red-100 text-red-700 text-lg' :
                                        idx === 1 ? 'bg-orange-50 border-orange-100 text-orange-700 text-base' :
                                            'bg-slate-50 border-slate-200 text-slate-600'}
                                `}
                            >
                                {item.reason}
                                <span className={`bg-white/50 px-1.5 rounded-full text-xs font-bold`}>{item.count}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExitAnalytics;
