import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getHandoverItems, addHandoverItem, updateHandoverStatus, verifyHandoverItem, getExitDetails, assignSuccessor } from '../../services/exitService';
import { getAllEmployees } from '../../services/employeeService';
import { CheckCircle, Plus, UserPlus, Users, Upload, ExternalLink, ShieldCheck } from 'lucide-react';

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

    if (!exitId) {
        return <div className="p-10 text-center text-slate-500">No active exit request found for handover processing.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Role Simulation for Demo - Only visible if in Admin mode */}
            {viewMode === 'Admin' && (
                <div className="flex justify-end mb-2">
                    <select
                        className="p-2 border rounded text-xs bg-slate-50 text-slate-600"
                        value={simulatedRole}
                        onChange={(e) => setSimulatedRole(e.target.value)}
                    >
                        <option value="Employee">View as: Employee (Upload Proofs)</option>
                        <option value="Successor">View as: Successor (Verify Items)</option>
                        <option value="HoD">View as: HoD (Verify Items)</option>
                    </select>
                </div>
            )}

            {/* Successor Assignment Section */}
            <Card className="border-indigo-100 bg-indigo-50/50">
                <CardHeader className="py-3 px-4 border-b border-indigo-100">
                    <CardTitle className="text-sm font-semibold flex items-center text-indigo-900">
                        <Users className="w-4 h-4 mr-2" /> Successor Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="grid gap-2 flex-1 w-full">
                            <Label className="text-indigo-900">Primary Successor</Label>
                            <select
                                className="h-10 rounded-md border border-indigo-200 px-3 py-2 text-sm bg-white"
                                value={selectedSuccessor}
                                onChange={(e) => setSelectedSuccessor(e.target.value)}
                            >
                                <option value="">Select Employee to take over...</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                                ))}
                            </select>
                        </div>
                        <Button onClick={handleAssignSuccessor} className="bg-indigo-600 hover:bg-indigo-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            {currentSuccessorName ? "Re-Assign" : "Assign Successor"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {Object.keys(groupedItems).length === 0 && !loading && (
                    <p className="text-center text-slate-500 py-8">No handover items pending.</p>
                )}

                {Object.keys(groupedItems).map(category => (
                    <div key={category} className="space-y-3">
                        <h3 className="font-semibold text-slate-800 flex items-center">
                            <div className="w-2 h-6 bg-indigo-500 rounded mr-2"></div>
                            {category} Items
                        </h3>
                        <div className="grid gap-3">
                            {groupedItems[category].map((item: any) => (
                                <Card key={item.id} className="border-slate-200 hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-sm text-slate-900">{item.item_name}</p>
                                                {item.status === 'Verified' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className={`px-2 py-0.5 rounded-full ${item.status === 'Pending' ? 'bg-slate-100 text-slate-600' :
                                                    item.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                                {item.last_updated && <span>Updated: {new Date(item.last_updated).toLocaleDateString()}</span>}
                                            </div>
                                            {item.proof_url && (
                                                <a href={item.proof_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center mt-1">
                                                    <ExternalLink className="w-3 h-3 mr-1" /> View Proof
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Employee Actions */}
                                            {simulatedRole === 'Employee' && item.status !== 'Verified' && (
                                                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(item.id, 'Completed')}>
                                                    <Upload className="w-3 h-3 mr-1" /> Upload Proof
                                                </Button>
                                            )}

                                            {/* Verifier Actions */}
                                            {(simulatedRole === 'Successor' || simulatedRole === 'HoD') && item.status === 'Completed' && (
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleVerify(item.id)}>
                                                    <ShieldCheck className="w-3 h-3 mr-1" /> Verify
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Form (Visible to Employee/Admin) */}
            <Card className="border-slate-200 mt-8">
                <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold flex items-center">
                        <Plus className="w-4 h-4 mr-2" /> Add Additional Item
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="grid gap-2 flex-1 w-full">
                        <Label>Item Name</Label>
                        <Input
                            value={newItem.item_name}
                            onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                            placeholder="Laptop, Key Card, Project Files..."
                        />
                    </div>
                    <div className="grid gap-2 w-full md:w-48">
                        <Label>Category</Label>
                        <select
                            className="h-10 rounded-md border border-slate-200 px-3 py-2 text-sm"
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <Button onClick={handleAdd} className="w-full md:w-auto">Add Item</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default HandoverList;
