import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    CheckCircle, Clock, AlertCircle, Plus, Search, Filter, MoreHorizontal,
    Calendar, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TaskManagement: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock Data
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Review New HR Policy', type: 'Auto-Generated', priority: 'High', status: 'Pending', dueDate: 'Today', source: 'Policy Module' },
        { id: 2, title: 'Complete Q3 Self-Appraisal', type: 'System', priority: 'Medium', status: 'Pending', dueDate: 'Tomorrow', source: 'Appraisal' },
        { id: 3, title: 'Update Team Leave Plan', type: 'Manual', priority: 'Normal', status: 'In Progress', dueDate: 'Feb 20', source: 'User' },
        { id: 4, title: 'Submit Expense Report', type: 'Manual', priority: 'Normal', status: 'Completed', dueDate: 'Feb 10', source: 'User' },
        { id: 5, title: 'Verify Intern Documents', type: 'Auto-Generated', priority: 'High', status: 'Pending', dueDate: 'Feb 18', source: 'Onboarding' },
    ]);

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        highPriority: tasks.filter(t => t.priority === 'High').length
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const newTask = {
            id: Date.now(),
            title: formData.get('title') as string,
            type: 'Manual',
            priority: formData.get('priority') as string,
            status: 'Pending',
            dueDate: formData.get('date') as string,
            source: 'User'
        };
        setTasks([newTask, ...tasks]);
        setShowCreateModal(false);
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-7xl mx-auto p-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
                                <ChevronRight className="w-6 h-6 rotate-180" />
                            </button>
                            <h1 className="text-3xl font-[950] tracking-tight text-slate-900">Task Management</h1>
                        </div>
                        <p className="text-slate-500 font-medium pl-14">Central hub for all your automated and manual action items.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200 gap-2"
                        >
                            <Plus className="w-5 h-5" /> Raise Task
                        </Button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-100 bg-white/60 backdrop-blur-xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Tasks</p>
                                <h3 className="text-4xl font-[950] text-slate-900 mt-2">{stats.total}</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                <List className="w-7 h-7 text-indigo-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-100 bg-white/60 backdrop-blur-xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pending</p>
                                <h3 className="text-4xl font-[950] text-slate-900 mt-2">{stats.pending}</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                                <Clock className="w-7 h-7 text-amber-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-100 bg-white/60 backdrop-blur-xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Completed</p>
                                <h3 className="text-4xl font-[950] text-slate-900 mt-2">{stats.completed}</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle className="w-7 h-7 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-100 bg-white/60 backdrop-blur-xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">High Priority</p>
                                <h3 className="text-4xl font-[950] text-slate-900 mt-2">{stats.highPriority}</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                                <AlertCircle className="w-7 h-7 text-rose-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Task List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900">Your Action Items</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
                                />
                            </div>
                            <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 font-bold gap-2">
                                <Filter className="w-4 h-4" /> Filter
                            </Button>
                        </div>
                    </div>

                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {tasks.map(task => (
                            <Card key={task.id} className={`rounded-[32px] border-none shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group cursor-pointer bg-white ${task.status === 'Completed' ? 'opacity-60' : ''}`}>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                                            {task.priority} Priority
                                        </span>
                                        <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className={`text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                                            {task.title}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                            {task.type}
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                            {task.source}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <Calendar className="w-4 h-4" /> {task.dueDate}
                                        </div>
                                        {task.status !== 'Completed' ? (
                                            <button
                                                onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'Completed' } : t))}
                                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all text-slate-400"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <span className="text-emerald-500 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" /> Done
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* New Empty State if Grid */}
                        {viewMode === 'grid' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="rounded-[32px] border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition-all min-h-[200px] gap-4 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-white group-hover:shadow-lg flex items-center justify-center transition-all">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-sm">Create New Task</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Create Task Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <Card className="w-full max-w-lg rounded-[40px] shadow-2xl border-none">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-2xl font-black text-slate-900">Create New Task</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleCreateTask} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Task Title</label>
                                        <input type="text" name="title" required className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Prepare Monthly Report" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</label>
                                            <select name="priority" className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                                                <option value="Normal">Normal</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</label>
                                            <input type="date" name="date" required className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50">Cancel</Button>
                                        <Button type="submit" className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200">Create Task</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskManagement;
