import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { Target, Plus, Edit, Filter, CheckCircle, XCircle, Trash2, Settings2, Link2, Info, Users } from 'lucide-react';
import { getAllKRAs, type KRA, getKPIsByKRA } from '../services/appraisalService';
import { getCategories, saveCategories } from '../services/cycleService';

const KRADefinitionEngine: React.FC = () => {
    const [kras, setKras] = useState<KRA[]>(getAllKRAs());
    const [categories, setCategories] = useState<string[]>(getCategories());
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingKRA, setEditingKRA] = useState<KRA | null>(null);
    const [newCategory, setNewCategory] = useState('');

    // Filter KRAs
    const filteredKRAs = kras.filter(kra => {
        const roleMatch = selectedRole === 'all' || kra.applicableRoles.includes(selectedRole);
        const categoryMatch = selectedCategory === 'all' || kra.category === selectedCategory;
        return roleMatch && categoryMatch;
    });

    const handleOpenCreate = () => {
        setEditingKRA(null);
        setIsCreateDialogOpen(true);
    };

    const handleOpenEdit = (kra: KRA) => {
        setEditingKRA(kra);
        setIsCreateDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this KRA?')) {
            setKras(prev => prev.filter(k => k.id !== id));
        }
    };

    const handleSave = (kraData: Omit<KRA, 'id' | 'status'>) => {
        if (editingKRA) {
            // Update existing
            setKras(prev => prev.map(k => k.id === editingKRA.id ? { ...k, ...kraData, status: 'Pending Review' } : k));
        } else {
            // Create new
            const newKRA: KRA = {
                ...kraData,
                id: `kra-${Date.now()}`,
                status: 'Pending Review'
            };
            setKras(prev => [...prev, newKRA]);
        }
        setIsCreateDialogOpen(false);
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            const updated = [...categories, newCategory];
            setCategories(updated);
            saveCategories(updated);
            setNewCategory('');
        }
    };

    const handleDeleteCategory = (cat: string) => {
        if (confirm(`Delete category "${cat}"? This will not delete the KRAs but you should reassign them.`)) {
            const updated = categories.filter(c => c !== cat);
            setCategories(updated);
            saveCategories(updated);
        }
    };

    // Group KRAs by category
    const groupedKRAs = filteredKRAs.reduce((acc, kra) => {
        if (!acc[kra.category]) {
            acc[kra.category] = [];
        }
        acc[kra.category].push(kra);
        return acc;
    }, {} as Record<string, KRA[]>);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Academic': 'bg-blue-100 text-blue-800',
            'Administrative': 'bg-slate-100 text-slate-800',
            'Leadership': 'bg-purple-100 text-purple-800',
            'Compliance': 'bg-green-100 text-green-800',
            'Student Engagement': 'bg-orange-100 text-orange-800',
            'Research': 'bg-pink-100 text-pink-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Layout title="KRA Definition Engine" description="Manage institution-level Key Result Areas" icon={Target} showBack>
            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-500" />
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                                <SelectItem value="HOD">HOD</SelectItem>
                                <SelectItem value="Principal">Principal</SelectItem>
                                <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10">
                                <Settings2 className="h-4 w-4 mr-2" /> Categories
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Manage KRA Categories</DialogTitle>
                                <DialogDescription>Add or remove categories for KRAs</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="New Category Name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                    <Button onClick={handleAddCategory}><Plus className="h-4 w-4" /></Button>
                                </div>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                                            <span className="text-sm font-medium">{cat}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-slate-400 hover:text-red-600"
                                                onClick={() => handleDeleteCategory(cat)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleOpenCreate}>
                            <Plus className="h-4 w-4 mr-2" /> Create KRA
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingKRA ? 'Edit KRA' : 'Create New KRA'}</DialogTitle>
                            <DialogDescription>
                                {editingKRA ? 'Update the details for this Key Result Area' : 'Define a new Key Result Area for your institution'}
                            </DialogDescription>
                        </DialogHeader>
                        <CreateKRAForm
                            initialData={editingKRA}
                            categories={categories}
                            onSave={handleSave}
                            onClose={() => setIsCreateDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* KRA Cards by Category */}
            <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-900">
                        <strong>{filteredKRAs.length}</strong> KRAs found
                        {selectedRole !== 'all' && ` for ${selectedRole}`}
                        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                    </p>
                </div>

                {Object.entries(groupedKRAs).map(([category, categoryKRAs]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(category)}`}>
                                {category}
                            </span>
                            <span className="text-slate-500 text-sm">({categoryKRAs.length})</span>
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {categoryKRAs.map((kra) => {
                                const linkedKPIs = getKPIsByKRA(kra.id);
                                return (
                                    <Card key={kra.id} className="border-slate-200 hover:shadow-md transition-all overflow-hidden group">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        {kra.title}
                                                        {kra.status === 'Pending Review' && (
                                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">Pending Review</Badge>
                                                        )}
                                                        {kra.status === 'Rejected' && (
                                                            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px]">Rejected</Badge>
                                                        )}
                                                        {kra.isMandatory ? (
                                                            <Badge variant="destructive" className="text-[10px] bg-red-100 text-red-700">
                                                                Mandatory
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="text-[10px]">
                                                                Optional
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{kra.description}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEdit(kra)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(kra.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0 space-y-4">
                                            {/* Role associations with clearer visibility */}
                                            <div className="flex flex-wrap gap-1.5 border-b border-slate-50 pb-3">
                                                <div className="flex items-center text-[10px] text-slate-400 mr-1">
                                                    <Users className="h-3 w-3 mr-1" /> Roles:
                                                </div>
                                                {kra.applicableRoles.map((role) => (
                                                    <Badge key={role} variant="outline" className="text-[10px] bg-white border-slate-200 text-slate-600">
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {/* Linked KPIs / Results Data */}
                                            <div className="bg-slate-50 rounded-md p-2 border border-slate-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                                                        <Link2 className="h-3 w-3 mr-1 text-indigo-500" /> Linked KPIs
                                                    </div>
                                                    <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 py-0 h-4 text-[9px]">
                                                        {linkedKPIs.length} indicators
                                                    </Badge>
                                                </div>
                                                {linkedKPIs.length > 0 ? (
                                                    <ul className="space-y-1.5">
                                                        {linkedKPIs.slice(0, 2).map(kpi => (
                                                            <li key={kpi.id} className="flex items-center justify-between text-[11px]">
                                                                <span className="text-slate-600 truncate mr-2">{kpi.title}</span>
                                                                <span className="font-medium text-slate-900 shrink-0">Target: {kpi.target}{kpi.unit}</span>
                                                            </li>
                                                        ))}
                                                        {linkedKPIs.length > 2 && (
                                                            <li className="text-[10px] text-blue-600 font-medium pt-0.5 cursor-pointer hover:underline">
                                                                + {linkedKPIs.length - 2} more indicators
                                                            </li>
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <div className="text-[10px] text-slate-400 flex items-center justify-center py-2 h-12 dashed border border-slate-200 rounded">
                                                        No KPIs linked yet
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                                    <Info className="h-3 w-3" />
                                                    <span>Weightage contribution</span>
                                                </div>
                                                <div className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                                    {kra.weightage}%
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

// Create KRA Form Component
const CreateKRAForm: React.FC<{
    initialData?: KRA | null;
    categories: string[];
    onSave: (data: any) => void;
    onClose: () => void;
}> = ({ initialData, categories, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category || categories[0] || 'Academic',
        weightage: initialData?.weightage || 10,
        applicableRoles: initialData?.applicableRoles || [] as string[],
        isMandatory: initialData?.isMandatory ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const toggleRole = (role: string) => {
        setFormData(prev => ({
            ...prev,
            applicableRoles: prev.applicableRoles.includes(role)
                ? prev.applicableRoles.filter(r => r !== role)
                : [...prev.applicableRoles, role]
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">KRA Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Academic Result Performance"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this KRA in detail..."
                    rows={3}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="weightage">Weightage (%)</Label>
                    <Input
                        id="weightage"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.weightage}
                        onChange={(e) => setFormData({ ...formData, weightage: parseInt(e.target.value) })}
                        required
                    />
                </div>
            </div>

            <div>
                <Label>Applicable Roles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {['Teaching Staff', 'HOD', 'Principal', 'Non-Teaching'].map((role) => (
                        <Badge
                            key={role}
                            variant={formData.applicableRoles.includes(role) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleRole(role)}
                        >
                            {formData.applicableRoles.includes(role) ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {role}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="mandatory"
                    checked={formData.isMandatory}
                    onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                    className="h-4 w-4"
                />
                <Label htmlFor="mandatory" className="cursor-pointer">Mark as Mandatory KRA</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {initialData ? 'Save Changes' : 'Create KRA'}
                </Button>
            </div>
        </form>
    );
};

export default KRADefinitionEngine;
