// Appraisal Service - Education-specific KRA/KPI data and interfaces

// ==================== INTERFACES ====================

export interface KRA {
    id: string;
    title: string;
    description: string;
    category: string;
    weightage: number;
    applicableRoles: string[];
    isMandatory: boolean;
    status: 'Active' | 'Pending Review' | 'Rejected';
}

export interface KPI {
    id: string;
    kraId: string;
    title: string;
    description: string;
    unit: string;
    target: number;
    achieved?: number;
    formula?: string;
    autoCalculated: boolean;
    benchmarkType: 'Department' | 'Institution' | 'National';
    status: 'Active' | 'Pending Review' | 'Rejected';
}

export interface Goal {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string;
    status: 'Draft' | 'Pending Approval' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
    milestones: Milestone[];
    alignedKRA?: string;
}

export interface Milestone {
    id: string;
    title: string;
    targetDate: string;
    status: 'Pending' | 'Completed';
    evidence?: string;
}

export interface AppraisalCycle {
    id: string;
    academicYear: string;
    startDate: string;
    endDate: string;
    phases: AppraisalPhase[];
    currentPhase: string;
}

export interface AppraisalPhase {
    name: string;
    startDate: string;
    endDate: string;
    status: 'Upcoming' | 'Active' | 'Completed';
}

// ==================== MOCK DATA ====================

