import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    icon?: React.ElementType;
    showBack?: boolean;
    showHome?: boolean;
    headerActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    description,
    icon: Icon,
    showBack = false,
    showHome = false,
    headerActions
}) => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col bg-slate-50/50">
            {/* Page Header (Fixed) */}
            <header className="shrink-0 bg-white border-b border-slate-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {/* Optional Home button */}
                            {showHome && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-lg border-slate-200 h-9 w-9 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                                    onClick={() => navigate('/')}
                                >
                                    <Home className="h-4 w-4" />
                                </Button>
                            )}

                            {/* Optional back button */}
                            {showBack && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-slate-100 h-9 w-9 text-slate-600"
                                    onClick={() => navigate(-1)}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}

                            {/* Icon chip */}
                            {Icon && (
                                <div className="p-2 bg-slate-900 rounded-lg shadow-lg shadow-slate-900/10">
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            )}

                            {/* Title block */}
                            <div>
                                <h1 className="text-lg font-bold text-slate-900 leading-none">{title}</h1>
                                {description && <p className="text-slate-500 text-xs font-medium mt-1">{description}</p>}
                            </div>
                        </div>

                        {/* Action buttons */}
                        {headerActions && (
                            <div className="flex items-center gap-2">
                                {headerActions}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <main className="flex-grow overflow-y-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
