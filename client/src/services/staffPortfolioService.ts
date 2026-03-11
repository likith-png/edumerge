// Staff Portfolio Service
// Aggregates data from all modules to create a comprehensive staff profile

export interface StaffMember {
    id: string;
    name: string;
    photo?: string;
    designation: string;
    department: string;
    joiningDate: string;
    email: string;
    phone: string;
    qualification: string;
    reportingManager: string;
    status: 'Active' | 'Probation' | 'Notice Period' | 'Resigned';
}

export interface PerformanceRecord {
    year: string;
    rating: number;
    performanceBand: string;
    increment: number;
    remarks: string;
}

export interface CareerMilestone {
    date: string;
    type: 'Joining' | 'Promotion' | 'Increment' | 'Award' | 'Training' | 'Publication' | 'Resignation';
    title: string;
    description: string;
    beforeIncrementSalary?: string;
    afterIncrementSalary?: string;
}

export interface StaffPortfolioData {
    member: StaffMember;
    performanceHistory: PerformanceRecord[];
    performanceTrend: { year: string; rating: number }[];
    trainingJourney: {
        totalHours: number;
        coursesCompleted: number;
        certifications: Array<{
            name: string;
            issuer: string;
            date: string;
            validity?: string;
        }>;
        recentTrainings: Array<{
            title: string;
            date: string;
            duration: string;
        }>;
    };
    academicContributions: {
        subjectsTaught: string[];
        studentsImpacted: number;
        averagePassPercentage: number;
        averageFeedbackRating: number;
    };
    researchOutput: {
        publications: number;
        conferences: number;
        patents: number;
        citations: number;
    };
    complianceRecords: {
        currentAttendance: number;
        leaveBalance: number;
        probationStatus?: string;
        disciplinaryRecords: number;
    };
    careerTimeline: CareerMilestone[];
    badges: Array<{ id: string; name: string; icon: string; date: string; level: string }>;
    kudos: Array<{ id: string; from: string; message: string; date: string; type: string }>;
    highlights: Array<{
        id: string;
        title: string;
        category: string;
        date: string;
        description: string;
        impact?: string;
        tags?: string[];
    }>;
    probationData?: {
        status: string;
        completionRate: number;
        onTimeTasks: number;
        delayedTasks: number;
        kpis: Array<{ title: string; status: string }>;
        history: Array<{ date: string; event: string; status: string }>;
    };
    exitInfo?: {
        resignationDate: string;
        reason: string;
        noticePeriod: string;
        nocStatus: string;
        exitInterviewCompleted: boolean;
    };
}

// Mock staff data
const mockStaffMembers: StaffMember[] = [
    {
        id: 'FAC001',
        name: 'Ms. Reshma Binu Prasad',
        photo: '/api/placeholder/100/100',
        designation: 'Assistant Professor',
        department: 'Computer Science',
        joiningDate: '2020-07-01',
        email: 'reshma.p@college.edu',
        phone: '+91 98765 43210',
        qualification: 'Ph.D. in Computer Science',
        reportingManager: 'Dr. Rajesh Kumar (HOD)',
        status: 'Active'
    },
    {
        id: 'FAC002',
        name: 'Ms. Sanchaiyata Majumdar',
        designation: 'Professor & HOD',
        department: 'Computer Science',
        joiningDate: '2015-08-15',
        email: 'sanchaiyata.m@college.edu',
        phone: '+91 98765 43211',
        qualification: 'Ph.D. in Computer Science, M.Tech',
        reportingManager: 'Principal',
        status: 'Active'
    },
    {
        id: 'FAC003',
        name: 'Dr. R Sedhunivas',
        designation: 'Associate Professor',
        department: 'Mechanical Engineering',
        joiningDate: '2018-06-01',
        email: 'sedhunivas.r@college.edu',
        phone: '+91 98765 43212',
        qualification: 'Ph.D. in Mechanical Engineering',
        reportingManager: 'Dr. Sunita Mehta (HOD)',
        status: 'Active'
    },
    {
        id: 'EMP101',
        name: 'Dr. Ranjita Saikia',
        designation: 'Senior Lecturer',
        department: 'Computer Science',
        joiningDate: '2021-01-10',
        email: 'ranjita.s@college.edu',
        phone: '+91 98844 22110',
        qualification: 'M.Tech in CS',
        reportingManager: 'Dr. Ada Lovelace',
        status: 'Active'
    },
    {
        id: 'EMP102',
        name: 'Mr. Manjit Singh',
        designation: 'Assistant Professor',
        department: 'Academic Affairs',
        joiningDate: '2022-03-15',
        email: 'manjit.s@college.edu',
        phone: '+91 98844 22111',
        qualification: 'Ph.D. Academic Affairs',
        reportingManager: 'Sarah Jenkins',
        status: 'Active'
    },
    {
        id: 'EMP103',
        name: 'Mr. Edwin Vimal A',
        designation: 'Assistant Professor',
        department: 'Computer Science',
        joiningDate: '2023-01-20',
        email: 'edwin.v@college.edu',
        phone: '+91 98844 22112',
        qualification: 'M.Tech in CS',
        reportingManager: 'Dr. Rajesh Kumar (HOD)',
        status: 'Probation'
    }
];

