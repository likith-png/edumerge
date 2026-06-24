import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import {
    GraduationCap,
    Users,
    BookOpen,
    MapPin,
    Calendar,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    Plus,
    Check,
    FileText,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

// Interfaces for our types
interface Guru {
    id: string;
    name: string;
    subject: string; // Music, Dance, Other
    email: string;
    phone: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    guruId: string;
    window: 'DEC' | 'JAN';
    merit: number; // 0-100
}

interface ExamCenter {
    id: string;
    name: string;
    capacity: number;
}

interface Exam {
    id: string;
    name: string;
    type: 'Theory' | 'Oral' | 'Practical';
    date: string;
    centerId?: string; // only for Practical
}

interface Allocation {
    studentId: string;
    studentName: string;
    guruName: string;
    centerName: string;
    timeSlot: string;
    status: string;
}

interface Result {
    id: string;
    examId: string;
    studentId: string;
    score: number; // 0-100
    status: 'Pass' | 'Fail'; // Pass if score >= 40
    published: boolean;
}

const GandosavaExamManagement: React.FC = () => {
    // ----------------------------------------------------
    // PRE-POPULATED DATA STATE
    // ----------------------------------------------------
    
    // 3 Gurus
    const [gurus, setGurus] = useState<Guru[]>([
        {
            id: 'GU-2026-0001',
            name: 'Ramakrishnan Iyer',
            subject: 'Music',
            email: 'ramakrishnan.iyer@gangubai.edu',
            phone: '9876543210'
        },
        {
            id: 'GU-2026-0002',
            name: 'Anjali Sharma',
            subject: 'Dance',
            email: 'anjali.sharma@gangubai.edu',
            phone: '9876543211'
        },
        {
            id: 'GU-2026-0003',
            name: 'Vikram Nair',
            subject: 'Music',
            email: 'vikram.nair@gangubai.edu',
            phone: '9876543212'
        }
    ]);

    // 5 Students
    const [students, setStudents] = useState<Student[]>([
        {
            id: 'ST-2026-0001',
            name: 'Priya Desai',
            email: 'priya.desai@gmail.com',
            phone: '9123456780',
            dob: '2005-04-12',
            guruId: 'GU-2026-0001',
            window: 'DEC',
            merit: 85
        },
        {
            id: 'ST-2026-0002',
            name: 'Arjun Malhotra',
            email: 'arjun.m@gmail.com',
            phone: '9123456781',
            dob: '2004-11-23',
            guruId: 'GU-2026-0001',
            window: 'DEC',
            merit: 78
        },
        {
            id: 'ST-2026-0003',
            name: 'Sneha Krishnan',
            email: 'sneha.k@gmail.com',
            phone: '9123456782',
            dob: '2005-08-05',
            guruId: 'GU-2026-0002',
            window: 'JAN',
            merit: 92
        },
        {
            id: 'ST-2026-0004',
            name: 'Rohan Patel',
            email: 'rohan.p@gmail.com',
            phone: '9123456783',
            dob: '2004-05-18',
            guruId: 'GU-2026-0002',
            window: 'JAN',
            merit: 81
        },
        {
            id: 'ST-2026-0005',
            name: 'Divya Menon',
            email: 'divya.m@gmail.com',
            phone: '9123456784',
            dob: '2005-01-30',
            guruId: 'GU-2026-0003',
            window: 'DEC',
            merit: 88
        }
    ]);

    // 3 Exam Centers (Pre-populated)
    const centers: ExamCenter[] = [
        { id: 'EC-001', name: 'Music Block - Main Campus', capacity: 50 },
        { id: 'EC-002', name: 'Dance Studio Annex', capacity: 40 },
        { id: 'EC-003', name: 'Theory Hall - Downtown', capacity: 60 }
    ];

    // Pre-populated Exams
    const [exams, setExams] = useState<Exam[]>([
        {
            id: 'EX-2026-0001',
            name: 'Shastra Theory Foundation',
            type: 'Theory',
            date: '2026-06-18'
        },
        {
            id: 'EX-2026-0002',
            name: 'Hindustani Vocal Practical',
            type: 'Practical',
            date: '2026-06-20',
            centerId: 'EC-001'
        }
    ]);

    // Results state (Initially empty, users can fill in)
    const [results, setResults] = useState<Result[]>([]);
    
    // Published Results details
    const [isPublished, setIsPublished] = useState(false);
    const [publishDate, setPublishDate] = useState<string | null>(null);

    // Allocations State (Initiates when button is clicked)
    const [allocations, setAllocations] = useState<Allocation[]>([]);

    // Navigation and tabs control
    const [activeTab, setActiveTab] = useState<'registration' | 'exams' | 'results'>('registration');

    // ----------------------------------------------------
    // FORM STATES & ERRORS
    // ----------------------------------------------------
    // Guru Form
    const [guruName, setGuruName] = useState('');
    const [guruSubject, setGuruSubject] = useState('Music');
    const [guruEmail, setGuruEmail] = useState('');
    const [guruPhone, setGuruPhone] = useState('');
    const [guruError, setGuruError] = useState('');
    const [guruSuccess, setGuruSuccess] = useState('');

    // Student Form
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [studentDob, setStudentDob] = useState('');
    const [studentGuruId, setStudentGuruId] = useState('');
    const [studentWindow, setStudentWindow] = useState<'DEC' | 'JAN'>('DEC');
    const [studentMerit, setStudentMerit] = useState('');
    const [studentError, setStudentError] = useState('');
    const [studentSuccess, setStudentSuccess] = useState('');

    // Exam Form
    const [examName, setExamName] = useState('');
    const [examType, setExamType] = useState<'Theory' | 'Oral' | 'Practical'>('Theory');
    const [examDate, setExamDate] = useState('');
    const [examCenterId, setExamCenterId] = useState('');
    const [examError, setExamError] = useState('');
    const [examSuccess, setExamSuccess] = useState('');

    // Results Form
    const [resultExamId, setResultExamId] = useState('');
    const [resultStudentId, setResultStudentId] = useState('');
    const [resultScore, setResultScore] = useState('');
    const [resultError, setResultError] = useState('');
    const [resultSuccess, setResultSuccess] = useState('');

    // ----------------------------------------------------
    // REGISTRATION FORM SUBMISSION LOGIC
    // ----------------------------------------------------

    // Handle Guru Submit
    const handleGuruSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setGuruError('');
        setGuruSuccess('');

        if (!guruName || !guruEmail || !guruPhone || !guruSubject) {
            setGuruError('All fields are required.');
            return;
        }

        // Generate Guru ID: GU-2026-0001, GU-2026-0002...
        // Find maximum numeric value or count
        const newIndex = gurus.length + 1;
        const generatedId = `GU-2026-${String(newIndex).padStart(4, '0')}`;

        const newGuru: Guru = {
            id: generatedId,
            name: guruName.trim(),
            subject: guruSubject,
            email: guruEmail.trim(),
            phone: guruPhone.trim()
        };

        setGurus(prev => [...prev, newGuru]);
        setGuruSuccess(`Guru registered successfully with ID: ${generatedId}`);
        
        // Reset form
        setGuruName('');
        setGuruEmail('');
        setGuruPhone('');
        setGuruSubject('Music');

        // Hide success message after 3 seconds
        setTimeout(() => setGuruSuccess(''), 4000);
    };

    // Handle Student Submit
    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStudentError('');
        setStudentSuccess('');

        if (!studentName || !studentEmail || !studentPhone || !studentDob || !studentGuruId || !studentMerit) {
            setStudentError('All fields, including Guru selection, are mandatory.');
            return;
        }

        // Verify selected Guru exists
        const guruExists = gurus.some(g => g.id === studentGuruId);
        if (!guruExists) {
            setStudentError('Invalid Guru ID selected.');
            return;
        }

        // Merit mark validation (0 to 100)
        const meritScore = Number(studentMerit);
        if (isNaN(meritScore) || meritScore < 0 || meritScore > 100 || studentMerit.trim() === '') {
            setStudentError('Merit marks must be a valid number between 0 and 100.');
            return;
        }

        // Generate Student ID: ST-2026-0001...
        const newIndex = students.length + 1;
        const generatedId = `ST-2026-${String(newIndex).padStart(4, '0')}`;

        const newStudent: Student = {
            id: generatedId,
            name: studentName.trim(),
            email: studentEmail.trim(),
            phone: studentPhone.trim(),
            dob: studentDob,
            guruId: studentGuruId,
            window: studentWindow,
            merit: meritScore
        };

        setStudents(prev => [...prev, newStudent]);
        setStudentSuccess(`Student registered successfully with ID: ${generatedId}`);

        // Reset form
        setStudentName('');
        setStudentEmail('');
        setStudentPhone('');
        setStudentDob('');
        setStudentGuruId('');
        setStudentWindow('DEC');
        setStudentMerit('');

        setTimeout(() => setStudentSuccess(''), 4000);
    };

    // ----------------------------------------------------
    // EXAM & ALLOCATION LOGIC
    // ----------------------------------------------------

    // Handle Exam Submit
    const handleExamSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setExamError('');
        setExamSuccess('');

        if (!examName || !examType || !examDate) {
            setExamError('Please enter Name, Type, and Date.');
            return;
        }

        if (examType === 'Practical' && !examCenterId) {
            setExamError('Practical exams must specify an Exam Center.');
            return;
        }

        // Generate Exam ID
        const newIndex = exams.length + 1;
        const generatedId = `EX-2026-${String(newIndex).padStart(4, '0')}`;

        const newExam: Exam = {
            id: generatedId,
            name: examName.trim(),
            type: examType,
            date: examDate,
            centerId: examType === 'Practical' ? examCenterId : undefined
        };

        setExams(prev => [...prev, newExam]);
        setExamSuccess(`Exam "${examName}" scheduled successfully!`);

        // Reset
        setExamName('');
        setExamType('Theory');
        setExamDate('');
        setExamCenterId('');

        setTimeout(() => setExamSuccess(''), 4000);
    };

    // Distribute students across centers capacity-aware
    const handleAllocation = () => {
        const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];
        
        // Define limits
        const centerLimits = centers.reduce((acc, center) => {
            acc[center.id] = center.capacity;
            return acc;
        }, {} as Record<string, number>);

        // Track how many students have been allocated to each center
        const centerAllocCounts = centers.reduce((acc, center) => {
            acc[center.id] = 0;
            return acc;
        }, {} as Record<string, number>);

        // Track allocated counts per slot inside each center for balanced slotting
        const slotDistribution = centers.reduce((acc, center) => {
            acc[center.id] = { "9:00 AM": 0, "11:00 AM": 0, "1:00 PM": 0, "3:00 PM": 0 };
            return acc;
        }, {} as Record<string, Record<string, number>>);

        const calculatedAllocations: Allocation[] = students.map((student) => {
            const guru = gurus.find(g => g.id === student.guruId);
            const subject = guru ? guru.subject : 'Other';

            // Determine priority order of centers based on subject area
            let centerPriority: string[] = [];
            if (subject === 'Music') {
                centerPriority = ['EC-001', 'EC-003', 'EC-002']; // Music Block -> Theory Hall -> Dance Studio
            } else if (subject === 'Dance') {
                centerPriority = ['EC-002', 'EC-003', 'EC-001']; // Dance Studio -> Theory Hall -> Music Block
            } else {
                centerPriority = ['EC-003', 'EC-001', 'EC-002']; // Theory Hall -> Music Block -> Dance Studio
            }

            // Find first center in priority order that has capacity remaining
            let assignedCenterId = centerPriority.find(cId => centerAllocCounts[cId] < centerLimits[cId]);

            // Fallback: check any center with space
            if (!assignedCenterId) {
                assignedCenterId = centers.map(c => c.id).find(cId => centerAllocCounts[cId] < centerLimits[cId]);
            }

            if (assignedCenterId) {
                // Register allocation
                centerAllocCounts[assignedCenterId]++;
                const centerDetails = centers.find(c => c.id === assignedCenterId)!;

                // Pick the slot with the minimum students assigned within this center to balance load
                const centerSlots = slotDistribution[assignedCenterId];
                let chosenSlot = timeSlots[0];
                let minVal = Infinity;
                timeSlots.forEach((slot) => {
                    if (centerSlots[slot] < minVal) {
                        minVal = centerSlots[slot];
                        chosenSlot = slot;
                    }
                });
                centerSlots[chosenSlot]++;

                return {
                    studentId: student.id,
                    studentName: student.name,
                    guruName: guru ? guru.name : 'Unknown Guru',
                    centerName: centerDetails.name,
                    timeSlot: chosenSlot,
                    status: 'Allocated'
                };
            } else {
                // Out of capacity fallback
                return {
                    studentId: student.id,
                    studentName: student.name,
                    guruName: guru ? guru.name : 'Unknown Guru',
                    centerName: 'Over Capacity - Unassigned',
                    timeSlot: 'N/A',
                    status: 'Pending'
                };
            }
        });

        setAllocations(calculatedAllocations);
    };

    // ----------------------------------------------------
    // RESULTS & PUBLISHING LOGIC
    // ----------------------------------------------------

    // Handle score submission
    const handleResultSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setResultError('');
        setResultSuccess('');

        if (!resultExamId || !resultStudentId || !resultScore) {
            setResultError('All fields must be selected/filled.');
            return;
        }

        const scoreVal = Number(resultScore);
        if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100 || resultScore.trim() === '') {
            setResultError('Score must be a number between 0 and 100.');
            return;
        }

        // Check if student already has a score entered for this specific exam
        const duplicateIndex = results.findIndex(
            r => r.examId === resultExamId && r.studentId === resultStudentId
        );

        const newResult: Result = {
            id: duplicateIndex !== -1 ? results[duplicateIndex].id : `R-${Date.now()}`,
            examId: resultExamId,
            studentId: resultStudentId,
            score: scoreVal,
            status: scoreVal >= 40 ? 'Pass' : 'Fail',
            published: isPublished // Carry over current publishing status
        };

        if (duplicateIndex !== -1) {
            // Overwrite score
            setResults(prev => {
                const updated = [...prev];
                updated[duplicateIndex] = newResult;
                return updated;
            });
            setResultSuccess('Existing result updated successfully!');
        } else {
            // Add new score
            setResults(prev => [...prev, newResult]);
            setResultSuccess('Result recorded successfully!');
        }

        // Reset Score only, keep Exam selected for convenience
        setResultScore('');
        setTimeout(() => setResultSuccess(''), 4000);
    };

    // Mark results as published with date badge
    const handlePublishResults = () => {
        if (results.length === 0) {
            setResultError('Cannot publish. Enter at least one result first.');
            return;
        }

        setIsPublished(true);
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        setPublishDate(timestamp);
        
        // Update all existing results as published
        setResults(prev => prev.map(r => ({ ...r, published: true })));
    };

    // ----------------------------------------------------
    // DYNAMIC DERIVED SUMMARIES
    // ----------------------------------------------------

    // Guru Performance Metrics calculations
    const guruSummaries = useMemo(() => {
        return gurus.map((guru) => {
            // Get all students registered under this guru
            const guruStudents = students.filter(s => s.guruId === guru.id);
            const totalStudentsCount = guruStudents.length;

            // Get all results for these students
            const studentIds = guruStudents.map(s => s.id);
            const guruResults = results.filter(r => studentIds.includes(r.studentId));
            const resultsCount = guruResults.length;

            // Compute pass count and avg score
            const passCount = guruResults.filter(r => r.status === 'Pass').length;
            const avgScore = resultsCount > 0 
                ? Math.round(guruResults.reduce((sum, r) => sum + r.score, 0) / resultsCount) 
                : 0;
            
            // Calculate pass rate based on results entered, or total students?
            // "5 students | 4 passed | 80% | 72 avg" -> calculation here: 4 passed / 5 total students * 100 = 80%.
            // So pass rate is calculated relative to total registered students for this Guru.
            const passRate = totalStudentsCount > 0 
                ? Math.round((passCount / totalStudentsCount) * 100) 
                : 0;

            return {
                name: guru.name,
                totalStudents: totalStudentsCount,
                passCount: passCount,
                avgScore: avgScore,
                passRate: passRate,
                resultsEntered: resultsCount
            };
        });
    }, [gurus, students, results]);

    // Student dynamically mapped with Guru names (for list views)
    const studentListWithGuru = useMemo(() => {
        return students.map((student) => {
            const guru = gurus.find(g => g.id === student.guruId);
            return {
                ...student,
                guruName: guru ? guru.name : 'Unknown Guru'
            };
        });
    }, [students, gurus]);

    return (
        <Layout
            title="Gandosava Exam Management System"
            description="Gangubai University's unified portal for Guru registry, Student enrollments, Center allocations, and Results publishing."
            icon={GraduationCap}
            showHome={true}
        >
            <div className="space-y-6">
                
                {/* ----------------------------------------------------
                    TAB DIRECTORY BUTTONS (3 Tabs)
                    ---------------------------------------------------- */}
                <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-xl shadow-sm max-w-lg">
                    <button
                        onClick={() => setActiveTab('registration')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'registration' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        <Users className="w-4 h-4" />
                        Registration
                    </button>
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'exams' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        <Calendar className="w-4 h-4" />
                        Exams & Centers
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'results' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        <Award className="w-4 h-4" />
                        Results
                    </button>
                </div>

                {/* ----------------------------------------------------
                    TAB 1: REGISTRATION
                    ---------------------------------------------------- */}
                {activeTab === 'registration' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
                        {/* Gurus Panel (Left Form + Right List or top/bottom stack) */}
                        <div className="lg:col-span-6 space-y-6">
                            
                            {/* Guru Form Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Guru Registration</h3>
                                        <p className="text-slate-500 text-xs">Register new subject matter experts and mentors.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleGuruSubmit} className="space-y-4">
                                    {guruError && (
                                        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{guruError}</span>
                                        </div>
                                    )}
                                    {guruSuccess && (
                                        <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <span>{guruSuccess}</span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={guruName}
                                            onChange={(e) => setGuruName(e.target.value)}
                                            placeholder="e.g. Pandit Hariprasad Chaurasia"
                                            className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Subject Specialty</label>
                                        <select
                                            value={guruSubject}
                                            onChange={(e) => setGuruSubject(e.target.value)}
                                            className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                        >
                                            <option value="Music">Music</option>
                                            <option value="Dance">Dance</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                value={guruEmail}
                                                onChange={(e) => setGuruEmail(e.target.value)}
                                                placeholder="guru@gangubai.edu"
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={guruPhone}
                                                onChange={(e) => setGuruPhone(e.target.value)}
                                                placeholder="9876543210"
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-10 mt-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Guru
                                    </button>
                                </form>
                            </div>

                            {/* Guru List */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span>Registered Gurus</span>
                                    <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded-full font-bold">
                                        {gurus.length} Total
                                    </span>
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                <th className="pb-3 pr-2">ID</th>
                                                <th className="pb-3">Name</th>
                                                <th className="pb-3">Subject</th>
                                                <th className="pb-3 text-right">Students</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {gurus.map((g) => {
                                                const sCount = students.filter(s => s.guruId === g.id).length;
                                                return (
                                                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="py-3 pr-2 font-mono text-xs text-slate-400 font-bold">{g.id}</td>
                                                        <td className="py-3 font-semibold text-slate-900">{g.name}</td>
                                                        <td className="py-3">
                                                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${g.subject === 'Music' ? 'bg-purple-50 text-purple-700 border border-purple-100' : g.subject === 'Dance' ? 'bg-pink-50 text-pink-700 border border-pink-100' : 'bg-slate-50 text-slate-700 border border-slate-100'}`}>
                                                                {g.subject}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-right font-bold text-slate-600 group-hover:text-slate-950 transition-colors pr-2">
                                                            {sCount}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Students Panel */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Student Form Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Student Registration</h3>
                                        <p className="text-slate-500 text-xs">Enroll new candidates under registered Gurus.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleStudentSubmit} className="space-y-4">
                                    {studentError && (
                                        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{studentError}</span>
                                        </div>
                                    )}
                                    {studentSuccess && (
                                        <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <span>{studentSuccess}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                value={studentName}
                                                onChange={(e) => setStudentName(e.target.value)}
                                                placeholder="e.g. Priya Desai"
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={studentDob}
                                                onChange={(e) => setStudentDob(e.target.value)}
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                value={studentEmail}
                                                onChange={(e) => setStudentEmail(e.target.value)}
                                                placeholder="student@example.com"
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={studentPhone}
                                                onChange={(e) => setStudentPhone(e.target.value)}
                                                placeholder="9123456780"
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Assigned Guru ID</label>
                                            <select
                                                value={studentGuruId}
                                                onChange={(e) => setStudentGuruId(e.target.value)}
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            >
                                                <option value="">-- Select Guru --</option>
                                                {gurus.map((g) => (
                                                    <option key={g.id} value={g.id}>
                                                        {g.name} ({g.id})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Exam Window</label>
                                            <select
                                                value={studentWindow}
                                                onChange={(e) => setStudentWindow(e.target.value as 'DEC' | 'JAN')}
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            >
                                                <option value="DEC">DEC</option>
                                                <option value="JAN">JAN</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Merit Marks (0-100)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={studentMerit}
                                                onChange={(e) => setStudentMerit(e.target.value)}
                                                placeholder="e.g. 85"
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-10 mt-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Enroll Student
                                    </button>
                                </form>
                            </div>

                            {/* Student List */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span>Registered Students</span>
                                    <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded-full font-bold">
                                        {students.length} Enrolled
                                    </span>
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                <th className="pb-3 pr-2">ID</th>
                                                <th className="pb-3">Name</th>
                                                <th className="pb-3">Guru Name</th>
                                                <th className="pb-3">Window</th>
                                                <th className="pb-3 text-right">Merit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {studentListWithGuru.map((s) => (
                                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-3 pr-2 font-mono text-xs text-slate-400 font-bold">{s.id}</td>
                                                    <td className="py-3 font-semibold text-slate-900">{s.name}</td>
                                                    <td className="py-3 text-slate-600">{s.guruName}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${s.window === 'DEC' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                                            {s.window}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right font-bold text-slate-700 pr-2">{s.merit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ----------------------------------------------------
                    TAB 2: EXAMS & CENTERS
                    ---------------------------------------------------- */}
                {activeTab === 'exams' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
                        {/* Left Side Forms */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* Schedule Exam Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Exam Scheduler</h3>
                                        <p className="text-slate-500 text-xs">Set up examinations and practical venues.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleExamSubmit} className="space-y-4">
                                    {examError && (
                                        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{examError}</span>
                                        </div>
                                    )}
                                    {examSuccess && (
                                        <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <span>{examSuccess}</span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Exam Name</label>
                                        <input
                                            type="text"
                                            value={examName}
                                            onChange={(e) => setExamName(e.target.value)}
                                            placeholder="e.g. Shastra Theory Foundation"
                                            className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Exam Type</label>
                                            <select
                                                value={examType}
                                                onChange={(e) => {
                                                    const val = e.target.value as 'Theory' | 'Oral' | 'Practical';
                                                    setExamType(val);
                                                    if (val !== 'Practical') {
                                                        setExamCenterId('');
                                                    }
                                                }}
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            >
                                                <option value="Theory">Theory</option>
                                                <option value="Oral">Oral</option>
                                                <option value="Practical">Practical</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Exam Date</label>
                                            <input
                                                type="date"
                                                value={examDate}
                                                onChange={(e) => setExamDate(e.target.value)}
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    {examType === 'Practical' && (
                                        <div className="animate-in slide-in-from-top-2 duration-200">
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Primary Exam Center</label>
                                            <select
                                                value={examCenterId}
                                                onChange={(e) => setExamCenterId(e.target.value)}
                                                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                            >
                                                <option value="">-- Choose Center --</option>
                                                {centers.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name} (Capacity: {c.capacity})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full h-10 mt-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Schedule Exam
                                    </button>
                                </form>
                            </div>

                            {/* Pre-populated Centers Display */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-rose-500" />
                                    <span>Allocable Centers</span>
                                </h3>
                                <div className="space-y-3">
                                    {centers.map((center) => (
                                        <div key={center.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm">{center.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{center.id}</p>
                                            </div>
                                            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-right">
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Capacity</p>
                                                <p className="text-sm font-black text-slate-900">{center.capacity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: List & Allocation */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Exam Schedules list */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-indigo-500" />
                                    <span>Scheduled Exams</span>
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                <th className="pb-3 pr-2">ID</th>
                                                <th className="pb-3">Name</th>
                                                <th className="pb-3">Type</th>
                                                <th className="pb-3 text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {exams.map((ex) => (
                                                <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-3 pr-2 font-mono text-xs text-slate-400 font-bold">{ex.id}</td>
                                                    <td className="py-3 font-semibold text-slate-900">
                                                        <div>
                                                            <p>{ex.name}</p>
                                                            {ex.centerId && (
                                                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                                    <MapPin className="w-3 h-3 text-rose-400" />
                                                                    {centers.find(c => c.id === ex.centerId)?.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${ex.type === 'Theory' ? 'bg-slate-100 text-slate-700' : ex.type === 'Practical' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                            {ex.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right text-slate-500 pr-2">{ex.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Center Allocator Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">Center Allocation System</h3>
                                        <p className="text-slate-500 text-xs">Run algorithmic scheduling mapping subject priorities to venues.</p>
                                    </div>
                                    <button
                                        onClick={handleAllocation}
                                        className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 self-start sm:self-center"
                                    >
                                        <Clock className="w-4 h-4" />
                                        Allocate Students to Centers
                                    </button>
                                </div>

                                {allocations.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm font-semibold">No allocations calculated yet.</p>
                                        <p className="text-slate-400 text-xs mt-0.5">Click the allocation button above to distribute students.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Computed Allocations</h4>
                                            <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 font-bold">
                                                Active Session Output
                                            </span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                        <th className="pb-2.5">Student</th>
                                                        <th className="pb-2.5">Guru</th>
                                                        <th className="pb-2.5">Allocated Center</th>
                                                        <th className="pb-2.5">Time Slot</th>
                                                        <th className="pb-2.5 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm">
                                                    {allocations.map((alloc) => (
                                                        <tr key={alloc.studentId} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="py-3">
                                                                <div className="font-semibold text-slate-900">{alloc.studentName}</div>
                                                                <div className="text-[10px] text-slate-400 font-mono font-bold">{alloc.studentId}</div>
                                                            </td>
                                                            <td className="py-3 text-slate-600">{alloc.guruName}</td>
                                                            <td className="py-3">
                                                                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                    {alloc.centerName}
                                                                </span>
                                                            </td>
                                                            <td className="py-3">
                                                                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                    {alloc.timeSlot}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 text-right">
                                                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${alloc.status === 'Allocated' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                                    {alloc.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ----------------------------------------------------
                    TAB 3: RESULTS
                    ---------------------------------------------------- */}
                {activeTab === 'results' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            
                            {/* Score Entry Panel */}
                            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm self-start">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                                    <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Score Entry Form</h3>
                                        <p className="text-slate-500 text-xs">Record student scores and auto-evaluate performance status.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleResultSubmit} className="space-y-4">
                                    {resultError && (
                                        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{resultError}</span>
                                        </div>
                                    )}
                                    {resultSuccess && (
                                        <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <span>{resultSuccess}</span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Choose Exam</label>
                                        <select
                                            value={resultExamId}
                                            onChange={(e) => setResultExamId(e.target.value)}
                                            className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                        >
                                            <option value="">-- Select Exam --</option>
                                            {exams.map((ex) => (
                                                <option key={ex.id} value={ex.id}>
                                                    {ex.name} ({ex.id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Student</label>
                                        <select
                                            value={resultStudentId}
                                            onChange={(e) => setResultStudentId(e.target.value)}
                                            className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                        >
                                            <option value="">-- Select Student --</option>
                                            {students.map((st) => (
                                                <option key={st.id} value={st.id}>
                                                    {st.name} ({st.id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Obtained Score (0-100)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={resultScore}
                                            onChange={(e) => setResultScore(e.target.value)}
                                            placeholder="e.g. 75"
                                            className="w-full h-10 px-3.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-800"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-10 mt-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Record Score
                                    </button>
                                </form>
                            </div>

                            {/* Results list panel */}
                            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">Recorded Exam Results</h3>
                                        <p className="text-slate-500 text-xs">Verify scores and publish them to public catalogs.</p>
                                    </div>
                                    <div className="flex items-center gap-3 self-start sm:self-center">
                                        {isPublished && publishDate && (
                                            <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Published ✓ ({publishDate})
                                            </span>
                                        )}
                                        <button
                                            onClick={handlePublishResults}
                                            disabled={results.length === 0}
                                            className={`h-10 px-5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${results.length === 0 ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none' : 'bg-slate-950 hover:bg-slate-900 text-white'}`}
                                        >
                                            Publish Results to Website
                                        </button>
                                    </div>
                                </div>

                                {results.length === 0 ? (
                                    <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                        <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm font-semibold">No results recorded yet.</p>
                                        <p className="text-slate-400 text-xs mt-0.5">Use the score entry form to begin logging results.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    <th className="pb-2.5">Student</th>
                                                    <th className="pb-2.5">Guru</th>
                                                    <th className="pb-2.5">Exam Name</th>
                                                    <th className="pb-2.5 text-center">Score</th>
                                                    <th className="pb-2.5 text-center">Status</th>
                                                    <th className="pb-2.5 text-right">Published</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 text-sm">
                                                {results.map((res) => {
                                                    const student = students.find(s => s.id === res.studentId);
                                                    const guru = student ? gurus.find(g => g.id === student.guruId) : null;
                                                    const exam = exams.find(e => e.id === res.examId);
                                                    return (
                                                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="py-3">
                                                                <div className="font-semibold text-slate-900">{student?.name || 'Unknown Student'}</div>
                                                                <div className="text-[10px] text-slate-400 font-mono font-bold">{res.studentId}</div>
                                                            </td>
                                                            <td className="py-3 text-slate-600">{guru?.name || 'Unknown Guru'}</td>
                                                            <td className="py-3">
                                                                <div className="font-medium text-slate-700">{exam?.name || 'Unknown Exam'}</div>
                                                                <div className="text-[10px] text-slate-400 font-mono font-bold">{res.examId}</div>
                                                            </td>
                                                            <td className="py-3 text-center font-bold text-slate-800">{res.score}</td>
                                                            <td className="py-3 text-center">
                                                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${res.status === 'Pass' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                                    {res.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 text-right pr-2">
                                                                {res.published ? (
                                                                    <span className="text-green-600 font-bold flex items-center justify-end gap-1 text-xs">
                                                                        <Check className="w-4 h-4 stroke-[3]" />
                                                                        Yes
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-400 text-xs">Draft</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guru Performance Summary Dashboard Panel */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Guru Performance Summary</h3>
                                    <p className="text-slate-500 text-xs">Real-time aggregate KPIs showing success metrics and pass rates across instruction lines.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                {guruSummaries.map((summary) => (
                                    <div key={summary.name} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative overflow-hidden group hover:border-slate-300 hover:shadow-sm transition-all duration-300">
                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                                            <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{summary.name}</p>
                                            <span className="px-2 py-0.5 text-[10px] bg-white text-slate-500 border border-slate-200 rounded-full font-bold">
                                                {summary.totalStudents} Students
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passed</p>
                                                <p className="text-base font-black text-slate-950 mt-0.5">{summary.passCount}</p>
                                            </div>
                                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Score</p>
                                                <p className="text-base font-black text-slate-950 mt-0.5">{summary.avgScore}</p>
                                            </div>
                                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pass Rate</p>
                                                <p className="text-base font-black text-emerald-600 mt-0.5">{summary.passRate}%</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-[11px] text-slate-400 font-medium text-center">
                                            {summary.resultsEntered} results captured out of {summary.totalStudents} candidates
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
                
            </div>
        </Layout>
    );
};

export default GandosavaExamManagement;
