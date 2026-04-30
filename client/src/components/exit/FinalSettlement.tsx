import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { getSettlement, updateSettlement, getNOCRequests } from '../../services/exitService';
import { 
    Calculator, Download, DollarSign, FileText, AlertTriangle,
    ShieldCheck, ExternalLink, IndianRupee, Printer, 
    CheckCircle, AlertCircle, Clock, Trash2, ArrowLeft, Send, Activity, XCircle, Wallet
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface FinalSettlementProps {
    exitId?: number;
    viewMode: 'Faculty' | 'Admin' | 'Manager';
}

const FinalSettlement: React.FC<FinalSettlementProps> = ({ exitId, viewMode }) => {
    const [settlement, setSettlement] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [nocStatus, setNocStatus] = useState<string>('Pending');

    const isFinanceAdmin = viewMode === 'Admin';

    useEffect(() => {
        fetchSettlement();
        checkNOC();
    }, [exitId]);

    const fetchSettlement = async () => {
        if (!exitId) return;
        setLoading(true);
        try {
            const data = await getSettlement(exitId);
            setSettlement(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkNOC = async () => {
        if (!exitId) return;
        try {
            const data = await getNOCRequests();
            const myNocs = data.data.filter((n: any) => n.exit_id === exitId);

            if (myNocs.length === 0) {
                setNocStatus('Pending');
                return;
            }

            const allCleared = myNocs.every((n: any) => n.status === 'Cleared');
            const anyRejected = myNocs.some((n: any) => n.status === 'Rejected');

            if (anyRejected) setNocStatus('Rejected');
            else if (allCleared) setNocStatus('Cleared');
            else setNocStatus('Pending');

        } catch (error) {
            console.error("Failed to check NOC", error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateSettlement(settlement.id, settlement);
            alert("Settlement updated successfully");
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-48 space-y-4 animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                    <Calculator className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Calculating Settlement</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">Please wait...</p>
                </div>
            </div>
        );
    }

    if (!exitId) {
        return (
            <div className="text-center py-32 space-y-6 bg-slate-50 border border-slate-200 rounded-lg">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Exit Context</p>
            </div>
        );
    }

    const netPayable = (
        (settlement?.salary_due || 0) +
        (settlement?.leave_encashment || 0) +
        (settlement?.bonus || 0) -
        (settlement?.deductions || 0)
    );

    return (
        <div className="space-y-10 p-2">
            
            {/* NOC Status Alert */}
            <div className={`p-5 rounded-lg border flex items-start gap-4 shadow-sm
                ${nocStatus === 'Cleared' 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : nocStatus === 'Rejected' 
                    ? 'bg-rose-50 border-rose-200' 
                    : 'bg-amber-50 border-amber-200'}`}>
                <div className={`p-2 rounded-md ${
                    nocStatus === 'Cleared' ? 'bg-emerald-600 text-white' :
                    nocStatus === 'Rejected' ? 'bg-rose-600 text-white' :
                    'bg-amber-600 text-white'
                }`}>
                    {nocStatus === 'Cleared' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div>
                    <h4 className={`text-sm font-bold uppercase tracking-tight ${
                        nocStatus === 'Cleared' ? 'text-emerald-900' : 
                        nocStatus === 'Rejected' ? 'text-rose-900' : 'text-amber-900'}`}>
                        {nocStatus === 'Cleared' ? 'Clearance Issued' : 'Clearance Pending'}
                    </h4>
                    <p className={`text-[10px] font-medium opacity-80 mt-0.5 ${
                        nocStatus === 'Cleared' ? 'text-emerald-700' : 
                        nocStatus === 'Rejected' ? 'text-rose-700' : 'text-amber-700'}`}>
                        {nocStatus === 'Cleared' 
                            ? 'All departmental NOCs have been verified. Settlement can proceed.' 
                            : 'Settlement is on hold until all departmental clearances are obtained.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Breakdown Card */}
                <Card className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <CardHeader className="p-6 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="flex items-center gap-3 text-slate-900 text-sm font-bold uppercase tracking-wider">
                            <Calculator className="w-4 h-4 text-slate-500" />
                            Settlement Ledger
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {[
                            { label: 'Pro-Rata Salary', key: 'salary_due', icon: Activity },
                            { label: 'Leave Encashment', key: 'leave_encashment', icon: Clock },
                            { label: 'Incentive / Bonus', key: 'bonus', icon: DollarSign },
                            { label: 'Deductions', key: 'deductions', icon: XCircle, isNegative: true }
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 border border-transparent hover:border-slate-100 hover:bg-slate-50 rounded-lg transition-all">
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-4 h-4 ${item.isNegative ? 'text-rose-500' : 'text-slate-500'}`} />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{item.label}</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">₹</span>
                                    <Input
                                        type="number"
                                        className={`w-32 h-9 pl-7 text-right text-xs font-bold border-slate-200 rounded-md
                                            ${item.isNegative ? 'text-rose-600' : 'text-slate-900'}`}
                                        value={settlement[item.key]}
                                        readOnly={!isFinanceAdmin}
                                        onChange={(e) => setSettlement({ ...settlement, [item.key]: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        ))}
 
                        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Payable</p>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 tracking-tight">
                                ₹{netPayable.toLocaleString()}
                            </p>
                        </div>
 
                        {isFinanceAdmin && (
                            <div className="pt-4">
                                <Button 
                                    onClick={handleUpdate} 
                                    disabled={nocStatus !== 'Cleared'}
                                    className="h-10 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-sm disabled:opacity-40 transition-all"
                                >
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    {nocStatus !== 'Cleared' ? 'Clearance Required' : 'Process Settlement'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>


                {/* Status & Remarks Card */}
                <Card className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden h-fit">
                    <CardHeader className="p-6 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="flex items-center gap-3 text-slate-900 text-sm font-bold uppercase tracking-wider">
                            <Wallet className="w-4 h-4 text-slate-500" />
                            Disbursement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Payment Status</Label>
                            {isFinanceAdmin ? (
                                <div className="relative">
                                    <select
                                        className="w-full h-10 bg-slate-50 border border-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-wide rounded-md px-4 outline-none focus:ring-2 focus:ring-slate-900/10 appearance-none cursor-pointer"
                                        value={settlement.status}
                                        disabled={nocStatus !== 'Cleared'}
                                        onChange={(e) => setSettlement({ ...settlement, status: e.target.value })}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processed">Processed</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            ) : (
                                <Badge variant="outline" className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                                    ${settlement.status === 'Paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                      settlement.status === 'Processed' ? 'border-blue-200 bg-blue-50 text-blue-700' : 
                                      'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                    {settlement.status}
                                </Badge>
                            )}
                        </div>
 
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Remarks</Label>
                            <textarea
                                className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-md p-4 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none resize-none transition-all placeholder:text-slate-400"
                                placeholder="Enter payment references or notes..."
                                value={settlement.remarks || ''}
                                readOnly={!isFinanceAdmin}
                                onChange={(e) => setSettlement({ ...settlement, remarks: e.target.value })}
                            />
                        </div>
 
                        {settlement.status === 'Paid' && (
                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-center gap-3 animate-in zoom-in-95 duration-500">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <div>
                                    <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Disbursement Confirmed</p>
                                    <p className="text-[9px] text-emerald-600 font-medium uppercase tracking-wider mt-0.5">Trans. Date: {settlement.payment_date}</p>
                                </div>
                            </div>
                        )}
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button variant="outline" className="h-10 border-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 transition-all">
                                <Download className="w-4 h-4 mr-2" />
                                Export Ledger
                            </Button>
                            {settlement.status === 'Paid' && (
                                <Button className="h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Relieving Letter
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Mock Icons for demonstration
const ChevronDown = (props: any) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
        <path d="m6 9 6 6 6-6"/>
    </svg>
);

export default FinalSettlement;
