import { useState } from 'react';
import { Button } from '../ui/button';
import { BookOpen, CheckCircle, Circle } from 'lucide-react';

const Stage4Training = ({ onComplete }: any) => {
    const [modules, setModules] = useState([
        { id: 1, name: 'Company Policy & Culture', status: 'Completed' },
        { id: 2, name: 'IT Security Awareness', status: 'Pending' },
        { id: 3, name: 'Code of Conduct', status: 'Pending' }
    ]);

    const toggleStatus = (id: number) => {
        setModules(prev => prev.map(m => m.id === id ? { ...m, status: 'Completed' } : m));
    };

    const allCompleted = modules.every(m => m.status === 'Completed');

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" /> Training & Induction
            </h2>
            <p className="text-slate-500 mb-6 text-sm">Review employee's progress on mandatory induction modules.</p>

            <div className="space-y-4 mb-8">
                {modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${module.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                {module.status === 'Completed' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">{module.name}</h4>
                                <p className="text-xs text-slate-500">Mandatory Module</p>
                            </div>
                        </div>
                        {module.status !== 'Completed' ? (
                            <Button size="sm" variant="outline" onClick={() => toggleStatus(module.id)}>Mark Complete</Button>
                        ) : (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completed</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button disabled={!allCompleted} onClick={onComplete} className="bg-orange-600 hover:bg-orange-700">
                    Complete Training Stage
                </Button>
            </div>
        </div>
    );
};

export default Stage4Training;
