/**
 * StaffContext — Single Source of Truth for Staff Data
 *
 * Every module that needs staff/employee data should consume this context.
 * Data is loaded once from staffPortfolioService and kept in sync via localStorage.
 * Modules read from here instead of keeping their own hardcoded lists.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getAllStaff,
    getStaffMember,
    getDepartments,
    searchStaff,
    type StaffMember,
} from '../services/staffPortfolioService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StaffContextValue {
    /** Full list of all staff members */
    staff: StaffMember[];
    /** Unique department names derived from staff list */
    departments: string[];
    /** Total staff count */
    totalCount: number;
    /** Whether initial load is in progress */
    isLoading: boolean;
    /** Get a single staff member by ID */
    getById: (id: string) => StaffMember | null;
    /** Search staff by name, department, or designation */
    search: (query: string) => StaffMember[];
    /** Filter staff by department */
    byDepartment: (dept: string) => StaffMember[];
    /** Filter staff by status */
    byStatus: (status: StaffMember['status']) => StaffMember[];
    /** Force refresh staff list (e.g. after onboarding a new staff) */
    refresh: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const StaffContext = createContext<StaffContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const load = useCallback(() => {
        setIsLoading(true);
        try {
            const allStaff = getAllStaff();
            setStaff(allStaff);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load + reload whenever localStorage changes (e.g. onboarding completes)
    useEffect(() => {
        load();
    }, [load]);

    // Listen for storage events (e.g. onboarding in another tab)
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'onboarded_staff_ids' || e.key === 'hrms_staff_data') {
                load();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [load]);

    const departments = getDepartments ? getDepartments() : Array.from(new Set(staff.map(s => s.department))).sort();

    const value: StaffContextValue = {
        staff,
        departments,
        totalCount: staff.length,
        isLoading,
        getById: (id) => getStaffMember(id),
        search: (query) => searchStaff ? searchStaff(query) : staff.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.department.toLowerCase().includes(query.toLowerCase()) ||
            s.designation.toLowerCase().includes(query.toLowerCase())
        ),
        byDepartment: (dept) => staff.filter(s => s.department === dept),
        byStatus: (status) => staff.filter(s => s.status === status),
        refresh: load,
    };

    return (
        <StaffContext.Provider value={value}>
            {children}
        </StaffContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useStaff = (): StaffContextValue => {
    const ctx = useContext(StaffContext);
    if (!ctx) throw new Error('useStaff must be used inside <StaffProvider>');
    return ctx;
};

export default StaffContext;