// KRA Library - Teaching Staff
export const teachingStaffKRAs: KRA[] = [
    {
        id: 'kra-t1',
        title: 'Academic Result Performance',
        description: 'Deliver quality teaching to achieve target pass percentages and student outcomes',
        category: 'Academic',
        weightage: 25,
        applicableRoles: ['Teaching Staff', 'HOD'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-t2',
        title: 'Lesson Planning & Curriculum Adherence',
        description: 'Maintain comprehensive lesson plans and follow academic calendar',
        category: 'Academic',
        weightage: 15,
        applicableRoles: ['Teaching Staff'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-t3',
        title: 'Student Engagement & Feedback',
        description: 'Ensure high student satisfaction and engagement scores',
        category: 'Student Engagement',
        weightage: 20,
        applicableRoles: ['Teaching Staff', 'HOD'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-t4',
        title: 'Professional Development',
        description: 'Complete mandatory FDP/training hours and certifications',
        category: 'Compliance',
        weightage: 10,
        applicableRoles: ['Teaching Staff', 'HOD', 'Principal'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-t5',
        title: 'Research & Publications',
        description: 'Contribute to institutional research output and scholarly publications',
        category: 'Research',
        weightage: 15,
        applicableRoles: ['Teaching Staff', 'HOD'],
        isMandatory: false,
        status: 'Active'
    },
    {
        id: 'kra-t6',
        title: 'Co-curricular Activities',
        description: 'Organize and participate in student development programs',
        category: 'Student Engagement',
        weightage: 10,
        applicableRoles: ['Teaching Staff'],
        isMandatory: false,
        status: 'Active'
    },
    {
        id: 'kra-t7',
        title: 'Attendance & Discipline',
        description: 'Maintain punctuality and professional conduct',
        category: 'Compliance',
        weightage: 5,
        applicableRoles: ['Teaching Staff', 'Non-Teaching'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-t8-pending',
        title: 'Industry Collaboration (Pending)',
        description: 'Establish MoUs or organize guest lectures with industry partners',
        category: 'Student Engagement',
        weightage: 10,
        applicableRoles: ['Teaching Staff', 'HOD'],
        isMandatory: false,
        status: 'Pending Review'
    }
];

// KRA Library - HOD
export const hodKRAs: KRA[] = [
    {
        id: 'kra-h1',
        title: 'Department Result Management',
        description: 'Ensure overall department achieves target pass percentages',
        category: 'Academic',
        weightage: 30,
        applicableRoles: ['HOD'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-h2',
        title: 'Faculty Mentoring & Development',
        description: 'Guide and develop teaching staff under supervision',
        category: 'Leadership',
        weightage: 20,
        applicableRoles: ['HOD', 'Principal'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-h3',
        title: 'Compliance & Accreditation Readiness',
        description: 'Maintain NAAC/NBA documentation and readiness',
        category: 'Compliance',
        weightage: 20,
        applicableRoles: ['HOD'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-h4',
        title: 'Academic Planning & Innovation',
        description: 'Design department curriculum and innovative teaching methods',
        category: 'Academic',
        weightage: 15,
        applicableRoles: ['HOD'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-h5',
        title: 'Student Satisfaction Index',
        description: 'Ensure high student satisfaction scores for the department',
        category: 'Student Engagement',
        weightage: 15,
        applicableRoles: ['HOD'],
        isMandatory: true,
        status: 'Active'
    }
];

// KRA Library - Principal/Director
export const principalKRAs: KRA[] = [
    {
        id: 'kra-p1',
        title: 'Institution Performance Growth',
        description: 'Drive overall institutional academic excellence and growth',
        category: 'Academic',
        weightage: 25,
        applicableRoles: ['Principal'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-p2',
        title: 'Accreditation & Ranking',
        description: 'Achieve and maintain NAAC/NBA accreditation and rankings',
        category: 'Compliance',
        weightage: 25,
        applicableRoles: ['Principal'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-p3',
        title: 'Staff Stability & Development',
        description: 'Maintain low attrition and high engagement among faculty',
        category: 'Leadership',
        weightage: 20,
        applicableRoles: ['Principal'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-p4',
        title: 'Budget & Resource Management',
        description: 'Ensure optimal utilization of institutional budget',
        category: 'Administrative',
        weightage: 15,
        applicableRoles: ['Principal'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-p5',
        title: 'Governance & Compliance',
        description: 'Maintain regulatory compliance and governance standards',
        category: 'Compliance',
        weightage: 15,
        applicableRoles: ['Principal'],
        isMandatory: true,
        status: 'Active'
    }
];

// KRA Library - Non-Teaching Staff
export const nonTeachingKRAs: KRA[] = [
    {
        id: 'kra-nt1',
        title: 'Process Efficiency',
        description: 'Streamline administrative processes and reduce turnaround time',
        category: 'Administrative',
        weightage: 30,
        applicableRoles: ['Non-Teaching'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-nt2',
        title: 'Timely Documentation',
        description: 'Maintain accurate records and meet documentation deadlines',
        category: 'Administrative',
        weightage: 25,
        applicableRoles: ['Non-Teaching'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-nt3',
        title: 'Student Service Rating',
        description: 'Ensure high satisfaction in student-facing services',
        category: 'Student Engagement',
        weightage: 20,
        applicableRoles: ['Non-Teaching'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-nt4',
        title: 'SLA Compliance',
        description: 'Meet service level agreements for assigned tasks',
        category: 'Compliance',
        weightage: 15,
        applicableRoles: ['Non-Teaching'],
        isMandatory: true,
        status: 'Active'
    },
    {
        id: 'kra-nt5',
        title: 'Attendance & Discipline',
        description: 'Maintain punctuality and professional conduct',
        category: 'Compliance',
        weightage: 10,
        applicableRoles: ['Non-Teaching'],
        isMandatory: true,
        status: 'Active'
    }
];

// KPI Library - Linked to KRAs
export const kpiLibrary: KPI[] = [
    // Academic Result Performance KPIs
    {
        id: 'kpi-001',
        kraId: 'kra-t1',
        title: 'Class Pass Percentage',
        description: 'Percentage of students passing in assigned subjects',
        unit: '%',
        target: 85,
        achieved: 88,
        formula: '(Passed Students / Total Students) × 100',
        autoCalculated: true,
        benchmarkType: 'Department',
        status: 'Active'
    },
    {
        id: 'kpi-002',
        kraId: 'kra-t1',
        title: 'Average Student Score',
        description: 'Average marks obtained by students',
        unit: 'Marks',
        target: 75,
        achieved: 78,
        autoCalculated: true,
        benchmarkType: 'Department',
        status: 'Active'
    },
    // Lesson Planning KPIs
    {
        id: 'kpi-003',
        kraId: 'kra-t2',
        title: 'Lesson Plan Completion',
        description: 'Percentage of lesson plans submitted on time',
        unit: '%',
        target: 100,
        achieved: 95,
        autoCalculated: false,
        benchmarkType: 'Institution',
        status: 'Active'
    },
    {
        id: 'kpi-004',
        kraId: 'kra-t2',
        title: 'Syllabus Coverage',
        description: 'Percentage of syllabus completed as per calendar',
        unit: '%',
        target: 100,
        achieved: 98,
        autoCalculated: false,
        benchmarkType: 'Department',
        status: 'Active'
    },
    // Student Engagement KPIs
    {
        id: 'kpi-005',
        kraId: 'kra-t3',
        title: 'Student Feedback Score',
        description: 'Average rating from student feedback surveys',
        unit: 'Rating',
        target: 4.0,
        achieved: 4.3,
        formula: 'Average of all student ratings',
        autoCalculated: true,
        benchmarkType: 'Institution',
        status: 'Active'
    },
    {
        id: 'kpi-006',
        kraId: 'kra-t3',
        title: 'Classroom Attendance',
        description: 'Average student attendance in classes',
        unit: '%',
        target: 80,
        achieved: 85,
        autoCalculated: true,
        benchmarkType: 'Department',
        status: 'Active'
    },
    // Professional Development KPIs
    {
        id: 'kpi-007',
        kraId: 'kra-t4',
        title: 'FDP Hours Completed',
        description: 'Total hours of Faculty Development Programs attended',
        unit: 'Hours',
        target: 40,
        achieved: 45,
        autoCalculated: true,
        benchmarkType: 'Institution',
        status: 'Active'
    },
    {
        id: 'kpi-008',
        kraId: 'kra-t4',
        title: 'Certifications Obtained',
        description: 'Number of professional certifications earned',
        unit: 'Count',
        target: 2,
        achieved: 3,
        autoCalculated: false,
        benchmarkType: 'Institution',
        status: 'Active'
    },
    // Research KPIs
    {
        id: 'kpi-009',
        kraId: 'kra-t5',
        title: 'Research Papers Published',
        description: 'Number of papers published in journals/conferences',
        unit: 'Count',
        target: 2,
        achieved: 1,
        autoCalculated: false,
        benchmarkType: 'National',
        status: 'Active'
    },
    {
        id: 'kpi-010',
        kraId: 'kra-t5',
        title: 'Research Grants Secured',
        description: 'Funding amount secured for research projects',
        unit: 'INR',
        target: 100000,
        achieved: 0,
        autoCalculated: false,
        benchmarkType: 'National',
        status: 'Active'
    },
    {
        id: 'kpi-011-pending',
        kraId: 'kra-t5',
        title: 'Patents Filed (Pending)',
        description: 'Number of institutional patents filed',
        unit: 'Count',
        target: 1,
        achieved: 0,
        autoCalculated: false,
        benchmarkType: 'Institution',
        status: 'Pending Review'
    }
];

// SMART Goal Templates
export const goalTemplates = {
    teaching: [
        {
            title: 'Improve Class Pass Percentage',
            description: 'Achieve 90% pass rate in [Subject Name] by implementing remedial classes and personalized attention',
            type: 'Academic' as const,
            suggestedKRA: 'kra-t1'
        },
        {
            title: 'Complete Advanced Certification',
            description: 'Obtain [Certification Name] from [Provider] to enhance subject expertise',
            type: 'Professional' as const,
            suggestedKRA: 'kra-t4'
        },
        {
            title: 'Publish Research Paper',
            description: 'Submit and publish 1 research paper in a peer-reviewed journal on [Topic]',
            type: 'Research' as const,
            suggestedKRA: 'kra-t5'
        }
    ],
    hod: [
        {
            title: 'Department Result Improvement',
            description: 'Achieve department average of 85% pass rate across all subjects',
            type: 'Academic' as const,
            suggestedKRA: 'kra-h1'
        },
        {
            title: 'NAAC Documentation Readiness',
            description: 'Complete all NAAC Criterion documentation with 100% compliance',
            type: 'Administrative' as const,
            suggestedKRA: 'kra-h3'
        }
    ],
    principal: [
        {
            title: 'Achieve NAAC A+ Grade',
            description: 'Successfully complete NAAC accreditation with A+ grade',
            type: 'Administrative' as const,
            suggestedKRA: 'kra-p2'
        },
        {
            title: 'Reduce Staff Attrition',
            description: 'Maintain staff attrition below 10% through engagement initiatives',
            type: 'Professional' as const,
            suggestedKRA: 'kra-p3'
        }
    ]
};

// Current Appraisal Cycle
export const currentAppraisalCycle: AppraisalCycle = {
    id: 'cycle-2024-25',
    academicYear: '2024-25',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    currentPhase: 'Goal Setting',
    phases: [
        {
            name: 'Goal Setting',
            startDate: '2024-04-01',
            endDate: '2024-05-30',
            status: 'Active'
        },
        {
            name: 'Self-Assessment',
            startDate: '2024-06-01',
            endDate: '2024-06-15',
            status: 'Upcoming'
        },
        {
            name: 'Mid-Year Review',
            startDate: '2024-10-01',
            endDate: '2024-10-31',
            status: 'Upcoming'
        },
        {
            name: 'Final Assessment',
            startDate: '2025-03-01',
            endDate: '2025-03-31',
            status: 'Upcoming'
        },
        {
            name: 'Normalization & Approval',
            startDate: '2025-04-01',
            endDate: '2025-04-15',
            status: 'Upcoming'
        }
    ]
};

// ==================== SERVICE FUNCTIONS ====================

export interface ManagerFeedback {
    id: string;
    period: string;
    comment: string;
    managerName: string;
    date: string;
    kpiId?: string;
}

export const mockManagerFeedback: ManagerFeedback[] = [
    {
        id: 'fb-1',
        period: '2024-07',
        comment: 'Excellent performance on class results. Keep it up!',
        managerName: 'Dr. Rajesh Kumar',
        date: '2024-08-05'
    },
    {
        id: 'fb-2',
        period: '2024-07',
        comment: 'Research paper submission is slightly delayed. Please prioritize this month.',
        managerName: 'Dr. Rajesh Kumar',
        date: '2024-08-05',
        kpiId: 'kpi-009'
    }
];

export const getKRAsWithKPIsByRole = (role: string) => {
    const kras = getKRAsByRole(role);
    return kras.map(kra => ({
        ...kra,
        kpis: getKPIsByKRA(kra.id)
    }));
};

export const getManagerFeedbackByPeriod = (period: string) => {
    return mockManagerFeedback.filter(f => f.period === period);
};

export const getKRAsByRole = (role: string): KRA[] => {
    switch (role) {
        case 'Teaching Staff':
        case 'ADMIN': // Fallback for testing
        case 'HR_ADMIN': // Fallback for testing
            return teachingStaffKRAs;
        case 'HOD':
            return [...teachingStaffKRAs, ...hodKRAs];
        case 'Principal':
            return principalKRAs;
        case 'Non-Teaching':
            return nonTeachingKRAs;
        default:
            return teachingStaffKRAs; // Default to teaching for demo
    }
};

export const getKPIsByKRA = (kraId: string): KPI[] => {
    return kpiLibrary.filter(kpi => kpi.kraId === kraId);
};

export const getGoalTemplatesByRole = (role: string) => {
    if (role === 'Teaching Staff' || role === 'ADMIN' || role === 'HR_ADMIN') return goalTemplates.teaching;
    if (role === 'HOD') return goalTemplates.hod;
    if (role === 'Principal') return goalTemplates.principal;
    return [];
};

export const getCurrentCycle = (): AppraisalCycle => {
    return currentAppraisalCycle;
};

export const getAllKRAs = (): KRA[] => {
    return [...teachingStaffKRAs, ...hodKRAs, ...principalKRAs, ...nonTeachingKRAs];
};

export const getKRAById = (id: string): KRA | undefined => {
    return getAllKRAs().find(kra => kra.id === id);
};
