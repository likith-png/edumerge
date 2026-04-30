import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Scale, AlertCircle, Lock } from 'lucide-react';

interface EmployeeRating {
    id: string;
    name: string;
    employeeId: string;
    department: string;
    role: string;
    hodRating: number;
    normalizedRating: number;
    performanceBand: string;
    recommendedIncrement: number;
    flagged: boolean;
}

const CalibrationDashboard: React.FC = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
    const [calibrationMode, setCalibrationMode] = useState<'view' | 'calibrate'>('view');

    const employeeRatings: EmployeeRating[] = [
        {
            id: 'e1',
            name: 'Ms. Reshma Binu Prasad',
            employeeId: 'FAC001',
            department: 'Computer Science',
            role: 'Assistant Professor',
            hodRating: 4.8,
            normalizedRating: 4.7,
            performanceBand: 'Outstanding',
            recommendedIncrement: 15,
            flagged: false
        },
        {
            id: 'e2',
            name: 'Ms. Sanchaiyata Majumdar',
            employeeId: 'FAC002',
            department: 'Computer Science',
            role: 'Associate Professor',
            hodRating: 4.9,
            normalizedRating: 4.8,
            performanceBand: 'Outstanding',
            recommendedIncrement: 15,
            flagged: true
        },
        {
            id: 'e3',
            name: 'Dr. R Sedhunivas',
            employeeId: 'FAC003',
            department: 'Mechanical',
            role: 'Assistant Professor',
            hodRating: 4.5,
            normalizedRating: 4.3,
            performanceBand: 'Excellent',
            recommendedIncrement: 10,
            flagged: false
        }
    ];

    const departments = ['All', 'Computer Science', 'Mechanical', 'Civil', 'Electronics'];

    const filteredRatings =
        selectedDepartment === 'All'
            ? employeeRatings
            : employeeRatings.filter((e) => e.department === selectedDepartment);

    const distributionStats = {
        outstanding: filteredRatings.filter((e) => e.performanceBand === 'Outstanding').length,
        excellent: filteredRatings.filter((e) => e.performanceBand === 'Excellent').length,
        good: filteredRatings.filter((e) => e.performanceBand === 'Good').length,
        satisfactory: filteredRatings.filter((e) => e.performanceBand === 'Satisfactory').length
    };

    const totalCount = filteredRatings.length;

    const getPercentage = (count: number) => ((count / totalCount) * 100).toFixed(0);

    const handleNormalize = () => {
        alert('Normalization applied! Ratings adjusted according to bell curve distribution.');
        setCalibrationMode('view');
    };

    const handleFinalize = () => {
        alert('Calibration finalized and locked! Ratings can no longer be modified.');
    };

    return (
        <Layout
            title="Calibration & Normalization"
            description="Standardize ratings across departments"
            icon={Scale}
            showBack
        >
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Label className="text-sm">Department:</Label>
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                    >
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    {calibrationMode === 'view' ? (
                        <Button
                            onClick={() => setCalibrationMode('calibrate')}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                            <Scale className="h-4 w-4" />
                            Start Calibration
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setCalibrationMode('view')}>
                                Cancel
                            </Button>
                            <Button onClick={handleNormalize} className="bg-purple-600 hover:bg-purple-700">
                                Apply Normalization
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Distribution Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-green-900">
                            {distributionStats.outstanding}
                        </div>
                        <div className="text-xs text-green-700">Outstanding ({getPercentage(distributionStats.outstanding)}%)</div>
                        <div className="text-[10px] text-green-600 mt-1">Target: 10-15%</div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-blue-900">
                            {distributionStats.excellent}
                        </div>
                        <div className="text-xs text-blue-700">Excellent ({getPercentage(distributionStats.excellent)}%)</div>
                        <div className="text-[10px] text-blue-600 mt-1">Target: 20-30%</div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-amber-900">{distributionStats.good}</div>
                        <div className="text-xs text-amber-700">Good ({getPercentage(distributionStats.good)}%)</div>
                        <div className="text-[10px] text-amber-600 mt-1">Target: 40-50%</div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-slate-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-slate-900">
                            {distributionStats.satisfactory}
                        </div>
                        <div className="text-xs text-slate-700">Satisfactory ({getPercentage(distributionStats.satisfactory)}%)</div>
                        <div className="text-[10px] text-slate-600 mt-1">Target: 10-20%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Bell Curve Visualization */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-base">Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-32 text-sm">Outstanding</div>
                            <div className="flex-1 h-8 bg-slate-100 rounded overflow-hidden">
                                <div
                                    className="h-full bg-green-600 transition-all flex items-center justify-end pr-2"
                                    style={{ width: `${getPercentage(distributionStats.outstanding)}%` }}
                                >
                                    <span className="text-xs text-white font-semibold">
                                        {getPercentage(distributionStats.outstanding)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-32 text-sm">Excellent</div>
                            <div className="flex-1 h-8 bg-slate-100 rounded overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all flex items-center justify-end pr-2"
                                    style={{ width: `${getPercentage(distributionStats.excellent)}%` }}
                                >
                                    <span className="text-xs text-white font-semibold">
                                        {getPercentage(distributionStats.excellent)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-32 text-sm">Good</div>
                            <div className="flex-1 h-8 bg-slate-100 rounded overflow-hidden">
                                <div
                                    className="h-full bg-amber-600 transition-all flex items-center justify-end pr-2"
                                    style={{ width: `${getPercentage(distributionStats.good)}%` }}
                                >
                                    <span className="text-xs text-white font-semibold">
                                        {getPercentage(distributionStats.good)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-32 text-sm">Satisfactory</div>
                            <div className="flex-1 h-8 bg-slate-100 rounded overflow-hidden">
                                <div
                                    className="h-full bg-slate-600 transition-all flex items-center justify-end pr-2"
                                    style={{ width: `${getPercentage(distributionStats.satisfactory)}%` }}
                                >
                                    <span className="text-xs text-white font-semibold">
                                        {getPercentage(distributionStats.satisfactory)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Employee Ratings Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Employee Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left p-2">Employee</th>
                                    <th className="text-left p-2">Department</th>
                                    <th className="text-center p-2">HOD Rating</th>
                                    <th className="text-center p-2">Normalized</th>
                                    <th className="text-center p-2">Band</th>
                                    <th className="text-center p-2">Increment %</th>
                                    <th className="text-center p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRatings.map((employee) => (
                                    <tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                {employee.flagged && (
                                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                                )}
                                                <div>
                                                    <div className="font-medium">{employee.name}</div>
                                                    <div className="text-xs text-slate-500">{employee.employeeId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-2 text-slate-600">{employee.department}</td>
                                        <td className="p-2 text-center">
                                            {calibrationMode === 'calibrate' ? (
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    defaultValue={employee.hodRating}
                                                    className="w-16 text-center"
                                                />
                                            ) : (
                                                <span className="font-semibold">{employee.hodRating.toFixed(1)}</span>
                                            )}
                                        </td>
                                        <td className="p-2 text-center">
                                            <Badge className="bg-purple-100 text-purple-900">
                                                {employee.normalizedRating.toFixed(1)}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-center">
                                            <Badge
                                                className={`${employee.performanceBand === 'Outstanding'
                                                    ? 'bg-green-100 text-green-800'
                                                    : employee.performanceBand === 'Excellent'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                    }`}
                                            >
                                                {employee.performanceBand}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-center font-semibold text-green-700">
                                            {employee.recommendedIncrement}%
                                        </td>
                                        <td className="p-2 text-center">
                                            {calibrationMode === 'calibrate' && (
                                                <Button variant="outline" size="sm">
                                                    Adjust
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Finalize Section */}
                    {calibrationMode === 'view' && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-green-900">Ready to Finalize?</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        Once finalized, ratings will be locked and increment processing can begin
                                    </p>
                                </div>
                                <Button
                                    onClick={handleFinalize}
                                    className="bg-green-600 hover:bg-green-700 gap-2"
                                >
                                    <Lock className="h-4 w-4" />
                                    Finalize Calibration
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Layout>
    );
};

export default CalibrationDashboard;
