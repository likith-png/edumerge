import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
    CheckCircle, Calendar, Settings, Star, Rocket,
    ArrowRight, ArrowLeft, Target, TrendingUp, Users, Award,
    CheckCircle2, AlertCircle, Info, Activity, History,
    Eye, Trash2, XCircle, ShieldCheck, Zap,
    ChevronRight, LayoutGrid, Clock, Sparkles, Plus,
    Banknote, DollarSign, TrendingDown, Edit, Send,
    Wallet, FileText, Search, Filter, Download, Printer,
    AlertTriangle, Building2, UserCircle2, Mail, Phone,
    ChevronDown
} from 'lucide-react';
import {
    calculateSettlement,
    getSettlementDetails,
    updateSettlement,
    approveSettlement,
    processPayment,
    sendSettlementNotification
} from '../../services/settlementService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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

    if (loading && !settlement) {
        return (
            <div className="flex flex-col items-center justify-center py-48 animate-in fade-in duration-500">
                <div className="p-4 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-100 mb-6">
                    <Wallet className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Processing Settlement</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Syncing fiscal registry...</p>
                </div>
            </div>
        );
    }

    if (!settlement) {
        return (
            <Card className="bg-white border-2 border-dashed border-slate-200 rounded-2xl shadow-sm">
                <CardContent className="text-center py-32 space-y-10">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center mx-auto shadow-inner border border-slate-100">
                        <Banknote className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">No Settlement Data</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">No calculations have been performed for this exit.</p>
                    </div>
                    {viewMode === 'Admin' && (
                        <Button 
                            onClick={handleCalculate} 
                            className="h-12 px-10 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
                        >
                            <DollarSign className="w-4 h-4 mr-2.5" />
                            Run Calculation
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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-2">
            {/* Header / Command Center */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="p-3.5 bg-slate-900 rounded-lg shadow-md">
                        <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Full & Final Settlement</h2>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-slate-100 text-slate-600 border-none px-3 py-0.5 rounded text-[9px] uppercase tracking-widest">{settlement.employee_name}</Badge>
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{settlement.department}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
                    <Badge className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border-none shadow-sm
                        ${settlement.status === 'Pending' ? 'bg-orange-500 text-white' :
                          settlement.status === 'Calculated' ? 'bg-slate-900 text-white' :
                          settlement.status === 'Approved' ? 'bg-emerald-600 text-white' : 
                          'bg-slate-950 text-white'}`}>
                        {settlement.status}
                    </Badge>
                    
                    {isHR && (
                        <div className="flex gap-3 pr-1">
                            {settlement.status === 'Calculated' && (
                                <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)} className="h-10 px-5 border-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-white shadow-sm transition-all">
                                    <Activity className="w-3.5 h-3.5 opacity-40" />
                                    {isEditing ? 'Cancel Edit' : 'Edit Data'}
                                </Button>
                            )}
                            {canApprove && !isEditing && (
                                <Button size="sm" onClick={handleApprove} className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm active:scale-95">
                                    <CheckCircle className="w-3.5 h-3.5 mr-2" />
                                    Approve
                                </Button>
                            )}
                            {canProcess && (
                                <Button size="sm" onClick={handleProcessPayment} className="h-10 px-6 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm active:scale-95">
                                    <Banknote className="w-3.5 h-3.5 mr-2" />
                                    Pay Now
                                </Button>
                            )}
                            {(settlement.status === 'Approved' || settlement.status === 'Paid') && (
                                <Button size="sm" variant="outline" onClick={handleNotify} className="h-10 px-5 border-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-white shadow-sm transition-all">
                                    <Send className="w-3.5 h-3.5 mr-2" />
                                    Notify
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Net Settlement Payload */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-slate-50 to-white">
                <CardContent className="p-12 text-center space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center mx-auto ring-4 ring-slate-50 transition-transform duration-500">
                        <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Settlement Amount</p>
                        <h1 className="text-5xl font-bold text-slate-900 tracking-tight leading-none">
                            ₹{settlement.net_settlement?.toLocaleString('en-IN') || '0'}
                        </h1>
                        <div className="pt-2">
                            {settlement.payment_date ? (
                                <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded text-[9px] font-bold tracking-wider uppercase">
                                    Payment Confirmed: {new Date(settlement.payment_date).toLocaleDateString()}
                                </Badge>
                            ) : (
                                <Badge className="bg-slate-100 text-slate-400 border-none px-4 py-1.5 rounded text-[9px] font-bold tracking-wider uppercase">
                                    Awaiting Payment
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Earnings & Deductions - Dual Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Earnings Matrix */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group/earning">
                    <CardHeader className="p-8 bg-slate-900 border-b border-slate-800">
                        <CardTitle className="flex items-center gap-4 text-white text-lg font-bold uppercase tracking-tight">
                            <div className="p-2 bg-white/10 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
                            Earnings Components
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: 'Salary Due', value: settlement.salary_due, detail: 'Pro-rata monthly salary', icon: Activity },
                            { label: 'Leave Encashment', value: settlement.leave_encashment, detail: `${settlement.pending_leaves || 0} Days`, icon: Calendar },
                            { label: 'Bonus', value: settlement.bonus, detail: settlement.bonus_remarks || 'Performance / Appraisal', icon: StarIcon },
                            { label: 'Gratuity', value: settlement.gratuity, detail: settlement.gratuity_eligible ? `${settlement.years_of_service} Years Service` : 'Not Eligible', icon: ShieldCheck },
                            { label: 'PF Amount', value: settlement.pf_amount, detail: 'Provident Fund', icon: Database },
                            { label: 'ESI Amount', value: settlement.esi_amount, detail: 'Insurance Contribution', icon: HeartPulse },
                            { label: 'Other Dues', value: settlement.other_dues, detail: settlement.other_dues_remarks || 'Manual Adjustment', icon: Plus }
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3.5 hover:bg-slate-50 rounded-xl transition-all border-b border-slate-50 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg group-hover/item:scale-110 transition-all">
                                        <item.icon className="w-3.5 h-3.5 text-slate-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{item.label}</p>
                                        {item.detail && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">{item.detail}</p>}
                                    </div>
                                </div>
                                {isEditing && canEdit ? (
                                    <Input
                                        type="number"
                                        className="w-32 h-9 text-right font-bold border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-100"
                                        value={editData[item.label.toLowerCase().replace(/ /g, '_')] || 0}
                                        onChange={(e) => setEditData({ ...editData, [item.label.toLowerCase().replace(/ /g, '_')]: parseFloat(e.target.value) || 0 })}
                                    />
                                ) : (
                                    <span className="text-base font-bold text-slate-900 tracking-tight">₹{item.value?.toLocaleString('en-IN') || '0'}</span>
                                )}
                            </div>
                        ))}
                        <div className="pt-6 mt-2 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Gross Total</p>
                                <p className="text-2xl font-bold text-emerald-600 tracking-tight">₹{settlement.gross_settlement?.toLocaleString('en-IN') || '0'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Deductions Matrix */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group/deduction">
                    <CardHeader className="p-8 bg-slate-900 border-b border-slate-800">
                        <CardTitle className="flex items-center gap-4 text-white text-lg font-bold uppercase tracking-tight">
                            <div className="p-2 bg-white/10 rounded-lg"><TrendingDown className="w-5 h-5 text-rose-400" /></div>
                            Deductions Components
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: 'Notice Shortfall', value: settlement.notice_shortfall_deduction, detail: 'Short notice period buyout', icon: Clock },
                            { label: 'Advance Deductions', value: settlement.advance_deductions, detail: 'Loan / Advance offsets', icon: History },
                            { label: 'Other Deductions', value: settlement.other_deductions, detail: settlement.deduction_remarks || 'Regulatory adjustments', icon: AlertCircle }
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3.5 hover:bg-slate-50 rounded-xl transition-all border-b border-slate-50 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg group-hover/item:scale-110 transition-all">
                                        <item.icon className="w-3.5 h-3.5 text-slate-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{item.label}</p>
                                        {item.detail && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">{item.detail}</p>}
                                    </div>
                                </div>
                                {isEditing && canEdit ? (
                                    <Input
                                        type="number"
                                        className="w-32 h-9 text-right font-bold border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-100"
                                        value={editData[item.label.toLowerCase().replace(/ /g, '_')] || 0}
                                        onChange={(e) => setEditData({ ...editData, [item.label.toLowerCase().replace(/ /g, '_')]: parseFloat(e.target.value) || 0 })}
                                    />
                                ) : (
                                    <span className="text-base font-bold text-rose-600 tracking-tight">₹{item.value?.toLocaleString('en-IN') || '0'}</span>
                                )}
                            </div>
                        ))}
                        <div className="pt-6 mt-2 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Total Deductions</p>
                                <p className="text-2xl font-bold text-rose-600 tracking-tight">₹{settlement.total_deductions?.toLocaleString('en-IN') || '0'}</p>
                            </div>
                        </div>

                        {isEditing && canEdit && (
                            <div className="pt-8">
                                <Button onClick={handleUpdate} className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98]">
                                    Save Settlement Audit
                                    <ArrowRight className="w-4 h-4 ml-3" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setShowTimeline(!showTimeline)}>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-4 text-lg font-bold uppercase tracking-tight text-slate-900">
                            <History className="w-5 h-5 text-slate-900" />
                            Settlement Timeline
                        </CardTitle>
                        <div className="p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-500 ${showTimeline ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </CardHeader>
                {showTimeline && (
                    <CardContent className="p-10 animate-in slide-in-from-top-4 duration-500">
                        <div className="relative pl-8 border-l-2 border-slate-100 ml-4 space-y-10">
                            {[
                                { label: 'Calculation Completed', status: settlement.status !== 'Pending' ? 'completed' : 'pending', date: settlement.calculated_date },
                                { label: 'Final Approval', status: settlement.status === 'Approved' || settlement.status === 'Paid' ? 'completed' : settlement.status === 'Calculated' ? 'current' : 'pending', date: settlement.approved_date },
                                { label: 'Payment Processed', status: settlement.status === 'Paid' ? 'completed' : settlement.status === 'Approved' ? 'current' : 'pending', date: settlement.payment_date }
                            ].map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[45px] w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm
                                        ${step.status === 'completed' ? 'bg-emerald-600 border-emerald-100 text-white' :
                                          step.status === 'current' ? 'bg-slate-900 border-slate-100 text-white animate-pulse' :
                                          'bg-white border-slate-100 text-slate-200'}`}>
                                        {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    </div>
                                    <div className={`space-y-1 p-5 rounded-xl transition-all duration-300 ${step.status === 'current' ? 'bg-slate-50 border border-slate-100 shadow-sm' : 'hover:bg-slate-50'}`}>
                                        <p className={`text-base font-bold uppercase tracking-tight ${step.status === 'completed' ? 'text-emerald-700' : step.status === 'current' ? 'text-slate-900' : 'text-slate-300'}`}>
                                            {step.label}
                                        </p>
                                        {step.date && (
                                            <Badge variant="outline" className="px-3 py-0.5 rounded border-slate-200 text-[9px] font-bold tracking-wider uppercase bg-white/50">
                                                {new Date(step.date).toLocaleString()}
                                            </Badge>
                                        )}
                                        {step.status === 'current' && (
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Action Required</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Metadata Footer */}
            <Card className="bg-slate-900 border-none rounded-xl overflow-hidden shadow-lg">
                <CardContent className="p-8 relative">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {[
                            { label: 'Base Salary', value: settlement.monthly_salary, icon: Wallet },
                            { label: 'Tenure', value: `${settlement.years_of_service} Years`, icon: Activity },
                            { label: 'Joining Date', value: settlement.joining_date && new Date(settlement.joining_date).toLocaleDateString(), icon: Calendar },
                            { label: 'Last Working Day', value: settlement.lwd_approved && new Date(settlement.lwd_approved).toLocaleDateString(), icon: AlertCircle }
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center gap-2.5 text-slate-400">
                                    <item.icon className="w-3.5 h-3.5" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest">{item.label}</p>
                                </div>
                                <p className="text-lg font-bold text-white tracking-tight">
                                    {typeof item.value === 'number' ? `₹${item.value.toLocaleString('en-IN')}` : item.value || 'N/A'}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Mock Icons for demonstration
const StarIcon = (props: any) => <Activity {...props} />;
const HeartPulse = (props: any) => <Activity {...props} />;
const Database = (props: any) => <Activity {...props} />;

export default SettlementDashboard;
