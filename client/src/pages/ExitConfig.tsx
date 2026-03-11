import React from 'react';
import ExitConfiguration from '../components/exit/ExitConfiguration';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExitConfig: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <header className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/exit')}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Exit Configuration</h1>
                    <p className="text-sm text-slate-500">Manage settings for exit workflows and policies</p>
                </div>
            </header>

            <div className="h-[calc(100vh-160px)]">
                <ExitConfiguration />
            </div>
        </div>
    );
};

export default ExitConfig;
