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
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    description,
    icon: Icon,
    showBack = false,
    showHome = false
}) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Page Header (Compact Hero) */}
            <div className="relative overflow-hidden bg-white border-b border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-slate-50/50"></div>
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 relative">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {/* Optional Home button */}
                            {showHome && (
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                </button>
                            )}

                            {/* Optional back button */}
                            {showBack && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-slate-100 h-8 w-8"
                                    onClick={() => navigate(-1)}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}

                            {/* Icon chip */}
                            {Icon && (
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md shadow-blue-500/20">
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            )}

                            {/* Title block */}
                            <div>
                                <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900">{title}</h1>
                                {description && <p className="text-slate-500 text-xs">{description}</p>}
                            </div>
                        </div>

                        {/* Action buttons - Hidden by design request */}
                        <div className="flex items-center gap-2">
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
