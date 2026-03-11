import { createContext, useContext, useState, type ReactNode } from 'react';
import { User, Briefcase, UserCog, GraduationCap } from 'lucide-react';

export type UserRole = 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'ADMIN' | 'ALUMNI';

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
            default: return { name: 'Guest', id: 'guest-000' };
        }
    };

    return (
        <PersonaContext.Provider value={{ role, setRole, user: getMockUser(role) }}>
            {children}
            {/* Floating Persona Switcher for DEMO */}
            <div className="fixed bottom-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-slate-200 flex flex-col gap-2">
                <div className="text-xs font-bold text-slate-500 mb-1 px-1">SWITCH PERSONA</div>
                <button
                    onClick={() => setRole('HR_ADMIN')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${role === 'HR_ADMIN' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                    <UserCog className="w-3 h-3" /> HR Admin
                </button>
                <button
                    onClick={() => setRole('MANAGER')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${role === 'MANAGER' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                    <Briefcase className="w-3 h-3" /> Manager
                </button>
                <button
                    onClick={() => setRole('EMPLOYEE')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${role === 'EMPLOYEE' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                    <User className="w-3 h-3" /> Employee
                </button>
                <button
                    onClick={() => setRole('ALUMNI')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${role === 'ALUMNI' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                    <GraduationCap className="w-3 h-3" /> Alumni
                </button>
            </div>
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
