// Workflow State Management Service for Appraisal System

export const WorkflowPhase = {
    NOT_STARTED: 'Not Started',
    GOAL_SETTING: 'Goal Setting',
    IN_PROGRESS: 'In Progress',
    MID_REVIEW: 'Mid Review',
    FEEDBACK_COLLECTION: 'Feedback Collection',
    FINAL_REVIEW: 'Final Review',
    CALIBRATION: 'Calibration',
    APPROVED: 'Approved',
    INCREMENT_PROCESSED: 'Increment Processed',
    CLOSED: 'Closed'
} as const;

export type WorkflowPhase = typeof WorkflowPhase[keyof typeof WorkflowPhase];

export interface WeightageConfig {
    kra: number;
    kpi: number;
    feedback360: number;
    compliance: number;
}

export interface RatingScale {
    type: '1-5' | '1-10' | 'A-F';
    labels: string[];
    outstanding: number;
    excellent: number;
    good: number;
    satisfactory: number;
    needsImprovement: number;
}

export interface Deadline {
    phase: WorkflowPhase;
    dueDate: string;
    isOverdue: boolean;
}

export interface AppraisalCycle {
    id: string;
    academicYear: string;
    status: 'Draft' | 'Active' | 'Locked' | 'Completed';
    startDate: string;
    endDate: string;
    staffCategories: string[];
    weightageConfig: WeightageConfig;
    ratingScale: RatingScale;
    deadlines: Deadline[];
    allowMidYearReview: boolean;
    enableNormalization: boolean;
    bellCurveEnforced: boolean;
}

export interface Feedback360Summary {
    selfRating: number;
    managerRating: number;
    peerRating: number;
    studentRating?: number;
    parentRating?: number;
    averageRating: number;
    completionRate: number;
}

export interface AppraisalInstance {
    id: string;
    cycleId: string;
    employeeId: string;
    employeeName: string;
    role: string;
    department: string;
    currentPhase: WorkflowPhase;
    status: 'Active' | 'PIP' | 'Completed' | 'On Hold';
    goalsApproved: boolean;
    midYearCompleted: boolean;
    feedback360Completed: boolean;
    finalSubmitted: boolean;
    hodReviewCompleted: boolean;
    calibrationCompleted: boolean;
    finalRating: number | null;
    performanceBand: string | null;
    recommendedIncrement: number | null;
    isPIP: boolean;
    isPromotion: boolean;
    lastUpdated: string;
}

// Mock Active Cycle
export const getActiveCycle = (): AppraisalCycle => {
    return {
        id: 'cycle-2024-25',
        academicYear: '2024-25',
        status: 'Active',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        staffCategories: ['Teaching Staff', 'HOD', 'Principal', 'Non-Teaching Staff'],
        weightageConfig: {
            kra: 40,
            kpi: 30,
            feedback360: 20,
            compliance: 10
        },
        ratingScale: {
            type: '1-5',
            labels: ['1 - Poor', '2 - Below Average', '3 - Average', '4 - Good', '5 - Outstanding'],
            outstanding: 5,
            excellent: 4,
            good: 3,
            satisfactory: 2,
            needsImprovement: 1
        },
        deadlines: [
            { phase: WorkflowPhase.GOAL_SETTING, dueDate: '2024-05-15', isOverdue: false },
            { phase: WorkflowPhase.MID_REVIEW, dueDate: '2024-10-31', isOverdue: false },
            { phase: WorkflowPhase.FEEDBACK_COLLECTION, dueDate: '2025-02-15', isOverdue: false },
            { phase: WorkflowPhase.FINAL_REVIEW, dueDate: '2025-03-15', isOverdue: false },
            { phase: WorkflowPhase.CALIBRATION, dueDate: '2025-03-25', isOverdue: false },
            { phase: WorkflowPhase.APPROVED, dueDate: '2025-03-31', isOverdue: false }
        ],
        allowMidYearReview: true,
        enableNormalization: true,
        bellCurveEnforced: false
    };
};

// Mock Appraisal Instances
export const getMyAppraisalInstance = (role: string): AppraisalInstance => {
    return {
        id: 'appraisal-001',
        cycleId: 'cycle-2024-25',
        employeeId: role === 'Teaching Staff' ? 'FAC001' : role === 'HOD' ? 'HOD001' : 'PRI001',
        employeeName: role === 'Teaching Staff' ? 'Dr. Priya Sharma' : role === 'HOD' ? 'Prof. Rajesh Kumar' : 'Dr. Sunita Patel',
        role,
        department: 'Computer Science',
        currentPhase: WorkflowPhase.IN_PROGRESS,
        status: 'Active',
        goalsApproved: true,
        midYearCompleted: false,
        feedback360Completed: false,
        finalSubmitted: false,
        hodReviewCompleted: false,
        calibrationCompleted: false,
        finalRating: null,
        performanceBand: null,
        recommendedIncrement: null,
        isPIP: false,
        isPromotion: false,
        lastUpdated: '2024-08-15'
    };
};

