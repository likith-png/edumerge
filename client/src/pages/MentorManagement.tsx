import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, MessageSquare, Users, AlertTriangle, TrendingDown, CreditCard,
  XCircle, Search, Plus, ChevronRight, ArrowLeft, FileText, CheckCircle,
  Calendar, Activity, User, GraduationCap, Info, Lock, Send, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface Interaction {
  date: string;
  type: string;
  notes: string;
  faculty: string;
  yearTag?: string;
}

interface AcademicYearRecord {
  year: string;
  sgpaSem1: number;
  sgpaSem2: number;
  attendance: number;
  backlogs: number;
}

interface Mentee {
  id: string;
  name: string;
  year: string;
  risk: 'RED' | 'AMBER' | 'GREEN';
  attendance: number;
  marks: number;
  feeStatus: string;
  feeAmount: number;
  feeDaysOverdue?: number;
  lastMetDays: number;
  history: Interaction[];
  cgpa: number;
  backlogsCount: number;
  disciplinaryStatus: 'No Issues' | 'Warning Alert' | 'Disciplinary Probation';
  hostelStatus: string;
  studentPhone: string;
  parentPhone: string;
  parentEmail: string;
  academicHistory: AcademicYearRecord[];
}

export default function MentorManagement() {
  const navigate = useNavigate();

  // Persona State: 'mentor' | 'principal'
  const [persona, setPersona] = useState<'mentor' | 'principal'>('mentor');
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState<'problem' | 'mentees' | 'profile' | 'log' | 'chat' | 'naac'>('problem');

  // Mentees Data State
  const [mentees, setMentees] = useState<Mentee[]>([
    {
      id: 'arjun-mehta',
      name: 'Arjun Mehta',
      year: 'CSE Yr 2',
      risk: 'RED',
      attendance: 61,
      marks: 38,
      feeStatus: 'Overdue',
      feeAmount: 42000,
      feeDaysOverdue: 23,
      lastMetDays: 38,
      cgpa: 5.4,
      backlogsCount: 2,
      disciplinaryStatus: 'Warning Alert',
      hostelStatus: 'Hosteller (B Block, Room 304)',
      studentPhone: '+91 98860 12345',
      parentPhone: '+91 94480 67890',
      parentEmail: 'suresh.mehta@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.2, sgpaSem2: 4.8, attendance: 68, backlogs: 2 }
      ],
      history: [
        { date: '12 Sep 2024', type: 'General Welfare', notes: 'Discussed semester goals. Student seemed motivated to improve attendance.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 2' },
        { date: '28 Aug 2024', type: 'Progress Review', notes: 'Reviewed Year 1 performance. Advised on study habits for engineering mathematics.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 2' },
        { date: '14 May 2024', type: 'Disciplinary Counselling', notes: 'Addressed minor misconduct during Physics lab exam. Issued strict warning.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' },
        { date: '12 Mar 2024', type: 'Attendance Concern', notes: 'Notified parent of sudden drop in test scores and attendance (61%). Parent promised to monitor.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' },
        { date: '15 Jan 2024', type: 'Financial Welfare', notes: 'Student requested extension for Semester 2 fees due to family emergency. Recommended installment plan.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' },
        { date: '10 Oct 2023', type: 'General Welfare', notes: 'Completed Year 1 intake meeting. Student is adjusting to hostel life and resolving minor roommate issues.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'priya-iyer',
      name: 'Priya Iyer',
      year: 'CSE Yr 2',
      risk: 'RED',
      attendance: 58,
      marks: 41,
      feeStatus: 'Overdue',
      feeAmount: 35000,
      feeDaysOverdue: 45,
      lastMetDays: 52,
      cgpa: 5.8,
      backlogsCount: 1,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Day Scholar (Kalyan Nagar)',
      studentPhone: '+91 98860 23456',
      parentPhone: '+91 94480 78901',
      parentEmail: 'r.iyer@yahoo.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.8, sgpaSem2: 5.2, attendance: 71, backlogs: 1 }
      ],
      history: [
        { date: '05 Sep 2024', type: 'Attendance Alert', notes: 'Discussed continuous absenteeism. Priya cited transport issues from Kalyan Nagar.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 2' },
        { date: '22 Apr 2024', type: 'Progress Review', notes: 'Advised student to focus more on lab assignments and clear the backlog.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' },
        { date: '18 Nov 2023', type: 'General Welfare', notes: 'Student doing well. Energetic and participates in college tech club.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'rohan-das',
      name: 'Rohan Das',
      year: 'CSE Yr 1',
      risk: 'AMBER',
      attendance: 72,
      marks: 49,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 18,
      cgpa: 6.9,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Hosteller (C Block, Room 102)',
      studentPhone: '+91 98860 34567',
      parentPhone: '+91 94480 89012',
      parentEmail: 'k.das@gmail.com',
      academicHistory: [],
      history: [
        { date: '15 Oct 2024', type: 'General Welfare', notes: 'Welcome check-in. Rohan is adjusting well to the hostel, but struggles with math syllabus speed.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'sneha-kulkarni',
      name: 'Sneha Kulkarni',
      year: 'CSE Yr 2',
      risk: 'AMBER',
      attendance: 74,
      marks: 52,
      feeStatus: 'Overdue',
      feeAmount: 18000,
      feeDaysOverdue: 12,
      lastMetDays: 22,
      cgpa: 6.4,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Day Scholar (Malleshwaram)',
      studentPhone: '+91 98860 45678',
      parentPhone: '+91 94480 90123',
      parentEmail: 'kulkarni.s@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.5, sgpaSem2: 6.3, attendance: 76, backlogs: 0 }
      ],
      history: [
        { date: '04 Sep 2024', type: 'Progress Review', notes: 'Fee issue resolution discussed. Student will pay within next 10 days.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 2' },
        { date: '15 Feb 2024', type: 'General Welfare', notes: 'Adjusting well. Planning to join college volleyball team.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'kavita-rao',
      name: 'Kavita Rao',
      year: 'CSE Yr 1',
      risk: 'AMBER',
      attendance: 78,
      marks: 55,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 28,
      cgpa: 7.2,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Hosteller (A Block, Room 205)',
      studentPhone: '+91 98860 56789',
      parentPhone: '+91 94480 01234',
      parentEmail: 'shrinivas.rao@gmail.com',
      academicHistory: [],
      history: [
        { date: '08 Oct 2024', type: 'General Welfare', notes: 'First introductory check. No major academic concerns.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'aditya-sharma',
      name: 'Aditya Sharma',
      year: 'CSE Yr 2',
      risk: 'GREEN',
      attendance: 88,
      marks: 71,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 8,
      cgpa: 7.8,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Hosteller (B Block, Room 212)',
      studentPhone: '+91 98860 67890',
      parentPhone: '+91 94480 12345',
      parentEmail: 'sharma.aditya@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 7.5, sgpaSem2: 8.1, attendance: 85, backlogs: 0 }
      ],
      history: [
        { date: '14 Sep 2024', type: 'Placement Guidance', notes: 'Excellent trajectory. Suggested enrolling in advanced web dev coding camps.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 2' },
        { date: '10 Jan 2024', type: 'Progress Review', notes: 'Review of Semester 1 marks. Commended for scoring above 80% in programming core.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'meera-pillai',
      name: 'Meera Pillai',
      year: 'CSE Yr 1',
      risk: 'GREEN',
      attendance: 91,
      marks: 78,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 5,
      cgpa: 8.4,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Day Scholar (Indiranagar)',
      studentPhone: '+91 98860 78901',
      parentPhone: '+91 94480 23456',
      parentEmail: 'pillai.meera@gmail.com',
      academicHistory: [],
      history: [
        { date: '12 Oct 2024', type: 'General Welfare', notes: 'Orientation check. Highly responsive and proactive in classes.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'vikram-singh',
      name: 'Vikram Singh',
      year: 'CSE Yr 2',
      risk: 'GREEN',
      attendance: 85,
      marks: 68,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 11,
      cgpa: 7.1,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Hosteller (B Block, Room 118)',
      studentPhone: '+91 98860 89012',
      parentPhone: '+91 94480 34567',
      parentEmail: 'singh.vikram@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.9, sgpaSem2: 7.3, attendance: 82, backlogs: 0 }
      ],
      history: [
        { date: '11 Sep 2024', type: 'Progress Review', notes: 'Welfare check. Student requested info on honors project allocation rules.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 2' },
        { date: '05 Mar 2024', type: 'General Welfare', notes: 'Comfortable with Year 1 curriculum. Advised on balancing coding club tasks.', faculty: 'Prof. Ramesh Nair', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'rahul-verma',
      name: 'Rahul Verma',
      year: 'ECE Yr 2',
      risk: 'RED',
      attendance: 63,
      marks: 36,
      feeStatus: 'Overdue',
      feeAmount: 28000,
      feeDaysOverdue: 15,
      lastMetDays: 32,
      cgpa: 5.6,
      backlogsCount: 3,
      disciplinaryStatus: 'Warning Alert',
      hostelStatus: 'Hosteller (C Block, Room 208)',
      studentPhone: '+91 98860 90123',
      parentPhone: '+91 94480 45678',
      parentEmail: 'sanjay.verma@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.0, sgpaSem2: 5.2, attendance: 70, backlogs: 1 }
      ],
      history: [
        { date: '14 Sep 2024', type: 'Attendance Concern', notes: 'Student has high absenteeism in labs. Discussed strict warning.', faculty: 'Prof. Rajesh Kumar', yearTag: 'Year 2' }
      ]
    },
    {
      id: 'ananya-sen',
      name: 'Ananya Sen',
      year: 'ECE Yr 2',
      risk: 'AMBER',
      attendance: 73,
      marks: 52,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 14,
      cgpa: 6.8,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Day Scholar (Banashankari)',
      studentPhone: '+91 98860 91234',
      parentPhone: '+91 94480 56789',
      parentEmail: 'd.sen@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.9, sgpaSem2: 6.7, attendance: 78, backlogs: 0 }
      ],
      history: [
        { date: '10 Sep 2024', type: 'Progress Review', notes: 'Welfare check. Performance is stable, needs minor improvement in math.', faculty: 'Prof. Rajesh Kumar', yearTag: 'Year 2' }
      ]
    },
    {
      id: 'kabir-kapoor',
      name: 'Kabir Kapoor',
      year: 'ECE Yr 1',
      risk: 'GREEN',
      attendance: 86,
      marks: 74,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 8,
      cgpa: 8.0,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Hosteller (A Block, Room 104)',
      studentPhone: '+91 98860 92345',
      parentPhone: '+91 94480 67890',
      parentEmail: 'r.kapoor@gmail.com',
      academicHistory: [],
      history: [
        { date: '22 Oct 2024', type: 'General Welfare', notes: 'Excellent start in basic electronics lab. Adjusting well to hostel.', faculty: 'Prof. Meera Deshmukh', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'divya-nair',
      name: 'Divya Nair',
      year: 'ECE Yr 1',
      risk: 'GREEN',
      attendance: 89,
      marks: 70,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 6,
      cgpa: 7.6,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Day Scholar (Jayanagar)',
      studentPhone: '+91 98860 93456',
      parentPhone: '+91 94480 78901',
      parentEmail: 'radha.nair@gmail.com',
      academicHistory: [],
      history: [
        { date: '20 Oct 2024', type: 'General Welfare', notes: 'Introductory check completed. Standard freshman registration active.', faculty: 'Prof. Meera Deshmukh', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'sameer-shah',
      name: 'Sameer Shah',
      year: 'MBA Yr 2',
      risk: 'RED',
      attendance: 60,
      marks: 45,
      feeStatus: 'Overdue',
      feeAmount: 55000,
      feeDaysOverdue: 30,
      lastMetDays: 45,
      cgpa: 5.8,
      backlogsCount: 2,
      disciplinaryStatus: 'Disciplinary Probation',
      hostelStatus: 'Day Scholar (Hebbal)',
      studentPhone: '+91 98860 94567',
      parentPhone: '+91 94480 89012',
      parentEmail: 'kirit.shah@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.4, sgpaSem2: 5.8, attendance: 65, backlogs: 1 }
      ],
      history: [
        { date: '18 Sep 2024', type: 'Attendance Concern', notes: 'Discussed severe attendance shortage and disciplinary action for lab absence.', faculty: 'Dr. Vikram Seth', yearTag: 'Year 2' }
      ]
    },
    {
      id: 'neha-gupta',
      name: 'Neha Gupta',
      year: 'MBA Yr 1',
      risk: 'AMBER',
      attendance: 71,
      marks: 55,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 20,
      cgpa: 6.2,
      backlogsCount: 1,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Hosteller (A Block, Room 410)',
      studentPhone: '+91 98860 95678',
      parentPhone: '+91 94480 90123',
      parentEmail: 'vijay.gupta@gmail.com',
      academicHistory: [],
      history: [
        { date: '11 Oct 2024', type: 'General Welfare', notes: 'First semester adjustment. Experiencing minor difficulty in accounting syllabus.', faculty: 'Prof. Ritu Anand', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'yash-vardhan',
      name: 'Yash Vardhan',
      year: 'MBA Yr 2',
      risk: 'GREEN',
      attendance: 90,
      marks: 82,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 4,
      cgpa: 8.5,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Hosteller (B Block, Room 415)',
      studentPhone: '+91 98860 96789',
      parentPhone: '+91 94480 01234',
      parentEmail: 'harish.vardhan@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 8.2, sgpaSem2: 8.6, attendance: 92, backlogs: 0 }
      ],
      history: [
        { date: '16 Sep 2024', type: 'Placement Guidance', notes: 'Student is preparing for investment banking campus interviews.', faculty: 'Dr. Vikram Seth', yearTag: 'Year 2' }
      ]
    },
    {
      id: 'amit-patel',
      name: 'Amit Patel',
      year: 'Civil Yr 2',
      risk: 'AMBER',
      attendance: 74,
      marks: 48,
      feeStatus: 'Overdue',
      feeAmount: 12000,
      feeDaysOverdue: 10,
      lastMetDays: 25,
      cgpa: 6.1,
      backlogsCount: 1,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Day Scholar (Kengeri)',
      studentPhone: '+91 98860 97890',
      parentPhone: '+91 94480 12345',
      parentEmail: 'mahesh.patel@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 6.3, sgpaSem2: 6.0, attendance: 75, backlogs: 1 }
      ],
      history: [
        { date: '12 Sep 2024', type: 'Progress Review', notes: 'Discussed clearing engineering mechanics backlog in coming exam.', faculty: 'Prof. Suresh Hegde', yearTag: 'Year 2' }
      ]
    },
    {
      id: 'pooja-sharma',
      name: 'Pooja Sharma',
      year: 'Civil Yr 1',
      risk: 'GREEN',
      attendance: 88,
      marks: 65,
      feeStatus: 'Current',
      feeAmount: 0,
      lastMetDays: 12,
      cgpa: 7.4,
      backlogsCount: 0,
      disciplinaryStatus: 'No Issues',
      hostelStatus: 'Day Scholar (Whitefield)',
      studentPhone: '+91 98860 98901',
      parentPhone: '+91 94480 23456',
      parentEmail: 'rakesh.sharma@gmail.com',
      academicHistory: [],
      history: [
        { date: '19 Oct 2024', type: 'General Welfare', notes: 'Good academic engagement. Highly active in surveying practicals.', faculty: 'Prof. Anil Joshi', yearTag: 'Year 1' }
      ]
    },
    {
      id: 'kiran-kumar',
      name: 'Kiran Kumar',
      year: 'Civil Yr 2',
      risk: 'RED',
      attendance: 54,
      marks: 32,
      feeStatus: 'Overdue',
      feeAmount: 32000,
      feeDaysOverdue: 40,
      lastMetDays: 40,
      cgpa: 4.8,
      backlogsCount: 4,
      disciplinaryStatus: 'Warning Alert',
      hostelStatus: 'Hosteller (C Block, Room 309)',
      studentPhone: '+91 98860 99012',
      parentPhone: '+91 94480 34567',
      parentEmail: 'suresh.kumar@gmail.com',
      academicHistory: [
        { year: 'Year 1', sgpaSem1: 5.2, sgpaSem2: 4.6, attendance: 58, backlogs: 3 }
      ],
      history: [
        { date: '05 Sep 2024', type: 'Attendance Concern', notes: 'Severe backlog and attendance issues. Parents notified by mail.', faculty: 'Prof. Suresh Hegde', yearTag: 'Year 2' }
      ]
    }
  ]);

  // Selected Student for Student 360 profile
  const [selectedStudentId, setSelectedStudentId] = useState<string>('arjun-mehta');
  
  // Principal report tab selection: 'naac' | 'departments' | 'courses' | 'roster'
  const [principalReportTab, setPrincipalReportTab] = useState<'naac' | 'departments' | 'courses' | 'roster'>('naac');

  // Selected Department for department reports
  const [selectedDept, setSelectedDept] = useState<string>('CSE');

  // Selected Class for course/class reports
  const [selectedClass, setSelectedClass] = useState<string>('CSE Yr 2');
  
  // Selected Student ID for pre-filling Log Form
  const [prefilledStudentId, setPrefilledStudentId] = useState<string>('arjun-mehta');

  // Search query state for Screen 2
  const [searchQuery, setSearchQuery] = useState('');

  // Log Form State
  const [formStudentId, setFormStudentId] = useState('arjun-mehta');
  const [formMeetingType, setFormMeetingType] = useState('Academic Counselling');
  const [formNotes, setFormNotes] = useState('');
  const [formFollowUpDate, setFormFollowUpDate] = useState('');

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'success' | 'info' }>({
    message: '',
    visible: false,
    type: 'success'
  });

  // NAAC Report generation state
  const [isGeneratingNaac, setIsGeneratingNaac] = useState(false);
  const [naacProgress, setNaacProgress] = useState(0);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Prof. Ramesh', time: '2h ago', text: 'Attendance submission deadline is Friday. Please ensure 75% compliance.', isAdmin: true },
    { sender: 'Arjun Mehta', time: '1h ago', text: 'Sir, I had a medical issue last week. Can I submit leave application?', isAdmin: false },
    { sender: 'Prof. Ramesh', time: '45m ago', text: 'Yes, submit through the portal and share the receipt with me.', isAdmin: true }
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  // dynamic total interactions calculation
  const extraInteractionsCount = useMemo(() => {
    // calculate number of interactions logged during this session
    let count = 0;
    mentees.forEach(m => {
      // count any history item beyond the initial ones
      const initialCount = m.id === 'arjun-mehta' ? 2 : 0;
      count += Math.max(0, m.history.length - initialCount);
    });
    return count;
  }, [mentees]);

  // Dynamic values for NAAC Criterion 5
  const dynamicTotalInteractions = 847 + extraInteractionsCount;
  const dynamicStudentsCovered = 412 + (extraInteractionsCount > 0 ? 1 : 0); // simplifed logic: if we logged, we cover at least 1 more if they weren't covered

  // Trigger Toast Notification Helper
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4500);
  };

  // Switch persona logic and ensure tab access is checked
  const handlePersonaChange = (newPersona: 'mentor' | 'principal') => {
    setPersona(newPersona);
    showToast(`Switched view to ${newPersona === 'mentor' ? 'Prof. Ramesh (Mentor)' : 'Dr. Anita Bose (Principal)'}`, 'info');
    
    // Automatically switch tabs if current tab is restricted
    if (newPersona === 'principal' && activeTab !== 'problem' && activeTab !== 'naac' && activeTab !== 'profile') {
      setActiveTab('naac');
    } else if (newPersona === 'mentor' && activeTab === 'naac') {
      setActiveTab('mentees');
    }
  };

  // Submit Log Interaction
  const handleSaveInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStudent = mentees.find(m => m.id === formStudentId);
    if (!selectedStudent) return;

    // Derive yearTag from student's year string e.g. "CSE Yr 2" -> "Year 2"
    const yearMatch = selectedStudent.year.match(/(\d+)$/);
    const yearTag = yearMatch ? `Year ${yearMatch[1]}` : 'Year 1';

    // Add to history
    const newLog: Interaction = {
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: formMeetingType,
      notes: formNotes || 'No notes added.',
      faculty: 'Prof. Ramesh Nair',
      yearTag
    };

    setMentees(prev => prev.map(m => {
      if (m.id === formStudentId) {
        return {
          ...m,
          lastMetDays: 0,
          history: [newLog, ...m.history]
        };
      }
      return m;
    }));

    showToast('Interaction logged. NAAC record created.', 'success');

    // Reset Form
    setFormNotes('');
    setFormFollowUpDate('');

    // Set selected student for profile so they can review their history
    setSelectedStudentId(formStudentId);
    
    // Redirect to Student Profile
    setActiveTab('profile');
  };

  // Submit Chat Message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const newMsg = {
      sender: 'Prof. Ramesh',
      time: 'just now',
      text: newChatMessage.trim(),
      isAdmin: true
    };

    setChatMessages(prev => [...prev, newMsg]);
    setNewChatMessage('');
  };

  // Start NAAC report generation
  const handleGenerateNaacReport = () => {
    setIsGeneratingNaac(true);
    setNaacProgress(0);
    
    const interval = setInterval(() => {
      setNaacProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGeneratingNaac(false);
          showToast(`NAAC Criterion 5 Evidence Report ready — ${dynamicTotalInteractions} interactions across ${dynamicStudentsCovered} students.`, 'success');
          return 100;
        }
        return p + 10;
      });
    }, 200);
  };

  // Filter mentees
  const filteredMentees = useMemo(() => {
    // Sort Red first, then Amber, then Green
    const riskPriority = { RED: 1, AMBER: 2, GREEN: 3 };
    const sorted = [...mentees].sort((a, b) => riskPriority[a.risk] - riskPriority[b.risk]);
    
    if (!searchQuery) return sorted;
    return sorted.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.year.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mentees, searchQuery]);

  // Selected Student Object
  const selectedStudentObj = useMemo(() => {
    return mentees.find(m => m.id === selectedStudentId) || mentees[0];
  }, [mentees, selectedStudentId]);

  // Check if a tab is locked for the current persona
  const isTabLocked = (tabName: 'problem' | 'mentees' | 'profile' | 'log' | 'chat' | 'naac') => {
    if (tabName === 'problem') return false;
    if (persona === 'mentor') {
      return tabName === 'naac';
    } else {
      return tabName !== 'naac' && tabName !== 'profile';
    }
  };

  // AI Trend & Prediction Helper
  const getStudentTrendAndPrediction = (student: Mentee) => {
    if (student.risk === 'RED') {
      return {
        probability: '88% Fail Risk',
        probabilityDesc: 'High risk of semester failure due to unmet compliance thresholds.',
        color: '#D94F4F',
        factors: [
          `Attendance is at ${student.attendance}% (14% below mandatory 75% threshold)`,
          `Internal marks average is ${student.marks}% (2% below minimum qualifying 40%)`,
          student.feeStatus === 'Overdue' ? `Fees overdue by ₹${student.feeAmount.toLocaleString('en-IN')}` : 'Fee clearance pending'
        ],
        attendanceTrend: [78, 71, 65, student.attendance],
        marksTrend: [52, 45, 41, student.marks],
        recommendations: [
          'Schedule urgent face-to-face parent counseling regarding attendance.',
          'Enroll in remedial coaching program for Physics and Mathematics.',
          'Facilitate scholarship application or installment payment structure.'
        ]
      };
    } else if (student.risk === 'AMBER') {
      return {
        probability: '35% Backlog Risk',
        probabilityDesc: 'Borderline academic status; susceptible to course backlogs.',
        color: '#F5A623',
        factors: [
          `Attendance is at ${student.attendance}% (borderline 75% limit)`,
          `Internal marks average is ${student.marks}% (marginal pass)`,
          student.feeStatus === 'Overdue' ? `Overdue fees of ₹${student.feeAmount.toLocaleString('en-IN')}` : 'Fee accounts current and cleared'
        ],
        attendanceTrend: [82, 79, 75, student.attendance],
        marksTrend: [58, 55, 50, student.marks],
        recommendations: [
          'Issue automated SMS warning alert for attendance compliance.',
          'Recommend peer mentoring study group for weekly review.',
          'Schedule check-in meeting in 14 days to monitor progress.'
        ]
      };
    } else {
      return {
        probability: '96% Pass Probability',
        probabilityDesc: 'Excellent academic standing; predicted high-honors candidate.',
        color: '#27AE60',
        factors: [
          `Consistent class attendance at ${student.attendance}%`,
          `Excellent internal marks average of ${student.marks}%`,
          'Financial accounts fully cleared'
        ],
        attendanceTrend: [84, 85, 87, student.attendance],
        marksTrend: [64, 66, 69, student.marks],
        recommendations: [
          'Recommend for campus recruitment mock interview premium cohort.',
          'Suggest nomination as Student Representative or Peer Mentor.',
          'Check eligibility for advanced engineering honors projects.'
        ]
      };
    }
  };

  // Helper for Circular Progress Component
  const CircularProgress = ({ value, max = 100, size = 76, strokeWidth = 7, color = '#D94F4F' }: { value: number; max?: number; size?: number; strokeWidth?: number; color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / max) * circumference;
    
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E0D8"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <span className="absolute text-sm font-extrabold text-[#2C2B29]">{value}%</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-slate-800 flex flex-col font-dm-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        .font-dm-sans {
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* Toast Banner */}
      {toast.visible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className={`px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 border ${
            toast.type === 'success' 
              ? 'bg-[#EBF7EE] text-[#27AE60] border-[#A8E2BC]' 
              : 'bg-[#E6F0FA] text-[#000099] border-[#B3CCE6]'
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E2E0D8] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E0D8] hover:bg-slate-50 transition text-xs font-semibold text-slate-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-[#000099]">edumerge</span>
            <span className="h-4 w-px bg-[#E2E0D8]" />
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Mentor Management</span>
          </div>
        </div>

        {/* Persona Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase">Demo Persona:</span>
          <div className="flex bg-[#F8F8F6] p-1 rounded-lg border border-[#E2E0D8]">
            <button
              onClick={() => handlePersonaChange('mentor')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                persona === 'mentor'
                  ? 'bg-[#000099] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mentor (Prof. Ramesh)</span>
            </button>
            <button
              onClick={() => handlePersonaChange('principal')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                persona === 'principal'
                  ? 'bg-[#000099] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Principal (Dr. Anita)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-[#E2E0D8] px-6 py-2 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'problem', label: 'Dashboard' },
            { id: 'mentees', label: 'My Mentees' },
            { id: 'profile', label: 'Student Profile' },
            { id: 'log', label: 'Log Interaction' },
            { id: 'chat', label: 'Chat Portal' },
            { id: 'naac', label: 'NAAC Report' }
          ].map(tab => {
            const locked = isTabLocked(tab.id as any);
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (locked) {
                    showToast(`Switch demo persona to view the ${tab.label} screen.`, 'info');
                  } else {
                    setActiveTab(tab.id as any);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  active 
                    ? 'bg-[#000099]/10 text-[#000099] border-b-2 border-[#000099]' 
                    : 'text-slate-500 hover:bg-slate-50'
                } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {locked && <Lock className="w-3 h-3 text-slate-400" />}
                <span>{tab.label}</span>
                {tab.id === 'mentees' && persona === 'mentor' && (
                  <span className="bg-[#D94F4F] text-white text-[9px] px-1.5 py-0.5 rounded-full">2 Red</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        
        {/* SCREEN 1 — THE PROBLEM */}
        {activeTab === 'problem' && (
          <div className="space-y-6 py-4">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E0D8] pb-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Executive Mentoring Dashboard</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  UGC & NAAC Compliance Monitoring Core
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPersona('mentor');
                    setActiveTab('mentees');
                  }}
                  className="px-4 py-2 bg-[#000099] text-white text-xs font-black uppercase tracking-wider rounded-[10px] hover:bg-[#000099]/90 shadow-sm transition"
                >
                  Faculty Mentor Console
                </button>
                <button
                  onClick={() => {
                    setPersona('principal');
                    setActiveTab('naac');
                  }}
                  className="px-4 py-2 bg-[#FF9A01] text-white text-xs font-black uppercase tracking-wider rounded-[10px] hover:bg-[#FF9A01]/90 shadow-sm transition"
                >
                  Principal NAAC Reports
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Mentees</h3>
                <p className="text-3xl font-black text-[#000099]">520</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enrolled in Active Cohorts</p>
              </div>

              <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">At-Risk Mentees</h3>
                <p className="text-3xl font-black text-[#D94F4F]">44</p>
                <p className="text-[10px] text-[#D94F4F] font-bold uppercase tracking-wider">22 RED Risk · 22 AMBER Risk</p>
              </div>

              <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mentorship Coverage</h3>
                <p className="text-3xl font-black text-slate-900">
                  {((dynamicStudentsCovered / 520) * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">
                  {dynamicStudentsCovered} / 520 Students Met
                </p>
              </div>

              <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance Audit Grade</h3>
                <p className="text-3xl font-black text-[#27AE60]">96.5%</p>
                <p className="text-[10px] text-[#27AE60] font-bold uppercase tracking-wider">UGC / NAAC Audit Ready</p>
              </div>
            </div>

            {/* AI Predictions & Trend Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: AI Predictive Risk Insights */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2 border-b border-[#E2E0D8] pb-3">
                  <Sparkles className="w-4 h-4 text-[#000099]" />
                  AI Predictive Analytics & Alerts
                </h3>

                <div className="space-y-4">
                  {/* Alert 1 */}
                  <div className="p-4 bg-red-50/50 border border-red-200/40 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-[#D94F4F] uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Semester Drop-out Risk Detected
                      </span>
                      <span className="text-[10px] font-black uppercase bg-[#D94F4F] text-white px-2 py-0.5 rounded-[5px]">
                        15% Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      AI modeling projects 8 CSE sophomore students are at risk of de-registration next week due to compounding attendance drops (below 65%) and fee defaults.
                    </p>
                    <div className="text-[10px] font-bold text-[#000099] uppercase tracking-wider flex items-center gap-1">
                      <span>Intervention:</span>
                      <span>Dispatch automated parental meeting invites to HOD CSE.</span>
                    </div>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200/40 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-[#F5A623] uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        NAAC Criterion 5 Log Gap
                      </span>
                      <span className="text-[10px] font-black uppercase bg-[#F5A623] text-white px-2 py-0.5 rounded-[5px]">
                        Medium Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Civil Engineering department has logged interactions for only 70% of enrolled students. Missing document evidence for 20 mentees poses audit friction.
                    </p>
                    <div className="text-[10px] font-bold text-[#000099] uppercase tracking-wider flex items-center gap-1">
                      <span>Intervention:</span>
                      <span>Trigger warning notification to civil engineering mentors.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Historical Logs Trend */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2 border-b border-[#E2E0D8] pb-3">
                  <Activity className="w-4 h-4 text-[#FF9A01]" />
                  Historical Mentoring Log Trends
                </h3>

                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium">
                    Semester-wise interaction logs submitted by faculty mentors over the last 4 cycles.
                  </p>
                  
                  <div className="h-44 bg-[#F8F8F6] border border-[#E2E0D8] rounded-[10px] p-4 flex flex-col justify-between">
                    <div className="flex items-end justify-around h-28 px-2">
                      {[
                        { sem: 'Odd \'24', logs: 420 },
                        { sem: 'Even \'25', logs: 580 },
                        { sem: 'Odd \'25', logs: 640 },
                        { sem: 'Odd \'26 (Current)', logs: 847 + extraInteractionsCount, highlight: true }
                      ].map((item, idx) => {
                        const maxVal = 950;
                        const pctHeight = (item.logs / maxVal) * 100;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5 w-1/4 group relative">
                            <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {item.logs} Logs
                            </div>
                            <div 
                              className="w-8 rounded-t-[3px] transition-all hover:brightness-95" 
                              style={{ 
                                height: `${pctHeight}px`, 
                                backgroundColor: item.highlight ? '#000099' : '#E2E0D8'
                              }} 
                            />
                            <span className={`text-[9px] font-extrabold text-center ${item.highlight ? 'text-[#000099]' : 'text-slate-400'}`}>
                              {item.sem}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-center text-[9px] text-slate-500 font-bold uppercase border-t border-[#E2E0D8] pt-2">
                      AI Analysis: documented compliance evidence has grown by +101.6% since 2024
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SCREEN 2 — MENTOR VIEW */}
        {activeTab === 'mentees' && (
          <div className="space-y-6">
            {/* Warning State if Principal view */}
            {persona === 'principal' ? (
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center max-w-xl mx-auto space-y-4">
                <Lock className="w-10 h-10 text-[#D94F4F] mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Access Restricted</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  The Mentee Roster screen is reserved for Faculty Mentors. You are currently logged in as the Principal (Dr. Anita Bose).
                </p>
                <button 
                  onClick={() => handlePersonaChange('mentor')} 
                  className="px-4 py-2 bg-[#000099] text-white text-xs font-black uppercase tracking-wider rounded-[10px]"
                >
                  Switch to Mentor (Prof. Ramesh)
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E0D8] pb-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">My Mentees</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Faculty Advisor: Prof. Ramesh Nair (Physics) · CSE Year 2 Coordinator
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search mentees by name or batch..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full text-xs font-medium border border-[#E2E0D8] bg-white rounded-[10px] focus:outline-none focus:border-[#000099] transition"
                    />
                  </div>
                </div>

                {/* Mentee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMentees.map((mentee) => {
                    const badgeColor = 
                      mentee.risk === 'RED' ? '#D94F4F' : 
                      mentee.risk === 'AMBER' ? '#F5A623' : '#27AE60';
                    const badgeBg = 
                      mentee.risk === 'RED' ? '#FCEBEB' : 
                      mentee.risk === 'AMBER' ? '#FFF6E6' : '#EBF7EE';
                    
                    return (
                      <div
                        key={mentee.id}
                        className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                      >
                        {/* Card Header clickable to open profile */}
                        <div 
                          onClick={() => {
                            setSelectedStudentId(mentee.id);
                            setActiveTab('profile');
                          }}
                          className="p-5 space-y-4 cursor-pointer flex-1"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#000099] transition-colors">{mentee.name}</h3>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{mentee.year}</p>
                            </div>
                            <span 
                              className="px-2 py-0.5 rounded-[5px] text-[9px] font-black uppercase tracking-wider"
                              style={{ backgroundColor: badgeBg, color: badgeColor }}
                            >
                              {mentee.risk} Risk
                            </span>
                          </div>

                          {/* 4 Signals inline grid */}
                          <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium text-slate-500">Attd:</span>
                              <span className={`font-bold ${mentee.attendance < 75 ? 'text-[#D94F4F]' : 'text-slate-800'}`}>
                                {mentee.attendance}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium text-slate-500">Marks:</span>
                              <span className={`font-bold ${mentee.marks < 40 ? 'text-[#D94F4F]' : 'text-slate-800'}`}>
                                {mentee.marks}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium text-slate-500">Fees:</span>
                              <span className={`font-bold ${mentee.feeStatus === 'Overdue' ? 'text-[#D94F4F]' : 'text-[#27AE60]'}`}>
                                {mentee.feeStatus === 'Overdue' ? `Due ${mentee.feeDaysOverdue}d` : 'Current'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium text-slate-500">Last met:</span>
                              <span className={`font-bold ${mentee.lastMetDays > 30 ? 'text-[#D94F4F]' : 'text-slate-800'}`}>
                                {mentee.lastMetDays}d ago
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="bg-[#F8F8F6] border-t border-[#E2E0D8] px-5 py-3.5 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedStudentId(mentee.id);
                              setActiveTab('profile');
                            }}
                            className="text-[#000099] text-xs font-black uppercase tracking-wider hover:underline flex items-center gap-1"
                          >
                            <span>Profile 360</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => {
                              setFormStudentId(mentee.id);
                              setActiveTab('log');
                            }}
                            className="px-2.5 py-1.5 bg-[#000099] text-white rounded-[6px] text-[10px] font-black uppercase tracking-wider hover:bg-[#000099]/90 shadow-sm flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Log Interaction</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* SCREEN 3 — STUDENT 360 PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {persona === 'principal' && (
              <div className="bg-[#E6F0FA] border border-[#B3CCE6] rounded-[10px] p-4 flex items-center justify-between gap-4 max-w-4xl mx-auto shadow-sm">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-[#000099]" />
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Executive Read-Only View</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Logged in as Principal (Dr. Anita Bose)</p>
                  </div>
                </div>
                <button
                  id="btn-return-reports"
                  onClick={() => setActiveTab('naac')}
                  className="px-3.5 py-1.5 bg-[#000099] text-white text-[10px] font-black uppercase tracking-wider rounded-[6px] hover:bg-[#000099]/90 transition"
                >
                  Return to Reports
                </button>
              </div>
            )}
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Back Link */}
                <div>
                  <button 
                    onClick={() => setActiveTab('mentees')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Mentee Roster</span>
                  </button>
                </div>

                {/* Profile Header */}
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#000099]/10 text-[#000099] flex items-center justify-center font-black text-lg">
                      {selectedStudentObj.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">{selectedStudentObj.name}</h1>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        {selectedStudentObj.year} · Batch 2024 · CSE Division B
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Risk Status:</span>
                    <span 
                      className={`px-3 py-1 rounded-[5px] text-xs font-black uppercase tracking-wider ${
                        selectedStudentObj.risk === 'RED' ? 'bg-[#FCEBEB] text-[#D94F4F]' :
                        selectedStudentObj.risk === 'AMBER' ? 'bg-[#FFF6E6] text-[#F5A623]' : 'bg-[#EBF7EE] text-[#27AE60]'
                      }`}
                    >
                      {selectedStudentObj.risk} RISK
                    </span>
                  </div>
                </div>

                {/* Contact & Details Bar */}
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4">Contact & Personal Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Mobile</p>
                      <p className="text-xs font-extrabold text-slate-800">{selectedStudentObj.studentPhone}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Parent Mobile</p>
                      <p className="text-xs font-extrabold text-slate-800">{selectedStudentObj.parentPhone}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Parent Email</p>
                      <p className="text-xs font-extrabold text-slate-800 truncate">{selectedStudentObj.parentEmail}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Accommodation</p>
                      <p className="text-xs font-extrabold text-slate-800">{selectedStudentObj.hostelStatus}</p>
                    </div>
                  </div>
                </div>

                {/* 3x2 Grid of Signals */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  
                  {/* Attendance Card */}
                  <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</h3>
                      <p className="text-2xl font-black text-slate-950">{selectedStudentObj.attendance}%</p>
                      <p className="text-[11px] text-slate-500 font-medium">Threshold: <span className="font-bold text-slate-700">75%</span></p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-[5px] ${
                        selectedStudentObj.attendance < 75 ? 'bg-red-50 text-[#D94F4F]' : 'bg-green-50 text-[#27AE60]'
                      }`}>
                        {selectedStudentObj.attendance < 75 ? 'Critical Shortage' : 'Compliant'}
                      </span>
                    </div>
                    <CircularProgress 
                      value={selectedStudentObj.attendance} 
                      color={selectedStudentObj.attendance < 70 ? '#D94F4F' : selectedStudentObj.attendance < 80 ? '#F5A623' : '#27AE60'} 
                    />
                  </div>

                  {/* Marks Card */}
                  <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internal Marks Avg</h3>
                      <p className="text-2xl font-black text-slate-950">{selectedStudentObj.marks}%</p>
                      <p className="text-[11px] text-slate-500 font-medium">Pass Mark: <span className="font-bold text-slate-700">40%</span></p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-[5px] ${
                        selectedStudentObj.marks < 40 ? 'bg-red-50 text-[#D94F4F]' : 'bg-green-50 text-[#27AE60]'
                      }`}>
                        {selectedStudentObj.marks < 40 ? 'Below Threshold' : 'Good Standing'}
                      </span>
                    </div>
                    <CircularProgress 
                      value={selectedStudentObj.marks} 
                      color={selectedStudentObj.marks < 40 ? '#D94F4F' : selectedStudentObj.marks < 60 ? '#F5A623' : '#27AE60'} 
                    />
                  </div>

                  {/* Academic Standing Card */}
                  <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm flex flex-col justify-between gap-3">
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Academic Standing</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Current CGPA</p>
                          <p className="text-2xl font-black" style={{ color: selectedStudentObj.cgpa >= 7.5 ? '#27AE60' : selectedStudentObj.cgpa >= 6.0 ? '#F5A623' : '#D94F4F' }}>
                            {selectedStudentObj.cgpa.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Active Backlogs</p>
                          <p className="text-2xl font-black" style={{ color: selectedStudentObj.backlogsCount > 0 ? '#D94F4F' : '#27AE60' }}>
                            {selectedStudentObj.backlogsCount}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-[5px] self-start ${
                      selectedStudentObj.cgpa >= 7.5 ? 'bg-green-50 text-[#27AE60]' :
                      selectedStudentObj.cgpa >= 6.0 ? 'bg-amber-50 text-[#F5A623]' : 'bg-red-50 text-[#D94F4F]'
                    }`}>
                      {selectedStudentObj.cgpa >= 7.5 ? 'Honours Track' : selectedStudentObj.cgpa >= 6.0 ? 'Satisfactory' : 'Academic Risk'}
                    </span>
                  </div>

                  {/* Fee Status Card */}
                  <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Account</h3>
                        <p className="text-base font-black text-slate-900">
                          {selectedStudentObj.feeStatus === 'Overdue' ? `₹${selectedStudentObj.feeAmount.toLocaleString('en-IN')} Overdue` : 'Fees Cleared'}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-black uppercase tracking-wider ${
                        selectedStudentObj.feeStatus === 'Overdue' ? 'bg-red-50 text-[#D94F4F]' : 'bg-green-50 text-[#27AE60]'
                      }`}>
                        {selectedStudentObj.feeStatus}
                      </span>
                    </div>
                    {selectedStudentObj.feeStatus === 'Overdue' ? (
                      <div className="bg-red-50/50 rounded-lg p-2.5 border border-red-100 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#D94F4F] flex-shrink-0" />
                        <div className="text-[11px]">
                          <p className="font-extrabold text-[#D94F4F]">Overdue by {selectedStudentObj.feeDaysOverdue} days</p>
                          <p className="text-slate-500 font-medium">Exam registration hold active.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50/50 rounded-lg p-2.5 border border-green-100 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#27AE60] flex-shrink-0" />
                        <div className="text-[11px]">
                          <p className="font-extrabold text-[#27AE60]">Payment Up to Date</p>
                          <p className="text-slate-500 font-medium">No holds active. Fully cleared.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mentor Engagement Card */}
                  <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mentor Engagement</h3>
                        <p className="text-base font-black text-slate-900">{selectedStudentObj.lastMetDays} days since last meeting</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-black uppercase tracking-wider ${
                        selectedStudentObj.lastMetDays > 30 ? 'bg-red-50 text-[#D94F4F]' : 
                        selectedStudentObj.lastMetDays > 15 ? 'bg-amber-50 text-[#F5A623]' : 'bg-green-50 text-[#27AE60]'
                      }`}>
                        {selectedStudentObj.lastMetDays > 30 ? 'Needs Attention' : 'Active'}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#000099] flex-shrink-0" />
                      <div className="text-[11px]">
                        <p className="font-extrabold text-slate-700">Criterion 5 Goal: Meet &lt; 30 days</p>
                        <p className="text-slate-500 font-medium">Log session to record NAAC evidence.</p>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Standing Card */}
                  <div className={`rounded-[10px] p-5 shadow-sm border flex flex-col justify-between gap-3 ${
                    selectedStudentObj.disciplinaryStatus === 'Disciplinary Probation' ? 'bg-red-50/40 border-red-200' :
                    selectedStudentObj.disciplinaryStatus === 'Warning Alert' ? 'bg-amber-50/40 border-amber-200' :
                    'bg-white border-[#E2E0D8]'
                  }`}>
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Institutional Standing</h3>
                      <p className={`text-base font-black ${
                        selectedStudentObj.disciplinaryStatus === 'Disciplinary Probation' ? 'text-[#D94F4F]' :
                        selectedStudentObj.disciplinaryStatus === 'Warning Alert' ? 'text-[#F5A623]' : 'text-[#27AE60]'
                      }`}>{selectedStudentObj.disciplinaryStatus}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-[5px] self-start ${
                      selectedStudentObj.disciplinaryStatus === 'Disciplinary Probation' ? 'bg-red-100 text-[#D94F4F]' :
                      selectedStudentObj.disciplinaryStatus === 'Warning Alert' ? 'bg-amber-100 text-[#F5A623]' :
                      'bg-green-50 text-[#27AE60]'
                    }`}>
                      {selectedStudentObj.disciplinaryStatus === 'No Issues' ? 'Clean Record' : 'Action Required'}
                    </span>
                  </div>

                </div>

                {/* Academic Progression Roadmap (Year 1 to Year 4) */}
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#000099]" />
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Academic Progression — Year 1 to Year 4</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">4-Year Engineering Programme</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(yr => {
                      const yearStr = `Year ${yr}`;
                      const studentYrMatch = selectedStudentObj.year.match(/(\d+)$/);
                      const currentYr = studentYrMatch ? parseInt(studentYrMatch[1]) : 1;
                      const record = selectedStudentObj.academicHistory.find(r => r.year === yearStr);
                      const isPast = yr < currentYr;
                      const isCurrent = yr === currentYr;
                      const isFuture = yr > currentYr;

                      return (
                        <div
                          key={yr}
                          className={`rounded-[10px] p-4 border space-y-3 ${
                            isCurrent
                              ? 'border-[#000099]/40 bg-[#000099]/5'
                              : isPast
                              ? 'border-[#E2E0D8] bg-[#F8F8F6]'
                              : 'border-dashed border-[#E2E0D8] bg-slate-50/40 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-700">Year {yr}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-[#000099] text-white px-1.5 py-0.5 rounded-full animate-pulse">In Progress</span>
                            )}
                            {isPast && (
                              <CheckCircle className="w-3.5 h-3.5 text-[#27AE60]" />
                            )}
                            {isFuture && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Planned</span>
                            )}
                          </div>
                          {(isPast || isCurrent) && record ? (
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-500 font-bold">Sem 1 SGPA</span>
                                <span className={`font-black ${ record.sgpaSem1 >= 7 ? 'text-[#27AE60]' : record.sgpaSem1 >= 5.5 ? 'text-[#F5A623]' : 'text-[#D94F4F]'}`}>{record.sgpaSem1}</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-500 font-bold">Sem 2 SGPA</span>
                                <span className={`font-black ${ record.sgpaSem2 >= 7 ? 'text-[#27AE60]' : record.sgpaSem2 >= 5.5 ? 'text-[#F5A623]' : 'text-[#D94F4F]'}`}>{record.sgpaSem2}</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-500 font-bold">Attendance</span>
                                <span className={`font-black ${record.attendance >= 75 ? 'text-[#27AE60]' : 'text-[#D94F4F]'}`}>{record.attendance}%</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-500 font-bold">Backlogs</span>
                                <span className={`font-black ${record.backlogs === 0 ? 'text-[#27AE60]' : 'text-[#D94F4F]'}`}>{record.backlogs}</span>
                              </div>
                            </div>
                          ) : isCurrent && !record ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-500 font-bold">Current Att.</span>
                                <span className={`font-black ${selectedStudentObj.attendance >= 75 ? 'text-[#27AE60]' : 'text-[#D94F4F]'}`}>{selectedStudentObj.attendance}%</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-500 font-bold">Avg Marks</span>
                                <span className={`font-black ${selectedStudentObj.marks >= 40 ? 'text-[#27AE60]' : 'text-[#D94F4F]'}`}>{selectedStudentObj.marks}%</span>
                              </div>
                              <p className="text-[9px] text-[#000099] font-extrabold uppercase tracking-wide mt-1">Semester in session</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-[10px] text-slate-400 font-bold">Mentor Assignment</p>
                              <p className="text-[10px] text-slate-600 font-extrabold">Prof. Ramesh Nair</p>
                              <p className="text-[9px] text-slate-400 font-medium">Awaiting semester commencement</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Predictive Analysis & Historical Trends */}
                {(() => {
                  const prediction = getStudentTrendAndPrediction(selectedStudentObj);
                  return (
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#000099]" />
                          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                            AI Predictive Analysis &amp; Historical Trends
                          </h2>
                        </div>
                        <span 
                          className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-black uppercase tracking-wider text-white"
                          style={{ backgroundColor: prediction.color }}
                        >
                          {prediction.probability}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {prediction.probabilityDesc}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Risk Drivers & Recommendations */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Risk Drivers &amp; Context</h4>
                            <ul className="space-y-1.5">
                              {prediction.factors.map((factor, idx) => (
                                <li key={idx} className="text-xs text-slate-600 font-semibold flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: prediction.color }} />
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-[#FF9A01]">Recommended Interventions</h4>
                            <ul className="space-y-1.5">
                              {prediction.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-xs text-slate-600 font-semibold flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#27AE60] mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Historical Sparkline Trends */}
                        <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#E2E0D8] pt-4 md:pt-0 md:pl-6">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Historical Sparkline Trends (Last 4 Cycles)</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {/* Attendance Sparkline */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-500 block">Attendance Trend</span>
                              <div className="flex gap-2.5 items-end justify-center h-16 bg-[#F8F8F6] border border-[#E2E0D8] rounded-[6px] p-2 relative">
                                {prediction.attendanceTrend.map((val, idx) => (
                                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                                    <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                      {val}%
                                    </div>
                                    <div 
                                      className="w-2.5 rounded-t-[2px] transition-all" 
                                      style={{ 
                                        height: `${val * 0.45}px`, 
                                        backgroundColor: val < 75 ? '#D94F4F' : '#27AE60'
                                      }} 
                                    />
                                    <span className="text-[8px] font-bold text-slate-400 mt-1">M{idx+1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Marks Sparkline */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-500 block">Marks Trend</span>
                              <div className="flex gap-2.5 items-end justify-center h-16 bg-[#F8F8F6] border border-[#E2E0D8] rounded-[6px] p-2 relative">
                                {prediction.marksTrend.map((val, idx) => (
                                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                                    <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                      {val}%
                                    </div>
                                    <div 
                                      className="w-2.5 rounded-t-[2px] transition-all" 
                                      style={{ 
                                        height: `${val * 0.45}px`, 
                                        backgroundColor: val < 40 ? '#D94F4F' : val < 60 ? '#F5A623' : '#27AE60'
                                      }} 
                                    />
                                    <span className="text-[8px] font-bold text-slate-400 mt-1">E{idx+1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                            💡 Hover columns to inspect precise data points across semesters.
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Interaction History Section */}
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-3">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Interaction Log History</h2>
                    <span className="bg-[#000099] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {selectedStudentObj.history.length} Logs
                    </span>
                  </div>

                  {selectedStudentObj.history.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-[#E2E0D8]">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-bold">No interactions logged yet during this cycle.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedStudentObj.history.map((log, index) => (
                        <div 
                          key={index} 
                          className="p-4 bg-[#F8F8F6] border border-[#E2E0D8] rounded-[10px] space-y-2 hover:border-[#000099]/30 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E0D8]/60 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {log.yearTag && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#000099]/10 text-[#000099]">{log.yearTag}</span>
                              )}
                              <span className="text-xs font-extrabold text-[#000099]">{log.type}</span>
                              <span className="text-[10px] text-slate-400 font-black uppercase">·</span>
                              <span className="text-xs font-bold text-slate-600">{log.date}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                              {log.faculty}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                            &quot;{log.notes}&quot;
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setFormStudentId(selectedStudentObj.id);
                        setActiveTab('log');
                      }}
                      className="px-6 py-2.5 bg-[#FF9A01] text-white font-extrabold text-xs tracking-wider uppercase rounded-[10px] hover:bg-[#FF9A01]/90 shadow transition"
                    >
                      + Log Interaction for {selectedStudentObj.name}
                    </button>
                  </div>
                </div>

              </div>
          </div>
        )}

        {/* SCREEN 4 — LOG INTERACTION */}
        {activeTab === 'log' && (
          <div className="space-y-6">
            {/* Warning State if Principal view */}
            {persona === 'principal' ? (
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center max-w-xl mx-auto space-y-4">
                <Lock className="w-10 h-10 text-[#D94F4F] mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Access Restricted</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  The Interaction logger is reserved for Faculty Mentors. You are currently logged in as the Principal.
                </p>
                <button 
                  onClick={() => handlePersonaChange('mentor')} 
                  className="px-4 py-2 bg-[#000099] text-white text-xs font-black uppercase tracking-wider rounded-[10px]"
                >
                  Switch to Mentor (Prof. Ramesh)
                </button>
              </div>
            ) : (
              <div className="max-w-[420px] mx-auto bg-white border border-[#E2E0D8] rounded-[10px] shadow-lg overflow-hidden">
                {/* Simulated Phone Frame Header */}
                <div className="bg-[#000099] px-6 py-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#FF9A01]" />
                    <span className="font-extrabold text-sm uppercase tracking-wider">Log Interaction</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                    NAAC Form
                  </span>
                </div>

                <form onSubmit={handleSaveInteraction} className="p-6 space-y-6">
                  
                  {/* Field 1: Student Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                      Select Student Roster
                    </label>
                    <select
                      value={formStudentId}
                      onChange={(e) => setFormStudentId(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-semibold border border-[#E2E0D8] rounded-[6px] bg-white focus:outline-none focus:border-[#000099] transition"
                      required
                    >
                      {mentees.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.year}) - {m.risk} Risk
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field 2: Meeting Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                      Meeting Type
                    </label>
                    <select
                      value={formMeetingType}
                      onChange={(e) => setFormMeetingType(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-semibold border border-[#E2E0D8] rounded-[6px] bg-white focus:outline-none focus:border-[#000099] transition"
                      required
                    >
                      {[
                        'Academic Counselling',
                        'Attendance Concern',
                        'Placement Guidance',
                        'Financial Welfare',
                        'Parent Interaction',
                        'General Welfare',
                        'Progress Review'
                      ].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 3: Notes Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                      Session Notes
                    </label>
                    <textarea
                      placeholder="Add detailed welfare notes (optional)..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full min-h-[100px] px-3 py-2 text-xs font-medium border border-[#E2E0D8] rounded-[6px] bg-white focus:outline-none focus:border-[#000099] transition placeholder:text-slate-400"
                    />
                  </div>

                  {/* Field 4: Follow-up Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                      Scheduled Follow-up Date <span className="text-[10px] text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      value={formFollowUpDate}
                      onChange={(e) => setFormFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-semibold border border-[#E2E0D8] rounded-[6px] bg-white focus:outline-none focus:border-[#000099] transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#FF9A01] text-white font-extrabold text-xs tracking-wider uppercase rounded-[6px] hover:bg-[#FF9A01]/90 shadow-md transition duration-300 transform active:scale-95"
                    >
                      Save Interaction
                    </button>
                    <p className="text-[9px] text-slate-400 text-center mt-2.5 font-bold uppercase tracking-wider">
                      ⚡ Record auto-compiles into NAAC Criterion 5.3 report
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SCREEN 5 — NAAC REPORT */}
        {activeTab === 'naac' && (
          <div className="space-y-6">
            {/* Warning State if Mentor view */}
            {persona === 'mentor' ? (
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center max-w-xl mx-auto space-y-4">
                <Lock className="w-10 h-10 text-[#D94F4F] mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Access Restricted</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  The NAAC Criterion 5 compliance analytics reports are reserved for administrators. You are currently logged in as Mentor (Prof. Ramesh).
                </p>
                <button 
                  onClick={() => handlePersonaChange('principal')} 
                  className="px-4 py-2 bg-[#000099] text-white text-xs font-black uppercase tracking-wider rounded-[10px]"
                >
                  Switch to Principal (Dr. Anita)
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Principal Sub-navigation Bar */}
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-2 flex flex-wrap gap-2 shadow-sm">
                  {[
                    { id: 'naac', label: 'NAAC Compliance', icon: FileText },
                    { id: 'departments', label: 'Department Analytics', icon: Users },
                    { id: 'courses', label: 'Course & Class Reports', icon: GraduationCap },
                    { id: 'roster', label: 'At-Risk Roster', icon: AlertTriangle }
                  ].map(subTab => {
                    const IconComp = subTab.icon;
                    const isSelected = principalReportTab === subTab.id;
                    return (
                      <button
                        key={subTab.id}
                        id={`principal-subtab-${subTab.id}`}
                        onClick={() => setPrincipalReportTab(subTab.id as any)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-[#000099] text-white shadow-md'
                            : 'text-slate-500 hover:bg-[#000099]/5 hover:text-[#000099]'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span>{subTab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* SUB TAB: NAAC COMPLIANCE (Original View) */}
                {principalReportTab === 'naac' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header */}
                    <div className="border-b border-[#E2E0D8] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-black text-slate-900">NAAC Criterion 5 — Student Mentoring Evidence</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                          Academic Year 2025-26 · Semester 1 · Executive compliance oversight
                        </p>
                      </div>
                      
                      {/* Action Button */}
                      <div>
                        <button
                          onClick={handleGenerateNaacReport}
                          disabled={isGeneratingNaac}
                          className="px-5 py-2.5 bg-[#FF9A01] text-white font-extrabold text-xs tracking-wider uppercase rounded-[10px] hover:bg-[#FF9A01]/90 shadow transition flex items-center gap-2 disabled:opacity-50"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{isGeneratingNaac ? 'Compiling Report...' : 'Generate NAAC Report'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar (Generates in 2 seconds) */}
                    {isGeneratingNaac && (
                      <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-[#000099] uppercase tracking-wider">Compiling PDF verification bundle...</span>
                          <span className="font-black">{naacProgress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full bg-[#27AE60] transition-all duration-200" 
                            style={{ width: `${naacProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stat Box Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Logs Recorded</h3>
                        <p className="text-3xl font-black text-[#000099]">{dynamicTotalInteractions}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Across active faculty roster</p>
                      </div>

                      <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mentees Covered</h3>
                        <p className="text-3xl font-black text-slate-900">
                          {dynamicStudentsCovered} <span className="text-lg text-slate-400 font-normal">/ 520</span>
                        </p>
                        <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">
                          Compliance target: {((dynamicStudentsCovered/520)*100).toFixed(0)}%
                        </p>
                      </div>

                      <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inactive Mentors</h3>
                        <p className="text-3xl font-black text-[#D94F4F]">3</p>
                        <p className="text-[10px] text-[#D94F4F] font-bold uppercase tracking-wider">Zero logs submitted this month</p>
                      </div>

                      <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">At-Risk Contacted</h3>
                        <p className="text-3xl font-black text-slate-900">
                          38 <span className="text-lg text-slate-400 font-normal">/ 44</span>
                        </p>
                        <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">
                          86% Contact Rate (Goal: 100%)
                        </p>
                      </div>

                    </div>

                    {/* AI Compliance Audit Readiness & Trend Analysis */}
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#000099]" />
                          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                            AI Compliance Audit Readiness &amp; Trend Analysis
                          </h2>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#27AE60] border border-emerald-200">
                          96.5% AI Success Probability
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Criteria Progress & Advisory */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">NAAC Criterion 5 Metrics Analysis</h4>
                          
                          <div className="space-y-3.5">
                            {/* Crit 5.1.1 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold text-slate-700">
                                <span>Criterion 5.1.1: Student Support Schemes</span>
                                <span className="font-extrabold text-[#27AE60]">98% Ready</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                                <div className="h-full bg-[#27AE60] rounded-full" style={{ width: '98%' }} />
                              </div>
                            </div>

                            {/* Crit 5.1.3 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold text-slate-700">
                                <span>Criterion 5.1.3: Capacity Development &amp; Skills Enhancement</span>
                                <span className="font-extrabold text-[#27AE60]">95% Ready</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                                <div className="h-full bg-[#27AE60] rounded-full" style={{ width: '95%' }} />
                              </div>
                            </div>

                            {/* Crit 5.2.2 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold text-slate-700">
                                <span>Criterion 5.2.2: Student Progression to Higher Education</span>
                                <span className="font-extrabold text-[#F5A623]">84% Ready</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                                <div className="h-full bg-[#F5A623] rounded-full" style={{ width: '84%' }} />
                              </div>
                            </div>
                          </div>

                          {/* Advisory Callout */}
                          <div className="bg-amber-50/50 border border-amber-200/40 rounded-lg p-3.5 flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-[#F5A623] flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-extrabold text-[#F5A623] uppercase text-[10px]">AI Compliance Advisory</p>
                              <p className="text-slate-600 font-medium leading-relaxed mt-1">
                                Missing mentoring logs in the Civil Engineering department for Criterion 5.1.1 (currently at 70% coverage) could lower the compliance rating score. Complete log verification before the NAAC submission window closes.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Historical Growth Chart */}
                        <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#E2E0D8] pt-4 md:pt-0 md:pl-6">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Historical Interaction Volume Growth</h4>
                          <p className="text-xs text-slate-500 font-medium">
                            Log trends showcase institutional consistency and compliance scaling over consecutive semesters.
                          </p>

                          <div className="h-36 bg-[#F8F8F6] border border-[#E2E0D8] rounded-[10px] p-4 flex flex-col justify-between">
                            <div className="flex items-end justify-around h-24 px-2">
                              {[
                                { sem: 'Odd \'24', logs: 420 },
                                { sem: 'Even \'25', logs: 580 },
                                { sem: 'Odd \'25', logs: 640 },
                                { sem: 'Odd \'26 (Current)', logs: 847 + extraInteractionsCount, highlight: true }
                              ].map((item, idx) => {
                                const maxVal = 950;
                                const pctHeight = (item.logs / maxVal) * 100;
                                return (
                                  <div key={idx} className="flex flex-col items-center gap-1 w-1/4 group relative">
                                    <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                      {item.logs} Logs
                                    </div>
                                    <div 
                                      className="w-6 rounded-t-[3px] transition-all hover:brightness-95" 
                                      style={{ 
                                        height: `${pctHeight * 0.7}px`, 
                                        backgroundColor: item.highlight ? '#000099' : '#E2E0D8'
                                      }} 
                                    />
                                    <span className={`text-[8px] font-extrabold text-center ${item.highlight ? 'text-[#000099]' : 'text-slate-400'}`}>
                                      {item.sem}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-center text-[9px] text-[#000099] font-bold uppercase border-t border-[#E2E0D8]/60 pt-2">
                              📈 Documented logs expanded by {(((847 + extraInteractionsCount - 420) / 420) * 100).toFixed(1)}% since Odd &apos;24
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Table */}
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-sm overflow-hidden">
                      <div className="bg-slate-50 border-b border-[#E2E0D8] px-6 py-4 flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                          Department-wise Interaction Summary
                        </h3>
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-black px-2 py-0.5 rounded-full uppercase">
                          4 Departments
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-wider border-b border-[#E2E0D8] text-[9px]">
                              <th className="px-6 py-3">Department</th>
                              <th className="px-6 py-3 text-center">Faculty Mentors</th>
                              <th className="px-6 py-3 text-center">Total Interactions</th>
                              <th className="px-6 py-3 text-center">Students Covered</th>
                              <th className="px-6 py-3 text-center">At-Risk Flagged</th>
                              <th className="px-6 py-3 text-center">At-Risk Contacted</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E0D8]">
                            {[
                              { dept: 'CSE', mentors: 18, logs: 312 + extraInteractionsCount, coverage: `${148 + (extraInteractionsCount > 0 ? 1 : 0)} / 180`, flagged: 18, contacted: 16 },
                              { dept: 'ECE', mentors: 14, logs: 241, coverage: '112 / 140', flagged: 12, contacted: 11 },
                              { dept: 'MBA', mentors: 10, logs: 178, coverage: '89 / 110', flagged: 8, contacted: 7 },
                              { dept: 'Civil', mentors: 8, logs: 116, coverage: '63 / 90', flagged: 6, contacted: 4 }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60 font-semibold text-slate-700">
                                <td className="px-6 py-4 font-extrabold text-[#000099]">{row.dept}</td>
                                <td className="px-6 py-4 text-center">{row.mentors}</td>
                                <td className="px-6 py-4 text-center font-bold">{row.logs}</td>
                                <td className="px-6 py-4 text-center text-slate-500">{row.coverage}</td>
                                <td className="px-6 py-4 text-center text-[#F5A623]">{row.flagged}</td>
                                <td className="px-6 py-4 text-center text-[#27AE60]">{row.contacted}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: DEPARTMENT ANALYTICS */}
                {principalReportTab === 'departments' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header & Department Selector */}
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900">Department Performance Analytics</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                          Drill down into mentorship and compliance stats by academic department
                        </p>
                      </div>
                      
                      {/* Department Select Buttons */}
                      <div className="flex bg-[#F8F8F6] p-1 rounded-lg border border-[#E2E0D8] self-start md:self-auto">
                        {['CSE', 'ECE', 'MBA', 'Civil'].map(dept => (
                          <button
                            key={dept}
                            id={`dept-select-${dept}`}
                            onClick={() => setSelectedDept(dept)}
                            className={`px-4 py-2 rounded-md text-xs font-black uppercase transition-all ${
                              selectedDept === dept
                                ? 'bg-[#000099] text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Department Level KPIs */}
                    {(() => {
                      const deptMentees = mentees.filter(m => m.year.startsWith(selectedDept));
                      const totalCount = deptMentees.length;
                      const redCount = deptMentees.filter(m => m.risk === 'RED').length;
                      const amberCount = deptMentees.filter(m => m.risk === 'AMBER').length;
                      const greenCount = deptMentees.filter(m => m.risk === 'GREEN').length;
                      const avgAttd = totalCount > 0 ? (deptMentees.reduce((sum, m) => sum + m.attendance, 0) / totalCount).toFixed(1) : '0';
                      const avgMarks = totalCount > 0 ? (deptMentees.reduce((sum, m) => sum + m.marks, 0) / totalCount).toFixed(1) : '0';
                      
                      // Mocking total mentors & logs for department reports to scale up realistically
                      const deptMeta = {
                        CSE: { mentors: 18, logs: 312 + extraInteractionsCount, coverage: 92, inactive: 1 },
                        ECE: { mentors: 14, logs: 241, coverage: 80, inactive: 1 },
                        MBA: { mentors: 10, logs: 178, coverage: 81, inactive: 1 },
                        Civil: { mentors: 8, logs: 116, coverage: 70, inactive: 1 }
                      }[selectedDept as 'CSE'|'ECE'|'MBA'|'Civil'] || { mentors: 0, logs: 0, coverage: 0, inactive: 0 };

                      // Pie Chart data
                      const riskChartData = [
                        { name: 'Red Risk', value: redCount, color: '#D94F4F' },
                        { name: 'Amber Risk', value: amberCount, color: '#F5A623' },
                        { name: 'Green Risk', value: greenCount, color: '#27AE60' }
                      ].filter(d => d.value > 0);

                      // Department mentors mock data
                      const departmentMentors = {
                        CSE: [
                          { name: 'Prof. Ramesh Nair', role: 'Yr 2 Coordinator', mentees: 8, logs: 42 + extraInteractionsCount, lastActive: 'Today', status: 'ACTIVE' },
                          { name: 'Prof. Sunita Rao', role: 'Yr 1 Advisor', mentees: 10, logs: 35, lastActive: '2 days ago', status: 'ACTIVE' },
                          { name: 'Prof. Amit Verma', role: 'Yr 2 Advisor', mentees: 8, logs: 0, lastActive: '28 days ago', status: 'INACTIVE' }
                        ],
                        ECE: [
                          { name: 'Prof. Rajesh Kumar', role: 'Yr 2 Coordinator', mentees: 12, logs: 28, lastActive: '4 days ago', status: 'ACTIVE' },
                          { name: 'Prof. Meera Deshmukh', role: 'Yr 1 Coordinator', mentees: 10, logs: 24, lastActive: '1 day ago', status: 'ACTIVE' },
                          { name: 'Prof. K. R. Sharma', role: 'Yr 2 Advisor', mentees: 8, logs: 0, lastActive: '45 days ago', status: 'INACTIVE' }
                        ],
                        MBA: [
                          { name: 'Dr. Vikram Seth', role: 'Yr 2 Coordinator', mentees: 15, logs: 38, lastActive: '3 days ago', status: 'ACTIVE' },
                          { name: 'Prof. Ritu Anand', role: 'Yr 1 Coordinator', mentees: 12, logs: 32, lastActive: '2 days ago', status: 'ACTIVE' },
                          { name: 'Dr. H. S. Prasad', role: 'Yr 1 Advisor', mentees: 10, logs: 0, lastActive: '60 days ago', status: 'INACTIVE' }
                        ],
                        Civil: [
                          { name: 'Prof. Suresh Hegde', role: 'Yr 2 Coordinator', mentees: 14, logs: 22, lastActive: '5 days ago', status: 'ACTIVE' },
                          { name: 'Prof. Anil Joshi', role: 'Yr 1 Coordinator', mentees: 12, logs: 18, lastActive: '2 days ago', status: 'ACTIVE' },
                          { name: 'Prof. Ravi Shanker', role: 'Yr 2 Advisor', mentees: 8, logs: 0, lastActive: '35 days ago', status: 'INACTIVE' }
                        ]
                      }[selectedDept as 'CSE'|'ECE'|'MBA'|'Civil'] || [];

                      return (
                        <div className="space-y-6">
                          {/* KPI Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Mentors</h3>
                              <p className="text-3xl font-black text-[#000099]">{deptMeta.mentors}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active in selected cycle</p>
                            </div>

                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mentoring Logs</h3>
                              <p className="text-3xl font-black text-slate-900">{deptMeta.logs}</p>
                              <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">Compliance Target Met</p>
                            </div>

                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coverage Rate</h3>
                              <p className="text-3xl font-black text-[#27AE60]">{deptMeta.coverage}%</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target threshold: 75%</p>
                            </div>

                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inactive Mentors</h3>
                              <p className="text-3xl font-black text-[#D94F4F]">{deptMeta.inactive}</p>
                              <p className="text-[10px] text-[#D94F4F] font-bold uppercase tracking-wider">Needs immediate reminder</p>
                            </div>
                          </div>

                          {/* Charts and Mentorship Status */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Left: Pie Chart showing risk distribution */}
                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-4">
                              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-[#E2E0D8] pb-3">
                                Roster Risk Breakdown
                              </h3>
                              
                              {riskChartData.length > 0 ? (
                                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-48">
                                  <div className="w-40 h-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={riskChartData}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={45}
                                          outerRadius={70}
                                          paddingAngle={3}
                                          dataKey="value"
                                        >
                                          {riskChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                        </Pie>
                                        <Tooltip />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    {riskChartData.map((d, i) => (
                                      <div key={i} className="flex items-center gap-2 font-semibold">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-slate-600">{d.name}:</span>
                                        <span className="font-black text-slate-900">{d.value} ({((d.value/totalCount)*100).toFixed(0)}%)</span>
                                      </div>
                                    ))}
                                    <p className="text-[10px] text-slate-400 font-bold uppercase border-t border-slate-100 pt-1.5 mt-2">
                                      Total Department Roster: {totalCount} Students
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-48 flex items-center justify-center text-slate-400 font-semibold text-xs border border-dashed border-[#E2E0D8] rounded-lg">
                                  No student records found for this department.
                                </div>
                              )}
                            </div>

                            {/* Right: Academic Context & Inactive Alert Callout */}
                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm flex flex-col justify-between gap-4">
                              <div>
                                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-[#E2E0D8] pb-3 mb-4">
                                  Department Performance Insights
                                </h3>
                                <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                                  <div className="flex justify-between items-center">
                                    <span>Average Class Attendance:</span>
                                    <span className={`font-black ${parseFloat(avgAttd) < 75 ? 'text-[#D94F4F]' : 'text-slate-900'}`}>{avgAttd}%</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Average Internal Marks:</span>
                                    <span className={`font-black ${parseFloat(avgMarks) < 50 ? 'text-[#F5A623]' : 'text-slate-900'}`}>{avgMarks}%</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>At-Risk Resolution Progress:</span>
                                    <span className="font-black text-emerald-600">
                                      {selectedDept === 'CSE' ? '88% Resolved' : selectedDept === 'ECE' ? '82% Resolved' : '75% Resolved'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4.5 h-4.5 text-[#FF9A01] flex-shrink-0" />
                                  <span className="text-xs font-black text-[#FF9A01] uppercase tracking-wide">
                                    Inactive Advisor Warning Alert
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                  System detected 1 mentor in {selectedDept} department has not logged any mentoring interaction in the last 15 days. Missing records will affect NAAC compliance scoring.
                                </p>
                                <button
                                  id={`btn-remind-mentors-${selectedDept}`}
                                  onClick={() => showToast(`Sent compliance reminders to inactive mentors in ${selectedDept} department.`, 'success')}
                                  className="px-3.5 py-2 bg-[#FF9A01] text-white text-[10px] font-black uppercase tracking-wider rounded-[6px] hover:bg-[#FF9A01]/95 transition shadow-sm"
                                >
                                  Email Inactive Mentors
                                </button>
                              </div>
                            </div>

                          </div>

                          {/* Department Faculty Mentors Table */}
                          <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-[#E2E0D8] px-6 py-4 flex items-center justify-between">
                              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                                Mentor Log Compliance Tracker
                              </h3>
                              <span className="text-[10px] bg-slate-200 text-slate-600 font-black px-2 py-0.5 rounded-full uppercase">
                                {departmentMentors.length} Advisors Assigned
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-wider border-b border-[#E2E0D8] text-[9px]">
                                    <th className="px-6 py-3">Mentor Name</th>
                                    <th className="px-6 py-3">Role / Designation</th>
                                    <th className="px-6 py-3 text-center">Assigned Mentees</th>
                                    <th className="px-6 py-3 text-center">Interactions Logged</th>
                                    <th className="px-6 py-3 text-center">Last Activity Date</th>
                                    <th className="px-6 py-3 text-center">Compliance Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E0D8]">
                                  {departmentMentors.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/60 font-semibold text-slate-700">
                                      <td className="px-6 py-4 font-extrabold text-slate-950">{row.name}</td>
                                      <td className="px-6 py-4 text-slate-500">{row.role}</td>
                                      <td className="px-6 py-4 text-center">{row.mentees}</td>
                                      <td className="px-6 py-4 text-center font-bold">{row.logs}</td>
                                      <td className="px-6 py-4 text-center text-slate-500">{row.lastActive}</td>
                                      <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-[5px] text-[9px] font-black uppercase ${
                                          row.status === 'ACTIVE' 
                                            ? 'bg-green-50 text-[#27AE60]' 
                                            : 'bg-red-50 text-[#D94F4F] animate-pulse'
                                        }`}>
                                          {row.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* SUB TAB: COURSE & CLASS REPORTS */}
                {principalReportTab === 'courses' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header & Class Selector */}
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900">Course &amp; Class Reports</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                          Monitor attendance benchmarks and performance risk indicators by class cohorts
                        </p>
                      </div>
                      
                      {/* Class Selection Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Select Class Cohort:</span>
                        <select
                          value={selectedClass}
                          id="class-selector-dropdown"
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="px-3 py-2 text-xs font-black uppercase border border-[#E2E0D8] rounded-[10px] bg-white focus:outline-none focus:border-[#000099] transition shadow-sm"
                        >
                          {[
                            'CSE Yr 1', 'CSE Yr 2',
                            'ECE Yr 1', 'ECE Yr 2',
                            'MBA Yr 1', 'MBA Yr 2',
                            'Civil Yr 1', 'Civil Yr 2'
                          ].map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Class metrics and roster */}
                    {(() => {
                      const classMentees = mentees.filter(m => m.year === selectedClass);
                      const totalCount = classMentees.length;
                      
                      const avgAttd = totalCount > 0 ? Math.round(classMentees.reduce((sum, m) => sum + m.attendance, 0) / totalCount) : 0;
                      const avgMarks = totalCount > 0 ? Math.round(classMentees.reduce((sum, m) => sum + m.marks, 0) / totalCount) : 0;
                      const avgCgpa = totalCount > 0 ? (classMentees.reduce((sum, m) => sum + m.cgpa, 0) / totalCount).toFixed(1) : '0';
                      const backlogCount = classMentees.reduce((sum, m) => sum + m.backlogsCount, 0);

                      // Bar Chart Data for attendance vs marks
                      const chartData = classMentees.map(m => ({
                        name: m.name.split(' ')[0], // only first name for chart label space
                        Attendance: m.attendance,
                        Marks: m.marks
                      }));

                      return (
                        <div className="space-y-6">
                          {/* KPI row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Attendance</h3>
                              <p className="text-3xl font-black text-slate-900" style={{ color: avgAttd < 75 ? '#D94F4F' : '#000099' }}>{avgAttd}%</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">UGC Standard: 75% Min</p>
                            </div>

                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Marks</h3>
                              <p className="text-3xl font-black text-slate-900">{avgMarks}%</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pass Mark Threshold: 40%</p>
                            </div>

                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average CGPA</h3>
                              <p className="text-3xl font-black text-[#27AE60]">{avgCgpa}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Class Progression Track</p>
                            </div>

                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-2">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Backlogs</h3>
                              <p className="text-3xl font-black text-slate-900" style={{ color: backlogCount > 0 ? '#F5A623' : '#27AE60' }}>{backlogCount}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Across active cohort roster</p>
                            </div>
                          </div>

                          {/* Chart Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Left: Bar Chart showing attendance & marks distribution */}
                            <div className="lg:col-span-2 bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-4">
                              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-[#E2E0D8] pb-3">
                                Cohort Performance Distribution (Attendance vs. Internal Marks)
                              </h3>
                              
                              {chartData.length > 0 ? (
                                <div className="h-64 pt-2">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                      <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748B' }} />
                                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748B' }} />
                                      <Tooltip />
                                      <Legend wrapperStyle={{ fontSize: 11, fontWeight: 'bold' }} />
                                      <Bar dataKey="Attendance" fill="#000099" radius={[3, 3, 0, 0]} />
                                      <Bar dataKey="Marks" fill="#FF9A01" radius={[3, 3, 0, 0]} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              ) : (
                                <div className="h-64 flex items-center justify-center text-slate-400 font-semibold text-xs border border-dashed border-[#E2E0D8] rounded-lg">
                                  No student records found to generate visual charts.
                                </div>
                              )}
                            </div>

                            {/* Right: Quick Action Controls */}
                            <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm flex flex-col justify-between gap-4">
                              <div>
                                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-[#E2E0D8] pb-3 mb-4">
                                  Executive Action Center
                                </h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                                  Simulate admin interventions for this specific class cohort based on overall compliance status.
                                </p>
                              </div>

                              <div className="space-y-3.5">
                                <button
                                  id="btn-broadcast-parents"
                                  onClick={() => showToast(`Dispatched parental notifications for attendance drops in ${selectedClass}.`, 'success')}
                                  className="w-full py-3 bg-[#000099] text-white text-xs font-black uppercase tracking-wider rounded-[8px] hover:bg-[#000099]/90 transition shadow-sm active:scale-98"
                                >
                                  Broadcast Parental Warnings
                                </button>
                                
                                <button
                                  id="btn-schedule-remedial"
                                  onClick={() => showToast(`Created remedial classes directive for ${selectedClass} at-risk students.`, 'success')}
                                  className="w-full py-3 bg-[#FF9A01] text-white text-xs font-black uppercase tracking-wider rounded-[8px] hover:bg-[#FF9A01]/90 transition shadow-sm active:scale-98"
                                >
                                  Schedule Remedial Classes
                                </button>
                                
                                <div className="text-[10px] text-slate-400 font-bold uppercase text-center mt-2.5">
                                  ⚡ Interventions log in UGC compliance archive
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Class Roster Table */}
                          <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-[#E2E0D8] px-6 py-4 flex items-center justify-between">
                              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                                Class Student Roster
                              </h3>
                              <span className="text-[10px] bg-slate-200 text-slate-600 font-black px-2 py-0.5 rounded-full uppercase">
                                {totalCount} Students Enrolled
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-wider border-b border-[#E2E0D8] text-[9px]">
                                    <th className="px-6 py-3">Student Name</th>
                                    <th className="px-6 py-3 text-center">Risk Level</th>
                                    <th className="px-6 py-3 text-center">Attendance</th>
                                    <th className="px-6 py-3 text-center">Internal Marks</th>
                                    <th className="px-6 py-3 text-center">CGPA</th>
                                    <th className="px-6 py-3 text-center">Active Backlogs</th>
                                    <th className="px-6 py-3 text-center">Fee Status</th>
                                    <th className="px-6 py-3 text-center">Assigned Advisor</th>
                                    <th className="px-6 py-3 text-center">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E0D8]">
                                  {classMentees.map((row, idx) => {
                                    const badgeColor = 
                                      row.risk === 'RED' ? '#D94F4F' : 
                                      row.risk === 'AMBER' ? '#F5A623' : '#27AE60';
                                    const badgeBg = 
                                      row.risk === 'RED' ? '#FCEBEB' : 
                                      row.risk === 'AMBER' ? '#FFF6E6' : '#EBF7EE';
                                    
                                    const mentorName = row.history[0]?.faculty || {
                                      CSE: 'Prof. Ramesh Nair',
                                      ECE: 'Prof. Rajesh Kumar',
                                      MBA: 'Dr. Vikram Seth',
                                      Civil: 'Prof. Suresh Hegde'
                                    }[row.year.split(' ')[0]] || 'Prof. Ramesh Nair';

                                    return (
                                      <tr key={idx} className="hover:bg-slate-50/60 font-semibold text-slate-700">
                                        <td className="px-6 py-4 font-extrabold text-slate-950">{row.name}</td>
                                        <td className="px-6 py-4 text-center">
                                          <span 
                                            className="px-2 py-0.5 rounded-[5px] text-[9px] font-black uppercase tracking-wider"
                                            style={{ backgroundColor: badgeBg, color: badgeColor }}
                                          >
                                            {row.risk}
                                          </span>
                                        </td>
                                        <td className={`px-6 py-4 text-center ${row.attendance < 75 ? 'text-[#D94F4F] font-black' : ''}`}>{row.attendance}%</td>
                                        <td className={`px-6 py-4 text-center ${row.marks < 40 ? 'text-[#D94F4F] font-black' : ''}`}>{row.marks}%</td>
                                        <td className="px-6 py-4 text-center font-bold">{row.cgpa.toFixed(1)}</td>
                                        <td className={`px-6 py-4 text-center ${row.backlogsCount > 0 ? 'text-[#D94F4F] font-black' : ''}`}>{row.backlogsCount}</td>
                                        <td className={`px-6 py-4 text-center ${row.feeStatus === 'Overdue' ? 'text-[#D94F4F]' : 'text-[#27AE60]'}`}>
                                          {row.feeStatus === 'Overdue' ? `₹${row.feeAmount.toLocaleString('en-IN')}` : 'Cleared'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-center">{mentorName}</td>
                                        <td className="px-6 py-4 text-center">
                                          <button
                                            id={`btn-view-profile-course-${row.id}`}
                                            onClick={() => {
                                              setSelectedStudentId(row.id);
                                              setActiveTab('profile');
                                            }}
                                            className="text-[#000099] font-black uppercase text-[10px] hover:underline"
                                          >
                                            View Profile
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* SUB TAB: AT-RISK STUDENT ROSTER */}
                {principalReportTab === 'roster' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-6 shadow-sm space-y-2">
                      <h2 className="text-xl font-black text-slate-900">Institutional At-Risk Student Roster</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        A consolidated list of all RED and AMBER risk students across all departments
                      </p>
                    </div>

                    {(() => {
                      const atRiskMentees = mentees.filter(m => m.risk === 'RED' || m.risk === 'AMBER');
                      const totalCount = atRiskMentees.length;
                      
                      return (
                        <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-sm overflow-hidden">
                          <div className="bg-slate-50 border-b border-[#E2E0D8] px-6 py-4 flex items-center justify-between">
                            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                              Flagged Student Roster
                            </h3>
                            <span className="text-[10px] bg-[#D94F4F]/10 text-[#D94F4F] font-black px-2.5 py-0.5 rounded-full uppercase">
                              {totalCount} Flags Active
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-wider border-b border-[#E2E0D8] text-[9px]">
                                  <th className="px-6 py-3">Student Name</th>
                                  <th className="px-6 py-3">Dept</th>
                                  <th className="px-6 py-3">Class</th>
                                  <th className="px-6 py-3 text-center">Risk</th>
                                  <th className="px-6 py-3 text-center">Attendance</th>
                                  <th className="px-6 py-3 text-center">Internal Marks</th>
                                  <th className="px-6 py-3 text-center">Backlogs</th>
                                  <th className="px-6 py-3 text-center">Primary Risk Drivers</th>
                                  <th className="px-6 py-3 text-center">Assigned Advisor</th>
                                  <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E2E0D8]">
                                {atRiskMentees.map((row, idx) => {
                                  const badgeColor = 
                                    row.risk === 'RED' ? '#D94F4F' : '#F5A623';
                                  const badgeBg = 
                                    row.risk === 'RED' ? '#FCEBEB' : '#FFF6E6';
                                  
                                  const dept = row.year.split(' ')[0];

                                  const mentorName = row.history[0]?.faculty || {
                                    CSE: 'Prof. Ramesh Nair',
                                    ECE: 'Prof. Rajesh Kumar',
                                    MBA: 'Dr. Vikram Seth',
                                    Civil: 'Prof. Suresh Hegde'
                                  }[dept] || 'Prof. Ramesh Nair';

                                  // Determine main risk reasons
                                  const reasons = [];
                                  if (row.attendance < 75) reasons.push('Low Attd');
                                  if (row.marks < 40) reasons.push('Low Marks');
                                  if (row.backlogsCount > 0) reasons.push(`${row.backlogsCount} Backlogs`);
                                  if (row.feeStatus === 'Overdue') reasons.push('Fees Overdue');
                                  if (row.disciplinaryStatus !== 'No Issues') reasons.push('Disciplinary Alert');

                                  return (
                                    <tr key={idx} className="hover:bg-slate-50/60 font-semibold text-slate-700">
                                      <td className="px-6 py-4 font-extrabold text-slate-950">{row.name}</td>
                                      <td className="px-6 py-4 text-slate-500 font-extrabold">{dept}</td>
                                      <td className="px-6 py-4 text-slate-500">{row.year}</td>
                                      <td className="px-6 py-4 text-center">
                                        <span 
                                          className="px-2 py-0.5 rounded-[5px] text-[9px] font-black uppercase tracking-wider"
                                          style={{ backgroundColor: badgeBg, color: badgeColor }}
                                        >
                                          {row.risk}
                                        </span>
                                      </td>
                                      <td className={`px-6 py-4 text-center ${row.attendance < 75 ? 'text-[#D94F4F] font-black' : ''}`}>{row.attendance}%</td>
                                      <td className={`px-6 py-4 text-center ${row.marks < 40 ? 'text-[#D94F4F] font-black' : ''}`}>{row.marks}%</td>
                                      <td className={`px-6 py-4 text-center ${row.backlogsCount > 0 ? 'text-[#D94F4F] font-black' : ''}`}>{row.backlogsCount}</td>
                                      <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-1.5 flex-wrap">
                                          {reasons.map((r, i) => (
                                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-extrabold uppercase border border-slate-200">
                                              {r}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-slate-500 text-center">{mentorName}</td>
                                      <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                          <button
                                            id={`btn-view-profile-roster-${row.id}`}
                                            onClick={() => {
                                              setSelectedStudentId(row.id);
                                              setActiveTab('profile');
                                            }}
                                            className="text-[#000099] font-black uppercase text-[10px] hover:underline"
                                          >
                                            Profile
                                          </button>
                                          <span className="text-slate-300">|</span>
                                          <button
                                            id={`btn-alert-roster-${row.id}`}
                                            onClick={() => showToast(`Sent parental alert and advisor warning for ${row.name}.`, 'success')}
                                            className="text-[#FF9A01] font-black uppercase text-[10px] hover:underline"
                                          >
                                            Alert
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* SCREEN 6 — CHAT PORTAL */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {/* Warning State if Principal view */}
            {persona === 'principal' ? (
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center max-w-xl mx-auto space-y-4">
                <Lock className="w-10 h-10 text-[#D94F4F] mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Access Restricted</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  The Chat portal dashboard is reserved for Faculty Mentors. You are currently logged in as the Principal.
                </p>
                <button 
                  onClick={() => handlePersonaChange('mentor')} 
                  className="px-4 py-2 bg-[#000099] text-white text-xs font-black uppercase tracking-wider rounded-[10px]"
                >
                  Switch to Mentor (Prof. Ramesh)
                </button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-6">
                
                {/* Left Side: Group Card */}
                <div className="w-full md:w-80 flex-shrink-0">
                  <div className="bg-white border border-[#E2E0D8] rounded-[10px] p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Mentor Groups</h3>
                    <div className="border border-[#000099]/20 bg-[#000099]/5 rounded-lg p-4 space-y-2.5">
                      <div className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-[#000099] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black text-[#000099]">Mentor: Prof. Ramesh Nair</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Batch 2024 · CSE Year 2</p>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-600 font-semibold space-y-1">
                        <p>👤 Members: 1 Admin, 22 Mentees, 1 HOD Observer</p>
                        <p className="truncate text-slate-400 italic">
                          Last message: &quot;{chatMessages[chatMessages.length - 1]?.text}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Chat Area */}
                <div className="flex-1 bg-white border border-[#E2E0D8] rounded-[10px] shadow-sm flex flex-col h-[520px] overflow-hidden">
                  
                  {/* Top Advisory Note */}
                  <div className="bg-[#FFF6E6] border-b border-[#E2E0D8] px-4 py-2.5 flex items-center justify-between text-[11px] font-semibold text-[#FF9A01]">
                    <div className="flex items-center gap-1.5">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      <span>Chat messages are communication records. Log an Interaction to create NAAC evidence.</span>
                    </div>
                    <button
                      onClick={() => {
                        setFormStudentId('arjun-mehta');
                        setActiveTab('log');
                      }}
                      className="px-2 py-1 bg-white text-xs font-black rounded border border-[#FF9A01]/40 uppercase tracking-wider hover:bg-slate-50 transition"
                    >
                      Log for Arjun
                    </button>
                  </div>

                  {/* Messages Thread */}
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/50">
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index}
                        className={`flex flex-col max-w-[80%] ${
                          msg.isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-1">
                          <span>{msg.sender}</span>
                          <span>·</span>
                          <span>{msg.time}</span>
                        </div>
                        <div 
                          className={`px-4 py-2.5 rounded-[10px] text-xs font-semibold leading-relaxed ${
                            msg.isAdmin 
                              ? 'bg-[#000099] text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 border border-[#E2E0D8] rounded-tl-none shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input bar */}
                  <form onSubmit={handleSendChatMessage} className="border-t border-[#E2E0D8] p-4 flex gap-3 bg-white">
                    <input
                      type="text"
                      placeholder="Type a message to your mentor group..."
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      className="flex-1 px-4 py-2 text-xs font-medium border border-[#E2E0D8] rounded-[10px] bg-slate-50 focus:outline-none focus:border-[#000099] transition focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#000099] text-white rounded-[10px] flex items-center justify-center hover:bg-[#000099]/90 transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer / Demo Instructions overlay */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">CMR University Sales Pitch Sandbox</span>
            <span className="text-slate-600">|</span>
            <span>Prototype ready for Monday Demo</span>
          </div>
          <div className="flex items-center gap-4 font-bold uppercase tracking-wider text-[10px]">
            <span>Persona switcher unlocks role-restricted flows</span>
            <span className="text-slate-700">•</span>
            <span>Data synced dynamically to NAAC stats</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
