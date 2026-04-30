import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
    getHandoverItems, addHandoverItem, updateHandoverStatus, 
    verifyHandoverItem, getExitDetails, assignSuccessor 
} from '../../services/exitService';
import { getAllEmployees } from '../../services/employeeService';
import { 
    CheckCircle, Plus, UserPlus, Users, Upload, ExternalLink, 
    ShieldCheck, ClipboardList, Briefcase, FileText, Share2,
    Clock, Search, UserCheck, AlertCircle, Info, ArrowRight,
    ChevronDown, ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface HandoverListProps {
    exitId?: number;
    viewMode?: 'Faculty' | 'Admin' | 'Manager';
}

const HandoverList: React.FC<HandoverListProps> = ({ exitId, viewMode }) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState({ item_name: '', category: 'Asset' });
    const [simulatedRole, setSimulatedRole] = useState<string>('Employee'); // Employee, Successor, HoD

    useEffect(() => {
        if (viewMode === 'Faculty') {
            setSimulatedRole('Employee');
        } else if (viewMode === 'Admin' || viewMode === 'Manager') {
            setSimulatedRole('HoD'); // Default for Admin/Manager oversight
        }
    }, [viewMode]);

    // Successor State
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedSuccessor, setSelectedSuccessor] = useState<string>('');
    const [currentSuccessorName, setCurrentSuccessorName] = useState<string>('');

    useEffect(() => {
        if (exitId) {
            fetchData();
        }
    }, [exitId]);

    const fetchData = async () => {
        if (!exitId) return;
        setLoading(true);
        try {
            const itemsData = await getHandoverItems(exitId);
            setItems(itemsData.data);

            const empData = await getAllEmployees();
            setEmployees(empData.data);

            const exitData = await getExitDetails(exitId);
            if (exitData.data && exitData.data.successor_name) {
                setCurrentSuccessorName(exitData.data.successor_name);
                setSelectedSuccessor(exitData.data.successor_id?.toString() || '');
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newItem.item_name || !exitId) return;
        try {
            await addHandoverItem({ exit_id: exitId, ...newItem, assigned_to: 2 });
            setNewItem({ item_name: '', category: 'Asset' });
            fetchData();
        } catch (error) {
            alert("Failed to add item");
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        let proof_url = undefined;
        if (status === 'Completed') {
            proof_url = prompt("Enter Proof URL (e.g., Drive Link):");
            if (!proof_url) return;
        }

        try {
            await updateHandoverStatus(id, status, proof_url || undefined);
            fetchData();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleVerify = async (id: number) => {
        try {
            await verifyHandoverItem(id);
            fetchData();
        } catch (error) {
            alert("Failed to verify item");
        }
    };

    const handleAssignSuccessor = async () => {
        if (!selectedSuccessor || !exitId) return;
        try {
            await assignSuccessor(exitId, parseInt(selectedSuccessor));
            const successor = employees.find(e => e.id === parseInt(selectedSuccessor));
            setCurrentSuccessorName(successor?.name || '');
            alert("Successor assigned successfully");
        } catch (error) {
            alert("Failed to assign successor");
        }
    };

    // Group items by category
    const groupedItems = items.reduce((acc: any, item: any) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const categories = ['Academic', 'Administrative', 'Asset', 'Document', 'Knowledge', 'Access'];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-48 animate-in fade-in duration-500">
                <div className="p-4 bg-slate-900 rounded-xl shadow-lg ring-4 ring-slate-100 mb-6">
                    <Share2 className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Syncing Assets</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Please wait while we update the pipeline...</p>
                </div>
            </div>
        );
    }

    if (!exitId) {
        return (
            <div className="text-center py-32 space-y-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Exit Context</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-2">
            {/* Succession Section */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/50">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-slate-900 rounded-lg shadow-sm">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Succession Context</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Institutional knowledge transfer</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end gap-5 w-full lg:w-auto">
                        <div className="space-y-1.5 w-full sm:w-80">
                            <Label className="text-[9px] font-bold text-slate-900 uppercase tracking-wider ml-1">Successor Recruitment</Label>
                            <div className="relative">
                                <select
                                    className="w-full h-12 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 font-bold text-[11px] uppercase tracking-wider rounded-lg px-5 appearance-none cursor-pointer shadow-sm transition-all focus:ring-2 focus:ring-slate-100"
                                    value={selectedSuccessor}
                                    onChange={(e) => setSelectedSuccessor(e.target.value)}
                                >
                                    <option value="">Select Target Personnel...</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <Button 
                            onClick={handleAssignSuccessor} 
                            className="h-12 px-8 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
                        >
                            <UserCheck className="w-4 h-4 mr-2.5" />
                            {currentSuccessorName ? "Update Trace" : "Assign Successor"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Handover Categories Grid */}
            <div className="space-y-12">
                {Object.keys(groupedItems).length === 0 ? (
                    <div className="text-center py-24 space-y-8 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden group">
                        <div className="w-20 h-20 bg-white border border-slate-100 text-slate-200 rounded-xl flex items-center justify-center mx-auto shadow-sm transition-all duration-300">
                            <CheckCircle className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-slate-900 uppercase tracking-tight">No Items Pending</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-sm mx-auto leading-relaxed">The knowledge transfer sequence is complete or not yet started.</p>
                        </div>
                    </div>
                ) : (
                    Object.keys(groupedItems).map(category => (
                        <div key={category} className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                            <div className="flex items-center gap-5">
                                <div className="w-2 h-8 bg-slate-900 rounded-full shadow-sm" />
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{category} Phase</h3>
                                <Badge className="bg-slate-100 text-slate-600 border-none px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                    {groupedItems[category].length} Items
                                </Badge>
                                <Separator className="flex-1 bg-slate-100" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupedItems[category].map((item: any) => (
                                    <Card key={item.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-300">
                                        <div className="p-8 space-y-8 relative">
                                            <div className="space-y-1 relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{item.item_name}</p>
                                                    {item.status === 'Verified' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                </div>
                                                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                                    <Badge className={`px-2 py-0.5 rounded text-[8px] font-bold border-none
                                                        ${item.status === 'Pending' ? 'bg-slate-100 text-slate-500' :
                                                          item.status === 'Completed' ? 'bg-orange-100 text-orange-700' :
                                                          'bg-emerald-100 text-emerald-700'}`}>
                                                        {item.status}
                                                    </Badge>
                                                    {item.last_updated && <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(item.last_updated).toLocaleDateString()}</span>}
                                                </div>
                                            </div>
                                            
                                            {item.proof_url && (
                                                <button 
                                                    onClick={() => window.open(item.proof_url, '_blank')}
                                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider hover:bg-white hover:border-slate-200 transition-all shadow-sm"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" /> View Proof
                                                </button>
                                            )}

                                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                                {/* Employee Actions */}
                                                {simulatedRole === 'Employee' && item.status !== 'Verified' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        onClick={() => handleUpdateStatus(item.id, 'Completed')}
                                                        className="h-10 px-6 border-slate-200 text-slate-600 rounded-lg font-bold text-[9px] uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm"
                                                    >
                                                        <Upload className="w-3.5 h-3.5 mr-2.5" /> Upload Proof
                                                    </Button>
                                                )}

                                                {/* Verifier Actions */}
                                                {(simulatedRole === 'Successor' || simulatedRole === 'HoD') && item.status === 'Completed' && (
                                                    <Button 
                                                        size="sm" 
                                                        className="h-10 px-6 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[9px] uppercase tracking-wider shadow-md active:scale-95"
                                                        onClick={() => handleVerify(item.id)}
                                                    >
                                                        <ShieldCheck className="w-3.5 h-3.5 mr-2.5" /> Verify Asset
                                                    </Button>
                                                )}
                                                
                                                {item.status === 'Verified' && (
                                                    <div className="h-10 flex items-center gap-2.5 text-emerald-600">
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">Asset Verified</span>
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Item Section */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden mt-12">
                <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight uppercase flex items-center gap-4">
                        <Plus className="w-5 h-5 text-slate-900" /> Register Handover Asset
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex flex-col lg:flex-row gap-6 items-end relative z-10">
                    <div className="grid gap-2 flex-1 w-full">
                        <Label className="text-[9px] font-bold text-slate-900 uppercase tracking-widest ml-1">Asset Descriptor</Label>
                        <Input
                            className="h-12 bg-white border border-slate-200 rounded-lg px-5 font-bold text-[11px] uppercase tracking-wider placeholder:text-slate-300 focus:ring-2 focus:ring-slate-100"
                            value={newItem.item_name}
                            onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                            placeholder="Identify Laptop, Knowledge Base, Project Trace..."
                        />
                    </div>
                    <div className="grid gap-2 w-full lg:w-64">
                        <Label className="text-[9px] font-bold text-slate-900 uppercase tracking-widest ml-1">Asset Category</Label>
                        <div className="relative">
                            <select
                                className="w-full h-12 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 font-bold text-[11px] uppercase tracking-wider rounded-lg px-5 appearance-none cursor-pointer shadow-sm transition-all focus:ring-2 focus:ring-slate-100"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                    <Button 
                        onClick={handleAdd} 
                        className="h-12 px-10 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
                    >
                        Register Asset
                        <ArrowRight className="w-4 h-4 ml-3" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default HandoverList;
