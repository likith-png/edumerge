


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
    isOnboardingComplete?: boolean;
    [key: string]: any; // Allow for flexible mock data assignment

    reportDetails?: {
        dob: string;
        education: { others: string; ug: string; pg: string; doct: string; spec: string; };
        experience: { teach: string; ind: string; res: string; expOthers: string; nhce: string; tot: string; };
        salary: { basic: number; da: number; hra: number; cca: number; others: number; convAll: number; agp: number; pfAmnt: number; variablePay: number; gross: number; };
    };
}

export interface PersonalDetails {
    dob: string;
    gender: string;
    bloodGroup: string;
    nationality: string;
    religion: string;
    maritalStatus: string;
    aadharNumber: string;
    panNumber: string;
    pfNumber?: string;
    esiNumber?: string;
    fatherName: string;
    motherName: string;
    bankDetails: {
        accountNumber: string;
        ifscCode: string;
        bankName: string;
        branchName: string;
    };
    passportDetails?: {
        number: string;
        expiryDate: string;
    };
    permanentAddress: string;

    currentAddress: string;
    emergencyContact: {
        name: string;
        relation: string;
        phone: string;
    };
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

export interface EducationalQualification {
    level: string; // e.g., 10th / SSLC, UG, PG, Ph. D
    course: string;
    specialization: string;
    institute: string;
    board: string;
    courseType: string; // e.g., Regular, Part-time, Correspondence
    class: string;
    percentage: string;
    passingYear: string;
    fileUrl?: string;
}

export interface ExperienceDetail {
    orgName: string;
    designation: string;
    natureOfJob: string;
    jobType: string;
    fromDate: string;
    toDate: string;
    totalExp: string;
    lastDrawn: string;
    fileUrl?: string;
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
        exitInterviewFeedback?: string;
    };
    educationDetails: EducationalQualification[];
    experienceDetails: ExperienceDetail[];
    personalDetails: PersonalDetails;
    salaryDetails?: {
        basic: number; da: number; hra: number; cca: number; others: number; convAll: number; agp: number; pfAmnt: number; variablePay: number; gross: number;
    } | null;
    biometricData?: any;
    monthlyLeave?: any;
    yearlyLeave?: any;
}


