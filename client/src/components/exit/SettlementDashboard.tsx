import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
    Banknote, CheckCircle, Clock, DollarSign,
    TrendingUp, TrendingDown, Edit, Send
} from 'lucide-react';
import {
    calculateSettlement,
    getSettlementDetails,
    updateSettlement,
    approveSettlement,
    processPayment,
    sendSettlementNotification
} from '../../services/settlementService';

interface SettlementDashboardProps {
    exitId: number;
    viewMode: string; // 'Admin', 'Faculty', 'Manager'
}

const SettlementDashboard: React.FC<SettlementDashboardProps> = ({ exitId, viewMode }) => {
    const [settlement, setSettlement] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => {
        fetchSettlement();
    }, [exitId]);

    const fetchSettlement = async () => {
        setLoading(true);
        try {
            const data = await getSettlementDetails(exitId);
            setSettlement(data.data);
            setEditData(data.data || {});
        } catch (error) {
            console.log('No settlement found yet');
            setSettlement(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            // Prompt for employee salary and leaves
            const salary = prompt('Enter Monthly Salary (₹):');
            const leaves = prompt('Enter Pending Leaves (days):');

            const overrides: any = {};
            if (salary) overrides.monthly_salary = parseFloat(salary);
            if (leaves) overrides.pending_leaves = parseFloat(leaves);

            await calculateSettlement(exitId, overrides);
            alert('Settlement calculated successfully');
            fetchSettlement();
        } catch (error: any) {
            alert(error.message || 'Failed to calculate settlement');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateSettlement(exitId, editData);
            alert('Settlement updated successfully');
            setIsEditing(false);
            fetchSettlement();
        } catch (error: any) {
            alert(error.message || 'Failed to update settlement');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!confirm('Are you sure you want to approve this settlement?')) return;
        setLoading(true);
        try {
            await approveSettlement(exitId);
            alert('Settlement approved successfully');
            fetchSettlement();
        } catch (error: any) {
            alert(error.message || 'Failed to approve settlement');
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayment = async () => {
        const reference = prompt('Enter Payment Reference Number:');
        if (!reference) return;

        setLoading(true);
        try {
            await processPayment(exitId, reference);
            alert('Settlement marked as paid');
            fetchSettlement();
        } catch (error: any) {
            alert(error.message || 'Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    const handleNotify = async () => {
        setLoading(true);
        try {
            const result = await sendSettlementNotification(exitId);
            alert(`Settlement notification sent to ${result.email}`);
        } catch (error: any) {
            alert(error.message || 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            'Pending': 'bg-gray-100 text-gray-700',
            'Calculated': 'bg-blue-100 text-blue-700',
            'Approved': 'bg-green-100 text-green-700',
            'Paid': 'bg-emerald-100 text-emerald-700'
        };
        return styles[status as keyof typeof styles] || styles.Pending;
    };

    const timeline = settlement ? [
        { label: 'Calculated', status: settlement.status !== 'Pending' ? 'completed' : 'pending', date: settlement.calculated_date },
        { label: 'Approved', status: settlement.status === 'Approved' || settlement.status === 'Paid' ? 'completed' : settlement.status === 'Calculated' ? 'current' : 'pending', date: settlement.approved_date },
        { label: 'Payment Processed', status: settlement.status === 'Paid' ? 'completed' : settlement.status === 'Approved' ? 'current' : 'pending', date: settlement.payment_date }
    ] : [];

    if (loading && !settlement) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!settlement) {
        return (
            <Card className="border-dashed">
                <CardContent className="text-center py-12">
                    <Banknote className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Settlement Calculated Yet</h3>
                    <p className="text-sm text-slate-500 mb-6">Calculate the full & final settlement for this exit</p>
                    {viewMode === 'Admin' && (
                        <Button onClick={handleCalculate} className="bg-indigo-600 hover:bg-indigo-700">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Calculate Settlement
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    const isHR = viewMode === 'Admin';
    const canEdit = isHR && settlement.status === 'Calculated';
    const canApprove = isHR && settlement.status === 'Calculated';
    const canProcess = isHR && settlement.status === 'Approved';

    return (
        <div className="space-y-6">
            {/* Header with Status */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Full & Final Settlement</h2>
                    <p className="text-sm text-slate-500 mt-1">{settlement.employee_name} • {settlement.department}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusBadge(settlement.status)}`}>
                        {settlement.status}
                    </span>
                    {isHR && (
                        <div className="flex gap-2">
                            {settlement.status === 'Calculated' && (
                                <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    {isEditing ? 'Cancel Edit' : 'Edit'}
                                </Button>
                            )}
                            {canApprove && !isEditing && (
                                <Button size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                </Button>
                            )}
                            {canProcess && (
                                <Button size="sm" onClick={handleProcessPayment} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Banknote className="w-4 h-4 mr-1" />
                                    Mark Paid
                                </Button>
                            )}
                            {(settlement.status === 'Approved' || settlement.status === 'Paid') && (
                                <Button size="sm" variant="outline" onClick={handleNotify}>
                                    <Send className="w-4 h-4 mr-1" />
                                    Send to Employee
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Net Settlement Amount - Prominent Display */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardContent className="p-8 text-center">
                    <p className="text-sm font-medium text-indigo-600 mb-2">Net Settlement Amount</p>
                    <h1 className="text-5xl font-bold text-slate-900 mb-2">
                        ₹{settlement.net_settlement?.toLocaleString('en-IN') || '0'}
                    </h1>
                    {settlement.payment_date && (
                        <p className="text-sm text-slate-600">Paid on {new Date(settlement.payment_date).toLocaleDateString()}</p>
                    )}
                </CardContent>
            </Card>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Card */}
                <Card>
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <CardTitle className="flex items-center gap-2 text-green-800">
                            <TrendingUp className="w-5 h-5" />
                            Earnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[
                                { label: 'Salary Due', value: settlement.salary_due, detail: 'Pro-rata salary' },
                                { label: 'Leave Encashment', value: settlement.leave_encashment, detail: `${settlement.pending_leaves || 0} days` },
                                { label: 'Bonus', value: settlement.bonus, detail: settlement.bonus_remarks },
                                { label: 'Gratuity', value: settlement.gratuity, detail: settlement.gratuity_eligible ? `${settlement.years_of_service} years` : 'Not eligible' },
                                { label: 'PF Amount', value: settlement.pf_amount, detail: 'Provident Fund' },
                                { label: 'ESI', value: settlement.esi_amount, detail: 'Employee State Insurance' },
                                { label: 'Other Dues', value: settlement.other_dues, detail: settlement.other_dues_remarks }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                        {item.detail && <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>}
                                    </div>
                                    {isEditing && canEdit ? (
                                        <input
                                            type="number"
                                            className="w-24 px-2 py-1 border rounded text-right text-sm"
                                            value={editData[item.label.toLowerCase().replace(/ /g, '_')] || 0}
                                            onChange={(e) => setEditData({ ...editData, [item.label.toLowerCase().replace(/ /g, '_')]: parseFloat(e.target.value) || 0 })}
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-green-700">₹{item.value?.toLocaleString('en-IN') || '0'}</span>
                                    )}
                                </div>
                            ))}
                            <div className="pt-3 border-t-2 border-green-200 mt-4">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-green-800">Gross Settlement</p>
                                    <p className="text-lg font-bold text-green-800">₹{settlement.gross_settlement?.toLocaleString('en-IN') || '0'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Deductions Card */}
                <Card>
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                        <CardTitle className="flex items-center gap-2 text-red-800">
                            <TrendingDown className="w-5 h-5" />
                            Deductions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[
                                { label: 'Notice Shortfall', value: settlement.notice_shortfall_deduction, detail: 'Notice period buyout' },
                                { label: 'Advances', value: settlement.advance_deductions, detail: 'Salary advances' },
                                { label: 'Other Deductions', value: settlement.other_deductions, detail: settlement.deduction_remarks }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                        {item.detail && <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>}
                                    </div>
                                    {isEditing && canEdit ? (
                                        <input
                                            type="number"
                                            className="w-24 px-2 py-1 border rounded text-right text-sm"
                                            value={editData[item.label.toLowerCase().replace(/ /g, '_')] || 0}
                                            onChange={(e) => setEditData({ ...editData, [item.label.toLowerCase().replace(/ /g, '_')]: parseFloat(e.target.value) || 0 })}
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-red-700">₹{item.value?.toLocaleString('en-IN') || '0'}</span>
                                    )}
                                </div>
                            ))}
                            <div className="pt-3 border-t-2 border-red-200 mt-4">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-red-800">Total Deductions</p>
                                    <p className="text-lg font-bold text-red-800">₹{settlement.total_deductions?.toLocaleString('en-IN') || '0'}</p>
                                </div>
                            </div>
                        </div>

                        {isEditing && canEdit && (
                            <div className="mt-6 pt-6 border-t">
                                <Button onClick={handleUpdate} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Timeline Section */}
            <Card>
                <CardHeader>
                    <button
                        onClick={() => setShowTimeline(!showTimeline)}
                        className="w-full flex items-center justify-between text-left"
                    >
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Settlement Timeline
                        </CardTitle>
                        <span className="text-sm text-indigo-600">{showTimeline ? '▼' : '▶'} {showTimeline ? 'Hide' : 'Show'}</span>
                    </button>
                </CardHeader>
                {showTimeline && (
                    <CardContent className="p-6">
                        <div className="relative pl-8 border-l-2 border-slate-200 ml-2 space-y-6">
                            {timeline.map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[37px] w-6 h-6 rounded-full border-2 flex items-center justify-center ${step.status === 'completed' ? 'bg-green-500 border-green-500' :
                                        step.status === 'current' ? 'bg-indigo-500 border-indigo-500 animate-pulse' :
                                            'bg-slate-200 border-slate-300'
                                        }`}>
                                        {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                                        {step.status === 'current' && <Clock className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className={`pb-6 ${step.status === 'current' ? 'bg-indigo-50 -ml-6 pl-6 pr-4 py-3 rounded-r-lg' : ''}`}>
                                        <p className={`text-sm font-semibold ${step.status === 'completed' ? 'text-green-700' :
                                            step.status === 'current' ? 'text-indigo-700' :
                                                'text-slate-400'
                                            }`}>
                                            {step.label}
                                        </p>
                                        {step.date && (
                                            <p className="text-xs text-slate-500 mt-1">{new Date(step.date).toLocaleString()}</p>
                                        )}
                                        {step.status === 'current' && (
                                            <p className="text-xs text-indigo-600 mt-1 font-medium">⏳ Awaiting action</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Employee Info */}
            <Card className="bg-slate-50">
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Monthly Salary</p>
                            <p className="font-semibold">₹{settlement.monthly_salary?.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Years of Service</p>
                            <p className="font-semibold">{settlement.years_of_service} years</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Joining Date</p>
                            <p className="font-semibold">{settlement.joining_date && new Date(settlement.joining_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Last Working Day</p>
                            <p className="font-semibold">{settlement.lwd_approved && new Date(settlement.lwd_approved).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettlementDashboard;