/**
 * Get all staff members
 */
export function getAllStaff(): StaffMember[] {
    return mockStaffMembers;
}

/**
 * Get staff member by ID
 */
export function getStaffMember(id: string): StaffMember | null {
    return mockStaffMembers.find(member => member.id === id) || null;
}

/**
 * Get staff by department
 */
export function getStaffByDepartment(department: string): StaffMember[] {
    return mockStaffMembers.filter(member => member.department === department);
}

/**
 * Get complete portfolio data for a staff member
 */
export function getStaffPortfolio(staffId: string): StaffPortfolioData | null {
    const member = getStaffMember(staffId);
    if (!member) return null;

    // Aggregate performance history
    const performanceHistory: PerformanceRecord[] = [
        {
            year: '2023-24',
            rating: 4.7,
            performanceBand: 'Outstanding',
            increment: 15,
            remarks: 'Exceptional performance across all parameters'
        },
        {
            year: '2022-23',
            rating: 4.3,
            performanceBand: 'Excellent',
            increment: 10,
            remarks: 'Strong academic results and research contribution'
        },
        {
            year: '2021-22',
            rating: 4.0,
            performanceBand: 'Good',
            increment: 7,
            remarks: 'Consistent performance with room for improvement in research'
        }
    ];

    // Performance trend for chart
    const performanceTrend = performanceHistory.map(p => ({
        year: p.year,
        rating: p.rating
    })).reverse();

    // Training journey - mock data for now
    const trainingJourney = {
        totalHours: 160,
        coursesCompleted: 8,
        certifications: [
            {
                name: 'Advanced Python Programming',
                issuer: 'Coursera',
                date: '2024-01-15',
                validity: '2027-01-15'
            },
            {
                name: 'Machine Learning Specialization',
                issuer: 'Stanford Online',
                date: '2023-06-20'
            }
        ],
        recentTrainings: [
            { title: 'Advanced Python Programming', date: '2024-01-15', duration: '40 hours' },
            { title: 'Machine Learning Fundamentals', date: '2023-09-10', duration: '30 hours' },
            { title: 'Teaching Excellence Program', date: '2023-06-05', duration: '20 hours' }
        ]
    };

    // Academic contributions
    const academicContributions = {
        subjectsTaught: ['Data Structures', 'Algorithms', 'Database Management'],
        studentsImpacted: 450,
        averagePassPercentage: 87,
        averageFeedbackRating: 4.3
    };

    // Research output
    const researchOutput = {
        publications: 5,
        conferences: 3,
        patents: 1,
        citations: 42
    };

    // Compliance records
    const complianceRecords = {
        currentAttendance: 92,
        leaveBalance: 18,
        disciplinaryRecords: 0
    };

    // Career timeline
    const careerTimeline: CareerMilestone[] = [
        {
            date: '2020-07-01',
            type: 'Joining',
            title: 'Joined as Assistant Professor',
            description: 'Started career in Computer Science department'
        },
        {
            date: '2021-03-15',
            type: 'Training',
            title: 'Completed Teaching Excellence Program',
            description: '40-hour faculty development program'
        },
        {
            date: '2022-04-01',
            type: 'Increment',
            title: 'Annual Increment - 7%',
            description: 'Performance rating: Good (4.0/5)',
            beforeIncrementSalary: '₹8,50,000',
            afterIncrementSalary: '₹9,09,500'
        },
        {
            date: '2022-09-10',
            type: 'Publication',
            title: 'Published Research Paper',
            description: 'Deep Learning Applications in Medical Imaging - SCOPUS Journal'
        },
        {
            date: '2023-04-01',
            type: 'Increment',
            title: 'Annual Increment - 10%',
            description: 'Performance rating: Excellent (4.3/5)',
            beforeIncrementSalary: '₹9,09,500',
            afterIncrementSalary: '₹10,00,450'
        },
        {
            date: '2023-11-20',
            type: 'Award',
            title: 'Best Faculty Award',
            description: 'Recognized for outstanding teaching and research'
        },
        {
            date: '2024-04-01',
            type: 'Increment',
            title: 'Annual Increment - 15%',
            description: 'Performance rating: Outstanding (4.7/5)',
            beforeIncrementSalary: '₹10,00,450',
            afterIncrementSalary: '₹11,50,517'
        }
    ];

    return {
        member,
        performanceHistory,
        performanceTrend,
        trainingJourney,
        academicContributions,
        researchOutput,
        complianceRecords,
        careerTimeline,
        badges: [
            { id: 'b1', name: 'Innovation catalyst', icon: 'Lightbulb', date: '2023-11-15', level: 'Gold' },
            { id: 'b2', name: 'Mentor', icon: 'Users', date: '2023-06-20', level: 'Silver' },
            { id: 'b3', name: 'Community Champion', icon: 'Heart', date: '2024-01-10', level: 'Bronze' }
        ],
        kudos: [
            { id: 'k1', from: 'Dr. Alan Grant', message: 'Exceptional support during the accreditation visit. Your data organization was perfect!', date: '2h ago', type: 'Excellence' },
            { id: 'k2', from: 'Prof. Sarah Jenkins', message: 'Great job mentoring the freshers on the research project. They are learning so fast.', date: '1d ago', type: 'Mentorship' }
        ],
        highlights: [
            {
                id: 'h1',
                title: 'Best Faculty Award 2023',
                category: 'Award',
                date: '2023-11-20',
                description: 'Recognized for excellence in pedagogical methods and student engagement across the Engineering department.',
                impact: 'Top 1% faculty rating',
                tags: ['Teaching', 'Innovation', 'Excellence']
            },
            {
                id: 'h2',
                title: 'Patent Filed: AI in Medical Imaging',
                category: 'Research',
                date: '2023-09-15',
                description: 'Developed a novel deep learning architecture for early detection of pulmonary nodules in CT scans.',
                impact: 'Non-provisional filing complete',
                tags: ['AI', 'Healthcare', 'Research']
            },
            {
                id: 'h3',
                title: 'Published in SCOPUS Q1 Journal',
                category: 'Publication',
                date: '2022-12-10',
                description: 'Full research paper on "Quantum-inspired Genetic Algorithms for Cloud Resource Scheduling".',
                impact: '45+ Citations in 1st year',
                tags: ['Cloud Computing', 'Algorithms', 'Publication']
            }
        ],
        probationData: member.id === 'FAC001' ? {
            status: 'Completed',
            completionRate: 94,
            onTimeTasks: 17,
            delayedTasks: 1,
            kpis: [
                { title: 'Syllabus Completion', status: 'Met' },
                { title: 'Research Proposal Submission', status: 'Met' },
                { title: 'Peer Review Training', status: 'Met' }
            ],
            history: [
                { date: '2020-08-01', event: '30-Day Check-in', status: 'On-time' },
                { date: '2020-09-01', event: '60-Day Review', status: 'On-time' },
                { date: '2020-10-01', event: 'Final 90-Day Evaluation', status: 'Delayed (1 day)' }
            ]
        } : undefined,
        exitInfo: member.status === 'Resigned' ? {
            resignationDate: '2024-12-15',
            reason: 'Higher Education',
            noticePeriod: '2 months',
            nocStatus: 'Pending',
            exitInterviewCompleted: false
        } : undefined
    };
}

