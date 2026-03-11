import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { getSettlement, updateSettlement, getNOCRequests } from '../../services/exitService';
import { Calculator, Download, DollarSign, FileText, AlertTriangle } from 'lucide-react';

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
            // Fetch all NOCs for this exit (Mock implementation: fetches all and filters)
            // In real app, we would have a specific endpoint or the list would be filtered by exitId on server
            const data = await getNOCRequests();
            const myNocs = data.data.filter((n: any) => n.exit_id === exitId);

            if (myNocs.length === 0) {
                setNocStatus('Pending'); // Assume pending if no records
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

    if (!exitId) return <div className="p-10 text-center text-slate-500">No approved exit request found for settlement processing.</div>;
    if (loading || !settlement) return <div className="p-4">Loading settlement details...</div>;

    return (
        <div className="space-y-6">

            {/* NOC Warning */}
            {nocStatus !== 'Cleared' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-yellow-800">NOC Clearance Pending</h4>
                        <p className="text-xs text-yellow-700 mt-1">
                            Final settlement cannot be processed until all No Objection Certificates (NOCs) are cleared.
                            Current Status: <span className="font-bold">{nocStatus}</span>
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakdown Card */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="py-4 px-6 bg-slate-50 border-b border-slate-100">
                        <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                            <Calculator className="w-5 h-5 mr-2 text-blue-600" /> Settlement Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <Label>Salary Due (Pro-rata)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                                <Input
                                    type="number"
                                    className="pl-7"
                                    value={settlement.salary_due}
                                    readOnly={!isFinanceAdmin}
                                    onChange={(e) => setSettlement({ ...settlement, salary_due: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-center">
                            <Label>Leave Encashment</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                                <Input
                                    type="number"
                                    className="pl-7"
                                    value={settlement.leave_encashment}
                                    readOnly={!isFinanceAdmin}
                                    onChange={(e) => setSettlement({ ...settlement, leave_encashment: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-center">
                            <Label>Bonus / Incentives</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                                <Input
                                    type="number"
                                    className="pl-7"
                                    value={settlement.bonus}
                                    readOnly={!isFinanceAdmin}
                                    onChange={(e) => setSettlement({ ...settlement, bonus: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-center">
                            <Label className="text-red-600">Deductions (Asset/Advance)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">-₹</span>
                                <Input
                                    type="number"
                                    className="pl-7 border-red-200 text-red-600"
                                    value={settlement.deductions}
                                    readOnly={!isFinanceAdmin}
                                    onChange={(e) => setSettlement({ ...settlement, deductions: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-slate-800">Net Payable</span>
                                <span className="text-2xl font-bold text-green-600">
                                    ₹{(
                                        (settlement.salary_due || 0) +
                                        (settlement.leave_encashment || 0) +
                                        (settlement.bonus || 0) -
                                        (settlement.deductions || 0)
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {isFinanceAdmin && (
                            <Button onClick={handleUpdate} className="w-full mt-4" disabled={nocStatus !== 'Cleared'}>
                                {nocStatus !== 'Cleared' ? 'Complete NOC Clearance First' : 'Update Calculation'}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Status & Remarks Card */}
                <Card className="border-slate-200 shadow-sm h-fit">
                    <CardHeader className="py-4 px-6 bg-slate-50 border-b border-slate-100">
                        <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                            <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Payment Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label>Settlement Status</Label>
                            {isFinanceAdmin ? (
                                <select
                                    className="w-full h-10 rounded-md border border-slate-200 px-3"
                                    value={settlement.status}
                                    disabled={nocStatus !== 'Cleared'}
                                    onChange={(e) => setSettlement({ ...settlement, status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processed">Processed</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            ) : (
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                    ${settlement.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                        settlement.status === 'Processed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {settlement.status}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Finance Remarks</Label>
                            <textarea
                                className="w-full min-h-[100px] rounded-md border border-slate-200 p-3 text-sm"
                                placeholder="Add payment reference number or notes..."
                                value={settlement.remarks || ''}
                                readOnly={!isFinanceAdmin}
                                onChange={(e) => setSettlement({ ...settlement, remarks: e.target.value })}
                            />
                        </div>

                        {settlement.status === 'Paid' && (
                            <div className="bg-green-50 p-4 rounded-md border border-green-100">
                                <p className="text-sm text-green-800 font-medium">Payment Disbursed</p>
                                <p className="text-xs text-green-600 mt-1">Date: {settlement.payment_date}</p>
                            </div>
                        )}

                        <Button variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" /> Download Payslip
                        </Button>

                        {settlement.status === 'Paid' && (
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                <FileText className="w-4 h-4 mr-2" /> Download Relieving Letter
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FinalSettlement;