// Phase Transition Logic
export const canTransitionTo = (
    currentPhase: WorkflowPhase,
    nextPhase: WorkflowPhase,
    instance: AppraisalInstance
): boolean => {
    const phaseOrder = [
        WorkflowPhase.NOT_STARTED,
        WorkflowPhase.GOAL_SETTING,
        WorkflowPhase.IN_PROGRESS,
        WorkflowPhase.MID_REVIEW,
        WorkflowPhase.FEEDBACK_COLLECTION,
        WorkflowPhase.FINAL_REVIEW,
        WorkflowPhase.CALIBRATION,
        WorkflowPhase.APPROVED,
        WorkflowPhase.INCREMENT_PROCESSED,
        WorkflowPhase.CLOSED
    ];

    const currentIndex = phaseOrder.indexOf(currentPhase);
    const nextIndex = phaseOrder.indexOf(nextPhase);

    // Can't go backwards
    if (nextIndex <= currentIndex) return false;

    // Phase-specific validations
    switch (nextPhase) {
        case WorkflowPhase.IN_PROGRESS:
            return instance.goalsApproved;
        case WorkflowPhase.FEEDBACK_COLLECTION:
            return instance.midYearCompleted || !getActiveCycle().allowMidYearReview;
        case WorkflowPhase.FINAL_REVIEW:
            return instance.feedback360Completed;
        case WorkflowPhase.CALIBRATION:
            return instance.hodReviewCompleted;
        case WorkflowPhase.APPROVED:
            return instance.calibrationCompleted;
        case WorkflowPhase.INCREMENT_PROCESSED:
            return instance.finalRating !== null;
        default:
            return true;
    }
};

// Get Available Actions based on role and phase
export const getAvailableActions = (instance: AppraisalInstance, userRole: string): string[] => {
    const actions: string[] = [];

    if (userRole === 'Teaching Staff' || userRole === 'Non-Teaching Staff') {
        if (instance.currentPhase === WorkflowPhase.GOAL_SETTING && !instance.goalsApproved) {
            actions.push('Set Goals', 'Submit for Approval');
        }
        if (instance.currentPhase === WorkflowPhase.IN_PROGRESS) {
            actions.push('View KPI Progress', 'Add Manual Entries');
        }
        if (instance.currentPhase === WorkflowPhase.MID_REVIEW && !instance.midYearCompleted) {
            actions.push('Complete Mid-Year Review');
        }
        if (instance.currentPhase === WorkflowPhase.FEEDBACK_COLLECTION) {
            actions.push('Submit Self Feedback');
        }
        if (instance.currentPhase === WorkflowPhase.FINAL_REVIEW && !instance.finalSubmitted) {
            actions.push('Submit Final Appraisal');
        }
    }

    if (userRole === 'HOD') {
        if (instance.currentPhase === WorkflowPhase.GOAL_SETTING) {
            actions.push('Review Goals', 'Approve Goals');
        }
        if (instance.currentPhase === WorkflowPhase.FINAL_REVIEW && !instance.hodReviewCompleted) {
            actions.push('Review Faculty Appraisals');
        }
    }

    if (userRole === 'HR' || userRole === 'Principal') {
        if (instance.currentPhase === WorkflowPhase.CALIBRATION) {
            actions.push('Calibrate Ratings', 'Normalize Scores');
        }
        if (instance.currentPhase === WorkflowPhase.APPROVED) {
            actions.push('Process Increments', 'Generate Letters');
        }
    }

    return actions;
};

// Calculate Final Score
export const calculateFinalScore = (
    kraScore: number,
    kpiScore: number,
    feedback360Score: number,
    complianceScore: number,
    weightage: WeightageConfig
): number => {
    return (
        (kraScore * weightage.kra / 100) +
        (kpiScore * weightage.kpi / 100) +
        (feedback360Score * weightage.feedback360 / 100) +
        (complianceScore * weightage.compliance / 100)
    );
};

// Check Deadlines
export const getUpcomingDeadlines = (cycle: AppraisalCycle): Deadline[] => {
    const today = new Date();
    return cycle.deadlines
        .map(d => ({
            ...d,
            isOverdue: new Date(d.dueDate) < today
        }))
        .filter(d => !d.isOverdue && new Date(d.dueDate) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));
};

// Get Performance Band
export const getPerformanceBand = (finalRating: number, ratingScale: RatingScale): string => {
    if (finalRating >= ratingScale.outstanding) return 'Outstanding';
    if (finalRating >= ratingScale.excellent) return 'Excellent';
    if (finalRating >= ratingScale.good) return 'Good';
    if (finalRating >= ratingScale.satisfactory) return 'Satisfactory';
    return 'Needs Improvement';
};

// Increment Mapping
export const getRecommendedIncrement = (performanceBand: string): number => {
    const incrementMap: Record<string, number> = {
        'Outstanding': 15,
        'Excellent': 10,
        'Good': 7,
        'Satisfactory': 5,
        'Needs Improvement': 0
    };
    return incrementMap[performanceBand] || 0;
};