/**
 * Get performance summary for dashboard widget
 */
export function getPerformanceSummary(staffId: string): {
    currentRating: number;
    currentBand: string;
    trend: 'up' | 'down' | 'stable';
    totalTrainings: number;
    yearsOfService: number;
} {
    const portfolio = getStaffPortfolio(staffId);
    if (!portfolio) {
        return {
            currentRating: 0,
            currentBand: 'N/A',
            trend: 'stable',
            totalTrainings: 0,
            yearsOfService: 0
        };
    }

    const currentPerf = portfolio.performanceHistory[0];
    const previousPerf = portfolio.performanceHistory[1];

    const trend: 'up' | 'down' | 'stable' =
        currentPerf.rating > previousPerf.rating ? 'up' :
            currentPerf.rating < previousPerf.rating ? 'down' : 'stable';

    const yearsOfService = new Date().getFullYear() - new Date(portfolio.member.joiningDate).getFullYear();

    return {
        currentRating: currentPerf.rating,
        currentBand: currentPerf.performanceBand,
        trend,
        totalTrainings: portfolio.trainingJourney.coursesCompleted,
        yearsOfService
    };
}

/**
 * Search staff by name or ID
 */
export function searchStaff(query: string): StaffMember[] {
    const lowerQuery = query.toLowerCase();
    return mockStaffMembers.filter(member =>
        member.name.toLowerCase().includes(lowerQuery) ||
        member.id.toLowerCase().includes(lowerQuery) ||
        member.department.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get departments list
 */
export function getDepartments(): string[] {
    return Array.from(new Set(mockStaffMembers.map(m => m.department)));
}