// Mock staff data
const mockStaffMembers: StaffMember[] = [
    // Administration Department
    {
        id: '101',
        name: 'Ms. Reshma Binu Prasad',
        photo: '/api/placeholder/100/100',
        designation: 'Asst. Professor',
        department: 'Computer Science',
        joiningDate: '2024-01-10',
        email: 'reshma.binu@college.edu',
        phone: '+91 90000 00101',
        qualification: 'M.Tech, PhD',
        reportingManager: 'HOD CSE',
        status: 'Probation',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '23-Nov-1975',
            education: { others: 'SSLC, PUC', ug: 'B. Com', pg: 'MBA', doct: '-', spec: '-' },
            experience: { teach: '-', ind: '18.09', res: '-', expOthers: '-', nhce: '18.08', tot: '37.05' },
            salary: { basic: 64900, da: 7301, hra: 25960, cca: 600, others: 60111, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 15000, gross: 175122 }
        }
    },
    {
        id: 'NH-0011',
        name: 'DEF',
        designation: 'Asst. Registrar',
        department: 'Administration',
        joiningDate: '2007-08-02',
        email: 'def.nh0011@college.edu',
        phone: '+91 90000 00011',
        qualification: 'SSLC, PUC, B.COM',
        reportingManager: 'ABC',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '07-Dec-1971',
            education: { others: 'SSLC, PUC', ug: 'B.COM', pg: '-', doct: '-', spec: 'COMMERCE' },
            experience: { teach: '-', ind: '-', res: '-', expOthers: '5.07', nhce: '17.03', tot: '22.1' },
            salary: { basic: 20300, da: 2284, hra: 8120, cca: 600, others: 32772, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 0, gross: 65326 }
        }
    },
    {
        id: 'NH-0012',
        name: 'XYZ',
        designation: 'Sr. Office Executive',
        department: 'Administration',
        joiningDate: '2014-01-29',
        email: 'xyz.nh0012@college.edu',
        phone: '+91 90000 00012',
        qualification: 'SSLC, DIP, B.COM',
        reportingManager: 'DEF',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '20-Jun-1989',
            education: { others: 'SSLC, DIP', ug: 'B.COM', pg: '-', doct: '-', spec: 'ACCOUNTANCY' },
            experience: { teach: '-', ind: '2.05', res: '-', expOthers: '-', nhce: '10.1', tot: '13.03' },
            salary: { basic: 15300, da: 1721, hra: 6120, cca: 600, others: 22089, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 0, gross: 47080 }
        }
    },
    {
        id: 'NH-0013',
        name: 'ahdhjka',
        designation: 'jr. Divisional Asst.',
        department: 'Administration',
        joiningDate: '2009-06-27',
        email: 'ahdhjka.nh0013@college.edu',
        phone: '+91 90000 00013',
        qualification: 'SSLC, BA',
        reportingManager: 'DEF',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '21-Jun-1976',
            education: { others: 'SSLC', ug: 'BA', pg: '-', doct: '-', spec: 'ARTS' },
            experience: { teach: '-', ind: '-', res: '-', expOthers: '-', nhce: '15.05', tot: '15.05' },
            salary: { basic: 13500, da: 1519, hra: 5400, cca: 600, others: 16746, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 0, gross: 39015 }
        }
    },
    {
        id: 'NH-0014',
        name: 'Principal',
        photo: '/api/placeholder/100/100',
        designation: 'Principal',
        department: 'Administration',
        joiningDate: '2003-08-25',
        email: 'principal.nh0014@college.edu',
        phone: '+91 90000 00014',
        qualification: 'SSLC, PUC, BE, M. Tech, Ph. D',
        reportingManager: 'Board of Directors',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '01-May-1977',
            education: { others: 'SSLC, PUC', ug: 'BE', pg: 'M. Tech', doct: 'Ph. D', spec: 'Manufacturing Engineering' },
            experience: { teach: '-', ind: '10.02', res: '-', expOthers: '-', nhce: '21.03', tot: '31.05' },
            salary: { basic: 95724, da: 17230, hra: 28717, cca: 600, others: 163928, convAll: 0, agp: 10000, pfAmnt: 1800, variablePay: 0, gross: 318000 }
        }
    },
    // ISE Department
    {
        id: 'NH-0015',
        name: 'jlksdlj',
        photo: '/api/placeholder/100/100',
        designation: 'Professor & HOD',
        department: 'ISE',
        joiningDate: '2018-02-05',
        email: 'jlksdlj.nh0015@college.edu',
        phone: '+91 90000 00015',
        qualification: '10th, puc, B.E, ME, Ph. D',
        reportingManager: 'Principal',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '13-Dec-1965',
            education: { others: '10th, puc', ug: 'B.E', pg: 'ME', doct: 'Ph. D', spec: 'Computer Science' },
            experience: { teach: '22.03', ind: '4', res: '-', expOthers: '-', nhce: '6.09', tot: '33' },
            salary: { basic: 69153, da: 12448, hra: 20746, cca: 600, others: 99454, convAll: 0, agp: 10000, pfAmnt: 1800, variablePay: 0, gross: 214200 }
        }
    },
    {
        id: 'NH-0016',
        name: 'HLJHFJKH',
        designation: 'Sr. Assistant Professor',
        department: 'ISE',
        joiningDate: '2011-07-25',
        email: 'hljhfjkh.nh0016@college.edu',
        phone: '+91 90000 00016',
        qualification: '10th, 12th, B E, M Tech',
        reportingManager: 'jlksdlj',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '15-Apr-1980',
            education: { others: '10th, 12th', ug: 'B E', pg: 'M Tech', doct: '-', spec: 'CSE' },
            experience: { teach: '4.09', ind: '1.07', res: '-', expOthers: '-', nhce: '13.04', tot: '19.08' },
            salary: { basic: 34660, da: 6239, hra: 10398, cca: 600, others: 38307, convAll: 0, agp: 7000, pfAmnt: 1800, variablePay: 0, gross: 99004 }
        }
    },
    {
        id: 'NH-0017',
        name: 'JLKFDJLJ',
        designation: 'Associate Professor',
        department: 'ISE',
        joiningDate: '2014-07-21',
        email: 'jlkfdjlj.nh0017@college.edu',
        phone: '+91 90000 00017',
        qualification: 'SSLC, HSC, B.E, M Tech, Ph.D',
        reportingManager: 'jlksdlj',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '30-Jul-1976',
            education: { others: 'SSLC, HSC', ug: 'B.E', pg: 'M Tech', doct: 'Ph.D', spec: 'CSE' },
            experience: { teach: '10.04', ind: '-', res: '-', expOthers: '-', nhce: '10.04', tot: '20.08' },
            salary: { basic: 35669, da: 6420, hra: 10701, cca: 600, others: 32615, convAll: 0, agp: 9000, pfAmnt: 1800, variablePay: 0, gross: 96805 }
        }
    },
    {
        id: 'NH-0018',
        name: 'JLFJLJ',
        designation: 'Sr. Assistant Professor',
        department: 'ISE',
        joiningDate: '2013-07-24',
        email: 'jlfjlj.nh0018@college.edu',
        phone: '+91 90000 00018',
        qualification: 'SSLC, Pre Degree, BTech, M TECH, (PhD)',
        reportingManager: 'jlksdlj',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '01-Jun-1979',
            education: { others: 'SSLC, Pre Degree', ug: 'BTech', pg: 'M TECH', doct: '(PhD)', spec: 'CSE' },
            experience: { teach: '2.09', ind: '-', res: '-', expOthers: '-', nhce: '11.04', tot: '14.01' },
            salary: { basic: 29898, da: 5382, hra: 8969, cca: 600, others: 30321, convAll: 0, agp: 7000, pfAmnt: 1800, variablePay: 0, gross: 83970 }
        }
    },
    {
        id: 'NH-0019',
        name: 'JLKJLDFJ',
        designation: 'Lab Instructor',
        department: 'ISE',
        joiningDate: '2021-03-08',
        email: 'jlkjldfj.nh0019@college.edu',
        phone: '+91 90000 00019',
        qualification: 'SSLC, Diploma',
        reportingManager: 'HLJHFJKH',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '30-Jul-1980',
            education: { others: 'SSLC, Diploma', ug: '-', pg: '-', doct: '-', spec: '-' },
            experience: { teach: '-', ind: '-', res: '-', expOthers: '11.1', nhce: '3.08', tot: '15.06' },
            salary: { basic: 13500, da: 1519, hra: 5400, cca: 600, others: 8631, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 0, gross: 30900 }
        }
    },
    // MBA Department
    {
        id: 'NH-0381',
        name: 'JLSDJLJ',
        designation: 'Office Executive',
        department: 'MBA',
        joiningDate: '2014-01-01',
        email: 'jlsdjlj.nh0381@college.edu',
        phone: '+91 90000 00381',
        qualification: 'SSLC',
        reportingManager: 'UOUEOOI',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '22-Nov-1968',
            education: { others: 'SSLC', ug: '-', pg: '-', doct: '-', spec: '-' },
            experience: { teach: '-', ind: '-', res: '-', expOthers: '8.04', nhce: '10.1', tot: '19.02' },
            salary: { basic: 13500, da: 1519, hra: 5400, cca: 600, others: 16674, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 0, gross: 38943 }
        } 
    },
    {
        id: 'NH-0382',
        name: 'UOUEOOI',
        photo: '/api/placeholder/100/100',
        designation: 'Sr. Asst. Prof. & HOD',
        department: 'MBA',
        joiningDate: '2013-06-10',
        email: 'uoueooi.nh0382@college.edu',
        phone: '+91 90000 00382',
        qualification: 'SSLC, PUC, BBM, MBA, MPhil',
        reportingManager: 'Principal',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '10-Mar-1983',
            education: { others: 'SSLC, PUC', ug: 'BBM', pg: 'MBA, MPhil', doct: '-', spec: 'Marketing, Management' },
            experience: { teach: '-', ind: '1.1', res: '-', expOthers: '-', nhce: '11.05', tot: '13.03' },
            salary: { basic: 20688, da: 16550, hra: 6206, cca: 600, others: 20651, convAll: 0, agp: 0, pfAmnt: 1800, variablePay: 0, gross: 66496 }
        }
    },
    {
        id: 'NH-0384',
        name: 'EEOIUOIEU',
        designation: 'Librarian',
        department: 'MBA',
        joiningDate: '2013-08-08',
        email: 'eeoiuoieu.nh0384@college.edu',
        phone: '+91 90000 00384',
        qualification: 'SSLC, PUC, BA, MLISc, KSET',
        reportingManager: 'UOUEOOI',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '28-May-1986',
            education: { others: 'SSLC, PUC', ug: 'BA', pg: 'MLISc, KSET', doct: '-', spec: 'Web Designing' },
            experience: { teach: '-', ind: '-', res: '-', expOthers: '4.02', nhce: '11.03', tot: '15.05' },
            salary: { basic: 16200, da: 1823, hra: 6480, cca: 600, others: 17328, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 0, gross: 43681 }
        }
    },
    {
        id: 'NH-0385',
        name: 'IEUOUOE',
        designation: 'Physical Education Inst.',
        department: 'MBA',
        joiningDate: '2019-07-08',
        email: 'ieuouoe.nh0385@college.edu',
        phone: '+91 90000 00385',
        qualification: 'SSLC, PUC, BA, B.PEd, M P Ed, KSET, (Ph.D)',
        reportingManager: 'UOUEOOI',
        status: 'Active',
        isOnboardingComplete: true,

        reportDetails: {
            dob: '12-Apr-1983',
            education: { others: 'SSLC, PUC', ug: 'BA, B.PEd', pg: 'M P Ed, KSET', doct: '(Ph.D)', spec: 'Physical Education' },
            experience: { teach: '11', ind: '-', res: '-', expOthers: '-', nhce: '5.04', tot: '16.04' },
            salary: { basic: 15600, da: 1755, hra: 6240, cca: 600, others: 16666, convAll: 1250, agp: 0, pfAmnt: 0, variablePay: 0, gross: 42111 }
        }
    }
];

