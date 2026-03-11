

// Mock Data Generators for Modules without Backends

const generateRecruitmentData = (isGroup: boolean, factor: number) => ({
    openPositions: Math.round((isGroup ? 45 : 12) * factor),
    timeToHire: Math.round((isGroup ? 32 : 28) * (2 - factor)), // Time should decrease if less data maybe, or keep same
    offersReleased: Math.round((isGroup ? 150 : 45) * factor),
    offersAccepted: Math.round((isGroup ? 120 : 38) * factor),
    pipeline: [
        { stage: 'Sourced', count: Math.round((isGroup ? 450 : 120) * factor) },
        { stage: 'Interview', count: Math.round((isGroup ? 180 : 45) * factor) },
        { stage: 'Offer', count: Math.round((isGroup ? 60 : 15) * factor) },
        { stage: 'Hired', count: Math.round((isGroup ? 45 : 8) * factor) }
    ],
    sources: [
        { name: 'Referral', value: 40 },
        { name: 'LinkedIn', value: 30 },
        { name: 'Careers', value: 20 },
        { name: 'Agencies', value: 10 }
    ]
});

const generateOnboardingData = (isGroup: boolean, factor: number) => ({
    activeOnboarding: Math.round((isGroup ? 120 : 25) * factor),
    avgOnboardingDays: Math.round((isGroup ? 18 : 15)),
    completionRate: isGroup ? 88 : 92,
    feedbackScore: isGroup ? 4.2 : 4.5,
    stageBreakdown: [
        { stage: 'Doc Verification', count: Math.round((isGroup ? 30 : 5) * factor) },
        { stage: 'Assets', count: Math.round((isGroup ? 20 : 4) * factor) },
        { stage: 'Training', count: Math.round((isGroup ? 50 : 12) * factor) },
        { stage: 'Probation', count: Math.round((isGroup ? 20 : 4) * factor) }
    ]
});

const generateLnDData = (isGroup: boolean, factor: number) => ({
    overallCompletion: isGroup ? 75 : 82,
    avgHours: isGroup ? 12 : 14,
    skillGaps: Math.round((isGroup ? 45 : 12) * factor),
    topCourses: [
        { name: 'Classroom Mgmt', completion: 95 },
        { name: 'Digital Tools', completion: 78 },
        { name: 'Child Psychology', completion: 82 }
    ],
    deptPerformance: [
        { dept: 'Pre-Primary', completion: 85, hours: Math.round(120 * factor) },
        { dept: 'Primary', completion: 92, hours: Math.round(150 * factor) },
        { dept: 'Middle', completion: 78, hours: Math.round(90 * factor) },
        { dept: 'Secondary', completion: 95, hours: Math.round(210 * factor) },
        { dept: 'Admin', completion: 65, hours: Math.round(45 * factor) },
    ]
});

const generatePerformanceData = (isGroup: boolean, factor: number) => ({
    appraisalsCompleted: isGroup ? 85 : 92, // percentage
    avgRating: isGroup ? 3.8 : 4.1,
    bellCurve: [
        { rating: 'Unsatisfactory', count: Math.round((isGroup ? 5 : 2) * factor) },
        { rating: 'Needs Improvement', count: Math.round((isGroup ? 15 : 5) * factor) },
        { rating: 'Meets Expectations', count: Math.round((isGroup ? 60 : 18) * factor) },
        { rating: 'Exceeds Expectations', count: Math.round((isGroup ? 15 : 8) * factor) },
        { rating: 'Outstanding', count: Math.round((isGroup ? 5 : 3) * factor) }
    ],
    topPerformers: Math.round((isGroup ? 12 : 3) * factor),
    pipCases: Math.round((isGroup ? 8 : 2) * factor)
});

const generateEngagementData = (isGroup: boolean, factor: number) => ({
    eNPS: isGroup ? 42 : 56,
    participation: isGroup ? 68 : 76,
    moodScore: isGroup ? 7.2 : 8.5,
    categories: [
        { type: 'Kudos', value: Math.round((isGroup ? 1200 : 450) * factor) },
        { type: 'Ideas', value: Math.round((isGroup ? 350 : 120) * factor) },
        { type: 'Events', value: Math.round((isGroup ? 80 : 25) * factor) }
    ]
});

const generateProbationData = (isGroup: boolean, factor: number) => ({
    activeProbation: Math.round((isGroup ? 42 : 12) * factor),
    highRisk: Math.round((isGroup ? 3 : 1) * factor),
    confirmationRate: isGroup ? 92 : 95,
    avgTime: isGroup ? 180 : 175,
    trend: [
        { month: 'Jan', confirmed: Math.round((isGroup ? 8 : 2) * factor), extended: Math.round((isGroup ? 2 : 1) * factor), risk: Math.round(1 * factor) },
        { month: 'Feb', confirmed: Math.round((isGroup ? 12 : 3) * factor), extended: Math.round((isGroup ? 1 : 0) * factor), risk: 0 },
        { month: 'Mar', confirmed: Math.round((isGroup ? 15 : 4) * factor), extended: Math.round((isGroup ? 3 : 1) * factor), risk: Math.round(2 * factor) },
        { month: 'Apr', confirmed: Math.round((isGroup ? 10 : 2) * factor), extended: 0, risk: 0 },
    ]
});

export const getTalentStats = async (viewMode: string, startDate?: string, endDate?: string, deptFilter?: string) => {
    const isGroup = viewMode === 'Group';

    // Simulate filtering by adjusting stats based on dates or dept (mock logic)
    let factor = 1;
    if (startDate && endDate) {
        factor = 0.6; // If date filtered, reduce numbers roughly
    }
    if (deptFilter && deptFilter.trim() !== '') {
        factor = factor * 0.4;
    }

    // Ensure factor is at least 0.1 so we don't get all zeros unless severe
    factor = Math.max(factor, 0.1);

    // 1. Fetch Real Exit Data (if available) or Mock
    // In a real scenario, we'd filter calls to getAllExits based on viewMode permissions
    // For now, we mock the aggregation of exit data
    const exitStats = {
        attritionRate: isGroup ? 14 : 8, // Mocked for now for better dashboard viz
        resignations: Math.round((isGroup ? 25 : 4) * factor),
        avgTenure: 180, // days
        reasons: [
            { name: 'Better Opportunity', value: Math.round(45 * factor) },
            { name: 'Relocation', value: Math.round(20 * factor) },
            { name: 'Higher Studies', value: Math.round(15 * factor) },
            { name: 'Personal', value: Math.round(20 * factor) }
        ]
    };

    return {
        recruitment: generateRecruitmentData(isGroup, factor),
        onboarding: generateOnboardingData(isGroup, factor),
        lnd: generateLnDData(isGroup, factor),
        performance: generatePerformanceData(isGroup, factor),
        engagement: generateEngagementData(isGroup, factor),
        probation: generateProbationData(isGroup, factor),
        exit: exitStats,
        overview: {
            // High level KPIs
            totalEmployees: Math.round((isGroup ? 1250 : 250) * factor),
            genderRatio: isGroup ? '60:40' : '55:45',
            avgAge: 32,
            hiringVsAttrition: [
                { month: 'Jan', hiring: Math.round(10 * factor), attrition: Math.round(2 * factor) },
                { month: 'Feb', hiring: Math.round(15 * factor), attrition: Math.round(3 * factor) },
                { month: 'Mar', hiring: Math.round(12 * factor), attrition: Math.round(1 * factor) },
                { month: 'Apr', hiring: Math.round(20 * factor), attrition: Math.round(4 * factor) }
            ]
        }
    };
};
