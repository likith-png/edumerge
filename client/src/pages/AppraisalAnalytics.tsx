import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { PieChart, TrendingUp, TrendingDown, Users, Award, AlertTriangle, Calendar } from 'lucide-react';

const AppraisalAnalytics: React.FC = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [selectedYear, setSelectedYear] = useState<string>('2024-25');

    // Mock Analytics Data
    const overallStats = {
        totalFaculty: 45,
        completionRate: 82,
        averageScore: 4.1,
        highPerformers: 12,
        needsImprovement: 5
    };

    const departmentData = [
        { name: 'Computer Science', faculty: 12, avgScore: 4.3, completion: 92 },
        { name: 'Electronics', faculty: 10, avgScore: 4.0, completion: 80 },
        { name: 'Mechanical', faculty: 8, avgScore: 3.9, completion: 75 },
        { name: 'Civil', faculty: 7, avgScore: 4.2, completion: 86 },
        { name: 'Mathematics', faculty: 8, avgScore: 4.4, completion: 100 }
    ];

    const performanceDistribution = [
        { range: '4.5-5.0 (Outstanding)', count: 12, percentage: 27, color: 'bg-green-600' },
        { range: '4.0-4.4 (Excellent)', count: 18, percentage: 40, color: 'bg-blue-600' },
        { range: '3.5-3.9 (Good)', count: 10, percentage: 22, color: 'bg-amber-600' },
        { range: '3.0-3.4 (Satisfactory)', count: 3, percentage: 7, color: 'bg-orange-600' },
        { range: '<3.0 (Needs Improvement)', count: 2, percentage: 4, color: 'bg-red-600' }
    ];

    const topPerformers = [
        { name: 'Ms. Reshma Binu Prasad', dept: 'Computer Science', score: 4.8, krasExcelled: 7 },
        { name: 'Ms. Sanchaiyata Majumdar', dept: 'Mathematics', score: 4.7, krasExcelled: 7 },
        { name: 'Dr. R Sedhunivas', dept: 'Electronics', score: 4.6, krasExcelled: 6 }
    ];

    const improvementNeeded = [
        { name: 'Dr. Ranjita Saikia', dept: 'Mechanical', score: 2.8, concernArea: 'Student Feedback' },
        { name: 'Mr. Manjit Singh', dept: 'Civil', score: 3.1, concernArea: 'Research Output' }
    ];

    return (
        <Layout title="Analytics & Governance Dashboard" description="Performance insights and institutional analytics" icon={PieChart} showBack>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024-25">AY 2024-25</SelectItem>
                        <SelectItem value="2023-24">AY 2023-24</SelectItem>
                        <SelectItem value="2022-23">AY 2022-23</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="ec">Electronics</SelectItem>
                        <SelectItem value="me">Mechanical</SelectItem>
                        <SelectItem value="ce">Civil</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <Card className="border-slate-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-slate-900">{overallStats.totalFaculty}</div>
                                <div className="text-xs text-slate-600">Total Faculty</div>
                            </div>
                            <Users className="h-8 w-8 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-blue-900">{overallStats.completionRate}%</div>
                                <div className="text-xs text-blue-700">Completion Rate</div>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-green-900">{overallStats.averageScore.toFixed(1)}/5.0</div>
                                <div className="text-xs text-green-700">Average Score</div>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-amber-900">{overallStats.highPerformers}</div>
                                <div className="text-xs text-amber-700">High Performers</div>
                            </div>
                            <Award className="h-8 w-8 text-amber-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-red-900">{overallStats.needsImprovement}</div>
                                <div className="text-xs text-red-700">Needs Improvement</div>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gapx-4 py-4">
                {/* Department Performance Heatmap */}
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base">Department-wise Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {departmentData.map((dept) => (
                                <div key={dept.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-700">{dept.name}</span>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="text-slate-600">{dept.faculty} faculty</span>
                                            <Badge variant="outline" className={`${dept.avgScore >= 4.2 ? 'bg-green-50 text-green-700' :
                                                dept.avgScore >= 4.0 ? 'bg-blue-50 text-blue-700' :
                                                    'bg-amber-50 text-amber-700'
                                                }`}>
                                                {dept.avgScore.toFixed(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${dept.avgScore >= 4.2 ? 'bg-green-600' :
                                                    dept.avgScore >= 4.0 ? 'bg-blue-600' :
                                                        'bg-amber-600'
                                                    }`}
                                                style={{ width: `${(dept.avgScore / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500 w-12">{dept.completion}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Distribution */}
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base">Performance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {performanceDistribution.map((band) => (
                                <div key={band.range} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-700">{band.range}</span>
                                        <span className="font-semibold text-slate-900">{band.count}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${band.color}`}
                                                style={{ width: `${band.percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500 w-12">{band.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performers */}
                <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Award className="h-5 w-5 text-green-600" />
                            Top Performers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topPerformers.map((performer, index) => (
                                <div key={performer.name} className="bg-white rounded-lg p-3 border border-green-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-600 text-white text-[10px]">#{index + 1}</Badge>
                                                <h4 className="font-semibold text-sm text-slate-900">{performer.name}</h4>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1">{performer.dept}</p>
                                            <p className="text-xs text-green-700 mt-1">Excelled in {performer.krasExcelled}/7 KRAs</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-green-900">{performer.score}</div>
                                            <TrendingUp className="h-4 w-4 text-green-600 ml-auto" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Improvement Needed */}
                <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Requires Attention
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {improvementNeeded.map((person) => (
                                <div key={person.name} className="bg-white rounded-lg p-3 border border-red-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-slate-900">{person.name}</h4>
                                            <p className="text-xs text-slate-600 mt-1">{person.dept}</p>
                                            <p className="text-xs text-red-700 mt-1">⚠ {person.concernArea}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-red-900">{person.score}</div>
                                            <TrendingDown className="h-4 w-4 text-red-600 ml-auto" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Insights Summary */}
            <Card className="mt-6 border-blue-200 bg-blue-50">
                <CardHeader>
                    <CardTitle className="text-base">Key Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <p className="text-blue-900"><strong>Mathematics dept</strong> shows 100% completion with highest avg score (4.4) - Best practices should be shared institution-wide.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <p className="text-blue-900"><strong>Mechanical dept</strong> completion at 75% - Follow-up required with pending faculty.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <p className="text-blue-900"><strong>2 faculty</strong> below 3.0 threshold - Initiate Performance Improvement Plan (PIP) and mentoring.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <p className="text-blue-900"><strong>27% faculty</strong> in Outstanding category (4.5+) - Eligible for Excellence Awards and leadership opportunities.</p>
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default AppraisalAnalytics;