/**
 * Get all staff members
 */
export function getAllStaff(): StaffMember[] {
    const saved = localStorage.getItem('onboarded_staff_ids');
    const onboardedIds = saved ? JSON.parse(saved) : [];
    
    return mockStaffMembers.map(member => ({
        ...member,
        isOnboardingComplete: onboardedIds.includes(member.id) || member.isOnboardingComplete
    }));
}

/**
 * Get staff member by ID
 */
export function getStaffMember(id: string): StaffMember | null {
    const staff = getAllStaff();
    return staff.find(member => member.id === id) || null;
}

/**
 * Update staff onboarding complete
 */
export function completeStaffOnboarding(id: string): void {
    const saved = localStorage.getItem('onboarded_staff_ids');
    const onboardedIds = saved ? JSON.parse(saved) : [];
    if (!onboardedIds.includes(id)) {
        onboardedIds.push(id);
        localStorage.setItem('onboarded_staff_ids', JSON.stringify(onboardedIds));
    }
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

    const eduInput = member.reportDetails?.education || {} as any;
    const mappedEducation: EducationalQualification[] = [];
    if (eduInput.others && eduInput.others !== '-') {
        eduInput.others.split(',').forEach((c: string) => {
            mappedEducation.push({ level: c.trim(), course: c.trim(), specialization: '-', institute: 'Board', board: '-', courseType: 'Regular', class: '-', percentage: '-', passingYear: '-' });
        });
    }
    if (eduInput.ug && eduInput.ug !== '-') {
        mappedEducation.push({ level: 'UG', course: eduInput.ug, specialization: eduInput.spec && eduInput.spec !== '-' ? eduInput.spec : '-', institute: 'University', board: '-', courseType: 'Regular', class: '-', percentage: '-', passingYear: '-' });
    }
    if (eduInput.pg && eduInput.pg !== '-') {
        mappedEducation.push({ level: 'PG', course: eduInput.pg, specialization: eduInput.spec && eduInput.spec !== '-' ? eduInput.spec : '-', institute: 'University', board: '-', courseType: 'Regular', class: '-', percentage: '-', passingYear: '-' });
    }
    if (eduInput.doct && eduInput.doct !== '-') {
        mappedEducation.push({ level: 'Ph.D', course: eduInput.doct, specialization: eduInput.spec && eduInput.spec !== '-' ? eduInput.spec : '-', institute: 'University', board: '-', courseType: 'Regular', class: '-', percentage: '-', passingYear: '-' });
    }

    const expInput = member.reportDetails?.experience || {} as any;
    const mappedExperience: ExperienceDetail[] = [];
    if (expInput.teach && expInput.teach !== '-') {
        mappedExperience.push({ orgName: 'Various Institutes', designation: 'Teaching Staff', natureOfJob: 'Teaching', jobType: 'Full Time', fromDate: '-', toDate: '-', totalExp: expInput.teach, lastDrawn: '-' });
    }
    if (expInput.ind && expInput.ind !== '-') {
        mappedExperience.push({ orgName: 'Various Industries', designation: 'Industry Professional', natureOfJob: 'Industry', jobType: 'Full Time', fromDate: '-', toDate: '-', totalExp: expInput.ind, lastDrawn: '-' });
    }
    if (expInput.expOthers && expInput.expOthers !== '-') {
        mappedExperience.push({ orgName: 'Other Organizations', designation: 'Staff', natureOfJob: 'Other', jobType: 'Full Time', fromDate: '-', toDate: '-', totalExp: expInput.expOthers, lastDrawn: '-' });
    }
    if (expInput.nhce && expInput.nhce !== '-') {
        mappedExperience.push({ orgName: 'NHCE', designation: member.designation, natureOfJob: 'Current', jobType: 'Full Time', fromDate: member.joiningDate, toDate: 'Present', totalExp: expInput.nhce, lastDrawn: '-' });
    }

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
        probationData: member.id === 'NH-0010' ? {
            status: 'Completed',
            completionRate: 94,
            onTimeTasks: 17,
            delayedTasks: 1,
            kpis: [
                { title: 'Classroom Engagement', status: 'Met' },
                { title: 'Curriculum Delivery', status: 'Exceeded' },
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
        } : undefined,
        educationDetails: mappedEducation.length > 0 ? mappedEducation : [
            { level: '10th / SSLC', course: 'SSC', specialization: '-', institute: 'ZP Urdu High School', board: 'Board of Secondary E', courseType: 'Regular', class: 'First class', percentage: '63.8', passingYear: '1996' }
        ],
        experienceDetails: mappedExperience.length > 0 ? mappedExperience : [
            { orgName: 'NHCE', designation: member.designation, natureOfJob: 'Current', jobType: 'Full Time', fromDate: member.joiningDate, toDate: 'Present', totalExp: '-', lastDrawn: '-' }
        ],
        salaryDetails: member.reportDetails?.salary,
        personalDetails: personalDetailsStorage[staffId] || {
            dob: '1980-05-15',
            gender: 'Female',
            bloodGroup: 'B+',
            nationality: 'Indian',
            religion: 'Islam',
            maritalStatus: 'Married',
            aadharNumber: 'XXXX-XXXX-1234',
            panNumber: 'ABCDE1234F',
            pfNumber: 'KN/BAN/1234567/000/1234567',
            esiNumber: '31-00-123456-000-1234',
            fatherName: 'Binu Prasad Sr.',
            motherName: 'Laxmi Prasad',
            bankDetails: {
                accountNumber: '123456789012',
                ifscCode: 'ICIC0001234',
                bankName: 'ICICI Bank',
                branchName: 'Whitefield Branch'
            },
            passportDetails: {
                number: 'Z1234567',
                expiryDate: '2030-12-31'
            },
            permanentAddress: '123, Rose Gardens, Jayanagar, Bangalore, Karnataka - 560041',

            currentAddress: '456, Lake View Apartments, Whitefield, Bangalore, Karnataka - 560066',
            emergencyContact: {
                name: 'Ahmed',
                relation: 'Spouse',
                phone: '+91 91111 00010'
            }
        },
        biometricData: getStaffBiometrics(staffId),
        monthlyLeave: getStaffMonthlyLeave(staffId),
        yearlyLeave: getStaffYearlyLeave(staffId)
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

/**
 * Update general staff member details
 */
export function updateStaffMember(staffId: string, updates: Partial<StaffMember>): boolean {
    const idx = mockStaffMembers.findIndex(m => m.id === staffId);
    if (idx === -1) return false;
    mockStaffMembers[idx] = { ...mockStaffMembers[idx], ...updates };
    return true;
}

/**
 * Update staff member education mapping for report format
 */
export function updateStaffPersonalDetails(staffId: string, details: PersonalDetails): boolean {
    const idx = mockStaffMembers.findIndex(m => m.id === staffId);
    if (idx === -1) return false;
    
    // In our simplified mock, we might need to update other fields if they overlap
    // For now, we'll store it as part of a hidden state or just mock the success
    // In getStaffPortfolio, we return personalDetails which is currently hardcoded
    // Let's add a storage for it
    if (!personalDetailsStorage[staffId]) {
        personalDetailsStorage[staffId] = details;
    } else {
        personalDetailsStorage[staffId] = { ...personalDetailsStorage[staffId], ...details };
    }
    return true;
}

// Storage for updated personal details (since they are currently hardcoded in getStaffPortfolio)
const personalDetailsStorage: Record<string, PersonalDetails> = {};

export function updateStaffEducation(staffId: string, educations: EducationalQualification[]): boolean {
    const idx = mockStaffMembers.findIndex(m => m.id === staffId);
    if (idx === -1) return false;
    
    const reportEdu = { others: '-', ug: '-', pg: '-', doct: '-', spec: '-' };
    const othersArr: string[] = [];
    
    educations.forEach(edu => {
        const lvl = edu.level.toUpperCase();
        if (lvl === 'UG') reportEdu.ug = edu.course;
        else if (lvl === 'PG') reportEdu.pg = edu.course;
        else if (lvl === 'PH.D' || lvl === 'DOCT' || lvl === 'PHD') reportEdu.doct = edu.course;
        else othersArr.push(edu.course);
        
        if (edu.specialization && edu.specialization !== '-') {
            reportEdu.spec = reportEdu.spec === '-' ? edu.specialization : `${reportEdu.spec}, ${edu.specialization}`;
        }
    });
    
    if (othersArr.length > 0) reportEdu.others = othersArr.join(', ');
    
    const member = mockStaffMembers[idx];
    if (!member.reportDetails) {
        member.reportDetails = { dob: '-', education: reportEdu, experience: { teach: '-', ind: '-', res: '-', expOthers: '-', nhce: '-', tot: '-' }, salary: { basic: 0, da: 0, hra: 0, cca: 0, others: 0, convAll: 0, agp: 0, pfAmnt: 0, variablePay: 0, gross: 0 } };
    } else {
        member.reportDetails.education = reportEdu;
    }
    return true;
}

/**
 * Update staff member experience mapping for report format
 */
export function updateStaffExperience(staffId: string, experiences: ExperienceDetail[]): boolean {
    const idx = mockStaffMembers.findIndex(m => m.id === staffId);
    if (idx === -1) return false;
    
    const reportExp = { teach: '-', ind: '-', res: '-', expOthers: '-', nhce: '-', tot: '-' };
    let totalExps = 0;
    
    experiences.forEach(exp => {
        const type = exp.natureOfJob?.toLowerCase() || '';
        const org = exp.orgName?.toLowerCase() || '';
        const expVal = parseFloat(exp.totalExp) || 0;
        
        totalExps += expVal;
        
        if (org.includes('nhce')) {
            reportExp.nhce = exp.totalExp;
        } else if (type.includes('teach')) {
            reportExp.teach = exp.totalExp;
        } else if (type.includes('indus')) {
            reportExp.ind = exp.totalExp;
        } else if (type.includes('res')) {
            reportExp.res = exp.totalExp;
        } else {
            reportExp.expOthers = exp.totalExp;
        }
    });
    reportExp.tot = totalExps.toFixed(2);
    
    const member = mockStaffMembers[idx];
    if (!member.reportDetails) {
        member.reportDetails = { dob: '-', education: { others: '-', ug: '-', pg: '-', doct: '-', spec: '-' }, experience: reportExp, salary: { basic: 0, da: 0, hra: 0, cca: 0, others: 0, convAll: 0, agp: 0, pfAmnt: 0, variablePay: 0, gross: 0 } };
    } else {
        member.reportDetails.experience = reportExp;
    }
    return true;
}

const initialBioData = [
    { EMPCODE:'NH-0001', EMPLOYEENAME:'V Manjula', in_times:['','10:34','','10:14','','','','10:25','','','','','','','10:22','10:18','10:59','','','10:20','10:31','10:13','10:05','','10:19','','09:59','','10:21','10:04','10:30'], out_times:['','18:52','','18:23','','18:47','19:02','','','','','','18:50','19:13','18:41','19:06','','','','','','18:49','18:28','18:19','','','18:55','','18:29','18:55',''], hours:['','8.18','','8.09','','','','','','','','','','','8.19','8.48','','','','','','8.36','8.23','','','','8.56','','8.08','8.51',''], status:['H','P','EL','P','W','A/P','A/P','P/A','EL','H','H','W','A/P','A/P','P','P','P/A','H','W','P/A','P/A','P','P','A/P','P/A','W','P','EL','P','P','P/A'] },
    { EMPCODE:'NH-0212', EMPLOYEENAME:'Bindu Menon', in_times:['','09:13','09:21','09:26','','09:25','09:30','09:23','09:21','','','','09:06','09:22','09:17','09:25','09:19','','','09:35','09:30','09:30','09:29','09:24','09:28','','09:30','09:20','09:28','09:27','09:27'], out_times:['','17:38','17:31','17:37','','17:31','17:37','17:34','17:30','','','','17:32','17:43','17:38','17:32','17:33','','','17:37','17:41','17:32','17:50','17:45','17:30','','17:38','17:30','17:32','17:33','17:29'], hours:['','8.25','8.1','8.11','','8.06','8.07','8.11','8.09','','','','8.26','8.21','8.21','8.07','8.14','','','8.02','8.11','8.02','8.21','8.21','8.02','','8.08','8.1','8.04','8.06','8.02'], status:['H','P','P','P','W','P','P','P','P','H','H','W','P','P','P','P','P','H','W','P','P','P','P','P','P','W','P','P','P','P','P'] },
    { EMPCODE:'NH-0796', EMPLOYEENAME:'Maroju Hima Bindu', in_times:['','09:14','09:13','','','','','','','','','','09:14','09:15','09:23','09:26','09:14','','','09:16','09:09','09:15','09:15','09:14','09:18','','09:15','09:11','09:11','09:16',''], out_times:['','18:54','20:16','','','','','','','','','','17:38','17:08','18:38','18:07','19:05','','','19:14','18:10','17:38','18:00','18:24','17:05','','17:47','18:12','17:13','18:24',''], hours:['','9.4','11.03','','','','','','','','','','8.24','7.53','9.15','8.41','9.51','','','9.58','9.01','8.23','8.45','9.1','7.47','','8.32','9.01','8.02','9.08',''], status:['H','P','P','CO','W','VL','VL','VL','VL','VL','VL','VL','P','P','P','P','P','H','W','P','P','P','P','P','P','W','P','P','P','P','LOPNR'] },
    { EMPCODE:'NH-1080', EMPLOYEENAME:'Ranjana H', in_times:['','08:26','08:32','08:35','','08:34','08:32','08:33','08:31','','','','08:32','08:34','08:36','','08:39','08:31','','08:31','08:33','08:31','08:31','09:13','08:39','','08:31','08:37','08:31','08:36','08:32'], out_times:['','17:04','16:53','17:15','','17:18','17:17','13:17','17:42','','','','','17:17','16:30','','17:13','17:05','','17:03','16:51','16:42','17:06','18:01','','','17:14','17:05','17:32','18:21','16:50'], hours:['','8.38','8.21','8.4','','8.44','8.45','4.44','9.11','','','','','8.43','7.54','','8.34','8.34','','8.32','8.18','8.11','8.35','8.48','','','8.43','8.28','9.01','9.45','8.18'], status:['H','P','P','P','W','P','P','P','P','H','H','W','CL(HF)','P','P','LOPNR','P','H','W','P','P','P','P','P','P/A','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1238', EMPLOYEENAME:'Divya Saarawadha', in_times:['','09:41','09:31','09:37','','09:36','09:26','09:32','09:33','','','','09:22','09:29','09:35','08:27','09:32','','','09:29','09:29','09:33','09:29','09:27','','','','','','',''], out_times:['','17:45','17:30','17:35','','17:35','17:40','17:34','17:30','','','','17:37','17:34','17:37','17:34','17:34','','','17:32','17:40','17:32','17:41','18:00','','','','','','',''], hours:['','8.04','7.59','7.58','','7.59','8.14','8.02','7.57','','','','8.15','8.05','8.02','9.07','8.02','','','8.03','8.11','7.59','8.12','8.33','','','','','','',''], status:['H','P','P','P','W','P','P','P','P','H','H','W','P','P','P','P','P','H','W','P','P','P','P','P','LOPNR','W','LOPNR','LOPNR','LOPNR','LOPNR','LOPNR'] },
    { EMPCODE:'NH-1297', EMPLOYEENAME:'A Manjula Bai', in_times:['09:48','09:49','09:47','09:01','','09:03','09:10','','09:11','','','','08:56','09:08','09:10','','09:09','','','09:04','09:11','09:05','09:11','08:56','09:35','','09:10','09:11','08:59','09:07','09:19'], out_times:['15:00','18:50','18:09','18:36','','17:27','17:13','','17:16','','','','17:21','17:07','13:49','','17:08','','','17:16','17:16','17:13','17:17','17:49','17:04','','17:09','17:06','17:10','17:46','17:19'], hours:['5.12','9.01','8.22','9.35','','8.24','8.03','','8.05','','','','8.25','7.59','4.39','','7.59','','','8.12','8.05','8.08','8.06','8.53','7.29','','7.59','7.55','8.11','8.39','8.0'], status:['H','P','P','P','W','P','P','CL','P','H','H','W','P','P','CL(HF)','CL','P','H','W','P','P','P','P','P','P','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1361', EMPLOYEENAME:'Sulochana Punagin', in_times:['','09:00','09:03','09:03','','09:14','09:10','09:09','09:00','','','','08:40','09:09','09:12','09:13','09:00','','','','08:52','09:01','09:09','09:06','','','09:07','09:04','09:02','09:10','09:02'], out_times:['','18:54','18:31','18:39','','17:52','17:03','17:03','17:57','','','','17:37','13:53','18:38','18:04','19:05','','','','18:09','17:38','18:00','18:24','','','17:47','18:12','17:13','17:54','17:16'], hours:['','9.54','9.28','9.36','','8.38','7.53','7.54','8.57','','','','8.57','4.44','9.26','8.51','10.05','','','','9.17','8.37','8.51','9.18','','','8.4','9.08','8.11','8.44','8.14'], status:['H','P','P','P','W','P','P','P','P','H','H','W','P','CL(HF)','P','P','P','H','W','EL','P','P','P','P','EL','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1477', EMPLOYEENAME:'B Prita Dutta', in_times:['','','','09:34','','09:18','09:30','09:35','09:36','','','','09:28','09:35','09:33','09:35','09:40','','','09:41','','','09:40','09:31','09:47','','09:31','09:33','09:36','09:39','09:35'], out_times:['','','','17:37','','17:35','17:40','17:35','17:30','','','','17:37','17:35','17:39','17:36','17:42','','','13:32','','','17:41','17:59','17:35','','17:38','17:33','17:35','17:37','17:30'], hours:['','','','8.03','','8.17','8.1','8.0','7.54','','','','8.09','8.0','8.06','8.01','8.02','','','3.51','','','8.01','8.28','7.48','','8.07','8.0','7.59','7.58','7.55'], status:['H','CL','VL','P','W','P','P','P','P','H','H','W','P','P','P','P','P','H','W','P','VL','VL','P','P','P','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1530', EMPLOYEENAME:'Savitha Giriapura Shivamurthy', in_times:['','08:53','09:11','09:06','','09:04','09:23','09:17','09:19','','','','09:04','09:05','09:18','09:06','09:21','','','09:13','09:11','09:19','09:05','09:04','09:03','','09:17','','09:20','09:15','09:22'], out_times:['','17:51','17:28','17:24','','17:20','17:03','17:02','17:11','','','','17:10','17:05','17:07','17:22','17:51','','','17:13','17:15','17:12','17:16','17:49','17:02','','17:09','','17:02','17:13','17:16'], hours:['','8.58','8.17','8.18','','8.16','7.4','7.45','7.52','','','','8.06','8.0','7.49','8.16','8.3','','','8.0','8.04','7.53','8.11','8.45','7.59','','7.52','','7.42','7.58','7.54'], status:['H','P','P','P','W','P','P','P','P','H','H','W','P','P','P','P','P','H','W','P','P','P','P','P','P','W','P','CL','P','P','P'] },
    { EMPCODE:'NH-1566', EMPLOYEENAME:'Ramalaxmi Murugesan', in_times:['09:08','09:11','07:54','','','','','','','','','','09:10','09:13','09:11','09:08','09:16','','','09:07','09:11','09:13','09:08','','09:08','','09:04','08:51','09:08','09:04','09:07'], out_times:['15:01','','20:16','','','','','','','','','','17:21','17:22','17:24','17:24','17:24','','','17:13','17:24','17:14','17:37','17:43','17:10','','17:23','17:06','17:10','17:13','17:18'], hours:['5.53','','12.22','','','','','','','','','','8.11','8.09','8.13','8.16','8.08','','','8.06','8.13','8.01','8.29','','8.02','','8.19','8.15','8.02','8.09','8.11'], status:['H','P/A','P','CL','W','CO','CL','CL','CL','H','H','W','P','P','P','P','P','H','W','P','P','P','P','A/P','P','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1571', EMPLOYEENAME:'V Vyshnavi', in_times:['','09:12','08:52','08:56','','09:02','08:57','08:55','08:56','','','','','10:08','08:54','','','','','','','','','','','','','','','',''], out_times:['','17:14','17:21','17:21','','17:11','17:04','17:05','17:06','','','','','17:28','17:45','','','','','','','','','','','','','','','',''], hours:['','8.02','8.29','8.25','','8.09','8.07','8.1','8.1','','','','','7.2','8.51','','','','','','','','','','','','','','','',''], status:['H','P','P','P','W','P','P','P','P','H','H','W','LOPNR','P','P','LOPNR','LOPNR','H','W','LOPNR','LOPNR','LOPNR','LOPNR','LOPNR','LOPNR','W','LOPNR','LOPNR','LOPNR','LOPNR','LOPNR'] },
    { EMPCODE:'NH-1573', EMPLOYEENAME:'R. Bhavya Sai', in_times:['','09:22','09:02','10:05','','08:44','09:11','08:51','08:36','','','','','10:08','08:54','09:04','08:37','','','10:07','09:15','08:25','08:28','09:55','08:25','','08:59','08:58','08:57','08:44',''], out_times:['','17:14','17:21','17:21','','17:31','17:04','17:05','14:20','','','','','17:28','17:45','17:36','17:23','','','13:34','17:06','17:06','17:03','17:48','17:18','','17:23','17:17','17:14','17:30',''], hours:['','7.52','8.19','7.16','','8.47','7.53','8.14','5.44','','','','','7.2','8.51','8.32','8.46','','','3.27','7.51','8.41','8.35','7.53','8.53','','8.24','8.19','8.17','8.46',''], status:['H','P','P','P','W','P','P','P','LOP(HF)','H','H','W','CL','P','P','P','P','H','W','LOP(HF)','P','P','P','P','P','W','P','P','P','P','LOPNR'] },
    { EMPCODE:'NH-1596', EMPLOYEENAME:'Shravani S', in_times:['','08:26','','08:30','','08:02','08:39','08:48','08:37','','','','08:52','','08:28','08:52','09:07','08:19','','08:12','08:32','08:55','08:32','','08:49','','08:52','08:30','08:21','08:39','08:22'], out_times:['','16:39','','16:52','','16:48','16:30','16:52','16:36','','','','16:52','','16:31','16:55','19:27','17:06','','17:03','','16:42','17:06','','','','16:59','17:06','16:32','17:13','16:50'], hours:['','8.13','','8.22','','8.46','7.51','8.04','7.59','','','','8.0','','8.03','8.03','10.2','8.47','','8.51','','7.47','8.34','','','','8.07','8.36','8.11','8.34','8.28'], status:['H','P','CL','P','W','P','P','P','P','H','H','W','P','LOPNR','P','P','P','H','W','P','P/A','P','P','LOPNR','P/A','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1597', EMPLOYEENAME:'Marinla Imsong', in_times:['','08:49','08:46','08:37','','08:46','08:50','09:05','08:43','','','','08:52','08:51','08:45','08:51','08:43','','','08:52','08:50','08:47','08:46','08:50','08:38','','08:50','08:46','08:39','08:55','08:47'], out_times:['','16:51','16:51','16:58','','16:52','16:52','16:50','16:54','','','','16:52','16:51','16:53','16:55','17:42','','','16:52','16:51','16:54','16:53','17:39','16:52','','16:50','16:52','16:52','16:51','17:02'], hours:['','8.02','8.05','8.21','','8.06','8.02','7.45','8.11','','','','8.0','8.0','8.08','8.04','8.59','','','8.0','8.01','8.07','8.07','8.49','8.14','','8.0','8.06','8.13','7.56','8.15'], status:['H','P','P','P','W','P','P','P','P','H','H','W','P','P','P','P','P','H','W','P','P','P','P','P','P','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1599', EMPLOYEENAME:'Sonali Vishwanath Mhatre', in_times:['','08:38','08:26','08:13','','08:31','08:32','08:31','08:30','','','','08:17','','','09:15','08:42','','','08:33','09:00','08:55','08:48','08:35','08:18','','08:23','08:31','08:36','08:50','08:46'], out_times:['','17:05','16:58','16:58','','17:01','17:19','17:01','16:58','','','','17:00','','','17:01','17:27','','','17:01','17:01','17:09','16:58','17:41','17:07','','17:01','17:00','16:57','16:57','17:03'], hours:['','8.27','8.32','8.45','','8.3','8.47','8.3','8.28','','','','8.43','','','7.46','8.45','','','8.28','8.01','8.14','8.1','9.06','8.49','','8.38','8.29','8.21','8.07','8.17'], status:['H','P','P','P','W','P','P','P','P','H','H','W','P','CL','CL','P','P','H','W','P','P','P','P','P','P','W','P','P','P','P','P'] },
    { EMPCODE:'NH-1615', EMPLOYEENAME:'Praveena M P', in_times:['','','','','','','10:09','09:30','09:30','','','','09:12','09:31','09:06','09:44','09:16','','','09:11','09:19','09:21','09:20','09:28','09:27','','09:27','','','',''], out_times:['','','','','','18:11','18:06','17:33','17:10','','','','17:59','17:37','17:39','17:58','17:32','','','17:51','17:49','17:36','18:00','17:40','17:19','','18:10','','','',''], hours:['','','','','','','7.57','8.03','7.4','','','','8.47','8.06','8.33','8.14','8.16','','','8.4','8.3','8.15','8.4','8.12','7.52','','8.43','','','',''], status:['H','LOPNR','LOPNR','LOPNR','W','A/P','P','P','P','H','H','W','P','P','P','P','P','H','W','P','P','P','P','P','P','W','P','LOPNR','LOPNR','LOPNR','LOPNR'] },
];

const initialLeaveBookData = [
    { 'Staff Code': 'NH-0001', 'Staff Name': 'V Manjula',         'Department': 'Human Resources', 'Designation': 'Executive Director',  'D.O.J': '01-Jun-2010', 'EL': 3,   'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-0212', 'Staff Name': 'Bindu Menon',        'Department': 'Human Resources', 'Designation': 'Sr. HR Generalist',    'D.O.J': '15-Aug-2015', 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-0796', 'Staff Name': 'Maroju Hima Bindu', 'Department': 'Human Resources', 'Designation': 'Sr. HR Executive',     'D.O.J': '22-Oct-2017', 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': 7,   'OOD': '-', 'OED': '-', 'CO': 2,  'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-1615', 'Staff Name': 'Praveena M P',       'Department': 'Human Resources', 'Designation': 'Personal Assistant',   'D.O.J': '10-Mar-2021', 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': 5,  'LOPNR': '-', 'HR Comments': 'Salary Hold LWD - 27.05.24' },
    { 'Staff Code': 'NH-0003', 'Staff Name': 'Surya Prakash H N', 'Department': 'Administration',  'Designation': 'Registrar',             'D.O.J': '10-May-2008', 'EL': 2,   'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': 2,  'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-0004', 'Staff Name': 'Kavitha R',          'Department': 'Administration',  'Designation': 'Asst. Registrar',       'D.O.J': '15-Jun-2012', 'EL': '-', 'CL': 1,   'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-0010', 'Staff Name': 'Registrar (Admin)',  'Department': 'Administration',  'Designation': 'Principal',             'D.O.J': '25-Aug-2003', 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-0015', 'Staff Name': 'ISE HOD',            'Department': 'ISE',             'Designation': 'Professor & HOD',       'D.O.J': '05-Feb-2018', 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-0381', 'Staff Name': 'MBA Office Exec.',   'Department': 'MBA',             'Designation': 'Office Executive',      'D.O.J': '01-Jan-2014', 'EL': '-', 'CL': 2,   'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
    { 'Staff Code': 'NH-0382', 'Staff Name': 'MBA HOD',            'Department': 'MBA',             'Designation': 'Sr. Asst. Prof. & HOD', 'D.O.J': '10-Jun-2013', 'EL': 1,   'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '' },
];

const initialYearlyLeaveData = [
    { EmployeeCode:'NH-0001', EmployeeName:'V Manjula',         Department:'Human Resources', Designation:'Executive Director',      DOJ:'01-Jun-2010', TotalEL:21, TakenEL:16,   BalanceEL:5,   TotalCL:12, TakenCL:7.5, BalanceCL:4.5, TotalSL:'-', TakenSL:'-', BalanceSL:'-', TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:7, TakenOOD:0, BalanceOOD:7, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:0, BalanceLOP:5, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-0003', EmployeeName:'Surya Prakash H N', Department:'Administration',  Designation:'Registrar',               DOJ:'10-May-2008', TotalEL:21, TakenEL:14,   BalanceEL:7,   TotalCL:12, TakenCL:10.5,BalanceCL:1.5, TotalSL:'-', TakenSL:'-', BalanceSL:'-', TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:7, TakenOOD:4, BalanceOOD:3, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:0, BalanceLOP:5, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-0212', EmployeeName:'Bindu Menon',        Department:'Human Resources', Designation:'Sr. HR Generalist',       DOJ:'15-Aug-2015', TotalEL:15, TakenEL:8,    BalanceEL:7,   TotalCL:12, TakenCL:5,   BalanceCL:7,   TotalSL:6,   TakenSL:0,   BalanceSL:6,   TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:5, TakenOOD:2, BalanceOOD:3, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:0, BalanceLOP:5, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-0004', EmployeeName:'Kavitha R',          Department:'Administration',  Designation:'Asst. Registrar',         DOJ:'15-Jun-2012', TotalEL:15, TakenEL:4,    BalanceEL:11,  TotalCL:12, TakenCL:8,   BalanceCL:4,   TotalSL:6,   TakenSL:1,   BalanceSL:5,   TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:5, TakenOOD:0, BalanceOOD:5, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:0, BalanceLOP:5, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-0796', EmployeeName:'Maroju Hima Bindu', Department:'Human Resources', Designation:'Sr. HR Executive',        DOJ:'22-Oct-2017', TotalEL:12, TakenEL:6,    BalanceEL:6,   TotalCL:12, TakenCL:4,   BalanceCL:8,   TotalSL:6,   TakenSL:0,   BalanceSL:6,   TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:7,   TakenVL:7,   BalanceVL:0,   TotalOOD:5, TakenOOD:0, BalanceOOD:5, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:3,  TakenCO:2,  BalanceCO:1,  TotalLOP:5, TakenLOP:0, BalanceLOP:5, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-1615', EmployeeName:'Praveena M P',       Department:'Human Resources', Designation:'Personal Assistant',      DOJ:'10-Mar-2021', TotalEL:9,  TakenEL:4,    BalanceEL:5,   TotalCL:12, TakenCL:3,   BalanceCL:9,   TotalSL:6,   TakenSL:1,   BalanceSL:5,   TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:5, TakenOOD:0, BalanceOOD:5, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:5, BalanceLOP:0, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-0015', EmployeeName:'ISE HOD',            Department:'ISE',             Designation:'Professor & HOD',         DOJ:'05-Feb-2018', TotalEL:21, TakenEL:12,   BalanceEL:9,   TotalCL:12, TakenCL:8,   BalanceCL:4,   TotalSL:6,   TakenSL:0,   BalanceSL:6,   TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:7, TakenOOD:3, BalanceOOD:4, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:0, BalanceLOP:5, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-0381', EmployeeName:'MBA Office Exec.',   Department:'MBA',             Designation:'Office Executive',        DOJ:'01-Jan-2014', TotalEL:15, TakenEL:9,    BalanceEL:6,   TotalCL:12, TakenCL:6,   BalanceCL:6,   TotalSL:6,   TakenSL:0,   BalanceSL:6,   TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:5, TakenOOD:0, BalanceOOD:5, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:0, BalanceLOP:5, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
    { EmployeeCode:'NH-0382', EmployeeName:'MBA HOD',            Department:'MBA',             Designation:'Sr. Asst. Prof. & HOD',  DOJ:'10-Jun-2013', TotalEL:21, TakenEL:10,   BalanceEL:11,  TotalCL:12, TakenCL:5,   BalanceCL:7,   TotalSL:6,   TakenSL:0,   BalanceSL:6,   TotalML:'-', TakenML:'-', BalanceML:'-', TotalVL:'-', TakenVL:'-', BalanceVL:'-', TotalOOD:7, TakenOOD:1, BalanceOOD:6, TotalOED:'-', TakenOED:'-', BalanceOED:'-', TotalCO:'-', TakenCO:'-', BalanceCO:'-', TotalLOP:5, TakenLOP:1, BalanceLOP:4, TotalLOPNR:'-', TakenLOPNR:'-', BalanceLOPNR:'-' },
];

export const getBioData = () => initialBioData;
export const getMonthlyLeaveData = () => initialLeaveBookData;
export const getYearlyLeaveData = () => initialYearlyLeaveData;

// Now we ensure missing staff members exist
const ensureStaffExists = (id: string, name: string, dept: string, desig: string, doj: string) => {
    const exists = mockStaffMembers.find(m => m.id === id);
    if (!exists) {
        mockStaffMembers.push({
            id, name, designation: desig || 'Staff', department: dept || 'Inter-Department',
            joiningDate: doj || '2023-01-01', email: `${name.split(' ')[0].toLowerCase()}@college.edu`,
            phone: '+91 90000 00000', qualification: '-', reportingManager: 'HOD', status: 'Active',
            reportDetails: {
                dob: '-', education: { others: '-', ug: '-', pg: '-', doct: '-', spec: '-' },
                experience: { teach: '-', ind: '-', res: '-', expOthers: '-', nhce: '-', tot: '-' },
                salary: { basic: 0, da: 0, hra: 0, cca: 0, others: 0, convAll: 0, agp: 0, pfAmnt: 0, variablePay: 0, gross: 0 }
            }
        });
    }
};

// Seed missing staff
initialBioData.forEach(d => ensureStaffExists(d.EMPCODE, d.EMPLOYEENAME, '', '', ''));
initialLeaveBookData.forEach(d => ensureStaffExists(d['Staff Code'], d['Staff Name'], d['Department'], d['Designation'], d['D.O.J']));
initialYearlyLeaveData.forEach(d => ensureStaffExists(d.EmployeeCode, d.EmployeeName, d.Department, d.Designation, d.DOJ));

export function getStaffBiometrics(staffId: string) {
    return initialBioData.find(d => d.EMPCODE === staffId) || null;
}

export function getStaffMonthlyLeave(staffId: string) {
    return initialLeaveBookData.find(d => d['Staff Code'] === staffId) || null;
}

export function getStaffYearlyLeave(staffId: string) {
    return initialYearlyLeaveData.find(d => d.EmployeeCode === staffId) || null;
}
