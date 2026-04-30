import { createContext, useContext, useState, type ReactNode } from 'react';
import { User, Briefcase, UserCog, GraduationCap, Users, X, Truck } from 'lucide-react';

export type UserRole = 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'ADMIN' | 'ALUMNI' | 'DRIVER';

interface PersonaContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    user: {
        name: string;
        id: string;
        department?: string;
        teamIds?: string[];
    };
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<UserRole>('HR_ADMIN');
    const [isOpen, setIsOpen] = useState(false);

    const getMockUser = (role: UserRole) => {
        switch (role) {
            case 'HR_ADMIN': return { name: 'Sarah HR', id: 'hr-001', department: 'Human Resources' };
            case 'MANAGER': return {
                name: 'Dr. Rajesh (HOD)',
                id: 'hod-001',
                department: 'Computer Science',
                teamIds: ['emp-001', 'emp-002', 'emp-003']
            };
            case 'EMPLOYEE': return { name: 'John Faculty', id: 'emp-001', department: 'Computer Science' };
            case 'ADMIN': return { name: 'System Admin', id: 'admin-001', department: 'IT' };
            case 'ALUMNI': return { name: 'Jane Ex-Faculty', id: 'alum-001', department: 'Mechanical Engineering' };
            case 'DRIVER': return { name: 'Rajesh Kumar', id: 'driver-001', department: 'Transport' };
            default: return { name: 'Guest', id: 'guest-000' };
        }
    };

    return (
        <PersonaContext.Provider value={{ role, setRole, user: getMockUser(role) }}>
            {children}
            
            {/* Floating Persona Switcher Trigger */}
            <button
                id="persona-switcher-trigger"
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group border-2 border-white/20 backdrop-blur-sm ${isOpen ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white'}`}
                title="Switch Persona"
            >
                {isOpen ? (
                    <X className="w-6 h-6 animate-in spin-in-180 duration-300" />
                ) : (
                    <Users className="w-6 h-6 animate-in zoom-in-50 duration-300" />
                )}
                
                {/* Tooltip / Badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                    </span>
                )}
            </button>

            {/* Persona Switcher Menu */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 p-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-indigo-50 flex flex-col gap-1.5 min-w-[220px] animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.1em] mb-2 px-3 pt-2 pb-2 border-b border-indigo-50/50 flex items-center justify-between">
                        <span>Current: {role.replace('_', ' ')}</span>
                    </div>
                    
                    {[
                        { id: 'HR_ADMIN', label: 'HR Admin', icon: UserCog, activeClass: 'bg-indigo-600 text-white shadow-indigo-100', hoverClass: 'hover:bg-indigo-50 text-slate-600 hover:text-indigo-600', iconColor: 'text-indigo-500' },
                        { id: 'MANAGER', label: 'Manager (HOD)', icon: Briefcase, activeClass: 'bg-blue-600 text-white shadow-blue-100', hoverClass: 'hover:bg-blue-50 text-slate-600 hover:text-blue-600', iconColor: 'text-blue-500' },
                        { id: 'EMPLOYEE', label: 'Employee', icon: User, activeClass: 'bg-sky-600 text-white shadow-sky-100', hoverClass: 'hover:bg-sky-50 text-slate-600 hover:text-sky-600', iconColor: 'text-sky-500' },
                        { id: 'ALUMNI', label: 'Alumni', icon: GraduationCap, activeClass: 'bg-emerald-600 text-white shadow-emerald-100', hoverClass: 'hover:bg-emerald-50 text-slate-600 hover:text-emerald-600', iconColor: 'text-emerald-500' },
                        { id: 'DRIVER', label: 'Driver', icon: Truck, activeClass: 'bg-orange-600 text-white shadow-orange-100', hoverClass: 'hover:bg-orange-50 text-slate-600 hover:text-orange-600', iconColor: 'text-orange-500' }
                    ].map((persona) => {
                        const Icon = persona.icon;
                        const isActive = role === persona.id;
                        return (
                            <button
                                key={persona.id}
                                onClick={() => {
                                    setRole(persona.id as UserRole);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 group ${
                                    isActive 
                                        ? `${persona.activeClass} shadow-sm translate-x-1` 
                                        : `${persona.hoverClass} hover:translate-x-1`
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : persona.iconColor}`} />
                                {persona.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </PersonaContext.Provider>
    );
};

export const usePersona = () => {
    const context = useContext(PersonaContext);
    if (context === undefined) {
        throw new Error('usePersona must be used within a PersonaProvider');
    }
    return context;
};
