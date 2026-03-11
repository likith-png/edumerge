// Appraisal Cycle Service - Manages cycle configuration and lifecycle

export interface Phase {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    icon: string;
}

export interface Weightages {
    [key: string]: number;
}

export interface RatingThreshold {
    passPercentage: number;
    attendance: number;
    feedback: number;
    trainingCourses: number;
    lessonPlan: number;
}

export interface RatingRules {
    outstanding: RatingThreshold;
    excellent: RatingThreshold;
    good: RatingThreshold;
    satisfactory: RatingThreshold;
}

export interface AppraisalCycle {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    status: 'draft' | 'active' | 'completed';
    phases: Phase[];
    weightages: Weightages;
    ratingRules: RatingRules;
    enabledStages?: {
        kra: boolean;
        kpi: boolean;
        feedback360: boolean;
        review: boolean;
    };
    createdBy: string;
    createdAt: string;
}

const ACTIVE_CYCLE_KEY = 'appraisal_active_cycle';
const ALL_CYCLES_KEY = 'appraisal_cycles';
const CATEGORIES_KEY = 'appraisal_kra_categories';

const INITIAL_CATEGORIES = [
    'Academic', 'Administrative', 'Leadership', 'Compliance', 'Student Engagement', 'Research'
];

/**
 * Check if an active appraisal cycle exists
 */
export function checkActiveCycle(): AppraisalCycle | null {
    try {
        const stored = localStorage.getItem(ACTIVE_CYCLE_KEY);
        if (!stored) return null;

        const cycle = JSON.parse(stored) as AppraisalCycle;
        if (cycle.status === 'active') {
            return cycle;
        }
        return null;
    } catch (error) {
        console.error('Error checking active cycle:', error);
        return null;
    }
}

/**
 * Get the active cycle (throw if none exists)
 */
export function getActiveCycle(): AppraisalCycle {
    const cycle = checkActiveCycle();
    if (!cycle) {
        throw new Error('No active appraisal cycle found');
    }
    return cycle;
}

/**
 * Create a new appraisal cycle
 */
export function createCycle(data: Omit<AppraisalCycle, 'id' | 'createdAt' | 'status'>): AppraisalCycle {
    const newCycle: AppraisalCycle = {
        enabledStages: {
            kra: true,
            kpi: true,
            feedback360: true,
            review: true
        },
        ...data,
        id: `cycle_${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    // Save as active cycle
    localStorage.setItem(ACTIVE_CYCLE_KEY, JSON.stringify(newCycle));

    // Add to all cycles list
    const allCycles = getAllCycles();
    localStorage.setItem(ALL_CYCLES_KEY, JSON.stringify([...allCycles, newCycle]));

    return newCycle;
}

/**
 * Get all created cycles
 */
export function getAllCycles(): AppraisalCycle[] {
    try {
        const stored = localStorage.getItem(ALL_CYCLES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting cycles:', error);
        return [];
    }
}

/**
 * Update an existing cycle
 */
export function updateCycle(id: string, updates: Partial<AppraisalCycle>): AppraisalCycle {
    const allCycles = getAllCycles();
    const cycleIndex = allCycles.findIndex(c => c.id === id);

    if (cycleIndex === -1) {
        throw new Error('Cycle not found');
    }

    const updated = { ...allCycles[cycleIndex], ...updates };
    allCycles[cycleIndex] = updated;

    localStorage.setItem(ALL_CYCLES_KEY, JSON.stringify(allCycles));

    // If it's the active one, update that too
    const active = checkActiveCycle();
    if (active && active.id === id) {
        localStorage.setItem(ACTIVE_CYCLE_KEY, JSON.stringify(updated));
    }

    return updated;
}

/**
 * Delete the active cycle (for testing/reset)
 */
export function deleteCycle(id: string): void {
    const allCycles = getAllCycles().filter(c => c.id !== id);
    localStorage.setItem(ALL_CYCLES_KEY, JSON.stringify(allCycles));

    const active = checkActiveCycle();
    if (active && active.id === id) {
        localStorage.removeItem(ACTIVE_CYCLE_KEY);
    }
}

/**
 * Get current phase based on today's date
 */
export function getCurrentPhase(cycle: AppraisalCycle): Phase | null {
    const today = new Date().toISOString().split('T')[0];

    for (const phase of cycle.phases) {
        if (today >= phase.startDate && today <= phase.endDate) {
            return phase;
        }
    }

    return null;
}

/**
 * Default weightages
 */
export const DEFAULT_WEIGHTAGES: Weightages = {
    'Academic': 40,
    'Professional Conduct': 30,
    'Learning & Development': 20,
    'Compliance': 10
};

/**
 * Category Management
 */
export function getCategories(): string[] {
    try {
        const stored = localStorage.getItem(CATEGORIES_KEY);
        return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch (error) {
        return INITIAL_CATEGORIES;
    }
}

export function saveCategories(categories: string[]): void {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

/**
 * Default rating rules
 */
export const DEFAULT_RATING_RULES: RatingRules = {
    outstanding: {
        passPercentage: 95,
        attendance: 90,
        feedback: 4.5,
        trainingCourses: 2,
        lessonPlan: 95
    },
    excellent: {
        passPercentage: 85,
        attendance: 85,
        feedback: 4.0,
        trainingCourses: 1,
        lessonPlan: 90
    },
    good: {
        passPercentage: 75,
        attendance: 80,
        feedback: 3.5,
        trainingCourses: 0,
        lessonPlan: 85
    },
    satisfactory: {
        passPercentage: 65,
        attendance: 75,
        feedback: 3.0,
        trainingCourses: 0,
        lessonPlan: 75
    }
};

/**
 * Validate weightages sum to 100%
 */
export function validateWeightages(weightages: Weightages, enabledStages?: AppraisalCycle['enabledStages']): boolean {
    if (!enabledStages) {
        // Fallback for old cycles
        const sum = Object.values(weightages).reduce((acc, val) => acc + val, 0);
        return sum === 100;
    }

    let sum = 0;
    if (enabledStages.kra) sum += weightages['Academic'] || 0;
    if (enabledStages.kpi) sum += weightages['Professional Conduct'] || 0;
    if (enabledStages.feedback360) sum += weightages['Learning & Development'] || 0;
    if (enabledStages.review) sum += weightages['Compliance'] || 0;

    return sum === 100;
}

/**
 * Validate phase dates are sequential
 */
export function validatePhases(phases: Phase[]): { valid: boolean; error?: string } {
    for (let i = 0; i < phases.length - 1; i++) {
        const current = phases[i];
        const next = phases[i + 1];

        if (current.endDate >= next.startDate) {
            return {
                valid: false,
                error: `Phase "${current.name}" ends after "${next.name}" starts`
            };
        }
    }

    return { valid: true };
}
