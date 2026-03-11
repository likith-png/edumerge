import { Button } from '../ui/button';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const Stage5Probation = ({ onComplete }: any) => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Probation & Confirmation
            </h2>
            <p className="text-slate-500 mb-6 text-sm">Final step: Evaluate performance and confirm employment.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="font-bold text-slate-900 mb-2">Performance Review</h4>
                        <p className="text-sm text-slate-600 mb-4">Manager has submitted positive feedback. All KPIs met.</p>
                        <div className="flex gap-2">
                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Score: 4.5/5</span>
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">Recommended</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50 border border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="font-bold text-slate-900 mb-2">Completion Checklist</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Documents Verified</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Training Completed</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 30-60-90 Reviews Done</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-3 justify-end">
                <Button variant="outline" className="text-amber-600 hover:bg-amber-50">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Extend Probation
                </Button>
                <Button onClick={onComplete} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Confirm Employment
                </Button>
            </div>
        </div>
    );
};

export default Stage5Probation;
